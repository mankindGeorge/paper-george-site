<template>
  <nav class="border-b-2 border-ink bg-newsprint sticky top-0 z-40">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
      <a href="#home" class="font-headline text-lg font-bold tracking-tight uppercase" @click.prevent="scrollTo('home')">M.G.C.</a>
      <div class="flex items-center gap-1 md:gap-4">
        <a
          v-for="link in links"
          :key="link.id"
          :href="`#${link.id}`"
          class="font-mono text-xs uppercase tracking-widest px-2 py-1 hover:bg-ink hover:text-newsprint transition-colors cursor-pointer"
          @click.prevent="scrollTo(link.id)"
        >{{ link.label }}</a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const links = [
  { id: 'home', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'projects', label: '作品集' },
  { id: 'experience', label: '履历' },
  { id: 'contact', label: '联络' },
]

const scrollTo = (id: string) => {
  const container = document.querySelector('.overflow-y-scroll')
  const target = document.getElementById(id)
  if (container && target) {
    const navHeight = 52 // sticky nav 高度
    container.scrollTo({
      top: (target as HTMLElement).offsetTop - navHeight,
      behavior: 'smooth',
    })
  }
}
</script>
