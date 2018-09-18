import { request } from '@/utils/request'

// mazda API
let config = {
    'login': 'http://dealers.faw-mazda.com/chat/index/login', // 游客登录
    'init': 'http://dealers.faw-mazda.com/chat/index/init', // 极光初始化参数
    'user': 'http://dealers.faw-mazda.com/chat/index/getuser', // 登录用户信息
    'advisors': 'http://dealers.faw-mazda.com/chat/index/getadvisors', // 客服在线列表
    'saveMsg': 'http://dealers.faw-mazda.com/chat/index/savemsg', // 保存消息
    'drive': 'https://dealers.faw-mazda.com/api/dealer/get_reserve', // 试驾清单
    'message': 'http://dealers.faw-mazda.com/api/dealer/message', // 提交留言
    'province': 'http://dealers.faw-mazda.com/api/dealer/get_province', // 省
    'city': 'http://dealers.faw-mazda.com/api/dealer/get_city', // 市
    'history': 'http://dealers.faw-mazda.com/index.php/chat/index/gethistory', // 历史记录
    'kfuSetting': 'http://dealers.faw-mazda.com/index.php/chat/index/setAdvisor', // 设置客服状态和配置
    'kfuInfo': 'http://dealers.faw-mazda.com/index.php/chat/index/getAdvisorInfo', // 单个客服信息
    'kfuLogin': 'http://dealers.faw-mazda.com/index.php/chat/index/login_log', // 客服登录
    'kfuLoginOut': 'http://dealers.faw-mazda.com/index.php/chat/index/logout_log', // 客服登出
    'kfuLoginStatus': 'http://dealers.faw-mazda.com/index.php/chat/index/getkfonline', // 单个客服在线状态
    'kfuId': 'http://mchat.faw-mazda.com/mazda/advisor/' // 获取客服id
}

// 登录
export function getLogin(form) {
    let res = request(config.login, form)
    return res
}
// 初始化参数
export function getInitParams() {
    let res = request(config.init)
    return res
}
// 获取游客用户登录数据
export function getUser() {
    let res = request(config.user)
    return res
}
// 客服列表
export function getCustomList() {
    let params = {
        'dealer_id': 194
    }
    let res = request(config.advisors, params)
    return res
}
// 保存消息
export function saveMsg(params) {
    let res = request(config.saveMsg, params)
    return res
}
// 留言接口
export function postMessage(data) {
    let params = {
        'dealer_id': 194,
        'advisors_id': data.id || 0,
        'province': data.province,
        'city': data.city,
        'name': data.name,
        'mobile': data.phone,
        'sex': data.gender,
        'content': data.content
    }
    let res = request(config.message, params)
    return res
}
// 获取省
export function getProvince() {
    let res = request(config.province)
    return res
}
// 获取市
export function getCity(province_id) {
    let res = request(config.city, { province_id })
    return res
}
// 获取试驾清单
export function getDrive(query) {
    let res = request(config.drive, query)
    return res
}
// 获取历史记录
// export function getHistory(username) {
//     let res = request(config.history, { username })
//     return res
// }
// 客服登录
export function kfuLogin(username) {
    let res = request(config.kfuLogin, { username })
    return res
}
// 客服id
export function KfuId(username) {
    let res = request(config.kfuId + username)
    return res
}
// 单个客服信息
export function kfuInfo(advisor_id) {
    let res = request(config.kfuInfo, { advisor_id })
    return res
}
// 客服登出
export function kfuLoginOut(username) {
    let res = request(config.kfuLoginOut, { username })
    return res
}
// 单个客服在线状态
export function kfuLoginStatus(username) {
    let res = request(config.kfuLoginStatus, { username })
    return res
}
// 设置客服配置
export function kfuSetting(params) {
    let res = request(config.kfuSetting, params)
    return res
}
