<template>
  <section class="py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden" style="background-color:#E8DED0;">
    <!-- Dot pattern -->
    <div class="absolute inset-0 opacity-[0.03]"
      style="background-image:radial-gradient(circle,#51463F 1px,transparent 1px);background-size:28px 28px;">
    </div>

    <div class="max-w-4xl mx-auto relative z-10" ref="el">
      <!-- Title -->
      <div class="text-center mb-12 md:mb-16 transition-all duration-700"
        :class="isVisible?'opacity-100 translate-y-0':'opacity-0 translate-y-8'">
        <SectionTitle title="Cô Dâu & Chú Rể" subtitle="Hai trái tim — một hành trình" />
      </div>

      <!-- Couple cards: BRIDE LEFT — GROOM RIGHT -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start max-w-xl md:max-w-none mx-auto">

        <!-- ── BRIDE card (LEFT) ───────────────────────── -->
        <div
          class="transition-all duration-1000"
          :class="isVisible?'opacity-100 translate-x-0':'opacity-0 -translate-x-12'"
          :style="{transitionDelay:'150ms'}"
        >
          <div class="text-center group">
            <!-- Oval portrait frame -->
            <div class="relative inline-block mb-5 sm:mb-6">
              <div class="relative w-44 h-56 sm:w-48 sm:h-60 md:w-52 md:h-64 mx-auto overflow-hidden border-4 border-champ/40 shadow-champ-glow"
                style="border-radius: 50% / 45%;">
                <img
                  :src="config.couple.bride.avatar"
                  :alt="config.couple.bride.fullName"
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-brown/30 to-transparent"></div>
              </div>
              <!-- Role badge -->
              <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 champ-gradient-bg text-white text-[11px] sm:text-xs font-sans font-semibold tracking-widest uppercase px-4 py-1 shadow-sm whitespace-nowrap rounded-sm">
                {{ config.couple.bride.role }}
              </div>
            </div>

            <h3 class="font-script text-brown mt-5 mb-1.5" style="font-size:clamp(1.7rem,5vw,2.2rem);">
              {{ config.couple.bride.fullName }}
            </h3>
            <p class="font-sans text-xs sm:text-sm text-brown/65 leading-relaxed max-w-xs mx-auto italic px-2">
              {{ config.couple.bride.bio }}
            </p>
          </div>
        </div>

        <!-- ── GROOM card (RIGHT) ─────────────────────── -->
        <div
          class="transition-all duration-1000"
          :class="isVisible?'opacity-100 translate-x-0':'opacity-0 translate-x-12'"
          :style="{transitionDelay:'300ms'}"
        >
          <div class="text-center group">
            <div class="relative inline-block mb-5 sm:mb-6">
              <div class="relative w-44 h-56 sm:w-48 sm:h-60 md:w-52 md:h-64 mx-auto overflow-hidden border-4 border-champ/40 shadow-champ-glow"
                style="border-radius: 50% / 45%;">
                <img
                  :src="config.couple.groom.avatar"
                  :alt="config.couple.groom.fullName"
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-brown/30 to-transparent"></div>
              </div>
              <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 champ-gradient-bg text-white text-[11px] sm:text-xs font-sans font-semibold tracking-widest uppercase px-4 py-1 shadow-sm whitespace-nowrap rounded-sm">
                {{ config.couple.groom.role }}
              </div>
            </div>

            <h3 class="font-script text-brown mt-5 mb-1.5" style="font-size:clamp(1.7rem,5vw,2.2rem);">
              {{ config.couple.groom.fullName }}
            </h3>
            <p class="font-sans text-xs sm:text-sm text-brown/65 leading-relaxed max-w-xs mx-auto italic px-2">
              {{ config.couple.groom.bio }}
            </p>
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
const { el, isVisible } = useIntersectionObserver()
</script>
