<div align="center">
  <img src="public/logo.png" alt="Oi Logo" width="120" height="120">

  # 🔍 Oi

  **快速搜索浏览器标签页和书签的现代化扩展**

  *灵感来自 Omni，使用现代技术栈重新构建*

  <p>
    <a href="#-特性">特性</a> •
    <a href="#-快速开始">快速开始</a> •
    <a href="#-使用方法">使用方法</a> •
    <a href="#-技术架构">技术架构</a> •
    <a href="#-开发指南">开发指南</a>
  </p>

  [![Version](https://img.shields.io/badge/version-1.0.0-4F46E5.svg?style=flat-square)](package.json)
  [![Vue](https://img.shields.io/badge/Vue-3.5.17-4FC08D.svg?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.11-06B6D4.svg?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)

  ---

  **一个基于 Vue 3 + TypeScript + Tailwind CSS 的 Chrome 扩展**
  让你在浏览器中快速搜索和跳转到任何标签页或收藏夹

</div>

## ✨ 特性

<table>
<tr>
<td width="50%">

### 🔍 智能搜索
- **⚡ 实时搜索** - 输入即搜，无需等待
- **🎯 模糊匹配** - 支持标题和URL的智能匹配
- **📂 分类过滤** - 按标签页、收藏夹或全部内容筛选
- **⌨️ 键盘导航** - 完全支持键盘操作，提升效率

### 🎯 双重界面
- **🪟 弹窗模式** - 点击扩展图标的紧凑搜索界面
- **🖥️ 页面模式** - 快捷键打开的全屏搜索界面

</td>
<td width="50%">

### ⚡ 快捷操作
- **🚀 快速跳转** - 一键切换到任意标签页
- **🆕 新标签打开** - Ctrl/Cmd+Enter 在新标签页打开
- **🖱️ 右键菜单** - 关闭标签页、删除书签等操作

### 🎨 现代化UI
- **📱 响应式设计** - 适配不同屏幕尺寸
- **🎨 图标区分** - 不同颜色图标区分内容类型
- **🌙 优雅主题** - 现代化的深色界面设计

</td>
</tr>
</table>

## 🚀 快速开始

### 📦 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 🛠️ 开发模式

```bash
# 启动开发服务器
pnpm dev
```

开发模式下，代码修改会自动重新加载扩展。

### 🏗️ 构建扩展

```bash
# 构建生产版本
pnpm build
```

构建完成后，`dist` 文件夹将包含可安装的扩展文件。

### 🔧 安装到浏览器

<details>
<summary>📋 详细安装步骤</summary>

1. **打开扩展管理页面**
   - 在 Chrome 地址栏输入 `chrome://extensions/`
   - 或者点击 Chrome 菜单 → 更多工具 → 扩展程序

2. **启用开发者模式**
   - 在页面右上角开启"开发者模式"开关

3. **加载扩展**
   - 点击"加载已解压的扩展程序"按钮
   - 选择项目的 `dist` 文件夹

4. **完成安装**
   - 扩展将出现在扩展列表中
   - 可以在浏览器工具栏看到扩展图标

</details>

## 🎮 使用方法

### ⌨️ 快捷键

<table>
<tr>
<th>操作</th>
<th>Windows/Linux</th>
<th>macOS</th>
<th>说明</th>
</tr>
<tr>
<td>打开搜索界面</td>
<td><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>K</kbd></td>
<td><kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>K</kbd></td>
<td>在当前页面打开全屏搜索</td>
</tr>
<tr>
<td>导航选择</td>
<td><kbd>↑</kbd> / <kbd>↓</kbd></td>
<td><kbd>↑</kbd> / <kbd>↓</kbd></td>
<td>在搜索结果中上下移动</td>
</tr>
<tr>
<td>打开项目</td>
<td><kbd>Enter</kbd></td>
<td><kbd>Enter</kbd></td>
<td>跳转到选中的标签页或书签</td>
</tr>
<tr>
<td>新标签页打开</td>
<td><kbd>Ctrl</kbd> + <kbd>Enter</kbd></td>
<td><kbd>Cmd</kbd> + <kbd>Enter</kbd></td>
<td>在新标签页中打开链接</td>
</tr>
<tr>
<td>关闭界面</td>
<td><kbd>Esc</kbd></td>
<td><kbd>Esc</kbd></td>
<td>关闭搜索界面</td>
</tr>
</table>

### 💡 搜索技巧

- **🌐 网站搜索** - 输入网站名称快速找到相关标签页
- **🔗 URL匹配** - 输入URL片段进行精确定位
- **📂 分类筛选** - 使用左侧分类快速筛选结果
- **🖱️ 右键操作** - 右键点击项目查看更多操作选项

## 🏗️ 技术架构

### 🛠️ 核心技术栈

<table>
<tr>
<td align="center" width="20%">
  <img src="https://vuejs.org/logo.svg" width="40" height="40"><br>
  <strong>Vue 3</strong><br>
  <sub>现代化前端框架</sub>
</td>
<td align="center" width="20%">
  <img src="https://www.typescriptlang.org/favicon-32x32.png" width="40" height="40"><br>
  <strong>TypeScript</strong><br>
  <sub>类型安全的JavaScript</sub>
</td>
<td align="center" width="20%">
  <img src="https://tailwindcss.com/favicons/favicon-32x32.png" width="40" height="40"><br>
  <strong>Tailwind CSS</strong><br>
  <sub>实用优先的CSS框架</sub>
</td>
<td align="center" width="20%">
  <img src="https://vitejs.dev/logo.svg" width="40" height="40"><br>
  <strong>Vite</strong><br>
  <sub>快速的构建工具</sub>
</td>
<td align="center" width="20%">
  <img src="https://developer.chrome.com/static/docs/extensions/images/index/mv3-logo.png" width="40" height="40"><br>
  <strong>Manifest V3</strong><br>
  <sub>最新的扩展API</sub>
</td>
</tr>
</table>

### 📁 项目结构

```
📦 src/
├── 🔧 background/          # 后台脚本 (Service Worker)
├── 📄 content/            # 内容脚本和页面搜索界面
├── 🪟 popup/              # 弹窗界面
├── 🧩 components/         # 可复用组件
│   ├── Search.vue         # 搜索输入组件
│   ├── CategorySidebar.vue # 分类侧边栏
│   └── ResultsList.vue    # 结果列表组件
├── 🎣 composables/        # Vue组合式函数
├── 🔧 services/           # 业务逻辑服务
├── 🎨 styles/             # 样式文件
└── 🛠️ utils/              # 工具函数
```

### 🧩 核心组件

| 组件 | 功能 | 位置 |
|------|------|------|
| `Search.vue` | 搜索输入和结果展示 | `components/` |
| `CategorySidebar.vue` | 分类筛选侧边栏 | `components/` |
| `ResultsList.vue` | 搜索结果列表 | `components/` |
| `ContentSearch.vue` | 页面内搜索界面 | `content/` |

## 🔧 开发指南

### 🆕 添加新功能

<details>
<summary>📋 开发流程</summary>

1. **🎨 UI层** - 在相应的组件中添加用户界面
2. **🎣 逻辑层** - 在 `composables/` 中添加业务逻辑
3. **🔧 服务层** - 在 `services/` 中添加数据处理
4. **📝 类型定义** - 更新 TypeScript 类型定义
5. **🧪 测试** - 添加相应的测试用例

</details>

### 🎨 自定义样式

项目使用 **Tailwind CSS**，通过修改类名来调整样式：

```css
/* 主要设计令牌 */
--primary: blue-500, blue-600     /* 主色调 */
--accent: amber-500               /* 强调色（收藏夹） */
--background: white, gray-50      /* 背景色 */
--text: gray-900, gray-600        /* 文字颜色 */
```

### 🔐 权限说明

扩展需要以下 Chrome API 权限：

| 权限 | 用途 | 必需性 |
|------|------|--------|
| `tabs` | 访问和管理标签页 | ✅ 必需 |
| `bookmarks` | 访问和管理书签 | ✅ 必需 |
| `activeTab` | 获取当前活动标签页 | ✅ 必需 |
| `storage` | 存储用户设置 | ⚠️ 可选 |

## 📦 构建与发布

### 🏗️ 构建生产版本

```bash
# 构建扩展
pnpm build

# 构建完成后会生成：
# 📁 dist/           - 扩展文件
# 📁 release/        - 打包的 .zip 文件
```

### 📤 发布到 Chrome Web Store

<details>
<summary>📋 发布步骤</summary>

1. **准备材料**
   - 扩展的 .zip 文件
   - 应用图标（128x128px）
   - 截图和描述

2. **上传到商店**
   - 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - 上传 .zip 文件
   - 填写应用信息

3. **审核发布**
   - 等待 Google 审核
   - 审核通过后自动发布

</details>

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. **🍴 Fork** 本仓库
2. **🌿 创建** 特性分支 (`git checkout -b feature/AmazingFeature`)
3. **💾 提交** 更改 (`git commit -m 'Add some AmazingFeature'`)
4. **📤 推送** 到分支 (`git push origin feature/AmazingFeature`)
5. **� 创建** Pull Request

### 📋 开发规范

- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 最佳实践
- 使用 Tailwind CSS 进行样式开发
- 提交前确保代码通过 ESLint 检查

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目和工具：

<table>
<tr>
<td align="center">
  <a href="https://github.com/alyssaxuu/omni">
    <img src="https://github.com/alyssaxuu.png" width="60" height="60" style="border-radius: 50%"><br>
    <strong>Omni</strong><br>
    <sub>原始灵感来源</sub>
  </a>
</td>
<td align="center">
  <a href="https://vuejs.org/">
    <img src="https://vuejs.org/logo.svg" width="60" height="60"><br>
    <strong>Vue.js</strong><br>
    <sub>渐进式JavaScript框架</sub>
  </a>
</td>
<td align="center">
  <a href="https://tailwindcss.com/">
    <img src="https://tailwindcss.com/favicons/favicon-32x32.png" width="60" height="60"><br>
    <strong>Tailwind CSS</strong><br>
    <sub>实用优先的CSS框架</sub>
  </a>
</td>
<td align="center">
  <a href="https://vitejs.dev/">
    <img src="https://vitejs.dev/logo.svg" width="60" height="60"><br>
    <strong>Vite</strong><br>
    <sub>下一代前端构建工具</sub>
  </a>
</td>
<td align="center">
  <a href="https://crxjs.dev/">
    <img src="https://crxjs.dev/assets/logo-Bq4A0d8F.svg" width="60" height="60"><br>
    <strong>CRXJS</strong><br>
    <sub>Chrome扩展开发工具</sub>
  </a>
</td>
</tr>
</table>

---

<div align="center">
  <p>如果这个项目对你有帮助，请给它一个 ⭐️，或者直接使用omni插件，也给它一个 🌟</p>
  <p>
    <a href="https://github.com/yourusername/oi/issues">报告问题</a> •
    <a href="https://github.com/yourusername/oi/discussions">讨论</a> •
    <a href="#-快速开始">快速开始</a>
  </p>

  **Made with ❤️ by developers, for developers**
</div>
