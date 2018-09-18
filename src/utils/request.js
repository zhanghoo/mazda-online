import Vue from 'vue'
import axios from 'axios'
import jsonp from 'jsonp'

export const instance = axios.create({
    // baseURL: '',
    timeout: 10 * 1000 // 超时时间
})

// 请求拦截
instance.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截
instance.interceptors.response.use(response => {
    const res = response.data
    return Promise.resolve(res)
}, error => {
    // 输出错误信息
    return Promise.reject(error)
})

Plugin.install = function (Vue, options) {
    Vue.axios = instance
    window.axios = instance
    Object.defineProperties(Vue.prototype, {
        axios: {
            get() {
                return instance
            }
        },
        $axios: {
            get() {
                return instance
            }
        }
    })
}

Vue.use(Plugin)

export var request = (url = '', params = {}) => {
    return new Promise((resolve, reject) => {
        var query = url.indexOf('?') === -1 ? '?' : '&'
        query += Object
            .keys(params)
            .map(key => key + '=' + encodeURIComponent(params[key]))
            .join('&')
        jsonp(`${url}${query}`, null, (err, res) => {
            if (err) {
                reject(err.message)
            }
            resolve(res)
        })
    })
}

export default Plugin
