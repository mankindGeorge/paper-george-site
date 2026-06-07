<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <div class="flex justify-between items-center border-b-2 border-stamp pb-2">
        <h2 class="font-headline text-2xl text-stamp">经历管理</h2>
        <button
          class="border-2 border-stamp px-4 py-1 font-mono text-xs uppercase tracking-widest hover:bg-stamp hover:text-ink transition-colors"
          @click="openNewForm"
        >{{ showForm ? '关闭' : '+ 新建' }}</button>
      </div>

      <div v-if="loading" class="text-center py-8 font-mono text-sm text-newsprint/60">加载中...</div>
      <div v-else-if="error" class="text-center py-8 font-mono text-sm text-stamp">{{ error }}</div>

      <template v-else>
        <AdminForm
          v-if="showForm"
          :title="editingId ? '编辑经历' : '新建经历'"
          :form="form"
          submit-label="保存"
          @submit="saveExperience"
          @cancel="resetForm"
        >
          <template #default>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="font-mono text-xs uppercase tracking-widest block mb-1">栏目</label>
                <select v-model="form.columnType" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint">
                  <option value="early">早期探索</option>
                  <option value="engineering">工程实践</option>
                  <option value="open-source">开源项目</option>
                </select>
              </div>
              <div>
                <label class="font-mono text-xs uppercase tracking-widest block mb-1">年份</label>
                <input v-model="form.year" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
              </div>
            </div>
            <div>
              <label class="font-mono text-xs uppercase tracking-widest block mb-1">标题</label>
              <input v-model="form.title" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
            </div>
            <div>
              <label class="font-mono text-xs uppercase tracking-widest block mb-1">内容 (Markdown)</label>
              <textarea v-model="form.contentMarkdown" rows="6" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint resize-y" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="font-mono text-xs uppercase tracking-widest block mb-1">状态</label>
                <select v-model="form.stampStatus" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint">
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                  <option value="archived">已归档</option>
                </select>
              </div>
              <div>
                <label class="font-mono text-xs uppercase tracking-widest block mb-1">排序</label>
                <input v-model.number="form.sortOrder" type="number" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
              </div>
            </div>
          </template>
        </AdminForm>

        <AdminTable
          :columns="columns"
          :items="experiences"
          @edit="editExperience"
          @delete="confirmDelete"
        />
      </template>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'admin-auth' })

const { get, post, put, del } = useApi()

const experiences = ref<any[]>([])
const showForm = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(true)
const error = ref('')

const form = reactive({
  columnType: 'early',
  year: '',
  title: '',
  contentMarkdown: '',
  stampStatus: 'published',
  sortOrder: 0,
})

const columns = [
  { key: 'year', label: '年份' },
  { key: 'columnType', label: '栏目' },
  { key: 'title', label: '标题' },
  { key: 'stampStatus', label: '状态' },
]

const loadExperiences = async () => {
  loading.value = true
  error.value = ''
  try {
    experiences.value = await get<any[]>('/api/experiences?admin=true')
  } catch (e: any) {
    error.value = '加载失败: ' + (e?.data?.message || e?.message || '未知错误')
  } finally {
    loading.value = false
  }
}

const saveExperience = async () => {
  try {
    if (editingId.value) {
      await put(`/api/experiences/${editingId.value}`, { ...form })
    } else {
      await post('/api/experiences', { ...form })
    }
    resetForm()
    await loadExperiences()
  } catch (e: any) {
    error.value = '保存失败: ' + (e?.data?.message || e?.message || '未知错误')
  }
}

const editExperience = (item: any) => {
  Object.assign(form, item)
  editingId.value = item.id
  showForm.value = true
}

const confirmDelete = async (id: number) => {
  if (!confirm('确定要删除这条经历吗？此操作不可恢复。')) return
  try {
    await del(`/api/experiences/${id}`)
    await loadExperiences()
  } catch (e: any) {
    error.value = '删除失败: ' + (e?.data?.message || e?.message || '未知错误')
  }
}

const openNewForm = () => {
  if (showForm.value) {
    showForm.value = false
  } else {
    resetForm()
    showForm.value = true
  }
}

const resetForm = () => {
  Object.assign(form, { columnType: 'early', year: '', title: '', contentMarkdown: '', stampStatus: 'published', sortOrder: experiences.value.length })
  editingId.value = null
  showForm.value = false
}

onMounted(loadExperiences)
</script>
