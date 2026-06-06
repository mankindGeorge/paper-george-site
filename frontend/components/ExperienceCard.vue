<template>
  <div class="border-2 border-ink bg-newsprint mb-4 overflow-hidden">
    <div
      class="flex items-start gap-3 p-4 cursor-pointer select-none"
      @click="toggle"
    >
      <div class="flex-1">
        <span class="font-mono text-xs text-ink/60">{{ experience.year }}</span>
        <h4 class="font-headline text-lg font-bold leading-tight">{{ experience.title }}</h4>
      </div>
      <StampSeal :text="experience.stampStatus" size="sm" />
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
const toggle = () => { isOpen.value = !isOpen.value }

const renderedContent = computed(() => md.render(props.experience.contentMarkdown || ''))
</script>
