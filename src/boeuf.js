const compile = require('pbf/compile');
const schema = require('protocol-buffers-schema');
const path = require('path');
const fs = require('fs');
const ProtocolBufferReadStream = require('./ProtocolBufferReadStream');
const ProtocolBufferWriteStream = require('./ProtocolBufferWriteStream');

const boeuf = {
  readable(opts) {
    return new ProtocolBufferReadStream(parser(opts));
  },
  writable(opts) {
    return new ProtocolBufferWriteStream(compiler(opts, 'write'));
  }
};

const parser = (opts) => {
  let parser = (typeof opts === 'function') ? opts : message(opts)._readField
  return options({parser}, opts);
}

const compiler = (opts) => {
  let compiler = (typeof opts === 'function') ? opts : message(opts).write
  return options({compiler}, opts);
}

const message = (opts) => {
  let options = typeof opts === 'string' ? {schema: opts} : opts;
  if (!options.schema) {
    throw new Error('Schema or function must be provided');
  }
  let message = options.message || path.basename(options.schema, '.proto');
  let proto = compile(schema.parse(fs.readFileSync(options.schema)));
  return proto[message];
}

const options = (include, from) => {
  if (typeof from === 'object') {
    Object.assign(include, from);
    delete include.schema;
    delete include.message;
  }
  return include;
}

module.exports = boeuf;
