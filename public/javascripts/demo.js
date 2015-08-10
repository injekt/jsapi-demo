/**
 * Created by liqiao on 8/10/15.
 */

window.addEventListener('load', function() {
    var config = JSON.parse(document.querySelector('#config').innerHTML);

    dd.config({
        appId: '',
        corpId: config.corpId,
        timeStamp: config.timeStamp,
        nonceStr: config.nonceStr,
        signature: config.signature,
        jsApiList: ['device.notification.confirm',
            'device.notification.alert',
            'device.notification.prompt',
            'biz.chat.chooseConversation',
            'biz.ding.post']
    });

    dd.ready(function() {
        alert('dd ready');

        var head = document.querySelector('h1');
        head.innerHTML = head.innerHTML + ' It rocks!';

        dd.device.notification.alert({
            message: 'dd.device.notification.alert',
            title: 'This is title',
            buttonName: 'button',
            onSuccess: function(data) {
                alert('win: ' + JSON.stringify(data));
            },
            onFail: fail
        });
    });

    dd.error(function(err) {
        alert('dd error: ' + JSON.stringify(err));
    });
});

function fail(data) {
    alert('fail: ' + JSON.stringify(data));
}