<template>
  <div class="w-full overflow-hidden" :class="containerClass">
    <svg
      class="w-full"
      :class="svgClass"
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        :d="variant === 'top' ? topPath : bottomPath"
        :fill="color"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'top' | 'bottom'
  color?: string
  containerClass?: string
  svgClass?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'bottom',
  color: '#F2EFE9',
  containerClass: '',
  svgClass: 'h-8',
})

const topPath = 'M0,40 L0,25 Q30,20 60,28 Q90,35 120,22 Q150,15 180,27 Q210,33 240,20 Q270,12 300,25 Q330,32 360,18 Q390,10 420,24 Q450,30 480,16 Q510,8 540,22 Q570,30 600,18 Q630,10 660,26 Q690,33 720,20 Q750,12 780,28 Q810,35 840,22 Q870,14 900,26 Q930,32 960,18 Q990,10 1020,24 Q1050,30 1080,16 Q1110,8 1140,22 Q1170,28 1200,20 L1200,40 Z'
const bottomPath = 'M0,0 L0,15 Q30,20 60,12 Q90,5 120,18 Q150,25 180,13 Q210,7 240,20 Q270,28 300,15 Q330,8 360,22 Q390,30 420,16 Q450,10 480,24 Q510,32 540,18 Q570,10 600,22 Q630,30 660,14 Q690,7 720,20 Q750,28 780,12 Q810,5 840,18 Q870,26 900,14 Q930,8 960,22 Q990,30 1020,16 Q1050,10 1080,24 Q1110,32 1140,18 Q1170,12 1200,20 L1200,0 Z'
</script>
