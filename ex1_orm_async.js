const {SQLite3_ORM} = require("./lib/sqlite_orm.js");

let db = new SQLite3_ORM("./lib/sqlite_orm.conf");

async function run() {
  db.connect();
  let result = await db.createTableSync("test2", {
    name: "TEXT",
    num: "REAL"
  });
  console.log(result);

  result = await db.insertSync([{
    name: "Amy",
    num: 12 
   }, {
     name: "Bob",
     num: 25
  }]);
  console.log(result);

}


run();