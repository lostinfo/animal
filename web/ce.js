var request = require('request')
function md5(data) {
    var crypto = require('crypto');
    return crypto.createHash('md5').update(data, 'utf-8').digest('hex');
}
var express = require("express");
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

function jiami(id, e, t, i) {
    i || (i = 100 + Math.floor(900 * Math.random()));
    var o = e + 100 + i,
        a = md5(o + id + t).toString();
    return "t" + (a.charAt(17) + a.charAt(3) + a.charAt(27) + a.charAt(11) + a.charAt(23)) + i + e;
}


var Url = 'https://restaurant.twomiles.cn';
var Url1 = 'https://dsa-restaurant-beijing.twomiles.cn';
var Url2 = 'https://dsa-restaurant-shanghai.twomiles.cn';
var Url3 = 'https://dsa-restaurant-chengdu.twomiles.cn';

app.use('/', express.static("src"))


app.post('/checkrd', urlencodedParser, function (req, res) {
    var id = req.body.oid;
    var CheckUrl = Url + '/checkRecord?openid=' + id;
    console.log(CheckUrl);
    request(CheckUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
            res.end(body);
        }
    })
})
app.post('/xgtj', urlencodedParser, function (req, res) {
    console.log(req.body);
    var id = req.body.oid;
    if (id == '') {
        res.end('输入ID');
        return
    }
    var starsum = parseInt(req.body.star);
    var AddMoney = parseInt(req.body.yg);
    var AddPanzi = parseInt(req.body.pz);
    var AddStar = parseInt(req.body.xx);
    var XinJian = req.body.ml;
    var JiNianWu = req.body.mr;
    var Guke = req.body.gk;
    var flower = req.body.fl;
    var code = req.body.code;
    var code = 100 + Math.floor(900 * Math.random()) + "d42fe" + Math.floor(10 * Math.random());
    var DownLoadUrl = Url + '/downloadRecord?openid=' + id + '&code=' + code + '&type=native';
    var UpLoadUrl = Url + '/uploadRecord';
    var CheckLoginUrl = Url + '/checkLogin?openid=' + id;
    console.log(CheckLoginUrl);
    request(CheckLoginUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(JSON.parse(body));
            request(DownLoadUrl, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var record = JSON.parse(JSON.parse(body).record);
                    if (!record) res.end('查询失败');
                    console.log(record)
                    try {
                        var playtime = parseInt(record.playTime.substr(9, record.playTime.length));
                    }
                    catch (err) { var playTime = 0 }
                    try {
                        var money = parseInt(record.money.substr(9, record.money.length));
                    } catch (err) { var money = 0 }

                    try {
                        var money_plate = parseInt(record.money_plate.substr(9, record.money_plate.length));
                    } catch (err) { var money_plate = 0 }

                    try {
                        var star = parseInt(record.star.substr(9, record.star.length));
                    }
                    catch (err) { var star = 0 }


                    /*
                                        recordItemBag = { 'coin': { 'building_1_group': { 'incomeSum': AddMoney, 'nodesCount': 3, 'endPos': { 'x': -500, 'y': 150 } } }, 'star': { 'building_1_group': { 'incomeSum': AddStar, 'nodesCount': 4, 'endPos': { 'x': -200, 'y': 150 } } } }
                                        var n = md5(JSON.stringify(recordItemBag) + id).toString();
                                        recordItemBag.checkSign = n.charAt(9) + n.charAt(16) + n.charAt(7) + n.charAt(21) + n.charAt(22);
                                        record.recordItemBag = JSON.stringify(recordItemBag).toString();
                    */

                    if (AddMoney != 0) {
                        record.money = jiami(id, money + parseInt(AddMoney / 4*3), "money");
                        recordItemBag = {
                            'coin': {
                                'building_1_group': {
                                    'incomeSum': parseInt(AddMoney / 4),
                                    'nodesCount': 6,
                                    "endPos": {
                                        "x": -159.29563538878836,
                                        "y": 141.24558126754656
                                    }
                                }

                            },
                            "star": {
                                'building_1_group': {
                                    'incomeSum': 1,
                                    'nodesCount': 1,
                                    "endPos": {
                                        "x": -159.29563538878836,
                                        "y": 450.24558126754656
                                    }
                                }

                            }
                        }
                        var n = md5(JSON.stringify(recordItemBag) + id).toString();
                        recordItemBag.checkSign = n.charAt(9) + n.charAt(16) + n.charAt(7) + n.charAt(21) + n.charAt(22);
                        record.recordItemBag = JSON.stringify(recordItemBag).toString();


                    }
                    if (AddStar != 0) {
                        starsum = starsum + AddStar
                        record.star = jiami(id, star + AddStar, 'star')
                    }
                    if (AddPanzi != 0) {
                        record.money_plate = jiami(id, money_plate + AddPanzi, 'money_plate')
                    }

                    //信件修改
                    try {
                        var mailData = JSON.parse(record.mailData);
                    }
                    catch (err) { var mailData = { 'mailList': [], 'sign': '' } }
                    var mailList = mailData.mailList;
                    var ml = XinJian.split(',');
                    for (x in ml) {
                        if (mailList.indexOf('mail_' + ml[x]) === -1) {
                            mailList.push('mail_' + ml[x])
                        }
                    }
                    var g = md5(JSON.stringify(mailList) + id);
                    mailData.mailList = mailList;
                    mailData.sign = g.charAt(17) + g.charAt(3) + g.charAt(27) + g.charAt(11) + g.charAt(23);
                    record.mailData = JSON.stringify(mailData);


                    //顾客修改
                    let guke = Guke.split(',');
                    for (x in guke) {
                        if (parseInt(guke[x]) < 0) {
                            var y = parseInt(guke[x]) + 10;
                            var strx = 'customer_unlock_npc_' + y;
                            record[strx] = jiami(id, 1, strx)
                        } else if (parseInt(guke[x]) < 100) {
                            var y = parseInt(guke[x]);
                            var strx = 'customer_unlock_customer_' + y;
                            record[strx] = jiami(id, 1, strx);
                        } else if (parseInt(guke[x]) < 210) {
                            record.customer_unlock_customer_spring_1 = jiami(id, 1, 'customer_unlock_customer_spring_1');
                            record.customer_unlock_customer_spring_2 = jiami(id, 1, 'customer_unlock_customer_spring_2')
                        } else if (parseInt(guke[x]) < 220) {
                            record.customer_unlock_customer_summer_1 = jiami(id, 1, 'customer_unlock_customer_summer_1')
                            record.customer_unlock_customer_summer_2 = jiami(id, 1, 'customer_unlock_customer_summer_2')
                        } else if (parseInt(guke[x]) < 230) {
                            record.customer_unlock_customer_autumn_1 = jiami(id, 1, 'customer_unlock_customer_autumn_1')
                            record.customer_unlock_customer_autumn_2 = jiami(id, 1, 'customer_unlock_customer_autumn_2')
                        } else if (parseInt(guke[x]) < 250) {
                            record.customer_unlock_customer_community = jiami(id, 1, 'customer_unlock_customer_community')
                            record.customer_unlock_customer_community2 = jiami(id, 1, 'customer_unlock_customer_community2')
                        } else if (parseInt(guke[x]) < 260) {
                            record.customer_unlock_customer_halloween_1 = jiami(id, 1, 'customer_unlock_customer_halloween_1')
                            record.customer_unlock_customer_halloween_2 = jiami(id, 1, 'customer_unlock_customer_halloween_2')
                            record.customer_unlock_customer_halloween_3 = jiami(id, 1, 'customer_unlock_customer_halloween_3')
                            record.customer_unlock_customer_halloween_4 = jiami(id, 1, 'customer_unlock_customer_halloween_4')
                            record.customer_unlock_customer_halloween_5 = jiami(id, 1, 'customer_unlock_customer_halloween_5')
                            record.customer_unlock_customer_halloween_6 = jiami(id, 1, 'customer_unlock_customer_halloween_6')
                        }
                    }

                    //纪念物
                    var jnw =
                        ['',
                            'memorial_1', 'memorial_2', 'memorial_3',
                            'memorial_4', 'memorial_5', 'memorial_6',
                            'memorial_7', 'memorial_8', 'memorial_9',
                            'memorial_10', 'memorial_11', 'memorial_12',
                            'memorial_13', 'memorial_14', 'memorial_15',
                            'memorial_16', 'memorial_17', 'memorial_18',
                            'memorial_19', 'memorial_20', 'memorial_21',
                            'memorial_22', 'memorial_23', 'memorial_24',
                            'memorial_25', 'memorial_26', 'memorial_27',
                            'memorial_28', 'memorial_29', 'memorial_30',
                            'memorial_31', 'memorial_32', 'memorial_33',
                            'memorial_employee_1_1',
                            'memorial_employee_1_2',
                            'memorial_employee_1_3',
                            'memorial_employee_1_4',
                            'memorial_employee_1_5',
                            'memorial_employee_1_6',
                            'memorial_employee_2_1',
                            'memorial_employee_2_2',
                            'memorial_employee_2_3',
                            'memorial_employee_2_4',
                            'memorial_employee_2_5',
                            'memorial_employee_2_6',
                            'memorial_employee_2_7',
                            'memorial_employee_3_1',
                            'memorial_employee_3_2',
                            'memorial_employee_3_3',
                            'memorial_employee_4_1',
                            'memorial_employee_4_2',
                            'memorial_employee_4_3',
                            'memorial_employee_5_1',
                            'memorial_employee_5_2',
                            'memorial_employee_5_3',
                            'memorial_employee_5_4',
                            'memorial_employee_5_5',
                            'memorial_employee_6_1',
                            'memorial_employee_6_2',
                            'memorial_employee_6_3',
                            'memorial_employee_6_4',
                            'memorial_employee_7_1',
                            'memorial_employee_8_1',
                            'memorial_employee_8_2',
                            'memorial_employee_9_1',
                            'memorial_employee_9_2',
                            'memorial_employee_10_1',
                            'memorial_employee_10_2',
                            'memorial_employee_10_3',
                            'memorial_employee_10_4']
                    let jinianwu = JiNianWu.split(",");
                    for (x in jinianwu) {
                        y = 'memorial_unlock_' + jnw[parseInt(jinianwu[x])]
                        record[y] = jiami(id, 10, y)
                    }
                    //

                    try {
                        var flowerBag = JSON.parse(record.flowerBag);
                    }
                    catch (err) { var flowerBag = {} }
                    var sl = 100;
                    for (i = 0; i < 12; i++) {
                        var hua = flower.split(',')[i];
                        if (i == 0) {
                            for (k = 0; k < hua; k++) {
                                flowerBag['item_' + sl] = { 'x': -89 + parseInt(Math.random() * 100), 'y': -10 + parseInt(Math.random() * 100), 'itemType': 'flower', 'flowerType': 'Garden_xiaochuju', 'flowerLevel': 4, 'position': 'floor', 'useTimes': 0 };
                                sl++;
                            }
                        } else if (i == 1) {
                            for (k = 0; k < hua; k++) {
                                flowerBag['item_' + sl] = { 'x': -309 + parseInt(Math.random() * 100), 'y': -10 + parseInt(Math.random() * 100), 'itemType': 'flower', 'flowerType': 'Garden_meigui', 'flowerLevel': 4, 'position': 'floor', 'useTimes': 0 };
                                sl++;
                            }
                        } else if (i == 2) {
                            for (k = 0; k < hua; k++) {
                                flowerBag['item_' + sl] = { 'x': 131 + parseInt(Math.random() * 100), 'y': -10 + parseInt(Math.random() * 100), 'itemType': 'flower', 'flowerType': 'Garden_xiangrikui', 'flowerLevel': 4, 'position': 'floor', 'useTimes': 0 };
                                sl++;
                            }
                        } else if (i == 3) {
                            for (k = 0; k < hua; k++) {
                                flowerBag['item_' + sl] = { 'x': 510 + parseInt(Math.random() * 100), 'y': -310 + parseInt(Math.random() * 100), 'itemType': 'flower', 'flowerType': 'Garden_lanfengling', 'flowerLevel': 4, 'position': 'floor', 'useTimes': 0 };
                                sl++;
                            }
                        } else if (i == 4) {
                            for (k = 0; k < hua; k++) {
                                flowerBag['item_' + sl] = { 'x': -9 + parseInt(Math.random() * 100), 'y': -82 + parseInt(Math.random() * 100), 'itemType': 'flower', 'flowerType': 'Garden_baimeigui', 'flowerLevel': 4, 'position': 'floor', 'useTimes': 0 };
                                sl++;
                            }
                        } else if (i == 5) {
                            for (k = 0; k < hua; k++) {
                                flowerBag['item_' + sl] = { 'x': 387 + parseInt(Math.random() * 100), 'y': -771 + parseInt(Math.random() * 100), 'itemType': 'flower', 'flowerType': 'Garden_clover', 'flowerLevel': 4, 'position': 'floor', 'useTimes': 0 };
                                sl++;
                            }
                        } else if (i == 6) {
                            for (k = 0; k < hua; k++) {
                                flowerBag['item_' + sl] = { 'x': 526 + parseInt(Math.random() * 100), 'y': -48 + parseInt(Math.random() * 100), 'itemType': 'flower', 'flowerType': 'Garden_yinghua', 'flowerLevel': 4, 'position': 'floor', 'useTimes': 0 };
                                sl++;
                            }
                        } else if (i == 7) {
                            for (k = 0; k < hua; k++) {
                                flowerBag['item_' + sl] = { 'x': -332 + parseInt(Math.random() * 100), 'y': -788 + parseInt(Math.random() * 100), 'itemType': 'flower', 'flowerType': 'Garden_fengye', 'flowerLevel': 4, 'position': 'floor', 'useTimes': 0 };
                                sl++;
                            }
                        } else if (i == 8) {
                            for (k = 0; k < hua; k++) {
                                flowerBag['item_' + sl] = { "x": -564 + parseInt(Math.random() * 100), "y": 410 + parseInt(Math.random() * 100), "itemType": "sprinkler", "sprinklerType": "Garden_Watercan_1" };
                                sl++;
                            }
                        } else if (i == 9) {
                            for (k = 0; k < hua; k++) {
                                flowerBag['item_' + sl] = { "x": -584 + parseInt(Math.random() * 100), "y": 112 + parseInt(Math.random() * 100), "itemType": "sprinkler", "sprinklerType": "Garden_Watercan_2" };
                                sl++;
                            }
                        } else if (i == 10) {
                            for (k = 0; k < hua; k++) {
                                flowerBag['item_' + sl] = { "x": -540, "y": -153 + parseInt(Math.random() * 100), "itemType": "sprinkler" + parseInt(Math.random() * 100), "sprinklerType": "Garden_Watercan_3" };
                                sl++;
                            }
                        } else if (i == 11) {
                            for (k = 0; k < hua; k++) {
                                flowerBag['item_' + sl] = { "x": -564 + parseInt(Math.random() * 100), "y": 410 + parseInt(Math.random() * 100), "itemType": "seed" };
                                sl++;
                            }
                        }
                    }
                    record.flowerBag = JSON.stringify(flowerBag);
                    sl = 100;



                    var i = md5("32roiFEI" + JSON.stringify(record) + id).toString();
                    var checkSign2 = i.charAt(8) + i.charAt(3) + i.charAt(21) + i.charAt(10) + i.charAt(16) + i.charAt(9) + i.charAt(11) + i.charAt(23);
                    // var code = 100 + Math.floor(900 * Math.random()) + "d42fe" + Math.floor(10 * Math.random());
                    // 013h9Qkl2yMER84GpCnl2tWwzF4h9QkY
                    console.log()
                    var requestData = {}
                    requestData.openid = id
                    requestData.starSum = starsum
                    requestData.playTime = playtime
                    requestData.record = JSON.stringify(record).toString()
                    requestData.code = code
                    requestData.type = 'wx'
                    requestData.checkSign2 = checkSign2
                    requestData.money = 0

                    console.log(requestData.openid, requestData.starSum, requestData.playTime, requestData.code,
                        requestData.checkSign2, requestData.money)
                    request({
                        url: UpLoadUrl,
                        method: "POST",
                        json: true,
                        headers: {
                            'charset': 'utf-8',
                            //'referer':'https://servicewechat.com/wxb8b0988833c048eb/318/page-frame.html',
                            'Accept-Encoding': 'gzip',
                            "content-type": "application/json",
                            'User-Agent': 'Mozilla/5.0 (Linux; Android 9; ONEPLUS A5000 Build/PKQ1.180716.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.92 Mobile Safari/537.36 MicroMessenger/7.0.8.1540(0x27000833) Process/appbrand2 NetType/4G Language/zh_CN ABI/arm64'
                        },
                        body: (requestData)
                    }, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log(body)
                            if (body.status == 0) { // 请求成功的处理逻辑
                                res.end('修改成功')
                            }
                            else { res.end('修改失败，错误码' + body.status) }
                        }

                    });


                }
            })

        }
    })

})




app.post('/yue', urlencodedParser, function (req, res) {
    console.log(req.body)
    res.end('可用余额一个亿')
})

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})