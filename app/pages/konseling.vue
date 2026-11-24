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
        [m.konseling.rowHelper, result.helperName],
        [m.konseling.rowSchedule, `${date(result.date)}, ${result.time} WIB`],
        [m.konseling.rowMethod, result.method],
      ]"
    />

    <!-- 1. Helper & jadwal -->
    <div v-else-if="step === 1">
      <h1 class="text-2xl font-bold">{{ m.konseling.pickTitle }}</h1>
      <p class="mt-2 text-sm text-ink/70">{{ m.konseling.allWib }}</p>

      <div class="mt-5 flex flex-wrap gap-2" role="radiogroup" :aria-label="m.konseling.serviceType">
        <button
          v-for="s in data?.services"
          :key="s.id"
          type="button"
          role="radio"
          :aria-checked="form.type === s.id"
          class="rounded-full border px-4 py-1.5 text-sm font-medium transition"
          :class="form.type === s.id ? 'border-brand-600 bg-brand-600 text-white' : 'border-sand-200 hover:border-brand-200'"
          @click="pickType(s.id)"
        >
          {{ m.services[s.id as keyof typeof m.services].label }}
        </button>
      </div>

      <div class="mt-5 space-y-3" role="radiogroup" aria-label="Helper">
        <button
          v-for="h in typeHelpers"
          :key="h.id"
          type="button"
          role="radio"
          :aria-checked="form.helperId === h.id"
          class="flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition"
          :class="form.helperId === h.id ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600' : 'border-sand-200 hover:border-brand-200'"
          @click="pickHelper(h.id)"
        >
          <HelperAvatar :name="h.name" />
          <span class="flex-1">
            <span class="block text-sm font-semibold">{{ h.name }}</span>
            <span class="block text-xs text-ink/60">{{ m.helpers[h.id]?.title ?? h.title }}</span>
          </span>
          <span class="text-xs text-ink/60">{{ h.availableSlotCount }} {{ m.common.slots }}</span>
        </button>
      </div>

      <template v-if="helper">
        <h2 class="mt-8 text-sm font-semibold">{{ m.konseling.method }}</h2>
        <div class="mt-2 flex flex-wrap gap-2" role="radiogroup" :aria-label="m.konseling.method">
          <button
            v-for="o in helper.options"
            :key="o.id"
            type="button"
            role="radio"
            :aria-checked="form.optionId === o.id"
            class="rounded-xl border px-4 py-2.5 text-left text-sm transition"
            :class="form.optionId === o.id ? 'border-brand-600 bg-brand-600 text-white' : 'border-sand-200 hover:border-brand-200'"
            @click="form.optionId = o.id"
          >
            <span class="block font-semibold">{{ o.label }}</span>
            <span class="text-xs opacity-80">{{ rupiah(o.price) }} / {{ o.durationMinutes }} {{ m.common.minutes }}</span>
          </button>
        </div>

        <h2 class="mt-8 text-sm font-semibold">{{ m.konseling.available }}</h2>
        <p v-if="!helper.schedules.length" class="mt-2 text-sm text-ink/60">{{ m.konseling.noSchedule }}</p>
        <div v-for="d in helper.schedules" :key="d.date" class="mt-4">
          <h3 class="font-sans text-xs font-medium text-ink/60">{{ date(d.date) }}</h3>
          <div class="mt-1.5 flex flex-wrap gap-2">
            <button
              v-for="s in d.slots"
              :key="s.id"
              type="button"
              :disabled="!s.available"
              :aria-pressed="form.slotId === s.id"
              class="rounded-full border px-3.5 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:text-ink/30 disabled:line-through"
              :class="form.slotId === s.id ? 'border-accent-500 bg-accent-500 text-white' : 'border-sand-200 enabled:hover:border-brand-500'"
              @click="form.slotId = s.id"
            >
              {{ s.time }}
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- 2. Formulir -->
    <div v-else-if="step === 2">
      <h1 class="text-2xl font-bold">{{ m.konseling.formTitle }}</h1>
      <p class="mb-6 mt-2 text-sm text-ink/70">{{ m.konseling.formLead }}</p>
      <PersonFields v-model="form.person" v-model:valid="personValid" />

      <fieldset class="mt-6">
        <legend class="label">{{ m.konseling.topicsLegend }}</legend>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="(t, i) in TOPICS"
            :key="t"
            class="cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500"
            :class="form.topics.includes(t) ? 'border-brand-600 bg-brand-600 text-white' : 'border-sand-200 hover:border-brand-200'"
          >
            <input v-model="form.topics" type="checkbox" :value="t" class="sr-only" />
            {{ m.konseling.topics[i] }}
          </label>
        </div>
      </fieldset>

      <label class="label mt-6" for="story">{{ m.konseling.story }}</label>
      <textarea
        id="story"
        v-model="form.story"
        class="field min-h-32"
        maxlength="2000"
        :placeholder="m.konseling.storyPlaceholder"
      />
      <p class="mt-1 text-xs" :class="form.story.trim().length < 20 ? 'text-ink/50' : 'text-brand-600'">
        {{ fmt(m.konseling.storyCount, { n: form.story.trim().length }) }}
      </p>

      <label class="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl bg-sand-50 p-4 text-sm">
        <input v-model="form.consent" type="checkbox" class="mt-0.5 h-4 w-4 accent-brand-600" />
        <span>{{ m.konseling.consent }}</span>
      </label>
    </div>

    <!-- 3. Ringkasan -->
    <div v-else>
      <h1 class="text-2xl font-bold">{{ m.konseling.summaryTitle }}</h1>
      <p class="mt-2 text-sm text-ink/70">{{ m.konseling.summaryLead }}</p>
      <dl class="mt-6 divide-y divide-sand-100 rounded-2xl border border-sand-200 text-sm">
        <div v-for="[k, v] in summary" :key="k" class="flex justify-between gap-6 px-5 py-3">
          <dt class="text-ink/60">{{ k }}</dt>
          <dd class="text-right font-medium">{{ v }}</dd>
        </div>
        <div class="flex justify-between gap-6 bg-brand-50 px-5 py-4">
          <dt class="font-semibold">{{ m.common.total }}</dt>
          <dd class="text-lg font-extrabold text-brand-700">{{ rupiah(option?.price ?? 0) }}</dd>
        </div>
      </dl>
    </div>
  </WizardShell>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
