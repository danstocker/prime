/**
 * Peer
 *
 * Describes connection between two nodes.
 *
 * (c) 2012 by Dan Stocker
 */
var prime = prime || {};

(function () {
    /**
     * Creates a new peer.
     * @constructor
     * @requires prime#node
     * @param node {object} Node object.
     */
    prime.peer = function (node) {
        var tread = 1, // connection tread (weight)
            self;

        self = {
            /** Retrieves peer node */
            node: function () {
                return node;
            },

            /** Retrieves peer node's load */
            load: function () {
                return node.load();
            },

            /** Retrieves connecation tread */
            tread: function () {
                return tread;
            },

            /**
             * Changes connection tread.
             * @param [value] {number} Wear amount.
             */
            wear: function (value) {
                // setting value
                tread += value || 1;

                return self;
            }
        };

        return self;
    };
}());
