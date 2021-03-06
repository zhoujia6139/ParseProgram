const mysql = require('mysql');
var http = require("http");
var querystring = require('querystring');
var url = require('url');
const { dbConfig } = require('./db');
const { AllOptions } = require('./metricConfig')

const connection = mysql.createConnection(dbConfig)

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

    let axitLabel = reqType + "-" + settlement_point + "-" + start_time;
    let axisInfo = {
        "id":"axis1",
        "label":axitLabel
    }
    axisInfoArray.push(axisInfo);

    if (reqType === "RTM") {
        let rtmSql = "select UNIX_TIMESTAMP(synthesis_time) as synthesis_time, settlement_point_price from rtm_history where UNIX_TIMESTAMP(synthesis_time) BETWEEN " + start_time + " AND " + end_time + " AND settlement_point_name=\"" + settlement_point + "\" AND repeated_hour_flag=\"" + repeated_hour_flag + "\"";
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

let handleRtmAveragePrice = function(param, res) {
  let start_time = param["startDate"];
  let end_time = param["endDate"];

  // param check
  if (start_time > end_time) {
    res.write("illegal startData and endDate");
    res.end();
    return;
  }

  let sql = "select AVG(settlement_point_price) from rtm_history where synthesis_time BETWEEN \"" + start_time + "\" AND \"" + end_time + "\"";
  connection.query(sql, (err, result) => {
    if (err) {
      res.end();
      return;
    }
    console.log(result);
    let dataString = JSON.stringify(result);
    let data = JSON.parse(dataString);
    res.write(JSON.stringify(data));
    res.end();
  });
}

let handleRtmCompareDam = function(param, res) {
    let start_time = param["startDate"];
    let end_time = param["endDate"];
    let repeated_hour_flag = param["repeated_hour_flag"];
    let compares = param["compares"];
    console.log(`compares`, compares);
    const curtail_over_price = parseFloat(param.curtail_over_price);

    // param check
    if (start_time > end_time) {
      res.write("illegal startData and endDate");
      res.end();
      return;
    }
    if (repeated_hour_flag !== "N" && repeated_hour_flag !== "Y") {
      res.write("nonsupport repeated_hour_flag. N or Y");
      res.end();
      return;
    }
    if (compares.length < 2) {
      res.write("wrong settlement_point");
      res.end();
      return;
    }
  const settlement_point0 = compares[0].settlement_point;
  const settlement_point1 = compares[1].settlement_point;
  let damSql = `select UNIX_TIMESTAMP(synthesis_time) as synthesis_time, settlement_point_price from ${compares[0].type.toLowerCase()}_history where synthesis_time BETWEEN "` + start_time + "\" AND \"" + end_time + "\" AND settlement_point_name=\"" + settlement_point0 + "\" AND repeated_hour_flag=\"" + repeated_hour_flag + "\"";
  let rtmSql = `select UNIX_TIMESTAMP(synthesis_time) as synthesis_time, settlement_point_price from ${compares[1].type.toLowerCase()}_history where synthesis_time BETWEEN "` + start_time + "\" AND \"" + end_time + "\" AND settlement_point_name=\"" + settlement_point1 + "\" AND repeated_hour_flag=\"" + repeated_hour_flag + "\"";

  connection.query(damSql, (err, result) => {
    if (err) {
      console.error(err);
      res.end();
      return;
    }

    let damData = [];
    let totalPrice = 0;
    let curtailCount = 0;
    for (let i=0; i<result.length; i++) {
      let tmpData = result[i];
      //console.log(JSON.stringify(tmpData));
      let point_price = tmpData["settlement_point_price"];
      if (!curtail_over_price || point_price < curtail_over_price) {
        damData.push({
          "x":tmpData["synthesis_time"]*1000,
          "y":point_price
        });
        totalPrice += point_price;
      } else {
        curtailCount++;
      }
    }
    console.log(`damData totalPrice=${totalPrice} curtailCount=${curtailCount} length=`+damData.length);
    let damAveragePrice = totalPrice / damData.length;
    const curtailDamPercent = curtailCount / result.length;

    connection.query(rtmSql, (err, result) => {
      if (err) {
        res.end();
        return;
      }

      let rtmData = [];
      let totalRtmPrice = 0;
      let curtailCount = 0;
      for (let i=0; i<result.length; i++) {
        let tmpData = result[i];
        //console.log(JSON.stringify(tmpData));
        let point_price = tmpData["settlement_point_price"];
        if (!curtail_over_price || point_price < curtail_over_price) {
          rtmData.push({
            "x":tmpData["synthesis_time"]*1000,
            "y":point_price
          });
          totalRtmPrice += point_price;
        } else {
          curtailCount++;
        }
      }
      console.log("rtmData length="+rtmData.length);
      let rtmAveragePrice = totalRtmPrice / rtmData.length;
      const curtailRtmPercent = curtailCount / result.length;

      let chartData = [damData, rtmData];
      let ret = [{
        "chartData":chartData,
        "graphAxis":[
          {
            "id":"axis1",
            "label":settlement_point0 + ' ' + compares[0].type
          },
          {
            "id":"axis1",
            "label":settlement_point1 + ' ' + compares[1].type
          }
        ],
        "chartType":"lineMulti"
      },

        {
          [`${settlement_point0}_average_price`]:damAveragePrice,
         [`${settlement_point1}_average_price`]:rtmAveragePrice,
          curtailDamPercent,
          curtailRtmPercent
        }
      ];
      res.write(JSON.stringify(ret));
      res.end();
    });
  });
}

http.createServer(function(req, res){
    var post = '';

    req.on('data', function(chunk){
        post += chunk;
    });

    req.on('end', function(){
        // post = querystring.parse(post);
        console.log("post="+post);
        var reqObj = {};
        try{
          reqObj = JSON.parse(post);
        } catch (e) {
            console.log("wrong json format");
            res.write("wrong json format");
            res.end();
            return;
        }

        let methodName = reqObj["methodName"];
        if (methodName === "dam compare rtm") {
          handleRtmCompareDam(reqObj["values"], res);
        } else if (methodName === "average rtm"){
          handleRtmAveragePrice(reqObj["values"], res);
        } else {
          let msg = "nonsupport methodName:" + methodName;
          console.log(msg);
          res.write(msg);
          res.end();
        }

        // if (reqArray.length > 4) {
        //     res.write("req size exceeds the limit = 4");
        //     res.end();
        //     return;
        // }
        // for (let i=0; i<reqArray.length; i++){
        //     let req = reqArray[i];
        //     let reqType = req["type"];
        //     let start_time = req["start_time"];
        //     let end_time = req["end_time"];
        //     let settlement_point = req["settlement_point"];
        //     let repeated_hour_flag = req["repeated_hour_flag"];
        //     let settlement_point_type = req["settlement_point_type"];
        //
        //     // param check
        //     if (reqType !== "DAM" && reqType !== "RTM") {
        //         res.write("nonsupport type. DAM or RTM");
        //         res.end();
        //         return;
        //     }
        //     let diff = end_time - start_time;
        //     if (diff > 1000000) {
        //         res.write("time diff too big.");
        //         res.end();
        //         return;
        //     }
        //     if (repeated_hour_flag !== "N" && repeated_hour_flag !== "Y") {
        //         res.write("nonsupport repeated_hour_flag. N or Y");
        //         res.end();
        //         return;
        //     }
        //     if (settlement_point.length < 2) {
        //         res.write("wrong settlement_point");
        //         res.end();
        //         return;
        //     }
        //     if (reqType === "RTM" && settlement_point_type.length < 1) {
        //         res.write("RTM need settlement_point_type");
        //         res.end();
        //         return;
        //     }
        // }
        //
        // if (reqArray.length > 0) {
        //     let dataArray = [];
        //     let axisInfoArray = [];
        //     executeQuery(reqArray, 0, res, dataArray, axisInfoArray);
        // } else {
        //     res.end();
        // }
    });
}).listen(4001);

