<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { getStatistics, getActivityList, get7DayStatistics } from '@/api/admin.js'
import * as echarts from 'echarts'

const currentTime = ref('')
let timer = null

// 图表实例引用
const userTrendRef = ref(null)
const itemTrendRef = ref(null)

const claimPieRef = ref(null)
const auditPieRef = ref(null)

// 图表实例
// 1. 用户增长趋势图表
const renderUserChart = (data) => {
  const chart = echarts.init(userTrendRef.value)

  chart.setOption({
    title:{
      text:'用户增长趋势'
    },
    tooltip:{
      trigger:'axis'
    },
    xAxis:{
      type:'category',
      data:data.map(item=>item.date)
    },
    yAxis:{
      type:'value'
    },
    series:[
      {
        name:'新增用户',
        type:'line',
        smooth:true,
        data:data.map(item=>item.count)
      }
    ]
  })
}

// 2. 物品增长趋势图表
const renderItemChart = (data) => {
  const chart = echarts.init(itemTrendRef.value)

  chart.setOption({
    title:{
      text:'物品发布趋势'
    },
    tooltip:{
      trigger:'axis'
    },
    xAxis:{
      type:'category',
      data:data.map(item=>item.date)
    },
    yAxis:{
      type:'value'
    },
    series:[
      {
        name:'发布数量',
        type:'line',
        smooth:true,
        data:data.map(item=>item.count)
      }
    ]
  })
}
// 3.认领物品情况饼图
const renderClaimPie = (claimed, unclaimed) => {
  const chart = echarts.init(claimPieRef.value)

  chart.setOption({
    title:{
      text:'物品认领情况',
      left:'center'
    },
    tooltip:{
      trigger:'item'
    },
    series:[
      {
        type:'pie',
        radius:'65%',
        data:[
          {
            value:claimed,
            name:'已认领'
          },
          {
            value:unclaimed,
            name:'未认领'
          }
        ]
      }
    ]
  })
}
// 4.审核物品情况饼图
const renderAuditPie = (audited, unaudited) => {
  const chart = echarts.init(auditPieRef.value)

  chart.setOption({
    title:{
      text:'物品审核情况',
      left:'center'
    },
    tooltip:{
      trigger:'item'
    },
    series:[
      {
        type:'pie',
        radius:'65%',
        data:[
          {
            value:audited,
            name:'已审核'
          },
          {
            value:unaudited,
            name:'未审核'
          }
        ]
      }
    ]
  })
}

// 统计数据
const stats = ref({
  todayUsers: '--',
  yesterdayUsers: '--',
  userGrowth: null,
  todayItems: '--',
  yesterdayItems: '--',
  itemGrowth: null,
  claimed: '--',
  claimedRate: null,
  audited: '--',
  auditedRate: null,
})

// 活动记录
const activities = ref([])

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// 调用echats图表数据接口
const loadCharts = async () => {
  const res = await get7DayStatistics()

  if(res.status === 0){

    renderUserChart(
      res.data.sevenDayUsersCount
    )

    renderItemChart(
      res.data.sevenDayItemsCount
    )

    renderClaimPie(
      res.data.claimed,
      res.data.unclaimed
    )

    renderAuditPie(
      res.data.audited,
      res.data.unaudited
    )
  }
}

// 获取统计信息
const loadStatistics = async () => {
  try {
    const response = await getStatistics()
    if (response.status === 0) {
      const data = response.data
      // 用户统计
      stats.value.todayUsers = data.todayUsers?.[0]?.today_count || '--'
      stats.value.yesterdayUsers = data.yesterdayUsers?.[0]?.yesterday_count || '--'
      stats.value.userGrowth = data.growth
      // 物品统计
      stats.value.todayItems = data.todayItems?.[0]?.today_count || '--'
      stats.value.yesterdayItems = data.yesterdayItems?.[0]?.yesterday_count || '--'
      stats.value.itemGrowth = data.itemGrowth
      // 认领统计
      stats.value.claimed = data.claimed?.[0]?.claimed || '--'
      stats.value.claimedRate = data.claimedRate
      // 审核统计
      stats.value.audited = data.audited?.[0]?.audited || '--'
      stats.value.auditedRate = data.auditedRate
    }
  } catch (error) {
    console.error('获取统计信息失败:', error)
  }
}

// 获取活动记录
const loadActivities = async () => {
  try {
    const response = await getActivityList()
    if (response.status === 0) {
      activities.value = response.data.slice(0, 10) || []
    }
  } catch (error) {
    console.error('获取活动记录失败:', error)
  }
}

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return '未知'
  const now = new Date()
  const time = new Date(timeStr)
  const diff = now - time
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return time.toLocaleDateString('zh-CN')
}

