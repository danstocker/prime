/**
 * Peer
 *
 * Describes connection between two nodes.
 */
/*global prime, troop */
troop.promise(prime, 'Peer', function () {
    /**
     * @class Represents connection to another node.
     * @requires prime.Node
     */
    return prime.Peer = troop.base.extend()
        .addMethod({
            /**
             * Initializes a new peer.
             * @param node {prime.Node} Peer node.
             */
            init: function (node) {
                /**
                 * Peer node,
                 * @type {prime.Node}
                 */
                this.node = node;

                /**
                 * Weariness (weight) of connection to peer node.
                 * @type {Number}
                 */
                this.tread = 1;
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
