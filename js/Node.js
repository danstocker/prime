/**
 * Conceptual Node
 *
 * Nodes are the central building blocks of the Association Engine.
 */
/*global dessert, troop, sntls, prime */
troop.promise(prime, 'Node', function () {
    /**
     * Conceptual node. Basic component of the association engine.
     * @class prime.Node
     * @extends troop.Base
     */
    prime.Node = troop.Base.extend()
        .addConstant(/** @lends prime.Node */{
            /**
             * Probability of sub-sequential hops.
             * Must be 0 < reach < 1.
             * @static
             * @type {number}
             */
            REACH: 0.5
        })
        .addMethod(/** @lends prime.Node */{
            //////////////////////////////
            // OOP

            /**
             * Initializes node.
             * @constructor
             * @param {string} load Node load.
             * @param {sntls.ProfileCollection} [profile]
             */
            init: function (load, profile) {
                dessert.isString(load, "Invalid node load");

                /**
                 * String wrapped inside node.
                 * @type {string}
                 */
                this.load = load;

                /**
                 * Collection of node references connected to current node
                 * @type {prime.Peers}
                 */
                this.peers = prime.Peers.create(profile);
            },

            //////////////////////////////
            // Getters, setters

            /**
             * Simple getter for peer collection.
             * To be used with specified collection methods.
             * @return {prime.Peers}
             */
            getPeers: function () {
                return this.peers;
            },

            /**
             * Determines whether a given node is peer to
             * the current node.
             * @param {prime.Node} node
             * @return {Boolean}
             */
            isPeerNode: function (node) {
                return this.peers.getPeer(node.load) ? true : false;
            },

            //////////////////////////////
            // Graph methods

            /**
             * Hops to a peer node randomly, weighted by tread.
             * @returns {prime.Node}
             */
            getRandomPeerNode: function () {
                if (!this.peers.getPeerCount()) {
                    // node has no peers, hops to itself
                    return this;
                }

                /**
                 * Taking random peer.
                 * @type {prime.Node}
                 * @see prime.Peers.getRandomPeer
                 */
                var next = this.peers.getRandomPeer().node;

                // making another jump at chance
                if (Math.random() < this.REACH) {
                    next = next.getRandomPeerNode();
                }

                return next;
            },

            /**
             * Strengthens connection weight between this node and remote node.
             * @param {prime.Node} remoteNode
             * @param {number} [forwardWear]
             * @param {number} [backwardsWear]
             * @return {prime.Index}
             */
            connectTo: function (remoteNode, forwardWear, backwardsWear) {
                dessert.isNode(remoteNode, "Invalid remote node");

                // updating peer tread in both directions
                this.peers.tread(remoteNode, forwardWear);
                remoteNode.peers.tread(this, backwardsWear || forwardWear);

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
    prime.Node.addMethod(/** @lends prime.Node */{
        hop: prime.Node.getRandomPeerNode,
        to : prime.Node.connectTo
    });
});

troop.promise(prime, 'NodeCollection', function () {
    /**
     * @class prime.NodeCollection
     * @extends sntls.Collection
     * @extends prime.Node
     */
    prime.NodeCollection = sntls.Collection.of(prime.Node);
});

dessert.addTypes(/** @lends dessert */{
    isNode: function (expr) {
        return prime.Node.isBaseOf(expr);
    },

    isNodeOptional: function (expr) {
        return typeof expr === 'undefined' ||
               prime.Node.isBaseOf(expr);
    }
});
