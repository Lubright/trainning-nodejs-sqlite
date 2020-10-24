const fs = require("fs");
const path = require("path");
const sqlite3 = require('sqlite3').verbose(); // import sqlite module

class SQLite3_ORM {
  /**
   * initialize the sqlite config
   * @constructor
   * @param {string} fileName 
   * 
   */
  constructor(fileName) {
    /** @access private */
    let sqlite_conf = (fs.existsSync(fileName))? JSON.parse(fs.readFileSync(fileName, "utf-8")) : null;

    if(!sqlite_conf){
      throw new Error(`${fileName} not found`);
    }

    /**
     * the db file
     * @member {string}
     */
    this.db_file = sqlite_conf.db.file;

    /**
     * the primary_key
     * @member {string}
     */
    this.primary_key = sqlite_conf.db.PK;

    /**
     * db
     * @member {object} sqlite3.Database object
     */
    this.db = null;

    this.tabel_name = null;
  }

  connect() {
    this.db = new sqlite3.Database(this.db_file, (err) => {
      if (err) {
        throw err;
      }
      console.log(`Connected to the ${this.db_file} database.`);

    });
  }

  /**
   * 
   * @param {string} table_name 
   * @param {object} model 
   */
  createTable(table_name, model) {
    // create table_name if not existed
    let sql_command = `CREATE TABLE IF NOT EXISTS ${table_name}(
      ${this.primary_key} INTEGER PRIMARY KEY AUTOINCREMENT,
      _id TEXT,
      ${Object.entries(model).map( entry => entry.join(" ") ).join(", ")});`;
    
    this.tabel_name = table_name;
    this.db.run(sql_command, [], (err) => {
      if(err){
        throw err;
      }
      console.log(`Create ${this.tabel_name} successfully.`);
    });
  }

  /**
   * 
   * @param {string} table_name 
   * @param {object} model 
   */
  createTableSync(table_name, model) {
    // create table_name if not existed
    let sql_command = `CREATE TABLE IF NOT EXISTS ${table_name}(
      ${this.primary_key} INTEGER PRIMARY KEY AUTOINCREMENT,
      _id TEXT,
      ${Object.entries(model).map( entry => entry.join(" ") ).join(", ")});`;
    
    this.tabel_name = table_name;

    return new Promise((resolve, reject) => {
      this.db.run(sql_command, [], (err) => {
        if(err){
          reject(err);
        }
        console.log(`Create ${this.table_name} successfully.`);
        resolve(0);
      });
    });

  }

  /**
   * 
   * @param {function} callback 
   */
  serialize(callback) {    
    this.db.serialize(callback);
  }

  getHashText() {
    return new Date();
  }

  /**
   * 
   * @param {*} data 
   * @param {*} table_name 
   */
  insert(data, table_name) {
    table_name = table_name || this.tabel_name;
    let refData = Object.assign({}, data[0]);
    refData = Object.assign(refData, {_id: this.getHashText()});
    let keysOfData = Object.keys(refData);
    let data_key_statement = keysOfData.join(", ");
    let data_value_statement = keysOfData.map( key => "?").join(",");
    
    let sql_command = `INSERT INTO ${table_name}(${data_key_statement}) VALUES (${data_value_statement});`;

    this.db.serialize(()=>{
      for(let i = 0; i < data.length; i+=1) {
        let valuesOfData = Object.values(Object.assign(data[i], {_id: this.getHashText()}));

        this.db.run(sql_command, valuesOfData, (err) => {
          if (err) {
            throw err;
          }
          console.log("insert data", valuesOfData);
        });
      } // end data loop
    });
  }
  
  insertSync(data, table_name) {
    table_name = table_name || this.tabel_name;
    let refData = Object.assign({}, data[0]);
    refData = Object.assign(refData, {_id: this.getHashText()});
    let keysOfData = Object.keys(refData);
    let data_key_statement = keysOfData.join(", ");
    let data_value_statement = keysOfData.map( key => "?").join(",");
    
    let sql_command = `INSERT INTO ${table_name}(${data_key_statement}) VALUES (${data_value_statement});`;


    return new Promise((resolve, reject) => {
      this.db.serialize(()=>{
        for(let i = 0; i < data.length; i+=1) {
          let valuesOfData = Object.values(Object.assign(data[i], {_id: this.getHashText()}));

          this.db.run(sql_command, valuesOfData, (err) => {
            if (err) {
              reject(err);
            }
            console.log("insert data", valuesOfData);
          });
        } // end data loop
        resolve(0);
      });
    }); // end return
  } // end insertSync

