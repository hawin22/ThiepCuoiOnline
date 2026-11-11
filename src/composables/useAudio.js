import { ref, computed, onMounted } from 'vue'
import defaultMusicConfig from '@/data/music.config.json'

// Regex trích xuất YouTube ID từ mọi dạng link (watch?v=, youtu.be/, embed/, shorts/, list...)
export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null
  const cleaned = url.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleaned)) {
    return cleaned
  }
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  const match = cleaned.match(regExp)
  return match ? match[1] : null
}

// Global Singleton State (chia sẻ đồng bộ giữa App.vue và AudioPlayer.vue)
const playlist = ref(defaultMusicConfig.playlist || [])
const settings = ref(defaultMusicConfig.settings || {
  autoPlayOnOpenGate: true,
  defaultVolume: 65,
  loop: true,
})

const currentIndex = ref(0)
const isPlaying = ref(false)
const isBuffering = ref(false)
const hasInteracted = ref(false)
const volume = ref(settings.value.defaultVolume ?? 65)

let ytPlayer = null
let ytPlayerReady = false
let shouldPlayOnReady = false
let html5Audio = null
let isInitialized = false

// Tự động tải YouTube IFrame API script
function loadYouTubeIframeApi() {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT)
  }

  return new Promise((resolve) => {
    const existingScript = document.getElementById('youtube-iframe-api-script')
    if (!existingScript) {
      const tag = document.createElement('script')
      tag.id = 'youtube-iframe-api-script'
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }

    const previousCallback = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousCallback === 'function') previousCallback()
      resolve(window.YT)
    }
  })
}

// Tạo container DOM ẩn ở góc màn hình (giữ kích thước 200x200 & opacity 0.001 để YouTube engine luôn render âm thanh mượt mà)
function ensureHiddenPlayerContainer() {
  if (typeof document === 'undefined') return null
  let container = document.getElementById('yt-wedding-player-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'yt-wedding-player-container'
    container.setAttribute('aria-hidden', 'true')
    container.setAttribute('role', 'region')
    container.setAttribute('aria-label', 'Background Wedding Music Streamer')
    Object.assign(container.style, {
      position: 'fixed',
      bottom: '-500px',
      right: '-500px',
      width: '200px',
      height: '200px',
      opacity: '0.001',
      pointerEvents: 'none',
      zIndex: '-9999',
      overflow: 'hidden',
    })

    const innerDiv = document.createElement('div')
    innerDiv.id = 'yt-wedding-player-target'
    container.appendChild(innerDiv)
    document.body.appendChild(container)
  }
  return 'yt-wedding-player-target'
}

// Khởi tạo Player
function initPlayers() {
  if (isInitialized || typeof window === 'undefined') return
  isInitialized = true

  // 1. Tạo HTML5 Audio sẵn sàng cho file MP3
  html5Audio = new Audio()
  html5Audio.volume = volume.value / 100
  html5Audio.addEventListener('play', () => { isPlaying.value = true })
  html5Audio.addEventListener('pause', () => { isPlaying.value = false })
  html5Audio.addEventListener('ended', handleTrackEnded)

  // 2. Khởi tạo YouTube Player API
  const currentTrack = playlist.value[currentIndex.value]
  const initialYtId = currentTrack ? extractYouTubeId(currentTrack.url) : null

  loadYouTubeIframeApi().then((YT) => {
    if (!YT) return
    const targetId = ensureHiddenPlayerContainer()
    if (!targetId) return

    ytPlayer = new YT.Player(targetId, {
      height: '200',
      width: '200',
      videoId: initialYtId || '50diFJZFyMI',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: (event) => {
          ytPlayerReady = true
          event.target.setVolume(volume.value)
          if (shouldPlayOnReady) {
            playCurrentTrack()
          }
        },
        onStateChange: (event) => {
          // YT.PlayerState: PLAYING (1), PAUSED (2), BUFFERING (3), ENDED (0), CUED (5)
          if (event.data === window.YT.PlayerState.PLAYING) {
            isPlaying.value = true
            isBuffering.value = false
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            isPlaying.value = false
            isBuffering.value = false
          } else if (event.data === window.YT.PlayerState.BUFFERING) {
            isBuffering.value = true
          } else if (event.data === window.YT.PlayerState.ENDED) {
            isBuffering.value = false
            handleTrackEnded()
          }
        },
        onError: (err) => {
          console.warn('[YouTube Audio Streamer] Lỗi phát YouTube:', err.data)
          isBuffering.value = false
          // Nếu video này bị giới hạn nhúng, tự chuyển bài kế tiếp
          if (playlist.value.length > 1) {
            nextTrack()
          }
        },
      },
    })
  })
}

