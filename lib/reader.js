"use strict";

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var utils = require('./utils');
var CONSTANTS = require('./constants');
var PCKG = require('../package.json');

// argument parser
var argumentParser = yargs
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


/****/

function _isStringOrThrow (filePath) {
    if (!_.isString(filePath)) {
        throw new TypeError('[filePath] must be a string');
    }
    return filePath;
}

function _resolvePathToFile (filePath) {
    return path.join(process.cwd(), filePath);
}

function _onError (reason, file) {
    var READER_ERROR = `Impossible to read file at '${file}'\n`;
    return utils.formatRejection(READER_ERROR, reason);
}

/**
 * Read the given file path and returns its content in a promise.
 *
 * @param filePath {string} path of file to read and execute commands from
 * @return {promise} - content of the file
 */
function readFile (filePath) {
    var file;

    function readContent(_file_) {
        file = _file_;
        var content = fs.readFileSync(file, 'utf8');
        utils.log(`Commands from: '${file}'`);
        return content;
    }

    try {
        return _.flow([
                _isStringOrThrow,
                _resolvePathToFile,
                readContent
            ])(filePath);
    } catch (error) {
        throw _onError(error, file);
    }
}

/**
 * Read the given arguments and returns its content in a promise.
 *
 * @param args {string} arguments to read and execute commands from
 * @return {promise} - content of the file
 */
function readArguments (args) {
    return argumentParser.parse(args || process.argv);
}

module.exports = {
    readFile,
    readArguments
};
