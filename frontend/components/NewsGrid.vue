<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 shadow-clip">
    <div
      v-for="(item, i) in items"
      :key="i"
      class="group relative bg-newsprint p-4 cursor-pointer transition-all duration-200 ease-out deal-in border-2 border-ink"
      :class="item.span ? 'md:col-span-2' : ''"
      :style="{ animationDelay: `${i * 80}ms` }"
      @mouseenter="onHover(i, true)"
      @mouseleave="onHover(i, false)"
    >
      <!-- 标题 + 墨迹高亮线 -->
      <div class="ink-highlight pb-1 mb-2">
        <h3
          class="font-headline text-xl md:text-lg font-bold border-b-2 border-ink pb-1 transition-all duration-200"
          :class="hovered === i ? 'font-black' : ''"
        >{{ item.title }}</h3>
      </div>

      <!-- 首字下沉 + 内容 -->
      <p class="text-base md:text-sm leading-relaxed font-body">
        <span
          v-if="item.content && item.content.length > 0"
          class="text-4xl font-headline float-left mr-2 leading-none text-ink"
        >{{ item.content.charAt(0) }}</span
        >{{ item.content.slice(1) }}
      </p>

      <!-- 角落印章 -->
      <div
        class="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-stamp flex items-center justify-center transition-all duration-300"
        :class="hovered === i ? 'scale-100 rotate-0' : 'scale-0 -rotate-20'"
      >
        <span class="text-stamp text-[8px] font-mono font-bold">M</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: Array<{ title: string; content: string; span?: boolean }> }>()

const hovered = ref<number | null>(null)

const onHover = (i: number, entering: boolean) => {
  hovered.value = entering ? i : null
}
</script>

<style scoped>
.deal-in {
  opacity: 0;
}
.deal-in:nth-child(odd) {
  animation: slide-in-left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.deal-in:nth-child(even) {
  animation: slide-in-right 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.group:hover {
  transform: translateY(-3px) skewX(0.5deg);
  box-shadow: 5px 5px 0px #1E1E1E;
}

.ink-highlight::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background-color: #A64444;
  transition: width 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.group:hover .ink-highlight::after {
  width: 100%;
}
</style>
