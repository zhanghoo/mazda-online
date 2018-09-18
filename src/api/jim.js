var JIM = new JMessage({
    debug: false
})
// 注册登录
var JimInit = {
    // 初始化
    init: function (data) {
        return new Promise((resolve, reject) => {
            JIM.init({
                'appkey': data.appkey,
                'random_str': data.random_str,
                'signature': data.signature,
                'timestamp': data.timestamp,
                'flag': 1
            }).onSuccess(res => {
                resolve(res)
            }).onFail(err => {
                reject(err)
            })
        })
    },
    // 登录
    login: function (form) {
        return new Promise((resolve, reject) => {
            JIM.login(form).onSuccess(res => {
                resolve(res)
            }).onFail(err => {
                reject(err)
            })
        })
    },
    // 退出登录
    loginOut: function () {
        return new Promise((resolve, reject) => {
            JIM.loginOut()
            resolve()
        })
    },
    // 注册
    register: function (form) {
        return new Promise((resolve, reject) => {
            JIM.register(form).onSuccess(res => {
                console.log('注册成功')
                resolve(res)
            }).onFail(err => {
                reject(err)
            })
        })
    },
    isLogin: function () {
        return JIM.isLogin()
    }
}
// 会话管理
var JimConversation = {
    // 获取会话列表
    getConversation: function () {
        return new Promise((resolve, reject) => {
            JIM.getConversation().onSuccess(data => {
                resolve(data)
            }).onFail(err => {
                reject(err)
            })
        })
    },
    // 获取会话消息
    onSyncConversation: function () {
        return new Promise((resolve, reject) => {
            JIM.onSyncConversation(data => {
                resolve(data)
            })
        })
    },
    // 重置会话未读数
    resetUnreadCount: function (username) {
        return new Promise((resolve, reject) => {
            JIM.resetUnreadCount({ 'username': username })
            resolve()
        })
    },
    // 业务事件监听
    onEventNotification: function (fn) {
        JIM.onEventNotification(data => {
            fn && fn(data)
        })
    },
    onDisconnect: function (fn) {
        JIM.onDisconnect(data => {
            fn && fn(data)
        })
    }
}
// 聊天相关
var JimChat = {
    // 监听接收消息
    onMsgReceive: function (fn) {
        JIM.onMsgReceive(data => {
            fn && fn(data)
        })
    },
    // 监听已读数变更
    onMsgReceiptChange: function (fn) {
        JIM.onMsgReceiptChange(data => {
            fn && fn(data)
        })
    },
    // 发送单聊文字
    sendSingleMsg: function (appkey, targetName, content) {
        return new Promise((resolve, reject) => {
            JIM.sendSingleMsg({
                'target_username': targetName,
                'appkey': appkey,
                'content': content,
                'no_offline': false,
                'no_notification': false,
                'need_receipt': true
            }).onSuccess((res, msg) => {
                resolve({ res, msg })
            }).onFail(err => {
                reject(err)
            })
        })
    },
    // 发送单聊图片
    sendSinglePic: function (appkey, targetName, image) {
        var fd = new FormData()
        fd.append(image.name, image)
        return new Promise((resolve, reject) => {
            JIM.sendSinglePic({
                'target_username': targetName,
                'appkey': appkey,
                'image': fd,
                'no_offline': false,
                'no_notification': false,
                'need_receipt': true
            }).onSuccess((res, msg) => {
                resolve({ res, msg })
            }).onFail(err => {
                reject(err)
            })
        })
    },
    // 单聊已读回执
    addSingleReceiptReport: function (username, msg_ids) {
        let params = {
            username,
            msg_ids
        }
        return new Promise((resolve, reject) => {
            JIM.addSingleReceiptReport(params).onSuccess((data, msg_ids) => {
                resolve({ data, msg_ids })
            }).onFail(err => {
                reject(err)
            })
        })
    },
    // 消息撤回
    msgRetract: function (msg_id) {
        return new Promise((resolve, reject) => {
            JIM.msgRetract({ 'msg_id': msg_id }).onSuccess((data, msg) => {
                resolve({ data, msg })
            }).onFail(err => {
                reject(err)
            })
        })
    }
}
// 工具类Api
var JimUtils = {
    // 获取资源路径
    getResource: function (media_id) {
        return new Promise((resolve, reject) => {
            JIM.getResource({ 'media_id': media_id }).onSuccess(data => {
                resolve(data.url)
            }).onFail(err => {
                reject(err)
            })
        })
    },
    // 获取用户信息
    getUserInfo: function (username, appkey) {
        console.log(username)
        console.log(appkey)
        return new Promise((resolve, reject) => {
            JIM.getUserInfo({
                'username': username,
                'appkey': appkey
            }).onSuccess(data => {
                resolve(data)
            }).onFail(err => {
                reject(err)
            })
        })
    }
}

var JimApi = {
    ...JimInit,
    ...JimConversation,
    ...JimChat,
    ...JimUtils
}

export default JimApi
