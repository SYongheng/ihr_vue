import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Chat from '@/components/chat/Chat'
import Center from '@/components/user/Center'

Vue.use(Router)

export default new Router({
  // mode:'history',
  routes: [{
    path: '/',
    name: 'Login',
    component: Login,
    hidden: true
  }, {
    path: '/home',
    name: '主页',
    component: Home,
    hidden: true,
    meta: {
      requireAuth: true
    },
    children: [{
        path: '/chat',
        name: '消息',
        component: Chat,
        hidden: true,
        meta: {
          keepAlive: false,
          requireAuth: true
        }
      },
      {
        path: '/center',
        name: '个人中心',
        component: Center,
        hidden: true,
        meta: {
          keepAlive: false,
          requireAuth: true
        }
      }
    ]
  }]
})
