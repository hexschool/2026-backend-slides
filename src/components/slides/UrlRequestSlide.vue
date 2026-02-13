<script setup lang="ts">
/**
 * 網址請求互動簡報：當你輸入網址，發生了什麼事？
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
type StepView = 'intro' | 'dns' | 'connect' | 'response' | 'summary'

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
    title: '你每天都在做這件事',
    desc: '當你在瀏覽器輸入 https://www.google.com 然後按下 Enter，背後發生了一連串的事情...',
  },
  {
    id: 1,
    view: 'dns',
    title: '第一步：查電話號碼',
    desc: '網址就像「店名」，但電腦需要的是「地址」。DNS 就像電話簿，幫你把網址翻譯成 IP 位址。',
  },
  {
    id: 2,
    view: 'connect',
    title: '第二步：建立連線',
    desc: '找到地址後，你的電腦會跟伺服器「打招呼」，建立連線通道。',
  },
  {
    id: 3,
    view: 'response',
    title: '第三步：伺服器回應',
    desc: '伺服器收到請求後，會把你要的內容（網頁、圖片、資料）回傳給你。',
  },
  {
    id: 4,
    view: 'summary',
    title: '完整流程一覽',
    desc: '從輸入網址到看到網頁，這一連串的動作就叫做「網路請求」！',
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

  if (step === 'dns') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
    setTimeout(() => { animState.value = 4 }, 1400)
  }

  if (step === 'connect') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
  }

  if (step === 'response') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
    setTimeout(() => { animState.value = 4 }, 1400)
  }

  if (step === 'summary') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 500)
    setTimeout(() => { animState.value = 3 }, 800)
    setTimeout(() => { animState.value = 4 }, 1100)
    setTimeout(() => { animState.value = 5 }, 1400)
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
    title="網址背後的秘密"
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
        <span class="text-2xl md:text-3xl">🌐</span>
        <div class="absolute -right-1 -top-1 h-2 w-2 animate-pulse-slow rounded-full bg-sky-400"></div>
      </div>
    </template>

    <!-- 主要內容區 -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- Animated background particles -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="animate-float-slow absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"></div>
        <div class="animate-float-slower absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-purple-500/10 blur-3xl"></div>
      </div>

      <!-- ========== INTRO VIEW ========== -->
      <div v-if="stepData.view === 'intro'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center">
          <!-- 瀏覽器畫面 -->
          <div
            class="transition-all duration-700"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-sky-500/20 blur-xl"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 shadow-2xl">
                <!-- 瀏覽器頂部 -->
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-4 py-2">
                  <div class="flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <!-- 網址列 -->
                  <div class="ml-2 flex flex-1 items-center rounded-lg bg-slate-700 px-3 py-1.5">
                    <span class="text-emerald-400">🔒</span>
                    <span
                      class="ml-2 font-mono text-sm text-white transition-all duration-500 md:text-base"
                      :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"
                    >
                      https://www.google.com
                    </span>
                    <span
                      class="ml-1 animate-blink text-sky-400"
                      :class="animState >= 2 && animState < 3 ? 'opacity-100' : 'opacity-0'"
                    >|</span>
                  </div>
                </div>
                <!-- 瀏覽器內容 -->
                <div class="flex h-40 w-72 items-center justify-center bg-slate-900 md:h-48 md:w-96">
                  <div
                    class="text-center transition-all duration-500"
                    :class="animState >= 3 ? 'opacity-100' : 'opacity-0'"
                  >
                    <div class="text-4xl md:text-5xl">🤔</div>
                    <div class="mt-2 text-sm text-slate-400 md:text-base">然後呢？</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 提示文字 -->
          <div
            class="mt-6 transition-all duration-700"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-2xl border border-sky-500/30 bg-slate-900/90 px-6 py-4 text-center">
              <div class="text-lg font-bold text-white md:text-xl">按下 Enter 之後...</div>
              <div class="mt-1 text-sm text-sky-300 md:text-base">背後發生了一連串的魔法 ✨</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== DNS VIEW ========== -->
      <div v-if="stepData.view === 'dns'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- 流程圖 -->
          <div class="flex items-center gap-4 md:gap-8">
            <!-- 你的電腦 -->
            <div
              class="flex flex-col items-center transition-all duration-700"
              :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="relative">
                <div class="absolute -inset-2 rounded-2xl bg-sky-500/20 blur-lg"></div>
                <div class="relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-sky-500/50 bg-slate-900 md:h-24 md:w-24">
                  <span class="text-4xl md:text-5xl">💻</span>
                </div>
              </div>
              <div class="mt-2 text-xs font-medium text-sky-300 md:text-sm">你的電腦</div>
            </div>

            <!-- 箭頭 + 問號 -->
            <div
              class="flex flex-col items-center transition-all delay-200 duration-500"
              :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"
            >
              <div class="rounded-lg bg-amber-500/20 px-2 py-1 text-xs text-amber-300">
                google.com 在哪？
              </div>
              <svg class="mt-1 h-6 w-6 text-amber-400 md:h-8 md:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </div>

            <!-- DNS 伺服器 -->
            <div
              class="flex flex-col items-center transition-all delay-300 duration-700"
              :class="animState >= 3 ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'"
            >
              <div class="relative">
                <div class="absolute -inset-2 rounded-2xl bg-amber-500/20 blur-lg"></div>
                <div class="relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-amber-500/50 bg-slate-900 md:h-24 md:w-24">
                  <span class="text-4xl md:text-5xl">📖</span>
                </div>
              </div>
              <div class="mt-2 text-xs font-medium text-amber-300 md:text-sm">DNS 伺服器</div>
              <div class="text-[10px] text-slate-500 md:text-xs">（電話簿）</div>
            </div>
          </div>

          <!-- DNS 回應 -->
          <div
            class="flex items-center gap-4 transition-all duration-700 md:gap-8"
            :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="w-20 md:w-24"></div>
            <div class="flex flex-col items-center">
              <svg class="h-6 w-6 rotate-180 text-emerald-400 md:h-8 md:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
              <div class="mt-1 rounded-lg bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">
                142.250.185.78
              </div>
            </div>
            <div class="w-20 md:w-24"></div>
          </div>

          <!-- 比喻說明 -->
          <div
            class="transition-all duration-700"
            :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-2xl border border-amber-500/30 bg-slate-900/90 px-6 py-4 text-center">
              <div class="text-sm text-slate-400 md:text-base">
                就像你要找「麥當勞」，但外送員需要的是<span class="font-bold text-amber-400">「地址」</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CONNECT VIEW ========== -->
      <div v-if="stepData.view === 'connect'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- 連線動畫 -->
          <div class="flex items-center gap-6 md:gap-12">
            <!-- 你的電腦 -->
            <div
              class="flex flex-col items-center transition-all duration-700"
              :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="relative">
                <div class="absolute -inset-2 rounded-2xl bg-sky-500/20 blur-lg"></div>
                <div class="relative flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-sky-500/50 bg-slate-900 md:h-28 md:w-28">
                  <span class="text-5xl md:text-6xl">💻</span>
                </div>
              </div>
              <div class="mt-2 text-sm font-medium text-sky-300">你的電腦</div>
            </div>

            <!-- 連線動畫 -->
            <div
              class="flex flex-col items-center transition-all delay-200 duration-500"
              :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"
            >
              <div class="relative h-2 w-24 overflow-hidden rounded-full bg-slate-700 md:w-32">
                <div
                  class="absolute h-full w-8 animate-data-flow rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"
                ></div>
              </div>
              <div class="mt-2 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs text-emerald-300 md:text-sm">
                🤝 建立連線中...
              </div>
            </div>

            <!-- 伺服器 -->
            <div
              class="flex flex-col items-center transition-all delay-300 duration-700"
              :class="animState >= 3 ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'"
            >
              <div class="relative">
                <div class="absolute -inset-2 rounded-2xl bg-emerald-500/20 blur-lg"></div>
                <div class="relative flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-emerald-500/50 bg-slate-900 md:h-28 md:w-28">
                  <span class="text-5xl md:text-6xl">🖥️</span>
                </div>
              </div>
              <div class="mt-2 text-sm font-medium text-emerald-300">Google 伺服器</div>
            </div>
          </div>

          <!-- 說明 -->
          <div
            class="transition-all duration-700"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-2xl border border-emerald-500/30 bg-slate-900/90 px-6 py-4 text-center">
              <div class="text-sm text-slate-400 md:text-base">
                電腦跟伺服器<span class="font-bold text-emerald-400">「三次握手」</span>確認連線
              </div>
              <div class="mt-1 text-xs text-slate-500">
                (就像打電話：喂？喂！聽得到嗎？聽得到！)
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== RESPONSE VIEW ========== -->
      <div v-if="stepData.view === 'response'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- 請求與回應 -->
          <div class="flex items-start gap-6 md:gap-12">
            <!-- 你的電腦 -->
            <div
              class="flex flex-col items-center transition-all duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-sky-500/50 bg-slate-900 md:h-24 md:w-24">
                <span class="text-4xl md:text-5xl">💻</span>
              </div>
              <div class="mt-2 text-xs font-medium text-sky-300 md:text-sm">你的電腦</div>
            </div>

            <!-- 中間：請求與回應箭頭 -->
            <div class="flex flex-col items-center gap-4">
              <!-- 發送請求 -->
              <div
                class="flex items-center gap-2 transition-all delay-200 duration-500"
                :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"
              >
                <span class="text-xs text-sky-300 md:text-sm">GET /</span>
                <svg class="h-5 w-5 text-sky-400 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </div>

              <!-- 回傳資料 -->
              <div
                class="flex items-center gap-2 transition-all delay-400 duration-500"
                :class="animState >= 3 ? 'opacity-100' : 'opacity-0'"
              >
                <svg class="h-5 w-5 rotate-180 text-emerald-400 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
                <span class="text-xs text-emerald-300 md:text-sm">200 OK + HTML</span>
              </div>
            </div>

            <!-- 伺服器 -->
            <div
              class="flex flex-col items-center transition-all delay-100 duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-emerald-500/50 bg-slate-900 md:h-24 md:w-24">
                <span class="text-4xl md:text-5xl">🖥️</span>
              </div>
              <div class="mt-2 text-xs font-medium text-emerald-300 md:text-sm">伺服器</div>
            </div>
          </div>

          <!-- 結果：網頁出現 -->
          <div
            class="transition-all delay-500 duration-700"
            :class="animState >= 4 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-2 rounded-2xl bg-emerald-500/20 blur-xl"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-emerald-500 bg-slate-900">
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-3 py-1.5">
                  <div class="flex gap-1">
                    <div class="h-2 w-2 rounded-full bg-red-500"></div>
                    <div class="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div class="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div class="flex h-24 w-56 items-center justify-center bg-white md:h-28 md:w-64">
                  <span class="text-5xl md:text-6xl">🎉</span>
                </div>
              </div>
            </div>
            <div class="mt-3 text-center text-sm font-bold text-emerald-400 md:text-base">
              網頁出現了！
            </div>
          </div>
        </div>
      </div>

      <!-- ========== SUMMARY VIEW ========== -->
      <div v-if="stepData.view === 'summary'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center">
          <!-- 完整流程 -->
          <div class="flex w-full flex-col gap-3 md:gap-4">
            <!-- 步驟 1 -->
            <div
              class="flex items-center gap-4 transition-all duration-500"
              :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-lg font-bold text-sky-400 md:h-12 md:w-12 md:text-xl">
                1
              </div>
              <div class="flex-1 rounded-xl border border-sky-500/30 bg-slate-900/80 px-4 py-2.5 md:py-3">
                <div class="text-sm font-medium text-white md:text-base">輸入網址，按下 Enter</div>
              </div>
              <span class="text-2xl">⌨️</span>
            </div>

            <!-- 步驟 2 -->
            <div
              class="flex items-center gap-4 transition-all delay-100 duration-500"
              :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-lg font-bold text-amber-400 md:h-12 md:w-12 md:text-xl">
                2
              </div>
              <div class="flex-1 rounded-xl border border-amber-500/30 bg-slate-900/80 px-4 py-2.5 md:py-3">
                <div class="text-sm font-medium text-white md:text-base">DNS 查詢，找到伺服器地址</div>
              </div>
              <span class="text-2xl">📖</span>
            </div>

            <!-- 步驟 3 -->
            <div
              class="flex items-center gap-4 transition-all delay-200 duration-500"
              :class="animState >= 3 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-lg font-bold text-purple-400 md:h-12 md:w-12 md:text-xl">
                3
              </div>
              <div class="flex-1 rounded-xl border border-purple-500/30 bg-slate-900/80 px-4 py-2.5 md:py-3">
                <div class="text-sm font-medium text-white md:text-base">建立連線，發送請求</div>
              </div>
              <span class="text-2xl">🤝</span>
            </div>

            <!-- 步驟 4 -->
            <div
              class="flex items-center gap-4 transition-all delay-300 duration-500"
              :class="animState >= 4 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-lg font-bold text-emerald-400 md:h-12 md:w-12 md:text-xl">
                4
              </div>
              <div class="flex-1 rounded-xl border border-emerald-500/30 bg-slate-900/80 px-4 py-2.5 md:py-3">
                <div class="text-sm font-medium text-white md:text-base">伺服器回傳內容，網頁出現！</div>
              </div>
              <span class="text-2xl">🎉</span>
            </div>
          </div>

          <!-- 總結 -->
          <div
            class="mt-6 w-full transition-all delay-400 duration-700"
            :class="animState >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 opacity-30 blur"></div>
              <div class="relative rounded-2xl border border-sky-500/30 bg-slate-900/90 px-6 py-4 text-center">
                <div class="text-lg font-bold text-white md:text-xl">
                  這整個「一來一往」的過程
                </div>
                <div class="mt-2 text-2xl font-bold text-sky-400 md:text-3xl">
                  就叫做「網路請求」！
                </div>
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

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@keyframes data-flow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
.animate-float-slower { animation: float-slower 15s ease-in-out infinite; }
.animate-blink { animation: blink 1s step-end infinite; }
.animate-data-flow { animation: data-flow 1.5s ease-in-out infinite; }
.animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
</style>
