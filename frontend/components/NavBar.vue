<template>
  <nav class="border-b-2 border-ink bg-newsprint sticky top-0 z-40">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
      <NuxtLink to="/" class="font-headline text-lg font-bold tracking-tight uppercase">M.G.C.</NuxtLink>
      <div class="flex items-center gap-1 md:gap-4">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="font-mono text-xs uppercase tracking-widest px-2 py-1 hover:bg-ink hover:text-newsprint transition-colors"
          active-class="bg-ink text-newsprint"
        >{{ link.label }}</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const links = [
  { to: '/', label: 'Front' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Chronicle' },
  { to: '/contact', label: 'Contact' },
]
</script>
