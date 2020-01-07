const { QUERY_TYPE } = require('../parsers/sql-parser');

class DataBase {
  constructor ({ tables, sqlParser }) {
    this.tables = tables;
    this.sqlParser = sqlParser;
  }

  logTables () {
    this.tables.forEach(table => console.log(table.toString()));
  }

  query (sqlQuery) {
    const queryType = this.sqlParser.getQueryType(sqlQuery);

    let result = [];
    switch (queryType) {
      case QUERY_TYPE.SELECT:
        const { columns, from, where } = this.sqlParser.parseSelect(sqlQuery);

        if (columns && from) {
          result = this.select(columns, from, where);
        }
        break;
      default:
        throw new Error(`Database doesn\'t support SQL query type "${queryType.toUpperCase()}" in ${sqlQuery}`);
    }

    return result;
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

    return tableToQuery.select(columns, where);
  }
}

module.exports = {
  DataBase,
};