const { m, fmt, date, lang } = useLocale()
useHead({ title: () => m.value.konseling.pageTitle })

// Nilai topik disimpan dalam bahasa Indonesia (untuk email admin); labelnya dari kamus bahasa.
const TOPICS = ['Kecemasan', 'Stres', 'Keluarga', 'Pasangan', 'Pekerjaan / kuliah', 'Trauma', 'Pengembangan diri', 'Lainnya']

const route = useRoute()
const { data } = await useFetch('/api/services')
const { data: helpers, refresh } = await useFetch('/api/helpers')

const step = ref(1)
const busy = ref(false)
const error = ref('')
const personValid = ref(false)
const result = ref<{
  code: string
  total: number
  helperName: string
  date: string
  time: string
  method: string
  emailSent: boolean
} | null>(null)

const form = reactive({
  type: 'psikolog',
  helperId: '',
  optionId: '',
  slotId: '',
  person: emptyPerson(),
  topics: [] as string[],
  story: '',
  consent: false,
})

const typeHelpers = computed(() => helpers.value?.filter((h) => h.type === form.type) ?? [])
const helper = computed(() => helpers.value?.find((h) => h.id === form.helperId))
const option = computed(() => helper.value?.options.find((o) => o.id === form.optionId))
const slot = computed(() => {
  for (const d of helper.value?.schedules ?? []) {
    const s = d.slots.find((x) => x.id === form.slotId)
    if (s) return { date: d.date, ...s }
  }
})

function pickType(id: string) {
  if (form.type !== id) pickHelper('')
  form.type = id
}
function pickHelper(id: string) {
  form.helperId = id
  form.slotId = ''
  form.optionId = helpers.value?.find((h) => h.id === id)?.options[0]?.id ?? ''
}

// Prefill dari tautan (beranda: ?type=…, halaman jadwal: ?helper=…&slot=…)
const preset = helpers.value?.find((h) => h.id === route.query.helper)
if (preset) {
  form.type = preset.type
  pickHelper(preset.id)
  const wanted = String(route.query.slot ?? '')
  if (preset.schedules.some((d) => d.slots.some((s) => s.id === wanted && s.available))) form.slotId = wanted
} else if (data.value?.services.some((s) => s.id === route.query.type)) {
  form.type = String(route.query.type)
}

const canNext = computed(() => {
  switch (step.value) {
    case 1:
      return !!option.value && !!slot.value?.available
    case 2:
      return personValid.value && form.story.trim().length >= 20 && form.consent
    default:
      return true
  }
})

const summary = computed<[string, string][]>(() => {
  const k = m.value.konseling
  return [
    [k.rowService, m.value.services[form.type as keyof typeof m.value.services]?.label ?? '-'],
    [k.rowHelper, helper.value?.name ?? '-'],
    [k.rowSchedule, slot.value ? `${date(slot.value.date)}, ${slot.value.time} WIB` : '-'],
    [k.rowMethod, option.value ? `${option.value.label} · ${option.value.durationMinutes} ${m.value.common.minutes}` : '-'],
    [k.rowName, form.person.fullName],
    ['WhatsApp', form.person.whatsapp],
    ['Email', form.person.email],
    [k.rowTopics, form.topics.map((t) => k.topics[TOPICS.indexOf(t)] ?? t).join(', ') || '-'],
  ]
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
        slotId: form.slotId,
        optionId: form.optionId,
        person: form.person,
        topics: form.topics,
        story: form.story,
        consent: form.consent,
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
