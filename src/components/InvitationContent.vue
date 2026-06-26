<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import bungakiri from '../assets/bungakiri.png'
import bungakanan from '../assets/bungakanan.png'
import bgKiriTree from '../assets/pohonsisikiri.png'
import bgKananTree from '../assets/pohonsisikanan.png'
import gallery1 from '../assets/IMG_9133.JPG'
import gallery2 from '../assets/IMG_9134.JPG'
import gallery3 from '../assets/IMG_9135.JPG'
import gallery4 from '../assets/IMG_9136.JPG'
import gallery5 from '../assets/IMG_9204.JPG'
import bgKiri from '../assets/Biru Emas dan Merah Muda Halus Undangan Pernikahan.png'
import bgKanan from '../assets/Biru Emas dan Merah Muda Halus Undangan Pernikahan (2).png'
import bgTiga from '../assets/Biru Emas dan Merah Muda Halus Undangan Pernikahan (3).png'
import bgEmpat from '../assets/Biru Emas dan Merah Muda Halus Undangan Pernikahan (4).png'

const contentGatesOpen = ref(false)

// Countdown Timer logic
const weddingDate = new Date('2026-08-15T00:00:00')

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
let timerInterval: any = null

const calculateTimeLeft = () => {
  const difference = +weddingDate - +new Date()
  if (difference > 0) {
    days.value = Math.floor(difference / (1000 * 60 * 60 * 24))
    hours.value = Math.floor((difference / (1000 * 60 * 60)) % 24)
    minutes.value = Math.floor((difference / 1000 / 60) % 60)
    seconds.value = Math.floor((difference / 1000) % 60)
  }
}

// Wishes/RSVP logic
interface Wish {
  name: string
  status: string
  message: string
  date: string
}

const wishes = ref<Wish[]>([
  {
    name: 'Budi & Keluarga',
    status: 'Hadir',
    message: 'Selamat menempuh hidup baru Dian dan Syahdan! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Amin.',
    date: '2 jam yang lalu'
  },
  {
    name: 'Siti Aminah',
    status: 'Hadir',
    message: 'Happy wedding! Lancar-lancar sampai hari H yaa!',
    date: '5 jam yang lalu'
  }
])

const newName = ref('')
const newStatus = ref('Hadir')
const newMessage = ref('')

const loadWishes = () => {
  const stored = localStorage.getItem('wedding_wishes')
  if (stored) {
    wishes.value = JSON.parse(stored)
  } else {
    localStorage.setItem('wedding_wishes', JSON.stringify(wishes.value))
  }
}

const submitWish = () => {
  if (!newName.value || !newMessage.value) return
  
  const newWish: Wish = {
    name: newName.value,
    status: newStatus.value,
    message: newMessage.value,
    date: 'Baru saja'
  }
  
  wishes.value.unshift(newWish)
  localStorage.setItem('wedding_wishes', JSON.stringify(wishes.value))
  
  // Reset form
  newName.value = ''
  newMessage.value = ''
}

// Copy to Clipboard feature
const copySuccess = ref<{ [key: string]: boolean }>({})
const copyToClipboard = (text: string, key: string) => {
  navigator.clipboard.writeText(text).then(() => {
    copySuccess.value[key] = true
    setTimeout(() => {
      copySuccess.value[key] = false
    }, 2000)
  })
}

let sectionObserver: IntersectionObserver | null = null

onMounted(() => {
  calculateTimeLeft()
  timerInterval = setInterval(calculateTimeLeft, 1000)
  loadWishes()

  // Trigger gate opening transition
  setTimeout(() => {
    contentGatesOpen.value = true
  }, 100)

  sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active')
      } else {
        entry.target.classList.remove('active')
      }
    })
  }, {
    threshold: 0.15
  })

  document.querySelectorAll('.section').forEach((sec) => {
    sectionObserver?.observe(sec)
  })

  // Gallery items: animate in on scroll
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view')
        galleryObserver.unobserve(entry.target) // animate once
      }
    })
  }, { threshold: 0.15 })

  document.querySelectorAll('.gallery-item, .gallery-cursive-title, .gallery-title-underline').forEach((el) => {
    galleryObserver.observe(el)
  })
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (sectionObserver) sectionObserver.disconnect()
})
</script>

