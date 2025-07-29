import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

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
  permissions: [
    'tabs',
    'bookmarks',
    'activeTab',
    'storage'
  ],
  background: {
    service_worker: 'src/background/main.ts'
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content/main.ts']
    }
  ],
  commands: {
    'toggle_content_search': {
      suggested_key: {
        default: 'Ctrl+Shift+K',
        mac: 'Command+Shift+K'
      },
      description: '在页面中打开Omni搜索'
    }
  }
})
