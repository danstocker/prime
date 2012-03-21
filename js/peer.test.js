/*global module, test, ok, equal, notEqual, deepEqual, raises */
(function ($peer, $node) {
    module("Peer");

    test("Creation", function () {
        var node = $node('hello'),
            peer = $peer(node);

        equal(peer.node(), node, "Method '.node'");
        equal(peer.load(), 'hello', "Method '.load'");
    });

    test("Tread", function () {
        var node = $node('hello'),
            peer = $peer(node),
            tmp;

        equal(peer.tread(), 1, "Initial tread 1");

        tmp = peer.wear();
        equal(tmp, peer, "Method '.wear' return self");
        equal(peer.tread(), 2, "Default wear is 1");

        peer.wear(5);
        equal(peer.tread(), 7, "Adding custom wear");
    });
}(
    prime.peer,
    mocks.node
));
