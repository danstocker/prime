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
                /**
                 * Peer node,
                 * @type {string}
                 */
                this.load = load;

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
                    tread: this.tread
                };
            },

            /**
             * Reconstructs Peer object from JSON data.
             * @static
             * @param load {string} Peer node's load.
             * @param json {object} De-serialized JSON.
             * @param json.tread {number|string}
             * @return {prime.Peer}
             */
            fromJSON: function (load, json) {
                return self.create(
                    load,
                    json.tread
                );
            }
        });

    return self;
});
