// Quản lý các kết nối Server-Sent Events (SSE)
const clients = new Set()

/**
 * Thêm một client kết nối SSE mới
 */
export function addSseClient(req, res) {
  // Thiết lập HTTP headers tiêu chuẩn cho Server-Sent Events
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'X-Accel-Buffering': 'no', // Tắt buffering của Nginx
  })

  // Gửi thông điệp chào mừng khởi đầu
  res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Connected to wedding live stream' })}\n\n`)

  clients.add(res)

  // Khi client đóng kết nối (tắt tab, mất mạng)
  req.on('close', () => {
    clients.delete(res)
  })
}

function broadcastEvent(eventName, payload) {
  const message = `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`
  for (const client of clients) {
    try {
      client.write(message)
    } catch {
      clients.delete(client)
    }
  }
}

/**
 * Phát sóng các sự kiện Realtime tới tất cả client đang online
 */
export function broadcastWish(wish) {
  broadcastEvent('new_wish', wish)
}

export function broadcastWishUpdate(wish) {
  broadcastEvent('update_wish', wish)
}

export function broadcastWishDelete(id) {
  broadcastEvent('delete_wish', { id })
}

export function broadcastRsvp(rsvp) {
  broadcastEvent('new_rsvp', rsvp)
}

export function broadcastRsvpUpdate(rsvp) {
  broadcastEvent('update_rsvp', rsvp)
}

export function broadcastRsvpDelete(id) {
  broadcastEvent('delete_rsvp', { id })
}

// Heartbeat định kỳ mỗi 25s để giữ kết nối qua các proxy, router hoặc 4G không bị timeout
setInterval(() => {
  for (const client of clients) {
    try {
      client.write(': ping\n\n')
    } catch {
      clients.delete(client)
    }
  }
}, 25000)
