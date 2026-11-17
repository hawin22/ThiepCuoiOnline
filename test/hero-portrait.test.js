import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../src/components/sections/01_CoverHero.vue', import.meta.url), 'utf8')

assert.match(source, /@media\s*\(max-width:\s*767px\)\s*and\s*\(orientation:\s*portrait\)/)
assert.match(source, /\.hero-badge\s*\{[^}]*top:\s*8vh/s)
assert.match(source, /\.hero-divider,\s*\.hero-monogram,\s*\.hero-scroll\s*\{[^}]*left:\s*50%[^}]*right:\s*auto[^}]*translate:\s*-50%\s*0/s)
assert.match(source, /\.hero-divider\s*\{[^}]*bottom:\s*18vh/s)
assert.match(source, /\.hero-monogram\s*\{[^}]*bottom:\s*10vh/s)
assert.match(source, /\.hero-scroll\s*\{[^}]*bottom:\s*3vh/s)
assert.match(source, /class="hero-scroll[^\"]*"[\s\S]*?<svg class="w-4 h-4 animate-bounce"/)
assert.doesNotMatch(source, /class="hero-scroll[^\"]*animate-bounce/)
