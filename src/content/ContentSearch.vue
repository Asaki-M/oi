<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Search from '../components/Search.vue'
import CategorySidebar from '../components/CategorySidebar.vue'
import { useCategories, type CategoryType } from '../composables/useCategories'
import { useSearch } from '../composables/useSearch'
import ContentResultsList from '../components/ContentResultsList.vue'
import { contentDataService } from '../utils/content-data-service'
import type { Tab, Bookmark } from '../services/baseDataService'

interface Emits {
  (e: 'close'): void
}

const emit = defineEmits<Emits>()

// 组件引用
const searchRef = ref<InstanceType<typeof Search>>()

// 状态
const selectedIndex = ref(-1)
const activeCategory = ref<CategoryType>('all')
const searchQuery = ref('')

// 数据状态
const tabs = ref<Tab[]>([])
const bookmarks = ref<Bookmark[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// 分类配置
const categories = useCategories(tabs, bookmarks)

// 数据加载
const loadData = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await contentDataService.getData()
    tabs.value = data.tabs
    bookmarks.value = data.bookmarks
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载数据失败'
    console.error('Failed to load data:', err)
  } finally {
    loading.value = false
  }
}

// 排序函数
const sortTabs = (tabList: Tab[]): Tab[] => {
  return [...tabList].sort((a, b) => {
    if (a.active) return -1
    if (b.active) return 1
    return 0
  })
}

const sortBookmarks = (bookmarkList: Bookmark[]): Bookmark[] => {
  return [...bookmarkList].sort((a, b) => a.title.localeCompare(b.title))
}

// 扁平化书签
const flattenBookmarks = (bookmarkList: Bookmark[]): Bookmark[] => {
  const result: Bookmark[] = []

  const flatten = (items: Bookmark[]) => {
    for (const item of items) {
      if (item.url) {
        result.push(item)
      }
      if (item.children) {
        flatten(item.children)
      }
    }
  }

  flatten(bookmarkList)
  return result
}

// 当前分类的项目
const categoryItems = computed(() => {
  const category = activeCategory.value

  switch (category) {
    case 'tabs':
      return sortTabs(tabs.value).map(tab => ({
        ...tab,
        type: 'tab' as const,
        favicon: tab.favIconUrl || ''
      }))
    case 'bookmarks':
      return sortBookmarks(flattenBookmarks(bookmarks.value)).map(bookmark => ({
        ...bookmark,
        type: 'bookmark' as const,
        favicon: '',
        url: bookmark.url || ''
      }))
    case 'all':
    default:
      return [
        ...sortTabs(tabs.value).map(tab => ({
          ...tab,
          type: 'tab' as const,
          favicon: tab.favIconUrl || ''
        })),
        ...sortBookmarks(flattenBookmarks(bookmarks.value)).map(bookmark => ({
          ...bookmark,
          type: 'bookmark' as const,
          favicon: '',
          url: bookmark.url || ''
        }))
      ]
  }
})

// 过滤后的结果
const filteredResults = useSearch(categoryItems, searchQuery, { value: 'all' })

// 搜索占位符
const searchPlaceholder = computed(() => {
  const categoryName = activeCategory.value === 'all' ? '全部内容'
    : activeCategory.value === 'tabs' ? '标签页' : '收藏夹'
  return `搜索${categoryName}...`
})

// 切换分类
const handleCategoryChange = (category: CategoryType) => {
  activeCategory.value = category
  selectedIndex.value = -1
  searchRef.value?.focus()
}

// 处理搜索
const handleSearch = (query: string) => {
  searchQuery.value = query
}

// 处理项目选择
const handleItemSelect = async (item: any) => {
  try {
    if (item.type === 'tab') {
      await contentDataService.switchToTab(item.id)
    } else if (item.type === 'bookmark' && item.url) {
      await contentDataService.openNewTab(item.url)
    }
    emit('close')
  } catch (err) {
    console.error('操作失败:', err)
  }
}

