<template>
  <!-- Sumber: contents/RenaJiwa_Draf_Legal.md bagian B, C, D (draf v1, menunggu tinjauan ahli hukum) -->
  <LegalPage :title="m.footer.terms">
    <p>Dengan memesan layanan Rena Jiwa, kamu menyetujui syarat berikut.</p>

    <h2>Syarat Layanan</h2>

    <h3>1. Tentang layanan</h3>
    <p>
      Rena Jiwa menyediakan konsultasi psikologi dengan psikolog klinis melalui chat, telepon, video, dan (by request, di
      Jakarta) tatap muka. Layanan Cek Kesehatan Mental (MHCU) adalah <b>skrining</b>, bukan diagnosis.
    </p>

    <h3>2. Bukan layanan darurat</h3>
    <p>
      Layanan ini <b>bukan</b> layanan gawat darurat. Jika kamu atau orang lain dalam bahaya, segera hubungi layanan
      darurat setempat atau IGD terdekat (daftar nomor ada di footer situs).
    </p>

    <h3>3. Kelayakan</h3>
    <p>
      Klien berusia 18 tahun ke atas dapat mendaftar sendiri. Klien di bawah 18 tahun harus didaftarkan orang tua/wali
      dengan persetujuan tertulis (lihat Persetujuan Orang Tua/Wali di bawah).
    </p>

    <h3>4. Pemesanan dan pembayaran</h3>
    <ul>
      <li>Harga tercantum di halaman Layanan dalam Rupiah.</li>
      <li>
        Pembayaran dilakukan sebelum sesi melalui QRIS atau transfer bank (dalam negeri) atau PayPal (luar negeri). Sesi
        terkonfirmasi setelah pembayaran diverifikasi.
      </li>
      <li>Hal yang tidak termasuk dalam harga (misalnya biaya tambahan sewa ruang untuk sesi offline) diinformasikan lebih dulu oleh admin.</li>
    </ul>

    <h3>5. Diskon</h3>
    <p>
      Diskon pelajar/mahasiswa hanya untuk klien 18 tahun ke atas yang mendaftar sendiri dan menunjukkan bukti identitas
      pelajar yang berlaku. Diskon diaspora untuk WNI yang dapat membuktikan domisili di luar negeri. Diskon tidak berlaku
      untuk layanan Offline dan MHCU, tidak dapat digabung, dan berlaku selama periode promo. Rena Jiwa berhak menolak
      diskon bila bukti tidak sah.
    </p>

    <h3>6. Pembatalan dan pergantian jadwal</h3>
    <ul>
      <li>Ganti jadwal gratis jika diberitahukan <b>lebih dari 24 jam</b> sebelum sesi.</li>
      <li>Kurang dari 24 jam: dikenakan biaya admin Rp50.000 atau sesi dianggap terpakai.</li>
      <li>Tidak hadir tanpa kabar: sesi dianggap terpakai.</li>
      <li>Jika sesi dibatalkan oleh psikolog: jadwal ulang gratis atau pengembalian dana penuh.</li>
    </ul>

    <h3>7. Pelaksanaan sesi</h3>
    <p>
      Sesi berdurasi sesuai layanan (60 menit; sesi hasil MHCU 30 menit). Kami meminta kamu berada di tempat yang cukup
      privat dan terhubung dengan baik. <b>Sesi tidak direkam</b> tanpa persetujuan. Dilarang merekam sesi tanpa izin
      tertulis.
    </p>

    <h3>8. Kerahasiaan dan batasnya</h3>
    <p>Isi sesi dijaga sesuai kode etik psikologi. Kerahasiaan dapat dikecualikan bila:</p>
    <ul>
      <li>ada risiko serius terhadap keselamatan klien atau orang lain,</li>
      <li>ada kewajiban berdasarkan hukum atau perintah pihak berwenang,</li>
      <li>klien memberi persetujuan tertulis untuk membagikan informasi.</li>
    </ul>
    <p>Pengecualian dilakukan seperlunya dan sebisa mungkin dibicarakan dengan klien.</p>

    <h3>9. Batas tanggung jawab</h3>
    <p>
      Psikolog memberikan layanan profesional dengan sebaik-baiknya, tetapi <b>tidak menjanjikan hasil tertentu</b>.
      Perubahan yang kamu alami bergantung pada banyak faktor. Layanan ini bukan pengganti penanganan medis atau psikiatri
      bila itu diperlukan; kami dapat menyarankan rujukan.
    </p>

    <h3>10. Hak kekayaan intelektual</h3>
    <p>Nama, logo, dan konten Rena Jiwa dilindungi. Dilarang menyalin atau memakainya tanpa izin tertulis.</p>

    <h3>11. Hukum yang berlaku</h3>
    <p>Syarat ini tunduk pada hukum Republik Indonesia. Perselisihan diupayakan diselesaikan secara musyawarah terlebih dahulu.</p>

    <h3>12. Kontak</h3>
    <p><a :href="`mailto:${SITE.brand.email}`">{{ SITE.brand.email }}</a></p>

    <h2 id="persetujuan">Persetujuan Layanan (informed consent)</h2>
    <p>Saya memahami dan menyetujui bahwa:</p>
    <ol>
      <li>Saya akan mengikuti konsultasi psikologi dengan psikolog klinis Rena Jiwa melalui medium yang saya pilih (chat, telepon, video, atau tatap muka).</li>
      <li>Layanan ini membantu saya memahami dan mengelola masalah psikologis, namun <b>tidak menjamin hasil tertentu</b>, dan bukan layanan gawat darurat.</li>
      <li>Isi sesi bersifat <b>rahasia</b>, dengan pengecualian seperti dijelaskan dalam Syarat Layanan (risiko serius terhadap keselamatan, kewajiban hukum, atau persetujuan saya).</li>
      <li>Sesi <b>tidak direkam</b> tanpa persetujuan tertulis dari saya dan psikolog.</li>
      <li>Data pribadi saya diproses sesuai <NuxtLink to="/kebijakan-privasi">Kebijakan Privasi</NuxtLink>, termasuk bahwa data kesehatan jiwa termasuk data pribadi yang bersifat spesifik.</li>
      <li>Saya boleh <b>menghentikan layanan atau menarik persetujuan</b> kapan saja, dengan memberi tahu psikolog atau admin.</li>
      <li>Jika saya berada dalam bahaya atau berpikir menyakiti diri sendiri atau orang lain, saya akan menghubungi layanan darurat setempat atau IGD terdekat.</li>
      <li>Informasi yang saya berikan benar sepengetahuan saya, dan saya berusia 18 tahun ke atas atau didaftarkan oleh orang tua/wali.</li>
    </ol>

    <h2 id="orang-tua">Persetujuan Orang Tua/Wali (klien di bawah 18 tahun)</h2>
    <p>
      Saya, <b>[nama orang tua/wali]</b>, selaku orang tua/wali dari <b>[nama panggilan anak]</b> (usia <b>[..]</b> tahun),
      menyatakan bahwa:
    </p>
    <ol>
      <li>Saya mendaftarkan anak saya untuk mengikuti konsultasi psikologi di Rena Jiwa dan telah membaca Kebijakan Privasi dan Syarat Layanan.</li>
      <li>Saya menyetujui pemrosesan data pribadi anak saya sesuai Kebijakan Privasi.</li>
      <li>
        Saya memahami bahwa kerahasiaan sesi anak dijaga, dengan pengecualian risiko serius terhadap keselamatan atau
        kewajiban hukum, dan bahwa psikolog dapat membahas hal yang diperlukan dengan saya demi keselamatan anak.
      </li>
      <li>Saya dapat dihubungi melalui <b>[nomor WhatsApp/email]</b>.</li>
    </ol>
    <p>Tanggal: [..] · Tanda tangan atau persetujuan elektronik: [..]</p>
  </LegalPage>
</template>

<script setup lang="ts">
const { m } = useLocale()
</script>
