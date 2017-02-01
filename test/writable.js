const tap = require('tap')
const boeuf = require('../src/boeuf');
const example = require('./fixture/example');

tap.test('Instantiate writable from proto file', (t) => {
  t.type(boeuf.writable(example.path), 'ProtocolBufferWriteStream');
  t.end();
});

tap.test('Instantiate writable from parser function', (t) => {
  t.type(boeuf.writable((tag, obj, pbf) => {}), 'ProtocolBufferWriteStream');
  t.end();
});

tap.test('Instantiate writable from schema path and message', (t) => {
  t.type(boeuf.writable(example.path, 'Other'), 'ProtocolBufferWriteStream');
  t.end();
});

tap.test('Test writable generates buffer from object with schema', (t) => {
  let w = boeuf.writable(example.path);
  w.on('data', buffer => {
    t.same(buffer, example.buffer);
    t.end();
  });
  w.write(example.message);
});

tap.test('Test writable generates buffer from object with function', (t) => {
  let w = boeuf.writable(example.compiler);
  w.on('data', buffer => {
    t.same(buffer, example.buffer);
    t.end();
  });
  w.write(example.message);
});

tap.test('Test writable writes multiple', (t) => {
  let w = boeuf.writable(example.compiler);

  w.write(example.message);
  w.write(example.message);
  t.end();
});
