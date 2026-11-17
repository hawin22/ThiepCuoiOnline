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
        <div class="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b gap-3">
          <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2 class="font-semibold text-gray-700">💬 Lời chúc ({{ filteredWishes.length }}/{{ wishes.length }})</h2>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Ô TÌM KIẾM LỜI CHÚC -->
            <div class="relative min-w-[200px] sm:min-w-[240px]">
              <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                </svg>
              </span>
              <input
                v-model="searchWish"
                type="text"
                placeholder="Tìm tên, quan hệ, lời chúc..."
                class="w-full pl-8 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition"
              />
              <button
                v-if="searchWish"
                @click="searchWish = ''"
                class="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 text-xs"
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            </div>

            <!-- CHỌN SỐ DÒNG / TRANG -->
            <select
              v-model.number="wishPageSize"
              class="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-1 focus:ring-rose-400"
            >
              <option :value="10">10 / trang</option>
              <option :value="20">20 / trang</option>
              <option :value="50">50 / trang</option>
              <option :value="100">100 / trang</option>
            </select>

            <button
              @click="exportWishesCsv"
              class="text-xs bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition flex items-center gap-1.5 font-medium shadow-sm"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
              </svg>
              <span>Xuất CSV</span>
            </button>
          </div>
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
              <tr v-for="wish in paginatedWishes" :key="wish.id" class="border-t hover:bg-gray-50">
                <td class="px-4 py-2 font-medium text-gray-700 whitespace-nowrap">
                  <div>{{ wish.sender }}</div>
                  <div v-if="wish.relationship" class="text-xs text-gray-400 font-normal">{{ wish.relationship }}</div>
                </td>
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
              <tr v-if="filteredWishes.length === 0">
                <td colspan="4" class="text-center py-8 text-gray-400">
                  {{ wishes.length === 0 ? 'Chưa có lời chúc nào' : 'Không tìm thấy lời chúc phù hợp' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PHÂN TRANG LỜI CHÚC -->
        <div v-if="filteredWishes.length > 0" class="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 border-t bg-gray-50/50 text-xs text-gray-500 gap-3">
          <div>
            Hiển thị <span class="font-semibold text-gray-700">{{ wishStartIndex }} - {{ wishEndIndex }}</span> trong tổng số <span class="font-semibold text-gray-700">{{ filteredWishes.length }}</span> lời chúc
          </div>

          <div v-if="wishTotalPages > 1" class="flex items-center gap-1">
            <button
              @click="wishPage = 1"
              :disabled="wishPage === 1"
              class="px-2 py-1 rounded border bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              title="Trang đầu"
            >
              «
            </button>
            <button
              @click="wishPage--"
              :disabled="wishPage === 1"
              class="px-2 py-1 rounded border bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              title="Trang trước"
            >
              ‹
            </button>

            <template v-for="(p, idx) in wishPageNumbers" :key="idx">
              <span v-if="p === '...'" class="px-1 text-gray-400">...</span>
              <button
                v-else
                @click="wishPage = p"
                :class="['px-2.5 py-1 rounded border font-medium transition', wishPage === p ? 'bg-rose-500 text-white border-rose-500 shadow-sm' : 'bg-white hover:bg-gray-100 text-gray-600']"
              >
                {{ p }}
              </button>
            </template>

            <button
              @click="wishPage++"
              :disabled="wishPage === wishTotalPages"
              class="px-2 py-1 rounded border bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              title="Trang sau"
            >
              ›
            </button>
            <button
              @click="wishPage = wishTotalPages"
              :disabled="wishPage === wishTotalPages"
              class="px-2 py-1 rounded border bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              title="Trang cuối"
            >
              »
            </button>
          </div>
        </div>
      </section>

      <!-- RSVP TABLE -->
      <section class="bg-white rounded-xl shadow-sm">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between px-5 py-4 border-b gap-3">
          <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2 class="font-semibold text-gray-700">✅ Xác nhận tham dự ({{ filteredRsvps.length }}/{{ rsvps.length }})</h2>

            <!-- BỘ LỌC THAM DỰ -->
            <div class="inline-flex rounded-lg p-0.5 bg-gray-100 text-xs font-medium">
              <button
                @click="rsvpFilter = 'all'"
                :class="['px-2.5 py-1 rounded-md transition', rsvpFilter === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800']"
              >
                Tất cả ({{ rsvps.length }})
              </button>
              <button
                @click="rsvpFilter = 'yes'"
                :class="['px-2.5 py-1 rounded-md transition flex items-center gap-1', rsvpFilter === 'yes' ? 'bg-white text-green-700 shadow-sm font-semibold' : 'text-gray-500 hover:text-green-700']"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Tham dự ({{ attendingCount }})
              </button>
              <button
                @click="rsvpFilter = 'no'"
                :class="['px-2.5 py-1 rounded-md transition flex items-center gap-1', rsvpFilter === 'no' ? 'bg-white text-red-600 shadow-sm font-semibold' : 'text-gray-500 hover:text-red-600']"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                Không tham dự ({{ notAttendingCount }})
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Ô TÌM KIẾM RSVP -->
            <div class="relative min-w-[200px] sm:min-w-[240px]">
              <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                </svg>
              </span>
              <input
                v-model="searchRsvp"
                type="text"
                placeholder="Tìm tên, số điện thoại, ghi chú..."
                class="w-full pl-8 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition"
              />
              <button
                v-if="searchRsvp"
                @click="searchRsvp = ''"
                class="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 text-xs"
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            </div>

            <!-- CHỌN SỐ DÒNG / TRANG -->
            <select
              v-model.number="rsvpPageSize"
              class="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option :value="10">10 / trang</option>
              <option :value="20">20 / trang</option>
              <option :value="50">50 / trang</option>
              <option :value="100">100 / trang</option>
            </select>

            <button
              @click="exportRsvpCsv"
              class="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition flex items-center gap-1.5 font-medium shadow-sm"
              :title="`Xuất danh sách: ${rsvpFilter === 'yes' ? 'Sẽ tham dự' : (rsvpFilter === 'no' ? 'Không tham dự' : 'Tất cả')}`"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
              </svg>
              <span>Xuất CSV</span>
            </button>
          </div>
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
              <tr v-for="rsvp in paginatedRsvps" :key="rsvp.id" class="border-t hover:bg-gray-50">
                <td class="px-4 py-2 font-medium text-gray-700 whitespace-nowrap">{{ rsvp.name }}</td>
                <td class="px-4 py-2 text-gray-500 whitespace-nowrap">
                  <a v-if="rsvp.phone" :href="`tel:${rsvp.phone}`" class="text-blue-600 hover:underline">{{ rsvp.phone }}</a>
                  <span v-else>—</span>
                </td>
                <td class="px-4 py-2">
                  <span :class="['px-2 py-0.5 rounded-full text-xs font-semibold', (rsvp.attending === 'yes' || rsvp.attending === true) ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500']">
                    {{ (rsvp.attending === 'yes' || rsvp.attending === true) ? 'Có' : 'Không' }}
                  </span>
                </td>
                <td class="px-4 py-2 text-gray-600">
                  {{ (rsvp.attending === 'yes' || rsvp.attending === true) ? (rsvp.partySize || rsvp.guests || 1) : 0 }}
                </td>
                <td class="px-4 py-2 text-gray-500 max-w-xs truncate" :title="rsvp.note">{{ rsvp.note || '—' }}</td>
                <td class="px-4 py-2 text-gray-400 whitespace-nowrap text-xs">{{ formatDate(rsvp.createdAt) }}</td>
                <td class="px-4 py-2 text-center">
                  <button @click="deleteRsvp(rsvp.id)" class="text-red-400 hover:underline text-xs">Xóa</button>
                </td>
              </tr>
              <tr v-if="filteredRsvps.length === 0">
                <td colspan="7" class="text-center py-8 text-gray-400">
                  {{ rsvps.length === 0 ? 'Chưa có xác nhận nào' : 'Không có xác nhận nào phù hợp bộ lọc & tìm kiếm' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PHÂN TRANG RSVP -->
        <div v-if="filteredRsvps.length > 0" class="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 border-t bg-gray-50/50 text-xs text-gray-500 gap-3">
          <div>
            Hiển thị <span class="font-semibold text-gray-700">{{ rsvpStartIndex }} - {{ rsvpEndIndex }}</span> trong tổng số <span class="font-semibold text-gray-700">{{ filteredRsvps.length }}</span> xác nhận
          </div>

          <div v-if="rsvpTotalPages > 1" class="flex items-center gap-1">
            <button
              @click="rsvpPage = 1"
              :disabled="rsvpPage === 1"
              class="px-2 py-1 rounded border bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              title="Trang đầu"
            >
              «
            </button>
            <button
              @click="rsvpPage--"
              :disabled="rsvpPage === 1"
              class="px-2 py-1 rounded border bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              title="Trang trước"
            >
              ‹
            </button>

            <template v-for="(p, idx) in rsvpPageNumbers" :key="idx">
              <span v-if="p === '...'" class="px-1 text-gray-400">...</span>
              <button
                v-else
                @click="rsvpPage = p"
                :class="['px-2.5 py-1 rounded border font-medium transition', rsvpPage === p ? 'bg-green-600 text-white border-green-600 shadow-sm' : 'bg-white hover:bg-gray-100 text-gray-600']"
              >
                {{ p }}
              </button>
            </template>

            <button
              @click="rsvpPage++"
              :disabled="rsvpPage === rsvpTotalPages"
              class="px-2 py-1 rounded border bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              title="Trang sau"
            >
              ›
            </button>
            <button
              @click="rsvpPage = rsvpTotalPages"
              :disabled="rsvpPage === rsvpTotalPages"
              class="px-2 py-1 rounded border bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              title="Trang cuối"
            >
              »
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { toCsv } from '@/utils/csv.js'

const ADMIN_TOKEN_KEY = 'wedding_admin_token'
const TOKEN_VALUE = 'wedding-admin-session-tk-2026'

const isLoggedIn = ref(false)
const loginLoading = ref(false)
const loginError = ref('')
const form = ref({ username: '', password: '' })

const wishes = ref([])
const rsvps = ref([])
const rsvpFilter = ref('all') // 'all' | 'yes' | 'no'

// ── TÌM KIẾM & PHÂN TRANG ───────────────────────────────────────────────────
const searchWish = ref('')
const wishPage = ref(1)
const wishPageSize = ref(10)

const searchRsvp = ref('')
const rsvpPage = ref(1)
const rsvpPageSize = ref(10)

const editingWish = ref(null)
const sseConnected = ref(false)

let adminSse = null

// Tự động nhảy về trang 1 khi đổi từ khóa tìm kiếm hoặc bộ lọc
watch([searchWish, wishPageSize], () => {
  wishPage.value = 1
})

watch([searchRsvp, rsvpFilter, rsvpPageSize], () => {
  rsvpPage.value = 1
})

function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const pages = []
  pages.push(1)
  if (currentPage > 3) {
    pages.push('...')
  }
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  if (currentPage < totalPages - 2) {
    pages.push('...')
  }
  pages.push(totalPages)
  return pages
}

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
    fetch('/api/rsvps', { headers: authHeaders() }),
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
const attendingCount = computed(() =>
  rsvps.value.filter(r => r.attending === 'yes' || r.attending === true).length
)
const notAttendingCount = computed(() =>
  rsvps.value.filter(r => r.attending === 'no' || r.attending === false).length
)
const totalGuests = computed(() =>
  rsvps.value
    .filter(r => r.attending === 'yes' || r.attending === true)
    .reduce((s, r) => s + (Number(r.partySize) || Number(r.guests) || 1), 0)
)

// Computed Lời chúc (Tìm kiếm & Phân trang)
const filteredWishes = computed(() => {
  const q = searchWish.value.trim().toLowerCase()
  if (!q) return wishes.value
  return wishes.value.filter(w =>
    (w.sender && w.sender.toLowerCase().includes(q)) ||
    (w.relationship && w.relationship.toLowerCase().includes(q)) ||
    (w.message && w.message.toLowerCase().includes(q))
  )
})

const wishTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredWishes.value.length / wishPageSize.value))
)

