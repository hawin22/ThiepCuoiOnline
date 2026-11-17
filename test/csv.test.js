import assert from 'node:assert/strict'
import { toCsv } from '../src/utils/csv.js'

assert.equal(
  toCsv([{ phone: '0901234567' }], [{ key: 'phone', label: 'Điện thoại', type: 'text' }]),
  'Điện thoại\n"=""0901234567"""'
)
