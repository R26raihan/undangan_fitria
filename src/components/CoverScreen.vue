<script setup lang="ts">
import { ref, onMounted } from 'vue'
import bungakiri from '../assets/bungakiri.png'
import bungakanan from '../assets/bungakanan.png'
import bgKiri from '../assets/Biru Emas dan Merah Muda Halus Undangan Pernikahan.png'
import bgKanan from '../assets/Biru Emas dan Merah Muda Halus Undangan Pernikahan (2).png'
import bgTiga from '../assets/Biru Emas dan Merah Muda Halus Undangan Pernikahan (3).png'
import bgEmpat from '../assets/Biru Emas dan Merah Muda Halus Undangan Pernikahan (4).png'
import bgKiriTree from '../assets/pohonsisikiri.png'
import bgKananTree from '../assets/pohonsisikanan.png'
import coverBg from '../assets/bacground cover.jpg'
import cinematicVideo from '../assets/animasi.mp4'

const emit = defineEmits(['open'])
const recipient = ref('Nama Tamu')
const gatesOpen = ref(false)
const showWelcome = ref(false)

onMounted(() => {
  // Ambil nama tamu dari URL, format: ?Nama Tamu
  // Contoh: https://fitriaaswan.netlify.app?Bapak Raihan dan Keluarga
  const raw = window.location.search // e.g. "?Bapak%20Raihan%20dan%20Keluarga"
  if (raw && raw.length > 1) {
    const decoded = decodeURIComponent(raw.slice(1)) // hapus '?' di awal
    if (decoded && !decoded.includes('=')) {
      // Format baru: langsung nama tanpa key
      recipient.value = decoded
    } else {
      // Fallback format lama: ?to=NamaTamu
      const params = new URLSearchParams(raw)
      const to = params.get('to')
      if (to) recipient.value = decodeURIComponent(to)
    }
  }

  // Gate Animation sequence
  setTimeout(() => {
    gatesOpen.value = true
  }, 800) // Gates start splitting after 800ms

  setTimeout(() => {
    showWelcome.value = true
  }, 1800) // Welcome content fades in after gates are open
})

const showVideo = ref(false)

const videoPlayer = ref<HTMLVideoElement | null>(null)

const handleOpen = () => {
  // First, close the gates and fade out the welcome screen contents
  gatesOpen.value = false
  showWelcome.value = false

  // Wait for the closing animation to finish (1.5s) before playing the video
  setTimeout(() => {
    showVideo.value = true
    setTimeout(() => {
      if (videoPlayer.value) {
        videoPlayer.value.play().catch((err) => {
          console.warn("Video play failed:", err)
        })
      }
    }, 100)
  }, 1500)
}

const handleVideoEnded = () => {
  showVideo.value = false
  emit('open')
}
</script>

<template>
  <div class="cover-wrapper">

    <!-- Sliding Floral Gates -->
    <div class="floral-gates" :class="{ 'gates-open': gatesOpen }">
      <!-- Left Gate Panel -->
      <div class="gate-panel left-panel">
        <div class="gate-cloud left-cloud-1"></div>
        <div class="gate-cloud left-cloud-2"></div>
        <img :src="bgKiri" class="gate-middle-decor left-middle-decor" alt="Background Kiri" />
        <img :src="bgEmpat" class="gate-side-decor left-side-decor" alt="Background Sisi Kiri" />
        <img :src="bungakiri" class="gate-image gate-top left-gate-img" alt="Bunga Kiri Atas" />
        <img :src="bungakiri" class="gate-image gate-bottom left-gate-img" alt="Bunga Kiri Bawah" />
      </div>
      <!-- Right Gate Panel -->
      <div class="gate-panel right-panel">
        <div class="gate-cloud right-cloud-1"></div>
        <div class="gate-cloud right-cloud-2"></div>
        <img :src="bgKanan" class="gate-middle-decor right-middle-decor" alt="Background Kanan" />
        <img :src="bgTiga" class="gate-side-decor right-side-decor" alt="Background Sisi Kanan" />
        <img :src="bungakanan" class="gate-image gate-top right-gate-img" alt="Bunga Kanan Atas" />
        <img :src="bungakanan" class="gate-image gate-bottom right-gate-img" alt="Bunga Kanan Bawah" />
      </div>
    </div>

    <!-- Framing Flowers positioned relative to cover-wrapper -->
    <div class="content-flowers-frame" :class="{ 'frame-visible': showWelcome }">
      <img :src="bungakiri" class="content-flower content-top-left" alt="Flower Top Left" />
      <img :src="bungakiri" class="content-flower content-bottom-left" alt="Flower Bottom Left" />
      <img :src="bungakanan" class="content-flower content-top-right" alt="Flower Top Right" />
      <img :src="bungakanan" class="content-flower content-bottom-right" alt="Flower Bottom Right" />
    </div>

    <!-- Inner Welcome Content -->
    <div class="cover-content" :class="{ 'content-visible': showWelcome }">
      <!-- Decorative Ornaments for Inner Content -->
      <div class="ornament top-left"></div>
      <div class="ornament top-right"></div>
      <div class="ornament bottom-left"></div>
      <div class="ornament bottom-right"></div>

      <p class="greeting-subtitle">WEDDING INVITATION</p>
      
      <div class="couple-names">
        <h1 class="bride" :class="{ 'writing': showWelcome }">Fitria</h1>
        <span class="ampersand" :class="{ 'writing': showWelcome }">&</span>
        <h1 class="groom" :class="{ 'writing': showWelcome }">Andi Aswan Hidayat</h1>
      </div>

      <!-- <div class="divider">
        <span class="line"></span>
        <span class="diamond">♦</span>
        <span class="line"></span>
      </div> -->

      <button @click="handleOpen" class="open-btn animate-pulse-slow">
        <span class="btn-icon">✉</span> Buka Undangan
      </button>

      <div class="recipient-box">
        <p class="to-label">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
        <h3 class="guest-name">{{ recipient }}</h3>
        <p class="apology">*Mohon maaf apabila ada kesalahan penulisan nama/gelar</p>
      </div>
    </div>

    <!-- Vintage BG Images — slides in from bottom after gates open -->
    <Transition name="slide-up">
      <img
        v-if="showWelcome"
        :src="bgKiriTree"
        class="vintage-bg-img left-tree"
        alt="Left Tree Decoration"
      />
    </Transition>
    <Transition name="slide-up">
      <img
        v-if="showWelcome"
        :src="bgKananTree"
        class="vintage-bg-img right-tree"
        alt="Right Tree Decoration"
      />
    </Transition>

    <!-- Cinematic Transition Video Overlay -->
    <div v-show="showVideo" class="video-overlay">
      <video
        ref="videoPlayer"
        class="cinematic-video"
        preload="auto"
        playsinline
        @ended="handleVideoEnded"
      >
        <source :src="cinematicVideo" type="video/mp4" />
      </video>
      <!-- <button @click="handleVideoEnded" class="skip-video-btn">
        Skip ➔
      </button> -->
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'Great Vibes';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('../assets/fonts/GreatVibes-Regular.woff2') format('woff2');
}

