const sqlite3 = require('sqlite3').verbose(); // import sqlite module

const db_file = "./ex1_simple.db";
const table_name = "customers";

let db = new sqlite3.Database(db_file, (err) => {
  if(err){
    throw err;
  }
  console.log(`Connected to the ${db_file} database.`);
});


// Executing statement in serialized mode with Database.serialize
db.serialize(() => {

  // update data
  // let sql_command = `UPDATE ${table_name} SET amount=? WHERE name=? IN
  // (SELECT );`;
  // db.run(sql_command, [45000, "Bob"], (err) => {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log("update successfully.");
  // });

  let sql_command = `UPDATE ${table_name} SET amount=23225 WHERE _id IN (SELECT _id FROM ${table_name} WHERE name="Bob" LIMIT 1);`;
  db.all(sql_command, [], (err, rows) => {
    if(err){
      throw err;
    }
    rows.forEach( (row) => {
      console.log(row);
    } );
  });

});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});