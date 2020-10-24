const sqlite3 = require('sqlite3').verbose(); // import sqlite module

const db_file = "./ex1_simple.db";

let db = new sqlite3.Database(db_file, (err) => {
  if(err){
    throw err;
  }
  console.log(`Connected to the ${db_file} database.`);
});

// Executing statement in serialized mode with Database.serialize
db.serialize(() => {
  db.all("SELECT name from sqlite_master WHERE type='table';", function (err, tables) {
    console.log(tables);
  });
});

db.close((err) => {
  if(err){
    throw err;
  }
  console.log('Close the database connection.');
});