require('dotenv').config();

module.exports = {dbConfig: {
  host: process.env.MYSQL_HOST, // 填写你的mysql host
  user: 'root', // 填写你的mysql用户名
  password: process.env.MYSQL_PASSWORD, // 填写你的mysql密码
  database: 'elec_price'
}};
