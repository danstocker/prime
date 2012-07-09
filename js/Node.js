/**
 * Conceptual Node
 *
 * Nodes are the central building blocks of the Association Engine.
 */
/*global prime, troop */
troop.promise(prime, 'Node', function (ns, className, $Peers) {
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
            graph: prime.Graph
        }).addPublic({
            /**
             * Probability of sub-sequential hops.
             * Must be 0 < reach < 1.
             * @static
             * @type {number}
             */
            reach: 0.5,

            /**
             * Event handler for node changes.
             * @function
             * @param data {object} Key-value pairs of changed nodes.
             */
            handler: null
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
                /**
                 * String wrapped inside node.
                 * @type {string}
                 */
                this.load = load;

                /**
                 * Collection of nodes connected to current node
                 * @type {prime.Peers}
                 */
                this.peers = peers || $Peers.create();

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
                return this.peers.byLoad[node.load];
            },

            /**
             * Hops to a peer node randomly, weighted by tread.
             * @returns {prime.Node}
             */
            hop: function () {
                var next = self.graph.nodes[this.peers.random().load];

                if (Math.random() < self.reach) {
                    next = next.hop();
                }

                return next;
            },

            /**
             * Strengthens connection weight for a single peer.
             */
            to: function () {
                var delta = {},
                    last = arguments.length - 1,
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

                    // storing changed peer in delta
                    delta[node.load] = node;
                }

                // storing changed node in delta
                delta[this.load] = this;

                // calling change handler
                if (typeof self.handler === 'function') {
                    self.handler(delta);
                }

                return this;
            },

            //////////////////////////////
            // JSON

            /**
             * Reconstructs Node object from JSON data.
             * @static
             * @param json {object} De-serialized JSON.
             * @param json.load {string}
             * @param json.peers {object}
             * @return {prime.Node}
             */
            fromJSON: function (json) {
                return self.create(
                    json.load,

                    // initializing peers form JSON
                    $Peers.fromJSON(json.peers)
                );
            }
        });

    return self;
}, prime.Peers);
