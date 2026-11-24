<template>
  <div class="grid gap-5 sm:grid-cols-2">
    <div>
      <label class="label" for="pf-fullname">{{ m.person.fullName }} <Req /></label>
      <input id="pf-fullname" v-model="person.fullName" class="field" autocomplete="name" required :placeholder="m.person.fullNamePh" />
    </div>
    <div>
      <label class="label" for="pf-nick">
        {{ m.person.nickname }} <span class="font-normal text-ink/50">({{ m.common.optional }})</span>
      </label>
      <input id="pf-nick" v-model="person.nickname" class="field" autocomplete="nickname" :placeholder="m.person.nicknamePh" />
    </div>

    <div>
      <label class="label" for="pf-wa">{{ m.person.whatsapp }} <Req /></label>
      <input id="pf-wa" v-model.trim="person.whatsapp" class="field" inputmode="tel" autocomplete="tel" required placeholder="081234567890" />
      <p class="mt-1 text-xs" :class="person.whatsapp && !waOk ? 'text-red-700' : 'text-ink/55'">{{ m.person.whatsappHint }}</p>
    </div>
    <div>
      <label class="label" for="pf-email">{{ m.person.email }} <Req /></label>
      <input id="pf-email" v-model.trim="person.email" class="field" type="email" autocomplete="email" required placeholder="nama@email.com" />
    </div>

    <div>
      <label class="label" for="pf-city">{{ m.person.city }} <Req /></label>
      <input id="pf-city" v-model="person.city" class="field" autocomplete="address-level2" required placeholder="Jakarta, Istanbul, Leiden…" />
    </div>
    <div>
      <label class="label" for="pf-country">{{ m.person.country }} <Req /></label>
      <input id="pf-country" v-model="person.country" class="field" autocomplete="country-name" required />
    </div>

    <div>
      <label class="label" for="pf-gender">{{ m.person.gender }} <Req /></label>
      <select id="pf-gender" v-model="person.gender" class="field" required>
        <option value="" disabled>{{ m.common.choose }}</option>
        <option v-for="o in GENDERS" :key="o" :value="o">{{ opt(o) }}</option>
      </select>
    </div>
    <div>
      <label class="label" for="pf-religion">{{ m.person.religion }} <Req /></label>
      <select id="pf-religion" v-model="person.religion" class="field" required>
        <option value="" disabled>{{ m.common.choose }}</option>
        <option v-for="o in RELIGIONS" :key="o" :value="o">{{ opt(o) }}</option>
      </select>
    </div>

    <div>
      <label class="label" for="pf-edu">{{ m.person.education }} <Req /></label>
      <select id="pf-edu" v-model="person.education" class="field" required>
        <option value="" disabled>{{ m.common.choose }}</option>
        <option v-for="o in EDUCATIONS" :key="o" :value="o">{{ opt(o) }}</option>
      </select>
    </div>
    <div>
      <label class="label" for="pf-job">{{ m.person.occupation }} <Req /></label>
      <input id="pf-job" v-model="person.occupation" class="field" autocomplete="organization-title" required :placeholder="m.person.occupationPh" />
    </div>

    <div>
      <label class="label" for="pf-birth">{{ m.person.birthDate }} <Req /></label>
      <input id="pf-birth" v-model="person.birthDate" class="field" type="date" :max="today" :lang="lang" required autocomplete="bday" />
      <p class="mt-1 text-xs" :class="ageNote.warn ? 'font-medium text-accent-700' : 'text-ink/60'" aria-live="polite">{{ ageNote.text }}</p>
    </div>
    <div>
      <label class="label" for="pf-marital">{{ m.person.maritalStatus }} <Req /></label>
      <select id="pf-marital" v-model="person.maritalStatus" class="field" required>
        <option value="" disabled>{{ m.common.choose }}</option>
        <option v-for="o in MARITAL_STATUSES" :key="o" :value="o">{{ opt(o) }}</option>
      </select>
    </div>

    <!-- Klien di bawah 18 tahun: didaftarkan orang tua/wali -->
    <fieldset v-if="minor" class="grid gap-5 rounded-xl border border-accent-600/30 bg-accent-50 p-4 sm:col-span-2 sm:grid-cols-2">
      <legend class="px-1 text-sm font-semibold text-accent-700">{{ m.person.guardianTitle }}</legend>
      <div>
        <label class="label" for="pf-gname">{{ m.person.guardianName }} <Req /></label>
        <input id="pf-gname" v-model="person.guardianName" class="field" required />
      </div>
      <div>
        <label class="label" for="pf-gcontact">{{ m.person.guardianContact }} <Req /></label>
        <input id="pf-gcontact" v-model="person.guardianContact" class="field" required />
      </div>
    </fieldset>

    <fieldset>
      <legend class="label">{{ m.person.counseledBefore }} <Req /></legend>
      <div class="flex gap-2">
        <label
          v-for="o in COUNSELED_OPTIONS"
          :key="o"
          class="flex-1 cursor-pointer rounded-lg border px-4 py-3 text-center text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-500"
          :class="person.counseledBefore === o ? 'border-brand-700 bg-brand-700 text-sand-50' : 'border-sand-300 bg-white hover:border-brand-300'"
        >
          <input v-model="person.counseledBefore" type="radio" :value="o" class="sr-only" />
          {{ opt(o) }}
        </label>
      </div>
    </fieldset>
    <div>
      <label class="label" for="pf-discount">{{ m.person.discount }}</label>
      <select id="pf-discount" v-model="person.discount" class="field">
        <option v-for="d in DISCOUNT_OPTIONS" :key="d" :value="d" :disabled="d === 'student' && minor">
          {{ m.person.discountNames[d] }}
        </option>
      </select>
      <p class="mt-1 text-xs text-ink/55">{{ m.person.discountHint }}</p>
    </div>

    <div class="sm:col-span-2">
      <label class="label" for="pf-goal">{{ m.person.goal }} <Req /></label>
      <textarea id="pf-goal" v-model="person.goal" class="field min-h-20" maxlength="300" required :placeholder="m.person.goalPh" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ serviceId?: string }>()
const person = defineModel<Person>({ required: true })
const valid = defineModel<boolean>('valid')
const { m, fmt, opt, lang } = useLocale()

const Req = () => h('span', { class: 'text-accent-600', 'aria-hidden': 'true' }, '*')
const today = new Date().toISOString().slice(0, 10)

const waOk = computed(() => WA_PATTERN.test(person.value.whatsapp.replace(/[\s-]/g, '')))
const minor = computed(() => isMinor(person.value.birthDate))

// diskon pelajar tidak berlaku untuk klien di bawah 18 tahun
watch(minor, (isKid) => {
  if (isKid && person.value.discount === 'student') person.value.discount = 'none'
})

const ageNote = computed(() => {
  if (!person.value.birthDate) return { text: m.value.person.ageAuto, warn: false }
  const age = ageFrom(person.value.birthDate)
  if (age === null) return { text: errorText('birthDate', lang.value), warn: true }
  if (age < ADULT_AGE) return { text: fmt(m.value.person.minorNote, { n: age }), warn: true }
  return { text: fmt(m.value.person.age, { n: age }), warn: false }
})

watchEffect(() => {
  valid.value = personError(person.value) === null
})
</script>
