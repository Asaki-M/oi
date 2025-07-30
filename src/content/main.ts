class OmniContentSearch {
  private iframe: HTMLIFrameElement | null = null
  private overlay: HTMLElement | null = null
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
    // 监听来自扩展的消息
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === 'toggle-content-search') {
        this.toggle()
        sendResponse({ success: true })
      }
      return true
    })

    // 监听来自 iframe 的消息
    window.addEventListener('message', (event) => {
      if (event.data.type === 'omni-close') {
        this.hide()
      }
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
      // 创建遮罩层
      this.overlay = document.createElement('div')
      this.overlay.id = 'omni-search-overlay'

      // 设置遮罩层样式
      Object.assign(this.overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: '2147483647',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh'
      })

      // 创建 iframe
      this.iframe = document.createElement('iframe')
      this.iframe.id = 'omni-search-iframe'

      // 设置 iframe 样式
      Object.assign(this.iframe.style, {
        width: '800px',
        maxWidth: '90vw',
        height: '600px',
        maxHeight: '80vh',
        border: 'none',
        borderRadius: '12px',
        backgroundColor: 'white',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden'
      })

      // 设置 iframe 源 - 直接使用 popup 页面
      this.iframe.src = chrome.runtime.getURL('src/popup/index.html')

      // 添加到遮罩层
      this.overlay.appendChild(this.iframe)

      // 添加到页面
      document.body.appendChild(this.overlay)

      // 点击遮罩层关闭
      this.overlay.addEventListener('click', (event) => {
        if (event.target === this.overlay) {
          this.hide()
        }
      })

      this.isVisible = true

      // 阻止页面滚动
      document.body.style.overflow = 'hidden'
    } catch (error) {
      console.error('Failed to show omni search iframe:', error)
      this.cleanup()
    }
  }

  private hide() {
    if (!this.isVisible) return

    try {
      // 恢复页面滚动
      document.body.style.overflow = ''

      // 移除遮罩层
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay)
      }

      this.iframe = null
      this.overlay = null
      this.isVisible = false
    } catch (error) {
      console.error('Failed to hide omni search iframe:', error)
    }
  }

  private cleanup() {
    this.hide()
  }

  public destroy() {
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
