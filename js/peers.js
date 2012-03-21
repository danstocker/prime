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
                if (typeof tread === 'number' ||
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

                    // updating by-tread lookup
                    $utils.unset(byTread, treadBefore, load);
                    $utils.set(byTread, treadAfter, load, peer);
                } else {
                    // creating peer
                    peer = $peer(node);

                    // adding new peer to lookups
                    $utils.set(byLoad, load, peer);
                    $utils.set(byTread, peer.tread(), load, peer);
                }

                return self;
            }
        };

        return self;
    }
}(
    prime.utils,
    prime.peer
));