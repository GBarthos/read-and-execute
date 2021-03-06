"use strict";

var _ = require('lodash');
var utils = require('./utils');


// *** Private methods ************* //

function _processNewLineDelimitedContent (str) {
    return str
        .replace('\r', '')
        .split('\n')
        .map(function (val) { return val.trim() })
        .filter(function (val) { return val.length > 0 });
}

function _extractCommandList (obj) {
    if (!_.has(obj, 'commands')) {
        return [];
    }

    var cmds = _.get(obj, 'commands');
    return _.map(cmds, _extractCommand);
}

function _extractCommand (value) {
    var newValue;
    if (_.isObject(value)) {
        newValue = _.isString(value.command) ? value.command : null;
    } else if (_.isString(value)) {
        newValue = value;
    }
    return newValue.trim().length > 0 ? newValue.trim() : null;
}

function _onError (reason) {
    var PARSE_ERROR = `Impossible to parse content\n`;
    return utils.formatRejection(PARSE_ERROR, reason);
}


// *** Public methods ************** //

/**
 * Parse the given content and returns all commands written inside as an array.
 * Returns an array of strings representing commands.
 *
 * @description Example of accecpted content as new-line delimited commands:
 * ```
 * npm -v
 * echo $(uname)
 * whoami
 * ```
 *
 * @param {String} content list of new-line delimited commands
 * @returns {Array<String>} list of commands
 */
function parseNdCommand (content) {
    try {
        return _.flow([
            utils.isStringOrThrow('[content] must be a string', TypeError),
            _processNewLineDelimitedContent
        ])(content);
    } catch (error) {
        throw _onError(error);
    }
}

/**
 * Parse the given content and returns all commands written inside as an array.
 * Returns an array of strings representing commands.
 *
 * @description Example of accepted content as new-line delimited JSON:
 * ```
 * { "command": "echo a" }
 * { "command": "echo b" }
 * { "command": "echo v" }
 * ```
 *
 * @param {String} content list of new-line delimited JSON
 * @returns {Array<String>} list of commands
 */
function parseNdJson (content) {
    try {
        return _.flow([
                utils.isStringOrThrow('[content] must be a string', TypeError),
                _processNewLineDelimitedContent
            ])(content)
            .map(JSON.parse)
            .map(_extractCommand)
            .filter(function (val) { return !!val });
    } catch (error) {
        throw _onError(error);
    }
}

/**
 * Parse the given content and returns all commands written inside as an array.
 * Returns an array of strings representing commands.
 *
 * @description Examples of JSON accepted as content to parse:
 * ```
 * // An object literal 'commands'
 * {
 *    "commands": {
 *      "commandA": "echo a",             // a string
 *      "commandB": { "command": "echo b" } // an object with a property 'command'
 *    }
 * }
 * // or an array 'commands'
 * {
 *    "commands": [
 *      { "command": "echo c" },           // an object with a property 'command'
 *      "echo d"                         // a string
 *    ]
 * }
 * ```
 *
 * @param {String} content list of new-line delimited JSON
 * @returns {Array<String>} list of commands
 */
function parseJson (content) {
    try {
        return _.flow([
                utils.isStringOrThrow('[content] must be a string', TypeError),
                JSON.parse,
                _extractCommandList
            ])(content)
            .filter(function (val) { return !!val });
    } catch (error) {
        throw _onError(error);
    }
}

module.exports = {
    parseNdCommand,
    parseNdJson,
    parseJson
};
