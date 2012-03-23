/*global prime, mocks, module, test, ok, equal, notEqual, deepEqual, raises */
(function ($peers, $utils, $peer, $node) {
    module("Peers");

    test("Addition", function () {
        var hello = $node('hello'),
            peers = $peers();

        peers.add(hello);
        equal(peers.byLoad().hello.node(), hello, "Node added to by-load buffer");
        equal(peers.byLoad('hello').node(), hello, ".byLoad may take load parameter");
        equal(peers.byLoad().hello.tread(), 1, "Newly added node's tread is 1 (default)");

        deepEqual($utils.keys(peers.byTread()), ['1'], "Tread value added to by-tread lookup");
        equal(peers.byTread()[1].hello.node(), hello, "Node added to by-tread buffer");
        equal(peers.byTread(1).hello.node(), hello, "Same but with tread passed as param (number)");
        equal(peers.byTread('1').hello.node(), hello, "Same but with tread passed as param (string)");
        equal(peers.byTread(1, 'hello').node(), hello, "Same but with tread and load passed as params");
    });

    test("Modification", function () {
        var hello = $node('hello'),
            peers = $peers();

        equal(peers.totalTread(), 0, "Total tread initially zero");

        peers.add(hello);
        deepEqual($utils.keys(peers.byTread()), ['1'], "Node added once");
        equal(peers.totalTread(), 1, "Total tread equals to tread of only element");

        peers.add(hello);
        deepEqual($utils.keys(peers.byTread()), ['2'], "Tread lookup follows changes in tread");
        equal(peers.totalTread(), 2, "Total tread follows tread change of only element");

        peers.add($node('world'));
        deepEqual($utils.keys(peers.byTread()).sort(), ['1', '2'], "Tread lookup follows node addition");
        equal(peers.totalTread(), 3, "Total tread follows node addition");

        peers.add(hello, 3);
        equal(peers.totalTread(), 6, "Tread of one node increased by custom wear");
    });

    test("Selection", function () {
        var
            peers = $peers(),
            stats,
            i;

        // adding peers each with a tread of 1
        peers
            .add($node('hello'))
            .add($node('there'))
            .add($node('world'));

        equal(peers.totalTread(), 3, "All peers contributed to total tread");
        equal(peers.byNorm(0).load(), 'hello', "First peer accessed by norm");
        equal(peers.byNorm(0.4).load(), 'there', "Second peer accessed by norm");
        equal(peers.byNorm(0.8).load(), 'world', "Third peer accessed by norm");
        equal(peers.byNorm(1).load(), 'world', "Third peer accessed by norm (upper extreme)");

        // statistical test
        stats = {
            hello: 0,
            there: 0,
            world: 0
        };
        for (i = 0; i < 30; i++) {
            stats[peers.byNorm((i + 1) / 30).load()]++;
        }

        ok(stats.hello === stats.there && stats.hello === stats.world, "Statistical test passed");
    });
}(
    prime.peers,
    prime.utils,
    prime.peer,
    mocks.node
));
