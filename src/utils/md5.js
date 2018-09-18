import md5 from 'blueimp-md5'

let usernameKey = md5('username')
let passwordKey = md5('password')

export default {
    usernameKey,
    passwordKey,
    hash: function (value) {
        return md5(value)
    }
}
