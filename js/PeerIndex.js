/**
 * Weight Index
 *
 * Index of weighted slots. Each slot in the index carries a weight,
 * serving as a basis for random retrieval.
 */
/*global prime, troop */
troop.promise(prime, 'PeerIndex', function (ns, className, $utils) {
    /**
     * @class Represents connection to another node.
     * @requires prime.Node
     */
    var self = prime.PeerIndex = troop.base.extend()
        .addMethod({
            init: function () {
                /**
                 * List of peers in order identical to _index.
                 * @type {number[]}
                 * @private
                 */
                this._weights = [0];

                /**
                 * Sorted index of total weights.
                 * Total weight is the cumulative weight of all slots
                 * @type {number[]}
                 * @private
                 */
                this._totals = [0];

                /**
                 * Lookup for empty index spots indexed by weight first, then by position in _peers.
                 * @type {Object}
                 * @private
                 */
                this._empties = {};
                this.emptyCount = 0;
            }
        }).addPrivateMethod({
            /**
             * Performs binary search in the index.
             * @param value {number} Value searched.
             * @param [start] {number} Start index of search range. Default: 0.
             * @param [end] {number} Ending index of search range. Default: _index.length - 1.
             * @private
             */
            _bsearch: function (value, start, end) {
                start = start || 0;
                end = end || this._totals.length - 1;

                var index = this._totals,
                    pos = Math.floor((start + end) / 2),
                    hit = index[pos];

                if (hit === value) {
                    // perfect hit
                    return pos;
                } else if (index[end] === value) {
                    // end of range hit
                    return end;
                } else if (end - start === 1) {
                    // between two adjacent values
                    return start;
                } else if (hit > value) {
                    // narrowing range to lower half
                    return this._bsearch(value, start, pos);
                } else if (hit < value) {
                    // narrowing range to upper half
                    return this._bsearch(value, pos, end);
                }
            }
        }).addMethod({
            /**
             * Retrieves highest total weight from index.
             * @return {number}
             */
            lastTotal: function () {
                var totals = this._totals;
                return totals[totals.length - 1] || 0;
            },

            /**
             * Adds index entry.
             * @param weight {number} Entry weight.
             * @return {number} Position of (new) entry in the index.
             */
            add: function (weight) {
                var empties = this._empties,
                    totals = this._totals,
                    total, // next total weight value in _totals
                    pos; // position of the new entry (in _weights and _totals)

                if (empties.hasOwnProperty(weight)) {
                    // there is an available empty slot
                    pos = $utils.firstProperty(empties[weight]);

                    // removing position from empty slots
                    delete empties[weight][pos];
                    if ($utils.isEmpty(empties[weight])) {
                        // all empty slots for `weight` used up
                        delete empties[weight];
                        this.emptyCount--;
                    }
                } else {
                    // no empty spot available
                    total = this.lastTotal() + weight;
                    pos = totals.length;

                    // adding new entry to index
                    totals.push(total);
                    this._weights.push(weight);
                }

                return pos;
            },

            /**
             * Removes entry from index by marking its position as empty.
             * @param pos {number} Position of entry to remove.
             */
            remove: function (pos) {
                var empties = this._empties,
                    weight = this._weights[pos];

                if (!empties.hasOwnProperty(weight)) {
                    empties[weight] = {};
                }

                empties[weight][pos] = true;
                this.emptyCount++;
            },

            /**
             * Retrieves a slot based on its total weight.
             * @param total {number} Number between zero and this.lastTotal
             */
            get: function (total) {
                return this._bsearch(total);
            },

            /**
             * Retrieves a random slot based on total weights.
             */
            random: function () {
                var total = Math.random() * this.lastTotal();
                return this._bsearch(total);
            }
        });

    return self;
}, prime.utils);
