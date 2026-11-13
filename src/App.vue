<template>
  <!-- TRANG ADMIN -->
  <AdminDashboard v-if="isAdminRoute" />

  <!-- TRANG CHỦ THIỆP CƯỚI -->
  <div v-else class="relative min-h-screen" :class="{'overflow-hidden h-screen': gateClosed}">
    <!-- Falling petals layer (khi mở cửa xong) -->
    <FallingPetals v-if="gateOpened" />

    <!-- WEDDING GATE (CÁNH CỬA SÂN KHẤU) -->
    <WeddingGate :config="config" @opened="onGateOpened" @completed="onGateCompleted" />

    <!-- MAIN INVITATION CONTENT (luôn sẵn sàng phía sau cánh cửa) -->
    <main class="relative min-h-screen">
      <CoverHero         :config="config" />
      <InvitationSection :config="config" :guest-name="guestName" :guest-role="guestRole" />
      <CoupleBio         :config="config" />
      <EventsSchedule    :config="config" />
      <CountdownSection  :config="config" />
      <PhotoGallery      :config="config" />
      <RsvpForm          :config="config" />
      <WishesAndGifts    :config="config" />
      <ThankYou          :config="config" />
    </main>

    <!-- FLOATING UI -->
    <template v-if="gateOpened">
      <AudioPlayer />
      <AutoScrollButton :is-scrolling="isScrolling" @toggle="toggleScroll" />
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWeddingConfig } from '@/composables/useWeddingData.js'
import { useAutoScroll }    from '@/composables/useAutoScroll.js'
import { useAudio }         from '@/composables/useAudio.js'

import AdminDashboard    from '@/components/admin/AdminDashboard.vue'
import WeddingGate       from '@/components/door/WeddingGate.vue'
import FallingPetals     from '@/components/common/FallingPetals.vue'
import AudioPlayer       from '@/components/common/AudioPlayer.vue'
import AutoScrollButton  from '@/components/common/AutoScrollButton.vue'

import CoverHero         from '@/components/sections/01_CoverHero.vue'
import InvitationSection from '@/components/sections/02_Invitation.vue'
import CoupleBio         from '@/components/sections/03_CoupleBio.vue'
import EventsSchedule    from '@/components/sections/05_EventsSchedule.vue'
import CountdownSection  from '@/components/sections/06_Countdown.vue'
import PhotoGallery      from '@/components/sections/07_PhotoGallery.vue'
import RsvpForm          from '@/components/sections/08_RsvpForm.vue'
import WishesAndGifts    from '@/components/sections/09_WishesAndGifts.vue'
import ThankYou          from '@/components/sections/10_ThankYou.vue'

const isAdminRoute = computed(() =>
  window.location.pathname === '/admin' ||
  window.location.hash === '#admin'
)

const { config, guestName, guestRole } = useWeddingConfig()
const { triggerFromGesture } = useAudio()
const { isScrolling, toggleScroll } = useAutoScroll()

const gateClosed = ref(true)
const gateOpened = ref(false)

function onGateOpened() {
  triggerFromGesture()
  gateClosed.value = false
}

function onGateCompleted() {
  gateOpened.value = true
}
</script>
