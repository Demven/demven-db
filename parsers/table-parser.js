const { Table } = require('../models/table');
const { Row } = require('../models/row');
const { DataType } = require('../models/data-type');

const LINE_TYPE = {
  COLUMNS: '____COLUMNS____',
  DATA_TYPES: '____DATA_TYPES____',
  VALUES: '____VALUES____',
};

class TableParser {
  constructor(tableName) {
    this.tableName = tableName;

    this.columns = [];
    this.dataTypes = [];
    this.values = [];

    this.table = null;
  }

  parse(data) {
    const lines = data.trim().split('\n');

    let currentLineType;
    lines.forEach(line => {
      // define line type
      if (line === LINE_TYPE.COLUMNS) {
        currentLineType = LINE_TYPE.COLUMNS;
      } else if (line === LINE_TYPE.DATA_TYPES) {
        currentLineType = LINE_TYPE.DATA_TYPES;
      } else if (line === LINE_TYPE.VALUES) {
        currentLineType = LINE_TYPE.VALUES;
      } else {
        // parse line content
        switch (currentLineType) {
          case LINE_TYPE.COLUMNS:
            this.parseColumns(line);
            break;
          case LINE_TYPE.DATA_TYPES:
            this.parseDataTypes(line);
            break;
          case LINE_TYPE.VALUES:
            this.parseValues(line);
            break;
        }
      }
    });

    this.table = new Table({
      name: this.tableName,
      columns: this.columns,
      dataTypes: this.dataTypes,
      rows: this.values.map(values => new Row({ values })),
    });

    this.table.validate();

    return this.table;
  }

  parseColumns(line) {
    const columns = line.split(';');

    if (columns.length > 1) {
      columns.forEach(columnName => {
        if (columnName && columnName.length > 0) {
          this.columns.push(columnName);
        } else {
          throw new Error(`Column name can\'t be empty: ${columns}, in the table ${this.tableName}`);
        }
      });
    } else {
      throw new Error(`Table ${this.tableName} must contain at least 2 columns, found only: ${columns}`);
    }

    console.info('columns', this.columns);
  }

  parseDataTypes(line) {
    this.dataTypes = line
      .split(';')
      .map(type => new DataType({ type }));

    console.info('dataTypes', this.dataTypes);
  }

  parseValues(line) {
    this.values.push(line.split(';'));
  }
}

module.exports = {
  TableParser,
};
