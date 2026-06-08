<template>
  <div class="border-b-4 border-double border-ink pt-8 pb-4 text-center">
    <!-- 标题逐字墨迹印刷 -->
    <h1 class="font-headline text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-none">
      <template v-for="(word, wi) in titleWords" :key="wi">
        <span v-if="wi > 0" class="inline-block w-4">&nbsp;</span>
        <span class="inline-block">
          <span
            v-for="(char, ci) in word.chars"
            :key="ci"
            class="inline-block opacity-0 animate-ink-print"
            :style="{ animationDelay: `${char.index * 40}ms` }"
          >{{ char.char }}</span>
        </span>
      </template>
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

// 按单词分组，保留全局字符索引用于动画延迟
let charIndex = 0
const titleWords = titleText.split(' ').map(word => ({
  chars: word.split('').map(char => ({ char, index: charIndex++ })),
}))
charIndex++ // 跳过空格位置

const currentDate = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})
</script>
