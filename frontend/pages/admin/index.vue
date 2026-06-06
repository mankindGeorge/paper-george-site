<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <h2 class="font-headline text-2xl text-stamp border-b-2 border-stamp pb-2">CONTROL DESK — OVERVIEW</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="link in adminLinks"
          :key="link.to"
          :to="link.to"
          class="border-2 border-stamp p-4 hover:bg-stamp/20 transition-colors"
        >
          <h3 class="font-headline text-lg text-stamp">{{ link.title }}</h3>
          <p class="font-mono text-xs text-newsprint/60 mt-1">{{ link.desc }}</p>
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const adminLinks = [
  { to: '/admin/experiences', title: 'EXPERIENCES', desc: 'Milestone Chronicle entries' },
  { to: '/admin/projects', title: 'PROJECTS', desc: 'Classified Ads portfolio' },
  { to: '/admin/scraps', title: 'SCRAPS', desc: 'Editorial Clippings' },
  { to: '/admin/messages', title: 'MESSAGES', desc: 'Letters to the Editor' },
]
</script>