<template>
  <div class="invitation-container">
    <!-- Transition Gate Panels that open on entry -->
    <div class="content-floral-gates" :class="{ 'gates-open': contentGatesOpen }">
      <div class="gate-panel left-panel">
        <img :src="bgKiri" class="gate-middle-decor left-middle-decor" alt="" />
        <img :src="bgEmpat" class="gate-side-decor left-side-decor" alt="" />
        <img :src="bungakiri" class="gate-image gate-top left-gate-img" alt="" />
        <img :src="bungakiri" class="gate-image gate-bottom left-gate-img" alt="" />
      </div>
      <div class="gate-panel right-panel">
        <img :src="bgKanan" class="gate-middle-decor right-middle-decor" alt="" />
        <img :src="bgTiga" class="gate-side-decor right-side-decor" alt="" />
        <img :src="bungakanan" class="gate-image gate-top right-gate-img" alt="" />
        <img :src="bungakanan" class="gate-image gate-bottom right-gate-img" alt="" />
      </div>
    </div>

    <!-- Fixed background decoration frame -->
    <div class="fixed-decorations">
      <img :src="bgKiriTree" class="fixed-tree left-tree" alt="" />
      <img :src="bgKananTree" class="fixed-tree right-tree" alt="" />
      <img :src="bungakiri" class="fixed-flower top-left" alt="" />
      <img :src="bungakiri" class="fixed-flower bottom-left" alt="" />
      <img :src="bungakanan" class="fixed-flower top-right" alt="" />
      <img :src="bungakanan" class="fixed-flower bottom-right" alt="" />
    </div>

    <!-- Opening Greeting Section -->
    <section class="section opening-section">
      <div class="greeting-frame">
        <!-- Inner Border & Ornaments -->
        <div class="greeting-inner-border">
          <div class="corner-ornament top-left"></div>
          <div class="corner-ornament top-right"></div>
          <div class="corner-ornament bottom-left"></div>
          <div class="corner-ornament bottom-right"></div>
        </div>

        <div class="section-header" style="margin-bottom: 0;">
          <p class="salam-text">Assalamu'alaikum Wr. Wb.</p>
          <p class="section-description">
            Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri hari bahagia kami dan memberikan doa restu pada acara pernikahan kami:
          </p>
        </div>
      </div>
    </section>

    <!-- Quran Verse Section -->
    <section class="section quran-section">
      <div class="quran-card">

        <p class="arabic-text">
          وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً ۗ اِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ
        </p>
        <p class="translation-text">
          "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."
        </p>
        <p class="surah-title">QS. Ar-Rum: 21</p>
      </div>
    </section>

    <!-- Hero / Opening Section -->
    <section class="section hero-section">
      <div class="floral-frame"></div>
      <div class="hero-content">
        <p class="section-subtitle">THE WEDDING OF</p>
        <h1 class="couple-title">Fitria & Andi Aswan Hidayat</h1>
        <p class="wedding-date-text">Sabtu, 15 Agustus 2026</p>
        
        <!-- Countdown Timer -->
        <div class="countdown-container">
          <div class="countdown-item">
            <span class="number">{{ days }}</span>
            <span class="label">Hari</span>
          </div>
          <div class="countdown-item">
            <span class="number">{{ hours }}</span>
            <span class="label">Jam</span>
          </div>
          <div class="countdown-item">
            <span class="number">{{ minutes }}</span>
            <span class="label">Menit</span>
          </div>
          <div class="countdown-item">
            <span class="number">{{ seconds }}</span>
            <span class="label">Detik</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Mempelai Section -->
    <section class="section mempelai-section">
      <div class="mempelai-dome-frame">
        <!-- Precise SVG Dome Background (100% Symmetrical) -->
        <svg class="dome-svg-bg" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0,100 L 0,35 C 0,22 12,18 22,14 C 36,10 46,3 50,0 C 54,3 64,10 78,14 C 88,18 100,22 100,35 L 100,100 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(229, 193, 88, 0.7)" stroke-width="0.8" />
          <path d="M 2.5,97.5 L 2.5,36 C 2.5,24 13.5,20.5 23,16.5 C 36.5,12.5 46,5.5 50,2.5 C 54,5.5 63.5,12.5 77,16.5 C 86.5,20.5 97.5,24 97.5,36 L 97.5,97.5" fill="none" stroke="rgba(229,193,88,0.4)" stroke-width="0.5" stroke-dasharray="2,2" />
        </svg>

        <div class="section-header" style="margin-bottom: 1rem; position: relative; z-index: 2;">
          <h2 class="section-title">Mempelai</h2>
          <p class="section-description">
            Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah, perkenankanlah kami menikahkan putra-putri kami:
          </p>
        </div>

        <div class="mempelai-row">
          <!-- Bride Card -->
          <div class="mempelai-card">
            <div class="avatar-wrapper">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=60" alt="Dian" class="mempelai-img" />
            </div>
            <h3 class="mempelai-name">Fitriani</h3>
            <!-- <p class="parent-info">Putri pertama dari Bapak Ahmad Rosyidi & Ibu Siti Aminah</p> -->
          </div>

          <div class="mempelai-divider">&</div>

          <!-- Groom Card -->
          <div class="mempelai-card">
            <div class="avatar-wrapper">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=60" alt="Syahdan" class="mempelai-img" />
            </div>
            <h3 class="mempelai-name">Andi Aswan Hidayat</h3>
            <!-- <p class="parent-info">Putra kedua dari Bapak Bambang Susilo & Ibu Herawati</p> -->
          </div>
        </div>
      </div>
    </section>

    <!-- Acara / Event Details Section -->
    <section class="section event-section">
      <div class="section-header">
        <h2 class="section-title" style="color: var(--color-bg-light)">Acara</h2>
        <p class="section-description" style="color: #c9d6cf">
          Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami pada:
        </p>
      </div>

      <div class="event-cards">
        <!-- Akad Card -->
        <div class="event-card">
          <div class="card-icon">💍</div>
          <h3>Akad Nikah</h3>
          <p class="event-time">Pukul 08.00 - 10.00 WIB</p>
          <div class="event-divider"></div>
          <p class="event-venue"><strong>Masjid Agung Al-Falah</strong></p>
          <p class="event-address">Jl. Pahlawan No. 45, Kota Bandung</p>
        </div>

        <!-- Resepsi Card -->
        <div class="event-card">
          <div class="card-icon">🥂</div>
          <h3>Resepsi</h3>
          <p class="event-time">Pukul 11.00 - 16.00 WIB</p>
          <div class="event-divider"></div>
          <p class="event-venue"><strong>Gedung Serbaguna Kencana</strong></p>
          <p class="event-address">Jl. Diponegoro No. 12, Kota Bandung</p>
        </div>
      </div>

      <!-- Map Button -->
      <a href="https://maps.google.com" target="_blank" class="maps-btn">
        <span>📍</span> Petunjuk Lokasi Maps
      </a>
    </section>

    <!-- Gallery Section -->
    <section class="section gallery-section">
      <div class="section-header">
        <h2 class="gallery-cursive-title">Our Moments</h2>
        <div class="gallery-title-underline"></div>
      </div>

      <div class="gallery-grid">
        <div class="gallery-item item-1">
          <img :src="gallery1" alt="Foto 1" />
          <div class="gallery-overlay"></div>
        </div>
        <div class="gallery-item item-2">
          <img :src="gallery2" alt="Foto 2" />
          <div class="gallery-overlay"></div>
        </div>
        <div class="gallery-item item-3">
          <img :src="gallery3" alt="Foto 3" />
          <div class="gallery-overlay"></div>
        </div>
        <div class="gallery-item item-4">
          <img :src="gallery4" alt="Foto 4" />
          <div class="gallery-overlay"></div>
        </div>
        <div class="gallery-item item-5">
          <img :src="gallery5" alt="Foto 5" />
          <div class="gallery-overlay"></div>
        </div>
      </div>
    </section>

    <!-- Digital Gift / Amplop Digital -->
    <section class="section gift-section">
      <div class="section-header">
        <h2 class="section-title">Kado Digital</h2>
        <p class="section-description">
          Bagi bapak/ibu/rekan-rekan yang ingin mengirimkan kado/tanda kasih dapat dikirimkan secara online melalui rekening berikut:
        </p>
      </div>

      <div class="gift-cards">
        <!-- Card 1 -->
        <div class="gift-card">
          <div class="bank-name">BANK BCA</div>
          <div class="account-number">1234567890</div>
          <div class="account-name">a.n Dian Rahmawati</div>
          <button @click="copyToClipboard('1234567890', 'bca')" class="copy-btn">
            {{ copySuccess['bca'] ? 'Berhasil Disalin!' : 'Salin No. Rekening' }}
          </button>
        </div>

        <!-- Card 2 -->
        <div class="gift-card">
          <div class="bank-name">BANK MANDIRI</div>
          <div class="account-number">0987654321</div>
          <div class="account-name">a.n Syahdan Maulana</div>
          <button @click="copyToClipboard('0987654321', 'mandiri')" class="copy-btn">
            {{ copySuccess['mandiri'] ? 'Berhasil Disalin!' : 'Salin No. Rekening' }}
          </button>
        </div>
      </div>
    </section>

    <!-- RSVP / Wishes Form -->
    <section class="section wishes-section">
      <div class="section-header">
        <h2 class="section-title">Ucapan & Doa</h2>
        <p class="section-description">
          Berikan doa restu dan konfirmasi kehadiran Anda melalui form di bawah ini:
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitWish" class="wishes-form">
        <div class="form-group">
          <label>Nama Lengkap</label>
          <input v-model="newName" type="text" placeholder="Masukkan nama Anda" required />
        </div>

        <div class="form-group">
          <label>Konfirmasi Kehadiran</label>
          <select v-model="newStatus">
            <option value="Hadir">Saya Akan Hadir</option>
            <option value="Tidak Hadir">Maaf, Saya Tidak Bisa Hadir</option>
            <option value="Tentatif">Masih Tentatif</option>
          </select>
        </div>

        <div class="form-group">
          <label>Ucapan / Doa Restu</label>
          <textarea v-model="newMessage" rows="4" placeholder="Tuliskan ucapan selamat & doa Anda..." required></textarea>
        </div>

        <button type="submit" class="submit-btn">Kirim Ucapan</button>
      </form>

      <!-- Wishes List -->
      <div class="wishes-list">
        <div v-for="(wish, idx) in wishes" :key="idx" class="wish-item">
          <div class="wish-header">
            <span class="wish-name">{{ wish.name }}</span>
            <span class="wish-status" :class="wish.status.toLowerCase().replace(' ', '-')">
              {{ wish.status }}
            </span>
          </div>
          <p class="wish-message">{{ wish.message }}</p>
          <span class="wish-date">{{ wish.date }}</span>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="invitation-footer">
      <p>Terima kasih atas kehadiran & doa restu Bapak/Ibu/Saudara/i.</p>
      <h2 class="footer-names">Dian & Syahdan</h2>
      <p class="copyright">© 2026 Dian & Syahdan. All Rights Reserved.</p>
    </footer>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
