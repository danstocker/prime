/**
 * Conceptual Node
 *
 * Nodes are the central building blocks of the Association Engine.
 */
/*global dessert, troop, sntls, prime */
troop.promise(prime, 'Node', function (prime) {
    /**
     * Conceptual node. Basic component of the association engine.
     * @class Represents a graph node.
     * @requires Peers
     */
    var self = prime.Node = troop.Base.extend()
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
             * @param [profile] {sntls.ProfileCollection}
             */
            init: function (load, profile) {
                dessert.isString(load);

                this.addConstant({
                    /**
                     * String wrapped inside node.
                     * @type {string}
                     */
                    load: load,

                    /**
                     * Collection of node references connected to current node
                     * @type {Peers}
                     */
                    peers: prime.Peers.create(profile)
                });
            },

            //////////////////////////////
            // Getters, setters

            /**
             * Simple getter for peer collection.
             * To be used with specified collection methods.
             * @return {Peers}
             */
            getPeers: function () {
                return this.peers;
            },

            /**
             * Determines whether a given node is peer to
             * the current node.
             * @param node {Node}
             * @return {Boolean}
             */
            isPeerNode: function (node) {
                return this.peers.getPeer(node.load) ? true : false;
            },

            //////////////////////////////
            // Graph methods

            /**
             * Hops to a peer node randomly, weighted by tread.
             * @returns {Node}
             */
            getRandomPeerNode: function () {
                if (!this.peers.count) {
                    // node has no peers, hops to itself
                    return this;
                }

                /**
                 * Taking random peer.
                 * @see Peers.getRandomPeer
                 */
                var next = this.peers.getRandomPeer().node;

                // making another jump at chance
                if (Math.random() < self.REACH) {
                    next = next.getRandomPeerNode();
                }

                return next;
            },

            /**
             * Strengthens connection weight between this node and remote node.
             * @param remoteNode {Node}
             * @param [forwardWear] {number}
             * @param [backwardsWear] {number}
             */
            connectTo: function (remoteNode, forwardWear, backwardsWear) {
                dessert.isNode(remoteNode);

                backwardsWear = backwardsWear || forwardWear;

                // updating peer tread in both directions
                this.peers.tread(remoteNode, forwardWear);
                remoteNode.peers.tread(this, backwardsWear);

                return this;
            },

            //////////////////////////////
            // JSON

            toJSON: function () {
                return this.peers.toJSON();
            }
        });

    /**
     * Shortcuts
     */
    self.addMethod({
        hop: self.getRandomPeerNode,
        to : self.connectTo
    });
});

troop.promise(prime, 'NodeCollection', function (prime) {
    prime.NodeCollection = sntls.Collection.of(prime.Node);
});

dessert.addTypes({
    isNode: function (expr) {
        return prime.Node.isPrototypeOf(expr);
    },

    isNodeOptional: function (expr) {
        return typeof expr === 'undefined' ||
               prime.Node.isPrototypeOf(expr);
    }
});
