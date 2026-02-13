<script setup lang="ts">
/**
 * LiveFit 資料庫介紹互動簡報 (26 關)
 * 用業務流程帶入 4 張資料表：CREDIT_PACKAGE, SKILL, USER, CREDIT_PURCHASE
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
  | 'welcome' | 'story' | 'four_tables'
  | 'cp_intro' | 'cp_structure' | 'cp_fields' | 'cp_data' | 'cp_quiz' | 'cp_add'
  | 'skill_intro' | 'skill_structure' | 'skill_fields' | 'skill_unique'
  | 'user_intro' | 'user_structure' | 'user_fields' | 'user_data' | 'user_quiz' | 'user_email'
  | 'coach_intro' | 'coach_change' | 'coach_quiz'
  | 'purchase_intro' | 'purchase_structure' | 'purchase_fields' | 'purchase_data' | 'purchase_quiz' | 'snapshot'
  | 'summary' | 'data_review' | 'congrats'

type Step = {
  id: number
  view: StepView
  title: string
  desc: string
}

const STEPS: Step[] = [
  // 第一章：開場
  { id: 1, view: 'welcome', title: '歡迎來到 LiveFit', desc: '這是一個健身媒合平台，教練可以開課，學員可以預約課程。' },
  { id: 2, view: 'story', title: '今天的故事', desc: '我們要跟著 LiveFit，看看平台是怎麼一步一步建起來的。' },
  { id: 3, view: 'four_tables', title: '認識 4 張資料表', desc: '我們會認識堂數方案、技能、會員、購買紀錄這 4 張表。' },
  // 第二章：CREDIT_PACKAGE
  { id: 4, view: 'cp_intro', title: '情境：平台開張', desc: '老闆說：我們用堂數制，先設計幾種方案吧！' },
  { id: 5, view: 'cp_structure', title: 'CREDIT_PACKAGE 表結構', desc: '堂數方案表有 5 個欄位，記錄每種方案的資訊。' },
  { id: 6, view: 'cp_fields', title: '認識每個欄位', desc: '讓我們來認識這 5 個欄位分別代表什麼意思！' },
  { id: 7, view: 'cp_data', title: '看真實資料', desc: '老闆設計了三種方案：7堂、14堂、21堂組合包。' },
  { id: 8, view: 'cp_quiz', title: '小測驗', desc: '來測試一下你有沒有看懂表結構！' },
  { id: 9, view: 'cp_add', title: '新增資料', desc: '如果老闆想加一個 28 堂方案，要怎麼做？' },
  // 第三章：SKILL
  { id: 10, view: 'skill_intro', title: '情境：平台要教什麼？', desc: '我們的平台要教什麼課呢？先把技能列出來！' },
  { id: 11, view: 'skill_structure', title: 'SKILL 表結構', desc: '技能表很簡單，只有 3 個欄位。' },
  { id: 12, view: 'skill_fields', title: '認識每個欄位', desc: '讓我們來認識這 3 個欄位分別代表什麼！' },
  { id: 13, view: 'skill_unique', title: '唯一約束', desc: 'name 不能重複！這叫做「唯一約束」。' },
  // 第四章：USER
  { id: 14, view: 'user_intro', title: '情境：有人來註冊了', desc: '平台準備好了，現在有人要來註冊了！' },
  { id: 15, view: 'user_structure', title: 'USER 表結構', desc: '使用者表有 7 個欄位，其中 role 很重要。' },
  { id: 16, view: 'user_fields', title: '認識每個欄位', desc: '讓我們來認識這 7 個欄位，特別注意 role！' },
  { id: 17, view: 'user_data', title: '三個會員的資料', desc: '王小明、李燕容、小美都註冊了，目前都是學員。' },
  { id: 18, view: 'user_quiz', title: '小測驗', desc: '現在有幾個人是教練？' },
  { id: 19, view: 'user_email', title: 'Email 唯一約束', desc: 'email 不能重複！每個信箱只能註冊一次。' },
  // 第五章：USER 變教練
  { id: 20, view: 'coach_intro', title: '情境：李燕容想當教練', desc: '她想從「學員」變成「教練」，要怎麼做？' },
  { id: 21, view: 'coach_change', title: '修改 role 欄位', desc: '(管理員) 把 role 從 user 改成 coach，她就變成教練了！' },
  { id: 22, view: 'coach_quiz', title: '小測驗', desc: '如果小美也想當教練，要怎麼做？' },
  // 第六章：CREDIT_PURCHASE
  { id: 23, view: 'purchase_intro', title: '情境：王小明要買課', desc: '上課要先買堂數，王小明選了 14 堂組合包！' },
  { id: 24, view: 'purchase_structure', title: 'CREDIT_PURCHASE 表結構', desc: '購買紀錄表有 7 個欄位，其中有 2 個外來鍵。' },
  { id: 25, view: 'purchase_fields', title: '認識每個欄位', desc: '讓我們特別認識外來鍵欄位的用途！' },
  { id: 26, view: 'purchase_data', title: '王小明的購買紀錄', desc: 'user_id 和 credit_package_id 連到其他表。' },
  { id: 27, view: 'purchase_quiz', title: '小測驗', desc: 'user_id = 1 代表誰？' },
  { id: 28, view: 'snapshot', title: '為什麼要記錄「當時的價格」？', desc: '記錄當時的價格，不受未來漲價影響。' },
  // 第七章：總結
  { id: 29, view: 'summary', title: '回顧 4 張資料表', desc: '我們學會了新增、修改、唯一約束、外來鍵。' },
  { id: 30, view: 'data_review', title: '資料總覽', desc: '來看看我們在這 4 張表裡加了哪些資料！' },
  { id: 31, view: 'congrats', title: '恭喜完成！', desc: '你已經看懂真實的資料庫了！' },
]

// === 狀態 ===
const currentStep = ref(0)
const animState = ref(0)
const quizAnswered = ref<Record<number, boolean>>({})
const quizCorrect = ref<Record<number, boolean>>({})
const selectedAnswer = ref<Record<number, string>>({})

const stepData = computed(() => STEPS[currentStep.value])

// 測驗頁面對應的 stepId
const quizStepIds: Record<string, number> = {
  cp_quiz: 8,
  user_quiz: 18,
  coach_quiz: 22,
  purchase_quiz: 27
}

// 判斷是否可以前往下一步
const canGoNext = computed(() => {
  const view = stepData.value.view
  const stepId = quizStepIds[view]
  // 如果是測驗頁面，必須答對才能前往下一步
  if (stepId) {
    return quizAnswered.value[stepId] && quizCorrect.value[stepId]
  }
  return true
})

// 下一步按鈕的提示文字
const nextStepHint = computed(() => {
  const view = stepData.value.view
  const stepId = quizStepIds[view]
  if (stepId && !canGoNext.value) {
    return '請先答對測驗題'
  }
  return ''
})

onMounted(() => {
  triggerAnimation()
})

watch(currentStep, () => {
  animState.value = 0
  // 切換頁面時重置該頁的測驗狀態
  const currentStepId = STEPS[currentStep.value]?.id
  if (currentStepId && quizAnswered.value[currentStepId]) {
    delete quizAnswered.value[currentStepId]
    delete quizCorrect.value[currentStepId]
    delete selectedAnswer.value[currentStepId]
  }
  setTimeout(() => triggerAnimation(), 100)
})

function triggerAnimation() {
  setTimeout(() => { animState.value = 1 }, 200)
  setTimeout(() => { animState.value = 2 }, 500)
  setTimeout(() => { animState.value = 3 }, 800)
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
  quizAnswered.value[stepId] = true
  quizCorrect.value[stepId] = isCorrect
  selectedAnswer.value[stepId] = answer
}

function retryQuiz(stepId: number) {
  delete quizAnswered.value[stepId]
  delete quizCorrect.value[stepId]
  delete selectedAnswer.value[stepId]
}
</script>

<template>
  <InteractiveSlideTemplate
    title="LiveFit 資料庫探險"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="purple"
    :canGoNext="canGoNext"
    :nextStepHint="nextStepHint"
    @prev="prevStep"
    @next="nextStep"
    @complete="handleComplete"
  >
    <template #icon>
      <div class="relative">
        <span class="text-2xl md:text-3xl">💪</span>
        <div class="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-purple-400"></div>
      </div>
    </template>

    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- 背景 -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="animate-float-slow absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div class="animate-float-slower absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"></div>
      </div>

      <!-- ========== WELCOME ========== -->
      <div v-if="stepData.view === 'welcome'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex flex-col items-center gap-6 text-center">
          <div class="transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
            <div class="relative mx-auto flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-blue-500 text-6xl shadow-2xl shadow-purple-500/30">
              💪
            </div>
          </div>
          <h2 class="text-3xl font-bold text-white transition-all duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            歡迎來到 LiveFit！
          </h2>
          <div class="max-w-md rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-700" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-slate-300">🎯 <strong class="text-purple-400">教練</strong>可以在這裡開課</p>
            <p class="mt-2 text-slate-300">🎯 <strong class="text-blue-400">學員</strong>可以在這裡預約課程</p>
          </div>
        </div>
      </div>

      <!-- ========== STORY ========== -->
      <div v-if="stepData.view === 'story'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6">
          <h2 class="text-2xl font-bold text-white">今天的故事</h2>
          <div class="flex w-full flex-wrap items-center justify-center gap-4">
            <div v-for="(item, i) in [
              { icon: '💰', label: '設計堂數方案', color: 'amber' },
              { icon: '🏋️', label: '列出技能', color: 'orange' },
              { icon: '👤', label: '會員註冊', color: 'blue' },
              { icon: '⬆️', label: '升級教練', color: 'green' },
              { icon: '🛒', label: '購買堂數', color: 'purple' }
            ]" :key="i" class="flex flex-col items-center transition-all duration-500" :style="{ transitionDelay: `${i * 150}ms` }" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'">
              <div class="flex h-14 w-14 items-center justify-center rounded-full text-2xl" :class="{
                'bg-amber-500': item.color === 'amber',
                'bg-orange-500': item.color === 'orange',
                'bg-blue-500': item.color === 'blue',
                'bg-green-500': item.color === 'green',
                'bg-purple-500': item.color === 'purple'
              }">{{ item.icon }}</div>
              <span class="mt-2 text-sm font-medium text-slate-200">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== FOUR TABLES ========== -->
      <div v-if="stepData.view === 'four_tables'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6">
          <h2 class="text-2xl font-bold text-white">我們會認識 4 張資料表</h2>
          <div class="grid w-full grid-cols-2 gap-4">
            <div v-for="(table, i) in [
              { icon: '💰', name: 'CREDIT_PACKAGE', desc: '堂數方案表' },
              { icon: '🏋️', name: 'SKILL', desc: '技能清單表' },
              { icon: '👤', name: 'USER', desc: '會員資料表' },
              { icon: '🛒', name: 'CREDIT_PURCHASE', desc: '購買紀錄表' }
            ]" :key="i" class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center transition-all duration-500" :style="{ transitionDelay: `${i * 150}ms` }" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'">
              <div class="text-3xl">{{ table.icon }}</div>
              <div class="mt-2 text-sm font-bold text-white">{{ table.name }}</div>
              <div class="text-xs text-slate-400">{{ table.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CP_INTRO ========== -->
      <div v-if="stepData.view === 'cp_intro'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-6">
          <span class="rounded-full bg-amber-500/20 px-4 py-1 text-sm text-amber-400">第一個情境</span>
          <h2 class="text-2xl font-bold text-white">平台開張！</h2>
          <div class="flex w-full items-start gap-4 transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-3xl">👨‍💼</div>
            <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <p class="text-slate-300">我們的健身平台要開張了！</p>
            </div>
          </div>
          <div class="flex w-full items-start gap-4 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-3xl">👨‍💼</div>
            <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <p class="text-slate-300">學員上課要付費，我們用<span class="font-bold text-amber-400">「堂數」</span>來計算</p>
            </div>
          </div>
          <div class="flex w-full items-start gap-4 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-3xl">👨‍💼</div>
            <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <p class="text-slate-300">先來設計幾種方案吧！</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CP_STRUCTURE ========== -->
      <div v-if="stepData.view === 'cp_structure'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-amber-500/20 px-4 py-1 text-sm text-amber-400">💰 CREDIT_PACKAGE</span>
          <h2 class="text-xl font-bold text-white">認識表結構</h2>
          <div class="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <h4 class="mb-3 font-bold text-amber-400">CREDIT_PACKAGE 堂數方案表</h4>
            <div v-for="(col, i) in [
              { name: 'id', desc: '方案編號（主鍵）' },
              { name: 'name', desc: '方案名稱（不能重複）' },
              { name: 'credit_amount', desc: '這個方案有幾堂課 ⭐', highlight: true },
              { name: 'price', desc: '售價' },
              { name: 'created_at', desc: '什麼時候建立的' }
            ]" :key="i" class="flex items-center gap-3 border-b border-slate-700 py-2 last:border-0 transition-all duration-300" :style="{ transitionDelay: `${i * 100}ms` }" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <span class="rounded bg-amber-500/20 px-2 py-1 font-mono text-sm" :class="col.highlight ? 'text-amber-400' : 'text-amber-400/70'">{{ col.name }}</span>
              <span class="text-sm text-slate-400">{{ col.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CP_FIELDS ========== -->
      <div v-if="stepData.view === 'cp_fields'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-amber-500/20 px-4 py-1 text-sm text-amber-400">💰 CREDIT_PACKAGE</span>
          <h2 class="text-xl font-bold text-white">認識每個欄位</h2>
          <div class="w-full space-y-3">
            <!-- id 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-amber-500/20 px-3 py-1 font-mono text-amber-400">id</span>
                <span class="text-lg font-bold text-white">方案編號</span>
                <span class="rounded bg-purple-500/20 px-2 py-0.5 text-xs text-purple-400">主鍵</span>
              </div>
              <p class="text-sm text-slate-400">就像學生證號碼，每個方案都有自己獨一無二的編號</p>
              <p class="text-xs text-slate-500 mt-1">例如：1、2、3...</p>
            </div>
            <!-- name 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" style="transition-delay: 100ms" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-amber-500/20 px-3 py-1 font-mono text-amber-400">name</span>
                <span class="text-lg font-bold text-white">方案名稱</span>
                <span class="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">不能重複</span>
              </div>
              <p class="text-sm text-slate-400">方案叫什麼名字，方便學員選擇</p>
              <p class="text-xs text-slate-500 mt-1">例如：「7 堂組合包」、「14 堂組合包」</p>
            </div>
            <!-- credit_amount 欄位 -->
            <div class="rounded-xl border-2 border-amber-500/50 bg-amber-500/10 p-4 transition-all duration-300" style="transition-delay: 200ms" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-amber-500/30 px-3 py-1 font-mono text-amber-400">credit_amount</span>
                <span class="text-lg font-bold text-amber-400">有幾堂課 ⭐</span>
              </div>
              <p class="text-sm text-slate-300">這個方案可以上幾堂課，這是最重要的欄位！</p>
              <p class="text-xs text-amber-300/70 mt-1">例如：7（代表可以上 7 堂課）</p>
            </div>
            <!-- price 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" style="transition-delay: 300ms" :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-amber-500/20 px-3 py-1 font-mono text-amber-400">price</span>
                <span class="text-lg font-bold text-white">售價</span>
              </div>
              <p class="text-sm text-slate-400">這個方案要多少錢</p>
              <p class="text-xs text-slate-500 mt-1">例如：1400（代表 1,400 元）</p>
            </div>
            <!-- created_at 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" style="transition-delay: 400ms" :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-amber-500/20 px-3 py-1 font-mono text-amber-400">created_at</span>
                <span class="text-lg font-bold text-white">建立時間</span>
              </div>
              <p class="text-sm text-slate-400">這個方案什麼時候被創建的</p>
              <p class="text-xs text-slate-500 mt-1">例如：2024-01-15 10:30:00</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CP_QUIZ ========== -->
      <div v-if="stepData.view === 'cp_quiz'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-amber-500/20 px-4 py-1 text-sm text-amber-400">💰 CREDIT_PACKAGE</span>
          <h2 class="text-xl font-bold text-white">小測驗</h2>
          <div class="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <p class="mb-4 text-lg text-white">哪個欄位代表「這個方案有幾堂課」？</p>
            <div class="flex flex-col gap-2">
              <button v-for="(opt, i) in [
                { label: 'A. id', correct: false },
                { label: 'B. credit_amount', correct: true },
                { label: 'C. price', correct: false }
              ]" :key="i" class="rounded-lg border-2 px-4 py-3 text-left transition-all text-white" :class="[
                quizAnswered[8] && opt.correct && quizCorrect[8] ? 'border-green-500 bg-green-500/20 text-green-300' : '',
                quizAnswered[8] && selectedAnswer[8] === opt.label && !quizCorrect[8] ? 'border-rose-500 bg-rose-500/20 text-rose-300' : '',
                quizAnswered[8] && selectedAnswer[8] !== opt.label && !opt.correct ? 'border-slate-600 bg-slate-800/50 text-slate-400' : '',
                !quizAnswered[8] ? 'border-slate-600 hover:border-amber-500 hover:bg-slate-700/50' : ''
              ]" @click="checkAnswer(8, opt.label, opt.correct)" :disabled="quizAnswered[8]">
                {{ opt.label }}
              </button>
            </div>
            <div v-if="quizAnswered[8] && quizCorrect[8]" class="mt-4 rounded-lg bg-green-500/20 p-3 text-green-400">
              🎉 答對了！credit_amount 就是記錄有幾堂課的欄位。
            </div>
            <div v-if="quizAnswered[8] && !quizCorrect[8]" class="mt-4 flex flex-col gap-3">
              <div class="rounded-lg bg-rose-500/20 p-3 text-rose-400">
                😅 差一點！再想想看哪個欄位代表「堂數」？
              </div>
              <button class="rounded-lg border border-amber-500 bg-amber-500/20 px-4 py-2 text-amber-400 hover:bg-amber-500/30" @click="retryQuiz(8)">
                重新答題
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CP_DATA ========== -->
      <div v-if="stepData.view === 'cp_data'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <span class="rounded-full bg-amber-500/20 px-4 py-1 text-sm text-amber-400">💰 CREDIT_PACKAGE</span>
          <h2 class="text-xl font-bold text-white">看真實資料</h2>
          <div class="w-full overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50">
            <table class="w-full text-sm">
              <thead class="bg-slate-800">
                <tr>
                  <th class="px-3 py-2 text-left text-amber-400">id</th>
                  <th class="px-3 py-2 text-left text-amber-400">name</th>
                  <th class="px-3 py-2 text-left text-amber-400">credit_amount</th>
                  <th class="px-3 py-2 text-left text-amber-400">price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in [
                  { id: 1, name: '7 堂組合包', amount: 7, price: '1,400' },
                  { id: 2, name: '14 堂組合包', amount: 14, price: '2,520' },
                  { id: 3, name: '21 堂組合包', amount: 21, price: '4,800' }
                ]" :key="i" class="border-t border-slate-700 transition-all duration-300" :style="{ transitionDelay: `${i * 200}ms` }" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
                  <td class="px-3 py-2 text-slate-400">{{ row.id }}</td>
                  <td class="px-3 py-2 text-white">{{ row.name }}</td>
                  <td class="px-3 py-2 text-emerald-400">{{ row.amount }}</td>
                  <td class="px-3 py-2 text-emerald-400">{{ row.price }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-sm text-blue-300">💡 14 堂平均一堂 <strong>180 元</strong> 最划算！7 堂是 200 元，21 堂約 229 元。</p>
          </div>
        </div>
      </div>

      <!-- ========== CP_ADD ========== -->
      <div v-if="stepData.view === 'cp_add'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <span class="rounded-full bg-amber-500/20 px-4 py-1 text-sm text-amber-400">💰 CREDIT_PACKAGE</span>
          <div class="flex w-full items-start gap-4">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-2xl">👨‍💼</div>
            <div class="rounded-xl border border-slate-700 bg-slate-800 p-3">
              <p class="text-slate-300">我想再加一個 <span class="font-bold text-amber-400">28 堂方案 6,000 元</span>！</p>
            </div>
          </div>
          <div class="w-full overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50">
            <table class="w-full text-sm">
              <thead class="bg-slate-800">
                <tr>
                  <th class="px-3 py-2 text-left text-amber-400">id</th>
                  <th class="px-3 py-2 text-left text-amber-400">name</th>
                  <th class="px-3 py-2 text-left text-amber-400">credit_amount</th>
                  <th class="px-3 py-2 text-left text-amber-400">price</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t border-slate-700"><td class="px-3 py-2 text-slate-400">1</td><td class="px-3 py-2 text-white">7 堂組合包</td><td class="px-3 py-2 text-emerald-400">7</td><td class="px-3 py-2 text-emerald-400">1,400</td></tr>
                <tr class="border-t border-slate-700"><td class="px-3 py-2 text-slate-400">2</td><td class="px-3 py-2 text-white">14 堂組合包</td><td class="px-3 py-2 text-emerald-400">14</td><td class="px-3 py-2 text-emerald-400">2,520</td></tr>
                <tr class="border-t border-slate-700"><td class="px-3 py-2 text-slate-400">3</td><td class="px-3 py-2 text-white">21 堂組合包</td><td class="px-3 py-2 text-emerald-400">21</td><td class="px-3 py-2 text-emerald-400">4,800</td></tr>
                <tr class="border-t border-slate-700 bg-green-500/10 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
                  <td class="px-3 py-2 text-slate-400">4</td>
                  <td class="px-3 py-2 font-bold text-green-400">28 堂組合包 ✨</td>
                  <td class="px-3 py-2 text-emerald-400">28</td>
                  <td class="px-3 py-2 text-emerald-400">6,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-sm text-emerald-300">📝 <strong>新增資料 = 在表格加一列！</strong></p>
          </div>
        </div>
      </div>

      <!-- ========== SKILL_INTRO ========== -->
      <div v-if="stepData.view === 'skill_intro'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-6">
          <span class="rounded-full bg-orange-500/20 px-4 py-1 text-sm text-orange-400">第二個情境</span>
          <h2 class="text-2xl font-bold text-white">平台要教什麼？</h2>
          <div class="flex w-full items-start gap-4 transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-3xl">👨‍💼</div>
            <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <p class="text-slate-300">我們的平台要教什麼課呢？</p>
            </div>
          </div>
          <div class="w-full rounded-xl border border-slate-600 bg-slate-100 p-4 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <h4 class="mb-3 text-sm text-slate-600">📋 課程清單</h4>
            <p class="text-xl text-slate-800">🏋️ 重訓</p>
            <p class="mt-2 text-xl text-slate-800">🧘 瑜伽</p>
            <p class="mt-2 text-xl text-slate-800">🏃 有氧運動</p>
          </div>
          <p class="text-slate-400 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">這些就是我們的「技能」！需要一張表來記錄</p>
        </div>
      </div>

      <!-- ========== SKILL_STRUCTURE ========== -->
      <div v-if="stepData.view === 'skill_structure'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-orange-500/20 px-4 py-1 text-sm text-orange-400">🏋️ SKILL</span>
          <h2 class="text-xl font-bold text-white">認識表結構</h2>
          <p class="text-slate-400">這張表很簡單，只有 3 個欄位</p>
          <div class="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <h4 class="mb-3 font-bold text-orange-400">SKILL 技能表</h4>
            <div v-for="(col, i) in [
              { name: 'id', desc: '技能編號（主鍵）' },
              { name: 'name', desc: '技能名稱（不能重複）' },
              { name: 'created_at', desc: '什麼時候新增的' }
            ]" :key="i" class="flex items-center gap-3 border-b border-slate-700 py-2 last:border-0 transition-all duration-300" :style="{ transitionDelay: `${i * 100}ms` }" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <span class="rounded bg-orange-500/20 px-2 py-1 font-mono text-sm text-orange-400">{{ col.name }}</span>
              <span class="text-sm text-slate-400">{{ col.desc }}</span>
            </div>
          </div>
          <div class="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-sm text-blue-300">🤔 比 CREDIT_PACKAGE 少了 <strong>credit_amount</strong> 和 <strong>price</strong>，因為技能不需要記價格和堂數！</p>
          </div>
        </div>
      </div>

      <!-- ========== SKILL_FIELDS ========== -->
      <div v-if="stepData.view === 'skill_fields'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-orange-500/20 px-4 py-1 text-sm text-orange-400">🏋️ SKILL</span>
          <h2 class="text-xl font-bold text-white">認識每個欄位</h2>
          <div class="w-full space-y-3">
            <!-- id 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-orange-500/20 px-3 py-1 font-mono text-orange-400">id</span>
                <span class="text-lg font-bold text-white">技能編號</span>
                <span class="rounded bg-purple-500/20 px-2 py-0.5 text-xs text-purple-400">主鍵</span>
              </div>
              <p class="text-sm text-slate-400">每個技能都有獨一無二的編號</p>
              <p class="text-xs text-slate-500 mt-1">例如：1、2、3...</p>
            </div>
            <!-- name 欄位 -->
            <div class="rounded-xl border-2 border-orange-500/50 bg-orange-500/10 p-4 transition-all duration-300" style="transition-delay: 150ms" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-orange-500/30 px-3 py-1 font-mono text-orange-400">name</span>
                <span class="text-lg font-bold text-orange-400">技能名稱 ⭐</span>
                <span class="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-400">不能重複</span>
              </div>
              <p class="text-sm text-slate-300">課程叫什麼名字，例如「重訓」「瑜伽」</p>
              <p class="text-xs text-orange-300/70 mt-1">注意：同一個技能不能重複建立！</p>
            </div>
            <!-- created_at 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" style="transition-delay: 300ms" :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-orange-500/20 px-3 py-1 font-mono text-orange-400">created_at</span>
                <span class="text-lg font-bold text-white">建立時間</span>
              </div>
              <p class="text-sm text-slate-400">這個技能什麼時候被加入系統的</p>
              <p class="text-xs text-slate-500 mt-1">例如：2024-01-01 09:00:00</p>
            </div>
          </div>
          <div class="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-sm text-blue-300">💡 技能表只有 3 個欄位，是最簡單的表！</p>
          </div>
        </div>
      </div>

      <!-- ========== SKILL_UNIQUE ========== -->
      <div v-if="stepData.view === 'skill_unique'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-orange-500/20 px-4 py-1 text-sm text-orange-400">🏋️ SKILL</span>
          <h2 class="text-xl font-bold text-white">唯一約束</h2>
          <div class="w-full overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50">
            <table class="w-full text-sm">
              <thead class="bg-slate-800">
                <tr>
                  <th class="px-3 py-2 text-left text-orange-400">id</th>
                  <th class="px-3 py-2 text-left text-orange-400">name</th>
                  <th class="px-3 py-2 text-left text-orange-400">created_at</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t border-slate-700"><td class="px-3 py-2 text-slate-400">1</td><td class="px-3 py-2 text-white">重訓</td><td class="px-3 py-2 text-slate-500">2024-01-01</td></tr>
                <tr class="border-t border-slate-700"><td class="px-3 py-2 text-slate-400">2</td><td class="px-3 py-2 text-white">瑜伽</td><td class="px-3 py-2 text-slate-500">2024-01-01</td></tr>
                <tr class="border-t border-slate-700"><td class="px-3 py-2 text-slate-400">3</td><td class="px-3 py-2 text-white">有氧運動</td><td class="px-3 py-2 text-slate-500">2024-01-01</td></tr>
                <tr class="border-t border-slate-700 bg-red-500/10 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
                  <td class="px-3 py-2 text-slate-400">4</td>
                  <td class="px-3 py-2 text-red-400">瑜伽 ❌</td>
                  <td class="px-3 py-2 text-slate-500">2024-01-02</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="w-full rounded-xl border border-red-500/30 bg-red-500/10 p-3 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-sm text-red-300">🚫 <strong>name 不能重複！</strong>這叫做「唯一約束」</p>
            <p class="mt-1 text-sm text-red-300/70">一種技能只需要記錄一次，不需要有兩個「瑜伽」</p>
          </div>
        </div>
      </div>

      <!-- ========== USER_INTRO ========== -->
      <div v-if="stepData.view === 'user_intro'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-6">
          <span class="rounded-full bg-blue-500/20 px-4 py-1 text-sm text-blue-400">第三個情境</span>
          <h2 class="text-2xl font-bold text-white">有人來註冊了！</h2>
          <p class="text-slate-400">平台準備好了，現在有人要來註冊了</p>
          <div class="grid w-full grid-cols-3 gap-4">
            <div v-for="(user, i) in [
              { icon: '👨', name: '王小明', desc: '想學重訓' },
              { icon: '👩', name: '李燕容', desc: '想當瑜伽教練' },
              { icon: '👧', name: '小美', desc: '想學有氧' }
            ]" :key="i" class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center transition-all duration-300" :style="{ transitionDelay: `${i * 200}ms` }" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'">
              <div class="text-3xl">{{ user.icon }}</div>
              <div class="mt-2 font-bold text-white">{{ user.name }}</div>
              <div class="text-xs text-slate-400">{{ user.desc }}</div>
            </div>
          </div>
          <p class="text-slate-400 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">我們需要一張表來記錄這些會員</p>
        </div>
      </div>

      <!-- ========== USER_STRUCTURE ========== -->
      <div v-if="stepData.view === 'user_structure'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-blue-500/20 px-4 py-1 text-sm text-blue-400">👤 USER</span>
          <h2 class="text-xl font-bold text-white">認識表結構</h2>
          <div class="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <h4 class="mb-3 font-bold text-blue-400">USER 使用者表</h4>
            <div v-for="(col, i) in [
              { name: 'id', desc: '會員編號（主鍵）' },
              { name: 'name', desc: '名字' },
              { name: 'email', desc: '信箱（用來登入，不能重複）' },
              { name: 'role', desc: '身份（user 或 coach）⭐', highlight: true },
              { name: 'password', desc: '密碼（加密儲存）🔒' },
              { name: 'created_at', desc: '什麼時候註冊的' },
              { name: 'updated_at', desc: '資料最後更新時間' }
            ]" :key="i" class="flex items-center gap-3 border-b border-slate-700 py-2 last:border-0 transition-all duration-300" :style="{ transitionDelay: `${i * 100}ms` }" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <span class="rounded px-2 py-1 font-mono text-sm" :class="col.highlight ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'">{{ col.name }}</span>
              <span class="text-sm text-slate-400">{{ col.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== USER_FIELDS ========== -->
      <div v-if="stepData.view === 'user_fields'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-blue-500/20 px-4 py-1 text-sm text-blue-400">👤 USER</span>
          <h2 class="text-xl font-bold text-white">認識每個欄位</h2>
          <div class="w-full space-y-3">
            <!-- id 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-blue-500/20 px-3 py-1 font-mono text-blue-400">id</span>
                <span class="text-lg font-bold text-white">會員編號</span>
                <span class="rounded bg-purple-500/20 px-2 py-0.5 text-xs text-purple-400">主鍵</span>
              </div>
              <p class="text-sm text-slate-400">每個會員都有獨一無二的編號</p>
              <p class="text-xs text-slate-500 mt-1">例如：1、2、3...</p>
            </div>
            <!-- name 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" style="transition-delay: 100ms" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-blue-500/20 px-3 py-1 font-mono text-blue-400">name</span>
                <span class="text-lg font-bold text-white">姓名</span>
              </div>
              <p class="text-sm text-slate-400">會員叫什麼名字</p>
              <p class="text-xs text-slate-500 mt-1">例如：「王小明」、「李燕容」</p>
            </div>
            <!-- email 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" style="transition-delay: 200ms" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-blue-500/20 px-3 py-1 font-mono text-blue-400">email</span>
                <span class="text-lg font-bold text-white">電子信箱</span>
                <span class="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-400">不能重複</span>
              </div>
              <p class="text-sm text-slate-400">用來登入的帳號，每個信箱只能註冊一次</p>
              <p class="text-xs text-slate-500 mt-1">例如：ming@email.com</p>
            </div>
            <!-- role 欄位 -->
            <div class="rounded-xl border-2 border-green-500/50 bg-green-500/10 p-4 transition-all duration-300" style="transition-delay: 300ms" :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-green-500/30 px-3 py-1 font-mono text-green-400">role</span>
                <span class="text-lg font-bold text-green-400">身份角色 ⭐</span>
              </div>
              <p class="text-sm text-slate-300">這個人是「學員」還是「教練」？</p>
              <div class="mt-2 flex gap-3">
                <span class="rounded bg-blue-500/20 px-3 py-1 text-sm text-blue-400">user = 學員</span>
                <span class="rounded bg-green-500/20 px-3 py-1 text-sm text-green-400">coach = 教練</span>
              </div>
            </div>
            <!-- password 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" style="transition-delay: 400ms" :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-blue-500/20 px-3 py-1 font-mono text-blue-400">password</span>
                <span class="text-lg font-bold text-white">密碼 🔒</span>
              </div>
              <p class="text-sm text-slate-400">會員的登入密碼，會加密後儲存</p>
              <p class="text-xs text-slate-500 mt-1">例如：$2b$10$xxxxx（加密後的樣子）</p>
            </div>
            <!-- created_at 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" style="transition-delay: 500ms" :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-blue-500/20 px-3 py-1 font-mono text-blue-400">created_at</span>
                <span class="text-lg font-bold text-white">註冊時間</span>
              </div>
              <p class="text-sm text-slate-400">這個會員什麼時候加入的</p>
              <p class="text-xs text-slate-500 mt-1">例如：2024-01-15 14:30:00</p>
            </div>
            <!-- updated_at 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" style="transition-delay: 600ms" :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-blue-500/20 px-3 py-1 font-mono text-blue-400">updated_at</span>
                <span class="text-lg font-bold text-white">更新時間</span>
              </div>
              <p class="text-sm text-slate-400">資料最後一次被修改的時間</p>
              <p class="text-xs text-slate-500 mt-1">例如：升級教練時會更新這個時間</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== USER_DATA ========== -->
      <div v-if="stepData.view === 'user_data'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-4">
          <span class="rounded-full bg-blue-500/20 px-4 py-1 text-sm text-blue-400">👤 USER</span>
          <h2 class="text-xl font-bold text-white">三個會員的資料</h2>
          <div class="w-full overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50">
            <table class="w-full text-xs">
              <thead class="bg-slate-800">
                <tr>
                  <th class="px-2 py-2 text-left text-blue-400">id</th>
                  <th class="px-2 py-2 text-left text-blue-400">name</th>
                  <th class="px-2 py-2 text-left text-blue-400">email</th>
                  <th class="px-2 py-2 text-left text-blue-400">role</th>
                  <th class="px-2 py-2 text-left text-blue-400">password</th>
                  <th class="px-2 py-2 text-left text-blue-400">created_at</th>
                  <th class="px-2 py-2 text-left text-blue-400">updated_at</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in [
                  { id: 1, name: '王小明', email: 'ming@email.com', role: 'user', password: '$2b$10$x...', created_at: '2024-01-15 14:30:00', updated_at: '2024-01-15 14:30:00' },
                  { id: 2, name: '李燕容', email: 'yan@email.com', role: 'user', password: '$2b$10$y...', created_at: '2024-01-16 09:15:00', updated_at: '2024-01-16 09:15:00' },
                  { id: 3, name: '小美', email: 'mei@email.com', role: 'user', password: '$2b$10$z...', created_at: '2024-01-17 11:45:00', updated_at: '2024-01-17 11:45:00' }
                ]" :key="i" class="border-t border-slate-700 transition-all duration-300" :style="{ transitionDelay: `${i * 200}ms` }" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
                  <td class="px-2 py-2 text-slate-400">{{ row.id }}</td>
                  <td class="px-2 py-2 text-white">{{ row.name }}</td>
                  <td class="px-2 py-2 text-slate-400">{{ row.email }}</td>
                  <td class="px-2 py-2 font-bold text-blue-400">{{ row.role }}</td>
                  <td class="px-2 py-2 text-slate-500 font-mono">{{ row.password }}</td>
                  <td class="px-2 py-2 text-slate-500">{{ row.created_at }}</td>
                  <td class="px-2 py-2 text-slate-500">{{ row.updated_at }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-sm text-blue-300">👀 注意看，他們三個現在都是 <span class="font-bold">「學員」(user)</span>，還沒有人是教練喔！</p>
          </div>
        </div>
      </div>

      <!-- ========== USER_QUIZ ========== -->
      <div v-if="stepData.view === 'user_quiz'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-blue-500/20 px-4 py-1 text-sm text-blue-400">👤 USER</span>
          <h2 class="text-xl font-bold text-white">小測驗</h2>
          <div class="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <p class="mb-4 text-lg text-white">現在有幾個人是教練？</p>
            <div class="flex flex-col gap-2">
              <button v-for="(opt, i) in [
                { label: 'A. 0 個', correct: true },
                { label: 'B. 1 個', correct: false },
                { label: 'C. 3 個', correct: false }
              ]" :key="i" class="rounded-lg border-2 px-4 py-3 text-left transition-all text-white" :class="[
                quizAnswered[18] && opt.correct && quizCorrect[18] ? 'border-green-500 bg-green-500/20 text-green-300' : '',
                quizAnswered[18] && selectedAnswer[18] === opt.label && !quizCorrect[18] ? 'border-rose-500 bg-rose-500/20 text-rose-300' : '',
                quizAnswered[18] && selectedAnswer[18] !== opt.label && !opt.correct ? 'border-slate-600 bg-slate-800/50 text-slate-400' : '',
                !quizAnswered[18] ? 'border-slate-600 hover:border-blue-500 hover:bg-slate-700/50' : ''
              ]" @click="checkAnswer(18, opt.label, opt.correct)" :disabled="quizAnswered[18]">
                {{ opt.label }}
              </button>
            </div>
            <div v-if="quizAnswered[18] && quizCorrect[18]" class="mt-4 rounded-lg bg-green-500/20 p-3 text-green-400">
              🎉 答對了！目前三個人的 role 都是 user，所以沒有教練。
            </div>
            <div v-if="quizAnswered[18] && !quizCorrect[18]" class="mt-4 flex flex-col gap-3">
              <div class="rounded-lg bg-rose-500/20 p-3 text-rose-400">
                😅 差一點！再看一下表格中的 role 欄位。
              </div>
              <button class="rounded-lg border border-blue-500 bg-blue-500/20 px-4 py-2 text-blue-400 hover:bg-blue-500/30" @click="retryQuiz(18)">
                重新答題
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== USER_EMAIL ========== -->
      <div v-if="stepData.view === 'user_email'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-blue-500/20 px-4 py-1 text-sm text-blue-400">👤 USER</span>
          <h2 class="text-xl font-bold text-white">Email 唯一約束</h2>
          <p class="text-slate-400">如果有人想用 ming@email.com 註冊...</p>
          <div class="w-full overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50">
            <table class="w-full text-sm">
              <thead class="bg-slate-800">
                <tr>
                  <th class="px-3 py-2 text-left text-blue-400">id</th>
                  <th class="px-3 py-2 text-left text-blue-400">name</th>
                  <th class="px-3 py-2 text-left text-blue-400">email</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t border-slate-700 bg-amber-500/10"><td class="px-3 py-2 text-slate-400">1</td><td class="px-3 py-2 text-white">王小明</td><td class="px-3 py-2 font-bold text-amber-400">ming@email.com</td></tr>
                <tr class="border-t border-slate-700"><td class="px-3 py-2 text-slate-400">2</td><td class="px-3 py-2 text-white">李燕容</td><td class="px-3 py-2 text-slate-400">yan@email.com</td></tr>
                <tr class="border-t border-slate-700 bg-red-500/10 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
                  <td class="px-3 py-2 text-slate-400">4</td>
                  <td class="px-3 py-2 text-white">新用戶</td>
                  <td class="px-3 py-2 text-red-400">ming@email.com ❌</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="w-full rounded-xl border border-red-500/30 bg-red-500/10 p-3 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-sm text-red-300">🔒 <strong>email 不能重複！</strong>每個信箱只能註冊一次</p>
            <p class="mt-1 text-sm text-red-300/70">就像你的學校學號，不能有兩個人用同一個號碼</p>
          </div>
        </div>
      </div>

      <!-- ========== COACH_INTRO ========== -->
      <div v-if="stepData.view === 'coach_intro'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-6">
          <span class="rounded-full bg-green-500/20 px-4 py-1 text-sm text-green-400">第四個情境</span>
          <h2 class="text-2xl font-bold text-white">李燕容想當教練！</h2>
          <div class="flex w-full items-start gap-4 transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-teal-500 text-3xl">👩</div>
            <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <p class="text-slate-300">我想在平台上開課教學！</p>
            </div>
          </div>
          <p class="text-lg text-slate-300 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            她想從<span class="font-bold text-blue-400">「學員」</span>變成<span class="font-bold text-green-400">「教練」</span>
          </p>
          <p class="text-2xl transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">要怎麼做呢？ 🤔</p>
        </div>
      </div>

      <!-- ========== COACH_CHANGE ========== -->
      <div v-if="stepData.view === 'coach_change'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-green-500/20 px-4 py-1 text-sm text-green-400">👤 → COACH</span>
          <h2 class="text-xl font-bold text-white">修改 role 欄位</h2>
          <p class="text-slate-400">(管理員) 把李燕容的 role 從 user 改成 coach</p>
          <div class="w-full overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50">
            <table class="w-full text-sm">
              <thead class="bg-slate-800">
                <tr>
                  <th class="px-3 py-2 text-left text-blue-400">id</th>
                  <th class="px-3 py-2 text-left text-blue-400">name</th>
                  <th class="px-3 py-2 text-left text-blue-400">email</th>
                  <th class="px-3 py-2 text-left text-blue-400">role</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t border-slate-700"><td class="px-3 py-2 text-slate-400">1</td><td class="px-3 py-2 text-white">王小明</td><td class="px-3 py-2 text-slate-400">ming@email.com</td><td class="px-3 py-2 font-bold text-blue-400">user</td></tr>
                <tr class="border-t border-slate-700 bg-green-500/10 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
                  <td class="px-3 py-2 text-slate-400">2</td>
                  <td class="px-3 py-2 text-white">李燕容</td>
                  <td class="px-3 py-2 text-slate-400">yan@email.com</td>
                  <td class="px-3 py-2 font-bold text-green-400">coach ✨</td>
                </tr>
                <tr class="border-t border-slate-700"><td class="px-3 py-2 text-slate-400">3</td><td class="px-3 py-2 text-white">小美</td><td class="px-3 py-2 text-slate-400">mei@email.com</td><td class="px-3 py-2 font-bold text-blue-400">user</td></tr>
              </tbody>
            </table>
          </div>
          <div class="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-sm text-emerald-300">✅ 把 role 從 <span class="text-blue-400">user</span> 改成 <span class="text-green-400">coach</span>，她就變成教練了！</p>
            <p class="mt-1 text-sm text-emerald-300/70"><strong>修改資料 = 改變某一格的值</strong></p>
          </div>
        </div>
      </div>

      <!-- ========== COACH_QUIZ ========== -->
      <div v-if="stepData.view === 'coach_quiz'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-green-500/20 px-4 py-1 text-sm text-green-400">👤 USER</span>
          <h2 class="text-xl font-bold text-white">小測驗</h2>
          <div class="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <p class="mb-4 text-lg text-white">如果小美也想當教練，要怎麼做？</p>
            <div class="flex flex-col gap-2">
              <button v-for="(opt, i) in [
                { label: 'A. 刪除小美，重新註冊一個教練帳號', correct: false },
                { label: 'B. 把她的 role 改成 coach', correct: true },
                { label: 'C. 在 SKILL 表新增一個「小美」', correct: false }
              ]" :key="i" class="rounded-lg border-2 px-4 py-3 text-left transition-all text-white" :class="[
                quizAnswered[22] && opt.correct && quizCorrect[22] ? 'border-green-500 bg-green-500/20 text-green-300' : '',
                quizAnswered[22] && selectedAnswer[22] === opt.label && !quizCorrect[22] ? 'border-rose-500 bg-rose-500/20 text-rose-300' : '',
                quizAnswered[22] && selectedAnswer[22] !== opt.label && !opt.correct ? 'border-slate-600 bg-slate-800/50 text-slate-400' : '',
                !quizAnswered[22] ? 'border-slate-600 hover:border-green-500 hover:bg-slate-700/50' : ''
              ]" @click="checkAnswer(22, opt.label, opt.correct)" :disabled="quizAnswered[22]">
                {{ opt.label }}
              </button>
            </div>
            <div v-if="quizAnswered[22] && quizCorrect[22]" class="mt-4 rounded-lg bg-green-500/20 p-3 text-green-400">
              🎉 答對了！只要修改 role 欄位就好，不需要重新註冊。
            </div>
            <div v-if="quizAnswered[22] && !quizCorrect[22]" class="mt-4 flex flex-col gap-3">
              <div class="rounded-lg bg-rose-500/20 p-3 text-rose-400">
                😅 差一點！想想看，學員變教練需要修改哪個欄位？
              </div>
              <button class="rounded-lg border border-green-500 bg-green-500/20 px-4 py-2 text-green-400 hover:bg-green-500/30" @click="retryQuiz(22)">
                重新答題
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== PURCHASE_INTRO ========== -->
      <div v-if="stepData.view === 'purchase_intro'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-6">
          <span class="rounded-full bg-purple-500/20 px-4 py-1 text-sm text-purple-400">第五個情境</span>
          <h2 class="text-2xl font-bold text-white">王小明要買課！</h2>
          <div class="flex w-full items-start gap-4 transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-3xl">👨</div>
            <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <p class="text-slate-300">我想上李燕容教練的課！</p>
            </div>
          </div>
          <p class="text-slate-400">上課要先買堂數</p>
          <div class="grid w-full grid-cols-3 gap-3 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-3 text-center">
              <div class="text-2xl">📦</div>
              <div class="mt-1 text-sm text-white">7 堂組合包</div>
              <div class="text-xs text-slate-400">$1,400</div>
            </div>
            <div class="rounded-xl border-2 border-amber-500 bg-amber-500/10 p-3 text-center">
              <div class="text-2xl">📦</div>
              <div class="mt-1 text-sm font-bold text-amber-400">14 堂組合包 ⭐</div>
              <div class="text-xs text-amber-300">$2,520</div>
            </div>
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-3 text-center">
              <div class="text-2xl">📦</div>
              <div class="mt-1 text-sm text-white">21 堂組合包</div>
              <div class="text-xs text-slate-400">$4,800</div>
            </div>
          </div>
          <p class="text-slate-400 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            王小明選了 <span class="font-bold text-amber-400">14 堂組合包</span>，按下「購買」！
          </p>
        </div>
      </div>

      <!-- ========== PURCHASE_STRUCTURE ========== -->
      <div v-if="stepData.view === 'purchase_structure'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-purple-500/20 px-4 py-1 text-sm text-purple-400">🛒 CREDIT_PURCHASE</span>
          <h2 class="text-xl font-bold text-white">購買紀錄存在哪？</h2>
          <div class="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <h4 class="mb-3 font-bold text-purple-400">CREDIT_PURCHASE 堂數購買表</h4>
            <div v-for="(col, i) in [
              { name: 'id', desc: '紀錄編號（主鍵）' },
              { name: 'user_id', desc: '誰買的 → 對應 USER 表 ⭐', highlight: true },
              { name: 'credit_package_id', desc: '買哪個方案 → 對應 CREDIT_PACKAGE 表 ⭐', highlight: true },
              { name: 'purchased_credits', desc: '買了幾堂（記錄當時的值）' },
              { name: 'price_paid', desc: '付了多少錢（記錄當時的值）' },
              { name: 'created_at', desc: '資料建立時間' },
              { name: 'purchase_at', desc: '實際購買時間' }
            ]" :key="i" class="flex items-center gap-3 border-b border-slate-700 py-2 last:border-0 transition-all duration-300" :style="{ transitionDelay: `${i * 100}ms` }" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <span class="rounded px-2 py-1 font-mono text-sm" :class="col.highlight ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'">{{ col.name }}</span>
              <span class="text-sm text-slate-400">{{ col.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== PURCHASE_FIELDS ========== -->
      <div v-if="stepData.view === 'purchase_fields'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-purple-500/20 px-4 py-1 text-sm text-purple-400">🛒 CREDIT_PURCHASE</span>
          <h2 class="text-xl font-bold text-white">認識每個欄位</h2>
          <div class="w-full space-y-3">
            <!-- id 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-purple-500/20 px-3 py-1 font-mono text-purple-400">id</span>
                <span class="text-lg font-bold text-white">紀錄編號</span>
                <span class="rounded bg-purple-500/20 px-2 py-0.5 text-xs text-purple-400">主鍵</span>
              </div>
              <p class="text-sm text-slate-400">每筆購買紀錄都有獨一無二的編號</p>
            </div>
            <!-- user_id 欄位 -->
            <div class="rounded-xl border-2 border-amber-500/50 bg-amber-500/10 p-4 transition-all duration-300" style="transition-delay: 100ms" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-amber-500/30 px-3 py-1 font-mono text-amber-400">user_id</span>
                <span class="text-lg font-bold text-amber-400">誰買的 ⭐</span>
                <span class="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">外來鍵</span>
              </div>
              <p class="text-sm text-slate-300">對應到 USER 表的 id，用來找出是哪個會員買的</p>
              <p class="text-xs text-amber-300/70 mt-1">例如：user_id = 1 → 就是王小明（USER 表的第 1 筆）</p>
            </div>
            <!-- credit_package_id 欄位 -->
            <div class="rounded-xl border-2 border-amber-500/50 bg-amber-500/10 p-4 transition-all duration-300" style="transition-delay: 200ms" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-amber-500/30 px-3 py-1 font-mono text-amber-400">credit_package_id</span>
                <span class="text-lg font-bold text-amber-400">買哪個方案 ⭐</span>
                <span class="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">外來鍵</span>
              </div>
              <p class="text-sm text-slate-300">對應到 CREDIT_PACKAGE 表的 id</p>
              <p class="text-xs text-amber-300/70 mt-1">例如：credit_package_id = 2 → 14 堂組合包</p>
            </div>
            <!-- purchased_credits 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" style="transition-delay: 300ms" :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-purple-500/20 px-3 py-1 font-mono text-purple-400">purchased_credits</span>
                <span class="text-lg font-bold text-white">買了幾堂</span>
              </div>
              <p class="text-sm text-slate-400">記錄當時買了幾堂課</p>
            </div>
            <!-- price_paid 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" style="transition-delay: 400ms" :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-purple-500/20 px-3 py-1 font-mono text-purple-400">price_paid</span>
                <span class="text-lg font-bold text-white">付了多少錢</span>
              </div>
              <p class="text-sm text-slate-400">記錄當時付了多少錢</p>
            </div>
            <!-- created_at 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" style="transition-delay: 500ms" :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-purple-500/20 px-3 py-1 font-mono text-purple-400">created_at</span>
                <span class="text-lg font-bold text-white">資料建立時間</span>
              </div>
              <p class="text-sm text-slate-400">這筆紀錄是什麼時候被建立的</p>
            </div>
            <!-- purchase_at 欄位 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-300" style="transition-delay: 600ms" :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-center gap-3 mb-2">
                <span class="rounded bg-purple-500/20 px-3 py-1 font-mono text-purple-400">purchase_at</span>
                <span class="text-lg font-bold text-white">實際購買時間</span>
              </div>
              <p class="text-sm text-slate-400">會員實際付款的時間點</p>
            </div>
          </div>
          <div class="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-sm text-blue-300">🔗 <strong>外來鍵</strong> = 連到別的表！用編號來找對應的資料</p>
          </div>
        </div>
      </div>

      <!-- ========== PURCHASE_DATA ========== -->
      <div v-if="stepData.view === 'purchase_data'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <span class="rounded-full bg-purple-500/20 px-4 py-1 text-sm text-purple-400">🛒 CREDIT_PURCHASE</span>
          <h2 class="text-xl font-bold text-white">王小明的購買紀錄</h2>
          <div class="grid w-full gap-4 md:grid-cols-3">
            <div class="rounded-xl border border-blue-500/50 bg-slate-800/50 p-3 transition-all duration-300" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <div class="mb-2 text-sm font-bold text-blue-400">👤 USER 表</div>
              <table class="w-full text-xs">
                <thead><tr><th class="text-left text-slate-500">id</th><th class="text-left text-slate-500">name</th></tr></thead>
                <tbody>
                  <tr class="bg-amber-500/10"><td class="font-bold text-amber-400">1</td><td class="text-white">王小明</td></tr>
                  <tr><td class="text-slate-500">2</td><td class="text-slate-400">李燕容</td></tr>
                </tbody>
              </table>
            </div>
            <div class="rounded-xl border border-purple-500/50 bg-slate-800/50 p-3 transition-all duration-300" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'" style="transition-delay: 200ms">
              <div class="mb-2 text-sm font-bold text-purple-400">🛒 CREDIT_PURCHASE</div>
              <table class="w-full text-xs">
                <thead><tr><th class="text-left text-slate-500">user_id</th><th class="text-left text-slate-500">pkg_id</th><th class="text-left text-slate-500">price</th></tr></thead>
                <tbody><tr class="bg-amber-500/10"><td class="font-bold text-amber-400">1</td><td class="font-bold text-amber-400">2</td><td class="text-emerald-400">2,520</td></tr></tbody>
              </table>
            </div>
            <div class="rounded-xl border border-amber-500/50 bg-slate-800/50 p-3 transition-all duration-300" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'" style="transition-delay: 400ms">
              <div class="mb-2 text-sm font-bold text-amber-400">💰 CREDIT_PACKAGE</div>
              <table class="w-full text-xs">
                <thead><tr><th class="text-left text-slate-500">id</th><th class="text-left text-slate-500">name</th></tr></thead>
                <tbody>
                  <tr><td class="text-slate-500">1</td><td class="text-slate-400">7 堂組合包</td></tr>
                  <tr class="bg-amber-500/10"><td class="font-bold text-amber-400">2</td><td class="text-white">14 堂組合包</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
            <p class="text-sm text-emerald-300">🔗 <strong>user_id = 1</strong> → 王小明</p>
            <p class="text-sm text-emerald-300">🔗 <strong>credit_package_id = 2</strong> → 14 堂組合包</p>
            <p class="mt-2 text-sm text-emerald-300/70">「王小明買了 14 堂組合包，付了 2,520 元」</p>
          </div>
        </div>
      </div>

      <!-- ========== PURCHASE_QUIZ ========== -->
      <div v-if="stepData.view === 'purchase_quiz'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-purple-500/20 px-4 py-1 text-sm text-purple-400">🛒 CREDIT_PURCHASE</span>
          <h2 class="text-xl font-bold text-white">小測驗</h2>
          <div class="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <p class="mb-4 text-lg text-white">user_id = 1 代表誰？</p>
            <div class="flex flex-col gap-2">
              <button v-for="(opt, i) in [
                { label: 'A. 李燕容', correct: false },
                { label: 'B. 王小明', correct: true },
                { label: 'C. 小美', correct: false }
              ]" :key="i" class="rounded-lg border-2 px-4 py-3 text-left transition-all text-white" :class="[
                quizAnswered[27] && opt.correct && quizCorrect[27] ? 'border-green-500 bg-green-500/20 text-green-300' : '',
                quizAnswered[27] && selectedAnswer[27] === opt.label && !quizCorrect[27] ? 'border-rose-500 bg-rose-500/20 text-rose-300' : '',
                quizAnswered[27] && selectedAnswer[27] !== opt.label && !opt.correct ? 'border-slate-600 bg-slate-800/50 text-slate-400' : '',
                !quizAnswered[27] ? 'border-slate-600 hover:border-purple-500 hover:bg-slate-700/50' : ''
              ]" @click="checkAnswer(27, opt.label, opt.correct)" :disabled="quizAnswered[27]">
                {{ opt.label }}
              </button>
            </div>
            <div v-if="quizAnswered[27] && quizCorrect[27]" class="mt-4 rounded-lg bg-green-500/20 p-3 text-green-400">
              🎉 答對了！user_id = 1 對應到 USER 表的第一筆資料，就是王小明。
            </div>
            <div v-if="quizAnswered[27] && !quizCorrect[27]" class="mt-4 flex flex-col gap-3">
              <div class="rounded-lg bg-rose-500/20 p-3 text-rose-400">
                😅 差一點！回去看看 USER 表，id = 1 是誰？
              </div>
              <button class="rounded-lg border border-purple-500 bg-purple-500/20 px-4 py-2 text-purple-400 hover:bg-purple-500/30" @click="retryQuiz(27)">
                重新答題
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== SNAPSHOT ========== -->
      <div v-if="stepData.view === 'snapshot'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-4">
          <span class="rounded-full bg-purple-500/20 px-4 py-1 text-sm text-purple-400">🛒 CREDIT_PURCHASE</span>
          <h2 class="text-xl font-bold text-white">為什麼要記錄「當時的價格」？</h2>
          <div class="flex w-full items-start gap-4 transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-2xl">👨‍💼</div>
            <div class="rounded-xl border border-slate-700 bg-slate-800 p-3">
              <p class="text-slate-300">假設明天我把 14 堂方案漲價到 <span class="font-bold text-amber-400">3,000 元</span>...</p>
            </div>
          </div>
          <div class="flex w-full items-center gap-4 rounded-xl border-2 border-red-500/50 bg-red-500/10 p-3 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <span class="text-white">💰 14 堂組合包：</span>
            <span class="text-slate-400 line-through">$2,520</span>
            <span class="text-white">→</span>
            <span class="text-lg font-bold text-red-400">$3,000</span>
          </div>
          <div class="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-lg text-white">王小明之前買的訂單，應該是多少錢？</p>
          </div>
          <div class="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
            <p class="text-sm text-emerald-300">答案是 <strong>$2,520</strong>！</p>
            <p class="mt-1 text-sm text-emerald-300">我們記錄的是<span class="font-bold text-amber-400">「當時的價格」</span>，不是現在的價格</p>
            <p class="mt-1 text-sm text-emerald-300/70">📝 所以我們要把購買當下的價格記錄下來！</p>
          </div>
        </div>
      </div>

      <!-- ========== SUMMARY ========== -->
      <div v-if="stepData.view === 'summary'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <span class="rounded-full bg-emerald-500/20 px-4 py-1 text-sm text-emerald-400">總結</span>
          <h2 class="text-xl font-bold text-white">回顧 4 張資料表</h2>
          <div class="grid w-full grid-cols-2 gap-3">
            <div v-for="(table, i) in [
              { icon: '💰', name: 'CREDIT_PACKAGE', desc: '存放堂數方案' },
              { icon: '🏋️', name: 'SKILL', desc: '存放技能清單' },
              { icon: '👤', name: 'USER', desc: '存放會員資料' },
              { icon: '🛒', name: 'CREDIT_PURCHASE', desc: '存放購買紀錄' }
            ]" :key="i" class="rounded-xl border border-slate-700 bg-slate-800/50 p-3 text-center transition-all duration-300" :style="{ transitionDelay: `${i * 100}ms` }" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'">
              <div class="text-2xl">{{ table.icon }}</div>
              <div class="mt-1 text-sm font-bold text-white">{{ table.name }}</div>
              <div class="text-xs text-slate-400">{{ table.desc }}</div>
            </div>
          </div>
          <div class="grid w-full grid-cols-1 gap-2 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div v-for="(concept, i) in [
              { icon: '➕', text: '新增資料 = 加一列' },
              { icon: '✏️', text: '修改資料 = 改某一格' },
              { icon: '🔒', text: '唯一約束 = 不能重複' },
              { icon: '🔗', text: '外來鍵 = 連到別的表' },
              { icon: '📝', text: '記錄當時的值 = 不受未來修改影響' }
            ]" :key="i" class="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/50 p-2">
              <span class="text-xl">{{ concept.icon }}</span>
              <span class="text-sm text-slate-300">{{ concept.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== DATA_REVIEW ========== -->
      <div v-if="stepData.view === 'data_review'" class="relative flex min-h-0 flex-1 flex-col items-center justify-start overflow-y-auto p-4 py-6">
        <div class="relative z-10 flex w-full max-w-4xl flex-col items-center gap-4">
          <span class="rounded-full bg-emerald-500/20 px-4 py-1 text-sm text-emerald-400">資料總覽</span>
          <h2 class="text-xl font-bold text-white">來看看我們加了哪些資料！</h2>
          <p class="text-sm text-slate-400">（僅顯示關鍵欄位，完整欄位請參考各表結構頁）</p>

          <div class="grid w-full grid-cols-2 gap-4">
            <!-- CREDIT_PACKAGE 表 -->
            <div class="rounded-xl border border-amber-500/30 bg-slate-800/50 p-3 transition-all duration-300" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <h4 class="mb-2 flex items-center gap-2 font-bold text-amber-400">
                <span>💰</span> CREDIT_PACKAGE <span class="text-xs font-normal text-slate-400">堂數方案表</span>
              </h4>
              <table class="w-full text-xs">
                <thead>
                  <tr class="text-slate-500">
                    <th class="py-1 text-left">name</th>
                    <th class="py-1 text-right">credit_amount</th>
                    <th class="py-1 text-right">price</th>
                  </tr>
                </thead>
                <tbody class="text-slate-300">
                  <tr><td>7 堂組合包</td><td class="text-right">7</td><td class="text-right">1400</td></tr>
                  <tr><td>14 堂組合包</td><td class="text-right">14</td><td class="text-right">2520</td></tr>
                  <tr><td>21 堂組合包</td><td class="text-right">21</td><td class="text-right">3780</td></tr>
                </tbody>
              </table>
            </div>

            <!-- SKILL 表 -->
            <div class="rounded-xl border border-green-500/30 bg-slate-800/50 p-3 transition-all duration-300" style="transition-delay: 100ms" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <h4 class="mb-2 flex items-center gap-2 font-bold text-green-400">
                <span>🏋️</span> SKILL <span class="text-xs font-normal text-slate-400">技能表</span>
              </h4>
              <table class="w-full text-xs">
                <thead>
                  <tr class="text-slate-500">
                    <th class="py-1 text-left">id</th>
                    <th class="py-1 text-left">name</th>
                  </tr>
                </thead>
                <tbody class="text-slate-300">
                  <tr><td>1</td><td>重訓</td></tr>
                  <tr><td>2</td><td>瑜伽</td></tr>
                  <tr><td>3</td><td>有氧運動</td></tr>
                </tbody>
              </table>
            </div>

            <!-- USER 表 -->
            <div class="rounded-xl border border-blue-500/30 bg-slate-800/50 p-3 transition-all duration-300" style="transition-delay: 200ms" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <h4 class="mb-2 flex items-center gap-2 font-bold text-blue-400">
                <span>👤</span> USER <span class="text-xs font-normal text-slate-400">會員表</span>
              </h4>
              <table class="w-full text-xs">
                <thead>
                  <tr class="text-slate-500">
                    <th class="py-1 text-left">name</th>
                    <th class="py-1 text-left">email</th>
                    <th class="py-1 text-left">role</th>
                  </tr>
                </thead>
                <tbody class="text-slate-300">
                  <tr><td>王小明</td><td>ming@email.com</td><td class="text-blue-400">user</td></tr>
                  <tr><td>李燕容</td><td>yan@email.com</td><td class="text-green-400">coach</td></tr>
                  <tr><td>小美</td><td>mei@email.com</td><td class="text-blue-400">user</td></tr>
                </tbody>
              </table>
              <p class="mt-2 text-xs text-slate-500">* 李燕容已升級為教練</p>
            </div>

            <!-- CREDIT_PURCHASE 表 -->
            <div class="rounded-xl border border-purple-500/30 bg-slate-800/50 p-3 transition-all duration-300" style="transition-delay: 300ms" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <h4 class="mb-2 flex items-center gap-2 font-bold text-purple-400">
                <span>🛒</span> CREDIT_PURCHASE <span class="text-xs font-normal text-slate-400">購買紀錄表</span>
              </h4>
              <table class="w-full text-xs">
                <thead>
                  <tr class="text-slate-500">
                    <th class="py-1 text-left">user</th>
                    <th class="py-1 text-left">package</th>
                    <th class="py-1 text-right">credits</th>
                    <th class="py-1 text-right">price</th>
                  </tr>
                </thead>
                <tbody class="text-slate-300">
                  <tr>
                    <td>王小明</td>
                    <td>14 堂組合包</td>
                    <td class="text-right">14</td>
                    <td class="text-right">2520</td>
                  </tr>
                </tbody>
              </table>
              <p class="mt-2 text-xs text-slate-500">* 記錄了購買當時的價格</p>
            </div>
          </div>

          <div class="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center transition-all duration-500" style="transition-delay: 400ms" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-sm text-emerald-300">🎉 這就是目前 LiveFit 資料庫的狀態！</p>
          </div>
        </div>
      </div>

      <!-- ========== CONGRATS ========== -->
      <div v-if="stepData.view === 'congrats'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-xl flex-col items-center gap-6 text-center">
          <div class="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-5xl shadow-2xl shadow-amber-500/30 transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
            🏆
          </div>
          <h2 class="text-3xl font-bold text-white transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            恭喜完成！
          </h2>
          <p class="text-lg text-slate-300 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            你已經看懂真實的資料庫了！
          </p>
          <div class="grid w-full grid-cols-1 gap-2 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div v-for="(item, i) in [
              '認識了 4 張資料表',
              '了解新增和修改資料',
              '知道什麼是唯一約束',
              '理解外來鍵的用途',
              '學會記錄當時的值'
            ]" :key="i" class="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-2">
              <span class="text-emerald-400">✅</span>
              <span class="text-sm text-emerald-300">{{ item }}</span>
            </div>
          </div>
          <p class="text-sm text-slate-400">LiveFit 還有其他資料表，等你學會更多技巧再來看！</p>
        </div>
      </div>

    </div>
  </InteractiveSlideTemplate>
</template>
