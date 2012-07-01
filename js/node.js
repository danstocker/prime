/**
 * Conceptual Node
 *
 * Nodes are the central building blocks of the Association Engine.
 *
 * (c) 2012 by Dan Stocker
 */
/*global prime, troop */
troop.promise(prime, 'Node', function (ns, className, $utils, $peers) {
    prime.Node = {};

    /**
     * Conceptual node. Atomic element in an association engine.
     * @class Represents a graph node.
     * @requires prime.utils
     * @requires prime.peers
     * @param load {string} Node load.
     */
    var Node = troop.base.extend()
        .addConstant({
            /**
             * System-wide registry of nodes
             */
            LOOKUP: {},

            /**
             * Probability of sub-sequential hops
             */
            REACH: 0.5
        }).addMethod({
            /**
             * Initializes node.
             * @param load {string} Node load.
             */
            init: function (load) {
                if (typeof load !== 'string') {
                    throw "prime.node: Invalid load (" + load + ")";
                }

                /**
                 * String wrapped inside node.
                 * @type string
                 */
                this.load = load;

                /**
                 * Collection of nodes connected to current node
                 * @type prime.peers
                 */
                this.peers = $peers.create();
            },

            /**
             * Retrieves load for all nodes.
             * @returns {string[]} All node loads.
             */
            lookupKeys: function () {
                return Object.keys(Node.LOOKUP);
            },

            /**
             * Checks whether the node has a specified peer.
             * @param node {prime.node}
             */
            hasPeer: function (node) {
                return typeof this.peers.byLoad(node.load) === 'object';
            },

            /**
             * Hops to a peer node randomly, weighted by their tread.
             * @returns {prime.node}
             */
            hop: function () {
                var next = this.peers.random().node;
                if (Math.random() < Node.REACH) {
                    return next.hop();
                } else {
                    return next;
                }
            },

            /**
             * Adds peer node(s) to node.
             * @param [node] {prime.node[]|prime.node} One or more node object.
             */
            addPeers: function (node) {
                var nodes, i;
                if (node instanceof Array) {
                    // adding peer for each
                    nodes = node;
                    for (i = 0; i < nodes.length; i++) {
                        this.addPeers(nodes[i]);
                    }
                } else {
                    // adding node as peer
                    this.peers.add(node);

                    // checking reciprocal peer
                    if (!node.hasPeer(this)) {
                        // adding self to node as peer
                        node.addPeers(this);
                    }
                }

                return this;
            }
        });

    return Node;
}, prime.utils, prime.peers);

/**
 * Returns a node. Creates one if necessary.
 * @static
 * @return {prime.node}
 */
prime.node = function (load) {
    var Node = prime.Node,
        LOOKUP = Node.LOOKUP,
        node;
    if (LOOKUP.hasOwnProperty(load)) {
        // node exists in lookup, fetching
        return LOOKUP[load];
    } else {
        // new load, creating node
        node = Node.create(load);

        // adding node to lookup
        LOOKUP[load] = node;

        return node;
    }
};
