/* eslint-disable */
var Mock = require('mockjs/dist/mock-min.js')

// 开发数据
Mock.mock('http://localhost:8010/login', {
    'token': Mock.Random.string(20)
})

Mock.mock('http://localhost:8010/user', {
    code: 200,
    msg: 'success',
    data: {
        nickname: '思鑫',
        headimgurl: 'https://avatars1.githubusercontent.com/u/25951301?s=40&v=4',
        role: 'admin'
    }
})
Mock.mock('http://localhost:8010/list', () => {
    let params = {
        code: 200,
        msg: 'success',
        data: []
    }
    for (let index = 0; index < 15; index++) {
        let obj = Mock.mock({
            avatar: "@image('44x44', '#50B347', '#FFF', 'Mock.js')",
            username: "@cname",
            time: "@time",
            lastContent: "@csentence"
        })
        params.data.push(obj)
    }
    return params
})
