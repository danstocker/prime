/**
 * Association Engine Graph
 */
/*global prime, troop */
troop.promise(prime, 'Graph', function () {
    var self = prime.Graph = troop.base.extend()
        .addMethod({
            //////////////////////////////
            // OOP

            /**
             * @constructor
             */
            init: function () {
                /**
                 * System-wide registry of nodes.
                 */
                this.nodes = {};
            },

            //////////////////////////////
            // Control

            /**
             * Adds node to graph.
             * @param node {prime.Node}
             */
            add: function (node) {
                var nodes = this.nodes,
                    load = node.load;
                if (!nodes.hasOwnProperty(load)) {
                    nodes[load] = node;
                }
            },

            /**
             * Accesses a node in the graph. Creates it on demand.
             * @param load {string} Node load.
             * @see prime.Node.init
             * @return {prime.Node} A node in the graph.
             */
            node: function (load /*, node1, node2, ...*/) {
                var Node = prime.Node,
                    nodes = this.nodes,
                    node,
                    i, remoteNode;

                if (nodes.hasOwnProperty(load)) {
                    node = nodes[load];
                } else {
                    node = Node.create(load, this);
                    this.add(node);
                }

                // connecting node to remotes
                for (i = 1; i < arguments.length; i++) {
                    remoteNode = arguments[i];
                    if (Node.isPrototypeOf(remoteNode)) {
                        node.to(remoteNode);
                    }
                }

                return node;
            },

            /**
             * Resets datastore by emptying the registry.
             * @static
             */
            reset: function () {
                this.nodes = {};
            },

            /**
             * Rebuilds weighted indexes for all nodes.
             */
            rebuildIndexes: function () {
                var nodes = this.nodes,
                    load;
                for (load in nodes) {
                    if (nodes.hasOwnProperty(load)) {
                        nodes[load].peers.rebuildIndex();
                    }
                }
            },

            //////////////////////////////
            // JSON

            toJSON: function () {
                return this.nodes;
            },

            /**
             * Reconstructs node collection from JSON.
             * @param json {object} De-serialized JSON.
             */
            fromJSON: function (json) {
                var Node = prime.Node,
                    graph = self.create(),
                    load;

                // re-building registry based on json data
                for (load in json) {
                    if (json.hasOwnProperty(load)) {
                        graph.add(Node.fromJSON(load, graph, json[load]));
                    }
                }

                return graph;
            }
        });

    return self;
});

troop.promise(prime, '$', function () {
    /**
     * Shortcut to Node.create.
     * @return {prime.Node}
     */
    var $ = prime.$ = function () {
        var graph = $.graph;
        return graph.node.apply(graph, arguments);
    };

    // adding graph reference to shortcut function
    $.graph = prime.Graph.create();

    return $;
});
