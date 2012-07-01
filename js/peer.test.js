/*global prime, mocks, module, test, ok, equal, notEqual, deepEqual, raises */
(function ($peer, $node) {
    module("Peer");

    test("Creation", function () {
        var hello = $node('hello'),
            blah = $node('blah'),
            peer = $peer.create(hello);

        equal(peer.node, hello, "Method '.node'");
        equal(peer.node.load, 'hello', "Method '.load'");
        equal(peer.tread, 1, "Default peer tread");

        peer = $peer.create(blah, 5);
        equal(peer.node.load, 'blah', "Peer created from string");
        equal(peer.node.load, 'blah', "String-created peer has new node object");
        equal(peer.tread, 5, "Custom peer tread");
    });

    test("Tread", function () {
        var hello = $node('hello'),
            peer = $peer.create(hello),
            tmp;

        equal(peer.tread, 1, "Initial tread 1");

        tmp = peer.wear();
        equal(tmp, peer, "Method '.wear' return self");
        equal(peer.tread, 2, "Default wear is 1");

        peer.wear(5);
        equal(peer.tread, 7, "Adding custom wear");
    });
}(
    prime.Peer,
    prime.node
));
