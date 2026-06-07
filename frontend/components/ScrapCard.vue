<template>
  <div
    class="group relative cursor-pointer transition-all duration-300 ease-out deal-in"
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
    <!-- Decorations outside clip-path -->
    <div class="absolute top-2 left-2 w-3 h-3 bg-ink border-2 border-stamp rounded-full z-20 transition-transform duration-200 group-hover:scale-125" />
    <div class="tape-el" />
    <!-- Torn paper content -->
    <div class="relative z-10 bg-newsprint p-6 pt-8 torn-card">
      <h3 class="font-headline text-xl md:text-lg font-bold border-b border-ink/30 pb-1 mb-2">{{ scrap.title }}</h3>
      <img
        v-if="scrap.imageUrl"
        :src="fullImageUrl(scrap.imageUrl)"
        :alt="scrap.title"
        class="w-full h-auto object-cover border border-ink/20 mb-2 grayscale hover:grayscale-0 transition-all duration-300"
      />
      <p class="text-base md:text-sm leading-relaxed font-body whitespace-pre-wrap">{{ scrap.content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  scrap: { id: number; title: string; content: string; imageUrl?: string; rotation: number }
  index?: number
  pinnedId?: number | null
}>()

const emit = defineEmits<{
  (e: 'pin', id: number | null): void
}>()

const pinned = computed(() => props.pinnedId === props.scrap.id)
const otherPinned = computed(() => props.pinnedId !== null && props.pinnedId !== props.scrap.id)

const config = useRuntimeConfig()
const fullImageUrl = (url: string) => url.startsWith('/api/') ? `${config.public.apiBase}${url}` : url

const togglePin = () => {
  emit('pin', pinned.value ? null : props.scrap.id)
}
</script>

<style scoped>
.deal-in {
  opacity: 0;
  animation: paper-lift 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.tape-el {
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%) rotate(-13deg);
  width: 60px;
  height: 20px;
  background-color: #DCD7C9;
  border: 1px solid rgba(30, 30, 30, 0.25);
  z-index: 20;
  clip-path: polygon(
    0% 30%, 2% 5%, 6% 22%, 9% 0%, 14% 18%, 17% 3%, 22% 25%, 27% 8%, 30% 0%, 35% 15%,
    39% 2%, 43% 20%, 48% 5%, 51% 0%, 55% 12%, 60% 28%, 63% 3%, 68% 18%, 72% 0%, 76% 22%,
    80% 7%, 85% 0%, 89% 16%, 93% 4%, 97% 19%, 100% 8%,
    100% 70%, 97% 95%, 93% 82%, 89% 100%, 85% 78%, 80% 92%, 76% 100%, 72% 80%, 68% 95%,
    63% 100%, 60% 75%, 55% 88%, 51% 100%, 48% 82%, 43% 95%, 39% 78%, 35% 100%, 30% 85%,
    27% 100%, 22% 72%, 17% 98%, 14% 80%, 9% 100%, 6% 78%, 2% 95%, 0% 85%
  );
}

.group:hover {
  transform: rotate(0deg) translateY(-4px) !important;
  box-shadow: 8px 8px 0px #1E1E1E !important;
  z-index: 50;
}
</style>
