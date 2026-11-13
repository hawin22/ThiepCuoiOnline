import { ref, readonly } from 'vue'
import weddingConfig from '@/data/wedding.config.json'
import sessionData from '@/data/session.data.json'

// ─── Wedding Config ──────────────────────────────────────────────
const config = ref(weddingConfig)

export function useWeddingConfig() {
  // Hỗ trợ cá nhân hoá tên khách qua URL query params
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const guestName = urlParams?.get('to') || config.value.invitation.defaultGuest
  const guestRole = urlParams?.get('role') || ''

  return {
    config: readonly(config),
    guestName,
    guestRole,
  }
}

// ─── Guest Data (RSVP + Wishes) với SQLite Backend + Realtime SSE ──
const STORAGE_KEY = 'wedding_tk_session'

function loadFromStorage() {
  if (typeof window === 'undefined') return sessionData
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return sessionData
}

function saveToStorage(data) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

const guestData = ref(loadFromStorage())
let sseInitialized = false

// Tải danh sách lời chúc mới nhất từ Backend SQLite
async function fetchWishesFromServer() {
  try {
    const res = await fetch('/api/wishes')
    if (res.ok) {
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        guestData.value.wishes = json.data
        saveToStorage(guestData.value)
      }
    }
  } catch (err) {
    console.warn('[Wedding API] Không thể kết nối tới Backend, sử dụng cache local:', err.message)
  }
}

// Khởi tạo Realtime SSE lắng nghe lời chúc mới
function initSse() {
  if (sseInitialized || typeof window === 'undefined' || !window.EventSource) return
  sseInitialized = true

  const eventSource = new EventSource('/api/wishes/stream')

  eventSource.addEventListener('new_wish', (event) => {
    try {
      const newWish = JSON.parse(event.data)
      if (newWish && newWish.id) {
        // Kiểm tra tránh trùng lặp
        const exists = guestData.value.wishes.some((w) => w.id === newWish.id)
        if (!exists) {
          guestData.value.wishes.unshift(newWish)
          saveToStorage(guestData.value)
        }
      }
    } catch (e) {
      console.error('[SSE] Lỗi phân tích new_wish realtime:', e)
    }
  })

  eventSource.addEventListener('update_wish', (event) => {
    try {
      const updatedWish = JSON.parse(event.data)
      if (updatedWish && updatedWish.id) {
        const index = guestData.value.wishes.findIndex((w) => w.id === updatedWish.id)
        if (index !== -1) {
          guestData.value.wishes[index] = { ...guestData.value.wishes[index], ...updatedWish }
          saveToStorage(guestData.value)
        }
      }
    } catch (e) {
      console.error('[SSE] Lỗi phân tích update_wish realtime:', e)
    }
  })

  eventSource.addEventListener('delete_wish', (event) => {
    try {
      const payload = JSON.parse(event.data)
      const targetId = payload?.id || payload
      if (targetId) {
        guestData.value.wishes = guestData.value.wishes.filter((w) => w.id !== targetId)
        saveToStorage(guestData.value)
      }
    } catch (e) {
      console.error('[SSE] Lỗi phân tích delete_wish realtime:', e)
    }
  })

  eventSource.addEventListener('new_rsvp', (event) => {
    try {
      const newRsvp = JSON.parse(event.data)
      if (newRsvp && newRsvp.id) {
        const exists = guestData.value.rsvps.some((r) => r.id === newRsvp.id)
        if (!exists) {
          guestData.value.rsvps.unshift(newRsvp)
          saveToStorage(guestData.value)
        }
      }
    } catch (e) {
      console.error('[SSE] Lỗi phân tích new_rsvp realtime:', e)
    }
  })

  eventSource.addEventListener('update_rsvp', (event) => {
    try {
      const updatedRsvp = JSON.parse(event.data)
      if (updatedRsvp && updatedRsvp.id) {
        const index = guestData.value.rsvps.findIndex((r) => r.id === updatedRsvp.id)
        if (index !== -1) {
          guestData.value.rsvps[index] = { ...guestData.value.rsvps[index], ...updatedRsvp }
          saveToStorage(guestData.value)
        }
      }
    } catch (e) {
      console.error('[SSE] Lỗi phân tích update_rsvp realtime:', e)
    }
  })

  eventSource.addEventListener('delete_rsvp', (event) => {
    try {
      const payload = JSON.parse(event.data)
      const targetId = payload?.id || payload
      if (targetId) {
        guestData.value.rsvps = guestData.value.rsvps.filter((r) => r.id !== targetId)
        saveToStorage(guestData.value)
      }
    } catch (e) {
      console.error('[SSE] Lỗi phân tích delete_rsvp realtime:', e)
    }
  })

  eventSource.onerror = () => {
    // EventSource tự động reconnect khi mất kết nối
  }
}

// Khởi tạo ban đầu khi import
if (typeof window !== 'undefined') {
  fetchWishesFromServer()
  initSse()
}

export function useGuestData() {
  // Gửi lời chúc mới
  async function addWish(wish) {
    const tempId = `wish-${Date.now()}`
    const tempWish = {
      id: tempId,
      ...wish,
      createdAt: new Date().toISOString(),
    }

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wish),
      })

      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data) {
          const serverWish = json.data
          // Đảm bảo cập nhật trong danh sách nếu SSE chưa kịp nhận
          const exists = guestData.value.wishes.some((w) => w.id === serverWish.id)
          if (!exists) {
            guestData.value.wishes.unshift(serverWish)
            saveToStorage(guestData.value)
          }
          return serverWish
        }
      }
    } catch (err) {
      console.warn('[Wedding API] Lỗi gửi lời chúc tới Server, lưu local:', err.message)
    }

    // Fallback lưu local nếu offline
    guestData.value.wishes.unshift(tempWish)
    saveToStorage(guestData.value)
    return tempWish
  }

  // Gửi xác nhận tham dự (RSVP)
  async function addRsvp(rsvp) {
    const tempId = `rsvp-${Date.now()}`
    const tempRsvp = {
      id: tempId,
      ...rsvp,
      createdAt: new Date().toISOString(),
    }

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvp),
      })

      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data) {
          guestData.value.rsvps.push(json.data)
          saveToStorage(guestData.value)
          return json.data
        }
      }
    } catch (err) {
      console.warn('[Wedding API] Lỗi gửi RSVP tới Server, lưu local:', err.message)
    }

    // Fallback lưu local nếu offline
    guestData.value.rsvps.push(tempRsvp)
    saveToStorage(guestData.value)
    return tempRsvp
  }

  function exportData() {
    const dataStr = JSON.stringify(guestData.value, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wedding-data-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    guestData: readonly(guestData),
    addWish,
    addRsvp,
    exportData,
    refreshWishes: fetchWishesFromServer,
  }
}
