// 动态加载脚本，支持开发和生产环境
// 这个文件用于解决 CSP 内联脚本限制问题

// 检测是否为开发环境
const isDev = window.location.protocol === 'http:' || window.location.hostname === 'localhost'

// 确定要加载的文件
const scriptSrc = isDev ? './content-app.ts' : './content-app.js'
const cssSrc = isDev ? null : './content-app.css'

// console.log('Content loader - isDev:', isDev, 'scriptSrc:', scriptSrc)

// 加载主脚本
const script = document.createElement('script')
script.type = 'module'
script.src = scriptSrc
script.onerror = (error) => {
  console.error('Failed to load content script:', error)
}
document.head.appendChild(script)

// 加载CSS（仅在生产环境）
if (cssSrc) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = cssSrc
  link.onerror = (error) => {
    console.error('Failed to load content CSS:', error)
  }
  document.head.appendChild(link)
}
