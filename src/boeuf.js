const compile = require('pbf/compile');
const schema = require('protocol-buffers-schema');
const path = require('path');
const fs = require('fs');
const ProtocolBufferReadStream = require('./ProtocolBufferReadStream');
const ProtocolBufferWriteStream = require('./ProtocolBufferWriteStream');

const boeuf = {
  readable(schema, message) {
    return new ProtocolBufferReadStream(parser(schema, message));
  },
  writable(schema, message) {
    return new ProtocolBufferWriteStream(compiler(schema, message));
  }
};

const parser = (schema, message) => {
  return (typeof schema === 'function') ? schema : proto(schema, message)._readField;
}
const compiler = (schema, message) => {
  return (typeof schema === 'function') ? schema : proto(schema, message).write;
}

const proto = (schemaPath, message) => {
  if (fs.statSync(schemaPath).isFile()) {
    let compiled = compile(schema.parse(fs.readFileSync(schemaPath)));
    message = message || path.basename(schemaPath, '.proto');
    if (compiled.hasOwnProperty(message)) {
      return compiled[message];
    }
  }
  throw new Error('Valid message schema or function must be provided');
}

module.exports = boeuf;
