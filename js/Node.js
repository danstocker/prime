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
            registry: {},

            /**
             * Probability of sub-sequential hops
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
            // Utils

            /**
             * Adds node to lookup when it's not already there.
             */
            register: function () {
                var load = this.load,
                    registry = self.registry;
                if (!registry.hasOwnProperty(load)) {
                    registry[load] = this;
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
                return this.peers.byLoad[node.load];
            },

            /**
             * Hops to a peer node randomly, weighted by tread.
             * TODO: For when node has no peers, return completely random node.
             * @returns {prime.Node}
             */
            hop: function () {
                var next = this.peers.random().node;
                if (Math.random() < self.reach) {
                    return next.hop();
                } else {
                    return next;
                }
            },

            /**
             * Strengthens connection weight for a single peer.
             */
            to: function () {
                var last = arguments.length - 1,
                    node, wear,
                    i;

                if (typeof arguments[last] === 'number') {
                    wear = arguments[last];
                    last--;
                }

                for (i = 0; i <= last; i++) {
                    node = arguments[i];
                    this.peers.tread(node, wear);
                    node.peers.tread(this, wear);
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
        registry = Node.registry;

    if (registry.hasOwnProperty(load)) {
        // node exists in lookup, fetching
        return registry[load];
    } else {
        // new load, creating node
        return Node.create(load)
            .register();
    }
};
