import { ref, computed } from 'vue'
import defaultMusicConfig from '@/data/music.config.json'

// Helper giữ lại để tương thích ngược nếu có module import
export function extractYouTubeId() {
  return null
}

// Global Singleton State
const playlist = ref(defaultMusicConfig.playlist || [
  {
    id: 'track-vay-cuoi',
    title: 'Váy Cưới',
    artist: 'ERIK',
    url: '/music/Váy Cưới.mp3'
  }
])

const settings = ref(defaultMusicConfig.settings || {
  autoPlayOnOpenGate: true,
  defaultVolume: 70,
  loop: true,
})

const currentIndex = ref(0)
const isPlaying = ref(false)
const isBuffering = ref(false)
const hasInteracted = ref(false)
const volume = ref(settings.value.defaultVolume ?? 70)

let audioInstance = null

function getAudioSource(url) {
  if (!url) return ''
  // Encode URI để hỗ trợ tốt tên file tiếng Việt có dấu và khoảng trắng
  try {
    return encodeURI(decodeURI(url))
  } catch {
    return url
  }
}

function initAudio() {
  if (typeof window === 'undefined' || audioInstance) return audioInstance

  const currentTrack = playlist.value[currentIndex.value]
  const src = getAudioSource(currentTrack?.url || '/music/Váy Cưới.mp3')

  audioInstance = new Audio()
  audioInstance.preload = 'auto'
  audioInstance.loop = Boolean(settings.value.loop ?? true)
  audioInstance.volume = (volume.value ?? 70) / 100
  audioInstance.src = src

  audioInstance.addEventListener('play', () => {
    isPlaying.value = true
    isBuffering.value = false
  })

  audioInstance.addEventListener('pause', () => {
    isPlaying.value = false
  })

  audioInstance.addEventListener('waiting', () => {
    isBuffering.value = true
  })

  audioInstance.addEventListener('playing', () => {
    isPlaying.value = true
    isBuffering.value = false
  })

  audioInstance.addEventListener('canplay', () => {
    isBuffering.value = false
  })

  // Đảm bảo bài hát lặp lại không bao giờ dừng
  audioInstance.addEventListener('ended', () => {
    if (settings.value.loop) {
      audioInstance.currentTime = 0
      audioInstance.play().catch((err) => {
        console.warn('Lỗi khi loop bài hát:', err)
      })
    } else {
      isPlaying.value = false
    }
  })

  return audioInstance
}

// Phát nhạc
function playCurrentTrack() {
  const audio = initAudio()
  if (!audio) return

  const track = playlist.value[currentIndex.value]
  const targetSrc = getAudioSource(track?.url || '/music/Váy Cưới.mp3')

  if (!audio.src || !audio.src.includes(encodeURI('Váy Cưới.mp3'))) {
    audio.src = targetSrc
  }

  audio.loop = Boolean(settings.value.loop ?? true)
  audio.volume = (volume.value ?? 70) / 100

  const playPromise = audio.play()
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isPlaying.value = true
      })
      .catch((error) => {
        console.warn('Tự động phát bị hạn chế bởi trình duyệt:', error)
      })
  }
}

// Tạm dừng
function pauseCurrentTrack() {
  if (audioInstance) {
    audioInstance.pause()
  }
  isPlaying.value = false
}

// Bật / tắt nhạc
function toggle() {
  hasInteracted.value = true
  if (isPlaying.value) {
    pauseCurrentTrack()
  } else {
    playCurrentTrack()
  }
}

// Kích hoạt ngay từ User Gesture mở con dấu Wax Seal
function triggerFromGesture() {
  hasInteracted.value = true
  if (settings.value.autoPlayOnOpenGate) {
    playCurrentTrack()
  }
}

// Chuyển bài (nếu có nhiều bài)
function nextTrack() {
  if (playlist.value.length <= 1) {
    if (audioInstance) {
      audioInstance.currentTime = 0
      audioInstance.play().catch(() => {})
    }
    return
  }
  currentIndex.value = (currentIndex.value + 1) % playlist.value.length
  switchTrack()
}

function prevTrack() {
  if (playlist.value.length <= 1) {
    if (audioInstance) {
      audioInstance.currentTime = 0
      audioInstance.play().catch(() => {})
    }
    return
  }
  currentIndex.value = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
  switchTrack()
}

function selectTrack(index) {
  if (index < 0 || index >= playlist.value.length) return
  currentIndex.value = index
  switchTrack()
}

function switchTrack() {
  const audio = initAudio()
  if (!audio) return
  const track = playlist.value[currentIndex.value]
  audio.src = getAudioSource(track?.url)
  audio.currentTime = 0
  audio.play().catch(() => {})
}

// Điều chỉnh âm lượng
function setVolume(newVol) {
  const val = Math.max(0, Math.min(100, Number(newVol) || 0))
  volume.value = val
  if (audioInstance) {
    audioInstance.volume = val / 100
  }
}

export function useAudio() {
  // Tiền khởi tạo audio instance
  if (typeof window !== 'undefined') {
    initAudio()
  }

  const currentTrack = computed(() => {
    return playlist.value[currentIndex.value] || {
      id: 'track-vay-cuoi',
      title: 'Váy Cưới',
      artist: 'ERIK',
      url: '/music/Váy Cưới.mp3',
    }
  })

  // Không dùng YouTube nữa, luôn trả về false
  const isCurrentYouTube = computed(() => false)

  return {
    playlist,
    settings,
    currentIndex,
    currentTrack,
    isCurrentYouTube,
    isPlaying,
    isBuffering,
    hasInteracted,
    volume,
    play: playCurrentTrack,
    pause: pauseCurrentTrack,
    toggle,
    nextTrack,
    prevTrack,
    selectTrack,
    setVolume,
    triggerFromGesture,
  }
}
