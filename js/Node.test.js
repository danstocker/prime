/*global prime, module, test, expect, ok, equal, notEqual, deepEqual, raises */
(function (Node, Peers) {
    module("Node");

    test("Creation", function () {
        var hello,
            node,
            peers;

        hello = Node.create('hello');
        equal(hello.load, 'hello', "Single new node");

        ok(hello.peers.isA(Peers), "Peers object created");
    });

    test("Strengthening", function () {
        expect(5);

        var foo = Node.create('foo'),
            bar = Node.create('bar'),
            i;

        equal(typeof foo.peers.getPeer(bar), 'undefined', "Peer tread before connecting");

        Peers.addMock({
            tread: function (node, wear) {
                switch (i) {
                case 0:
                    equal(node.load, 'bar', "Node added");
                    break;
                case 1:
                    equal(node.load, 'foo', "Node added");
                    break;
                }
                equal(wear, 5, "Wear amount");
                i++;
            }
        });

        i = 0;
        foo.to(bar, 5);

        Peers.removeMocks();
    });

    test("Connecting", function () {
        expect(8);

        var foo = Node.create('foo'),
            bar = Node.create('bar'),
            car = Node.create('car');

        Peers.addMock({
            tread: function (node, wear) {
                // TODO: test is crude, should be refined
                ok(node.load in {foo: 1, car: 1, bar: 1}, "Peer added");
                equal(typeof wear, 'undefined', "Peer wear");
            }
        });

        // adding as argument list
        // 2x2 calls to Peer.tread for each node listed
        foo
            .connectTo(bar)
            .connectTo(car);

        Peers.removeMocks();
    });

    test("Peer testing", function () {
        var foo = Node.create('foo'),
            bar = Node.create('bar'),
            car = Node.create('car');

        foo.to(bar);

        equal(foo.isPeerNode(bar), true, "Peer confirmed");
        equal(foo.isPeerNode(car), false, "Not peer");
    });

    test("Hopping", function () {
        var node = Node.create('test');

        equal(node.getRandomPeerNode(), node, "Unconnected node hops to self");
    });

    test("JSON", function () {
        var node = Node.create('bar')
            .to(Node.create('hello'), 5)
            .to(Node.create('foo'), 4);

        deepEqual(Object.keys(node.toJSON()), ['hello', 'foo'], "Node peer loads sent to JSON");

        equal(
            JSON.stringify(node),
            '{"hello":' + JSON.stringify(node.peers.getPeer('hello')) + ',"foo":' + JSON.stringify(node.peers.getPeer('foo')) + '}',
            "Full node JSON"
        );
    });
}(
    prime.Node,
    prime.Peers
));
