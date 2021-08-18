const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost', // 填写你的mysql host
    user: 'root', // 填写你的mysql用户名
    password: 'zhoujia', // 填写你的mysql密码
    database: 'elec_price'
})

connection.connect(err => {
    if(err) throw err;
    console.log('mysql connncted success!');
})

const table0 = `CREATE TABLE dam_history(
      synthesis_time DATETIME,
      delivery_date VARCHAR(12),
      hour_ending VARCHAR(10),
      repeated_hour_flag VARCHAR(1),
      settlement_point VARCHAR(20),
      settlement_point_price FLOAT,
      PRIMARY KEY (\`synthesis_time\`,\`repeated_hour_flag\`,\`settlement_point\`)
    )`;

const table1 = `CREATE TABLE rtm_history(
      synthesis_time DATETIME,
      delivery_date VARCHAR(12),
      delivery_hour TINYINT,
      delivery_interval TINYINT,
      repeated_hour_flag VARCHAR(1),
      settlement_point_name VARCHAR(20),
      settlement_point_type VARCHAR(5),
      settlement_point_price FLOAT,
      PRIMARY KEY (\`synthesis_time\`,\`repeated_hour_flag\`,\`settlement_point_name\`,\`settlement_point_type\`)
    )`;

connection.query(table0, (err ,results, filelds) => {
    if (err) throw err;
    console.log('create db table dam_history success!');
})

connection.query(table1, (err ,results, filelds) => {
    if (err) throw err;
    console.log('create db table rtm_history success!');
})