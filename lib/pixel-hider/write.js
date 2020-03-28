const fs = require('fs');
const path = require('path');
const bmp = require('bmp-js');

const identify = Buffer.from('STAR!');

function write(imgName, fileName, bare, stdout) {
    if (typeof imgName === 'undefined' || typeof fileName === 'undefined') {
        console.error('[ERROR] Missing arguments');
        console.error(fs.readFileSync(path.resolve(__dirname, '../../docs/pixel-hider-help'), { encoding: 'utf8' }));
        process.exit(1);
    }

    const bmpBuffer = fs.readFileSync(path.resolve(process.cwd(), imgName));
    const dataBuffer = fs.readFileSync(path.resolve(process.cwd(), fileName));
    const bmpData = bmp.decode(bmpBuffer);
    const freeSpace = bmpData.data.length * 0.09375;
    const bufferLen = dataBuffer.length + identify.length;
    let i = 0; // data buffer pos
    let j = 0; // real pos

    console.log(bmpData);
    console.error(`[INFO] ${freeSpace} bytes free`);
    console.error(`[INFO] ${bufferLen}+ bytes will be used`);

    function bWrite(len, val) {
        const reaLen = 1 + len + Math.floor(len / 3);
        if (bare) {
            bmpData.data.writeUInt8(val * 255, reaLen);
        } else {
            bmpData.data.writeUInt8(Math.floor(bmpData.data[reaLen] / 2) * 2 + val, reaLen);
        }
    }

    function fetch(len) {
        if (len < identify.length) {
            return identify[len];
        }
        return dataBuffer[len - identify.length];
    }

    while (i < bufferLen) {
        if (fetch(i) === 255) {
            for (let k = 0; k < 16; k += 1) {
                bWrite(j * 8 + k, 1);
            }
            i += 1;
            j += 2;
        } else {
            let ln = fetch(i).toString(2);
            while (ln.length < 8) {
                ln = `0${ln}`;
            }
            for (let k = 0; k < 8; k += 1) {
                bWrite(j * 8 + k, Number(ln.charAt(k)));
            }
            i += 1;
            j += 1;
        }
        if (j >= freeSpace - 2) {
            console.error('[ERROR] Out of bound!');
            process.exit(1);
        }
    }
    for (let k = 0; k < 8; k += 1) {
        bWrite(j * 8 + k, 1);
    }
    for (let k = 0; k < 8; k += 1) {
        bWrite((j + 1) * 8 + k, 0);
    }
    if (stdout) {
        process.stdout.write(Buffer.from(bmpData));
    } else {
        let d = 0;
        while (fs.existsSync(`out${d}.bmp`)) {
            d += 1;
        }
        const out = `out${d}.bmp`;
        console.error(`[INFO] Saving output to ${out}`);
        fs.writeFileSync(out, bmp.encode(bmpData).data);
    }
}

module.exports = write;
