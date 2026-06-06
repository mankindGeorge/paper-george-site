<template>
  <div class="min-h-screen bg-newsprint flex items-center justify-center p-8">
    <div class="text-center max-w-md">
      <h1 class="font-headline text-6xl font-black text-stamp mb-4">{{ error?.statusCode || 500 }}</h1>
      <p class="font-headline text-xl mb-2">{{ error?.statusCode === 404 ? '页面未找到' : '服务器错误' }}</p>
      <p class="font-mono text-sm text-ink/60 mb-8">{{ error?.message || '发生了一个意外错误' }}</p>
      <button
        class="border-2 border-ink bg-ink text-newsprint px-6 py-2 font-mono text-sm uppercase tracking-widest hover:bg-stamp hover:border-stamp transition-colors"
        @click="handleError"
      >返回首页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const handleError = () => clearError({ redirect: '/' })
</script>
