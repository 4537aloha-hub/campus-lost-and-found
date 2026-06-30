<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/modules/userstore'
import adminDefaultAvatar from '@/assets/imgs/admin_default_avatar.jpg'
const isCollapsed = ref(false)
const userStore = useUserStore()

// 当前用户信息
const currentUser = computed(() => {
  return userStore.userInfo || { username: '管理员', email: '' }
})

// 退出登录
const handleLogout = () => {
  userStore.loginOut()
}
</script>
<template>
	<div class="admin-root">
		<aside class="admin-aside" :class="{ collapsed: isCollapsed }">
			<div class="brand">
				<span class="brand-icon">⚡</span>
				<span class="brand-text">管理后台</span>
			</div>
			<nav class="admin-menu">
				<router-link to="/admin/dashboard" class="menu-item" active-class="active">
					<span class="menu-icon">📊</span>
					<span class="menu-text">控制台</span>
				</router-link>
				<router-link to="/admin/users" class="menu-item" active-class="active">
					<span class="menu-icon">👥</span>
					<span class="menu-text">用户管理</span>
				</router-link>
				<router-link to="/admin/items" class="menu-item" active-class="active">
					<span class="menu-icon">📦</span>
					<span class="menu-text">物品管理</span>
				</router-link>
				<router-link to="/admin/categories" class="menu-item" active-class="active">
					<span class="menu-icon">📁</span>
					<span class="menu-text">分类管理</span>
				</router-link>
				<router-link to="/admin/claims" class="menu-item" active-class="active">
					<span class="menu-icon">✅</span>
					<span class="menu-text">认领审核</span>
				</router-link>
				<router-link to="/admin/notices" class="menu-item" active-class="active">
					<span class="menu-icon">📢</span>
					<span class="menu-text">公告管理</span>
				</router-link>
				<router-link to="/admin/banners" class="menu-item" active-class="active">
					<span class="menu-icon">🖼️</span>
					<span class="menu-text">轮播图管理</span>
				</router-link>
			</nav>
			<div class="aside-footer">
				<button class="collapse-btn" @click="isCollapsed = !isCollapsed">
					{{ isCollapsed ? '▶' : '◀' }}
				</button>
			</div>
		</aside>

		<div class="admin-main">
			<header class="admin-header">
				<div class="header-left">
					<h1 class="header-title">校园失物招领管理系统</h1>
				</div>
				<div class="header-right">
        <el-dropdown>
          <div class="user-info">
            <el-avatar size="small" :src="currentUser?.avatar === '/default-avatar.png' ? adminDefaultAvatar : currentUser.avatar" />
            <p class="user-name">{{ currentUser.username }}</p>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
				</div>
			</header>
			<section class="admin-content">
				<router-view />
			</section>
		</div>
	</div>
</template>

<style scoped lang="scss">
.admin-root {
	display: flex;
	min-height: 100vh;
	background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

.admin-aside {
	width: 240px;
	background: linear-gradient(180deg, #2c3e50 0%, #1a252f 100%);
	color: #fff;
	box-shadow: 4px 0 15px rgba(0, 0, 0, 0.15);
	display: flex;
	flex-direction: column;
	transition: width 0.3s ease;
	position: relative;

	&.collapsed {
		width: 64px;

		.brand-text, .menu-text {
			display: none;
		}

		.brand {
			justify-content: center;
		}

		.menu-item {
			justify-content: center;

			.menu-icon {
				margin-right: 0;
			}
		}
	}
}

.brand {
	height: 70px;
	display: flex;
	align-items: center;
	padding: 0 20px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	gap: 10px;

	.brand-icon {
		font-size: 24px;
	}

	.brand-text {
		font-weight: 700;
		font-size: 16px;
		letter-spacing: 1px;
	}
}

.admin-menu {
	display: flex;
	flex-direction: column;
	padding: 20px 12px;
	gap: 8px;
	flex: 1;
}

.menu-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
	border-radius: 8px;
	color: rgba(255, 255, 255, 0.85);
	text-decoration: none;
	transition: all 0.25s ease;
	font-size: 14px;

	.menu-icon {
		font-size: 18px;
		margin-right: 10px;
	}

	&:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}

	&.active {
		background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
		color: #fff;
		box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
	}
}

.aside-footer {
	padding: 16px;
	border-top: 1px solid rgba(255, 255, 255, 0.1);

	.collapse-btn {
		width: 100%;
		padding: 8px;
		background: rgba(255, 255, 255, 0.1);
		border: none;
		border-radius: 6px;
		color: #fff;
		cursor: pointer;
		transition: background 0.2s;

		&:hover {
			background: rgba(255, 255, 255, 0.15);
		}
	}
}

.admin-main {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.admin-header {
	height: 70px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30px;
	background: #fff;
	border-bottom: 1px solid #e8ecef;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

	.header-title {
		font-size: 18px;
		font-weight: 600;
		color: #2c3e50;
		margin: 0;
	}
}

.header-right {
		display: flex;
		align-items: center;
		border-radius: 20px;
		cursor: pointer;
      .user-info {
				display: flex;
				align-items: center;
        justify-content: center;
				gap: 12px;
					.user-name {
						font-size: 14px;
						font-weight: 500;
						color: #34495e;
			}
		}
	}

.admin-content {
	padding: 24px;
	overflow-y: auto;
	flex: 1;
}

/* 公共页面容器 */
.admin-page {
	background: #fff;
	border-radius: 12px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
	padding: 24px;
}

.admin-page-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	padding-bottom: 16px;
	border-bottom: 1px solid #f0f2f5;

	h2 {
		font-size: 20px;
		font-weight: 600;
		color: #1a202c;
		margin: 0;
	}

	.page-desc {
		font-size: 14px;
		color: #718096;
	}
}

@media (max-width: 900px) {
	.admin-aside {
		width: 64px;

		.brand-text, .menu-text {
			display: none;
		}

		.brand {
			justify-content: center;
		}

		.menu-item {
			justify-content: center;

			.menu-icon {
				margin-right: 0;
			}
		}
	}
}
</style>
