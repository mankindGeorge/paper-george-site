export const useAuth = () => {
  const token = useState<string | null>('auth-token', () => null)
  const isAuthenticated = computed(() => !!token.value)

  const login = async (username: string, password: string) => {
    const config = useRuntimeConfig()
    const result = await $fetch<{ access_token: string }>(`${config.public.apiBase}/api/auth/login`, {
      method: 'POST',
      body: { username, password },
      credentials: 'include',
    })
    token.value = result.access_token
  }

  const logout = () => {
    token.value = null
    if (import.meta.client) {
      document.cookie = 'auth-token=; path=/; max-age=0'
    }
    navigateTo('/admin/login')
  }

  const init = async () => {
    if (!token.value && import.meta.client) {
      const config = useRuntimeConfig()
      try {
        await $fetch<{ user: any }>(`${config.public.apiBase}/api/auth/validate`, {
          credentials: 'include',
        })
        // If cookie is valid but token state is lost, we need to re-login
        // The httpOnly cookie exists but we can't read it client-side
        // The admin layout will handle redirect if needed
      } catch {
        // Cookie is invalid or expired, stay unauthenticated
      }
    }
  }

  const authHeaders = computed(() => token.value ? { Authorization: `Bearer ${token.value}` } : {})

  return { token, isAuthenticated, login, logout, init, authHeaders }
}
