<template>
  <!-- LOGIN SCREEN -->
  <div v-if="!isLoggedIn" class="min-h-screen bg-rose-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
      <h1 class="text-2xl font-bold text-rose-600 text-center mb-6">🔐 Admin Thiệp Cưới</h1>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-sm text-gray-600 mb-1">Tài khoản</label>
          <input v-model="form.username" type="text" class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300" placeholder="admin" required />
        </div>
        <div class="mb-4">
          <label class="block text-sm text-gray-600 mb-1">Mật khẩu</label>
          <input v-model="form.password" type="password" class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300" placeholder="••••••" required />
        </div>
        <p v-if="loginError" class="text-red-500 text-sm mb-3">{{ loginError }}</p>
        <button type="submit" :disabled="loginLoading" class="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-lg py-2 font-semibold transition">
          {{ loginLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>
      </form>
    </div>
  </div>

  <!-- DASHBOARD -->
  <div v-else class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
      <h1 class="text-xl font-bold text-rose-600">💍 Wedding Admin</h1>
      <div class="flex items-center gap-3">
        <span class="text-xs text-gray-400">realtime</span>
        <span :class="['w-2 h-2 rounded-full', sseConnected ? 'bg-green-400' : 'bg-gray-300']"></span>
        <button @click="logout" class="text-sm text-gray-500 hover:text-red-500 transition">Đăng xuất</button>
      </div>
    </header>

    <main class="p-6 max-w-6xl mx-auto">
      <!-- KPI Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl p-4 shadow-sm text-center">
          <div class="text-3xl font-bold text-rose-500">{{ wishes.length }}</div>
          <div class="text-sm text-gray-500 mt-1">Lời chúc</div>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center">
          <div class="text-3xl font-bold text-green-500">{{ rsvps.length }}</div>
          <div class="text-sm text-gray-500 mt-1">Xác nhận tham dự</div>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center">
          <div class="text-3xl font-bold text-blue-500">{{ attendingCount }}</div>
          <div class="text-sm text-gray-500 mt-1">Sẽ tham dự</div>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center">
          <div class="text-3xl font-bold text-orange-500">{{ totalGuests }}</div>
          <div class="text-sm text-gray-500 mt-1">Tổng khách (ước)</div>
        </div>
      </div>

      <!-- WISHES TABLE -->
      <section class="bg-white rounded-xl shadow-sm mb-8">
        <div class="flex items-center justify-between px-5 py-4 border-b">
          <h2 class="font-semibold text-gray-700">💬 Lời chúc ({{ wishes.length }})</h2>
          <button @click="exportWishesCsv" class="text-xs bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1 rounded-lg hover:bg-rose-100 transition">Xuất CSV</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500">
              <tr>
                <th class="text-left px-4 py-2">Tên</th>
                <th class="text-left px-4 py-2">Nội dung</th>
                <th class="text-left px-4 py-2">Thời gian</th>
                <th class="text-center px-4 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="wish in wishes" :key="wish.id" class="border-t hover:bg-gray-50">
                <td class="px-4 py-2 font-medium text-gray-700 whitespace-nowrap">{{ wish.sender }}</td>
                <td class="px-4 py-2 text-gray-600 max-w-xs">
                  <span v-if="editingWish?.id !== wish.id">{{ wish.message }}</span>
                  <textarea v-else v-model="editingWish.message" class="w-full border rounded px-2 py-1 text-sm" rows="2"></textarea>
                </td>
                <td class="px-4 py-2 text-gray-400 whitespace-nowrap text-xs">{{ formatDate(wish.createdAt) }}</td>
                <td class="px-4 py-2 text-center whitespace-nowrap">
                  <template v-if="editingWish?.id !== wish.id">
                    <button @click="startEditWish(wish)" class="text-blue-500 hover:underline mr-2">Sửa</button>
                    <button @click="deleteWish(wish.id)" class="text-red-400 hover:underline">Xóa</button>
                  </template>
                  <template v-else>
                    <button @click="saveWish" class="text-green-500 hover:underline mr-2">Lưu</button>
                    <button @click="editingWish = null" class="text-gray-400 hover:underline">Hủy</button>
                  </template>
                </td>
              </tr>
              <tr v-if="wishes.length === 0">
                <td colspan="4" class="text-center py-8 text-gray-400">Chưa có lời chúc nào</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- RSVP TABLE -->
      <section class="bg-white rounded-xl shadow-sm">
        <div class="flex items-center justify-between px-5 py-4 border-b">
          <h2 class="font-semibold text-gray-700">✅ Xác nhận tham dự ({{ rsvps.length }})</h2>
          <button @click="exportRsvpCsv" class="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-1 rounded-lg hover:bg-green-100 transition">Xuất CSV</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500">
              <tr>
                <th class="text-left px-4 py-2">Tên</th>
                <th class="text-left px-4 py-2">Điện thoại</th>
                <th class="text-left px-4 py-2">Tham dự</th>
                <th class="text-left px-4 py-2">Số khách</th>
                <th class="text-left px-4 py-2">Ghi chú</th>
                <th class="text-left px-4 py-2">Thời gian</th>
                <th class="text-center px-4 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rsvp in rsvps" :key="rsvp.id" class="border-t hover:bg-gray-50">
                <td class="px-4 py-2 font-medium text-gray-700 whitespace-nowrap">{{ rsvp.name }}</td>
                <td class="px-4 py-2 text-gray-500 whitespace-nowrap">{{ rsvp.phone || '—' }}</td>
                <td class="px-4 py-2">
                  <span :class="['px-2 py-0.5 rounded-full text-xs font-semibold', rsvp.attending ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500']">
                    {{ rsvp.attending ? 'Có' : 'Không' }}
                  </span>
                </td>
                <td class="px-4 py-2 text-gray-600">{{ rsvp.guests || 1 }}</td>
                <td class="px-4 py-2 text-gray-500 max-w-xs truncate">{{ rsvp.note || '—' }}</td>
                <td class="px-4 py-2 text-gray-400 whitespace-nowrap text-xs">{{ formatDate(rsvp.createdAt) }}</td>
                <td class="px-4 py-2 text-center">
                  <button @click="deleteRsvp(rsvp.id)" class="text-red-400 hover:underline text-xs">Xóa</button>
                </td>
              </tr>
              <tr v-if="rsvps.length === 0">
                <td colspan="7" class="text-center py-8 text-gray-400">Chưa có xác nhận nào</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const ADMIN_TOKEN_KEY = 'wedding_admin_token'
const TOKEN_VALUE = 'wedding-admin-session-tk-2026'

const isLoggedIn = ref(false)
const loginLoading = ref(false)
const loginError = ref('')
const form = ref({ username: '', password: '' })

const wishes = ref([])
const rsvps = ref([])
const editingWish = ref(null)
const sseConnected = ref(false)

let adminSse = null

// ── AUTH ─────────────────────────────────────────────────────────────────────
async function login() {
  loginError.value = ''
  loginLoading.value = true
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
    const json = await res.json()
    if (json.success && json.token) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, json.token)
      isLoggedIn.value = true
      await loadAll()
      initAdminSse()
    } else {
      loginError.value = json.message || 'Sai tài khoản hoặc mật khẩu'
    }
  } catch {
    loginError.value = 'Không kết nối được server'
  } finally {
    loginLoading.value = false
  }
}

