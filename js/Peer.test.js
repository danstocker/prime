/*global prime, mocks, module, test, ok, equal, notEqual, deepEqual, raises */
(function (Peer, Node) {
    module("Peer");

    test("Creation", function () {
        var node = Node.create('hello'),
            peer;

        peer = Peer.create(node);
        equal(peer.node.load, 'hello', "Peer load");
        equal(peer.tread(), 0, "Default peer tread");
    });

    test("Tread", function () {
        var node = Node.create('hello'),
            peer = Peer.create(node),
            tmp;

        equal(peer.tread(), 0, "Initial tread zero");

        tmp = peer.wear();
        equal(tmp, peer, "Method '.wear' return self");
        equal(peer.tread(), 1, "Default wear is 1");

        peer.wear(5);
        equal(peer.tread(), 6, "Adding custom wear");
    });

    test("JSON", function () {
        var peer = Peer.create('hello').wear(5);

        equal(
            JSON.stringify(peer),
            '5',
            "Full peer JSON"
        );
    });
}(prime.Peer, prime.Node));
