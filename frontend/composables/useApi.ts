export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string
  const { token } = useAuth()

  const getHeaders = () => token.value ? { Authorization: `Bearer ${token.value}` } : {}

  const get = <T>(path: string) => $fetch<T>(`${apiBase}${path}`, { credentials: 'include', headers: getHeaders() })
  const post = <T>(path: string, body: any) => $fetch<T>(`${apiBase}${path}`, { method: 'POST', body, credentials: 'include', headers: getHeaders() })
  const put = <T>(path: string, body: any) => $fetch<T>(`${apiBase}${path}`, { method: 'PUT', body, credentials: 'include', headers: getHeaders() })
  const del = <T>(path: string) => $fetch<T>(`${apiBase}${path}`, { method: 'DELETE', credentials: 'include', headers: getHeaders() })

  return { get, post, put, del }
}
