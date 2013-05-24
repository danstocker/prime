/*global prime, mocks, module, test, ok, equal, notEqual, deepEqual, raises */
(function () {
    "use strict";

    module("Peer");

    test("Creation", function () {
        var node = prime.Node.create('hello'),
            peer;

        peer = prime.Peer.create(node);
        equal(peer.node.load, 'hello', "Peer load");
        equal(peer.getTread(), 0, "Default peer tread");
    });

    test("Tread", function () {
        var node = prime.Node.create('hello'),
            peer = prime.Peer.create(node),
            tmp;

        equal(peer.getTread(), 0, "Initial tread zero");

        tmp = peer.wear();
        equal(tmp, peer, "Method '.wear' return self");
        equal(peer.getTread(), 1, "Default wear is 1");

        peer.wear(5);
        equal(peer.getTread(), 6, "Adding custom wear");
    });

    test("JSON", function () {
        var peer = prime.Peer.create('hello').wear(5);

        equal(
            JSON.stringify(peer),
            '5',
            "Full peer JSON"
        );
    });
}());
