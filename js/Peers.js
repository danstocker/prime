/**
 * Peer Collection
 */
/*global dessert, troop, sntls, prime */
troop.promise(prime, 'Peers', function (prime) {
    /**
     * @class Represents a collection of peers.
     * @requires utils
     * @requires Peer
     * @requires Node
     */
    var self = prime.Peers = troop.Base.extend()
        .addConstant({
            /**
             * Default value to be added to peer tread, when none is specified.
             * @type {number}
             */
            DEFAULT_WEAR: 1,

            /**
             * Identifies peer profile in the profile collection.
             */
            PROFILE_ID: 'peers',

            /**
             * Identifies counter in profile.
             */
            PEER_COUNTER_NAME: 'peers'
        })
        .addTrait(sntls.Profiled)
        .addMethod({
            //////////////////////////////
            // OOP

            /**
             * Initializes peer collection.
             * @constructor
             * @param {sntls.ProfileCollection} [profile]
             */
            init: function (profile) {
                this
                    .initProfiled(self.PROFILE_ID, profile)
                    .addPrivateConstant({
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
                        _index: prime.Index.create(profile)
                    });
            },

            //////////////////////////////
            // Getters, setters

            /**
             * @param {string} load
             * @return {Peer}
             */
            getPeer: function (load) {
                return this._peerCollection.getItem(load);
            },

            /**
             * Retrieves number of peers in this collection.
             * @return {Number}
             */
            getPeerCount: function () {
                return this._peerCollection.count;
            },

            /**
             * Retrieves a random peer, weighted by tread.
             * @returns {Peer}
             */
            getRandomPeer: function () {
                return this._peerCollection.getItem(this._index.getRandomEntry());
            },

            //////////////////////////////
            // Graph methods

            /**
             * Adds new peer to tread.
             * @param {Peer} peer New peer.
             * @throws {Error} When peer already exists.
             */
            addPeer: function (peer) {
                var load = peer.node.load,
                    peers = this._peerCollection;

                if (!peers.getItem(load)) {
                    // adding peer to peer registry
                    peers.setItem(load, peer);

                    // increasing peer count
                    this.profile.inc(self.PEER_COUNTER_NAME);

                    // adding peer details to index
                    this._index.addEntry(load, peer.getTread());
                } else {
                    throw Error("Peer already exists.");
                }

                return this;
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
             * @param {Node} node Peer node.
             * @param {number} [wear] Peer wear (incremental connection weight).
             */
            tread: function (node, wear) {
                wear = wear || self.DEFAULT_WEAR;

                var load = node.load,
                    peer = this._peerCollection.getItem(load);

                if (!peer) {
                    // adding new peer
                    this.addPeer(
                        prime.Peer.create(node, this.profile)
                            .wear(wear)
                    );
                } else {
                    // increasing tread on existing peer
                    peer.wear(wear);

                    this._index
                        .removeEntry(load)
                        .addEntry(load, peer.getTread());
                }

                return this;
            },

            //////////////////////////////
            // JSON

            toJSON: function () {
                return this._peerCollection.items;
            }
        });
});

dessert.addTypes({
    isPeers: function (expr) {
        return prime.Peers.isBaseOf(expr);
    },

    isPeersOptional: function (expr) {
        return typeof expr === 'undefined' ||
               prime.Peers.isBaseOf(expr);
    }
});
