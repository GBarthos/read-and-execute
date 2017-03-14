"use strict";

var PCKG = require('../package.json');
var CONSTANTS = require('./constants');

module.exports = require('yargs')
    .usage('Usage: $0 [options]')
    .example(`$0 -f record.json -x ${CONSTANTS.FORMAT_TYPE.JSON}`, 'read and execute the commands from file "record.json".')
    .example(`$0 -f record.registry`, 'read and execute the new-line delimited commands from file "record.registry".')
    .option('file', {
        alias: 'f',
        demandOption: true,
        describe: 'file path to read from',
        requiresArg: true,
        nargs: 1,
        type: 'string'
    })
    .option('format', {
        alias: 'x',
        describe: 'format of the content',
        choices: CONSTANTS.FORMATS,
        requiresArg: true,
        nargs: 1,
        type: 'string'
    })
    .nargs('x', 1)
    .default('format', CONSTANTS.FORMAT_TYPE.NDCOMMAND, '(new-line delimited commands)')
    .version(function () {
        return `v${PCKG.version}`;
    })
    .alias('version', 'v')
    .help('help')
    .alias('help', 'h')
    .epilogue(
        `Author : ${PCKG.author}\n` +
        `Github : ${PCKG.homepage}\n` +
        `License: ${PCKG.license}\n` +
        `Version: v${PCKG.version}`
    );
