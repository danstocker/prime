/*global prime, module, test, expect, ok, equal, notEqual, deepEqual, raises */
(function ($Node, $Peers, $node) {
    module("Node");


    test("Creation", function () {
        $Node.reset();

        var hello = $Node.create('hello');

        equal(hello.load, 'hello', "Load of created node");
    });

    test("Strengthening", function () {
        $Node.reset();

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
        $Node.reset();

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

        $Node.removeMocks();
    });

    test("Shorthand", function () {
        $Node.reset();

        expect(2);

        // testing addition
        $Node.addMock({
            create: function (load) {
                equal(load, 'hello', "Node created");
                return this;
            },
            register: function () {
                ok(true, "Node registered");
                return this;
            }
        });
        $node('hello');
        $Node.removeMocks();
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

    module("prime");

    test("fromJSON", function () {
        expect(3);

        $Node.addMock({
            fromJSON: function (json) {
                ok(true, "Node reconstructed from JSON");
                return $Node.create(json.load);
            }
        });

        prime.fromJSON({
            hello: {
                load: 'hello',
                peers: {}
            },
            foo: {
                load: 'foo',
                peers: {}
            },
            bar: {
                load: 'bar',
                peers: {}
            }
        });

        $Node.removeMocks();
    });
}(
    prime.Node,
    prime.Peers,
    prime.node
));