function logout() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
  isLoggedIn.value = false
  adminSse?.close()
}

function authHeaders() {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY)
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

// ── DATA LOAD ─────────────────────────────────────────────────────────────────
async function loadAll() {
  const [wRes, rRes] = await Promise.all([
    fetch('/api/wishes', { headers: authHeaders() }),
    fetch('/api/rsvp', { headers: authHeaders() }),
  ])
  if (wRes.ok) wishes.value = (await wRes.json()).data || []
  if (rRes.ok) rsvps.value = (await rRes.json()).data || []
}

// ── SSE REALTIME ──────────────────────────────────────────────────────────────
function initAdminSse() {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY)
  adminSse = new EventSource(`/api/wishes/stream?token=${encodeURIComponent(token)}`)

  adminSse.onopen = () => { sseConnected.value = true }
  adminSse.onerror = () => { sseConnected.value = false }

  adminSse.addEventListener('new_wish', (e) => {
    const w = JSON.parse(e.data)
    if (w?.id && !wishes.value.find(x => x.id === w.id)) wishes.value.unshift(w)
  })
  adminSse.addEventListener('update_wish', (e) => {
    const w = JSON.parse(e.data)
    const idx = wishes.value.findIndex(x => x.id === w.id)
    if (idx !== -1) wishes.value[idx] = { ...wishes.value[idx], ...w }
  })
  adminSse.addEventListener('delete_wish', (e) => {
    const { id } = JSON.parse(e.data)
    wishes.value = wishes.value.filter(x => x.id !== id)
  })
  adminSse.addEventListener('new_rsvp', (e) => {
    const r = JSON.parse(e.data)
    if (r?.id && !rsvps.value.find(x => x.id === r.id)) rsvps.value.unshift(r)
  })
  adminSse.addEventListener('update_rsvp', (e) => {
    const r = JSON.parse(e.data)
    const idx = rsvps.value.findIndex(x => x.id === r.id)
    if (idx !== -1) rsvps.value[idx] = { ...rsvps.value[idx], ...r }
  })
  adminSse.addEventListener('delete_rsvp', (e) => {
    const { id } = JSON.parse(e.data)
    rsvps.value = rsvps.value.filter(x => x.id !== id)
  })
}

