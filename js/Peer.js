/**
 * Peer
 *
 * Describes connection between two nodes.
 */
/*global prime, dessert, troop, sntls */
troop.promise('prime.Peer', function (prime) {
    var self;

    dessert.addTypes({
        isPeer: function (expr) {
            return self.isPrototypeOf(expr);
        },

        isPeerOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   self.isPrototypeOf(expr);
        }
    });

    /**
     * @class Represents connection to another node.
     * @requires prime.Node
     */
    self = prime.Peer = troop.Base.extend()
        .addMethod({
            //////////////////////////////
            // OOP

            /**
             * Initializes a new peer.
             * @param node {string|Node} Peer node, or load.
             */
            init: function (node) {
                if (typeof node === 'string') {
                    node = prime.Node.create(node);
                } else {
                    dessert.isNode(node);
                }

                this
                    .addConstant({
                        /**
                         * Peer node
                         * @type {Node}
                         */
                        node: node
                    })
                    .addPublic({
                        /**
                         * Wear (weight) of connection to peer node.
                         * @type {Number}
                         */
                        tread: 0
                    });
            },

            //////////////////////////////
            // Graph methods

            /**
             * Changes connection tread.
             * @param [value] {number} Wear amount.
             */
            wear: function (value) {
                // default wear
                value = value || 1;

                // setting tread
                this.tread += value;

                return this;
            },

            //////////////////////////////
            // JSON

            toJSON: function () {
                return this.tread;
            },

            /**
             * Reconstructs Peer object from JSON data.
             * @static
             * @param load {string} Peer node's load.
             * @param tread {number|string} De-serialized JSON.
             * @return {Peer}
             */
            fromJSON: function (load, tread) {
                return self.create(load)
                    .wear(tread);
            }
        });
});

troop.promise('prime.PeerCollection', function (prime) {
    prime.PeerCollection = sntls.Collection.of(prime.Peer);
});
