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

      <div v-if="loading" class="text-center py-8 font-mono text-sm text-newsprint/60">加载中...</div>
      <div v-else-if="error" class="text-center py-8 font-mono text-sm text-stamp">{{ error }}</div>

      <template v-else>
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
          @delete="confirmDelete"
          @toggle-featured="toggleFeatured"
        />
      </template>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'admin-auth' })

const { get, post, put, del } = useApi()

const projects = ref<any[]>([])
const showForm = ref(false)
const editingId = ref<number | null>(null)
const tagsInput = ref('')
const loading = ref(true)
const error = ref('')

const form = reactive({ title: '', description: '', tags: [] as string[], url: '', sortOrder: 0, featured: false })

const columns = [
  { key: 'title', label: '标题' },
  { key: 'description', label: '描述' },
  { key: 'tags', label: '标签' },
]

const loadProjects = async () => {
  loading.value = true
  error.value = ''
  try {
    projects.value = await get<any[]>('/api/projects')
  } catch (e: any) {
    error.value = '加载失败: ' + (e?.data?.message || e?.message || '未知错误')
  } finally {
    loading.value = false
  }
}

const saveProject = async () => {
  try {
    form.tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
    if (editingId.value) {
      await put(`/api/projects/${editingId.value}`, { ...form })
    } else {
      await post('/api/projects', { ...form })
    }
    resetForm()
    await loadProjects()
  } catch (e: any) {
    error.value = '保存失败: ' + (e?.data?.message || e?.message || '未知错误')
  }
}

const editProject = (item: any) => {
  Object.assign(form, item)
  tagsInput.value = (item.tags || []).join(', ')
  editingId.value = item.id
  showForm.value = true
}

const confirmDelete = async (id: number) => {
  if (!confirm('确定要删除这个项目吗？此操作不可恢复。')) return
  try {
    await del(`/api/projects/${id}`)
    await loadProjects()
  } catch (e: any) {
    error.value = '删除失败: ' + (e?.data?.message || e?.message || '未知错误')
  }
}

const resetForm = () => {
  Object.assign(form, { title: '', description: '', tags: [], url: '', sortOrder: 0, featured: false })
  tagsInput.value = ''
  editingId.value = null
  showForm.value = false
}

const toggleFeatured = async (item: any) => {
  try {
    await put(`/api/projects/${item.id}`, { featured: !item.featured })
    await loadProjects()
  } catch (e: any) {
    error.value = '更新失败: ' + (e?.data?.message || e?.message || '未知错误')
  }
}

onMounted(loadProjects)
</script>
