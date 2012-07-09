/*global prime, module, test, expect, ok, equal, notEqual, deepEqual, raises */
(function ($Graph, $Node) {
    module("Graph");

    test("Node accessor", function () {
        $Graph.reset();

        expect(1);

        // testing addition
        $Node.addMock({
            create: function (load) {
                equal(load, 'hello', "Node created");
                return this;
            }
        });

        $Graph.node('hello');

        $Node.removeMocks();
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
        
        var node = $Graph.node;

        node('food').to(
            node('fruit').to(
                node('apple'),
                node('pear')),
            node('turkey'));
        node('animal').to(
            node('bird').to(
                node('turkey')),
            node('feline').to(
                node('cat'),
                node('lion')));

        var original = $Graph.nodes,
            json = JSON.stringify(original),
            rebuilt = $Graph.fromJSON(JSON.parse(json));

        notEqual(rebuilt, original, "Rebuilt registry is different object");
        deepEqual(rebuilt, original, "Rebuilt is identical to original");
    });
}(
    prime.Graph,
    prime.Node
));
