<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <div class="flex justify-between items-center border-b-2 border-stamp pb-2">
        <h2 class="font-headline text-2xl text-stamp">PROJECTS</h2>
        <button
          class="border-2 border-stamp px-4 py-1 font-mono text-xs uppercase tracking-widest hover:bg-stamp hover:text-ink transition-colors"
          @click="showForm = !showForm"
        >{{ showForm ? 'CLOSE' : '+ NEW' }}</button>
      </div>

      <AdminForm
        v-if="showForm"
        :title="editingId ? 'EDIT PROJECT' : 'NEW PROJECT'"
        :form="form"
        submit-label="SAVE"
        @submit="saveProject"
        @cancel="resetForm"
      >
        <template #default>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Title</label>
            <input v-model="form.title" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Description</label>
            <textarea v-model="form.description" rows="3" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint resize-y" />
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Tags (comma-separated)</label>
            <input v-model="tagsInput" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">URL</label>
            <input v-model="form.url" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
          </div>
        </template>
      </AdminForm>

      <AdminTable
        :columns="columns"
        :items="projects"
        @edit="editProject"
        @delete="deleteProject"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { get, post, put, del } = useApi()

const projects = ref<any[]>([])
const showForm = ref(false)
const editingId = ref<number | null>(null)
const tagsInput = ref('')

const form = reactive({ title: '', description: '', tags: [] as string[], url: '', sortOrder: 0 })

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'tags', label: 'Tags' },
]

const loadProjects = async () => {
  projects.value = await get<any[]>('/api/projects')
}

const saveProject = async () => {
  form.tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  if (editingId.value) {
    await put(`/api/projects/${editingId.value}`, { ...form })
  } else {
    await post('/api/projects', { ...form })
  }
  resetForm()
  await loadProjects()
}

const editProject = (item: any) => {
  Object.assign(form, item)
  tagsInput.value = (item.tags || []).join(', ')
  editingId.value = item.id
  showForm.value = true
}

const deleteProject = async (id: number) => {
  await del(`/api/projects/${id}`)
  await loadProjects()
}

const resetForm = () => {
  Object.assign(form, { title: '', description: '', tags: [], url: '', sortOrder: 0 })
  tagsInput.value = ''
  editingId.value = null
  showForm.value = false
}

onMounted(loadProjects)
</script>
