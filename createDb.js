const mysql = require('mysql');

const connection = mysql.createConnection({
    //host: 'localhost', // 填写你的mysql host
    host: '123.57.133.170', // 填写你的mysql host
    user: 'root', // 填写你的mysql用户名
    password: 'zhoujia' // 填写你的mysql密码
})

connection.connect(err => {
    if(err) throw err;
    console.log('mysql connncted success!');
})

const sql = `CREATE DATABASE elec_price`;

connection.query(sql, (err) => {
    if (err) throw err;
    console.log('create elec_price success!');
});