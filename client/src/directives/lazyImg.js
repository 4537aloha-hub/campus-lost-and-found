import { useIntersectionObserver } from '@vueuse/core'

export const lazyPlugin = {
  install(app) {
    app.directive('img-lazy', {
      mounted(el, binding) {
        console.log(el, binding.value)

        // 使用 useIntersectionObserver 监听元素
        const { stop } = useIntersectionObserver(
          el,
          ([{ isIntersecting }]) => {
            // 判断用户是否进入图片加载区域，如果是则加载图片
            if (isIntersecting) {
              el.src = binding.value
              stop()  // 停止观察，避免继续触发
            }
          }
        )
      }
    })
  }
}
