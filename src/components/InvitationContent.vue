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
import bgPepohonanBackdrop from '../assets/bacground pepohonan.png'
import frameKiriBawah from '../assets/framekiribawah.png'
import frameKananAtas from '../assets/framekananatas.png'

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
  guestCount?: number // Jumlah tamu yang diajak
  message: string
  date: string
}

const wishes = ref<Wish[]>([
  {
    name: 'Budi & Keluarga',
    status: 'Hadir',
    guestCount: 4,
    message: 'Selamat menempuh hidup baru Fitria dan Aswan! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Amin.',
    date: '2 jam yang lalu'
  },
  {
    name: 'Siti Aminah',
    status: 'Hadir',
    guestCount: 1,
    message: 'Happy wedding! Lancar-lancar sampai hari H yaa!',
    date: '5 jam yang lalu'
  }
])

const newName = ref('')
const newStatus = ref('Hadir')
const newGuestCount = ref(1) // Default 1 pax
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
    guestCount: newStatus.value === 'Hadir' ? newGuestCount.value : 0, // Hanya hitung pax jika hadir
    message: newMessage.value,
    date: 'Baru saja'
  }
  
  wishes.value.unshift(newWish)
  localStorage.setItem('wedding_wishes', JSON.stringify(wishes.value))
  
  // Reset form
  newName.value = ''
  newMessage.value = ''
  newGuestCount.value = 1
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
      <!-- Background pepohonan backdrop behind left & right trees -->
      <img :src="bgPepohonanBackdrop" class="fixed-tree-backdrop left-tree-backdrop" alt="" />
      <img :src="bgPepohonanBackdrop" class="fixed-tree-backdrop right-tree-backdrop" alt="" />
      
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
      <!-- Mempelai Wrapper inside quran-card style for consistency (now wrapping text as well) -->
      <div class="quran-card" style="width: 100%; max-width: 380px; box-sizing: border-box; padding: 2.2rem 1.4rem; position: relative; overflow: hidden;">
        <!-- Custom corner frame images -->
        <img :src="frameKiriBawah" class="card-corner-decor bottom-left" alt="" />
        <img :src="frameKananAtas" class="card-corner-decor top-right" alt="" />

        <div class="section-header" style="margin-bottom: 2rem; position: relative; z-index: 2;">
          <h2 class="section-title">Mempelai</h2>
          <p class="section-description">
            Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah, perkenankanlah kami menikahkan putra-putri kami:
          </p>
        </div>

        <div class="mempelai-row">
          <!-- Groom Card (Aswan) -->
          <div class="mempelai-card">
            <div class="mempelai-photo-container">
              <img src="/src/assets/aswan.JPG" alt="Andi Aswan Hidayat" class="mempelai-img" />
            </div>
            <div class="mempelai-name-block">
              <h3 class="mempelai-name">Andi Aswan Hidayat</h3>
            </div>
          </div>

          <div class="mempelai-divider">&</div>

          <!-- Bride Card (Fitri) -->
          <div class="mempelai-card">
            <div class="mempelai-photo-container">
              <img src="/src/assets/fitri.JPG" alt="Fitriani" class="mempelai-img" />
            </div>
            <div class="mempelai-name-block">
              <h3 class="mempelai-name">Fitriani</h3>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Acara / Event Details Section -->
    <section class="section event-section">
      <div class="section-header">
        <h2 class="section-title" style="color: var(--color-primary)">Acara</h2>
        <p class="section-description" style="color: var(--color-text-muted)">
          Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami pada:
        </p>
      </div>

      <div class="event-quran-card-style">
        <!-- Akad Row -->
        <div class="event-row-detail">
          <div class="event-icon-circle">💍</div>
          <div class="event-info-text">
            <h3>Akad Nikah</h3>
            <span class="event-time-span">Pukul 09.00 WIB</span>
          </div>
        </div>

        <!-- Elegant Thin Divider Line -->
        <div class="event-internal-divider"></div>

        <!-- Resepsi Row -->
        <div class="event-row-detail">
          <div class="event-icon-circle">🥂</div>
          <div class="event-info-text">
            <h3>Resepsi Pernikahan</h3>
            <span class="event-time-span">Pukul 11.00 WIB - Selesai</span>
          </div>
        </div>
      </div>

    </section>

    <!-- Maps / Location Section (Terpisah) -->
    <section class="section maps-section">
      <div class="section-header">
        <h2 class="section-title">Lokasi Acara</h2>
        <p class="section-description">
          Klik tombol di bawah ini untuk melihat rute navigasi Google Maps menuju lokasi acara pernikahan kami:
        </p>
      </div>

      <div class="map-card-wrapper">
        <div class="map-iframe-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3966.4757801291635!2d106.72123307499024!3d-6.2007909937869705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMTInMDIuOSJTIDEwNsKwNDMnMjUuNyJF!5e0!3m2!1sid!2sid!4v1782657950236!5m2!1sid!2sid" 
            width="100%" 
            height="260" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="strict-origin-when-cross-origin">
          </iframe>
        </div>
      </div>

      <!-- Map Button -->
      <a href="https://maps.google.com/?q=-6.200791,106.723812" target="_blank" class="maps-btn">
        <span>📍</span> Petunjuk Lokasi Google Maps
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

    <!-- Digital Gift / Amplop Digital (Hidden/Commented)
    <section class="section gift-section">
      <div class="section-header">
        <h2 class="section-title">Kado Digital</h2>
        <p class="section-description">
          Bagi bapak/ibu/rekan-rekan yang ingin mengirimkan kado/tanda kasih dapat dikirimkan secara online melalui rekening berikut:
        </p>
      </div>

      <div class="gift-cards">
        <div class="gift-card">
          <div class="bank-name">BANK BCA</div>
          <div class="account-number">1234567890</div>
          <div class="account-name">a.n Dian Rahmawati</div>
          <button @click="copyToClipboard('1234567890', 'bca')" class="copy-btn">
            Salin No. Rekening
          </button>
        </div>

        <div class="gift-card">
          <div class="bank-name">BANK MANDIRI</div>
          <div class="account-number">0987654321</div>
          <div class="account-name">a.n Syahdan Maulana</div>
          <button @click="copyToClipboard('0987654321', 'mandiri')" class="copy-btn">
            Salin No. Rekening
          </button>
        </div>
      </div>
    </section>
    -->

    <!-- RSVP / Wishes Form -->
    <section class="section wishes-section">
      <div class="section-header">
        <h2 class="section-title">Ucapan & Doa</h2>
        <p class="section-description">
          Berikan doa restu dan konfirmasi kehadiran Anda melalui form di bawah ini:
        </p>
      </div>

      <!-- Wishes Wrapper inside quran-card style (No nested double cards) -->
      <div class="quran-card" style="width: 100%; max-width: 380px; margin-bottom: 2rem; box-sizing: border-box;">
        <!-- Form -->
        <form @submit.prevent="submitWish" class="wishes-form-inside">
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

          <!-- Input guestCount (Hanya muncul jika memilih 'Hadir') -->
          <div v-if="newStatus === 'Hadir'" class="form-group">
            <label>Jumlah Tamu (Pax)</label>
            <select v-model.number="newGuestCount">
              <option :value="1">1 Orang</option>
              <option :value="2">2 Orang</option>
              <option :value="3">3 Orang</option>
              <option :value="4">4 Orang</option>
              <option :value="5">5 Orang</option>
            </select>
          </div>

          <div class="form-group">
            <label>Ucapan / Doa Restu</label>
            <textarea v-model="newMessage" rows="4" placeholder="Tuliskan ucapan selamat & doa Anda..." required></textarea>
          </div>

          <button type="submit" class="submit-btn">Kirim Ucapan</button>
        </form>
      </div>

      <!-- Wishes List -->
      <div class="wishes-list">
        <div v-for="(wish, idx) in wishes" :key="idx" class="wish-item">
          <div class="wish-header">
            <span class="wish-name">
              {{ wish.name }} 
              <span v-if="wish.status === 'Hadir' && wish.guestCount" class="guest-count-badge">
                ({{ wish.guestCount }} Orang)
              </span>
            </span>
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
      <h2 class="footer-names">Fitria & Aswan</h2>
      <p class="copyright">© 2026 Fitria & Aswan. All Rights Reserved.</p>
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
  z-index: 2; /* Di depan backdrop pepohonan */
}

