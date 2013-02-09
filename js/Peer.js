/**
 * Peer
 *
 * Describes connection between two nodes.
 */
/*global dessert, troop, sntls */
troop.promise('prime.Peer', function (prime) {
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
             * @param load {string} Peer load.
             * @param profile {sntls.ProfileCollection}
             */
            init: function (load, profile) {
                this
                    .initProfiled(self.PROFILE_ID, profile)
                    .addConstant({
                        /**
                         * Peer node
                         * @type {Node}
                         */
                        node: prime.Node.create(load)
                    });
            },

            //////////////////////////////
            // Graph methods

            /**
             * Simple getter for peer tread
             */
            tread: function () {
                return this.profile.get(self.PROFILE_ID)
                    .counter(self.TREAD_COUNTER_NAME);
            },

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
                return this.tread();
            },

            /**
             * Reconstructs Peer object from JSON data.
             * @static
             * @param load {string} Peer node's load.
             * @param tread {number|string} De-serialized JSON.
             * @return {Peer}
             */
            fromJSON: function (load, tread) {
                return self.create(load)
                    .wear(tread);
            }
        });
});

troop.promise('prime.PeerCollection', function (prime) {
    prime.PeerCollection = sntls.Collection.of(prime.Peer);
});

/*global prime */
dessert.addTypes({
    isPeer: function (expr) {
        return prime.Peer.isPrototypeOf(expr);
    },

    isPeerOptional: function (expr) {
        return typeof expr === 'undefined' ||
               prime.Peer.isPrototypeOf(expr);
    }
});

