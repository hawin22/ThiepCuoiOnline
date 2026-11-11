<template>
  <!-- Cánh hoa rơi floating petals -->
  <canvas ref="canvasEl" class="pointer-events-none fixed inset-0 z-10 w-full h-full" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasEl = ref(null)
let animId = null
let ctx = null
let petals = []
const PETAL_COUNT = 20

function randomBetween(a, b) { return a + Math.random() * (b - a) }

function createPetal(canvas) {
  return {
    x: randomBetween(0, canvas.width),
    y: randomBetween(-50, -10),
    size: randomBetween(5, 12),
    speedY: randomBetween(0.6, 1.4),
    speedX: randomBetween(-0.5, 0.5),
    rotation: randomBetween(0, 360),
    rotationSpeed: randomBetween(-1.5, 1.5),
    opacity: randomBetween(0.3, 0.75),
    color: ['#F9E4E8', '#F7DFD7', '#FAEAEA', '#F5E6D0'][Math.floor(Math.random() * 4)],
  }
}

function drawPetal(p) {
  ctx.save()
  ctx.globalAlpha = p.opacity
  ctx.translate(p.x, p.y)
  ctx.rotate((p.rotation * Math.PI) / 180)
  ctx.beginPath()
  ctx.ellipse(0, 0, p.size / 2, p.size, 0, 0, Math.PI * 2)
  ctx.fillStyle = p.color
  ctx.fill()
  ctx.restore()
}

function loop(canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  petals.forEach((p) => {
    p.y += p.speedY
    p.x += p.speedX
    p.rotation += p.rotationSpeed
    if (p.y > canvas.height + 20) {
      Object.assign(p, createPetal(canvas))
    }
    drawPetal(p)
  })
  animId = requestAnimationFrame(() => loop(canvas))
}

function resize(canvas) {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

onMounted(() => {
  const canvas = canvasEl.value
  ctx = canvas.getContext('2d')
  resize(canvas)
  petals = Array.from({ length: PETAL_COUNT }, () => ({
    ...createPetal(canvas),
    y: randomBetween(0, canvas.height), // start scattered
  }))
  loop(canvas)
  window.addEventListener('resize', () => resize(canvas))
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})
</script>

