const QUERY_TYPE = {
  SELECT: 'select',
  INSERT: 'insert',
  CREATE: 'create',
  DELETE: 'delete',
  UNKNOWN: 'unknown',
};

const QUERY_REGEX = {
  [QUERY_TYPE.SELECT]: /select (\*|\w+(, [\w+]*)*) from (\w+)( where (\w+ = "?\w+( \w+)*"?)( and (\w+ = "?\w+"?))*)?;/ig,
};

class SQLParser {
  parseSelect (sqlQuery) {
    const parts = Array.from(sqlQuery.matchAll(QUERY_REGEX[QUERY_TYPE.SELECT]));

    let result = {};
    if (parts && parts[0]) {
      const [
        fullMatch,
        columnsList = '*',
        lastColumn,
        from,
        whereMatch,
        ...conditions
      ] = parts[0];

      const columns = columnsList.split(',').map(columnName => columnName.trim().toLowerCase());

      let where = {};
      if (whereMatch && conditions.length) {
        where = this.parseWhereConditions(conditions);
      }

      result = {
        columns,
        from: from.toLowerCase(),
        where,
      };
    }

    return result;
  }

  parseWhereConditions (conditions = []) {
    let where = {};

    conditions
      .filter(condition => condition
        && condition.toLowerCase().includes(' = ')
        && !condition.toLowerCase().includes('and '))
      .forEach(condition => {
        const [key, value] = condition.split(' = ');

        // convert value to type
        let coercedValue;
        const lowerCaseValue = value.toLowerCase();
        if (value.startsWith('"') && value.endsWith('"')) {
          // string
          coercedValue = value.substring(1,value.length - 1);
        } else if (lowerCaseValue === 'true' || lowerCaseValue === 'false') {
          // boolean
          coercedValue = lowerCaseValue === 'true';
        } else if (!isNaN(Number(value))) {
          // number
          coercedValue = Number(value);
        }

        where[key] = coercedValue;
      });

    return where;
  }

  getQueryType (sqlQuery) {
    const query = sqlQuery.toLowerCase();
    let queryType = QUERY_TYPE.UNKNOWN;

    if (query.startsWith(QUERY_TYPE.SELECT)) {
      queryType = QUERY_TYPE.SELECT;
    } else if (query.startsWith(QUERY_TYPE.INSERT)) {
      queryType = QUERY_TYPE.INSERT;
    } else if (query.startsWith(QUERY_TYPE.CREATE)) {
      queryType = QUERY_TYPE.CREATE;
    } else if (query.startsWith(QUERY_TYPE.DELETE)) {
      queryType = QUERY_TYPE.DELETE;
    }

    return queryType;
  }
}

module.exports = {
  QUERY_TYPE,
  SQLParser,
};
