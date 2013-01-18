/**
 * Utilities
 *
 * Various general utility functions used by the Association Engine.
 */
/*global prime, troop */
troop.promise('prime.utils', function (prime) {
    /**
     * @namespace Holds various utility functions.
     */
    prime.utils = troop.Base.extend()
        .addMethod({
            /**
             * Tests whether an object is empty.
             * @param object {object} Test object.
             * @returns {boolean}
             */
            isEmpty: function (object) {
                var key;
                for (key in object) {
                    if (object.hasOwnProperty(key)) {
                        return false;
                    }
                }
                return true;
            },

            /**
             * Retrieves the first available key in the object.
             * @param object {object}
             * @return {string}
             */
            firstProperty: function (object) {
                var key;
                for (key in object) {
                    if (object.hasOwnProperty(key)) {
                        return key;
                    }
                }
                return undefined;
            }
        });
});
