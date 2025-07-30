import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

// 检测是否为开发模式
const isDev = process.env.NODE_ENV !== 'production'

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  description: '快速搜索和跳转到任何标签页或收藏夹',
  icons: {
    16: 'public/logo.png',
    48: 'public/logo.png',
    128: 'public/logo.png',
  },
  action: {
    default_icon: {
      16: 'public/logo.png',
      48: 'public/logo.png',
      128: 'public/logo.png',
    },
    default_popup: 'src/popup/index.html',
  },
  permissions: ['tabs', 'bookmarks', 'activeTab', 'storage'],
  background: {
    service_worker: 'src/background/main.ts',
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content/main.ts'],
    },
  ],
  commands: {
    toggle_content_search: {
      suggested_key: {
        default: 'Ctrl+Shift+K',
        mac: 'Command+Shift+K',
      },
      description: '在页面中打开Oi搜索',
    },
  },
  web_accessible_resources: [
    {
      resources: isDev
        ? [
            'src/content/content.html',
            'src/content/content-app.ts',
            'src/content/content-loader.js'
          ]
        : [
            'src/content/content.html',
            'src/content/content-app.js',
            'src/content/content-app.css',
            'src/content/content-loader.js'
          ],
      matches: ['<all_urls>'],
    },
  ],
})
