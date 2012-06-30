/**
 * Peer Collection
 *
 * (c) 2012 by Dan Stocker
 */
/*global prime */
(function ($utils, $peer) {
    /**
     * Creates a collection of peers.
     * @class Represents a collection of peers.
     * @requires prime#utils
     * @requires prime#peer
     * @requires prime#node
     */
    prime.peers = function () {
        var
            // peer buffers
            byLoad = {}, // peers indexed by load
            byTread = {}, // peers indexed by tread, then load

            totalTread = 0, // sum of the tread of all peers

            self;

        self = /** @lends prime#peers */ {
            /**
             * Retrieves shallow copy of by-load buffer.
             * @param [load] {string} Load to look up.
             * @returns {prime#node}
             */
            byLoad: function (load) {
                if (typeof load === 'string') {
                    return byLoad[load];
                } else {
                    return $utils.shallow(byLoad);
                }
            },

            /**
             * Retrieves shallow copy of by-tread buffer.
             * @param [tread] {number|string} Tread to look up.
             * @param [load] {string} Load to look up.
             * @returns {prime#node|object} A node object or lookup depending
             * on the presence of parameters.
             */
            byTread: function (tread, load) {
                if (
                    typeof tread === 'number' ||
                        typeof tread === 'string'
                    ) {
                    if (typeof load === 'string') {
                        return byTread[tread][load];
                    } else {
                        return $utils.shallow(byTread[tread]);
                    }
                } else {
                    return $utils.shallow(byTread);
                }
            },

            /**
             * Retrieves single peer matching the given normalized cumulative
             * tread (NCT). NCT, between 0 and 1, pin-points a peer among
             * all available peers based on their tread.
             * TODO: reduce computational complexity from O(n)
             * @param norm {number} Normalized sum. 0 <= norm <= 1.
             * @returns {prime#peer}
             */
            byNorm: function (norm) {
                var targetSum = norm * totalTread,
                    currentSum = 0,
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

            /**
             * Retrieves a random peer, weighted by tread.
             * @returns {prime#peer}
             */
            random: function () {
                return self.byNorm(Math.random());
            },

            /**
             * Retrieves total tread for all associated peers
             * @type number
             */
            totalTread: function () {
                return totalTread;
            },

            /**
             * Adds node to peers collection
             * @param node {prime#node} Node object or load.
             * @param [wear] {number} Peer wear (incremental connection weight).
             */
            add: function (node, wear) {
                var load = node.load(),
                    peer,
                    treadBefore, treadAfter;

                // checking whether node is already among peers
                if (byLoad.hasOwnProperty(load) ||
                    typeof wear === 'number'
                    ) {
                    peer = byLoad[load];

                    // increasing tread on connection
                    treadBefore = peer.tread;
                    treadAfter = peer
                        .wear(wear)
                        .tread;

                    // removing old tread from lookup
                    $utils.unset(byTread, treadBefore, load);
                } else {
                    // creating peer
                    peer = $peer.create(node);

                    treadBefore = 0;
                    treadAfter = peer.tread;

                    // adding new peer to lookup
                    $utils.set(byLoad, load, peer);
                }

                // updating tread in lookup
                $utils.set(byTread, treadAfter, load, peer);

                // updating total tread
                totalTread += treadAfter - treadBefore;

                return self;
            }
        };

        return self;
    };
}(
    prime.utils,
    prime.peer
));