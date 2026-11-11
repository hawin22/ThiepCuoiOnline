<template>
  <section class="py-20 md:py-24 px-4 sm:px-6 relative overflow-hidden" style="background:#F8F5EF;">
    <div class="max-w-lg mx-auto relative z-10" ref="el">

      <!-- Title -->
      <div class="text-center mb-10 md:mb-12 transition-all duration-700"
        :class="isVisible?'opacity-100 translate-y-0':'opacity-0 translate-y-8'">
        <p class="font-sans text-[11px] md:text-xs tracking-[0.35em] uppercase mb-2 font-medium" style="color:#C7A878;">RSVP</p>
        <h2 class="font-serif font-semibold text-2xl sm:text-3xl" style="color:#51463F;">Xác Nhận Tham Dự</h2>
        <div class="flex items-center justify-center gap-3 mt-3.5 mb-5">
          <div class="h-px w-10 bg-champ/40"></div>
          <span style="color:#C7A878; font-size:11px;">✦</span>
          <div class="h-px w-10 bg-champ/40"></div>
        </div>
        <p class="font-serif italic text-xs sm:text-sm leading-relaxed max-w-sm mx-auto" style="color:rgba(81,70,63,0.6);">
          {{ config.rsvp.subtitle }}
        </p>
      </div>

      <!-- ═══ FORM ═══ -->
      <form v-if="!submitted" @submit.prevent="handleSubmit"
        class="transition-all duration-700"
        :class="isVisible?'opacity-100 translate-y-0':'opacity-0 translate-y-8'"
        :style="{transitionDelay:'200ms'}">

        <div class="space-y-4">
          <!-- Họ tên -->
          <div>
            <label class="form-label">Họ và tên *</label>
            <div class="input-wrap">
              <!-- Fountain calligraphy pen icon -->
              <svg class="input-icon" fill="none" stroke="currentColor" stroke-width="1.4" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/>
              </svg>
              <input v-model="form.name" type="text" required placeholder="Nhập họ và tên của bạn" class="form-input" />
            </div>
          </div>

          <!-- Điện thoại -->
          <div>
            <label class="form-label">Số điện thoại</label>
            <div class="input-wrap">
              <!-- Luxury phone icon -->
              <svg class="input-icon" fill="none" stroke="currentColor" stroke-width="1.4" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
              </svg>
              <input v-model="form.phone" type="tel" placeholder="0901 234 567" class="form-input" />
            </div>
          </div>

          <!-- Có tham dự không -->
          <div>
            <label class="form-label">Bạn sẽ tham dự?</label>
            <div class="grid grid-cols-2 gap-2.5 sm:gap-3">
              <!-- Option 1: Yes -->
              <label
                class="attend-option"
                :class="form.attending==='yes' ? 'attend-active' : 'attend-idle'"
                @click="form.attending = 'yes'"
              >
                <input type="radio" value="yes" v-model="form.attending" class="sr-only" />
                <span class="w-5 h-5 rounded-full flex items-center justify-center border border-champ/60 bg-champ/10 shrink-0">
                  <svg class="w-3 h-3 text-champ" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                  </svg>
                </span>
                <span class="font-sans text-xs sm:text-sm font-medium" style="color:#51463F;">Mình sẽ đến</span>
              </label>

              <!-- Option 2: No -->
              <label
                class="attend-option"
                :class="form.attending==='no' ? 'attend-active' : 'attend-idle'"
                @click="form.attending = 'no'"
              >
                <input type="radio" value="no" v-model="form.attending" class="sr-only" />
                <span class="w-5 h-5 rounded-full flex items-center justify-center border border-rose/50 bg-rose/10 shrink-0">
                  <svg class="w-2.5 h-2.5 text-rose" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </span>
                <span class="font-sans text-xs sm:text-sm font-medium" style="color:#51463F;">Rất tiếc rồi</span>
              </label>
            </div>
          </div>

          <!-- Số người — stepper đồng width -->
          <div v-if="form.attending==='yes'">
            <label class="form-label">Số người tham dự</label>
            <div class="input-wrap" style="padding:0; overflow:hidden;">
              <button type="button" @click="decGuests" :disabled="form.partySize<=1"
                class="stepper-btn" style="border-right:1px solid rgba(199,168,120,0.3);">−</button>
              <div class="flex-1 flex items-center justify-center gap-1.5 py-2">
                <svg class="w-4 h-4 text-champ/70 shrink-0" fill="none" stroke="currentColor" stroke-width="1.4" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
                </svg>
                <span class="font-serif text-base sm:text-lg tabular-nums font-semibold" style="color:#51463F;">
                  {{ form.partySize }} người
                </span>
              </div>
              <button type="button" @click="incGuests" :disabled="form.partySize>=10"
                class="stepper-btn" style="border-left:1px solid rgba(199,168,120,0.3);">+</button>
            </div>
          </div>

          <!-- Lời nhắn -->
          <div>
            <label class="form-label">Lời nhắn (nếu có)</label>
            <div class="input-wrap items-start" style="height:auto; min-height:96px; padding-top:10px; padding-bottom:10px;">
              <!-- Parchment letter icon -->
              <svg class="input-icon mt-1" fill="none" stroke="currentColor" stroke-width="1.4" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
              </svg>
              <textarea v-model="form.note" rows="3"
                placeholder="Gửi lời nhắn hoặc lời chúc đến đôi uyên ương..."
                class="form-input resize-none" style="padding-top:0;padding-bottom:0;"></textarea>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" :disabled="isSubmitting"
          class="w-full mt-6 py-3.5 sm:py-4 font-sans font-semibold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 hover:opacity-90 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
          style="background:linear-gradient(135deg,#C7A878 0%,#D8BF96 50%,#C7A878 100%);
                 color:#fff; border-radius:6px;
                 box-shadow:0 4px 18px rgba(199,168,120,0.32);">
          <svg v-if="!isSubmitting" class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
          </svg>
          <span>{{ isSubmitting ? 'Đang gửi phản hồi...' : 'Xác Nhận Tham Dự' }}</span>
        </button>

        <!-- Hotline -->
        <div class="mt-6 pt-5 text-center" style="border-top:1px solid rgba(199,168,120,0.2);">
          <p class="font-sans text-[11px] sm:text-xs mb-2.5" style="color:rgba(81,70,63,0.45);">Hoặc liên hệ trực tiếp cô dâu chú rể:</p>
          <div class="flex justify-center gap-6 sm:gap-8">
            <a :href="`tel:${config.rsvp.phoneBride}`" class="font-sans text-xs sm:text-sm flex items-center gap-1.5 transition-colors hover:opacity-80" style="color:#C7A878;">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
              </svg>
              <span>Cô Dâu: {{ config.rsvp.phoneBride }}</span>
            </a>
            <a :href="`tel:${config.rsvp.phoneGroom}`" class="font-sans text-xs sm:text-sm flex items-center gap-1.5 transition-colors hover:opacity-80" style="color:#C7A878;">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
              </svg>
              <span>Chú Rể: {{ config.rsvp.phoneGroom }}</span>
            </a>
          </div>
        </div>
      </form>

      <!-- Success state -->
      <div v-else class="text-center py-12 md:py-16">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-champ/15 border border-champ/40">
          <svg class="w-8 h-8 text-champ" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
          </svg>
        </div>
        <h3 class="font-serif text-2xl font-semibold mb-2.5" style="color:#51463F;">Cảm ơn bạn rất nhiều!</h3>
        <p class="font-serif italic text-sm leading-relaxed" style="color:rgba(81,70,63,0.65);">
          Chúng mình đã ghi nhận phản hồi của bạn.<br>Hẹn gặp nhau tại ngày chung đôi thật ấm áp! 💛
        </p>
        <button @click="submitted=false" class="mt-6 font-sans text-xs sm:text-sm underline underline-offset-4" style="color:#C7A878;">
          Gửi phản hồi khác
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersection.js'
import { useGuestData } from '@/composables/useWeddingData.js'

