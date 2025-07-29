<script setup lang="ts">
import type { Category, CategoryType } from '../composables/useCategories'

interface Props {
  categories: Category[]
  activeCategory: CategoryType
}

interface Emits {
  (e: 'update:activeCategory', category: CategoryType): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

// 处理分类切换
const handleCategoryClick = (category: CategoryType) => {
  emit('update:activeCategory', category)
}
</script>

<template>
  <div class="w-20 bg-gray-50 border-r border-gray-200 py-3 overflow-y-auto relative">
    <div class="flex flex-col gap-1 px-2">
      <button
        v-for="category in categories"
        :key="category.key"
        @click="handleCategoryClick(category.key)"
        :class="[
          'flex flex-col items-center px-2 py-3 border-none bg-transparent rounded-lg cursor-pointer transition-all duration-200 text-gray-600 relative font-medium text-xs hover:bg-blue-50 hover:text-blue-600',
          {
            'bg-blue-100 text-blue-700 border-2 border-blue-300 shadow-sm': activeCategory === category.key
          }
        ]"
      >
        <div class="flex items-center justify-center w-6 h-6 mb-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="category.icon" />
          </svg>
        </div>

        <div class="text-xs font-medium text-center">{{ category.name }}</div>

        <!-- 计数徽章 -->
        <div class="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full border-2 border-white">
          {{ category.count }}
        </div>
      </button>
    </div>
  </div>
</template>



