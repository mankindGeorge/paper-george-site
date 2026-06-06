<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <div class="flex justify-between items-center border-b-2 border-stamp pb-2">
        <h2 class="font-headline text-2xl text-stamp">项目管理</h2>
        <button
          class="border-2 border-stamp px-4 py-1 font-mono text-xs uppercase tracking-widest hover:bg-stamp hover:text-ink transition-colors"
          @click="showForm = !showForm"
        >{{ showForm ? '关闭' : '+ 新建' }}</button>
      </div>

      <AdminForm
        v-if="showForm"
        :title="editingId ? '编辑项目' : '新建项目'"
        :form="form"
        submit-label="保存"
        @submit="saveProject"
        @cancel="resetForm"
      >
        <template #default>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">标题</label>
            <input v-model="form.title" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">描述</label>
            <textarea v-model="form.description" rows="3" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint resize-y" />
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">标签 (逗号分隔)</label>
            <input v-model="tagsInput" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">链接</label>
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
  { key: 'title', label: '标题' },
  { key: 'description', label: '描述' },
  { key: 'tags', label: '标签' },
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
