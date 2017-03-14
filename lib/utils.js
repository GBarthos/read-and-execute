"use strict";

var _ = require('lodash');

function formatMessage(message, options) {
    var domain, prefix, suffix;
    if (options) {
        domain = options.domain;
        prefix = options.prefix;
        suffix = options.suffix;
    }

    return `${domain ? domain + ': ' : ''}` +
        `${prefix || ''}` +
        `${message ? message + ' ' : ''}` +
        `${suffix || ''}` +
        '\n';
}

function log(message, options) {
    process.stdout.write(formatMessage(message, options));
}

function logErr(message, options) {
    process.stderr.write(formatMessage(message, options));
}

function formatRejection(errorMessage, rejection) {
    var error;
    if (_.isError(rejection)) {
        rejection.message = `${errorMessage}\n${rejection.message}`;
        error = rejection;
    } else if (_.isString(rejection)) {
        error = new Error(`${errorMessage}\n${rejection}`);
    } else {
        error = new Error(`${errorMessage}\n${String(rejection)}`);
    }
    return error;
}


/**
 * Returns a function to evalutate if the given argument is a string, or throw an error otherwise.
 * 
 * 
 * @param {String} message error message to throw
 * @param {Error} type error constructor to throw with
 * @returns {function}
 */
function isStringOrThrow(message, type) {
    var ErrorConstructor = _.isError(type) ? type : Error;

    return function (string) {
        if (!_.isString(string)) {
            throw new ErrorConstructor(message || 'argument must be a string');
        }
        return string;
    }
}

module.exports = {
    log: log,
    logErr: logErr,
    formatRejection,
    formatMessage,
    isStringOrThrow
};
