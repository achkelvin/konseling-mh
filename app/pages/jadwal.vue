<template>
  <div>
    <section class="bg-gradient-to-b from-brand-50 to-sand-50">
      <div class="container-page py-12">
        <h1 class="text-3xl font-extrabold tracking-tight text-brand-900">{{ m.jadwal.title }}</h1>
        <p class="mt-2 max-w-xl text-sm text-ink/70">{{ m.jadwal.lead }}</p>

        <div class="card mt-8 grid gap-4 sm:grid-cols-3">
          <div>
            <label class="label" for="f-type">{{ m.jadwal.type }}</label>
            <select id="f-type" v-model="type" class="field">
              <option value="">{{ m.jadwal.allTypes }}</option>
              <option v-for="(s, id) in m.services" :key="id" :value="id">{{ s.label }}</option>
            </select>
          </div>
          <div>
            <label class="label" for="f-gender">{{ m.jadwal.gender }}</label>
            <select id="f-gender" v-model="gender" class="field">
              <option value="">{{ m.jadwal.all }}</option>
              <option value="L">{{ m.jadwal.male }}</option>
              <option value="P">{{ m.jadwal.female }}</option>
            </select>
          </div>
          <div>
            <label class="label" for="f-q">{{ m.jadwal.search }}</label>
            <input id="f-q" v-model.trim="q" class="field" type="search" :placeholder="m.jadwal.searchPlaceholder" />
          </div>
        </div>
      </div>
    </section>

    <section class="container-page pb-20">
      <p v-if="!list.length" class="card text-center text-sm text-ink/60">{{ m.jadwal.empty }}</p>
      <div class="grid gap-6 lg:grid-cols-2">
        <article v-for="h in list" :key="h.id" class="card">
          <div class="flex gap-4">
            <HelperAvatar :name="h.name" />
            <div>
              <h2 class="font-semibold">{{ h.name }}</h2>
              <p class="text-sm text-brand-700">{{ m.helpers[h.id]?.title ?? h.title }}</p>
              <p v-if="h.license" class="text-xs text-ink/50">{{ h.license }}</p>
            </div>
          </div>
          <p class="mt-4 text-sm leading-relaxed text-ink/70">{{ m.helpers[h.id]?.description ?? h.description }}</p>

          <div v-for="d in visibleDays(h)" :key="d.date" class="mt-5">
            <h3 class="font-sans text-sm font-semibold">{{ date(d.date) }}</h3>
            <ul class="mt-2 flex flex-wrap gap-2">
              <li v-for="s in d.slots" :key="s.id">
                <NuxtLink
                  v-if="s.available"
                  :to="{ path: '/konseling', query: { helper: h.id, slot: s.id } }"
                  class="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-600 hover:text-white"
                  :aria-label="fmt(m.jadwal.pick, { date: date(d.date), time: s.time })"
                >
                  {{ s.time }} WIB
                </NuxtLink>
                <span
                  v-else
                  class="inline-flex rounded-full border border-sand-200 px-3 py-1.5 text-sm text-ink/35 line-through"
                  :title="m.jadwal.booked"
                >
                  {{ s.time }} WIB
                </span>
              </li>
            </ul>
          </div>

          <div class="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-sand-100 pt-4 text-xs text-ink/60">
            <span>{{ fmt(m.jadwal.available, { n: h.availableSlotCount }) }}</span>
            <button
              v-if="h.schedules.length > 3"
              class="font-semibold text-brand-600 hover:underline"
              @click="toggle(h.id)"
            >
              {{ expanded.has(h.id) ? m.jadwal.showLess : m.jadwal.showAll }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { m, fmt, date } = useLocale()
useHead({ title: () => m.value.jadwal.pageTitle })
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
