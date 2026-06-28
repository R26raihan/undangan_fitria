<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import CoverScreen from './components/CoverScreen.vue'
import InvitationContent from './components/InvitationContent.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import FallingPetals from './components/FallingPetals.vue'
import FloatingClouds from './components/FloatingClouds.vue'
import Dashboard from './components/Dashboard.vue'

const isOpened = ref(false)
const isMusicPlaying = ref(false)
const currentRoute = ref(window.location.hash)

const handleOpenInvitation = () => {
  isOpened.value = true
  isMusicPlaying.value = true
}

const handleToggleMusic = (state: boolean) => {
  isMusicPlaying.value = state
}

const updateRoute = () => {
  currentRoute.value = window.location.hash
}

onMounted(() => {
  window.addEventListener('hashchange', updateRoute)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', updateRoute)
})
</script>

<template>
  <div class="mobile-container">
    <!-- Render Dashboard if hash route matches #/dashboard -->
    <div v-if="currentRoute === '#/dashboard'" class="dashboard-wrapper">
      <Dashboard />
    </div>

    <!-- Otherwise render standard Wedding Invitation screen -->
    <div v-else>
      <!-- Falling Petals Background -->
      <FallingPetals />
      <!-- Floating Clouds Background -->
      <FloatingClouds />

      <Transition name="fade">
        <CoverScreen v-if="!isOpened" @open="handleOpenInvitation" />
      </Transition>

      <div v-if="isOpened" class="content-wrapper">
        <InvitationContent />
        <MusicPlayer :isPlaying="isMusicPlaying" @toggle="handleToggleMusic" />
      </div>
    </div>
  </div>
</template>

<style>
/* Global Reset details inside App.vue style tags if needed */
body {
  margin: 0;
  padding: 0;
  background-color: #2B4C59; /* Match primary brand color for empty space on desktop */
}

.content-wrapper {
  animation: fadeIn 1s ease-out;
  width: 100%;
  position: relative;
  z-index: 1;
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
