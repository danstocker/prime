/**
 * Weight Index
 *
 * Index of weighted entries. Weight serves as a basis for random retrieval.
 */
/*global troop, sntls, prime */
troop.promise(prime, 'Index', function (prime) {
    /**
     * @class Represents connection to another node.
     * @requires prime.Node
     */
    var self = prime.Index = troop.Base.extend()
        .addTrait(sntls.Profiled)
        .addConstant({
            /**
             * Identifies index profile in the profile collection.
             */
            PROFILE_ID: 'index',

            /**
             * Identifies slot counter in profile
             */
            SLOT_COUNTER_NAME: 'slots'
        })
        .addMethod({
            /**
             * @constructor
             * @param [profile] {sntls.ProfileCollection}
             */
            init: function (profile) {
                this
                    .initProfiled(self.PROFILE_ID, profile)
                    .addPrivate({
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
                    .addPublic({
                        /**
                         * Next total weight. Equals to cumulative weight of all entries.
                         * @type {Number}
                         */
                        nextTotal: 0
                    });
            }
        }).addPrivateMethod({
            /**
             * Performs binary search in the index.
             * @this {number[]} Array to perform search on.
             * @param value {number} Value searched.
             * @param [start] {number} Start position of search range. Default: 0.
             * @param [end] {number} Ending position of search range. Default: this.length - 1.
             * @private
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
        .addMethod({
            /**
             * Adds index entry.
             * @param load {string} Entry load.
             * @param weight {number} Entry weight.
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
                    this.profile.dec(self.SLOT_COUNTER_NAME);
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
             * @param load {string} Load of entry to be removed.
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
                this.profile.inc(self.SLOT_COUNTER_NAME);

                return this;
            },

            /**
             * Clears index buffers and resets counters.
             */
            clear: function () {
                this._weights = [];
                this._totals = [];
                this._loads = [];
                this._lookup = {};
                this._slots = {};
                this.nextTotal = 0;

                // subtracting current slot count from all available profiles
                this.profile.dec(self.SLOT_COUNTER_NAME, this.getSlotCount());
            },

            /**
             * Simple getter for slot count
             */
            getSlotCount: function () {
                return this.profile.getItem(self.PROFILE_ID)
                    .getCount(self.SLOT_COUNTER_NAME);
            },

            /**
             * Rebuilds index, gets rid of unused entries.
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
             * @param total {number} Number between zero and this.lastTotal
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
