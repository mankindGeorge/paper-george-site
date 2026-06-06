export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const get = <T>(path: string) => $fetch<T>(`${apiBase}${path}`, { credentials: 'include' })
  const post = <T>(path: string, body: any) => $fetch<T>(`${apiBase}${path}`, { method: 'POST', body, credentials: 'include' })
  const put = <T>(path: string, body: any) => $fetch<T>(`${apiBase}${path}`, { method: 'PUT', body, credentials: 'include' })
  const del = <T>(path: string) => $fetch<T>(`${apiBase}${path}`, { method: 'DELETE', credentials: 'include' })

  return { get, post, put, del }
}
