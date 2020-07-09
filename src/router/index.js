/* eslint-disable indent */
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/users/Users'
import Rights from '@/components/rights/Rights'
import Roles from '@/components/rights/Roles'
import Categories from '@/components/products/Categories'
import Goods from '@/components/products/Goods'
import Add from '@/components/products/Add'

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
                },
                {
                    path: '/rights',
                    name: 'rights',
                    component: Rights
                },
                {
                    path: '/roles',
                    name: 'roles',
                    component: Roles
                },
                {
                    path: '/categories',
                    name: 'categories',
                    component: Categories
                },
                {
                    path: '/goods',
                    name: 'goods',
                    component: Goods
                },
                {
                    path: '/goods-add',
                    name: 'goods-add',
                    component: Add
                }
            ]
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