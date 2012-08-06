/*global prime, module, test, expect, ok, equal, notEqual, deepEqual, raises */
(function (Graph, Node, $, Peers) {
    module("Graph");

    var graph = Node.graph;

    test("Index", function () {
        expect(4);

        graph.reset();

        $('foo',
            $('bar'),
            $('hello'),
            $('world')
        );

        Peers.addMock({
            rebuildIndex: function () {
                ok(true, "Rebuilding index for node");
            }
        });

        graph.rebuildIndexes();

        Peers.removeMocks();
    });

    test("fromJSON", function () {
        expect(3);

        Node.addMock({
            fromJSON: function (json) {
                ok(true, "Node reconstructed from JSON");
                return Node.create(json.load);
            }
        });

        graph.fromJSON({
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

        Node.removeMocks();
    });

    test("Serialization integration", function () {
        graph.reset();

        $('food',
            $('fruit',
                $('apple'),
                $('pear')),
            $('turkey'));
        $('animal',
            $('bird',
                $('turkey')),
            $('feline',
                $('cat'),
                $('lion')));

        var original = graph.nodes,
            json = JSON.stringify(graph),
            rebuilt = graph.fromJSON(JSON.parse(json)).nodes;

        notEqual(rebuilt, original, "Rebuilt registry is different object");
        deepEqual(rebuilt, original, "Rebuilt nodes are identical to original");
    });
}(
    prime.Graph,
    prime.Node,
    prime.$,
    prime.Peers
));