const wishStartIndex = computed(() => {
  if (filteredWishes.value.length === 0) return 0
  return (wishPage.value - 1) * wishPageSize.value + 1
})

const wishEndIndex = computed(() =>
  Math.min(wishPage.value * wishPageSize.value, filteredWishes.value.length)
)

const wishPageNumbers = computed(() =>
  getPageNumbers(wishPage.value, wishTotalPages.value)
)

const paginatedWishes = computed(() => {
  const start = (wishPage.value - 1) * wishPageSize.value
  return filteredWishes.value.slice(start, start + wishPageSize.value)
})

// Computed RSVP (Lọc trạng thái, Tìm kiếm & Phân trang)
const filteredRsvps = computed(() => {
  let list = rsvps.value

  // Lọc theo trạng thái tham dự
  if (rsvpFilter.value === 'yes') {
    list = list.filter(r => r.attending === 'yes' || r.attending === true)
  } else if (rsvpFilter.value === 'no') {
    list = list.filter(r => r.attending === 'no' || r.attending === false)
  }

  // Tìm kiếm theo tên, số điện thoại, ghi chú
  const q = searchRsvp.value.trim().toLowerCase()
  if (q) {
    list = list.filter(r =>
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.phone && r.phone.toLowerCase().includes(q)) ||
      (r.note && r.note.toLowerCase().includes(q))
    )
  }

  return list
})

const rsvpTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRsvps.value.length / rsvpPageSize.value))
)

const rsvpStartIndex = computed(() => {
  if (filteredRsvps.value.length === 0) return 0
  return (rsvpPage.value - 1) * rsvpPageSize.value + 1
})

const rsvpEndIndex = computed(() =>
  Math.min(rsvpPage.value * rsvpPageSize.value, filteredRsvps.value.length)
)

const rsvpPageNumbers = computed(() =>
  getPageNumbers(rsvpPage.value, rsvpTotalPages.value)
)

const paginatedRsvps = computed(() => {
  const start = (rsvpPage.value - 1) * rsvpPageSize.value
  return filteredRsvps.value.slice(start, start + rsvpPageSize.value)
})

// ── UTILS ─────────────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function downloadCsv(content, filename) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function exportWishesCsv() {
  const targetList = filteredWishes.value
  downloadCsv(toCsv(targetList, [
    { key: 'id', label: 'ID' },
    { key: 'sender', label: 'Người gửi' },
    { key: 'relationship', label: 'Quan hệ' },
    { key: 'message', label: 'Lời chúc' },
    { key: 'createdAt', label: 'Thời gian' },
  ]), `loi-chuc-${Date.now()}.csv`)
}

function exportRsvpCsv() {
  const targetList = filteredRsvps.value
  let filterSuffix = 'tat-ca'
  if (rsvpFilter.value === 'yes') filterSuffix = 'tham-du'
  else if (rsvpFilter.value === 'no') filterSuffix = 'khong-tham-du'

  const mapped = targetList.map(r => ({
    ...r,
    attendingLabel: (r.attending === 'yes' || r.attending === true) ? 'Có' : 'Không',
    guestCount: (r.attending === 'yes' || r.attending === true) ? (r.partySize || r.guests || 1) : 0,
  }))

  downloadCsv(toCsv(mapped, [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Tên' },
    { key: 'phone', label: 'Điện thoại', type: 'text' },
    { key: 'attendingLabel', label: 'Tham dự' },
    { key: 'guestCount', label: 'Số khách' },
    { key: 'note', label: 'Ghi chú' },
    { key: 'createdAt', label: 'Thời gian' },
  ]), `ds-${filterSuffix}-${Date.now()}.csv`)
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
