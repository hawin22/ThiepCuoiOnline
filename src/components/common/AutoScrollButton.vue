<template>
  <!-- Auto scroll FAB -->
  <button
    @click="$emit('toggle')"
    :title="isScrolling ? 'Dừng tự cuộn' : 'Tự động cuộn thiệp'"
    class="fixed bottom-4 right-4 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
    style="background: #F8F5EF; border: 1.5px solid #C7A878; box-shadow: 0 4px 16px rgba(199,168,120,0.3);"
    :class="isScrolling ? 'ring-2 ring-champ ring-offset-2' : ''"
  >
    <!-- Scroll play icon -->
    <svg v-if="!isScrolling" class="w-4 h-4 text-champ" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
    </svg>
    <!-- Pause icon -->
    <svg v-else class="w-4 h-4 text-champ animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"/>
    </svg>
  </button>
</template>

<script setup>
defineProps({ isScrolling: { type: Boolean, default: false } })
defineEmits(['toggle'])
</script>
