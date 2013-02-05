/*global prime, mocks, module, test, expect, ok, equal, notEqual, deepEqual, raises */
(function (Peers, utils, Peer, Index) {
    module("Peers");

    test("Addition", function () {
        var load = 'hello',
            peers, peer;

        expect(8); // 2x2 from mocks

        Index.addMock({
            addEntry: function (load, weight) {
                equal(load, 'hello', "Peer load");
                equal(weight, 2, "Peer tread");
            }
        });

        peer = Peer.create(load, 2);
        peers = Peers.create()
            .addPeer(peer);
        equal(peers._peers.get('hello'), peer, "Peer added to by-load buffer");
        equal(peers._peers.count, 1, "Peer count");

        peers = Peers.create()
            .tread(load, 2);
        equal(peers._peers.get('hello').node.load, load, "Node added to by-load buffer");
        equal(peers._peers.get('hello').tread, 2, "Newly added node's tread is 1 (default)");

        Index.removeMocks();
    });

    test("Modification", function () {
        var peers = Peers.create(),
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
            .tread('load', 1)
            .tread('load', 2);

        Index.removeMocks();
    });

    test("Querying", function () {
        var peers = Peers.create()
                .addPeer(Peer.create('foo', 1))
                .addPeer(Peer.create('bar', 1))
                .addPeer(Peer.create('hello', 1)),
            next = peers.random();

        equal(Peer.isPrototypeOf(next), true, "Random returns Peer object");
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

    test("fromJSON", function () {
        var peersJSON = {
                hello: {
                    tread: 5
                },
                foo  : {
                    tread: 4
                }
            },
            peers = Peers.create()
                .addPeer(Peer.create('hello', 5))
                .addPeer(Peer.create('foo', 4));

        Peer.addMock({
            fromJSON: function (load, json) {
                ok(true, "Peer being built from JSON");
                return Peer.create(load, json.tread);
            }
        });

        deepEqual(
            Peers.fromJSON(peersJSON),
            peers,
            "Peers re-initialized from JSON"
        );

        Peer.removeMocks();
    });
}(
    prime.Peers,
    prime.utils,
    prime.Peer,
    prime.Index
));
