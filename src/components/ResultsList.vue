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
  variant?: 'popup' | 'content'
}

interface Emits {
  (e: 'select', item: SearchItem): void
  (e: 'retry'): void
  (e: 'context-action', action: 'navigate' | 'close' | 'remove', item: SearchItem): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'popup'
})
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
  <div
    :class="variant === 'content' ? 'flex-1 overflow-hidden relative' : 'flex-1 overflow-y-auto py-2 scrollbar-thin'"
    :style="variant === 'popup' ? 'background-color: rgb(var(--color-background));' : ''"
  >
    <!-- 加载状态 -->
    <div
      v-if="isLoading"
      :class="variant === 'content' ? 'flex items-center justify-center h-full' : 'flex flex-col items-center justify-center py-12 px-6 text-center'"
    >
      <div
        v-if="variant === 'content'"
        class="flex flex-col items-center gap-3"
      >
        <div class="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style="border-color: rgb(var(--color-primary)); border-top-color: transparent;"></div>
        <div class="text-sm" style="color: rgb(var(--color-text-tertiary));">加载中...</div>
      </div>
      <div v-else>
        <div class="text-blue-500 mb-4 animate-spin">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
        </div>
        <p class="text-sm m-0" style="color: rgb(var(--color-text-tertiary));">正在加载数据...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div
      v-else-if="error"
      :class="variant === 'content' ? 'flex items-center justify-center h-full' : 'flex flex-col items-center justify-center py-12 px-6 text-center'"
    >
      <div
        v-if="variant === 'content'"
        class="flex flex-col items-center gap-3 text-center"
      >
        <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background-color: rgb(var(--color-error) / 0.1);">
          <svg class="w-6 h-6" style="color: rgb(var(--color-error));" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="text-sm" style="color: rgb(var(--color-text-secondary));">{{ error }}</div>
        <button
          @click="handleRetry"
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          style="background-color: rgb(var(--color-primary)); color: rgb(var(--color-text-inverse));"
        >
          重试
        </button>
      </div>
      <div v-else>
        <div class="text-red-500 mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <p class="text-base font-medium m-0 mb-2" style="color: rgb(var(--color-text-secondary));">{{ error }}</p>
        <button
          @click="handleRetry"
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          style="background-color: rgb(var(--color-primary)); color: rgb(var(--color-text-inverse));"
        >
          重试
        </button>
      </div>
    </div>

    <!-- 空状态 -->
    <div
      v-else-if="items.length === 0"
      :class="variant === 'content' ? 'flex items-center justify-center h-full' : 'flex flex-col items-center justify-center py-12 px-6 text-center'"
    >
      <div
        v-if="variant === 'content'"
        class="flex flex-col items-center gap-3 text-center"
      >
        <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background-color: rgb(var(--color-background-tertiary));">
          <svg class="w-6 h-6" style="color: rgb(var(--color-text-quaternary));" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V3a1 1 0 00-1-1H10a1 1 0 00-1 1v3.306" />
          </svg>
        </div>
        <div class="text-sm" style="color: rgb(var(--color-text-tertiary));">没有找到匹配的结果</div>
      </div>
      <div v-else>
        <div class="text-gray-300 mb-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
        <p class="text-base font-medium m-0 mb-2" style="color: rgb(var(--color-text-secondary));">暂无数据</p>
        <p class="text-sm m-0" style="color: rgb(var(--color-text-tertiary));">请检查浏览器权限设置</p>
      </div>
    </div>

    <!-- 结果列表 -->
    <div
      v-else
      :class="variant === 'content' ? 'px-2 overflow-y-auto h-full scrollbar-thin' : 'px-2'"
    >
      <div
        v-for="(item, index) in items"
        :key="`${item.type}-${item.id}`"
        :data-item-index="index"
        @click="handleItemClick(item)"
        @contextmenu="handleContextMenu($event, item)"
        :class="getItemClasses(item, index, selectedIndex).class"
        :style="getItemClasses(item, index, selectedIndex).style"
      >
        <!-- Content variant: 类型图标 + 网站图标 -->
        <template v-if="variant === 'content'">
          <!-- 类型图标 -->
          <div class="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center">
            <!-- Tab图标 -->
            <svg v-if="item.type === 'tab'" class="w-4 h-4" style="color: rgb(var(--color-primary));" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <!-- 收藏图标 -->
            <svg v-else-if="item.type === 'bookmark'" class="w-4 h-4" style="color: rgb(var(--color-amber));" fill="currentColor" viewBox="0 0 24 24">
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

          <div class="flex-1 min-w-0 mr-3">
            <div class="flex items-center gap-2">
              <!-- 标题 -->
              <div
                class="text-sm font-medium truncate flex-1"
                :class="{ 'line-through': item.isDeleted }"
                :style="{ color: item.isDeleted ? 'rgb(var(--color-text-quaternary))' : 'rgb(var(--color-text-primary))' }"
                v-html="getHighlightedText(item.title)"
              ></div>

              <!-- 类型标签 -->
              <div
                :class="getTagInfo(item).classes + ' flex-shrink-0'"
                :style="getTagInfo(item).style"
              >
                {{ getTagInfo(item).text }}
              </div>
            </div>

            <!-- URL在第二行 -->
            <div
              v-if="item.url"
              class="text-xs truncate mt-0.5"
              :class="{ 'line-through': item.isDeleted }"
              :style="{ color: item.isDeleted ? 'rgb(var(--color-text-quaternary) / 0.7)' : 'rgb(var(--color-text-quaternary))' }"
              v-html="getHighlightedText(item.url)"
            ></div>
          </div>

          <div v-if="item.isDeleted" class="flex-shrink-0" style="color: rgb(var(--color-error));">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </template>

        <!-- Popup variant: 只有网站图标 -->
        <template v-else>
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
            <div
              class="text-sm font-medium mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis"
              :class="{ 'line-through': item.isDeleted }"
              :style="{ color: item.isDeleted ? 'rgb(var(--color-text-quaternary))' : 'rgb(var(--color-text-primary))' }"
            >
              <span v-html="getHighlightedText(item.title)"></span>
            </div>
            <div
              class="text-xs whitespace-nowrap overflow-hidden text-ellipsis"
              :class="{ 'line-through': item.isDeleted }"
              :style="{ color: item.isDeleted ? 'rgb(var(--color-text-quaternary) / 0.7)' : 'rgb(var(--color-text-tertiary))' }"
            >
              <span v-html="getHighlightedText(item.url)"></span>
            </div>
          </div>
          <div
            :class="getTagInfo(item).classes"
            :style="getTagInfo(item).style"
          >
            {{ getTagInfo(item).text }}
          </div>
        </template>
      </div>
    </div>

    <!-- 右键菜单 -->
    <ContextMenu
      :visible="contextMenu.visible"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :item="contextMenu.item"
      :teleport-to="contextMenuTeleportTo"
      :use-simple-mode="variant === 'content'"
      @close="closeContextMenu"
      @action="handleContextAction"
    />
  </div>
</template>
