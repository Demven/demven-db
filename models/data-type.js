const DATA_TYPE = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
};

const SUPPORTED_DATA_TYPES = [
  DATA_TYPE.STRING,
  DATA_TYPE.NUMBER,
  DATA_TYPE.BOOLEAN,
];

class DataType {
  constructor ({ type }) {
    if (SUPPORTED_DATA_TYPES.includes(type)) {
      this.type = type;
    } else {
      throw new Error(`Data type is not supported: ${type}`);
    }
  }

  coerce(value) {
    let coercedValue;

    switch (this.type) {
      case DATA_TYPE.STRING:
        coercedValue = value;
        break;
      case DATA_TYPE.NUMBER:
        coercedValue = Number(value);
        break;
      case DATA_TYPE.BOOLEAN:
        coercedValue = value === 'true';
        break;
      default:
        throw new Error(`Can\'t coerce value ${value} to data type ${this.type}`);
    }

    return coercedValue;
  }
}

module.exports = {
  DataType,
  DATA_TYPE,
  SUPPORTED_DATA_TYPES,
};
