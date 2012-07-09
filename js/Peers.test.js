/*global prime, mocks, module, test, ok, equal, notEqual, deepEqual, raises */
(function ($Peers, $utils, $Peer) {
    module("Peers");

    test("Addition", function () {
        var load = 'hello',
            peers, peer;

        peer = $Peer.create(load, 2);
        peers = $Peers.create()
            .add(peer);
        equal(peers.byLoad.hello, peer, "Peer added to by-load buffer");
        equal(peers.byTread['2'].hello, peer, "Peer added to by-tread buffer");
        equal(peers.totalTread, 2, "Total tread increased by peer");

        peers = $Peers.create()
            .tread(load, 1);
        equal(peers.byLoad.hello.load, load, "Node added to by-load buffer");
        equal(peers.byLoad.hello.tread, 1, "Newly added node's tread is 1 (default)");

        deepEqual(Object.keys(peers.byTread), ['1'], "Tread value added to by-tread lookup");
        equal(peers.byTread[1].hello.load, load, "Node added to by-tread buffer");
    });

    test("Modification", function () {
        var load = 'load',
            peers = $Peers.create();

        equal(peers.totalTread, 0, "Total tread initially zero");

        peers.tread(load);
        deepEqual(Object.keys(peers.byTread), ['1'], "Node added once");
        equal(peers.totalTread, 1, "Total tread equals to tread of only element");

        peers.tread(load);
        deepEqual(Object.keys(peers.byTread), ['2'], "Tread lookup follows changes in tread");
        equal(peers.totalTread, 2, "Total tread follows tread change of only element");

        peers.tread('world');
        deepEqual(Object.keys(peers.byTread).sort(), ['1', '2'], "Tread lookup follows node addition");
        equal(peers.totalTread, 3, "Total tread follows node addition");

        peers.tread(load, 3);
        equal(peers.totalTread, 6, "Tread of one node increased by custom wear");
    });

    test("Selection", function () {
        var peers = $Peers.create(),
            stats,
            i;

        // adding peers each with a tread of 1
        peers
            .tread('hello')
            .tread('there')
            .tread('world');

        equal(peers.totalTread, 3, "All peers contributed to total tread");
        equal(peers.byNorm(0).load, 'hello', "First peer accessed by norm");
        equal(peers.byNorm(0.4).load, 'there', "Second peer accessed by norm");
        equal(peers.byNorm(0.8).load, 'world', "Third peer accessed by norm");
        equal(peers.byNorm(1).load, 'world', "Third peer accessed by norm (upper extreme)");

        // statistical test
        stats = {
            hello: 0,
            there: 0,
            world: 0
        };
        for (i = 0; i < 30; i++) {
            stats[peers.byNorm((i + 1) / 30).load]++;
        }

        ok(stats.hello === stats.there && stats.hello === stats.world, "Statistical test passed");
    });

    test("toJSON", function () {
        var peers = $Peers.create();

        peers
            .tread('hello', 5)
            .tread('foo', 4);

        deepEqual(Object.keys(peers.toJSON()), ['hello', 'foo'], "Peers properties sent to JSON");

        equal(
            JSON.stringify(peers),
            '{"hello":' + JSON.stringify(peers.byLoad.hello) + ',"foo":' + JSON.stringify(peers.byLoad.foo) + '}',
            "Full peers JSON"
        );
    });

    test("fromJSON", function () {
        var peersJSON = {
                hello: {
                    tread: 5
                },
                foo: {
                    tread: 4
                }
            },
            peers = $Peers.create()
                .add($Peer.create('hello', 5))
                .add($Peer.create('foo', 4));

        $Peer.addMock({
            fromJSON: function (load, json) {
                ok(true, "Peer being built from JSON");
                return $Peer.create(load, json.tread);
            }
        });

        deepEqual(
            $Peers.fromJSON(peersJSON),
            peers,
            "Peers re-initialized from JSON"
        );

        $Peer.removeMocks();
    });
}(
    prime.Peers,
    prime.utils,
    prime.Peer
));
