<template>
  <div class="mx-auto flex max-w-md flex-col items-center py-6 text-center">
    <span class="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-2xl text-brand-600">✓</span>
    <h1 class="mt-4 text-2xl font-medium text-brand-700">{{ m.success.title }}</h1>
    <p class="mt-2 text-sm text-ink/70">
      <template v-if="emailSent">{{ fmt(m.success.emailSent, { email }) }}</template>
      <template v-else>{{ m.success.emailFailed }}</template>
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
    <section class="mt-6 w-full rounded-2xl border border-sand-300 bg-white p-5 text-left" aria-labelledby="pay-title">
      <h2 id="pay-title" class="font-display text-lg font-medium text-brand-700">{{ m.success.payTitle }}</h2>
      <!-- Brief: detail pembayaran tidak ditampilkan di website; admin mengirimnya (flag showPaymentDetails) -->
      <p v-if="!SITE.featureFlags.showPaymentDetails" class="mt-2 text-sm leading-relaxed text-ink/80">
        {{ fmt(m.success.payAdmin, { amount: rupiah(total) }) }}
      </p>
      <template v-else>
      <p class="mt-1 text-sm text-ink/70">
        {{ fmt(m.success.payLead, { amount: rupiah(total) }) }}
      </p>

      <div v-if="qrImage" class="mt-4 rounded-2xl bg-sand-50 p-4 text-center">
        <p class="text-sm font-semibold">{{ m.success.qrisTitle }}</p>
        <img :src="qrImage" :alt="m.success.qrisAlt" class="mx-auto mt-3 h-52 w-52 rounded-xl bg-white p-2" />
        <p class="mt-2 text-xs text-ink/60">{{ m.success.qrisNote }}</p>
      </div>

      <dl class="mt-4 space-y-3 rounded-2xl bg-sand-50 p-4 text-sm">
        <div class="flex justify-between gap-4">
          <dt class="text-ink/60">{{ m.success.bank }}</dt>
          <dd class="font-semibold">{{ bank.name }}</dd>
        </div>
        <div class="flex items-center justify-between gap-4">
          <dt class="text-ink/60">{{ m.success.account }}</dt>
          <dd class="flex items-center gap-2">
            <span class="font-mono text-base font-bold tracking-wide">{{ bank.account }}</span>
            <button type="button" class="rounded-lg border border-sand-200 bg-white px-2 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-50" @click="copy(bank.account, 'acc')">
              {{ copied === 'acc' ? m.success.copied : m.success.copy }}
            </button>
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-ink/60">{{ m.success.holder }}</dt>
          <dd class="font-semibold">{{ bank.holder }}</dd>
        </div>
        <div class="flex items-center justify-between gap-4 border-t border-sand-200 pt-3">
          <dt class="text-ink/60">{{ m.success.amount }}</dt>
          <dd class="flex items-center gap-2">
            <span class="text-base font-extrabold text-brand-700">{{ rupiah(total) }}</span>
            <button type="button" class="rounded-lg border border-sand-200 bg-white px-2 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-50" @click="copy(String(total), 'amt')">
              {{ copied === 'amt' ? m.success.copied : m.success.copy }}
            </button>
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-ink/60">{{ m.success.reference }}</dt>
          <dd class="font-mono font-semibold">{{ code }}</dd>
        </div>
      </dl>
      </template>
    </section>

    <ol class="mt-6 w-full space-y-2 text-left text-sm text-ink/80">
      <li v-for="(s, i) in m.success.steps" :key="i"><b>{{ i + 1 }}.</b> {{ s }}</li>
    </ol>

    <a :href="waHref" target="_blank" rel="noopener" class="btn-primary mt-6 w-full">
      <WhatsAppIcon class="h-4 w-4" /> {{ m.success.whatsapp }}
    </a>
    <NuxtLink to="/" class="btn-ghost mt-3 w-full">{{ m.common.backHome }}</NuxtLink>
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

const { bank, qrisPayload } = useRuntimeConfig().public
const { m, fmt } = useLocale()
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
    if (!qrisPayload || !SITE.featureFlags.showPaymentDetails) {
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

const waHref = computed(() =>
  waLink(fmt(m.value.success.waMessage, { amount: rupiah(props.total), code: props.code })),
)
</script>
