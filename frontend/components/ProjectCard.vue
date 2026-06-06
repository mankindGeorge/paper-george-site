<template>
  <div class="border border-ink bg-newsprint">
    <div class="p-4">
      <h3 class="font-headline text-xl font-bold border-b-2 border-ink pb-2 mb-2">{{ project.title }}</h3>
      <p class="text-sm leading-relaxed font-body mb-3">{{ project.description }}</p>
      <a
        v-if="project.url"
        :href="project.url"
        target="_blank"
        class="font-mono text-xs text-stamp underline"
      >VIEW PROJECT &rarr;</a>
    </div>
    <PerforatedLine :tags="project.tags" />
    <div
      v-if="expanded"
      class="border-t-2 border-ink p-4 bg-cardboard animate-spring-open overflow-hidden"
    >
      <p class="font-mono text-xs text-ink/70 mb-2">PROJECT DETAILS</p>
      <p class="text-sm font-body">{{ project.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  project: { id: number; title: string; description: string; tags: string[]; url?: string }
}>()

const expanded = ref(false)
</script>
