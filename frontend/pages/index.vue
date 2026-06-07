<template>
  <div class="min-h-screen bg-newsprint">
    <a href="#main-content" class="skip-to-content">跳转到主内容</a>

    <!-- SVG Halftone Filter Definition -->
    <svg class="absolute w-0 h-0" aria-hidden="true">
      <defs>
        <filter id="halftone" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0 0.2 0.4 0.6 0.8 1" />
            <feFuncG type="discrete" tableValues="0 0.2 0.4 0.6 0.8 1" />
            <feFuncB type="discrete" tableValues="0 0.2 0.4 0.6 0.8 1" />
          </feComponentTransfer>
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="1" result="noise" />
          <feComposite in="SourceGraphic" in2="noise" operator="in" />
        </filter>
      </defs>
    </svg>

    <NavBar />
    <div ref="scrollContainer" class="h-[calc(100vh-52px)] overflow-y-scroll" id="main-content">
      <!-- Section 1: Masthead -->
      <section id="home" class="min-h-full flex flex-col">
        <Masthead />
        <div class="flex-1 p-4 md:p-8 flex flex-col">
          <NewsGrid :items="gridItems" class="flex-1 h-full" />
        </div>
        <TornEdge variant="bottom" color="#DCD7C9" svgClass="h-12" />
      </section>

      <!-- Section 2: Editorial Clippings (About) -->
      <section id="about" class="min-h-full bg-cardboard">
        <div class="p-4 md:p-8">
          <h2 class="font-headline text-3xl md:text-4xl font-black text-center mb-8 border-y-4 md:border-b-4 md:border-t-0 border-double border-ink pb-4">
            编辑剪报
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto overflow-visible items-start">
            <ScrapCard v-for="(scrap, i) in scraps" :key="scrap.id" :scrap="scrap" :index="i" />
          </div>
        </div>
      </section>

      <!-- Section 3: Projects -->
      <section id="projects" class="min-h-full">
        <div class="p-4 md:p-8">
          <h2 class="font-headline text-3xl md:text-4xl font-black text-center mb-2 border-y-4 md:border-b-4 md:border-t-0 border-double border-ink pb-4">
            项目展示
          </h2>
          <p class="text-center font-mono text-xs text-ink/60 mb-8 uppercase tracking-widest">项目作品集 &amp; 技术索引</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink max-w-5xl mx-auto">
            <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
          </div>
        </div>
      </section>

      <!-- Section 4: Milestone Chronicle (Experience) -->
      <section id="experience" class="min-h-full">
        <div class="p-4 md:p-8">
          <h2 class="font-headline text-3xl md:text-4xl font-black text-center mb-2 border-y-4 md:border-b-4 md:border-t-0 border-double border-ink pb-4">
            里程碑编年史
          </h2>
          <p class="text-center font-mono text-xs text-ink/60 mb-8 uppercase tracking-widest">历史文献特刊</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto overflow-visible">
            <div v-for="col in columns" :key="col.type">
              <h3 class="font-headline text-xl font-bold border-b-2 border-ink pb-2 mb-4 text-center uppercase relative">
                <span class="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-stamp" />
                {{ col.label }}
              </h3>
              <ExperienceCard
                v-for="exp in byColumn(col.type)"
                :key="exp.id"
                :experience="exp"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Section 5: Letter to the Editor (Contact) -->
      <section id="contact" class="min-h-full flex items-center justify-center">
        <div class="w-full max-w-lg bg-parchment border-2 border-ink p-8 relative mx-4 shadow-hard overflow-visible">
          <h2 class="font-headline text-3xl font-black text-center mb-2">致编辑的信</h2>
          <p class="text-center font-mono text-xs text-ink/60 mb-8 uppercase tracking-widest">通信与咨询</p>

          <!-- 信封打封 + 风吹走动画 -->
          <div v-if="submitted && !formFolded" class="absolute inset-0 flex items-center justify-center z-40 pointer-events-none envelope-wrap">
            <svg class="w-48 h-auto envelope-body" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- 信封主体 -->
              <rect x="10" y="40" width="180" height="95" rx="3" fill="#E8DCC8" stroke="#1E1E1E" stroke-width="2"/>
              <!-- 三角翻盖 -->
              <polygon points="10,40 100,95 190,40" fill="#DCD7C9" stroke="#1E1E1E" stroke-width="2"/>
              <!-- 信纸内容线 -->
              <line x1="40" y1="70" x2="160" y2="70" stroke="#1E1E1E" stroke-width="0.8" opacity="0.2"/>
              <line x1="40" y1="82" x2="140" y2="82" stroke="#1E1E1E" stroke-width="0.8" opacity="0.2"/>
              <line x1="40" y1="94" x2="120" y2="94" stroke="#1E1E1E" stroke-width="0.8" opacity="0.2"/>
              <!-- 火漆封印 -->
              <g class="wax-seal">
                <circle cx="100" cy="85" r="18" fill="#A64444" stroke="#1E1E1E" stroke-width="1.5"/>
                <circle cx="100" cy="85" r="12" fill="none" stroke="#F2EFE9" stroke-width="1" opacity="0.6"/>
                <!-- 封印裂纹 -->
                <line x1="88" y1="80" x2="95" y2="85" stroke="#F2EFE9" stroke-width="1.5" opacity="0.8"/>
                <line x1="105" y1="82" x2="112" y2="88" stroke="#F2EFE9" stroke-width="1.5" opacity="0.8"/>
                <line x1="96" y1="90" x2="104" y2="95" stroke="#F2EFE9" stroke-width="1" opacity="0.6"/>
              </g>
            </svg>
          </div>

          <!-- 表单：提交后立即隐藏 -->
          <form
            v-if="!submitted"
            @submit.prevent="handleSubmit"
            class="space-y-6 relative z-10"
          >
            <div>
              <label for="contact-name" class="font-mono text-xs uppercase tracking-widest block mb-1">您的姓名</label>
              <input
                id="contact-name"
                v-model="form.name"
                type="text"
                required
                class="w-full bg-transparent border-b-2 border-ink py-2 font-body text-sm focus:outline-none focus:border-stamp focus:border-b-4 transition-all"
              />
            </div>
            <div>
              <label for="contact-email" class="font-mono text-xs uppercase tracking-widest block mb-1">您的邮箱</label>
              <input
                id="contact-email"
                v-model="form.email"
                type="email"
                required
                class="w-full bg-transparent border-b-2 border-ink py-2 font-body text-sm focus:outline-none focus:border-stamp focus:border-b-4 transition-all"
              />
            </div>
            <div>
              <label for="contact-subject" class="font-mono text-xs uppercase tracking-widest block mb-1">主题</label>
              <input
                id="contact-subject"
                v-model="form.subject"
                type="text"
                required
                class="w-full bg-transparent border-b-2 border-ink py-2 font-body text-sm focus:outline-none focus:border-stamp focus:border-b-4 transition-all"
              />
            </div>
            <div>
              <label for="contact-body" class="font-mono text-xs uppercase tracking-widest block mb-1">留言内容</label>
              <textarea
                id="contact-body"
                v-model="form.body"
                rows="4"
                required
                class="w-full bg-transparent border-b-2 border-ink py-2 font-body text-sm focus:outline-none focus:border-stamp focus:border-b-4 transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              class="w-full border-2 border-ink bg-ink text-newsprint py-3 font-headline text-lg uppercase tracking-wider hover:bg-stamp hover:border-stamp transition-colors press-feedback active:translate-y-0.5"
              :disabled="sending"
            >
              {{ sending ? '发送中...' : '盖章发送' }}
            </button>
          </form>

          <!-- 成功反馈：盖章动画（信封离开屏幕后才显示） -->
          <div v-if="submitted && formFolded" class="flex flex-col items-center justify-center py-8 animate-stamp">
            <StampSeal text="已寄出" size="lg" />
            <p class="font-headline text-xl font-bold mt-4">您的来信已收到</p>
            <p class="font-mono text-sm text-ink/60 mt-2">感谢您的留言，我会尽快回复。</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { get, post } = useApi()

