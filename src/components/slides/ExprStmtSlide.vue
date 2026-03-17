<script setup lang="ts">
/**
 * 表達式 vs 陳述式
 * 15 步驟情境式教學：先認識概念，再用變數與 if 拆解，最後綜合判斷
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  // 開場
  { id: 0,  view: 'welcome',       title: '歡迎',              desc: '海姐帶你看懂程式碼' },
  // 概念講解
  { id: 1,  view: 'concept-expr',  title: '表達式是什麼？',    desc: '會產生一個值的程式碼' },
  { id: 2,  view: 'concept-stmt',  title: '陳述式是什麼？',    desc: '執行一個動作的程式碼' },
  // 基本判斷 quiz
  { id: 3,  view: 'quiz-basic-1',  title: '判斷看看',          desc: '1 + 2 是什麼？' },
  { id: 4,  view: 'quiz-basic-2',  title: '判斷看看',          desc: 'let x = 10; 是什麼？' },
  { id: 5,  view: 'quiz-basic-3',  title: '判斷看看',          desc: '"hello" 是什麼？' },
  { id: 6,  view: 'quiz-basic-4',  title: '判斷看看',          desc: 'score 是什麼？' },
  // 拆解
  { id: 7,  view: 'breakdown-var', title: '用變數來拆解',      desc: '一行程式碼裡的表達式與陳述式' },
  { id: 8,  view: 'breakdown-if',  title: '用 if 來拆解',      desc: 'if 裡面藏了什麼？' },
  // 綜合 quiz
  { id: 9,  view: 'quiz-combo-1',  title: '綜合判斷',          desc: '30 + 70 是什麼？' },
  { id: 10, view: 'quiz-combo-2',  title: '綜合判斷',          desc: 'let total = 30 + 70; 是什麼？' },
  { id: 11, view: 'quiz-combo-3',  title: '綜合判斷',          desc: 'total >= 100 是什麼？' },
  { id: 12, view: 'quiz-combo-4',  title: '綜合判斷',          desc: 'if (total >= 100) { ... } 是什麼？' },
  // 總結
  { id: 13, view: 'summary',       title: '核心觀念',          desc: '一句話記住' },
  { id: 14, view: 'end',           title: '課程結束',          desc: '海姐的結語' },
]

// ── Core ──
const currentStep = ref(0)
const stepData = computed(() => STEPS[currentStep.value])
const feedback = ref('')
const feedbackType = ref<'neutral' | 'success' | 'error'>('neutral')

const feedbackClass = computed(() => {
  const map = {
    neutral: 'border-slate-600 bg-slate-800/80 text-slate-300',
    success: 'border-sky-500/50 bg-sky-500/10 text-sky-300',
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

function answerQuiz(quizId: string, answer: string, correct: string, successMsg: string, errorMsg: string) {
  if (answer === correct) {
    quizAnswers.value[quizId] = answer
    feedback.value = successMsg
    feedbackType.value = 'success'
  } else {
    feedback.value = errorMsg
    feedbackType.value = 'error'
  }
}

// ── Breakdown animation phases ──
const varBreakdownPhase = ref(0)
const ifBreakdownPhase = ref(0)

// ── Navigation ──
const canGoNext = computed(() => {
  const v = stepData.value.view
  if (v === 'quiz-basic-1') return quizAnswers.value['b1'] === 'expr'
  if (v === 'quiz-basic-2') return quizAnswers.value['b2'] === 'stmt'
  if (v === 'quiz-basic-3') return quizAnswers.value['b3'] === 'expr'
  if (v === 'quiz-basic-4') return quizAnswers.value['b4'] === 'expr'
  if (v === 'breakdown-var') return varBreakdownPhase.value >= 2
  if (v === 'breakdown-if') return ifBreakdownPhase.value >= 3
  if (v === 'quiz-combo-1') return quizAnswers.value['c1'] === 'expr'
  if (v === 'quiz-combo-2') return quizAnswers.value['c2'] === 'stmt'
  if (v === 'quiz-combo-3') return quizAnswers.value['c3'] === 'expr'
  if (v === 'quiz-combo-4') return quizAnswers.value['c4'] === 'stmt'
  return true
})

const nextStepHint = computed(() => {
  const v = stepData.value.view
  if (v.startsWith('quiz-') && !canGoNext.value) return '選一個答案'
  if (v === 'breakdown-var' && varBreakdownPhase.value < 2) return '按按鈕繼續'
  if (v === 'breakdown-if' && ifBreakdownPhase.value < 3) return '按按鈕繼續'
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
</script>

<template>
  <InteractiveSlideTemplate
    title="表達式 vs 陳述式"
    subtitle="看懂程式碼的第一步"
    icon="🧩"
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
      <div class="wm">E vs S</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-sky-400 object-cover shadow-xl shadow-sky-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-sky-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">嗨，我是<strong class="text-sky-300">海姐</strong> 👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">寫程式的時候，每一段程式碼不是在<strong class="text-sky-300">「產生值」</strong>就是在<strong class="text-amber-300">「執行動作」</strong>。</p>
          <p class="mb-3 text-sm leading-relaxed text-white md:text-base">今天我們來搞懂這兩種東西：<strong>表達式</strong>和<strong>陳述式</strong>。</p>
          <p class="text-xs text-slate-500 italic">「搞懂這個，你看程式碼會更有感覺。」—— 海姐</p>
        </div>
      </div>
      <button @click="nextStep()" class="btn-action animate-bounce">
        開始 →
      </button>
    </div>

    <!-- ===== Step 1: Concept - Expression ===== -->
    <div v-else-if="stepData.view === 'concept-expr'" class="slide-page">
      <div class="wm">Expr</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">表達式（Expression）</h2>
        <div class="max-w-lg rounded-2xl border border-sky-500/30 bg-sky-500/5 p-6">
          <p class="mb-4 text-center text-base font-bold text-sky-300">會產生一個值的程式碼</p>
          <div class="space-y-3">
            <div class="code-row">
              <code class="text-sky-300">1 + 2</code>
              <span class="text-slate-400">→ 產生 <span class="text-amber-300">3</span></span>
            </div>
            <div class="code-row">
              <code class="text-sky-300">"hello"</code>
              <span class="text-slate-400">→ 產生 <span class="text-amber-300">"hello"</span></span>
            </div>
            <div class="code-row">
              <code class="text-sky-300">10 >= 5</code>
              <span class="text-slate-400">→ 產生 <span class="text-amber-300">true</span></span>
            </div>
            <div class="code-row">
              <code class="text-sky-300">score</code>
              <span class="text-slate-400">→ 產生變數裡的值，例如 <span class="text-amber-300">82</span></span>
            </div>
          </div>
        </div>
        <div class="max-w-md rounded-xl border border-sky-500/20 bg-sky-500/5 px-4 py-3 text-center text-sm text-sky-300">
          💡 簡單判斷法：能放進 <code class="rounded bg-slate-700 px-1.5 py-0.5">console.log()</code> 裡面印出結果的，就是表達式
        </div>
      </div>
    </div>

    <!-- ===== Step 2: Concept - Statement ===== -->
    <div v-else-if="stepData.view === 'concept-stmt'" class="slide-page">
      <div class="wm">Stmt</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">陳述式（Statement）</h2>
        <div class="max-w-lg rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
          <p class="mb-4 text-center text-base font-bold text-amber-300">執行一個動作的程式碼</p>
          <div class="space-y-3">
            <div class="code-row">
              <code class="text-amber-300">let x = 10;</code>
              <span class="text-slate-400">→ 執行「宣告變數」</span>
            </div>
            <div class="code-row">
              <code class="text-amber-300">if (x > 5) { ... }</code>
              <span class="text-slate-400">→ 執行「判斷」</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-4 md:flex-row md:gap-8">
          <div class="w-56 rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 text-center">
            <p class="text-2xl">🧩</p>
            <p class="mt-2 text-sm font-bold text-sky-300">表達式</p>
            <p class="mt-1 text-xs text-slate-400">會產生值</p>
          </div>
          <div class="w-56 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-center">
            <p class="text-2xl">📋</p>
            <p class="mt-2 text-sm font-bold text-amber-300">陳述式</p>
            <p class="mt-1 text-xs text-slate-400">執行動作</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 3: Quiz Basic 1 - 1 + 2 ===== -->
    <div v-else-if="stepData.view === 'quiz-basic-1'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">判斷看看</div>
        <div class="rounded-xl bg-slate-900 px-6 py-4">
          <code class="text-lg text-white">1 + 2</code>
        </div>
        <p class="text-lg font-bold text-sky-300">這是表達式還是陳述式？</p>
        <div v-if="!quizAnswers['b1']" class="flex gap-4">
          <button @click="answerQuiz('b1', 'expr', 'expr', '沒錯！1 + 2 會產生值 3，所以是表達式 🧩', '想想看：1 + 2 會不會產生一個值？')" class="pick-btn pick-expr">表達式 🧩</button>
          <button @click="answerQuiz('b1', 'stmt', 'expr', '', '想想看：1 + 2 會不會產生一個值？')" class="pick-btn pick-stmt">陳述式 📋</button>
        </div>
        <div v-else class="animate-value-appear rounded-xl bg-sky-500/10 px-6 py-3 text-center text-sky-300">
          <code>1 + 2</code> → 產生 <strong class="text-white">3</strong> → 表達式 ✅
        </div>
      </div>
    </div>

    <!-- ===== Step 4: Quiz Basic 2 - let x = 10; ===== -->
    <div v-else-if="stepData.view === 'quiz-basic-2'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">判斷看看</div>
        <div class="rounded-xl bg-slate-900 px-6 py-4">
          <code class="text-lg text-white">let x = 10;</code>
        </div>
        <p class="text-lg font-bold text-sky-300">這是表達式還是陳述式？</p>
        <div v-if="!quizAnswers['b2']" class="flex gap-4">
          <button @click="answerQuiz('b2', 'expr', 'stmt', '', '想想看：這行是在「產生值」還是「執行動作」？')" class="pick-btn pick-expr">表達式 🧩</button>
          <button @click="answerQuiz('b2', 'stmt', 'stmt', '沒錯！這是在執行「宣告變數」的動作，是陳述式 📋', '')" class="pick-btn pick-stmt">陳述式 📋</button>
        </div>
        <div v-else class="animate-value-appear rounded-xl bg-amber-500/10 px-6 py-3 text-center text-amber-300">
          <code>let x = 10;</code> → 執行「宣告變數」→ 陳述式 ✅
        </div>
      </div>
    </div>

    <!-- ===== Step 5: Quiz Basic 3 - "hello" ===== -->
    <div v-else-if="stepData.view === 'quiz-basic-3'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">判斷看看</div>
        <div class="rounded-xl bg-slate-900 px-6 py-4">
          <code class="text-lg text-white">"hello"</code>
        </div>
        <p class="text-lg font-bold text-sky-300">這是表達式還是陳述式？</p>
        <div v-if="!quizAnswers['b3']" class="flex gap-4">
          <button @click="answerQuiz('b3', 'expr', 'expr', '對！它本身就是一個值，所以是表達式 🧩', '想想看：能放進 console.log() 印出來嗎？')" class="pick-btn pick-expr">表達式 🧩</button>
          <button @click="answerQuiz('b3', 'stmt', 'expr', '', '想想看：能放進 console.log() 印出來嗎？')" class="pick-btn pick-stmt">陳述式 📋</button>
        </div>
        <div v-else class="animate-value-appear rounded-xl bg-sky-500/10 px-6 py-3 text-center text-sky-300">
          <code>"hello"</code> → 它本身就是一個值 → 表達式 ✅
        </div>
      </div>
    </div>

    <!-- ===== Step 6: Quiz Basic 4 - score ===== -->
    <div v-else-if="stepData.view === 'quiz-basic-4'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">判斷看看</div>
        <div class="mb-2 rounded-xl bg-slate-900 px-6 py-4">
          <pre class="text-sm text-slate-400"><code>let score = 82;</code></pre>
          <pre class="mt-2 text-lg text-white"><code>score</code></pre>
        </div>
        <p class="text-sm text-slate-400">已經宣告了 score 變數，現在單獨看 <code class="text-white">score</code></p>
        <p class="text-lg font-bold text-sky-300">score 是表達式還是陳述式？</p>
        <div v-if="!quizAnswers['b4']" class="flex gap-4">
          <button @click="answerQuiz('b4', 'expr', 'expr', '對！呼叫變數會產生變數裡的值（82），是表達式 🧩', '想想看：score 會不會產生一個值？')" class="pick-btn pick-expr">表達式 🧩</button>
          <button @click="answerQuiz('b4', 'stmt', 'expr', '', '想想看：score 會不會產生一個值？')" class="pick-btn pick-stmt">陳述式 📋</button>
        </div>
        <div v-else class="animate-value-appear rounded-xl bg-sky-500/10 px-6 py-3 text-center text-sky-300">
          <code>score</code> → 產生 <strong class="text-white">82</strong> → 表達式 ✅
        </div>
      </div>
    </div>

    <!-- ===== Step 7: Breakdown - Variable ===== -->
    <div v-else-if="stepData.view === 'breakdown-var'" class="slide-page">
      <div class="wm">VAR</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">🔍 用變數來拆解</h2>
        <div class="w-full max-w-lg rounded-xl bg-slate-900 p-5">
          <code class="text-base text-white">let price = <span class="text-sky-300">100 + 50</span>;</code>
        </div>

        <div class="max-w-lg w-full">
          <div v-if="varBreakdownPhase >= 1" class="mb-4 animate-value-appear">
            <div class="flex items-center gap-3 rounded-xl border border-sky-500/30 bg-sky-500/5 px-4 py-3">
              <span class="text-lg">🧩</span>
              <div>
                <p class="text-sm font-bold text-sky-300">100 + 50 → 表達式</p>
                <p class="text-xs text-slate-400">會產生值 150</p>
              </div>
            </div>
          </div>
          <div v-if="varBreakdownPhase >= 2" class="animate-value-appear">
            <div class="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
              <span class="text-lg">📋</span>
              <div>
                <p class="text-sm font-bold text-amber-300">let price = 100 + 50; → 陳述式</p>
                <p class="text-xs text-slate-400">整行在執行「宣告變數並賦值」的動作</p>
              </div>
            </div>
          </div>
        </div>

        <button v-if="varBreakdownPhase < 2" @click="varBreakdownPhase++; feedback = varBreakdownPhase === 1 ? '等號右邊的 100 + 50 會產生一個值 → 是表達式' : '整行 let ... 是在做「宣告」這個動作 → 是陳述式。陳述式裡面包含了表達式！'; feedbackType = 'success'" class="btn-action animate-bounce">
          {{ varBreakdownPhase === 0 ? '先看等號右邊 →' : '再看整行 →' }}
        </button>

        <div v-if="varBreakdownPhase >= 2" class="max-w-md rounded-xl bg-sky-500/10 px-4 py-3 text-center text-sm text-sky-300">
          💡 一行程式碼裡，<strong class="text-white">陳述式</strong>裡面常常包含<strong class="text-white">表達式</strong>
        </div>
      </div>
    </div>

    <!-- ===== Step 8: Breakdown - if ===== -->
    <div v-else-if="stepData.view === 'breakdown-if'" class="slide-page">
      <div class="wm">IF</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">🔍 用 if 來拆解</h2>
        <div class="w-full max-w-lg rounded-xl bg-slate-900 p-5">
          <pre class="text-sm text-white"><code>let <span class="text-sky-300">score</span> = 82;

if (<span class="text-sky-300">score >= 80</span>) {
  console.log('B');
}</code></pre>
        </div>

        <div class="max-w-lg w-full space-y-3">
          <div v-if="ifBreakdownPhase >= 1" class="animate-value-appear flex items-center gap-3 rounded-xl border border-sky-500/30 bg-sky-500/5 px-4 py-3">
            <span class="text-lg">🧩</span>
            <div>
              <p class="text-sm font-bold text-sky-300">score → 表達式</p>
              <p class="text-xs text-slate-400">產生變數裡的值 82</p>
            </div>
          </div>
          <div v-if="ifBreakdownPhase >= 2" class="animate-value-appear flex items-center gap-3 rounded-xl border border-sky-500/30 bg-sky-500/5 px-4 py-3">
            <span class="text-lg">🧩</span>
            <div>
              <p class="text-sm font-bold text-sky-300">score >= 80 → 表達式</p>
              <p class="text-xs text-slate-400">產生 true（因為 82 >= 80）</p>
            </div>
          </div>
          <div v-if="ifBreakdownPhase >= 3" class="animate-value-appear flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
            <span class="text-lg">📋</span>
            <div>
              <p class="text-sm font-bold text-amber-300">if (...) { ... } → 陳述式</p>
              <p class="text-xs text-slate-400">整個 if 在執行「判斷」這個動作</p>
            </div>
          </div>
        </div>

        <button v-if="ifBreakdownPhase < 3" @click="ifBreakdownPhase++; feedback = ifBreakdownPhase === 1 ? 'score 會產生 82 → 是表達式' : ifBreakdownPhase === 2 ? 'score >= 80 會產生 true → 也是表達式' : 'if 小括號裡放的一定是「表達式」，而 if 整體是「陳述式」'; feedbackType = 'success'" class="btn-action animate-bounce">
          {{ ifBreakdownPhase === 0 ? '先看 score →' : ifBreakdownPhase === 1 ? '再看小括號裡 →' : '最後看整個 if →' }}
        </button>

        <div v-if="ifBreakdownPhase >= 3" class="max-w-md rounded-xl bg-sky-500/10 px-4 py-3 text-center text-sm text-sky-300">
          💡 if 小括號 <code class="rounded bg-slate-700 px-1.5 py-0.5">()</code> 裡面一定是<strong class="text-white">表達式</strong>，if 整體是<strong class="text-white">陳述式</strong>
        </div>
      </div>
    </div>

    <!-- ===== Step 9: Quiz Combo 1 - 30 + 70 ===== -->
    <div v-else-if="stepData.view === 'quiz-combo-1'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-violet-500/20 text-violet-300">綜合判斷</div>
        <p class="text-sm text-slate-400">看這段程式碼，逐行判斷：</p>
        <div class="w-full max-w-md rounded-xl bg-slate-900 p-5">
          <pre class="text-sm text-slate-500"><code>let total = 30 + 70;

if (total >= 100) {
  console.log("過關");
}</code></pre>
        </div>
        <div class="rounded-xl bg-slate-800 px-6 py-3">
          <code class="text-lg text-white">30 + 70</code>
        </div>
        <p class="text-base font-bold text-sky-300">這是什麼？</p>
        <div v-if="!quizAnswers['c1']" class="flex gap-4">
          <button @click="answerQuiz('c1', 'expr', 'expr', '沒錯！30 + 70 會產生值 100 → 表達式 🧩', '它會產生一個值嗎？')" class="pick-btn pick-expr">表達式 🧩</button>
          <button @click="answerQuiz('c1', 'stmt', 'expr', '', '它會產生一個值嗎？')" class="pick-btn pick-stmt">陳述式 📋</button>
        </div>
      </div>
    </div>

    <!-- ===== Step 10: Quiz Combo 2 - let total = 30 + 70; ===== -->
    <div v-else-if="stepData.view === 'quiz-combo-2'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-violet-500/20 text-violet-300">綜合判斷</div>
        <div class="w-full max-w-md rounded-xl bg-slate-900 p-5">
          <pre class="text-sm text-slate-500"><code><span class="text-white">let total = 30 + 70;</span>

if (total >= 100) {
  console.log("過關");
}</code></pre>
        </div>
        <div class="rounded-xl bg-slate-800 px-6 py-3">
          <code class="text-lg text-white">let total = 30 + 70;</code>
        </div>
        <p class="text-base font-bold text-sky-300">整行是什麼？</p>
        <div v-if="!quizAnswers['c2']" class="flex gap-4">
          <button @click="answerQuiz('c2', 'expr', 'stmt', '', '整行是在「產生值」還是「執行宣告動作」？')" class="pick-btn pick-expr">表達式 🧩</button>
          <button @click="answerQuiz('c2', 'stmt', 'stmt', '對！整行是在執行「宣告變數」這個動作 → 陳述式 📋', '')" class="pick-btn pick-stmt">陳述式 📋</button>
        </div>
      </div>
    </div>

    <!-- ===== Step 11: Quiz Combo 3 - total >= 100 ===== -->
    <div v-else-if="stepData.view === 'quiz-combo-3'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-violet-500/20 text-violet-300">綜合判斷</div>
        <div class="w-full max-w-md rounded-xl bg-slate-900 p-5">
          <pre class="text-sm text-slate-500"><code>let total = 30 + 70;

if (<span class="text-white">total >= 100</span>) {
  console.log("過關");
}</code></pre>
        </div>
        <div class="rounded-xl bg-slate-800 px-6 py-3">
          <code class="text-lg text-white">total >= 100</code>
        </div>
        <p class="text-base font-bold text-sky-300">這是什麼？</p>
        <div v-if="!quizAnswers['c3']" class="flex gap-4">
          <button @click="answerQuiz('c3', 'expr', 'expr', '沒錯！total >= 100 會產生 true → 表達式 🧩', '它會不會產生一個值？')" class="pick-btn pick-expr">表達式 🧩</button>
          <button @click="answerQuiz('c3', 'stmt', 'expr', '', '它會不會產生一個值？')" class="pick-btn pick-stmt">陳述式 📋</button>
        </div>
      </div>
    </div>

    <!-- ===== Step 12: Quiz Combo 4 - if (...) { ... } ===== -->
    <div v-else-if="stepData.view === 'quiz-combo-4'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-violet-500/20 text-violet-300">綜合判斷</div>
        <div class="w-full max-w-md rounded-xl bg-slate-900 p-5">
          <pre class="text-sm text-slate-500"><code>let total = 30 + 70;

<span class="text-white">if (total >= 100) {
  console.log("過關");
}</span></code></pre>
        </div>
        <div class="rounded-xl bg-slate-800 px-6 py-3">
          <code class="text-base text-white">if (total >= 100) { ... }</code>
        </div>
        <p class="text-base font-bold text-sky-300">整個 if 是什麼？</p>
        <div v-if="!quizAnswers['c4']" class="flex gap-4">
          <button @click="answerQuiz('c4', 'expr', 'stmt', '', '整個 if 是在「產生值」還是「執行判斷」？')" class="pick-btn pick-expr">表達式 🧩</button>
          <button @click="answerQuiz('c4', 'stmt', 'stmt', '對！整個 if 是在執行判斷的動作 → 陳述式 📋。你全部答對了！', '')" class="pick-btn pick-stmt">陳述式 📋</button>
        </div>
      </div>
    </div>

    <!-- ===== Step 13: Summary ===== -->
    <div v-else-if="stepData.view === 'summary'" class="slide-page">
      <div class="wm">KEY</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">🔑 核心觀念</h2>
        <div class="flex flex-col gap-4 md:flex-row md:gap-8">
          <div class="w-64 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-6 text-center">
            <p class="mb-2 text-3xl">🧩</p>
            <p class="text-lg font-bold text-sky-300">表達式</p>
            <p class="mt-3 text-base font-bold text-white">會產生一個值</p>
            <p class="mt-2 text-sm text-slate-400">1 + 2、"hello"、score、score >= 80</p>
          </div>
          <div class="w-64 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
            <p class="mb-2 text-3xl">📋</p>
            <p class="text-lg font-bold text-amber-300">陳述式</p>
            <p class="mt-3 text-base font-bold text-white">執行一個動作</p>
            <p class="mt-2 text-sm text-slate-400">let x = 10;、if (...) { ... }</p>
          </div>
        </div>
        <div class="max-w-lg rounded-2xl border border-violet-500/40 bg-violet-500/10 px-6 py-5 text-center">
          <p class="text-base font-bold text-violet-300">程式碼的最小單位不是表達式就是陳述式，</p>
          <p class="mt-2 text-base font-bold text-white">而陳述式裡面常常會包含表達式。</p>
        </div>
      </div>
    </div>

    <!-- ===== Step 14: End ===== -->
    <div v-else-if="stepData.view === 'end'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">END</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/proud.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-sky-400 object-cover shadow-xl shadow-sky-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-sky-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">做得不錯，你已經能分辨表達式和陳述式了！🎉</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">下次看到一段程式碼，試著問自己：</p>
          <p class="mb-3 text-sm leading-relaxed text-white md:text-base"><strong>「這段是在產生值？還是在執行動作？」</strong></p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">慢慢來，你會越看越有感覺的。</p>
          <p class="text-xs text-slate-500 italic">「看懂程式碼的結構，寫起來就順了。」—— 海姐</p>
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
.scene-badge {
  @apply rounded-full px-4 py-1 text-xs font-bold;
}
.pick-btn {
  @apply rounded-xl border-2 px-6 py-3 text-sm font-bold transition-all active:scale-95;
}
.pick-expr {
  @apply border-sky-500/40 bg-sky-500/10 text-sky-300 hover:border-sky-400 hover:bg-sky-500/20;
}
.pick-stmt {
  @apply border-amber-500/40 bg-amber-500/10 text-amber-300 hover:border-amber-400 hover:bg-amber-500/20;
}
.code-row {
  @apply flex items-center justify-between rounded-lg bg-slate-900/60 px-4 py-2.5 text-sm;
}
@keyframes valueAppear {
  0% { opacity: 0; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-value-appear {
  animation: valueAppear 0.5s ease-out;
}
</style>
