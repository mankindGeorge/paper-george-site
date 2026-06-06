<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <div class="flex justify-between items-center border-b-2 border-stamp pb-2">
        <h2 class="font-headline text-2xl text-stamp">SCRAPS</h2>
        <button
          class="border-2 border-stamp px-4 py-1 font-mono text-xs uppercase tracking-widest hover:bg-stamp hover:text-ink transition-colors"
          @click="showForm = !showForm"
        >{{ showForm ? 'CLOSE' : '+ NEW' }}</button>
      </div>

      <AdminForm
        v-if="showForm"
        :title="editingId ? 'EDIT SCRAP' : 'NEW SCRAP'"
        :form="form"
        submit-label="SAVE"
        @submit="saveScrap"
        @cancel="resetForm"
      >
        <template #default>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Title</label>
            <input v-model="form.title" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Content</label>
            <textarea v-model="form.content" rows="4" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint resize-y" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="font-mono text-xs uppercase tracking-widest block mb-1">Rotation (deg)</label>
              <input v-model.number="form.rotation" type="number" step="0.1" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
            </div>
            <div>
              <label class="font-mono text-xs uppercase tracking-widest block mb-1">Sort Order</label>
              <input v-model.number="form.sortOrder" type="number" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
            </div>
          </div>
        </template>
      </AdminForm>

      <AdminTable
        :columns="columns"
        :items="scraps"
        @edit="editScrap"
        @delete="deleteScrap"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { get, post, put, del } = useApi()

const scraps = ref<any[]>([])
const showForm = ref(false)
const editingId = ref<number | null>(null)

const form = reactive({ title: '', content: '', rotation: 0, sortOrder: 0 })

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'content', label: 'Content' },
  { key: 'rotation', label: 'Rotation' },
]

const loadScraps = async () => {
  scraps.value = await get<any[]>('/api/scraps')
}

const saveScrap = async () => {
  if (editingId.value) {
    await put(`/api/scraps/${editingId.value}`, { ...form })
  } else {
    await post('/api/scraps', { ...form })
  }
  resetForm()
  await loadScraps()
}

const editScrap = (item: any) => {
  Object.assign(form, item)
  editingId.value = item.id
  showForm.value = true
}

const deleteScrap = async (id: number) => {
  await del(`/api/scraps/${id}`)
  await loadScraps()
}

const resetForm = () => {
  Object.assign(form, { title: '', content: '', rotation: 0, sortOrder: 0 })
  editingId.value = null
  showForm.value = false
}

onMounted(loadScraps)
</script>
