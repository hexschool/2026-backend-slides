<script setup lang="ts">
/**
 * Docker 互動實驗室：貨櫃的魔法
 * 使用共用模版 InteractiveSlideTemplate
 */
import { ref, computed, watch, onMounted } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{
  isMobile?: boolean
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

// === 資料定義 ===
type StepView = 'intro' | 'problem' | 'solution' | 'container' | 'livefit'

type Step = {
  id: number
  view: StepView
  title: string
  desc: string
}

const STEPS: Step[] = [
  {
    id: 0,
    view: 'intro',
    title: '每個工程師的噩夢',
    desc: '想像一下：你辛辛苦苦寫好的程式，在你的電腦上跑得很順利。結果換到同事的電腦⋯⋯',
  },
  {
    id: 1,
    view: 'problem',
    title: '「在我的電腦可以跑啊！」',
    desc: '為什麼會這樣？因為每台電腦的環境都不一樣——作業系統版本、軟體版本、設定檔⋯⋯光是這些差異就夠讓人頭痛了。',
  },
  {
    id: 2,
    view: 'solution',
    title: 'Docker 的解決方案',
    desc: '想像你要搬家，與其把東西一件一件搬，不如把整個房間打包成一個貨櫃。不管搬到哪裡，打開就是一模一樣的環境！',
  },
  {
    id: 3,
    view: 'container',
    title: 'Container 容器',
    desc: '這個「貨櫃」就叫做 Container（容器）。它把程式碼、執行環境、設定檔全部打包在一起，走到哪都能用！',
  },
  {
    id: 4,
    view: 'livefit',
    title: 'LiveFit 的三個容器',
    desc: 'LiveFit 專案需要三個服務一起運作。Docker 幫我們把每個服務都裝進獨立的容器，一個指令就能全部啟動！',
  },
]

// === 狀態 ===
const currentStep = ref(0)
const isTransitioning = ref(false)
const showContainerContent = ref(false)
const activeContainer = ref<'frontend' | 'backend' | 'database' | null>(null)
const mounted = ref(false)

// 動畫狀態
const introAnimState = ref(0)
const problemAnimState = ref(0)
const solutionAnimState = ref(0)

const stepData = computed(() => STEPS[currentStep.value])

onMounted(() => {
  mounted.value = true
  triggerStepAnimation()
})

// 監聽步驟變化，觸發動畫
watch(currentStep, () => {
  isTransitioning.value = true
  showContainerContent.value = false
  activeContainer.value = null
  introAnimState.value = 0
  problemAnimState.value = 0
  solutionAnimState.value = 0

  setTimeout(() => {
    isTransitioning.value = false
    triggerStepAnimation()
  }, 100)
})

function triggerStepAnimation() {
  const step = stepData.value.view

  if (step === 'intro') {
    setTimeout(() => { introAnimState.value = 1 }, 200)
    setTimeout(() => { introAnimState.value = 2 }, 600)
    setTimeout(() => { introAnimState.value = 3 }, 1000)
  }

  if (step === 'problem') {
    setTimeout(() => { problemAnimState.value = 1 }, 200)
    setTimeout(() => { problemAnimState.value = 2 }, 500)
    setTimeout(() => { problemAnimState.value = 3 }, 800)
    setTimeout(() => { problemAnimState.value = 4 }, 1200)
  }

  if (step === 'solution') {
    setTimeout(() => { solutionAnimState.value = 1 }, 200)
    setTimeout(() => { solutionAnimState.value = 2 }, 600)
    setTimeout(() => { solutionAnimState.value = 3 }, 1000)
    setTimeout(() => { solutionAnimState.value = 4 }, 1400)
    setTimeout(() => { solutionAnimState.value = 5 }, 1800)
  }

  if (step === 'container') {
    setTimeout(() => { showContainerContent.value = true }, 500)
  }
}

function nextStep() {
  if (currentStep.value < STEPS.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function handleComplete() {
  emit('complete')
}

function toggleContainer(name: 'frontend' | 'backend' | 'database') {
  activeContainer.value = activeContainer.value === name ? null : name
}
</script>

<template>
  <InteractiveSlideTemplate
    title="Docker 互動實驗室"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="sky"
    @prev="prevStep"
    @next="nextStep"
    @complete="handleComplete"
  >
    <!-- 自訂 Header Icon -->
    <template #icon>
      <div class="relative">
        <svg class="h-6 w-6 text-sky-400 md:h-8 md:w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.185.185v1.888c0 .102.084.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"/>
        </svg>
        <div class="absolute -right-1 -top-1 h-2 w-2 animate-pulse-slow rounded-full bg-sky-400"></div>
      </div>
    </template>

    <!-- 主要內容區 -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- Animated background particles -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="animate-float-slow absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"></div>
        <div class="animate-float-slower absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div class="animate-float absolute bottom-[20%] left-[30%] h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"></div>
      </div>

      <!-- ========== INTRO VIEW ========== -->
      <div v-if="stepData.view === 'intro'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center">
          <!-- 工程師與電腦場景 -->
          <div class="flex items-end gap-6 md:gap-12">
            <!-- 工程師 - 3D 卡片效果 -->
            <div
              class="flex flex-col items-center transition-all duration-700"
              :class="introAnimState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="relative">
                <div class="absolute -inset-4 rounded-full bg-emerald-500/20 blur-xl"></div>
                <div class="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl md:h-28 md:w-28">
                  <span class="text-5xl md:text-6xl">👨‍💻</span>
                </div>
              </div>
              <div class="mt-3 rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-white backdrop-blur md:text-base">你</div>
            </div>

            <!-- 電腦螢幕 - 霓虹效果 -->
            <div
              class="flex flex-col items-center transition-all delay-300 duration-700"
              :class="introAnimState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="relative">
                <!-- 螢幕發光效果 -->
                <div class="absolute -inset-2 rounded-2xl bg-emerald-500/20 blur-xl"></div>
                <!-- 螢幕本體 -->
                <div class="relative flex h-36 w-48 flex-col items-center justify-center rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 shadow-2xl md:h-44 md:w-56">
                  <!-- 螢幕頂部攝像頭 -->
                  <div class="absolute top-2 h-2 w-2 rounded-full bg-slate-600"></div>
                  <!-- 成功圖示 -->
                  <div class="relative">
                    <div class="absolute -inset-4 animate-pulse-slow rounded-full bg-emerald-500/20"></div>
                    <svg class="h-12 w-12 text-emerald-400 md:h-16 md:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div class="mt-2 text-sm font-bold text-emerald-400 md:text-base">程式運作中</div>
                  <!-- 終端機風格文字 -->
                  <div class="mt-1 font-mono text-xs text-emerald-400/60 md:text-sm">$ npm start ✓</div>
                </div>
                <!-- 螢幕支架 -->
                <div class="mx-auto h-4 w-12 rounded-b-lg bg-gradient-to-b from-slate-700 to-slate-800"></div>
                <div class="mx-auto h-2 w-20 rounded-b-lg bg-slate-800"></div>
              </div>
              <div class="mt-3 text-xs text-slate-400 md:text-sm">你的電腦</div>
            </div>
          </div>

          <!-- 成功對話泡泡 -->
          <div
            class="mt-8 transition-all delay-500 duration-700"
            :class="introAnimState >= 3 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-50 blur"></div>
              <div class="relative rounded-2xl border border-emerald-500/30 bg-slate-900/90 px-6 py-4 backdrop-blur">
                <div class="flex items-center gap-2 text-lg font-bold text-emerald-400 md:text-xl">
                  <span>✨</span>
                  <span>「太棒了，程式寫好了！」</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== PROBLEM VIEW ========== -->
      <div v-if="stepData.view === 'problem'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <!-- 紅色警示背景 -->
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-red-950/50 via-transparent to-transparent"></div>

        <div class="relative z-10 flex flex-col items-center">
          <!-- 兩台電腦對比 -->
          <div class="flex items-start gap-4 md:gap-10">
            <!-- 你的電腦：成功 -->
            <div
              class="flex flex-col items-center transition-all duration-700"
              :class="problemAnimState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <span class="mb-2 text-4xl md:text-5xl">😊</span>
              <div class="relative">
                <div class="absolute -inset-1 rounded-xl bg-emerald-500/20 blur-lg"></div>
                <div class="relative flex h-32 w-36 flex-col items-center justify-center rounded-xl border-2 border-emerald-500 bg-gradient-to-br from-slate-800 to-slate-900 md:h-40 md:w-48">
                  <svg class="h-10 w-10 text-emerald-400 md:h-12 md:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <div class="mt-1 text-xs font-bold text-emerald-400 md:text-sm">正常運作</div>
                </div>
              </div>
              <!-- 環境資訊卡片 - 強化視覺 -->
              <div class="mt-3 w-full rounded-xl border border-emerald-500/30 bg-emerald-950/50 px-3 py-2 text-center">
                <div class="text-xs font-bold text-emerald-300 md:text-sm">🖥️ 你的電腦</div>
                <div class="mt-1.5 space-y-1 text-left">
                  <div class="flex items-center gap-2 rounded bg-slate-800/80 px-2 py-1">
                    <span class="text-[10px] text-slate-500">OS</span>
                    <span class="font-mono text-[11px] font-medium text-emerald-400 md:text-xs">macOS 14</span>
                  </div>
                  <div class="flex items-center gap-2 rounded bg-slate-800/80 px-2 py-1">
                    <span class="text-[10px] text-slate-500">Node</span>
                    <span class="font-mono text-[11px] font-medium text-emerald-400 md:text-xs">v18.17.0</span>
                  </div>
                  <div class="flex items-center gap-2 rounded bg-slate-800/80 px-2 py-1">
                    <span class="text-[10px] text-slate-500">npm</span>
                    <span class="font-mono text-[11px] font-medium text-emerald-400 md:text-xs">9.6.7</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 傳送箭頭動畫 -->
            <div
              class="mt-20 flex flex-col items-center transition-all delay-200 duration-500"
              :class="problemAnimState >= 2 ? 'opacity-100' : 'opacity-0'"
            >
              <div class="relative">
                <svg class="h-8 w-8 animate-pulse text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
                <!-- 資料粒子效果 -->
                <div class="absolute left-0 top-1/2 h-1 w-1 animate-data-flow rounded-full bg-red-400"></div>
              </div>
              <div class="mt-2 text-xs font-medium text-red-400">部署</div>
            </div>

            <!-- 同事的電腦：失敗 -->
            <div
              class="flex flex-col items-center transition-all delay-300 duration-700"
              :class="problemAnimState >= 3 ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'"
            >
              <span class="mb-2 text-4xl md:text-5xl">😱</span>
              <div class="relative">
                <div class="absolute -inset-1 rounded-xl bg-red-500/20 blur-lg"></div>
                <div class="relative flex h-32 w-36 flex-col items-center justify-center rounded-xl border-2 border-red-500 bg-gradient-to-br from-slate-800 to-slate-900 md:h-40 md:w-48">
                  <svg class="h-10 w-10 animate-shake text-red-400 md:h-12 md:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <div class="mt-1 text-xs font-bold text-red-400 md:text-sm">崩潰了！</div>
                </div>
              </div>
              <!-- 環境資訊卡片 - 強化視覺差異 -->
              <div class="mt-3 w-full rounded-xl border border-red-500/30 bg-red-950/50 px-3 py-2 text-center">
                <div class="text-xs font-bold text-red-300 md:text-sm">💻 同事的電腦</div>
                <div class="mt-1.5 space-y-1 text-left">
                  <div class="flex items-center gap-2 rounded bg-slate-800/80 px-2 py-1">
                    <span class="text-[10px] text-slate-500">OS</span>
                    <span class="font-mono text-[11px] font-medium text-red-400 md:text-xs">Windows 10</span>
                  </div>
                  <div class="flex items-center gap-2 rounded bg-slate-800/80 px-2 py-1">
                    <span class="text-[10px] text-slate-500">Node</span>
                    <span class="font-mono text-[11px] font-medium text-red-400 md:text-xs">v16.14.0</span>
                    <span class="text-[9px] text-red-500">⚠️</span>
                  </div>
                  <div class="flex items-center gap-2 rounded bg-slate-800/80 px-2 py-1">
                    <span class="text-[10px] text-slate-500">npm</span>
                    <span class="font-mono text-[11px] font-medium text-red-400 md:text-xs">8.5.0</span>
                    <span class="text-[9px] text-red-500">⚠️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 經典台詞 -->
          <div
            class="mt-6 transition-all delay-500 duration-700"
            :class="problemAnimState >= 4 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-1 rounded-2xl bg-red-500/20 blur"></div>
              <div class="relative rounded-2xl border border-red-500/50 bg-slate-900/90 px-6 py-4 backdrop-blur">
                <div class="text-center text-lg font-bold text-red-400 md:text-xl">
                  「在我的電腦可以跑啊！」
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== SOLUTION VIEW ========== -->
      <div v-if="stepData.view === 'solution'" class="relative flex min-h-0 flex-1 flex-col items-center overflow-hidden p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-4xl flex-col items-center">
          <!-- 流程圖 -->
          <div class="flex w-full items-center justify-center gap-2 md:gap-4">
            <!-- 原始房間 -->
            <div
              class="flex flex-col items-center transition-all duration-700"
              :class="solutionAnimState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="relative h-24 w-24 md:h-32 md:w-32">
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20"></div>
                <div class="flex h-full w-full flex-col items-center justify-center rounded-2xl border-2 border-amber-500/50 bg-slate-900">
                  <div class="text-3xl md:text-4xl">🏠</div>
                  <div class="mt-1 flex gap-1 text-base md:text-lg">
                    <span>🛏️</span><span>💻</span><span>📚</span>
                  </div>
                </div>
              </div>
              <div class="mt-2 text-xs font-medium text-amber-300 md:text-sm">你的開發環境</div>
            </div>

            <!-- 箭頭 1 -->
            <div
              class="flex flex-col items-center transition-all delay-200 duration-500"
              :class="solutionAnimState >= 2 ? 'opacity-100' : 'opacity-0'"
            >
              <svg class="h-6 w-6 text-sky-400 md:h-8 md:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
              <div class="mt-1 text-[10px] font-medium text-sky-400 md:text-xs">打包</div>
            </div>

            <!-- Docker 貨櫃 - 核心視覺 -->
            <div
              class="flex flex-col items-center transition-all delay-300 duration-700"
              :class="solutionAnimState >= 3 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'"
            >
              <div class="relative">
                <!-- 發光效果 -->
                <div class="absolute -inset-4 rounded-3xl bg-sky-500/20 blur-2xl"></div>
                <!-- 貨櫃本體 -->
                <div class="relative h-28 w-28 md:h-36 md:w-36">
                  <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600"></div>
                  <div class="absolute inset-[3px] flex flex-col items-center justify-center rounded-xl bg-slate-900">
                    <!-- Docker Logo -->
                    <svg class="h-10 w-10 text-sky-400 md:h-12 md:w-12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.185.185v1.888c0 .102.084.185.185.185"/>
                    </svg>
                    <div class="mt-1 text-xs font-bold text-sky-400 md:text-sm">Container</div>
                  </div>
                </div>
              </div>
              <div class="mt-2 text-xs font-medium text-sky-300 md:text-sm">Docker 容器</div>
            </div>

            <!-- 箭頭 2 -->
            <div
              class="flex flex-col items-center transition-all delay-400 duration-500"
              :class="solutionAnimState >= 4 ? 'opacity-100' : 'opacity-0'"
            >
              <svg class="h-6 w-6 text-emerald-400 md:h-8 md:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
              <div class="mt-1 text-[10px] font-medium text-emerald-400 md:text-xs">到處跑</div>
            </div>

            <!-- 目標環境 -->
            <div
              class="flex flex-col items-center transition-all delay-500 duration-700"
              :class="solutionAnimState >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="relative h-24 w-24 md:h-32 md:w-32">
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20"></div>
                <div class="flex h-full w-full flex-col items-center justify-center rounded-2xl border-2 border-emerald-500/50 bg-slate-900">
                  <div class="text-3xl md:text-4xl">🏠</div>
                  <div class="mt-1 flex gap-1 text-base md:text-lg">
                    <span>🛏️</span><span>💻</span><span>📚</span>
                  </div>
                  <div class="mt-1 text-[10px] font-bold text-emerald-400 md:text-xs">一模一樣！</div>
                </div>
              </div>
              <div class="mt-2 text-xs font-medium text-emerald-300 md:text-sm">任何電腦</div>
            </div>
          </div>

          <!-- 說明文字 -->
          <div
            class="mt-8 transition-all delay-700 duration-700"
            :class="solutionAnimState >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 opacity-30 blur"></div>
              <div class="relative rounded-2xl border border-sky-500/30 bg-slate-900/90 px-6 py-4 backdrop-blur">
                <div class="text-center">
                  <div class="text-base font-bold text-white md:text-xl">Docker = 把整個執行環境打包成貨櫃</div>
                  <div class="mt-1 text-sm text-sky-300 md:text-base">到哪裡都是一樣的環境！</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CONTAINER VIEW ========== -->
      <div v-if="stepData.view === 'container'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center">
          <!-- 容器 3D 視覺 -->
          <div class="relative">
            <!-- 外層發光 -->
            <div class="absolute -inset-6 rounded-3xl bg-gradient-to-br from-sky-500/20 to-purple-500/20 blur-2xl"></div>

            <!-- 容器主體 -->
            <div class="relative">
              <div class="absolute -inset-[2px] rounded-3xl bg-gradient-to-br from-sky-400 via-blue-500 to-purple-500"></div>
              <div class="relative flex h-56 w-72 flex-col items-center justify-center rounded-3xl bg-slate-900 p-4 md:h-64 md:w-80">
                <!-- Docker 標誌 -->
                <div class="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-lg">
                  <span class="text-2xl">🐳</span>
                </div>

                <div class="mb-4 text-lg font-bold text-white md:text-xl">Container 容器</div>

                <!-- 容器內容 Grid -->
                <div
                  class="grid grid-cols-2 gap-3 transition-all duration-700"
                  :class="showContainerContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
                >
                  <div v-for="(item, i) in [
                    { icon: '📝', name: '程式碼', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30' },
                    { icon: '⚙️', name: '執行環境', color: 'from-sky-500/20 to-blue-500/20 border-sky-500/30' },
                    { icon: '📚', name: '函式庫', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' },
                    { icon: '🔧', name: '設定檔', color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30' },
                  ]"
                  :key="i"
                  class="flex flex-col items-center rounded-xl border bg-gradient-to-br p-3 transition-all hover:scale-105"
                  :class="item.color"
                  :style="{ transitionDelay: `${i * 100}ms` }"
                  >
                    <span class="text-2xl md:text-3xl">{{ item.icon }}</span>
                    <span class="mt-1 text-xs font-medium text-white md:text-sm">{{ item.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 特性卡片 -->
          <div class="mt-8 grid grid-cols-3 gap-3 md:gap-6">
            <div v-for="(item, i) in [
              { icon: '🪶', title: '輕量', desc: '比虛擬機更快', color: 'from-emerald-500 to-green-500' },
              { icon: '🔒', title: '隔離', desc: '互不干擾', color: 'from-purple-500 to-pink-500' },
              { icon: '🚀', title: '可攜', desc: '到處都能跑', color: 'from-amber-500 to-orange-500' },
            ]"
            :key="i"
            class="group relative overflow-hidden rounded-2xl p-[2px] transition-all hover:scale-105"
            :class="showContainerContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            :style="{ transitionDelay: `${800 + i * 150}ms` }"
            >
              <div class="absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-100" :class="item.color"></div>
              <div class="relative rounded-2xl bg-slate-900 p-4 text-center">
                <div class="text-3xl md:text-4xl">{{ item.icon }}</div>
                <div class="mt-2 font-bold text-white md:text-lg">{{ item.title }}</div>
                <div class="mt-1 text-xs text-slate-400 md:text-sm">{{ item.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== LIVEFIT VIEW ========== -->
      <div v-if="stepData.view === 'livefit'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-5xl flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">

          <!-- 左側：Docker 大容器 -->
          <div class="relative flex-1">
            <!-- Docker 容器外框 - 視覺包覆效果 -->
            <div class="relative overflow-hidden rounded-3xl p-[3px]">
              <!-- 漸層邊框動畫 -->
              <div class="absolute inset-0 animate-gradient-rotate bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400"></div>

              <!-- Docker 容器內部 -->
              <div class="relative rounded-3xl bg-slate-900/95 p-4 md:p-6">
                <!-- Docker 標籤 - 容器頂部 -->
                <div class="mb-4 flex items-center gap-3 border-b border-slate-700/50 pb-4">
                  <div class="relative">
                    <div class="absolute -inset-1 rounded-lg bg-sky-500/30 blur-md"></div>
                    <div class="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-xl shadow-lg md:h-12 md:w-12 md:text-2xl">
                      🐳
                    </div>
                  </div>
                  <div>
                    <div class="font-bold text-white md:text-lg">Docker Compose</div>
                    <div class="text-xs text-sky-400/80 md:text-sm">管理多個容器服務</div>
                  </div>
                  <div class="ml-auto flex items-center gap-1.5">
                    <div class="h-2 w-2 animate-pulse-slow rounded-full bg-emerald-400"></div>
                    <span class="text-xs text-emerald-400 md:text-sm">Running</span>
                  </div>
                </div>

                <!-- 三個服務 - 被 Docker 包住 -->
                <div class="relative space-y-3">
                  <!-- 內部連線示意（背景） -->
                  <div class="pointer-events-none absolute inset-0 overflow-hidden">
                    <svg class="h-full w-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.3" />
                          <stop offset="100%" style="stop-color:#0ea5e9;stop-opacity:0.3" />
                        </linearGradient>
                        <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:0.3" />
                          <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:0.3" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <!-- Frontend 容器 -->
                  <button
                    class="group relative w-full overflow-hidden rounded-xl border-2 border-emerald-500/30 bg-slate-800/80 p-3 text-left transition-all hover:border-emerald-400/60 hover:bg-slate-800 md:p-4"
                    :class="activeContainer === 'frontend' ? 'border-emerald-400 bg-emerald-500/10' : ''"
                    @click="toggleContainer('frontend')"
                  >
                    <div class="flex items-center gap-3">
                      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-2xl md:h-12 md:w-12 md:text-3xl">
                        🖥️
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-emerald-400 md:text-lg">frontend 前端介面</span>
                          <span class="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300 md:text-xs">:3000</span>
                        </div>
                        <div class="text-xs text-slate-400 md:text-sm">Vue.js · 使用者介面</div>
                      </div>
                      <div class="text-xs text-slate-500">▼</div>
                    </div>
                    <div
                      class="overflow-hidden transition-all"
                      :class="activeContainer === 'frontend' ? 'mt-2 max-h-16 opacity-100' : 'max-h-0 opacity-0'"
                    >
                      <div class="rounded-lg bg-slate-900/50 p-2 text-xs text-slate-300 md:text-sm">
                        使用者看到的畫面，負責互動與資料呈現
                      </div>
                    </div>
                  </button>

                  <!-- 連線指示 -->
                  <div class="flex items-center justify-center gap-2 py-1">
                    <div class="h-4 w-[2px] bg-gradient-to-b from-emerald-500/50 to-sky-500/50"></div>
                    <span class="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 md:text-xs">API 請求</span>
                    <div class="h-4 w-[2px] bg-gradient-to-b from-emerald-500/50 to-sky-500/50"></div>
                  </div>

                  <!-- Backend 容器 -->
                  <button
                    class="group relative w-full overflow-hidden rounded-xl border-2 border-sky-500/30 bg-slate-800/80 p-3 text-left transition-all hover:border-sky-400/60 hover:bg-slate-800 md:p-4"
                    :class="activeContainer === 'backend' ? 'border-sky-400 bg-sky-500/10' : ''"
                    @click="toggleContainer('backend')"
                  >
                    <div class="flex items-center gap-3">
                      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-2xl md:h-12 md:w-12 md:text-3xl">
                        ⚙️
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-sky-400 md:text-lg">backend 後端伺服器</span>
                          <span class="rounded bg-sky-500/20 px-1.5 py-0.5 font-mono text-[10px] text-sky-300 md:text-xs">:8080</span>
                        </div>
                        <div class="text-xs text-slate-400 md:text-sm">Node.js · 商業邏輯</div>
                      </div>
                      <div class="text-xs text-slate-500">▼</div>
                    </div>
                    <div
                      class="overflow-hidden transition-all"
                      :class="activeContainer === 'backend' ? 'mt-2 max-h-16 opacity-100' : 'max-h-0 opacity-0'"
                    >
                      <div class="rounded-lg bg-slate-900/50 p-2 text-xs text-slate-300 md:text-sm">
                        處理商業邏輯，是系統的大腦中樞
                      </div>
                    </div>
                  </button>

                  <!-- 連線指示 -->
                  <div class="flex items-center justify-center gap-2 py-1">
                    <div class="h-4 w-[2px] bg-gradient-to-b from-sky-500/50 to-amber-500/50"></div>
                    <span class="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 md:text-xs">SQL 查詢</span>
                    <div class="h-4 w-[2px] bg-gradient-to-b from-sky-500/50 to-amber-500/50"></div>
                  </div>

                  <!-- Database 容器 -->
                  <button
                    class="group relative w-full overflow-hidden rounded-xl border-2 border-amber-500/30 bg-slate-800/80 p-3 text-left transition-all hover:border-amber-400/60 hover:bg-slate-800 md:p-4"
                    :class="activeContainer === 'database' ? 'border-amber-400 bg-amber-500/10' : ''"
                    @click="toggleContainer('database')"
                  >
                    <div class="flex items-center gap-3">
                      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-2xl md:h-12 md:w-12 md:text-3xl">
                        🗄️
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-amber-400 md:text-lg">database 資料庫</span>
                          <span class="rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-[10px] text-amber-300 md:text-xs">:5432</span>
                        </div>
                        <div class="text-xs text-slate-400 md:text-sm">PostgreSQL · 資料儲存</div>
                      </div>
                      <div class="text-xs text-slate-500">▼</div>
                    </div>
                    <div
                      class="overflow-hidden transition-all"
                      :class="activeContainer === 'database' ? 'mt-2 max-h-16 opacity-100' : 'max-h-0 opacity-0'"
                    >
                      <div class="rounded-lg bg-slate-900/50 p-2 text-xs text-slate-300 md:text-sm">
                        儲存所有資料：會員、訂單、商品資訊
                      </div>
                    </div>
                  </button>
                </div>

                <!-- Docker 容器底部標示 -->
                <div class="mt-4 flex items-center justify-center gap-2 border-t border-slate-700/50 pt-3">
                  <div class="h-1 w-1 rounded-full bg-sky-400"></div>
                  <span class="text-xs text-slate-500 md:text-sm">所有服務在同一個 Docker 網路中運行</span>
                  <div class="h-1 w-1 rounded-full bg-sky-400"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右側：Terminal 指令 -->
          <div class="w-full shrink-0 md:w-72">
            <div class="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-sky-500/10">
              <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-4 py-2">
                <div class="h-3 w-3 rounded-full bg-red-500"></div>
                <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div class="h-3 w-3 rounded-full bg-green-500"></div>
                <span class="ml-2 text-xs text-slate-400">Terminal</span>
              </div>
              <div class="p-4">
                <div class="flex items-center gap-2 font-mono text-sm md:text-base">
                  <span class="text-emerald-400">$</span>
                  <span class="text-white">docker compose up</span>
                  <span class="animate-blink text-emerald-400">▋</span>
                </div>
                <div class="mt-3 space-y-1 text-xs md:text-sm">
                  <div class="flex items-center gap-2 text-emerald-400">
                    <span>✓</span>
                    <span class="text-slate-300">Container <span class="text-emerald-400">frontend</span> started</span>
                  </div>
                  <div class="flex items-center gap-2 text-sky-400">
                    <span>✓</span>
                    <span class="text-slate-300">Container <span class="text-sky-400">backend</span> started</span>
                  </div>
                  <div class="flex items-center gap-2 text-amber-400">
                    <span>✓</span>
                    <span class="text-slate-300">Container <span class="text-amber-400">database</span> started</span>
                  </div>
                </div>
                <div class="mt-4 rounded-lg bg-sky-500/10 p-2 text-center">
                  <div class="text-xs text-sky-300 md:text-sm">🎉 一個指令啟動全部！</div>
                </div>
              </div>
            </div>

            <!-- 重點提示 -->
            <div class="mt-4 rounded-xl border border-sky-500/30 bg-sky-500/10 p-3">
              <div class="mb-1 text-xs font-bold text-sky-400 md:text-sm">💡 Docker Compose 的好處</div>
              <ul class="space-y-1 text-xs text-slate-300 md:text-sm">
                <li>• 統一管理所有服務</li>
                <li>• 服務間自動建立網路連線</li>
                <li>• 環境一致，不怕「在我電腦可以跑」</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </InteractiveSlideTemplate>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-20px) translateX(10px); }
  50% { transform: translateY(0) translateX(20px); }
  75% { transform: translateY(20px) translateX(10px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-30px) translateX(-20px); }
}

@keyframes float-slower {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(20px) translateX(30px); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px) rotate(-5deg); }
  75% { transform: translateX(5px) rotate(5deg); }
}

@keyframes data-flow {
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(40px); opacity: 0; }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@keyframes gradient-rotate {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-float { animation: float 8s ease-in-out infinite; }
.animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
.animate-float-slower { animation: float-slower 15s ease-in-out infinite; }
.animate-shake { animation: shake 0.5s ease-in-out infinite; }
.animate-data-flow { animation: data-flow 1s ease-out infinite; }
.animate-blink { animation: blink 1s step-end infinite; }
.animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
.animate-gradient-rotate {
  background-size: 200% 200%;
  animation: gradient-rotate 3s ease infinite;
}
</style>
