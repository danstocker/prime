/*global prime, mocks, module, test, ok, equal, notEqual, deepEqual, raises */
(function (Peer) {
    module("Peer");

    test("Creation", function () {
        var peer;

        peer = Peer.create('hello');
        equal(peer.node.load, 'hello', "Peer load");
        equal(peer.tread(), 0, "Default peer tread");
    });

    test("Tread", function () {
        var peer = Peer.create('hello'),
            tmp;

        equal(peer.tread(), 0, "Initial tread zero");

        tmp = peer.wear();
        equal(tmp, peer, "Method '.wear' return self");
        equal(peer.tread(), 1, "Default wear is 1");

        peer.wear(5);
        equal(peer.tread(), 6, "Adding custom wear");
    });

    test("toJSON", function () {
        var peer = Peer.create('hello').wear(5);

        equal(
            JSON.stringify(peer),
            '5',
            "Full peer JSON"
        );
    });

    test("fromJSON", function () {
        var peerJSON = 2,
            peer = Peer.create('hello').wear(2);

        deepEqual(
            Peer.fromJSON('hello', peerJSON),
            peer,
            "Peer re-initialized from JSON"
        );
    });
}(
    prime.Peer
));
