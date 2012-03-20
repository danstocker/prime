/*global module, test, ok, equal, notEqual, deepEqual, raises */
(function () {
    module("Node");

    test("Creation", function () {
        var node = prime.node('creation test');

        equal(node.load(), 'creation test', "Creation increases lastId");
        equal(prime.node('creation test'), node, "Attempting to re-create node yields same node");

        raises(function () {
            prime.node();
        }, "Non-string node raises error");
    });

    test("Peers", function () {
        prime.node('car');
        prime.node('foo');

        equal(
            prime.node('car')
                .hasPeer('foo'),
            false,
            "Node 'car' doesn't have peer 'foo' (by load)"
        );
        equal(
            prime.node('car')
                .hasPeer(prime.node('foo')),
            false,
            "Node 'car' doesn't have peer 'foo' (by reference)"
        );

        prime.node('foo')
            .peers(prime.node('car'));

        deepEqual(prime.node('foo').peers(), ['car'], "Peer addition confirmed (1/2)");
        deepEqual(prime.node('car').peers(), ['foo'], "Peer addition confirmed (2/2)");
    });

}());
