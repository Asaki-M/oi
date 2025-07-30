<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme'
import type { ThemeMode } from '../utils/chrome-api'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  variant?: 'button' | 'dropdown'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showLabel: false,
  variant: 'button'
})

const { themeMode, effectiveTheme, setThemeMode, toggleTheme, getThemeIcon, getThemeIconText, getThemeName } = useTheme()

// 主题选项
const themeOptions: { mode: ThemeMode; icon: string; name: string }[] = [
  { mode: 'light', icon: getThemeIconText('light'), name: '浅色' },
  { mode: 'dark', icon: getThemeIconText('dark'), name: '深色' },
  { mode: 'system', icon: getThemeIconText('system'), name: '跟随系统' }
]

// 尺寸样式
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-8 h-8 text-sm'
    case 'lg':
      return 'w-12 h-12 text-lg'
    default:
      return 'w-10 h-10 text-base'
  }
})

// 按钮样式
const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  const theme = effectiveTheme.value === 'dark' 
    ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 focus:ring-blue-500' 
    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
  
  return `${base} ${theme} ${sizeClasses.value}`
})

// 下拉菜单样式（暂时保留，可能后续会用到）
// const dropdownClasses = computed(() => {
//   return effectiveTheme.value === 'dark'
//     ? 'bg-gray-800 border-gray-700 text-gray-200'
//     : 'bg-white border-gray-200 text-gray-700'
// })

// 处理主题切换
const handleThemeChange = (mode: ThemeMode) => {
  setThemeMode(mode)
}

// 处理按钮点击
const handleButtonClick = () => {
  if (props.variant === 'button') {
    toggleTheme()
  }
}
</script>

<template>
  <div class="theme-toggle">
    <!-- 按钮模式 -->
    <button
      v-if="variant === 'button'"
      @click="handleButtonClick"
      :class="buttonClasses"
      :title="`当前主题: ${getThemeName()}`"
    >
      <span class="flex items-center gap-2">
        <span v-html="getThemeIcon()"></span>
        <span v-if="showLabel" class="text-sm font-medium">
          {{ getThemeName() }}
        </span>
      </span>
    </button>

    <!-- 下拉菜单模式 -->
    <div v-else-if="variant === 'dropdown'" class="relative">
      <select
        :value="themeMode"
        @change="handleThemeChange(($event.target as HTMLSelectElement).value as ThemeMode)"
        :class="`${buttonClasses} pr-8 appearance-none cursor-pointer`"
      >
        <option
          v-for="option in themeOptions"
          :key="option.mode"
          :value="option.mode"
        >
          {{ option.icon }} {{ option.name }}
        </option>
      </select>
      
      <!-- 下拉箭头 -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg 
          class="w-4 h-4 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义选择框样式 */
.theme-toggle select {
  background-image: none;
}

.theme-toggle select::-ms-expand {
  display: none;
}

/* 确保在不同主题下的一致性 */
.theme-toggle button:focus,
.theme-toggle select:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* 深色主题下的特殊处理 */
[data-theme="dark"] .theme-toggle button:focus,
[data-theme="dark"] .theme-toggle select:focus {
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
}
</style>
