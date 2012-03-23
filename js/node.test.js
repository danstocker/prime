/*global prime, module, test, ok, equal, notEqual, deepEqual, raises */
(function ($node, $utils) {
    module("Node");

    test("Creation", function () {
        var hello = $node('hello');

        equal(hello.load(), 'hello', "Creation increases lastId");
        equal($node('hello'), hello, "Attempting to re-create node yields same node");

        raises(function () {
            $node();
        }, "Non-string node raises error");
    });

    test("Peers", function () {
        $node('foo');
        $node('car');

        equal(
            $node('car')
                .hasPeer($node('foo')),
            false,
            "Node 'car' doesn't have peer 'foo'"
        );

        $node('foo')
            .peers($node('car'));

        deepEqual(
            $utils.keys($node('foo').peers().byLoad()),
            ['car'],
            "Peer addition confirmed (1/2)"
        );
        deepEqual(
            $utils.keys($node('car').peers().byLoad()),
            ['foo'],
            "Peer addition confirmed (2/2)"
        );

        equal(
            $node('car')
                .hasPeer($node('foo')),
            true,
            "Node 'car' now has peer 'foo'"
        );
    });

    test("Traversal", function () {
        // setting a peer ration of 1:3
        $node('hello')
            .peers([$node('car'), $node('foo')])
            .peers()
                .add($node('car'), 1)
                .add($node('foo'), 5);

        var
            stats = {
                car: 0,
                foo: 0
            },
            i,
            ratio;

        for (i = 0; i < 1000; i++) {
            stats[$node('hello').hop().load()]++;
        }

        ratio = stats.foo / stats.car;

        ok(ratio < 3.5 && ratio > 2.5, "Node hop ratio matches tread ratio " + ratio + " ~= 3");
    });
}(
    prime.node,
    prime.utils
));
