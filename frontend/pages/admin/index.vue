<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <h2 class="font-headline text-2xl text-stamp border-b-2 border-stamp pb-2">控制台 — 概览</h2>
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
  { to: '/admin/experiences', title: '经历管理', desc: '里程碑编年史条目' },
  { to: '/admin/projects', title: '项目管理', desc: '分类广告作品集' },
  { to: '/admin/scraps', title: '剪报管理', desc: '编辑剪报' },
  { to: '/admin/messages', title: '留言管理', desc: '致编辑的信' },
]
</script>
