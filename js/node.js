/**
 * Conceptual Node
 *
 * Nodes are the central building blocks of the Association Engine.
 *
 * (c) 2012 by Dan Stocker
 */
/*global prime */
(function ($utils, $peers) {
    var LOOKUP = {},    // system wide registry of nodes
        REACH = 0.5;    // probablility of subsequential hops

    /**
     * Conceptual node. Atomic element in an association engine.
     * @class Represents a graph node.
     * @requires prime#utils
     * @requires prime#peers
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
            /**
             * Collection of nodes connected to current node
             * @type prime#peers
             */
            peers = $peers.create(),

            self;

        self = /** @lends prime#node */ {
            load: function () {
                return load;
            },

            /**
             * Checks whether the node has a specified peer.
             * @param node {prime#node}
             */
            hasPeer: function (node) {
                return typeof peers.byLoad(node.load()) === 'object';
            },

            /**
             * Hops to a peer node randomly, weighted by their tread.
             * @returns {prime#node}
             */
            hop: function () {
                var next = peers.random().node;
                if (Math.random() < REACH) {
                    return next.hop();
                } else {
                    return next;
                }
            },

            /**
             * Adds peer node(s) to node.
             * @param [node] {prime#node[]|prime#node} One or more node object.
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
                    if (typeof node !== 'object') {
                        // acting as getter
                        return peers;
                    }

                    // adding node as peer
                    peers.add(node);

                    // checking reciprocal peer
                    if (!node.hasPeer(self)) {
                        // adding self to node as peer
                        node.peers(self);
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
    };
}(
    prime.utils,
    prime.peers
));
