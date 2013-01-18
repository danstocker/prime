/**
 * Conceptual Node
 *
 * Nodes are the central building blocks of the Association Engine.
 */
/*global prime, troop */
troop.promise('prime.Node', function (prime, className, Peers) {
    /**
     * Conceptual node. Basic component of the association engine.
     * @class Represents a graph node.
     * @requires prime.Peers
     */
    var self = prime.Node = troop.Base.extend()
        .addConstant({
            /**
             * Probability of sub-sequential hops.
             * Must be 0 < reach < 1.
             * @static
             * @type {number}
             */
            reach: 0.5
        })
        .addPublic({
            /**
             * Registry all nodes in the system.
             * @type {object}
             * @static
             */
            nodes: {},

            /**
             * Total number of nodes.
             * @type {number}
             * @static
             */
            count: 0
        })
        .addMethod({
            //////////////////////////////
            // OOP

            /**
             * Initializes node.
             * @constructor
             * @param load {string} Node load.
             * @param [peers] {prime.Peers} Initial node peers.
             */
            init: function (load, peers) {
                var nodes = self.nodes;

                if (nodes.hasOwnProperty(load)) {
                    return nodes[load];
                }

                this.addConstant({
                    /**
                     * String wrapped inside node.
                     * @type {string}
                     */
                    load: load,

                    /**
                     * Collection of nodes connected to current node
                     * @type {prime.Peers}
                     */
                    peers: Peers.isPrototypeOf(peers) ?
                        peers :
                        Peers.create()
                });

                // adding node to registry
                self.nodes[load] = this;
                self.count++;
            },

            /**
             * Accesses a node in the graph. Creates it on demand.
             * Arguments may be either nodes or strings (load).
             * @param node {prime.Node|string} Node (load).
             * @return {prime.Node} A node in the graph.
             * @see prime.Node.init
             * @static
             */
            $: function (node /*, node1, node2, ...*/) {
                if (typeof node === 'string') {
                    // current node specified through load
                    node = self.create(node);
                }

                var i, remoteNode;

                // connecting node to remotes
                for (i = 1; i < arguments.length; i++) {
                    remoteNode = arguments[i];
                    if (typeof remoteNode === 'string') {
                        // remote node specified through load
                        node.to(self.create(remoteNode));
                    } else if (self.isPrototypeOf(remoteNode)) {
                        // remote node passed as node object
                        node.to(remoteNode);
                    }
                }

                return node;
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
                var next = self.nodes[this.peers.random().load];

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
             * @param load {string}
             * @param json {object} De-serialized JSON.
             * @param json.load {string}
             * @param json.peers {object}
             * @return {prime.Node}
             * @static
             * @see prime.Node.init
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
}, prime.Peers);

troop.promise('prime.$', function (prime) {
    return prime.Node.$;
});
