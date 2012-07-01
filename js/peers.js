/**
 * Peer Collection
 *
 * (c) 2012 by Dan Stocker
 */
/*global prime, troop */
troop.promise(prime, 'Peers', function (ns, className, $utils, $peer) {
    /**
     * @class Represents a collection of peers.
     * @requires prime.utils
     * @requires prime.Peer
     * @requires prime.Node
     */
    return prime.Peers = troop.base.extend()
        .addMethod({
            /**
             * Initializes peer collection.
             * @constructs
             */
            init: function () {
                /**
                 * Peers indexed by load.
                 * @type {Object}
                 * @private
                 */
                this._byLoad = {};

                /**
                 * Peers indexed by tread, then load.
                 * @type {Object}
                 * @private
                 */
                this._byTread = {};

                /**
                 * Sum of the tread of all peers.
                 * @type {Number}
                 */
                this.totalTread = 0;
            },

            /**
             * Retrieves shallow copy of by-load buffer.
             * @param [load] {string} Load to look up.
             * @returns {prime.Node}
             */
            byLoad: function (load) {
                if (typeof load === 'string') {
                    return this._byLoad[load];
                } else {
                    return $utils.shallow(this._byLoad);
                }
            },

            /**
             * Retrieves shallow copy of by-tread buffer.
             * @param [tread] {number|string} Tread to look up.
             * @param [load] {string} Load to look up.
             * @returns {prime.Node|object} A node object or lookup depending
             * on the presence of parameters.
             */
            byTread: function (tread, load) {
                if (
                    typeof tread === 'number' ||
                    typeof tread === 'string'
                    ) {
                    if (typeof load === 'string') {
                        return this._byTread[tread][load];
                    } else {
                        return $utils.shallow(this._byTread[tread]);
                    }
                } else {
                    return $utils.shallow(this._byTread);
                }
            },

            /**
             * Retrieves single peer matching the given normalized cumulative
             * tread (NCT). NCT, between 0 and 1, pin-points a peer among
             * all available peers based on their tread.
             * TODO: reduce computational complexity from O(n)
             * @param norm {number} Normalized sum. 0 <= norm <= 1.
             * @returns {prime.Peer}
             */
            byNorm: function (norm) {
                var targetSum = norm * this.totalTread,
                    currentSum = 0,
                    load, peer;

                for (load in this._byLoad) {
                    if (this._byLoad.hasOwnProperty(load)) {
                        peer = this._byLoad[load];
                        currentSum += peer.tread;
                        if (currentSum >= targetSum) {
                            return peer;
                        }
                    }
                }

                return undefined;
            },

            /**
             * Retrieves a random peer, weighted by tread.
             * @returns {prime.Peer}
             */
            randomPeer: function () {
                return this.byNorm(Math.random());
            },

            /**
             * Adds node to peers collection
             * @param node {prime.Node} Node object or load.
             * @param [wear] {number} Peer wear (incremental connection weight).
             */
            addNode: function (node, wear) {
                var load = node.load,
                    peer,
                    treadBefore, treadAfter;

                // checking whether node is already among peers
                if (this._byLoad.hasOwnProperty(load) ||
                    typeof wear === 'number'
                    ) {
                    peer = this._byLoad[load];

                    // increasing tread on connection
                    treadBefore = peer.tread;
                    treadAfter = peer
                        .wear(wear)
                        .tread;

                    // removing old tread from lookup
                    $utils.unset(this._byTread, treadBefore, load);
                } else {
                    // creating peer
                    peer = $peer.create(node);

                    treadBefore = 0;
                    treadAfter = peer.tread;

                    // adding new peer to lookup
                    $utils.set(this._byLoad, load, peer);
                }

                // updating tread in lookup
                $utils.set(this._byTread, treadAfter, load, peer);

                // updating total tread
                this.totalTread += treadAfter - treadBefore;

                return this;
            }
        });
}, prime.utils, prime.Peer);
