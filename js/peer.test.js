/*global prime, mocks, module, test, ok, equal, notEqual, deepEqual, raises */
(function ($peer, $node) {
    module("Peer");

    test("Creation", function () {
        var hello = $node('hello'),
            blah = $node('blah'),
            peer = $peer(hello);

        equal(peer.node(), hello, "Method '.node'");
        equal(peer.load(), 'hello', "Method '.load'");

        peer = $peer(blah);
        equal(peer.load(), 'blah', "Peer created from string");
        equal(peer.node().load(), 'blah', "String-created peer has new node object");
    });

    test("Tread", function () {
        var hello = $node('hello'),
            peer = $peer(hello),
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
