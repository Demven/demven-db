class Table {
  constructor ({ name, columns, dataTypes, rows }) {
    this.name = name;
    this.columns = columns;
    this.dataTypes = dataTypes;
    this.rows = rows;
  }

  validate () {
    const tableSize = this.columns.length;

    // check that all arrays have the same length
    if (this.dataTypes.length !== tableSize) {
      throw new Error(`Data types ${this.dataTypes} don\'t correspond to the columns ${this.columns}, in the table ${this.name}`);
    }
  }

  select (columns, where) {
    const whereEntries = Object.entries(where);
    const whereColumns = Object.keys(where);
    const indexesForWhereColumns = whereColumns
      .map(whereColumnName => this.columns.findIndex(columnName => columnName === whereColumnName));

    // find rows matching "where" conditions
    const matchingRows = this.rows.filter(row => {
      const rowValues = row.getValues(this.dataTypes);

      return indexesForWhereColumns.every((columnIndex, index) => {
        const [columnName, expectedValue] = whereEntries[index];
        return rowValues[columnIndex] === expectedValue;
      });
    });

    const needToReturnAllColumns = columns[0] === '*';

    // Select only required columns
    let indexesForSelectedColumns = [];
    if (needToReturnAllColumns) {
      indexesForSelectedColumns = new Array(this.columns.length)
        .fill(0)
        .map((currentColumnIndex, index) => index);
    } else {
      indexesForSelectedColumns = columns
        .map(selectedColumnName => this.columns.findIndex(columnName => columnName === selectedColumnName));
    }

   return matchingRows.map(row => row.getProjectedValues(indexesForSelectedColumns, this.dataTypes));
  }

  getName() {
    return this.name;
  }

  toString () {
    return `
    ____ table (${this.name}) ____
    ${this.columns.join(' | ')}
    `;
  }
}

module.exports = {
  Table,
};
