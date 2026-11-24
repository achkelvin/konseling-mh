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
      <input id="pf-wa" v-model.trim="person.whatsapp" class="field" inputmode="numeric" autocomplete="tel" required placeholder="081234567890" />
      <p v-if="person.whatsapp && !/^0\d{8,13}$/.test(person.whatsapp)" class="mt-1 text-xs text-red-600">
        {{ m.person.whatsappHint }}
      </p>
    </div>
    <div>
      <label class="label" for="pf-email">{{ m.person.email }} <Req /></label>
      <input id="pf-email" v-model.trim="person.email" class="field" type="email" autocomplete="email" required placeholder="nama@email.com" />
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
      <p class="mt-1 text-xs" :class="ageNote.error ? 'text-red-600' : 'text-ink/60'" aria-live="polite">{{ ageNote.text }}</p>
    </div>
    <div>
      <label class="label" for="pf-marital">{{ m.person.maritalStatus }} <Req /></label>
      <select id="pf-marital" v-model="person.maritalStatus" class="field" required>
        <option value="" disabled>{{ m.common.choose }}</option>
        <option v-for="o in MARITAL_STATUSES" :key="o" :value="o">{{ opt(o) }}</option>
      </select>
    </div>

    <div class="sm:col-span-2">
      <label class="label" for="pf-goal">{{ m.person.goal }} <Req /></label>
      <textarea id="pf-goal" v-model="person.goal" class="field min-h-24" maxlength="1000" required :placeholder="m.person.goalPh" />
    </div>
  </div>
</template>

<script setup lang="ts">
const person = defineModel<Person>({ required: true })
const valid = defineModel<boolean>('valid')
const { m, fmt, opt, lang } = useLocale()

const Req = () => h('span', { class: 'text-red-600', 'aria-hidden': 'true' }, '*')
const today = new Date().toISOString().slice(0, 10)

const ageNote = computed(() => {
  if (!person.value.birthDate) return { text: m.value.person.ageAuto, error: false }
  const age = ageFrom(person.value.birthDate)
  if (age === null) return { text: errorText('birthDate', lang.value), error: true }
  if (age < MIN_AGE) return { text: fmt(m.value.person.ageTooYoung, { n: age, min: MIN_AGE }), error: true }
  return { text: fmt(m.value.person.age, { n: age }), error: false }
})

watchEffect(() => {
  valid.value = personError(person.value) === null
})
</script>
