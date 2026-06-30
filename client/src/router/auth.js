import Login from '@/Views/auth/login/index.vue'
import Register from '@/Views/auth/register/index.vue'
import ForgetPassword from '@/Views/auth/forgetpassword/index.vue'

export default [
  {
    path: '/login',
    name: 'login',
    component: Login
  },

  {
    path: '/register',
    name: 'register',
    component: Register
  },

  {
    path: '/forgetpassword',
    name: 'forgetpassword',
    component: ForgetPassword
  }
]
