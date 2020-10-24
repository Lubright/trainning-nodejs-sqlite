const fs = require('fs');
const sqlite3 = require('sqlite3').verbose(); // import sqlite module

const db_file = "./ex1_simple.db";

let db = new sqlite3.Database(db_file, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log(`Connected to the ${db_file} database.`);
});

let insert_cmd = "INSERT INTO students(_id, name, address, phone) VALUES (?,?,?,?)";
/**
 * insert record
 * @see {@link INSERT INTO} https://www.fooish.com/sql/insert-into.html
 * @see {@link run} https://github.com/mapbox/node-sqlite3/wiki/API#databaserunsql-param--callback
 * 
 */
db.run(insert_cmd, [0, "Amy", "address1", "phone1"], (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Rows inserted");
  console.log(this);
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});