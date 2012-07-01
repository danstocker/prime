/**
 * Conceptual Node
 *
 * Nodes are the central building blocks of the Association Engine.
 */
/*global prime, troop */
troop.promise(prime, 'Node', function (ns, className, $peers) {
    /**
     * Conceptual node. Basic component of the association engine.
     * @class Represents a graph node.
     * @requires prime.Peers
     */
    var self = prime.Node = troop.base.extend()
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
             * @constructs
             * @param load {string} Node load.
             */
            init: function (load) {
                /**
                 * String wrapped inside node.
                 * @type {string}
                 */
                this.load = load;

                /**
                 * Collection of nodes connected to current node
                 * @type {prime.Peers}
                 */
                this.peers = $peers.create();
            },

            /**
             * Retrieves a peer object for a given node.
             * @param node {prime.Node}
             * @return {prime.Peer}
             */
            peer: function (node) {
                return this.peers.byLoad(node.load);
            },

            /**
             * Hops to a peer node randomly, weighted by tread.
             * @returns {prime.Node}
             */
            hop: function () {
                var next = this.peers.randomPeer().node;
                if (Math.random() < self.REACH) {
                    return next.hop();
                } else {
                    return next;
                }
            },

            /**
             * Strengthens connection weight for a single peer.
             * @param node {prime.Node} Node to add as peer.
             * @param [wear] {number} Edge weight increment.
             */
            strengthen: function (node, wear) {
                this.peers.strengthen(node, wear);
                node.peers.strengthen(this, wear);

                return this;
            },

            /**
             * Connects multiple peer nodes.
             * @param nodes {prime.Node[]} Array of nodes.
             */
            connect: function (nodes) {
                var tmp = nodes instanceof Array ?
                    nodes :
                    arguments;

                // adding peer for each
                var i;
                for (i = 0; i < tmp.length; i++) {
                    this.strengthen(tmp[i]);
                }

                return this;
            }
        });

    return self;
}, prime.Peers);

/**
 * Accesses node. Creates it if necessary.
 * @param load {string} Node load.
 * @return {prime.Node}
 */
prime.node = function (load) {
    // shortcuts and local variable
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
