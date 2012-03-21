/**
 * Conceptual Node
 *
 * Nodes are the central building blocks of the Association Engine.
 *
 * (c) 2012 by Dan Stocker
 */
var prime = prime || {};

(function ($utils, $peers) {
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
            peers = $peers(),
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
                var load = (
                    typeof node === 'string' ?
                        node :
                        typeof node === 'object' ?
                            node.load() :
                            undefined
                    );

                return (typeof peers.byLoad(load) === 'object');
            },

            /**
             * Adds peer node(s) to node.
             * @param [node] {object[]|object|string[]|string} One or more node object or load.
             */
            peers: function (node) {
                var nodes, i;
                if (node instanceof Array) {
                    // adding peer for each
                    nodes = node;
                    for (i = 0; i < nodes.length; i++) {
                        self.peers(nodes[i]);
                    }
                } else {
                    if (typeof node === 'string') {
                        node = LOOKUP[node];
                    } else if (typeof node !== 'object') {
                        // acting as getter
                        return peers;
                    }

                    // adding node as peer
                    peers.add(node);

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
    prime.utils,
    prime.peers
));