  update(updateData, filterObj, table_name) {
    table_name = table_name || this.tabel_name;
    let update_key_statement = Object.keys(updateData).map( e => e+"=?" ).join(", ");
    // let update_value_statement = Object.values(updateData).map( e => e+"=?" ).join(", ");
    let filter_key_statement = Object.keys(filterObj).map( e => e+"=?").join(", ");
    // let filter_value_statement = Object.values(filterObj).map( e => e+"=?").join(", ");
    // update data
    let sql_command = `UPDATE ${table_name} SET ${update_key_statement} WHERE ${filter_key_statement};`;
    // console.log(sql_command)

    this.db.run(sql_command, [...Object.values(updateData), ...Object.values(filterObj)], (err) => {
      if (err) {
        throw err;
      }
      console.log("update successfully.");
    });

  }

  updateOne(updateData, filterObj, table_name) {
    table_name = table_name || this.tabel_name;
    let update_key_statement = Object.keys(updateData).map( e => e+"=?" ).join(", ");
    // let update_value_statement = Object.values(updateData).map( e => e+"=?" ).join(", ");
    let filter_key_statement = Object.keys(filterObj).map( e => e+"=?").join(", ");
    // let filter_value_statement = Object.values(filterObj).map( e => e+"=?").join(", ");
    // update data
    let sql_command = `UPDATE ${table_name} SET ${update_key_statement} WHERE ${this.primary_key} IN (SELECT ${this.primary_key} FROM ${table_name} WHERE ${filter_key_statement} LIMIT 1);`;
    // console.log(sql_command)

    this.db.run(sql_command, [...Object.values(updateData), ...Object.values(filterObj)], (err) => {
      if (err) {
        throw err;
      }
      console.log("update successfully.");
    });

  }

  find(filterObj, table_name) {
    table_name = table_name || this.tabel_name;
    let filter_key_statement = Object.keys(filterObj).map( e => e+"=?").join(", ");
    let sql_command = `SELECT * FROM ${table_name}
    WHERE ${filter_key_statement}
    ORDER BY ${this.primary_key}`;

    return new Promise((resolve, reject) => {
      this.db.all(sql_command, Object.values(filterObj), (err, rows) => {
        if(err){
          reject(err);
        }
        resolve(rows);
      });
    });

  }

  findOne(filterObj, table_name) {
    table_name = table_name || this.tabel_name;
    let filter_key_statement = Object.keys(filterObj).map( e => e+"=?").join(", ");
    let sql_command = `SELECT * FROM ${table_name}
    WHERE ${filter_key_statement}
    ORDER BY ${this.primary_key}`;

    return new Promise((resolve, reject) => {
      this.db.get(sql_command, Object.values(filterObj), (err, row) => {
        if(err){
          reject(err);
        }
        resolve(row);
      });
    });

  }

  remove(filterObj, table_name) {
    table_name = table_name || this.tabel_name;
    let filter_key_statement = Object.keys(filterObj).map( e => e+"=?").join(", ");
    let sql_command = `DELETE FROM ${table_name}
    WHERE ${filter_key_statement};`;

    return new Promise((resolve, reject) => {
      this.db.get(sql_command, Object.values(filterObj), (err, row) => {
        if(err){
          reject(err);
        }
        resolve(row);
      });
    });
  }

  removeOne(filterObj, table_name) {
    table_name = table_name || this.tabel_name;
    let filter_key_statement = Object.keys(filterObj).map( e => e+"=?").join(", ");
    let sql_command = `DELETE FROM ${table_name}
    WHERE ${this.primary_key} IN (SELECT ${this.primary_key} FROM ${table_name} WHERE ${filter_key_statement} LIMIT 1);`;

    return new Promise((resolve, reject) => {
      this.db.get(sql_command, Object.values(filterObj), (err, row) => {
        if(err){
          reject(err);
        }
        resolve(row);
      });
    });
  }

  clear(table_name) {
    table_name = table_name || this.tabel_name;
    let sql_command = `DELETE FROM ${table_name};`;

    return new Promise((resolve, reject) => {
      this.db.run(sql_command, [], (err) => {
        if (err) {
          throw err;
        }
        console.log("clear successfully.");
      });
    });

  }

  drop(table_name) {
    table_name = table_name || this.tabel_name;
    let sql_command = `DROP TABLE ${table_name};`;

    return new Promise((resolve, reject) => {
      this.db.run(sql_command, [], (err) => {
        if (err) {
          throw err;
        }
        console.log("drop successfully.");
      });
    });
  }


  disconnect() {
    this.db.close((err) => {
      if (err) {
        throw err;
      }
      console.log('Close the database connection.');
    });
  }
}

module.exports = {
  SQLite3_ORM: SQLite3_ORM
};