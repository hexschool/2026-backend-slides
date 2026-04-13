<script setup lang="ts">
/**
 * dayjs 格式猜猜看
 * 10 步驟互動式教學：帶學生認識 dayjs 的格式化、diff、Unix timestamp
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  { id: 0, view: 'welcome',        title: '開場',            desc: '為什麼需要 dayjs？' },
  { id: 1, view: 'native-pain',    title: '原生 Date 的痛',  desc: '月份從 0 開始？什麼鬼！' },
  { id: 2, view: 'dayjs-magic',    title: 'dayjs 的魔法',    desc: '一行搞定' },
  { id: 3, view: 'format-tokens',  title: '格式化 Token',    desc: 'YYYY、MM、DD…對照表' },
  { id: 4, view: 'quiz-format-1',  title: '猜猜看 1',        desc: '格式化日期' },
  { id: 5, view: 'quiz-format-2',  title: '猜猜看 2',        desc: '格式化時間' },
  { id: 6, view: 'diff-intro',     title: '.diff() 計算差距', desc: '距離跨年還有幾天？' },
  { id: 7, view: 'quiz-diff',      title: '猜猜看 3',        desc: '.diff() 計算月份差' },
  { id: 8, view: 'unix-timestamp', title: 'Unix Timestamp',  desc: '從 1970 開始算的秒數' },
  { id: 9, view: 'summary',        title: '總整理',           desc: '日期翻譯機，準備好了' },
]

// ── Core state ──
const currentStep = ref(0)
const stepData = computed(() => STEPS[currentStep.value])
const feedback = ref('')
const feedbackType = ref<'neutral' | 'success' | 'error' | 'question'>('neutral')

const feedbackClass = computed(() => {
  const map = {
    neutral:  'border-slate-600 bg-slate-800/80 text-slate-300',
    success:  'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    error:    'border-rose-500/50 bg-rose-500/10 text-rose-300',
    question: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
  }
  return map[feedbackType.value]
})
const feedbackIcon = computed(() => {
  const map = { neutral: '💡', success: '✅', error: '❌', question: '🤔' }
  return map[feedbackType.value]
})

// ── Quiz answers ──
const quizAnswers = ref<Record<string, string>>({})

function answerQuiz(
  id: string,
  answer: string,
  correct: string,
  successMsg: string,
  errorMsg: string
) {
  quizAnswers.value[id] = answer
  if (answer === correct) {
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
  if (v === 'quiz-format-1') return quizAnswers.value['q1'] === 'A'
  if (v === 'quiz-format-2') return quizAnswers.value['q2'] === 'A'
  if (v === 'quiz-diff')     return quizAnswers.value['q3'] === 'A'
  return true
})

const nextStepHint = computed(() => {
  const v = stepData.value.view
  if (
    (v === 'quiz-format-1' && quizAnswers.value['q1'] !== 'A') ||
    (v === 'quiz-format-2' && quizAnswers.value['q2'] !== 'A') ||
    (v === 'quiz-diff'     && quizAnswers.value['q3'] !== 'A')
  ) return '選出正確答案才能繼續'
  return ''
})

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
    title="dayjs 格式猜猜看"
    subtitle="日期處理不再頭痛"
    icon="📅"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="amber"
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
    <div v-if="stepData.view === 'welcome'" class="slide-page flex flex-col items-center justify-center gap-6">
      <div class="wm">📅 dayjs</div>
      <div class="flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img
            src="/images/coach/normal.png"
            alt="海姐"
            class="h-28 w-28 rounded-full border-2 border-amber-400 object-cover shadow-xl shadow-amber-500/25 md:h-32 md:w-32"
            style="object-position: 50% 5%;"
          />
          <p class="mt-2 text-sm font-bold text-amber-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">嗨！今天來聊個每個工程師都會遇到的事 👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">
            <strong class="text-white">日期處理。</strong>
          </p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">
            原生的 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-rose-300">Date</code> 物件很難用，
            月份從 0 算、時區一堆坑、格式化要自己拼字串...
          </p>
          <p class="mb-3 text-sm leading-relaxed text-white md:text-base">
            今天介紹 <strong class="text-amber-300">dayjs</strong> —— 一個超輕量的日期函式庫，<br />
            <strong>一行就搞定大部分日期問題。</strong>
          </p>
          <p class="text-xs italic text-slate-500">「工具選對了，程式碼自然漂亮。」—— 海姐</p>
        </div>
      </div>
      <button
        @click="nextStep()"
        class="animate-bounce rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-amber-500/25 transition-all hover:shadow-amber-500/40"
      >
        開始 →
      </button>
    </div>

    <!-- ===== Step 1: Native Pain ===== -->
    <div v-else-if="stepData.view === 'native-pain'" class="slide-page flex flex-col items-center gap-6">
      <div class="wm">😱 原生 Date</div>
      <div class="flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img
            src="/images/coach/shocked.png"
            alt="海姐"
            class="h-24 w-24 rounded-full border-2 border-rose-400 object-cover shadow-xl shadow-rose-500/25 md:h-28 md:w-28"
            style="object-position: 50% 5%;"
          />
          <p class="mt-2 text-sm font-bold text-rose-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4">
          <p class="mb-3 text-sm text-slate-300 md:text-base">
            想顯示「<strong class="text-white">2026/04/13 14:30</strong>」，用原生 Date 要這樣寫：
          </p>
          <div class="rounded-xl bg-slate-900 p-4">
            <pre class="overflow-x-auto text-xs leading-6 text-slate-200 md:text-sm"><span class="text-slate-500">// 建立日期物件</span>
<span class="text-sky-400">const</span> <span class="text-white">d</span> <span class="text-sky-300">=</span> <span class="text-sky-400">new</span> <span class="text-amber-400">Date</span>(<span class="text-emerald-400">'2026-04-13T14:30:00'</span>)

<span class="text-slate-500">// 月份要 +1（原生從 0 開始！😱）</span>
<span class="text-sky-400">const</span> <span class="text-white">y</span>  <span class="text-sky-300">=</span> <span class="text-white">d</span>.<span class="text-amber-400">getFullYear</span>()
<span class="text-sky-400">const</span> <span class="text-white">mo</span> <span class="text-sky-300">=</span> <span class="text-amber-400">String</span>(<span class="text-white">d</span>.<span class="text-amber-400">getMonth</span>() <span class="text-sky-300">+</span> <span class="text-rose-400">1</span>)
  .<span class="text-amber-400">padStart</span>(<span class="text-rose-400">2</span>, <span class="text-emerald-400">'0'</span>)
<span class="text-sky-400">const</span> <span class="text-white">dd</span> <span class="text-sky-300">=</span> <span class="text-amber-400">String</span>(<span class="text-white">d</span>.<span class="text-amber-400">getDate</span>())
  .<span class="text-amber-400">padStart</span>(<span class="text-rose-400">2</span>, <span class="text-emerald-400">'0'</span>)
<span class="text-sky-400">const</span> <span class="text-white">hh</span> <span class="text-sky-300">=</span> <span class="text-amber-400">String</span>(<span class="text-white">d</span>.<span class="text-amber-400">getHours</span>())
  .<span class="text-amber-400">padStart</span>(<span class="text-rose-400">2</span>, <span class="text-emerald-400">'0'</span>)
<span class="text-sky-400">const</span> <span class="text-white">mm</span> <span class="text-sky-300">=</span> <span class="text-amber-400">String</span>(<span class="text-white">d</span>.<span class="text-amber-400">getMinutes</span>())
  .<span class="text-amber-400">padStart</span>(<span class="text-rose-400">2</span>, <span class="text-emerald-400">'0'</span>)

<span class="text-sky-400">const</span> <span class="text-white">result</span> <span class="text-sky-300">=</span>
  <span class="text-emerald-400">`<span class="text-white">${y}</span>/<span class="text-white">${mo}</span>/<span class="text-white">${dd}</span> <span class="text-white">${hh}</span>:<span class="text-white">${mm}</span>`</span></pre>
          </div>
          <p class="mt-3 text-sm text-rose-300">
            ⚠️ 7 行、容易寫錯、月份還要自己加 1 —— 這是 JS 最知名的坑之一。
          </p>
        </div>
      </div>
    </div>

    <!-- ===== Step 2: dayjs Magic ===== -->
    <div v-else-if="stepData.view === 'dayjs-magic'" class="slide-page flex flex-col items-center gap-6">
      <div class="wm">✨ dayjs</div>
      <div class="flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img
            src="/images/coach/praise.png"
            alt="海姐"
            class="h-24 w-24 rounded-full border-2 border-amber-400 object-cover shadow-xl shadow-amber-500/25 md:h-28 md:w-28"
            style="object-position: 50% 5%;"
          />
          <p class="mt-2 text-sm font-bold text-amber-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4">
          <p class="mb-3 text-sm text-slate-300 md:text-base">
            同樣的事，用 dayjs 只要 <strong class="text-amber-300">一行</strong>：
          </p>
          <div class="rounded-xl bg-slate-900 p-4">
            <pre class="overflow-x-auto text-xs leading-6 text-slate-200 md:text-sm"><span class="text-slate-500">// Unix timestamp 轉格式化字串</span>
<span class="text-sky-400">const</span> <span class="text-white">result</span> <span class="text-sky-300">=</span> <span class="text-amber-400">dayjs</span>.<span class="text-amber-400">unix</span>(<span class="text-white">ts</span>).<span class="text-amber-400">format</span>(<span class="text-emerald-400">'YYYY/MM/DD HH:mm'</span>)

<span class="text-slate-500">// 一般日期字串也可以</span>
<span class="text-sky-400">const</span> <span class="text-white">result2</span> <span class="text-sky-300">=</span> <span class="text-amber-400">dayjs</span>(<span class="text-emerald-400">'2026-04-13T14:30:00'</span>).<span class="text-amber-400">format</span>(<span class="text-emerald-400">'YYYY/MM/DD HH:mm'</span>)

<span class="text-slate-500">// 輸出：<span class="text-white">2026/04/13 14:30</span></span></pre>
          </div>
          <div class="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
            <p class="text-sm text-amber-300">
              💡 dayjs 只有 <strong>2KB</strong>，比 Moment.js 小 97%，API 幾乎一樣好用。
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 3: Format Tokens ===== -->
    <div v-else-if="stepData.view === 'format-tokens'" class="slide-page flex flex-col items-center gap-6">
      <div class="wm">🔤 格式 Token</div>
      <h2 class="text-xl font-bold text-white">格式化字串對照表</h2>
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        <div class="token-card">
          <p class="token-key">YYYY</p>
          <p class="token-val">年份（4 位）</p>
          <p class="token-eg">2026</p>
        </div>
        <div class="token-card">
          <p class="token-key">YY</p>
          <p class="token-val">年份（2 位）</p>
          <p class="token-eg">26</p>
        </div>
        <div class="token-card">
          <p class="token-key">MM</p>
          <p class="token-val">月份（補零）</p>
          <p class="token-eg">04</p>
        </div>
        <div class="token-card">
          <p class="token-key">M</p>
          <p class="token-val">月份（不補零）</p>
          <p class="token-eg">4</p>
        </div>
        <div class="token-card">
          <p class="token-key">DD</p>
          <p class="token-val">日期（補零）</p>
          <p class="token-eg">06</p>
        </div>
        <div class="token-card">
          <p class="token-key">D</p>
          <p class="token-val">日期（不補零）</p>
          <p class="token-eg">6</p>
        </div>
        <div class="token-card">
          <p class="token-key">HH</p>
          <p class="token-val">小時（24h）</p>
          <p class="token-eg">14</p>
        </div>
        <div class="token-card">
          <p class="token-key">mm</p>
          <p class="token-val">分鐘（補零）</p>
          <p class="token-eg">05</p>
        </div>
        <div class="token-card">
          <p class="token-key">ss</p>
          <p class="token-val">秒（補零）</p>
          <p class="token-eg">09</p>
        </div>
      </div>
      <p class="text-sm text-slate-400">
        記法小訣竅：<strong class="text-amber-300">大寫</strong> = 日期類，<strong class="text-sky-300">小寫</strong> = 時間類
      </p>
    </div>

    <!-- ===== Step 4: Quiz Format 1 ===== -->
    <div v-else-if="stepData.view === 'quiz-format-1'" class="slide-page flex flex-col items-center gap-6">
      <div class="wm">🤔 猜猜看</div>
      <div class="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-5">
        <p class="mb-2 text-sm text-slate-400">這段程式碼的輸出是？</p>
        <div class="mb-5 rounded-xl bg-slate-900 p-4">
          <pre class="text-sm leading-6 text-slate-200"><span class="text-amber-400">dayjs</span>(<span class="text-emerald-400">'2026-04-13'</span>).<span class="text-amber-400">format</span>(<span class="text-emerald-400">'YYYY年MM月DD日'</span>)</pre>
        </div>
        <div class="grid grid-cols-1 gap-3">
          <button
            v-for="opt in [
              { key: 'A', label: '2026年04月13日' },
              { key: 'B', label: '2026/04/13' },
              { key: 'C', label: '26年4月13日' },
            ]"
            :key="opt.key"
            class="quiz-btn"
            :class="{
              'quiz-btn--correct': quizAnswers['q1'] === opt.key && opt.key === 'A',
              'quiz-btn--wrong':   quizAnswers['q1'] === opt.key && opt.key !== 'A',
              'quiz-btn--idle':    quizAnswers['q1'] !== opt.key,
            }"
            @click="answerQuiz('q1', opt.key, 'A',
              '正確！YYYY=4位年、MM=補零月、DD=補零日，所以輸出 2026年04月13日。',
              opt.key === 'B'
                ? 'YY 才是 2 位年，MM 月、DD 日需要對應格式字元，這裡格式是「YYYY年MM月DD日」，斜線不會出現喔。'
                : '注意 YYYY 是 4 位年（2026），MM 月份有補零所以是「04」，不是「4」。'
            )"
          >
            <span class="mr-3 font-bold text-amber-400">{{ opt.key }}</span>{{ opt.label }}
          </button>
        </div>
      </div>
      <div class="flex shrink-0 flex-col items-center">
        <img
          src="/images/coach/confused.png"
          alt="海姐"
          class="h-20 w-20 rounded-full border-2 border-amber-400 object-cover shadow-xl shadow-amber-500/20 md:h-24 md:w-24"
          style="object-position: 50% 5%;"
        />
        <p class="mt-1 text-xs font-bold text-amber-300">想想看</p>
      </div>
    </div>

    <!-- ===== Step 5: Quiz Format 2 ===== -->
    <div v-else-if="stepData.view === 'quiz-format-2'" class="slide-page flex flex-col items-center gap-6">
      <div class="wm">🤔 猜猜看</div>
      <div class="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-5">
        <p class="mb-2 text-sm text-slate-400">這段程式碼的輸出是？</p>
        <div class="mb-5 rounded-xl bg-slate-900 p-4">
          <pre class="text-sm leading-6 text-slate-200"><span class="text-amber-400">dayjs</span>(<span class="text-emerald-400">'2026-04-13T14:30:00'</span>).<span class="text-amber-400">format</span>(<span class="text-emerald-400">'HH:mm'</span>)</pre>
        </div>
        <div class="grid grid-cols-1 gap-3">
          <button
            v-for="opt in [
              { key: 'A', label: '14:30' },
              { key: 'B', label: '2:30 PM' },
              { key: 'C', label: '1430' },
            ]"
            :key="opt.key"
            class="quiz-btn"
            :class="{
              'quiz-btn--correct': quizAnswers['q2'] === opt.key && opt.key === 'A',
              'quiz-btn--wrong':   quizAnswers['q2'] === opt.key && opt.key !== 'A',
              'quiz-btn--idle':    quizAnswers['q2'] !== opt.key,
            }"
            @click="answerQuiz('q2', opt.key, 'A',
              '完全正確！HH 是 24 小時制、mm 是分鐘，輸出就是 14:30，簡單俐落。',
              opt.key === 'B'
                ? 'AM/PM 格式要用 hh:mm A，HH 是 24 小時制，所以直接輸出 14:30。'
                : '格式字串裡有冒號，所以輸出也會有冒號，輸出是 14:30 而不是 1430。'
            )"
          >
            <span class="mr-3 font-bold text-amber-400">{{ opt.key }}</span>{{ opt.label }}
          </button>
        </div>
      </div>
      <div class="flex shrink-0 flex-col items-center">
        <img
          src="/images/coach/normal.png"
          alt="海姐"
          class="h-20 w-20 rounded-full border-2 border-amber-400 object-cover shadow-xl shadow-amber-500/20 md:h-24 md:w-24"
          style="object-position: 50% 5%;"
        />
        <p class="mt-1 text-xs font-bold text-amber-300">你答得出來嗎？</p>
      </div>
    </div>

    <!-- ===== Step 6: Diff Intro ===== -->
    <div v-else-if="stepData.view === 'diff-intro'" class="slide-page flex flex-col items-center gap-6">
      <div class="wm">📐 .diff()</div>
      <div class="flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img
            src="/images/coach/biglaugh.png"
            alt="海姐"
            class="h-24 w-24 rounded-full border-2 border-amber-400 object-cover shadow-xl shadow-amber-500/25 md:h-28 md:w-28"
            style="object-position: 50% 5%;"
          />
          <p class="mt-2 text-sm font-bold text-amber-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4">
          <p class="mb-3 text-sm text-slate-300 md:text-base">
            <strong class="text-white">.diff()</strong> 可以計算兩個日期之間的差距，<br />
            就像問「<strong class="text-amber-300">距離跨年還有幾天？</strong>」一樣直覺。
          </p>
          <div class="rounded-xl bg-slate-900 p-4">
            <pre class="overflow-x-auto text-xs leading-6 text-slate-200 md:text-sm"><span class="text-slate-500">// 距離跨年還有幾天？</span>
<span class="text-sky-400">const</span> <span class="text-white">today</span>    <span class="text-sky-300">=</span> <span class="text-amber-400">dayjs</span>()
<span class="text-sky-400">const</span> <span class="text-white">newYear</span>  <span class="text-sky-300">=</span> <span class="text-amber-400">dayjs</span>(<span class="text-emerald-400">'2027-01-01'</span>)
<span class="text-sky-400">const</span> <span class="text-white">daysLeft</span> <span class="text-sky-300">=</span> <span class="text-white">newYear</span>.<span class="text-amber-400">diff</span>(<span class="text-white">today</span>, <span class="text-emerald-400">'day'</span>)

<span class="text-slate-500">// 第二個參數可以是：</span>
<span class="text-slate-500">//  'day'    天</span>
<span class="text-slate-500">//  'month'  月</span>
<span class="text-slate-500">//  'year'   年</span>
<span class="text-slate-500">//  'hour'   小時</span>
<span class="text-slate-500">//  'minute' 分鐘</span></pre>
          </div>
          <div class="mt-4 rounded-xl border border-sky-500/30 bg-sky-500/5 p-3">
            <p class="text-sm text-sky-300">
              💡 語法：<code class="rounded bg-slate-700 px-1 py-0.5 text-white">較晚的日期.diff(較早的日期, 單位)</code>
              → 回傳正整數
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 7: Quiz Diff ===== -->
    <div v-else-if="stepData.view === 'quiz-diff'" class="slide-page flex flex-col items-center gap-6">
      <div class="wm">🤔 猜猜看</div>
      <div class="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-5">
        <p class="mb-2 text-sm text-slate-400">這段程式碼的輸出大約是？</p>
        <div class="mb-5 rounded-xl bg-slate-900 p-4">
          <pre class="text-sm leading-6 text-slate-200"><span class="text-amber-400">dayjs</span>(<span class="text-emerald-400">'2026-12-31'</span>).<span class="text-amber-400">diff</span>(<span class="text-amber-400">dayjs</span>(<span class="text-emerald-400">'2026-04-13'</span>), <span class="text-emerald-400">'month'</span>)</pre>
        </div>
        <div class="grid grid-cols-1 gap-3">
          <button
            v-for="opt in [
              { key: 'A', label: '約 8 個月' },
              { key: 'B', label: '約 262 天' },
              { key: 'C', label: '約 12 個月' },
            ]"
            :key="opt.key"
            class="quiz-btn"
            :class="{
              'quiz-btn--correct': quizAnswers['q3'] === opt.key && opt.key === 'A',
              'quiz-btn--wrong':   quizAnswers['q3'] === opt.key && opt.key !== 'A',
              'quiz-btn--idle':    quizAnswers['q3'] !== opt.key,
            }"
            @click="answerQuiz('q3', opt.key, 'A',
              '對了！4 月到 12 月底差了約 8 個月（4、5、6、7、8、9、10、11、12 = 8 個整月），.diff() 會取整數。',
              opt.key === 'B'
                ? '262 天是用 day 單位的結果，這裡指定的單位是 month，所以回傳的是月數。'
                : '12 個月是一整年，但 4 月到 12 月只有 8 個多月，不是 12 個月。'
            )"
          >
            <span class="mr-3 font-bold text-amber-400">{{ opt.key }}</span>{{ opt.label }}
          </button>
        </div>
      </div>
      <div class="flex shrink-0 flex-col items-center">
        <img
          src="/images/coach/blush.png"
          alt="海姐"
          class="h-20 w-20 rounded-full border-2 border-amber-400 object-cover shadow-xl shadow-amber-500/20 md:h-24 md:w-24"
          style="object-position: 50% 5%;"
        />
        <p class="mt-1 text-xs font-bold text-amber-300">從 4 月算到 12 月底</p>
      </div>
    </div>

    <!-- ===== Step 8: Unix Timestamp ===== -->
    <div v-else-if="stepData.view === 'unix-timestamp'" class="slide-page flex flex-col items-center gap-6">
      <div class="wm">⏱ Unix</div>
      <div class="flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img
            src="/images/coach/proud.png"
            alt="海姐"
            class="h-24 w-24 rounded-full border-2 border-amber-400 object-cover shadow-xl shadow-amber-500/25 md:h-28 md:w-28"
            style="object-position: 50% 5%;"
          />
          <p class="mt-2 text-sm font-bold text-amber-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4">
          <p class="mb-2 text-sm text-slate-300 md:text-base">
            後端 API 傳來的日期常常是一串數字，那是 <strong class="text-amber-300">Unix Timestamp</strong>。
          </p>
          <div class="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
            <p class="text-sm text-amber-300">
              📖 定義：從 <strong class="text-white">1970/01/01 00:00:00 UTC</strong> 開始到現在，總共過了幾秒。
            </p>
          </div>
          <div class="rounded-xl bg-slate-900 p-4">
            <pre class="overflow-x-auto text-xs leading-6 text-slate-200 md:text-sm"><span class="text-slate-500">// API 回傳的 timestamp（秒）</span>
<span class="text-sky-400">const</span> <span class="text-white">ts</span> <span class="text-sky-300">=</span> <span class="text-rose-400">1744560600</span>

<span class="text-slate-500">// dayjs.unix() 直接轉換</span>
<span class="text-sky-400">const</span> <span class="text-white">date</span> <span class="text-sky-300">=</span> <span class="text-amber-400">dayjs</span>.<span class="text-amber-400">unix</span>(<span class="text-white">ts</span>).<span class="text-amber-400">format</span>(<span class="text-emerald-400">'YYYY/MM/DD HH:mm'</span>)
<span class="text-slate-500">// 輸出：<span class="text-white">2026/04/13 14:30</span></span>

<span class="text-slate-500">// 如果 API 給的是毫秒（ms），用 dayjs(ms) 不加 .unix</span>
<span class="text-sky-400">const</span> <span class="text-white">ts_ms</span> <span class="text-sky-300">=</span> <span class="text-rose-400">1744560600000</span>
<span class="text-sky-400">const</span> <span class="text-white">date2</span> <span class="text-sky-300">=</span> <span class="text-amber-400">dayjs</span>(<span class="text-white">ts_ms</span>).<span class="text-amber-400">format</span>(<span class="text-emerald-400">'YYYY/MM/DD HH:mm'</span>)</pre>
          </div>
          <p class="mt-3 text-xs text-slate-500">
            秒 vs 毫秒：通常 10 位數是秒，13 位數是毫秒。
          </p>
        </div>
      </div>
    </div>

    <!-- ===== Step 9: Summary ===== -->
    <div v-else-if="stepData.view === 'summary'" class="slide-page flex flex-col items-center gap-6">
      <div class="wm">🎉 總整理</div>
      <h2 class="text-xl font-bold text-white">核心 API 一張卡片</h2>
      <div class="grid w-full max-w-2xl grid-cols-1 gap-3 md:grid-cols-3">
        <div class="summary-card border-amber-500/40 bg-amber-500/5">
          <p class="summary-icon">🖊️</p>
          <p class="summary-method text-amber-300">.format()</p>
          <p class="summary-desc">格式化輸出</p>
          <div class="summary-code">
            <code>dayjs().format(<span class="text-emerald-400">'YYYY/MM/DD'</span>)</code>
          </div>
        </div>
        <div class="summary-card border-sky-500/40 bg-sky-500/5">
          <p class="summary-icon">📐</p>
          <p class="summary-method text-sky-300">.diff()</p>
          <p class="summary-desc">計算日期差距</p>
          <div class="summary-code">
            <code>b.diff(a, <span class="text-emerald-400">'day'</span>)</code>
          </div>
        </div>
        <div class="summary-card border-rose-500/40 bg-rose-500/5">
          <p class="summary-icon">⏱️</p>
          <p class="summary-method text-rose-300">dayjs.unix()</p>
          <p class="summary-desc">從秒數轉日期</p>
          <div class="summary-code">
            <code>dayjs.unix(<span class="text-rose-400">ts</span>)</code>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-6">
        <img
          src="/images/coach/proud.png"
          alt="海姐"
          class="h-24 w-24 rounded-full border-2 border-amber-400 object-cover shadow-xl shadow-amber-500/25"
          style="object-position: 50% 5%;"
        />
        <div class="max-w-md rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4">
          <p class="mb-2 text-sm text-slate-300 md:text-base">
            dayjs 就像你的 <strong class="text-amber-300">日期翻譯機</strong>，<br />
            API 丟什麼格式過來都不怕。
          </p>
          <p class="mb-3 text-sm text-slate-300 md:text-base">
            記住三個核心：<strong class="text-amber-300">.format()</strong>、
            <strong class="text-sky-300">.diff()</strong>、
            <strong class="text-rose-300">dayjs.unix()</strong>，
            日期問題 90% 都能搞定。
          </p>
          <p class="text-xs italic text-slate-500">「工具越輕，思緒越清。」—— 海姐</p>
        </div>
      </div>
    </div>
  </InteractiveSlideTemplate>
</template>

<style scoped>
/* ── 頁面容器 ── */
.slide-page {
  @apply w-full px-4 py-6 md:px-8 md:py-8;
}

