/**
 * Association Engine Graph
 *
 * Static class that is an API to prime.Node offering graph-level functionality.
 * Such as serialization and de-serialization, and re-initialization.
 */
/*global prime, troop */
troop.promise(prime, 'Graph', function (ns, className, Node) {
    var self = prime.Graph = troop.Base.extend()
        .addMethod({
            //////////////////////////////
            // Control

            /**
             * Resets datastore by emptying the registry.
             * @static
             */
            reset: function () {
                Node.nodes = {};
            },

            /**
             * Rebuilds weighted indexes for all nodes.
             */
            rebuildIndexes: function () {
                var nodes = Node.nodes,
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
                return Node.nodes;
            },

            /**
             * Reconstructs node collection from JSON.
             * @param json {object} De-serialized JSON.
             * @static
             */
            fromJSON: function (json) {
                var Node = prime.Node,
                    load;

                self.reset();

                // re-building registry based on json data
                for (load in json) {
                    if (json.hasOwnProperty(load)) {
                        Node.fromJSON(load, json[load]);
                    }
                }

                return Node;
            }
        });

    return self;
}, prime.Node);
