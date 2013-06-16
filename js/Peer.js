/**
 * Peer
 *
 * Describes connection between two nodes.
 */
/*global dessert, troop, sntls, prime */
troop.postpone(prime, 'Peer', function () {
    "use strict";

    /**
     * @class prime.Peer
     * @extends troop.Base
     * @extends sntls.Profiled
     */
    prime.Peer = troop.Base.extend()
        .addTrait(sntls.Profiled)
        .addConstants(/** @lends prime.Peer */{
            /**
             * Identifies peer profile in the profile collection.
             */
            PROFILE_ID: 'peer',

            /**
             * Identifies counter in profile.
             */
            TREAD_COUNTER_NAME: 'tread'
        })
        .addMethods(/** @lends prime.Peer */{
            /**
             * @name prime.Peer.create
             * @return {prime.Peer}
             */

            /**
             * Initializes a new peer.
             * @param {prime.Node} node Peer node.
             * @param {sntls.ProfileCollection} [profile]
             */
            init: function (node, profile) {
                this.initProfiled(this.PROFILE_ID, profile);

                /**
                 * Peer node
                 * @type {prime.Node}
                 */
                this.node = node;
            },

            /**
             * Simple getter for peer tread
             * @return {number}
             */
            getTread: function () {
                return this.profile.getItem(this.PROFILE_ID)
                    .getCount(this.TREAD_COUNTER_NAME);
            },

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

            toJSON: function () {
                return this.getTread();
            }
        });
});

troop.postpone(prime, 'PeerCollection', function () {
    "use strict";

    /**
     * @class prime.PeerCollection
     * @extends sntls.Collection
     * @extends prime.Peer
     */
    prime.PeerCollection = sntls.Collection.of(prime.Peer);

    /**
     * @name prime.PeerCollection.create
     * @return {prime.PeerCollection}
     */
});

(function () {
    "use strict";

    var Peer = prime.Peer;

    dessert.addTypes(/** @lends dessert */{
        isPeer: function (expr) {
            return Peer.isBaseOf(expr);
        },

        isPeerOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   Peer.isBaseOf(expr);
        }
    });
}());
