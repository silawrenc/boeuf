const Pbf = require('pbf');
const Transform = require('stream').Transform;

class ProtocolBufferWriteStream extends Transform {
  constructor(compiler) {
    super({writableObjectMode: true});
    this.compiler = compiler;
  }

  _transform(obj, enc, callback) {
    let pbf = new Pbf();
    pbf.writeRawMessage(this.compiler, obj);
    let chunk = Buffer.from(pbf.finish());
    this.push(chunk);
    callback();
  }
}

module.exports = ProtocolBufferWriteStream
