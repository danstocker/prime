/**
 * Peer Collection
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
            //////////////////////////////
            // OOP

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
                this.byLoad = {};

                /**
                 * Peers indexed by tread, then load.
                 * @type {Object}
                 * @private
                 */
                this.byTread = {};

                /**
                 * Sum of the tread of all peers.
                 * @type {Number}
                 */
                this.totalTread = 0;
            },

            //////////////////////////////
            // Lookup

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
                    byLoad = this.byLoad,
                    load, peer;

                for (load in byLoad) {
                    if (byLoad.hasOwnProperty(load)) {
                        peer = byLoad[load];
                        currentSum += peer.tread;
                        if (currentSum >= targetSum) {
                            return peer;
                        }
                    }
                }

                return undefined;
            },

            //////////////////////////////
            // Graph methods

            /**
             * Retrieves a random peer, weighted by tread.
             * @returns {prime.Peer}
             */
            random: function () {
                return this.byNorm(Math.random());
            },

            /**
             * Strengthens a peer in the collection, adds peer if necessary.
             * @param node {prime.Node} Node object or load.
             * @param [wear] {number} Peer wear (incremental connection weight).
             */
            strengthen: function (node, wear) {
                var
                    /** @type string */
                    load = node.load,

                    /** @type prime.Peer */
                    peer,

                    /** @type number */
                    treadBefore, treadAfter;

                // checking whether node is already among peers
                if (this.byLoad.hasOwnProperty(load)) {
                    // obtaining peer
                    peer = this.byLoad[load];

                    // increasing tread on existing connection
                    treadBefore = peer.tread;
                    treadAfter = peer
                        .wear(wear)
                        .tread;

                    // removing old tread from lookup
                    $utils.unset(this.byTread, treadBefore, load);
                } else {
                    // creating peer
                    peer = $peer.create(node, wear);

                    // setting tread on new connection
                    treadBefore = 0;
                    treadAfter = peer.tread;

                    // adding new peer to lookup
                    $utils.set(this.byLoad, load, peer);
                }

                // updating tread in lookup
                $utils.set(this.byTread, treadAfter, load, peer);

                // updating total tread
                this.totalTread += treadAfter - treadBefore;

                return this;
            }
        });
}, prime.utils, prime.Peer);