@font-face {
  font-family: 'Great Vibes';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('../assets/fonts/GreatVibes-Regular.woff2') format('woff2');
}

.invitation-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.fixed-decorations {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 100vh;
  height: 100dvh;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.fixed-tree {
  position: absolute;
  bottom: -4%;
  width: 75%;
  height: auto;
}

.fixed-tree.left-tree {
  left: -18%;
}

.fixed-tree.right-tree {
  right: -18%;
}

.fixed-flower {
  position: absolute;
  width: 120px;
  height: auto;
}

.fixed-flower.top-left {
  top: 0;
  left: 0;
  transform: scaleY(-1);
}

.fixed-flower.bottom-left {
  bottom: 0;
  left: 0;
}

.fixed-flower.top-right {
  top: 0;
  right: 0;
  transform: scaleY(-1);
}

.fixed-flower.bottom-right {
  bottom: 0;
  right: 0;
}

.section {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 4rem 1.5rem;
  background: transparent;
  border-bottom: 1px solid rgba(43, 76, 89, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
  width: 100%;
}

.section-title {
  font-family: var(--font-serif);
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 0.8rem;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '♦';
  font-size: 0.8rem;
  color: var(--color-secondary);
  display: block;
  text-align: center;
  margin-top: 0.2rem;
}

.section-subtitle {
  font-family: var(--font-serif);
  font-size: 0.8rem;
  letter-spacing: 3px;
  color: var(--color-secondary);
}

.section-description {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  max-width: 90%;
  margin: 0 auto;
}

/* Opening Greeting Section */
.opening-section {
  background: transparent;
  padding: 4rem 1.5rem 2rem;
}

.greeting-frame {
  position: relative;
  padding: 4rem 2rem;
  width: 90%;
  max-width: 380px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(18, 55, 42, 0.05), inset 0 0 0 1.5px rgba(255, 255, 255, 0.4);
  box-sizing: border-box;
  text-align: center;
  z-index: 3;
}

/* Gold Gradient Border with Border Radius */
.greeting-frame::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  padding: 2px;
  background: linear-gradient(135deg, #dfba6b 0%, #b8913b 30%, #f7e5a9 70%, #b8913b 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.greeting-inner-border {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 1px dashed rgba(173, 139, 58, 0.45);
  border-radius: 14px;
  pointer-events: none;
}

.corner-ornament {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 2px solid #b8913b;
  pointer-events: none;
}

.corner-ornament.top-left {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
}
.corner-ornament.top-right {
  top: -2px;
  right: -2px;
  border-left: none;
  border-bottom: none;
}
.corner-ornament.bottom-left {
  bottom: -2px;
  left: -2px;
  border-right: none;
  border-top: none;
}
.corner-ornament.bottom-right {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
}

/* Elegant diamonds floating inside corner bounds */
.corner-ornament::after {
  content: '♦';
  position: absolute;
  color: #b8913b;
  font-size: 8px;
}
.corner-ornament.top-left::after {
  top: 4px;
  left: 4px;
}
.corner-ornament.top-right::after {
  top: 4px;
  right: 4px;
}
.corner-ornament.bottom-left::after {
  bottom: 4px;
  left: 4px;
}
.corner-ornament.bottom-right::after {
  bottom: 4px;
  right: 4px;
}

.opening-section .section-description {
  opacity: 0;
}

.opening-section.active .section-description {
  animation: fadeInUp 1.5s ease-out forwards;
  animation-delay: 1.8s;
}

/* Quran Section */
.quran-section {
  background: transparent;
}

.quran-card {
  position: relative;
  padding: 3rem 2rem;
  width: 90%;
  max-width: 380px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(18, 55, 42, 0.05), inset 0 0 0 1.5px rgba(255, 255, 255, 0.4);
  box-sizing: border-box;
  text-align: center;
  z-index: 3;
}

.quran-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  padding: 2px;
  background: linear-gradient(135deg, #dfba6b 0%, #b8913b 30%, #f7e5a9 70%, #b8913b 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.quran-ornament {
  font-size: 1.2rem;
  color: var(--color-secondary);
  margin: 0.2rem 0;
  opacity: 0;
}

.quran-section.active .quran-ornament {
  animation: fadeInUp 1.2s ease-out forwards;
  animation-delay: 1.6s;
}

.arabic-text {
  font-family: 'Amiri', Georgia, serif;
  font-size: 1.3rem;
  line-height: 2.3;
  color: var(--color-primary);
  direction: rtl;
  margin: 1rem 0;
  font-weight: 500;
  opacity: 0;
}

.quran-section.active .arabic-text {
  animation: fadeInUp 1.2s ease-out forwards;
  animation-delay: 0.3s;
}

.translation-text {
  font-family: var(--font-serif);
  font-size: 0.8rem;
  line-height: 1.6;
  color: var(--color-text-muted);
  margin-bottom: 1.2rem;
  font-style: italic;
  opacity: 0;
}

.quran-section.active .translation-text {
  animation: fadeInUp 1.2s ease-out forwards;
  animation-delay: 0.8s;
}

.surah-title {
  font-family: var(--font-serif);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-secondary);
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0;
}

.quran-section.active .surah-title {
  animation: fadeInUp 1.2s ease-out forwards;
  animation-delay: 1.3s;
}

.salam-text {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(2rem, 8vw, 2.8rem);
  font-weight: 400;
  color: var(--color-primary);
  margin-bottom: 1.2rem;
  letter-spacing: 0.5px;
  display: inline-block;
  overflow: visible;
  clip-path: inset(-30% 100% -30% 0);
}

.opening-section.active .salam-text {
  animation: writeText 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.3s;
}

@keyframes writeText {
  from {
    clip-path: inset(-30% 100% -30% 0);
  }
  to {
    clip-path: inset(-30% 0% -30% 0);
  }
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  min-height: 100dvh;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-text-dark);
  text-align: center;
  position: relative;
  padding: 3rem 1.5rem;
  box-sizing: border-box;
}

