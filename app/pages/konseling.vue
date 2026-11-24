<template>
  <WizardShell
    :title="m.konseling.title"
    :steps="m.konseling.steps"
    :current="step"
    :can-next="canNext"
    :busy="busy"
    :error="error"
    :submit-label="m.common.submit"
    :hide-footer="!!result"
    @back="back"
    @next="next"
  >
    <SuccessPanel
      v-if="result"
      :code="result.code"
      :total="result.total"
      :email="form.person.email"
      :email-sent="result.emailSent"
      :rows="[
        [m.konseling.rowService, m.services[result.serviceId as ServiceId].name],
        [m.konseling.rowSchedule, `${date(result.date)}, ${result.time} WIB`],
      ]"
    />

    <!-- 1. Layanan & jadwal -->
    <div v-else-if="step === 1">
      <h1 class="text-2xl font-medium text-brand-700">{{ m.konseling.pickTitle }}</h1>
      <!-- Satu psikolog: pilihan helper disembunyikan (flag showPsychologistPicker) -->
      <p class="mt-2 flex items-center gap-2 text-sm text-ink/70">
        <img src="/brand/icon.svg" alt="" class="h-6 w-6 rounded-md" />
        {{ SITE.psychologist.name }}
      </p>

      <fieldset class="mt-6">
        <legend class="label">{{ m.konseling.serviceType }}</legend>
        <div class="grid gap-3 sm:grid-cols-2" role="radiogroup" :aria-label="m.konseling.serviceType">
          <button
            v-for="s in bookable"
            :key="s.id"
            type="button"
            role="radio"
            :aria-checked="form.serviceId === s.id"
            class="flex items-start justify-between gap-4 rounded-xl border p-4 text-left transition"
            :class="form.serviceId === s.id ? 'border-brand-700 bg-brand-50 ring-1 ring-brand-700' : 'border-sand-300 bg-white hover:border-brand-300'"
            @click="form.serviceId = s.id"
          >
            <span>
              <span class="block font-semibold text-brand-700">{{ m.services[s.id].name }}</span>
              <span class="mt-0.5 block text-xs leading-relaxed text-ink/60">{{ m.services[s.id].desc }}</span>
              <span v-if="s.id === 'mhcu'" class="mt-1.5 inline-block rounded-full bg-accent-50 px-2 py-0.5 text-[11px] font-semibold text-accent-700">
                {{ m.common.notDiagnosis }} · {{ m.common.noDiscount }}
              </span>
            </span>
            <span class="shrink-0 text-right">
              <span class="block font-semibold">{{ rupiah(s.priceIDR) }}</span>
              <span class="text-xs text-ink/55">{{ s.minutes }} {{ m.common.minutes }}</span>
            </span>
          </button>
        </div>

        <!-- Offline: by request, tidak dipesan langsung -->
        <div
          v-if="SITE.featureFlags.offlineEnabled"
          class="mt-3 flex flex-col gap-3 rounded-xl border border-dashed border-brand-700/30 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            <span class="flex items-center gap-2 font-semibold text-brand-700">
              {{ m.services.offline.name }}
              <span class="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold">{{ m.home.byRequest }}</span>
            </span>
            <span class="mt-0.5 block text-xs text-ink/60">{{ rupiah(offline!.priceIDR) }} · {{ m.konseling.offlineNote }}</span>
          </span>
          <a :href="waLink(m.home.offlineWa)" target="_blank" rel="noopener" class="btn-ghost shrink-0 !py-2">
            <WhatsAppIcon class="h-4 w-4" /> {{ m.common.askAdmin }}
          </a>
        </div>
      </fieldset>

      <h2 class="mt-8 font-sans text-sm font-semibold">{{ m.konseling.available }}</h2>
      <p class="mt-1 text-xs text-ink/55">{{ m.konseling.tzNote }}</p>
      <p v-if="!days.length" class="mt-3 text-sm text-ink/60">{{ m.konseling.noSchedule }}</p>
      <div v-for="d in shownDays" :key="d.date" class="mt-4">
        <h3 class="font-sans text-xs font-medium text-ink/60">{{ date(d.date) }}</h3>
        <div class="mt-1.5 flex flex-wrap gap-2">
          <button
            v-for="s in d.slots"
            :key="s.id"
            type="button"
            :disabled="!s.available"
            :aria-pressed="form.slotId === s.id"
            class="rounded-lg border px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:text-ink/30 disabled:line-through"
            :class="form.slotId === s.id ? 'border-accent-600 bg-accent-600 text-white' : 'border-sand-300 bg-white enabled:hover:border-brand-500'"
            @click="form.slotId = s.id"
          >
            {{ s.time }}
            <span v-if="localTime(d.date, s.time)" class="ml-1 text-[11px] font-normal opacity-75">
              ({{ localTime(d.date, s.time) }} {{ m.konseling.local }})
            </span>
          </button>
        </div>
      </div>
      <button v-if="days.length > shownDays.length" type="button" class="mt-5 text-sm font-semibold text-accent-600 underline underline-offset-4" @click="dayLimit += 7">
        +7 {{ lang === 'en' ? 'more days' : 'hari berikutnya' }}
      </button>
    </div>

    <!-- 2. Formulir -->
    <div v-else-if="step === 2">
      <h1 class="text-2xl font-medium text-brand-700">{{ m.konseling.formTitle }}</h1>
      <p class="mt-2 text-sm text-ink/70">{{ m.konseling.formLead }}</p>
      <p class="mb-6 mt-3 rounded-lg bg-accent-50 px-4 py-3 text-sm text-accent-700">{{ m.konseling.noDetail }}</p>
      <PersonFields v-model="form.person" v-model:valid="personValid" :service-id="form.serviceId" />

      <fieldset class="mt-6">
        <legend class="label">{{ m.konseling.topicsLegend }}</legend>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="(t, i) in TOPICS"
            :key="t"
            class="cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-500"
            :class="form.topics.includes(t) ? 'border-brand-700 bg-brand-700 text-sand-50' : 'border-sand-300 bg-white hover:border-brand-300'"
          >
            <input v-model="form.topics" type="checkbox" :value="t" class="sr-only" />
            {{ m.konseling.topics[i] }}
          </label>
        </div>
      </fieldset>

      <label v-if="minor" class="mt-6 flex cursor-pointer items-start gap-3 rounded-xl bg-brand-50 p-4 text-sm">
        <input v-model="form.guardianConsent" type="checkbox" class="mt-0.5 h-4 w-4 accent-brand-700" />
        <span>{{ m.konseling.guardianConsent }}</span>
      </label>
      <label class="mt-3 flex cursor-pointer items-start gap-3 rounded-xl bg-sand-50 p-4 text-sm">
        <input v-model="form.consent" type="checkbox" class="mt-0.5 h-4 w-4 accent-brand-700" />
        <span>
          {{ m.konseling.consentA }}
          <NuxtLink to="/kebijakan-privasi" target="_blank" class="font-semibold text-accent-600 underline">{{ m.konseling.consentPrivacy }}</NuxtLink>,
          <NuxtLink to="/syarat-layanan" target="_blank" class="font-semibold text-accent-600 underline">{{ m.konseling.consentTerms }}</NuxtLink>,
          <NuxtLink to="/syarat-layanan#persetujuan" target="_blank" class="font-semibold text-accent-600 underline">{{ m.konseling.consentConsent }}</NuxtLink>
          {{ m.konseling.consentB }}
        </span>
      </label>
    </div>

    <!-- 3. Ringkasan -->
    <div v-else>
      <h1 class="text-2xl font-medium text-brand-700">{{ m.konseling.summaryTitle }}</h1>
      <p class="mt-2 text-sm text-ink/70">{{ m.konseling.summaryLead }}</p>
      <dl class="mt-6 divide-y divide-sand-200 rounded-xl border border-sand-300 bg-white text-sm">
        <div v-for="[k, v] in summary" :key="k" class="flex justify-between gap-6 px-5 py-3">
          <dt class="text-ink/60">{{ k }}</dt>
          <dd class="text-right font-medium">{{ v }}</dd>
        </div>
        <div class="flex items-baseline justify-between gap-6 bg-brand-50 px-5 py-4">
          <dt class="font-semibold">{{ m.common.total }}</dt>
          <dd class="text-right">
            <span v-if="price.discountApplied" class="mr-2 text-sm text-ink/45 line-through">{{ rupiah(price.base) }}</span>
            <span class="text-lg font-semibold text-brand-700">{{ rupiah(price.total) }}</span>
          </dd>
        </div>
      </dl>
      <p v-if="form.person.discount !== 'none' && !price.discountApplied" class="mt-3 text-xs text-ink/60">
        {{ m.konseling.discountNotApplicable }}
      </p>
    </div>
  </WizardShell>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
