/*global prime, module, test, ok, equal, notEqual, deepEqual, raises */
(function ($, $utils) {
    module("Node");

    test("Creation", function () {
        var hello = $('hello');

        equal(hello.load, 'hello', "Creation increases lastId");
        equal($('hello'), hello, "Attempting to re-create node yields same node");

        raises(function () {
            $();
        }, "Non-string node raises error");
    });

    test("Peers", function () {
        $('foo');
        $('car');

        equal(
            $('car')
                .hasPeer($('foo')),
            false,
            "Node 'car' doesn't have peer 'foo'"
        );

        $('foo')
            .addPeers($('car'));

        deepEqual(
            $utils.keys($('foo').peers.byLoad()),
            ['car'],
            "Peer addition confirmed (1/2)"
        );
        deepEqual(
            $utils.keys($('car').peers.byLoad()),
            ['foo'],
            "Peer addition confirmed (2/2)"
        );

        equal(
            $('car')
                .hasPeer($('foo')),
            true,
            "Node 'car' now has peer 'foo'"
        );
    });
}(
    prime.node,
    prime.utils
));
