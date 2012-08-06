/*global prime, module, test, expect, ok, equal, notEqual, deepEqual, raises */
(function (Graph, Node, Peers) {
    module("Node");

    var graph;

    function reset() {
        graph = Graph.create();
    }

    test("Creation", function () {
        var hello,
            node,
            peers;

        reset();
        hello = Node.create('hello', graph);
        equal(hello.load, 'hello', "Single new node");

        reset();
        peers = Peers.create();
        node = Node.create('hello', graph, peers);
        equal(node.peers, peers, "Single node with pre-defined peers");
    });

    test("Strengthening", function () {
        reset();

        expect(5);

        var foo = Node.create('foo', graph),
            bar = Node.create('bar', graph),
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

        var foo = Node.create('foo', graph),
            bar = Node.create('bar', graph),
            car = Node.create('car', graph);

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

        var node = Node.create('test', graph);

        equal(node.hop(), node, "Unconnected node hops to self");
    });

    test("toJSON", function () {
        reset();

        var node = Node.create('bar', graph)
            .to(Node.create('hello', graph), 5)
            .to(Node.create('foo', graph), 4);

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
            node = Node.create(load, graph);

        expect(3);

        Peers.addMock({
            fromJSON: function (peersJSON) {
                ok(true, "Peers being built from JSON");
                deepEqual(peersJSON, {}, "JSON data for peers");
                return Peers.create();
            }
        });

        deepEqual(
            Node.fromJSON(load, graph, nodeJSON),
            node,
            "Node re-initialized from JSON"
        );

        Peers.removeMocks();
    });
}(
    prime.Graph,
    prime.Node,
    prime.Peers
));
