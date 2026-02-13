<script setup lang="ts">
/**
 * API 介紹互動簡報：什麼是 API？
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
type StepView = 'intro' | 'compare' | 'json' | 'livefit' | 'summary'

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
    title: 'API 也是一種網路請求',
    desc: 'API 的全名是 Application Programming Interface（應用程式介面）。其實它就是網路請求，只是用途不太一樣。',
  },
  {
    id: 1,
    view: 'compare',
    title: '差別在哪？回傳什麼！',
    desc: '一般網址回傳 HTML 網頁（給人看），API 回傳 JSON 資料（給程式用）。',
  },
  {
    id: 2,
    view: 'json',
    title: 'JSON 長什麼樣？',
    desc: 'JSON 是一種資料格式，用大括號和中括號組織資料。前端拿到 JSON 後，再把它渲染成漂亮的畫面。',
  },
  {
    id: 3,
    view: 'livefit',
    title: 'LiveFit 的 API',
    desc: 'LiveFit 設計了超過 30 個 API！每個功能背後都有對應的 API，學會 API 你就能串接各種服務。',
  },
  {
    id: 4,
    view: 'summary',
    title: 'API 就這麼簡單',
    desc: '記住：API 就是網路請求，只是回傳 JSON 資料給程式用，而不是 HTML 網頁給人看。',
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

  if (step === 'compare') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
    setTimeout(() => { animState.value = 4 }, 1400)
  }

  if (step === 'json') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
  }

  if (step === 'livefit') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 500)
    setTimeout(() => { animState.value = 3 }, 800)
    setTimeout(() => { animState.value = 4 }, 1100)
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
    title="什麼是 API？"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="emerald"
    @prev="prevStep"
    @next="nextStep"
    @complete="handleComplete"
  >
    <!-- 自訂 Header Icon -->
    <template #icon>
      <div class="relative">
        <span class="text-2xl md:text-3xl">🔌</span>
        <div class="absolute -right-1 -top-1 h-2 w-2 animate-pulse-slow rounded-full bg-emerald-400"></div>
      </div>
    </template>

    <!-- 主要內容區 -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- Animated background particles -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="animate-float-slow absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div class="animate-float-slower absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-sky-500/10 blur-3xl"></div>
      </div>

      <!-- ========== INTRO VIEW ========== -->
      <div v-if="stepData.view === 'intro'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center">
          <!-- API 名詞卡片 -->
          <div
            class="transition-all duration-700"
            :class="animState >= 1 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-gradient-to-r from-emerald-500/30 to-sky-500/30 blur-2xl"></div>
              <div class="relative rounded-3xl border-2 border-emerald-500/50 bg-slate-900 px-8 py-6 text-center md:px-12 md:py-8">
                <div class="text-4xl md:text-5xl">🔌</div>
                <div class="mt-3 bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
                  API
                </div>
                <div class="mt-2 text-xs text-slate-400 md:text-sm">Application Programming Interface</div>
                <div class="text-xs text-slate-500 md:text-sm">應用程式介面</div>
              </div>
            </div>
          </div>

          <!-- 關係說明 -->
          <div
            class="mt-6 flex items-center gap-4 transition-all delay-300 duration-700"
            :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2">
              <div class="text-sm font-bold text-purple-400 md:text-base">網路請求</div>
            </div>
            <span class="text-2xl text-slate-400">=</span>
            <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
              <div class="text-sm font-bold text-emerald-400 md:text-base">API</div>
            </div>
            <span class="text-slate-500">？</span>
          </div>

          <!-- 說明 -->
          <div
            class="mt-6 transition-all delay-500 duration-700"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-2xl border border-emerald-500/30 bg-slate-900/90 px-6 py-4 text-center">
              <div class="text-sm text-slate-400 md:text-base">
                API 就是網路請求，差別在於<span class="font-bold text-emerald-400">「回傳什麼」</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== COMPARE VIEW ========== -->
      <div v-if="stepData.view === 'compare'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- 對比卡片 -->
          <div class="flex flex-col gap-4 md:flex-row md:gap-8">
            <!-- 一般網址 -->
            <div
              class="transition-all duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="relative">
                <div class="absolute -inset-2 rounded-2xl bg-sky-500/20 blur-lg"></div>
                <div class="relative w-64 overflow-hidden rounded-2xl border-2 border-sky-500/50 bg-slate-900 md:w-72">
                  <!-- Header -->
                  <div class="border-b border-slate-700 bg-slate-800 px-4 py-2">
                    <div class="text-sm font-bold text-sky-400 md:text-base">一般網址請求</div>
                  </div>
                  <!-- Content -->
                  <div class="p-4">
                    <div class="rounded-lg bg-slate-800 p-3 font-mono text-xs text-slate-300 md:text-sm">
                      GET https://livefit.com/coaches
                    </div>
                    <div
                      class="mt-3 transition-all delay-200 duration-500"
                      :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"
                    >
                      <div class="text-xs text-slate-500 md:text-sm">回傳：</div>
                      <div class="mt-1 flex items-center gap-2">
                        <span class="text-2xl">📄</span>
                        <span class="font-bold text-sky-400">HTML 網頁</span>
                      </div>
                      <div class="mt-1 text-xs text-slate-500">（給人看）</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- VS -->
            <div
              class="flex items-center justify-center transition-all delay-300 duration-500"
              :class="animState >= 3 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
            >
              <div class="rounded-full bg-slate-800 px-4 py-2 text-lg font-bold text-slate-400 md:text-xl">
                VS
              </div>
            </div>

            <!-- API -->
            <div
              class="transition-all delay-200 duration-700"
              :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="relative">
                <div class="absolute -inset-2 rounded-2xl bg-emerald-500/20 blur-lg"></div>
                <div class="relative w-64 overflow-hidden rounded-2xl border-2 border-emerald-500/50 bg-slate-900 md:w-72">
                  <!-- Header -->
                  <div class="border-b border-slate-700 bg-slate-800 px-4 py-2">
                    <div class="text-sm font-bold text-emerald-400 md:text-base">API 請求</div>
                  </div>
                  <!-- Content -->
                  <div class="p-4">
                    <div class="rounded-lg bg-slate-800 p-3 font-mono text-xs text-slate-300 md:text-sm">
                      GET https://livefit.com<span class="text-emerald-400">/api</span>/coaches
                    </div>
                    <div
                      class="mt-3 transition-all delay-400 duration-500"
                      :class="animState >= 3 ? 'opacity-100' : 'opacity-0'"
                    >
                      <div class="text-xs text-slate-500 md:text-sm">回傳：</div>
                      <div class="mt-1 flex items-center gap-2">
                        <span class="text-2xl">📦</span>
                        <span class="font-bold text-emerald-400">JSON 資料</span>
                      </div>
                      <div class="mt-1 text-xs text-slate-500">（給程式用）</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 重點 -->
          <div
            class="transition-all delay-500 duration-700"
            :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 opacity-30 blur"></div>
              <div class="relative rounded-2xl border border-emerald-500/30 bg-slate-900/90 px-6 py-4 text-center">
                <div class="text-sm text-slate-400 md:text-base">
                  差別只在於<span class="font-bold text-emerald-400">回傳什麼</span>：HTML 還是 JSON
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== JSON VIEW ========== -->
      <div v-if="stepData.view === 'json'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- JSON 範例 -->
          <div
            class="transition-all duration-700"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-emerald-500/20 blur-xl"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-emerald-500/50 bg-slate-900">
                <!-- Header -->
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-4 py-2">
                  <div class="h-3 w-3 rounded-full bg-red-500"></div>
                  <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div class="h-3 w-3 rounded-full bg-green-500"></div>
                  <span class="ml-2 text-xs text-slate-400">JSON Response</span>
                </div>
                <!-- JSON Code -->
                <div class="p-4">
                  <pre class="text-xs md:text-sm"><code class="text-slate-300">{
  <span class="text-emerald-400">"coaches"</span>: [
    {
      <span class="text-sky-400">"name"</span>: <span class="text-amber-400">"王小明"</span>,
      <span class="text-sky-400">"skill"</span>: <span class="text-amber-400">"瑜珈"</span>
    },
    {
      <span class="text-sky-400">"name"</span>: <span class="text-amber-400">"李小華"</span>,
      <span class="text-sky-400">"skill"</span>: <span class="text-amber-400">"重訓"</span>
    }
  ]
}</code></pre>
                </div>
              </div>
            </div>
          </div>

          <!-- 對應畫面 -->
          <div
            class="flex items-center gap-4 transition-all delay-300 duration-700"
            :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
          >
            <svg class="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
            <span class="text-sm text-slate-400 md:text-base">前端渲染成</span>
            <svg class="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </div>

          <!-- 渲染後的畫面 -->
          <div
            class="transition-all delay-500 duration-700"
            :class="animState >= 3 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
          >
            <div class="flex gap-3 md:gap-4">
              <!-- 教練卡片 1 -->
              <div class="w-32 rounded-xl border border-slate-700 bg-slate-800 p-3 md:w-40 md:p-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 md:h-16 md:w-16">
                  <span class="text-2xl md:text-3xl">👨‍🏫</span>
                </div>
                <div class="mt-2 font-bold text-white">王小明</div>
                <div class="text-xs text-emerald-400">瑜珈</div>
              </div>
              <!-- 教練卡片 2 -->
              <div class="w-32 rounded-xl border border-slate-700 bg-slate-800 p-3 md:w-40 md:p-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 md:h-16 md:w-16">
                  <span class="text-2xl md:text-3xl">👩‍🏫</span>
                </div>
                <div class="mt-2 font-bold text-white">李小華</div>
                <div class="text-xs text-sky-400">重訓</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== LIVEFIT VIEW ========== -->
      <div v-if="stepData.view === 'livefit'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center">
          <!-- 標題 -->
          <div
            class="mb-4 text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="text-2xl font-bold text-white md:text-3xl">LiveFit 的 API</div>
            <div class="mt-1 text-sm text-emerald-400 md:text-base">超過 30 個 API！</div>
          </div>

          <!-- API 分類 -->
          <div class="w-full space-y-3">
            <!-- 使用者 API -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900/80 p-4 transition-all duration-500"
              :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl">👤</span>
                <div class="flex-1">
                  <div class="font-bold text-white">使用者</div>
                  <div class="text-xs text-slate-400">註冊、登入、登出、取得個人資料...</div>
                </div>
                <div class="rounded-full bg-sky-500/20 px-2 py-1 text-xs text-sky-400">6+ APIs</div>
              </div>
            </div>

            <!-- 教練 API -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900/80 p-4 transition-all delay-100 duration-500"
              :class="animState >= 3 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl">👨‍🏫</span>
                <div class="flex-1">
                  <div class="font-bold text-white">教練</div>
                  <div class="text-xs text-slate-400">取得列表、新增課程、修改課程...</div>
                </div>
                <div class="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400">8+ APIs</div>
              </div>
            </div>

            <!-- 課程 API -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900/80 p-4 transition-all delay-200 duration-500"
              :class="animState >= 4 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl">📚</span>
                <div class="flex-1">
                  <div class="font-bold text-white">課程</div>
                  <div class="text-xs text-slate-400">取得列表、預約、取消、查詢紀錄...</div>
                </div>
                <div class="rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-400">10+ APIs</div>
              </div>
            </div>

            <!-- 更多 API -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900/80 p-4 transition-all delay-300 duration-500"
              :class="animState >= 4 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl">⚙️</span>
                <div class="flex-1">
                  <div class="font-bold text-white">其他功能</div>
                  <div class="text-xs text-slate-400">堂數方案、購買紀錄、管理員功能...</div>
                </div>
                <div class="rounded-full bg-amber-500/20 px-2 py-1 text-xs text-amber-400">6+ APIs</div>
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
              <div class="absolute -inset-6 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-sky-500/20 blur-2xl"></div>
              <div class="relative overflow-hidden rounded-3xl border-2 border-emerald-500/50 bg-slate-900 p-6 md:p-8">
                <div class="text-center">
                  <div class="text-5xl md:text-6xl">🔌</div>
                  <div class="mt-4 text-xl font-bold text-white md:text-2xl">API = 網路請求</div>
                  <div class="mt-1 text-sm text-slate-400 md:text-base">只是回傳 JSON 給程式用</div>
                </div>

                <!-- 對比表格 -->
                <div
                  class="mt-6 overflow-hidden rounded-xl border border-slate-700 transition-all delay-300 duration-500"
                  :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
                >
                  <table class="w-full text-sm">
                    <thead class="bg-slate-800">
                      <tr>
                        <th class="px-4 py-2 text-left text-slate-400"></th>
                        <th class="px-4 py-2 text-center text-sky-400">一般網址</th>
                        <th class="px-4 py-2 text-center text-emerald-400">API</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="border-t border-slate-700">
                        <td class="px-4 py-2 text-slate-400">回傳</td>
                        <td class="px-4 py-2 text-center text-white">HTML</td>
                        <td class="px-4 py-2 text-center text-white">JSON</td>
                      </tr>
                      <tr class="border-t border-slate-700">
                        <td class="px-4 py-2 text-slate-400">給誰</td>
                        <td class="px-4 py-2 text-center text-white">人看</td>
                        <td class="px-4 py-2 text-center text-white">程式用</td>
                      </tr>
                    </tbody>
                  </table>
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
                🎉 學會 API，你就能串接各種網路服務了！
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
