/*global prime, module, test, expect, ok, equal, deepEqual, raises */
(function (Graph, Node, $, Peers) {
    module("Graph");

    test("Index", function () {
        expect(4);

        Graph.reset();

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

        Graph.rebuildIndexes();

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

        Graph.fromJSON({
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
        Graph.reset();

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

        var original = Graph.nodes.items,
            json = JSON.stringify(Graph),
            rebuilt = Graph.fromJSON(JSON.parse(json)).nodes.items;

        ok(rebuilt !== original, "Rebuilt registry is different object");
        deepEqual(rebuilt, original, "Rebuilt nodes are identical to original");
    });
}(
    prime.Graph,
    prime.Node,
    prime.$,
    prime.Peers
));
