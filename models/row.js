class Row {
  constructor ({ values }) {
    this.values = values;
  }

  getProjectedValues(indexes, dataTypes) {
    const coercedValues = this.getValues(dataTypes);

    const indexedValues = [];
    coercedValues.forEach((value, index) => {
      if (indexes.includes(index)) {
        indexedValues.push(value);
      }
    });

    return indexedValues;
  }

  getValues(dataTypes) {
    const coercedValues = [];

    this.values.forEach((value, index) => {
      const dataType = dataTypes[index];
      coercedValues.push(dataType.coerce(value));
    });

    return coercedValues;
  }
}

module.exports = {
  Row,
};
