/**
 * Peer Collection
 */
/*global dessert, troop, sntls, prime */
troop.promise(prime, 'Peers', function () {
    /**
     * @class prime.Peers
     * @extends troop.Base
     * @borrows sntls.Profiled
     */
    prime.Peers = troop.Base.extend()
        .addConstant(/** @lends prime.Peers */{
            /**
             * Default value to be added to peer tread, when none is specified.
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
        .addMethod(/** @lends prime.Peers */{
            /**
             * Initializes peer collection.
             * @constructor
             * @param {sntls.ProfileCollection} [profile]
             */
            init: function (profile) {
                this
                    .initProfiled(this.PROFILE_ID, profile)
                    .addPrivateConstant(/** @lends prime.Peers */{
                        /**
                         * Collection of peers involved.
                         * @type {prime.PeerCollection}
                         * @private
                         */
                        _peerCollection: prime.PeerCollection.create(),

                        /**
                         * Weighted index of peer information.
                         * @type {prime.Index}
                         * @private
                         */
                        _index: prime.Index.create(profile)
                    });
            },

            //////////////////////////////
            // Getters, setters

            /**
             * @param {string} load
             * @return {prime.Peer}
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
             * @returns {prime.Peer}
             */
            getRandomPeer: function () {
                return this._peerCollection.getItem(this._index.getRandomEntry());
            },

            //////////////////////////////
            // Graph methods

            /**
             * Adds new peer to tread.
             * @param {prime.Peer} peer New peer.
             * @return {prime.Peers}
             * @throws {Error} When peer already exists.
             */
            addPeer: function (peer) {
                var load = peer.node.load,
                    peers = this._peerCollection;

                if (!peers.getItem(load)) {
                    // adding peer to peer registry
                    peers.setItem(load, peer);

                    // increasing peer count
                    this.profile.inc(this.PEER_COUNTER_NAME);

                    // adding peer details to index
                    this._index.addEntry(load, peer.getTread());
                } else {
                    throw Error("Peer already exists.");
                }

                return this;
            },

            /**
             * Rebuilds weighted index.
             * @return {prime.Peers}
             */
            rebuildIndex: function () {
                this._index.rebuild();
                return this;
            },

            /**
             * Strengthens a peer in the collection, adds peer if necessary.
             * @param {prime.Node} node Peer node.
             * @param {number} [wear] Peer wear (incremental connection weight).
             * @return {prime.Peers}
             */
            tread: function (node, wear) {
                wear = wear || this.DEFAULT_WEAR;

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

dessert.addTypes(/** @lends dessert */{
    isPeers: function (expr) {
        return prime.Peers.isBaseOf(expr);
    },

    isPeersOptional: function (expr) {
        return typeof expr === 'undefined' ||
               prime.Peers.isBaseOf(expr);
    }
});
