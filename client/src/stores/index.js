import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia =  createPinia()
pinia.use(persist)

export default pinia

// 二次导出，方便在其他地方使用 本地化存储的 store localStorage
// export * from './modules/user'
