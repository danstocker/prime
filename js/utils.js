/**
 * Utilities
 *
 * Various general utility functions used by the Association Engine.
 *
 * (c) 2012 by Dan Stocker
 */
var prime = prime || {};

(function () {
    prime.utils = {
        /**
         * Obtains key of an object.
         * @param object {object}
         * @returns {string[]} Object key names.
         */
        keys:function (object) {
            var result = [],
                key;
            for (key in object) {
                if (object.hasOwnProperty(key)) {
                    result.push(key);
                }
            }
            return result;
        }
    };
}());
