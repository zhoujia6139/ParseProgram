const mysql = require('mysql');
const { dbConfig } = require('./db');

const connection = mysql.createConnection(dbConfig)

connection.connect(err => {
    if(err) throw err;
    console.log('mysql connncted success!');
})

const sql = `CREATE DATABASE elec_price`;

connection.query(sql, (err) => {
    if (err) throw err;
    console.log('create elec_price success!');
});
