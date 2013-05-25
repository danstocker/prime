/**
 * Peer Collection
 */
/*global dessert, troop, sntls, prime */
troop.promise(prime, 'PeerCollection', function () {
    "use strict";

    var base = sntls.Collection.of(prime.Peer);

    /**
     * @class prime.PeerCollection
     * @extends sntls.Collection
     * @extends prime.Peer
     * @extends sntls.Profiled
     */
    prime.PeerCollection = base.extend()
        .addConstant(/** @lends prime.PeerCollection */{
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
        .addMethod(/** @lends prime.PeerCollection */{
            /**
             * @name prime.PeerCollection.create
             * @return {prime.PeerCollection}
             */

            /**
             * Initializes peer collection.
             * @param {sntls.ProfileCollection} [profile]
             */
            init: function (profile) {
                base.init.call(this);

                this.initProfiled(this.PROFILE_ID, profile);

                /**
                 * Weighted index of peer information.
                 * @type {prime.Index}
                 * @private
                 */
                this._index = prime.Index.create(profile);
            },

            /**
             * @param {string} load
             * @return {prime.Peer}
             */
            getPeer: function (load) {
                return this.getItem(load);
            },

            /**
             * Retrieves a random peer, weighted by tread.
             * @returns {prime.Peer}
             */
            getRandomPeer: function () {
                return this.getItem(this._index.getRandomEntry());
            },

            /**
             * Sets peer in collection
             * @param {string} load Peer node load
             * @param {prime.Peer} peer Peer
             */
            setItem: function (load, peer) {
                dessert.assert(!this.getItem(load), "Peer already exists.");

                // adding peer to peer registry
                base.setItem.call(this, load, peer);

                // increasing peer count
                this.profile.inc(this.PEER_COUNTER_NAME);

                // adding peer details to index
                this._index.addEntry(load, peer.getTread());

                return this;
            },

            deleteItem: function () {
                dessert.assert(false, "Can't remove from peer collection");
            },

            clone: function () {
                dessert.assert(false, "Can't clone peer collection");
            },

            clear: function () {
                dessert.assert(false, "Can't remove from peer collection");
            },

            /**
             * Adds new peer to tread.
             * @param {prime.Peer} peer New peer.
             * @return {prime.PeerCollection}
             */
            addPeer: function (peer) {
                var load = peer.node.load;

                // setting peer
                this.setItem(load, peer);

                return this;
            },

            /**
             * Rebuilds weighted index.
             * @return {prime.PeerCollection}
             */
            rebuildIndex: function () {
                this._index.rebuild();
                return this;
            },

            /**
             * Strengthens a peer in the collection, adds peer if necessary.
             * @param {prime.Node} node Peer node.
             * @param {number} [wear] Peer wear (incremental connection weight).
             * @return {prime.PeerCollection}
             */
            tread: function (node, wear) {
                wear = wear || this.DEFAULT_WEAR;

                var load = node.load,
                    peer = this.getItem(load);

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

            toJSON: function () {
                return this.items;
            }
        });
});

(function () {
    "use strict";

    var Peers = prime.PeerCollection;

    dessert.addTypes(/** @lends dessert */{
        isPeers: function (expr) {
            return Peers.isBaseOf(expr);
        },

        isPeersOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   Peers.isBaseOf(expr);
        }
    });
}());
