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
     * @extends sntls.Profiled
     */
    prime.Peer = troop.Base.extend()
        .addTrait(sntls.Profiled)
        .addConstant(/** @lends prime.Peer */{
            /**
             * Identifies peer profile in the profile collection.
             */
            PROFILE_ID: 'peer',

            /**
             * Identifies counter in profile.
             */
            TREAD_COUNTER_NAME: 'tread'
        })
        .addMethod(/** @lends prime.Peer */{
            //////////////////////////////
            // OOP

            /**
             * Initializes a new peer.
             * @param {prime.Node} node Peer node.
             * @param {sntls.ProfileCollection} [profile]
             */
            init: function (node, profile) {
                this
                    .initProfiled(this.PROFILE_ID, profile)
                    .addConstant(/** @lends prime.Peer */{
                        /**
                         * Peer node
                         * @type {prime.Node}
                         */
                        node: node
                    });
            },

            //////////////////////////////
            // Getters, setters

            /**
             * Simple getter for peer tread
             * @return {number}
             */
            getTread: function () {
                return this.profile.getItem(this.PROFILE_ID)
                    .getCount(this.TREAD_COUNTER_NAME);
            },

            //////////////////////////////
            // Graph methods

            /**
             * Changes connection tread.
             * @param {number} [value] Wear amount.
             * @return {prime.Peer}
             */
            wear: function (value) {
                // setting tread
                this.profile
                    .inc(this.TREAD_COUNTER_NAME, value);

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
    /**
     * @class prime.PeerCollection
     * @extends sntls.Collection
     * @extends prime.Peer
     */
    prime.PeerCollection = sntls.Collection.of(prime.Peer);
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