// ── WISH CRUD ─────────────────────────────────────────────────────────────────
function startEditWish(wish) {
  editingWish.value = { id: wish.id, message: wish.message }
}

async function saveWish() {
  if (!editingWish.value) return
  const { id, message } = editingWish.value
  const original = wishes.value.find(w => w.id === id)
  if (!original) { editingWish.value = null; return }
  const res = await fetch(`/api/admin/wishes/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({
      sender: original.sender,
      relationship: original.relationship || '',
      message,
    }),
  })
  if (res.ok) {
    const json = await res.json()
    const idx = wishes.value.findIndex(w => w.id === id)
    if (idx !== -1) wishes.value[idx] = json.data
  }
  editingWish.value = null
}

async function deleteWish(id) {
  if (!confirm('Xóa lời chúc này?')) return
  const res = await fetch(`/api/admin/wishes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (res.ok) wishes.value = wishes.value.filter(w => w.id !== id)
}

// ── RSVP CRUD ─────────────────────────────────────────────────────────────────
async function deleteRsvp(id) {
  if (!confirm('Xóa xác nhận này?')) return
  const res = await fetch(`/api/admin/rsvps/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (res.ok) rsvps.value = rsvps.value.filter(r => r.id !== id)
}

// ── COMPUTED ──────────────────────────────────────────────────────────────────
const attendingCount = computed(() => rsvps.value.filter(r => r.attending).length)
const totalGuests = computed(() => rsvps.value.filter(r => r.attending).reduce((s, r) => s + (r.guests || 1), 0))

// ── UTILS ─────────────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function toCsv(rows, cols) {
  const header = cols.map(c => c.label).join(',')
  const body = rows.map(r => cols.map(c => `"${String(r[c.key] ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
  return `${header}\n${body}`
}

function downloadCsv(content, filename) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function exportWishesCsv() {
  downloadCsv(toCsv(wishes.value, [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Tên' },
    { key: 'message', label: 'Lời chúc' },
    { key: 'createdAt', label: 'Thời gian' },
  ]), `loi-chuc-${Date.now()}.csv`)
}

function exportRsvpCsv() {
  downloadCsv(toCsv(rsvps.value, [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Tên' },
    { key: 'phone', label: 'Điện thoại' },
    { key: 'attending', label: 'Tham dự' },
    { key: 'guests', label: 'Số khách' },
    { key: 'note', label: 'Ghi chú' },
    { key: 'createdAt', label: 'Thời gian' },
  ]), `ds-tham-du-${Date.now()}.csv`)
}

// ── LIFECYCLE ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY)
  if (token) {
    const res = await fetch('/api/admin/check', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) {
      isLoggedIn.value = true
      await loadAll()
      initAdminSse()
    }
  }
})

onUnmounted(() => adminSse?.close())
</script>
