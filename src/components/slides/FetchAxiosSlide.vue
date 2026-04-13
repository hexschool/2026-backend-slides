<script setup lang="ts">
/**
 * fetch vs axios：手排車 vs 自排車
 * 10 步驟情境式教學：比較 fetch 和 axios 的核心差異
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  { id: 0,  view: 'welcome',     title: '歡迎',              desc: 'fetch 的升級版來了' },
  { id: 1,  view: 'fetch-get',   title: 'fetch GET',        desc: '兩個 await，手動解析' },
  { id: 2,  view: 'axios-get',   title: 'axios GET',        desc: '一個 await，自動搞定' },
  { id: 3,  view: 'quiz-json',   title: '小測驗：為什麼？',  desc: 'axios 省了什麼步驟？' },
  { id: 4,  view: 'fetch-post',  title: 'fetch POST',       desc: '三件事要自己做' },
  { id: 5,  view: 'axios-post',  title: 'axios POST',       desc: '通通幫你搞定' },
  { id: 6,  view: 'quiz-post',   title: '小測驗：POST 比較', desc: 'axios 省了哪一件事？' },
  { id: 7,  view: 'error-diff',  title: '錯誤處理',          desc: 'fetch 的陷阱' },
  { id: 8,  view: 'quiz-error',  title: '小測驗：404 行為',  desc: 'fetch 遇到 404 會怎樣？' },
  { id: 9,  view: 'summary',     title: '總整理',            desc: '三大差異一次看懂' },
]

// ── Core ──
const currentStep = ref(0)
const stepData = computed(() => STEPS[currentStep.value])
const feedback = ref('')
const feedbackType = ref<'neutral' | 'success' | 'error' | 'question'>('neutral')

const feedbackClass = computed(() => {
  const map = {
    neutral:  'border-slate-600 bg-slate-800/80 text-slate-300',
    success:  'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    error:    'border-rose-500/50 bg-rose-500/10 text-rose-300',
    question: 'border-sky-500/50 bg-sky-500/10 text-sky-300',
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
  if (v === 'quiz-json')  return quizAnswers.value['json']  === 'A'
  if (v === 'quiz-post')  return quizAnswers.value['post']  === 'B'
  if (v === 'quiz-error') return quizAnswers.value['error'] === 'B'
  return true
})

const nextStepHint = computed(() => {
  const v = stepData.value.view
  if (v.startsWith('quiz-') && !canGoNext.value) return '選一個答案再繼續'
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
    title="fetch vs axios"
    subtitle="手排車 vs 自排車"
    icon="🚗"
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
      <div class="wm">AXIOS</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img
            src="/images/coach/normal.png"
            alt="海姐"
            class="h-28 w-28 rounded-full border-2 border-sky-400 object-cover shadow-xl shadow-sky-500/25 md:h-32 md:w-32"
            style="object-position: 50% 5%;"
          />
          <p class="mt-2 text-sm font-bold text-sky-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">嗨，歡迎回來 <strong class="text-sky-300">👋</strong></p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">上週我們學了 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-sky-300">fetch</code>，</p>
          <p class="mb-2 text-sm leading-relaxed text-white md:text-base">這週來認識它的升級版 ——<strong class="text-amber-300"> axios</strong> 🚀</p>
          <p class="mb-3 text-sm leading-relaxed text-slate-300 md:text-base">
            你可以把 fetch 想成<strong class="text-white">手排車</strong>，axios 是<strong class="text-white">自排車</strong>。<br />
            先學手排，才知道自排幫你省了什麼。
          </p>
          <p class="text-xs text-slate-500 italic">「了解差異，選對工具。」—— 海姐</p>
        </div>
      </div>
      <button
        @click="nextStep()"
        class="rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-sky-500/25 transition-all hover:shadow-sky-500/40 animate-bounce"
      >
        開始 →
      </button>
    </div>

    <!-- ===== Step 1: fetch GET ===== -->
    <div v-else-if="stepData.view === 'fetch-get'" class="slide-page">
      <div class="wm">FETCH</div>
      <div class="flex flex-col items-center gap-5">
        <h2 class="text-xl font-bold text-white">fetch GET — 需要兩個 await</h2>
        <p class="text-sm text-slate-400">呼叫 JSONPlaceholder 拿一筆文章資料</p>
        <div class="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <div class="mb-2 flex items-center gap-2">
            <span class="h-3 w-3 rounded-full bg-rose-500"></span>
            <span class="h-3 w-3 rounded-full bg-amber-500"></span>
            <span class="h-3 w-3 rounded-full bg-emerald-500"></span>
            <span class="ml-2 text-xs text-slate-500">fetch-get.js</span>
          </div>
          <pre class="overflow-x-auto text-sm leading-7 text-slate-200"><code
><span class="text-slate-500">// fetch：手排車，一步一步換檔</span>
<span class="text-sky-400">async</span> <span class="text-sky-400">function</span> <span class="text-amber-400">getPost</span>() {
  <span class="text-slate-500">// 第一個 await — 等網路回應</span>
  <span class="text-sky-400">const</span> <span class="text-white">response</span> <span class="text-sky-300">=</span> <span class="text-sky-400">await</span> <span class="text-amber-400">fetch</span>(<span class="text-emerald-400">'https://jsonplaceholder.typicode.com/posts/1'</span>)

  <span class="text-slate-500">// 第二個 await — 手動解析 JSON</span>
  <span class="text-sky-400">const</span> <span class="text-white">data</span> <span class="text-sky-300">=</span> <span class="text-sky-400">await</span> <span class="text-white">response</span>.<span class="text-amber-400">json</span>()

  console.<span class="text-amber-400">log</span>(<span class="text-white">data</span>)
}</code></pre>
        </div>
        <div class="flex flex-col gap-3 md:flex-row md:gap-6">
          <div class="label-chip bg-amber-500/10 border-amber-500/30 text-amber-300">
            <span class="font-bold">① 第一個 await</span> — 等伺服器回應
          </div>
          <div class="label-chip bg-rose-500/10 border-rose-500/30 text-rose-300">
            <span class="font-bold">② 第二個 await</span> — 手動呼叫 .json() 解析
          </div>
        </div>
        <p class="text-sm text-slate-400">這兩步都不能漏，少一個就拿不到資料。</p>
      </div>
    </div>

    <!-- ===== Step 2: axios GET ===== -->
    <div v-else-if="stepData.view === 'axios-get'" class="slide-page">
      <div class="wm">AXIOS</div>
      <div class="flex flex-col items-center gap-5">
        <h2 class="text-xl font-bold text-white">axios GET — 只需要一個 await</h2>
        <p class="text-sm text-slate-400">同一個 API，axios 版本</p>
        <div class="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <div class="mb-2 flex items-center gap-2">
            <span class="h-3 w-3 rounded-full bg-rose-500"></span>
            <span class="h-3 w-3 rounded-full bg-amber-500"></span>
            <span class="h-3 w-3 rounded-full bg-emerald-500"></span>
            <span class="ml-2 text-xs text-slate-500">axios-get.js</span>
          </div>
          <pre class="overflow-x-auto text-sm leading-7 text-slate-200"><code
><span class="text-slate-500">// axios：自排車，自動換檔</span>
<span class="text-sky-400">async</span> <span class="text-sky-400">function</span> <span class="text-amber-400">getPost</span>() {
  <span class="text-slate-500">// 只需要一個 await，JSON 自動解析好了</span>
  <span class="text-sky-400">const</span> <span class="text-white">response</span> <span class="text-sky-300">=</span> <span class="text-sky-400">await</span> <span class="text-amber-400">axios</span>.<span class="text-amber-400">get</span>(<span class="text-emerald-400">'https://jsonplaceholder.typicode.com/posts/1'</span>)

  <span class="text-slate-500">// 資料直接在 response.data，不需要 .json()</span>
  console.<span class="text-amber-400">log</span>(<span class="text-white">response</span>.<span class="text-amber-400">data</span>)
}</code></pre>
        </div>
        <div class="flex flex-col gap-3 md:flex-row md:gap-6">
          <div class="label-chip bg-emerald-500/10 border-emerald-500/30 text-emerald-300">
            <span class="font-bold">axios.get()</span> — 一個 await 搞定
          </div>
          <div class="label-chip bg-sky-500/10 border-sky-500/30 text-sky-300">
            <span class="font-bold">response.data</span> — JSON 已自動解析好
          </div>
        </div>
        <div class="flex items-start gap-3 max-w-md rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3">
          <img src="/images/coach/praise.png" alt="海姐" class="h-10 w-10 rounded-full object-cover shrink-0" style="object-position: 50% 5%;" />
          <p class="text-sm text-slate-300">少了一個 await，看起來很小事，但當 API 越來越多，每次少一行就省很多力氣。</p>
        </div>
      </div>
    </div>

    <!-- ===== Step 3: Quiz - JSON ===== -->
    <div v-else-if="stepData.view === 'quiz-json'" class="slide-page">
      <div class="wm">Q</div>
      <div class="flex flex-col items-center gap-6">
        <div class="quiz-badge">小測驗</div>
        <h2 class="text-xl font-bold text-white text-center">axios 為什麼不需要呼叫 <code class="text-sky-300">.json()</code>？</h2>
        <div class="grid w-full max-w-lg gap-3">
          <button
            @click="answerQuiz('json', 'A', 'A', '完全正確！axios 幫你自動把回應的 body 解析成 JSON，存在 response.data 裡，不需要手動呼叫 .json()。', '')"
            class="quiz-btn"
            :class="quizAnswers['json'] === 'A' ? 'quiz-btn-correct' : ''"
            :disabled="!!quizAnswers['json']"
          >
            <span class="quiz-option">A</span>
            <span>axios 內部會自動解析 JSON，直接放在 <code>response.data</code></span>
          </button>
          <button
            @click="answerQuiz('json', 'B', 'A', '', 'axios 一樣回傳 JSON 格式的資料，只是幫你自動解析好了，不是不回傳 JSON。')"
            class="quiz-btn"
            :class="quizAnswers['json'] === 'B' ? 'quiz-btn-wrong' : ''"
            :disabled="!!quizAnswers['json']"
          >
            <span class="quiz-option">B</span>
            <span>axios 不回傳 JSON，所以不用解析</span>
          </button>
          <button
            @click="answerQuiz('json', 'C', 'A', '', 'axios 不需要 response.text()，它用的是 response.data，而且 JSON 已經自動解析好了。')"
            class="quiz-btn"
            :class="quizAnswers['json'] === 'C' ? 'quiz-btn-wrong' : ''"
            :disabled="!!quizAnswers['json']"
          >
            <span class="quiz-option">C</span>
            <span>需要改用 <code>response.text()</code></span>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Step 4: fetch POST ===== -->
    <div v-else-if="stepData.view === 'fetch-post'" class="slide-page">
      <div class="wm">POST</div>
      <div class="flex flex-col items-center gap-5">
        <h2 class="text-xl font-bold text-white">fetch POST — 三件事要自己做</h2>
        <div class="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <div class="mb-2 flex items-center gap-2">
            <span class="h-3 w-3 rounded-full bg-rose-500"></span>
            <span class="h-3 w-3 rounded-full bg-amber-500"></span>
            <span class="h-3 w-3 rounded-full bg-emerald-500"></span>
            <span class="ml-2 text-xs text-slate-500">fetch-post.js</span>
          </div>
          <pre class="overflow-x-auto text-sm leading-7 text-slate-200"><code
><span class="text-sky-400">const</span> <span class="text-white">response</span> <span class="text-sky-300">=</span> <span class="text-sky-400">await</span> <span class="text-amber-400">fetch</span>(<span class="text-emerald-400">'https://jsonplaceholder.typicode.com/posts'</span>, {
  <span class="text-purple-400">method</span>: <span class="text-emerald-400">'POST'</span>,
  <span class="text-slate-500">// ① 要自己設定 Content-Type</span>
  <span class="text-purple-400">headers</span>: { <span class="text-emerald-400">'Content-Type'</span>: <span class="text-emerald-400">'application/json'</span> },
  <span class="text-slate-500">// ② 要自己把資料轉成字串</span>
  <span class="text-purple-400">body</span>: <span class="text-amber-400">JSON</span>.<span class="text-amber-400">stringify</span>({ <span class="text-purple-400">title</span>: <span class="text-emerald-400">'測試文章'</span>, <span class="text-purple-400">body</span>: <span class="text-emerald-400">'內容'</span> })
})
<span class="text-slate-500">// ③ 還要手動解析回應</span>
<span class="text-sky-400">const</span> <span class="text-white">data</span> <span class="text-sky-300">=</span> <span class="text-sky-400">await</span> <span class="text-white">response</span>.<span class="text-amber-400">json</span>()</code></pre>
        </div>
        <div class="grid grid-cols-1 gap-2 md:grid-cols-3 w-full max-w-2xl">
          <div class="label-chip bg-rose-500/10 border-rose-500/30 text-rose-300 justify-center">① 手動設 Content-Type</div>
          <div class="label-chip bg-rose-500/10 border-rose-500/30 text-rose-300 justify-center">② 手動 JSON.stringify</div>
          <div class="label-chip bg-rose-500/10 border-rose-500/30 text-rose-300 justify-center">③ 手動 .json() 解析</div>
        </div>
        <p class="text-sm text-slate-400">每次 POST 都要寫這三樣，一個不少。</p>
      </div>
    </div>

    <!-- ===== Step 5: axios POST ===== -->
    <div v-else-if="stepData.view === 'axios-post'" class="slide-page">
      <div class="wm">POST</div>
      <div class="flex flex-col items-center gap-5">
        <h2 class="text-xl font-bold text-white">axios POST — 通通幫你搞定</h2>
        <div class="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <div class="mb-2 flex items-center gap-2">
            <span class="h-3 w-3 rounded-full bg-rose-500"></span>
            <span class="h-3 w-3 rounded-full bg-amber-500"></span>
            <span class="h-3 w-3 rounded-full bg-emerald-500"></span>
            <span class="ml-2 text-xs text-slate-500">axios-post.js</span>
          </div>
          <pre class="overflow-x-auto text-sm leading-7 text-slate-200"><code
><span class="text-slate-500">// axios POST：直接傳物件，其他全部自動</span>
<span class="text-sky-400">const</span> <span class="text-white">response</span> <span class="text-sky-300">=</span> <span class="text-sky-400">await</span> <span class="text-amber-400">axios</span>.<span class="text-amber-400">post</span>(
  <span class="text-emerald-400">'https://jsonplaceholder.typicode.com/posts'</span>,
  { <span class="text-purple-400">title</span>: <span class="text-emerald-400">'測試文章'</span>, <span class="text-purple-400">body</span>: <span class="text-emerald-400">'內容'</span> }  <span class="text-slate-500">// 直接傳物件</span>
)

<span class="text-slate-500">// 資料就在這裡，不需要再解析</span>
console.<span class="text-amber-400">log</span>(<span class="text-white">response</span>.<span class="text-amber-400">data</span>)</code></pre>
        </div>
        <div class="flex flex-col gap-3 md:flex-row md:gap-6">
          <div class="label-chip bg-emerald-500/10 border-emerald-500/30 text-emerald-300">Content-Type 自動設定</div>
          <div class="label-chip bg-emerald-500/10 border-emerald-500/30 text-emerald-300">JSON.stringify 自動執行</div>
          <div class="label-chip bg-emerald-500/10 border-emerald-500/30 text-emerald-300">JSON 自動解析</div>
        </div>
        <div class="flex items-start gap-3 max-w-md rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3">
          <img src="/images/coach/biglaugh.png" alt="海姐" class="h-10 w-10 rounded-full object-cover shrink-0" style="object-position: 50% 5%;" />
          <p class="text-sm text-slate-300">傳進去一個物件，自排車自己換好檔再送出去。這才是自動的感覺！</p>
        </div>
      </div>
    </div>

    <!-- ===== Step 6: Quiz - POST ===== -->
    <div v-else-if="stepData.view === 'quiz-post'" class="slide-page">
      <div class="wm">Q</div>
      <div class="flex flex-col items-center gap-6">
        <div class="quiz-badge">小測驗</div>
        <h2 class="text-xl font-bold text-white text-center">用 axios POST 時，以下哪個<span class="text-rose-400">不用</span>自己寫？</h2>
        <div class="grid w-full max-w-lg gap-3">
          <button
            @click="answerQuiz('post', 'A', 'B', '', 'URL 還是要自己傳給 axios，axios 不知道你要打哪個 API 😄')"
            class="quiz-btn"
            :class="quizAnswers['post'] === 'A' ? 'quiz-btn-wrong' : ''"
            :disabled="!!quizAnswers['post']"
          >
            <span class="quiz-option">A</span>
            <span>API 的 URL</span>
          </button>
          <button
            @click="answerQuiz('post', 'B', 'B', '答對了！axios 會自動幫你設定 Content-Type: application/json，不需要手動加 headers。', '')"
            class="quiz-btn"
            :class="quizAnswers['post'] === 'B' ? 'quiz-btn-correct' : ''"
            :disabled="!!quizAnswers['post']"
          >
            <span class="quiz-option">B</span>
            <span>設定 Content-Type header</span>
          </button>
          <button
            @click="answerQuiz('post', 'C', 'B', '', '呼叫 axios.post() 這個函式本身還是要寫的，axios 不會自動幫你送 request。')"
            class="quiz-btn"
            :class="quizAnswers['post'] === 'C' ? 'quiz-btn-wrong' : ''"
            :disabled="!!quizAnswers['post']"
          >
            <span class="quiz-option">C</span>
            <span>呼叫 axios.post() 函式</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Step 7: Error Handling Diff ===== -->
    <div v-else-if="stepData.view === 'error-diff'" class="slide-page">
      <div class="wm">ERR</div>
      <div class="flex flex-col items-center gap-5">
        <h2 class="text-xl font-bold text-white">錯誤處理 — 最容易踩到的坑</h2>
        <div class="flex flex-col gap-4 md:flex-row md:gap-6 w-full max-w-3xl">
          <!-- fetch -->
          <div class="flex-1 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5">
            <p class="mb-3 text-center font-bold text-rose-300">fetch — 不拋錯</p>
            <pre class="overflow-x-auto text-xs leading-6 text-slate-200"><code
><span class="text-sky-400">const</span> <span class="text-white">res</span> <span class="text-sky-300">=</span> <span class="text-sky-400">await</span> <span class="text-amber-400">fetch</span>(<span class="text-emerald-400">'/api/不存在'</span>)

<span class="text-slate-500">// 404 — 但 fetch 不會拋錯！</span>
console.<span class="text-amber-400">log</span>(<span class="text-white">res</span>.<span class="text-amber-400">status</span>)    <span class="text-slate-500">// 404</span>
console.<span class="text-amber-400">log</span>(<span class="text-white">res</span>.<span class="text-amber-400">ok</span>)       <span class="text-slate-500">// false</span>

<span class="text-slate-500">// 要自己檢查才知道有錯</span>
<span class="text-sky-400">if</span> (!<span class="text-white">res</span>.<span class="text-amber-400">ok</span>) {
  <span class="text-sky-400">throw</span> <span class="text-sky-400">new</span> <span class="text-amber-400">Error</span>(<span class="text-emerald-400">'請求失敗'</span>)
}</code></pre>
            <div class="mt-3 rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              ⚠️ 忘記檢查 res.ok，靜悄悄出錯，很難 debug
            </div>
          </div>
          <!-- axios -->
          <div class="flex-1 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
            <p class="mb-3 text-center font-bold text-emerald-300">axios — 自動拋錯</p>
            <pre class="overflow-x-auto text-xs leading-6 text-slate-200"><code
><span class="text-sky-400">try</span> {
  <span class="text-sky-400">const</span> <span class="text-white">res</span> <span class="text-sky-300">=</span> <span class="text-sky-400">await</span> <span class="text-amber-400">axios</span>.<span class="text-amber-400">get</span>(<span class="text-emerald-400">'/api/不存在'</span>)
} <span class="text-sky-400">catch</span> (<span class="text-white">err</span>) {
  <span class="text-slate-500">// 4xx / 5xx 自動進 catch</span>
  console.<span class="text-amber-400">log</span>(<span class="text-white">err</span>.<span class="text-amber-400">response</span>.<span class="text-amber-400">status</span>) <span class="text-slate-500">// 404</span>
  console.<span class="text-amber-400">log</span>(<span class="text-white">err</span>.<span class="text-amber-400">message</span>)          <span class="text-slate-500">// 錯誤訊息</span>
}




</code></pre>
            <div class="mt-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
              ✅ 4xx / 5xx 統一進 catch，錯誤不會被吞掉
            </div>
          </div>
        </div>
        <div class="flex items-start gap-3 max-w-md rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3">
          <img src="/images/coach/shocked.png" alt="海姐" class="h-10 w-10 rounded-full object-cover shrink-0" style="object-position: 50% 5%;" />
          <p class="text-sm text-slate-300">fetch 遇到 404 不拋錯，就像叫外送結果送到別人家，應用程式完全不知情。</p>
        </div>
      </div>
    </div>

    <!-- ===== Step 8: Quiz - Error ===== -->
    <div v-else-if="stepData.view === 'quiz-error'" class="slide-page">
      <div class="wm">Q</div>
      <div class="flex flex-col items-center gap-6">
        <div class="quiz-badge">小測驗</div>
        <h2 class="text-xl font-bold text-white text-center">用 fetch 拿到 404 回應時，會怎樣？</h2>
        <div class="grid w-full max-w-lg gap-3">
          <button
            @click="answerQuiz('error', 'A', 'B', '', 'axios 才會自動拋錯。fetch 遇到 4xx / 5xx 不拋錯，Promise 依然 resolve。')"
            class="quiz-btn"
            :class="quizAnswers['error'] === 'A' ? 'quiz-btn-wrong' : ''"
            :disabled="!!quizAnswers['error']"
          >
            <span class="quiz-option">A</span>
            <span>自動拋出錯誤，進入 catch</span>
          </button>
          <button
            @click="answerQuiz('error', 'B', 'B', '答對了！fetch 的 Promise 會正常 resolve，但 response.ok 是 false。這是最常踩到的坑之一，要記得自己檢查。', '')"
            class="quiz-btn"
            :class="quizAnswers['error'] === 'B' ? 'quiz-btn-correct' : ''"
            :disabled="!!quizAnswers['error']"
          >
            <span class="quiz-option">B</span>
            <span>正常回傳，但 <code>response.ok</code> 是 <code>false</code></span>
          </button>
          <button
            @click="answerQuiz('error', 'C', 'B', '', '只有網路斷線、DNS 失敗等情況 fetch 才會拋錯。HTTP 錯誤狀態碼（4xx/5xx）fetch 不管。')"
            class="quiz-btn"
            :class="quizAnswers['error'] === 'C' ? 'quiz-btn-wrong' : ''"
            :disabled="!!quizAnswers['error']"
          >
            <span class="quiz-option">C</span>
            <span>程式崩潰，整個停掉</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Step 9: Summary ===== -->
    <div v-else-if="stepData.view === 'summary'" class="slide-page">
      <div class="wm">END</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">三大差異，一張表搞定</h2>
        <div class="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-800 text-center">
                <th class="px-4 py-3 text-left text-slate-400 font-medium">差異點</th>
                <th class="px-4 py-3 text-rose-300 font-bold">fetch（手排）</th>
                <th class="px-4 py-3 text-emerald-300 font-bold">axios（自排）</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr class="text-center bg-slate-900/50">
                <td class="px-4 py-3 text-left text-slate-300 font-medium">解析 JSON</td>
                <td class="px-4 py-3 text-rose-300">手動 .json()</td>
                <td class="px-4 py-3 text-emerald-300">自動，存在 .data</td>
              </tr>
              <tr class="text-center bg-slate-900/30">
                <td class="px-4 py-3 text-left text-slate-300 font-medium">POST 設定</td>
                <td class="px-4 py-3 text-rose-300">Content-Type + stringify 要自己寫</td>
                <td class="px-4 py-3 text-emerald-300">傳物件即可，全部自動</td>
              </tr>
              <tr class="text-center bg-slate-900/50">
                <td class="px-4 py-3 text-left text-slate-300 font-medium">HTTP 錯誤</td>
                <td class="px-4 py-3 text-rose-300">不拋錯，要自己查 ok</td>
                <td class="px-4 py-3 text-emerald-300">自動進 catch</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8 max-w-lg">
          <div class="flex shrink-0 flex-col items-center">
            <img
              src="/images/coach/proud.png"
              alt="海姐"
              class="h-20 w-20 rounded-full border-2 border-sky-400 object-cover shadow-xl shadow-sky-500/25"
              style="object-position: 50% 5%;"
            />
            <p class="mt-2 text-xs font-bold text-sky-300">海克絲</p>
          </div>
          <div class="rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4">
            <p class="mb-2 text-sm leading-relaxed text-slate-300">
              fetch 是手排車，axios 是自排車。
            </p>
            <p class="mb-2 text-sm leading-relaxed text-white">
              <strong>先學手排，才知道自排幫你省了什麼。</strong>
            </p>
            <p class="text-sm leading-relaxed text-slate-300">
              兩個都學過，以後遇到任何工具都不怕 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  </InteractiveSlideTemplate>
</template>

<style scoped>
/* ── Layout ── */
.slide-page {
  @apply relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden px-4 py-6 md:py-8;
}