.fixed-tree.left-tree {
  left: -18%;
}

.fixed-tree.right-tree {
  right: -18%;
}

/* Background pepohonan backdrop styling */
.fixed-tree-backdrop {
  position: absolute;
  bottom: -2%;
  width: 85%;
  height: auto;
  opacity: 0.45; /* Sedikit soft transparan di latar belakang */
  filter: blur(2px); /* Blur halus untuk kedalaman dimensi */
  z-index: 1; /* Di belakang fixed-tree */
}

.left-tree-backdrop {
  left: -25%;
  transform: rotate(-5deg);
}

.right-tree-backdrop {
  right: -25%;
  transform: scaleX(-1) rotate(-5deg); /* Mirror horizontal */
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
  content: '';
  display: block;
  width: 40px;
  height: 1.5px;
  background-color: var(--color-secondary);
  margin: 0.4rem auto 0;
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
  /* Fallback solid white-gray for Android or older devices that don't support backdrop-filter */
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(18, 55, 42, 0.05), inset 0 0 0 1.5px rgba(255, 255, 255, 0.4);
  box-sizing: border-box;
  text-align: center;
  z-index: 3;
}

@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
  .quran-card {
    background: rgba(255, 255, 255, 0.12) !important;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
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
  flex-wrap: nowrap; /* Jangan biarkan terlipat/wrap ke bawah */
  align-items: flex-start; /* Sejajarkan rata atas agar foto sejajar sempurna */
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  position: relative;
  z-index: 2;
}



