<template>
  <div class="mx-auto flex max-w-md flex-col items-center py-6 text-center">
    <span class="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-2xl text-brand-600">✓</span>
    <h1 class="mt-4 text-2xl font-bold">Pendaftaran diterima</h1>
    <p class="mt-2 text-sm text-ink/70">
      <template v-if="emailSent">Detail dan QR pembayaran juga kami kirim ke <b>{{ email }}</b>.</template>
      <template v-else>Email konfirmasi belum terkirim — simpan halaman ini atau screenshot QR di bawah.</template>
    </p>

    <p class="mt-5 rounded-2xl border border-dashed border-brand-200 bg-brand-50 px-6 py-3 font-mono text-xl font-bold tracking-widest text-brand-700">
      {{ code }}
    </p>

    <dl class="mt-5 w-full space-y-2 text-left text-sm">
      <div v-for="[k, v] in rows" :key="k" class="flex justify-between gap-4 border-b border-sand-100 pb-2">
        <dt class="text-ink/60">{{ k }}</dt>
        <dd class="text-right font-medium">{{ v }}</dd>
      </div>
    </dl>

    <!-- Pembayaran QRIS -->
    <section class="mt-6 w-full rounded-3xl border border-sand-200 p-5" aria-labelledby="pay-title">
      <h2 id="pay-title" class="font-bold">Bayar dengan QRIS</h2>
      <p class="mt-1 text-sm text-ink/70">
        Scan dengan m-banking atau e-wallet apa pun. Nominal
        <b class="text-ink">{{ rupiah(total) }}</b> sudah terisi otomatis.
      </p>
      <p v-if="qrDemo" class="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
        QR CONTOH — QRIS merchant belum diatur, jangan dibayar.
      </p>
      <img :src="qr" alt="Kode QRIS pembayaran" width="240" height="240" class="mx-auto mt-4 rounded-xl border border-sand-100" />
      <a :href="qr" :download="`qris-${code}.png`" class="mt-2 inline-block text-sm font-semibold text-brand-600 hover:underline">
        Simpan gambar QR
      </a>
    </section>

    <ol class="mt-6 w-full space-y-2 text-left text-sm text-ink/80">
      <li><b>1.</b> Bayar sesuai nominal lewat QR di atas.</li>
      <li><b>2.</b> Kirim bukti pembayaran ke WhatsApp admin.</li>
      <li><b>3.</b> Admin mengonfirmasi jadwal dan mengirim tautan sesi.</li>
    </ol>

    <a :href="waLink" target="_blank" rel="noopener" class="btn-primary mt-6 w-full">
      Kirim bukti pembayaran via WhatsApp
    </a>
    <NuxtLink to="/" class="btn-ghost mt-3 w-full">Kembali ke beranda</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  code: string
  rows: [string, string][]
  total: number
  qr: string
  qrDemo: boolean
  email: string
  emailSent: boolean
}>()

const wa = useRuntimeConfig().public.whatsappNumber
const waLink = computed(
  () =>
    `https://wa.me/${waNumber(wa)}?text=` +
    encodeURIComponent(
      `Halo admin, saya sudah membayar ${rupiah(props.total)} untuk pendaftaran ${props.code}. Berikut bukti pembayarannya:`,
    ),
)
</script>
