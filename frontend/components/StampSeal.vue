<template>
  <div
    class="inline-flex items-center justify-center border-2 border-stamp rounded-full px-3 py-1"
    :class="[sizeClass, animate ? 'animate-stamp' : '']"
  >
    <span class="font-mono text-stamp uppercase tracking-wider" :class="textClass">
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text: string
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  animate: false,
})

const sizeClass = computed(() => {
  const sizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }
  return sizes[props.size]
})

const textClass = computed(() => {
  const sizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }
  return sizes[props.size]
})
</script>
