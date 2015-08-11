/**
 * Created by liqiao on 8/10/15.
 */

var co = require('co');
var app = require('koa')();
var route = require('koa-route');
var logger = require('koa-logger');
var serve = require('koa-static');
var jade = require("koa-jade");

var https = require("https");
var querystring = require('querystring');
var url = require('url');
var crypto = require('crypto');


const OAPI_HOST = 'https://oapi.dingtalk.com';
const corpId = require('./env').corpId;
const secret = require('./env').secret;


app.use(logger());

app.use(serve('public'));

app.use(jade.middleware({
    viewPath: __dirname + '/views',
}));

app.use(route.get('/', function *(next) {
    var nonceStr = 'abcdefg';
    var timeStamp = new Date().getTime();
    var signedUrl = 'http://' + this.req.headers.host + this.req.url;

    function g() {
        return co(function *() {
            var accessToken = (yield invoke('/gettoken', {corpid: corpId, corpsecret: secret}))['access_token'];
            var ticket = (yield invoke('/get_jsapi_ticket', {type: 'jsapi', access_token: accessToken}))['ticket'];
            var signature = sign({
                nonceStr: nonceStr,
                timeStamp: timeStamp,
                url: signedUrl,
                ticket: ticket
            });
            return {
                signature: signature,
                nonceStr: nonceStr,
                timeStamp: timeStamp,
                corpId: corpId
            };
        }).catch(function(err) {
            console.log(err);
        });
    }

    this.render('index', {
        title: 'Here we go...',
        config: JSON.stringify(yield g()),
    }, true);
}));

app.listen(3001);


function invoke(path, params) {
    return function(cb) {
        https.get(OAPI_HOST + path + '?' + querystring.stringify(params), function(res) {
            if (res.statusCode === 200) {
                var body = '';
                res.on('data', function (data) {
                    body += data;
                }).on('end', function () {
                    var result = JSON.parse(body);
                    if (result && 0 === result.errcode) {
                        cb(null, result);
                    }
                    else {
                        cb(result);
                    }
                });
            }
            else {
                cb(new Error(response.statusCode));
            }
        }).on('error', function(e) {
            cb(e);
        });
    }
}

function sign(params) {
    var origUrl = params.url;
    var origUrlObj =  url.parse(origUrl);
    delete origUrlObj['hash'];
    var newUrl = url.format(origUrlObj);
    var plain = 'jsapi_ticket=' + params.ticket +
        '&noncestr=' + params.nonceStr +
        '&timestamp=' + params.timeStamp +
        '&url=' + newUrl;

    console.log(plain);
    var sha1 = crypto.createHash('sha1');
    sha1.update(plain, 'utf8');
    var signature = sha1.digest('hex');
    console.log('signature: ' + signature);
    return signature;
}
