const Pbf = require('pbf');
const varint = require('varint');
const Transform = require('stream').Transform;
const join = (a, b) => Buffer.concat([a, b], a.length + b.length);


class ProtocolBufferReadStream extends Transform {
  constructor(parser) {
    super({readableObjectMode: true});
    this.parser = parser;
    this.buffer = Buffer.alloc(0);
  }

  _transform(chunk, enc, callback) {
    this.buffer = Buffer.from(this.evaluate(join(this.buffer, chunk)));
    callback();
  }

  _flush(callback) {
    this.buffer && this.evaluate(this.buffer);
    callback();
  }

  evaluate(buffer) {
    let l, p;
    try {
      l = varint.decode(buffer);
      p = varint.decode.bytes;
    } catch (e) {
      if (e instanceof RangeError) {
        return buffer;
      } else {
        throw e;
      }
    }
    if (buffer.length - p < l) {
      return buffer;
    }
    let pbf = new Pbf(buffer);
    pbf.pos = p;
    this.push(pbf.readFields(this.parser, {}, l));
    return this.evaluate(pbf.buf.slice(pbf.pos));
  }
}

module.exports = ProtocolBufferReadStream