// 处理右键菜单操作
const handleContextAction = async (action: 'navigate' | 'close' | 'remove', item: any) => {
  try {
    switch (action) {
      case 'navigate':
        if (item.type === 'tab') {
          await contentDataService.switchToTab(item.id)
        } else if (item.type === 'bookmark' && item.url) {
          await contentDataService.openNewTab(item.url)
        }
        emit('close')
        break
      case 'close':
        if (item.type === 'tab') {
          await contentDataService.closeTab(item.id)
          // 重新加载数据
          await loadData()
        }
        break
      case 'remove':
        if (item.type === 'bookmark') {
          await contentDataService.removeBookmark(item.id)
          // 重新加载数据
          await loadData()
        }
        break
    }
  } catch (err) {
    console.error('操作失败:', err)
  }
}

// 处理重试
const handleRetry = () => {
  loadData()
}

// 键盘导航 - 只处理容器级别的键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Tab':
      event.preventDefault()
      const currentIndex = categories.value.findIndex(cat => cat.key === activeCategory.value)
      const nextCategoryIndex = (currentIndex + 1) % categories.value.length
      handleCategoryChange(categories.value[nextCategoryIndex].key)
      break
    case 'Escape':
      emit('close')
      break
  }
}

// 处理来自Search组件的非导航键事件
const handleNonNavigationKeys = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Tab':
      event.preventDefault()
      const currentIndex = categories.value.findIndex(cat => cat.key === activeCategory.value)
      const nextCategoryIndex = (currentIndex + 1) % categories.value.length
      handleCategoryChange(categories.value[nextCategoryIndex].key)
      break
    case 'Escape':
      emit('close')
      break
    // 上下键和Enter键已经在Search组件中处理了，这里不需要重复处理
  }
}

// 处理覆盖层点击
const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

// 生命周期
onMounted(async () => {
  // 加载数据
  await loadData()

  // 聚焦搜索框
  searchRef.value?.focus()
})

onUnmounted(() => {
  // 清理工作
})
</script>

<template>
  <div
    id="omni-search-overlay"
    @click="handleOverlayClick"
    @keydown="handleKeydown"
    tabindex="-1"
  >
    <div id="omni-search-container" class="flex flex-col">
      <!-- 头部搜索区域 -->
      <Search
        ref="searchRef"
        :items="categoryItems"
        :selected-index="selectedIndex"
        :placeholder="searchPlaceholder"
        @update:selected-index="selectedIndex = $event"
        @search="handleSearch"
        @select="handleItemSelect"
        @keydown="handleNonNavigationKeys"
      />

      <!-- 主内容区域 -->
      <div class="flex-1 flex overflow-hidden">
        <!-- 左侧分类工具栏 -->
        <CategorySidebar
          :categories="categories"
          :active-category="activeCategory"
          @update:active-category="handleCategoryChange"
        />

        <!-- 右侧结果区域 -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- 结果列表 -->
          <ContentResultsList
            :items="filteredResults"
            :selected-index="selectedIndex"
            :is-loading="loading"
            :error="error || ''"
            :search-query="searchQuery"
            @select="handleItemSelect"
            @retry="handleRetry"
            @context-action="handleContextAction"
          />
        </div>
      </div>

      <!-- 底部键盘提示 -->
      <div class="flex items-center justify-center gap-4 py-3 px-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center gap-1 text-xs text-gray-500">
          <kbd class="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono text-gray-700 shadow-sm">↑↓</kbd>
          导航
        </div>
        <div class="flex items-center gap-1 text-xs text-gray-500">
          <kbd class="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono text-gray-700 shadow-sm">Enter</kbd>
          打开
        </div>
        <div class="flex items-center gap-1 text-xs text-gray-500">
          <kbd class="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono text-gray-700 shadow-sm">Esc</kbd>
          关闭
        </div>
        <div class="flex items-center gap-1 text-xs text-gray-500">
          <kbd class="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono text-gray-700 shadow-sm">Tab</kbd>
          切换分类
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 样式已在 tailwind.css 中定义 */
</style>
