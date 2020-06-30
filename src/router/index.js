/* eslint-disable indent */
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/Users'

Vue.use(Router)

let router = new Router({
    routes: [{
            path: '/',
            redirect: '/home'
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            children: [{
                path: '/users',
                name: 'users',
                component: Users
            }]
        }
    ]
})

router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('token')

    if (to.path === '/login' || token) {
        next()
    } else {
        next('/login')
    }
})

export default router