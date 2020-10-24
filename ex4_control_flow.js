const sqlite3 = require('sqlite3').verbose(); // import sqlite module

const db_file = "./ex1_simple.db";
const table_name = "customers";
const is_insert_data = true;

let db = new sqlite3.Database(db_file, (err) => {
  if(err){
    throw err;
  }
  console.log(`Connected to the ${db_file} database.`);
});

let customer_data = [{
  name: "Amy",
  amount: 1.5
}, {
  name: "Jack",
  amount: 100
}, {
  name: "Candy",
  amount: 1.5
}, {
  name: "Justin",
  amount: 1.5
}, {
  name: "Mike",
  amount: 1.5
}, {
  name: "Bob",
  amount: 1.5
}];

console.log(db);
// Executing statement in serialized mode with Database.serialize
db.serialize(() => {
  // create table_name if not existed
  let sql_command = `CREATE TABLE IF NOT EXISTS ${table_name}(
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    amount REAL);`;
  db.run(sql_command, [], (err) => {
    if(err){
      throw err;
    }
    console.log(`Create ${table_name} successfully.`);
  });

  // insert data
  sql_command = `INSERT INTO ${table_name}(name, amount) VALUES (?,?);`;
  for(let i = 0; i < customer_data.length; i+=1) {
    if(!is_insert_data){
      continue;
    }
    db.run(sql_command, [customer_data[i].name, customer_data[i].amount], (err) => {
      if (err) {
        throw err;
      }
      console.log("insert data", customer_data[i]);
    });
  }

  // query
  sql_command = `SELECT * FROM ${table_name} ORDER BY _id`;
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