Prime
=====

*Prime* is a JavaScript graph database designed for one kind of queries: *random*.

Prime connects string nodes by weighted edges, and offers means to hop from one node to another randomly, guided by the weight distribution of edges, and also a general probability of subsequent jumps.

In the graph below, a hop from *fruit* would most likely lead to *food*, then *apple*, then *pear*, then the rest at probability decreasing with distance.

![Concept Graph](http://dl.dropbox.com/u/9258903/sampleConceptGraph.png)

Requires
--------

- [Dessert](https://github.com/danstocker/dessert): for assertions
- [Troop](https://github.com/production-minds/troop): for OOP
- [Sntls](https://github.com/danstocker/sntls): for collections and profiles

Check `js/namespace.js` for version numbers.

Examples
--------

- [Learning app](http://jsfiddle.net/danstocker/H8vLd/): learns associations between words or short expressions.
- [Hop distribution](http://jsfiddle.net/danstocker/K63h8/): displays distribution of hop probability depending on node distance.

Usage
-----

### Creating a graph

```javascript
var graph = prime.Graph.create();
```

### Fetching nodes from the graph

Or, creating one on demand.

```javascript
var $ = graph.getFetcher(),
    node;

node = $('foo');
// or
node = graph.fetchNode('foo');
```

### Building the graph

Quickly connecting nodes that are created on the fly.

```javascript
var _ = graph.getConnector();

_('food',
    _('fruit',
        'apple',
        'pear'),
    _('turkey'));
_('animal',
    _('bird',
        'turkey'),
    _('feline',
        'cat',
        'lion'));
```

### Modifying the graph

```javascript
// adds 3 to edge weight between 'food' and 'fruit'
$('food').to($('fruit'), 3);
```

### Hopping

Hopping is a series of semi-random jumps between connected nodes.

```javascript
var found = $('food').hop().load; // one of all connected nodes
```
