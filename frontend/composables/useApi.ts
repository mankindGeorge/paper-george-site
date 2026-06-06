export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const get = <T>(path: string) => $fetch<T>(`${apiBase}${path}`)
  const post = <T>(path: string, body: any) => $fetch<T>(`${apiBase}${path}`, { method: 'POST', body })
  const put = <T>(path: string, body: any) => $fetch<T>(`${apiBase}${path}`, { method: 'PUT', body })
  const del = <T>(path: string) => $fetch<T>(`${apiBase}${path}`, { method: 'DELETE' })

  return { get, post, put, del }
}
