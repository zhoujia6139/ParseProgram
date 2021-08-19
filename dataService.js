const mysql = require('mysql');
var http = require("http");
var querystring = require('querystring');
var url = require('url');

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

let sendResData = function(res, dataArray, axisInfoArray){
    let ret = {
        "chartData":dataArray,
        "graphAxis":axisInfoArray
    };
    res.write(JSON.stringify(ret));
    res.end();
}

let executeQuery = function(reqArray, i, res, dataArray, axisInfoArray) {
    let req = reqArray[i];
    let reqType = req["type"];
    let start_time = req["start_time"];
    let end_time = req["end_time"];
    let settlement_point = req["settlement_point"];
    let repeated_hour_flag = req["repeated_hour_flag"];
    let settlement_point_type = req["settlement_point_type"];

    let axitLabel = reqType + "-" + settlement_point + "-" + start_time;
    let axisInfo = {
        "id":"axis1",
        "label":axitLabel
    }
    axisInfoArray.push(axisInfo);

    if (reqType === "RTM") {
        let rtmSql = "select UNIX_TIMESTAMP(synthesis_time) as synthesis_time, settlement_point_price from rtm_history where UNIX_TIMESTAMP(synthesis_time) BETWEEN " + start_time + " AND " + end_time + " AND settlement_point_name=\"" + settlement_point + "\" AND repeated_hour_flag=\"" + repeated_hour_flag + "\" AND settlement_point_type=\"" + settlement_point_type + "\"";
        connection.query(rtmSql, (err, result) => {
            if (err) {
                res.end();
                return;
            }

            let rtmData = [];
            for (let i=0; i<result.length; i++) {
                let tmpData = result[i];
                rtmData.push({
                    "x":tmpData["synthesis_time"]*1000,
                    "y":tmpData["settlement_point_price"]
                })
            }
            console.log("rtmData length="+rtmData.length);
            dataArray.push(rtmData);

            setTimeout(() => {
                i = i + 1;
                if (i<reqArray.length) {
                    executeQuery(reqArray, i, res, dataArray, axisInfoArray);
                } else {
                    console.log("finished. i=" + i);
                    sendResData(res, dataArray, axisInfoArray);
                }

            }, 0);
        });
    } else {
        let damSql = "select UNIX_TIMESTAMP(synthesis_time) as synthesis_time, settlement_point_price from dam_history where UNIX_TIMESTAMP(synthesis_time) BETWEEN " + start_time + " AND " + end_time + " AND settlement_point=\"" + settlement_point + "\" AND repeated_hour_flag=\"" + repeated_hour_flag + "\"";
        connection.query(damSql, (err, result) => {
            if (err) {
                res.end();
                return;
            }

            let damData = [];
            for (let i=0; i<result.length; i++) {
                let tmpData = result[i];
                damData.push({
                    "x":tmpData["synthesis_time"]*1000,
                    "y":tmpData["settlement_point_price"]
                })
            }
            console.log("damData length="+damData.length);
            dataArray.push(damData);

            setTimeout(() => {
                i = i + 1;
                if (i<reqArray.length) {
                    executeQuery(reqArray, i, res, dataArray, axisInfoArray);
                } else {
                    console.log("finished. i=" + i);
                    sendResData(res, dataArray, axisInfoArray);
                }

            }, 0);
        });
    }
}

http.createServer(function(req, res){
    var post = '';

    req.on('data', function(chunk){
        post += chunk;
    });

    req.on('end', function(){
        // post = querystring.parse(post);
        console.log("post="+post);
        var reqArray = [];
        try{
            reqArray = JSON.parse(post);
        } catch (e) {
            console.log("wrong json format");
            res.write("wrong json format");
            res.end();
            return;
        }

        if (reqArray.length > 4) {
            res.write("req size exceeds the limit = 4");
            res.end();
            return;
        }
        for (let i=0; i<reqArray.length; i++){
            let req = reqArray[i];
            let reqType = req["type"];
            let start_time = req["start_time"];
            let end_time = req["end_time"];
            let settlement_point = req["settlement_point"];
            let repeated_hour_flag = req["repeated_hour_flag"];
            let settlement_point_type = req["settlement_point_type"];

            // param check
            if (reqType !== "DAM" && reqType !== "RTM") {
                res.write("nonsupport type. DAM or RTM");
                res.end();
                return;
            }
            let diff = end_time - start_time;
            if (diff > 1000000) {
                res.write("time diff too big.");
                res.end();
                return;
            }
            if (repeated_hour_flag !== "N" && repeated_hour_flag !== "Y") {
                res.write("nonsupport repeated_hour_flag. N or Y");
                res.end();
                return;
            }
            if (settlement_point.length < 2) {
                res.write("wrong settlement_point");
                res.end();
                return;
            }
            if (reqType === "RTM" && settlement_point_type.length < 1) {
                res.write("RTM need settlement_point_type");
                res.end();
                return;
            }
        }

        if (reqArray.length > 0) {
            let dataArray = [];
            let axisInfoArray = [];
            executeQuery(reqArray, 0, res, dataArray, axisInfoArray);
        } else {
            res.end();
        }
    });
}).listen(8088);

/*http.createServer(function(req, res){
    var params = url.parse(req.url, true).query;
    let start_time = params.start_time;
    let end_time = params.end_time;
    let settlement_point = params.settlement_point;

    console.log("settlement_point=" + settlement_point);
    console.log("11111111111:start_time="+start_time + " end_time="+end_time);

    let diff = end_time - start_time;
    if (diff > 1000000) {
        res.write("time diff too big.");
        res.end();
        return;
    }

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

}).listen(8088);*/