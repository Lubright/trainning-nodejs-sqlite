const fs = require('fs');
const sqlite3 = require('sqlite3').verbose(); // import sqlite module

const db_file = "./ex1_simple.db";

// console.log(sqlite3);

let db = new sqlite3.Database(db_file, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log(`Connected to the ${db_file} database.`);
});

/**
 * create table
 * @see {@link SQL CREATE TABLE} https://www.fooish.com/sql/create-table.html
 * @see {@link Inserting Data Into an SQLite Table from a Node.js Application} https://www.sqlitetutorial.net/sqlite-nodejs/insert/
 * 
 */
db.run('CREATE TABLE students(\
  _id INTEGER,\
  name TEXT,\
  address TEXT,\
  phone TEXT\
  )');

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});