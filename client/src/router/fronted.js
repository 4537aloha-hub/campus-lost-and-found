import { createRouter, createWebHistory } from 'vue-router'
import FrontLayout from '@/Views/layout/FrontedLayout.vue'
import authRoutes from './auth.js'
import adminRoutes from './admin.js'
import { useUserStore } from '@/stores/modules/userstore'

import Home from '@/Views/frontend/home/home.vue'
import Lost from '@/Views/frontend/lost/index.vue'
import Publish from '@/Views/frontend/publish/index.vue'
import DetailPage from '@/Views/frontend/detail/detailpage.vue'

import UserLayoutContainer from '@/Views/frontend/user/UserLayoutContainer.vue'

import UserInfo from '@/Views/frontend/user/components/UserInfo.vue'
import EditUserInfo from '@/Views/frontend/user/components/EditUserInfo.vue'

import UserSecurity from '@/Views/frontend/user/UserSecurity.vue'
import UpdatePassword from '@/Views/frontend/user/components/edit_userinfo_components/UpdatePassword.vue'

import VerifyOldEmail from '@/Views/frontend/user/components/edit_userinfo_components/VerifyOldEmail.vue'
import VerifyPwdEmail from '@/Views/frontend/user/components/edit_userinfo_components/VerifyPwdEmail.vue'
import UpdateEmail from '@/Views/frontend/user/components/edit_userinfo_components/UpdateEmail.vue'
import NewEmailVerify from '@/Views/frontend/user/components/edit_userinfo_components/NewEmailVerify.vue'

import UserClaim from '@/Views/frontend/user/UserClaim.vue'
import ClaimHistory from '@/Views/frontend/user/components/ClaimHistory.vue'
import PendingClaims from '@/Views/frontend/user/components/PendingClaims.vue'
import MyApply from '@/Views/frontend/user/components/MyApply.vue'

import FoundItem from '@/Views/frontend/user/components/FoundItem.vue'
import LostItem from '@/Views/frontend/user/components/LostItem.vue'
import ChatPage from '@/Views/frontend/user/components/ChatPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 认证路由
    ...authRoutes,
    // 管理员路由
    ...adminRoutes,

  {
    path: '/',
    component: FrontLayout,
    redirect: '/home',

    children: [
      {
        path: 'home',
        name: 'home',
        component: Home
      },

      {
        path: 'lost',
        name: 'lost',
        component: Lost
      },

      {
        path: 'publish',
        name: 'publish',
        component: Publish
      },

      {
        path: 'detail/:type/:id',
        name: 'detail',
        component: DetailPage
      },

      // 用户中心
      {
        path: 'user',
        component: UserLayoutContainer,
        redirect: '/user/profile',

        meta: {
          requiresAuth: true
        },

        children: [
          {
            path: 'profile',
            name: 'userinfo',
            component: UserInfo,
            meta: {
              title: '基本资料'
            }
          },

          {
            path: 'profile/edit',
            name: 'edituserinfo',
            component: EditUserInfo,
            meta: {
              title: '编辑资料',
              breadcrumb: ['基本资料', '编辑资料']
            }
          },

          {
            path: 'security',
            name: 'usersecurity',
            component: UserSecurity,
            meta: {
              title: '账号安全'
            }
          },

          {
            path: 'security/password/verify',
            name: 'verifypwdemail',
            component: VerifyPwdEmail,
            meta: {
              title: '验证邮箱',
              breadcrumb: ['账号安全', '验证邮箱']
            }
          },

          {
            path: 'security/password',
            name: 'updatepassword',
            component: UpdatePassword,
            meta: {
              title: '修改密码',
              breadcrumb: ['账号安全', '验证邮箱', '修改密码']
            }
          },

          {
            path: 'security/email/verify',
            name: 'verifyoldemail',
            component: VerifyOldEmail,
            meta: {
              title: '验证原邮箱',
              breadcrumb: ['账号安全', '验证原邮箱']
            }
          },

          {
            path: 'security/email/new',
            name: 'updateemail',
            component: UpdateEmail,
            meta: {
              title: '设置新邮箱',
              breadcrumb: [
                '账号安全',
                '验证原邮箱',
                '设置新邮箱'
              ]
            }
          },

          {
            path: 'security/email/confirm',
            name: 'newemailverify',
            component: NewEmailVerify,
            meta: {
              title: '验证新邮箱',
              breadcrumb: [
                '账号安全',
                '验证原邮箱',
                '设置新邮箱',
                '验证新邮箱'
              ]
            }
          },

          {
            path: 'lost',
            name: 'lostitem',
            component: LostItem,
            meta: {
              title: '我丢失的'
            }
          },

          {
            path: 'found',
            name: 'founditem',
            component: FoundItem,
            meta: {
              title: '我发布的'
            }
          },

          {
            path: 'chats',
            name: 'chatpage',
            component: ChatPage,
            meta: {
              title: '我的会话'
            }
          },

          {
            path: 'claims',
            name: 'claims',
            component: UserClaim,
            meta: {
              title: '我的认领'
            },
            children:[
              {
                path: 'pending',
                name: 'pendingclaims',
                component: PendingClaims,
                meta: {
                  title: '待处理认领'
                }
              },
              {
                path: 'history',
                name: 'claimhistory',
                component: ClaimHistory,
                meta: {
                  title: '认领历史'
                }
              },
              {
                path: 'myclaims',
                name: 'apply',
                component: MyApply,
                meta: {
                  title: '我的申请'
                }
              }
            ]
          }
        ]
      }
    ]
  }
]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isLoggedIn = !!userStore.token
  const userInfo = userStore.userInfo

  // 如果用户已登录
  if (isLoggedIn && userInfo) {
    // 如果是管理员，访问非/admin路径时跳转到后台首页
    if (userInfo.role === 'admin' && !to.path.startsWith('/admin')) {
      next('/admin/dashboard')
      return
    }
    // 如果是普通用户，访问/admin路径时跳转到用户首页
    if (userInfo.role !== 'admin' && to.path.startsWith('/admin')) {
      next('/home')
      return
    }
    next()
  } else if (isLoggedIn && !userInfo) {
    // 有token但没有userInfo，尝试获取用户信息
    userStore.FetUserInfo().then(() => {
      const info = userStore.userInfo
      if (info.role === 'admin') {
        next(to.path.startsWith('/admin') ? to.path : '/admin/dashboard')
      } else {
        next(to.path.startsWith('/admin') ? '/home' : to.path)
      }
    }).catch(() => {
      // 获取用户信息失败，跳转到登录
      next('/login')
    })
  } else {
    // 未登录状态
    // 如果访问需要认证的路由，跳转到登录
    if (to.meta.requiresAuth) {
      next('/login')
      return
    }
    next()
  }
})

export default router
