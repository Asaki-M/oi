// Content script for injecting iframe-based search interface

class OiContentSearch {
  private iframe: HTMLIFrameElement | null = null
  private isVisible = false
  private keydownHandler: ((event: KeyboardEvent) => void) | null = null
  private messageHandler: ((event: MessageEvent) => void) | null = null

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
      // 创建 iframe
      this.iframe = document.createElement('iframe')
      this.iframe.id = 'omni-search-iframe'

      // 设置 iframe 样式 - 直接定位到页面上方
      Object.assign(this.iframe.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        border: 'none',
        overflow: 'hidden',
        zIndex: '2147483647',
      })

      // 设置 iframe 源 - 使用专门的content页面
      this.iframe.src = chrome.runtime.getURL('src/content/content.html')

      // 监听iframe加载完成
      this.iframe.onload = () => {
        // 可以在这里进行额外的初始化
        console.log('Content search iframe loaded')
      }

      // 直接添加到页面
      document.body.appendChild(this.iframe)

      // 监听键盘事件
      this.setupKeyboardListener()

      this.isVisible = true

      // 阻止页面滚动
      document.body.style.overflow = 'hidden'
    } catch (error) {
      console.error('Failed to show omni search iframe:', error)
      this.cleanup()
    }
  }

  private setupKeyboardListener() {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.hide()
      }
    }

    document.addEventListener('keydown', handleKeydown)

    // 监听来自iframe的消息
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.action === 'close-content-search') {
        this.hide()
      }
    }

    window.addEventListener('message', handleMessage)

    // 存储事件处理器以便后续移除
    this.keydownHandler = handleKeydown
    this.messageHandler = handleMessage
  }

  private cleanup() {
    // 恢复页面滚动
    document.body.style.overflow = ''

    // 移除事件监听器
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler)
      this.keydownHandler = null
    }

    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler)
      this.messageHandler = null
    }

    // 移除iframe
    if (this.iframe && this.iframe.parentNode) {
      try {
        this.iframe.parentNode.removeChild(this.iframe)
      } catch (error) {
        console.error('Error removing iframe:', error)
      }
      this.iframe = null
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
let omniSearch: OiContentSearch | null = null

try {
  omniSearch = new OiContentSearch()
} catch (error) {
  console.error('Failed to initialize oi search:', error)
}

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  if (omniSearch) {
    omniSearch.destroy()
  }
})
