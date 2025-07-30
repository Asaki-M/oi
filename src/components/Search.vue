<script setup lang="ts">
import { ref } from 'vue'
import type { SearchItem } from '../utils/chrome-api'

interface Props {
  items: SearchItem[]
  placeholder?: string
  selectedIndex: number
}

interface Emits {
  (e: 'update:selectedIndex', value: number): void
  (e: 'search', query: string): void
  (e: 'select', item: SearchItem): void
  (e: 'keydown', event: KeyboardEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索...'
})

const emit = defineEmits<Emits>()

const searchQuery = ref('')
const searchInput = ref<HTMLInputElement>()

// 处理搜索输入变化
const handleSearchChange = () => {
  emit('search', searchQuery.value)
  emit('update:selectedIndex', -1)
}

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  const results = props.items
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      const nextIndex = Math.min(props.selectedIndex + 1, results.length - 1)
      emit('update:selectedIndex', nextIndex)
      break
    case 'ArrowUp':
      event.preventDefault()
      const prevIndex = Math.max(props.selectedIndex - 1, -1)
      emit('update:selectedIndex', prevIndex)
      break
    case 'Enter':
      event.preventDefault()
      if (props.selectedIndex >= 0 && results[props.selectedIndex]) {
        emit('select', results[props.selectedIndex])
      }
      break
    default:
      // 传递其他键盘事件给父组件
      emit('keydown', event)
      break
  }
}

// 清空搜索
const clearSearch = () => {
  searchQuery.value = ''
  handleSearchChange()
  searchInput.value?.focus()
}

// 聚焦搜索框
const focus = () => {
  searchInput.value?.focus()
}

// 暴露方法给父组件
defineExpose({
  focus,
  clearSearch
})
</script>

<template>
  <div class="p-4 border-b" style="background-color: rgb(var(--color-background)); border-color: rgb(var(--color-border-primary));">
    <div class="flex items-center gap-3">
      <div class="flex-1 relative flex items-center border-2 rounded-xl transition-all duration-200 focus-within:shadow-lg" style="background-color: rgb(var(--color-background-secondary)); border-color: rgb(var(--color-border-primary));">
        <div class="px-3 flex items-center" style="color: rgb(var(--color-text-tertiary))">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
        <input
          ref="searchInput"
          v-model="searchQuery"
          @input="handleSearchChange"
          @keydown="handleKeydown"
          type="text"
          :placeholder="placeholder"
          class="flex-1 py-3 px-2 border-none bg-transparent text-base outline-none"
          style="color: rgb(var(--color-text-primary));"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="p-2 mr-2 border-none bg-transparent cursor-pointer rounded-md flex items-center justify-center transition-all duration-200"
          style="color: rgb(var(--color-text-tertiary));"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- 右侧操作按钮插槽 -->
      <div class="flex items-center gap-2">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>


