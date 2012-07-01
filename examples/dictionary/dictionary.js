/*global prime, console */
var dictionary = dictionary || {};
(function ($) {
    dictionary.statistics = function () {
        var data = dictionary.data,
            result = {},
            i, load;

        // filling nodes
        for (i = 0; i < data.length; i++) {
            $(data[i]);
        }

        // establishing connections
        $('table')
            .addPeers($('cup')
                .addPeers($('small'))
                .addPeers($('white')))
            .addPeers($('cloth'))
            .addPeers($('food')
                .addPeers($('warm'))
                .addPeers($('taste')));

        // traversing connections, gathering statistics
        for (i = 0; i < 1000; i++) {
            load = $('table').hop().load;
            result[load] = (result[load] || 0) + 1;
        }

        return result;
    };
}(prime.node));