// 获取活动类型文本
const getActivityText = (activity) => {
  if (!activity) return ''
  // 获取用户名，支持多种字段名
  const username = activity.username || activity.user_name || '用户'
  const actionType = activity.action_type || activity.type

  const typeMap = {
    publish_item: `${username} 发布了${activity.target_type === 'lost' ? '失物' : '招领'}信息`,
    claim: `${username} 提交了认领申请`,
    audit_pass: `管理员审核通过了${username}的认领`,
    audit_reject: `管理员拒绝了${username}的认领`,
    system: `${activity.content}`,
  }
  return typeMap[actionType] || activity.content || '未知操作'
}

onMounted(async () => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  // 加载统计数据
  await loadStatistics()

  await loadActivities()
  // 加载图表数据 await loadStatistics()

  await nextTick()

  await loadCharts()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="admin-page">
    <div class="admin-page-header">
      <div>
        <h2>控制台</h2>
        <p class="page-desc">欢迎回来，管理员！这里是系统概览。</p>
      </div>
      <div class="current-time">{{ currentTime }}</div>
    </div>

    <div class="dashboard-grid">
      <div class="stat-card users">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.todayUsers }}</div>
          <div class="stat-label">今日新增用户</div>
        </div>
        <div
          :class="[
            'stat-trend',
            stats.todayUsers !== null && stats.todayUsers >= 0 ? 'up' : 'down',
          ]"
        >
          {{ stats.todayUsers !== null ? stats.todayUsers : '--' }}
        </div>
      </div>

      <div class="stat-card items">
        <div class="stat-icon">📦</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.todayItems }}</div>
          <div class="stat-label">今日新增物品</div>
        </div>
        <div
          :class="[
            'stat-trend',
            stats.todayItems !== null && stats.todayItems >= 0 ? 'up' : 'down',
          ]"
        >
          {{
            stats.itemGrowth !== null
              ? (stats.itemGrowth >= 0 ? '↑' : '↓') + Math.abs(stats.itemGrowth) + '%'
              : '--'
          }}
        </div>
      </div>

      <div class="stat-card claims">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.claimed }}</div>
          <div class="stat-label">已认领数量</div>
        </div>
        <div class="stat-trend up">
          {{ stats.claimed !== null ? stats.claimed : '--' }}
        </div>
      </div>

      <div class="stat-card pending">
        <div class="stat-icon">⏳</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.audited }}</div>
          <div class="stat-label">已审核数量</div>
        </div>
        <div class="stat-trend up">
          {{ stats.audited !== null ? stats.audited : '--' }}
        </div>
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-card">
        <div ref="userTrendRef" class="chart"></div>
      </div>

      <div class="chart-card">
        <div ref="itemTrendRef" class="chart"></div>
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-card">
        <div ref="claimPieRef" class="chart"></div>
      </div>

      <div class="chart-card">
        <div ref="auditPieRef" class="chart"></div>
      </div>
    </div>

    <div class="dashboard-section">
      <h3 class="section-title">近期动态</h3>
      <div class="activity-list">
        <div class="activity-item" v-for="activity in activities" :key="activity.id">
          <span class="activity-dot"></span>
          <span class="activity-text">{{ getActivityText(activity) }}</span>
          <span class="activity-time">{{
            formatTime(activity.created_at || activity.createdAt)
          }}</span>
        </div>
        <div class="empty-activity" v-if="activities.length === 0">暂无活动记录</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-page-header {
  flex-wrap: wrap;
  gap: 16px;

  .current-time {
    font-size: 14px;
    color: #718096;
    font-family: monospace;
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .stat-icon {
    font-size: 36px;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
  }

  .stat-info {
    flex: 1;

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #1a202c;
    }

    .stat-label {
      font-size: 13px;
      color: #718096;
      margin-top: 4px;
    }
  }

  .stat-trend {
    font-size: 12px;
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 10px;

    &.up {
      color: #48bb78;
      background: #f0fff4;
    }

    &.down {
      color: #fc8181;
      background: #fff5f5;
    }
  }

  &.users .stat-icon {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.items .stat-icon {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  &.claims .stat-icon {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }

  &.pending .stat-icon {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  }
}
.chart-grid{
  display:grid;
  grid-template-columns: repeat(2,1fr);
  gap:20px;
  margin-bottom:24px;
}

.chart-card{
  background:#fff;
  border-radius:12px;
  padding:20px;
  box-shadow:0 2px 8px rgba(0,0,0,.06);
}

.chart{
  width:100%;
  height:350px;
}
.dashboard-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 20px;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a202c;
    margin: 0 0 16px 0;
  }
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: #f7fafc;
  }

  .activity-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #48bb78;
  }

  .activity-text {
    flex: 1;
    font-size: 14px;
    color: #4a5568;

    strong {
      color: #2d3748;
    }
  }

  .activity-time {
    font-size: 12px;
    color: #a0aec0;
  }
}

.empty-activity {
  text-align: center;
  color: #a0aec0;
  font-size: 14px;
  padding: 20px;
}
</style>
