/**
 * Weight Index
 *
 * Index of weighted entries. Weight serves as a basis for random retrieval.
 */
/*global troop, sntls, prime */
troop.promise(prime, 'Index', function () {
    "use strict";

    /**
     * @class prime.Index
     * @extends troop.Base
     * @extends sntls.Profiled
     */
    prime.Index = troop.Base.extend()
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
             * @param {sntls.ProfileCollection} [profile]
             */
            init: function (profile) {
                this.initProfiled(this.PROFILE_ID, profile);

                /**
                 * List of peers in order identical to _totals.
                 * @type {number[]}
                 * @private
                 */
                this._weights = [];

                /**
                 * Sorted index of total weights of preceding entries.
                 * Total weight is the cumulative weight of all slots.
                 * @type {sntls.OrderedList}
                 * @private
                 */
                this._totals = sntls.OrderedList.create();

                /**
                 * List of loads.
                 * @type {string[]}
                 * @private
                 */
                this._loads = [];

                /**
                 * Associates loads with their positions in the index.
                 * (Both loads and index positions are unique.)
                 * @type {Object}
                 * @private
                 */
                this._lookup = {};

                /**
                 * Lookup for empty index entries first by weight; then by index position.
                 * Incoming entries first check here for a suitable position.
                 * @type {Object}
                 * @private
                 */
                this._slots = {};

                /**
                 * Next total weight. Equals to cumulative weight of all entries.
                 * @type {Number}
                 */
                this.nextTotal = 0;
            },

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
                    this._totals.addItem(this.nextTotal); //.items.push(this.nextTotal);
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
                this._totals.clear();
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
                /**
                 * Load index points to the previous entry when
                 * `total` does not point to an existing location
                 */
                var totals = this._totals,
                    spliceIndex = totals.spliceIndexOf(total),
                    loadIndex = totals.items[spliceIndex] === total ?
                        spliceIndex : // exact hit
                        spliceIndex - 1; // in between hit

                return this._loads[loadIndex];
            },

            /**
             * Retrieves a random slot based on total weight.
             * @return {string} Random entry load.
             */
            getRandomEntry: function () {
                var nextTotal = this.nextTotal,
                    total = Math.random() * nextTotal,
                    load = this._loads[this._totals.spliceIndexOf(total)];

                if (typeof load !== 'undefined' || !nextTotal) {
                    // valid entry was hit OR index is empty
                    return load;
                } else {
                    // empty slot was hit, trying again
                    return this.getRandomEntry();
                }
            }
        });
});
