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
             * Resets datastore by emptying the registry.
             * @static
             */
            reset: function () {
                self.nodes = {};
            },

            /**
             * Rebuilds weighted indexes for all nodes.
             */
            rebuildIndexes: function () {
                var nodes = self.nodes,
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
                    load;

                // emptying registry
                self.reset();

                // re-building registry based on json data
                for (load in json) {
                    if (json.hasOwnProperty(load)) {
                        Node.fromJSON(load, json[load]);
                    }
                }

                return self;
            }
        });

    return self;
});
