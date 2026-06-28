<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Petal {
  id: number
  left: string
  delay: string
  duration: string
  size: string
  opacity: number
  type: number
}

const petals = ref<Petal[]>([])

onMounted(() => {
  // Reduced to 12 petals for performance
  const count = 12
  for (let i = 0; i < count; i++) {
    petals.value.push({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${12 + Math.random() * 10}s`,
      size: `${10 + Math.random() * 12}px`,
      opacity: 0.3 + Math.random() * 0.4,
      type: Math.floor(Math.random() * 3)
    })
  }
})
</script>

<template>
  <div class="petals-container">
    <div
      v-for="petal in petals"
      :key="petal.id"
      class="petal"
      :style="{
        left: petal.left,
        animationDelay: petal.delay,
        animationDuration: petal.duration,
        width: petal.size,
        height: petal.size,
        opacity: petal.opacity
      }"
    >
      <!-- Petal Shape 1 -->
      <svg v-if="petal.type === 0" viewBox="0 0 24 24" fill="none" class="petal-svg">
        <path d="M12 2C12 2 4 10 4 15C4 18.866 7.13401 22 12 22C16.866 22 20 18.866 20 15C20 10 12 2 12 2Z" fill="var(--color-secondary)" />
      </svg>
      <!-- Petal Shape 2 -->
      <svg v-else-if="petal.type === 1" viewBox="0 0 24 24" fill="none" class="petal-svg">
        <path d="M12 2C7 7 4 12 4 16C4 19.3 6.7 22 10 22C13.3 22 16 19.3 16 16C16 12 17 7 12 2Z" fill="var(--color-secondary-light)" />
      </svg>
      <!-- Petal Shape 3 (Leaf outline) -->
      <svg v-else viewBox="0 0 24 24" fill="none" class="petal-svg">
        <path d="M17.657 6.343a8 8 0 0 0-11.314 0A8.02 8.02 0 0 0 4 12c0 2.21.895 4.21 2.343 5.657L12 23l5.657-5.343A8.02 8.02 0 0 0 20 12c0-2.21-.895-4.21-2.343-5.657Z" fill="#a5b1c2" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.petals-container {
  position: fixed; /* Fixed viewport agar kelopak bunga terus berguguran di seluruh halaman saat di-scroll */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1; /* Di bawah konten utama agar tidak menghalangi teks */
}

.petal {
  position: absolute;
  top: 0;
  display: block;
  pointer-events: none;
  will-change: transform;
  animation-name: fall;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.petal-svg {
  width: 100%;
  height: 100%;
}

@keyframes fall {
  0% {
    transform: translateY(-10vh) translateX(0) rotate(0deg);
  }
  50% {
    transform: translateY(55vh) translateX(60px) rotate(180deg);
  }
  100% {
    transform: translateY(110vh) translateX(-20px) rotate(360deg);
  }
}
</style>
