/*global prime, module, test, ok, equal, notEqual, deepEqual, raises */
(function (node) {
    module("Node");

    test("Creation", function () {
        var hello = node('hello');

        equal(hello.load, 'hello', "Creation increases lastId");
        equal(node('hello'), hello, "Attempting to re-create node yields same node");

        raises(function () {
            node();
        }, "Non-string node raises error");
    });

    test("Peers", function () {
        node('foo');
        node('car');

        equal(
            node('car')
                .hasPeer(node('foo')),
            false,
            "Node 'car' doesn't have peer 'foo'"
        );

        node('foo')
            .addPeers(node('car'));

        deepEqual(
            Object.keys(node('foo').peers.byLoad()),
            ['car'],
            "Peer addition confirmed (1/2)"
        );
        deepEqual(
            Object.keys(node('car').peers.byLoad()),
            ['foo'],
            "Peer addition confirmed (2/2)"
        );

        equal(
            node('car')
                .hasPeer(node('foo')),
            true,
            "Node 'car' now has peer 'foo'"
        );
    });
}(
    prime.node
));
