<template>
  <section class="relative py-24 md:py-32 px-4 sm:px-6 overflow-hidden min-h-[65vh] flex items-center">
    <!-- Full bleed background -->
    <div class="absolute inset-0 z-0">
      <img :src="config.thankYou?.bgImage || '/images/thankyou/thankyou.jpg'" alt="Lời cảm ơn Thúy Phương & Trung Kiên"
        loading="lazy" decoding="async"
        class="w-full h-full object-cover object-[center_25%]" />
      <div class="absolute inset-0 bg-gradient-to-b from-brown/65 via-brown/55 to-brown/85"></div>
    </div>

    <div class="relative z-20 max-w-2xl mx-auto text-center" ref="el">
      <!-- Top flourish -->
      <div class="transition-all duration-700 mb-6"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'">
        <span class="font-script text-champ-light text-4xl sm:text-5xl">❦</span>
      </div>

      <!-- Thank you heading -->
      <div class="transition-all duration-700 mb-5"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
        :style="{ transitionDelay: '200ms' }">
        <p class="font-sans text-champ-light/75 text-[11px] sm:text-xs tracking-[0.4em] uppercase mb-3 font-medium">—
          Lời Tri Ân —</p>
        <h2 class="font-serif text-white text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide">{{
          config.thankYou.title }}</h2>
      </div>

      <!-- Gold divider -->
      <div class="flex items-center justify-center gap-3 my-6 sm:my-8 transition-all duration-700"
        :class="isVisible ? 'opacity-100' : 'opacity-0'" :style="{ transitionDelay: '350ms' }">
        <div class="h-px w-12 sm:w-16 bg-champ/50"></div>
        <div class="w-1.5 h-1.5 rotate-45 bg-champ"></div>
        <div class="h-px w-12 sm:w-16 bg-champ/50"></div>
      </div>

      <!-- Quote -->
      <div class="transition-all duration-700"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
        :style="{ transitionDelay: '450ms' }">
        <blockquote
          class="font-serif italic text-white/85 text-sm sm:text-base md:text-lg leading-relaxed mb-8 px-2 sm:px-6">
          "{{ config.thankYou.quote }}"
        </blockquote>

        <!-- Signature -->
        <div class="flex flex-col items-center gap-2.5">
          <div class="h-px w-20 bg-champ/40"></div>
          <p class="font-script text-champ-light text-3xl sm:text-4xl px-4">{{ config.thankYou.signatures }}</p>
          <div class="h-px w-20 bg-champ/40"></div>
        </div>

        <!-- Luxury decorative gold hearts -->
        <div class="flex justify-center items-center gap-2 mt-8 opacity-70">
          <svg v-for="i in 3" :key="i" class="w-3.5 h-3.5 text-champ-light animate-pulse-slow"
            :style="{ animationDelay: `${i * 0.3}s` }" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>

      <!-- Footer note -->
      <div class="transition-all duration-700 mt-12 sm:mt-16"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
        :style="{ transitionDelay: '600ms' }">
        <p class="font-sans text-white/40 text-[11px] sm:text-xs tracking-wider">
          Thúy Phương &amp; Trung Kiên · {{ config.general.weddingDateFormatted }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useIntersectionObserver } from '@/composables/useIntersection.js'

defineProps({ config: { type: Object, required: true } })
const { el, isVisible } = useIntersectionObserver({ threshold: 0.1 })
</script>
