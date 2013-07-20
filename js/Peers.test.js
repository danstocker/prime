/*global prime, mocks, module, test, expect, ok, equal, notEqual, deepEqual, raises */
(function () {
    "use strict";

    module("Peers");

    test("Addition", function () {
        var load = 'hello',
            node = prime.Node.create(load),
            peers, peer;

        expect(8); // 2x2 from mocks

        prime.Index.addMocks({
            addEntry: function (load, weight) {
                equal(load, 'hello', "Peer load");
                equal(weight, 2, "Peer tread");
            }
        });

        peer = prime.Peer.create(node).wear(2);
        peers = prime.Peers.create()
            .addPeer(peer);
        equal(peers.getItem('hello'), peer, "Peer added to by-load buffer");
        equal(peers.getKeyCount(), 1, "Peer count");

        peers = prime.Peers.create()
            .tread(node, 2);
        equal(peers.getItem('hello').node.load, load, "Node added to by-load buffer");
        equal(peers.getItem('hello').getTread(), 2, "Newly added node's tread is 1 (default)");

        prime.Index.removeMocks();
    });

    test("Modification", function () {
        var peers = prime.Peers.create(),
            node = prime.Node.create('load'),
            i = 0;

        expect(5); // 2x .add(), 1x .remove()

        prime.Index.addMocks({
            removeEntry: function (load) {
                equal(load, 'load', "Removing load from index");
                return this;
            },
            addEntry   : function (load, weight) {
                equal(load, 'load', "Adding load to index");
                equal(weight, [1, 3][i++], "Peer weight");
                return this;
            }
        });

        peers
            .tread(node, 1)
            .tread(node, 2);

        prime.Index.removeMocks();
    });

    test("Querying", function () {
        var peers = prime.Peers.create()
                .addPeer(prime.Peer.create(prime.Node.create('foo')).wear(1))
                .addPeer(prime.Peer.create(prime.Node.create('bar')).wear(1))
                .addPeer(prime.Peer.create(prime.Node.create('hello')).wear(1)),
            next = peers.getRandomPeer();

        equal(next.isA(prime.Peer), true, "Random returns Peer object");
        ok(next.node.load in {'foo': 1, 'bar': 1, 'hello': 1}, "Random is one of the connected peers");
    });

    test("Miscellaneous", function () {
        expect(1);

        prime.Index.addMocks({
            rebuild: function () {
                ok(true, "Weighted index rebuilt");
            }
        });

        prime.Peers.create()
            .rebuildIndex();

        prime.Index.removeMocks();
    });
}(prime.Peers, prime.Utils, prime.Peer, prime.Node, prime.Index ));
