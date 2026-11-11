import { ref, onMounted, onUnmounted } from 'vue'

export function useAutoScroll() {
  const isScrolling = ref(false)
  const scrollSpeed = ref(1.2) // px per frame
  let rafId = null
  let userTouched = false

  function step() {
    if (!isScrolling.value || userTouched) {
      isScrolling.value = false
      return
    }
    window.scrollBy({ top: scrollSpeed.value, behavior: 'instant' })
    // Stop at bottom
    const atBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
    if (atBottom) {
      isScrolling.value = false
      return
    }
    rafId = requestAnimationFrame(step)
  }

  function startScroll() {
    userTouched = false
    isScrolling.value = true
    rafId = requestAnimationFrame(step)
  }

  function stopScroll() {
    isScrolling.value = false
    if (rafId) cancelAnimationFrame(rafId)
  }

  function toggleScroll() {
    if (isScrolling.value) stopScroll()
    else startScroll()
  }

  function handleUserTouch() {
    if (isScrolling.value) {
      userTouched = true
      stopScroll()
    }
  }

  onMounted(() => {
    window.addEventListener('touchstart', handleUserTouch, { passive: true })
    window.addEventListener('wheel', handleUserTouch, { passive: true })
    window.addEventListener('keydown', handleUserTouch)
  })

  onUnmounted(() => {
    stopScroll()
    window.removeEventListener('touchstart', handleUserTouch)
    window.removeEventListener('wheel', handleUserTouch)
    window.removeEventListener('keydown', handleUserTouch)
  })

  return { isScrolling, toggleScroll, startScroll, stopScroll }
}

