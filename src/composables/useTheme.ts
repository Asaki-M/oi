import { ref, computed, watch } from 'vue'
import type { ThemeMode, ThemeConfig } from '../utils/chrome-api'

// 全局主题状态
const themeMode = ref<ThemeMode>('system')
const systemPreference = ref<'light' | 'dark'>('light')

// 存储键名
const THEME_STORAGE_KEY = 'omni-theme-mode'

/**
 * 主题管理 composable
 */
export function useTheme() {
  // 计算有效主题
  const effectiveTheme = computed<'light' | 'dark'>(() => {
    if (themeMode.value === 'system') {
      return systemPreference.value
    }
    return themeMode.value
  })

  // 主题配置对象
  const themeConfig = computed<ThemeConfig>(() => ({
    mode: themeMode.value,
    systemPreference: systemPreference.value,
    effectiveTheme: effectiveTheme.value
  }))

  // 检测系统主题偏好
  const detectSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  // 更新系统主题偏好
  const updateSystemPreference = () => {
    systemPreference.value = detectSystemTheme()
  }

  // 应用主题到DOM
  const applyTheme = (theme: 'light' | 'dark') => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      root.setAttribute('data-theme', theme)
      
      // 同时设置color-scheme以便浏览器UI适配
      root.style.colorScheme = theme
    }
  }

  // 设置主题模式
  const setThemeMode = (mode: ThemeMode) => {
    themeMode.value = mode
    saveThemeToStorage(mode)
  }

  // 切换主题模式
  const toggleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system']
    const currentIndex = modes.indexOf(themeMode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    setThemeMode(modes[nextIndex])
  }

  // 保存主题到存储
  const saveThemeToStorage = async (mode: ThemeMode) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        // Chrome扩展环境，使用chrome.storage
        await chrome.storage.local.set({ [THEME_STORAGE_KEY]: mode })
      } else if (typeof localStorage !== 'undefined') {
        // 普通网页环境，使用localStorage
        localStorage.setItem(THEME_STORAGE_KEY, mode)
      }
    } catch (error) {
      console.warn('Failed to save theme to storage:', error)
    }
  }

  // 从存储加载主题
  const loadThemeFromStorage = async (): Promise<ThemeMode> => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        // Chrome扩展环境
        const result = await chrome.storage.local.get(THEME_STORAGE_KEY)
        return result[THEME_STORAGE_KEY] || 'system'
      } else if (typeof localStorage !== 'undefined') {
        // 普通网页环境
        return (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || 'system'
      }
    } catch (error) {
      console.warn('Failed to load theme from storage:', error)
    }
    return 'system'
  }

  // 初始化主题
  const initTheme = async () => {
    // 更新系统主题偏好
    updateSystemPreference()
    
    // 从存储加载主题设置
    const savedTheme = await loadThemeFromStorage()
    themeMode.value = savedTheme
    
    // 应用主题
    applyTheme(effectiveTheme.value)
  }

  // 监听系统主题变化
  let mediaQuery: MediaQueryList | null = null
  const setupSystemThemeListener = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        updateSystemPreference()
      }
      
      // 使用现代API或回退到旧API
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
      } else {
        // 兼容旧版浏览器
        mediaQuery.addListener(handleChange)
      }
    }
  }

  // 清理系统主题监听器
  const cleanupSystemThemeListener = () => {
    if (mediaQuery) {
      const handleChange = () => {
        updateSystemPreference()
      }
      
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        // 兼容旧版浏览器
        mediaQuery.removeListener(handleChange)
      }
      mediaQuery = null
    }
  }

  // 监听有效主题变化，应用到DOM
  watch(effectiveTheme, (newTheme) => {
    applyTheme(newTheme)
  }, { immediate: false })

  // 获取主题图标SVG
  const getThemeIcon = (mode: ThemeMode = themeMode.value) => {
    switch (mode) {
      case 'light':
        // 太阳图标
        return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>`
      case 'dark':
        // 月亮图标
        return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>`
      case 'system':
        // 显示器图标
        return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>`
      default:
        return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>`
    }
  }

  // 获取简洁的主题图标文本（用于下拉菜单）
  const getThemeIconText = (mode: ThemeMode = themeMode.value) => {
    switch (mode) {
      case 'light':
        return '☀'
      case 'dark':
        return '☾'
      case 'system':
        return '⚙'
      default:
        return '⚙'
    }
  }

  // 获取主题名称
  const getThemeName = (mode: ThemeMode = themeMode.value) => {
    switch (mode) {
      case 'light':
        return '浅色'
      case 'dark':
        return '深色'
      case 'system':
        return '跟随系统'
      default:
        return '跟随系统'
    }
  }

  return {
    // 状态
    themeMode: computed(() => themeMode.value),
    systemPreference: computed(() => systemPreference.value),
    effectiveTheme,
    themeConfig,

    // 方法
    setThemeMode,
    toggleTheme,
    initTheme,
    getThemeIcon,
    getThemeIconText,
    getThemeName,

    // 内部方法（用于测试或特殊需求）
    updateSystemPreference,
    setupSystemThemeListener,
    cleanupSystemThemeListener
  }
}

// 全局主题初始化（用于应用启动时）
export async function initGlobalTheme() {
  const { initTheme, setupSystemThemeListener } = useTheme()
  await initTheme()
  setupSystemThemeListener()
}

// 全局主题清理（用于应用销毁时）
export function cleanupGlobalTheme() {
  const { cleanupSystemThemeListener } = useTheme()
  cleanupSystemThemeListener()
}
