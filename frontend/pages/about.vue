<template>
  <div class="bg-cardboard min-h-screen p-4 md:p-8">
    <h2 class="font-headline text-3xl md:text-4xl font-black text-center mb-8 border-b-4 border-double border-ink pb-4">
      THE EDITORIAL CLIPPINGS
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <ScrapCard v-for="scrap in scraps" :key="scrap.id" :scrap="scrap" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()
const { data: scraps } = await useAsyncData('scraps', () => get<any[]>('/api/scraps'))
</script>
