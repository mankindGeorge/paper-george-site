<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <div class="flex justify-between items-center border-b-2 border-stamp pb-2">
        <h2 class="font-headline text-2xl text-stamp">剪报管理</h2>
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
          :title="editingId ? '编辑剪报' : '新建剪报'"
          :form="form"
          submit-label="保存"
          @submit="saveScrap"
          @cancel="resetForm"
        >
          <template #default>
            <div>
              <label class="font-mono text-xs uppercase tracking-widest block mb-1">标题</label>
              <input v-model="form.title" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
            </div>
            <div>
              <label class="font-mono text-xs uppercase tracking-widest block mb-1">图片 (可选)</label>
              <div class="flex items-center gap-4">
                <label class="border-2 border-stamp/50 border-dashed px-4 py-2 font-mono text-xs text-newsprint/60 cursor-pointer hover:border-stamp transition-colors">
                  选择图片
                  <input type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
                </label>
                <span v-if="form.imageUrl" class="font-mono text-xs text-stamp">已上传</span>
                <button
                  v-if="form.imageUrl"
                  type="button"
                  class="font-mono text-xs text-stamp/60 hover:text-stamp"
                  @click="removeImage"
                >移除</button>
              </div>
              <img v-if="form.imageUrl" :src="form.imageUrl" class="mt-2 h-20 object-cover border border-stamp/30" />
            </div>
            <div>
              <label class="font-mono text-xs uppercase tracking-widest block mb-1">内容</label>
              <textarea v-model="form.content" rows="4" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint resize-y" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="font-mono text-xs uppercase tracking-widest block mb-1">旋转角度 (度)</label>
                <input v-model.number="form.rotation" type="number" step="0.1" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
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
          :items="scraps"
          @edit="editScrap"
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
const { token } = useAuth()
const config = useRuntimeConfig()

const scraps = ref<any[]>([])
const showForm = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(true)
const error = ref('')

const form = reactive({ title: '', content: '', imageUrl: '', rotation: 0, sortOrder: 0, featured: false })

const columns = [
  { key: 'title', label: '标题' },
  { key: 'content', label: '内容' },
  { key: 'rotation', label: '旋转' },
]

const loadScraps = async () => {
  loading.value = true
  error.value = ''
  try {
    scraps.value = await get<any[]>('/api/scraps')
  } catch (e: any) {
    error.value = '加载失败: ' + (e?.data?.message || e?.message || '未知错误')
  } finally {
    loading.value = false
  }
}

const saveScrap = async () => {
  try {
    if (editingId.value) {
      await put(`/api/scraps/${editingId.value}`, { ...form })
    } else {
      await post('/api/scraps', { ...form })
    }
    resetForm()
    await loadScraps()
  } catch (e: any) {
    error.value = '保存失败: ' + (e?.data?.message || e?.message || '未知错误')
  }
}

const editScrap = (item: any) => {
  Object.assign(form, item)
  editingId.value = item.id
  showForm.value = true
}

const confirmDelete = async (id: number) => {
  if (!confirm('确定要删除这条剪报吗？此操作不可恢复。')) return
  try {
    await del(`/api/scraps/${id}`)
    await loadScraps()
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
  Object.assign(form, { title: '', content: '', imageUrl: '', rotation: 0, sortOrder: scraps.value.length, featured: false })
  editingId.value = null
  showForm.value = false
}

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const result = await $fetch<{ url: string }>(`${config.public.apiBase}/api/uploads`, {
      method: 'POST',
      body: formData,
      headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
      credentials: 'include',
    })
    form.imageUrl = result.url
  } catch (e: any) {
    error.value = '图片上传失败: ' + (e?.data?.message || e?.message || '未知错误')
  }
}

const removeImage = () => {
  form.imageUrl = ''
}

const toggleFeatured = async (item: any) => {
  try {
    await put(`/api/scraps/${item.id}`, { featured: !item.featured })
    await loadScraps()
  } catch (e: any) {
    error.value = '更新失败: ' + (e?.data?.message || e?.message || '未知错误')
  }
}

onMounted(loadScraps)
</script>
