/*global prime, module, test, expect, ok, equal, notEqual, deepEqual, raises */
(function (Node) {
    module("Node");

    function cleanup() {
        var LOOKUP = prime.Node.LOOKUP,
            key;
        for (key in LOOKUP) {
            if (LOOKUP.hasOwnProperty(key)) {
                delete LOOKUP[key];
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
            strengthen: function (node, wear) {
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
        foo.strengthen(bar, 5);

        prime.Peers.removeMocks();
    });

    test("Connecting", function () {
        cleanup();

        expect(4);

        var foo = Node.create('foo'),
            bar = Node.create('bar'),
            car = Node.create('car');

        prime.Node.addMock({
            strengthen: function (node) {
                ok(node.load in {car: 1, bar: 1}, "Peer added");
            }
        });

        // adding as array
        foo.connect([
            bar,
            car
        ]);

        // adding as argument list
        foo.connect(bar, car);

        prime.Node.removeMocks();
    });

    test("Random", function () {
        cleanup();

        var foo = Node.create('foo').register(),
            bar = Node.create('bar').register(),
            car = Node.create('car').register();

        ok(prime.Node.random().load in prime.Node.LOOKUP, "Randomly selected node is in lookup");
    });

    test("Shorthand", function () {
        cleanup();

        expect(3);

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

        // testing random
        prime.Node.addMock({
            random: function () {
                ok(true, "Random node being taken");
            }
        });
        prime.node();
        prime.Node.removeMocks();
    });
}(
    prime.Node
));
