/**
 * Top-Level Library Namespace
 */
/*global exports, require */
var prime,
    dessert,
    troop,
    sntls;

(function () {
    /** @namespace */
    prime = this.prime = {};
}());

// adding Node.js dependencies
if (typeof exports === 'object' && typeof require === 'function') {
    dessert = require('dessert-0.2.3').dessert;
    troop = require('troop-0.2.3').troop;
    sntls = require('sntls-0.1.3').sntls;
}
