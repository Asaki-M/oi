/**
 * 高亮搜索关键词的工具函数
 */

export interface HighlightResult {
  html: string
  hasMatch: boolean
}

/**
 * 转义HTML特殊字符
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * 高亮文本中的搜索关键词
 * @param text 原始文本
 * @param query 搜索关键词
 * @param className 高亮样式类名
 * @returns 包含高亮HTML的结果
 */
export function highlightText(
  text: string, 
  query: string, 
  className: string = 'omni-highlight'
): HighlightResult {
  if (!query || !text) {
    return {
      html: escapeHtml(text),
      hasMatch: false
    }
  }

  // 转义搜索关键词中的特殊正则字符
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  
  // 创建不区分大小写的正则表达式
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  
  // 先转义HTML，然后进行高亮替换
  const escapedText = escapeHtml(text)
  const highlightedText = escapedText.replace(regex, `<span class="${className}">$1</span>`)
  
  return {
    html: highlightedText,
    hasMatch: regex.test(text)
  }
}

/**
 * 高亮多个关键词
 * @param text 原始文本
 * @param queries 搜索关键词数组
 * @param className 高亮样式类名
 * @returns 包含高亮HTML的结果
 */
export function highlightMultipleText(
  text: string, 
  queries: string[], 
  className: string = 'omni-highlight'
): HighlightResult {
  if (!queries.length || !text) {
    return {
      html: escapeHtml(text),
      hasMatch: false
    }
  }

  let result = escapeHtml(text)
  let hasAnyMatch = false

  // 按长度降序排列，优先匹配长的关键词
  const sortedQueries = queries
    .filter(q => q.trim())
    .sort((a, b) => b.length - a.length)

  for (const query of sortedQueries) {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedQuery})`, 'gi')
    
    if (regex.test(result)) {
      hasAnyMatch = true
      result = result.replace(regex, `<span class="${className}">$1</span>`)
    }
  }

  return {
    html: result,
    hasMatch: hasAnyMatch
  }
}

/**
 * 智能分词高亮（支持中英文混合）
 * @param text 原始文本
 * @param query 搜索关键词
 * @param className 高亮样式类名
 * @returns 包含高亮HTML的结果
 */
export function smartHighlight(
  text: string, 
  query: string, 
  className: string = 'omni-highlight'
): HighlightResult {
  if (!query || !text) {
    return {
      html: escapeHtml(text),
      hasMatch: false
    }
  }

  // 简单的分词：按空格、标点符号分割
  const words = query
    .toLowerCase()
    .split(/[\s\-_.,;:!?()[\]{}'"]+/)
    .filter(word => word.length > 0)

  if (words.length === 0) {
    return highlightText(text, query, className)
  }

  return highlightMultipleText(text, words, className)
}
