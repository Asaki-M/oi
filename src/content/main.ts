import { createApp, type App } from 'vue'
import ContentSearch from './ContentSearch.vue'
import './tailwind-inject.css'

class OmniContentSearch {
  private app: App | null = null
  private container: HTMLElement | null = null
  private isVisible = false

  constructor() {
    this.init()
  }

  private init() {

    // 确保在DOM加载完成后初始化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupMessageListener()
      })
    } else {
      this.setupMessageListener()
    }
  }

  private setupMessageListener() {
    // 监听来自扩展的消息（主要通过Chrome commands API触发）
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === 'toggle-content-search') {
        this.toggle()
        sendResponse({ success: true })
      }
      return true // 保持消息通道开放
    })
  }

  private toggle() {
    if (this.isVisible) {
      this.hide()
    } else {
      this.show()
    }
  }

  private show() {
    if (this.isVisible) return

    try {
      // 创建容器
      this.container = document.createElement('div')
      this.container.id = 'omni-search-root'

      // 添加到页面
      document.body.appendChild(this.container)

      // 创建Vue应用
      this.app = createApp(ContentSearch, {
        onClose: () => this.hide()
      })

      // 配置错误处理
      this.app.config.errorHandler = (err, _instance, info) => {
        console.error('Vue error:', err, info)
      }

      // 挂载应用
      this.app.mount(this.container)

      this.isVisible = true

      // 阻止页面滚动
      document.body.style.overflow = 'hidden'
    } catch (error) {
      console.error('Failed to show omni search:', error)
      this.cleanup()
    }
  }

  private cleanup() {
    // 恢复页面滚动
    document.body.style.overflow = ''

    // 销毁Vue应用
    if (this.app) {
      try {
        this.app.unmount()
      } catch (error) {
        console.error('Error unmounting app:', error)
      }
      this.app = null
    }

    // 移除容器
    if (this.container && this.container.parentNode) {
      try {
        this.container.parentNode.removeChild(this.container)
      } catch (error) {
        console.error('Error removing container:', error)
      }
      this.container = null
    }

    this.isVisible = false
  }

  public destroy() {
    this.cleanup()
  }

  private hide() {
    if (!this.isVisible) return
    this.cleanup()
  }
}

// 初始化 - 添加错误保护
let omniSearch: OmniContentSearch | null = null

try {
  omniSearch = new OmniContentSearch()
} catch (error) {
  console.error('Failed to initialize omni search:', error)
}

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  if (omniSearch) {
    omniSearch.destroy()
  }
})
