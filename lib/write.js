module.exports = function (imgName, fileName, bare, stdout) {
	const fs = require("fs");
    const path = require("path");
    if (typeof imgName == 'undefined' || typeof fileName == 'undefined') {
        console.error("[ERROR] Missing arguments");
        console.error(fs.readFileSync(path.resolve(__dirname, '../HELP'), {encoding: 'utf8'}));
        process.exit(1);
    }
    
    const bmp = require("bmp-js");
    const identify = Buffer.from("STAR!");
    
    var bmpBuffer = fs.readFileSync(path.resolve(process.cwd(), imgName));
    var dataBuffer = fs.readFileSync(path.resolve(process.cwd(), fileName));
    var bmpData = bmp.decode(bmpBuffer);
    var freeSpace = bmpData.data.length * 0.09375;
    var bufferLen = dataBuffer.length + identify.length;
    var i = 0;    // data buffer pos
    var j = 0;    // real pos
    
    console.error("[INFO] " + freeSpace + " bytes free");
    console.error("[INFO] " + bufferLen + "+ bytes will be used");
    
    bWrite = function (len, val) {
        var reaLen = len + Math.floor(len / 3);
        if (bare) {
            bmpData.data.writeUInt8(val * 255, reaLen);
        } else {
            bmpData.data.writeUInt8(Math.floor(bmpData.data[reaLen] / 2) * 2 + val, reaLen);
        }
    }
    
    fetch = function (len) {
        if (len < identify.length) {
            return identify[len];
        } else {
            return dataBuffer[len - identify.length];
        }
    }

    while (i < bufferLen) {
        if (fetch(i) == 255) {
            for (k = 0; k < 16; k++) {
                bWrite(j * 8 + k, 1);
            }
            i += 1;
            j += 2;
        } else {
            var ln = fetch(i).toString(2);
            while (ln.length < 8) {
                ln = '0' + ln;
            }
            for (k = 0; k < 8; k++) {
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
    for (k = 0; k < 8; k++) {
        bWrite(j * 8 + k, 1);
    }
    for (k = 0; k < 8; k++) {
        bWrite((j + 1) * 8 + k, 0);
    }
    if (stdout) {
        process.stdout.write(Buffer.from(bmpData));
    } else {
        d = 0;
        while (fs.existsSync('out' + d + '.bmp')) {
            d += 1;
        }
        out = 'out' + d + '.bmp';
        console.error('[INFO] Saving output to ' + out);
        fs.writeFileSync(out, bmp.encode(bmpData).data);
    }
}