.hero-content {
  z-index: 2;
}

.hero-section .section-subtitle {
  opacity: 0;
}

.hero-section.active .section-subtitle {
  animation: fadeInUp 1.2s ease-out forwards;
  animation-delay: 0.2s;
}

.couple-title {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(3rem, 12vw, 4.5rem);
  font-weight: 400;
  color: var(--color-primary);
  margin: 0.8rem 0;
  text-shadow: 1px 2px 8px rgba(43, 76, 89, 0.15);
  line-height: 1.2;
  overflow: visible;
  clip-path: inset(-30% 100% -30% 0);
}

.hero-section.active .couple-title {
  animation: writeText 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.8s;
}

.wedding-date-text {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  letter-spacing: 2px;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
  text-transform: uppercase;
  opacity: 0;
}

.hero-section.active .wedding-date-text {
  animation: fadeInUp 1.2s ease-out forwards;
  animation-delay: 2.2s;
}

/* Countdown */
.countdown-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 1rem;
  opacity: 0;
}

.hero-section.active .countdown-container {
  animation: fadeInUp 1.2s ease-out forwards;
  animation-delay: 2.6s;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 70px;
  max-width: 90px;
  padding: 0.75rem 0.5rem;
  /* PENYESUAIAN WARNA: Background dibuat sedikit lebih gelap agar teks putih/emas kontras */
  background: rgba(15, 23, 42, 0.45); 
  /* Border emas tipis yang elegan */
  border: 1px solid rgba(173, 139, 58, 0.4); 
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 8px;
  box-sizing: border-box;
  /* Efek bayangan halus agar kotak lebih "pop out" */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2); 
}

