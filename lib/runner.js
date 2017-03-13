"use strict";

var _ = require('lodash');
var ps = require('child_process');
var Promise = require('yaku');

var utils = require('./utils');

/**
 * Execute a command as a child of the current process.
 * It returns the output of the command.
 *
 * @param cmd {string} command to execute in shell
 * @param options {object} (optional) options for method 'child_process.execSync'
 * @return {promise} - output of ps.execSync: {buffer|string}
 */
function runCommand (cmd, options) {
    try {
        if (!_.isString(cmd)) {
            throw new TypeError('[cmd] must be a string');
        }

        utils.log(`command: "${cmd}"`, { prefix: '\t' });

        return ps.execSync(cmd, options);
    } catch(reason) {
        var RUNNER_ERROR = `Failed to run command: '${cmd}'\n`;
        throw utils.formatRejection(RUNNER_ERROR, reason);
    };
}

/**
 */
function runner (commands, options) {
    if (!_.isArray(commands)) {
        throw new TypeError('[commands] must be an array');
    }

    if (_.isEmpty(commands)) {
        utils.log('[commands] is empty', { domain: 'runner' });
        return Promise.resolve();
    }

    var opts = _.defaults(options || {}, { stdio: 'inherit' });

    var outputs = commands.map(function (cmd) {
        var output = runCommand(cmd, opts);
        if (_.isString(output)) return output;
        if (_.isBuffer(output)) return output.toString('utf8');
        return output;
    });

    return outputs;
}


module.exports = runner;
