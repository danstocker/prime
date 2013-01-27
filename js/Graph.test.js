/*global prime, module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, raises */
(function (Graph, Node, Peers) {
    module("Graph");

    test("Creation", function () {
        var graph = Graph.create();
        ok(graph.nodes.isA(prime.NodeCollection), "Node collection on graph is of correct type");
    });

    test("Node addition", function () {
        var graph = Graph.create();

        equal(graph.nodes.count, 0, "Node count before addition");

        graph.addNode(Node.create('foo'));
        equal(graph.nodes.count, 1, "Node count after single addition");

        graph.addNode(Node.create('bar'), Node.create('hello'));
        equal(graph.nodes.count, 3, "Node count after multiple addition");
    });

    test("Node retrieval", function () {
        var graph = Graph.create(),
            fooNode = Node.create('foo'),
            barNode = Node.create('bar');

        // dealing with existing nodes
        graph.addNode(fooNode, barNode);
        strictEqual(graph.node('foo'), fooNode, "Retrieved attached node");
        strictEqual(graph.node('bar'), barNode, "Retrieved attached node");

        // newly created
        equal(graph.nodes.get('hello'), undefined, "Node doesn't exist on graph");
        notStrictEqual(graph.node('hello'), Node.create('hello'), "Retrieved non-attached node");
    });

    test("Index", function () {
        expect(4);

        var graph = Graph.create();

        graph.addNode(
            Node.create('foo'),
            Node.create('bar'),
            Node.create('hello'),
            Node.create('world')
        );

        graph.nodes.get('foo')
            .to(graph.nodes.get('bar'))
            .to(graph.nodes.get('hello'))
            .to(graph.nodes.get('world'));

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
            fromJSON: function (load, json) {
                ok(true, "Node reconstructed from JSON");
                return Node.create(load);
            }
        });

        var graph = Graph.create();

        graph.fromJSON({
            hello: {
                load : 'hello',
                peers: {}
            },
            foo  : {
                load : 'foo',
                peers: {}
            },
            bar  : {
                load : 'bar',
                peers: {}
            }
        });

        Node.removeMocks();
    });

    test("Node accessor", function () {
        var graph = Graph.create(),
            $ = graph.noConflict();

        expect(5);

        equal($('hello'), 'hello', "Shortcut returns load");

        Node.addMock({
            to: function () {
                ok(true, "Node.to called");
            }
        });

        // 2x1 calls to Node.to
        $('hello',
            $('foo'),
            $('bar'));

        // 2x1 calls to Node.to
        $('hello',
            'foo',
            'bar');

        Node.removeMocks();
    });

    test("Serialization integration", function () {
        var graph = Graph.create(),
            $ = graph.noConflict();

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

        var original = graph.nodes.items,
            json = JSON.stringify(graph),
            rebuilt = Graph.fromJSON(JSON.parse(json)).nodes.items;

        ok(rebuilt !== original, "Rebuilt registry is different object");
        deepEqual(rebuilt, original, "Rebuilt nodes are identical to original");
    });
}(
    prime.Graph,
    prime.Node,
    prime.Peers
));
