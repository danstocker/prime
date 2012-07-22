/**
 * Conceptual Node
 *
 * Nodes are the central building blocks of the Association Engine.
 */
/*global prime, troop */
troop.promise(prime, 'Node', function (ns, className, Peers, Graph) {
    /**
     * Conceptual node. Basic component of the association engine.
     * @class Represents a graph node.
     * @requires prime.Peers
     */
    var self = prime.Node = troop.base.extend()
        .addConstant({
            /**
             * Reference to graph.
             * @static
             * @type {prime.Graph}
             */
            graph: Graph
        }).addPublic({
            /**
             * Probability of sub-sequential hops.
             * Must be 0 < reach < 1.
             * @static
             * @type {number}
             */
            reach: 0.5
        }).addMethod({
            //////////////////////////////
            // OOP

            /**
             * Initializes node.
             * @constructs
             * @param load {string} Node load.
             * @param [peers] {prime.Peers} Initial node peers.
             */
            init: function (load, peers) {
                // checking node in registry
                var nodes = self.graph.nodes;
                if (nodes.hasOwnProperty(load)) {
                    // node exists in lookup, fetching
                    return nodes[load];
                }

                /**
                 * String wrapped inside node.
                 * @type {string}
                 */
                this.load = load;

                /**
                 * Collection of nodes connected to current node
                 * @type {prime.Peers}
                 */
                this.peers = peers || Peers.create();

                // register in graph
                self.graph.nodes[load] = this;
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
                return this.peers.lookup[node.load];
            },

            /**
             * Hops to a peer node randomly, weighted by tread.
             * @returns {prime.Node}
             */
            hop: function () {
                if (!this.peers.count) {
                    // node has no peers, hops to itself
                    return this;
                }

                /**
                 * Taking random peer.
                 * @see prime.Peers.random
                 */
                var next = self.graph.nodes[this.peers.random().load];

                // making another jump at chance
                if (Math.random() < self.reach) {
                    next = next.hop();
                }

                return next;
            },

            /**
             * Strengthens connection weight for a series of peer nodes.
             */
            to: function (/* node1, node2, node3, ... wear */) {
                var last = arguments.length - 1,
                    node, wear,
                    i;

                if (typeof arguments[last] === 'number') {
                    wear = arguments[last];
                    last--;
                }

                for (i = 0; i <= last; i++) {
                    node = arguments[i];

                    // updating peer tread in both directions
                    this.peers.tread(node.load, wear);
                    node.peers.tread(this.load, wear);
                }

                return this;
            },

            //////////////////////////////
            // JSON

            toJSON: function () {
                return this.peers.lookup;
            },

            /**
             * Reconstructs Node object from JSON data.
             * @static
             * @param json {object} De-serialized JSON.
             * @param json.load {string}
             * @param json.peers {object}
             * @return {prime.Node}
             */
            fromJSON: function (load, json) {
                return self.create(
                    load,

                    // initializing peers form JSON
                    Peers.fromJSON(json)
                );
            }
        });

    return self;
}, prime.Peers, prime.Graph);

troop.promise(prime, '$', function () {
    /**
     * Retrieves a node from the graph or creates a new one.
     * @param load {string} Node load.
     * @return {prime.Node}
     */
    return prime.$ = function (load) {
        return prime.Node.create(load);
    };
});
