<template>
  <div
    class="group relative bg-newsprint border-2 border-ink p-4 cursor-pointer transition-all duration-200 ease-out"
    :style="{ transform: `rotate(${scrap.rotation}deg)` }"
    :class="[
      'hover:rotate-0 hover:-translate-y-1 hover:z-50 hover:shadow-hard',
    ]"
  >
    <div class="absolute inset-0 bg-newsprint opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    <div class="relative z-10">
      <h3 class="font-headline text-lg font-bold border-b border-ink/30 pb-1 mb-2">{{ scrap.title }}</h3>
      <p class="text-sm leading-relaxed font-body">{{ scrap.content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  scrap: { id: number; title: string; content: string; rotation: number }
}>()
</script>
