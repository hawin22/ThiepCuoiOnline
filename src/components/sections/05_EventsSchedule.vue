<template>
  <section class="py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden" style="background-color:#F8F5EF;">
    <!-- Faint pattern -->
    <div class="absolute inset-0 opacity-[0.025]"
      style="background-image:radial-gradient(circle,#C7A878 1px,transparent 1px);background-size:36px 36px;">
    </div>

    <div class="max-w-xl mx-auto relative z-10" ref="el">
      <!-- Section label -->
      <div class="text-center mb-12 md:mb-16 transition-all duration-700"
        :class="isVisible?'opacity-100 translate-y-0':'opacity-0 translate-y-8'">
        <p class="font-sans text-champ text-[11px] md:text-xs tracking-[0.35em] uppercase mb-1.5 font-medium">Wedding Program</p>
        <h2 class="font-serif text-brown font-bold text-2xl sm:text-3xl tracking-wide">Lịch Trình Ngày Cưới</h2>
        <div class="flex items-center justify-center gap-3 mt-3.5">
          <div class="h-px w-10 bg-champ/40"></div>
          <span class="text-champ text-xs md:text-sm">✦</span>
          <div class="h-px w-10 bg-champ/40"></div>
        </div>
      </div>

      <!-- Events -->
      <div class="space-y-0">
        <div
          v-for="(event, i) in config.events"
          :key="event.id"
        >
          <!-- Event block -->
          <div
            class="text-center py-8 sm:py-10 px-2 sm:px-4 transition-all duration-700"
            :class="isVisible?'opacity-100 translate-y-0':'opacity-0 translate-y-8'"
            :style="{transitionDelay:`${i*200}ms`}"
          >
            <!-- Type badge -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full mb-4 sm:mb-5 border border-champ/40 bg-champ/10">
              <span class="w-1.5 h-1.5 rounded-full bg-champ"></span>
              <span class="font-sans text-champ-dark text-[11px] sm:text-xs tracking-[0.25em] uppercase font-semibold">
                {{ event.type }}
              </span>
              <span class="w-1.5 h-1.5 rounded-full bg-champ"></span>
            </div>

            <!-- Time (large, with luxury vintage clock icon) -->
            <div class="flex items-center justify-center gap-2 mb-4 sm:mb-5">
              <svg class="w-5 h-5 text-champ/80" fill="none" stroke="currentColor" stroke-width="1.4" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9"/>
                <path stroke-linecap="round" d="M12 7v5l3 3"/>
              </svg>
              <p class="font-serif text-brown text-3xl sm:text-4xl md:text-5xl font-light tracking-wider">
                {{ event.time }}
              </p>
            </div>

            <!-- Day-of-week | DATE NUMBER | MONTH row -->
            <div class="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 mb-3 sm:mb-4">
              <span class="font-sans text-brown/60 text-[11px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase font-medium">
                {{ event.dayOfWeek }}
              </span>
              <span class="font-serif text-brown font-bold" style="font-size:clamp(2.8rem,9vw,4.5rem);line-height:1;">
                {{ event.day }}
              </span>
              <span class="font-sans text-brown/60 text-[11px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase font-medium">
                {{ event.month }}
              </span>
            </div>

            <!-- Year -->
            <p class="font-sans text-brown/50 text-xs sm:text-sm tracking-[0.4em] mb-3 sm:mb-4">{{ event.year }}</p>

            <!-- Lunar date italic -->
            <p class="font-serif italic text-brown/50 text-xs sm:text-sm mb-5 sm:mb-6">({{ event.lunarDate }})</p>

            <!-- Location + Map link -->
            <div class="inline-flex flex-col items-center gap-1.5 max-w-sm mx-auto">
              <p class="font-sans text-brown/80 text-sm sm:text-base font-semibold">{{ event.location }}</p>
              <p class="font-sans text-brown/55 text-xs sm:text-sm leading-relaxed text-center px-4">{{ event.address }}</p>
              <a
                :href="event.mapLink"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-2.5 inline-flex items-center gap-1.5 font-sans text-xs text-champ-dark border border-champ/50 px-4 py-1.5 rounded-full hover:bg-champ hover:text-white transition-all duration-300 active:scale-95 shadow-sm"
              >
                <!-- Luxury location map pin -->
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                </svg>
                <span>Xem vị trí trên bản đồ</span>
              </a>
            </div>
          </div>

          <!-- Divider between events -->
          <div
            v-if="i < config.events.length - 1"
            class="flex items-center justify-center gap-4 py-2"
          >
            <div class="h-px flex-1 max-w-[60px] sm:max-w-[80px] bg-champ/25"></div>
            <span class="text-champ/50 text-xs sm:text-sm">❦</span>
            <div class="h-px flex-1 max-w-[60px] sm:max-w-[80px] bg-champ/25"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useIntersectionObserver } from '@/composables/useIntersection.js'
defineProps({ config: { type: Object, required: true } })
const { el, isVisible } = useIntersectionObserver()
</script>
