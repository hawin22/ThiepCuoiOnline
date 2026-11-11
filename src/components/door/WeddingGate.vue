<template>
  <Transition name="gate-fade">
    <div v-if="!opened"
      class="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      :class="{'pointer-events-none': isOpening}">

      <!-- ── Nền kem sữa sáng ─────────────────────────── -->
      <div class="absolute inset-0" style="background:#F8F5EF;"></div>
      <!-- Lưới chấm vàng champagne -->
      <div class="absolute inset-0"
        style="background-image:radial-gradient(circle,rgba(199,168,120,0.22) 1px,transparent 1px);
               background-size:28px 28px; opacity:0.6;">
      </div>

      <!-- Gate perspective -->
      <div class="gate-perspective relative w-full h-full flex">

        <!-- ══════════ CÁNH TRÁI (Slide Left) ══════════ -->
        <div class="door-panel-left relative w-1/2 h-full overflow-hidden select-none"
          :class="{'door-opened': isOpening}">

          <!-- Nền cánh be nhạt -->
          <div class="absolute inset-0"
            style="background:linear-gradient(to right,#EDE5D8 0%,#F0E8DC 55%,#F4EDE2 100%);">
          </div>

          <!-- ── Chữ 囍 LỚN NỔI BẬT nền cánh trái ─────────── -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style="font-size:clamp(110px,20vw,210px); line-height:1; color:#B9827A; opacity:0.46;
                   font-family:'Playfair Display', serif; font-weight:700;
                   text-shadow: 0 2px 4px rgba(255,255,255,0.7), 0 4px 16px rgba(185,130,122,0.3);
                   letter-spacing:-4px;">
            囍
          </div>

          <!-- ── Cành hoa champagne dọc cạnh trong ─────────── -->
          <svg class="absolute right-0 top-0 h-full pointer-events-none"
            style="width:36px; sm:width:48px; opacity:0.28;" viewBox="0 0 48 800" preserveAspectRatio="none" fill="none">
            <path d="M24 0 L24 800" stroke="#C7A878" stroke-width="1.2"/>
            <g v-for="y in [80,180,280,380,480,580,680]" :key="y">
              <circle :cy="y" cx="24" r="3.5" fill="#C7A878" opacity="0.7"/>
              <path :d="`M24 ${y} Q14 ${y-18} 10 ${y-30}`" stroke="#C7A878" stroke-width="0.9" fill="none"/>
              <path :d="`M24 ${y} Q34 ${y-18} 38 ${y-30}`" stroke="#C7A878" stroke-width="0.9" fill="none"/>
              <circle :cy="y-30" cx="10" r="2" fill="#B9827A" opacity="0.5"/>
              <circle :cy="y-30" cx="38" r="2" fill="#B9827A" opacity="0.5"/>
            </g>
          </svg>

          <!-- Khung viền champagne đôi -->
          <div class="absolute pointer-events-none"
            style="inset:8px sm:inset:12px; border:1.5px solid rgba(199,168,120,0.55);">
          </div>
          <div class="absolute pointer-events-none"
            style="inset:14px sm:inset:18px; border:1px solid rgba(199,168,120,0.28);">
          </div>

          <!-- Vòm đỉnh -->
          <div class="absolute pointer-events-none" style="top:12px;left:50%;transform:translateX(-50%);width:clamp(100px,18vw,140px);height:60px;opacity:0.55;">
            <svg viewBox="0 0 140 72" fill="none" class="w-full h-full">
              <path d="M70 5 Q130 5 130 46 L130 72 L10 72 L10 46 Q10 5 70 5Z" stroke="#C7A878" stroke-width="1.3" fill="none"/>
              <path d="M70 15 Q118 15 118 44 L118 72 L22 72 L22 44 Q22 15 70 15Z" stroke="#C7A878" stroke-width="0.6" fill="none" opacity="0.5"/>
              <circle cx="70" cy="29" r="5" stroke="#C7A878" stroke-width="0.9" fill="none" opacity="0.7"/>
              <path d="M62 40 Q70 30 78 40" stroke="#C7A878" stroke-width="0.7" fill="none" opacity="0.5"/>
            </svg>
          </div>

          <!-- Hoa văn góc dưới trái -->
          <div class="absolute pointer-events-none" style="bottom:10px;left:10px;opacity:0.4;">
            <svg viewBox="0 0 64 64" width="48" height="48" class="sm:w-16 sm:h-16" fill="none">
              <path d="M4 60 Q4 4 60 4" stroke="#C7A878" stroke-width="1.2"/>
              <path d="M4 48 Q16 16 48 4" stroke="#C7A878" stroke-width="0.6" opacity="0.5"/>
              <circle cx="6" cy="58" r="3" fill="#C7A878" opacity="0.6"/>
              <circle cx="20" cy="44" r="2.5" fill="#B9827A" opacity="0.4"/>
              <circle cx="34" cy="30" r="2" fill="#C7A878" opacity="0.3"/>
            </svg>
          </div>

          <!-- Bóng đổ cạnh trong (tạo chiều sâu sân khấu) -->
          <div class="absolute right-0 inset-y-0 w-8 sm:w-12 pointer-events-none"
            style="background:linear-gradient(to right,transparent,rgba(81,70,63,0.08));"></div>
        </div>

        <!-- ══════════ CÁNH PHẢI (Slide Right) ══════════ -->
        <div class="door-panel-right relative w-1/2 h-full overflow-hidden select-none"
          :class="{'door-opened': isOpening}">

          <div class="absolute inset-0"
            style="background:linear-gradient(to left,#EDE5D8 0%,#F0E8DC 55%,#F4EDE2 100%);">
          </div>

          <!-- ── Chữ 囍 LỚN NỔI BẬT nền cánh phải ─────────── -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style="font-size:clamp(110px,20vw,210px); line-height:1; color:#B9827A; opacity:0.46;
                   font-family:'Playfair Display', serif; font-weight:700;
                   text-shadow: 0 2px 4px rgba(255,255,255,0.7), 0 4px 16px rgba(185,130,122,0.3);
                   letter-spacing:-4px;">
            囍
          </div>

          <!-- Cành hoa dọc bên trái (gần khe giữa) -->
          <svg class="absolute left-0 top-0 h-full pointer-events-none"
            style="width:36px; sm:width:48px; opacity:0.28;" viewBox="0 0 48 800" preserveAspectRatio="none" fill="none">
            <path d="M24 0 L24 800" stroke="#C7A878" stroke-width="1.2"/>
            <g v-for="y in [80,180,280,380,480,580,680]" :key="y">
              <circle :cy="y" cx="24" r="3.5" fill="#C7A878" opacity="0.7"/>
              <path :d="`M24 ${y} Q14 ${y-18} 10 ${y-30}`" stroke="#C7A878" stroke-width="0.9" fill="none"/>
              <path :d="`M24 ${y} Q34 ${y-18} 38 ${y-30}`" stroke="#C7A878" stroke-width="0.9" fill="none"/>
              <circle :cy="y-30" cx="10" r="2" fill="#B9827A" opacity="0.5"/>
              <circle :cy="y-30" cx="38" r="2" fill="#B9827A" opacity="0.5"/>
            </g>
          </svg>

          <div class="absolute pointer-events-none" style="inset:8px sm:inset:12px;border:1.5px solid rgba(199,168,120,0.55);"></div>
          <div class="absolute pointer-events-none" style="inset:14px sm:inset:18px;border:1px solid rgba(199,168,120,0.28);"></div>

          <div class="absolute pointer-events-none" style="top:12px;left:50%;transform:translateX(-50%);width:clamp(100px,18vw,140px);height:60px;opacity:0.55;">
            <svg viewBox="0 0 140 72" fill="none" class="w-full h-full">
              <path d="M70 5 Q130 5 130 46 L130 72 L10 72 L10 46 Q10 5 70 5Z" stroke="#C7A878" stroke-width="1.3" fill="none"/>
              <path d="M70 15 Q118 15 118 44 L118 72 L22 72 L22 44 Q22 15 70 15Z" stroke="#C7A878" stroke-width="0.6" fill="none" opacity="0.5"/>
              <circle cx="70" cy="29" r="5" stroke="#C7A878" stroke-width="0.9" fill="none" opacity="0.7"/>
              <path d="M62 40 Q70 30 78 40" stroke="#C7A878" stroke-width="0.7" fill="none" opacity="0.5"/>
            </svg>
          </div>

          <!-- Hoa văn góc dưới phải (gương) -->
          <div class="absolute pointer-events-none" style="bottom:10px;right:10px;opacity:0.4;transform:scaleX(-1);">
            <svg viewBox="0 0 64 64" width="48" height="48" class="sm:w-16 sm:h-16" fill="none">
              <path d="M4 60 Q4 4 60 4" stroke="#C7A878" stroke-width="1.2"/>
              <path d="M4 48 Q16 16 48 4" stroke="#C7A878" stroke-width="0.6" opacity="0.5"/>
              <circle cx="6" cy="58" r="3" fill="#C7A878" opacity="0.6"/>
              <circle cx="20" cy="44" r="2.5" fill="#B9827A" opacity="0.4"/>
              <circle cx="34" cy="30" r="2" fill="#C7A878" opacity="0.3"/>
            </svg>
          </div>

          <div class="absolute left-0 inset-y-0 w-8 sm:w-12 pointer-events-none"
            style="background:linear-gradient(to left,transparent,rgba(81,70,63,0.08));"></div>
        </div>

        <!-- ══════════ ĐƯỜNG GIỮA & CON DẤU ══════════ -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">

          <!-- Khe cửa dọc mờ dần khi mở -->
          <div class="absolute top-0 bottom-0 left-1/2 w-px pointer-events-none transition-opacity duration-300"
            :class="isOpening ? 'opacity-0' : 'opacity-100'"
            style="background:linear-gradient(to bottom,transparent 0%,rgba(81,70,63,0.3) 20%,rgba(81,70,63,0.5) 50%,rgba(81,70,63,0.3) 80%,transparent 100%);">
          </div>

          <!-- Con dấu P&K -->
          <button @click="openGate" :disabled="isOpening"
            class="pointer-events-auto relative group z-10 flex flex-col items-center gap-4 sm:gap-5 outline-none">

            <!-- Vầng sáng pulsing -->
            <div class="absolute rounded-full animate-pulse-slow pointer-events-none transition-opacity duration-300"
              :class="isOpening ? 'opacity-0' : 'opacity-100'"
              style="inset:-18px sm:inset:-22px;background:radial-gradient(circle,rgba(185,130,122,0.22) 0%,transparent 70%);">
            </div>

            <!-- Đĩa con dấu (Responsive size) -->
            <div class="relative select-none cursor-pointer transition-all duration-500 w-32 h-32 sm:w-36 sm:h-36"
              :class="isOpening ? 'scale-75 opacity-0 pointer-events-none' : 'scale-100 opacity-100 group-hover:scale-108'">

              <svg class="absolute inset-0 w-full h-full" viewBox="0 0 144 144">
                <defs>
                  <linearGradient id="outerRing" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stop-color="#D4967A"/>
                    <stop offset="30%"  stop-color="#B9827A"/>
                    <stop offset="60%"  stop-color="#C9906A"/>
                    <stop offset="100%" stop-color="#D4967A"/>
                  </linearGradient>
                </defs>
                <circle cx="72" cy="72" r="70" fill="url(#outerRing)"/>
                <circle cx="72" cy="72" r="70" fill="none" stroke="#C7A878" stroke-width="2.5" opacity="0.6"/>
                <circle cx="72" cy="72" r="62" fill="none" stroke="#F8F5EF" stroke-width="0.8" stroke-dasharray="3 4" opacity="0.4"/>
              </svg>

              <!-- Nền sáp đậm bên trong -->
              <div class="absolute rounded-full" style="inset:6px;
                background:radial-gradient(circle at 38% 32%,#B87065 0%,#9A5248 45%,#7C3A36 75%,#612C2A 100%);
                box-shadow:inset 0 4px 12px rgba(255,220,210,0.18),inset 0 -4px 10px rgba(50,15,15,0.3);">
              </div>

              <!-- Chữ 囍 mờ bên trong con dấu (texture) -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none" style="opacity:0.12;">
                <span style="font-size:64px; sm:font-size:72px; line-height:1;color:#F8F5EF;font-family:serif;letter-spacing:-4px;">囍</span>
              </div>

              <!-- Vòng trang trí khắc bên trong -->
              <svg class="absolute opacity-25" style="inset:6px;width:calc(100% - 12px);height:calc(100% - 12px);" viewBox="0 0 132 132">
                <circle cx="66" cy="66" r="58" fill="none" stroke="#F8F5EF" stroke-width="0.7" stroke-dasharray="2 3.5"/>
                <circle cx="66" cy="66" r="52" fill="none" stroke="#F8F5EF" stroke-width="0.4"/>
                <path d="M66 12 L68.5 16 L66 20 L63.5 16Z" fill="#F8F5EF"/>
                <path d="M66 112 L68.5 116 L66 120 L63.5 116Z" fill="#F8F5EF"/>
                <path d="M12 66 L16 63.5 L20 66 L16 68.5Z" fill="#F8F5EF"/>
                <path d="M112 66 L116 63.5 L120 66 L116 68.5Z" fill="#F8F5EF"/>
              </svg>

              <!-- Chữ monogram P & K -->
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="font-script leading-none select-none text-3xl sm:text-4xl text-[#FAF7F2]"
                  style="text-shadow: 0 2px 10px rgba(60,20,18,0.6), 0 0 24px rgba(248,247,242,0.2);">
                  P &amp; K
                </span>
              </div>
            </div><!-- /seal disc -->

            <!-- Label bên dưới con dấu -->
            <div class="text-center transition-opacity duration-300"
              :class="isOpening ? 'opacity-0' : 'opacity-100'">
              <p class="font-script animate-float text-base sm:text-lg"
                style="color:#51463F; opacity:0.85;">
                {{ config.gate.sealSubtitle }}
              </p>
              <div class="flex justify-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                <span v-for="i in 3" :key="i"
                  class="rounded-full animate-pulse-slow"
                  style="width:4px;height:4px;background:#C7A878;opacity:0.55;"
                  :style="{animationDelay:`${i*0.4}s`}">
                </span>
              </div>
            </div>
          </button>
        </div>

        <!-- ══════════ TIÊU ĐỀ TRÊN ══════════ -->
        <div class="absolute top-4 sm:top-6 left-0 right-0 text-center pointer-events-none z-10 transition-opacity duration-300 px-4"
          :class="isOpening ? 'opacity-0' : 'opacity-100'">
          <p class="font-sans text-[10px] sm:text-xs tracking-[0.4em] uppercase" style="color:rgba(81,70,63,0.55);">
            {{ config.gate.gateTitle }}
          </p>
          <div class="flex items-center justify-center gap-3 mt-2">
            <div class="h-px w-6 sm:w-8" style="background:rgba(199,168,120,0.5);"></div>
            <span style="color:#C7A878;font-size:9px;">✦</span>
            <div class="h-px w-6 sm:w-8" style="background:rgba(199,168,120,0.5);"></div>
          </div>
        </div>

        <!-- ══════════ TRÍCH DẪN DƯỚI ══════════ -->
        <div class="absolute bottom-4 sm:bottom-6 left-0 right-0 text-center px-6 sm:px-10 pointer-events-none z-10 transition-opacity duration-300"
          :class="isOpening ? 'opacity-0' : 'opacity-100'">
          <p class="font-serif italic text-[11px] sm:text-xs md:text-sm leading-relaxed max-w-xs mx-auto"
            style="color:rgba(81,70,63,0.48);">
            "{{ config.gate.quote }}"
          </p>
        </div>

        <!-- ══════════ SPARKLE KHI MỞ ══════════ -->
        <Transition name="sparkle">
          <div v-if="isOpening"
            class="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div v-for="i in 18" :key="i" class="absolute rounded-full" :style="sparkleStyle(i)"></div>
          </div>
        </Transition>

      </div><!-- /.gate-perspective -->
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ config: { type: Object, required: true } })
const emit  = defineEmits(['opened', 'completed'])
const opened    = ref(false)
const isOpening = ref(false)

