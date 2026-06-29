<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { db } from '../service/firebase'
import { collection, onSnapshot, query, orderBy, getDocs, writeBatch } from 'firebase/firestore'

interface Wish {
  name: string
  status: string
  guestCount?: number
  message: string
  date: string
}

const wishes = ref<Wish[]>([])
let unsubscribeWishes: (() => void) | null = null

onMounted(() => {
  const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'))
  unsubscribeWishes = onSnapshot(q, (snapshot) => {
    const list: Wish[] = []
    snapshot.forEach((docSnap) => {
      const data = docSnap.data()
      let formattedDate = 'Baru saja'
      if (data.createdAt) {
        const dateObj = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        formattedDate = dateObj.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      list.push({
        name: data.name || '',
        status: data.status || 'Hadir',
        guestCount: data.guestCount,
        message: data.message || '',
        date: formattedDate
      })
    })
    wishes.value = list
  }, (error) => {
    console.error("Error fetching wishes for dashboard:", error)
  })
})

onUnmounted(() => {
  if (unsubscribeWishes) unsubscribeWishes()
})

// Calculations
const totalResponses = computed(() => wishes.value.length)

const totalHadir = computed(() => {
  return wishes.value.filter(w => w.status === 'Hadir').length
})

const totalTidakHadir = computed(() => {
  return wishes.value.filter(w => w.status === 'Tidak Hadir').length
})

const totalTentatif = computed(() => {
  return wishes.value.filter(w => w.status === 'Tentatif').length
})

// Menghitung akumulasi total tamu riil (pax bawaan) yang akan datang
const totalGuests = computed(() => {
  return wishes.value.reduce((acc, wish) => {
    if (wish.status === 'Hadir') {
      // Jika guestCount tidak ada (data lama), default ke 1 pax
      return acc + (wish.guestCount !== undefined ? wish.guestCount : 1)
    }
    return acc
  }, 0)
})

const resetWishes = async () => {
  if (confirm('Apakah Anda yakin ingin mereset semua data ucapan dan RSVP di database?')) {
    try {
      const q = query(collection(db, 'wishes'))
      const querySnapshot = await getDocs(q)
      const batch = writeBatch(db)
      querySnapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref)
      })
      await batch.commit()
    } catch (error) {
      console.error('Error resetting wishes:', error)
      alert('Gagal mereset data ucapan.')
    }
  }
}

// Fitur Generate URL Tamu Undangan
const inputGuestName = ref('')
const inputPhone = ref('') // Input nomor telepon WA tamu
const generatedUrl = ref('')
const isCopied = ref(false)

const templateText = computed(() => {
  return `Assalamu'alaikum Wr. Wb.

Halo *${inputGuestName.value || '[Nama Tamu]'}*, semoga Anda dan keluarga selalu dalam keadaan sehat dan berbahagia.

Di hari yang penuh rasa syukur ini, kami ingin membagikan kabar bahagia. Atas izin Allah SWT, kami bermaksud untuk melangsungkan pernikahan kami, **Fitria & Aswan**.

Tanpa mengurangi rasa hormat, kami sangat berharap *${inputGuestName.value || '[Nama Tamu]'}* beserta keluarga berkenan hadir untuk memberikan doa restu secara langsung di hari bahagia kami.

Detail acara dan lokasi dapat dilihat melalui tautan undangan digital di bawah ini:
 ${generatedUrl.value || '[Link Undangan]'}

Kehadiran dan doa tulus dari Anda merupakan kado terindah bagi kami. Terima kasih banyak atas perhatian dan doa baiknya.

Wassalamu'alaikum Wr. Wb.

— *Fitria & Aswan*`
})

const generateLink = () => {
  if (!inputGuestName.value.trim()) {
    generatedUrl.value = ''
    return
  }
  // Dapatkan origin website (e.g., https://fitriaaswan.netlify.app atau localhost)
  const origin = window.location.origin + window.location.pathname
  // Gabungkan dengan format nama tamu (search query parameter)
  generatedUrl.value = `${origin}?${encodeURIComponent(inputGuestName.value.trim())}`
  isCopied.value = false
}

