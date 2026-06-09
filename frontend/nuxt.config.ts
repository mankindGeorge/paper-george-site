export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
  routeRules: {
    '/api/**': { proxy: 'http://localhost:3001/**' },
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    apiBaseDirect: '',
    public: {
      apiBase: '',
    },
  },
  googleFonts: {
    families: {
      'Playfair Display': [400, 700, 900],
      'Source Sans 3': [300, 400, 600],
      'IBM Plex Mono': [400, 500],
    },
    display: 'swap',
  },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: 'Mankind George 纪事报',
      meta: [
        { name: 'description', content: 'Mankind George 的个人作品集与博客' },
      ],
    },
  },
})
