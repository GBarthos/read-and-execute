"use strict";

var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var ps = require('child_process');
var Promise = require('yaku');

var utils = require('./lib/utils');
var reader = require('./lib/reader');
var parser = require('./lib/parser');
var runner = require('./lib/runner');
var CONSTANTS = require('./lib/constants');


if (require.main === module) {
    // readFromArguments(process.argv).catch(function (reason) {
    //     utils.logErr(reason);
    // });

    // try {
        readFromArguments(process.argv)
    // } catch (error) {
    //     utils.logErr(error);
    // }
}

// ********

function readNdCommandFromFile(filePath, options) {
    return _.flow([
            reader.readFile,
            parser.parseNdCommand,
            function (commands) {
                return runner(commands, options);
            }
        ])(filePath);
}

function readNdJsonFromFile(filePath, options) {
    return _.flow([
            reader.readFile,
            parser.parseNdJson,
            function (commands) {
                return runner(commands, options);
            }
        ])(filePath);
}

function readJsonFromFile(filePath, options) {
    return _.flow([
            reader.readFile,
            parser.parseJson,
            function (commands) {
                return runner(commands, options);
            }
        ])(filePath);
}

function readFromArguments(args, options) {
    function mapHandler(params) {
        var handler;
        switch (params.format) {
            case CONSTANTS.FORMAT_TYPE.NDJSON:
                handler = parser.parseNdJson;
                break;

            case CONSTANTS.FORMAT_TYPE.JSON:
                handler = parser.parseJson;
                break;

            case CONSTANTS.FORMAT_TYPE.NDCOMMAND:
                handler = parser.parseNdCommand;
                break;

            default:
                throw new Error(`'${params.format}' is not a supported formating`);
        }

        var content = reader.readFile(params.file);
        return handler(content);
    }

    return _.flow([
            reader.readArguments,
            mapHandler,
            function (commands) {
                return runner(commands, options);
            }
        ])(args);
}

// ********

function defaultExport (filePath) {
    return readNdCommandsFromFile(filePath);
}

defaultExport.fromNdCommandFile = readNdCommandFromFile;
defaultExport.fromNdJsonFile = readNdJsonFromFile;
defaultExport.fromJsonFile = readJsonFromFile;
defaultExport.fromArguments = readFromArguments;

// ********

module.exports = defaultExport;
