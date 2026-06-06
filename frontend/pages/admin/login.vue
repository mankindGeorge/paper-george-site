<template>
  <NuxtLayout name="admin">
    <div class="min-h-[80vh] flex items-center justify-center">
      <div class="w-full max-w-sm border-2 border-stamp p-8">
        <h2 class="font-headline text-2xl text-center mb-6 text-stamp">CONTROL DESK ACCESS</h2>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Username</label>
            <input
              v-model="username"
              type="text"
              class="w-full bg-transparent border-b-2 border-stamp py-2 font-mono text-newsprint text-sm focus:outline-none"
            />
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Password</label>
            <input
              v-model="password"
              type="password"
              class="w-full bg-transparent border-b-2 border-stamp py-2 font-mono text-newsprint text-sm focus:outline-none"
            />
          </div>
          <p v-if="error" class="text-stamp font-mono text-xs">{{ error }}</p>
          <button
            type="submit"
            class="w-full border-2 border-stamp text-stamp py-2 font-headline uppercase tracking-wider hover:bg-stamp hover:text-ink transition-colors"
          >AUTHENTICATE</button>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { login } = useAuth()
const username = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    await login(username.value, password.value)
    navigateTo('/admin')
  } catch (e) {
    error.value = 'ACCESS DENIED — INVALID CREDENTIALS'
  }
}
</script>