.cover-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  color: var(--color-text-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
  box-sizing: border-box;
  text-align: center;
  overflow: hidden;
}

/* Sliding Floral Gates Container */
.floral-gates {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 10;
  pointer-events: none;
}

.gate-panel {
  width: 50%;
  height: 100%;
  background: linear-gradient(180deg, #ffffff 0%, #f0f8ff 50%, #e6f2ff 100%);
  display: flex;
  align-items: center;
  transition: transform 1.5s cubic-bezier(0.77, 0, 0.175, 1);
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  overflow: hidden; /* Prevent clouds from overflowing gate borders */
}

.gate-cloud {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(15px);
  opacity: 0.65;
}

.left-cloud-1 {
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, #e6f2ff 0%, rgba(230, 242, 255, 0) 70%);
  top: 15%;
  left: 10%;
}

.left-cloud-2 {
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, #bce0fd 0%, rgba(188, 224, 253, 0) 70%);
  bottom: 20%;
  right: 5%;
}

.right-cloud-1 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, #f0f8ff 0%, rgba(240, 248, 255, 0) 70%);
  top: 30%;
  right: 15%;
}

.right-cloud-2 {
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, #cbe5ff 0%, rgba(203, 229, 255, 0) 70%);
  bottom: 10%;
  left: 20%;
}

.left-panel {
  transform: translateX(0);
  justify-content: flex-end;
  border-right: 1px solid var(--color-secondary);
}

.right-panel {
  transform: translateX(0);
  justify-content: flex-start;
  border-left: 1px solid var(--color-secondary);
}

/* When Gates Open */
.gates-open .left-panel {
  transform: translateX(-100%);
}

.gates-open .right-panel {
  transform: translateX(100%);
}

.gate-image {
  position: absolute;
  width: 150%; /* Stretched even wider */
  height: auto;
  pointer-events: none;
  z-index: 2;
}

.gate-bottom {
  bottom: 0;
}

.gate-top {
  top: 0;
  transform: scaleY(-1); /* mirror vertically */
}

.left-gate-img {
  right: 0;
}

.right-gate-img {
  left: 0;
}

.gate-middle-decor {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 140%; /* Stretched wider */
  height: auto;
  pointer-events: none;
  z-index: 1;
}

.left-middle-decor {
  left: -40px; /* Shift to left side */
}

.right-middle-decor {
  right: -40px; /* Shift to right side */
}

/* Inner Cover Content & Elements */
.cover-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(0.4rem, 2vh, 0.8rem);
  width: 100%;
  height: 100%;
  z-index: 2;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 1.5s ease-out, transform 1.5s ease-out;
  position: relative; /* Ensure background absolute coordinates map to this container */
}

.content-flowers-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  transition: opacity 1.5s ease-out;
}

.content-flowers-frame.frame-visible {
  opacity: 1;
}

