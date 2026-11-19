<template>
  <div class="mx-auto flex max-w-md flex-col items-center py-6 text-center">
    <span class="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-2xl text-brand-600">✓</span>
    <h1 class="mt-4 text-2xl font-bold">Pendaftaran diterima</h1>
    <p class="mt-2 text-sm text-ink/70">
      <template v-if="emailSent">Detail dan instruksi pembayaran juga kami kirim ke <b>{{ email }}</b>.</template>
      <template v-else>Email konfirmasi belum terkirim — simpan halaman ini atau screenshot detail di bawah.</template>
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

    <!-- Pembayaran transfer bank -->
    <section class="mt-6 w-full rounded-3xl border border-sand-200 p-5 text-left" aria-labelledby="pay-title">
      <h2 id="pay-title" class="font-bold">Pembayaran via transfer bank</h2>
      <p class="mt-1 text-sm text-ink/70">
        Transfer <b class="text-ink">{{ rupiah(total) }}</b> ke rekening berikut:
      </p>

      <div v-if="qrImage" class="mt-4 rounded-2xl bg-sand-50 p-4 text-center">
        <p class="text-sm font-semibold">Atau bayar dengan QRIS</p>
        <img :src="qrImage" alt="QRIS pembayaran" class="mx-auto mt-3 h-52 w-52 rounded-xl bg-white p-2" />
        <p class="mt-2 text-xs text-ink/60">Nominal sudah diatur sesuai jumlah pembayaran.</p>
      </div>

      <dl class="mt-4 space-y-3 rounded-2xl bg-sand-50 p-4 text-sm">
        <div class="flex justify-between gap-4">
          <dt class="text-ink/60">Bank</dt>
          <dd class="font-semibold">{{ bank.name }}</dd>
        </div>
        <div class="flex items-center justify-between gap-4">
          <dt class="text-ink/60">No. rekening</dt>
          <dd class="flex items-center gap-2">
            <span class="font-mono text-base font-bold tracking-wide">{{ bank.account }}</span>
            <button type="button" class="rounded-lg border border-sand-200 bg-white px-2 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-50" @click="copy(bank.account, 'acc')">
              {{ copied === 'acc' ? 'Tersalin ✓' : 'Salin' }}
            </button>
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-ink/60">Atas nama</dt>
          <dd class="font-semibold">{{ bank.holder }}</dd>
        </div>
        <div class="flex items-center justify-between gap-4 border-t border-sand-200 pt-3">
          <dt class="text-ink/60">Jumlah</dt>
          <dd class="flex items-center gap-2">
            <span class="text-base font-extrabold text-brand-700">{{ rupiah(total) }}</span>
            <button type="button" class="rounded-lg border border-sand-200 bg-white px-2 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-50" @click="copy(String(total), 'amt')">
              {{ copied === 'amt' ? 'Tersalin ✓' : 'Salin' }}
            </button>
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-ink/60">Berita transfer</dt>
          <dd class="font-mono font-semibold">{{ code }}</dd>
        </div>
      </dl>
    </section>

    <ol class="mt-6 w-full space-y-2 text-left text-sm text-ink/80">
      <li><b>1.</b> Transfer sesuai jumlah di atas, tulis kode pendaftaran di berita transfer.</li>
      <li><b>2.</b> Kirim bukti transfer ke WhatsApp admin.</li>
      <li><b>3.</b> Admin mengonfirmasi jadwal dan mengirim tautan sesi.</li>
    </ol>

    <a :href="waLink" target="_blank" rel="noopener" class="btn-primary mt-6 w-full">
      Kirim bukti transfer via WhatsApp
    </a>
    <NuxtLink to="/" class="btn-ghost mt-3 w-full">Kembali ke beranda</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import * as QRCode from 'qrcode'

const props = defineProps<{
  code: string
  rows: [string, string][]
  total: number
  email: string
  emailSent: boolean
}>()

const { whatsappNumber, bank, qrisPayload } = useRuntimeConfig().public
const copied = ref('')
const qrImage = ref('')

function crc16(value: string) {
  let crc = 0xffff
  for (const character of value) {
    crc ^= character.charCodeAt(0) << 8
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc & 0x8000) !== 0 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function qrisWithAmount(payload: string, amount: number) {
  const withoutCrc = payload.replace(/6304[0-9A-Fa-f]{4}$/, '').replace('010211', '010212')
  const amountField = `54${String(rupiah(amount)).replace(/\D/g, '').length.toString().padStart(2, '0')}${String(rupiah(amount)).replace(/\D/g, '')}`
  const countryIndex = withoutCrc.indexOf('5802')
  const withAmount = countryIndex === -1
    ? withoutCrc + amountField
    : withoutCrc.slice(0, countryIndex) + amountField + withoutCrc.slice(countryIndex)
  return `${withAmount}6304${crc16(`${withAmount}6304`)}`
}

watch(
  () => [qrisPayload, props.total],
  async () => {
    if (!qrisPayload) {
      qrImage.value = ''
      return
    }
    qrImage.value = await QRCode.toDataURL(qrisWithAmount(qrisPayload, props.total), {
      width: 220,
      margin: 2,
    })
  },
  { immediate: true },
)

async function copy(text: string, key: string) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = key
    setTimeout(() => (copied.value = ''), 2000)
  } catch {
    /* clipboard tidak tersedia; pengguna bisa menyalin manual */
  }
}

const waLink = computed(
  () =>
    `https://wa.me/${waNumber(whatsappNumber)}?text=` +
    encodeURIComponent(
      `Halo admin, saya sudah transfer ${rupiah(props.total)} ke ${bank.name} ${bank.account} untuk pendaftaran ${props.code}. Berikut bukti transfernya:`,
    ),
)
</script>
