<template>
  <section class="relative overflow-hidden" style="background:#51463F;">

    <!-- ── Title overlay top ───────────────────────────────── -->
    <div class="absolute top-0 inset-x-0 z-20 pt-6 pb-12 px-4 text-center pointer-events-none"
      style="background: linear-gradient(to bottom, rgba(81,70,63,0.9) 0%, transparent 100%);">
      <p class="font-sans text-[11px] md:text-xs tracking-[0.4em] uppercase mb-1 font-medium" style="color:rgba(199,168,120,0.75);">
        Wedding Gallery
      </p>
      <h2 class="font-serif font-semibold text-2xl sm:text-3xl" style="color:#F8F5EF;">
        Album Ảnh Cưới
      </h2>
      <div class="flex items-center justify-center gap-3 mt-2.5">
        <div class="h-px w-8 sm:w-12" style="background:rgba(199,168,120,0.4);"></div>
        <span style="color:rgba(199,168,120,0.6); font-size:11px;">✦</span>
        <div class="h-px w-8 sm:w-12" style="background:rgba(199,168,120,0.4);"></div>
      </div>
    </div>

    <!-- ── Main cinematic slide frame (Responsive height) ─────────────────────── -->
    <div class="relative overflow-hidden w-full" style="height:clamp(460px, 80vh, 820px);" ref="el">

      <!-- Slides -->
      <div class="absolute inset-0">
        <TransitionGroup name="cinematic" tag="div" class="relative w-full h-full">
          <div v-for="(photo, i) in config.gallery"
            v-show="current === i"
            :key="photo.url"
            class="absolute inset-0">
            <!-- Ken-Burns animation layer -->
            <div class="w-full h-full"
              :class="current === i ? 'ken-active' : ''"
              style="will-change: transform;">
              <img :src="photo.url" :alt="photo.title"
                class="w-full h-full object-cover"
                style="transform-origin: center center;" />
            </div>
            <!-- Gradient vignette -->
            <div class="absolute inset-0 pointer-events-none"
              style="background: linear-gradient(to top, rgba(81,70,63,0.85) 0%, rgba(81,70,63,0.1) 40%, rgba(81,70,63,0.35) 100%);">
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Bottom caption + controls -->
      <div class="absolute bottom-0 inset-x-0 z-10 pb-5 pt-14 px-4 sm:px-6"
        style="background: linear-gradient(to top, rgba(81,70,63,0.92) 0%, transparent 100%);">

        <!-- Caption -->
        <div class="text-center mb-4">
          <p class="font-script text-xl sm:text-2xl mb-0.5 drop-shadow"
            style="color:#F8F5EF;">
            {{ config.gallery[current].title }}
          </p>
          <p class="font-sans text-[11px] sm:text-xs" style="color:rgba(199,168,120,0.7);">
            {{ current + 1 }}&nbsp;/&nbsp;{{ config.gallery.length }}
          </p>
        </div>

        <!-- Dot indicators -->
        <div class="flex items-center justify-center gap-1.5 sm:gap-2">
          <button v-for="(_, i) in config.gallery" :key="i"
            @click="goTo(i)"
            class="transition-all duration-300 rounded-full block"
            :style="current === i
              ? 'width:24px; height:4px; background:#C7A878;'
              : 'width:5px;  height:4px; background:rgba(248,245,239,0.3);'"
          ></button>
        </div>
      </div>

      <!-- Luxury Prev arrow -->
      <button @click="prev"
        class="absolute left-2.5 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style="background:rgba(248,245,239,0.1); border:1px solid rgba(199,168,120,0.35); backdrop-filter:blur(8px);">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-cream/80" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
        </svg>
      </button>

      <!-- Luxury Next arrow -->
      <button @click="next"
        class="absolute right-2.5 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style="background:rgba(248,245,239,0.1); border:1px solid rgba(199,168,120,0.35); backdrop-filter:blur(8px);">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-cream/80" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
        </svg>
      </button>

      <!-- Auto-play pill -->
      <button @click="toggleAutoPlay"
        class="absolute top-20 right-3 sm:right-5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 active:scale-95"
        style="background:rgba(248,245,239,0.1); border:1px solid rgba(199,168,120,0.3); backdrop-filter:blur(8px);">
        <svg v-if="!autoPlay" class="w-3 h-3 text-champ" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/>
        </svg>
        <svg v-else class="w-3 h-3 text-champ" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"/>
        </svg>
        <span class="font-sans text-[11px]" style="color:rgba(248,245,239,0.7);">
          {{ autoPlay ? 'Tự chuyển' : 'Tạm dừng' }}
        </span>
      </button>
    </div>

    <!-- ── Thumbnail filmstrip ─────────────────────────────── -->
    <div class="flex gap-1.5 p-2 overflow-x-auto justify-center"
      style="background:#3a2e28; scrollbar-width:none;">
      <button v-for="(photo, i) in config.gallery" :key="i"
        @click="goTo(i)"
        class="shrink-0 overflow-hidden transition-all duration-300 rounded-sm"
        :style="current === i
          ? 'width:4.5rem; height:3rem; outline:2px solid #C7A878; outline-offset:1px; opacity:1; transform:scale(1.05);'
          : 'width:4.5rem; height:3rem; outline:none; opacity:0.45;'"
      >
        <img :src="photo.url" :alt="photo.title" class="w-full h-full object-cover" />
      </button>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersection.js'

const props   = defineProps({ config: { type: Object, required: true } })
const { el }  = useIntersectionObserver({ threshold: 0.05 })

const current  = ref(0)
const autoPlay = ref(true)
let timer = null

const INTERVAL = 5000

function next()  { current.value = (current.value + 1) % props.config.gallery.length }
function prev()  { current.value = (current.value - 1 + props.config.gallery.length) % props.config.gallery.length }
function goTo(i) { current.value = i; restartAuto() }

function startAuto()  { stopAuto(); timer = setInterval(next, INTERVAL) }
function stopAuto()   { if (timer) { clearInterval(timer); timer = null } }
function restartAuto(){ if (autoPlay.value) startAuto() }
function toggleAutoPlay() {
  autoPlay.value = !autoPlay.value
  if (autoPlay.value) startAuto(); else stopAuto()
}

onMounted(startAuto)
onUnmounted(stopAuto)
</script>

<style scoped>
.cinematic-enter-active,
.cinematic-leave-active {
  transition: opacity 1.1s ease;
  position: absolute;
  inset: 0;
}
.cinematic-enter-from { opacity: 0; }
.cinematic-leave-to   { opacity: 0; }

.ken-active img {
  animation: kenBurns 6s ease-in-out forwards;
}
@keyframes kenBurns {
  0%   { transform: scale(1)    translate(0, 0); }
  100% { transform: scale(1.06) translate(-1.5%, -1%); }
}
</style>
