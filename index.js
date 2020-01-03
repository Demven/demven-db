const fs = require('fs');
const { promisify } = require('util');
const { TableParser } = require('./parsers/table-parser');
const { DataBase } = require('./models/database');

const readFile = promisify(fs.readFile);
const dataFiles = fs.readdirSync(`${__dirname}/data/`);

function parseTable (fileName) {
  const tableName = fileName.replace('.gdb', '');
  return readFile(`${__dirname}/data/${fileName}`, { encoding: 'utf-8' })
    .then(tableData => new TableParser(tableName).parse(tableData));
}

function buildDataBase () {
  return Promise
    .all(dataFiles.map(parseTable))
    .then(tables => new DataBase({ tables }))
    .catch(console.error);
}

async function startDataBase () {
  const dataBase = await buildDataBase();

  console.info('Database started. Tables:');
  dataBase.logTables();

  dataBase.select(['id', 'name', 'done'], 'tasks', { 'done': false })
}

startDataBase();
