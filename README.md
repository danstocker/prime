Prime
=====

**Association Engine**

Prime is a concept graph with string nodes and weighted edges. Associations emerge in the graph by hopping between nodes randomly, guided by connection weights to immediate neighbors (peers), and general probability of subsequent jumps.

In this graph, from *fruit* a hop would most likely yield *food*, then *apple*, then *pear*, then one of the rest at probabilty decreasing with distance.

![Concept Graph](http://dl.dropbox.com/u/9258903/sampleConceptGraph.png)

Requires
--------

- [Troop 0.1.3](https://github.com/production-minds/troop): for OOP

Examples
--------

- [Learning app](http://jsfiddle.net/danstocker/H8vLd/): learns associations between words or short expressions.
- [Hop distribution](http://jsfiddle.net/danstocker/K63h8/): displays distribution of hop probability depending on node distance.

Usage
-----

### Building the graph

```javascript
var node = prime.node;
node('food').to(
    node('fruit').to(
        node('apple'),
        node('pear')),
    node('turkey'));
node('animal').to(
    node('bird').to(
        node('turkey')),
    node('feline').to(
        node('cat'),
        node('lion')));
```

### Modifying the graph

```javascript
// adds 3 to edge weight between 'food' and 'fruit'
node('food').to(node('fruit'), 3);
```

### Hopping

Hopping is a series of jumps between connected nodes, depending on edge weights and subsequent jump probability.

```javascript
var found = node('food').hop().load; // one of all connected nodes
```
