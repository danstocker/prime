/**
 * Top-Level Library Namespace
 */
/*global exports, require */
/** @namespace */
var prime = {},
    troop;

// adding Node.js dependencies
if (typeof exports === 'object' && typeof require === 'function') {
    troop = require('troop-0.1.6').troop;
}