// Khi một bài hát kết thúc
function handleTrackEnded() {
  if (playlist.value.length > 1) {
    nextTrack()
  } else if (settings.value.loop) {
    replayCurrentTrack()
  } else {
    isPlaying.value = false
  }
}

function replayCurrentTrack() {
  const track = playlist.value[currentIndex.value]
  if (!track) return
  const ytId = extractYouTubeId(track.url)
  if (ytId && ytPlayer && ytPlayerReady) {
    ytPlayer.seekTo(0)
    ytPlayer.playVideo()
  } else if (html5Audio) {
    html5Audio.currentTime = 0
    html5Audio.play().catch(() => {})
  }
}

// Phát track hiện tại
function playCurrentTrack() {
  const track = playlist.value[currentIndex.value]
  if (!track) return

  const ytId = extractYouTubeId(track.url)

  if (ytId) {
    // Tạm dừng MP3 nếu đang phát
    if (html5Audio) {
      html5Audio.pause()
    }

    if (ytPlayer && ytPlayerReady) {
      try {
        const currentUrl = ytPlayer.getVideoUrl ? ytPlayer.getVideoUrl() : ''
        if (!currentUrl || !currentUrl.includes(ytId)) {
          ytPlayer.loadVideoById({
            videoId: ytId,
            startSeconds: 0,
          })
        } else {
          ytPlayer.playVideo()
        }
        isPlaying.value = true
      } catch (err) {
        console.warn('Lỗi gọi playVideo():', err)
      }
    } else {
      // Đánh dấu để phát ngay khi onReady
      shouldPlayOnReady = true
    }
  } else {
    // Phát file âm thanh MP3 truyền thống
    if (ytPlayer && ytPlayerReady) {
      try { ytPlayer.pauseVideo() } catch {}
    }

    if (html5Audio) {
      if (html5Audio.src !== track.url) {
        html5Audio.src = track.url
      }
      html5Audio.volume = volume.value / 100
      html5Audio.play().then(() => {
        isPlaying.value = true
      }).catch((err) => {
        console.warn('HTML5 Audio play blocked:', err)
      })
    }
  }
}

// Tạm dừng track hiện tại
function pauseCurrentTrack() {
  shouldPlayOnReady = false
  const track = playlist.value[currentIndex.value]
  const ytId = track ? extractYouTubeId(track.url) : null

  if (ytId && ytPlayer && ytPlayerReady) {
    try { ytPlayer.pauseVideo() } catch {}
  }

  if (html5Audio) {
    html5Audio.pause()
  }

  isPlaying.value = false
}

// Chuyển bài kế tiếp
function nextTrack() {
  if (playlist.value.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % playlist.value.length
  loadAndPlayCurrent()
}

// Về bài trước
function prevTrack() {
  if (playlist.value.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
  loadAndPlayCurrent()
}

// Chọn bài cụ thể
function selectTrack(index) {
  if (index < 0 || index >= playlist.value.length) return
  currentIndex.value = index
  loadAndPlayCurrent()
}

function loadAndPlayCurrent() {
  const track = playlist.value[currentIndex.value]
  if (!track) return

  const ytId = extractYouTubeId(track.url)
  if (ytId) {
    if (html5Audio) html5Audio.pause()
    if (ytPlayer && ytPlayerReady) {
      ytPlayer.loadVideoById({ videoId: ytId, startSeconds: 0 })
      isPlaying.value = true
    } else {
      shouldPlayOnReady = true
    }
  } else {
    if (ytPlayer && ytPlayerReady) {
      try { ytPlayer.pauseVideo() } catch {}
    }
    if (html5Audio) {
      html5Audio.src = track.url
      html5Audio.play().catch(() => {})
      isPlaying.value = true
    }
  }
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

// Kích hoạt từ User Gesture mở cánh cửa (Wax Seal)
function triggerFromGesture() {
  hasInteracted.value = true
  if (settings.value.autoPlayOnOpenGate) {
    shouldPlayOnReady = true
    playCurrentTrack()
  }
}

// Điều chỉnh âm lượng (0 - 100)
function setVolume(newVol) {
  const val = Math.max(0, Math.min(100, Number(newVol) || 0))
  volume.value = val
  if (ytPlayer && ytPlayerReady) {
    ytPlayer.setVolume(val)
  }
  if (html5Audio) {
    html5Audio.volume = val / 100
  }
}

export function useAudio() {
  onMounted(() => {
    initPlayers()
  })

  const currentTrack = computed(() => {
    return playlist.value[currentIndex.value] || {
      id: 'default',
      title: 'Nhạc Lễ Thành Hôn',
      artist: 'Giai điệu tình yêu',
      url: '',
    }
  })

  const isCurrentYouTube = computed(() => {
    return Boolean(extractYouTubeId(currentTrack.value?.url))
  })

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
