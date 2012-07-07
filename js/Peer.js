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
    var self = prime.Peer = troop.base.extend()
        .addMethod({
            //////////////////////////////
            // OOP

            /**
             * Initializes a new peer.
             * @param node {prime.Node} Peer node.
             * @param [tread] {number} Initial peer tread.
             */
            init: function (node, tread) {
                /**
                 * Peer node,
                 * @type {prime.Node}
                 */
                this.node = node;

                /**
                 * Weariness (weight) of connection to peer node.
                 * @type {Number}
                 */
                this.tread = tread || 0;
            },

            //////////////////////////////
            // Graph methods

            /**
             * Changes connection tread.
             * @param [value] {number} Wear amount.
             */
            wear: function (value) {
                // setting value
                this.tread += value || 1;

                return this;
            },

            //////////////////////////////
            // JSON

            toJSON: function () {
                return {
                    node: {
                        load: this.node.load
                    },
                    tread: this.tread
                };
            },

            /**
             * Reconstructs Peer object from JSON data.
             * @static
             * @param json {object} De-serialized JSON.
             * @param json.node.load {string}
             * @param json.tread {number|string}
             * @return {prime.Peer}
             */
            fromJSON: function (json) {
                return self.create(
                    prime.node(json.node.load),
                    json.tread
                );
            }
        });

    return self;
});
