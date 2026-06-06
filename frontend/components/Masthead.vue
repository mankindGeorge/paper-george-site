<template>
  <div class="border-b-4 border-double border-ink pt-8 pb-4 text-center">
    <!-- 标题逐字墨迹印刷 -->
    <h1 class="font-headline text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-none whitespace-nowrap">
      <span
        v-for="(char, i) in titleChars"
        :key="i"
        class="inline-block opacity-0"
        :class="char === ' ' ? 'w-4' : 'animate-ink-print'"
        :style="{ animationDelay: `${i * 40}ms` }"
      >{{ char === ' ' ? '\u00A0' : char }}</span>
    </h1>

    <!-- 元数据栏从右侧滑入 -->
    <div
      class="mt-4 flex items-center justify-center gap-4 border-y-2 border-ink py-2 opacity-0 animate-slide-in-right"
      style="animation-delay: 800ms"
    >
      <span class="font-mono text-sm uppercase tracking-widest">{{ currentDate }}</span>
      <span class="text-ink">|</span>
      <span class="font-mono text-sm uppercase tracking-widest">系统状态: 正常运行</span>
      <span class="text-ink">|</span>
      <span class="font-mono text-sm uppercase tracking-widest">第一卷 · 第一期</span>
    </div>

    <!-- 报纸折叠纹理线 -->
    <div class="mt-2 mx-8 h-px relative">
      <div class="absolute inset-0" style="background: linear-gradient(90deg, transparent, rgba(30,30,30,0.15) 20%, rgba(30,30,30,0.3) 50%, rgba(30,30,30,0.15) 80%, transparent);" />
      <div class="absolute inset-0 -top-px" style="background: linear-gradient(90deg, transparent, rgba(242,239,233,0.6) 20%, rgba(242,239,233,0.9) 50%, rgba(242,239,233,0.6) 80%, transparent); height: 1px;" />
    </div>
  </div>
</template>

<script setup lang="ts">
const titleText = 'THE MANKIND GEORGE CHRONICLE'
const titleChars = titleText.split('')

const currentDate = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})
</script>
