const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost', // 填写你的mysql host
    user: 'root', // 填写你的mysql用户名
    password: 'zhoujia', // 填写你的mysql密码
    database: 'elec_price'
})



const sql = "insert into dam_history VALUES ?";
let data = [["2010-12-01 02:30:00", "12/01/2010", "01:00", "N", "HB_BUSAVG", 34.7], ["2010-12-02 02:30:00", "12/01/2010", "01:00", "N", "HB_BUSAVG", 34.7]];

connection.connect(err => {
    if(err) throw err;
    console.log('mysql connncted success!');
    connection.query(sql, [data], (err ,results, filelds) => {
        if(err) throw err;
        console.log('insert success!');
    })
})

