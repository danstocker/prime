/*global prime, module, test, expect, ok, equal, notEqual, deepEqual, raises */
(function ($Graph, $Node, $node) {
    module("Graph");

    test("Shorthand", function () {
        $Graph.reset();

        expect(2);

        // testing addition
        $Node.addMock({
            create: function (load) {
                equal(load, 'hello', "Node created");
                return this;
            }
        });

        $Graph.addMock({
            register: function () {
                ok(true, "Node registered");
                return this;
            }
        });

        $node('hello');

        $Node.removeMocks();
        $Graph.removeMocks();
    });

    test("fromJSON", function () {
        expect(3);

        $Node.addMock({
            fromJSON: function (json) {
                ok(true, "Node reconstructed from JSON");
                return $Node.create(json.load);
            }
        });

        $Graph.fromJSON({
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

    test("Serialization integration", function () {
        $Graph.reset();

        $node('food').to(
            $node('fruit').to(
                $node('apple'),
                $node('pear')),
            $node('turkey'));
        $node('animal').to(
            $node('bird').to(
                $node('turkey')),
            $node('feline').to(
                $node('cat'),
                $node('lion')));

        var original = $Graph.registry,
            json = JSON.stringify(original),
            rebuilt = $Graph.fromJSON(JSON.parse(json));

        notEqual(rebuilt, original, "Rebuilt registry is different object");
        deepEqual(rebuilt, original, "Rebuilt is identical to original");
    });
}(
    prime.Graph,
    prime.Node,
    prime.node
));
