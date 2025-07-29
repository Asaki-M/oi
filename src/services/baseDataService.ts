// 基础数据服务接口
export interface Tab {
  id: number
  title: string
  url: string
  favIconUrl?: string
  active: boolean
  windowId: number
}

export interface Bookmark {
  id: string
  title: string
  url?: string
  parentId?: string
  children?: Bookmark[]
}

export interface SearchData {
  tabs: Tab[]
  bookmarks: Bookmark[]
}

export interface IDataService {
  getData(): Promise<SearchData>
  switchToTab(tabId: number): Promise<void>
  openNewTab(url: string): Promise<void>
  closeTab(tabId: number): Promise<void>
  removeBookmark(bookmarkId: string): Promise<void>
  clearCache(): void
}

// 基础数据服务类
export abstract class BaseDataService implements IDataService {
  protected cache: SearchData | null = null
  protected cacheTime = 0
  protected readonly CACHE_DURATION = 30000 // 30秒缓存
  protected isLoading = false

  abstract getData(): Promise<SearchData>
  abstract switchToTab(tabId: number): Promise<void>
  abstract openNewTab(url: string): Promise<void>
  abstract closeTab(tabId: number): Promise<void>
  abstract removeBookmark(bookmarkId: string): Promise<void>

  clearCache(): void {
    this.cache = null
    this.cacheTime = 0
  }

  protected isCacheValid(): boolean {
    return this.cache !== null && (Date.now() - this.cacheTime) < this.CACHE_DURATION
  }

  protected async waitForLoading(maxWaitTime = 5000): Promise<void> {
    let waitTime = 0
    while (this.isLoading && waitTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, 100))
      waitTime += 100
    }
  }
}
