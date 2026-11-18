<template>
  <div>
    <section class="bg-gradient-to-b from-brand-50 to-sand-50">
      <div class="container-page py-12">
        <h1 class="text-3xl font-extrabold tracking-tight text-brand-900">Jadwal Helper</h1>
        <p class="mt-2 max-w-xl text-sm text-ink/70">
          Lihat jadwal yang masih kosong, lalu klik jam yang cocok untuk langsung mendaftar.
        </p>

        <div class="card mt-8 grid gap-4 sm:grid-cols-3">
          <div>
            <label class="label" for="f-type">Jenis helper</label>
            <select id="f-type" v-model="type" class="field">
              <option value="">Semua jenis helper</option>
              <option v-for="(label, id) in typeLabel" :key="id" :value="id">{{ label }}</option>
            </select>
          </div>
          <div>
            <label class="label" for="f-gender">Jenis kelamin</label>
            <select id="f-gender" v-model="gender" class="field">
              <option value="">Semua</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div>
            <label class="label" for="f-q">Cari</label>
            <input id="f-q" v-model.trim="q" class="field" type="search" placeholder="Cari helper…" />
          </div>
        </div>
      </div>
    </section>

    <section class="container-page pb-20">
      <p v-if="!list.length" class="card text-center text-sm text-ink/60">
        Tidak ada helper yang cocok dengan filter ini.
      </p>
      <div class="grid gap-6 lg:grid-cols-2">
        <article v-for="h in list" :key="h.id" class="card">
          <div class="flex gap-4">
            <HelperAvatar :name="h.name" />
            <div>
              <h2 class="font-semibold">{{ h.name }}</h2>
              <p class="text-sm text-brand-700">{{ h.title }}</p>
              <p v-if="h.license" class="text-xs text-ink/50">{{ h.license }}</p>
            </div>
          </div>
          <p class="mt-4 text-sm leading-relaxed text-ink/70">{{ h.description }}</p>

          <div v-for="d in visibleDays(h)" :key="d.date" class="mt-5">
            <h3 class="text-sm font-semibold">{{ tanggal(d.date) }}</h3>
            <ul class="mt-2 flex flex-wrap gap-2">
              <li v-for="s in d.slots" :key="s.id">
                <NuxtLink
                  v-if="s.available"
                  :to="{ path: '/konseling', query: { helper: h.id, slot: s.id } }"
                  class="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-600 hover:text-white"
                  :aria-label="`Pilih jadwal ${tanggal(d.date)} pukul ${s.time} WIB`"
                >
                  {{ s.time }} WIB
                </NuxtLink>
                <span
                  v-else
                  class="inline-flex rounded-full border border-sand-200 px-3 py-1.5 text-sm text-ink/35 line-through"
                  title="Sudah dipesan"
                >
                  {{ s.time }} WIB
                </span>
              </li>
            </ul>
          </div>

          <div class="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-sand-100 pt-4 text-xs text-ink/60">
            <span>{{ h.availableSlotCount }} jadwal tersedia dalam 2 minggu ke depan</span>
            <button
              v-if="h.schedules.length > 3"
              class="font-semibold text-brand-600 hover:underline"
              @click="toggle(h.id)"
            >
              {{ expanded.has(h.id) ? 'Tampilkan lebih sedikit' : 'Lihat semua jadwal' }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Jadwal Helper — KonselingMH' })
const { data: helpers } = await useFetch('/api/helpers')

const gender = ref('')
const type = ref('')
const q = ref('')
const expanded = ref(new Set<string>())

const list = computed(() =>
  (helpers.value ?? []).filter(
    (h) =>
      (!gender.value || h.gender === gender.value) &&
      (!type.value || h.type === type.value) &&
      (!q.value || h.name.toLowerCase().includes(q.value.toLowerCase())),
  ),
)

type H = NonNullable<typeof helpers.value>[number]
const visibleDays = (h: H) => (expanded.value.has(h.id) ? h.schedules : h.schedules.slice(0, 3))
function toggle(id: string) {
  const next = new Set(expanded.value)
  next.has(id) ? next.delete(id) : next.add(id)
  expanded.value = next
}
</script>
