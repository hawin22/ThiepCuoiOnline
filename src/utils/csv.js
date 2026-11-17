export function toCsv(rows, cols) {
  const header = cols.map(c => c.label).join(',')
  const body = rows.map(row => cols.map(col => {
    const value = String(row[col.key] ?? '')
    const csvValue = col.type === 'text' ? `="${value.replace(/"/g, '""')}"` : value
    return `"${csvValue.replace(/"/g, '""')}"`
  }).join(',')).join('\n')
  return `${header}\n${body}`
}
