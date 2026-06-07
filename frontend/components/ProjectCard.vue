<template>
  <div class="relative border-2 border-ink bg-parchment overflow-visible" :id="`project-${project.id}`">
    <!-- 未展开：报纸卡片 - 只显示标题，但保持与展开后相同大小 -->
    <div
      v-if="state === 'idle'"
      class="relative newspaper-card"
      @click="handleClick"
    >
      <div class="p-4">
        <h3 class="font-headline text-xl font-bold border-b-2 border-ink pb-2 mb-2">{{ project.title }}</h3>
        <p class="text-sm leading-relaxed font-body mb-3 invisible">{{ project.description }}</p>
        <p class="font-mono text-xs text-ink/40 text-center">[ 点击展开查看详情 ]</p>
      </div>
    </div>

    <!-- 撕裂 + 展示：底层内容 + 顶层纸张碎片 -->
    <template v-if="state === 'tearing' || state === 'revealed'">
      <!-- 底层：完整内容 -->
      <div
        class="p-4 bg-cardboard cursor-pointer"
        @click="expanded = true"
      >
        <h3 class="font-headline text-xl font-bold mb-2">{{ project.title }}</h3>
        <p class="text-sm leading-relaxed font-body mb-3">{{ project.description }}</p>
        <PerforatedLine :tags="project.tags" />
        <a
          v-if="project.url"
          :href="project.url"
          target="_blank"
          class="font-mono text-xs text-stamp underline"
          @click.stop
        >查看项目 &rarr;</a>
      </div>

      <!-- 顶层：撕裂中的纸张碎片（遮罩，裂开时露出下面内容） -->
      <template v-if="state === 'tearing'">
        <div
          class="absolute inset-0 bg-parchment border-2 border-ink z-30 tear-half-left"
          style="clip-path: polygon(0% 0%, 52% 0%, 50% 15%, 53% 30%, 48% 45%, 51% 60%, 49% 75%, 52% 90%, 50% 100%, 0% 100%);"
        >
          <div class="p-4">
            <h3 class="font-headline text-xl font-bold border-b-2 border-ink pb-2 mb-2">{{ project.title }}</h3>
            <p class="text-sm leading-relaxed font-body mb-3">{{ project.description }}</p>
          </div>
          <PerforatedLine :tags="project.tags" />
        </div>
        <div
          class="absolute inset-0 bg-parchment border-2 border-ink z-30 tear-half-right"
          style="clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 52% 90%, 49% 75%, 51% 60%, 48% 45%, 53% 30%, 50% 15%);"
        >
          <div class="p-4">
            <h3 class="font-headline text-xl font-bold border-b-2 border-ink pb-2 mb-2">{{ project.title }}</h3>
            <p class="text-sm leading-relaxed font-body mb-3">{{ project.description }}</p>
          </div>
          <PerforatedLine :tags="project.tags" />
        </div>
      </template>
    </template>
  </div>

  <!-- 全屏展开详情 -->
  <Teleport to="body">
    <div v-if="expanded" class="fixed inset-0 z-[100] flex items-center justify-center">
      <div class="absolute inset-0 bg-ink/60 backdrop-blur-sm" @click="expanded = false" />
      <div
        class="relative bg-newsprint border-4 border-ink max-w-2xl w-[90vw] max-h-[80vh] overflow-y-auto p-8 z-10"
        style="animation: paper-lift 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;"
      >
        <div class="fold-corner" />
        <h3 class="font-headline text-3xl font-black mb-4">{{ project.title }}</h3>
        <div class="border-b-2 border-ink mb-4" />
        <p class="text-base leading-relaxed font-body mb-4">{{ project.description }}</p>
        <PerforatedLine :tags="project.tags" />
        <a
          v-if="project.url"
          :href="project.url"
          target="_blank"
          class="inline-block mt-4 font-mono text-sm text-stamp underline"
        >查看项目 &rarr;</a>
      </div>
    </div>
  </Teleport>

  <!-- 飘入覆盖层：从左上角飘来覆盖旧项目 -->
  <Teleport to="body">
    <div
      v-if="showFloatOverlay"
      class="fixed inset-0 z-[90] pointer-events-none"
    >
      <div
        class="absolute bg-parchment border-2 border-ink shadow-hard-lg float-paper"
        :style="floatStyle"
      >
        <div class="p-4">
          <h3 class="font-headline text-xl font-bold border-b-2 border-ink pb-2 mb-2">{{ floatProject?.title }}</h3>
          <p class="font-mono text-xs text-ink/50 text-center">[ 点击展开查看详情 ]</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  project: { id: number; title: string; description: string; tags: string[]; url?: string }
}>()

