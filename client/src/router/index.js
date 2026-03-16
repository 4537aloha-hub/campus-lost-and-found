import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Views/home/home.vue'
import Layout from '@/Views/layout/layout.vue'
import Login from '@/Views/login/index.vue'
import Register from '@/Views/register/index.vue'
import Lost from '@/Views/lost/index.vue'
import Publish from '@/Views/publish/index.vue'
import UserLayoutContainer from '@/Views/user/UserLayoutContainer.vue'
import Detail from '@/Views/detail/Detail.vue'
import search from '@/Views/search/index.vue'
// 用户路由
import FoundItem from '@/Views/user/components/FoundItem.vue'
import LostItem from '@/Views/user/components/LostItem.vue'

import UserInfo from '@/Views/user/components/UserInfo.vue'
import EditUserInfo from '@/Views/user/components/EditUserInfo.vue'
import UpdatePassword from '@/Views/user/components/edit_userinfo_components/UpdatePassword.vue'
import ChatPage from '@/Views/user/components/ChatPage.vue'
import { useUserStore } from '@/stores/modules/userstore'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    name:'layout',
    component:Layout,
    redirect:'/home',
    children:[
      {
        path: '/home',
        name: 'home',
        component: Home
      },
      {
        path: 'detail/:type/:id',
        name: 'detail',
        component: Detail
      },
      {
        path: '/lost',
        name: 'lost',
        component: Lost
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path:'/search',
        name:'search',
        component: search
      },
      {
        path: '/userlayoutcontainer',
        name: 'userlayoutcontainer',
        component: UserLayoutContainer,
        // 当点击 用户界面 时 路由重定向到用户信息界面
        redirect:'/userlayoutcontainer/userinfo',
        children:[{
          path:'founditem',
          name:'founditem',
          component: FoundItem
        },
        {
          path:'lostitem',
          name:'lostitem',
          component: LostItem
        },
        {
          path:'chatpage',
          name:'chatpage',
          component: ChatPage
        },
        {
          path:'userinfo',
          name:'userinfo',
          component: UserInfo
        },
        {
          path:'edituserinfo',
          name:'edituserinfo',
          component: EditUserInfo
        },
        {
          path:'updatepassword',
          name:'updatepassword',
          component: UpdatePassword
        },
      ]
      },
    ]
  },
  // 配置登录页动态路由
  {
    path:'/login',
    name:'login',
    component : Login,
  },
  // 配置注册页动态路由
  {
    path:'/register',
    name:'register',
    component: Register
  },
]
})

// 全局导航守卫
router.beforeEach((to, from, next) => {
  // 需要认证的路由 - 移除了用户页面的重定向
  const requiresAuth = [
    // 暂为空 后续优化
  ];

  // 检查当前路由是否需要认证
  if (requiresAuth.includes(to.path)) {
    const userStore = useUserStore();

    // 检查是否有token
    if (!userStore.token) {
      // 跳转到登录页
      next('/login');
    } else {
      // 有token，继续访问
      next();
    }
  } else {
    // 不需要认证的路由，直接访问
    next();
  }
});

export default router
