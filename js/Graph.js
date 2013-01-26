/**
 * Association Engine Graph
 *
 * Static class that is an API to prime.Node offering graph-level functionality.
 * Such as serialization and de-serialization, and re-initialization.
 */
/*global prime, troop, sntls */
troop.promise('prime.Graph', function (prime, className, Node) {
    var self = prime.Graph = troop.Base.extend()
        .addPublic({
            /**
             * Registry all nodes in the system.
             * @type {object}
             * @static
             */
            nodes: prime.NodeCollection.create()
        })
        .addMethod({
            //////////////////////////////
            // Control

            /**
             * Resets datastore by emptying the registry.
             * @static
             */
            reset: function () {
                self.nodes.clear();
            },

            /**
             * Rebuilds weighted indexes for all nodes.
             * TODO: should be making use of the specified collection features
             */
            rebuildIndexes: function () {
                self.nodes.forEach(function () {
                    this.peers.rebuildIndex();
                });
            },

            //////////////////////////////
            // JSON

            toJSON: function () {
                return self.nodes.items;
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

                return self;
            }
        });

    return self;
}, prime.Node);
