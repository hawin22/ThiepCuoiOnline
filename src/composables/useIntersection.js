import { ref, onMounted, onUnmounted } from 'vue'

export function useIntersectionObserver(options = {}) {
  const isVisible = ref(false)
  const el = ref(null)
  let observer = null

  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          // Once visible, no need to keep observing
          if (el.value) observer.unobserve(el.value)
        }
      },
      { threshold: 0.15, ...options }
    )
    if (el.value) observer.observe(el.value)
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { el, isVisible }
}

