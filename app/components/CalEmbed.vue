<template>
  <div>
    <p v-if="state === 'loading'" class="py-10 text-center text-sm text-ink/60">{{ loadingText }}</p>
    <p v-else-if="state === 'failed'" class="rounded-lg bg-accent-50 px-4 py-3 text-sm text-accent-700">
      {{ failedText }}
    </p>
    <!-- kalender Cal.com dimuat di sini -->
    <div :id="elId" class="min-h-[28rem] overflow-hidden rounded-xl" />
  </div>
</template>

<script setup lang="ts">
/**
 * Kalender Cal.com (inline embed) untuk memilih jadwal.
 * Dokumentasi: https://cal.com/docs/developing/guides/embeds/embed-events
 * Saat booking selesai, Cal.com mengirim event "bookingSuccessfulV2" dengan
 * { uid, startTime, endTime, status, paymentRequired, ... } — diteruskan lewat emit('booked').
 */
export interface CalBooking {
  uid: string
  startTime: string
  endTime?: string
  status?: string
  paymentRequired?: boolean
}

const props = defineProps<{
  calLink: string
  name?: string
  email?: string
  notes?: string
  lang?: string
  loadingText: string
  failedText: string
}>()
const emit = defineEmits<{ booked: [booking: CalBooking] }>()

const ns = 'renajiwa'
const elId = `cal-inline-${useId()}`
const state = ref<'loading' | 'ready' | 'failed'>('loading')
let done = false

declare global {
  interface Window {
    Cal?: any
  }
}

/** Loader resmi Cal.com: membuat antrean window.Cal lalu memuat embed.js. */
function loadCal(origin: string) {
  ;(function (C: any, A: string, L: string) {
    const p = (a: any, ar: any) => a.q.push(ar)
    const d = C.document
    C.Cal =
      C.Cal ||
      function (...ar: any[]) {
        const cal = C.Cal
        if (!cal.loaded) {
          cal.ns = {}
          cal.q = cal.q || []
          d.head.appendChild(d.createElement('script')).src = A
          cal.loaded = true
        }
        if (ar[0] === L) {
          const api: any = function (...a: any[]) {
            p(api, a)
          }
          const namespace = ar[1]
          api.q = api.q || []
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api
            p(cal.ns[namespace], ar)
            p(cal, ['initNamespace', namespace])
          } else p(cal, ar)
          return
        }
        p(cal, ar)
      }
  })(window, `${origin}/embed/embed.js`, 'init')
}

function onBooked(e: any) {
  if (done) return
  const data = e?.detail?.data ?? {}
  // V2: { uid, startTime, ... }; versi lama: { booking: { uid, startTime }, date }
  const uid = data.uid ?? data.booking?.uid
  const startTime = data.startTime ?? data.booking?.startTime ?? data.date
  if (!uid || !startTime) return
  done = true
  emit('booked', {
    uid,
    startTime,
    endTime: data.endTime ?? data.booking?.endTime,
    status: data.status ?? data.booking?.status,
    paymentRequired: data.paymentRequired,
  })
}

onMounted(() => {
  loadCal(SITE.cal.origin)
  const Cal = window.Cal
  Cal('init', ns, { origin: SITE.cal.origin })
  const api = Cal.ns[ns]
  api('inline', {
    elementOrSelector: `#${elId}`,
    calLink: props.calLink,
    config: {
      layout: 'month_view',
      name: props.name ?? '',
      email: props.email ?? '',
      notes: props.notes ?? '',
      ...(props.lang ? { 'metadata[lang]': props.lang } : {}),
    },
  })
  api('ui', { theme: 'light', cssVarsPerTheme: { light: { 'cal-brand': '#384538' } }, hideEventTypeDetails: false })
  api('on', { action: 'linkReady', callback: () => (state.value = 'ready') })
  api('on', { action: 'linkFailed', callback: () => (state.value = 'failed') })
  api('on', { action: 'bookingSuccessfulV2', callback: onBooked })
  api('on', { action: 'bookingSuccessful', callback: onBooked })
  // bila embed.js tidak termuat (diblokir/terputus) dalam 15 detik
  setTimeout(() => {
    if (state.value === 'loading') state.value = 'failed'
  }, 15000)
})
</script>
