<template>
  <div class="flex items-stretch" :class="containerClass">
    <div
      v-for="(tag, i) in tags"
      :key="i"
      class="group cursor-pointer border-r-2 border-dashed border-ink/30 px-3 py-2 last:border-r-0 transition-all duration-200 hover:border-solid hover:border-ink"
      :class="[
        isActive(i) ? 'bg-ink text-newsprint border-ink' : 'bg-newsprint text-ink',
        itemClass
      ]"
      @click="toggle(i)"
    >
      <span class="font-mono text-xs uppercase tracking-widest transition-transform duration-200 inline-block group-hover:translate-x-1">[{{ tag }}]</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tags: string[]
  containerClass?: string
  itemClass?: string
}

defineProps<Props>()

const activeIndex = ref<number | null>(null)

const toggle = (i: number) => {
  activeIndex.value = activeIndex.value === i ? null : i
}

const isActive = (i: number) => activeIndex.value === i
</script>
