/**
 * Association Engine Graph
 *
 * Static class that is an API to prime.Node offering graph-level functionality.
 * Such as serialization and de-serialization, and re-initialization.
 */
/*global dessert, troop, sntls, prime */
troop.promise(prime, 'Graph', function (prime) {
    var self = prime.Graph = troop.Base.extend()
        .addTrait(sntls.Profiled)
        .addConstant({
            /**
             * Identifies graph profile in the profile collection.
             */
            PROFILE_ID: 'graph'
        })
        .addMethod({
            /**
             * @constructor
             */
            init: function () {
                this
                    .initProfiled(self.PROFILE_ID)
                    .addPrivate({
                        /**
                         * Registry all nodes in the system.
                         * @type {NodeCollection}
                         * @static
                         */
                        _nodeCollection: prime.NodeCollection.create()
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
            fetchNode: function (load) {
                dessert.isString(load, "Invalid node load");

                var nodeCollection = this._nodeCollection,
                    node = nodeCollection.getItem(load);

                if (!node) {
                    node = prime.Node.create(load, this.profile);
                    nodeCollection.setItem(load, node);
                }

                return node;
            },

            /**
             * Generates a function that retrieves a node from the graph
             * based on
             * @return {function}
             */
            getFetcher: function () {
                return self.fetchNode.bind(this);
            },

            /**
             * Connects two nodes, wear may be specified.
             * @param localLoad {string}
             * @param remoteLoad {string}
             * @param [forwardWear] {number}
             * @param [backwardsWear] {number}
             */
            pairNodes: function (localLoad, remoteLoad, forwardWear, backwardsWear) {
                var localNode = this.fetchNode(localLoad),
                    remoteNode = this.fetchNode(remoteLoad);

                localNode.connectTo(remoteNode, forwardWear, backwardsWear);

                return this;
            },

            /**
             * Convenience shortcut for constructing sub-graphs out of load literals.
             * @param load {string} Node load.
             * Argument `load` is followed by any number of remote loads.
             * @return {string} The first argument.
             */
            connectNodes: function (load) {
                var node = this.fetchNode(load),
                    i;

                // connecting node to remotes
                for (i = 1; i < arguments.length; i++) {
                    this.fetchNode(arguments[i])
                        .to(node);
                }

                return load;
            },

            /**
             * Generates a function that can be used to create and
             * connect nodes on the current graph, ie. to build the graph.
             * @return {function}
             * @see Graph.connectNodes
             */
            getConnector: function () {
                return self.connectNodes.bind(this);
            },

            //////////////////////////////
            // Control

            /**
             * Adds node(s) to the current graph.
             * @param node {Node}
             * Argument may be followed by any number of subsequent nodes.
             */
            addNode: function (node) {
                var nodeCollection = this._nodeCollection,
                    i;

                for (i = 0; i < arguments.length; i++) {
                    node = arguments[i];
                    dessert.isNode(node, "Invalid node");
                    nodeCollection.setItem(node.load, node);
                }

                return this;
            },

            /**
             * Rebuilds weighted indexes for all nodes.
             */
            rebuildIndexes: function () {
                this._nodeCollection.getPeers().callEach('rebuildIndex');

                return this;
            },

            //////////////////////////////
            // JSON

            toJSON: function () {
                return this._nodeCollection.items;
            }
        });
});
