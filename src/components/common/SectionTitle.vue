<template>
  <div class="relative w-full" :class="className">
    <div class="flex items-center gap-3">
      <div class="flex-1 h-px bg-gradient-to-r from-transparent via-champ/50 to-champ/40"></div>
      <span class="text-champ/60 text-base select-none leading-none">❧</span>
      <div class="shrink-0 text-center px-2">
        <p v-if="subtitle" class="font-script text-champ text-base tracking-widest mb-1 leading-tight">{{ subtitle }}</p>
        <h2 class="font-serif text-brown font-semibold tracking-wide" :class="sizeClass">{{ title }}</h2>
      </div>
      <span class="text-champ/60 text-base select-none leading-none">❦</span>
      <div class="flex-1 h-px bg-gradient-to-l from-transparent via-champ/50 to-champ/40"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title:    { type: String, required: true },
  subtitle: { type: String, default: '' },
  size:     { type: String, default: 'md' },
  className:{ type: String, default: '' },
})
const sizeClasses = { sm:'text-xl md:text-2xl', md:'text-2xl md:text-3xl', lg:'text-3xl md:text-4xl' }
const sizeClass = sizeClasses[props.size] || sizeClasses.md
</script>
