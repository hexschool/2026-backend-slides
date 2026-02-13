<script setup lang="ts">
/**
 * 資料庫操作方式互動簡報 (15 關)
 * 解決迷思：「資料庫只能透過後端程式碼操作」
 * 介紹兩種操作方式：後端程式、資料庫管理工具
 */
import { ref, computed, watch, onMounted } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{
  isMobile?: boolean
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

// === 步驟定義 ===
type StepView =
  | 'welcome' | 'myth_buster' | 'two_ways_intro' | 'architecture'
  | 'backend_intro' | 'backend_example' | 'backend_scenario' | 'backend_pros_cons'
  | 'tool_intro' | 'tool_examples' | 'tool_scenario' | 'tool_pros_cons'
  | 'comparison' | 'quiz' | 'real_world' | 'summary'

type Step = {
  id: number
  view: StepView
  title: string
  desc: string
}

const STEPS: Step[] = [
  // 第一章：破除迷思
  { id: 1, view: 'welcome', title: '你以為資料庫只能這樣操作嗎？', desc: '讓我們看看大家對資料庫操作的第一印象...' },
  { id: 2, view: 'myth_buster', title: '其實不是！', desc: '資料庫有兩種主要的操作方式，不只是寫程式而已！' },
  { id: 3, view: 'two_ways_intro', title: '認識兩種操作方式', desc: '讓我們來認識這兩種不同的方法。' },
  { id: 4, view: 'architecture', title: '新增 User 的兩種方式', desc: '用同一個例子，看看程式和工具如何操作資料庫。' },
  // 第二章：後端程式連接
  { id: 5, view: 'backend_intro', title: '方式一：後端程式連接', desc: '透過程式碼連接並操作資料庫。' },
  { id: 6, view: 'backend_example', title: '看看程式碼長什麼樣', desc: '這是後端程式操作資料庫的樣子。' },
  { id: 7, view: 'backend_scenario', title: '什麼時候用後端程式？', desc: '這些情境都需要程式來自動執行！' },
  { id: 8, view: 'backend_pros_cons', title: '後端程式的優缺點', desc: '讓我們來看看這種方式的特點。' },
  // 第三章：資料庫管理工具
  { id: 9, view: 'tool_intro', title: '方式二：DBeaver 完整介面', desc: '來看看 DBeaver 的操作介面長什麼樣！' },
  { id: 10, view: 'tool_examples', title: '常見的管理工具', desc: '這些工具都可以讓你直接操作資料庫！' },
  { id: 11, view: 'tool_scenario', title: '什麼時候用管理工具？', desc: '這些情境用 GUI 工具更方便！' },
  { id: 12, view: 'tool_pros_cons', title: '管理工具的優缺點', desc: '讓我們來看看這種方式的特點。' },
  // 第四章：比較與總結
  { id: 13, view: 'comparison', title: '兩種方式的比較', desc: '一張表格讓你看懂差異！' },
  { id: 14, view: 'quiz', title: '小測驗', desc: '來測試一下你有沒有理解！' },
  { id: 15, view: 'real_world', title: '實際開發流程', desc: '其實兩種方式是互補的！' },
  { id: 16, view: 'summary', title: '重點回顧', desc: '記住這兩個關鍵概念！' },
]

// === 狀態 ===
const currentStep = ref(0)
const animState = ref(0)
const quizAnswered = ref<Record<number, boolean>>({})
const quizCorrect = ref<Record<number, boolean>>({})
const selectedAnswer = ref<string | null>(null)

const stepData = computed(() => STEPS[currentStep.value])

// 判斷是否可以前往下一步
const canGoNext = computed(() => {
  const view = stepData.value.view
  // 測驗頁面必須答對才能下一步
  if (view === 'quiz') {
    return quizAnswered.value[14] && quizCorrect.value[14]
  }
  return true
})

// 下一步按鈕的提示文字
const nextStepHint = computed(() => {
  const view = stepData.value.view
  if (view === 'quiz' && !canGoNext.value) {
    return '請先答對測驗題'
  }
  return ''
})

onMounted(() => {
  triggerAnimation()
})

watch(currentStep, () => {
  animState.value = 0
  // 切換頁面時重置測驗狀態
  const currentStepId = STEPS[currentStep.value]?.id
  if (currentStepId && quizAnswered.value[currentStepId]) {
    delete quizAnswered.value[currentStepId]
    delete quizCorrect.value[currentStepId]
  }
  selectedAnswer.value = null
  setTimeout(() => triggerAnimation(), 100)
})

function triggerAnimation() {
  setTimeout(() => { animState.value = 1 }, 200)
  setTimeout(() => { animState.value = 2 }, 500)
  setTimeout(() => { animState.value = 3 }, 800)
  setTimeout(() => { animState.value = 4 }, 1100)
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

function checkAnswer(stepId: number, answer: string, isCorrect: boolean) {
  if (quizAnswered.value[stepId]) return
  selectedAnswer.value = answer
  quizAnswered.value[stepId] = true
  quizCorrect.value[stepId] = isCorrect
}

function retryQuiz(stepId: number) {
  delete quizAnswered.value[stepId]
  delete quizCorrect.value[stepId]
  selectedAnswer.value = null
}
</script>

<template>
  <InteractiveSlideTemplate
    title="資料庫操作方式"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="sky"
    :canGoNext="canGoNext"
    :nextStepHint="nextStepHint"
    @prev="prevStep"
    @next="nextStep"
    @complete="handleComplete"
  >
    <template #icon>
      <div class="relative">
        <span class="text-2xl md:text-3xl">🗄️</span>
        <div class="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-sky-400"></div>
      </div>
    </template>

    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- 背景 -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="animate-float-slow absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"></div>
        <div class="animate-float-slower absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl"></div>
      </div>

      <!-- ========== WELCOME ========== -->
      <div v-if="stepData.view === 'welcome'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-6">
          <div class="transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
            <div class="relative mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-5xl shadow-2xl shadow-sky-500/30">
              🤔
            </div>
          </div>
          <h2 class="text-2xl font-bold text-white transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            你以為資料庫只能這樣操作嗎？
          </h2>
          <!-- 程式碼區塊 -->
          <div class="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 font-mono text-sm transition-all duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="mb-2 flex items-center gap-2">
              <span class="rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-400">後端程式</span>
            </div>
            <pre class="text-slate-300"><span class="text-gray-500">// 程式碼查詢資料庫</span>
<span class="text-purple-400">const</span> users = <span class="text-yellow-400">await</span> db.<span class="text-blue-400">query</span>(
  <span class="text-green-400">'SELECT * FROM USER'</span>
)</pre>
          </div>
          <p class="text-slate-400 transition-all duration-700" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            寫程式才能操作資料庫？這是唯一的方法嗎？ 🧐
          </p>
        </div>
      </div>

      <!-- ========== MYTH BUSTER ========== -->
      <div v-if="stepData.view === 'myth_buster'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-6">
          <div class="transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
            <div class="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-6xl shadow-2xl">
              ❌
            </div>
          </div>
          <h2 class="text-3xl font-bold text-white transition-all duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            其實不是！
          </h2>
          <div class="rounded-xl border-2 border-sky-500/50 bg-sky-500/10 p-6 text-center transition-all duration-700" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-xl text-white">資料庫有 <span class="font-bold text-sky-400">兩種</span> 主要操作方式！</p>
            <p class="mt-2 text-slate-400">不只是寫程式而已喔～</p>
          </div>
        </div>
      </div>

      <!-- ========== TWO WAYS INTRO ========== -->
      <div v-if="stepData.view === 'two_ways_intro'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-6">
          <h2 class="text-2xl font-bold text-white">兩種資料庫操作方式</h2>
          <div class="grid w-full gap-6 md:grid-cols-2">
            <!-- 方式一 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-center transition-all duration-500" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'">
              <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-4xl">
                💻
              </div>
              <h3 class="mt-4 text-lg font-bold text-green-400">方式一：後端程式</h3>
              <p class="mt-2 text-sm text-slate-400">Node.js、Python、Java 等</p>
              <p class="mt-1 text-xs text-slate-500">程式碼連接資料庫</p>
            </div>
            <!-- 方式二 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-center transition-all duration-500" :class="animState >= 2 ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'">
              <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-4xl">
                🖥️
              </div>
              <h3 class="mt-4 text-lg font-bold text-orange-400">方式二：管理工具</h3>
              <p class="mt-2 text-sm text-slate-400">DBeaver、pgAdmin 等</p>
              <p class="mt-1 text-xs text-slate-500">GUI 介面直接操作</p>
            </div>
          </div>
          <p class="text-center text-slate-400 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            讓我們來詳細認識這兩種方式！
          </p>
        </div>
      </div>

      <!-- ========== ARCHITECTURE ========== -->
      <div v-if="stepData.view === 'architecture'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6">
        <div class="relative z-10 flex w-full max-w-5xl flex-col items-center gap-4">
          <h2 class="text-xl font-bold text-white">新增一筆 User 資料的兩種方式</h2>

          <!-- 兩種方式並排 -->
          <div class="grid w-full gap-4 md:grid-cols-2">
            <!-- 方式一：後端程式 -->
            <div class="transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'">
              <div class="h-full rounded-xl border-2 border-green-500/50 bg-slate-800/50 p-4">
                <div class="mb-3 flex items-center gap-2">
                  <span class="rounded bg-green-500/20 px-2 py-1 text-xs font-bold text-green-400">方式一</span>
                  <h3 class="font-bold text-green-400">後端程式（Node.js）</h3>
                </div>

                <!-- 程式碼區塊（簡化版） -->
                <div class="rounded-lg bg-slate-900 p-3 font-mono text-xs">
                  <div class="text-slate-500">// 程式自動新增 User</div>
                  <div class="mt-1">
                    <span class="text-purple-400">await</span>
                    <span class="text-white"> db.</span>
                    <span class="text-yellow-300">query</span>
                    <span class="text-white">(</span>
                  </div>
                  <div class="pl-2">
                    <span class="text-amber-300">'INSERT INTO USER</span>
                  </div>
                  <div class="pl-2">
                    <span class="text-amber-300">VALUES (小明, ming@...)'</span>
                  </div>
                  <div><span class="text-white">)</span></div>
                </div>

                <!-- 說明 -->
                <div class="mt-3 rounded-lg bg-green-500/10 p-2 text-xs text-green-300">
                  <div class="font-bold">🔄 程式自動執行</div>
                  <div class="text-slate-400">使用者註冊時自動觸發</div>
                </div>
              </div>
            </div>

            <!-- 方式二：DBeaver（簡化版） -->
            <div class="transition-all duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <div class="h-full rounded-xl border-2 border-orange-500/50 bg-slate-800/50 p-4">
                <div class="mb-3 flex items-center gap-2">
                  <span class="rounded bg-orange-500/20 px-2 py-1 text-xs font-bold text-orange-400">方式二</span>
                  <h3 class="font-bold text-orange-400">DBeaver（管理工具）</h3>
                </div>

                <!-- DBeaver 簡化示意 -->
                <div class="overflow-hidden rounded-lg border border-slate-600 bg-slate-900">
                  <!-- 標題列 -->
                  <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-3 py-1.5">
                    <div class="flex gap-1">
                      <div class="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                      <div class="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                      <div class="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <span class="text-xs text-slate-400">DBeaver - SQL Editor</span>
                  </div>
                  <!-- SQL 編輯區 -->
                  <div class="p-3 font-mono text-xs">
                    <div class="text-slate-500">-- 手動執行 SQL 新增 User</div>
                    <div class="mt-1">
                      <span class="text-purple-400">INSERT INTO</span>
                      <span class="text-white"> "USER" </span>
                    </div>
                    <div>
                      <span class="text-purple-400">VALUES</span>
                      <span class="text-white"> (</span>
                      <span class="text-amber-300">'小明'</span>
                      <span class="text-white">, ...)</span>
                    </div>
                  </div>
                  <!-- 執行按鈕 + 結果 -->
                  <div class="flex items-center justify-between border-t border-slate-700 bg-slate-800 px-3 py-2">
                    <span class="rounded bg-orange-500 px-2 py-1 text-xs font-bold text-white">▶ Execute</span>
                    <span class="text-xs text-green-400">✓ 1 row inserted</span>
                  </div>
                </div>

                <!-- 說明 -->
                <div class="mt-3 rounded-lg bg-orange-500/10 p-2 text-xs text-orange-300">
                  <div class="font-bold">👆 手動執行</div>
                  <div class="text-slate-400">開發者手動寫 SQL、點執行</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 重點提示：兩種方式的差異 -->
          <div class="w-full transition-all duration-700" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="rounded-xl border-2 border-sky-500/50 bg-sky-500/10 p-3 text-center">
              <h3 class="text-base font-bold text-sky-400">💡 同樣是新增資料，差別在哪？</h3>
              <div class="mt-2 flex items-center justify-center gap-3 text-xs">
                <span class="text-green-400">後端程式</span>
                <span class="text-slate-400">=</span>
                <span class="font-bold text-white">程式自動執行</span>
              </div>
              <div class="mt-1 flex items-center justify-center gap-3 text-xs">
                <span class="text-orange-400">DBeaver</span>
                <span class="text-slate-400">=</span>
                <span class="font-bold text-white">人手動執行</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== BACKEND INTRO ========== -->
      <div v-if="stepData.view === 'backend_intro'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6">
          <span class="rounded-full bg-green-500/20 px-4 py-1 text-sm text-green-400">方式一</span>
          <h2 class="text-2xl font-bold text-white">後端程式連接</h2>
          <!-- 流程圖 -->
          <div class="flex w-full items-center justify-center gap-4">
            <div class="transition-all duration-500" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex h-20 w-20 flex-col items-center justify-center rounded-xl bg-green-500/20 text-3xl">
                <span>🖥️</span>
                <span class="mt-1 text-xs text-green-400">Node.js</span>
              </div>
            </div>
            <div class="text-2xl text-slate-500 transition-all duration-500" :class="animState >= 2 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'">→</div>
            <div class="transition-all duration-500" style="transition-delay: 200ms" :class="animState >= 2 ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'">
              <div class="flex h-20 w-20 flex-col items-center justify-center rounded-xl bg-sky-500/20 text-3xl">
                <span>🗄️</span>
                <span class="mt-1 text-xs text-sky-400">資料庫</span>
              </div>
            </div>
          </div>
          <div class="w-full space-y-3 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
              <p class="text-slate-300"><span class="font-bold text-green-400">後端程式</span>可以連接到資料庫</p>
              <p class="mt-1 text-sm text-slate-400">就像有一條專線通往資料庫一樣！</p>
            </div>
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
              <p class="text-slate-300">操作方式：<span class="font-bold text-green-400">程式自動執行</span></p>
              <p class="mt-1 text-sm text-slate-400">當使用者按下按鈕時，程式會自動幫你處理資料庫！</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== BACKEND EXAMPLE ========== -->
      <div v-if="stepData.view === 'backend_example'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <span class="rounded-full bg-green-500/20 px-4 py-1 text-sm text-green-400">方式一：後端程式</span>
          <h2 class="text-xl font-bold text-white">程式碼長什麼樣？</h2>
          <p class="text-sm text-slate-400">看不懂沒關係，先知道程式可以操作資料庫就好！</p>
          <!-- 查詢範例 -->
          <div class="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="mb-2 flex items-center gap-2">
              <span class="rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-400">🔍 查詢資料</span>
            </div>
            <pre class="font-mono text-sm text-slate-300"><span class="text-gray-500">// 取得所有使用者</span>
<span class="text-purple-400">const</span> users = <span class="text-yellow-400">await</span> db.<span class="text-blue-400">query</span>(<span class="text-green-400">'SELECT * FROM USER'</span>)</pre>
          </div>
          <!-- 新增範例 -->
          <div class="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="mb-2 flex items-center gap-2">
              <span class="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">➕ 新增資料</span>
            </div>
            <pre class="font-mono text-sm text-slate-300"><span class="text-gray-500">// 新增一筆使用者</span>
<span class="text-yellow-400">await</span> db.<span class="text-blue-400">query</span>(<span class="text-green-400">'INSERT INTO USER ...'</span>)</pre>
          </div>
          <p class="text-center text-slate-400 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            這些程式碼會在伺服器上<span class="text-green-400">自動執行</span> ⚡
          </p>
        </div>
      </div>

      <!-- ========== BACKEND SCENARIO ========== -->
      <div v-if="stepData.view === 'backend_scenario'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-green-500/20 px-4 py-1 text-sm text-green-400">方式一：後端程式</span>
          <h2 class="text-xl font-bold text-white">什麼時候用這種方式？</h2>
          <div class="w-full space-y-3">
            <div v-for="(item, i) in [
              { icon: '📝', title: '使用者註冊', desc: '按下註冊按鈕 → 程式自動寫入 USER 表' },
              { icon: '🔍', title: 'API 查詢資料', desc: '前端請求 API → 程式自動查詢並回傳' },
              { icon: '🛒', title: '使用者購買', desc: '按下購買按鈕 → 程式自動寫入購買紀錄' },
              { icon: '⏰', title: '排程任務', desc: '每天凌晨 → 程式自動清理過期資料' }
            ]" :key="i" class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" :style="{ transitionDelay: `${i * 100}ms` }" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-start gap-3">
                <span class="text-2xl">{{ item.icon }}</span>
                <div>
                  <p class="font-bold text-white">{{ item.title }}</p>
                  <p class="text-sm text-slate-400">{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-xl border-2 border-green-500/30 bg-green-500/10 px-4 py-2 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-green-400">關鍵字：<span class="font-bold">自動化</span>、<span class="font-bold">程式觸發</span></p>
          </div>
        </div>
      </div>

      <!-- ========== BACKEND PROS CONS ========== -->
      <div v-if="stepData.view === 'backend_pros_cons'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-green-500/20 px-4 py-1 text-sm text-green-400">方式一：後端程式</span>
          <h2 class="text-xl font-bold text-white">優缺點分析</h2>
          <div class="grid w-full gap-4 md:grid-cols-2">
            <!-- 優點 -->
            <div class="rounded-xl border border-green-500/30 bg-green-500/10 p-4 transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <h3 class="mb-3 flex items-center gap-2 font-bold text-green-400">
                <span>✅</span> 優點
              </h3>
              <ul class="space-y-2 text-sm text-slate-300">
                <li>• 自動化執行</li>
                <li>• 可重複使用</li>
                <li>• 整合在應用程式中</li>
                <li>• 適合大量操作</li>
              </ul>
            </div>
            <!-- 缺點 -->
            <div class="rounded-xl border border-red-500/30 bg-red-500/10 p-4 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <h3 class="mb-3 flex items-center gap-2 font-bold text-red-400">
                <span>❌</span> 缺點
              </h3>
              <ul class="space-y-2 text-sm text-slate-300">
                <li>• 需要會寫程式</li>
                <li>• 除錯較複雜</li>
                <li>• 不適合臨時查詢</li>
                <li>• 修改要重新部署</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== TOOL INTRO ========== -->
      <div v-if="stepData.view === 'tool_intro'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6">
        <div class="relative z-10 flex w-full max-w-4xl flex-col items-center gap-4">
          <span class="rounded-full bg-orange-500/20 px-4 py-1 text-sm text-orange-400">方式二</span>
          <h2 class="text-xl font-bold text-white">DBeaver 操作介面</h2>

          <!-- 完整 DBeaver GUI 模擬 -->
          <div class="w-full overflow-hidden rounded-xl border-2 border-orange-500/50 bg-slate-900 transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'">
            <!-- 標題列 -->
            <div class="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-3 py-2">
              <div class="flex items-center gap-3">
                <div class="flex gap-1.5">
                  <div class="h-3 w-3 rounded-full bg-red-500"></div>
                  <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div class="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <span class="text-sm font-bold text-slate-300">DBeaver - livefit_db</span>
              </div>
              <div class="flex gap-2 text-xs text-slate-500">
                <span class="rounded bg-slate-700 px-2 py-0.5">File</span>
                <span class="rounded bg-slate-700 px-2 py-0.5">Edit</span>
                <span class="rounded bg-slate-700 px-2 py-0.5">SQL Editor</span>
                <span class="rounded bg-slate-700 px-2 py-0.5">Database</span>
              </div>
            </div>

            <!-- 主要區域 -->
            <div class="flex" style="height: 280px;">
              <!-- 左側：資料庫結構樹 -->
              <div class="w-48 border-r border-slate-700 bg-slate-800/50 p-3 transition-all duration-500" :class="animState >= 2 ? 'opacity-100' : 'opacity-0'">
                <div class="mb-2 text-xs font-bold text-slate-400">Database Navigator</div>
                <div class="space-y-1 text-sm">
                  <div class="text-slate-400">📁 PostgreSQL</div>
                  <div class="ml-3 text-slate-400">📁 livefit_db</div>
                  <div class="ml-6 text-slate-500">📁 Schemas</div>
                  <div class="ml-9 text-slate-500">📁 public</div>
                  <div class="ml-12 text-slate-400">📁 Tables</div>
                  <div class="ml-14 rounded bg-orange-500/20 px-1 text-orange-400">📄 USER</div>
                  <div class="ml-14 text-slate-500">📄 SKILL</div>
                  <div class="ml-14 text-slate-500">📄 CREDIT_PACKAGE</div>
                  <div class="ml-14 text-slate-500">📄 CREDIT_PURCHASE</div>
                </div>
              </div>

              <!-- 右側：SQL 編輯 + 結果 -->
              <div class="flex flex-1 flex-col">
                <!-- SQL 編輯區 -->
                <div class="flex-1 border-b border-slate-700 p-3 transition-all duration-500" :class="animState >= 3 ? 'opacity-100' : 'opacity-0'">
                  <div class="mb-2 text-xs text-slate-500">SQL Editor - Script-1.sql</div>
                  <div class="rounded bg-slate-950 p-3 font-mono text-sm">
                    <div class="text-slate-500">-- 查詢所有 User 資料</div>
                    <div class="mt-1">
                      <span class="text-purple-400">SELECT</span>
                      <span class="text-white"> * </span>
                      <span class="text-purple-400">FROM</span>
                      <span class="text-white"> "USER";</span>
                    </div>
                  </div>
                </div>

                <!-- 工具列 -->
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-3 py-2 transition-all duration-500" :class="animState >= 3 ? 'opacity-100' : 'opacity-0'">
                  <span class="rounded bg-orange-500 px-3 py-1 text-xs font-bold text-white">▶ Execute</span>
                  <span class="text-slate-600">|</span>
                  <span class="text-xs text-slate-500">Format SQL</span>
                  <span class="text-xs text-slate-500">|</span>
                  <span class="text-xs text-slate-500">Explain Plan</span>
                </div>

                <!-- 結果區：資料表格 -->
                <div class="bg-slate-800/30 p-3 transition-all duration-500" :class="animState >= 4 ? 'opacity-100' : 'opacity-0'">
                  <div class="mb-2 flex items-center gap-2">
                    <span class="text-xs text-green-400">✓ 3 rows returned</span>
                    <span class="text-xs text-slate-500">| 0.023 sec</span>
                  </div>
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b border-slate-600 text-left text-slate-400">
                        <th class="px-2 py-1">id</th>
                        <th class="px-2 py-1">name</th>
                        <th class="px-2 py-1">email</th>
                        <th class="px-2 py-1">role</th>
                      </tr>
                    </thead>
                    <tbody class="text-white">
                      <tr class="border-b border-slate-700">
                        <td class="px-2 py-1 text-slate-500">uuid-1...</td>
                        <td class="px-2 py-1">小明</td>
                        <td class="px-2 py-1 text-sky-400">ming@example.com</td>
                        <td class="px-2 py-1">user</td>
                      </tr>
                      <tr class="border-b border-slate-700">
                        <td class="px-2 py-1 text-slate-500">uuid-2...</td>
                        <td class="px-2 py-1">小華</td>
                        <td class="px-2 py-1 text-sky-400">hua@example.com</td>
                        <td class="px-2 py-1">coach</td>
                      </tr>
                      <tr>
                        <td class="px-2 py-1 text-slate-500">uuid-3...</td>
                        <td class="px-2 py-1">管理員</td>
                        <td class="px-2 py-1 text-sky-400">admin@livefit.com</td>
                        <td class="px-2 py-1">admin</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- 說明 -->
          <div class="w-full rounded-xl border border-orange-500/30 bg-orange-500/10 p-3 text-center transition-all duration-500" :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-sm text-orange-300">
              <span class="font-bold">左側選資料表 → 中間寫 SQL → 下方看結果</span>
            </p>
            <p class="mt-1 text-xs text-slate-400">開發時用來檢查資料、測試語法、手動修正資料</p>
          </div>
        </div>
      </div>

      <!-- ========== TOOL EXAMPLES ========== -->
      <div v-if="stepData.view === 'tool_examples'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <span class="rounded-full bg-orange-500/20 px-4 py-1 text-sm text-orange-400">方式二：管理工具</span>
          <h2 class="text-xl font-bold text-white">常見的資料庫管理工具</h2>
          <div class="grid w-full grid-cols-2 gap-4">
            <div v-for="(tool, i) in [
              { name: 'DBeaver', desc: '通用、免費、功能強大', color: 'amber', icon: '🦫' },
              { name: 'pgAdmin', desc: 'PostgreSQL 專用', color: 'blue', icon: '🐘' },
              { name: 'MySQL Workbench', desc: 'MySQL 專用', color: 'orange', icon: '🐬' },
              { name: 'TablePlus', desc: '付費、介面美觀', color: 'purple', icon: '✨' }
            ]" :key="i" class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center transition-all duration-300" :style="{ transitionDelay: `${i * 100}ms` }" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'">
              <div class="text-4xl">{{ tool.icon }}</div>
              <h3 class="mt-2 font-bold" :class="{
                'text-amber-400': tool.color === 'amber',
                'text-blue-400': tool.color === 'blue',
                'text-orange-400': tool.color === 'orange',
                'text-purple-400': tool.color === 'purple'
              }">{{ tool.name }}</h3>
              <p class="mt-1 text-xs text-slate-400">{{ tool.desc }}</p>
            </div>
          </div>
          <p class="text-center text-sm text-slate-400 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            我們課程使用的是 <span class="font-bold text-amber-400">DBeaver</span>！
          </p>
        </div>
      </div>

      <!-- ========== TOOL SCENARIO ========== -->
      <div v-if="stepData.view === 'tool_scenario'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-orange-500/20 px-4 py-1 text-sm text-orange-400">方式二：管理工具</span>
          <h2 class="text-xl font-bold text-white">什麼時候用這種方式？</h2>
          <div class="w-full space-y-3">
            <div v-for="(item, i) in [
              { icon: '🔍', title: '檢查資料', desc: '開發時確認資料有沒有正確寫入' },
              { icon: '✏️', title: '手動修正', desc: '發現有錯誤資料，直接改掉' },
              { icon: '🧪', title: '測試 SQL', desc: '先用工具試一下 SQL 對不對' },
              { icon: '📦', title: '匯出匯入', desc: '備份資料或搬移資料到其他環境' }
            ]" :key="i" class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" :style="{ transitionDelay: `${i * 100}ms` }" :class="animState >= 1 ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'">
              <div class="flex items-start gap-3">
                <span class="text-2xl">{{ item.icon }}</span>
                <div>
                  <p class="font-bold text-white">{{ item.title }}</p>
                  <p class="text-sm text-slate-400">{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-xl border-2 border-orange-500/30 bg-orange-500/10 px-4 py-2 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-orange-400">關鍵字：<span class="font-bold">手動操作</span>、<span class="font-bold">開發除錯</span></p>
          </div>
        </div>
      </div>

      <!-- ========== TOOL PROS CONS ========== -->
      <div v-if="stepData.view === 'tool_pros_cons'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-orange-500/20 px-4 py-1 text-sm text-orange-400">方式二：管理工具</span>
          <h2 class="text-xl font-bold text-white">優缺點分析</h2>
          <div class="grid w-full gap-4 md:grid-cols-2">
            <!-- 優點 -->
            <div class="rounded-xl border border-green-500/30 bg-green-500/10 p-4 transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <h3 class="mb-3 flex items-center gap-2 font-bold text-green-400">
                <span>✅</span> 優點
              </h3>
              <ul class="space-y-2 text-sm text-slate-300">
                <li>• 視覺化操作</li>
                <li>• 即時看結果</li>
                <li>• 不用寫程式</li>
                <li>• 適合臨時查詢</li>
              </ul>
            </div>
            <!-- 缺點 -->
            <div class="rounded-xl border border-red-500/30 bg-red-500/10 p-4 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <h3 class="mb-3 flex items-center gap-2 font-bold text-red-400">
                <span>❌</span> 缺點
              </h3>
              <ul class="space-y-2 text-sm text-slate-300">
                <li>• 需要手動操作</li>
                <li>• 不適合自動化</li>
                <li>• 操作無法追蹤</li>
                <li>• 容易人為出錯</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== COMPARISON ========== -->
      <div v-if="stepData.view === 'comparison'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <h2 class="text-xl font-bold text-white">兩種方式的比較</h2>
          <div class="w-full overflow-hidden rounded-xl border border-slate-700 transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <table class="w-full">
              <thead class="bg-slate-800">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-bold text-slate-400">比較項目</th>
                  <th class="px-4 py-3 text-center text-sm font-bold text-green-400">💻 後端程式</th>
                  <th class="px-4 py-3 text-center text-sm font-bold text-orange-400">🛠️ 管理工具</th>
                </tr>
              </thead>
              <tbody class="bg-slate-800/50">
                <tr v-for="(row, i) in [
                  { item: '操作者', backend: '程式自動', tool: '人手動' },
                  { item: '使用時機', backend: '正式運行', tool: '開發除錯' },
                  { item: '需要技能', backend: '寫程式', tool: '會用 GUI' },
                  { item: '適合場景', backend: '自動化流程', tool: '單次操作' },
                  { item: '重複執行', backend: '容易', tool: '麻煩' }
                ]" :key="i" class="border-t border-slate-700 transition-all duration-300" :style="{ transitionDelay: `${i * 100}ms` }" :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
                  <td class="px-4 py-3 text-sm text-slate-300">{{ row.item }}</td>
                  <td class="px-4 py-3 text-center text-sm text-green-300">{{ row.backend }}</td>
                  <td class="px-4 py-3 text-center text-sm text-orange-300">{{ row.tool }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ========== QUIZ ========== -->
      <div v-if="stepData.view === 'quiz'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-purple-500/20 px-4 py-1 text-sm text-purple-400">🎯 小測驗</span>
          <h2 class="text-xl font-bold text-white text-center">
            使用者按下「購買」按鈕，<br>購買紀錄是怎麼寫入資料庫的？
          </h2>
          <div class="w-full space-y-3">
            <button
              v-for="(option, i) in [
                { key: 'A', text: '後端程式自動寫入', correct: true },
                { key: 'B', text: '工程師用 DBeaver 手動寫入', correct: false },
                { key: 'C', text: '都可以，看心情', correct: false }
              ]"
              :key="i"
              class="w-full rounded-xl border p-4 text-left transition-all duration-300"
              :class="[
                quizAnswered[14]
                  ? option.correct
                    ? 'border-green-500 bg-green-500/20 text-white'
                    : selectedAnswer === option.key
                      ? 'border-red-500 bg-red-500/20 text-white'
                      : 'border-slate-700 bg-slate-800/50 text-slate-400'
                  : 'border-slate-700 bg-slate-800/50 text-white hover:border-sky-500 hover:bg-sky-500/10'
              ]"
              :style="{ transitionDelay: `${i * 100}ms` }"
              :disabled="quizAnswered[14]"
              @click="checkAnswer(14, option.key, option.correct)"
            >
              <span class="mr-2 font-bold">{{ option.key }}.</span>
              {{ option.text }}
              <span v-if="quizAnswered[14] && option.correct" class="ml-2">✅</span>
              <span v-if="quizAnswered[14] && !option.correct && selectedAnswer === option.key" class="ml-2">❌</span>
            </button>
          </div>
          <div v-if="quizAnswered[14] && quizCorrect[14]" class="rounded-xl border border-green-500/30 bg-green-500/10 p-4 transition-all duration-500">
            <p class="text-green-400">
              <span class="font-bold">🎉 正確！</span>
              使用者操作都是由<span class="font-bold">程式自動處理</span>的。
            </p>
            <p class="mt-1 text-sm text-slate-400">
              不可能每次都有人用 DBeaver 幫忙寫入啊～
            </p>
          </div>
          <div v-if="quizAnswered[14] && !quizCorrect[14]" class="flex flex-col gap-3">
            <div class="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
              <p class="text-rose-400">
                <span class="font-bold">😅 差一點！</span>
                想想看：每次使用者按購買，工程師都要手動幫忙嗎？
              </p>
            </div>
            <button class="rounded-lg border border-sky-500 bg-sky-500/20 px-4 py-2 text-sky-400 hover:bg-sky-500/30" @click="retryQuiz(14)">
              重新答題
            </button>
          </div>
        </div>
      </div>

      <!-- ========== REAL WORLD ========== -->
      <div v-if="stepData.view === 'real_world'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <h2 class="text-xl font-bold text-white">實際開發流程</h2>
          <p class="text-slate-400">其實兩種方式是<span class="font-bold text-sky-400">互補</span>的！</p>
          <!-- 流程 -->
          <div class="w-full space-y-4">
            <div class="flex items-center gap-4 transition-all duration-500" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white">1</div>
              <div class="flex-1 rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                <p class="text-white">用 <span class="text-orange-400">DBeaver</span> 設計、測試 SQL</p>
                <p class="text-xs text-slate-400">先確認 SQL 語法正確、結果符合預期</p>
              </div>
            </div>
            <div class="ml-5 h-6 border-l-2 border-dashed border-slate-600 transition-all duration-500" :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"></div>
            <div class="flex items-center gap-4 transition-all duration-500" :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-white">2</div>
              <div class="flex-1 rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                <p class="text-white">把 SQL 寫進 <span class="text-green-400">後端程式</span></p>
                <p class="text-xs text-slate-400">讓程式可以自動執行這段邏輯</p>
              </div>
            </div>
            <div class="ml-5 h-6 border-l-2 border-dashed border-slate-600 transition-all duration-500" :class="animState >= 3 ? 'opacity-100' : 'opacity-0'"></div>
            <div class="flex items-center gap-4 transition-all duration-500" :class="animState >= 3 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white">3</div>
              <div class="flex-1 rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                <p class="text-white">程式上線，<span class="text-blue-400">自動執行</span></p>
                <p class="text-xs text-slate-400">使用者操作時，程式自動處理資料庫操作</p>
              </div>
            </div>
          </div>
          <div class="rounded-xl border-2 border-sky-500/30 bg-sky-500/10 p-4 transition-all duration-500" :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-sky-400">
              <span class="text-xl">💡</span> 管理工具用來<span class="font-bold">開發除錯</span>，後端程式用來<span class="font-bold">正式運行</span>
            </p>
          </div>
        </div>
      </div>

      <!-- ========== SUMMARY ========== -->
      <div v-if="stepData.view === 'summary'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-6">
          <div class="transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
            <div class="relative mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-5xl shadow-2xl shadow-sky-500/30">
              🎉
            </div>
          </div>
          <h2 class="text-2xl font-bold text-white">重點回顧</h2>
          <div class="grid w-full gap-4 md:grid-cols-2">
            <div class="rounded-xl border-2 border-green-500/30 bg-green-500/10 p-4 text-center transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <div class="text-3xl">💻</div>
              <h3 class="mt-2 font-bold text-green-400">後端程式</h3>
              <p class="mt-1 text-sm text-slate-400">給<span class="font-bold text-white">程式</span>用的</p>
              <p class="text-xs text-slate-500">（自動化執行）</p>
            </div>
            <div class="rounded-xl border-2 border-orange-500/30 bg-orange-500/10 p-4 text-center transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <div class="text-3xl">🛠️</div>
              <h3 class="mt-2 font-bold text-orange-400">管理工具</h3>
              <p class="mt-1 text-sm text-slate-400">給<span class="font-bold text-white">人</span>用的</p>
              <p class="text-xs text-slate-500">（開發除錯）</p>
            </div>
          </div>
          <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 transition-all duration-500" :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-lg text-sky-400">
              兩者<span class="font-bold">缺一不可</span>！ 🤝
            </p>
          </div>
        </div>
      </div>

    </div>
  </InteractiveSlideTemplate>
</template>

<style scoped>
@keyframes float-slow {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-20px) translateX(10px); }
}

@keyframes float-slower {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-15px) translateX(-15px); }
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-slower {
  animation: float-slower 12s ease-in-out infinite;
}
</style>
