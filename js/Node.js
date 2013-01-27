/**
 * Conceptual Node
 *
 * Nodes are the central building blocks of the Association Engine.
 */
/*global prime, dessert, troop, sntls */
troop.promise('prime.Node', function (prime) {
    var self;

    dessert.addTypes({
        isNode: function (expr) {
            return self.isPrototypeOf(expr);
        },

        isNodeOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   self.isPrototypeOf(expr);
        }
    });

    /**
     * Conceptual node. Basic component of the association engine.
     * @class Represents a graph node.
     * @requires Peers
     */
    self = prime.Node = troop.Base.extend()
        .addConstant({
            /**
             * Probability of sub-sequential hops.
             * Must be 0 < reach < 1.
             * @static
             * @type {number}
             */
            REACH: 0.5
        })
        .addMethod({
            //////////////////////////////
            // OOP

            /**
             * Initializes node.
             * @constructor
             * @param load {string} Node load.
             * @param [peers] {Peers} Initial node peers.
             */
            init: function (load, peers) {
                dessert.isString(load);

                peers = prime.Peers.isPrototypeOf(peers) ?
                    peers :
                    prime.Peers.create();

                this.addConstant({
                    /**
                     * String wrapped inside node.
                     * @type {string}
                     */
                    load: load,

                    /**
                     * Collection of nodes connected to current node
                     * @type {Peers}
                     */
                    peers: peers
                });
            },

            /**
             * Simple getter for peer collection.
             * To be used with specified collection methods.
             * @return {Peers}
             */
            getPeers: function () {
                return this.peers;
            },

            //////////////////////////////
            // Graph methods

            /**
             * Retrieves a peer object for a given node.
             * When node is not a peer, returns undefined.
             * @param node {Node}
             * @return {Peer}
             */
            peer: function (node) {
                return this.peers.get(node.load);
            },

            /**
             * Hops to a peer node randomly, weighted by tread.
             * @returns {Node}
             */
            hop: function () {
                if (!this.peers.count) {
                    // node has no peers, hops to itself
                    return this;
                }

                /**
                 * Taking random peer.
                 * @see Peers.random
                 */
                var next = this.peers.random().node;

                // making another jump at chance
                if (Math.random() < self.REACH) {
                    next = next.hop();
                }

                return next;
            },

            /**
             * Strengthens connection weight between this node and remote node.
             * @param remoteNode {Node}
             * @param [forwardWear] {number}
             * @param [backwardsWear] {number}
             */
            to: function (remoteNode, forwardWear, backwardsWear) {
                dessert.isNode(remoteNode);

                backwardsWear = backwardsWear || forwardWear;

                // updating peer tread in both directions
                this.peers.tread(remoteNode.load, forwardWear);
                remoteNode.peers.tread(this.load, backwardsWear);

                return this;
            },

            //////////////////////////////
            // JSON

            toJSON: function () {
                return this.peers.items;
            },

            /**
             * Reconstructs Node object from JSON data.
             * @param load {string}
             * @param json {object} De-serialized JSON.
             * @param json.load {string}
             * @param json.peers {object}
             * @return {Node}
             * @static
             * @see Node.init
             */
            fromJSON: function (load, json) {
                return self.create(
                    load,

                    // initializing peers form JSON
                    prime.Peers.fromJSON(json)
                );
            }
        });

    return self;
});

troop.promise('prime.NodeCollection', function (prime) {
    prime.NodeCollection = sntls.Collection.of(prime.Node);
});
