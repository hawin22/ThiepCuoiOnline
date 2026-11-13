<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Background image -->
    <div class="absolute inset-0 z-0">
      <img
        :src="config.hero.coverImage"
        alt="Ảnh cưới Thúy Phương & Trung Kiên"
        decoding="async"
        class="w-full h-full object-cover object-[center_33%] transition-transform duration-[2000ms]"
        :class="isLoaded ? 'scale-100' : 'scale-110'"
        @load="isLoaded = true"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-brown/60 via-brown/25 to-brown/75"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 text-center px-4 sm:px-6 py-16 sm:py-20" ref="el">
      <!-- Badge -->
      <div
        class="inline-flex items-center gap-2 border border-champ-light/60 rounded-full px-3.5 sm:px-4 py-1 sm:py-1.5 mb-8 sm:mb-10 backdrop-blur-sm bg-white/10 transition-all duration-700"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-champ animate-pulse"></span>
        <span class="font-sans text-champ-light text-[10px] sm:text-xs tracking-[0.35em] uppercase font-medium">{{ config.hero.badge }}</span>
        <span class="w-1.5 h-1.5 rounded-full bg-champ animate-pulse"></span>
      </div>

      <!-- Names: Bride first (top) then Groom -->
      <div
        class="transition-all duration-1000 px-2"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
        :style="{ transitionDelay: '250ms' }"
      >
        <h1 class="font-script text-white leading-tight drop-shadow-lg">
          <span class="text-4xl sm:text-6xl md:text-7xl lg:text-8xl block">{{ config.general.brideShort }}</span>
          <span class="text-champ-light text-2xl sm:text-3xl md:text-4xl block my-2 sm:my-3 font-serif italic">&amp;</span>
          <span class="text-4xl sm:text-6xl md:text-7xl lg:text-8xl block">{{ config.general.groomShort }}</span>
        </h1>
      </div>

      <!-- Ornament divider -->
      <div
        class="flex items-center justify-center gap-3 sm:gap-4 my-8 sm:my-10 transition-all duration-700"
        :class="isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'"
        :style="{ transitionDelay: '550ms' }"
      >
        <div class="h-px w-10 sm:w-14 bg-champ/50"></div>
        <span class="text-champ text-lg sm:text-xl">✦</span>
        <div class="h-px w-10 sm:w-14 bg-champ/50"></div>
      </div>

      <!-- Monogram P & K -->
      <div
        class="transition-all duration-700"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
        :style="{ transitionDelay: '750ms' }"
      >
        <p class="font-script text-champ-light/90 text-xl sm:text-2xl">{{ config.general.monogram }}</p>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/60 animate-bounce">
      <span class="font-sans text-[9px] sm:text-[10px] tracking-widest uppercase">Cuộn xuống</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
      </svg>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersection.js'
defineProps({ config: { type: Object, required: true } })
const isLoaded = ref(false)
const { el, isVisible } = useIntersectionObserver({ threshold: 0.1 })
</script>
