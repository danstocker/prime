/*global prime, module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, raises */
(function (Graph, Node, Peers) {
    module("Graph");

    test("Creation", function () {
        var graph = Graph.create();
        ok(graph._nodeCollection.isA(prime.NodeCollection), "Node collection on graph is of correct type");
    });

    test("Node addition", function () {
        var graph = Graph.create();

        equal(graph._nodeCollection.count, 0, "Node count before addition");

        graph.addNode(Node.create('foo'));
        equal(graph._nodeCollection.count, 1, "Node count after single addition");

        graph.addNode(Node.create('bar'), Node.create('hello'));
        equal(graph._nodeCollection.count, 3, "Node count after multiple addition");
    });

    test("Node retrieval", function () {
        var graph = Graph.create(),
            fooNode = Node.create('foo'),
            barNode = Node.create('bar');

        // dealing with existing nodes
        graph.addNode(fooNode, barNode);
        strictEqual(graph.fetchNode('foo'), fooNode, "Retrieved attached node");
        strictEqual(graph.fetchNode('bar'), barNode, "Retrieved attached node");

        // newly created
        equal(graph._nodeCollection.getItem('hello'), undefined, "Node doesn't exist on graph");
        notStrictEqual(graph.fetchNode('hello'), Node.create('hello'), "Retrieved non-attached node");
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

        graph._nodeCollection.getItem('foo')
            .to(graph._nodeCollection.getItem('bar'))
            .to(graph._nodeCollection.getItem('hello'))
            .to(graph._nodeCollection.getItem('world'));

        Peers.addMock({
            rebuildIndex: function () {
                ok(true, "Rebuilding index for node");
            }
        });

        graph.rebuildIndexes();

        Peers.removeMocks();
    });

    test("Node accessor", function () {
        var graph = Graph.create(),
            $ = graph.getFetcher();

        strictEqual(graph.fetchNode('foo'), $('foo'), "Retrieves the same node as accessor method");

        $('hello');
        ok(graph._nodeCollection.getItem('hello').isA(prime.Node), "Creates a new node on demand");
    });

    test("Graph builder", function () {
        var graph = Graph.create(),
            _ = graph.getConnector();

        expect(3);

        equal(_('foo'), 'foo', "Builder returns node instance");

        Node.addMock({
            to: function () {
                ok(true, "Node.to called");
            }
        });

        // 2x1 calls to Node.to
        _('hello',
            _('foo'),
            _('bar'));

        Node.removeMocks();
    });

    test("JSON", function () {
        var graph = Graph.create(),
            _ = graph.getConnector();

        _('food',
            _('fruit',
                _('apple'),
                _('pear')),
            _('turkey'));
        _('animal',
            _('bird',
                _('turkey'),
                _('turkey')),
            _('feline',
                _('cat'),
                _('lion')));

        equal(
            JSON.stringify(graph),
            '{"apple":{"fruit":1},"pear":{"fruit":1},"fruit":{"apple":1,"pear":1,"food":1},"turkey":{"food":1,"bird":2},"food":{"fruit":1,"turkey":1},"bird":{"turkey":2,"animal":1},"cat":{"feline":1},"lion":{"feline":1},"feline":{"cat":1,"lion":1,"animal":1},"animal":{"bird":1,"feline":1}}',
            "Serialized graph"
        );

        deepEqual(
            graph.profile.getItem('graph').counters,
            {
                "tread": 20,
                "peers": 18,
                "slots": 1
            },
            "Graph-level profile"
        );
    });
}(
    prime.Graph,
    prime.Node,
    prime.Peers
));
