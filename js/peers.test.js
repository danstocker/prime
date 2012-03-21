/*global module, test, ok, equal, notEqual, deepEqual, raises */
(function ($peers, $utils, $peer, $node) {
    module("Peers");

    test("Addition", function () {
        var node = $node('hello'),
            peers = $peers();

        peers.add(node);
        equal(peers.byLoad().hello.node(), node, "Node added to by-load buffer");
        equal(peers.byLoad('hello').node(), node, ".byLoad may take load parameter");
        equal(peers.byLoad().hello.tread(), 1, "Newly added node's tread is 1 (default)");

        deepEqual($utils.keys(peers.byTread()), ['1'], "Tread value added to by-tread lookup");
        equal(peers.byTread()[1].hello.node(), node, "Node added to by-tread buffer");
        equal(peers.byTread(1).hello.node(), node, "Same but with tread passed as param (number)");
        equal(peers.byTread('1').hello.node(), node, "Same but with tread passed as param (string)");
        equal(peers.byTread(1, 'hello').node(), node, "Same but with tread and load passed as params");
    });
}(
    prime.peers,
    prime.utils,
    prime.peer,
    mocks.node
));
