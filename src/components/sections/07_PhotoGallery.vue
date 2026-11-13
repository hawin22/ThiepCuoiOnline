<template>
  <section class="relative overflow-hidden" style="background:#3e352f;">

    <!-- ── Ambient background: Tối ưu GPU bằng gradient + mờ nhẹ, không gây giật lag ── -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="w-full h-full"
        style="background: radial-gradient(ellipse at center, #5a4d44 0%, #3e352f 65%, #2a231f 100%);"
      ></div>
    </div>

    <!-- ── Title overlay top ───────────────────────────────── -->
    <div class="absolute top-0 inset-x-0 z-30 pt-5 pb-6 px-4 text-center pointer-events-none"
      style="background: linear-gradient(to bottom, rgba(62,53,47,0.95) 0%, transparent 100%);">
      <p class="font-sans text-[11px] md:text-xs tracking-[0.4em] uppercase mb-1 font-medium" style="color:rgba(199,168,120,0.85);">
        Wedding Gallery
      </p>
      <h2 class="font-serif font-semibold text-2xl sm:text-3xl" style="color:#F8F5EF;">
        Album Ảnh Cưới
      </h2>
      <div class="flex items-center justify-center gap-3 mt-2">
        <div class="h-px w-8 sm:w-12" style="background:rgba(199,168,120,0.4);"></div>
        <span style="color:rgba(199,168,120,0.6); font-size:11px;">✦</span>
        <div class="h-px w-8 sm:w-12" style="background:rgba(199,168,120,0.4);"></div>
      </div>
    </div>

    <!-- ── Main 3-Card Stage (Tối ưu siêu mượt, preloaded trong RAM) ── -->
    <div
      class="relative overflow-hidden w-full select-none"
      style="height:clamp(580px, 92vh, 960px);"
      ref="el"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <!-- Cards track: Trải rộng không giới hạn padding, ảnh to tối đa -->
      <div class="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          v-for="(photo, i) in config.gallery"
          :key="photo.url"
          class="gallery-card absolute h-[76%] sm:h-[80%] md:h-[84%] max-h-[780px] w-auto flex items-center justify-center select-none"
          :style="getCardStyle(i)"
          @click="onCardClick(i)"
        >
          <div
            class="relative w-auto h-full flex items-center justify-center rounded-xl overflow-hidden"
            :style="getDiff(i) === 0
              ? 'box-shadow: 0 25px 60px rgba(0,0,0,0.65); border: 2px solid rgba(199,168,120,0.45);'
              : 'box-shadow: 0 12px 30px rgba(0,0,0,0.4);'"
          >
            <img
              :src="photo.url"
              :alt="photo.title"
              decoding="async"
              class="max-w-full max-h-full w-auto h-auto object-contain rounded-xl select-none"
              draggable="false"
            />
          </div>
        </div>
      </div>

      <!-- Gradient vignette top & bottom -->
      <div class="absolute inset-0 pointer-events-none z-10"
        style="background: linear-gradient(to top, rgba(62,53,47,0.92) 0%, transparent 18%, transparent 82%, rgba(62,53,47,0.7) 100%);">
      </div>

      <!-- Bottom caption + controls -->
      <div class="absolute bottom-0 inset-x-0 z-20 pb-4 pt-10 px-4 sm:px-6 pointer-events-none"
        style="background: linear-gradient(to top, rgba(62,53,47,0.96) 0%, transparent 100%);">

        <!-- Caption -->
        <div class="text-center mb-2.5">
          <p class="font-script text-xl sm:text-2xl mb-0.5 drop-shadow"
            style="color:#F8F5EF;">
            {{ config.gallery[current]?.title }}
          </p>
          <p class="font-sans text-[11px] sm:text-xs" style="color:rgba(199,168,120,0.75);">
            {{ current + 1 }}&nbsp;/&nbsp;{{ config.gallery.length }}
          </p>
        </div>

        <!-- Dot indicators -->
        <div class="flex items-center justify-center gap-1.5 sm:gap-2 pointer-events-auto">
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
        title="Xem ảnh trước"
        class="absolute left-2.5 sm:left-5 md:left-7 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style="background:rgba(248,245,239,0.22); border:1.5px solid rgba(199,168,120,0.6); backdrop-filter:blur(8px); box-shadow:0 6px 20px rgba(0,0,0,0.4);">
        <svg class="w-5 h-5 text-cream" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
        </svg>
      </button>

      <!-- Luxury Next arrow -->
      <button @click="next"
        title="Xem ảnh tiếp theo"
        class="absolute right-2.5 sm:right-5 md:right-7 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style="background:rgba(248,245,239,0.22); border:1.5px solid rgba(199,168,120,0.6); backdrop-filter:blur(8px); box-shadow:0 6px 20px rgba(0,0,0,0.4);">
        <svg class="w-5 h-5 text-cream" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
        </svg>
      </button>

      <!-- Auto-play pill -->
      <button @click="toggleAutoPlay"
        class="absolute top-16 right-3 sm:right-6 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 active:scale-95"
        style="background:rgba(248,245,239,0.15); border:1px solid rgba(199,168,120,0.4); backdrop-filter:blur(8px);">
        <svg v-if="!autoPlay" class="w-3 h-3 text-champ" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/>
        </svg>
        <svg v-else class="w-3 h-3 text-champ" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"/>
        </svg>
        <span class="font-sans text-[11px]" style="color:rgba(248,245,239,0.9);">
          {{ autoPlay ? 'Tự chuyển' : 'Tạm dừng' }}
        </span>
      </button>
    </div>

    <!-- ── Thumbnail filmstrip ─────────────────────────────── -->
    <div class="flex gap-2 p-3 overflow-x-auto justify-center"
      style="background:#2a231f; scrollbar-width:none;">
      <button v-for="(photo, i) in config.gallery" :key="i"
        @click="goTo(i)"
        class="shrink-0 overflow-hidden transition-all duration-300 rounded-sm"
        :style="current === i
          ? 'width:4.8rem; height:3.2rem; outline:2px solid #C7A878; outline-offset:2px; opacity:1; transform:scale(1.05);'
          : 'width:4.8rem; height:3.2rem; outline:none; opacity:0.45;'"
      >
        <img :src="photo.url" :alt="photo.title" loading="lazy" decoding="async" class="w-full h-full object-cover" />
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
const isDesktop = ref(false)
let timer = null