defineProps({ config: { type: Object, required: true } })
const { el, isVisible } = useIntersectionObserver()
const { addRsvp } = useGuestData()

const submitted    = ref(false)
const isSubmitting = ref(false)
const form = reactive({ name:'', phone:'', attending:'yes', partySize:2, note:'' })

function incGuests() { if (form.partySize < 10) form.partySize++ }
function decGuests() { if (form.partySize >  1) form.partySize-- }

async function handleSubmit() {
  if (!form.name) return
  isSubmitting.value = true
  await new Promise(r => setTimeout(r, 700))
  addRsvp({ ...form })
  try {
    const confetti = (await import('canvas-confetti')).default
    confetti({ particleCount:100, spread:70, origin:{ y:0.6 },
      colors:['#C7A878','#D8BF96','#F8F5EF','#B9827A','#E8DED0'] })
  } catch {}
  isSubmitting.value = false
  submitted.value    = true
}
</script>

<style scoped>
.form-label {
  display: block;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(81,70,63,0.55);
  font-weight: 500;
  margin-bottom: 6px;
}

.input-wrap {
  display: flex;
  align-items: center;
  height: 46px;
  width: 100%;
  background: #ffffff;
  border: 1px solid rgba(199,168,120,0.38);
  border-radius: 6px;
  padding: 0 14px;
  transition: all 0.25s ease;
}
.input-wrap:focus-within {
  border-color: #C7A878;
  box-shadow: 0 0 0 3px rgba(199,168,120,0.14);
}

.input-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #C7A878;
  margin-right: 12px;
}

.form-input {
  flex: 1;
  height: 100%;
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 0.88rem;
  color: #51463F;
}
.form-input::placeholder { color: rgba(81,70,63,0.35); }

.stepper-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-family: serif;
  color: #C7A878;
  background: #F8F5EF;
  transition: background 0.15s;
  flex-shrink: 0;
}
.stepper-btn:hover:not(:disabled) { background: rgba(199,168,120,0.12); }
.stepper-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.attend-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.attend-active {
  background: rgba(199,168,120,0.12);
  border: 1.5px solid #C7A878;
}
.attend-idle {
  background: #ffffff;
  border: 1px solid rgba(199,168,120,0.32);
}
.attend-idle:hover { border-color: rgba(199,168,120,0.6); }
</style>
