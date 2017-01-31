const Pbf = require('pbf');
const Transform = require('stream').Transform;
const maxVarintLength = 10; // fixed in https://github.com/mapbox/pbf/blob/master/index.js#L394
const join = (a, b) => Buffer.concat([a, b], a.length + b.length);


class ProtocolBufferReadStream extends Transform {
  constructor(opts) {
    opts.readableObjectMode = true;
    super(opts);
    this.parser = opts.parser;
    this.buffer = Buffer.alloc(0);
  }

  _transform(chunk, enc, callback) {
    this.buffer = Buffer.from(this.evaluate(join(this.buffer, chunk)));
    return callback();
  }

  _flush(callback) {
    this.evaluate(this.buffer, 0);
    callback();
  }

  evaluate(buffer, minLength = maxVarintLength) {
    if (buffer.length > minLength) {
      let pbf = new Pbf(buffer);
      let length = pbf.readVarint();
      if ((pbf.length - pbf.pos) >= length) {
        this.push(pbf.readFields(this.parser, {}, length));
        return this.evaluate(pbf.buf.slice(pbf.pos));
      }
    }
    return buffer;
  }
}

module.exports = ProtocolBufferReadStream
