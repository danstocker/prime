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
            registry: {}
        }).addMethod({
            /**
             * Retrieves a node from the graph or creates a new one.
             * @param load {string} Node load.
             * @return {prime.Node}
             */
            node: function (load) {
                // shortcuts and local variable
                var Node = prime.Node,
                    registry = self.registry;

                if (registry.hasOwnProperty(load)) {
                    // node exists in lookup, fetching
                    return registry[load];
                } else {
                    // new load, creating node
                    return self.register(Node.create(load));
                }
            },

            /**
             * Adds node to lookup when it's not already there.
             */
            register: function (node) {
                var load = node.load,
                    registry = self.registry;

                if (!registry.hasOwnProperty(load)) {
                    registry[load] = node;
                }

                return node;
            },

            /**
             * Resets datastore by emptying the registry.
             * @static
             */
            reset: function () {
                this.registry = {};
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
                        self.register(Node.fromJSON(json[load]));
                    }
                }

                return self.registry;
            }
        });

    troop.properties.addMethod.call(prime, {
        node: self.node
    });

    return self;
});
