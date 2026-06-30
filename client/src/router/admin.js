import AdminLayout from '@/Views/layout/AdminLayout.vue'

export default [
  {
    path: '/admin',

    component: AdminLayout,

    redirect: '/admin/dashboard',

    meta: {
      requiresAuth: true,
      role: 'admin'
    },

    children: [
      {
        path: 'dashboard',
        name: 'dashboard',

        component: () =>
          import('@/Views/admin/dashboard/index.vue'),

        meta: {
          title: '数据看板'
        }
      },

      {
        path: 'users',
        name: 'adminUsers',

        component: () =>
          import('@/Views/admin/user/index.vue'),

        meta: {
          title: '用户管理'
        }
      },

      {
        path: 'items',
        name: 'adminItems',

        component: () =>
          import('@/Views/admin/item/index.vue'),

        meta: {
          title: '物品管理'
        }
      },

      {
        path: 'categories',
        name: 'adminCategories',

        component: () =>
          import('@/Views/admin/category/index.vue'),

        meta: {
          title: '分类管理'
        }
      },

      {
        path: 'claims',
        name: 'adminClaims',

        component: () =>
          import('@/Views/admin/claim/index.vue'),

        meta: {
          title: '认领审核'
        }
      },

      {
        path: 'notices',
        name: 'adminNotices',

        component: () =>
          import('@/Views/admin/notice/index.vue'),

        meta: {
          title: '公告管理'
        }
      },

      {
        path: 'banners',
        name: 'adminBanners',

        component: () =>
          import('@/Views/admin/banner/index.vue'),

        meta: {
          title: '轮播图管理'
        }
      }
    ]
  }
]
