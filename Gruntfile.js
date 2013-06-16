/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'js/license.js',
            'js/namespace.js',
            'js/utils.js',
            'js/Index.js',
            'js/Node.js',
            'js/Peer.js',
            'js/Peers.js',
            'js/Graph.js',
            'js/exports.js'
        ],

        test: [
            'js/jsTestDriver.conf'
        ],

        globals: {
            dessert: true,
            troop  : true,
            sntls  : true
        }
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
