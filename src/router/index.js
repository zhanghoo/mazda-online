import Vue from 'vue'
import Router from 'vue-router'

// 懒加载路由页面资源（加快首屏加载）
const client = () => import('@/pages/client')
const index = () => import('@/pages/index')
const login = () => import('@/pages/login')
const message = () => import('@/pages/message')

Vue.use(Router)

const routes = [
    {
        name: 'client',
        path: '/client',
        component: client
    },
    {
        name: 'index',
        path: '/index',
        component: index,
        meta: {
            login: true
        }
    },
    {
        name: 'login',
        path: '/login',
        component: login
    },
    {
        name: 'message',
        path: '/message',
        component: message
    }
]
export default new Router({
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
})
