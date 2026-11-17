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

// 1. Tạo bảng wishes (Sổ lưu bút) & Indexes tối ưu truy vấn
db.exec(`
  CREATE TABLE IF NOT EXISTS wishes (
    id TEXT PRIMARY KEY,
    sender TEXT NOT NULL,
    relationship TEXT DEFAULT '',
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON wishes (created_at DESC);
`)

// 2. Tạo bảng rsvps (Xác nhận tham dự) & Indexes tối ưu truy vấn
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
  CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps (created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON rsvps (attending, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_rsvps_phone ON rsvps (phone);
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
      "id": "wish-1",
      "sender": "Thu nè",
      "relationship": "Bạn thân",
      "message": "Phải thật hạnh phúc nhé",
      "createdAt": "2026-11-17T10:30:00.000Z"
    },
  ]

  const insertMany = db.transaction((wishes) => {
    for (const w of wishes) {
      insertWish.run(
        w.id,
        w.sender,
        w.relationship || '',
        w.message,
        w.createdAt || w.created_at || new Date().toISOString()
      )
    }
  })
  insertMany(initialWishes)
}

// ─── Query Helpers ────────────────────────────────────────────────

export function getAllWishes() {
  const stmt = db.prepare('SELECT id, sender, relationship, message, created_at as createdAt FROM wishes ORDER BY datetime(created_at) DESC')
  return stmt.all()
}

/**
 * Truy vấn danh sách Lời chúc có tìm kiếm và phân trang tối ưu
 */
export function queryWishes({ page = 1, limit = 10, search = '' } = {}) {
  const whereClauses = []
  const params = []

  const trimmedSearch = (search || '').trim()
  if (trimmedSearch) {
    whereClauses.push('(sender LIKE ? OR relationship LIKE ? OR message LIKE ?)')
    const pattern = `%${trimmedSearch}%`
    params.push(pattern, pattern, pattern)
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

  const countStmt = db.prepare(`SELECT COUNT(*) as total FROM wishes ${whereSql}`)
  const { total } = countStmt.get(...params)

  const pageNum = Math.max(1, parseInt(page, 10) || 1)
  const limitNum = parseInt(limit, 10)

  let data
  if (limitNum > 0) {
    const offset = (pageNum - 1) * limitNum
    const dataStmt = db.prepare(`
      SELECT id, sender, relationship, message, created_at as createdAt
      FROM wishes
      ${whereSql}
      ORDER BY datetime(created_at) DESC
      LIMIT ? OFFSET ?
    `)
    data = dataStmt.all(...params, limitNum, offset)
  } else {
    const dataStmt = db.prepare(`
      SELECT id, sender, relationship, message, created_at as createdAt
      FROM wishes
      ${whereSql}
      ORDER BY datetime(created_at) DESC
    `)
    data = dataStmt.all(...params)
  }

  const totalPages = limitNum > 0 ? (Math.ceil(total / limitNum) || 1) : 1

  return {
    data,
    pagination: {
      page: pageNum,
      limit: limitNum > 0 ? limitNum : total,
      total,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1,
    },
  }
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

/**
 * Truy vấn danh sách RSVP có tìm kiếm và phân trang tối ưu
 */
export function queryRsvps({ page = 1, limit = 10, search = '', attending = 'all' } = {}) {
  const whereClauses = []
  const params = []

  if (attending === 'yes' || attending === 'no') {
    whereClauses.push('attending = ?')
    params.push(attending)
  }

  const trimmedSearch = (search || '').trim()
  if (trimmedSearch) {
    whereClauses.push('(name LIKE ? OR phone LIKE ? OR note LIKE ?)')
    const pattern = `%${trimmedSearch}%`
    params.push(pattern, pattern, pattern)
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

  const countStmt = db.prepare(`SELECT COUNT(*) as total FROM rsvps ${whereSql}`)
  const { total } = countStmt.get(...params)

  const pageNum = Math.max(1, parseInt(page, 10) || 1)
  const limitNum = parseInt(limit, 10)

  let data
  if (limitNum > 0) {
    const offset = (pageNum - 1) * limitNum
    const dataStmt = db.prepare(`
      SELECT id, name, phone, attending, party_size as partySize, note, created_at as createdAt
      FROM rsvps
      ${whereSql}
      ORDER BY datetime(created_at) DESC
      LIMIT ? OFFSET ?
    `)
    data = dataStmt.all(...params, limitNum, offset)
  } else {
    const dataStmt = db.prepare(`
      SELECT id, name, phone, attending, party_size as partySize, note, created_at as createdAt
      FROM rsvps
      ${whereSql}
      ORDER BY datetime(created_at) DESC
    `)
    data = dataStmt.all(...params)
  }

  const totalPages = limitNum > 0 ? (Math.ceil(total / limitNum) || 1) : 1

  return {
    data,
    pagination: {
      page: pageNum,
      limit: limitNum > 0 ? limitNum : total,
      total,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1,
    },
  }
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
