<script setup lang="ts">
/**
 * 網址請求互動教學 + 填空遊戲
 * 整合 url-request 教學和資料流填空遊戲
 * 使用點選模式（tap-to-select）取代拖曳，更適合手機操作
 */
import { ref, computed, watch, onMounted } from 'vue'

defineProps<{
  isMobile?: boolean
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

// === 步驟定義 ===
type StepView = 'intro' | 'dns' | 'connect' | 'response' | 'quiz'

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
    desc: '當你在瀏覽器輸入網址然後按下 Enter，背後發生了一連串的事情...',
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
    view: 'quiz',
    title: '小測驗：驗收時間！',
    desc: '學完了流程，來試試看你記住了多少！點選元素放到空位裡。',
  },
]

// === 狀態 ===
const currentStep = ref(0)
const animState = ref(0)
const stepData = computed(() => STEPS[currentStep.value])
const isLastStep = computed(() => currentStep.value === STEPS.length - 1)

// === 填空遊戲狀態 ===
interface DragItem {
  id: string
  text: string
  emoji: string
}

const isSubmitted = ref(false)
const isAllCorrect = ref(false)
const showConfetti = ref(false)

// 選中的元素（點選模式）
const selectedItem = ref<DragItem | null>(null)

const availableItems: DragItem[] = [
  { id: 'browser', text: '瀏覽器', emoji: '🌐' },
  { id: 'dns', text: 'DNS', emoji: '📖' },
  { id: 'server', text: '伺服器', emoji: '🖥️' },
]

// 四個空位的狀態
const slots = ref<(DragItem | null)[]>([null, null, null, null])

// 正確答案：瀏覽器 → DNS → 伺服器 → 瀏覽器
const correctAnswers = ['browser', 'dns', 'server', 'browser']

const allSlotsFilled = computed(() => {
  return slots.value.every(slot => slot !== null)
})

// === 動畫控制 ===
onMounted(() => {
  triggerStepAnimation()
})

