import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import {
  getAllWishes,
  createWish,
  updateWish,
  deleteWish,
  getAllRsvps,
  createRsvp,
  updateRsvp,
  deleteRsvp,
} from './db.js'
import {
  addSseClient,
  broadcastWish,
  broadcastWishUpdate,
  broadcastWishDelete,
  broadcastRsvp,
  broadcastRsvpUpdate,
  broadcastRsvpDelete,
} from './sse.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const ADMIN_SECRET_TOKEN = 'wedding-admin-session-tk-2026'

app.use(cors())
app.use(express.json())

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET_TOKEN}`) {
    return res.status(401).json({ success: false, error: 'Yêu cầu đăng nhập quản trị viên' })
  }
  next()
}

// ─── PUBLIC API ROUTES ────────────────────────────────────────────

// 1. Lấy danh sách lời chúc
app.get('/api/wishes', (req, res) => {
  try {
    const wishes = getAllWishes()
    res.json({ success: true, data: wishes })
  } catch (error) {
    console.error('Lỗi khi lấy lời chúc:', error)
    res.status(500).json({ success: false, error: 'Không thể tải danh sách lời chúc' })
  }
})

// 2. Thêm lời chúc mới (Ghi vào SQLite + Broadcast realtime qua SSE)
app.post('/api/wishes', (req, res) => {
  try {
    const { sender, relationship, message } = req.body
    if (!sender || !message) {
      return res.status(400).json({ success: false, error: 'Tên người gửi và lời chúc là bắt buộc' })
    }

    const newWish = createWish({
      sender: sender.trim(),
      relationship: (relationship || '').trim(),
      message: message.trim(),
    })

    // Broadcast tới toàn bộ khách & admin đang online
    broadcastWish(newWish)

    res.status(201).json({ success: true, data: newWish })
  } catch (error) {
    console.error('Lỗi khi lưu lời chúc:', error)
    res.status(500).json({ success: false, error: 'Không thể lưu lời chúc' })
  }
})

// 3. Endpoint Realtime SSE stream (dùng chung cho cả Public & Admin)
app.get('/api/wishes/stream', (req, res) => {
  addSseClient(req, res)
})

// 4. Lấy danh sách xác nhận tham dự (RSVP)
app.get('/api/rsvps', (req, res) => {
  try {
    const rsvps = getAllRsvps()
    res.json({ success: true, data: rsvps })
  } catch (error) {
    console.error('Lỗi khi lấy danh sách RSVP:', error)
    res.status(500).json({ success: false, error: 'Không thể tải danh sách RSVP' })
  }
})

// 5. Gửi xác nhận tham dự (RSVP) + Broadcast tới Admin Realtime
app.post('/api/rsvp', (req, res) => {
  try {
    const { name, phone, attending, partySize, note } = req.body
    if (!name) {
      return res.status(400).json({ success: false, error: 'Họ và tên là bắt buộc' })
    }

    const newRsvp = createRsvp({
      name: name.trim(),
      phone: (phone || '').trim(),
      attending: attending === 'no' ? 'no' : 'yes',
      partySize: Number(partySize) || 1,
      note: (note || '').trim(),
    })

    // Broadcast cho admin realtime
    broadcastRsvp(newRsvp)

    res.status(201).json({ success: true, data: newRsvp })
  } catch (error) {
    console.error('Lỗi khi lưu RSVP:', error)
    res.status(500).json({ success: false, error: 'Không thể lưu xác nhận tham dự' })
  }
})

// 6. Health check & Thống kê cơ bản
app.get('/api/health', (req, res) => {
  const wishes = getAllWishes()
  const rsvps = getAllRsvps()
  res.json({
    status: 'ok',
    totalWishes: wishes.length,
    totalRsvps: rsvps.length,
    totalGuestsAttending: rsvps.filter((r) => r.attending === 'yes').reduce((sum, r) => sum + r.partySize, 0),
    timestamp: new Date().toISOString(),
  })
})

// ─── ADMIN API ROUTES (Yêu cầu tài khoản admin/admin) ─────────────

// Đăng nhập Admin
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body
  if (username === 'admin' && password === 'admin') {
    return res.json({
      success: true,
      token: ADMIN_SECRET_TOKEN,
      message: 'Đăng nhập thành công',
    })
  }
  return res.status(401).json({
    success: false,
    error: 'Tài khoản hoặc mật khẩu không chính xác',
  })
})

// Kiểm tra phiên đăng nhập
app.get('/api/admin/check', requireAdmin, (req, res) => {
  res.json({ success: true, authenticated: true })
})

// Sửa lời chúc
app.put('/api/admin/wishes/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params
    const { sender, relationship, message } = req.body
    if (!sender || !message) {
      return res.status(400).json({ success: false, error: 'Dữ liệu không hợp lệ' })
    }

    const updated = updateWish(id, {
      sender: sender.trim(),
      relationship: (relationship || '').trim(),
      message: message.trim(),
    })

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy lời chúc' })
    }

    broadcastWishUpdate(updated)
    res.json({ success: true, data: updated })
  } catch (err) {
    console.error('Lỗi sửa lời chúc:', err)
    res.status(500).json({ success: false, error: 'Không thể cập nhật lời chúc' })
  }
})

// Xóa lời chúc
app.delete('/api/admin/wishes/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params
    const ok = deleteWish(id)
    if (!ok) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy lời chúc để xóa' })
    }

    broadcastWishDelete(id)
    res.json({ success: true, message: 'Đã xóa lời chúc' })
  } catch (err) {
    console.error('Lỗi xóa lời chúc:', err)
    res.status(500).json({ success: false, error: 'Không thể xóa lời chúc' })
  }
})

// Sửa RSVP
app.put('/api/admin/rsvps/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params
    const { name, phone, attending, partySize, note } = req.body
    if (!name) {
      return res.status(400).json({ success: false, error: 'Họ tên là bắt buộc' })
    }

    const updated = updateRsvp(id, {
      name: name.trim(),
      phone: (phone || '').trim(),
      attending: attending === 'no' ? 'no' : 'yes',
      partySize: Number(partySize) || 1,
      note: (note || '').trim(),
    })

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy thông tin RSVP' })
    }

    broadcastRsvpUpdate(updated)
    res.json({ success: true, data: updated })
  } catch (err) {
    console.error('Lỗi sửa RSVP:', err)
    res.status(500).json({ success: false, error: 'Không thể cập nhật RSVP' })
  }
})

// Xóa RSVP
app.delete('/api/admin/rsvps/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params
    const ok = deleteRsvp(id)
    if (!ok) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy RSVP để xóa' })
    }

    broadcastRsvpDelete(id)
    res.json({ success: true, message: 'Đã xóa RSVP' })
  } catch (err) {
    console.error('Lỗi xóa RSVP:', err)
    res.status(500).json({ success: false, error: 'Không thể xóa RSVP' })
  }
})

// ─── PHỤC VỤ STATIC FILES KHI PRODUCTION ─────────────────────────
const DIST_PATH = path.resolve(__dirname, '../dist')
if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH))
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    res.sendFile(path.join(DIST_PATH, 'index.html'))
  })
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Wedding Backend API đang chạy tại: http://localhost:${PORT}`)
})
