/**
 * Peer Collection
 */
/*global prime, troop */
troop.promise('prime.Peers', function (prime, className, Peer, PeerCollection) {
    var base = PeerCollection,
        self;

    /**
     * @class Represents a collection of peers.
     * @requires utils
     * @requires Peer
     * @requires Node
     */
    self = prime.Peers = base.extend()
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
                base.init.apply(this, arguments);

                this.addPrivateConstant({
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
                if (!this.get(peer.load)) {
                    // adding peer to peer registry
                    this.set(peer.load, peer);

                    // adding peer details to index
                    this._index.addEntry(peer.load, peer.tread);
                } else {
                    throw Error("Peer already exists.");
                }

                return this;
            },

            /**
             * Retrieves a random peer, weighted by tread.
             * @returns {Peer}
             */
            random: function () {
                return this.get(this._index.random());
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

                var peer = this.get(load);

                if (!peer) {
                    // adding new peer
                    this.addPeer(Peer.create(load, wear));
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
                        peers.addPeer(Peer.fromJSON(load, json[load]));
                    }
                }

                return peers;
            }
        });

    return self;
}, prime.Peer, prime.PeerCollection);