/* ── Watermark ── */
.wm {
  @apply pointer-events-none absolute right-6 top-4 select-none text-6xl font-black tracking-widest text-white/[0.03] md:text-8xl;
}

/* ── Code highlights ── */
.highlight-await {
  @apply rounded bg-amber-500/20 px-1 text-amber-300;
}
.highlight-axios {
  @apply rounded bg-sky-500/20 px-1 text-sky-300;
}
.highlight-data {
  @apply rounded bg-emerald-500/20 px-1 text-emerald-300;
}
.highlight-manual {
  @apply rounded bg-rose-500/20 px-0.5 text-rose-300;
}

/* ── Label chips ── */
.label-chip {
  @apply flex items-center gap-2 rounded-xl border px-3 py-2 text-xs md:text-sm;
}

/* ── Quiz styles ── */
.quiz-badge {
  @apply rounded-full border border-sky-500/40 bg-sky-500/10 px-4 py-1 text-sm font-bold text-sky-300;
}

.quiz-btn {
  @apply flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-left text-sm text-slate-300 transition-all hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-60;
}

.quiz-btn-correct {
  @apply border-emerald-500/60 bg-emerald-500/10 text-emerald-200;
}

.quiz-btn-wrong {
  @apply border-rose-500/60 bg-rose-500/10 text-rose-300;
}

.quiz-option {
  @apply flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-600 bg-slate-700 text-xs font-bold text-slate-300;
}

/* ── Table ── */
table code {
  @apply rounded bg-slate-700 px-1 py-0.5 text-xs;
}

/* ── Pre / Code ── */
pre {
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, monospace;
}

code {
  font-family: inherit;
}
</style>