.countdown-item .number {
  font-family: var(--font-serif);
  font-size: 1.5rem; /* Sedikit diperbesar agar dominan */
  font-weight: 700;
  /* PENYESUAIAN WARNA: Gunakan warna emas terang jika var(--color-primary) Anda terlalu gelap */
  color: #e5c158; 
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Menambah keterbacaan angka */
  line-height: 1;
}

.countdown-item .label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0.4rem;
  /* PENYESUAIAN WARNA: Putih semi-transparan agar tidak balapan dengan warna angka */
  color: rgba(255, 255, 255, 0.7); 
}

/* Mempelai Section */
.mempelai-section {
  background: transparent;
}

/* Horizontal row container */
.mempelai-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  position: relative;
  z-index: 2;
}

.mempelai-dome-frame {
  position: relative;
  width: 95%;
  max-width: 375px;
  margin: 1rem auto;
  padding: 5.5rem 1.4rem 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.dome-svg-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  filter: drop-shadow(0px 8px 20px rgba(0, 0, 0, 0.15));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 0 0 20px 20px;
}

.avatar-wrapper {
  width: 95px;
  height: 95px;
  border-radius: 50%;
  overflow: hidden;
  border: 2.5px solid var(--color-secondary);
  margin: 0 auto 0.8rem;
  box-shadow: 0 6px 15px rgba(18, 55, 42, 0.15);
  position: relative;
}

