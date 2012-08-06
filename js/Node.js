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
            graph: Graph.create()
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
             * Takes a load string, and either a peers object, or a series of nodes.
             * @constructs
             * @param load {string} Node load.
             * @param [peers] {prime.Peers} Initial node peers.
             */
            init: function (load, peers) {
                var that,
                    nodes,
                    i, node;

                // checking node in registry
                nodes = self.graph.nodes;
                if (nodes.hasOwnProperty(load)) {
                    // node exists in lookup, fetching
                    that = nodes[load];
                } else {
                    // node is new
                    that = this;

                    /**
                     * String wrapped inside node.
                     * @type {string}
                     */
                    this.load = load;

                    /**
                     * Collection of nodes connected to current node
                     * @type {prime.Peers}
                     */
                    this.peers = Peers.isPrototypeOf(peers) ?
                        peers :
                        Peers.create();

                    // registering in graph
                    nodes[load] = this;
                }

                // adding nodes as peers when supplied
                for (i = 1; i < arguments.length; i++) {
                    node = arguments[i];
                    if (self.isPrototypeOf(node)) {
                        that.to(node);
                    }
                }

                // must return because
                return that;
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
             * Strengthens connection weight between this node and remote node.
             * @param remote {prime.Node}
             * @param [forwardWear] {number}
             * @param [backwardsWear] {number}
             */
            to: function (remote, forwardWear, backwardsWear) {
                backwardsWear = backwardsWear || forwardWear;

                // updating peer tread in both directions
                this.peers.tread(remote.load, forwardWear);
                remote.peers.tread(this.load, backwardsWear);

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
     * Shortcut to Node.create.
     * @param load {string} Node load.
     * @return {prime.Node}
     */
    return prime.$ = function () {
        return prime.Node.create.apply(prime.Node, arguments);
    };
});
