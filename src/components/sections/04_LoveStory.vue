<template>
  <section class="py-24 px-6 bg-ivory-100 relative overflow-hidden">
    <!-- Background monogram watermark -->
    <div class="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none select-none">
      <span class="font-script text-charcoal" style="font-size: 60vw; line-height: 1;">❤</span>
    </div>

    <div class="max-w-3xl mx-auto relative z-10" ref="el">
      <!-- Title -->
      <div class="text-center mb-16 transition-all duration-700"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">
        <SectionTitle title="Chuyện Tình Chúng Mình" subtitle="Love Story" />
      </div>

      <!-- Timeline -->
      <div class="relative">
        <!-- Center vertical line -->
        <div class="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-400/50 to-transparent hidden md:block"></div>

        <div
          v-for="(milestone, i) in config.loveStory"
          :key="milestone.year"
          class="relative flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-16 last:mb-0 transition-all duration-700"
          :class="[
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
            i % 2 === 0 ? '' : 'md:flex-row-reverse'
          ]"
          :style="{ transitionDelay: `${i * 180}ms` }"
        >
          <!-- Image side -->
          <div class="w-full md:w-5/12 group">
            <div class="relative overflow-hidden rounded-sm shadow-soft-card border border-gold-200/50">
              <img
                :src="milestone.image"
                :alt="milestone.title"
                class="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent"></div>
              <!-- Year tag -->
              <div class="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-gold-300 font-serif text-sm font-semibold px-3 py-1 rounded-full border border-gold-500/40">
                {{ milestone.year }}
              </div>
            </div>
          </div>

          <!-- Center dot (desktop) -->
          <div class="hidden md:flex w-2/12 justify-center">
            <div class="relative">
              <div class="w-5 h-5 rounded-full bg-gold-400 border-2 border-white shadow-gold-glow z-10"></div>
              <div class="absolute inset-0 rounded-full bg-gold-400/40 scale-150 animate-pulse-slow"></div>
            </div>
          </div>

          <!-- Mobile dot -->
          <div class="md:hidden flex items-center gap-3 w-full">
            <div class="flex-1 h-px bg-gold-300/50"></div>
            <div class="w-3 h-3 rounded-full bg-gold-400"></div>
            <div class="flex-1 h-px bg-gold-300/50"></div>
          </div>

          <!-- Text side -->
          <div class="w-full md:w-5/12 text-center md:text-left" :class="i % 2 === 1 ? 'md:text-right' : ''">
            <p class="font-script text-gold-500 text-xl mb-1">{{ milestone.year }}</p>
            <h3 class="font-serif text-charcoal text-xl font-semibold mb-3">{{ milestone.title }}</h3>
            <p class="font-sans text-charcoal-muted text-sm leading-relaxed">{{ milestone.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useIntersectionObserver } from '@/composables/useIntersection.js'
import SectionTitle from '@/components/common/SectionTitle.vue'

defineProps({ config: { type: Object, required: true } })
const { el, isVisible } = useIntersectionObserver({ threshold: 0.05 })
</script>

