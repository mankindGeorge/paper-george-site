<template>
  <div class="min-h-screen bg-ink text-newsprint font-mono">
    <header class="border-b-2 border-stamp p-4 flex justify-between items-center">
      <h1 class="font-headline text-xl">编辑控制台</h1>
      <button
        v-if="isAuthenticated"
        class="border-2 border-stamp px-4 py-1 text-stamp hover:bg-stamp hover:text-newsprint transition-colors"
        @click="logout"
      >退出登录</button>
    </header>
    <main class="p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, logout, init } = useAuth()

onMounted(() => {
  init()
  if (!isAuthenticated.value) {
    navigateTo('/admin/login')
  }
})
</script>