.content-flower {
  position: absolute;
  width: 120px; /* Elegant and smaller corner frames */
  height: auto;
  pointer-events: none;
}

.content-top-left {
  top: 0;
  left: 0;
  transform: scaleY(-1); /* mirror vertically */
}

.content-bottom-left {
  bottom: 0;
  left: 0;
}

.content-top-right {
  top: 0;
  right: 0;
  transform: scaleY(-1); /* mirror vertically */
}

.content-bottom-right {
  bottom: 0;
  right: 0;
}

.gate-side-decor {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: auto;
  pointer-events: none;
  z-index: 1;
  opacity: 0.8;
}

.left-side-decor {
  left: 0;
}

.right-side-decor {
  right: 0;
}

.cover-content.content-visible {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}

/* Corner Ornaments using gold SVG/CSS styling */
.ornament {
  position: absolute;
  width: 70px;
  height: 70px;
  border: 1px solid var(--color-secondary);
  opacity: 0.35;
  pointer-events: none;
}
.top-left {
  top: 20px;
  left: 20px;
  border-right: none;
  border-bottom: none;
}
.top-right {
  top: 20px;
  right: 20px;
  border-left: none;
  border-bottom: none;
}
.bottom-left {
  bottom: 20px;
  left: 20px;
  border-right: none;
  border-top: none;
}
.bottom-right {
  bottom: 20px;
  right: 20px;
  border-left: none;
  border-top: none;
}

.greeting-subtitle {
  font-family: var(--font-serif);
  font-size: clamp(0.6rem, 1.8vw, 0.75rem);
  letter-spacing: 5px;
  color: var(--color-primary);
  margin-bottom: 0;
  font-weight: 500;
  text-transform: uppercase;
  opacity: 0.85;
}

.couple-names {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bride, .groom {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(3rem, 10vw, 4rem);
  font-weight: 400;
  line-height: 1.2;
  color: var(--color-primary);
  text-shadow: 1px 2px 8px rgba(43, 76, 89, 0.15);
  letter-spacing: 1px;
  margin: 0;
  padding: 0.15em 0.1em;
  overflow: visible;
  clip-path: inset(-30% 100% -30% 0);
}

.bride.writing {
  animation: writeText 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.1s;
}

.groom.writing {
  animation: writeText 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 1.9s;
}

.ampersand {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(2rem, 7vw, 2.5rem);
  color: var(--color-secondary);
  display: block;
  margin: 0.2rem 0;
  font-weight: 400;
  opacity: 0;
  transition: opacity 0.4s ease;
  clip-path: inset(-30% 0 -30% 0);
}

.ampersand.writing {
  animation: fadeInAmp 0.5s ease forwards;
  animation-delay: 1.5s;
}

@keyframes writeText {
  from {
    clip-path: inset(-30% 100% -30% 0);
  }
  to {
    clip-path: inset(-30% 0% -30% 0);
  }
}

@keyframes fadeInAmp {
  from {
    opacity: 0;
    transform: scale(0.7);
  }
  to {
    opacity: 0.9;
    transform: scale(1);
  }
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 80%;
  margin: 1.5rem auto;
}

.divider .line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-secondary), transparent);
}

.divider .diamond {
  color: var(--color-secondary);
  font-size: 0.8rem;
}

.recipient-box {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(142, 167, 181, 0.3);
  padding: 1.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 320px;
  margin: 1.5rem auto;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.08);
}

.to-label {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  letter-spacing: 1px;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}

.guest-name {
  font-family: var(--font-sans);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  word-wrap: break-word;
  line-height: 1.5;
  padding: 0.1em 0;
  letter-spacing: 0.3px;
}

.apology {
  font-size: 0.65rem;
  font-style: italic;
  color: var(--color-text-muted);
}

.open-btn {
  font-family: var(--font-sans);
  background: linear-gradient(135deg, var(--color-secondary) 0%, #be9c3f 100%);
  color: #12372A;
  border: none;
  padding: clamp(0.7rem, 2.5vw, 0.9rem) clamp(1.5rem, 6vw, 2rem);
  font-size: clamp(0.8rem, 3vw, 0.9rem);
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(173, 139, 58, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.open-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(173, 139, 58, 0.6);
}

.btn-icon {
  font-size: 1.1rem;
}

/* Vintage BG Image Slide-In */
.vintage-bg-img {
  position: absolute;
  bottom: -4%;
  width: 75%;
  max-width: none;
  height: auto;
  z-index: 1;
  pointer-events: none;
}

.left-tree {
  left: -18%;
}

.right-tree {
  right: -18%;
}

/* Vue Transition: slide-up from below */
.slide-up-enter-active {
  transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s ease;
}
.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-enter-to {
  transform: translateY(0);
  opacity: 1;
}

/* Video Overlay Styles */
.video-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cinematic-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.skip-video-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  cursor: pointer;
  z-index: 210;
  backdrop-filter: blur(5px);
  transition: all 0.2s ease;
}

.skip-video-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  border-color: #fff;
}
</style>
