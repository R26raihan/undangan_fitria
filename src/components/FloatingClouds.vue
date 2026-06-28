<template>
  <div class="clouds-backdrop">
    <!-- Cloud 1 -->
    <div class="cloud cloud-style-1 position-1">
      <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 40a15 15 0 0 1 15-15 12 12 0 0 1 20-5 18 18 0 0 1 35 3 15 15 0 0 1 10 17H20z" fill="url(#pastel-azure-grad)" />
        <defs>
          <linearGradient id="pastel-azure-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e6f2ff" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#bce0fd" stop-opacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- Cloud 2 -->
    <div class="cloud cloud-style-2 position-2">
      <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 35a12 12 0 0 1 12-12 10 10 0 0 1 15-4 15 15 0 0 1 30 2 12 12 0 0 1 8 14H15z" fill="url(#light-azure-grad)" />
        <defs>
          <linearGradient id="light-azure-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f0f8ff" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#cbe5ff" stop-opacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- Cloud 3 -->
    <div class="cloud cloud-style-1 position-3">
      <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 40a15 15 0 0 1 15-15 12 12 0 0 1 20-5 18 18 0 0 1 35 3 15 15 0 0 1 10 17H20z" fill="url(#pastel-azure-grad-2)" />
        <defs>
          <linearGradient id="pastel-azure-grad-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e6f2ff" stop-opacity="0.75" />
            <stop offset="100%" stop-color="#bce0fd" stop-opacity="0.35" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.clouds-backdrop {
  position: fixed; /* Fixed viewport agar awan terlihat melayang di semua halaman yang di-scroll */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1; /* Di belakang konten utama */
}

.cloud {
  position: absolute;
  left: 0;
  will-change: transform;
  animation-name: floatAway;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.cloud-style-1 {
  width: 150px;
}

.cloud-style-2 {
  width: 120px;
}

.position-1 {
  top: 8%;
  animation-duration: 25s;
}

.position-2 {
  top: 25%;
  animation-duration: 38s;
  animation-delay: -5s;
}

.position-3 {
  top: 45%;
  animation-duration: 30s;
  animation-delay: -12s;
}

@keyframes floatAway {
  0% {
    transform: translateX(-150px) scale(0.9);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  95% {
    opacity: 1;
  }
  100% {
    transform: translateX(110vw) scale(0.9);
    opacity: 0;
  }
}
</style>
