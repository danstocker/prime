/**
 * Weight Index
 *
 * Index of weighted entries. Weight serves as a basis for random retrieval.
 */
/*global troop, sntls, prime */
troop.promise(prime, 'Index', function () {
    var self;

    /**
     * @class prime.Index
     * @extends troop.Base
     * @extends sntls.Profiled
     */
    prime.Index = self = troop.Base.extend()
        .addTrait(sntls.Profiled)
        .addConstant(/** @lends prime.Index */{
            /**
             * Identifies index profile in the profile collection.
             */
            PROFILE_ID: 'index',

            /**
             * Identifies slot counter in profile
             */
            SLOT_COUNTER_NAME: 'slots'
        })
        .addMethod(/** @lends prime.Index */{
            /**
             * @constructor
             * @param {sntls.ProfileCollection} [profile]
             */
            init: function (profile) {
                this
                    .initProfiled(this.PROFILE_ID, profile)
                    .addPrivate(/** @lends prime.Index */{
                        /**
                         * List of peers in order identical to _totals.
                         * @type {number[]}
                         * @private
                         */
                        _weights: [],

                        /**
                         * Sorted index of total weights of preceding entries.
                         * Total weight is the cumulative weight of all slots.
                         * @type {number[]}
                         * @private
                         */
                        _totals: [],

                        /**
                         * List of loads.
                         * @type {string[]}
                         * @private
                         */
                        _loads: [],

                        /**
                         * Associates loads with their positions in the index.
                         * (Both loads and index positions are unique.)
                         * @type {Object}
                         * @private
                         */
                        _lookup: {},

                        /**
                         * Lookup for empty index entries first by weight, then by index position.
                         * Incoming entries first check here for a suitable position.
                         * @type {Object}
                         * @private
                         */
                        _slots: {}
                    })
                    .addPublic(/** @lends prime.Index */{
                        /**
                         * Next total weight. Equals to cumulative weight of all entries.
                         * @type {Number}
                         */
                        nextTotal: 0
                    });
            }
        })
        .addPrivateMethod(/** @lends prime.Index */{
            /**
             * Performs binary search in the index.
             * @this {number[]} Array to perform search on.
             * @param {number} value Value searched.
             * @param {number} [start] Start position of search range. Default: 0.
             * @param {number} [end] Ending position of search range. Default: this.length - 1.
             * @return {number|undefined}
             * @static
             */
            _bSearch: function (value, start, end) {
                start = start || 0;
                end = end || this.length - 1;

                var pos = Math.floor((start + end) / 2),
                    hit = this[pos];

                if (hit === value) {
                    // perfect hit
                    return pos;
                } else if (this[end] <= value) {
                    // end of range hit
                    return end;
                } else if (end - start <= 1) {
                    // between two adjacent values
                    return start;
                } else if (hit > value) {
                    // narrowing range to lower half
                    return self._bSearch.call(this, value, start, pos);
                } else if (hit < value) {
                    // narrowing range to upper half
                    return self._bSearch.call(this, value, pos, end);
                }
            }
        })
        .addMethod(/** @lends prime.Index */{
            /**
             * Adds index entry.
             * @param {string} load Entry load.
             * @param {number} weight Entry weight.
             * @return {prime.Index}
             */
            addEntry: function (load, weight) {
                var slots = this._slots,
                    pos; // position of new entry in the array buffers

                if (slots.hasOwnProperty(weight)) {
                    // there is an available empty slot
                    pos = prime.utils.firstProperty(slots[weight]);

                    // filling slot
                    this._loads[pos] = load;
                    this._lookup[load] = parseInt(pos, 10);

                    // removing slot
                    delete slots[weight][pos];
                    this.profile.dec(this.SLOT_COUNTER_NAME);
                    if (prime.utils.isEmpty(slots[weight])) {
                        // all empty slots for `weight` used up
                        delete slots[weight];
                    }
                } else {
                    // no empty spot available
                    // adding new entry to index
                    this._lookup[load] = this._loads.length;
                    this._loads.push(load);
                    this._totals.push(this.nextTotal);
                    this._weights.push(weight);
                    this.nextTotal += weight;
                }

                return this;
            },

            /**
             * Removes entry from index by adding position to slots.
             * @param {string} load Load of entry to be removed.
             * @return {prime.Index}
             */
            removeEntry: function (load) {
                var pos = this._lookup[load],
                    slots = this._slots,
                    weight = this._weights[pos];

                // removing from loads
                delete this._loads[this._lookup[load]];
                delete this._lookup[load];

                // adding position to slots
                if (!slots.hasOwnProperty(weight)) {
                    slots[weight] = {};
                }
                slots[weight][pos] = true;
                this.profile.inc(this.SLOT_COUNTER_NAME);

                return this;
            },

            /**
             * Clears index buffers and resets counters.
             * @return {prime.Index}
             */
            clear: function () {
                this._weights = [];
                this._totals = [];
                this._loads = [];
                this._lookup = {};
                this._slots = {};
                this.nextTotal = 0;

                // subtracting current slot count from all available profiles
                this.profile.dec(this.SLOT_COUNTER_NAME, this.getSlotCount());

                return this;
            },

            /**
             * Simple getter for slot count
             * @return {number}
             */
            getSlotCount: function () {
                return this.profile.getItem(this.PROFILE_ID)
                    .getCount(this.SLOT_COUNTER_NAME);
            },

            /**
             * Rebuilds index, gets rid of unused entries.
             * @return {prime.Index}
             */
            rebuild: function () {
                if (this.getSlotCount() === 0) {
                    // there are no empty slots, rebuild is unnecessary
                    return this;
                }

                // backing up buffers
                var loads = this._loads,
                    weights = this._weights,
                    i, load, weight;

                // clearing buffers
                this.clear();

                // re-adding entries one by one
                for (i = 0; i < loads.length; i++) {
                    load = loads[i];
                    weight = weights[i];
                    if (typeof load !== 'undefined') {
                        this.addEntry(load, weight);
                    }
                }

                return this;
            },

            /**
             * Retrieves an entry based on total weight.
             * @param {number} total Number between zero and this.lastTotal
             * @return {string} Load of requested entry.
             */
            getEntryByTotal: function (total) {
                return this._loads[this._bSearch.call(this._totals, total)];
            },

            /**
             * Retrieves a random slot based on total weight.
             * @return {string} Random entry load.
             */
            getRandomEntry: function () {
                var total = Math.random() * this.nextTotal,
                    load = this._loads[this._bSearch.call(this._totals, total)];

                if (typeof load === 'undefined') {
                    // empty slot was hit, trying again
                    return this.getRandomEntry();
                } else {
                    // valid entry was hit
                    return load;
                }
            }
        });
});
