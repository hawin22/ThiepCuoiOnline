<template>
  <section class="relative py-16 md:py-24 px-4 sm:px-6 overflow-hidden" style="background-color:#F8F5EF;">
    <!-- Faint watermark P&K -->
    <div class="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
      <span class="font-script text-brown" style="font-size:clamp(160px,38vw,420px);line-height:1;">P&amp;K</span>
    </div>

    <div class="max-w-2xl mx-auto relative z-10" ref="el">

      <!-- ── TOP LABEL ─────────────────────────────────────── -->
      <div class="text-center mb-8 md:mb-12 transition-all duration-700"
        :class="isVisible?'opacity-100 translate-y-0':'opacity-0 -translate-y-4'">
        <p class="font-sans text-champ text-[11px] md:text-xs tracking-[0.35em] uppercase mb-1.5 font-medium">Wedding Info</p>
        <h2 class="font-serif text-brown font-bold text-2xl md:text-3xl tracking-widest uppercase">Thông Tin Lễ Cưới</h2>
        <div class="flex items-center justify-center gap-3 mt-3.5">
          <div class="h-px w-10 md:w-14 bg-champ/40"></div>
          <span class="text-champ text-xs md:text-sm">✦</span>
          <div class="h-px w-10 md:w-14 bg-champ/40"></div>
        </div>
      </div>

      <!-- ── TWO FAMILY COLUMNS ────────────────────────────── -->
      <div
        class="grid grid-cols-2 gap-3 sm:gap-6 mb-10 md:mb-12 transition-all duration-700"
        :class="isVisible?'opacity-100 translate-y-0':'opacity-0 translate-y-6'"
        :style="{transitionDelay:'150ms'}"
      >
        <!-- Nhà Gái (bride) – LEFT -->
        <div class="text-center pr-3 sm:pr-6 border-r border-champ/30 py-2 sm:py-4">
          <p class="font-sans text-brown/50 text-[10px] sm:text-xs tracking-widest mb-2 sm:mb-2.5 uppercase font-medium">Nhà Gái · Ông &amp; Bà</p>
          <p class="font-serif text-brown font-semibold text-sm sm:text-base md:text-lg leading-snug">{{ config.invitation.bride.father }}</p>
          <p class="font-serif text-brown font-semibold text-sm sm:text-base md:text-lg leading-snug mt-0.5">{{ config.invitation.bride.mother }}</p>
          <p class="font-sans text-brown/55 text-[11px] sm:text-xs mt-2 sm:mt-2.5 leading-relaxed">{{ config.invitation.bride.address }}</p>
        </div>
        <!-- Nhà Trai (groom) – RIGHT -->
        <div class="text-center pl-3 sm:pl-6 py-2 sm:py-4">
          <p class="font-sans text-brown/50 text-[10px] sm:text-xs tracking-widest mb-2 sm:mb-2.5 uppercase font-medium">Nhà Trai · Ông &amp; Bà</p>
          <p class="font-serif text-brown font-semibold text-sm sm:text-base md:text-lg leading-snug">{{ config.invitation.groom.father }}</p>
          <p class="font-serif text-brown font-semibold text-sm sm:text-base md:text-lg leading-snug mt-0.5">{{ config.invitation.groom.mother }}</p>
          <p class="font-sans text-brown/55 text-[11px] sm:text-xs mt-2 sm:mt-2.5 leading-relaxed">{{ config.invitation.groom.address }}</p>
        </div>
      </div>

      <!-- ── TRÂN TRỌNG BÁO TIN ──────────────────────────── -->
      <div
        class="text-center mb-6 md:mb-8 transition-all duration-700"
        :class="isVisible?'opacity-100 translate-y-0':'opacity-0 translate-y-4'"
        :style="{transitionDelay:'280ms'}"
      >
        <p class="font-sans text-brown/60 text-[11px] sm:text-xs tracking-[0.25em] uppercase mb-1">Trân Trọng Báo Tin</p>
        <p class="font-sans text-brown/50 text-[10px] sm:text-xs tracking-[0.18em] uppercase">Lễ Thành Hôn Của Con Chúng Tôi</p>
      </div>

      <!-- ── BRIDE NAME (first / left) ──────────────────── -->
      <div
        class="text-center transition-all duration-700 px-2"
        :class="isVisible?'opacity-100 translate-y-0':'opacity-0 translate-y-6'"
        :style="{transitionDelay:'400ms'}"
      >
        <h3 class="font-script text-rose leading-tight" style="font-size:clamp(2rem,7vw,3.5rem);">
          {{ config.invitation.bride.fullName }}
        </h3>
        <p class="font-sans text-brown/45 text-[10px] sm:text-xs tracking-[0.3em] uppercase mt-1">{{ config.invitation.bride.rank }}</p>
      </div>

      <!-- ── Ampersand ─────────────────────────────────── -->
      <div class="text-center my-3 sm:my-4 transition-all duration-500"
        :class="isVisible?'opacity-100':'opacity-0'"
        :style="{transitionDelay:'500ms'}">
        <span class="font-script text-champ text-3xl sm:text-4xl">&amp;</span>
      </div>

      <!-- ── GROOM NAME (second / right) ───────────────── -->
      <div
        class="text-center transition-all duration-700 px-2"
        :class="isVisible?'opacity-100 translate-y-0':'opacity-0 translate-y-6'"
        :style="{transitionDelay:'600ms'}"
      >
        <h3 class="font-script text-rose leading-tight" style="font-size:clamp(2rem,7vw,3.5rem);">
          {{ config.invitation.groom.fullName }}
        </h3>
        <p class="font-sans text-brown/45 text-[10px] sm:text-xs tracking-[0.3em] uppercase mt-1">{{ config.invitation.groom.rank }}</p>
      </div>

      <!-- ── Divider ───────────────────────────────────── -->
      <div class="flex items-center justify-center gap-3 my-8 md:my-10 transition-all duration-500"
        :class="isVisible?'opacity-100':'opacity-0'"
        :style="{transitionDelay:'700ms'}">
        <div class="h-px flex-1 max-w-[50px] sm:max-w-[70px] bg-champ/35"></div>
        <svg class="w-4 h-4 text-champ/60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <div class="h-px flex-1 max-w-[50px] sm:max-w-[70px] bg-champ/35"></div>
      </div>

      <!-- ── WEDDING INVITATION (ĐÃ BỎ KÍNH GỬI, THÊM ĐẾN CHUNG VUI...) ────────────────── -->
      <div
        class="text-center transition-all duration-700"
        :class="isVisible?'opacity-100 translate-y-0':'opacity-0 translate-y-4'"
        :style="{transitionDelay:'800ms'}"
      >
        <p class="font-sans text-champ text-[10px] sm:text-xs tracking-[0.35em] uppercase mb-2 font-medium">Wedding Invitation</p>
        <p class="font-serif text-brown text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide">
          {{ config.invitation.inviteText }}
        </p>
        <!-- Dòng mới thay thế chỗ kính gửi theo yêu cầu -->
        <p class="font-serif italic text-brown/75 text-base sm:text-lg md:text-xl mt-3 tracking-wide">
          Đến chung vui cùng gia đình chúng tôi
        </p>

        <!-- Họa tiết hoa văn kết thúc trang trọng -->
        <div class="flex items-center justify-center gap-2 mt-6 opacity-60">
          <span class="w-1.5 h-1.5 rounded-full bg-champ"></span>
          <span class="w-8 h-px bg-champ"></span>
          <svg class="w-3.5 h-3.5 text-champ" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18m9-9H3"/>
          </svg>
          <span class="w-8 h-px bg-champ"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-champ"></span>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { useIntersectionObserver } from '@/composables/useIntersection.js'
defineProps({
  config: { type: Object, required: true },
})
const { el, isVisible } = useIntersectionObserver()
</script>