watch(currentStep, () => {
  animState.value = 0
  setTimeout(() => {
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

// === 點選模式邏輯 ===
function selectItem(item: DragItem) {
  if (isSubmitted.value) return
  selectedItem.value = item
}

function placeInSlot(slotIndex: number) {
  if (isSubmitted.value) return

  if (selectedItem.value) {
    // 放入選中的元素
    slots.value[slotIndex] = { ...selectedItem.value }
    selectedItem.value = null
  } else if (slots.value[slotIndex]) {
    // 如果沒有選中元素但空位有東西，點擊可以清除
    slots.value[slotIndex] = null
  }
}

function checkAnswer() {
  isSubmitted.value = true

  const userAnswers = slots.value.map(slot => slot?.id)
  const allCorrect = userAnswers.every((answer, index) => answer === correctAnswers[index])
  isAllCorrect.value = allCorrect

  if (allCorrect) {
    showConfetti.value = true
    setTimeout(() => {
      showConfetti.value = false
    }, 2000)
  }
}

function getSlotStatus(slotIndex: number): 'correct' | 'wrong' | 'empty' | 'pending' {
  const slot = slots.value[slotIndex]
  if (!isSubmitted.value) {
    return slot === null ? 'empty' : 'pending'
  }
  if (slot === null) return 'empty'
  return slot.id === correctAnswers[slotIndex] ? 'correct' : 'wrong'
}

function handleRetry() {
  slots.value = [null, null, null, null]
  selectedItem.value = null
  isSubmitted.value = false
  isAllCorrect.value = false
}

function handleComplete() {
  emit('complete')
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden bg-slate-950">
    <!-- 紙花效果 -->
    <div v-if="showConfetti" class="pointer-events-none absolute inset-0 z-50">
      <div v-for="i in 30" :key="i" class="confetti" :style="{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 0.5}s` }" />
    </div>

    <!-- Header -->
    <div class="relative z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur-xl md:px-6 md:py-4">
      <div class="min-w-0 flex-1">
        <h1 class="flex items-center gap-2 text-lg font-bold text-white md:gap-3 md:text-2xl">
          <span class="text-2xl md:text-3xl">🌐</span>
          <span class="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">網址背後的秘密</span>
        </h1>
      </div>
      <!-- Step indicator -->
      <div class="flex items-center gap-3">
        <div class="hidden gap-1.5 md:flex">
          <div
            v-for="i in STEPS.length"
            :key="i"
            class="h-2 rounded-full transition-all duration-300"
            :class="
              i - 1 === currentStep
                ? 'w-8 bg-sky-400'
                : i - 1 < currentStep
                  ? 'w-2 bg-sky-400/50'
                  : 'w-2 bg-slate-600'
            "
          />
        </div>
        <div class="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-400 md:text-sm">
          {{ currentStep + 1 }} / {{ STEPS.length }}
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="relative flex flex-1 flex-col overflow-hidden">
      <!-- Background particles -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="animate-float-slow absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"></div>
        <div class="animate-float-slower absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-purple-500/10 blur-3xl"></div>
      </div>

      <!-- ========== INTRO VIEW ========== -->
      <div v-if="stepData.view === 'intro'" class="relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-4 py-6 md:justify-center md:p-6">
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
      <div v-if="stepData.view === 'dns'" class="relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-4 py-6 md:justify-center md:p-6">
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
      <div v-if="stepData.view === 'connect'" class="relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-4 py-6 md:justify-center md:p-6">
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
                <div class="absolute h-full w-8 animate-data-flow rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"></div>
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
              <div class="mt-2 text-sm font-medium text-emerald-300">伺服器</div>
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
      <div v-if="stepData.view === 'response'" class="relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-4 py-6 md:justify-center md:p-6">
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

      <!-- ========== QUIZ VIEW (填空遊戲) ========== -->
      <div v-if="stepData.view === 'quiz'" class="relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-4 py-6">
        <div class="relative z-10 w-full max-w-2xl">
          <!-- 選擇元素區 -->
          <div class="mb-6 rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
            <p class="mb-3 text-center text-sm font-bold text-slate-400">
              🧩 {{ selectedItem ? '現在點擊下方空位放入' : '點選元素，再點空位放入（可重複使用）' }}
            </p>
            <div class="flex flex-wrap justify-center gap-3">
              <button
                v-for="item in availableItems"
                :key="item.id"
                :disabled="isSubmitted"
                class="tap-item flex items-center gap-2 rounded-xl border-2 px-4 py-3 transition-all"
                :class="[
                  selectedItem?.id === item.id
                    ? 'border-sky-400 bg-sky-500/30 shadow-lg shadow-sky-500/20'
                    : 'border-dashed border-slate-600 bg-slate-800 hover:border-sky-400 hover:shadow-md',
                  isSubmitted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                ]"
                @click="selectItem(item)"
              >
                <span class="text-2xl">{{ item.emoji }}</span>
                <span class="font-bold text-white">{{ item.text }}</span>
              </button>
            </div>
          </div>

          <!-- 流程填空 -->
          <div class="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
            <p class="mb-4 text-center text-white">輸入網址後的流程是？</p>
            <div class="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              <!-- Slot 1 -->
              <button
                class="slot-btn min-h-[60px] min-w-[90px] rounded-xl border-2 border-dashed p-2 transition-all"
                :class="[
                  getSlotStatus(0) === 'correct' ? 'border-emerald-400 bg-emerald-500/20' :
                  getSlotStatus(0) === 'wrong' ? 'border-red-400 bg-red-500/20 shake' :
                  getSlotStatus(0) === 'pending' ? 'border-sky-400 bg-sky-500/20' :
                  'border-slate-600 bg-slate-800',
                  selectedItem && !isSubmitted ? 'hover:border-sky-300 hover:bg-sky-500/10 cursor-pointer' : '',
                  !selectedItem && slots[0] && !isSubmitted ? 'hover:border-red-300 cursor-pointer' : ''
                ]"
                :disabled="isSubmitted"
                @click="placeInSlot(0)"
              >
                <div v-if="slots[0]" class="flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2">
                  <span class="text-xl">{{ slots[0].emoji }}</span>
                  <span class="font-bold text-white">{{ slots[0].text }}</span>
                </div>
                <div v-else class="flex h-full min-h-[44px] items-center justify-center text-slate-500">
                  <span class="text-xs">輸入網址</span>
                </div>
              </button>

              <span class="text-xl text-sky-400">→</span>

              <!-- Slot 2 -->
              <button
                class="slot-btn min-h-[60px] min-w-[90px] rounded-xl border-2 border-dashed p-2 transition-all"
                :class="[
                  getSlotStatus(1) === 'correct' ? 'border-emerald-400 bg-emerald-500/20' :
                  getSlotStatus(1) === 'wrong' ? 'border-red-400 bg-red-500/20 shake' :
                  getSlotStatus(1) === 'pending' ? 'border-sky-400 bg-sky-500/20' :
                  'border-slate-600 bg-slate-800',
                  selectedItem && !isSubmitted ? 'hover:border-sky-300 hover:bg-sky-500/10 cursor-pointer' : '',
                  !selectedItem && slots[1] && !isSubmitted ? 'hover:border-red-300 cursor-pointer' : ''
                ]"
                :disabled="isSubmitted"
                @click="placeInSlot(1)"
              >
                <div v-if="slots[1]" class="flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2">
                  <span class="text-xl">{{ slots[1].emoji }}</span>
                  <span class="font-bold text-white">{{ slots[1].text }}</span>
                </div>
                <div v-else class="flex h-full min-h-[44px] items-center justify-center text-slate-500">
                  <span class="text-xs">查地址</span>
                </div>
              </button>

              <span class="text-xl text-sky-400">→</span>

              <!-- Slot 3 -->
              <button
                class="slot-btn min-h-[60px] min-w-[90px] rounded-xl border-2 border-dashed p-2 transition-all"
                :class="[
                  getSlotStatus(2) === 'correct' ? 'border-emerald-400 bg-emerald-500/20' :
                  getSlotStatus(2) === 'wrong' ? 'border-red-400 bg-red-500/20 shake' :
                  getSlotStatus(2) === 'pending' ? 'border-sky-400 bg-sky-500/20' :
                  'border-slate-600 bg-slate-800',
                  selectedItem && !isSubmitted ? 'hover:border-sky-300 hover:bg-sky-500/10 cursor-pointer' : '',
                  !selectedItem && slots[2] && !isSubmitted ? 'hover:border-red-300 cursor-pointer' : ''
                ]"
                :disabled="isSubmitted"
                @click="placeInSlot(2)"
              >
                <div v-if="slots[2]" class="flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2">
                  <span class="text-xl">{{ slots[2].emoji }}</span>
                  <span class="font-bold text-white">{{ slots[2].text }}</span>
                </div>
                <div v-else class="flex h-full min-h-[44px] items-center justify-center text-slate-500">
                  <span class="text-xs">取資料</span>
                </div>
              </button>

              <span class="text-xl text-sky-400">→</span>

              <!-- Slot 4 -->
              <button
                class="slot-btn min-h-[60px] min-w-[90px] rounded-xl border-2 border-dashed p-2 transition-all"
                :class="[
                  getSlotStatus(3) === 'correct' ? 'border-emerald-400 bg-emerald-500/20' :
                  getSlotStatus(3) === 'wrong' ? 'border-red-400 bg-red-500/20 shake' :
                  getSlotStatus(3) === 'pending' ? 'border-sky-400 bg-sky-500/20' :
                  'border-slate-600 bg-slate-800',
                  selectedItem && !isSubmitted ? 'hover:border-sky-300 hover:bg-sky-500/10 cursor-pointer' : '',
                  !selectedItem && slots[3] && !isSubmitted ? 'hover:border-red-300 cursor-pointer' : ''
                ]"
                :disabled="isSubmitted"
                @click="placeInSlot(3)"
              >
                <div v-if="slots[3]" class="flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2">
                  <span class="text-xl">{{ slots[3].emoji }}</span>
                  <span class="font-bold text-white">{{ slots[3].text }}</span>
                </div>
                <div v-else class="flex h-full min-h-[44px] items-center justify-center text-slate-500">
                  <span class="text-xs">顯示網頁</span>
                </div>
              </button>
            </div>
          </div>

          <!-- 結果提示 -->
          <div
            v-if="isSubmitted"
            class="mt-4 rounded-2xl p-4 text-center"
            :class="isAllCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'"
          >
            <div v-if="isAllCorrect" class="flex flex-col items-center gap-2">
              <span class="text-4xl">🎉</span>
              <p class="text-xl font-bold text-emerald-400">完美！流程順序全對！</p>
            </div>
            <div v-else class="flex flex-col items-center gap-2">
              <span class="text-4xl">🤔</span>
              <p class="text-xl font-bold text-red-400">有些順序不太對喔</p>
              <p class="text-red-300">看看標記紅色的位置，調整一下！</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部說明區 -->
      <div class="border-t border-slate-800 bg-slate-900/80 backdrop-blur-xl">
        <div class="mx-auto max-w-4xl px-4 py-4 md:px-6 md:py-5">
          <h3 class="text-base font-bold text-white md:text-lg">{{ stepData.title }}</h3>
          <p class="mt-1 text-sm text-slate-400 md:text-base">{{ stepData.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Footer Controls -->
    <div class="relative z-20 flex items-center justify-between gap-3 border-t border-white/10 bg-slate-900/80 px-4 pb-6 pt-4 backdrop-blur-xl md:px-6 md:py-4">
      <button
        :disabled="currentStep === 0"
        class="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-3"
        @click="prevStep"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="hidden md:inline">上一步</span>
      </button>

      <!-- Mobile step indicator -->
      <div class="flex gap-1 md:hidden">
        <div
          v-for="i in STEPS.length"
          :key="i"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="
            i - 1 === currentStep
              ? 'w-4 bg-sky-400'
              : i - 1 < currentStep
                ? 'w-1.5 bg-sky-400/50'
                : 'w-1.5 bg-slate-600'
          "
        />
      </div>

      <!-- 非最後一步：下一步按鈕 -->
      <button
        v-if="!isLastStep"
        class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl md:px-6 md:py-3"
        @click="nextStep"
      >
        <span>下一步</span>
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- 最後一步（填空遊戲） -->
      <template v-else>
        <button
          v-if="isSubmitted && !isAllCorrect"
          class="flex items-center gap-2 rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-600 md:px-6 md:py-3"
          @click="handleRetry"
        >
          <span>🔄</span>
          <span>重試</span>
        </button>

        <button
          v-if="!isSubmitted"
          class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-3"
          :disabled="!allSlotsFilled"
          @click="checkAnswer"
        >
          <span>✨</span>
          <span>檢查答案</span>
        </button>

        <button
          v-else-if="isAllCorrect"
          class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl md:px-6 md:py-3"
          @click="handleComplete"
        >
          <span>完成學習</span>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </template>
    </div>
  </div>
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

.animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
.animate-float-slower { animation: float-slower 15s ease-in-out infinite; }
.animate-blink { animation: blink 1s step-end infinite; }
.animate-data-flow { animation: data-flow 1.5s ease-in-out infinite; }

/* 紙花動畫 */
.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  animation: confetti-fall 2s ease-out forwards;
}

.confetti:nth-child(odd) {
  background: #f97316;
  border-radius: 50%;
}

.confetti:nth-child(even) {
  background: #3b82f6;
}

.confetti:nth-child(3n) {
  background: #22c55e;
  transform: rotate(45deg);
}

.confetti:nth-child(4n) {
  background: #eab308;
  border-radius: 2px;
}

.confetti:nth-child(5n) {
  background: #a855f7;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* 錯誤搖晃動畫 */
.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}

/* 點選模式元素樣式 */
.tap-item,
.slot-btn {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  touch-action: manipulation;
}

.tap-item:active:not(:disabled) {
  transform: scale(0.95);
}

.slot-btn:active:not(:disabled) {
  transform: scale(0.98);
}
</style>