const activeProjectId = inject<Ref<number | null>>('activeProjectId', ref(null))
const allProjects = inject<Ref<any[]>>('allProjects', ref([]))

const state = ref<'idle' | 'tearing' | 'revealed'>('idle')
const expanded = ref(false)
const showFloatOverlay = ref(false)
const floatStyle = ref('')
const floatProject = ref<{ title: string; description: string; tags: string[] } | null>(null)

const handleClick = () => {
  if (state.value !== 'idle') return

  const prevId = activeProjectId.value
  const switching = prevId !== null && prevId !== props.project.id
  expanded.value = false

  if (switching) {
    // 1. 保存旧卡片位置，从数据中获取旧项目内容
    const oldEl = document.getElementById(`project-${prevId}`)
    const rect = oldEl?.getBoundingClientRect()
    const oldProject = allProjects.value.find((p: any) => p.id === prevId)

    // 2. 飘入覆盖旧项目（显示旧卡片的未展开状态：只有标题）
    if (rect && oldProject) {
      floatProject.value = {
        title: oldProject.title,
        description: '',
        tags: [],
      }
      floatStyle.value = `top:${rect.top}px;left:${rect.left}px;width:${rect.width}px;height:${rect.height}px;`
      showFloatOverlay.value = true

      // 3. 飘入快到位时（1s），旧卡片恢复为 idle（被覆盖层遮住，用户看不到闪烁）
      setTimeout(() => {
        activeProjectId.value = props.project.id
      }, 1000)

      // 4. 飘入完成（1.2s）→ 覆盖层消失 → 撕开新卡片
      setTimeout(() => {
        showFloatOverlay.value = false
        state.value = 'tearing'
        setTimeout(() => { state.value = 'revealed' }, 500)
      }, 1200)
    } else {
      activeProjectId.value = props.project.id
      state.value = 'tearing'
      setTimeout(() => { state.value = 'revealed' }, 500)
    }
  } else {
    // 首次点击：直接撕开
    activeProjectId.value = props.project.id
    state.value = 'tearing'
    setTimeout(() => { state.value = 'revealed' }, 500)
  }
}

// 监听：别的项目被激活时，自己恢复为 idle
// 因为 activeProjectId 在飘入 1s 后才改，所以 watcher 也在那时触发
// 此时旧卡片已被覆盖层遮住，恢复不会闪烁
watch(activeProjectId, (newId) => {
  if (newId !== props.project.id && state.value !== 'idle') {
    state.value = 'idle'
    expanded.value = false
  }
})
</script>

<style scoped>
.newspaper-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.newspaper-card:hover {
  transform: translateY(-2px);
  box-shadow: 5px 5px 0px #1E1E1E;
}

.tear-half-left {
  animation: tear-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
.tear-half-right {
  animation: tear-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
</style>

<style>
/* 纸张飘入覆盖动画 - 从左上角飘来 */
.float-paper {
  animation: float-cover 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes float-cover {
  0% {
    transform: translate(-100vw, -100vh) rotate(-12deg);
    opacity: 0;
  }
  15% {
    opacity: 0.8;
  }
  60% {
    transform: translate(2%, 1%) rotate(0.5deg);
    opacity: 1;
  }
  80% {
    transform: translate(-1%, -0.5%) rotate(-0.3deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
}
</style>
