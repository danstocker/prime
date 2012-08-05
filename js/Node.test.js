/*global prime, module, test, expect, ok, equal, notEqual, deepEqual, raises */
(function (Node, Peers, $) {
    module("Node");

    function reset() {
        Node.graph.reset();
    }

    test("Creation", function () {
        var hello,
            node,
            peers;

        expect(5);

        reset();
        hello = Node.create('hello');
        equal(hello.load, 'hello', "Single new node");

        node = Node.create('hello');
        equal(node, hello, "Single existing node");

        reset();
        peers = Peers.create();
        node = Node.create('hello', peers);
        equal(node.peers, peers, "Single node with pre-defined peers");

        Node.addMock({
            to: function () {
                ok(true, "Node.to called");
            }
        });

        // 2x1 calls to Node.to
        node = Node.create('hello',
            Node.create('foo'),
            Node.create('bar'));

        Node.removeMocks();
    });

    test("Node accessor", function () {
        reset();

        expect(1);

        // testing addition
        Node.addMock({
            create: function (load) {
                equal(load, 'hello', "Node created");
                return this;
            }
        });

        $('hello');

        Node.removeMocks();
    });

    test("Strengthening", function () {
        reset();

        expect(5);

        var foo = Node.create('foo'),
            bar = Node.create('bar'),
            i;

        equal(typeof foo.peer(bar), 'undefined', "Peer tread before connecting");

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
        reset();

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
        reset();

        var node = $('test');

        equal(node.hop(), node, "Unconnected node hops to self");
    });

    test("toJSON", function () {
        reset();

        var node = $('bar')
            .to($('hello'), 5)
            .to($('foo'), 4);

        deepEqual(Object.keys(node.toJSON()), ['hello', 'foo'], "Node peer loads sent to JSON");

        equal(
            JSON.stringify(node),
            '{"hello":' + JSON.stringify(node.peers.lookup.hello) + ',"foo":' + JSON.stringify(node.peers.lookup.foo) + '}',
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
    prime.Peers,
    prime.$
));
