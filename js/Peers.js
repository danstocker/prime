/**
 * Peer Collection
 */
/*global prime, troop */
troop.promise(prime, 'Peers', function (ns, className, $utils, $Peer) {
    /**
     * @class Represents a collection of peers.
     * @requires prime.utils
     * @requires prime.Peer
     * @requires prime.Node
     */
    var self = prime.Peers = troop.base.extend()
        .addConstant({
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
             * Adds new peer to tread.
             * @param peer {prime.Peer} New peer.
             * @throws {Error} When peer already exists.
             */
            add: function (peer) {
                var load = peer.load,
                    tread = peer.tread,
                    byLoad = this.byLoad,
                    byTread = this.byTread;

                if (!byLoad.hasOwnProperty(load)) {
                    $utils.set(byLoad, load, peer);
                    $utils.set(byTread, tread, load, peer);
                    this.totalTread += tread;
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
                return this.byNorm(Math.random());
            },

            /**
             * Strengthens a peer in the collection, adds peer if necessary.
             * @param load {string} Node load.
             * @param [wear] {number} Peer wear (incremental connection weight).
             */
            tread: function (load, wear) {
                wear = wear || self.defaultWear;

                var byLoad = this.byLoad,
                    byTread = this.byTread,
                    peer, treadBefore, treadAfter;

                if (!byLoad.hasOwnProperty(load)) {
                    // adding new peer
                    this.add($Peer.create(load, wear));
                } else {
                    // increasing tread on existing peer
                    peer = byLoad[load];
                    treadBefore = peer.tread;
                    treadAfter = peer
                        .wear(wear)
                        .tread;

                    // updating tread lookup
                    $utils.unset(byTread, treadBefore, load);
                    $utils.set(byTread, treadAfter, load, peer);
                    this.totalTread += treadAfter - treadBefore;
                }

                return this;
            },

            //////////////////////////////
            // JSON

            toJSON: function () {
                return {
                    byLoad: this.byLoad
                };
            },

            /**
             * Reconstructs Peers object from JSON data.
             * @static
             * @param json {object} De-serialized JSON.
             * @param json.byLoad {object}
             * @return {prime.Peers}
             */
            fromJSON: function (json) {
                var peers = self.create(),
                    byLoad = json.byLoad,
                    load;

                // initializing individual peers from JSON
                for (load in byLoad) {
                    if (byLoad.hasOwnProperty(load)) {
                        peers.add($Peer.fromJSON(byLoad[load]));
                    }
                }

                return peers;
            }
        });

    return self;
}, prime.utils, prime.Peer);
