<template>
  <section class="container-page grid gap-12 py-14 md:grid-cols-[0.9fr_1.1fr] md:py-20">
    <div>
      <p class="eyebrow">{{ m.testi.eyebrow }}</p>
      <h1 class="mt-3 text-4xl font-medium tracking-tight text-brand-700 sm:text-5xl">{{ m.testi.title }}</h1>
      <p class="mt-5 max-w-md text-lg leading-relaxed text-ink/75">{{ m.testi.lead }}</p>
      <ul class="mt-8 space-y-3">
        <li v-for="n in m.testi.notes" :key="n" class="flex gap-3 text-sm leading-relaxed text-ink/75">
          <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-600" aria-hidden="true" />
          {{ n }}
        </li>
      </ul>
    </div>

    <div class="card self-start sm:p-8">
      <div v-if="sent" class="py-6 text-center">
        <h2 class="font-display text-2xl font-medium text-brand-700">{{ m.testi.thanksTitle }}</h2>
        <p class="mt-3 text-ink/75">{{ m.testi.thanksText }}</p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/" class="btn-primary">{{ m.common.backHome }}</NuxtLink>
          <button type="button" class="btn-ghost" @click="reset">{{ m.testi.again }}</button>
        </div>
      </div>

      <form v-else class="space-y-5" @submit.prevent="submit">
        <div>
          <label class="label" for="t-quote">{{ m.testi.quote }}</label>
          <textarea id="t-quote" v-model="form.quote" class="field min-h-36" minlength="20" maxlength="600" required :placeholder="m.testi.quotePh" />
          <p class="mt-1 text-right text-xs text-ink/50">{{ form.quote.length }}/600</p>
        </div>
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="label" for="t-name">{{ m.testi.name }} <span class="font-normal text-ink/50">({{ m.common.optional }})</span></label>
            <input id="t-name" v-model="form.name" class="field" maxlength="40" :placeholder="m.testi.namePh" />
          </div>
          <div>
            <label class="label" for="t-service">{{ m.testi.service }} <span class="font-normal text-ink/50">({{ m.common.optional }})</span></label>
            <select id="t-service" v-model="form.service" class="field">
              <option value="">{{ m.testi.servicePh }}</option>
              <option v-for="s in services" :key="s.id" :value="s.id">{{ m.services[s.id].name }}</option>
            </select>
          </div>
        </div>
        <div>
          <label class="label" for="t-email">{{ m.testi.email }} <span class="font-normal text-ink/50">({{ m.common.optional }})</span></label>
          <input id="t-email" v-model="form.email" type="email" class="field" maxlength="120" autocomplete="email" />
        </div>
        <!-- jebakan bot, disembunyikan dari pengguna -->
        <input v-model="form.website" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <label class="flex items-start gap-3 text-sm leading-relaxed text-ink/80">
          <input v-model="form.consent" type="checkbox" class="mt-1 h-4 w-4 shrink-0 accent-brand-700" required />
          {{ m.testi.consent }}
        </label>
        <p v-if="error" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{{ error }}</p>
        <button type="submit" class="btn-primary w-full" :disabled="busy">
          {{ busy ? m.common.processing : m.testi.submit }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
const { m, lang } = useLocale()
useHead({ title: () => m.value.testi.pageTitle })

const services = visibleServices()
const blank = () => ({ quote: '', name: '', service: '', email: '', consent: false, website: '' })
const form = reactive(blank())
const busy = ref(false)
const sent = ref(false)
const error = ref('')

async function submit() {
  busy.value = true
  error.value = ''
  try {
    await $fetch('/api/testimonials', { method: 'POST', body: { ...form, lang: lang.value } })
    sent.value = true
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.statusMessage || m.value.testi.failed
  } finally {
    busy.value = false
  }
}

function reset() {
  Object.assign(form, blank())
  sent.value = false
}
</script>
