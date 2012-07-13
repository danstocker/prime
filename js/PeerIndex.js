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
                 * @type {string[]}
                 * @private
                 */
                this._weights = [];

                /**
                 * Sorted index of weights in order of total weight.
                 * @type {number[]}
                 * @private
                 */
                this._totals = [];

                /**
                 * Lookup for empty index spots indexed by weight first, then by position in _peers.
                 * @type {Object}
                 * @private
                 */
                this._empties = {};

                this.lastTotal = 0;
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
             * Adds index entry.
             * @param weight {number} Entry weight.
             * @return {number} Position of (new) entry in the index.
             */
            add: function (weight) {
                var empties = this._empties,
                    totals = this._totals,
                    pos; // position of the new entry (in _weights and _totals)

                if (empties.hasOwnProperty(weight)) {
                    // there is an available empty slot
                    pos = $utils.firstProperty(empties[weight]);

                    // removing position from empty slots
                    delete empties[weight][pos];
                    if ($utils.isEmpty(empties[weight])) {
                        // all empty slots for `weight` used up
                        delete empties[weight];
                    }
                } else {
                    // no empty spot available
                    // increasing last total
                    this.lastTotal += weight;

                    pos = totals.length;

                    // adding new entry to index
                    totals.push(this.lastTotal);
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
            }
        });

    return self;
}, prime.utils);
