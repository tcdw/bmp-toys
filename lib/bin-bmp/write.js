const fs = require('fs');
const path = require('path');
const bmp = require('bmp-js');

function write(fileName, width, height, stdout) {
    if (typeof width !== 'number' || typeof height !== 'number' || typeof fileName === 'undefined') {
        console.error('[ERROR] Missing arguments');
        console.error(fs.readFileSync(path.resolve(__dirname, '../../docs/bmp-bin-help'), { encoding: 'utf8' }));
        process.exit(1);
    }

    const dataBuffer = fs.readFileSync(path.resolve(process.cwd(), fileName));
    const freeSpace = width * height * 4;
    const bmpData = { data: new Array(freeSpace), width, height };
    bmpData.data.fill(Math.floor(Math.random() * 256));
    const bufferLen = dataBuffer.length;
    let i = 0; // data buffer pos
    let j = 0; // real pos

    console.error(`[INFO] ${freeSpace} bytes free`);
    console.error(`[INFO] ${bufferLen}+ bytes will be used`);

    function writeByte(l, val) {
        const lenOffset = Math.floor(l / 3);
        bmpData.data[lenOffset + l] = val;
    }

    while (i < bufferLen) {
        if (dataBuffer[i] === 255) {
            writeByte(j, 255);
            writeByte(j + 1, 255);
            j += 2;
        } else {
            writeByte(j, dataBuffer[i]);
            j += 1;
        }
        i += 1;
        if (j >= freeSpace - 2) {
            console.error('[ERROR] Out of bound! Try another image size!');
            process.exit(1);
        }
    }
    writeByte(j, 255);
    writeByte(j + 1, 0);
    if (stdout) {
        process.stdout.write(Buffer.from(bmp.encode(bmpData).data));
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
