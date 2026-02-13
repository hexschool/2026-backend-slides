<script setup lang="ts">
/**
 * 網路請求互動簡報：什麼是網路請求？
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
type StepView = 'intro' | 'request-response' | 'examples' | 'summary'

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
    title: '這個過程有個名字',
    desc: '剛剛那個「電腦跟伺服器一來一往」的過程，就叫做「網路請求」(Network Request)。',
  },
  {
    id: 1,
    view: 'request-response',
    title: 'Request 與 Response',
    desc: '網路請求由兩部分組成：你發出的「Request（請求）」和伺服器回傳的「Response（回應）」。',
  },
  {
    id: 2,
    view: 'examples',
    title: '你每天都在發網路請求！',
    desc: '其實你每天上網都在發網路請求，只是你不知道而已。打開 Google、看 YouTube、滑 IG... 全都是！',
  },
  {
    id: 3,
    view: 'summary',
    title: '網路請求就這麼簡單',
    desc: '只要記住：你發 Request、伺服器回 Response，這就是網路請求的核心概念！',
  },
]

// === 狀態 ===
const currentStep = ref(0)
const isTransitioning = ref(false)
const mounted = ref(false)

// 動畫狀態
const animState = ref(0)

const stepData = computed(() => STEPS[currentStep.value])

onMounted(() => {
  mounted.value = true
  triggerStepAnimation()
})

// 監聽步驟變化，觸發動畫
watch(currentStep, () => {
  isTransitioning.value = true
  animState.value = 0

  setTimeout(() => {
    isTransitioning.value = false
    triggerStepAnimation()
  }, 100)
})

function triggerStepAnimation() {
  const step = stepData.value.view

  if (step === 'intro') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
  }

  if (step === 'request-response') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
    setTimeout(() => { animState.value = 4 }, 1400)
  }

  if (step === 'examples') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 500)
    setTimeout(() => { animState.value = 3 }, 800)
    setTimeout(() => { animState.value = 4 }, 1100)
    setTimeout(() => { animState.value = 5 }, 1400)
  }

  if (step === 'summary') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
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
</script>

<template>
  <InteractiveSlideTemplate
    title="什麼是網路請求？"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="purple"
    @prev="prevStep"
    @next="nextStep"
    @complete="handleComplete"
  >
    <!-- 自訂 Header Icon -->
    <template #icon>
      <div class="relative">
        <span class="text-2xl md:text-3xl">📡</span>
        <div class="absolute -right-1 -top-1 h-2 w-2 animate-pulse-slow rounded-full bg-purple-400"></div>
      </div>
    </template>

    <!-- 主要內容區 -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- Animated background particles -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="animate-float-slow absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div class="animate-float-slower absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-sky-500/10 blur-3xl"></div>
      </div>

      <!-- ========== INTRO VIEW ========== -->
      <div v-if="stepData.view === 'intro'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center">
          <!-- 名詞卡片 -->
          <div
            class="transition-all duration-700"
            :class="animState >= 1 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-500/30 to-sky-500/30 blur-2xl"></div>
              <div class="relative rounded-3xl border-2 border-purple-500/50 bg-slate-900 px-8 py-6 text-center md:px-12 md:py-8">
                <div class="text-sm text-slate-400 md:text-base">這個過程叫做</div>
                <div class="mt-2 bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
                  網路請求
                </div>
                <div class="mt-2 font-mono text-sm text-slate-500 md:text-base">Network Request</div>
              </div>
            </div>
          </div>

          <!-- 視覺化示意 -->
          <div
            class="mt-8 flex items-center gap-4 transition-all delay-300 duration-700 md:gap-8"
            :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <!-- 你的電腦 -->
            <div class="flex flex-col items-center">
              <div class="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-sky-500/50 bg-slate-900 md:h-20 md:w-20">
                <span class="text-3xl md:text-4xl">💻</span>
              </div>
              <div class="mt-1 text-xs text-sky-300 md:text-sm">你</div>
            </div>

            <!-- 雙向箭頭 -->
            <div class="flex flex-col items-center gap-1">
              <svg class="h-5 w-5 text-purple-400 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
              <svg class="h-5 w-5 rotate-180 text-emerald-400 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </div>

            <!-- 伺服器 -->
            <div class="flex flex-col items-center">
              <div class="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-emerald-500/50 bg-slate-900 md:h-20 md:w-20">
                <span class="text-3xl md:text-4xl">🖥️</span>
              </div>
              <div class="mt-1 text-xs text-emerald-300 md:text-sm">伺服器</div>
            </div>
          </div>

          <!-- 說明 -->
          <div
            class="mt-6 transition-all delay-500 duration-700"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-2xl border border-purple-500/30 bg-slate-900/90 px-6 py-4 text-center">
              <div class="text-sm text-slate-400 md:text-base">
                電腦和伺服器之間「<span class="font-bold text-purple-400">一來一往</span>」的溝通過程
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== REQUEST-RESPONSE VIEW ========== -->
      <div v-if="stepData.view === 'request-response'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- Request 和 Response 對比 -->
          <div class="flex items-start gap-4 md:gap-8">
            <!-- Request -->
            <div
              class="flex flex-col items-center transition-all duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="relative">
                <div class="absolute -inset-2 rounded-2xl bg-sky-500/20 blur-lg"></div>
                <div class="relative flex h-28 w-36 flex-col items-center justify-center rounded-2xl border-2 border-sky-500 bg-slate-900 p-4 md:h-32 md:w-44">
                  <span class="text-4xl md:text-5xl">📤</span>
                  <div class="mt-2 text-lg font-bold text-sky-400 md:text-xl">Request</div>
                  <div class="text-xs text-slate-400 md:text-sm">請求</div>
                </div>
              </div>
              <div
                class="mt-4 max-w-36 text-center text-xs text-slate-400 transition-all delay-200 duration-500 md:max-w-44 md:text-sm"
                :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"
              >
                你發出的「需求」<br/>
                (我要看這個網頁)
              </div>
            </div>

            <!-- 雙向箭頭 -->
            <div
              class="mt-12 flex flex-col items-center gap-2 transition-all delay-300 duration-500"
              :class="animState >= 3 ? 'opacity-100' : 'opacity-0'"
            >
              <svg class="h-8 w-8 text-sky-400 md:h-10 md:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
              <svg class="h-8 w-8 rotate-180 text-emerald-400 md:h-10 md:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </div>

            <!-- Response -->
            <div
              class="flex flex-col items-center transition-all delay-200 duration-700"
              :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="relative">
                <div class="absolute -inset-2 rounded-2xl bg-emerald-500/20 blur-lg"></div>
                <div class="relative flex h-28 w-36 flex-col items-center justify-center rounded-2xl border-2 border-emerald-500 bg-slate-900 p-4 md:h-32 md:w-44">
                  <span class="text-4xl md:text-5xl">📥</span>
                  <div class="mt-2 text-lg font-bold text-emerald-400 md:text-xl">Response</div>
                  <div class="text-xs text-slate-400 md:text-sm">回應</div>
                </div>
              </div>
              <div
                class="mt-4 max-w-36 text-center text-xs text-slate-400 transition-all delay-400 duration-500 md:max-w-44 md:text-sm"
                :class="animState >= 3 ? 'opacity-100' : 'opacity-0'"
              >
                伺服器回傳的「內容」<br/>
                (這是你要的網頁)
              </div>
            </div>
          </div>

          <!-- 總結公式 -->
          <div
            class="transition-all delay-500 duration-700"
            :class="animState >= 4 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 opacity-30 blur"></div>
              <div class="relative rounded-2xl border border-purple-500/30 bg-slate-900/90 px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-3 text-lg font-bold md:text-xl">
                  <span class="text-sky-400">Request</span>
                  <span class="text-slate-400">+</span>
                  <span class="text-emerald-400">Response</span>
                  <span class="text-slate-400">=</span>
                  <span class="text-purple-400">網路請求</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== EXAMPLES VIEW ========== -->
      <div v-if="stepData.view === 'examples'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center">
          <!-- 標題 -->
          <div
            class="mb-4 text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="text-lg font-bold text-white md:text-xl">你每天都在發網路請求！</div>
          </div>

          <!-- 範例列表 -->
          <div class="w-full space-y-3">
            <!-- 範例 1: Google -->
            <div
              class="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900/80 p-3 transition-all duration-500 md:p-4"
              :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
                <span class="text-2xl">🔍</span>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium text-white md:text-base">打開 Google 首頁</div>
                <div class="font-mono text-xs text-slate-400">GET https://google.com</div>
              </div>
            </div>

            <!-- 範例 2: YouTube -->
            <div
              class="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900/80 p-3 transition-all delay-100 duration-500 md:p-4"
              :class="animState >= 3 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600">
                <span class="text-2xl">▶️</span>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium text-white md:text-base">看 YouTube 影片</div>
                <div class="font-mono text-xs text-slate-400">GET https://youtube.com/watch?v=xxx</div>
              </div>
            </div>

            <!-- 範例 3: IG -->
            <div
              class="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900/80 p-3 transition-all delay-200 duration-500 md:p-4"
              :class="animState >= 4 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-500">
                <span class="text-2xl">📷</span>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium text-white md:text-base">滑 IG 動態</div>
                <div class="font-mono text-xs text-slate-400">GET https://instagram.com/api/feed</div>
              </div>
            </div>

            <!-- 範例 4: 登入 -->
            <div
              class="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900/80 p-3 transition-all delay-300 duration-500 md:p-4"
              :class="animState >= 5 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600">
                <span class="text-2xl">🔐</span>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium text-white md:text-base">登入網站</div>
                <div class="font-mono text-xs text-slate-400">POST https://xxx.com/login</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== SUMMARY VIEW ========== -->
      <div v-if="stepData.view === 'summary'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center">
          <!-- 核心概念 -->
          <div
            class="transition-all duration-700"
            :class="animState >= 1 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-6 rounded-3xl bg-gradient-to-r from-purple-500/20 to-sky-500/20 blur-2xl"></div>
              <div class="relative overflow-hidden rounded-3xl border-2 border-purple-500/50 bg-slate-900 p-6 md:p-8">
                <div class="text-center">
                  <div class="text-5xl md:text-6xl">📡</div>
                  <div class="mt-4 text-xl font-bold text-white md:text-2xl">網路請求</div>
                  <div class="mt-2 text-sm text-slate-400 md:text-base">Network Request</div>
                </div>

                <!-- 公式 -->
                <div
                  class="mt-6 rounded-xl bg-slate-800/80 p-4 transition-all delay-300 duration-500"
                  :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
                >
                  <div class="flex items-center justify-center gap-3 text-sm md:text-base">
                    <div class="flex flex-col items-center">
                      <span class="text-2xl">💻</span>
                      <span class="text-xs text-sky-300">你</span>
                    </div>
                    <div class="flex flex-col items-center">
                      <span class="text-sky-400">發 Request</span>
                      <svg class="h-4 w-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </div>
                    <div class="flex flex-col items-center">
                      <span class="text-2xl">🖥️</span>
                      <span class="text-xs text-emerald-300">伺服器</span>
                    </div>
                    <div class="flex flex-col items-center">
                      <span class="text-emerald-400">回 Response</span>
                      <svg class="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </div>
                    <div class="flex flex-col items-center">
                      <span class="text-2xl">💻</span>
                      <span class="text-xs text-sky-300">你</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 重點提示 -->
          <div
            class="mt-6 transition-all delay-500 duration-700"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 text-center">
              <div class="text-sm text-emerald-300 md:text-base">
                💡 記住這個概念，等下學 API 會更容易理解！
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </InteractiveSlideTemplate>
</template>

<style scoped>
@keyframes float-slow {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-30px) translateX(-20px); }
}

@keyframes float-slower {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(20px) translateX(30px); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
.animate-float-slower { animation: float-slower 15s ease-in-out infinite; }
.animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
</style>
