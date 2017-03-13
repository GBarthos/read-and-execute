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

function log (message, options) {
    process.stdout.write(formatMessage(message, options));
}

function logErr (message, options) {
    process.stderr.write(formatMessage(message, options));
}

function formatRejection (errorMessage, rejection) {
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

module.exports = {
    log: log,
    logErr: logErr,
    formatRejection,
    formatMessage
};
