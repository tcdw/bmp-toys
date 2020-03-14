const fs = require('fs');
const path = require('path');
const bmp = require('bmp-js');

function read(bmpName, stdout) {
    if (typeof bmpName === 'undefined') {
        console.error('[ERROR] Missing arguments');
        console.error(fs.readFileSync(path.resolve(__dirname, '../../docs/bmp-bin-help'), { encoding: 'utf8' }));
        process.exit(1);
    }
    const bmpBuffer = fs.readFileSync(path.resolve(process.cwd(), bmpName));
    const dataBuffer = [];
    const bmpData = bmp.decode(bmpBuffer);
    const space = bmpData.data.length * 0.75;
    let i = 0;
    console.log(space);
    function readByte(l) {
        const lenOffset = Math.floor(l / 3);
        return bmpData.data[lenOffset + l];
    }

    while (i < space) {
        // console.log(i);
        if (readByte(i) === 255 && readByte(i + 1) === 255) {
            dataBuffer.push(255);
            i += 2;
        } else if (readByte(i) === 255 && readByte(i + 1) === 0) {
            console.error(`[INFO] Handled a end flag 0x00FF at ${i}`);
            break;
        } else {
            dataBuffer.push(readByte(i));
            i += 1;
        }
    }
    if (stdout) {
        process.stdout.write(Buffer.from(dataBuffer));
    } else {
        let d = 0;
        while (fs.existsSync(`out${d}.bin`)) {
            d += 1;
        }
        const out = `out${d}.bin`;
        console.error(`[INFO] Saving output to ${out}`);
        fs.writeFileSync(out, Buffer.from(dataBuffer));
    }
}

module.exports = read;
