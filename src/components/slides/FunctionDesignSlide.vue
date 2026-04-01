<script setup lang="ts">
/**
 * 函式設計之術
 * 19 步驟情境式教學：從自動販賣機比喻到物件取值，完整掌握 function
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  { id: 0,  view: 'welcome',           title: '歡迎',               desc: '海姐帶你學函式' },
  { id: 1,  view: 'concept-machine',   title: '自動販賣機',          desc: '函式就像一台機器' },
  { id: 2,  view: 'syntax-declare',    title: '宣告 vs 呼叫',       desc: '❌✅ 對比展示' },
  { id: 3,  view: 'quiz-call',         title: '挑戰：會印出嗎？',    desc: '只宣告沒呼叫會怎樣？' },
  { id: 4,  view: 'concept-param',     title: '參數',               desc: '按鈕決定掉什麼飲料' },
  { id: 5,  view: 'quiz-scope',        title: '挑戰：參數在哪能用？', desc: '函式外面用參數會？' },
  { id: 6,  view: 'concept-return',    title: 'return',             desc: '投材料進去，吐成品出來' },
  { id: 7,  view: 'compare-return',    title: 'return vs console.log', desc: '❌✅ 值帶不帶得出來' },
  { id: 8,  view: 'quiz-return',       title: '挑戰：印出什麼？',    desc: '用 console.log 接函式結果' },
  { id: 9,  view: 'concept-if-func',   title: 'if + function',      desc: '把判斷包進函式重複用' },
  { id: 10, view: 'quiz-discount',     title: '挑戰：拉麵打折',      desc: '4碗打9折多少錢？' },
  { id: 11, view: 'concept-obj-dot',   title: '物件取值：點記法',    desc: '用 . 拿物件資料' },
  { id: 12, view: 'concept-obj-bracket', title: '中括號取值',        desc: '用變數動態取值' },
  { id: 13, view: 'quiz-bmi',          title: '挑戰：BMI 查詢',     desc: "checkBmi('normal') 印出？" },
  { id: 14, view: 'scene-intro',       title: '情境拆解',            desc: '三個階段串起來' },
  { id: 15, view: 'scene-order',       title: '第一階段：點餐',      desc: '函式 + 驗證 + 累加' },
  { id: 16, view: 'scene-checkout',    title: '第二階段：結帳',      desc: 'ruleKey + 中括號取值' },
  { id: 17, view: 'scene-clear',       title: '第三階段：清空',      desc: '重置變數 + 完整流程' },
  { id: 18, view: 'summary-end',       title: '課程結束',            desc: '海姐的結語' },
]

// ── Core ──
const currentStep = ref(0)
const stepData = computed(() => STEPS[currentStep.value])
const feedback = ref('')
const feedbackType = ref<'neutral' | 'success' | 'error'>('neutral')

const feedbackClass = computed(() => {
  const map = {
    neutral: 'border-slate-600 bg-slate-800/80 text-slate-300',
    success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    error: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
  }
  return map[feedbackType.value]
})
const feedbackIcon = computed(() => {
  const map = { neutral: '💡', success: '✅', error: '❌' }
  return map[feedbackType.value]
})

// ── Quiz answers ──
const quizAnswers = ref<Record<string, string>>({})

function answerQuiz(id: string, answer: string, correct: string, successMsg: string, errorMsg: string) {
  if (answer === correct) {
    quizAnswers.value[id] = answer
    feedback.value = successMsg
    feedbackType.value = 'success'
  } else {
    feedback.value = errorMsg
    feedbackType.value = 'error'
  }
}

// ── Navigation ──
const canGoNext = computed(() => {
  const v = stepData.value.view
  if (v === 'quiz-call') return quizAnswers.value['call'] === 'no'
  if (v === 'quiz-scope') return quizAnswers.value['scope'] === 'error'
  if (v === 'quiz-return') return quizAnswers.value['return'] === 'undefined'
  if (v === 'quiz-discount') return quizAnswers.value['discount'] === '648'
  if (v === 'quiz-bmi') return quizAnswers.value['bmi'] === 'normal'
  return true
})

const nextStepHint = computed(() => {
  const v = stepData.value.view
  if (v === 'quiz-call' && !quizAnswers.value['call']) return '選一個答案'
  if (v === 'quiz-scope' && !quizAnswers.value['scope']) return '選一個答案'
  if (v === 'quiz-return' && !quizAnswers.value['return']) return '選一個答案'
  if (v === 'quiz-discount' && !quizAnswers.value['discount']) return '選一個答案'
  if (v === 'quiz-bmi' && !quizAnswers.value['bmi']) return '選一個答案'
  return ''
})

// Reset feedback on step change
watch(() => stepData.value.view, () => {
  feedback.value = ''
  feedbackType.value = 'neutral'
})

function nextStep() { if (currentStep.value < STEPS.length - 1) currentStep.value++ }
function prevStep() { if (currentStep.value > 0) currentStep.value-- }
function gotoStep(step: number) { if (step >= 0 && step < STEPS.length) currentStep.value = step }

// ── Scene flow phase (for scene-order / scene-checkout / scene-clear) ──
const sceneOrderPhase = ref(0)
const sceneCheckoutPhase = ref(0)
const sceneClearPhase = ref(0)
</script>

<template>
  <InteractiveSlideTemplate
    title="函式設計之術"
    subtitle="Function"
    icon="⚡"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="sky"
    :canGoNext="canGoNext"
    :nextStepHint="nextStepHint"
    @prev="prevStep"
    @next="nextStep"
    @goto="gotoStep"
    @complete="emit('complete')"
  >
    <!-- ===== Shared Feedback Bar ===== -->
    <div v-if="feedback" class="mx-auto max-w-3xl px-4 pt-4">
      <div class="rounded-xl border px-4 py-3 text-sm md:text-base" :class="feedbackClass">
        <span class="mr-2">{{ feedbackIcon }}</span>{{ feedback }}
      </div>
    </div>

    <!-- ===== Step 0: Welcome ===== -->
    <div v-if="stepData.view === 'welcome'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">function</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-sky-400 object-cover shadow-xl shadow-sky-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-sky-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">嗨，我是<strong class="text-sky-300">海姐</strong> 👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">今天我們來學一個很重要的東西——<strong class="text-sky-300">函式</strong>。</p>
          <p class="mb-2 text-sm leading-relaxed text-white md:text-base">你可以把它想像成一台<strong class="text-sky-300">自動販賣機</strong>，設定好要做什麼，之後每次按按鈕就會執行。</p>
          <p class="text-xs text-slate-500 italic">「寫一次，用無數次。」—— 海姐</p>
        </div>
      </div>
      <button @click="nextStep()" class="btn-action animate-bounce px-8 py-4 text-lg">
        開始 →
      </button>
    </div>

    <!-- ===== Step 1: Concept Machine ===== -->
    <div v-else-if="stepData.view === 'concept-machine'" class="slide-page">
      <div class="wm">function</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">函式 = 自動販賣機</h2>
        <div class="flex flex-col gap-6 md:flex-row md:gap-8">
          <!-- 販賣機圖示 -->
          <div class="flex w-48 flex-col items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/5 p-6">
            <p class="text-6xl">🏭</p>
            <p class="mt-3 text-center text-sm font-bold text-sky-300">自動販賣機</p>
          </div>
          <!-- 三步驟 -->
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-4">
              <span class="text-2xl">🔧</span>
              <div>
                <p class="text-sm font-bold text-sky-300">Step 1 — 設定機器</p>
                <div class="code-block mt-2">
                  <code><span class="kw">function</span> <span class="fn">sayHello</span>() {<br>&nbsp;&nbsp;<span class="fn">console</span>.<span class="fn">log</span>(<span class="str">'哈囉！'</span>)<br>}</code>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-4">
              <span class="text-2xl">🔘</span>
              <div>
                <p class="text-sm font-bold text-sky-300">Step 2 — 按按鈕</p>
                <div class="code-block mt-2">
                  <code><span class="fn">sayHello</span>()</code>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-4">
              <span class="text-2xl">📢</span>
              <div>
                <p class="text-sm font-bold text-sky-300">Step 3 — 吐出結果</p>
                <div class="code-block mt-2">
                  <code><span class="cmt">// 哈囉！</span></code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 2: Syntax Declare vs Call ===== -->
    <div v-else-if="stepData.view === 'syntax-declare'" class="slide-page">
      <div class="wm">( )</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">宣告 vs 呼叫</h2>
        <div class="flex flex-col gap-6 md:flex-row md:gap-10">
          <!-- 左：只宣告 -->
          <div class="w-80 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6">
            <p class="mb-3 text-center text-lg font-bold text-rose-400">❌ 只宣告不呼叫</p>
            <div class="code-block">
              <code><span class="kw">function</span> <span class="fn">sayHello</span>() {<br>&nbsp;&nbsp;<span class="fn">console</span>.<span class="fn">log</span>(<span class="str">'哈囉！'</span>)<br>}<br><br><span class="cmt">// 什麼都不會發生</span></code>
            </div>
            <p class="mt-3 text-center text-sm text-rose-300">機器設好了，但沒人按按鈕</p>
          </div>
          <!-- 右：宣告＋呼叫 -->
          <div class="w-80 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
            <p class="mb-3 text-center text-lg font-bold text-emerald-400">✅ 宣告 + 呼叫</p>
            <div class="code-block">
              <code><span class="kw">function</span> <span class="fn">sayHello</span>() {<br>&nbsp;&nbsp;<span class="fn">console</span>.<span class="fn">log</span>(<span class="str">'哈囉！'</span>)<br>}<br><br><span class="fn">sayHello</span>() <span class="cmt">// 印出 哈囉！</span></code>
            </div>
            <p class="mt-3 text-center text-sm text-emerald-300">按下按鈕，機器啟動！</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 3: Quiz Call ===== -->
    <div v-else-if="stepData.view === 'quiz-call'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">挑戰</div>
        <h2 class="text-xl font-bold text-white">以下程式碼會印出東西嗎？</h2>
        <div class="code-block w-full max-w-md">
          <code><span class="kw">function</span> <span class="fn">greet</span>() {<br>&nbsp;&nbsp;<span class="fn">console</span>.<span class="fn">log</span>(<span class="str">'早安！'</span>)<br>}</code>
        </div>
        <div v-if="!quizAnswers['call']" class="flex gap-4">
          <button @click="answerQuiz('call', 'yes', 'no', '', '再想想，光是寫出函式，沒有呼叫的話...')" class="pick-btn pick-a">會印出</button>
          <button @click="answerQuiz('call', 'no', 'no', '沒有呼叫 greet()，所以什麼都不會發生！宣告只是在告訴程式「有這台機器」', '')" class="pick-btn pick-b">不會印出</button>
        </div>
        <div v-else class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-3 text-sm text-emerald-300 animate-value-appear">
          💡 只寫 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-sky-300">function greet(){...}</code> 是宣告，必須加 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-sky-300">greet()</code> 才會執行！
        </div>
      </div>
    </div>

    <!-- ===== Step 4: Concept Param ===== -->
    <div v-else-if="stepData.view === 'concept-param'" class="slide-page">
      <div class="wm">param</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">參數 = 販賣機按鈕</h2>
        <div class="flex flex-col gap-6 md:flex-row md:gap-10">
          <!-- 販賣機按鈕比喻 -->
          <div class="w-64 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-6">
            <p class="mb-4 text-center text-4xl">🏭</p>
            <div class="space-y-3">
              <div class="flex items-center gap-3 rounded-lg bg-slate-900/60 px-4 py-2.5 text-sm text-white">
                <span class="text-xl">🔘</span><span>按鈕 1 → 🥤 可樂</span>
              </div>
              <div class="flex items-center gap-3 rounded-lg bg-slate-900/60 px-4 py-2.5 text-sm text-white">
                <span class="text-xl">🔘</span><span>按鈕 2 → 🧃 果汁</span>
              </div>
            </div>
          </div>
          <!-- 程式碼 -->
          <div class="flex-1">
            <p class="mb-3 text-sm font-bold text-sky-300">對應程式碼</p>
            <div class="code-block">
              <code><span class="kw">function</span> <span class="fn">callNum</span>(<span class="text-orange-300">num</span>) {<br>&nbsp;&nbsp;<span class="fn">console</span>.<span class="fn">log</span>(<span class="str">`呼叫<span class="text-orange-300">${num}</span>號`</span>)<br>}<br><br><span class="fn">callNum</span>(<span class="num">1</span>) <span class="cmt">// 呼叫1號</span><br><span class="fn">callNum</span>(<span class="num">2</span>) <span class="cmt">// 呼叫2號</span></code>
            </div>
            <p class="mt-4 text-sm text-slate-400">按不同按鈕（傳不同參數），出來的東西就不一樣！</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 5: Quiz Scope ===== -->
    <div v-else-if="stepData.view === 'quiz-scope'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">挑戰</div>
        <h2 class="text-xl font-bold text-white">最後一行會怎樣？</h2>
        <div class="code-block w-full max-w-md">
          <code><span class="kw">function</span> <span class="fn">callNum</span>(<span class="text-orange-300">num</span>) {<br>&nbsp;&nbsp;<span class="fn">console</span>.<span class="fn">log</span>(<span class="str">`呼叫<span class="text-orange-300">${num}</span>號`</span>)<br>}<br><br><span class="fn">callNum</span>(<span class="num">5</span>)<br><span class="fn">console</span>.<span class="fn">log</span>(<span class="text-orange-300">num</span>) <span class="cmt">// ← 這行？</span></code>
        </div>
        <div v-if="!quizAnswers['scope']" class="flex gap-4">
          <button @click="answerQuiz('scope', 'five', 'error', '', '參數 num 是函式的專屬員工喔，想想它的工作範圍...')" class="pick-btn pick-a">印出 5</button>
          <button @click="answerQuiz('scope', 'error', 'error', '參數只在函式裡面上班，出了大門就找不到人了！', '')" class="pick-btn pick-b">報錯 num is not defined</button>
        </div>
        <div v-else class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-3 text-sm text-emerald-300 animate-value-appear">
          💡 參數 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-orange-300">num</code> 只活在函式 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-sky-300">{ }</code> 裡面，外面無法存取。
        </div>
      </div>
    </div>

    <!-- ===== Step 6: Concept Return ===== -->
    <div v-else-if="stepData.view === 'concept-return'" class="slide-page">
      <div class="wm">return</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">return = 吐出成品</h2>
        <div class="flex flex-col items-center gap-6 md:flex-row md:gap-4">
          <!-- 流程圖 -->
          <div class="flex items-center gap-3">
            <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-center">
              <p class="text-2xl">📥</p>
              <p class="mt-1 text-xs text-sky-300">投入材料</p>
              <p class="text-xs text-slate-400">（參數）</p>
            </div>
            <span class="text-2xl text-slate-500">→</span>
            <div class="rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-center">
              <p class="text-2xl">⚙️</p>
              <p class="mt-1 text-xs text-purple-300">機器加工</p>
              <p class="text-xs text-slate-400">（函式邏輯）</p>
            </div>
            <span class="text-2xl text-slate-500">→</span>
            <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center">
              <p class="text-2xl">📤</p>
              <p class="mt-1 text-xs text-emerald-300">吐出成品</p>
              <p class="text-xs text-slate-400">（return）</p>
            </div>
          </div>
        </div>
        <div class="code-block w-full max-w-md">
          <code><span class="kw">function</span> <span class="fn">addNum</span>(<span class="text-orange-300">num1</span>, <span class="text-orange-300">num2</span>) {<br>&nbsp;&nbsp;<span class="kw">return</span> <span class="text-orange-300">num1</span> + <span class="text-orange-300">num2</span><br>}<br><br><span class="kw">const</span> result = <span class="fn">addNum</span>(<span class="num">1</span>, <span class="num">2</span>) <span class="cmt">// result = 3</span></code>
        </div>
        <p class="text-sm text-slate-400">有 return，值才帶得出來！</p>
      </div>
    </div>

    <!-- ===== Step 7: Compare Return vs console.log ===== -->
    <div v-else-if="stepData.view === 'compare-return'" class="slide-page">
      <div class="wm">return</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">return vs console.log</h2>
        <div class="flex flex-col gap-6 md:flex-row md:gap-10">
          <!-- 左：console.log -->
          <div class="w-80 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6">
            <p class="mb-3 text-center text-lg font-bold text-rose-400">❌ console.log</p>
            <div class="code-block">
              <code><span class="kw">function</span> <span class="fn">addNum</span>(<span class="text-orange-300">num1</span>, <span class="text-orange-300">num2</span>) {<br>&nbsp;&nbsp;<span class="fn">console</span>.<span class="fn">log</span>(<span class="text-orange-300">num1</span> + <span class="text-orange-300">num2</span>)<br>}<br><br><span class="kw">const</span> num = <span class="fn">addNum</span>(<span class="num">1</span>, <span class="num">2</span>)<br><span class="cmt">// num = undefined 😱</span></code>
            </div>
            <p class="mt-3 text-center text-sm text-rose-300">印出來了，但值帶不出去</p>
          </div>
          <!-- 右：return -->
          <div class="w-80 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
            <p class="mb-3 text-center text-lg font-bold text-emerald-400">✅ return</p>
            <div class="code-block">
              <code><span class="kw">function</span> <span class="fn">addNum</span>(<span class="text-orange-300">num1</span>, <span class="text-orange-300">num2</span>) {<br>&nbsp;&nbsp;<span class="kw">return</span> <span class="text-orange-300">num1</span> + <span class="text-orange-300">num2</span><br>}<br><br><span class="kw">const</span> num = <span class="fn">addNum</span>(<span class="num">1</span>, <span class="num">2</span>)<br><span class="cmt">// num = 3 ✅</span></code>
            </div>
            <p class="mt-3 text-center text-sm text-emerald-300">值真的帶出來了！</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 8: Quiz Return ===== -->
    <div v-else-if="stepData.view === 'quiz-return'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">挑戰</div>
        <h2 class="text-xl font-bold text-white">num 的值是什麼？</h2>
        <div class="code-block w-full max-w-md">
          <code><span class="kw">function</span> <span class="fn">addNum</span>(<span class="text-orange-300">a</span>, <span class="text-orange-300">b</span>) {<br>&nbsp;&nbsp;<span class="fn">console</span>.<span class="fn">log</span>(<span class="text-orange-300">a</span> + <span class="text-orange-300">b</span>)<br>}<br><br><span class="kw">const</span> num = <span class="fn">addNum</span>(<span class="num">1</span>, <span class="num">2</span>)<br><span class="fn">console</span>.<span class="fn">log</span>(num) <span class="cmt">// ← 印出？</span></code>
        </div>
        <div v-if="!quizAnswers['return']" class="flex gap-4">
          <button @click="answerQuiz('return', 'three', 'undefined', '', 'console.log 跟 return 不一樣喔，再想想...')" class="pick-btn pick-a">3</button>
          <button @click="answerQuiz('return', 'undefined', 'undefined', 'console.log 只是印出來看看，沒有 return 就帶不出值！', '')" class="pick-btn pick-b">undefined</button>
        </div>
        <div v-else class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-3 text-sm text-emerald-300 animate-value-appear">
          💡 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-sky-300">console.log</code> 只是「印出來看看」，要用 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-purple-400">return</code> 才能把值帶出函式！
        </div>
      </div>
    </div>

    <!-- ===== Step 9: Concept If + Function ===== -->
    <div v-else-if="stepData.view === 'concept-if-func'" class="slide-page">
      <div class="wm">if</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">if + function = 可重複使用的判斷</h2>
        <div class="rounded-xl border border-sky-500/30 bg-sky-500/5 px-5 py-3 text-sm text-sky-300">
          💡 把 if 判斷包進函式 → 以後每次都能直接呼叫，不用重寫！
        </div>
        <div class="code-block w-full max-w-lg">
          <code><span class="cmt">// 拉麵打折計算器</span><br><span class="kw">function</span> <span class="fn">calcDiscount</span>(<span class="text-orange-300">count</span>) {<br>&nbsp;&nbsp;<span class="kw">const</span> total = <span class="text-orange-300">count</span> * <span class="num">180</span><br>&nbsp;&nbsp;<span class="kw">if</span> (<span class="text-orange-300">count</span> >= <span class="num">3</span>) {<br>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return</span> total * <span class="num">0.9</span><br>&nbsp;&nbsp;} <span class="kw">else</span> {<br>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return</span> total<br>&nbsp;&nbsp;}<br>}</code>
        </div>
        <div class="flex gap-6 text-sm">
          <div class="rounded-lg bg-slate-800 px-4 py-2 text-slate-300">
            <span class="fn">calcDiscount</span>(<span class="num">2</span>) → <span class="num">360</span> <span class="text-slate-500">(原價)</span>
          </div>
          <div class="rounded-lg bg-slate-800 px-4 py-2 text-slate-300">
            <span class="fn">calcDiscount</span>(<span class="num">4</span>) → <span class="num">648</span> <span class="text-slate-500">(打9折)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 10: Quiz Discount ===== -->
    <div v-else-if="stepData.view === 'quiz-discount'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">挑戰</div>
        <h2 class="text-xl font-bold text-white">小美點了 4 碗拉麵，要付多少？</h2>
        <p class="text-sm text-slate-400">每碗 180 元，3 碗以上打 9 折</p>
        <div class="code-block w-full max-w-md">
          <code><span class="kw">function</span> <span class="fn">calcDiscount</span>(<span class="text-orange-300">count</span>) {<br>&nbsp;&nbsp;<span class="kw">const</span> total = <span class="text-orange-300">count</span> * <span class="num">180</span><br>&nbsp;&nbsp;<span class="kw">if</span> (<span class="text-orange-300">count</span> >= <span class="num">3</span>) {<br>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return</span> total * <span class="num">0.9</span><br>&nbsp;&nbsp;} <span class="kw">else</span> {<br>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return</span> total<br>&nbsp;&nbsp;}<br>}<br><br><span class="fn">calcDiscount</span>(<span class="num">4</span>) <span class="cmt">// ?</span></code>
        </div>
        <div v-if="!quizAnswers['discount']" class="flex gap-4">
          <button @click="answerQuiz('discount', '720', '648', '', '先算原價 180×4，再打9折 ×0.9')" class="pick-btn pick-a">720</button>
          <button @click="answerQuiz('discount', '648', '648', '180 × 4 = 720，打9折 → 720 × 0.9 = 648！', '')" class="pick-btn pick-b">648</button>
          <button @click="answerQuiz('discount', '540', '648', '', '先算原價 180×4，再打9折 ×0.9')" class="pick-btn pick-c">540</button>
        </div>
        <div v-else class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-3 text-sm text-emerald-300 animate-value-appear">
          💡 180 × 4 = 720 → 4 碗 ≥ 3 碗，打9折 → 720 × 0.9 = <strong class="text-white">648</strong>
        </div>
      </div>
    </div>

    <!-- ===== Step 11: Concept Obj Dot ===== -->
    <div v-else-if="stepData.view === 'concept-obj-dot'" class="slide-page">
      <div class="wm">obj.key</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">物件取值：點記法</h2>
        <div class="code-block w-full max-w-md">
          <code><span class="kw">const</span> student = {<br>&nbsp;&nbsp;name: <span class="str">'小美'</span>,<br>&nbsp;&nbsp;score: <span class="num">85</span><br>}</code>
        </div>
        <div class="flex flex-col gap-4 w-full max-w-md">
          <div class="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3">
            <code class="text-sm text-slate-300">student<span class="text-sky-300">.name</span></code>
            <span class="text-slate-500">→</span>
            <span class="rounded-lg bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-300 animate-value-appear">'小美'</span>
          </div>
          <div class="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3">
            <code class="text-sm text-slate-300">student<span class="text-sky-300">.score</span></code>
            <span class="text-slate-500">→</span>
            <span class="rounded-lg bg-amber-500/10 px-3 py-1 text-sm font-bold text-amber-300 animate-value-appear">85</span>
          </div>
        </div>
        <p class="text-sm text-slate-400">用 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-sky-300">.</code> 加上屬性名稱，就能拿到物件裡的值</p>
      </div>
    </div>

    <!-- ===== Step 12: Concept Obj Bracket ===== -->
    <div v-else-if="stepData.view === 'concept-obj-bracket'" class="slide-page">
      <div class="wm">obj[key]</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">中括號取值：用變數動態取</h2>
        <div class="flex flex-col gap-6 md:flex-row md:gap-10">
          <!-- 點記法 -->
          <div class="w-72 rounded-2xl border border-slate-600 bg-slate-800/60 p-5">
            <p class="mb-2 text-center text-sm font-bold text-slate-400">點記法（寫死）</p>
            <div class="code-block">
              <code>student<span class="text-sky-300">.name</span><br><span class="cmt">// 永遠取 name</span></code>
            </div>
          </div>
          <!-- 中括號 -->
          <div class="w-72 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-5">
            <p class="mb-2 text-center text-sm font-bold text-sky-300">中括號（動態）</p>
            <div class="code-block">
              <code><span class="kw">let</span> key = <span class="str">'name'</span><br>student[key] <span class="cmt">// '小美'</span><br><br>key = <span class="str">'score'</span><br>student[key] <span class="cmt">// 85</span></code>
            </div>
          </div>
        </div>
        <p class="text-sm text-slate-400">中括號的好處：key 是變數，可以隨時切換要取的屬性！</p>
      </div>
    </div>

    <!-- ===== Step 13: Quiz BMI ===== -->
    <div v-else-if="stepData.view === 'quiz-bmi'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">挑戰</div>
        <h2 class="text-xl font-bold text-white">checkBmi('normal') 回傳什麼？</h2>
        <div class="code-block w-full max-w-lg">
          <code><span class="kw">const</span> bmiData = {<br>&nbsp;&nbsp;overThin: { state: <span class="str">'過輕'</span>, color: <span class="str">'藍色'</span> },<br>&nbsp;&nbsp;normal: { state: <span class="str">'正常'</span>, color: <span class="str">'紅色'</span> }<br>}<br><br><span class="kw">function</span> <span class="fn">checkBmi</span>(<span class="text-orange-300">status</span>) {<br>&nbsp;&nbsp;<span class="kw">return</span> bmiData[<span class="text-orange-300">status</span>].state<br>}<br><br><span class="fn">checkBmi</span>(<span class="str">'normal'</span>) <span class="cmt">// ← 回傳？</span></code>
        </div>
        <div v-if="!quizAnswers['bmi']" class="flex gap-4">
          <button @click="answerQuiz('bmi', 'overThin', 'normal', '', 'status 的值是 \'normal\'，所以 bmiData[status] 會取到哪個？')" class="pick-btn pick-a">'過輕'</button>
          <button @click="answerQuiz('bmi', 'normal', 'normal', 'bmiData[\'normal\'].state → \'正常\'！中括號取值就是這麼好用', '')" class="pick-btn pick-b">'正常'</button>
          <button @click="answerQuiz('bmi', 'undefined', 'normal', '', 'status 的值是 \'normal\'，所以 bmiData[status] 會取到哪個？')" class="pick-btn pick-c">undefined</button>
        </div>
        <div v-else class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-3 text-sm text-emerald-300 animate-value-appear">
          💡 <code class="rounded bg-slate-700 px-1.5 py-0.5">bmiData[<span class="str">'normal'</span>]</code> → <code class="rounded bg-slate-700 px-1.5 py-0.5">{ state: '正常', color: '紅色' }</code> → <code class="rounded bg-slate-700 px-1.5 py-0.5">.state</code> → <strong class="text-white">'正常'</strong>
        </div>
      </div>
    </div>

    <!-- ===== Step 14: Scene Intro ===== -->
    <div v-else-if="stepData.view === 'scene-intro'" class="slide-page">
      <div class="wm">🍜</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">情境拆解：拉麵點餐系統</h2>
        <p class="text-sm text-slate-400">把前面學的全部串起來，分三個階段完成！</p>
        <div class="flex flex-col gap-5 w-full max-w-md">
          <div class="flex items-center gap-4 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-5 transition-all hover:border-sky-400/50">
            <span class="text-3xl">🍜</span>
            <div>
              <p class="font-bold text-sky-300">第一階段：點餐</p>
              <p class="text-sm text-slate-400">函式 + 驗證 + 累加</p>
            </div>
          </div>
          <div class="flex items-center gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 transition-all hover:border-amber-400/50">
            <span class="text-3xl">💰</span>
            <div>
              <p class="font-bold text-amber-300">第二階段：結帳</p>
              <p class="text-sm text-slate-400">ruleKey + 物件取值</p>
            </div>
          </div>
          <div class="flex items-center gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 transition-all hover:border-emerald-400/50">
            <span class="text-3xl">🔄</span>
            <div>
              <p class="font-bold text-emerald-300">第三階段：清空</p>
              <p class="text-sm text-slate-400">重置變數</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 15: Scene Order ===== -->
    <div v-else-if="stepData.view === 'scene-order'" class="slide-page">
      <div class="wm">🍜</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">🍜 第一階段：點餐</div>
        <h2 class="text-lg font-bold text-white">函式 + 驗證 + 累加</h2>
        <div class="w-full max-w-lg space-y-3">
          <div class="code-block" v-if="sceneOrderPhase >= 0">
            <code><span class="kw">let</span> total = <span class="num">0</span></code>
          </div>
          <div class="code-block animate-value-appear" v-if="sceneOrderPhase >= 1">
            <code><span class="kw">function</span> <span class="fn">addOrder</span>(<span class="text-orange-300">price</span>, <span class="text-orange-300">count</span>) {<br>&nbsp;&nbsp;<span class="cmt">// 驗證：數量要大於 0</span><br>&nbsp;&nbsp;<span class="kw">if</span> (<span class="text-orange-300">count</span> &lt;= <span class="num">0</span>) {<br>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return</span> <span class="str">'數量錯誤'</span><br>&nbsp;&nbsp;}<br>&nbsp;&nbsp;<span class="cmt">// 累加到 total</span><br>&nbsp;&nbsp;total += <span class="text-orange-300">price</span> * <span class="text-orange-300">count</span><br>&nbsp;&nbsp;<span class="kw">return</span> total<br>}</code>
          </div>
          <div class="code-block animate-value-appear" v-if="sceneOrderPhase >= 2">
            <code><span class="fn">addOrder</span>(<span class="num">180</span>, <span class="num">2</span>) <span class="cmt">// total = 360</span><br><span class="fn">addOrder</span>(<span class="num">60</span>, <span class="num">1</span>)  <span class="cmt">// total = 420</span></code>
          </div>
        </div>
        <button v-if="sceneOrderPhase < 2" @click="sceneOrderPhase++" class="btn-action">
          {{ sceneOrderPhase === 0 ? '看函式 →' : '看呼叫 →' }}
        </button>
        <div v-else class="flex gap-4 text-sm text-slate-400">
          <span class="rounded-lg bg-sky-500/10 px-3 py-1 text-sky-300">✅ if 驗證</span>
          <span class="rounded-lg bg-sky-500/10 px-3 py-1 text-sky-300">✅ += 累加</span>
          <span class="rounded-lg bg-sky-500/10 px-3 py-1 text-sky-300">✅ return 回傳</span>
        </div>
      </div>
    </div>

    <!-- ===== Step 16: Scene Checkout ===== -->
    <div v-else-if="stepData.view === 'scene-checkout'" class="slide-page">
      <div class="wm">💰</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-amber-500/20 text-amber-300">💰 第二階段：結帳</div>
        <h2 class="text-lg font-bold text-white">ruleKey + 中括號取值</h2>
        <div class="w-full max-w-lg space-y-3">
          <div class="code-block" v-if="sceneCheckoutPhase >= 0">
            <code><span class="kw">const</span> shippingRules = {<br>&nbsp;&nbsp;home: { fee: <span class="num">60</span>, label: <span class="str">'宅配'</span> },<br>&nbsp;&nbsp;store: { fee: <span class="num">0</span>, label: <span class="str">'超商取貨'</span> }<br>}</code>
          </div>
          <div class="code-block animate-value-appear" v-if="sceneCheckoutPhase >= 1">
            <code><span class="kw">function</span> <span class="fn">checkout</span>(<span class="text-orange-300">ruleKey</span>) {<br>&nbsp;&nbsp;<span class="kw">const</span> rule = shippingRules[<span class="text-orange-300">ruleKey</span>]<br>&nbsp;&nbsp;<span class="kw">return</span> total + rule.fee<br>}</code>
          </div>
          <div class="code-block animate-value-appear" v-if="sceneCheckoutPhase >= 2">
            <code><span class="fn">checkout</span>(<span class="str">'home'</span>)  <span class="cmt">// 420 + 60 = 480</span><br><span class="fn">checkout</span>(<span class="str">'store'</span>) <span class="cmt">// 420 + 0 = 420</span></code>
          </div>
        </div>
        <button v-if="sceneCheckoutPhase < 2" @click="sceneCheckoutPhase++" class="btn-action">
          {{ sceneCheckoutPhase === 0 ? '看函式 →' : '看呼叫 →' }}
        </button>
        <div v-else class="flex gap-4 text-sm text-slate-400">
          <span class="rounded-lg bg-amber-500/10 px-3 py-1 text-amber-300">✅ 物件存規則</span>
          <span class="rounded-lg bg-amber-500/10 px-3 py-1 text-amber-300">✅ 中括號取值</span>
          <span class="rounded-lg bg-amber-500/10 px-3 py-1 text-amber-300">✅ 動態 ruleKey</span>
        </div>
      </div>
    </div>

    <!-- ===== Step 17: Scene Clear ===== -->
    <div v-else-if="stepData.view === 'scene-clear'" class="slide-page">
      <div class="wm">🔄</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-emerald-500/20 text-emerald-300">🔄 第三階段：清空</div>
        <h2 class="text-lg font-bold text-white">重置變數 + 完整流程</h2>
        <div class="w-full max-w-lg space-y-3">
          <div class="code-block" v-if="sceneClearPhase >= 0">
            <code><span class="kw">function</span> <span class="fn">clearOrder</span>() {<br>&nbsp;&nbsp;total = <span class="num">0</span><br>&nbsp;&nbsp;<span class="kw">return</span> <span class="str">'訂單已清空'</span><br>}</code>
          </div>
          <div class="code-block animate-value-appear" v-if="sceneClearPhase >= 1">
            <code><span class="cmt">// 完整流程</span><br><span class="fn">addOrder</span>(<span class="num">180</span>, <span class="num">2</span>)   <span class="cmt">// total = 360</span><br><span class="fn">addOrder</span>(<span class="num">60</span>, <span class="num">1</span>)    <span class="cmt">// total = 420</span><br><span class="fn">checkout</span>(<span class="str">'home'</span>)   <span class="cmt">// 480（含運費）</span></code>
          </div>
          <div class="code-block animate-value-appear" v-if="sceneClearPhase >= 2">
            <code><span class="fn">clearOrder</span>()        <span class="cmt">// 訂單已清空</span><br><span class="fn">addOrder</span>(<span class="num">120</span>, <span class="num">3</span>)   <span class="cmt">// total = 360</span><br><span class="fn">checkout</span>(<span class="str">'store'</span>)  <span class="cmt">// 360（免運費）</span></code>
          </div>
        </div>
        <button v-if="sceneClearPhase < 2" @click="sceneClearPhase++" class="btn-action">
          {{ sceneClearPhase === 0 ? '看完整流程 →' : '清空再來一次 →' }}
        </button>
        <div v-else class="flex flex-col items-center gap-3">
          <div class="flex gap-4 text-sm text-slate-400">
            <span class="rounded-lg bg-emerald-500/10 px-3 py-1 text-emerald-300">✅ 點餐</span>
            <span class="rounded-lg bg-emerald-500/10 px-3 py-1 text-emerald-300">✅ 結帳</span>
            <span class="rounded-lg bg-emerald-500/10 px-3 py-1 text-emerald-300">✅ 清空</span>
            <span class="rounded-lg bg-emerald-500/10 px-3 py-1 text-emerald-300">✅ 再來</span>
          </div>
          <p class="text-sm text-sky-300">三個函式串起來，就是一個完整的系統！</p>
        </div>
      </div>
    </div>

    <!-- ===== Step 18: Summary End ===== -->
    <div v-else-if="stepData.view === 'summary-end'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">⚡</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/proud.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-sky-400 object-cover shadow-xl shadow-sky-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-sky-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">太棒了！你完成了 <strong class="text-sky-300">函式設計之術</strong> 🎉</p>
          <div class="mb-4 space-y-2 text-sm text-slate-300 md:text-base">
            <p>今天學了函式的四大招：</p>
            <div class="flex flex-wrap gap-2">
              <span class="rounded-lg bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-300">宣告 & 呼叫</span>
              <span class="rounded-lg bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-300">參數</span>
              <span class="rounded-lg bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-300">return</span>
              <span class="rounded-lg bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-300">if + function</span>
            </div>
            <p class="mt-2">還順便複習了<strong class="text-sky-300">物件取值</strong>（點記法 & 中括號）。</p>
            <p>函式是程式設計裡最重要的積木之一，接下來的每一堂課都會用到。</p>
          </div>
          <p class="text-xs text-slate-500 italic">「慢慢來，這些概念會越用越自然的。」—— 海姐</p>
        </div>
      </div>
    </div>

  </InteractiveSlideTemplate>
</template>

<style scoped>
.wm {
  @apply pointer-events-none fixed inset-0 z-0 flex items-center justify-center text-[12rem] font-black leading-none tracking-widest text-white/[0.02] select-none;
}
.slide-page {
  @apply relative z-10 mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12;
}
.btn-action {
  @apply rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:shadow-sky-500/40;
}
@keyframes valueAppear {
  0% { opacity: 0; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-value-appear {
  animation: valueAppear 0.5s ease-out;
}
.scene-badge {
  @apply rounded-full px-4 py-1 text-xs font-bold;
}
.scene-card {
  @apply w-full max-w-sm space-y-2 rounded-2xl border border-slate-700 bg-slate-800/80 p-5;
}
.pick-btn {
  @apply rounded-xl border-2 px-6 py-3 text-sm font-bold transition-all active:scale-95;
}
.pick-a {
  @apply border-sky-500/40 bg-sky-500/10 text-sky-300 hover:border-sky-400 hover:bg-sky-500/20;
}
.pick-b {
  @apply border-amber-500/40 bg-amber-500/10 text-amber-300 hover:border-amber-400 hover:bg-amber-500/20;
}
.pick-c {
  @apply border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/20;
}
/* Code block styling */
.code-block {
  @apply rounded-xl border border-slate-700 bg-slate-900/80 p-4 font-mono text-sm text-slate-200;
}
.fn {
  @apply text-sky-300;
}
.kw {
  @apply text-purple-400;
}
.str {
  @apply text-emerald-300;
}
.num {
  @apply text-amber-300;
}
.cmt {
  @apply text-slate-500;
}
</style>
