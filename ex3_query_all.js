const fs = require('fs');
const sqlite3 = require('sqlite3').verbose(); // import sqlite module

const db_file = "./ex1_simple.db";
const table_name = "students";

let db = new sqlite3.Database(db_file, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log(`Connected to the ${db_file} database.`);
});

let query_cmd = `SELECT * FROM ${table_name} ORDER BY _id`;
/**
 * query all records
 * @see {@link SELECT} https://www.fooish.com/sql/select.html
 * @see {@link Querying Data in SQLite Database from Node.js Applications} https://www.sqlitetutorial.net/sqlite-nodejs/query/
 * 
 */
db.all(query_cmd, [], (err, rows) => {
  if(err){
    throw err;
  }
  rows.forEach( (row) => {
    console.log(row);
  } );
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});