<template>
  <div class="border-2 border-ink bg-newsprint mb-4 overflow-hidden relative">
    <!-- 纸角折叠效果 -->
    <div class="fold-corner" />

    <div
      class="flex items-start gap-3 p-4 cursor-pointer select-none transition-transform duration-150"
      :class="isPressed ? 'scale-[0.98]' : 'scale-100'"
      @click="toggle"
      @mousedown="isPressed = true"
      @mouseup="isPressed = false"
      @mouseleave="isPressed = false"
    >
      <div class="flex-1">
        <span class="font-mono text-xs text-ink/60">{{ experience.year }}</span>
        <h4 class="font-headline text-xl md:text-lg font-bold leading-tight">{{ experience.title }}</h4>
      </div>
      <!-- 蜡封盖章 - 展开时触发 animate-stamp -->
      <StampSeal
        :text="experience.stampStatus"
        size="sm"
        :animate="isOpen"
      />
    </div>

    <div
      v-show="isOpen"
      class="px-4 pb-4 border-t border-ink/20 animate-spring-open"
    >
      <div class="prose prose-sm max-w-none font-body pt-3" v-html="renderedContent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

const props = defineProps<{
  experience: { id: number; year: string; title: string; contentMarkdown: string; stampStatus: string }
}>()

const isOpen = ref(false)
const isPressed = ref(false)
const toggle = () => { isOpen.value = !isOpen.value }

const renderedContent = computed(() => md.render(props.experience.contentMarkdown || ''))
</script>
