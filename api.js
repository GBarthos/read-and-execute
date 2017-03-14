"use strict";

var _ = require('lodash');
var reader = require('./lib/reader');
var parser = require('./lib/parser');
var runner = require('./lib/runner');
var CONSTANTS = require('./lib/constants');


function readNdCommandFromFile(filePath, options) {
    try {
        return _.flow([
            reader.readFile,
            parser.parseNdCommand,
            function (commands) {
                return runner(commands, options);
            }
        ])(filePath);
    } catch (error) {
        throw error;
    }
}

function readNdJsonFromFile(filePath, options) {
    try {
        return _.flow([
            reader.readFile,
            parser.parseNdJson,
            function (commands) {
                return runner(commands, options);
            }
        ])(filePath);
    } catch (error) {
        throw error;
    }
}

function readJsonFromFile(filePath, options) { 
    try {
        return _.flow([
            reader.readFile,
            parser.parseJson,
            function (commands) {
                return runner(commands, options);
            }
        ])(filePath);
    } catch (error) {
        throw error;
    }

}

function readFromArguments(args, options) {
    try {
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
    } catch (error) {
        throw error;
    }
    
}

// *** Exports API ****************************

function defaultExport (filePath, options) {
    return readNdCommandsFromFile(filePath, options);
}

defaultExport.fromNdCommandFile = readNdCommandFromFile;
defaultExport.fromNdJsonFile = readNdJsonFromFile;
defaultExport.fromJsonFile = readJsonFromFile;
defaultExport.fromArguments = readFromArguments;

// ********

module.exports = defaultExport;
