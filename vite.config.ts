import path from 'node:path'
import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import zip from 'vite-plugin-zip-pack'
import manifest from './manifest.config.ts'
import { name, version } from './package.json'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': `${path.resolve(__dirname, 'src')}`,
      },
    },
    plugins: [
      vue(),
      tailwindcss(),
      crx({
        manifest,
        browser: 'chrome', // 默认是 chrome 按照chrome标准来构建
      }),
      zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` }),
    ],
    build: {
      rollupOptions: {
        input: {
          // 确保content.html被包含在构建中
          content: 'src/content/content.html',
        },
      },
    },
    server: {
      cors: {
        origin: [/chrome-extension:\/\//],
      },
    }
  }
})
