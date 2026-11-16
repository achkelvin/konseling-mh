<template>
  <div class="grid gap-5 sm:grid-cols-2">
    <div class="sm:col-span-2">
      <label class="label" for="pf-name">Nama lengkap / panggilan</label>
      <input id="pf-name" v-model.trim="person.name" class="field" autocomplete="name" placeholder="Nama kamu" />
    </div>
    <div>
      <label class="label" for="pf-wa">Nomor WhatsApp</label>
      <input
        id="pf-wa"
        v-model.trim="person.whatsapp"
        class="field"
        inputmode="numeric"
        autocomplete="tel"
        placeholder="081234567890"
      />
      <p v-if="person.whatsapp && !waValid" class="mt-1 text-xs text-red-600">
        Awali dengan 0, 9–14 digit angka.
      </p>
    </div>
    <div>
      <label class="label" for="pf-email">Email</label>
      <input
        id="pf-email"
        v-model.trim="person.email"
        class="field"
        type="email"
        autocomplete="email"
        placeholder="nama@email.com"
      />
      <p v-if="person.email && !emailValid" class="mt-1 text-xs text-red-600">Format email belum benar.</p>
    </div>
    <div>
      <label class="label" for="pf-age">Usia</label>
      <input id="pf-age" v-model.number="person.age" class="field" type="number" min="13" max="99" placeholder="25" />
    </div>
    <div>
      <label class="label" for="pf-gender">Jenis kelamin</label>
      <select id="pf-gender" v-model="person.gender" class="field">
        <option value="" disabled>Pilih</option>
        <option value="P">Perempuan</option>
        <option value="L">Laki-laki</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'

export interface Person {
  name: string
  whatsapp: string
  email: string
  age: number | null
  gender: '' | 'L' | 'P'
}
const person = defineModel<Person>({ required: true })
const valid = defineModel<boolean>('valid')

const waValid = computed(() => /^0\d{8,13}$/.test(person.value.whatsapp))
const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.value.email))
watchEffect(() => {
  const p = person.value
  valid.value =
    p.name.length >= 2 && waValid.value && emailValid.value && !!p.age && p.age >= 13 && p.gender !== ''
})
</script>
