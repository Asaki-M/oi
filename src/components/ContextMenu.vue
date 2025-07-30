<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { SearchItem } from '../utils/chrome-api'
import MenuIcon from './MenuIcon.vue'

interface Props {
  item: SearchItem | null
  x: number
  y: number
  visible: boolean
  teleportTo?: string
  useSimpleMode?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'action', action: 'navigate' | 'close' | 'remove', item: SearchItem): void
}

const props = withDefaults(defineProps<Props>(), {
  teleportTo: 'body',
  useSimpleMode: false
})
const emit = defineEmits<Emits>()

const menuRef = ref<HTMLElement>()

// 检查teleport目标是否存在
const teleportTarget = computed(() => {
  if (typeof document === 'undefined') return 'body'

  const target = document.querySelector(props.teleportTo)
  return target ? props.teleportTo : 'body'
})

// 菜单选项配置
const MENU_CONFIG = {
  navigate: { label: '跳转', icon: 'navigate', color: 'text-blue-600' },
  close: { label: '关闭', icon: 'close', color: 'text-red-600' },
  remove: { label: '取消收藏', icon: 'remove', color: 'text-red-600' }
} as const

// 菜单选项
const menuOptions = computed(() => {
  if (!props.item) return []

  const baseOption = { key: 'navigate', ...MENU_CONFIG.navigate }
  const actionOption = props.item.type === 'tab'
    ? { key: 'close', ...MENU_CONFIG.close }
    : { key: 'remove', ...MENU_CONFIG.remove }

  return [baseOption, actionOption]
})

// 处理菜单项点击
const handleMenuClick = (action: 'navigate' | 'close' | 'remove') => {
  if (props.item) {
    emit('action', action, props.item)
  }
  emit('close')
}

// 处理外部事件关闭菜单
const handleOutsideEvent = (event: Event) => {
  if (event.type === 'click') {
    const mouseEvent = event as MouseEvent
    if (menuRef.value && !menuRef.value.contains(mouseEvent.target as Node)) {
      emit('close')
    }
  } else if (event.type === 'keydown') {
    const keyEvent = event as KeyboardEvent
    if (keyEvent.key === 'Escape') {
      emit('close')
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideEvent)
  document.addEventListener('keydown', handleOutsideEvent)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideEvent)
  document.removeEventListener('keydown', handleOutsideEvent)
})
</script>

<template>
  <!-- 简单模式：直接渲染，用于content script -->
  <div
    v-if="useSimpleMode && visible && item"
    ref="menuRef"
    :style="{ left: `${x}px`, top: `${y}px` }"
    class="oi-simple-context-menu"
  >
    <div
      v-for="option in menuOptions"
      :key="option.key"
      @click="handleMenuClick(option.key as 'navigate' | 'close' | 'remove')"
      class="oi-simple-context-menu-item"
    >
      <div :class="`oi-simple-context-menu-icon ${option.key}`">
        <MenuIcon :type="option.icon" />
      </div>
      <span>{{ option.label }}</span>
    </div>
  </div>

  <!-- 标准模式：使用Teleport，用于popup -->
  <Teleport v-else :to="teleportTarget">
    <div
      v-if="visible && item"
      ref="menuRef"
      :style="{ left: `${x}px`, top: `${y}px` }"
      class="fixed z-50 rounded-xl py-2 min-w-[140px] backdrop-blur-sm"
      style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border-primary)); box-shadow: var(--shadow-xl);"
    >
      <div
        v-for="option in menuOptions"
        :key="option.key"
        @click="handleMenuClick(option.key as 'navigate' | 'close' | 'remove')"
        class="flex items-center px-4 py-2.5 text-sm cursor-pointer transition-all duration-200 group"
        style="color: rgb(var(--color-text-secondary));"
      >
        <div class="mr-3 flex-shrink-0" :class="option.color">
          <MenuIcon :type="option.icon" />
        </div>
        <span class="font-medium">{{ option.label }}</span>
      </div>
    </div>
  </Teleport>
</template>
