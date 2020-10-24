const {SQLite3_ORM} = require("./lib/sqlite_orm.js");

let db = new SQLite3_ORM("./lib/sqlite_orm.conf");

db.connect();
db.createTable("test2", {
  name: "TEXT",
  num: "REAL"
});

db.serialize(() => {
  db.insert([{
    name: "Amy",
    num: 12 
   }, {
     name: "Bob",
     num: 25
  }]);

  db.updateOne({num: 230}, {name: "Amy"});

  db.find({name: "Amy"}).then((records)=>{
    console.log(records);
  });

  db.findOne({name: "Amy"}).then((records)=>{
    console.log(records);
  });

});

// db.remove({name: "Amy"});
// db.removeOne({name: "Bob"});

// db.clear();
// db.drop();



db.disconnect();