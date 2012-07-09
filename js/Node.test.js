/*global prime, module, test, expect, ok, equal, notEqual, deepEqual, raises */
(function ($Node, $Peers, $node) {
    module("Node");

    test("Creation", function () {
        $Node.graph.reset();

        var hello = $Node.create('hello');

        equal(hello.load, 'hello', "Load of created node");
    });

    test("Strengthening", function () {
        $Node.graph.reset();

        expect(5);

        var foo = $Node.create('foo'),
            bar = $Node.create('bar'),
            i;

        equal(typeof foo.peer(bar), 'undefined', "Peer tread before connecting");

        $Peers.addMock({
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

        $Peers.removeMocks();
    });

    test("Connecting", function () {
        $Node.graph.reset();

        expect(8);

        var foo = $Node.create('foo'),
            bar = $Node.create('bar'),
            car = $Node.create('car');

        $Peers.addMock({
            tread: function (load, wear) {
                // TODO: test is crude, should be refined
                ok(load in {foo: 1, car: 1, bar: 1}, "Peer added");
                equal(typeof wear, 'undefined', "Peer wear");
            }
        });

        // adding as argument list
        // 2x2 calls Peer.tread for each node listed
        foo.to(bar, car);

        $Peers.removeMocks();
    });

    test("Change handler", function () {
        $Node.graph.reset();

        expect(2);

        var foo = $Node.create('foo'),
            bar = $Node.create('bar'),
            car = $Node.create('car');

        $Node.handler = function (data) {
            deepEqual(
                data,
                {
                    foo: $node('foo'),
                    bar: $node('bar'),
                    car: $node('car')
                },
                "Change handler called with 3 nodes"
            );
        };

        $node('foo').to(
            $node('bar'),
            $node('car')
        );

        $Node.handler = function (data) {
            deepEqual(
                data,
                {
                    bar: $node('bar'),
                    car: $node('car')
                },
                "Change handler called with 2 nodes"
            );
        };

        $node('car').to(
            $node('bar'),
            4
        );

        $Node.handler = null;
    });

    test("fromJSON", function () {
        var nodeJSON = {
                load: "test",
                peers: {}
            },
            node = $Node.create(nodeJSON.load);

        expect(3);

        $Peers.addMock({
            fromJSON: function (peersJSON) {
                ok(true, "Peers being built from JSON");
                deepEqual(peersJSON, {}, "JSON data for peers");
                return $Peers.create();
            }
        });

        deepEqual(
            $Node.fromJSON(nodeJSON),
            node,
            "Node re-initialized from JSON"
        );

        $Peers.removeMocks();
    });
}(
    prime.Node,
    prime.Peers,
    prime.node
));
