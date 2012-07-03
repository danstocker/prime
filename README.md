Prime
=====

**Association Engine**

Prime is a concept graph with string nodes and weighted edges. Associations emerge in the graph by hopping between nodes randomly, guided by connection weights to immediate neighbors (peers), and general probability of subsequent jumps.

Requires
--------

- [Troop 0.1.3](https://github.com/production-minds/troop)

Usage
-----

### Building the graph

```javascript
var node = prime.node;
node('table').to(
    node('cup').to(
        node('small'),
        node('white')),
    node('cloth'),
    node('food').to(
        node('warm'),
        node('taste')
    )
);
```

### Modifying the graph

```javascript
// adds 3 to edge weight between 'table' and 'cup'
node('table').to(node('cup'), 3);
```

### Hopping

Hopping is a series of jumps between connected nodes, depending on edge weights and subsequent jump probability.

```javascript
var found = node('table').hop().load; // one of all connected nodes
```
