/*global prime, module, test, expect, ok, equal, notEqual, deepEqual, raises */
(function ($Graph, $Node, $node, $Peers) {
    module("Graph");

    test("Index", function () {
        expect(4);

        $Graph.reset();

        $node('foo').to(
            $node('bar'),
            $node('hello'),
            $node('world')
        );

        $Peers.addMock({
            rebuildIndex: function () {
                ok(true, "Rebuilding index for node");
            }
        });

        $Graph.rebuildIndexes();

        $Peers.removeMocks();
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

        var original =  $Graph.nodes,
            json = JSON.stringify($Graph),
            rebuilt = $Graph.fromJSON(JSON.parse(json)).nodes;

        notEqual(rebuilt, original, "Rebuilt registry is different object");
        deepEqual(rebuilt, original, "Rebuilt nodes are identical to original");
    });
}(
    prime.Graph,
    prime.Node,
    prime.node,
    prime.Peers
));
