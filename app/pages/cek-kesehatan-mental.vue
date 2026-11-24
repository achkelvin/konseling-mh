<template>
  <WizardShell
    :title="m.cek.title"
    :steps="m.cek.steps"
    :current="step"
    :can-next="step !== 2 || personValid"
    :busy="busy"
    :error="error"
    :submit-label="m.common.submit"
    :hide-footer="!!result"
    @back="step--"
    @next="next"
  >
    <SuccessPanel
      v-if="result"
      :code="result.code"
      :total="result.total"
      :email="person.email"
      :email-sent="result.emailSent"
      :rows="[[m.cek.rowService, m.cek.title]]"
    />

    <div v-else-if="step === 1">
      <h1 class="text-2xl font-bold">{{ m.cek.title }}</h1>
      <p class="mt-2 text-sm text-ink/70">{{ m.cek.lead }}</p>
      <h2 class="mt-6 text-sm font-semibold">{{ m.home.symptomsTitle }}</h2>
      <ul class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <li v-for="g in m.home.symptoms" :key="g" class="rounded-xl border border-sand-200 px-3 py-2 text-sm">{{ g }}</li>
      </ul>
      <h2 class="mt-6 text-sm font-semibold">{{ m.home.benefitsTitle }}</h2>
      <ul class="mt-2 space-y-1 text-sm text-ink/80">
        <li v-for="b in m.home.benefits" :key="b">✓ {{ b }}</li>
      </ul>
      <div class="mt-6 rounded-2xl bg-brand-50 p-5">
        <p class="text-xs text-ink/60">{{ m.cek.priceLabel }}</p>
        <p class="text-2xl font-extrabold text-brand-700">{{ rupiah(price) }}</p>
      </div>
      <p class="mt-4 text-xs text-ink/50">{{ m.cek.disclaimer }}</p>
    </div>

    <div v-else-if="step === 2">
      <h1 class="text-2xl font-bold">{{ m.cek.formTitle }}</h1>
      <p class="mb-6 mt-2 text-sm text-ink/70">{{ m.cek.formLead }}</p>
      <PersonFields v-model="person" v-model:valid="personValid" />
    </div>

    <div v-else>
      <h1 class="text-2xl font-bold">{{ m.cek.summaryTitle }}</h1>
      <p class="mt-2 text-sm text-ink/70">{{ m.cek.summaryLead }}</p>
      <dl class="mt-6 divide-y divide-sand-100 rounded-2xl border border-sand-200 text-sm">
        <div
          v-for="[k, v] in [[m.cek.rowName, person.fullName], ['WhatsApp', person.whatsapp], ['Email', person.email]]"
          :key="k"
          class="flex justify-between gap-6 px-5 py-3"
        >
          <dt class="text-ink/60">{{ k }}</dt>
          <dd class="text-right font-medium">{{ v }}</dd>
        </div>
        <div class="flex justify-between gap-6 bg-brand-50 px-5 py-4">
          <dt class="font-semibold">{{ m.common.total }}</dt>
          <dd class="text-lg font-extrabold text-brand-700">{{ rupiah(price) }}</dd>
        </div>
      </dl>
    </div>
  </WizardShell>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
const { m, lang } = useLocale()
useHead({ title: () => m.value.cek.pageTitle })

const { data } = await useFetch('/api/services')
const price = computed(() => data.value?.screening.price ?? 0)

const step = ref(1)
const busy = ref(false)
const error = ref('')
const personValid = ref(false)
const person = ref<Person>(emptyPerson())
const result = ref<{ code: string; total: number; emailSent: boolean } | null>(null)

async function next() {
  error.value = ''
  if (step.value < m.value.cek.steps.length) {
    step.value++
    return
  }
  busy.value = true
  try {
    result.value = await $fetch('/api/screenings', {
      method: 'POST',
      body: { person: person.value, lang: lang.value },
    })
  } catch (e: any) {
    error.value = e?.data?.message ?? m.value.common.sendFailed
  } finally {
    busy.value = false
  }
}
</script>
