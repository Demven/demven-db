class DataBase {
  constructor ({ tables }) {
    this.tables = tables;
  }

  logTables () {
    this.tables.forEach(table => console.log(table.toString()));
  }

  select (columns, from, where) {
    if (!columns || !Array.isArray(columns)) {
      throw new Error(`SELECT: Specify columns to select from table ${from}`);
    }

    if (!from || typeof from !== 'string') {
      throw new Error(`SELECT: Invalid table name ${from}`);
    }

    if (where && typeof where !== 'object') {
      throw new Error(`SELECT: Specify a correct "where" part for the query from the table ${from}`);
    }

    const tableToQuery = this.tables.find(table => table.getName() === from);
    tableToQuery.select(columns, where);
  }
}

module.exports = {
  DataBase,
};
