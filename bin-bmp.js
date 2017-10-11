#!/usr/bin/env node

const version = "1.1.0";
const argv = require('minimist')(process.argv.slice(2));
const path = require("path");
const fs = require("fs");

showHelp = function () {
    console.log(fs.readFileSync(path.resolve(__dirname, 'docs/bin2bmp-help'), {encoding: 'utf8'}));
}

if (typeof argv._[0] == "undefined") {
    console.error("[ERROR] No command specified");
    showHelp();
    process.exit(1);
}

switch (argv._[0]) {
    case "write":
        require("./lib/bin-bmp/write")(
            argv._[1],
            argv.bare || false,
            argv.stdout || false
        );
        break;
    case "read":
        require("./lib/bin-bmp/read")(
            argv._[1],
            argv.stdout || false
        );
        break;
    case "help":
        showHelp();
        break;
    case "version":
        console.log(version);
        break;
    default:
        console.error("ERROR: Invalid command");
        showHelp();
        process.exit(1);
}