const sparkleColors = ['#C7A878','#E8D5A8','#B9827A','#D4967A','#E8DED0','#F8F5EF']

function sparkleStyle(i) {
  const angle = (i / 18) * 360
  const dist  = 90 + Math.random() * 80
  const rad   = (angle * Math.PI) / 180
  const size  = 4 + Math.random() * 6
  const color = sparkleColors[i % sparkleColors.length]
  return {
    transform:  `translate(${Math.cos(rad)*dist}px, ${Math.sin(rad)*dist}px)`,
    transition: `transform 1s ease-out ${i*0.04}s, opacity 1s ease-out ${i*0.04}s`,
    opacity:    0,
    width:      `${size}px`,
    height:     `${size}px`,
    background: color,
    boxShadow:  `0 0 ${size*2}px ${color}99`,
  }
}

async function openGate() {
  if (isOpening.value) return
  isOpening.value = true
  emit('opened')
  await new Promise(r => setTimeout(r, 1350))
  opened.value = true
  emit('completed')
}
</script>

<style scoped>
.gate-fade-leave-active { transition: opacity 0.4s ease; }
.gate-fade-leave-to     { opacity: 0; }
.sparkle-enter-active   { transition: opacity 0.3s ease; }
.sparkle-enter-from     { opacity: 0; }
.group-hover\:scale-108:hover { transform: scale(1.08); }
</style>
