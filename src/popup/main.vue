<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Search from '../components/Search.vue'
import CategorySidebar from '../components/CategorySidebar.vue'
import ResultsList from '../components/ResultsList.vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import { dataService } from '../services/dataService'
import { useCategories, type CategoryType } from '../composables/useCategories'
import { useSearch } from '../composables/useSearch'
import { initGlobalTheme, cleanupGlobalTheme } from '../composables/useTheme'
import type { SearchItem, TabItem, BookmarkItem } from '../utils/chrome-api'

// 组件引用
const searchRef = ref<InstanceType<typeof Search>>()

// 状态
const selectedIndex = ref(-1)
const activeCategory = ref<CategoryType>('all')
const searchQuery = ref('')

// 数据状态
const dataState = ref(dataService.getState())

// 分类配置
const categories = useCategories(
  computed(() => dataState.value.tabs),
  computed(() => dataState.value.bookmarks)
)

// 排序标签页：活动标签页 > 当前窗口标签页 > 其他标签页
const sortTabs = (tabs: TabItem[], currentWindowId?: number): TabItem[] => {
  const activeTabs = tabs.filter(tab => tab.active)
  const currentWindowTabs = currentWindowId
    ? tabs.filter(tab => !tab.active && tab.windowId === currentWindowId)
    : []
  const otherTabs = currentWindowId
    ? tabs.filter(tab => !tab.active && tab.windowId !== currentWindowId)
    : tabs.filter(tab => !tab.active)

  return [...activeTabs, ...currentWindowTabs, ...otherTabs]
}

// 排序收藏夹：按添加时间倒序
const sortBookmarks = (bookmarks: BookmarkItem[]): BookmarkItem[] => {
  return [...bookmarks].sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0))
}

// 当前分类的项目
const categoryItems = computed(() => {
  const { tabs, bookmarks, currentWindowId } = dataState.value
  const category = activeCategory.value

  switch (category) {
    case 'tabs':
      return sortTabs(tabs, currentWindowId)

    case 'bookmarks':
      return sortBookmarks(bookmarks)

    case 'all':
    default:
      return [
        ...sortTabs(tabs, currentWindowId),
        ...sortBookmarks(bookmarks)
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
const handleItemSelect = async (item: SearchItem) => {
  try {
    await dataService.handleItemClick(item)

    // 检测是否在 iframe 中
    if (window !== window.parent) {
      // 在 iframe 中，通知父页面关闭
      window.parent.postMessage({ type: 'omni-close' }, '*')
    } else {
      // 在 popup 中，直接关闭窗口
      window.close()
    }
  } catch (err) {
    console.error('操作失败:', err)
    // 不关闭窗口，让用户看到错误
  }
}

// 处理右键菜单操作
const handleContextAction = async (action: 'navigate' | 'close' | 'remove', item: SearchItem) => {
  try {
    switch (action) {
      case 'navigate':
        await dataService.handleItemClick(item)
        window.close()
        break
      case 'close':
        if (item.type === 'tab') {
          await dataService.handleTabClose(item.id as number)
        }
        break
      case 'remove':
        if (item.type === 'bookmark') {
          await dataService.handleBookmarkRemove(item.id as string)
        }
        break
    }
  } catch (err) {
    console.error('操作失败:', err)
    // 不关闭窗口，让用户看到错误
  }
}

// 处理重试
const handleRetry = () => {
  dataService.loadData()
}

// 键盘导航
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Tab':
      event.preventDefault()
      // 循环切换分类
      const currentIndex = categories.value.findIndex(cat => cat.key === activeCategory.value)
      const nextIndex = (currentIndex + 1) % categories.value.length
      handleCategoryChange(categories.value[nextIndex].key)
      break
    case 'Escape':
      // 检测是否在 iframe 中
      if (window !== window.parent) {
        // 在 iframe 中，通知父页面关闭
        window.parent.postMessage({ type: 'omni-close' }, '*')
      } else {
        // 在 popup 中，直接关闭窗口
        window.close()
      }
      break
  }
}

// 生命周期
let unsubscribe: (() => void) | null = null

onMounted(async () => {
  // 初始化主题系统
  await initGlobalTheme()

  // 订阅数据状态变化
  unsubscribe = dataService.subscribe((state) => {
    dataState.value = state
  })

  // 加载数据
  await dataService.loadData()

  // 聚焦搜索框
  searchRef.value?.focus()
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }

  // 清理主题系统
  cleanupGlobalTheme()
})
</script>

<template>
  <div class="w-full h-full flex flex-col" style="background-color: rgb(var(--color-background)); color: rgb(var(--color-text-primary));">
    <!-- 头部搜索区域 -->
    <Search
      ref="searchRef"
      :items="categoryItems"
      :selected-index="selectedIndex"
      :placeholder="searchPlaceholder"
      @update:selected-index="selectedIndex = $event"
      @search="handleSearch"
      @select="handleItemSelect"
      @keydown="handleKeydown"
    >
      <template #actions>
        <ThemeToggle size="sm" />
      </template>
    </Search>

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
        <ResultsList
          :items="filteredResults"
          :selected-index="selectedIndex"
          :is-loading="dataState.isLoading"
          :error="dataState.error"
          :search-query="searchQuery"
          @select="handleItemSelect"
          @retry="handleRetry"
          @context-action="handleContextAction"
        />
      </div>
    </div>

    <!-- 底部提示 -->
    <div class="flex items-center justify-center gap-4 py-3 px-4 border-t" style="background-color: rgb(var(--color-background-secondary)); border-color: rgb(var(--color-border-primary));">
      <div class="flex items-center gap-1 text-xs" style="color: rgb(var(--color-text-tertiary));">
        <kbd class="px-1.5 py-0.5 rounded text-xs font-mono" style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border-secondary)); color: rgb(var(--color-text-secondary)); box-shadow: var(--shadow-sm);">↑↓</kbd>
        导航
      </div>
      <div class="flex items-center gap-1 text-xs" style="color: rgb(var(--color-text-tertiary));">
        <kbd class="px-1.5 py-0.5 rounded text-xs font-mono" style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border-secondary)); color: rgb(var(--color-text-secondary)); box-shadow: var(--shadow-sm);">Enter</kbd>
        打开
      </div>
      <div class="flex items-center gap-1 text-xs" style="color: rgb(var(--color-text-tertiary));">
        <kbd class="px-1.5 py-0.5 rounded text-xs font-mono" style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border-secondary)); color: rgb(var(--color-text-secondary)); box-shadow: var(--shadow-sm);">Esc</kbd>
        关闭
      </div>
      <div class="flex items-center gap-1 text-xs" style="color: rgb(var(--color-text-tertiary));">
        <kbd class="px-1.5 py-0.5 rounded text-xs font-mono" style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border-secondary)); color: rgb(var(--color-text-secondary)); box-shadow: var(--shadow-sm);">Tab</kbd>
        切换分类
      </div>
    </div>
  </div>
</template>
