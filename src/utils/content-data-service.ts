// Content script data service - communicates with background script
import { BaseDataService, type SearchData } from '../services/baseDataService'

class ContentDataService extends BaseDataService {

  async getData(): Promise<SearchData> {
    const now = Date.now()

    // 如果缓存有效，直接返回
    if (this.isCacheValid()) {
      return this.cache!
    }

    // 防止重复请求
    if (this.isLoading) {
      await this.waitForLoading()
      // 再次检查缓存
      if (this.isCacheValid()) {
        return this.cache!
      }
    }

    try {
      this.isLoading = true

      // 向background script请求数据
      const response = await chrome.runtime.sendMessage({
        action: 'get-data'
      })

      if (response && response.success) {
        this.cache = response.data
        this.cacheTime = now
        return response.data
      } else {
        throw new Error(response?.error || 'Failed to get data from background')
      }
    } catch (error) {
      console.error('Failed to get data from background:', error)
      // 如果是网络错误，返回空数据而不是抛出错误
      if (error instanceof Error && error.message.includes('Extension context invalidated')) {
        console.warn('Extension context invalidated, returning empty data')
        return { tabs: [], bookmarks: [] }
      }
      throw error
    } finally {
      this.isLoading = false
    }
  }

  async switchToTab(tabId: number): Promise<void> {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'switch-tab',
        tabId
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to switch tab')
      }
    } catch (error) {
      console.error('Failed to switch tab:', error)
      throw error
    }
  }

  async openNewTab(url: string): Promise<void> {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'open-tab',
        url
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to open tab')
      }
    } catch (error) {
      console.error('Failed to open tab:', error)
      throw error
    }
  }

  async closeTab(tabId: number): Promise<void> {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'close-tab',
        tabId
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to close tab')
      }

      // 清除缓存，因为标签页已关闭
      this.clearCache()
    } catch (error) {
      console.error('Failed to close tab:', error)
      throw error
    }
  }

  async removeBookmark(bookmarkId: string): Promise<void> {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'remove-bookmark',
        bookmarkId
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to remove bookmark')
      }

      // 清除缓存，因为书签已删除
      this.clearCache()
    } catch (error) {
      console.error('Failed to remove bookmark:', error)
      throw error
    }
  }


}

export const contentDataService = new ContentDataService()
