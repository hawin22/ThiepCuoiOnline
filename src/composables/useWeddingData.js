import { ref, readonly } from 'vue'
import weddingConfig from '@/data/wedding.config.json'
import sessionData from '@/data/session.data.json'

// ─── Wedding Config ──────────────────────────────────────────────
const config = ref(weddingConfig)

export function useWeddingConfig() {
  // Hỗ trợ cá nhân hoá tên khách qua URL query params
  const urlParams = new URLSearchParams(window.location.search)
  const guestName = urlParams.get('to') || config.value.invitation.defaultGuest
  const guestRole = urlParams.get('role') || ''

  return {
    config: readonly(config),
    guestName,
    guestRole,
  }
}

// ─── Guest Data (RSVP + Wishes) ──────────────────────────────────
const STORAGE_KEY = 'wedding_tk_session'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return sessionData
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

const guestData = ref(loadFromStorage())

export function useGuestData() {
  function addWish(wish) {
    const newWish = {
      id: `wish-${Date.now()}`,
      ...wish,
      createdAt: new Date().toISOString(),
    }
    guestData.value.wishes.unshift(newWish)
    saveToStorage(guestData.value)
    return newWish
  }

  function addRsvp(rsvp) {
    const newRsvp = {
      id: `rsvp-${Date.now()}`,
      ...rsvp,
      createdAt: new Date().toISOString(),
    }
    guestData.value.rsvps.push(newRsvp)
    saveToStorage(guestData.value)
    return newRsvp
  }

  function exportData() {
    const dataStr = JSON.stringify(guestData.value, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wedding-data-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    guestData: readonly(guestData),
    addWish,
    addRsvp,
    exportData,
  }
}

