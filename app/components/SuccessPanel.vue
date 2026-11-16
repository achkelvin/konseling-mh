<template>
  <div class="mx-auto flex max-w-md flex-col items-center py-10 text-center">
    <span class="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl text-brand-600">✓</span>
    <h1 class="mt-5 text-2xl font-bold">Pendaftaran diterima</h1>
    <p class="mt-2 text-sm text-ink/70">
      Simpan kode pendaftaranmu. Admin akan menghubungi lewat WhatsApp untuk konfirmasi dan
      instruksi pembayaran.
    </p>
    <p class="mt-6 rounded-2xl border border-dashed border-brand-200 bg-brand-50 px-8 py-4 font-mono text-2xl font-bold tracking-widest text-brand-700">
      {{ code }}
    </p>
    <dl class="mt-6 w-full space-y-2 text-left text-sm">
      <div v-for="[k, v] in rows" :key="k" class="flex justify-between gap-4 border-b border-sand-100 pb-2">
        <dt class="text-ink/60">{{ k }}</dt>
        <dd class="text-right font-medium">{{ v }}</dd>
      </div>
    </dl>
    <NuxtLink to="/" class="btn-secondary mt-8">Kembali ke beranda</NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{ code: string; rows: [string, string][] }>()
</script>
