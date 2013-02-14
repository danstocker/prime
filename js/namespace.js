/**
 * Top-Level Library Namespace
 */
/*global require */
/** @namespace */
var prime = {},
    dessert,
    troop,
    sntls;

// adding Node.js dependencies
if (typeof require === 'function') {
    dessert = require('dessert-0.2.3').dessert;
    troop = require('troop-0.2.3').troop;
    sntls = require('sntls-0.2.0').sntls;
}
