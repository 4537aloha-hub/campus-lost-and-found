<script setup>
import { ref } from 'vue'
// 导入更新用户密码接口
import { updatePassword } from '@/api/user'
// 导入用户仓库
import { useUserStore } from '@/stores/modules/userstore'
import router from '@/router'

// 提供用户仓库实例
const userStore = useUserStore()

// 提供表单引用
const formRef = ref(null)

// 提供提交密码的表单
const pwdForm = ref({
  oldPwd:'',
  newPwd:'',
  confirmPwd:''
})

const rules = {
  oldPwd: [
    { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '新密码长度不能小于6位', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        // 校验新密码是否和旧密码相同
        if (value === pwdForm.value.oldPwd) {
          callback(new Error('新密码不能和旧密码相同'))
          return
        }

        callback()
      }
    }
  ],
  confirmPwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!pwdForm.value.newPwd) {
          callback(new Error('请先输入新密码'))
          return
        }
        if(!value) {
          callback(new Error('请确认新密码'))
          return
        }
        if (value !== pwdForm.value.newPwd) {
          callback(new Error('新密码和确认密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 提交修改密码请求操作
const onChangePassword = async () => {
  try {
    //触发表单校验
    await formRef.value.validate()
    // 调用更新密码接口
    await updatePassword(pwdForm.value)
    ElMessage.success('密码修改成功')
    // 清空密码表单
    formRef.value.resetFields()
    // 清空当前token值 退出登录状态
    userStore.setToken('')
    // 跳转到用户信息页面
    await router.push('/userinfo')
    // 刷新用户信息
    window.location.reload()
  } catch (error) {
    ElMessage.error('密码修改失败')
  }
}

</script>
<template>
<div class="container">
    <el-form
    label-width="100px"
    ref="formRef"
    :model="pwdForm"
    :rules="rules"
    >
      <el-form-item label="旧密码:" prop="oldPwd">
        <el-input v-model="pwdForm.oldPwd" type="password" placeholder="请输入旧密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码:" prop="newPwd">
        <el-input v-model="pwdForm.newPwd" type="password" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码:" prop="confirmPwd">
        <el-input v-model="pwdForm.confirmPwd" type="password" placeholder="请确认新密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onChangePassword">
          确认修改
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style scoped lang="scss">
.container {
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
    .el-form {
      padding-top: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .el-form-item {
        width: 300px;
        display: flex;
        justify-content: center;
    }
  }
}
</style>