const copyToClipboard = async () => {
  if (!generatedUrl.value) return
  try {
    await navigator.clipboard.writeText(generatedUrl.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    alert('Gagal menyalin link. Silakan salin secara manual.')
  }
}

// Fungsi mengirim pesan Whatsapp langsung
const shareToWhatsApp = () => {
  if (!inputGuestName.value.trim()) {
    alert('Harap masukkan nama tamu terlebih dahulu.')
    return
  }
  
  // Bersihkan format nomor telepon (menghilangkan spasi, strip, dll)
  let phone = inputPhone.value.replace(/[^0-9]/g, '')
  if (phone.startsWith('0')) {
    phone = '62' + phone.slice(1) // Format ke kode negara Indonesia (62)
  }

  const encodedText = encodeURIComponent(templateText.value)
  const waUrl = phone 
    ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}` 
    : `https://api.whatsapp.com/send?text=${encodedText}`
    
  window.open(waUrl, '_blank')
}</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>Wedding RSVP Dashboard</h1>
      <p class="dashboard-subtitle">Fitria & Andi Aswan Hidayat Wedding</p>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card total-pax">
        <span class="stat-icon">👥</span>
        <div class="stat-info">
          <h3>Total Estimasi Tamu Riil (Pax)</h3>
          <p class="stat-number">{{ totalGuests }} Orang</p>
          <span class="stat-desc">Akumulasi jumlah rombongan yang diajak</span>
        </div>
      </div>

      <div class="stat-card status-hadir">
        <span class="stat-icon">✅</span>
        <div class="stat-info">
          <h3>Hadir (Undangan)</h3>
          <p class="stat-number">{{ totalHadir }}</p>
          <span class="stat-desc">Orang yang mengonfirmasi</span>
        </div>
      </div>

      <div class="stat-card status-tidak">
        <span class="stat-icon">❌</span>
        <div class="stat-info">
          <h3>Tidak Hadir</h3>
          <p class="stat-number">{{ totalTidakHadir }}</p>
          <span class="stat-desc">Telah menyampaikan maaf</span>
        </div>
      </div>

      <div class="stat-card status-tentatif">
        <span class="stat-icon">⏳</span>
        <div class="stat-info">
          <h3>Tentatif</h3>
          <p class="stat-number">{{ totalTentatif }}</p>
          <span class="stat-desc">Belum memberikan kepastian</span>
        </div>
      </div>
    </div>

    <!-- Generator URL Section -->
    <div class="generator-section">
      <h2>Generator Link Undangan Tamu</h2>
      <p class="generator-desc">Gunakan alat ini untuk membuat tautan undangan kustom secara otomatis berdasarkan nama tamu yang ingin diundang.</p>
      
      <div class="generator-form">
        <div class="input-row">
          <div class="input-group">
            <label>Nama Tamu</label>
            <input 
              type="text" 
              v-model="inputGuestName" 
              placeholder="Contoh: Bapak Budi & Istri" 
              @input="generateLink"
              class="generator-input"
            />
          </div>
          <div class="input-group">
            <label>Nomor WhatsApp Tamu (Opsional)</label>
            <input 
              type="text" 
              v-model="inputPhone" 
              placeholder="Contoh: 08123456789" 
              class="generator-input"
            />
          </div>
        </div>
        <button @click="generateLink" class="btn-generate">Buat Link Undangan</button>
      </div>

      <div v-if="generatedUrl" class="result-box">
        <div class="result-row">
          <label>Link Undangan Hasil Generate:</label>
          <div class="url-text-wrapper">
            <input type="text" readonly :value="generatedUrl" class="url-output" />
            <button @click="copyToClipboard" class="btn-copy" :class="{ 'copied': isCopied }">
              {{ isCopied ? 'Tersalin! ✓' : 'Salin Link' }}
            </button>
          </div>
        </div>

        <div class="result-row">
          <label>Pratinjau Pesan Kirim WhatsApp:</label>
          <textarea readonly class="message-preview" rows="6">{{ templateText }}</textarea>
        </div>

        <div class="actions-row">
          <button @click="shareToWhatsApp" class="btn-whatsapp">
            <span class="wa-icon">💬</span> Kirim / Bagikan ke WhatsApp
          </button>
        </div>
      </div>
    </div>

    <!-- Wish List Table/Feed -->
    <div class="list-section">
      <div class="list-header">
        <h2>Daftar Ucapan & Konfirmasi Tamu ({{ totalResponses }})</h2>
        <button @click="resetWishes" class="btn-danger">Reset Data</button>
      </div>

      <div v-if="wishes.length === 0" class="empty-state">
        <p>Belum ada data RSVP masuk.</p>
      </div>

      <div v-else class="table-wrapper">
        <table class="dashboard-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Status</th>
              <th>Pax</th>
              <th>Ucapan & Doa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(wish, idx) in wishes" :key="idx">
              <td class="name-col">{{ wish.name }}</td>
              <td>
                <span class="status-badge" :class="wish.status.toLowerCase().replace(' ', '-')">
                  {{ wish.status }}
                </span>
              </td>
              <td class="pax-col">{{ wish.status === 'Hadir' ? (wish.guestCount || 1) : 0 }} Pax</td>
              <td class="message-col">{{ wish.message }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Gunakan Font Google */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&display=swap');

.dashboard-container {
  min-height: 100vh;
  /* Samakan warna dasar gelap dengan background invitation */
  background-color: #2B4C59;
  background-image: radial-gradient(circle at 50% 50%, #3a6273 0%, #1e3640 100%);
  color: #ffffff;
  padding: 3rem 1.5rem;
  font-family: 'Montserrat', sans-serif;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.dashboard-header h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem;
  color: #e5c158; /* Warna Emas */
  margin-bottom: 0.4rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.dashboard-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

/* Grid Layout */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.2rem;
  width: 100%;
  max-width: 900px;
}

/* Dashboard Cards (Mengadopsi gaya kaca emas quran-card) */
.stat-card,
.generator-section,
.list-section {
  position: relative;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), inset 0 0 0 1.5px rgba(255, 255, 255, 0.25);
  border: none;
  box-sizing: border-box;
  padding: 1.8rem;
}

/* Fallback untuk Android/Browser lama yang tidak support backdrop-filter */
@supports not (backdrop-filter: blur(1px)) {
  .stat-card,
  .generator-section,
  .list-section {
    background: rgba(30, 50, 60, 0.95);
  }
}

/* Tambahkan garis emas pinggir pada setiap kartu */
.stat-card::before,
.generator-section::before,
.list-section::before {
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

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.stat-icon {
  font-size: 2.2rem;
  background: rgba(255, 255, 255, 0.15);
  width: 55px;
  height: 55px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info h3 {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 0.2rem 0;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #e5c158; /* Warna Emas */
  margin: 0;
  line-height: 1.2;
}

.stat-desc {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Generator Section */
.generator-section {
  width: 100%;
  max-width: 900px;
}

.generator-section h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  color: #e5c158;
  margin: 0 0 0.4rem 0;
}

.generator-desc {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  margin: 0 0 1.5rem 0;
}

.generator-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
}

.input-row {
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
}

.input-group {
  flex: 1;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

/* WARNA FIELD DIJELASKAN (Lebih Gelap & Kontras Tinggi) */
.generator-input {
  width: 100%;
  padding: 0.85rem 1.2rem;
  background: rgba(15, 23, 42, 0.85); /* Slate gelap yang sangat jelas */
  border: 1.5px solid rgba(173, 139, 58, 0.6); /* Border emas tegas */
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: #ffffff;
  outline: none;
  transition: all 0.3s;
  box-sizing: border-box;
}

.generator-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.generator-input:focus {
  border-color: #e5c158;
  box-shadow: 0 0 8px rgba(229, 193, 88, 0.3);
}

.btn-generate {
  align-self: flex-start;
  background: #e5c158;
  color: #2B4C59;
  border: none;
  padding: 0.85rem 2rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  font-family: 'Montserrat', sans-serif;
}

.btn-generate:hover {
  background: #f7e5a9;
  transform: translateY(-1px);
}

.result-box {
  margin-top: 1.5rem;
  background: rgba(15, 23, 42, 0.5); /* Hitam transparan kontras */
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px dashed rgba(173, 139, 58, 0.4);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.result-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-row label {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

/* WARNA FIELD DIJELASKAN */
.url-output {
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(173, 139, 58, 0.5);
  border-radius: 6px;
  font-size: 0.82rem;
  color: #e5c158;
  font-family: monospace;
}

.message-preview {
  width: 100%;
  padding: 0.85rem;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(173, 139, 58, 0.5);
  border-radius: 6px;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  resize: vertical;
  box-sizing: border-box;
}

.actions-row {
  display: flex;
  gap: 1rem;
}

.btn-whatsapp {
  background: #25D366;
  color: white;
  border: none;
  padding: 0.85rem 2rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s, transform 0.2s;
  font-family: 'Montserrat', sans-serif;
}

.btn-whatsapp:hover {
  background: #20ba5a;
  transform: translateY(-1px);
}

.wa-icon {
  font-size: 1.1rem;
}

.url-text-wrapper {
  display: flex;
  gap: 0.6rem;
}

.btn-copy {
  background: #8EA7B5;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-copy:hover {
  background: #2B4C59;
}

.btn-copy.copied {
  background: #20bf6b;
}

/* List section */
.list-section {
  width: 100%;
  max-width: 900px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.list-header h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  color: #e5c158;
  margin: 0;
}

.btn-danger {
  background: #fc5c65;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-danger:hover {
  background: #eb3b5a;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Table styling */
.table-wrapper {
  overflow-x: auto;
}

.dashboard-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.88rem;
}

.dashboard-table th {
  background: rgba(15, 23, 42, 0.4);
  color: rgba(255, 255, 255, 0.85);
  padding: 1.2rem 1rem;
  font-weight: 600;
  border-bottom: 2px solid rgba(173, 139, 58, 0.4);
}

.dashboard-table td {
  padding: 1.2rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.name-col {
  font-weight: 600;
  color: #e5c158;
}

.pax-col {
  font-weight: 600;
}

.message-col {
  color: rgba(255, 255, 255, 0.8);
  max-width: 350px;
  word-wrap: break-word;
  white-space: pre-wrap;
}

/* Badges */
.status-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  font-weight: 600;
}

.status-badge.hadir {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.tidak-hadir {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.tentatif {
  background: #fef3c7;
  color: #92400e;
}
</style>
