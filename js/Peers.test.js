/*global prime, mocks, module, test, expect, ok, equal, notEqual, deepEqual, raises */
(function (Peers, utils, Peer, Node, Index) {
    module("Peers");

    test("Addition", function () {
        var load = 'hello',
            node = Node.create(load),
            peers, peer;

        expect(8); // 2x2 from mocks

        Index.addMock({
            addEntry: function (load, weight) {
                equal(load, 'hello', "Peer load");
                equal(weight, 2, "Peer tread");
            }
        });

        peer = Peer.create(node).wear(2);
        peers = Peers.create()
            .addPeer(peer);
        equal(peers._peerCollection.get('hello'), peer, "Peer added to by-load buffer");
        equal(peers._peerCollection.count, 1, "Peer count");

        peers = Peers.create()
            .tread(node, 2);
        equal(peers._peerCollection.get('hello').node.load, load, "Node added to by-load buffer");
        equal(peers._peerCollection.get('hello').tread(), 2, "Newly added node's tread is 1 (default)");

        Index.removeMocks();
    });

    test("Modification", function () {
        var peers = Peers.create(),
            node = Node.create('load'),
            i = 0;

        expect(5); // 2x .add(), 1x .remove()

        Index.addMock({
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

        Index.removeMocks();
    });

    test("Querying", function () {
        var peers = Peers.create()
                .addPeer(Peer.create(Node.create('foo')).wear(1))
                .addPeer(Peer.create(Node.create('bar')).wear(1))
                .addPeer(Peer.create(Node.create('hello')).wear(1)),
            next = peers.random();

        equal(next.isA(Peer), true, "Random returns Peer object");
        ok(next.node.load in {'foo': 1, 'bar': 1, 'hello': 1}, "Random is one of the connected peers");
    });

    test("Miscellaneous", function () {
        expect(1);

        Index.addMock({
            rebuild: function () {
                ok(true, "Weighted index rebuilt");
            }
        });

        Peers.create()
            .rebuildIndex();

        Index.removeMocks();
    });
}(prime.Peers, prime.utils, prime.Peer, prime.Node, prime.Index ));
