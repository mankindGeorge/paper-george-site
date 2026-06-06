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

  const init = () => {
    // Token is in httpOnly cookie, we just set the reactive state from the login response
    // On page refresh, the cookie is sent automatically by the browser
  }

  const authHeaders = computed(() => token.value ? { Authorization: `Bearer ${token.value}` } : {})

  return { token, isAuthenticated, login, logout, init, authHeaders }
}
