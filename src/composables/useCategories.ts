import { computed } from 'vue'

export type CategoryType = 'all' | 'tabs' | 'bookmarks'

export interface Category {
  key: CategoryType
  name: string
  icon: string
  count: number
}

// 分类图标配置
const CATEGORY_ICONS = {
  all: 'M4 6h16M4 12h16M4 18h16',
  tabs: 'M8 2v3m8-3v3m-9 8h10l2-7H5l2 7z',
  bookmarks: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'
} as const

// 分类名称配置
const CATEGORY_NAMES = {
  all: '全部',
  tabs: '标签页',
  bookmarks: '收藏夹'
} as const

/**
 * 通用的分类配置composable
 * @param tabs 标签页数据
 * @param bookmarks 书签数据
 * @returns 分类配置数组
 */
export function useCategories(
  tabs: { value: any[] } | any[],
  bookmarks: { value: any[] } | any[]
) {
  return computed((): Category[] => {
    // 处理响应式和非响应式数据
    const tabsArray = Array.isArray(tabs) ? tabs : tabs.value
    const bookmarksArray = Array.isArray(bookmarks) ? bookmarks : bookmarks.value
    
    const counts = {
      all: tabsArray.length + bookmarksArray.length,
      tabs: tabsArray.length,
      bookmarks: bookmarksArray.length
    }

    return [
      {
        key: 'all' as CategoryType,
        name: CATEGORY_NAMES.all,
        icon: CATEGORY_ICONS.all,
        count: counts.all
      },
      {
        key: 'tabs' as CategoryType,
        name: CATEGORY_NAMES.tabs,
        icon: CATEGORY_ICONS.tabs,
        count: counts.tabs
      },
      {
        key: 'bookmarks' as CategoryType,
        name: CATEGORY_NAMES.bookmarks,
        icon: CATEGORY_ICONS.bookmarks,
        count: counts.bookmarks
      }
    ]
  })
}