.mempelai-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mempelai-card {
  text-align: center;
  flex: 1;
  max-width: 140px;
}

.mempelai-name {
  font-family: var(--font-serif);
  font-size: 0.9rem;
  color: var(--color-primary);
  font-weight: 700;
  margin-bottom: 0.4rem;
  line-height: 1.3;
}

.parent-info {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.mempelai-divider {
  font-family: var(--font-script);
  font-size: 2.5rem;
  font-weight: normal;
  color: var(--color-secondary);
  flex-shrink: 0;
  padding: 0 0.3rem;
  align-self: center;
}

/* Event Section */
.event-section {
  background: radial-gradient(circle at center, #1b4435 0%, var(--color-primary) 100%);
  color: var(--color-bg-light);
}

.event-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 360px;
  margin-bottom: 2rem;
}

.event-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(173, 139, 58, 0.3);
  padding: 2rem 1.5rem;
  border-radius: 12px;
  text-align: center;
  backdrop-filter: blur(8px);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 0.8rem;
}

.event-card h3 {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  color: var(--color-secondary-light);
  margin-bottom: 0.5rem;
}

.event-time {
  font-size: 0.85rem;
  color: #e2e8f0;
}

.event-divider {
  width: 50px;
  height: 1px;
  background-color: var(--color-secondary);
  margin: 1rem auto;
  opacity: 0.6;
}

