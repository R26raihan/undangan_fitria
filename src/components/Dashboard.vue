<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Wish {
  name: string
  status: string
  guestCount?: number
  message: string
  date: string
}

const wishes = ref<Wish[]>([])

const loadWishes = () => {
  const stored = localStorage.getItem('wedding_wishes')
  if (stored) {
    wishes.value = JSON.parse(stored)
  }
}

onMounted(() => {
  loadWishes()
  // Listen for storage changes in case they submit on another tab
  window.addEventListener('storage', (e) => {
    if (e.key === 'wedding_wishes') {
      loadWishes()
    }
  })
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

const resetWishes = () => {
  if (confirm('Apakah Anda yakin ingin mereset semua data ucapan dan RSVP?')) {
    localStorage.removeItem('wedding_wishes')
    wishes.value = []
  }
}

// Fitur Generate URL Tamu Undangan
const inputGuestName = ref('')
const inputPhone = ref('') // Input nomor telepon WA tamu
const generatedUrl = ref('')
const isCopied = ref(false)

// Template Pesan WhatsApp Default
const templateText = computed(() => {
  return `Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *${inputGuestName.value || '[Nama Tamu]'}* untuk menghadiri acara pernikahan kami Fitria & Aswan.

Detail informasi dan lokasi undangan dapat diakses melalui tautan berikut:
${generatedUrl.value || '[Link Undangan]'}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu. Terima kasih.`
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
}
</script>

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
.dashboard-container {
  min-height: 100vh;
  background-color: #F0F4F8;
  color: #1D2D35;
  padding: 2.5rem 1.5rem;
  font-family: 'Montserrat', sans-serif;
  box-sizing: border-box;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.dashboard-header h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.2rem;
  color: #2B4C59;
  margin-bottom: 0.4rem;
}

.dashboard-subtitle {
  color: #687D87;
  font-size: 0.95rem;
}

/* Grid Layout */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  width: 100%;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 25px rgba(43, 76, 89, 0.05);
  border: 1px solid rgba(142, 167, 181, 0.2);
}

.stat-icon {
  font-size: 2.2rem;
  background: #f0f4f8;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info h3 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #687D87;
  margin: 0 0 0.2rem 0;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2B4C59;
  margin: 0;
  line-height: 1.2;
}

.stat-desc {
  font-size: 0.75rem;
  color: #a5b1c2;
}

/* Generator Section */
.generator-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 10px 25px rgba(43, 76, 89, 0.05);
  border: 1px solid rgba(142, 167, 181, 0.2);
  box-sizing: border-box;
}

.generator-section h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  color: #2B4C59;
  margin: 0 0 0.4rem 0;
}

.generator-desc {
  color: #687D87;
  font-size: 0.85rem;
  margin: 0 0 1.5rem 0;
}

.generator-form {
  display: flex;
  flex-direction: column; /* Ubah ke vertikal agar muat input baris telepon */
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
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.input-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #687D87;
}

.generator-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid rgba(142, 167, 181, 0.3);
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.88rem;
  color: #1D2D35;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.generator-input:focus {
  border-color: #2B4C59;
}

.btn-generate {
  align-self: flex-start;
  background: #2B4C59;
  color: white;
  border: none;
  padding: 0.8rem 1.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: background 0.3s;
  font-family: 'Montserrat', sans-serif;
}

.btn-generate:hover {
  background: #1D2D35;
}

.result-box {
  margin-top: 1.5rem;
  background: #F8FAFc;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px dashed rgba(142, 167, 181, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.result-row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.result-row label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #687D87;
}

.message-preview {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.82rem;
  color: #4b6584;
  line-height: 1.5;
  resize: vertical;
  box-sizing: border-box;
}

.actions-row {
  display: flex;
  gap: 1rem;
}

.btn-whatsapp {
  background: #25D366; /* Warna hijau resmi Whatsapp */
  color: white;
  border: none;
  padding: 0.8rem 1.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s;
  font-family: 'Montserrat', sans-serif;
}

.btn-whatsapp:hover {
  background: #20ba5a;
}

.wa-icon {
  font-size: 1.1rem;
}

.url-text-wrapper {
  display: flex;
  gap: 0.6rem;
}

.url-output {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  font-size: 0.8rem;
  color: #2B4C59;
  font-family: monospace;
}

.btn-copy {
  background: #8EA7B5;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
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

.preview-tip {
  font-size: 0.75rem;
  color: #8EA7B5;
}

/* List section */
.list-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(43, 76, 89, 0.05);
  border: 1px solid rgba(142, 167, 181, 0.2);
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
  font-size: 1.5rem;
  color: #2B4C59;
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
  color: #687D87;
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
  background: #f8fafc;
  color: #687D87;
  padding: 1rem;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
}

.dashboard-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.name-col {
  font-weight: 600;
  color: #2B4C59;
}

.pax-col {
  font-weight: 600;
}

.message-col {
  color: #4b6584;
  max-width: 300px;
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
