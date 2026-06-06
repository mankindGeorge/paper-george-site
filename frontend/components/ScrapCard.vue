<template>
  <div
    class="group relative bg-newsprint p-6 pt-8 cursor-pointer transition-all duration-300 ease-out deal-in torn-card tape-decoration pin-decoration"
    :style="{
      transform: `rotate(${scrap.rotation}deg)`,
      animationDelay: `${(index || 0) * 100}ms`,
      boxShadow: pinned
        ? '8px 8px 0px #1E1E1E'
        : `${3 + (index || 0) * 2}px ${3 + (index || 0) * 2}px 0px #1E1E1E`,
    }"
    :class="[
      pinned ? 'scale-105 z-50 !rotate-0' : '',
      !pinned && otherPinned ? 'brightness-90' : '',
    ]"
    @click="togglePin"
  >
    <div class="relative z-10">
      <h3 class="font-headline text-xl md:text-lg font-bold border-b border-ink/30 pb-1 mb-2">{{ scrap.title }}</h3>
      <p class="text-base md:text-sm leading-relaxed font-body">{{ scrap.content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  scrap: { id: number; title: string; content: string; rotation: number }
  index?: number
  pinnedId?: number | null
}>()

const emit = defineEmits<{
  (e: 'pin', id: number | null): void
}>()

const pinned = computed(() => props.pinnedId === props.scrap.id)
const otherPinned = computed(() => props.pinnedId !== null && props.pinnedId !== props.scrap.id)

const togglePin = () => {
  emit('pin', pinned.value ? null : props.scrap.id)
}
</script>

<style scoped>
.deal-in {
  opacity: 0;
  animation: paper-lift 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.group:hover {
  transform: rotate(0deg) translateY(-4px) !important;
  box-shadow: 8px 8px 0px #1E1E1E !important;
  z-index: 50;
}
</style>
