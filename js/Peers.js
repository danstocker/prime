/**
 * Peer Collection
 */
/*global prime, dessert, troop */
troop.promise('prime.Peers', function (prime) {
    var self;

    dessert.addTypes({
        isPeers: function (expr) {
            return self.isPrototypeOf(expr);
        },

        isPeersOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   self.isPrototypeOf(expr);
        }
    });

    /**
     * @class Represents a collection of peers.
     * @requires utils
     * @requires Peer
     * @requires Node
     */
    self = prime.Peers = troop.Base.extend()
        .addConstant({
            /**
             * Default value to be added to peer tread, when none is specified.
             * @type {number}
             */
            defaultWear: 1
        })
        .addMethod({
            //////////////////////////////
            // OOP

            /**
             * Initializes peer collection.
             * @constructs
             */
            init: function () {
                this.addPrivateConstant({
                    /**
                     * Collection of peers involved.
                     * @type {PeerCollection}
                     */
                    _peerCollection: prime.PeerCollection.create(),

                    /**
                     * Weighted index of peer information.
                     * @type {Index}
                     * @private
                     */
                    _index: prime.Index.create()
                });
            },

            //////////////////////////////
            // Graph methods

            /**
             * Adds new peer to tread.
             * @param peer {Peer} New peer.
             * @throws {Error} When peer already exists.
             */
            addPeer: function (peer) {
                var load = peer.node.load,
                    peers = this._peerCollection;

                if (!peers.get(load)) {
                    // adding peer to peer registry
                    peers.set(load, peer);

                    // adding peer details to index
                    this._index.addEntry(load, peer.tread);
                } else {
                    throw Error("Peer already exists.");
                }

                return this;
            },

            /**
             * @param load {string}
             * @return {Peer}
             */
            getPeer: function (load) {
                return this._peerCollection.get(load);
            },

            /**
             * Retrieves a random peer, weighted by tread.
             * @returns {Peer}
             */
            random: function () {
                return this._peerCollection.get(this._index.random());
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

                var peer = this._peerCollection.get(load);

                if (!peer) {
                    // adding new peer
                    this.addPeer(
                        prime.Peer.create(load)
                            .wear(wear)
                    );
                } else {
                    // increasing tread on existing peer
                    peer.wear(wear);

                    this._index
                        .removeEntry(load)
                        .addEntry(load, peer.tread);
                }

                return this;
            },

            //////////////////////////////
            // JSON

            toJSON: function () {
                return this._peerCollection.items;
            },

            /**
             * Reconstructs Peers object from JSON data.
             * @static
             * @param json {object} De-serialized JSON.
             * @return {Peers}
             */
            fromJSON: function (json) {
                var peers = self.create(),
                    load;

                // initializing individual peers from JSON
                for (load in json) {
                    if (json.hasOwnProperty(load)) {
                        peers.addPeer(prime.Peer.fromJSON(load, json[load]));
                    }
                }

                return peers;
            }
        });
});
