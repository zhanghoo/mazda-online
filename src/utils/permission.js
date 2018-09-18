import router from '@/router'
import cache from '@/utils/cache'
import md5 from '@/utils/md5'

// 登录验证，权限验证
router.beforeEach((to, from, next) => {
    // 是否需要登录
    if (to.matched.some(record => record.meta.login)) {
        if (cache.getLocal(md5.usernameKey)) {
            if (to.path === '/login') {
                next('/index')
            } else {
                next()
            }
        } else {
            next({ path: '/login', query: { redirect: to.fullPath } })
        }
        next()
    } else {
        if (to.path === '/login' && cache.getToken()) {
            next('/index')
        } else {
            next()
        }
    }
})
