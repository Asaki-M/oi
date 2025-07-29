<script setup lang="ts">
interface Props {
  type: 'navigate' | 'close' | 'remove'
  class?: string
}

defineProps<Props>()
</script>

<template>
  <svg 
    :class="['w-4 h-4 group-hover:scale-110 transition-transform', $props.class]" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <!-- Navigate Icon -->
    <template v-if="type === 'navigate'">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </template>

    <!-- Close Icon -->
    <template v-else-if="type === 'close'">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </template>

    <!-- Remove Icon -->
    <template v-else-if="type === 'remove'">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </template>
  </svg>
</template>
