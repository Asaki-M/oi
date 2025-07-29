// Chrome API 工具函数

export interface TabItem {
  id: number
  title: string
  url: string
  favicon: string
  type: 'tab'
  active?: boolean
  windowId?: number
  isDeleted?: boolean
}

export interface BookmarkItem {
  id: string
  title: string
  url: string
  favicon: string
  type: 'bookmark'
  parentId?: string
  dateAdded?: number
  isDeleted?: boolean
}

export type SearchItem = TabItem | BookmarkItem

/**
 * 获取所有打开的标签页
 */
export async function getAllTabs(): Promise<TabItem[]> {
  try {
    const tabs = await chrome.tabs.query({})
    return tabs
      .filter(tab => tab.url && tab.title && !tab.url.startsWith('chrome://'))
      .map(tab => ({
        id: tab.id!,
        title: tab.title!,
        url: tab.url!,
        favicon: tab.favIconUrl || getDefaultFavicon(tab.url!),
        type: 'tab' as const,
        active: tab.active,
        windowId: tab.windowId
      }))
  } catch (error) {
    console.error('获取标签页失败:', error)
    return []
  }
}

/**
 * 递归获取所有书签
 */
export async function getAllBookmarks(): Promise<BookmarkItem[]> {
  try {
    const bookmarkTree = await chrome.bookmarks.getTree()
    const bookmarks: BookmarkItem[] = []
    
    function traverseBookmarks(nodes: chrome.bookmarks.BookmarkTreeNode[]) {
      for (const node of nodes) {
        if (node.url) {
          // 这是一个书签
          bookmarks.push({
            id: node.id,
            title: node.title,
            url: node.url,
            favicon: getDefaultFavicon(node.url),
            type: 'bookmark' as const,
            parentId: node.parentId,
            dateAdded: node.dateAdded
          })
        } else if (node.children) {
          // 这是一个文件夹，递归遍历
          traverseBookmarks(node.children)
        }
      }
    }
    
    traverseBookmarks(bookmarkTree)
    return bookmarks
  } catch (error) {
    console.error('获取书签失败:', error)
    return []
  }
}



/**
 * 切换到指定标签页
 */
export async function switchToTab(tabId: number): Promise<void> {
  try {
    // 首先检查标签页是否存在
    const tab = await chrome.tabs.get(tabId)

    if (!tab) {
      throw new Error(`标签页 ${tabId} 不存在`)
    }

    // 如果标签页在不同窗口，先切换窗口
    if (tab.windowId) {
      await chrome.windows.update(tab.windowId, { focused: true })
    }

    // 激活标签页
    await chrome.tabs.update(tabId, { active: true })
  } catch (error) {
    throw error
  }
}

/**
 * 打开新标签页
 */
export async function openNewTab(url: string): Promise<void> {
  try {
    await chrome.tabs.create({ url, active: true })
  } catch (error) {
    console.error('打开新标签页失败:', error)
    throw error
  }
}

/**
 * 关闭标签页
 */
export async function closeTab(tabId: number): Promise<void> {
  try {
    await chrome.tabs.remove(tabId)
  } catch (error) {
    console.error('关闭标签页失败:', error)
    throw error
  }
}

/**
 * 删除书签
 */
export async function removeBookmark(bookmarkId: string): Promise<void> {
  try {
    await chrome.bookmarks.remove(bookmarkId)
  } catch (error) {
    console.error('删除书签失败:', error)
    throw error
  }
}

/**
 * 获取默认favicon
 */
function getDefaultFavicon(url: string): string {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
  } catch {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiByeD0iMiIgZmlsbD0iIzM3NDE1MSIvPgo8cGF0aCBkPSJNNCA2SDEyVjEwSDRWNloiIGZpbGw9IiM5Q0E0QUYiLz4KPC9zdmc+'
  }
}



/**
 * 检查是否有Chrome API权限
 */
export function hasChromeAPI(): boolean {
  return typeof chrome !== 'undefined' && 
         chrome.tabs !== undefined && 
         chrome.bookmarks !== undefined
}
