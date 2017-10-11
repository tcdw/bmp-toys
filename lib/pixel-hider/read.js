module.exports = function (bmpName, stdout) {
	const fs = require("fs");
	const path = require("path");
	if (typeof bmpName == 'undefined') {
        console.error("[ERROR] Missing arguments");
        console.error(fs.readFileSync(path.resolve(__dirname, '../HELP'), {encoding: 'utf8'}));
        process.exit(1);
    }
    
    const bmp = require("bmp-js");
    const identify = "STAR!";
    
    var bmpBuffer = fs.readFileSync(path.resolve(process.cwd(), bmpName));
    var dataBuffer = [];
    var bmpData = bmp.decode(bmpBuffer);
    var space = bmpData.data.length * 0.09375;
    var inc = [0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01];
    var i = identify.length;
    
    readByte = function (l) {
    	var res = 0;
        for (j = 0; j < 8; j++) {
            var len = l * 8 + j;
            var reaLen = len + Math.floor(len / 3);
            res += (bmpData.data[reaLen] % 2) * inc[j];
        }
        return res;
    }
    
    tmp = [];
    for (k = 0; k < identify.length; k++) {
        tmp[k] = readByte(k);
    }
    if (Buffer.from(tmp).toString() != identify) {
        console.error("[ERROR] No header data found");
        console.error("        Probably no data or image is damaged");
        process.exit(1);
    }
    
    while (i < space) {
        if (readByte(i) == 255 && readByte(i + 1) == 255) {
            dataBuffer.push(255);
            i += 2;
        } else if (readByte(i) == 255 && readByte(i + 1) == 0) {
            console.error('[INFO] Handled a end flag 0x00FF at ' + i);
            break;
        } else {
            dataBuffer.push(readByte(i));
            i += 1;
        }
    }
    if (stdout) {
        process.stdout.write(Buffer.from(dataBuffer));
    } else {
        d = 0;
        while (fs.existsSync('out' + d + '.bin')) {
            d += 1;
        }
        out = 'out' + d + '.bin';
        console.error('[INFO] Saving output to ' + out);
        fs.writeFileSync(out, Buffer.from(dataBuffer));
    }
}