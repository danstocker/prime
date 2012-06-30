/**
 * Peer
 *
 * Describes connection between two nodes.
 *
 * (c) 2012 by Dan Stocker
 */
/*global prime, troop */
troop.promise(prime, 'peer', function () {
    /**
     * @class Represents connection to another node.
     * @requires prime.node
     */
    return troop.base.extend()
        .addMethod({
            /**
             * Creates a new peer.
             * @param node {prime.node}
             */
            init: function (node) {
                this.node = node;
                this.tread = 1; // connection tread (weight)
            },

            /**
             * Retrieves peer node's load
             * @type string
             */
            load: function () {
                return this.node.load();
            },

            /**
             * Changes connection tread.
             * @param [value] {number} Wear amount.
             */
            wear: function (value) {
                // setting value
                this.tread += value || 1;

                return this;
            }
        });
});
