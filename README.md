# Boeuf

**Boeuf** is a node stream wrapper for protocol buffers. Under the hood it uses the [mapbox pbf](https://github.com/mapbox/pbf) library for parsing and compiling, so can be used with either `.proto` schemas or with custom read/write functions.

### Usage

```js
const boeuf = require('boeuf');

let ws = boeuf.writable('./path/to/schema.proto');
let rs = boeuf.readable('./path/to/schema.proto');

ws.pipe(process.stdout);
ws.write({foo: 1, bar: 2});

rs.on('data', message => {
  // message is a parsed message as a js object
})
process.stdin.pipe(rs);
```

valid arguments for `boeuf#readable` and `boeuf#writable` are:

1. a string path to a protocol buffers schema file (in which case the message name matching the name of the file given is used);
2. as above but with a second argument specifying which message to use;
3. a custom read or write function.

```js
boeuf.readable('./Message.proto'); // 1.
boeuf.readable('./definitions.proto', 'Handshake'); // 2.
bouef.writable(myCustomWriteFn); // 3.
```

### Custom read/write functions
Message framing is handled by the library, so a custom read/write function need only deal with reading and writing fields. Example read and write functions are given here but more information can be found under the [mapbox/pbf](https://github.com/mapbox/pbf) library.

```js
// o = object to write as message, pbf = instance of mapbox/pbf.
function myCustomWriteFunction(o, pbf) {
  if (o.name) pbf.writeStringField(1, o.name);
  if (o.flag) pbf.writeBooleanField(2, o.flag);
  if (o.size) pbf.writeFloatField(3, o.size);
}

// tag = the protocol buffer tag, o and pbf as above,
function myCustomReadFunction(tag, o, pbf) {
  if (tag === 1) o.name = pbf.readString();
  if (tag === 2) o.flag = pbf.readBoolean();
  if (tag === 3) o.size = pbf.readFloat();
}
```

### Multiplexing
```js
const multiplex = require('multiplex');
const boeuf = require('./src/boeuf');

// set up multiplexer...
let multiplexer = multiplex();
let fooWritable = boeuf.writable('./Foo.proto');
let barWritable = boeuf.writable('./Bar.proto');
fooWritable.pipe(multiplexer.createStream('1'));
barWritable.pipe(multiplexer.createStream('2'));

//...somewhere else set up demultiplexer
let demultiplexer = multiplex();
let fooReadable = boeuf.readable('./Foo.proto');
let barReadable = boeuf.readable('./Bar.proto');
demultiplexer.receiveStream('1').pipe(fooReadable);
demultiplexer.receiveStream('2').pipe(barReadable);

//connect the two
multiplexer.pipe(demultiplexer);

// write something
fooWritable.write({foo: 'hello world'});
barWritable.write({bar: 'hello world'});
```

Multiplexing can be used to send/receive different message formats over a single transport, or internally for making sure the correct message arrives at the correct parser.

### Install
```
npm install boeuf
```
