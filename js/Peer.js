/**
 * Peer
 *
 * Describes connection between two nodes.
 */
/*global prime, troop, sntls */
troop.promise('prime.Peer', function (prime) {
    /**
     * @class Represents connection to another node.
     * @requires prime.Node
     */
    var self = prime.Peer = troop.Base.extend()
        .addPublic({
            /**
             * Total tread across all peers.
             * @type {number}
             * @static
             */
            totalTread: 0
        })
        .addMethod({
            //////////////////////////////
            // OOP

            /**
             * Initializes a new peer.
             * @param load {string} Peer node load.
             * @param [tread] {number} Initial peer tread.
             */
            init: function (load, tread) {
                this
                    .addConstant({
                        /**
                         * Peer node,
                         * @type {string}
                         */
                        load: load
                    })
                    .addPublic({
                        /**
                         * Weariness (weight) of connection to peer node.
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
                self.totalTread += value;

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
             * @return {prime.Peer}
             */
            fromJSON: function (load, tread) {
                return self.create(
                    load,
                    tread
                );
            }
        });

    return self;
});

troop.promise('prime.PeerCollection', function () {
    prime.PeerCollection = sntls.Collection.of(prime.Peer);
});
