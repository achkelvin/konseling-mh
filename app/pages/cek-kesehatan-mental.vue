<template>
  <WizardShell
    title="Cek Kesehatan Mental"
    :steps="steps"
    :current="step"
    :can-next="step !== 2 || personValid"
    :busy="busy"
    :error="error"
    submit-label="Kirim & Bayar"
    :hide-footer="!!result"
    @back="step--"
    @next="next"
  >
    <SuccessPanel
      v-if="result"
      :code="result.code"
      :total="result.total"
      :qr="result.qr"
      :qr-demo="result.qrDemo"
      :email="person.email"
      :email-sent="result.emailSent"
      :rows="[['Layanan', 'Cek Kesehatan Mental']]"
    />

    <div v-else-if="step === 1">
      <h1 class="text-2xl font-bold">Cek Kesehatan Mental</h1>
      <p class="mt-2 text-sm text-ink/70">
        Penasaran dengan kondisi kesehatan mentalmu? Isi kuesioner skrining, lalu hasilnya
        diinterpretasi oleh psikolog.
      </p>
      <h2 class="mt-6 text-sm font-semibold">Gejala yang dideteksi</h2>
      <ul class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <li v-for="g in symptoms" :key="g" class="rounded-xl border border-sand-200 px-3 py-2 text-sm">{{ g }}</li>
      </ul>
      <h2 class="mt-6 text-sm font-semibold">Apa yang didapatkan?</h2>
      <ul class="mt-2 space-y-1 text-sm text-ink/80">
        <li>✓ Hasil berupa PDF</li>
        <li>✓ Interpretasi oleh psikolog</li>
        <li>✓ Pembacaan hasil 15 menit</li>
      </ul>
      <div class="mt-6 rounded-2xl bg-brand-50 p-5">
        <p class="text-xs text-ink/60">Harga layanan</p>
        <p class="text-2xl font-extrabold text-brand-700">{{ rupiah(price) }}</p>
      </div>
      <p class="mt-4 text-xs text-ink/50">
        Skrining bukan diagnosis. Hasil perlu ditindaklanjuti bersama tenaga profesional.
      </p>
    </div>

    <div v-else-if="step === 2">
      <h1 class="text-2xl font-bold">Data Diri</h1>
      <p class="mb-6 mt-2 text-sm text-ink/70">Tautan kuesioner dikirim ke WhatsApp dan email ini.</p>
      <PersonFields v-model="person" v-model:valid="personValid" />
    </div>

    <div v-else>
      <h1 class="text-2xl font-bold">Ringkasan</h1>
      <p class="mt-2 text-sm text-ink/70">Setelah dikirim, kamu akan mendapat QRIS untuk pembayaran.</p>
      <dl class="mt-6 divide-y divide-sand-100 rounded-2xl border border-sand-200 text-sm">
        <div v-for="[k, v] in [['Nama', person.name], ['WhatsApp', person.whatsapp], ['Email', person.email]]" :key="k" class="flex justify-between gap-6 px-5 py-3">
          <dt class="text-ink/60">{{ k }}</dt>
          <dd class="text-right font-medium">{{ v }}</dd>
        </div>
        <div class="flex justify-between gap-6 bg-brand-50 px-5 py-4">
          <dt class="font-semibold">Total</dt>
          <dd class="text-lg font-extrabold text-brand-700">{{ rupiah(price) }}</dd>
        </div>
      </dl>
    </div>
  </WizardShell>
</template>

<script setup lang="ts">
import type { Person } from '~/components/PersonFields.vue'

definePageMeta({ layout: false })
useHead({ title: 'Cek Kesehatan Mental — KonselingMH' })

const steps = ['Info Layanan', 'Data Diri', 'Ringkasan & Bayar']
const symptoms = ['Stres', 'Cemas', 'Depresi', 'PTSD', 'Psikotik', 'Psikoaktif']

const { data } = await useFetch('/api/services')
const price = computed(() => data.value?.screening.price ?? 0)

const step = ref(1)
const busy = ref(false)
const error = ref('')
const personValid = ref(false)
const person = ref<Person>({ name: '', whatsapp: '', email: '', age: null, gender: '' })
const result = ref<{ code: string; total: number; qr: string; qrDemo: boolean; emailSent: boolean } | null>(null)

async function next() {
  error.value = ''
  if (step.value < steps.length) {
    step.value++
    return
  }
  busy.value = true
  try {
    result.value = await $fetch('/api/screenings', { method: 'POST', body: { person: person.value } })
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Pendaftaran gagal dikirim. Coba lagi.'
  } finally {
    busy.value = false
  }
}
</script>
