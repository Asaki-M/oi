<script setup lang="ts">
import type { SearchItem } from '../utils/chrome-api'
import ContextMenu from './ContextMenu.vue'
import { useResultsList } from '../composables/useResultsList'

interface Props {
  items: SearchItem[]
  selectedIndex: number
  isLoading: boolean
  error: string
  searchQuery?: string
}

interface Emits {
  (e: 'select', item: SearchItem): void
  (e: 'retry'): void
  (e: 'context-action', action: 'navigate' | 'close' | 'remove', item: SearchItem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 使用通用的结果列表逻辑
const {
  contextMenu,
  getHighlightedText,
  handleItemClick,
  handleContextMenu,
  closeContextMenu,
  handleContextAction,
  handleRetry,
  handleImageError,
  getItemClasses,
  fallbackIcon
} = useResultsList(props, emit)
</script>

<template>
  <div class="flex-1 overflow-hidden relative">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex items-center justify-center h-full">
      <div class="flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div class="text-sm text-gray-500">加载中...</div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="flex items-center justify-center h-full">
      <div class="flex flex-col items-center gap-3 text-center">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="text-sm text-gray-700">{{ error }}</div>
        <button
          @click="handleRetry"
          class="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          重试
        </button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="items.length === 0" class="flex items-center justify-center h-full">
      <div class="flex flex-col items-center gap-3 text-center">
        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V3a1 1 0 00-1-1H10a1 1 0 00-1 1v3.306" />
          </svg>
        </div>
        <div class="text-sm text-gray-500">没有找到匹配的结果</div>
      </div>
    </div>

    <!-- 结果列表 -->
    <div v-else class="px-2 overflow-y-auto h-full scrollbar-thin">
      <div
        v-for="(item, index) in items"
        :key="`${item.type}-${item.id}`"
        :data-item-index="index"
        @click="handleItemClick(item)"
        @contextmenu="handleContextMenu($event, item)"
        :class="getItemClasses(item, index, selectedIndex)"
      >
        <!-- 类型图标 -->
        <div class="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center">
          <!-- Tab图标 -->
          <svg v-if="item.type === 'tab'" class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <!-- 收藏图标 -->
          <svg v-else-if="item.type === 'bookmark'" class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </div>

        <!-- 网站图标 -->
        <div class="w-4 h-4 mr-3 flex-shrink-0">
          <img
            :src="item.favicon || fallbackIcon"
            :alt="item.title"
            class="w-full h-full object-contain rounded-sm"
            @error="handleImageError"
          />
        </div>

        <div class="flex-1 min-w-0">
          <div
            class="text-sm font-medium text-gray-900 truncate mb-1"
            :class="{ 'line-through': item.isDeleted }"
            v-html="getHighlightedText(item.title)"
          ></div>
          <div
            v-if="item.url"
            class="text-xs text-gray-400 truncate"
            :class="{ 'line-through': item.isDeleted }"
            v-html="getHighlightedText(item.url)"
          ></div>
        </div>

        <div v-if="item.isDeleted" class="ml-2 text-red-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <ContextMenu
      :visible="contextMenu.visible"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :item="contextMenu.item"
      :use-simple-mode="true"
      @close="closeContextMenu"
      @action="handleContextAction"
    />
  </div>
</template>
