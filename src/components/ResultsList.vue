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
  contextMenuTeleportTo?: string
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
  getTagInfo,
  fallbackIcon
} = useResultsList(props, emit)
</script>

<template>
  <div class="flex-1 overflow-y-auto py-2 bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div class="text-blue-500 mb-4 animate-spin">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
      </div>
      <p class="text-sm text-gray-500 m-0">正在加载数据...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div class="text-red-500 mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <p class="text-base font-medium text-gray-700 m-0 mb-2">{{ error }}</p>
      <button
        @click="handleRetry"
        class="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        重试
      </button>
    </div>

    <!-- 无结果状态 -->
    <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div class="text-gray-300 mb-4">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </div>
      <p class="text-base font-medium text-gray-700 m-0 mb-2">暂无数据</p>
      <p class="text-sm text-gray-500 m-0">请检查浏览器权限设置</p>
    </div>

    <!-- 结果列表 -->
    <div v-else class="px-2">
      <div
        v-for="(item, index) in items"
        :key="`${item.type}-${item.id}`"
        :data-item-index="index"
        @click="handleItemClick(item)"
        @contextmenu="handleContextMenu($event, item)"
        :class="getItemClasses(item, index, selectedIndex)"
      >
        <div class="w-5 h-5 mr-3 flex-shrink-0">
          <img
            :src="item.favicon || fallbackIcon"
            :alt="item.title"
            @error="handleImageError"
            class="w-full h-full rounded object-cover"
            loading="lazy"
          />
        </div>
        <div class="flex-1 min-w-0">
          <div :class="[
            'text-sm font-medium mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis',
            item.isDeleted ? 'text-gray-400 line-through' : 'text-gray-900'
          ]">
            <span v-html="getHighlightedText(item.title)"></span>
          </div>
          <div :class="[
            'text-xs whitespace-nowrap overflow-hidden text-ellipsis',
            item.isDeleted ? 'text-gray-300 line-through' : 'text-gray-500'
          ]">
            <span v-html="getHighlightedText(item.url)"></span>
          </div>
        </div>
        <div :class="`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${getTagInfo(item).classes}`">
          {{ getTagInfo(item).text }}
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <ContextMenu
      :visible="contextMenu.visible"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :item="contextMenu.item"
      :teleport-to="contextMenuTeleportTo"
      @close="closeContextMenu"
      @action="handleContextAction"
    />
  </div>
</template>
