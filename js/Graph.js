/**
 * Association Engine Graph
 */
/*global prime, troop */
troop.promise(prime, 'Graph', function () {
    var self = prime.Graph = troop.base.extend()
        .addMethod({
            /**
             * @constructor
             */
            init: function () {
                /**
                 * System-wide registry of nodes.
                 */
                this.nodes = {};
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
                    graph = Node.graph,
                    load;

                // emptying registry
                graph.reset();

                // re-building registry based on json data
                for (load in json) {
                    if (json.hasOwnProperty(load)) {
                        Node.fromJSON(load, json[load]);
                    }
                }

                return graph;
            }
        });

    return self;
});
