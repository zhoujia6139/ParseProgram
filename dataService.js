const mysql = require('mysql');
var http = require("http");
var url = require('url');

const connection = mysql.createConnection({
    host: 'localhost', // 填写你的mysql host
    user: 'root', // 填写你的mysql用户名
    password: 'zhoujia', // 填写你的mysql密码
    database: 'elec_price'
})


http.createServer(function(req, res){
    var params = url.parse(req.url, true).query;
    let start_time = params.start_time;
    let end_time = params.end_time;
    let settlement_point = params.settlement_point;

    console.log("settlement_point=" + settlement_point);
    console.log("11111111111:start_time="+start_time + " end_time="+end_time);

    if (start_time < end_time && settlement_point.length>0) {
        let damSql = "select UNIX_TIMESTAMP(synthesis_time) as synthesis_time, settlement_point_price from dam_history where UNIX_TIMESTAMP(synthesis_time) BETWEEN " + start_time + " AND " + end_time + " AND settlement_point=\"" + settlement_point + "\" AND repeated_hour_flag=\"N\"";
        let rtmSql = "select UNIX_TIMESTAMP(synthesis_time) as synthesis_time, settlement_point_price from rtm_history where UNIX_TIMESTAMP(synthesis_time) BETWEEN " + start_time + " AND " + end_time + " AND settlement_point_name=\"" + settlement_point + "\" AND repeated_hour_flag=\"N\" AND settlement_point_type=\"SH\"";

        console.log("damSql="+damSql);
        console.log("rtmSql="+rtmSql);
        connection.query(damSql, (err, result) => {
            if (err) {
                res.end();
                return;
            }

            let damData = [];
            for (let i=0; i<result.length; i++) {
                let tmpData = result[i];
                //console.log(JSON.stringify(tmpData));
                damData.push({
                    "x":tmpData["synthesis_time"]*1000,
                    "y":tmpData["settlement_point_price"]
                })
            }
            console.log("damData length="+damData.length);

            connection.query(rtmSql, (err, result) => {
                if (err) {
                    res.end();
                    return;
                }

                let rtmData = [];
                for (let i=0; i<result.length; i++) {
                    let tmpData = result[i];
                    //console.log(JSON.stringify(tmpData));
                    rtmData.push({
                        "x":tmpData["synthesis_time"]*1000,
                        "y":tmpData["settlement_point_price"]
                    })
                }
                console.log("rtmData length="+rtmData.length);

                let chartData = [damData, rtmData];
                let ret = {
                    "chartData":chartData,
                    "graphAxis":[
                        {
                            "id":"axis1",
                            "label":"DAM"
                        },
                        {
                            "id":"axis1",
                            "label":"RTM"
                        }
                    ],
                    "settlement_point":settlement_point,
                    "repeated_hour_flag":"N",
                    "settlement_point_type":"SH"
                };
                res.write(JSON.stringify(ret));
                res.end();
            });
        });
    }

}).listen(8088);