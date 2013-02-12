/**
 * Peer
 *
 * Describes connection between two nodes.
 */
/*global dessert, troop, sntls, prime */
troop.promise(prime, 'Peer', function (prime) {
    /**
     * @class Represents connection to another node.
     * @requires prime.Node
     */
    var self = prime.Peer = troop.Base.extend()
        .addTrait(sntls.Profiled)
        .addConstant({
            /**
             * Identifies peer profile in the profile collection.
             */
            PROFILE_ID: 'peer',

            /**
             * Identifies counter in profile.
             */
            TREAD_COUNTER_NAME: 'tread'
        })
        .addMethod({
            //////////////////////////////
            // OOP

            /**
             * Initializes a new peer.
             * @param node {Node} Peer node.
             * @param [profile] {sntls.ProfileCollection}
             */
            init: function (node, profile) {
                this
                    .initProfiled(self.PROFILE_ID, profile)
                    .addConstant({
                        /**
                         * Peer node
                         * @type {Node}
                         */
                        node: node
                    });
            },

            //////////////////////////////
            // Getters, setters

            /**
             * Simple getter for peer tread
             */
            getTread: function () {
                return this.profile.get(self.PROFILE_ID)
                    .counter(self.TREAD_COUNTER_NAME);
            },

            //////////////////////////////
            // Graph methods

            /**
             * Changes connection tread.
             * @param [value] {number} Wear amount.
             */
            wear: function (value) {
                // setting tread
                this.profile
                    .inc(self.TREAD_COUNTER_NAME, value);

                return this;
            },

            //////////////////////////////
            // JSON

            toJSON: function () {
                return this.getTread();
            }
        });
});

troop.promise(prime, 'PeerCollection', function (prime) {
    prime.PeerCollection = sntls.Collection.of(prime.Peer);
});

dessert.addTypes({
    isPeer: function (expr) {
        return prime.Peer.isPrototypeOf(expr);
    },

    isPeerOptional: function (expr) {
        return typeof expr === 'undefined' ||
               prime.Peer.isPrototypeOf(expr);
    }
});

