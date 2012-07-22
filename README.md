Prime
=====

*Prime* is a JavaScript graph database designed for one kind of queries: *random*.

Prime connects string nodes by weighted edges, and offers means to hop from one node to another randomly, guided by the weight distribution of edges, and also a general probability of subsequent jumps.

In the graph below, a hop from *fruit* would most likely lead to *food*, then *apple*, then *pear*, then the rest at probability decreasing with distance.

![Concept Graph](http://dl.dropbox.com/u/9258903/sampleConceptGraph.png)

Requires
--------

- [Troop 0.1.4](https://github.com/production-minds/troop): for OOP

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

Hopping is a series of semi-random jumps between connected nodes.

```javascript
var found = node('food').hop().load; // one of all connected nodes
```
