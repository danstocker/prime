/**
 * Peer
 *
 * Describes connection between two nodes.
 *
 * (c) 2012 by Dan Stocker
 */
/*global prime */
(function () {
    /**
     * Creates a new peer.
     * @class Represents connection to another node.
     * @requires prime#node
     * @param node {prime#node}
     */
    prime.peer = function (node) {
        var tread = 1, // connection tread (weight)
            self;

        self = /** @lends prime#peer */ {
            /**
             * Retrieves peer node
             * @type prime#node
             */
            node: function () {
                return node;
            },

            /**
             * Retrieves peer node's load
             * @type string
             */
            load: function () {
                return node.load();
            },

            /**
             * Retrieves connection tread
             * @type number
             */
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
