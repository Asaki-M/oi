import { createApp } from 'vue'
import ContentSearch from './ContentSearch.vue'
import './tailwind-inject.css'

// 在iframe中创建Vue应用
const app = createApp(ContentSearch, {
  onClose: () => {
    // 通知父页面关闭iframe
    if (window.parent !== window) {
      window.parent.postMessage({ action: 'close-content-search' }, '*')
    }
  },
})

// 配置错误处理
app.config.errorHandler = (err, _instance, info) => {
  console.error('Vue error in content iframe:', err, info)
}

// 挂载应用
app.mount('#app')

// 监听来自父页面的消息
window.addEventListener('message', event => {
  // 这里可以处理来自父页面的消息，比如传递数据等
  if (event.data?.action === 'focus-search') {
    // 可以在这里处理聚焦搜索框的逻辑
  }
})

console.log('Content search app initialized in iframe')
