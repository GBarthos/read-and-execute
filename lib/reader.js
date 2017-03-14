"use strict";

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var argumentParser = require('./argument-parser');
var utils = require('./utils');


// *** Private functions **********************

function _resolvePathToFile(filePath) {
    return path.join(process.cwd(), filePath);
}

function _onError(reason, file) {
    var READER_ERROR = `Impossible to read file at '${file}'`;
    return utils.formatRejection(READER_ERROR, reason);
}

// *** Public functions ***********************

/**
 * Read the given file path and returns its content.
 *
 * @param {String} filePath path of file to read and execute commands from
 * @returns {String} content of the file
 */
function readFile(filePath) {
    var file;

    function readContent(_file_) {
        file = _file_;
        var content = fs.readFileSync(file, 'utf8');
        utils.log(`Commands from: '${file}'`);
        return content;
    }

    try {
        return _.flow([
            utils.isStringOrThrow('[filePath] must be a string', TypeError),
            _resolvePathToFile,
            readContent
        ])(filePath);
    } catch (error) {
        throw _onError(error, file);
    }
}

/**
 * Read the given arguments and returns the content of the indicated file.
 *
 * @param {String} args arguments to read and execute commands from
 * @returns {Object} 
 */
function readArguments(args) {
    return argumentParser.parse(args || process.argv);
}

module.exports = {
    readFile,
    readArguments
};