.event-venue {
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
}

.event-address {
  font-size: 0.8rem;
  color: #cbd5e1;
}

.maps-btn {
  background: linear-gradient(135deg, var(--color-secondary) 0%, #c5a059 100%);
  color: var(--color-primary);
  text-decoration: none;
  padding: 0.8rem 1.8rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.maps-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.35);
}

/* Gallery Section */

.gallery-section {
  background: transparent;
}

/* Cursive animated title */
.gallery-cursive-title {
  font-family: 'Great Vibes', cursive;
  font-size: 3rem;
  color: #e5c158;
  text-shadow: 0 2px 12px rgba(229, 193, 88, 0.35);
  margin: 0 0 0.3rem;
  letter-spacing: 2px;
  opacity: 0;
  transform: translateY(-16px);
  transition: opacity 1.2s ease, transform 1.2s ease;
}

.gallery-cursive-title.in-view {
  opacity: 1;
  transform: translateY(0);
}

.gallery-title-underline {
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #e5c158, transparent);
  margin: 0 auto 1.5rem;
  transition: width 1.4s ease 0.3s, opacity 1.4s ease 0.3s;
  opacity: 0;
  transform-origin: center;
}

.gallery-title-underline.in-view {
  width: 80px;
  opacity: 1;
}

/* Grid layout: 2 cols, last item spans full width */
.gallery-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
  max-width: 380px;
}

.gallery-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  border: 1.5px solid rgba(229, 193, 88, 0.4);
  aspect-ratio: 1;
  /* hidden by default, animates in via .in-view */
  opacity: 0;
  transform: scale(0.92) translateY(22px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.gallery-item.in-view {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Staggered transition delays */
.gallery-item.item-1 { transition-delay: 0.05s; }
.gallery-item.item-2 { transition-delay: 0.18s; }
.gallery-item.item-3 { transition-delay: 0.31s; }
.gallery-item.item-4 { transition-delay: 0.44s; }
.gallery-item.item-5 {
  transition-delay: 0.57s;
  grid-column: 1 / -1;
  aspect-ratio: 16/9;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: block;
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.35) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 12px;
}

.gallery-item:hover img {
  transform: scale(1.1);
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

/* Gift Section */
.gift-section {
  background: transparent;
}

.gift-cards {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  max-width: 340px;
}

.gift-card {
  background: var(--color-bg-white);
  border: 1px solid rgba(173, 139, 58, 0.2);
  border-radius: 12px;
  padding: 1.8rem;
  text-align: center;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
}

.bank-name {
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.account-number {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-secondary);
  margin-bottom: 0.3rem;
}

.account-name {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-bottom: 1.2rem;
}

.copy-btn {
  background: var(--color-primary);
  color: var(--color-bg-light);
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  background: #1b4a39;
}

/* RSVP / Wishes */
.wishes-section {
  background: transparent;
}

.wishes-form {
  width: 100%;
  max-width: 360px;
  background: var(--color-bg-white);
  padding: 1.8rem;
  border-radius: 12px;
  border: 1px solid rgba(173, 139, 58, 0.2);
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.2rem;
  text-align: left;
}

.form-group label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-primary);
  letter-spacing: 0.5px;
}

