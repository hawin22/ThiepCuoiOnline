<template>
  <section class="py-20 md:py-24 px-4 sm:px-6 relative overflow-hidden" style="background:linear-gradient(160deg,#2e251f 0%,#3d2d1a 50%,#1e1710 100%);">
    <!-- Gold bokeh overlay -->
    <div class="absolute inset-0 opacity-15 pointer-events-none"
      style="background:radial-gradient(circle at 20% 50%,rgba(199,168,120,0.7) 0%,transparent 50%),radial-gradient(circle at 80% 50%,rgba(199,168,120,0.5) 0%,transparent 50%);">
    </div>

    <div class="max-w-3xl mx-auto relative z-10 text-center" ref="el">
      <!-- Label -->
      <div class="mb-10 sm:mb-14 transition-all duration-700"
        :class="isVisible?'opacity-100 translate-y-0':'opacity-0 translate-y-8'">
        <p class="font-script text-champ/80 text-xl sm:text-2xl mb-2">{{ config.countdown.subtitle }}</p>
        <h2 class="font-serif text-cream text-lg sm:text-xl md:text-2xl font-medium tracking-wide">{{ config.countdown.title }}</h2>
      </div>

      <!-- Countdown boxes — Single row on all devices without wrapping -->
      <div
        class="flex items-center justify-center gap-1.5 sm:gap-3 md:gap-5 transition-all duration-700 max-w-full"
        :class="isVisible?'opacity-100 scale-100':'opacity-0 scale-95'"
        :style="{transitionDelay:'250ms'}"
      >
        <CountBlock :value="timeLeft.days"    label="Ngày" />
        <Sep />
        <CountBlock :value="timeLeft.hours"   label="Giờ" />
        <Sep />
        <CountBlock :value="timeLeft.minutes" label="Phút" />
        <Sep />
        <CountBlock :value="timeLeft.seconds" label="Giây" />
      </div>

      <!-- Date pill -->
      <div class="mt-10 sm:mt-14 transition-all duration-700 px-2"
        :class="isVisible?'opacity-100 translate-y-0':'opacity-0 translate-y-4'"
        :style="{transitionDelay:'400ms'}">
        <div class="inline-flex items-center gap-2 sm:gap-3 border border-champ/40 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 bg-white/5 backdrop-blur-sm max-w-full">
          <span class="text-champ/70 text-xs sm:text-sm">✦</span>
          <span class="font-serif text-champ-light/85 text-xs sm:text-sm md:text-base truncate">{{ config.general.weddingDateFormatted }}</span>
          <span class="text-champ/70 text-xs sm:text-sm">✦</span>
        </div>
      </div>

      <!-- Done message -->
      <Transition name="fade">
        <div v-if="isDone" class="mt-10">
          <p class="font-script text-champ text-3xl sm:text-4xl animate-float">🎊 Hôm nay là ngày trọng đại! 🎊</p>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineComponent, h } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersection.js'

const props = defineProps({ config: { type: Object, required: true } })
const { el, isVisible } = useIntersectionObserver({ threshold: 0.1 })

const now = ref(new Date())
let timer = null
onMounted(() => { timer = setInterval(() => { now.value = new Date() }, 1000) })
onUnmounted(() => clearInterval(timer))

const target = computed(() => new Date(props.config.countdown.targetDate))
const timeLeft = computed(() => {
  const diff = Math.max(0, target.value - now.value)
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  }
})
const isDone = computed(() =>
  timeLeft.value.days + timeLeft.value.hours + timeLeft.value.minutes + timeLeft.value.seconds === 0
)

const CountBlock = defineComponent({
  props: ['value', 'label'],
  setup(p) {
    return () => h('div', { class: 'flex flex-col items-center flex-1 max-w-[80px] sm:max-w-[96px]' }, [
      h('div', {
        class: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-md bg-white/6 border border-champ/30 backdrop-blur-sm flex items-center justify-center shadow-champ-glow'
      }, [
        h('span', {
          class: 'font-serif text-cream text-2xl sm:text-3xl md:text-4xl font-semibold tabular-nums'
        }, String(p.value).padStart(2, '0'))
      ]),
      h('span', { class: 'font-sans text-champ/70 text-[10px] sm:text-xs tracking-widest uppercase mt-2 font-medium' }, p.label)
    ])
  }
})

const Sep = defineComponent({
  setup() {
    return () => h('span', { class: 'font-serif text-champ/50 text-xl sm:text-3xl md:text-4xl font-thin animate-pulse-slow pb-5 select-none' }, ':')
  }
})
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{transition:opacity .5s ease;}
.fade-enter-from,.fade-leave-to{opacity:0;}
</style>
