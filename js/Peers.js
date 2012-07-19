/**
 * Peer Collection
 */
/*global prime, troop */
troop.promise(prime, 'Peers', function (ns, className, utils, Peer, Index) {
    /**
     * @class Represents a collection of peers.
     * @requires prime.utils
     * @requires prime.Peer
     * @requires prime.Node
     */
    var self = prime.Peers = troop.base.extend()
        .addConstant({
            /**
             * Default value to be added to peer tread, when none is specified.
             * @type {number}
             */
            defaultWear: 1
        }).addMethod({
            //////////////////////////////
            // OOP

            /**
             * Initializes peer collection.
             * @constructs
             */
            init: function () {
                /**
                 * Peer objects indexed by load.
                 * @type {Object}
                 * @private
                 */
                this.lookup = {};

                /**
                 * Total number of peers in lookup.
                 * @type {Number}
                 */
                this.count = 0;

                /**
                 * Weighted index of peer information.
                 * @type {prime.Index}
                 * @private
                 */
                this._index = Index.create();
            },

            //////////////////////////////
            // Graph methods

            /**
             * Adds new peer to tread.
             * @param peer {prime.Peer} New peer.
             * @throws {Error} When peer already exists.
             */
            add: function (peer) {
                if (!this.lookup.hasOwnProperty(peer.load)) {
                    // adding peer to peer registry
                    this.lookup[peer.load] = peer;
                    this.count++;

                    // adding peer details to index
                    this._index.add(peer.load, peer.tread);
                } else {
                    throw Error("Peer already exists.");
                }

                return this;
            },

            /**
             * Retrieves a random peer, weighted by tread.
             * @returns {prime.Peer}
             */
            random: function () {
                return this.lookup[this._index.random()];
            },

            /**
             * Rebuilds weighted index.
             */
            rebuildIndex: function () {
                this._index.rebuild();
                return this;
            },

            /**
             * Strengthens a peer in the collection, adds peer if necessary.
             * @param load {string} Node load.
             * @param [wear] {number} Peer wear (incremental connection weight).
             */
            tread: function (load, wear) {
                wear = wear || self.defaultWear;

                var lookup = this.lookup,
                    peer;

                if (!lookup.hasOwnProperty(load)) {
                    // adding new peer
                    this.add(Peer.create(load, wear));
                } else {
                    // increasing tread on existing peer
                    peer = lookup[load]
                        .wear(wear);

                    this._index
                        .remove(load)
                        .add(load, peer.tread);
                }

                return this;
            },

            //////////////////////////////
            // JSON

            /**
             * Reconstructs Peers object from JSON data.
             * @static
             * @param json {object} De-serialized JSON.
             * @return {prime.Peers}
             */
            fromJSON: function (json) {
                var peers = self.create(),
                    load;

                // initializing individual peers from JSON
                for (load in json) {
                    if (json.hasOwnProperty(load)) {
                        peers.add(Peer.fromJSON(load, json[load]));
                    }
                }

                return peers;
            }
        });

    return self;
}, prime.utils, prime.Peer, prime.Index);
