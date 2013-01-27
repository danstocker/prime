/**
 * Association Engine Graph
 *
 * Static class that is an API to prime.Node offering graph-level functionality.
 * Such as serialization and de-serialization, and re-initialization.
 */
/*global prime, dessert, troop, sntls */
troop.promise('prime.Graph', function (prime) {
    var self = prime.Graph = troop.Base.extend()
        .addMethod({
            /**
             * @constructor
             */
            init: function () {
                this.addPublic({
                    /**
                     * Registry all nodes in the system.
                     * @type {NodeCollection}
                     * @static
                     */
                    nodes: prime.NodeCollection.create()
                });
            },

            //////////////////////////////
            // Getters, setters

            /**
             * Retrieves a node from the graph's registry.
             * Creates one on demand.
             * @param load {string}
             * @return {Node}
             */
            node: function (load) {
                dessert.isString(load);

                var node = this.nodes.get(load);
                if (!node) {
                    node = prime.Node.create(load);
                    this.nodes.set(load, node);
                }

                return node;
            },

            /**
             * Generates a function that retrieves a node from the graph
             * based on
             * @return {function}
             */
            accessor: function () {
                return self.node.bind(this);
            },

            /**
             * Convenience shortcut for constructing sub-graphs out of load literals.
             * @param load {string} Node load.
             * Argument `load` is followed by any number of remote loads.
             * @return {string} The first argument.
             */
            build: function (load) {
                var node = this.node(load),
                    i;

                // connecting node to remotes
                for (i = 1; i < arguments.length; i++) {
                    this.node(arguments[i])
                        .to(node);
                }

                return load;
            },

            /**
             * Generates a function that can be used to create and
             * connect nodes on the current graph, ie. to build the graph.
             * @return {function}
             * @see Graph.build
             */
            builder: function () {
                return self.build.bind(this);
            },

            //////////////////////////////
            // Control

            /**
             * Adds node(s) to the current graph.
             * @param node {Node}
             * Argument may be followed by any number of subsequent nodes.
             */
            addNode: function (node) {
                var i;
                for (i = 0; i < arguments.length; i++) {
                    node = arguments[i];
                    dessert.isNode(node);
                    this.nodes.set(node.load, node);
                }

                return this;
            },

            /**
             * Rebuilds weighted indexes for all nodes.
             */
            rebuildIndexes: function () {
                this.nodes.getPeers().callEach('rebuildIndex');

                return this;
            },

            //////////////////////////////
            // JSON

            toJSON: function () {
                return this.nodes.items;
            },

            /**
             * Reconstructs node collection from JSON.
             * @param json {object} De-serialized JSON.
             * @static
             */
            fromJSON: function (json) {
                var result = self.create(),
                    load;

                // re-building registry based on json data
                for (load in json) {
                    if (json.hasOwnProperty(load)) {
                        result.addNode(prime.Node.fromJSON(load, json[load]));
                    }
                }

                return result;
            }
        });
});
