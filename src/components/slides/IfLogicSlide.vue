<script setup lang="ts">
/**
 * 邏輯判斷之術
 * 18 步驟情境式教學：比較運算子 → 邏輯運算子 → if/else if/else → 情境拆解
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  // Phase 1: 開場
  { id: 0,  view: 'welcome',          title: '歡迎',           desc: '海姐帶你學判斷' },
  { id: 1,  view: 'overview',         title: '今天學什麼',     desc: '三個核心觀念' },
  // Phase 2: 比較運算子
  { id: 2,  view: 'concept-compare',  title: '比較運算子',     desc: '比較兩個值，回傳 true / false' },
  { id: 3,  view: 'compare-eq',       title: '== vs ===',     desc: '兩個等於和三個等於差在哪？' },
  { id: 4,  view: 'quiz-ticket',      title: '挑戰：電影購票', desc: '小美 12 歲，能不能買全票？' },
  // Phase 3: 邏輯運算子
  { id: 5,  view: 'concept-logic',    title: '邏輯運算子',     desc: '&& 和 || 怎麼用？' },
  { id: 6,  view: 'quiz-delivery',    title: '挑戰：外送免運', desc: '小美可以免運嗎？' },
  { id: 7,  view: 'quiz-gift',        title: '挑戰：百貨贈品', desc: '小美能領贈品嗎？' },
  // Phase 4: if / else if / else
  { id: 8,  view: 'syntax-if',        title: 'if 語法',       desc: '如果...就...' },
  { id: 9,  view: 'quiz-fever',       title: '挑戰：體溫警示', desc: '小美量了 38.2 度' },
  { id: 10, view: 'syntax-ifelse',    title: 'if else 語法',  desc: '如果...否則...' },
  { id: 11, view: 'quiz-fullness',    title: '挑戰：飽足感',   desc: '小美飽足感 4，要吃飯嗎？' },
  { id: 12, view: 'syntax-elseif',    title: 'if else if else', desc: '多重條件判斷' },
  { id: 13, view: 'quiz-grade',       title: '挑戰：成績評等', desc: '小美考了 82 分' },
  // Phase 5: 情境拆解
  { id: 14, view: 'scene-score',      title: '情境：小華分數',   desc: '總分有沒有達標？' },
  { id: 15, view: 'scene-happy',      title: '情境：快樂指數',   desc: '小美今天想做什麼？' },
  { id: 16, view: 'scene-handshake',  title: '情境：握手會',     desc: '小明能跟歌手握手嗎？' },
  // Phase 6: 總結
  { id: 17, view: 'summary',          title: '課程總結',       desc: '海姐的結語' },
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

// ── Scene phases ──
const sceneScorePhase = ref(0)
const sceneHappyPhase = ref(0)
const sceneHandshakePhase = ref(0)

// ── Navigation ──
const canGoNext = computed(() => {
  const v = stepData.value.view
  if (v === 'quiz-ticket') return quizAnswers.value['ticket'] === 'true'
  if (v === 'quiz-delivery') return quizAnswers.value['delivery'] === 'true'
  if (v === 'quiz-gift') return quizAnswers.value['gift'] === 'false'
  if (v === 'quiz-fever') return quizAnswers.value['fever'] === 'show'
  if (v === 'quiz-fullness') return quizAnswers.value['fullness'] === 'eat'
  if (v === 'quiz-grade') return quizAnswers.value['grade'] === 'B'
  if (v === 'scene-score') return sceneScorePhase.value >= 2
  if (v === 'scene-happy') return sceneHappyPhase.value >= 2
  if (v === 'scene-handshake') return sceneHandshakePhase.value >= 2
  return true
})

const nextStepHint = computed(() => {
  const v = stepData.value.view
  if (v.startsWith('quiz-') && !quizAnswers.value[v.replace('quiz-', '')]) return '選一個答案'
  if (v === 'scene-score' && sceneScorePhase.value < 2) return '按按鈕繼續'
  if (v === 'scene-happy' && sceneHappyPhase.value < 2) return '按按鈕繼續'
  if (v === 'scene-handshake' && sceneHandshakePhase.value < 2) return '按按鈕繼續'
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
    title="邏輯判斷之術"
    subtitle="比較、邏輯、條件判斷"
    icon="🧠"
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
      <div class="wm">IF</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-sky-400 object-cover shadow-xl shadow-sky-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-sky-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">嗨，我是<strong class="text-sky-300">海姐</strong> 👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">寫程式的時候，常常需要做判斷：</p>
          <p class="mb-2 text-sm leading-relaxed text-white md:text-base"><strong>「<span class="text-sky-300">如果</span>怎樣，<span class="text-amber-300">就</span>怎樣」</strong></p>
          <p class="mb-3 text-sm leading-relaxed text-slate-300 md:text-base">今天我們用生活情境，一步一步學會<strong class="text-sky-300">邏輯判斷</strong>。</p>
          <p class="text-xs text-slate-500 italic">「別急，我們慢慢來。」—— 海姐</p>
        </div>
      </div>
      <button @click="nextStep()" class="rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-sky-500/25 transition-all hover:shadow-sky-500/40 animate-bounce">
        開始 →
      </button>
    </div>

    <!-- ===== Step 1: Overview ===== -->
    <div v-else-if="stepData.view === 'overview'" class="slide-page">
      <div class="wm">📋</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">今天學三個觀念</h2>
        <div class="flex flex-col gap-4 md:flex-row md:gap-6">
          <div class="w-56 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-5 text-center">
            <p class="mb-2 text-3xl">⚖️</p>
            <p class="text-base font-bold text-sky-300">比較運算子</p>
            <p class="mt-2 text-sm text-slate-400">比大小、比相等</p>
          </div>
          <div class="w-56 rounded-2xl border border-violet-500/30 bg-violet-500/5 p-5 text-center">
            <p class="mb-2 text-3xl">🔗</p>
            <p class="text-base font-bold text-violet-300">邏輯運算子</p>
            <p class="mt-2 text-sm text-slate-400">&amp;&amp; 且、|| 或</p>
          </div>
          <div class="w-56 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-center">
            <p class="mb-2 text-3xl">🔀</p>
            <p class="text-base font-bold text-amber-300">if / else</p>
            <p class="mt-2 text-sm text-slate-400">條件判斷</p>
          </div>
        </div>
        <p class="text-sm text-slate-400">每個觀念都會搭配生活情境，別擔心，跟著走就對了。</p>
      </div>
    </div>

    <!-- ===== Step 2: Concept - Compare ===== -->
    <div v-else-if="stepData.view === 'concept-compare'" class="slide-page">
      <div class="wm">⚖️</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">⚖️ 比較運算子</h2>
        <p class="text-sm text-slate-400">比較兩個值，結果回傳 <code class="code-inline text-sky-300">true</code> 或 <code class="code-inline text-rose-300">false</code></p>
        <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div class="op-card"><span class="text-lg font-bold text-sky-300">&gt;</span><span class="text-xs text-slate-400">大於</span></div>
          <div class="op-card"><span class="text-lg font-bold text-sky-300">&gt;=</span><span class="text-xs text-slate-400">大於等於</span></div>
          <div class="op-card"><span class="text-lg font-bold text-sky-300">&lt;</span><span class="text-xs text-slate-400">小於</span></div>
          <div class="op-card"><span class="text-lg font-bold text-sky-300">&lt;=</span><span class="text-xs text-slate-400">小於等於</span></div>
          <div class="op-card"><span class="text-lg font-bold text-amber-300">==</span><span class="text-xs text-slate-400">等於（寬鬆）</span></div>
          <div class="op-card"><span class="text-lg font-bold text-emerald-300">===</span><span class="text-xs text-slate-400">等於（嚴格）</span></div>
          <div class="op-card"><span class="text-lg font-bold text-amber-300">!=</span><span class="text-xs text-slate-400">不等於（寬鬆）</span></div>
          <div class="op-card"><span class="text-lg font-bold text-emerald-300">!==</span><span class="text-xs text-slate-400">不等於（嚴格）</span></div>
        </div>
      </div>
    </div>

    <!-- ===== Step 3: == vs === ===== -->
    <div v-else-if="stepData.view === 'compare-eq'" class="slide-page">
      <div class="wm">===</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">== 和 === 差在哪？</h2>
        <div class="flex flex-col gap-6 md:flex-row md:gap-8">
          <div class="w-80 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5">
            <p class="mb-3 text-center text-sm font-bold text-rose-300">❌ == 只比值（會自動轉型別）</p>
            <div class="rounded-xl bg-slate-900 p-3">
              <pre class="text-sm text-slate-300"><code><span class="text-amber-300">1</span> == <span class="text-amber-300">'1'</span>     <span class="text-slate-500">// true 😱</span>
<span class="text-amber-300">0</span> == <span class="text-amber-300">false</span>   <span class="text-slate-500">// true 😱</span>
<span class="text-amber-300">''</span> == <span class="text-amber-300">false</span>  <span class="text-slate-500">// true 😱</span></code></pre>
            </div>
          </div>
          <div class="w-80 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
            <p class="mb-3 text-center text-sm font-bold text-emerald-300">✅ === 比值也比型別（嚴格）</p>
            <div class="rounded-xl bg-slate-900 p-3">
              <pre class="text-sm text-slate-300"><code><span class="text-amber-300">1</span> === <span class="text-amber-300">'1'</span>    <span class="text-slate-500">// false ✔</span>
<span class="text-amber-300">0</span> === <span class="text-amber-300">false</span>  <span class="text-slate-500">// false ✔</span>
<span class="text-amber-300">''</span> === <span class="text-amber-300">false</span> <span class="text-slate-500">// false ✔</span></code></pre>
            </div>
          </div>
        </div>
        <div class="max-w-md rounded-xl border border-sky-500/40 bg-sky-500/10 px-5 py-3 text-center">
          <p class="text-sm text-sky-300">💡 建議：比較是否相同時，一律使用 <code class="code-inline text-white">===</code></p>
        </div>
      </div>
    </div>

    <!-- ===== Step 4: Quiz - Ticket ===== -->
    <div v-else-if="stepData.view === 'quiz-ticket'" class="slide-page">
      <div class="wm">🎬</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">挑戰</div>
        <h2 class="text-xl font-bold text-white">🎬 電影購票</h2>
        <div class="scene-card">
          <p class="text-sm text-slate-300">電影院規定 <strong class="text-white">12 歲以上</strong>才能買全票</p>
          <p class="mt-2 text-sm text-slate-300">小美今年 <strong class="text-sky-300">12 歲</strong></p>
        </div>
        <div class="rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-sky-300">let</span> age = <span class="text-amber-300">12</span>;
console.log(age >= <span class="text-amber-300">12</span>); <span class="text-slate-500">// ???</span></code></pre>
        </div>
        <p class="text-base font-bold text-sky-300">結果是什麼？</p>
        <div v-if="!quizAnswers['ticket']" class="flex gap-4">
          <button @click="answerQuiz('ticket', 'true', 'true', '答對了！12 >= 12 是 true，小美可以買全票 🎉', '再想想看，12 有沒有「大於等於」12 呢？')" class="pick-btn pick-true">true</button>
          <button @click="answerQuiz('ticket', 'false', 'true', '', '再想想看，12 有沒有「大於等於」12 呢？')" class="pick-btn pick-false">false</button>
        </div>
        <div v-else class="rounded-xl bg-emerald-500/10 px-5 py-3 text-center text-sm text-emerald-300 animate-value-appear">
          <code class="text-white">12 >= 12</code> → <strong>true</strong>，小美可以買全票！
        </div>
      </div>
    </div>

    <!-- ===== Step 5: Concept - Logic ===== -->
    <div v-else-if="stepData.view === 'concept-logic'" class="slide-page">
      <div class="wm">&amp;&amp;</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">🔗 邏輯運算子</h2>
        <p class="text-sm text-slate-400">用來組合多個條件做判斷</p>
        <div class="flex flex-col gap-6 md:flex-row md:gap-8">
          <div class="w-72 rounded-2xl border border-violet-500/30 bg-violet-500/5 p-5 text-center">
            <p class="mb-2 text-3xl font-bold text-violet-300">&amp;&amp;</p>
            <p class="text-base font-bold text-white">且（AND）</p>
            <p class="mt-3 text-sm text-slate-400">兩個條件<strong class="text-violet-300">都要</strong>成立</p>
            <div class="mt-3 rounded-lg bg-slate-900 p-2 text-left">
              <pre class="text-xs text-slate-300"><code><span class="text-amber-300">true</span> &amp;&amp; <span class="text-amber-300">true</span>   <span class="text-slate-500">// true</span>
<span class="text-amber-300">true</span> &amp;&amp; <span class="text-amber-300">false</span>  <span class="text-slate-500">// false</span></code></pre>
            </div>
          </div>
          <div class="w-72 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-5 text-center">
            <p class="mb-2 text-3xl font-bold text-orange-300">||</p>
            <p class="text-base font-bold text-white">或（OR）</p>
            <p class="mt-3 text-sm text-slate-400"><strong class="text-orange-300">其中一個</strong>成立就好</p>
            <div class="mt-3 rounded-lg bg-slate-900 p-2 text-left">
              <pre class="text-xs text-slate-300"><code><span class="text-amber-300">false</span> || <span class="text-amber-300">true</span>   <span class="text-slate-500">// true</span>
<span class="text-amber-300">false</span> || <span class="text-amber-300">false</span>  <span class="text-slate-500">// false</span></code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 6: Quiz - Delivery ===== -->
    <div v-else-if="stepData.view === 'quiz-delivery'" class="slide-page">
      <div class="wm">||</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-orange-500/20 text-orange-300">挑戰</div>
        <h2 class="text-xl font-bold text-white">🛵 外送免運</h2>
        <div class="scene-card">
          <p class="text-sm text-slate-300">外送平台規定：滿 <strong class="text-white">300 元</strong> <span class="text-orange-300">或</span> 使用 <strong class="text-white">會員卡</strong>，就可以免運</p>
          <p class="mt-2 text-sm text-slate-300">小美點了 <strong class="text-sky-300">250 元</strong>，但她 <strong class="text-sky-300">有會員卡</strong></p>
        </div>
        <div class="rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-sky-300">let</span> orderAmount = <span class="text-amber-300">250</span>;
<span class="text-sky-300">let</span> hasMemberCard = <span class="text-amber-300">true</span>;

console.log(orderAmount >= <span class="text-amber-300">300</span> || hasMemberCard); <span class="text-slate-500">// ???</span></code></pre>
        </div>
        <p class="text-base font-bold text-sky-300">小美可以免運嗎？</p>
        <div v-if="!quizAnswers['delivery']" class="flex gap-4">
          <button @click="answerQuiz('delivery', 'true', 'true', '答對了！雖然 250 不到 300，但有會員卡，|| 只要其中一個成立就是 true 🎉', '想想看，|| 是「或」的意思，只要其中一個條件成立就好喔。')" class="pick-btn pick-true">true（可以免運）</button>
          <button @click="answerQuiz('delivery', 'false', 'true', '', '想想看，|| 是「或」的意思，只要其中一個條件成立就好喔。')" class="pick-btn pick-false">false（不能免運）</button>
        </div>
        <div v-else class="rounded-xl bg-emerald-500/10 px-5 py-3 text-center text-sm text-emerald-300 animate-value-appear">
          <code class="text-white">false || true</code> → <strong>true</strong>，有會員卡就免運！
        </div>
      </div>
    </div>

    <!-- ===== Step 7: Quiz - Gift ===== -->
    <div v-else-if="stepData.view === 'quiz-gift'" class="slide-page">
      <div class="wm">&amp;&amp;</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-violet-500/20 text-violet-300">挑戰</div>
        <h2 class="text-xl font-bold text-white">🎁 百貨贈品</h2>
        <div class="scene-card">
          <p class="text-sm text-slate-300">百貨週年慶：消費滿 <strong class="text-white">3000 元</strong> <span class="text-violet-300">且</span> 在 <strong class="text-white">指定樓層</strong>消費，才能領贈品</p>
          <p class="mt-2 text-sm text-slate-300">小美消費了 <strong class="text-sky-300">3500 元</strong>，但在 <strong class="text-rose-300">非指定樓層</strong></p>
        </div>
        <div class="rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-sky-300">let</span> totalSpent = <span class="text-amber-300">3500</span>;
<span class="text-sky-300">let</span> isDesignatedFloor = <span class="text-amber-300">false</span>;

console.log(totalSpent >= <span class="text-amber-300">3000</span> &amp;&amp; isDesignatedFloor); <span class="text-slate-500">// ???</span></code></pre>
        </div>
        <p class="text-base font-bold text-sky-300">小美能領贈品嗎？</p>
        <div v-if="!quizAnswers['gift']" class="flex gap-4">
          <button @click="answerQuiz('gift', 'true', 'false', '', '想想看，&& 是「且」的意思，兩個條件都要成立才行喔。')" class="pick-btn pick-true">true（能領贈品）</button>
          <button @click="answerQuiz('gift', 'false', 'false', '答對了！雖然消費超過 3000，但不在指定樓層，&& 要兩個都成立才行 🎯', '')" class="pick-btn pick-false">false（不能領贈品）</button>
        </div>
        <div v-else class="rounded-xl bg-emerald-500/10 px-5 py-3 text-center text-sm text-emerald-300 animate-value-appear">
          <code class="text-white">true &amp;&amp; false</code> → <strong>false</strong>，兩個條件都要成立才行！
        </div>
      </div>
    </div>

    <!-- ===== Step 8: Syntax - if ===== -->
    <div v-else-if="stepData.view === 'syntax-if'" class="slide-page">
      <div class="wm">if</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">📝 if 語法</h2>
        <p class="text-sm text-slate-400">「<strong class="text-sky-300">如果</strong>條件成立，就執行裡面的程式」</p>
        <div class="w-full max-w-md rounded-2xl border border-sky-500/30 bg-slate-900 p-5">
          <pre class="text-base text-slate-300"><code><span class="text-sky-300">if</span> ( <span class="text-amber-300">條件</span> ) {
  <span class="text-slate-400">// 條件為 true 時，執行這裡</span>
}</code></pre>
        </div>
        <div class="max-w-md rounded-xl bg-sky-500/10 px-5 py-3 text-center text-sm text-sky-300">
          💡 就像你做決定：「<strong class="text-white">如果</strong>下雨，<strong class="text-white">就</strong>帶傘」
        </div>
      </div>
    </div>

    <!-- ===== Step 9: Quiz - Fever ===== -->
    <div v-else-if="stepData.view === 'quiz-fever'" class="slide-page">
      <div class="wm">🌡️</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">挑戰</div>
        <h2 class="text-xl font-bold text-white">🌡️ 體溫警示</h2>
        <div class="scene-card">
          <p class="text-sm text-slate-300">體溫超過 <strong class="text-white">37.5 度</strong>就顯示「請就醫」</p>
          <p class="mt-2 text-sm text-slate-300">小美量了 <strong class="text-sky-300">38.2 度</strong></p>
        </div>
        <div class="rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-sky-300">let</span> temperature = <span class="text-amber-300">38.2</span>;

<span class="text-sky-300">if</span> (temperature > <span class="text-amber-300">37.5</span>) {
  console.log(<span class="text-amber-300">'請就醫'</span>);
}</code></pre>
        </div>
        <p class="text-base font-bold text-sky-300">會印出什麼？</p>
        <div v-if="!quizAnswers['fever']" class="flex gap-4">
          <button @click="answerQuiz('fever', 'show', 'show', '答對了！38.2 > 37.5 是 true，所以會印出「請就醫」🌡️', '')" class="pick-btn pick-true">會印出「請就醫」</button>
          <button @click="answerQuiz('fever', 'nothing', 'show', '', '再想想看，38.2 有沒有大於 37.5 呢？')" class="pick-btn pick-false">什麼都不印</button>
        </div>
        <div v-else class="rounded-xl bg-emerald-500/10 px-5 py-3 text-center text-sm text-emerald-300 animate-value-appear">
          <code class="text-white">38.2 > 37.5</code> → true，印出 <strong>「請就醫」</strong>
        </div>
      </div>
    </div>

    <!-- ===== Step 10: Syntax - if else ===== -->
    <div v-else-if="stepData.view === 'syntax-ifelse'" class="slide-page">
      <div class="wm">else</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">📝 if ... else 語法</h2>
        <p class="text-sm text-slate-400">「<strong class="text-sky-300">如果</strong>成立就做 A，<strong class="text-amber-300">否則</strong>做 B」</p>
        <div class="w-full max-w-md rounded-2xl border border-sky-500/30 bg-slate-900 p-5">
          <pre class="text-base text-slate-300"><code><span class="text-sky-300">if</span> ( <span class="text-amber-300">條件</span> ) {
  <span class="text-slate-400">// 條件為 true 時</span>
} <span class="text-sky-300">else</span> {
  <span class="text-slate-400">// 條件為 false 時</span>
}</code></pre>
        </div>
        <div class="max-w-md rounded-xl bg-sky-500/10 px-5 py-3 text-center text-sm text-sky-300">
          💡 「<strong class="text-white">如果</strong>下雨就帶傘，<strong class="text-white">否則</strong>戴太陽眼鏡」
        </div>
      </div>
    </div>

    <!-- ===== Step 11: Quiz - Fullness ===== -->
    <div v-else-if="stepData.view === 'quiz-fullness'" class="slide-page">
      <div class="wm">🍚</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">挑戰</div>
        <h2 class="text-xl font-bold text-white">🍚 飽足感判斷</h2>
        <div class="scene-card">
          <p class="text-sm text-slate-300">飽足感 <strong class="text-white">6 以上</strong>不吃飯，<strong class="text-amber-300">否則</strong>去吃飯</p>
          <p class="mt-2 text-sm text-slate-300">小美現在飽足感 <strong class="text-sky-300">4</strong></p>
        </div>
        <div class="rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-sky-300">let</span> fullness = <span class="text-amber-300">4</span>;

<span class="text-sky-300">if</span> (fullness >= <span class="text-amber-300">6</span>) {
  console.log(<span class="text-amber-300">'不吃飯'</span>);
} <span class="text-sky-300">else</span> {
  console.log(<span class="text-amber-300">'去吃飯'</span>);
}</code></pre>
        </div>
        <p class="text-base font-bold text-sky-300">會印出什麼？</p>
        <div v-if="!quizAnswers['fullness']" class="flex gap-4">
          <button @click="answerQuiz('fullness', 'no-eat', 'eat', '', '4 有沒有大於等於 6 呢？不符合條件會走到 else 喔。')" class="pick-btn pick-false">不吃飯</button>
          <button @click="answerQuiz('fullness', 'eat', 'eat', '答對了！4 < 6 條件不成立，走 else → 去吃飯 🍚', '')" class="pick-btn pick-true">去吃飯</button>
        </div>
        <div v-else class="rounded-xl bg-emerald-500/10 px-5 py-3 text-center text-sm text-emerald-300 animate-value-appear">
          <code class="text-white">4 >= 6</code> → false，走 else → 印出 <strong>「去吃飯」</strong>
        </div>
      </div>
    </div>

    <!-- ===== Step 12: Syntax - else if ===== -->
    <div v-else-if="stepData.view === 'syntax-elseif'" class="slide-page">
      <div class="wm">elif</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">📝 if ... else if ... else 語法</h2>
        <p class="text-sm text-slate-400">「多重條件，從上往下檢查」</p>
        <div class="w-full max-w-md rounded-2xl border border-sky-500/30 bg-slate-900 p-5">
          <pre class="text-base text-slate-300"><code><span class="text-sky-300">if</span> ( <span class="text-amber-300">條件1</span> ) {
  <span class="text-slate-400">// 條件1 成立</span>
} <span class="text-sky-300">else if</span> ( <span class="text-amber-300">條件2</span> ) {
  <span class="text-slate-400">// 條件2 成立</span>
} <span class="text-sky-300">else</span> {
  <span class="text-slate-400">// 都不符合</span>
}</code></pre>
        </div>
        <div class="max-w-md rounded-xl bg-sky-500/10 px-5 py-3 text-center text-sm text-sky-300">
          💡 像是「考 90 以上得 A，80 以上得 B，70 以上得 C，其他是 F」
        </div>
      </div>
    </div>

    <!-- ===== Step 13: Quiz - Grade ===== -->
    <div v-else-if="stepData.view === 'quiz-grade'" class="slide-page">
      <div class="wm">📝</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">挑戰</div>
        <h2 class="text-xl font-bold text-white">📝 成績評等</h2>
        <div class="scene-card">
          <p class="text-sm text-slate-300">≥ 90 分 → A、≥ 80 分 → B、≥ 70 分 → C、其他 → F</p>
          <p class="mt-2 text-sm text-slate-300">小美考了 <strong class="text-sky-300">82 分</strong></p>
        </div>
        <div class="rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-sky-300">let</span> score = <span class="text-amber-300">82</span>;

<span class="text-sky-300">if</span> (score >= <span class="text-amber-300">90</span>) {
  console.log(<span class="text-amber-300">'A'</span>);
} <span class="text-sky-300">else if</span> (score >= <span class="text-amber-300">80</span>) {
  console.log(<span class="text-amber-300">'B'</span>);
} <span class="text-sky-300">else if</span> (score >= <span class="text-amber-300">70</span>) {
  console.log(<span class="text-amber-300">'C'</span>);
} <span class="text-sky-300">else</span> {
  console.log(<span class="text-amber-300">'F'</span>);
}</code></pre>
        </div>
        <p class="text-base font-bold text-sky-300">小美會拿到什麼等級？</p>
        <div v-if="!quizAnswers['grade']" class="flex flex-wrap justify-center gap-3">
          <button @click="answerQuiz('grade', 'A', 'B', '', '82 有大於等於 90 嗎？不符合就會往下一個條件檢查喔。')" class="pick-btn pick-grade">A</button>
          <button @click="answerQuiz('grade', 'B', 'B', '答對了！82 不到 90，但 >= 80 → 印出 B 🎯', '')" class="pick-btn pick-grade">B</button>
          <button @click="answerQuiz('grade', 'C', 'B', '', '82 >= 80 就會先被攔住了，不會再往下檢查 70 喔。')" class="pick-btn pick-grade">C</button>
          <button @click="answerQuiz('grade', 'F', 'B', '', '82 分還不錯的，不會到 F 喔！從上往下檢查看看。')" class="pick-btn pick-grade">F</button>
        </div>
        <div v-else class="rounded-xl bg-emerald-500/10 px-5 py-3 text-center text-sm text-emerald-300 animate-value-appear">
          82 不到 90（跳過 A）→ <code class="text-white">82 >= 80</code> 成立 → 印出 <strong>「B」</strong>
        </div>
      </div>
    </div>

    <!-- ===== Step 14: Scene - Score ===== -->
    <div v-else-if="stepData.view === 'scene-score'" class="slide-page">
      <div class="wm">🎯</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-amber-500/20 text-amber-300">情境拆解</div>
        <h2 class="text-xl font-bold text-white">🎯 小華的分數</h2>
        <div class="scene-card">
          <p class="text-sm text-slate-300">小華國文 <strong class="text-white">10</strong>、英文 <strong class="text-white">60</strong>、數學 <strong class="text-white">100</strong></p>
          <p class="mt-1 text-sm text-slate-300">父親說總分達 <strong class="text-sky-300">240 分</strong>就帶他去遊樂園</p>
        </div>

        <div class="w-full max-w-lg">
          <button v-if="sceneScorePhase === 0" @click="sceneScorePhase++; feedback = '步驟一：先定義目的，步驟二：設定初始資料'; feedbackType = 'success'" class="btn-action animate-bounce mx-auto block">
            來拆解看看 →
          </button>

          <div v-if="sceneScorePhase >= 1" class="mb-4 animate-value-appear">
            <div class="rounded-xl bg-slate-900 p-4">
              <pre class="text-sm text-slate-300"><code><span class="text-slate-500">// 步驟一：定義程式目的 → 判斷總分是否達到 240 分</span>
<span class="text-slate-500">// 步驟二：設定初始資料狀態</span>
<span class="text-sky-300">let</span> chinese = <span class="text-amber-300">10</span>;
<span class="text-sky-300">let</span> english = <span class="text-amber-300">60</span>;
<span class="text-sky-300">let</span> math = <span class="text-amber-300">100</span>;
<span class="text-sky-300">let</span> goal = <span class="text-amber-300">240</span>;</code></pre>
            </div>
            <button v-if="sceneScorePhase === 1" @click="sceneScorePhase++; feedback = 'total = 170，沒有達到 240 → 繼續加油！'; feedbackType = 'success'" class="btn-action mt-4 mx-auto block">
              步驟三：任務拆解 →
            </button>
          </div>

          <div v-if="sceneScorePhase >= 2" class="animate-value-appear">
            <div class="rounded-xl bg-slate-900 p-4">
              <pre class="text-sm text-slate-300"><code><span class="text-slate-500">// 步驟三：任務拆解</span>
<span class="text-sky-300">let</span> total = chinese + english + math;

<span class="text-sky-300">if</span> (total >= goal) {
  console.log(<span class="text-amber-300">'可以去遊樂園！'</span>);
} <span class="text-sky-300">else</span> {
  console.log(<span class="text-amber-300">'沒有達到門檻，繼續加油'</span>);
}
<span class="text-slate-500">// total = 170，印出「沒有達到門檻，繼續加油」</span></code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 15: Scene - Happy ===== -->
    <div v-else-if="stepData.view === 'scene-happy'" class="slide-page">
      <div class="wm">😊</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-amber-500/20 text-amber-300">情境拆解</div>
        <h2 class="text-xl font-bold text-white">😊 小美的快樂指數</h2>
        <div class="scene-card">
          <p class="text-sm text-slate-300">快樂指數 0~10，<strong class="text-white">≥ 8</strong> 宅在家、<strong class="text-white">5~7</strong> 去血拼、<strong class="text-white">≤ 4</strong> 唱卡拉 OK</p>
          <p class="mt-1 text-sm text-slate-300">小美今天快樂指數 <strong class="text-sky-300">6</strong></p>
        </div>

        <div class="w-full max-w-lg">
          <button v-if="sceneHappyPhase === 0" @click="sceneHappyPhase++; feedback = '步驟一：定義目的 → 根據快樂指數決定活動'; feedbackType = 'success'" class="btn-action animate-bounce mx-auto block">
            來拆解看看 →
          </button>

          <div v-if="sceneHappyPhase >= 1" class="mb-4 animate-value-appear">
            <div class="rounded-xl bg-slate-900 p-4">
              <pre class="text-sm text-slate-300"><code><span class="text-slate-500">// 步驟一：定義程式目的 → 根據快樂指數決定活動</span>
<span class="text-slate-500">// 步驟二：設定初始資料狀態</span>
<span class="text-sky-300">let</span> happyIndex = <span class="text-amber-300">6</span>;</code></pre>
            </div>
            <button v-if="sceneHappyPhase === 1" @click="sceneHappyPhase++; feedback = 'happyIndex = 6，走 else if (>= 5) → 去血拼！'; feedbackType = 'success'" class="btn-action mt-4 mx-auto block">
              步驟三：任務拆解 →
            </button>
          </div>

          <div v-if="sceneHappyPhase >= 2" class="animate-value-appear">
            <div class="rounded-xl bg-slate-900 p-4">
              <pre class="text-sm text-slate-300"><code><span class="text-slate-500">// 步驟三：任務拆解</span>
<span class="text-sky-300">if</span> (happyIndex >= <span class="text-amber-300">8</span>) {
  console.log(<span class="text-amber-300">'宅在家'</span>);
} <span class="text-sky-300">else if</span> (happyIndex >= <span class="text-amber-300">5</span>) {
  console.log(<span class="text-amber-300">'去血拼'</span>);
} <span class="text-sky-300">else</span> {
  console.log(<span class="text-amber-300">'去唱卡拉ok'</span>);
}
<span class="text-slate-500">// happyIndex = 6，印出「去血拼」</span></code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 16: Scene - Handshake ===== -->
    <div v-else-if="stepData.view === 'scene-handshake'" class="slide-page">
      <div class="wm">🤝</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-amber-500/20 text-amber-300">情境拆解</div>
        <h2 class="text-xl font-bold text-white">🤝 歌手握手會</h2>
        <div class="scene-card">
          <p class="text-sm text-slate-300">第一關：要有 <strong class="text-white">入場券</strong>才能進會場</p>
          <p class="text-sm text-slate-300">第二關：要買 <strong class="text-white">5000 張以上 DVD</strong> 才能握手</p>
          <p class="mt-1 text-sm text-slate-300">小明<strong class="text-sky-300">有入場券</strong>，但只買了 <strong class="text-rose-300">3000 張 DVD</strong></p>
        </div>

        <div class="w-full max-w-lg">
          <button v-if="sceneHandshakePhase === 0" @click="sceneHandshakePhase++; feedback = '第一關：有入場券 → 進入會場！接著看第二關⋯'; feedbackType = 'success'" class="btn-action animate-bounce mx-auto block">
            來拆解看看 →
          </button>

          <div v-if="sceneHandshakePhase >= 1" class="mb-4 animate-value-appear">
            <div class="rounded-xl bg-slate-900 p-4">
              <pre class="text-sm text-slate-300"><code><span class="text-sky-300">let</span> hasTicket = <span class="text-amber-300">true</span>;
<span class="text-sky-300">let</span> dvdCount = <span class="text-amber-300">3000</span>;

<span class="text-slate-500">// 第一關：檢查入場券</span>
<span class="text-sky-300">if</span> (hasTicket) {
  console.log(<span class="text-amber-300">'進入會場'</span>);  <span class="text-slate-500">// ← 進到這裡了！</span></code></pre>
            </div>
            <button v-if="sceneHandshakePhase === 1" @click="sceneHandshakePhase++; feedback = 'DVD 只有 3000 張，不到 5000 → 無法握手，忍痛離開'; feedbackType = 'error'" class="btn-action mt-4 mx-auto block">
              第二關：檢查 DVD →
            </button>
          </div>

          <div v-if="sceneHandshakePhase >= 2" class="animate-value-appear">
            <div class="rounded-xl bg-slate-900 p-4">
              <pre class="text-sm text-slate-300"><code><span class="text-sky-300">if</span> (hasTicket) {
  console.log(<span class="text-amber-300">'進入會場'</span>);

  <span class="text-slate-500">// 第二關：檢查 DVD 數量</span>
  <span class="text-sky-300">if</span> (dvdCount >= <span class="text-amber-300">5000</span>) {
    console.log(<span class="text-amber-300">'成功跟歌手握手！'</span>);
  } <span class="text-sky-300">else</span> {
    console.log(<span class="text-amber-300">'DVD 不夠，無法握手，忍痛離開'</span>);
  }
} <span class="text-sky-300">else</span> {
  console.log(<span class="text-amber-300">'沒有入場券，無法進入'</span>);
}
<span class="text-slate-500">// 印出「進入會場」</span>
<span class="text-slate-500">// 印出「DVD 不夠，無法握手，忍痛離開」</span></code></pre>
            </div>
            <div class="mt-4 rounded-xl bg-sky-500/10 px-5 py-3 text-center text-sm text-sky-300">
              💡 <strong class="text-white">巢狀 if</strong>：if 裡面可以再放 if，一關一關檢查！
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 17: Summary ===== -->
    <div v-else-if="stepData.view === 'summary'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">END</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/proud.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-sky-400 object-cover shadow-xl shadow-sky-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-sky-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">恭喜你完成邏輯判斷之術！🎉</p>
          <div class="mb-3 space-y-2 text-sm text-slate-300 md:text-base">
            <p>⚖️ <strong class="text-sky-300">比較運算子</strong> — 比大小、比相等，回傳 true / false</p>
            <p>🔗 <strong class="text-violet-300">邏輯運算子</strong> — &amp;&amp; 兩個都要、|| 其中一個就好</p>
            <p>🔀 <strong class="text-amber-300">if / else</strong> — 根據條件決定程式怎麼走</p>
          </div>
          <p class="text-xs text-slate-500 italic">「慢慢成長，才是比較快的。」—— 海姐</p>
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
.code-inline {
  @apply rounded bg-slate-700 px-1.5 py-0.5;
}
.op-card {
  @apply flex flex-col items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3;
}
.scene-badge {
  @apply rounded-full px-4 py-1 text-xs font-bold;
}
.scene-card {
  @apply w-full max-w-md space-y-1 rounded-2xl border border-slate-700 bg-slate-800/80 p-5;
}
.pick-btn {
  @apply rounded-xl border-2 px-6 py-3 text-sm font-bold transition-all active:scale-95;
}
.pick-true {
  @apply border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/20;
}
.pick-false {
  @apply border-rose-500/40 bg-rose-500/10 text-rose-300 hover:border-rose-400 hover:bg-rose-500/20;
}
.pick-grade {
  @apply border-sky-500/40 bg-sky-500/10 text-sky-300 hover:border-sky-400 hover:bg-sky-500/20 min-w-[60px];
}
@keyframes valueAppear {
  0% { opacity: 0; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-value-appear {
  animation: valueAppear 0.5s ease-out;
}
</style>
