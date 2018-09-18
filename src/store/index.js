import Vue from 'vue'
import Vuex from 'vuex'
import cache from '@/utils/cache'
import md5 from '@/utils/md5'
import JIM from '@/api/jim'
import { getInitParams, kfuLogin, KfuId, kfuInfo, kfuLoginOut, kfuSetting } from '@/api'

Vue.use(Vuex)

const state = {
    initData: '',
    userInfo: '',
    conversationContent: ''
}

const getters = {
}

const mutations = {
    SET_INIT_DATA(state, val) {
        state.initData = val
    },
    SET_USER_INFO(state, val) {
        state.userInfo = val
    },
    SET_CONVERSATION_CONTENT(state, val) {
        state.conversationContent = val
    }
}

const actions = {
    // 客服登录
    kfuLogin({ commit, dispatch }, form) {
        return new Promise((resolve, reject) => {
            getInitParams().then(init => {
                console.log('获取极光初始化参数：', init)
                commit('SET_INIT_DATA', init.data)
                JIM.init(init.data).then(() => {
                    console.log('账号登录参数', form)
                    JIM.login(form).then(() => {
                        console.log('极光登录成功')
                        kfuLogin(form.username).then(login => {
                            console.log('客服登录成功', login)
                            JIM.onSyncConversation().then(contents => {
                                // 极光登录后需要立即调用，否则不会响应
                                console.log('登录同步会话内容', contents)
                                KfuId(form.username).then(id => {
                                    console.log('客服ID', id)
                                    let kfuId = id.responseBody
                                    kfuInfo(kfuId).then(info => {
                                        console.log('客服信息', info)
                                        let userInfo = info.data
                                        commit('SET_USER_INFO', userInfo)
                                        commit('SET_CONVERSATION_CONTENT', contents)
                                        dispatch('kfuLoginSave', form)
                                        // 返回会话内容
                                        resolve(contents)
                                    })
                                })
                            })
                        })
                    }).catch(err => {
                        reject(err)
                    })
                })
            })
        })
    },
    // 客服登出
    kfuLoginOut({ state }) {
        return new Promise((resolve, reject) => {
            kfuLoginOut(state.userInfo.username).then(res => {
                console.log('客服退出登录', res)
                JIM.loginOut()
                cache.removeLocal(md5.usernameKey)
                cache.removeLocal(md5.passwordKey)
                resolve()
            })
        })
    },
    // 客服设置
    kfuSetting({ state, commit }, { replay, welcome, busyness }) {
        return new Promise((resolve, reject) => {
            let params = {
                'advisor_id': state.userInfo.id
            }
            if (replay) params.replay = replay
            if (welcome) params.welcome = welcome
            if (busyness) params.busyness = busyness
            kfuSetting(params).then(res => {
                console.log('客服设置', res)
                kfuInfo(state.userInfo.id).then(info => {
                    let userInfo = info.data
                    commit('SET_USER_INFO', userInfo)
                    resolve()
                })
            })
        })
    },
    // 客服登录存储
    kfuLoginSave({ state }, { username, password }) {
        cache.setLocal(md5.usernameKey, username)
        cache.setLocal(md5.passwordKey, password)
    }
}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
