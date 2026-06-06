export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
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
      title: 'Mankind George 纪事报',
      meta: [
        { name: 'description', content: 'Mankind George 的个人作品集与博客' },
      ],
    },
  },
})
