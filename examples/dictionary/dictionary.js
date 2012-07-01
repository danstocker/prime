/*global prime, console */
var dictionary = dictionary || {};
(function (node) {
    dictionary.statistics = function () {
        var data = dictionary.data,
            result = {},
            i, load;

        // filling nodes
        for (i = 0; i < data.length; i++) {
            node(data[i]);
        }

        // establishing connections
        node('table').connect(
            node('cup').connect(
                node('small'),
                node('white')),
            node('cloth'),
            node('food').connect(
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
