<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { getNoticeList } from '@/api/home'

const props = defineProps({
  title: {
    type: String,
    default: '校园公告'
  },
  speed: {
    type: Number,
    default: 1 // 每帧移动像素
  },
  bgColor: {
    type: String,
    default: '#fff8e1'
  },
  textColor: {
    type: String,
    default: '#333'
  },
  icon: {
    type: String,
    default: '📢'
  }
})

const notices = ref([
  '欢迎来到校园失物招领平台。'
])

const currentIndex = ref(0)

const trackRef = ref()
const contentRef = ref()

let x = 0
let animationId = null
let paused = false

async function loadNotices() {

  try {

    const res = await getNoticeList()

    const list = res.data || []

    if (list.length) {
      const formatNotice = item => {
        if (!item) return ''
        if (typeof item === 'string') return item
        const title = item.title || ''
        const content = item.content ||''
        return content ? `${title}: ${content}` : title
      }
      notices.value = list.map(formatNotice)
    }

  } catch (err) {

    console.log(err)

  }

  await nextTick()

  startCurrentNotice()

}

function startCurrentNotice() {

  cancelAnimationFrame(animationId)

  const trackWidth = trackRef.value.clientWidth

  x = trackWidth

  contentRef.value.style.transform = `translateX(${x}px) translateY(-50%)`

  move()

}

function move() {

  if (paused) {

    animationId = requestAnimationFrame(move)

    return

  }

  x -= props.speed

  contentRef.value.style.transform =
    `translateX(${x}px) translateY(-50%)`

  const textWidth =
    contentRef.value.offsetWidth

  if (x < -textWidth) {

    currentIndex.value++

    if (currentIndex.value >= notices.value.length) {
      currentIndex.value = 0
    }

    nextTick(() => {

      startCurrentNotice()

    })

    return

  }

  animationId =
    requestAnimationFrame(move)

}

function pause() {

  paused = true

}

function resume() {

  paused = false

}

onMounted(() => {

  loadNotices()

})

onUnmounted(() => {

  cancelAnimationFrame(animationId)

})
</script>
<template>
  <div
    class="frontend-notice"
    :style="{
      background: props.bgColor,
      color: props.textColor
    }"
  >

    <div class="notice-inner">

      <div class="notice-title">

        <span class="notice-icon">
          {{ props.icon }}
        </span>

        {{ props.title }}

      </div>

      <div
        class="notice-track"
        ref="trackRef"
        @mouseenter="pause"
        @mouseleave="resume"
      >

        <div
          class="notice-content"
          ref="contentRef"
        >
          {{ notices[currentIndex] }}
        </div>

      </div>

    </div>

  </div>
</template>
<style scoped lang="scss">

.frontend-notice{

  padding:10px 15px;

  border-radius:8px;

  background:#fff8e1;

}

.notice-inner{

  display:flex;

  align-items:center;

}

.notice-title{

  width:120px;

  font-weight:bold;

  display:flex;

  align-items:center;

  flex-shrink:0;

}

.notice-icon{

  margin-right:6px;

}

.notice-track{

  flex:1;

  overflow:hidden;

  position:relative;

  height:32px;

}

.notice-content{

  position:absolute;

  left:0;

  top:50%;

  transform:translateY(-50%);

  white-space:nowrap;

  font-size:15px;

}

</style>
