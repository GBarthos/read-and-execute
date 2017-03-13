"use strict";

var FORMAT_TYPE = {
    'JSON': 'json',
    'NDJSON': 'ndjson',
    'NDCOMMAND': 'ndcommand'
}
var FORMATS = [
    FORMAT_TYPE.JSON,
    FORMAT_TYPE.NDJSON,
    FORMAT_TYPE.NDCOMMAND
];

module.exports = {
    FORMAT_TYPE: FORMAT_TYPE,
    FORMATS: FORMATS
};
