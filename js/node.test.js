/*global prime, module, test, expect, ok, equal, notEqual, deepEqual, raises */
(function (node) {
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
        var hello = node('hello');

        equal(hello.load, 'hello', "Creation increases lastId");
        equal(node('hello'), hello, "Attempting to re-create node yields same node");
    });

    test("Strengthening", function () {
        cleanup();

        expect(5);

        var foo = node('foo'),
            bar = node('bar'),
            i;

        equal(typeof foo.peer(bar), 'undefined', "Peer tread before connecting");

        prime.Peers.addMock({
            addNode: function (node, wear) {
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

        var foo = node('foo'),
            bar = node('bar'),
            car = node('car');

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
}(
    prime.node
));
