/*global prime, module, test, expect, ok, equal, notEqual, deepEqual, raises */
(function (Node, Peers) {
    module("Node");

    test("Creation", function () {
        var hello,
            node,
            peers;

        hello = Node.create('hello');
        equal(hello.load, 'hello', "Single new node");

        node = Node.create('hello');
        equal(node, hello, "Single existing node");

        peers = Peers.create();
        node = Node.create('hello', peers);
        equal(node.peers, peers, "Single node with pre-defined peers");

        node = Node.create('hello', Peers.create());
        equal(node.peers, peers, "Peers object cannot be overwritten");
    });

    test("Strengthening", function () {
        expect(5);

        var foo = Node.create('foo'),
            bar = Node.create('bar'),
            i;

        equal(typeof foo.peers.getPeer(bar), 'undefined', "Peer tread before connecting");

        Peers.addMock({
            tread: function (load, wear) {
                switch (i) {
                case 0:
                    equal(load, 'bar', "Node added");
                    break;
                case 1:
                    equal(load, 'foo', "Node added");
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
            tread: function (load, wear) {
                // TODO: test is crude, should be refined
                ok(load in {foo: 1, car: 1, bar: 1}, "Peer added");
                equal(typeof wear, 'undefined', "Peer wear");
            }
        });

        // adding as argument list
        // 2x2 calls to Peer.tread for each node listed
        foo
            .to(bar)
            .to(car);

        Peers.removeMocks();
    });

    test("Hop", function () {
        var node = Node.create('test');

        equal(node.hop(), node, "Unconnected node hops to self");
    });

    test("toJSON", function () {
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

    test("fromJSON", function () {
        var nodeJSON = {
            },
            load = 'test',
            node = Node.create(load);

        expect(3);

        Peers.addMock({
            fromJSON: function (peersJSON) {
                ok(true, "Peers being built from JSON");
                deepEqual(peersJSON, {}, "JSON data for peers");
                return Peers.create();
            }
        });

        deepEqual(
            Node.fromJSON(load, nodeJSON),
            node,
            "Node re-initialized from JSON"
        );

        Peers.removeMocks();
    });
}(
    prime.Node,
    prime.Peers
));
