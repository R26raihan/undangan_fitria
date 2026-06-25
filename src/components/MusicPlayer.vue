<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  isPlaying: boolean
}>()

const emit = defineEmits(['toggle'])
const audioRef = ref<HTMLAudioElement | null>(null)

// A beautiful royalty-free romantic piano track
const audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'

watch(() => props.isPlaying, (newVal) => {
  if (audioRef.value) {
    if (newVal) {
      audioRef.value.play().catch(err => {
        console.log('Audio autoplay prevented or error:', err)
        emit('toggle', false)
      })
    } else {
      audioRef.value.pause()
    }
  }
})

const handleToggle = () => {
  emit('toggle', !props.isPlaying)
}
</script>

<template>
  <div>
    <audio ref="audioRef" :src="audioUrl" loop></audio>
    <button @click="handleToggle" class="music-toggle-btn" :class="{ 'is-playing': isPlaying }">
      <span class="music-icon" :class="{ 'spin-animation': isPlaying }">🎵</span>
    </button>
  </div>
</template>

<style scoped>
.music-toggle-btn {
  position: fixed;
  bottom: 25px;
  right: 25px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: var(--color-primary);
  border: 2px solid var(--color-secondary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  transition: all 0.3s ease;
}

.music-toggle-btn:hover {
  transform: scale(1.08);
}

.music-icon {
  font-size: 1.1rem;
  color: var(--color-secondary-light);
  display: inline-block;
}

.spin-animation {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
