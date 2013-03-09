/**
 * Peer
 *
 * Describes connection between two nodes.
 */
/*global dessert, troop, sntls, prime */
troop.promise(prime, 'Peer', function () {
    /**
     * @class prime.Peer
     * @extends troop.Base
     * @borrows sntls.Profiled
     */
    var self = troop.Base.extend()
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
             * @param {Node} node Peer node.
             * @param {sntls.ProfileCollection} [profile]
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
                return this.profile.getItem(self.PROFILE_ID)
                    .getCount(self.TREAD_COUNTER_NAME);
            },

            //////////////////////////////
            // Graph methods

            /**
             * Changes connection tread.
             * @param {number} [value] Wear amount.
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

    return self;
});

troop.promise(prime, 'PeerCollection', function (prime) {
    /**
     * @class prime.PeerCollection
     * @extends sntls.Collection
     * @borrows prime.Peer
     */
    return sntls.Collection.of(prime.Peer);
});

dessert.addTypes(/** @lends dessert */{
    isPeer: function (expr) {
        return prime.Peer.isBaseOf(expr);
    },

    isPeerOptional: function (expr) {
        return typeof expr === 'undefined' ||
               prime.Peer.isBaseOf(expr);
    }
});

