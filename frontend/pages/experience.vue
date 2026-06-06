<template>
  <div class="p-4 md:p-8">
    <h2 class="font-headline text-3xl md:text-4xl font-black text-center mb-2 border-b-4 border-double border-ink pb-4">
      THE MILESTONE CHRONICLE
    </h2>
    <p class="text-center font-mono text-xs text-ink/60 mb-8 uppercase tracking-widest">HISTORICAL DOCUMENTATION SPECIAL EDITION</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      <div v-for="col in columns" :key="col.type">
        <h3 class="font-headline text-xl font-bold border-b-2 border-ink pb-2 mb-4 text-center uppercase">
          {{ col.label }}
        </h3>
        <ExperienceCard
          v-for="exp in byColumn(col.type)"
          :key="exp.id"
          :experience="exp"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()
const { data: experiences } = await useAsyncData('experiences', () => get<any[]>('/api/experiences'))

const columns = [
  { type: 'early', label: 'Early Inquiry & Academic Record' },
  { type: 'engineering', label: 'Engineering Practice & Deep Research' },
  { type: 'open-source', label: 'Open Source Manifesto & Infrastructure Chronicle' },
]

const byColumn = (type: string) => (experiences.value || []).filter((e: any) => e.columnType === type)
</script>
