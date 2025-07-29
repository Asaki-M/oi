// Background script for handling commands
import { getAllTabs, getAllBookmarks, switchToTab, openNewTab, closeTab, removeBookmark } from '../utils/chrome-api'

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle_content_search') {
    // 获取当前活动标签页
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        // 向content script发送消息
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggle-content-search'
        }).catch((error) => {
          // 如果content script未加载，静默处理错误
          console.warn('Content script not ready:', error)
        })
      }
    })
  }
})

// 处理来自content script的消息
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {

  switch (message.action) {
    case 'get-data':
      // 获取标签页和书签数据
      Promise.all([getAllTabs(), getAllBookmarks()])
        .then(([tabs, bookmarks]) => {
          sendResponse({ success: true, data: { tabs, bookmarks } })
        })
        .catch((error) => {
          sendResponse({ success: false, error: error.message })
        })
      return true // 保持消息通道开放

    case 'switch-tab':
      switchToTab(message.tabId)
        .then(() => sendResponse({ success: true }))
        .catch((error) => sendResponse({ success: false, error: error.message }))
      return true

    case 'open-tab':
      openNewTab(message.url)
        .then(() => sendResponse({ success: true }))
        .catch((error) => sendResponse({ success: false, error: error.message }))
      return true

    case 'close-tab':
      closeTab(message.tabId)
        .then(() => sendResponse({ success: true }))
        .catch((error) => sendResponse({ success: false, error: error.message }))
      return true

    case 'remove-bookmark':
      removeBookmark(message.bookmarkId)
        .then(() => sendResponse({ success: true }))
        .catch((error) => sendResponse({ success: false, error: error.message }))
      return true
  }
})

// 确保content script在所有页面都能工作
chrome.runtime.onInstalled.addListener(() => {
  // 扩展安装完成
})