const [projectsData, scrapsData, experiencesData] = await Promise.all([
  get<any[]>('/api/projects'),
  get<any[]>('/api/scraps'),
  get<any[]>('/api/experiences'),
])

const projects = ref(projectsData)
const scraps = ref(scrapsData)
const experiences = ref(experiencesData)

// 项目共享状态：控制哪个项目正在打开
const activeProjectId = ref<number | null>(null)
const revealedIds = ref(new Set<number>())
provide('activeProjectId', activeProjectId)
provide('revealedIds', revealedIds)

const gridItems = computed(() => {
  const items: any[] = []
  if (projects.value.length > 0) {
    items.push({ title: projects.value[0].title, content: projects.value[0].description, span: true })
  }
  scraps.value.slice(0, 3).forEach((s: any) => {
    items.push({ title: s.title, content: s.content })
  })
  projects.value.slice(1, 4).forEach((p: any) => {
    items.push({ title: p.title, content: p.description })
  })
  return items
})

const columns = [
  { type: 'early', label: '早期探索与学术记录' },
  { type: 'engineering', label: '工程实践与深度研究' },
  { type: 'open-source', label: '开源宣言与基础设施编年' },
]
const byColumn = (type: string) => experiences.value.filter((e: any) => e.columnType === type)

const form = reactive({ name: '', email: '', subject: '', body: '' })
const sending = ref(false)
const submitted = ref(false)
const formFolded = ref(false)

