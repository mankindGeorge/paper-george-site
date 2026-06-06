<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink">
    <div
      v-for="(item, i) in items"
      :key="i"
      class="bg-newsprint p-4"
      :class="item.span ? 'md:col-span-2' : ''"
    >
      <h3 class="font-headline text-lg font-bold border-b-2 border-ink pb-1 mb-2">{{ item.title }}</h3>
      <p class="text-sm leading-relaxed font-body">{{ item.content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: Array<{ title: string; content: string; span?: boolean }> }>()
</script>
