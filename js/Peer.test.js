/*global prime, mocks, module, test, ok, equal, notEqual, deepEqual, raises */
(function ($Peer, $node) {
    module("Peer");

    test("Creation", function () {
        var hello = $node('hello'),
            blah = $node('blah'),
            peer = $Peer.create(hello);

        equal(peer.node, hello, "Method '.node'");
        equal(peer.node.load, 'hello', "Method '.load'");
        equal(peer.tread, 0, "Default peer tread");

        peer = $Peer.create(blah, 5);
        equal(peer.node.load, 'blah', "Peer created from string");
        equal(peer.node.load, 'blah', "String-created peer has new node object");
        equal(peer.tread, 5, "Custom peer tread");
    });

    test("Tread", function () {
        var hello = $node('hello'),
            peer = $Peer.create(hello),
            tmp;

        equal(peer.tread, 0, "Initial tread 1");

        tmp = peer.wear();
        equal(tmp, peer, "Method '.wear' return self");
        equal(peer.tread, 1, "Default wear is 1");

        peer.wear(5);
        equal(peer.tread, 6, "Adding custom wear");
    });

    test("toJSON", function () {
        var hello = $node('hello'),
            peer = $Peer.create(hello);

        deepEqual(Object.keys(peer.toJSON()), ['node', 'tread'], "Keys included in JSON representation");
        equal(JSON.stringify(peer), '{"node":{"load":"hello"},"tread":0}', "JSON representation of peer");
    });

    test("fromJSON", function () {
        var peerJSON = {
                node: {
                    load: 'hello'
                },
                tread: 2
            },
            peer = $Peer.create($node('hello'), 2);

        deepEqual(
            $Peer.fromJSON(peerJSON),
            peer,
            "Peer re-initialized from JSON"
        );
    });
}(
    prime.Peer,
    prime.node
));
