/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, raises */
/*global dessert, sntls, prime */
(function () {
    "use strict";

    module("Graph");

    test("Type conversion", function () {
        var hash = sntls.Hash.create({
                foo: prime.Node.create('foo'),
                bar: prime.Node.create('bar')
            }),
            graph;

        graph = hash.toGraph();

        ok(graph.isA(prime.Graph), "Hash converted to Graph");
        equal(graph.count, 2, "Graph counts nodes");
    });

    test("Node addition", function () {
        var graph = prime.Graph.create();

        equal(graph.count, 0, "Node count before addition");

        graph.addNode(prime.Node.create('foo'));
        equal(graph.count, 1, "Node count after single addition");

        graph.addNode(prime.Node.create('bar'), prime.Node.create('hello'));
        equal(graph.count, 3, "Node count after multiple addition");
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
        equal(graph.getItem('hello'), undefined, "Node doesn't exist on graph");
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

        graph.getItem('foo')
            .to(graph.getItem('bar'))
            .to(graph.getItem('hello'))
            .to(graph.getItem('world'));

        prime.Peers.addMock({
            rebuildIndex: function () {
                ok(true, "Rebuilding index for node");
            }
        });

        graph.rebuildIndexes();

        prime.Peers.removeMocks();
    });

    test("Node fetcher", function () {
        var graph = prime.Graph.create(),
            $ = graph.getFetcher();

        strictEqual(graph.fetchNode('foo'), $('foo'), "Retrieves the same node as accessor method");

        $('hello');
        ok(graph.getItem('hello').isA(prime.Node), "Creates a new node on demand");
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
