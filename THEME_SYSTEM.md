# 主题系统使用指南

## 概述

本项目实现了一个完整的主题切换系统，支持浅色、深色和跟随系统三种模式。主题系统采用CSS变量实现，具有良好的代码拆分和低侵入性设计。

## 功能特性

- ✅ 支持 `light`、`dark`、`system` 三种主题模式
- ✅ 使用CSS变量实现主题切换
- ✅ 自动检测系统主题偏好
- ✅ 主题设置持久化存储（支持Chrome扩展和普通网页环境）
- ✅ 响应式主题切换UI组件
- ✅ 优良的代码拆分设计
- ✅ 最小化对现有代码的侵入

## 文件结构

```
src/
├── styles/
│   └── theme-variables.css          # 主题CSS变量定义
├── composables/
│   └── useTheme.ts                  # 主题管理逻辑
├── components/
│   └── ThemeToggle.vue              # 主题切换组件
└── utils/
    └── chrome-api.ts                # 主题相关类型定义
```

## 使用方法

### 1. 在组件中使用主题系统

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { initGlobalTheme, cleanupGlobalTheme } from '../composables/useTheme'
import ThemeToggle from '../components/ThemeToggle.vue'

onMounted(async () => {
  // 初始化主题系统
  await initGlobalTheme()
})

onUnmounted(() => {
  // 清理主题系统
  cleanupGlobalTheme()
})
</script>

<template>
  <div>
    <!-- 主题切换按钮 -->
    <ThemeToggle size="sm" />
  </div>
</template>
```

### 2. 使用主题相关的composable

```typescript
import { useTheme } from '../composables/useTheme'

const { 
  themeMode,           // 当前主题模式
  effectiveTheme,      // 有效主题（light/dark）
  setThemeMode,        // 设置主题模式
  toggleTheme,         // 切换主题
  getThemeIcon,        // 获取主题图标
  getThemeName         // 获取主题名称
} = useTheme()

// 设置特定主题
setThemeMode('dark')

// 循环切换主题
toggleTheme()
```

### 3. 在CSS中使用主题变量

```css
/* 使用预定义的CSS变量 */
.my-component {
  background-color: rgb(var(--color-background));
  color: rgb(var(--color-text-primary));
  border: 1px solid rgb(var(--color-border-primary));
  box-shadow: var(--shadow-md);
}

/* 或使用工具类 */
.my-element {
  @apply bg-theme-primary text-theme-primary border-theme-primary;
}
```

## 主题变量参考

### 颜色变量

- `--color-background`: 主背景色
- `--color-background-secondary`: 次要背景色
- `--color-background-tertiary`: 第三级背景色
- `--color-text-primary`: 主文本颜色
- `--color-text-secondary`: 次要文本颜色
- `--color-text-tertiary`: 第三级文本颜色
- `--color-border-primary`: 主边框颜色
- `--color-border-secondary`: 次要边框颜色
- `--color-primary`: 品牌主色
- `--color-primary-hover`: 品牌主色悬停态

### 阴影变量

- `--shadow-sm`: 小阴影
- `--shadow-md`: 中等阴影
- `--shadow-lg`: 大阴影
- `--shadow-xl`: 超大阴影
- `--shadow-2xl`: 最大阴影

### 特殊变量

- `--color-highlight-bg`: 高亮背景色
- `--color-highlight-text`: 高亮文本颜色
- `--scrollbar-thumb`: 滚动条颜色
- `--scrollbar-thumb-hover`: 滚动条悬停颜色

## ThemeToggle组件API

### Props

- `size?: 'sm' | 'md' | 'lg'` - 组件尺寸，默认 `'md'`
- `showLabel?: boolean` - 是否显示文本标签，默认 `false`
- `variant?: 'button' | 'dropdown'` - 组件样式，默认 `'button'`

### 使用示例

```vue
<!-- 小尺寸按钮 -->
<ThemeToggle size="sm" />

<!-- 带标签的中等尺寸按钮 -->
<ThemeToggle size="md" show-label />

<!-- 下拉选择器样式 -->
<ThemeToggle variant="dropdown" />
```

## 存储机制

主题设置会自动保存到：
- Chrome扩展环境：`chrome.storage.local`
- 普通网页环境：`localStorage`

存储键名：`omni-theme-mode`

## 系统主题检测

系统会自动检测用户的系统主题偏好：
- 监听 `prefers-color-scheme` 媒体查询
- 当用户选择 `system` 模式时，自动跟随系统主题变化
- 支持实时响应系统主题切换

## 注意事项

1. **CSS变量格式**：使用 `rgb(var(--color-name))` 格式以支持透明度
2. **主题初始化**：确保在组件挂载时调用 `initGlobalTheme()`
3. **清理资源**：在组件卸载时调用 `cleanupGlobalTheme()`
4. **兼容性**：支持现代浏览器，对于旧版浏览器会回退到默认主题

## 扩展主题

如需添加新的主题变量，请在 `src/styles/theme-variables.css` 中：

1. 在 `:root` 中定义浅色主题变量
2. 在 `[data-theme="dark"]` 中定义深色主题变量
3. 在 `@media (prefers-color-scheme: dark)` 的 `[data-theme="system"]` 中定义系统深色主题变量

## 故障排除

1. **主题不生效**：检查是否正确调用了 `initGlobalTheme()`
2. **样式不更新**：确保CSS变量格式正确，使用 `rgb(var(--variable-name))`
3. **存储失败**：检查浏览器是否支持相应的存储API

## 技术实现

- **状态管理**：使用Vue 3的响应式系统
- **CSS变量**：利用CSS自定义属性实现主题切换
- **媒体查询**：检测系统主题偏好
- **存储API**：支持Chrome扩展和Web存储
- **类型安全**：完整的TypeScript类型定义