const handleSubmit = async () => {
  sending.value = true
  try {
    await post('/api/messages', form)
    submitted.value = true
    // 等信封打封+风吹走动画完成后（4.5s）再切换到成功提示
    setTimeout(() => { formFolded.value = true }, 4500)
  } catch (e) {
    console.error(e)
  } finally {
    sending.value = false
  }
}

// Custom scroll snap - only snap when stopped + no text selected
const scrollContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  const el = scrollContainer.value
  if (!el) return

  let snapTimer: ReturnType<typeof setTimeout> | null = null
  let animFrame: number | null = null

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

  const findNearestSection = (scrollTop: number, vh: number) => {
    const sections = el.querySelectorAll('section')
    let nearest = 0
    let minDist = Infinity
    sections.forEach((sec, i) => {
      const top = (sec as HTMLElement).offsetTop
      const dist = Math.abs(scrollTop - top)
      if (dist < minDist) {
        minDist = dist
        nearest = i
      }
    })
    return { index: nearest, offset: (el.children[nearest] as HTMLElement).offsetTop }
  }

  const smoothSnap = (target: number) => {
    if (animFrame) cancelAnimationFrame(animFrame)
    const start = el.scrollTop
    const dist = target - start
    if (Math.abs(dist) < 1) return
    const duration = 600
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      el.scrollTop = start + dist * easeOutCubic(progress)
      if (progress < 1) {
        animFrame = requestAnimationFrame(step)
      }
    }
    animFrame = requestAnimationFrame(step)
  }

  const onScroll = () => {
    if (snapTimer) clearTimeout(snapTimer)
    if (animFrame) cancelAnimationFrame(animFrame)

    snapTimer = setTimeout(() => {
      const selection = window.getSelection()
      if (selection && selection.toString().length > 0) return

      const vh = el.clientHeight
      const { offset } = findNearestSection(el.scrollTop, vh)
      const diff = Math.abs(el.scrollTop - offset)

      if (diff < vh * 0.15 && diff > 1) {
        smoothSnap(offset)
      }
    }, 200)
  }

  el.addEventListener('scroll', onScroll, { passive: true })
})
</script>

<style>
/* 信封出现 */
.envelope-wrap {
  animation: envelope-appear 0.5s ease-out forwards;
}
@keyframes envelope-appear {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

/* 火漆封印破开 */
.wax-seal {
  animation: seal-crack 0.8s 0.5s ease-in-out forwards;
  transform-origin: 100px 85px;
}
@keyframes seal-crack {
  0% { transform: scale(1) rotate(0deg); }
  20% { transform: scale(1.3) rotate(-8deg); }
  40% { transform: scale(1.05) rotate(5deg); }
  60% { transform: scale(1.2) rotate(-3deg); }
  80% { transform: scale(1.1) rotate(2deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 0.5; }
}

/* 整个信封被风吹走 */
.envelope-body {
  animation: wind-blow 3s 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
  transform-origin: center center;
}
@keyframes wind-blow {
  0% { transform: translateX(0) translateY(0) rotate(0deg); opacity: 1; }
  10% { transform: translateX(8px) translateY(-4px) rotate(3deg); opacity: 1; }
  20% { transform: translateX(-6px) translateY(3px) rotate(-4deg); opacity: 1; }
  35% { transform: translateX(-15vw) translateY(-5vh) rotate(-10deg); opacity: 1; }
  60% { transform: translateX(-50vw) translateY(-15vh) rotate(-18deg); opacity: 0.8; }
  100% { transform: translateX(-120vw) translateY(-25vh) rotate(-25deg); opacity: 0; }
}
</style>
