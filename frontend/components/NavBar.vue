<template>
  <nav class="border-b-2 border-ink bg-newsprint sticky top-0 z-40" role="navigation" aria-label="主导航">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
      <a href="#home" class="font-headline text-lg font-bold tracking-tight uppercase" @click.prevent="scrollTo('home')">M.G.C.</a>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-1 md:gap-4">
        <a
          v-for="link in links"
          :key="link.id"
          :href="`#${link.id}`"
          class="font-mono text-xs uppercase tracking-widest px-2 py-1 hover:bg-ink hover:text-newsprint transition-colors cursor-pointer"
          role="link"
          @click.prevent="scrollTo(link.id)"
        >{{ link.label }}</a>
      </div>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden flex flex-col gap-1 p-2"
        aria-label="打开导航菜单"
        :aria-expanded="mobileOpen ? 'true' : 'false'"
        @click="mobileOpen = !mobileOpen"
      >
        <span class="block w-5 h-0.5 bg-ink transition-transform" :class="mobileOpen ? 'rotate-45 translate-y-1.5' : ''" />
        <span class="block w-5 h-0.5 bg-ink transition-opacity" :class="mobileOpen ? 'opacity-0' : ''" />
        <span class="block w-5 h-0.5 bg-ink transition-transform" :class="mobileOpen ? '-rotate-45 -translate-y-1.5' : ''" />
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="md:hidden border-t-2 border-ink bg-newsprint">
      <a
        v-for="link in links"
        :key="link.id"
        :href="`#${link.id}`"
        class="block font-mono text-xs uppercase tracking-widest px-4 py-3 hover:bg-ink hover:text-newsprint transition-colors"
        @click.prevent="mobileOpen = false; $nextTick(() => scrollTo(link.id))"
      >{{ link.label }}</a>
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

const mobileOpen = ref(false)

const scrollTo = (id: string) => {
  const container = document.querySelector('.overflow-y-scroll')
  const target = document.getElementById(id)
  if (container && target) {
    const navHeight = 60
    const targetTop = (target as HTMLElement).offsetTop - navHeight
    const start = container.scrollTop
    const dist = targetTop - start
    if (Math.abs(dist) < 1) return
    const duration = 600
    const startTime = performance.now()
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      container.scrollTop = start + dist * easeOutCubic(progress)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
}
</script>
