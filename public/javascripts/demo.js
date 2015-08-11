/**
 * Created by liqiao on 8/10/15.
 */

/**
 * _config comes from server-side template. see views/index.jade
 */
dd.config({
    appId: '',
    corpId: _config.corpId,
    timeStamp: _config.timeStamp,
    nonceStr: _config.nonceStr,
    signature: _config.signature,
    jsApiList: ['device.notification.confirm',
        'device.notification.alert',
        'device.notification.prompt',
        'biz.chat.chooseConversation',
        'biz.ding.post']
});

dd.ready(function() {
    alert('dd ready');

    document.addEventListener('pause', function() {
        alert('pause');
    });

    document.addEventListener('resume', function() {
        alert('resume');
    });

    var head = document.querySelector('h1');
    head.innerHTML = head.innerHTML + ' It rocks!';

    dd.device.notification.alert({
        message: 'dd.device.notification.alert',
        title: 'This is title',
        buttonName: 'button',
        onSuccess: function(data) {
            alert('win: ' + JSON.stringify(data));
        },
        onFail: function(err) {
            alert('fail: ' + JSON.stringify(err));
        }
    });
});

dd.error(function(err) {
    alert('dd error: ' + JSON.stringify(err));
});