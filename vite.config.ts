import path from 'node:path'
import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import zip from 'vite-plugin-zip-pack'
import manifest from './manifest.config.ts'
import { name, version } from './package.json'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'

  return {
    resolve: {
      alias: {
        '@': `${path.resolve(__dirname, 'src')}`,
      },
    },
    build: {
      rollupOptions: {
        input: isDev ? undefined : {
          // 额外的入口点 - content-app 需要单独构建
          'content-app': path.resolve(__dirname, 'src/content/content-app.ts'),
          'content-loader': path.resolve(__dirname, 'src/content/content-loader.js'),
        },
        output: isDev ? undefined : {
          // 确保 content 相关文件输出到正确的位置
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === 'content-app') {
              return 'src/content/content-app.js'
            }
            if (chunkInfo.name === 'content-loader') {
              return 'src/content/content-loader.js'
            }
            return 'assets/[name]-[hash].js'
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            // CSS 文件也需要特殊处理
            if (assetInfo.name?.includes('content-app')) {
              return 'src/content/content-app.css'
            }
            return 'assets/[name]-[hash][extname]'
          }
        }
      },
    },
    plugins: [
      vue(),
      tailwindcss(),
      crx({ manifest }),
      zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` }),
    ],
    server: {
      cors: {
        origin: [
          /chrome-extension:\/\//,
        ],
      },
    },
  }
})
