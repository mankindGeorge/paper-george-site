<template>
  <div>
    <Masthead />
    <div class="p-4 md:p-8">
      <NewsGrid :items="gridItems" />
    </div>
    <TornEdge variant="bottom" color="#DCD7C9" svgClass="h-12" />
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()

const [projects, scraps] = await Promise.all([
  get<any[]>('/api/projects'),
  get<any[]>('/api/scraps'),
])

const gridItems = computed(() => {
  const items = []
  if (projects.length > 0) {
    items.push({ title: projects[0].title, content: projects[0].description, span: true })
  }
  scraps.slice(0, 3).forEach((s: any) => {
    items.push({ title: s.title, content: s.content })
  })
  projects.slice(1, 4).forEach((p: any) => {
    items.push({ title: p.title, content: p.description })
  })
  return items
})
</script>
