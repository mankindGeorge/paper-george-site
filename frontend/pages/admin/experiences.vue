<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <div class="flex justify-between items-center border-b-2 border-stamp pb-2">
        <h2 class="font-headline text-2xl text-stamp">EXPERIENCES</h2>
        <button
          class="border-2 border-stamp px-4 py-1 font-mono text-xs uppercase tracking-widest hover:bg-stamp hover:text-ink transition-colors"
          @click="showForm = !showForm"
        >{{ showForm ? 'CLOSE' : '+ NEW' }}</button>
      </div>

      <AdminForm
        v-if="showForm"
        :title="editingId ? 'EDIT EXPERIENCE' : 'NEW EXPERIENCE'"
        :form="form"
        submit-label="SAVE"
        @submit="saveExperience"
        @cancel="resetForm"
      >
        <template #default>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="font-mono text-xs uppercase tracking-widest block mb-1">Column</label>
              <select v-model="form.columnType" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint">
                <option value="early">Early Inquiry</option>
                <option value="engineering">Engineering</option>
                <option value="open-source">Open Source</option>
              </select>
            </div>
            <div>
              <label class="font-mono text-xs uppercase tracking-widest block mb-1">Year</label>
              <input v-model="form.year" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
            </div>
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Title</label>
            <input v-model="form.title" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Content (Markdown)</label>
            <textarea v-model="form.contentMarkdown" rows="6" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint resize-y" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="font-mono text-xs uppercase tracking-widest block mb-1">Status</label>
              <select v-model="form.stampStatus" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
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
        :items="experiences"
        @edit="editExperience"
        @delete="deleteExperience"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { get, post, put, del } = useApi()
const { authHeaders } = useAuth()

const experiences = ref<any[]>([])
const showForm = ref(false)
const editingId = ref<number | null>(null)

const form = reactive({
  columnType: 'early',
  year: '',
  title: '',
  contentMarkdown: '',
  stampStatus: 'published',
  sortOrder: 0,
})

const columns = [
  { key: 'year', label: 'Year' },
  { key: 'columnType', label: 'Column' },
  { key: 'title', label: 'Title' },
  { key: 'stampStatus', label: 'Status' },
]

const loadExperiences = async () => {
  experiences.value = await get<any[]>('/api/experiences?admin=true')
}

const saveExperience = async () => {
  if (editingId.value) {
    await put(`/api/experiences/${editingId.value}`, { ...form })
  } else {
    await post('/api/experiences', { ...form })
  }
  resetForm()
  await loadExperiences()
}

const editExperience = (item: any) => {
  Object.assign(form, item)
  editingId.value = item.id
  showForm.value = true
}

const deleteExperience = async (id: number) => {
  await del(`/api/experiences/${id}`)
  await loadExperiences()
}

const resetForm = () => {
  Object.assign(form, { columnType: 'early', year: '', title: '', contentMarkdown: '', stampStatus: 'published', sortOrder: 0 })
  editingId.value = null
  showForm.value = false
}

onMounted(loadExperiences)
</script>
