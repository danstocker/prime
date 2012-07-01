/*global prime, module, test, expect, ok, equal, notEqual, deepEqual, raises */
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
        expect(8);

        node('foo');
        node('car');

        equal(
            node('foo').hasPeer(node('car')),
            false,
            "Node 'car' doesn't have peer 'foo'"
        );

        node('foo')
            .strengthen(node('car'));

        deepEqual(
            Object.keys(node('foo').peers.byLoad()),
            ['car'],
            "Peer added to node"
        );
        deepEqual(
            Object.keys(node('car').peers.byLoad()),
            ['foo'],
            "Node added to peer"
        );

        equal(
            node('car')
                .hasPeer(node('foo')),
            true,
            "Node 'car' now has peer 'foo'"
        );

        prime.Node.addMock({
            strengthen: function (node) {
                ok(node.load in {car: 1, bar: 1}, "Peer added");
            }
        });

        // adding as array
        node('foo')
            .connect([node('bar'), node('car')]);

        // adding as argument list
        node('foo')
            .connect(node('bar'), node('car'));

        prime.Node.removeMocks();
    });
}(
    prime.node
));
