export const useAuth = () => {
  const token = useState<string | null>('auth-token', () => null)
  const isAuthenticated = computed(() => !!token.value)

  const login = async (username: string, password: string) => {
    const config = useRuntimeConfig()
    const result = await $fetch<{ access_token: string }>(`${config.public.apiBase}/api/auth/login`, {
      method: 'POST',
      body: { username, password },
    })
    token.value = result.access_token
    if (import.meta.client) {
      localStorage.setItem('auth-token', result.access_token)
    }
  }

  const logout = () => {
    token.value = null
    if (import.meta.client) {
      localStorage.removeItem('auth-token')
    }
    navigateTo('/admin/login')
  }

  const init = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('auth-token')
      if (stored) token.value = stored
    }
  }

  const authHeaders = computed(() => token.value ? { Authorization: `Bearer ${token.value}` } : {})

  return { token, isAuthenticated, login, logout, init, authHeaders }
}