const INTERVAL = 4500

function checkScreen() {
  if (typeof window !== 'undefined') {
    isDesktop.value = window.innerWidth >= 768
  }
}

function getDiff(i) {
  const n = props.config.gallery.length
  if (n <= 1) return 0
  let d = (i - current.value) % n
  if (d > n / 2) d -= n
  if (d < -n / 2) d += n
  return d
}

function getCardStyle(i) {
  const diff = getDiff(i)

  // ── KHỔ DỌC (Mobile / Tablet < 768px): Hiển thị 1 ảnh chính to ở giữa ──
  if (!isDesktop.value) {
    if (diff === 0) {
      return {
        transform: 'translate3d(0, 0, 0) scale(1)',
        opacity: 1,
        zIndex: 20,
        pointerEvents: 'auto',
        transition: 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1), opacity 350ms ease',
      }
    }
    return {
      transform: `translate3d(${diff > 0 ? '100%' : '-100%'}, 0, 0) scale(0.9)`,
      opacity: 0,
      zIndex: 0,
      pointerEvents: 'none',
      transition: 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1), opacity 350ms ease',
    }
  }

  // ── KHỔ NGANG (Laptop / Desktop >= 768px): Bố cục 3 ảnh lớn trải đều sang 2 bên ──
  if (diff === 0) {
    // Ảnh chính ở giữa (Rất to, sắc nét, đứng đầu zIndex)
    return {
      transform: 'translate3d(0, 0, 0) scale(1)',
      opacity: 1,
      zIndex: 20,
      cursor: 'default',
      pointerEvents: 'auto',
      transition: 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1), opacity 400ms ease',
    }
  }

  if (diff === -1) {
    // Ảnh bên trái (To bằng 92% ảnh giữa, đẩy sát ra ngoài 32vw)
    return {
      transform: 'translate3d(-32vw, 0, 0) scale(0.92)',
      opacity: 0.52,
      zIndex: 10,
      cursor: 'pointer',
      pointerEvents: 'auto',
      transition: 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1), opacity 400ms ease',
    }
  }

  if (diff === 1) {
    // Ảnh bên phải (To bằng 92% ảnh giữa, đẩy sát ra ngoài 32vw)
    return {
      transform: 'translate3d(32vw, 0, 0) scale(0.92)',
      opacity: 0.52,
      zIndex: 10,
      cursor: 'pointer',
      pointerEvents: 'auto',
      transition: 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1), opacity 400ms ease',
    }
  }

  // Các ảnh xa hơn nằm ẩn phía ngoài sân khấu
  return {
    transform: `translate3d(${diff > 0 ? '60vw' : '-60vw'}, 0, 0) scale(0.7)`,
    opacity: 0,
    zIndex: -1,
    pointerEvents: 'none',
    transition: 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1), opacity 400ms ease',
  }
}

function onCardClick(i) {
  const diff = getDiff(i)
  if (diff === -1) {
    prev()
    restartAuto()
  } else if (diff === 1) {
    next()
    restartAuto()
  }
}

function next()  {
  current.value = (current.value + 1) % props.config.gallery.length
}

function prev()  {
  current.value = (current.value - 1 + props.config.gallery.length) % props.config.gallery.length
}

function goTo(i) {
  current.value = i
  restartAuto()
}

function startAuto()  {
  stopAuto()
  timer = setInterval(next, INTERVAL)
}

function stopAuto()   {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function restartAuto(){
  if (autoPlay.value) startAuto()
}

function toggleAutoPlay() {
  autoPlay.value = !autoPlay.value
  if (autoPlay.value) startAuto()
  else stopAuto()
}

// ── Preload toàn bộ ảnh gallery vào bộ nhớ đệm (RAM) để chuyển ảnh tức thì ──
function preloadAllGalleryImages() {
  if (typeof window === 'undefined' || !props.config.gallery) return
  props.config.gallery.forEach((photo) => {
    if (photo?.url) {
      const img = new Image()
      img.src = photo.url
    }
  })
}

// ── Touch swipe support for mobile ──
let touchStartX = 0
let touchEndX = 0

function handleTouchStart(e) {
  if (e.changedTouches?.[0]) {
    touchStartX = e.changedTouches[0].screenX
  }
}

function handleTouchEnd(e) {
  if (e.changedTouches?.[0]) {
    touchEndX = e.changedTouches[0].screenX
    const delta = touchStartX - touchEndX
    if (delta > 40) {
      next()
      restartAuto()
    } else if (delta < -40) {
      prev()
      restartAuto()
    }
  }
}

onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
  preloadAllGalleryImages()
  startAuto()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
  stopAuto()
})
</script>

<style scoped>
.gallery-card {
  will-change: transform, opacity;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

/* Hover effect on side cards */
@media (min-width: 768px) {
  .gallery-card:hover {
    opacity: 0.88 !important;
  }
}
</style>
