import { ref, watch, nextTick } from 'vue'
import type { SearchItem, TabItem } from '../utils/chrome-api'
import { smartHighlight } from '../utils/highlight'

export interface UseResultsListProps {
  items: SearchItem[]
  selectedIndex: number
  isLoading: boolean
  error: string
  searchQuery?: string
}

export interface UseResultsListEmits {
  (e: 'select', item: SearchItem): void
  (e: 'retry'): void
  (e: 'context-action', action: 'navigate' | 'close' | 'remove', item: SearchItem): void
}

export function useResultsList(
  props: UseResultsListProps,
  emit: UseResultsListEmits
) {
  // 右键菜单状态
  const contextMenu = ref({
    visible: false,
    x: 0,
    y: 0,
    item: null as SearchItem | null
  })

  // 高亮文本的计算函数
  const getHighlightedText = (text: string) => {
    if (!props.searchQuery) {
      return text
    }
    const result = smartHighlight(text, props.searchQuery)
    return result.html
  }

  // 处理项目点击
  const handleItemClick = (item: SearchItem) => {
    if (item.isDeleted) return
    emit('select', item)
  }

  // 处理右键点击
  const handleContextMenu = (event: MouseEvent, item: SearchItem) => {
    if (item.isDeleted) return

    event.preventDefault()
    contextMenu.value = {
      visible: true,
      x: event.clientX,
      y: event.clientY,
      item
    }
  }

  // 关闭右键菜单
  const closeContextMenu = () => {
    contextMenu.value = { visible: false, x: 0, y: 0, item: null }
  }

  // 处理右键菜单操作
  const handleContextAction = (action: 'navigate' | 'close' | 'remove', item: SearchItem) => {
    emit('context-action', action, item)
  }

  // 处理重试
  const handleRetry = () => {
    emit('retry')
  }

  // 处理图片加载错误
  const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
    if (target) {
      // 避免无限循环
      if (target.src === fallbackIcon) {
        return
      }

      // 首先尝试使用扩展的logo
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
        const extensionLogoUrl = chrome.runtime.getURL('public/logo.png')
        if (target.src !== extensionLogoUrl) {
          target.src = extensionLogoUrl
          return
        }
      }

      // 如果扩展logo也失败，使用兜底SVG
      target.src = fallbackIcon
    }
  }

  // 滚动到选中项
  const scrollToSelectedItem = async () => {
    if (props.selectedIndex < 0) return

    await nextTick()

    // 通过CSS选择器找到选中的元素
    const selectedElement = document.querySelector(`[data-item-index="${props.selectedIndex}"]`) as HTMLElement
    if (!selectedElement) return

    // 使用 scrollIntoView API 滚动到视口中间
    selectedElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    })
  }

  // 监听选中索引变化，自动滚动到选中项
  watch(() => props.selectedIndex, () => {
    scrollToSelectedItem()
  })

  // 计算项目样式类
  const getItemClasses = (item: SearchItem, index: number, selectedIndex: number) => {
    const isActive = item.type === 'tab' && (item as TabItem).active
    const isSelected = index === selectedIndex && !item.isDeleted

    return [
      'flex items-center p-3 my-0.5 rounded-lg transition-all duration-150 border border-transparent',
      {
        'opacity-50 cursor-not-allowed bg-gray-50': item.isDeleted,
        'cursor-pointer hover:bg-slate-50 hover:border-slate-200': !item.isDeleted,
        'bg-blue-50 border-blue-500': isSelected,
        'bg-sky-50 border-sky-400': isActive && !item.isDeleted
      }
    ]
  }

  // 计算标签样式和文本
  const getTagInfo = (item: SearchItem) => {
    const isActive = item.type === 'tab' && (item as TabItem).active

    if (item.isDeleted) {
      return {
        classes: 'bg-gray-100 text-gray-400',
        text: item.type === 'tab' ? '已关闭' : '已删除'
      }
    }

    if (item.type === 'tab') {
      return {
        classes: isActive
          ? 'bg-sky-100 text-sky-800'
          : 'bg-blue-100 text-blue-800',
        text: isActive ? '当前页' : '标签页'
      }
    }

    return {
      classes: 'bg-amber-100 text-amber-800',
      text: '收藏'
    }
  }

  // 回退图标
  const fallbackIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='

  return {
    contextMenu,
    getHighlightedText,
    handleItemClick,
    handleContextMenu,
    closeContextMenu,
    handleContextAction,
    handleRetry,
    handleImageError,
    scrollToSelectedItem,
    getItemClasses,
    getTagInfo,
    fallbackIcon
  }
}
