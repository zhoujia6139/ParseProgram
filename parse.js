// 参考： https://segmentfault.com/a/1190000015669558
// real_time 数据解析：一天有96个 intervals. 也就是说一小时有4个 intervals，
// excel表中 Delivery Hour表示的一天的第几个小时，Delivery Interval表示一个小时内的第几个interval，最大为4
const mysql = require('mysql');
var XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const dam_path = "./data/dam";
const rtm_path = "./data/rtm";

const connection = mysql.createConnection({
    host: 'localhost', // 填写你的mysql host
    // host: '123.57.133.170', // 填写你的mysql host
    user: 'root', // 填写你的mysql用户名
    password: 'zhoujia', // 填写你的mysql密码
    database: 'elec_price'
})

let getDamDateFormat = function(dateStr, hour) {
    //dateStr = 12/01/2010
    // hour = 03:00
    let strArray = dateStr.split("/");
    if (dateStr.length !== 10 || strArray.length !== 3 || hour.length !== 5) {
        console.log("Date data error, dateStr = " + dateStr + " hour = " + hour);
        return "";
    }

    if (hour === "24:00"){
        return strArray[2] + "-" + strArray[0] + "-" + strArray[1] + " " + "23:59:59";
    } else {
        return strArray[2] + "-" + strArray[0] + "-" + strArray[1] + " " + hour + ":00";
    }
}

let getRtmDateFormat = function(dateStr, hour, interval) {
    //dateStr = 12/01/2010
    // hour = 1 - 24
    // interval = 1 - 4
    let strArray = dateStr.split("/");
    dateStr = strArray[2] + "-" + strArray[0] + "-" + strArray[1];

    let timeStr;
    hour = hour - 1;
    if (hour < 10) {
        timeStr = "0" + hour + ":";
    } else {
        timeStr = hour + ":";
    }
    if (interval === 1) {
        timeStr = timeStr + "00:00";
    } else if (interval === 2) {
        timeStr = timeStr + "15:00";
    } else if (interval === 3) {
        timeStr = timeStr + "30:00";
    } else if (interval === 4) {
        timeStr = timeStr + "45:00";
    }

    return dateStr + " " + timeStr;
}

try{
    fs.accessSync(dam_path);
    fs.accessSync(rtm_path);
}catch(err){
    console.log("file path not exist.");
    console.log(err);
}

let handleDamFile = function (filePath) {
    const wb = XLSX.readFile(filePath);
    let sheetNames = wb.SheetNames;
    for (var i=0; i<sheetNames.length; i++) {
        let sheetName = sheetNames[i];
        let workSheet = wb.Sheets[sheetName];
        let data = XLSX.utils.sheet_to_json(workSheet);
        // console.log(JSON.stringify(data));
        for (let i=0; i<data.length; i++) {
            let tmpData = data[i];
            let deliveryDate = tmpData["Delivery Date"];
            let hourEnding = tmpData["Hour Ending"];
            let hourFlag = tmpData["Repeated Hour Flag"];
            let settlementPoint = tmpData["Settlement Point"];
            let settlementPointPrice = tmpData["Settlement Point Price"];
            let deliveryDateTime = getDamDateFormat(deliveryDate, hourEnding);
            if (deliveryDateTime.length !== 19) {
                console.log("getDamDateFormat returns a wrong deliveryDateTime = " + deliveryDateTime);
                return;
            }

            let sql = "insert into dam_history VALUES(" + "\'" + deliveryDateTime + "\', \"" + hourFlag + "\", \"" + settlementPoint + "\", " + settlementPointPrice + ")"
            connection.query(sql, (err ,results, filelds) => {
                if (err) throw err;
            })
        }
    }
}

let handleRtmFile = function (filePath) {
    const wb = XLSX.readFile(filePath);
    let sheetNames = wb.SheetNames;
    for (var i=0; i<sheetNames.length; i++) {
        let sheetName = sheetNames[i];
        let workSheet = wb.Sheets[sheetName];
        let data = XLSX.utils.sheet_to_json(workSheet);
        //console.log(JSON.stringify(data));
        for (let i=0; i<data.length; i++) {
            let tmpData = data[i];
            let deliveryDate = tmpData["Delivery Date"];
            let deliveryHour = tmpData["Delivery Hour"];
            let deliveryInterval = tmpData["Delivery Interval"];
            let hourFlag = tmpData["Repeated Hour Flag"];
            let settlementPointName = tmpData["Settlement Point Name"];
            let settlementPointType = tmpData["Settlement Point Type"];
            let settlementPointPrice = tmpData["Settlement Point Price"];
            if (typeof(deliveryDate) !== 'string') {
                console.log("deliveryDate is not string");
                console.log("tmpData="+JSON.stringify(tmpData));
                continue;
            }
            let deliveryDateTime = getRtmDateFormat(deliveryDate, deliveryHour, deliveryInterval);
            if (deliveryDateTime.length !== 19) {
                console.log("getRtmDateFormat returns a wrong deliveryDateTime = " + deliveryDateTime);
                return;
            }

            let sql = "insert into rtm_history VALUES(" + "\'" + deliveryDateTime + "\', \"" + hourFlag + "\", \"" + settlementPointName + "\", \"" + settlementPointType + "\", "+ settlementPointPrice + ")"
            connection.query(sql, (err ,results, filelds) => {
                if (err) throw err;
            })
        }
    }
}

let dam_state = fs.statSync(dam_path);
if (dam_state.isDirectory()) {
    let files = fs.readdirSync(dam_path);
    files.forEach(file=>{
        let filePath = path.join(dam_path,file);
        console.log("handling dam fileName = " + filePath);
        handleDamFile(filePath);
    });
} else {
    console.log("dam_path is not directory.");
}

let rtm_state = fs.statSync(rtm_path);
if (rtm_state.isDirectory()) {
    let files = fs.readdirSync(rtm_path);
    files.forEach(file=>{
        let filePath = path.join(rtm_path,file);
        console.log("handling rtm fileName = " + filePath);
        handleRtmFile(filePath);
    });
} else {
    console.log("rtm_path is not directory.");
}