/* ── 浮水印文字 ── */
.wm {
  @apply pointer-events-none select-none text-4xl font-black text-white/5 md:text-6xl;
  position: absolute;
  top: 1rem;
  right: 1.5rem;
}

/* ── Format Token 卡片 ── */
.token-card {
  @apply flex flex-col items-center rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 gap-1;
}
.token-key {
  @apply text-base font-bold font-mono text-amber-300 md:text-lg;
}
.token-val {
  @apply text-xs text-slate-400 text-center;
}
.token-eg {
  @apply text-xs text-slate-500 font-mono;
}

/* ── 選擇題按鈕 ── */
.quiz-btn {
  @apply flex w-full items-center rounded-xl border px-4 py-3 text-left text-sm transition-all md:text-base;
  @apply border-slate-600 bg-slate-800/60 text-slate-200 hover:border-amber-400/60 hover:bg-amber-500/10;
}
.quiz-btn--correct {
  @apply border-emerald-500 bg-emerald-500/15 text-emerald-200;
}
.quiz-btn--wrong {
  @apply border-rose-500 bg-rose-500/15 text-rose-200;
}
.quiz-btn--idle {
  @apply border-slate-600 bg-slate-800/60 text-slate-200;
}

/* ── 總整理卡片 ── */
.summary-card {
  @apply flex flex-col items-center rounded-xl border p-4 gap-2;
}
.summary-icon {
  @apply text-2xl;
}
.summary-method {
  @apply text-base font-bold font-mono;
}
.summary-desc {
  @apply text-xs text-slate-400;
}
.summary-code {
  @apply w-full rounded-lg bg-slate-900 px-3 py-2 text-center text-xs font-mono text-slate-300;
}
</style>
