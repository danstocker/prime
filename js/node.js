/**
 * Conceptual Node
 *
 * Nodes are the central building blocks of the Association Engine.
 *
 * (c) 2012 by Dan Stocker
 */
var prime = prime || {};

(function ($utils) {
    var LOOKUP = {};

    /**
     * Conceptual node. Atomic element in an association engine.
     * @constructor
     * @requires prime#utils
     * @param load {string} Node load.
     */
    prime.node = function (load) {
        if (typeof load !== 'string') {
            throw "prime.node: Invalid load (" + load + ")";
        }

        if (LOOKUP.hasOwnProperty(load)) {
            // returning existing node
            return LOOKUP[load];
        }

        var
            // collection of connected nodes
            peers = {},
            self;

        self = {
            load: function () {
                return load;
            },

            /**
             * Checks whether the node has a specified peer.
             * @param node {object|string} Node object or load.
             */
            hasPeer: function (node) {
                if (typeof node === 'string') {
                    return peers.hasOwnProperty(node);
                } else if (typeof node === 'object') {
                    return peers.hasOwnProperty(node.load());
                }
                return false;
            },

            /**
             * Adds peer node(s) to node.
             * TODO: revise getter behavior when usage is clear
             * @param [node] {object[]|object|string[]|string} One or more node object or load.
             */
            peers: function (node) {
                var i, tmp;
                if (node instanceof Array) {
                    // adding peer for each
                    for (i = 0; i < node.length; i++) {
                        self.peers(node[i]);
                    }
                } else {
                    if (typeof node === 'string') {
                        tmp = node;
                        node = LOOKUP[node];
                    } else if (typeof node === 'object') {
                        tmp = node.load();
                    } else {
                        // acting as getter
                        return $utils.keys(peers);
                    }

                    // adding node as peer
                    peers[tmp] = node;

                    if (!node.hasPeer(load)) {
                        // adding self to node as peer
                        node.peers(load);
                    }
                }

                return self;
            }
        };

        // adding node to lookup
        LOOKUP[load] = self;

        return self;
    };

    /**
     * Retrieves load for all nodes.
     * @returns {string[]} All node loads.
     */
    prime.node.lookupKeys = function () {
        return $utils.keys(LOOKUP);
    }
}(
    prime.utils
));
