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
                var node = this.nodes.get(load);
                if (!node) {
                    node = prime.Node.create(load);
                    this.nodes.set(load, node);
                }
                return node;
            },

            //////////////////////////////
            // Control

            /**
             * Adds node(s) to the current graph.
             * @param node {Node}
             */
            addNode: function (node) {
                var i;
                for (i = 0; i < arguments.length; i++) {
                    node = arguments[i];
                    if (dessert.validators.isNode(node)) {
                        this.nodes.set(node.load, node);
                    }
                }

                return this;
            },

            /**
             * Resets datastore by emptying the registry.
             * @static
             */
            reset: function () {
                this.nodes.clear();

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

    return self;
});
