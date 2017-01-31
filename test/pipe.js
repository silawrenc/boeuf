const tap = require('tap')
const boeuf = require('../src/boeuf');
const example = require('./fixture/example');
const stream = require('stream');

tap.test('Test pipe round trip starting with write', (t) => {
  let r = boeuf.readable(example.path);
  let w = boeuf.writable(example.path);
  w.pipe(r);

  r.on('data', message => {
    t.same(message, example.message);
    t.end()
  });
  w.write(example.message);
});

tap.test('Test pipe round trip starting with read', (t) => {
  let r = boeuf.readable(example.path);
  let w = boeuf.writable(example.path);
  r.pipe(w);

  w.on('data', buffer => {
    t.same(buffer, example.buffer);
    t.end()
  });
  r.write(example.buffer);
});

tap.test('Test pipe through chunking intermediary stream', (t) => {
  let r = boeuf.readable(example.path);
  let w = boeuf.writable(example.path);
  let i = new stream.Transform({
    transform(chunk, enc, callback) {
      for (let i = 0; i < chunk.length; i+=2) {
        this.push(chunk.slice(i, i+2));
      }
      callback();
    }
  });

  w.pipe(i).pipe(r);

  r.on('data', message => t.same(message, example.message));
  r.on('end', () => t.end());
  w.write(example.message);
  w.end();
});
