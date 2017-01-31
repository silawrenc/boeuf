# Boeuf

**Boeuf** is a node stream wrapper for protocol buffers. Under the hood it uses the [mapbox pbf](https://github.com/mapbox/pbf) library for parsing and compiling, so can be used with either `.proto` schemas or with custom read/write functions.

## Usage

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

both `boeuf#readable` and `boeuf#writable` accept as a sole argument:
1. a string path to a protocol buffers schema file (in which case the message name matching the name of the file given is used);
2. an options object with properties `schema` and `message` which define the schema file path, and name of the message within it to use;
3. a custom read or write function.

```js
boeuf.readable('./Message.proto'); // 1.
boeuf.readable({
  schema: './definitions.proto',
  message: 'Handshake'
}); // 2.
bouef.writable(myCustomWriteFn); // 3.
```


### custom read/write functions
Message framing is handled by the library, so a custom read/write function need only deal with reading and writing fields. Example read and write functions are given here but more information can be found under the [mapbox/pbf](https://github.com/mapbox/pbf) library.

```js
// o = object to write as message, pbf is an instance of mapbox/pbf.
function myCustomWriteFunction(o, pbf) {
  if (o.name) pbf.writeStringField(1, o.name);
  if (o.flag) pbf.writeBooleanField(2, o.flag);
  if (o.size) pbf.writeFloatField(3, o.size);
}

// tag is the protocol buffer tag, o and pbf as above,
function myCustomReadFunction(tag, o, pbf) {
  if (tag === 1) o.name = pbf.readString();
  if (tag === 2) o.flag = pbf.readBoolean();
  if (tag === 3) o.size = pbf.readFloat();
}
```
