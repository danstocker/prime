/**
 * Peer
 *
 * Describes connection between two nodes.
 */
/*global prime, dessert, troop, sntls */
troop.promise('prime.Peer', function (prime, className, Node) {
    /**
     * @class Represents connection to another node.
     * @requires prime.Node
     */
    var self = prime.Peer = troop.Base.extend()
        .addMethod({
            //////////////////////////////
            // OOP

            /**
             * Initializes a new peer.
             * @param node {string|Node} Peer node, or load.
             * @param [tread] {number} Initial peer tread.
             */
            init: function (node, tread) {
                if (typeof node === 'string') {
                    node = Node.create(node);
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

                if (tread) {
                    this.wear(tread);
                }
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
                return self.create(
                    load,
                    tread
                );
            }
        });

    return self;
}, prime.Node);

troop.promise('prime.PeerCollection', function (prime, className, Peer) {
    prime.PeerCollection = sntls.Collection.of(Peer);
}, prime.Peer);
