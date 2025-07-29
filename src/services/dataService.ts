import {
  getAllTabs,
  getAllBookmarks,
  switchToTab,
  openNewTab,
  closeTab,
  removeBookmark,
  hasChromeAPI,
  type SearchItem,
  type TabItem,
  type BookmarkItem
} from '../utils/chrome-api'

export type CategoryType = 'all' | 'tabs' | 'bookmarks'

export interface DataState {
  tabs: TabItem[]
  bookmarks: BookmarkItem[]
  isLoading: boolean
  error: string
  currentWindowId?: number
}

export class DataService {
  private state: DataState = {
    tabs: [],
    bookmarks: [],
    isLoading: false,
    error: '',
    currentWindowId: undefined
  }

  private listeners: Array<(state: DataState) => void> = []

  // 订阅状态变化
  subscribe(listener: (state: DataState) => void) {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // 通知状态变化
  private notify() {
    this.listeners.forEach(listener => listener({ ...this.state }))
  }

  // 更新状态
  private updateState(updates: Partial<DataState>) {
    this.state = { ...this.state, ...updates }
    this.notify()
  }

  // 获取当前状态
  getState(): DataState {
    return { ...this.state }
  }

  // 加载数据
  async loadData(): Promise<void> {
    if (!hasChromeAPI()) {
      this.updateState({
        error: '无法访问Chrome API，请确保在浏览器扩展环境中运行',
        isLoading: false
      })
      return
    }

    try {
      this.updateState({ isLoading: true, error: '' })

      // 并行加载标签页和书签
      const [tabsData, bookmarksData] = await Promise.all([
        getAllTabs(),
        getAllBookmarks()
      ])

      // 获取当前窗口ID
      let currentWindowId: number | undefined
      if (tabsData.length > 0) {
        const activeTab = tabsData.find(tab => tab.active)
        if (activeTab) {
          currentWindowId = activeTab.windowId
        }
      }

      this.updateState({
        tabs: tabsData,
        bookmarks: bookmarksData,
        currentWindowId,
        isLoading: false,
        error: ''
      })
    } catch (err) {
      this.updateState({
        error: '加载数据失败，请刷新重试',
        isLoading: false
      })
    }
  }





  // 处理项目点击
  async handleItemClick(item: SearchItem): Promise<void> {
    if (!hasChromeAPI()) {
      throw new Error('无法访问Chrome API，请确保在浏览器扩展环境中运行')
    }

    try {
      if (item.type === 'tab') {
        await switchToTab(item.id as number)
      } else {
        await openNewTab(item.url)
      }
    } catch (err) {
      // 如果标签页切换失败，尝试打开新标签页
      if (item.type === 'tab') {
        try {
          await openNewTab(item.url)
        } catch (retryErr) {
          throw retryErr
        }
      } else {
        throw err
      }
    }
  }

  // 关闭标签页
  async handleTabClose(tabId: number): Promise<void> {
    if (!hasChromeAPI()) {
      throw new Error('无法访问Chrome API，请确保在浏览器扩展环境中运行')
    }

    try {
      // 先标记为已删除状态
      this.markTabAsDeleted(tabId)

      // 后台执行关闭操作
      await closeTab(tabId)
    } catch (err) {
      // 如果关闭失败，恢复状态
      this.unmarkTabAsDeleted(tabId)
      throw err
    }
  }

  // 删除书签
  async handleBookmarkRemove(bookmarkId: string): Promise<void> {
    if (!hasChromeAPI()) {
      throw new Error('无法访问Chrome API，请确保在浏览器扩展环境中运行')
    }

    try {
      // 先标记为已删除状态
      this.markBookmarkAsDeleted(bookmarkId)

      // 后台执行删除操作
      await removeBookmark(bookmarkId)
    } catch (err) {
      // 如果删除失败，恢复状态
      this.unmarkBookmarkAsDeleted(bookmarkId)
      throw err
    }
  }

  // 标记标签页为已删除
  private markTabAsDeleted(tabId: number): void {
    const currentState = this.getState()
    const updatedTabs = currentState.tabs.map(tab =>
      tab.id === tabId ? { ...tab, isDeleted: true } : tab
    )
    this.updateState({ tabs: updatedTabs })
  }

  // 取消标记标签页为已删除
  private unmarkTabAsDeleted(tabId: number): void {
    const currentState = this.getState()
    const updatedTabs = currentState.tabs.map(tab =>
      tab.id === tabId ? { ...tab, isDeleted: false } : tab
    )
    this.updateState({ tabs: updatedTabs })
  }

  // 标记书签为已删除
  private markBookmarkAsDeleted(bookmarkId: string): void {
    const currentState = this.getState()
    const updatedBookmarks = currentState.bookmarks.map(bookmark =>
      bookmark.id === bookmarkId ? { ...bookmark, isDeleted: true } : bookmark
    )
    this.updateState({ bookmarks: updatedBookmarks })
  }

  // 取消标记书签为已删除
  private unmarkBookmarkAsDeleted(bookmarkId: string): void {
    const currentState = this.getState()
    const updatedBookmarks = currentState.bookmarks.map(bookmark =>
      bookmark.id === bookmarkId ? { ...bookmark, isDeleted: false } : bookmark
    )
    this.updateState({ bookmarks: updatedBookmarks })
  }
}

// 创建单例实例
export const dataService = new DataService()
