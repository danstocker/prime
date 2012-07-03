/*global prime, console */
var dictionary = dictionary || {};
(function (node) {
    dictionary.statistics = function () {
        var result = {},
            i, load;

        // establishing connections
        node('table').to(
            node('cup').to(
                node('small'),
                node('white')),
            node('cloth'),
            node('food').to(
                node('warm'),
                node('taste')
            )
        );

        // traversing connections, gathering statistics
        for (i = 0; i < 1000; i++) {
            load = node('table').hop().load;
            result[load] = (result[load] || 0) + 1;
        }

        return result;
    };
}(prime.node));
