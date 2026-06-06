<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <h2 class="font-headline text-2xl text-stamp border-b-2 border-stamp pb-2">留言管理</h2>
      <div v-if="loading" class="text-center py-8 font-mono text-sm text-newsprint/60">加载中...</div>
      <div v-else-if="error" class="text-center py-8 font-mono text-sm text-stamp">{{ error }}</div>
      <div v-else-if="messages.length === 0" class="font-mono text-sm text-newsprint/60">暂无留言。</div>
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="border-2 border-stamp p-4"
        :class="{ 'opacity-50': msg.isRead }"
      >
        <div class="flex justify-between items-start mb-2">
          <div>
            <span class="font-mono text-xs text-stamp">{{ msg.name }}</span>
            <span class="font-mono text-xs text-newsprint/60 ml-2">&lt;{{ msg.email }}&gt;</span>
          </div>
          <span class="font-mono text-xs text-newsprint/40">{{ new Date(msg.createdAt).toLocaleDateString() }}</span>
        </div>
        <h4 class="font-headline text-lg text-newsprint">{{ msg.subject }}</h4>
        <p class="font-body text-sm text-newsprint/80 mt-2">{{ msg.body }}</p>
        <button
          v-if="!msg.isRead"
          class="mt-3 font-mono text-xs text-stamp underline"
          @click="markRead(msg.id)"
        >标为已读</button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'admin-auth' })

const { get, put } = useApi()

const messages = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const loadMessages = async () => {
  loading.value = true
  error.value = ''
  try {
    messages.value = await get<any[]>('/api/messages')
  } catch (e: any) {
    error.value = '加载失败: ' + (e?.data?.message || e?.message || '未知错误')
  } finally {
    loading.value = false
  }
}

const markRead = async (id: number) => {
  try {
    await put(`/api/messages/${id}/read`, {})
    await loadMessages()
  } catch (e: any) {
    error.value = '操作失败: ' + (e?.data?.message || e?.message || '未知错误')
  }
}

onMounted(loadMessages)
</script>
