/*global prime, module, test, expect, ok, equal, notEqual, deepEqual, raises */
(function (Node) {
    module("Node");

    function cleanup() {
        var registry = prime.Node.registry,
            key;
        for (key in registry) {
            if (registry.hasOwnProperty(key)) {
                delete registry[key];
            }
        }
    }

    test("Creation", function () {
        cleanup();

        var hello = Node.create('hello');

        equal(hello.load, 'hello', "Load of created node");
    });

    test("Strengthening", function () {
        cleanup();

        expect(5);

        var foo = Node.create('foo'),
            bar = Node.create('bar'),
            i;

        equal(typeof foo.peer(bar), 'undefined', "Peer tread before connecting");

        prime.Peers.addMock({
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

        prime.Peers.removeMocks();
    });

    test("Connecting", function () {
        cleanup();

        expect(8);

        var foo = Node.create('foo'),
            bar = Node.create('bar'),
            car = Node.create('car');

        prime.Peers.addMock({
            tread: function (node, wear) {
                // TODO: test is crude, should be refined
                ok(node.load in {foo: 1, car: 1, bar: 1}, "Peer added");
                equal(typeof wear, 'undefined', "Peer wear");
            }
        });

        // adding as argument list
        // 2x2 calls Peer.tread for each node listed
        foo.to(bar, car);

        prime.Node.removeMocks();
    });

    test("Shorthand", function () {
        cleanup();

        expect(2);

        // testing addition
        prime.Node.addMock({
            create: function (load) {
                equal(load, 'hello', "Node created");
                return this;
            },
            register: function () {
                ok(true, "Node registered");
                return this;
            }
        });
        prime.node('hello');
        prime.Node.removeMocks();
    });
}(
    prime.Node
));
