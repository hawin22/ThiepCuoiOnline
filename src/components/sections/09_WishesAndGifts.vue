<template>
  <section class="py-20 md:py-24 px-4 sm:px-6 relative overflow-hidden" style="background:#E8DED0;">
    <div class="absolute inset-0 pointer-events-none"
      style="background:radial-gradient(ellipse at 50% 0%, rgba(199,168,120,0.12) 0%, transparent 60%);">
    </div>

    <div class="max-w-4xl mx-auto relative z-10" ref="el">

      <!-- Title -->
      <div class="text-center mb-12 md:mb-16 transition-all duration-700"
        :class="isVisible?'opacity-100 translate-y-0':'opacity-0 translate-y-8'">
        <p class="font-sans text-[11px] md:text-xs tracking-[0.35em] uppercase mb-2 font-medium" style="color:#C7A878;">Wishes &amp; Gifts</p>
        <h2 class="font-serif font-semibold text-2xl sm:text-3xl" style="color:#51463F;">Lời Chúc &amp; Mừng Cưới</h2>
        <div class="flex items-center justify-center gap-3 mt-3.5">
          <div class="h-px w-10 bg-champ/40"></div>
          <span style="color:#C7A878;font-size:11px;">✦</span>
          <div class="h-px w-10 bg-champ/40"></div>
        </div>
        <p class="font-serif italic text-xs sm:text-sm mt-4 max-w-sm mx-auto leading-relaxed" style="color:rgba(81,70,63,0.6);">
          "{{ config.gifts.subtitle }}"
        </p>
      </div>

      <!-- ══════════════════════════════════
           PHẦN 1: SỔ LƯU BÚT (WISHES FIRST)
      ══════════════════════════════════ -->
      <div class="mb-14 md:mb-16 transition-all duration-700"
        :class="isVisible?'opacity-100 translate-y-0':'opacity-0 translate-y-8'"
        :style="{transitionDelay:'150ms'}">

        <!-- Sub heading -->
        <div class="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8">
          <div class="h-px flex-1" style="background:rgba(199,168,120,0.35);"></div>
          <div class="flex items-center gap-2 shrink-0">
            <!-- Luxury quill feather icon -->
            <svg class="w-4 h-4" style="color:#C7A878;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/>
            </svg>
            <h3 class="font-serif text-base sm:text-lg font-semibold" style="color:#51463F;">Sổ Lưu Bút Online</h3>
          </div>
          <div class="h-px flex-1" style="background:rgba(199,168,120,0.35);"></div>
        </div>

        <p class="font-serif italic text-xs sm:text-sm text-center mb-6" style="color:rgba(81,70,63,0.55);">
          {{ config.gifts.wishIntro }}
        </p>

        <!-- Form nhập lời chúc — cân đối chuẩn xác -->
        <form @submit.prevent="submitWish"
          class="mb-6 p-5 sm:p-7 space-y-4"
          style="background:#FFFFFF; border:1px solid rgba(199,168,120,0.3); border-radius:8px; box-shadow:0 4px 20px rgba(81,70,63,0.04);">

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="wish-label">Tên của bạn *</label>
              <div class="wish-wrap">
                <!-- Quill icon -->
                <svg class="wish-icon" fill="none" stroke="currentColor" stroke-width="1.4" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/>
                </svg>
                <input v-model="wishForm.sender" required type="text"
                  placeholder="Nhập tên của bạn" class="wish-input" />
              </div>
            </div>

            <div>
              <label class="wish-label">Mối quan hệ</label>
              <div class="wish-wrap">
                <!-- Entwined rings/ribbon icon -->
                <svg class="wish-icon" fill="none" stroke="currentColor" stroke-width="1.4" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <input v-model="wishForm.relationship" type="text"
                  placeholder="Bạn thân, Đồng nghiệp, Họ hàng..." class="wish-input" />
              </div>
            </div>
          </div>

          <!-- Lời chúc textarea -->
          <div>
            <label class="wish-label">Lời chúc gửi đôi uyên ương *</label>
            <div class="wish-wrap items-start" style="height:auto; min-height:96px; padding-top:10px; padding-bottom:10px;">
              <!-- Parchment scroll icon -->
              <svg class="wish-icon mt-1" fill="none" stroke="currentColor" stroke-width="1.4" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <textarea v-model="wishForm.message" required rows="3"
                placeholder="Gửi gắm những lời chúc phúc tốt đẹp nhất từ trái tim bạn..."
                class="wish-input resize-none" style="padding-top:0;padding-bottom:0;"></textarea>
            </div>
          </div>

          <div class="flex justify-end pt-1">
            <button type="submit"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:opacity-90 active:scale-[0.99]"
              style="background:linear-gradient(135deg,#C7A878,#D8BF96); color:#fff;
                     border-radius:6px; box-shadow:0 3px 14px rgba(199,168,120,0.3);">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
              </svg>
              <span>Gửi Lời Chúc</span>
            </button>
          </div>
        </form>

        <!-- Danh sách lời chúc -->
        <div class="space-y-3 max-h-72 overflow-y-auto pr-1" style="scrollbar-width:thin;scrollbar-color:#C7A878 transparent;">
          <TransitionGroup name="wish-slide">
            <div v-for="wish in guestData.wishes" :key="wish.id"
              class="relative p-4 sm:p-5 transition-shadow duration-300"
              style="background:#FDFBF8; border:1px solid rgba(199,168,120,0.2); border-radius:6px;">
              <span class="absolute top-2 right-4 font-script select-none pointer-events-none"
                style="font-size:2.5rem; line-height:1; color:rgba(199,168,120,0.12);">"</span>
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-serif font-semibold text-xs sm:text-sm shrink-0"
                  style="background:rgba(199,168,120,0.14); color:#C7A878; border:1.5px solid rgba(199,168,120,0.35);">
                  {{ wish.sender.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="font-sans font-semibold text-xs sm:text-sm" style="color:#51463F;">{{ wish.sender }}</p>
                  <p v-if="wish.relationship" class="font-sans text-[11px] sm:text-xs" style="color:rgba(81,70,63,0.5);">{{ wish.relationship }}</p>
                </div>
              </div>
              <p class="font-serif italic text-xs sm:text-sm leading-relaxed pl-11 sm:pl-12 pr-4" style="color:rgba(81,70,63,0.72);">
                "{{ wish.message }}"
              </p>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- ══════════════════════════════════
           PHẦN 2: HỘP MỪNG CƯỚI (GIFTS)
      ══════════════════════════════════ -->
      <div class="transition-all duration-700"
        :class="isVisible?'opacity-100 translate-y-0':'opacity-0 translate-y-8'"
        :style="{transitionDelay:'300ms'}">

        <div class="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8">
          <div class="h-px flex-1" style="background:rgba(199,168,120,0.35);"></div>
          <div class="flex items-center gap-2 shrink-0">
            <!-- Gift box luxury icon -->
            <svg class="w-4 h-4" style="color:#C7A878;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
            </svg>
            <h3 class="font-serif text-base sm:text-lg font-semibold" style="color:#51463F;">Hộp Mừng Cưới</h3>
          </div>
          <div class="h-px flex-1" style="background:rgba(199,168,120,0.35);"></div>
        </div>

        <p class="font-serif italic text-xs sm:text-sm text-center mb-6 md:mb-8" style="color:rgba(81,70,63,0.55);">
          {{ config.gifts.giftIntro }}
        </p>

        <!-- Hộp thông tin mừng cưới (Căn giữa hoàn hảo trên mọi màn hình) -->
        <div class="flex justify-center w-full">
          <div v-for="account in config.gifts.accounts" :key="account.accountNumber"
            class="w-full max-w-sm sm:max-w-md p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-lg mx-auto"
            style="background:#FFFFFF; border:1.5px solid rgba(199,168,120,0.35); border-radius:12px; box-shadow:0 8px 30px rgba(81,70,63,0.06);">
            <p class="font-script text-3xl sm:text-4xl mb-4" style="color:#C7A878;">{{ account.role }}</p>

            <div class="flex justify-center mb-5">
              <div class="p-3 sm:p-3.5 shadow-sm" style="border:1.5px solid rgba(199,168,120,0.35); border-radius:10px; background:#F8F5EF;">
                <img :src="account.qrUrl?.startsWith('.') ? account.qrUrl.slice(1) : account.qrUrl" :alt="`QR ${account.name}`"
                  class="w-40 h-40 sm:w-48 sm:h-48 object-contain rounded-sm"
                  onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
                <div class="hidden w-40 h-40 sm:w-48 sm:h-48 items-center justify-center text-xs font-sans text-center p-3 leading-relaxed"
                  style="color:rgba(81,70,63,0.6);">
                  📱 {{ account.bankName }}<br/>{{ account.accountNumber }}
                </div>
              </div>
            </div>

            <p class="font-serif font-semibold text-sm sm:text-base mb-1" style="color:#51463F;">{{ account.name }}</p>
            <p class="font-sans text-xs sm:text-sm mb-4" style="color:rgba(81,70,63,0.6);">{{ account.bankName }}</p>

            <!-- Copy STK button -->
            <button @click="copySTK(account)" class="w-full flex items-center justify-center gap-2.5 py-3 transition-all duration-300 hover:bg-[#E8DED0]/50 active:scale-[0.99]"
              style="border:1.5px solid rgba(199,168,120,0.4); border-radius:8px; background:#F8F5EF;"
              :style="copiedId===account.accountNumber ? 'border-color:#C7A878;background:rgba(199,168,120,0.15);' : ''">
              <span class="font-sans text-xs sm:text-sm font-semibold tracking-wider" style="color:#51463F;">{{ account.accountNumber }}</span>
              <!-- Luxury copy icon -->
              <svg class="w-4 h-4" style="color:#C7A878;" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"/>
              </svg>
              <span class="font-sans text-xs font-medium" style="color:#C7A878;">
                {{ copiedId===account.accountNumber ? '✅ Đã sao chép' : 'Sao chép' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersection.js'
import { useGuestData } from '@/composables/useWeddingData.js'

defineProps({ config: { type: Object, required: true } })
const { el, isVisible } = useIntersectionObserver({ threshold: 0.05 })
const { guestData, addWish } = useGuestData()

const copiedId = ref(null)
function copySTK(account) {
  navigator.clipboard?.writeText(account.accountNumber).catch(()=>{})
  copiedId.value = account.accountNumber
  setTimeout(()=>{ copiedId.value = null }, 2000)
}

const wishForm = reactive({ sender:'', relationship:'', message:'' })
function submitWish() {
  if (!wishForm.sender || !wishForm.message) return
  addWish({ ...wishForm })
  wishForm.sender = ''
  wishForm.relationship = ''
  wishForm.message = ''
}
</script>

<style scoped>
.wish-label {
  display: block;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(81,70,63,0.55);
  font-weight: 500;
  margin-bottom: 6px;
}
.wish-wrap {
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
.wish-wrap:focus-within {
  border-color: #C7A878;
  box-shadow: 0 0 0 3px rgba(199,168,120,0.14);
}
.wish-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #C7A878;
  margin-right: 12px;
}
.wish-input {
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
.wish-input::placeholder { color: rgba(81,70,63,0.35); font-style: normal; }

.wish-slide-enter-active { transition: all 0.4s ease; }
.wish-slide-enter-from   { opacity: 0; transform: translateY(-8px); }
</style>