/* ── Simple Photo Container for Canva Images ── */
.mempelai-card {
  text-align: center;
  flex: 1;
  max-width: 145px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

/* Base states before animation triggers (active class on section) */
.mempelai-section .section-header h2,
.mempelai-section .section-header p,
.mempelai-section .quran-card {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 1s ease, transform 1s ease;
}

/* Delay & Specific Transitions when section is active */
.mempelai-section.active .section-header h2 {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.1s;
}

.mempelai-section.active .section-header p {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.3s;
}

/* Mempelai Card Container */
.mempelai-section.active .quran-card {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 0.5s;
}

.mempelai-photo-container {
  position: relative;
  width: 120px;
  height: 160px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 8px; /* Sudut sedikit membulat agar halus */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

/* Micro-interaction hover effect on photos */
.mempelai-photo-container:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
}

.mempelai-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

/* Name block */
.mempelai-name-block {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.mempelai-name {
  font-family: 'Great Vibes', cursive; /* Menggunakan font 'Great Vibes' yang sama persis seperti cover */
  font-size: clamp(1.8rem, 6vw, 2.5rem); /* Menggunakan clamp responsive */
  color: var(--color-primary);
  font-weight: 400; /* Font weight diubah ke 400 untuk tampilan yang anggun */
  margin: 0.2rem 0 0;
  line-height: 1.2;
  text-align: center;
}

/* Custom corner frame styling inside quran-card */
.card-corner-decor {
  position: absolute;
  width: 130px; /* Ukuran diperbesar dari 85px agar lebih dominan membingkai kartu */
  height: auto;
  pointer-events: none;
  z-index: 1;
}

.card-corner-decor.bottom-left {
  bottom: 0;
  left: 0;
}

.card-corner-decor.top-right {
  top: 0;
  right: 0;
}

.mempelai-divider {
  font-family: var(--font-script);
  font-size: 2.5rem;
  font-weight: normal;
  color: var(--color-secondary);
  flex-shrink: 0;
  padding: 0 0.2rem;
  align-self: center;
}

/* Event Section */
.event-section {
  background: transparent; /* Membiarkan gambar background bawaan terlihat konsisten */
  color: var(--color-text-dark);
  padding: 3rem 1.5rem;
}

/* Unified Single Event Frame matching Quran Card style */
.event-quran-card-style {
  position: relative;
  width: 90%;
  max-width: 380px;
  margin: 0 auto 2.5rem;
  /* Fallback solid white-gray for Android or older devices that don't support backdrop-filter */
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(43, 76, 89, 0.08), inset 0 0 0 1.5px rgba(255, 255, 255, 0.4);
  box-sizing: border-box;
  padding: 2.2rem 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 3;
  
  /* Animation states */
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
  .event-quran-card-style {
    background: rgba(255, 255, 255, 0.45) !important;
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
  }
}

.event-section.active .event-quran-card-style {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.4s;
}

.event-section .section-header h2,
.event-section .section-header p {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 1s ease, transform 1s ease;
}

.event-section.active .section-header h2 {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.1s;
}

.event-section.active .section-header p {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.25s;
}

.event-quran-card-style::before {
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

.event-row-detail {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
}

.event-icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-bg-light);
  border: 1.5px solid var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.event-info-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.event-info-text h3 {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  color: var(--color-primary);
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.event-time-span {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

/* Internal horizontal line divider */
.event-internal-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(142, 167, 181, 0.1) 0%,
    rgba(142, 167, 181, 0.4) 50%,
    rgba(142, 167, 181, 0.1) 100%
  );
}

.maps-btn {
  background-color: #2B4C59 !important; /* Slate Blue Tua Solid */
  background-image: none !important;     /* Hapus background gradient */
  border: 1.5px solid #2B4C59 !important; /* Gunakan border solid senada */
  color: #FFFFFF !important;              /* Teks putih solid */
  text-decoration: none;
  padding: 0.9rem 2.2rem;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  z-index: 99; /* Pastikan z-index sangat tinggi agar tidak tertutup */
  position: relative;
}

.maps-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 25px rgba(43, 76, 89, 0.4);
}

/* Maps Section */
.maps-section {
  background: transparent;
  padding: 3.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Specific frame card wrapper for the map, separated from event-quran-card-style to ensure iframe visibility */
.map-card-wrapper {
  position: relative;
  width: 90%;
  max-width: 380px;
  margin: 0 auto 2rem;
  background: rgba(255, 255, 255, 0.85); /* Semi-transparent solid white background */
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1.5px solid rgba(142, 167, 181, 0.4);
  box-shadow: 0 12px 30px rgba(43, 76, 89, 0.08);
  box-sizing: border-box;
  padding: 0.8rem; /* Padding tipis di sekitar iframe */
  z-index: 3;
}

.map-iframe-container {
  width: 100%;
  height: 260px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
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

.wishes-form-inside {
  width: 100%;
  background: transparent; /* No inner card background */
  box-sizing: border-box;
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
  position: relative;
  background: rgba(255, 255, 255, 0.85); /* Semi-transparent warm white */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(142, 167, 181, 0.4);
  padding: 1.2rem;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(43, 76, 89, 0.04);
  text-align: left;
  box-sizing: border-box;
}

/* Slim gradient gold outline for wish items */
.wish-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px;
  padding: 1.5px;
  background: linear-gradient(135deg, #dfba6b 0%, #b8913b 50%, #f7e5a9 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
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
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.guest-count-badge {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  font-weight: 500;
  background: rgba(142, 167, 181, 0.15);
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
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
