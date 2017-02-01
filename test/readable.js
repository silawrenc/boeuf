const tap = require('tap')
const boeuf = require('../src/boeuf');
const example = require('./fixture/example');

tap.test('Instantiate readable from proto file', t => {
  t.type(boeuf.readable(example.path), 'ProtocolBufferReadStream');
  t.end();
});

tap.test('Instantiate readable from parser function', t => {
  t.type(boeuf.readable((tag, obj, pbf) => {}), 'ProtocolBufferReadStream');
  t.end();
});

tap.test('Instantiate readable from schema path and message', t => {
  t.type(boeuf.readable(example.path, 'Other'), 'ProtocolBufferReadStream');
  t.end();
});

tap.test('Test readable generates object from buffer with schema', t => {
  let r = boeuf.readable(example.path);
  r.on('data', obj => {
    t.same(obj, example.message);
    t.end();
  });
  r.write(example.buffer)
});

tap.test('Test readable generates object from buffer with function', t => {
  let r = boeuf.readable(example.parser);
  r.on('data', obj => {
    t.same(obj, example.message);
    t.end();
  });
  r.write(example.buffer)
});

tap.test('Test readable reads multiple', (t) => {
  let r = boeuf.readable(example.parser);

  r.on('data', obj => {
    t.same(obj, example.message);
  });
  r.on('end', () => t.end());
  r.write(example.buffer);
  r.write(example.buffer);
  r.end();

});
