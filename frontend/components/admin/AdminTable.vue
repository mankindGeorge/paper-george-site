<template>
  <div class="border-2 border-stamp overflow-x-auto">
    <table class="w-full text-left font-mono text-sm">
      <thead>
        <tr class="border-b-2 border-stamp bg-ink/20">
          <th v-for="col in columns" :key="col.key" class="px-4 py-2 uppercase tracking-widest text-xs">{{ col.label }}</th>
          <th class="px-4 py-2 uppercase tracking-widest text-xs">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id" class="border-b border-stamp/30 hover:bg-stamp/10">
          <td v-for="col in columns" :key="col.key" class="px-4 py-2">{{ item[col.key] }}</td>
          <td class="px-4 py-2 flex gap-2">
            <button class="text-stamp underline text-xs" @click="$emit('edit', item)">EDIT</button>
            <button class="text-stamp/60 underline text-xs" @click="$emit('delete', item.id)">DEL</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  columns: Array<{ key: string; label: string }>
  items: any[]
}>()

defineEmits(['edit', 'delete'])
</script>