.form-group input, .form-group select, .form-group textarea {
  font-family: var(--font-sans);
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.7rem;
  font-size: 0.85rem;
  outline: none;
  transition: border 0.3s;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: var(--color-primary);
}

.submit-btn {
  width: 100%;
  background: var(--color-secondary);
  color: var(--color-primary);
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover {
  background: #c5a059;
}

.wishes-list {
  width: 100%;
  max-width: 360px;
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wish-item {
  background: var(--color-bg-white);
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  text-align: left;
}

.wish-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.wish-name {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-primary);
}

.wish-status {
  font-size: 0.65rem;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-weight: 500;
}

.wish-status.hadir {
  background-color: #d1fae5;
  color: #065f46;
}

.wish-status.tidak-hadir {
  background-color: #fee2e2;
  color: #991b1b;
}

.wish-status.tentatif {
  background-color: #fef3c7;
  color: #92400e;
}

.wish-message {
  font-size: 0.8rem;
  color: #4b5563;
  line-height: 1.5;
}

.wish-date {
  font-size: 0.65rem;
  color: #9ca3af;
  display: block;
  margin-top: 0.4rem;
}

/* Footer */
.invitation-footer {
  background-color: var(--color-primary);
  color: var(--color-bg-light);
  padding: 3rem 1.5rem;
  text-align: center;
}

.invitation-footer p {
  font-size: 0.8rem;
  color: #c9d6cf;
}

.footer-names {
  font-family: var(--font-script);
  font-size: 3rem;
  font-weight: normal;
  color: var(--color-secondary-light);
  margin: 1rem 0;
}

.copyright {
  font-size: 0.65rem;
  color: #8fa89b;
  margin-top: 2rem;
}

/* Transition Gate Panels Styling */
.content-floral-gates {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 9999;
  pointer-events: none;
}

.content-floral-gates .gate-panel {
  width: 50%;
  height: 100%;
  background: linear-gradient(180deg, #ffffff 0%, #f0f8ff 50%, #e6f2ff 100%);
  display: flex;
  align-items: center;
  transition: transform 1.5s cubic-bezier(0.77, 0, 0.175, 1);
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.content-floral-gates .left-panel {
  transform: translateX(0);
  justify-content: flex-end;
  border-right: 1px solid var(--color-secondary);
}

.content-floral-gates .right-panel {
  transform: translateX(0);
  justify-content: flex-start;
  border-left: 1px solid var(--color-secondary);
}

.content-floral-gates.gates-open .left-panel {
  transform: translateX(-100%);
}

.content-floral-gates.gates-open .right-panel {
  transform: translateX(100%);
}

.content-floral-gates .gate-image {
  position: absolute;
  width: 150%;
  height: auto;
  pointer-events: none;
  z-index: 2;
}

.content-floral-gates .gate-bottom {
  bottom: 0;
}

.content-floral-gates .gate-top {
  top: 0;
  transform: scaleY(-1);
}

.content-floral-gates .left-gate-img {
  right: 0;
}

.content-floral-gates .right-gate-img {
  left: 0;
}

.content-floral-gates .gate-middle-decor {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 140%;
  height: auto;
  pointer-events: none;
  z-index: 1;
}

.content-floral-gates .left-middle-decor {
  left: -40px;
}

.content-floral-gates .right-middle-decor {
  right: -40px;
}

.content-floral-gates .gate-side-decor {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: auto;
  pointer-events: none;
  z-index: 1;
  opacity: 0.8;
}

.content-floral-gates .left-side-decor {
  left: 0;
}

.content-floral-gates .right-side-decor {
  right: 0;
}
</style>