const { m, date, lang } = useLocale()
useHead({ title: () => m.value.konseling.pageTitle })

const route = useRoute()
const { data: sched, refresh } = await useFetch('/api/schedule')

const bookable = SITE.services.filter((s) => s.bookable)
const offline = serviceById('offline')

const step = ref(1)
const busy = ref(false)
const error = ref('')
const personValid = ref(false)
const dayLimit = ref(7)
const result = ref<{
  code: string
  total: number
  serviceId: string
  date: string
  time: string
  emailSent: boolean
} | null>(null)

// ?service=video dari tombol "Pesan" di beranda
const preset = bookable.find((s) => s.id === route.query.service)
const form = reactive({
  serviceId: (preset?.id ?? 'chat') as ServiceId,
  slotId: '',
  person: emptyPerson(),
  topics: [] as string[],
  consent: false,
  guardianConsent: false,
})

const days = computed(() => sched.value?.schedules ?? [])
const shownDays = computed(() => days.value.slice(0, dayLimit.value))
const slot = computed(() => {
  for (const d of days.value) {
    const s = d.slots.find((x) => x.id === form.slotId)
    if (s) return { date: d.date, ...s }
  }
})
const minor = computed(() => isMinor(form.person.birthDate))
const price = computed(() => priceFor(form.serviceId, form.person.discount, minor.value))

