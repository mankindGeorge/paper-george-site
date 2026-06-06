<template>
  <div class="border-2 border-stamp p-6">
    <h3 class="font-headline text-lg text-stamp mb-4">{{ title }}</h3>
    <form @submit.prevent="$emit('submit', form)" class="space-y-4">
      <slot :form="form" />
      <div class="flex gap-4">
        <button
          type="submit"
          class="border-2 border-stamp px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-stamp hover:text-ink transition-colors"
        >{{ submitLabel }}</button>
        <button
          type="button"
          class="border-2 border-stamp/30 px-4 py-2 font-mono text-xs uppercase tracking-widest hover:border-stamp transition-colors"
          @click="$emit('cancel')"
        >取消</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  submitLabel?: string
  form: any
}>()

defineEmits(['submit', 'cancel'])
</script>
