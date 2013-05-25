/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, raises */
/*global dessert, prime */
(function () {
    "use strict";

    module("Graph");

    test("Creation", function () {
        var graph = /** @type prime.Graph */ prime.Graph.create();
        ok(graph._nodeCollection.isA(prime.NodeCollection), "Node collection on graph is of correct type");
    });

    test("Node addition", function () {
        var graph = prime.Graph.create();

        equal(graph._nodeCollection.count, 0, "Node count before addition");

        graph.addNode(prime.Node.create('foo'));
        equal(graph._nodeCollection.count, 1, "Node count after single addition");

        graph.addNode(prime.Node.create('bar'), prime.Node.create('hello'));
        equal(graph._nodeCollection.count, 3, "Node count after multiple addition");
    });

    test("Node retrieval", function () {
        var graph = prime.Graph.create(),
            fooNode = prime.Node.create('foo'),
            barNode = prime.Node.create('bar');

        // dealing with existing nodes
        graph.addNode(fooNode, barNode);
        strictEqual(graph.fetchNode('foo'), fooNode, "Retrieved attached node");
        strictEqual(graph.fetchNode('bar'), barNode, "Retrieved attached node");

        // newly created
        equal(graph._nodeCollection.getItem('hello'), undefined, "Node doesn't exist on graph");
        notStrictEqual(graph.fetchNode('hello'), prime.Node.create('hello'), "Retrieved non-attached node");
    });

    test("Index", function () {
        expect(4);

        var graph = prime.Graph.create();

        graph.addNode(
            prime.Node.create('foo'),
            prime.Node.create('bar'),
            prime.Node.create('hello'),
            prime.Node.create('world')
        );

        graph._nodeCollection.getItem('foo')
            .to(graph._nodeCollection.getItem('bar'))
            .to(graph._nodeCollection.getItem('hello'))
            .to(graph._nodeCollection.getItem('world'));

        prime.PeerCollection.addMock({
            rebuildIndex: function () {
                ok(true, "Rebuilding index for node");
            }
        });

        graph.rebuildIndexes();

        prime.PeerCollection.removeMocks();
    });

    test("Node fetcher", function () {
        var graph = prime.Graph.create(),
            $ = graph.getFetcher();

        strictEqual(graph.fetchNode('foo'), $('foo'), "Retrieves the same node as accessor method");

        $('hello');
        ok(graph._nodeCollection.getItem('hello').isA(prime.Node), "Creates a new node on demand");
    });

    test("Connecting node pairs", function () {
        expect(5);

        var graph = prime.Graph.create();

        prime.Node.addMock({
            connectTo: function (remoteNode, forwardWear, backwardsWear) {
                ok(dessert.validators.isNode(remoteNode), "Remote node ok");
                equal(this.load, 'hello', "Own load");
                equal(remoteNode.load, 'world', "Remote load");
                equal(forwardWear, 5, "Forward wear");
                equal(typeof backwardsWear, 'undefined', "Backwards wear");
            }
        });

        graph.pairNodes('hello', 'world', 5);

        prime.Node.removeMocks();
    });

    test("Node connector", function () {
        var graph = prime.Graph.create(),
            _ = graph.getConnector();

        expect(3);

        equal(_('foo'), 'foo', "Builder returns node instance");

        prime.Node.addMock({
            to: function () {
                ok(true, "prime.Node.to called");
            }
        });

        // 2x1 calls to prime.Node.to
        _('hello',
            _('foo'),
            _('bar'));

        prime.Node.removeMocks();
    });

    test("JSON", function () {
        var graph = prime.Graph.create(),
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
}());
