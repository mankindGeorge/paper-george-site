<template>
  <div class="p-4 md:p-8">
    <h2 class="font-headline text-3xl md:text-4xl font-black text-center mb-2 border-b-4 border-double border-ink pb-4">
      THE CLASSIFIED ADS
    </h2>
    <p class="text-center font-mono text-xs text-ink/60 mb-8 uppercase tracking-widest">PROJECT PORTFOLIO &amp; TECHNICAL INDEX</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink max-w-5xl mx-auto">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()
const { data: projects } = await useAsyncData('projects', () => get<any[]>('/api/projects'))
</script>
