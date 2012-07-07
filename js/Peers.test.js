/*global prime, mocks, module, test, ok, equal, notEqual, deepEqual, raises */
(function ($Peers, $utils, $Peer, $node) {
    module("Peers");

    test("Addition", function () {
        var node = $node('hello'),
            peers, peer;

        peer = $Peer.create(node, 2);
        peers = $Peers.create()
            .add(peer);
        equal(peers.byLoad.hello, peer, "Peer added to byLoad lookup");
        equal(peers.byTread['2'].hello, peer, "Peer added to byTread lookup");
        equal(peers.totalTread, 2, "Total tread increased by peer");

        peers = $Peers.create()
            .tread(node, 1);
        equal(peers.byLoad.hello.node, node, "Node added to by-load buffer");
        equal(peers.byLoad.hello.tread, 1, "Newly added node's tread is 1 (default)");

        deepEqual(Object.keys(peers.byTread), ['1'], "Tread value added to by-tread lookup");
        equal(peers.byTread[1].hello.node, node, "Node added to by-tread buffer");
    });

    test("Modification", function () {
        var hello = $node('hello'),
            peers = $Peers.create();

        equal(peers.totalTread, 0, "Total tread initially zero");

        peers.tread(hello);
        deepEqual(Object.keys(peers.byTread), ['1'], "Node added once");
        equal(peers.totalTread, 1, "Total tread equals to tread of only element");

        peers.tread(hello);
        deepEqual(Object.keys(peers.byTread), ['2'], "Tread lookup follows changes in tread");
        equal(peers.totalTread, 2, "Total tread follows tread change of only element");

        peers.tread($node('world'));
        deepEqual(Object.keys(peers.byTread).sort(), ['1', '2'], "Tread lookup follows node addition");
        equal(peers.totalTread, 3, "Total tread follows node addition");

        peers.tread(hello, 3);
        equal(peers.totalTread, 6, "Tread of one node increased by custom wear");
    });

    test("Selection", function () {
        var peers = $Peers.create(),
            stats,
            i;

        // adding peers each with a tread of 1
        peers
            .tread($node('hello'))
            .tread($node('there'))
            .tread($node('world'));

        equal(peers.totalTread, 3, "All peers contributed to total tread");
        equal(peers.byNorm(0).node.load, 'hello', "First peer accessed by norm");
        equal(peers.byNorm(0.4).node.load, 'there', "Second peer accessed by norm");
        equal(peers.byNorm(0.8).node.load, 'world', "Third peer accessed by norm");
        equal(peers.byNorm(1).node.load, 'world', "Third peer accessed by norm (upper extreme)");

        // statistical test
        stats = {
            hello: 0,
            there: 0,
            world: 0
        };
        for (i = 0; i < 30; i++) {
            stats[peers.byNorm((i + 1) / 30).node.load]++;
        }

        ok(stats.hello === stats.there && stats.hello === stats.world, "Statistical test passed");
    });

    test("toJSON", function () {
        var peers = $Peers.create();

        peers
            .tread($node('hello'), 5)
            .tread($node('foo'), 4);

        deepEqual(Object.keys(peers.toJSON()), ['byLoad'], "Peers properties sent to JSON");

        equal(
            JSON.stringify(peers),
            '{"byLoad":{"hello":' + JSON.stringify(peers.byLoad.hello) + ',"foo":' + JSON.stringify(peers.byLoad.foo) + '}}',
            "Full peers JSON"
        );
    });

    test("fromJSON", function () {
        var peersJSON = {
                byLoad: {
                    hello: {
                        tread: 5,
                        node: {
                            load: 'hello'
                        }
                    },
                    foo: {
                        tread: 4,
                        node: {
                            load: 'foo'
                        }
                    }
                }
            },
            peers = $Peers.create()
                .add($Peer.create($node('hello'), 5))
                .add($Peer.create($node('foo'), 4));

        $Peer.addMock({
            fromJSON: function (json) {
                ok(true, "Peer being built from JSON");
                return $Peer.create($node(json.node.load), json.tread);
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
    prime.Peer,
    prime.node
));
