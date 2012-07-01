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
             * @static
             */
            LOOKUP: {},

            /**
             * Probability of sub-sequential hops
             * @static
             * @type {number}
             */
            REACH: 0.5
        }).addMethod({
            //////////////////////////////
            // OOP

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

            //////////////////////////////
            // Static methods

            /**
             * Retrieves random node from lookup.
             * TODO: Reduce O(n) complexity.
             * @static
             * @returns {prime.Node}
             */
            random: function () {
                var LOOKUP = self.LOOKUP,
                    loads = Object.keys(LOOKUP);

                return LOOKUP[loads[Math.floor(Math.random() * loads.length)]];
            },

            //////////////////////////////
            // Utils

            /**
             * Adds node to lookup when it's not already there.
             */
            register: function () {
                var load = this.load,
                    LOOKUP = self.LOOKUP;
                if (!LOOKUP.hasOwnProperty(load)) {
                    LOOKUP[load] = this;
                }

                return this;
            },

            //////////////////////////////
            // Graph methods

            /**
             * Retrieves a peer object for a given node.
             * When node is not a peer, returns undefined.
             * @param node {prime.Node}
             * @return {prime.Peer}
             */
            peer: function (node) {
                return this.peers.byLoad(node.load);
            },

            /**
             * Hops to a peer node randomly, weighted by tread.
             * TODO: For when node has no peers, return completely random node.
             * @returns {prime.Node}
             */
            hop: function () {
                var next = this.peers.random().node;
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
        LOOKUP = Node.LOOKUP;

    if (arguments.length === 0) {
        // no load given, returning a random node
        return Node.random();
    } else if (LOOKUP.hasOwnProperty(load)) {
        // node exists in lookup, fetching
        return LOOKUP[load];
    } else {
        // new load, creating node
        return Node.create(load).register();
    }
};
