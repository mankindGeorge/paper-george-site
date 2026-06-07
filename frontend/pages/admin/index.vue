<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <h2 class="font-headline text-2xl text-stamp border-b-2 border-stamp pb-2">控制台 — 概览</h2>

      <div class="border-2 border-stamp p-4">
        <h3 class="font-headline text-lg text-stamp mb-2">管理员头像</h3>
        <div class="flex items-center gap-4">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            alt="管理员头像"
            class="w-16 h-16 rounded-full border-2 border-stamp object-cover"
          />
          <div v-else class="w-16 h-16 rounded-full border-2 border-stamp/30 flex items-center justify-center text-newsprint/30 font-headline text-2xl">
            A
          </div>
          <div>
            <label class="border-2 border-stamp/50 border-dashed px-4 py-2 font-mono text-xs text-newsprint/60 cursor-pointer hover:border-stamp transition-colors">
              更换头像
              <input type="file" accept="image/*" class="hidden" @change="uploadAvatar" />
            </label>
            <p v-if="avatarError" class="font-mono text-xs text-stamp mt-1">{{ avatarError }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="link in adminLinks"
          :key="link.to"
          :to="link.to"
          class="border-2 border-stamp p-4 hover:bg-stamp/20 transition-colors"
        >
          <h3 class="font-headline text-lg text-stamp">{{ link.title }}</h3>
          <p class="font-mono text-xs text-newsprint/60 mt-1">{{ link.desc }}</p>
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'admin-auth' })

const { token } = useAuth()
const config = useRuntimeConfig()

const adminLinks = [
  { to: '/admin/experiences', title: '经历管理', desc: '里程碑编年史条目' },
  { to: '/admin/projects', title: '项目管理', desc: '分类广告作品集' },
  { to: '/admin/scraps', title: '剪报管理', desc: '编辑剪报' },
  { to: '/admin/messages', title: '留言管理', desc: '致编辑的信' },
]

const avatarUrl = ref('')
const avatarError = ref('')

const loadAvatar = async () => {
  try {
    const result = await $fetch<{ value: string }>(`${config.public.apiBase}/api/settings/adminAvatar`)
    avatarUrl.value = result?.value || ''
  } catch {
    // no avatar set yet
  }
}

const uploadAvatar = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  avatarError.value = ''
  const formData = new FormData()
  formData.append('file', file)

  try {
    const result = await $fetch<{ url: string }>(`${config.public.apiBase}/api/uploads`, {
      method: 'POST',
      body: formData,
      headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
      credentials: 'include',
    })
    await $fetch(`${config.public.apiBase}/api/settings/adminAvatar`, {
      method: 'PUT',
      body: { value: result.url },
      headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
      credentials: 'include',
    })
    avatarUrl.value = result.url
  } catch (e: any) {
    avatarError.value = '上传失败: ' + (e?.data?.message || e?.message || '未知错误')
  }
}

onMounted(loadAvatar)
</script>
