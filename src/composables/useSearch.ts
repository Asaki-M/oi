import { computed } from 'vue'
import type { SearchItem } from '../utils/chrome-api'
import type { CategoryType } from './useCategories'

// 搜索配置
const SEARCH_CONFIG = {
  maxResultsWithoutQuery: 50,
  maxResultsWithQuery: 20
} as const

/**
 * 通用的搜索过滤逻辑
 * @param items 所有搜索项
 * @param query 搜索查询
 * @param category 当前分类
 * @returns 过滤后的搜索结果
 */
export function useSearch(
  items: { value: SearchItem[] } | SearchItem[],
  query: { value: string } | string,
  category: { value: CategoryType } | CategoryType
) {
  return computed(() => {
    // 处理响应式和非响应式数据
    const itemsArray = Array.isArray(items) ? items : items.value
    const queryString = typeof query === 'string' ? query : query.value
    const categoryType = typeof category === 'string' ? category : category.value

    // 首先按分类过滤
    let filteredItems = itemsArray
    if (categoryType !== 'all') {
      // 映射分类类型到item类型
      const itemType = categoryType === 'tabs' ? 'tab' : 'bookmark'
      filteredItems = itemsArray.filter(item => item.type === itemType)
    }

    // 然后按搜索查询过滤
    if (!queryString.trim()) {
      return filteredItems.slice(0, SEARCH_CONFIG.maxResultsWithoutQuery)
    }

    const searchQuery = queryString.toLowerCase()
    return filteredItems
      .filter(item =>
        item.title.toLowerCase().includes(searchQuery) ||
        item.url.toLowerCase().includes(searchQuery)
      )
      .slice(0, SEARCH_CONFIG.maxResultsWithQuery)
  })
}

/**
 * 简单的搜索过滤函数（用于非响应式场景）
 * @param items 搜索项数组
 * @param query 搜索查询
 * @returns 过滤后的结果
 */
export function filterItems(items: SearchItem[], query: string): SearchItem[] {
  if (!query.trim()) {
    return items.slice(0, SEARCH_CONFIG.maxResultsWithoutQuery)
  }

  const searchQuery = query.toLowerCase()
  return items
    .filter(item =>
      item.title.toLowerCase().includes(searchQuery) ||
      item.url.toLowerCase().includes(searchQuery)
    )
    .slice(0, SEARCH_CONFIG.maxResultsWithQuery)
}
