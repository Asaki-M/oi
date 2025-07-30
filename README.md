# Oi - 浏览器标签页和书签快速搜索扩展

**灵感来自 Omni**

`本案例实现一个标签页和收藏管理的基础版本，可根据需求增加功能`

<div align="center">
  <p>一个基于crxjs/vue/tailwindcss的Chrome扩展，让你快速搜索和跳转到任何标签页或收藏夹</p>
  
  [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
  [![Vue](https://img.shields.io/badge/Vue-3.5.17-green.svg)](https://vuejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.11-38B2AC.svg)](https://tailwindcss.com/)
</div>

## ✨ 特性

### 🔍 智能搜索
- **实时搜索**：输入即搜，无需等待
- **模糊匹配**：支持标题和URL的模糊搜索
- **分类过滤**：可按标签页、收藏夹或全部内容进行筛选
- **键盘导航**：完全支持键盘操作，提升效率

### 🎯 双重界面
- **弹窗模式**：点击扩展图标打开紧凑的搜索界面
- **页面模式**：使用快捷键在任何页面上打开全屏搜索界面

### ⚡ 快捷操作
- **快速跳转**：一键切换到任意标签页
- **新标签打开**：Ctrl/Cmd+Enter 在新标签页打开链接
- **右键菜单**：支持关闭标签页、删除书签等操作

### 🎨 现代化UI
- **响应式设计**：适配不同屏幕尺寸
- **图标区分**：通过不同颜色图标区分标签页和收藏夹
- **暗色主题**：优雅的深色界面设计

## 🚀 快速开始

### 安装依赖
```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 开发模式
```bash
pnpm dev
```

### 构建扩展
```bash
pnpm build
```

构建完成后，`dist` 文件夹将包含可安装的扩展文件。

### 安装到浏览器
1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `dist` 文件夹

## 🎮 使用方法

### 快捷键
- **Ctrl+Shift+K** (Windows/Linux) 或 **Cmd+Shift+K** (Mac)：在当前页面打开搜索界面
- **↑/↓**：导航选择项目
- **Enter**：打开选中的项目
- **Ctrl/Cmd+Enter**：在新标签页打开
- **Esc**：关闭搜索界面

### 搜索技巧
- 输入网站名称快速找到相关标签页
- 输入URL片段精确定位
- 使用左侧分类快速筛选结果
- 右键点击项目查看更多操作

## 🏗️ 技术架构

### 核心技术栈
- **Vue 3**：现代化的前端框架
- **TypeScript**：类型安全的JavaScript
- **Tailwind CSS**：实用优先的CSS框架
- **Vite**：快速的构建工具
- **Chrome Extensions Manifest V3**：最新的扩展API

### 项目结构
```
src/
├── background/          # 后台脚本
├── content/            # 内容脚本和页面搜索界面
├── popup/              # 弹窗界面
├── components/         # 可复用组件
├── composables/        # Vue组合式函数
├── services/           # 业务逻辑服务
└── utils/              # 工具函数
```

### 核心组件
- **Search.vue**：搜索输入组件
- **CategorySidebar.vue**：分类侧边栏
- **ResultsList.vue**：结果列表组件
- **ContentSearch.vue**：页面搜索界面

## 🔧 开发指南

### 添加新功能
1. 在相应的组件中添加UI
2. 在 `composables/` 中添加业务逻辑
3. 在 `services/` 中添加数据处理
4. 更新类型定义

### 自定义样式
项目使用 Tailwind CSS，可以通过修改类名来调整样式。主要的设计令牌：
- 主色调：蓝色系 (`blue-500`, `blue-600`)
- 强调色：琥珀色 (`amber-500`) 用于收藏夹
- 背景：白色和灰色系

### 权限说明
扩展需要以下权限：
- `tabs`：访问和管理标签页
- `bookmarks`：访问和管理书签
- `activeTab`：获取当前活动标签页
- `storage`：存储用户设置

## 📦 构建

### 构建生产版本
```bash
pnpm build
```

## 🙏 致谢
- [omni] (https://github.com/alyssaxuu/omni) - 书签管理器
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [CRXJS](https://crxjs.dev/) - Chrome扩展开发工具

---
