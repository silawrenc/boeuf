const path = './test/fixture/Example.proto';
const buffer = Buffer.from('DAoDZm9vEAEdAAAMQg==', 'base64');
const message = {
  'name': 'foo',
  'flag': true,
  'size': 35
}

const parser = (tag, o, pbf) => {
    if (tag === 1) o.name = pbf.readString();
    if (tag === 2) o.flag = pbf.readBoolean();
    if (tag === 3) o.size = pbf.readFloat();
};

const compiler = (o, pbf) => {
    if (o.name) pbf.writeStringField(1, o.name);
    if (o.flag) pbf.writeBooleanField(2, o.flag);
    if (o.size) pbf.writeFloatField(3, o.size);
};

module.exports = {path, buffer, message, parser, compiler};
