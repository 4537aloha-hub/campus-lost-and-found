<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/userstore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const handleBreadcrumbClick = (index) => {
  const currentBreadcrumbs = breadcrumbs.value

  // 如果是最后一项，刷新当前页面
  if (index === currentBreadcrumbs.length - 1) {
    router.go(0)
    return
  }

  // 根据点击的面包屑索引，导航到对应的路由
  // 使用 replace 模式，不会产生新的历史记录
  const routes = [
    { name: 'usersecurity', index: 0 },      // 账号安全
    { name: 'verifyoldemail', index: 1 },   // 验证邮箱
    { name: 'updateemail', index: 2 },      // 新邮箱设置
    { name: 'newemailverify', index: 3 },   // 新邮箱验证
  ]

  const targetRoute = routes.find(r => r.index === index)
  if (targetRoute) {
    // 邮箱验证流程的特殊处理
    // 如果用户已经完成了旧邮箱验证（步骤1），点击返回验证邮箱步骤
    // 需要重置验证状态，强制重新验证
    if (targetRoute.name === 'verifyoldemail' && userStore.updateEmailStep >= 1) {
      // 重置验证步骤
      userStore.setUpdateEmailStep(0)
      // 使用 replace 替换当前历史记录，防止后退
      router.replace({ name: targetRoute.name })
    } else {
      router.replace({ name: targetRoute.name })
    }
  }
}

const breadcrumbs = computed(() => {
  const { meta } = route

  if (!Array.isArray(meta.breadcrumb)) {
    return []
  }

  return meta.breadcrumb.map(item => {
    if (typeof item === 'string') {
      return { text: item }
    }
    return item
  })
})
</script>

<template>
  <el-breadcrumb v-if="breadcrumbs.length" separator=">" class="breadcrumb-wrap">
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbs"
      :key="index"
      @click="handleBreadcrumbClick(index)"
      class="breadcrumb-item"
    >
      <span>{{ item.text }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped lang="scss">
.breadcrumb-wrap {
  margin-bottom: 16px;
  cursor: pointer;
}

.breadcrumb-item {
  cursor: pointer;

  span {
    font-size: 14px;
  }

  &:hover span {
    color: #409eff;
  }
}

.breadcrumb-wrap ::v-deep .el-breadcrumb__inner {
  font-size: 14px;
  padding: 0;
}

.breadcrumb-wrap ::v-deep .el-breadcrumb__separator {
  margin: 0 8px;
}
</style>
