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
        },

        /**
         * Sets a value on the path specified by argument list.
         * Last param is the value.
         * @param object {object} Root object.
         */
        set: function (object) {
            var tmp = object,
                length = arguments.length - 2,
                i, key;
            for (i = 1; i < length; i++) {
                key = arguments[i];
                if (typeof tmp[key] !== 'object') {
                    tmp[key] = {};
                }
                tmp = tmp[key];
            }
            tmp[arguments[i]] = arguments[i+1];
        },

        /**
         * Creates shallow copy of object.
         * @param object {object} Object to be copied.
         * @returns {object} Object copy.
         */
        shallow: function (object) {
            var result = {},
                key;
            for (key in object) {
                if (object.hasOwnProperty(key)) {
                    result[key] = object[key];
                }
            }
            return result;
        }
    };
}());
