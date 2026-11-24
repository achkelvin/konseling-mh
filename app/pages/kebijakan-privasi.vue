<template>
  <!-- Sumber: contents/RenaJiwa_Draf_Legal.md bagian A (draf v1, menunggu tinjauan ahli hukum) -->
  <LegalPage :title="m.footer.privacy">
    <p>
      Rena Jiwa ("kami") menghargai privasimu. Kebijakan ini menjelaskan data apa yang kami kumpulkan, untuk apa, dan
      hakmu atas data tersebut, sesuai Undang-Undang Pelindungan Data Pribadi (UU No. 27 Tahun 2022) dan, bagi pengguna
      di Uni Eropa, prinsip GDPR.
    </p>

    <h3>1. Data yang kami kumpulkan</h3>
    <p>Kami hanya mengumpulkan data yang diperlukan:</p>
    <ul>
      <li><b>Data kontak dan pendaftaran:</b> nama, nomor WhatsApp, email, kota dan negara domisili, usia, layanan dan jadwal yang dipilih.</li>
      <li><b>Topik umum</b> yang ingin dibahas (pilihan singkat). Kami tidak meminta cerita detail di formulir; ceritamu disampaikan di sesi.</li>
      <li><b>Data pembayaran:</b> bukti pembayaran yang kamu kirim. Kami tidak menyimpan nomor kartu atau akun bank.</li>
      <li><b>Bukti untuk diskon</b> (identitas pelajar atau domisili luar negeri): hanya <b>diperiksa lalu tidak disimpan</b>. Kami mencatat bahwa diskon terverifikasi dan tanggalnya saja.</li>
      <li><b>Catatan sesi</b> yang dibuat psikolog sesuai kewajiban profesi.</li>
      <li><b>Data teknis ringan</b> dari analitik situs (halaman yang dibuka, jenis perangkat) tanpa mengidentifikasi kamu secara pribadi.</li>
    </ul>
    <p>Data tentang kesehatan jiwa termasuk <b>data pribadi yang bersifat spesifik</b>, dan kami memperlakukannya dengan tingkat perlindungan lebih tinggi.</p>

    <h3>2. Untuk apa data dipakai</h3>
    <ul>
      <li>Menjadwalkan dan melaksanakan sesi.</li>
      <li>Menghubungi kamu terkait jadwal, pembayaran, dan tindak lanjut.</li>
      <li>Memverifikasi diskon.</li>
      <li>Memenuhi kewajiban profesi dan hukum.</li>
      <li>Memperbaiki layanan (dalam bentuk agregat, tanpa identitas).</li>
    </ul>
    <p>
      Dasar pemrosesan adalah <b>persetujuanmu</b>, pelaksanaan layanan, dan kewajiban hukum. Kami <b>tidak menjual</b>
      datamu dan tidak menggunakannya untuk iklan pihak ketiga.
    </p>

    <h3>3. Dengan siapa data dibagikan</h3>
    <p>
      Hanya dengan penyedia layanan yang diperlukan untuk menjalankan layanan: penjadwalan, konferensi video/telepon
      (misalnya Google Meet), pembayaran (misalnya PayPal), pesan (WhatsApp), email, dan penyimpanan dokumen berakses
      terbatas. Penyedia ini bisa berada di luar Indonesia, sehingga datamu dapat diproses di luar negeri dengan
      perlindungan yang wajar.
    </p>
    <p>
      Kami <b>tidak</b> membagikan isi sesi kepada pihak lain, kecuali dalam kondisi yang dijelaskan di bagian Batas
      Kerahasiaan pada <NuxtLink to="/syarat-layanan">Syarat Layanan</NuxtLink>.
    </p>

    <h3>4. Penyimpanan dan keamanan</h3>
    <p>
      Akses data dibatasi pada psikolog dan admin yang berkepentingan. Data disimpan di layanan dengan kata sandi kuat
      dan, bila tersedia, autentikasi dua langkah. Jika terjadi kebocoran data, kami memberi tahu pihak terdampak dan
      pihak berwenang sesuai ketentuan UU PDP.
    </p>
    <p>
      Lama penyimpanan: data administratif dan catatan sesi disimpan selama yang diwajibkan ketentuan profesi psikologi
      dan hukum yang berlaku, lalu dihapus atau dianonimkan.
    </p>

    <h3>5. Hakmu</h3>
    <p>
      Kamu berhak meminta akses, perbaikan, penghapusan, dan pembatasan pemrosesan datamu, menarik persetujuan, serta
      mengajukan keberatan. Hubungi <a :href="`mailto:${SITE.brand.email}`">{{ SITE.brand.email }}</a>. Penghapusan dapat
      dibatasi bila ada kewajiban menyimpan catatan menurut hukum atau kode etik.
    </p>

    <h3>6. Anak di bawah 18 tahun</h3>
    <p>Layanan untuk klien di bawah 18 tahun hanya dengan pendaftaran dan persetujuan tertulis orang tua/wali.</p>

    <h3>7. Perubahan</h3>
    <p>Kebijakan ini dapat diperbarui. Perubahan penting akan diumumkan di situs.</p>

    <h3>8. Kontak</h3>
    <p>Rena Jiwa · <a :href="`mailto:${SITE.brand.email}`">{{ SITE.brand.email }}</a> · Instagram {{ SITE.brand.instagram }}</p>
  </LegalPage>
</template>

<script setup lang="ts">
const { m } = useLocale()
</script>