/** Jam lokal pemesan bila zona waktunya bukan WIB (brief: deteksi otomatis). */
const browserOffset = ref<number | null>(null)
onMounted(() => (browserOffset.value = -new Date().getTimezoneOffset()))
function localTime(d: string, t: string) {
  if (browserOffset.value === null || browserOffset.value === 420) return ''
  const when = new Date(`${d}T${t}:00+07:00`)
  return when.toLocaleTimeString(lang.value === 'en' ? 'en-GB' : 'id-ID', { hour: '2-digit', minute: '2-digit' })
}

const canNext = computed(() => {
  switch (step.value) {
    case 1:
      return !!slot.value?.available
    case 2:
      return personValid.value && form.consent && (!minor.value || form.guardianConsent)
    default:
      return true
  }
})

const summary = computed<[string, string][]>(() => {
  const k = m.value.konseling
  const s = serviceById(form.serviceId)!
  const rows: [string, string][] = [
    [k.rowService, `${m.value.services[s.id].name} · ${s.minutes} ${m.value.common.minutes}`],
    [k.rowPsychologist, SITE.psychologist.name],
    [k.rowSchedule, slot.value ? `${date(slot.value.date)}, ${slot.value.time} WIB` : '-'],
    [k.rowName, form.person.nickname || form.person.fullName],
    ['WhatsApp', form.person.whatsapp],
    ['Email', form.person.email],
    [k.rowTopics, form.topics.map((t) => k.topics[TOPICS.indexOf(t as any)] ?? t).join(', ') || '-'],
  ]
  if (price.value.discountApplied)
    rows.push([k.rowDiscount, `${m.value.person.discountNames[price.value.discountApplied]} — ${k.discountPending}`])
  return rows
})

function back() {
  error.value = ''
  step.value--
}

async function next() {
  error.value = ''
  if (step.value < m.value.konseling.steps.length) {
    step.value++
    return
  }
  busy.value = true
  try {
    result.value = await $fetch('/api/bookings', {
      method: 'POST',
      body: {
        serviceId: form.serviceId,
        slotId: form.slotId,
        person: form.person,
        topics: form.topics,
        consent: form.consent,
        guardianConsent: form.guardianConsent,
        lang: lang.value,
      },
    })
  } catch (e: any) {
    error.value = e?.data?.message ?? m.value.common.sendFailed
    if (e?.statusCode === 409) {
      // slot keburu diambil: muat ulang jadwal dan kembali ke pemilihan slot
      await refresh()
      form.slotId = ''
      step.value = 1
    }
  } finally {
    busy.value = false
  }
}
</script>
