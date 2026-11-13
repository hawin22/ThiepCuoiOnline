import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Thư mục lưu database
const DB_DIR = path.resolve(__dirname, 'data')
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

const DB_PATH = path.join(DB_DIR, 'wedding.db')
const db = new Database(DB_PATH)

// Bật WAL mode (Write-Ahead Logging) để tăng tốc độ ghi/đọc đồng thời mượt mà
db.pragma('journal_mode = WAL')

// 1. Tạo bảng wishes (Sổ lưu bút)
db.exec(`
  CREATE TABLE IF NOT EXISTS wishes (
    id TEXT PRIMARY KEY,
    sender TEXT NOT NULL,
    relationship TEXT DEFAULT '',
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`)

// 2. Tạo bảng rsvps (Xác nhận tham dự)
db.exec(`
  CREATE TABLE IF NOT EXISTS rsvps (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    attending TEXT NOT NULL,
    party_size INTEGER DEFAULT 1,
    note TEXT DEFAULT '',
    created_at TEXT NOT NULL
  );
`)

// 3. Seed dữ liệu mẫu ban đầu nếu bảng wishes đang trống
const countWishes = db.prepare('SELECT COUNT(*) as count FROM wishes').get()
if (countWishes.count === 0) {
  const insertWish = db.prepare(`
    INSERT INTO wishes (id, sender, relationship, message, created_at)
    VALUES (?, ?, ?, ?, ?)
  `)

  const initialWishes = [
    {
      id: 'wish-1',
      sender: 'Gia đình Bác Ba',
      relationship: 'Họ hàng nhà trai',
      message: 'Chúc hai cháu trăm năm hạnh phúc, tình nghĩa vẹn tròn, sớm sinh quý tử nhé!',
      created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    },
    {
      id: 'wish-2',
      sender: 'Hội Bạn Thân',
      relationship: 'Bạn thân cô dâu',
      message: 'Chúc cô dâu xinh đẹp của chúng mình mãi luôn rạng rỡ và hạnh phúc viên mãn bên bến đỗ yêu thương!',
      created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    },
    {
      id: 'wish-3',
      sender: 'Anh Em Đồng Nghiệp',
      relationship: 'Đồng nghiệp chú rể',
      message: 'Chúc mừng chú rể đã rước được nàng về dinh! Chúc hai bạn trăm năm hoà hợp, bách niên giai lão!',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ]

  const insertMany = db.transaction((wishes) => {
    for (const w of wishes) {
      insertWish.run(w.id, w.sender, w.relationship, w.message, w.created_at)
    }
  })
  insertMany(initialWishes)
}

// ─── Query Helpers ────────────────────────────────────────────────

export function getAllWishes() {
  const stmt = db.prepare('SELECT id, sender, relationship, message, created_at as createdAt FROM wishes ORDER BY datetime(created_at) DESC')
  return stmt.all()
}

export function createWish({ sender, relationship = '', message }) {
  const id = `wish-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const createdAt = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO wishes (id, sender, relationship, message, created_at)
    VALUES (?, ?, ?, ?, ?)
  `)
  stmt.run(id, sender, relationship, message, createdAt)

  return { id, sender, relationship, message, createdAt }
}

export function getAllRsvps() {
  const stmt = db.prepare('SELECT id, name, phone, attending, party_size as partySize, note, created_at as createdAt FROM rsvps ORDER BY datetime(created_at) DESC')
  return stmt.all()
}

export function createRsvp({ name, phone = '', attending = 'yes', partySize = 1, note = '' }) {
  const id = `rsvp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const createdAt = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO rsvps (id, name, phone, attending, party_size, note, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  stmt.run(id, name, phone, attending, partySize, note, createdAt)

  return { id, name, phone, attending, partySize, note, createdAt }
}

export function updateWish(id, { sender, relationship = '', message }) {
  const stmt = db.prepare(`
    UPDATE wishes
    SET sender = ?, relationship = ?, message = ?
    WHERE id = ?
  `)
  const info = stmt.run(sender, relationship, message, id)
  if (info.changes === 0) return null

  return db.prepare('SELECT id, sender, relationship, message, created_at as createdAt FROM wishes WHERE id = ?').get(id)
}

export function deleteWish(id) {
  const stmt = db.prepare('DELETE FROM wishes WHERE id = ?')
  const info = stmt.run(id)
  return info.changes > 0
}

export function updateRsvp(id, { name, phone = '', attending = 'yes', partySize = 1, note = '' }) {
  const stmt = db.prepare(`
    UPDATE rsvps
    SET name = ?, phone = ?, attending = ?, party_size = ?, note = ?
    WHERE id = ?
  `)
  const info = stmt.run(name, phone, attending, partySize, note, id)
  if (info.changes === 0) return null

  return db.prepare('SELECT id, name, phone, attending, party_size as partySize, note, created_at as createdAt FROM rsvps WHERE id = ?').get(id)
}

export function deleteRsvp(id) {
  const stmt = db.prepare('DELETE FROM rsvps WHERE id = ?')
  const info = stmt.run(id)
  return info.changes > 0
}

export default db
