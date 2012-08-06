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
                    }).addPublic({
                        /**
                         * Weariness (weight) of connection to peer node.
                         * @type {Number}
                         */
                        tread: tread || 0
                    });
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
