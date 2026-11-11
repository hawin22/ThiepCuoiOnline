<template>
  <!-- Floating music control in bottom-right corner -->
  <div class="fixed bottom-20 right-4 z-50 flex items-center gap-2 select-none group">
    
    <!-- Mini Track Info Card (Slide ra nhẹ nhàng bên trái) -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-4 scale-95"
      enter-to-class="opacity-100 translate-x-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0 scale-100"
      leave-to-class="opacity-0 translate-x-4 scale-95"
    >
      <div
        v-if="showCard || isHovered || isPlaying"
        class="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md border border-[#C7A878]/40"
        style="background: rgba(248, 245, 239, 0.95); box-shadow: 0 4px 20px rgba(81, 70, 63, 0.12);"
      >
        <!-- Animated Equalizer Bars when playing -->
        <div class="flex items-end gap-0.5 h-3.5 w-3 px-0.5">
          <span
            class="w-0.5 bg-[#B9827A] rounded-full transition-all duration-300"
            :class="isPlaying ? 'animate-bounce h-3.5' : 'h-1'"
            style="animation-delay: 0ms;"
          ></span>
          <span
            class="w-0.5 bg-[#C7A878] rounded-full transition-all duration-300"
            :class="isPlaying ? 'animate-bounce h-2' : 'h-1.5'"
            style="animation-delay: 150ms;"
          ></span>
          <span
            class="w-0.5 bg-[#51463F] rounded-full transition-all duration-300"
            :class="isPlaying ? 'animate-bounce h-3' : 'h-1'"
            style="animation-delay: 300ms;"
          ></span>
        </div>

        <!-- Song info -->
        <div class="max-w-[170px] md:max-w-[210px] text-left leading-tight overflow-hidden">
          <div class="text-[11px] font-medium text-[#51463F] truncate">
            {{ currentTrack?.title || 'Nhạc Đám Cưới 2026' }}
          </div>
          <div class="text-[9.5px] text-[#51463F]/60 truncate flex items-center gap-1">
            <span class="inline-block w-1.5 h-1.5 rounded-full" :class="isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'"></span>
            <span>{{ currentTrack?.artist || 'Ballad Lãng Mạn' }}</span>
            <span v-if="isCurrentYouTube" class="text-[8px] px-1 py-0.2 rounded bg-[#B9827A]/15 text-[#B9827A] font-semibold tracking-wider">YT</span>
          </div>
        </div>

        <!-- Next track button (nếu playlist có từ 2 bài trở lên) -->
        <button
          v-if="playlist.length > 1"
          @click.stop="nextTrack"
          title="Chuyển bài tiếp theo trong danh sách JSON"
          class="w-6 h-6 rounded-full flex items-center justify-center text-[#51463F] hover:text-[#B9827A] hover:bg-[#E8DED0]/60 transition-colors"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>
    </transition>

    <!-- Main Vinyl Disc Button -->
    <div
      class="relative"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <button
        @click="toggle"
        :title="isPlaying ? 'Nhấn để tạm dừng nhạc' : 'Nhấn để phát nhạc nền'"
        aria-label="Điều khiển nhạc nền thiệp cưới"
        class="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-transform duration-300 hover:scale-110 active:scale-95 focus:outline-none flex items-center justify-center shadow-lg"
        style="background: #2D2520; border: 1.5px solid #C7A878; box-shadow: 0 4px 16px rgba(199,168,120,0.35);"
      >
        <!-- Vinyl record spinning -->
        <div
          class="absolute inset-1 rounded-full flex items-center justify-center overflow-hidden"
          :class="isPlaying ? 'animate-spin-slow' : ''"
          style="background: radial-gradient(circle, #3E342D 25%, #251E1A 60%, #1A1512 100%);"
        >
          <!-- Grooves -->
          <svg class="absolute inset-0 w-full h-full opacity-35 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#C7A878" stroke-width="0.8"/>
            <circle cx="50" cy="50" r="34" fill="none" stroke="#C7A878" stroke-width="0.6"/>
            <circle cx="50" cy="50" r="26" fill="none" stroke="#C7A878" stroke-width="0.5"/>
          </svg>

          <!-- Center gold core -->
          <div
            class="w-4 h-4 rounded-full flex items-center justify-center z-10"
            style="background: linear-gradient(135deg, #D8BF96, #C7A878, #A88A5C); box-shadow: 0 1px 3px rgba(0,0,0,0.5);"
          >
            <!-- Pause Icon -->
            <svg v-if="isPlaying" class="w-2.5 h-2.5 text-[#2D2520]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
            <!-- Play Icon -->
            <svg v-else class="w-2.5 h-2.5 text-[#2D2520] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </button>

      <!-- Buffering indicator ring -->
      <span
        v-if="isBuffering"
        class="absolute -inset-1 rounded-full border-2 border-[#C7A878] border-t-transparent animate-spin pointer-events-none"
      ></span>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAudio } from '@/composables/useAudio.js'

const {
  isPlaying,
  isBuffering,
  currentTrack,
  isCurrentYouTube,
  playlist,
  toggle,
  nextTrack,
} = useAudio()

const isHovered = ref(false)
const showCard = ref(false)
</script>

<style scoped>
@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spinSlow 6s linear infinite;
}
</style>
