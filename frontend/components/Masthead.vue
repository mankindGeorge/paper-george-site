<template>
  <div class="border-b-4 border-double border-ink pt-8 pb-4 text-center animate-unfold">
    <h1 class="font-headline text-5xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-none">
      THE MANKIND GEORGE CHRONICLE
    </h1>
    <div class="mt-4 flex items-center justify-center gap-4 border-y-2 border-ink py-2">
      <span class="font-mono text-sm uppercase tracking-widest">{{ currentDate }}</span>
      <span class="text-ink">|</span>
      <span class="font-mono text-sm uppercase tracking-widest">SYSTEM STATUS: OPERATIONAL</span>
      <span class="text-ink">|</span>
      <span class="font-mono text-sm uppercase tracking-widest">VOL. I, NO. 1</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
</script>
