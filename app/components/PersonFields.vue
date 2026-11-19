<template>
  <div class="grid gap-5 sm:grid-cols-2">
    <div>
      <label class="label" for="pf-fullname">Nama lengkap <Req /></label>
      <input id="pf-fullname" v-model="person.fullName" class="field" autocomplete="name" required placeholder="Sesuai identitas" />
    </div>
    <div>
      <label class="label" for="pf-nick">Nama panggilan <span class="font-normal text-ink/50">(opsional)</span></label>
      <input id="pf-nick" v-model="person.nickname" class="field" autocomplete="nickname" placeholder="Biar kami menyapa dengan nyaman" />
    </div>

    <div>
      <label class="label" for="pf-wa">Nomor WhatsApp <Req /></label>
      <input id="pf-wa" v-model.trim="person.whatsapp" class="field" inputmode="numeric" autocomplete="tel" required placeholder="081234567890" />
      <p v-if="person.whatsapp && !/^0\d{8,13}$/.test(person.whatsapp)" class="mt-1 text-xs text-red-600">
        Awali dengan 0, 9–14 digit angka.
      </p>
    </div>
    <div>
      <label class="label" for="pf-email">Email <Req /></label>
      <input id="pf-email" v-model.trim="person.email" class="field" type="email" autocomplete="email" required placeholder="nama@email.com" />
    </div>

    <div>
      <label class="label" for="pf-gender">Jenis kelamin <Req /></label>
      <select id="pf-gender" v-model="person.gender" class="field" required>
        <option value="" disabled>Pilih</option>
        <option v-for="o in GENDERS" :key="o">{{ o }}</option>
      </select>
    </div>
    <div>
      <label class="label" for="pf-religion">Agama <Req /></label>
      <select id="pf-religion" v-model="person.religion" class="field" required>
        <option value="" disabled>Pilih</option>
        <option v-for="o in RELIGIONS" :key="o">{{ o }}</option>
      </select>
    </div>

    <div>
      <label class="label" for="pf-edu">Pendidikan terakhir <Req /></label>
      <select id="pf-edu" v-model="person.education" class="field" required>
        <option value="" disabled>Pilih</option>
        <option v-for="o in EDUCATIONS" :key="o">{{ o }}</option>
      </select>
    </div>
    <div>
      <label class="label" for="pf-job">Pekerjaan <Req /></label>
      <input id="pf-job" v-model="person.occupation" class="field" autocomplete="organization-title" required placeholder="Mahasiswa, karyawan, ibu rumah tangga…" />
    </div>

    <div>
      <label class="label" for="pf-birth">Tanggal lahir <Req /></label>
      <input id="pf-birth" v-model="person.birthDate" class="field" type="date" :max="today" required autocomplete="bday" />
      <p class="mt-1 text-xs" :class="ageNote.error ? 'text-red-600' : 'text-ink/60'" aria-live="polite">{{ ageNote.text }}</p>
    </div>
    <div>
      <label class="label" for="pf-marital">Status pernikahan <Req /></label>
      <select id="pf-marital" v-model="person.maritalStatus" class="field" required>
        <option value="" disabled>Pilih</option>
        <option v-for="o in MARITAL_STATUSES" :key="o">{{ o }}</option>
      </select>
    </div>

    <div class="sm:col-span-2">
      <label class="label" for="pf-goal">Tujuan yang ingin dicapai melalui konseling <Req /></label>
      <textarea
        id="pf-goal"
        v-model="person.goal"
        class="field min-h-24"
        maxlength="1000"
        required
        placeholder="Contoh: lebih tenang menghadapi pekerjaan, memperbaiki komunikasi dengan pasangan…"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const person = defineModel<Person>({ required: true })
const valid = defineModel<boolean>('valid')

const Req = () => h('span', { class: 'text-red-600', 'aria-hidden': 'true' }, '*')
const today = new Date().toISOString().slice(0, 10)

const ageNote = computed(() => {
  if (!person.value.birthDate) return { text: 'Usia dihitung otomatis.', error: false }
  const age = ageFrom(person.value.birthDate)
  if (age === null) return { text: 'Tanggal lahir tidak valid.', error: true }
  if (age < MIN_AGE) return { text: `Usia ${age} tahun — minimal ${MIN_AGE} tahun.`, error: true }
  return { text: `Usia: ${age} tahun`, error: false }
})

watchEffect(() => {
  valid.value = personError(person.value) === null
})
</script>
