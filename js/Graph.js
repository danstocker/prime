/**
 * Association Engine Graph
 */
/*global prime, troop */
troop.promise(prime, 'Graph', function () {
    var self = prime.Graph = troop.base.extend()
        .addPublic({
            /**
             * System-wide registry of nodes
             * @static
             */
            nodes: {}
        }).addMethod({
            /**
             * Retrieves a node from the graph or creates a new one.
             * @param load {string} Node load.
             * @return {prime.Node}
             */
            node: function (load) {
                // shortcuts and local variable
                var Node = prime.Node,
                    nodes = self.nodes;

                if (nodes.hasOwnProperty(load)) {
                    // node exists in lookup, fetching
                    return nodes[load];
                } else {
                    // new load, creating node
                    return Node.create(load);
                }
            },

            /**
             * Resets datastore by emptying the registry.
             * @static
             */
            reset: function () {
                this.nodes = {};
            },

            //////////////////////////////
            // JSON

            /**
             * Reconstructs node collection from JSON.
             * @param json {object} De-serialized JSON.
             */
            fromJSON: function (json) {
                var Node = prime.Node,
                    load;

                // emptying registry
                self.reset();

                // re-building registry based on json data
                for (load in json) {
                    if (json.hasOwnProperty(load)) {
                        Node.fromJSON(json[load]);
                    }
                }

                return self.nodes;
            }
        });

    troop.properties.addMethod.call(prime, {
        node: self.node
    });

    return self;
});
