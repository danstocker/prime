/**
 * Peer Collection
 *
 * (c) 2012 by Dan Stocker
 */
var prime = prime || {};

(function ($utils, $peer) {
    /**
     * @constructor
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

        self = {
            /**
             * Retrieves shallow copy of by-load buffer.
             * @param [load] {string} Load to look up.
             * @returns {object}
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
             * @returns {object}
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
             * Retrieves single peer matching the given normalized cummulative
             * tread (NCT). NCT, between 0 and 1, pin-points a peer among
             * all available peers based on their tread.
             * TODO: reduce computational complexity from O(n)
             * @param norm {number} Normalized sum. 0 <= norm <= 1.
             */
            byNorm: function (norm) {
                var targetSum = norm * totalTread,
                    currentSum = 0,
                    load, peer;

                for (load in byLoad) {
                    if (byLoad.hasOwnProperty(load)) {
                        peer = byLoad[load];
                        currentSum += peer.tread();
                        if (currentSum >= targetSum) {
                            return peer;
                        }
                    }
                }
            },

            /** Retrieves total tread for all associated peers */
            totalTread: function () {
                return totalTread;
            },

            /**
             * Adds node to peers collection
             * @param node {object} Node object
             * @param [wear] {number} Peer wear (incremental connection weight).
             */
            add: function (node, wear) {
                var load = node.load(),
                    peer,
                    treadBefore, treadAfter;

                // checking whether node is alreay among peers
                if (byLoad.hasOwnProperty(load) ||
                    typeof wear === 'number'
                    ) {
                    peer = byLoad[load];

                    // increasing tread on connection
                    treadBefore = peer.tread();
                    treadAfter = peer
                        .wear(wear)
                        .tread();

                    // removing old tread from lookup
                    $utils.unset(byTread, treadBefore, load);
                } else {
                    // creating peer
                    peer = $peer(node);

                    treadBefore = 0;
                    treadAfter = peer.tread();

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