/**
 * Association Engine Graph
 *
 * Static class that is an API to prime.Node offering graph-level functionality.
 * Such as serialization and de-serialization, and re-initialization.
 */
/*global dessert, troop, sntls, prime */
troop.promise(prime, 'Graph', function () {
    "use strict";

    var base = sntls.Collection.of(prime.Node);

    /**
     * @class prime.Graph
     * @extends sntls.Collection
     * @extends prime.Node
     * @extends sntls.Profiled
     */
    prime.Graph = base.extend()
        .addTrait(sntls.Profiled)
        .addConstant(/** @lends prime.Graph */{
            /**
             * Identifies graph profile in the profile collection.
             */
            PROFILE_ID: 'graph'
        })
        .addMethod(/** @lends prime.Graph */{
            /**
             * @name prime.Graph.create
             * @return {prime.Graph}
             */

            /**
             */
            init: function () {
                this.initProfiled(this.PROFILE_ID);

                base.init.call(this);
            },

            /**
             * Retrieves a node from the graph's registry.
             * Creates one on demand.
             * @param {string} load
             * @return {prime.Node}
             */
            fetchNode: function (load) {
                dessert.isString(load, "Invalid node load");

                var node = this.getItem(load);

                if (!node) {
                    node = prime.Node.create(load, this.profile);
                    this.setItem(load, node);
                }

                return node;
            },

            /**
             * Generates a function that retrieves a node from the graph
             * based on
             * @return {function}
             */
            getFetcher: function () {
                return this.fetchNode.bind(this);
            },

            /**
             * Connects two nodes, wear may be specified.
             * @param {string} localLoad
             * @param {string} remoteLoad
             * @param {number} [forwardWear]
             * @param {number} [backwardsWear]
             * @return {prime.Graph}
             */
            pairNodes: function (localLoad, remoteLoad, forwardWear, backwardsWear) {
                var localNode = this.fetchNode(localLoad),
                    remoteNode = this.fetchNode(remoteLoad);

                localNode.connectTo(remoteNode, forwardWear, backwardsWear);

                return this;
            },

            /**
             * Convenience shortcut for constructing sub-graphs out of load literals.
             * @param {string} load Node load.
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
             * @see prime.Graph.connectNodes
             */
            getConnector: function () {
                return this.connectNodes.bind(this);
            },

            /**
             * Sets a node on the graph
             * @param {string} load
             * @param {prime.Node} node
             */
            setItem: function (load, node) {
                dessert.isNode(node, "Invalid node");
                base.setItem.call(this, load, node);
                return this;
            },

            deleteItem: function () {
                dessert.assert(false, "Can't remove node from graph");
            },

            clone: function () {
                dessert.assert(false, "Can't clone graph");
            },

            clear: function () {
                dessert.assert(false, "Can't remove nodes from graph");
            },

            /**
             * Adds node(s) to the current graph.
             * @param {prime.Node} node
             * Argument may be followed by any number of subsequent nodes.
             * @return {prime.Graph}
             */
            addNode: function (node) {
                var i;

                for (i = 0; i < arguments.length; i++) {
                    node = arguments[i];
                    this.setItem(node.load, node);
                }

                return this;
            },

            /**
             * Rebuilds weighted indexes for all nodes.
             * @return {prime.Graph}
             */
            rebuildIndexes: function () {
                this.getPeers()
                    .callOnEachItem('rebuildIndex');

                return this;
            },

            toJSON: function () {
                return this.items;
            }
        });
});
