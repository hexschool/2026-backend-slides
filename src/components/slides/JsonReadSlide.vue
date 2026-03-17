<script setup lang="ts">
/**
 * 看懂 JSON 資料
 * 13 步驟情境式教學：從 JSON 格式到讀懂真實 API 回傳資料
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  { id: 0,  view: 'welcome',          title: '歡迎',               desc: '海姐帶你看懂 JSON' },
  { id: 1,  view: 'json-vs-js',       title: 'JSON vs JS 物件',    desc: '長得很像，但規則不同' },
  { id: 2,  view: 'json-rules',       title: 'JSON 三大規則',      desc: '記住這三點就夠了' },
  { id: 3,  view: 'quiz-json-syntax', title: '挑戰：合法 JSON',    desc: '哪個寫法是對的？' },
  { id: 4,  view: 'read-steps',       title: '讀 JSON 四步驟',     desc: '拿到一包資料怎麼看' },
  { id: 5,  view: 'scene-pharmacy',   title: '情境：高雄藥局',     desc: 'open data 實戰' },
  { id: 6,  view: 'quiz-pharmacy',    title: '挑戰：取出電話',     desc: '康是美的電話怎麼取？' },
  { id: 7,  view: 'scene-rail',       title: '情境：高雄輕軌',     desc: 'API 資料實戰' },
  { id: 8,  view: 'quiz-rail',        title: '挑戰：下班車時間',   desc: '凱旋中華幾分鐘到？' },
  { id: 9,  view: 'scene-imgur',      title: '情境：Imgur API',    desc: '圖片上傳服務' },
  { id: 10, view: 'quiz-imgur',       title: '挑戰：圖片連結',     desc: '怎麼取出圖片網址？' },
  { id: 11, view: 'summary-insight',  title: '核心觀念',           desc: '讀 JSON 就像拆包裹' },
  { id: 12, view: 'summary-end',      title: '課程結束',           desc: '海姐的結語' },
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

// ── Scene animation phases ──
const pharmacyPhase = ref(0)
const railPhase = ref(0)
const imgurPhase = ref(0)

// ── Navigation ──
const canGoNext = computed(() => {
  const v = stepData.value.view
  if (v === 'quiz-json-syntax') return !!quizAnswers.value['json-syntax']
  if (v === 'quiz-pharmacy') return !!quizAnswers.value['pharmacy']
  if (v === 'quiz-rail') return !!quizAnswers.value['rail']
  if (v === 'quiz-imgur') return !!quizAnswers.value['imgur']
  if (v === 'scene-pharmacy') return pharmacyPhase.value >= 2
  if (v === 'scene-rail') return railPhase.value >= 2
  if (v === 'scene-imgur') return imgurPhase.value >= 2
  return true
})

const nextStepHint = computed(() => {
  const v = stepData.value.view
  if (v.startsWith('quiz-') && !quizAnswers.value[v.replace('quiz-', '')]) return '選一個答案'
  if (v === 'scene-pharmacy' && pharmacyPhase.value < 2) return '按按鈕繼續'
  if (v === 'scene-rail' && railPhase.value < 2) return '按按鈕繼續'
  if (v === 'scene-imgur' && imgurPhase.value < 2) return '按按鈕繼續'
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
    title="看懂 JSON 資料"
    subtitle="從格式到實戰"
    icon="📡"
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
      <div class="wm">JSON</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-sky-400 object-cover shadow-xl shadow-sky-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-sky-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">嗨，我是<strong class="text-sky-300">海姐</strong> 👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">學會了陣列和物件之後，你已經解鎖了一個超能力：</p>
          <p class="mb-2 text-sm leading-relaxed text-white md:text-base"><strong>「看懂真實世界的 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-sky-300">JSON</code> 資料」</strong></p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">以後跟伺服器要資料，回來的幾乎都是 JSON。</p>
          <p class="mb-3 text-sm leading-relaxed text-slate-300 md:text-base">第五、六週會教 API，而 JSON 就是 API 的共同語言——<strong class="text-sky-300">先學會讀它</strong>，到時候就不會慌。</p>
          <p class="text-xs text-slate-500 italic">「看懂資料，才能操作資料。」—— 海姐</p>
        </div>
      </div>
      <button @click="nextStep()" class="btn-action animate-bounce">
        開始 →
      </button>
    </div>

    <!-- ===== Step 1: JSON vs JS ===== -->
    <div v-else-if="stepData.view === 'json-vs-js'" class="slide-page">
      <div class="wm">VS</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">長得很像，但不一樣</h2>
        <div class="flex flex-col gap-6 md:flex-row md:gap-10">
          <div class="w-80 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
            <p class="mb-3 text-center text-lg font-bold text-emerald-300">JS 物件</p>
            <div class="rounded-xl bg-slate-900 p-4">
              <pre class="text-sm text-slate-300"><code><span class="text-slate-500">// 屬性名不用加引號</span>
const obj = {
  <span class="text-sky-300">name</span>: <span class="text-amber-300">"小華"</span>,
  <span class="text-sky-300">age</span>: <span class="text-amber-300">18</span>
}</code></pre>
            </div>
          </div>
          <div class="w-80 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-6">
            <p class="mb-3 text-center text-lg font-bold text-sky-300">JSON 格式</p>
            <div class="rounded-xl bg-slate-900 p-4">
              <pre class="text-sm text-slate-300"><code><span class="text-slate-500">// 屬性名「一定要」雙引號</span>
{
  <span class="text-sky-300">"name"</span>: <span class="text-amber-300">"小華"</span>,
  <span class="text-sky-300">"age"</span>: <span class="text-amber-300">18</span>
}</code></pre>
            </div>
          </div>
        </div>
        <p class="text-base text-slate-400">JSON 是一種<strong class="text-white">資料交換格式</strong>——以後跟伺服器要資料，回來的就是這個格式</p>
      </div>
    </div>

    <!-- ===== Step 2: JSON Rules ===== -->
    <div v-else-if="stepData.view === 'json-rules'" class="slide-page">
      <div class="wm">RULES</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">JSON 三大規則</h2>
        <div class="flex w-full max-w-lg flex-col gap-4">
          <div class="rule-card">
            <span class="rule-num">1</span>
            <div>
              <p class="font-bold text-white">屬性名一定要<span class="text-sky-300">雙引號</span></p>
              <p class="mt-1 text-sm text-slate-400"><code class="text-emerald-300">"name"</code> ✅ &nbsp; <code class="text-rose-300">name</code> ❌ &nbsp; <code class="text-rose-300">'name'</code> ❌</p>
            </div>
          </div>
          <div class="rule-card">
            <span class="rule-num">2</span>
            <div>
              <p class="font-bold text-white">不能有<span class="text-sky-300">註解</span></p>
              <p class="mt-1 text-sm text-slate-400"><code class="text-rose-300">// 這行會報錯</code> ❌</p>
            </div>
          </div>
          <div class="rule-card">
            <span class="rule-num">3</span>
            <div>
              <p class="font-bold text-white">不能有<span class="text-sky-300">多餘的逗號</span></p>
              <p class="mt-1 text-sm text-slate-400"><code class="text-rose-300">"age": 18<span class="text-rose-400 font-bold">,</span></code> ← 最後一個後面不能有逗號 ❌</p>
            </div>
          </div>
        </div>
        <p class="text-sm text-slate-400">規則比 JS 嚴格，因為要讓所有程式語言都能讀</p>
      </div>
    </div>

    <!-- ===== Step 3: Quiz - JSON Syntax ===== -->
    <div v-else-if="stepData.view === 'quiz-json-syntax'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-amber-500/20 text-amber-300">挑戰</div>
        <h2 class="text-xl font-bold text-white">哪個是合法的 JSON？</h2>
        <div class="flex flex-col gap-4 md:flex-row md:gap-6">
          <div class="quiz-code-card" :class="{ 'ring-2 ring-rose-500/50': quizAnswers['json-syntax'] && quizAnswers['json-syntax'] !== 'A' }">
            <p class="mb-2 text-sm font-bold text-slate-400">選項 A</p>
            <pre class="text-sm text-slate-300"><code>{
  <span class="text-sky-300">name</span>: <span class="text-amber-300">"小華"</span>,
  <span class="text-sky-300">age</span>: <span class="text-amber-300">18</span>
}</code></pre>
            <button v-if="!quizAnswers['json-syntax']" @click="answerQuiz('json-syntax', 'A', 'B', '', 'JSON 的屬性名一定要用「雙引號」包起來喔')" class="pick-btn pick-a mt-3">選 A</button>
          </div>
          <div class="quiz-code-card" :class="{ 'ring-2 ring-emerald-500/50': quizAnswers['json-syntax'] === 'B' }">
            <p class="mb-2 text-sm font-bold text-slate-400">選項 B</p>
            <pre class="text-sm text-slate-300"><code>{
  <span class="text-sky-300">"name"</span>: <span class="text-amber-300">"小華"</span>,
  <span class="text-sky-300">"age"</span>: <span class="text-amber-300">18</span>
}</code></pre>
            <button v-if="!quizAnswers['json-syntax']" @click="answerQuiz('json-syntax', 'B', 'B', '答對了！屬性名一定要雙引號，這是 JSON 最重要的規則', '')" class="pick-btn pick-b mt-3">選 B</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 4: Read Steps ===== -->
    <div v-else-if="stepData.view === 'read-steps'" class="slide-page">
      <div class="wm">1234</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">讀 JSON 四步驟</h2>
        <p class="text-sm text-slate-400">拿到一包資料，照這四步走</p>
        <div class="flex w-full max-w-lg flex-col gap-3">
          <div class="step-card">
            <span class="step-num bg-sky-500/20 text-sky-300">1</span>
            <div>
              <p class="font-bold text-white">看最外層</p>
              <p class="text-sm text-slate-400">是 <code class="text-emerald-300">{ }</code> 還是 <code class="text-sky-300">[ ]</code>？→ 物件還是陣列</p>
            </div>
          </div>
          <div class="flex justify-center text-slate-600">↓</div>
          <div class="step-card">
            <span class="step-num bg-sky-500/20 text-sky-300">2</span>
            <div>
              <p class="font-bold text-white">觀察結構</p>
              <p class="text-sm text-slate-400">裡面包了什麼？物件裡有陣列？陣列裡有物件？</p>
            </div>
          </div>
          <div class="flex justify-center text-slate-600">↓</div>
          <div class="step-card">
            <span class="step-num bg-sky-500/20 text-sky-300">3</span>
            <div>
              <p class="font-bold text-white">找到目標資料</p>
              <p class="text-sm text-slate-400">我要的資訊在哪個屬性裡？</p>
            </div>
          </div>
          <div class="flex justify-center text-slate-600">↓</div>
          <div class="step-card">
            <span class="step-num bg-sky-500/20 text-sky-300">4</span>
            <div>
              <p class="font-bold text-white">取值</p>
              <p class="text-sm text-slate-400">用索引值 + 點記法 / 括弧記法組合取出來</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 5: Scene - Pharmacy ===== -->
    <div v-else-if="stepData.view === 'scene-pharmacy'" class="slide-page">
      <div class="wm">[ ]</div>
      <div class="flex flex-col items-center gap-5">
        <div class="scene-badge bg-violet-500/20 text-violet-300">情境一</div>
        <h2 class="text-xl font-bold text-white">高雄市藥局 open data</h2>
        <p class="text-sm text-slate-400">小華打開高雄市政府的公開資料，拿到一包藥局 JSON：</p>

        <div class="w-full max-w-xl rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300 leading-relaxed"><code><span class="text-sky-300 font-bold">[</span>
  {
    <span class="text-sky-300">"機構名稱"</span>: <span class="text-amber-300">"健安藥局"</span>,
    <span class="text-sky-300">"機構地址"</span>: <span class="text-amber-300">"高雄市三民區建工路 100 號"</span>,
    <span class="text-sky-300">"機構電話"</span>: <span class="text-amber-300">"07-3456789"</span>
  },
  {
    <span class="text-sky-300">"機構名稱"</span>: <span class="text-amber-300">"康是美新崛江門市"</span>,
    <span class="text-sky-300">"機構地址"</span>: <span class="text-amber-300">"高雄市新興區中山一路 200 號"</span>,
    <span class="text-sky-300">"機構電話"</span>: <span class="text-amber-300">"07-2345678"</span>
  }
<span class="text-sky-300 font-bold">]</span></code></pre>
        </div>

        <div class="w-full max-w-xl">
          <div v-if="pharmacyPhase >= 1" class="mb-3 animate-value-appear">
            <div class="analysis-card">
              <p><span class="text-sky-300 font-bold">Step 1</span> 最外層是 <code class="code-tag text-sky-300">[ ]</code> → 這是一個<strong class="text-white">陣列</strong></p>
              <p class="mt-1"><span class="text-sky-300 font-bold">Step 2</span> 裡面每一筆都是 <code class="code-tag text-emerald-300">{ }</code> → 每間藥局是一個<strong class="text-white">物件</strong></p>
            </div>
          </div>
          <div v-if="pharmacyPhase >= 2" class="animate-value-appear">
            <div class="analysis-card">
              <p><span class="text-sky-300 font-bold">Step 3</span> 目標：康是美的電話 → 在第二筆（索引 <code class="code-tag text-amber-300">1</code>）的 <code class="code-tag text-sky-300">"機構電話"</code></p>
              <p class="mt-1"><span class="text-sky-300 font-bold">Step 4</span> 取值：<code class="code-tag text-emerald-300">data[1]["機構電話"]</code></p>
              <p class="mt-2 text-xs text-slate-500">中文屬性名 → 用括弧記法</p>
            </div>
          </div>
        </div>

        <button v-if="pharmacyPhase < 2" @click="pharmacyPhase++; feedback = pharmacyPhase === 1 ? '先看最外層的結構⋯' : '找到目標，組合取值！'; feedbackType = 'success'" class="btn-action animate-bounce">
          {{ pharmacyPhase === 0 ? '分析結構' : '找目標 & 取值' }}
        </button>
      </div>
    </div>

    <!-- ===== Step 6: Quiz - Pharmacy ===== -->
    <div v-else-if="stepData.view === 'quiz-pharmacy'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-amber-500/20 text-amber-300">挑戰</div>
        <h2 class="text-xl font-bold text-white">怎麼取出「健安藥局」的地址？</h2>
        <div class="w-full max-w-lg rounded-xl bg-slate-900 p-3">
          <pre class="text-xs text-slate-400 leading-relaxed"><code>[
  { <span class="text-sky-300">"機構名稱"</span>: <span class="text-amber-300">"健安藥局"</span>, <span class="text-sky-300">"機構地址"</span>: <span class="text-amber-300">"...建工路 100 號"</span>, <span class="text-sky-300">"機構電話"</span>: <span class="text-amber-300">"07-3456789"</span> },
  { <span class="text-sky-300">"機構名稱"</span>: <span class="text-amber-300">"康是美新崛江門市"</span>, <span class="text-sky-300">"機構地址"</span>: <span class="text-amber-300">"...中山一路 200 號"</span>, ... }
]</code></pre>
        </div>
        <p class="text-sm text-slate-400">資料存在變數 <code class="code-tag text-sky-300">data</code> 裡</p>
        <div class="flex flex-col gap-3 w-full max-w-md">
          <button v-if="!quizAnswers['pharmacy']" @click="answerQuiz('pharmacy', 'A', 'C', '', '健安藥局是第一筆，索引值是 0 不是 1 喔')" class="pick-btn-wide">
            A. <code>data[1]["機構地址"]</code>
          </button>
          <button v-if="!quizAnswers['pharmacy']" @click="answerQuiz('pharmacy', 'B', 'C', '', '中文屬性名不能用點記法，要用括弧記法')" class="pick-btn-wide">
            B. <code>data[0].機構地址</code>
          </button>
          <button v-if="!quizAnswers['pharmacy']" @click="answerQuiz('pharmacy', 'C', 'C', '答對了！第一筆索引是 0，中文屬性要用括弧記法', '')" class="pick-btn-wide">
            C. <code>data[0]["機構地址"]</code>
          </button>
        </div>
        <div v-if="quizAnswers['pharmacy']" class="w-full max-w-md rounded-xl bg-slate-900 p-4 animate-value-appear">
          <pre class="text-sm text-slate-300"><code>data[<span class="text-amber-300">0</span>][<span class="text-sky-300">"機構地址"</span>]
<span class="text-slate-500">// "高雄市三民區建工路 100 號"</span></code></pre>
        </div>
      </div>
    </div>

    <!-- ===== Step 7: Scene - Rail ===== -->
    <div v-else-if="stepData.view === 'scene-rail'" class="slide-page">
      <div class="wm">{ }</div>
      <div class="flex flex-col items-center gap-5">
        <div class="scene-badge bg-violet-500/20 text-violet-300">情境二</div>
        <h2 class="text-xl font-bold text-white">高雄輕軌即時資訊</h2>
        <p class="text-sm text-slate-400">小明想查輕軌到站時間，API 回傳：</p>

        <div class="w-full max-w-xl rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300 leading-relaxed"><code><span class="text-emerald-300 font-bold">{</span>
  <span class="text-sky-300">"updateTime"</span>: <span class="text-amber-300">"2026-03-17 10:30:00"</span>,
  <span class="text-sky-300">"stations"</span>: <span class="text-sky-300 font-bold">[</span>
    {
      <span class="text-sky-300">"stationName"</span>: <span class="text-amber-300">"籬仔內"</span>,
      <span class="text-sky-300">"nextTrain"</span>: <span class="text-amber-300">"2 分鐘"</span>
    },
    {
      <span class="text-sky-300">"stationName"</span>: <span class="text-amber-300">"凱旋中華"</span>,
      <span class="text-sky-300">"nextTrain"</span>: <span class="text-amber-300">"5 分鐘"</span>
    }
  <span class="text-sky-300 font-bold">]</span>
<span class="text-emerald-300 font-bold">}</span></code></pre>
        </div>

        <div class="w-full max-w-xl">
          <div v-if="railPhase >= 1" class="mb-3 animate-value-appear">
            <div class="analysis-card">
              <p><span class="text-sky-300 font-bold">Step 1</span> 最外層是 <code class="code-tag text-emerald-300">{ }</code> → 這是一個<strong class="text-white">物件</strong></p>
              <p class="mt-1"><span class="text-sky-300 font-bold">Step 2</span> <code class="code-tag text-sky-300">stations</code> 裡面是 <code class="code-tag text-sky-300">[ ]</code> → 站點是<strong class="text-white">陣列</strong>，裡面每站是<strong class="text-white">物件</strong></p>
            </div>
          </div>
          <div v-if="railPhase >= 2" class="animate-value-appear">
            <div class="analysis-card">
              <p><span class="text-sky-300 font-bold">Step 3</span> 目標：凱旋中華的下班車 → <code class="code-tag text-sky-300">stations</code> 第二筆的 <code class="code-tag text-sky-300">nextTrain</code></p>
              <p class="mt-1"><span class="text-sky-300 font-bold">Step 4</span> 取值：<code class="code-tag text-emerald-300">data.stations[1].nextTrain</code></p>
              <p class="mt-2 text-xs text-slate-500">物件 → 陣列 → 物件，一層一層往下取</p>
            </div>
          </div>
        </div>

        <button v-if="railPhase < 2" @click="railPhase++; feedback = railPhase === 1 ? '外層是物件，裡面包著陣列⋯' : '物件 → 陣列 → 物件，逐層深入！'; feedbackType = 'success'" class="btn-action animate-bounce">
          {{ railPhase === 0 ? '分析結構' : '找目標 & 取值' }}
        </button>
      </div>
    </div>

    <!-- ===== Step 8: Quiz - Rail ===== -->
    <div v-else-if="stepData.view === 'quiz-rail'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-amber-500/20 text-amber-300">挑戰</div>
        <h2 class="text-xl font-bold text-white">怎麼取出「籬仔內」的下班車時間？</h2>
        <div class="w-full max-w-lg rounded-xl bg-slate-900 p-3">
          <pre class="text-xs text-slate-400 leading-relaxed"><code>{
  <span class="text-sky-300">"updateTime"</span>: <span class="text-amber-300">"2026-03-17 10:30:00"</span>,
  <span class="text-sky-300">"stations"</span>: [
    { <span class="text-sky-300">"stationName"</span>: <span class="text-amber-300">"籬仔內"</span>, <span class="text-sky-300">"nextTrain"</span>: <span class="text-amber-300">"2 分鐘"</span> },
    { <span class="text-sky-300">"stationName"</span>: <span class="text-amber-300">"凱旋中華"</span>, <span class="text-sky-300">"nextTrain"</span>: <span class="text-amber-300">"5 分鐘"</span> }
  ]
}</code></pre>
        </div>
        <p class="text-sm text-slate-400">資料存在變數 <code class="code-tag text-sky-300">data</code> 裡</p>
        <div class="flex flex-col gap-3 w-full max-w-md">
          <button v-if="!quizAnswers['rail']" @click="answerQuiz('rail', 'A', 'A', '答對了！先進 stations 陣列，第一筆索引 0，再取 nextTrain', '')" class="pick-btn-wide">
            A. <code>data.stations[0].nextTrain</code>
          </button>
          <button v-if="!quizAnswers['rail']" @click="answerQuiz('rail', 'B', 'A', '', '籬仔內是第一筆，索引值是 0 不是 1')" class="pick-btn-wide">
            B. <code>data.stations[1].nextTrain</code>
          </button>
          <button v-if="!quizAnswers['rail']" @click="answerQuiz('rail', 'C', 'A', '', 'stations 是陣列，要用索引值 [0] 取第一筆')" class="pick-btn-wide">
            C. <code>data.stations.nextTrain</code>
          </button>
        </div>
        <div v-if="quizAnswers['rail']" class="w-full max-w-md rounded-xl bg-slate-900 p-4 animate-value-appear">
          <pre class="text-sm text-slate-300"><code>data.stations[<span class="text-amber-300">0</span>].nextTrain
<span class="text-slate-500">// "2 分鐘"</span></code></pre>
        </div>
      </div>
    </div>

    <!-- ===== Step 9: Scene - Imgur ===== -->
    <div v-else-if="stepData.view === 'scene-imgur'" class="slide-page">
      <div class="wm">API</div>
      <div class="flex flex-col items-center gap-5">
        <div class="scene-badge bg-violet-500/20 text-violet-300">情境三</div>
        <h2 class="text-xl font-bold text-white">Imgur 圖片上傳 API</h2>
        <p class="text-sm text-slate-400">小美上傳了一張圖片，API 回傳：</p>

        <div class="w-full max-w-xl rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300 leading-relaxed"><code><span class="text-emerald-300 font-bold">{</span>
  <span class="text-sky-300">"data"</span>: <span class="text-emerald-300 font-bold">{</span>
    <span class="text-sky-300">"id"</span>: <span class="text-amber-300">"abc123"</span>,
    <span class="text-sky-300">"title"</span>: <span class="text-amber-300">"我的貓咪"</span>,
    <span class="text-sky-300">"link"</span>: <span class="text-amber-300">"https://i.imgur.com/abc123.jpg"</span>,
    <span class="text-sky-300">"width"</span>: <span class="text-amber-300">1920</span>,
    <span class="text-sky-300">"height"</span>: <span class="text-amber-300">1080</span>
  <span class="text-emerald-300 font-bold">}</span>,
  <span class="text-sky-300">"success"</span>: <span class="text-amber-300">true</span>,
  <span class="text-sky-300">"status"</span>: <span class="text-amber-300">200</span>
<span class="text-emerald-300 font-bold">}</span></code></pre>
        </div>

        <div class="w-full max-w-xl">
          <div v-if="imgurPhase >= 1" class="mb-3 animate-value-appear">
            <div class="analysis-card">
              <p><span class="text-sky-300 font-bold">Step 1</span> 最外層是 <code class="code-tag text-emerald-300">{ }</code> → <strong class="text-white">物件</strong></p>
              <p class="mt-1"><span class="text-sky-300 font-bold">Step 2</span> <code class="code-tag text-sky-300">data</code> 裡面也是 <code class="code-tag text-emerald-300">{ }</code> → <strong class="text-white">物件包物件</strong></p>
            </div>
          </div>
          <div v-if="imgurPhase >= 2" class="animate-value-appear">
            <div class="analysis-card">
              <p><span class="text-sky-300 font-bold">Step 3</span> 目標：圖片連結 → 藏在 <code class="code-tag text-sky-300">data</code> 裡的 <code class="code-tag text-sky-300">link</code></p>
              <p class="mt-1"><span class="text-sky-300 font-bold">Step 4</span> 取值：<code class="code-tag text-emerald-300">response.data.link</code></p>
              <p class="mt-2 text-xs text-slate-500">真實 API 常把資料包在 data 裡，外層放 success / status 等狀態</p>
            </div>
          </div>
        </div>

        <button v-if="imgurPhase < 2" @click="imgurPhase++; feedback = imgurPhase === 1 ? '物件裡面又包了一個物件⋯' : 'API 常把資料包在 data 裡面，這個 pattern 很常見！'; feedbackType = 'success'" class="btn-action animate-bounce">
          {{ imgurPhase === 0 ? '分析結構' : '找目標 & 取值' }}
        </button>
      </div>
    </div>

    <!-- ===== Step 10: Quiz - Imgur ===== -->
    <div v-else-if="stepData.view === 'quiz-imgur'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-amber-500/20 text-amber-300">挑戰</div>
        <h2 class="text-xl font-bold text-white">怎麼取出圖片的寬度（width）？</h2>
        <div class="w-full max-w-lg rounded-xl bg-slate-900 p-3">
          <pre class="text-xs text-slate-400 leading-relaxed"><code>{
  <span class="text-sky-300">"data"</span>: {
    <span class="text-sky-300">"id"</span>: <span class="text-amber-300">"abc123"</span>, <span class="text-sky-300">"title"</span>: <span class="text-amber-300">"我的貓咪"</span>,
    <span class="text-sky-300">"link"</span>: <span class="text-amber-300">"https://i.imgur.com/abc123.jpg"</span>,
    <span class="text-sky-300">"width"</span>: <span class="text-amber-300">1920</span>, <span class="text-sky-300">"height"</span>: <span class="text-amber-300">1080</span>
  },
  <span class="text-sky-300">"success"</span>: <span class="text-amber-300">true</span>, <span class="text-sky-300">"status"</span>: <span class="text-amber-300">200</span>
}</code></pre>
        </div>
        <p class="text-sm text-slate-400">資料存在變數 <code class="code-tag text-sky-300">response</code> 裡</p>
        <div class="flex flex-col gap-3 w-full max-w-md">
          <button v-if="!quizAnswers['imgur']" @click="answerQuiz('imgur', 'A', 'A', '答對了！先進 data 物件，再取 width 屬性', '')" class="pick-btn-wide">
            A. <code>response.data.width</code>
          </button>
          <button v-if="!quizAnswers['imgur']" @click="answerQuiz('imgur', 'B', 'A', '', '圖片資料藏在 data 裡面，不能直接從 response 取 width')" class="pick-btn-wide">
            B. <code>response.width</code>
          </button>
          <button v-if="!quizAnswers['imgur']" @click="answerQuiz('imgur', 'C', 'A', '', 'data 是物件不是陣列，不用索引值')" class="pick-btn-wide">
            C. <code>response.data[0].width</code>
          </button>
        </div>
        <div v-if="quizAnswers['imgur']" class="w-full max-w-md rounded-xl bg-slate-900 p-4 animate-value-appear">
          <pre class="text-sm text-slate-300"><code>response.data.width
<span class="text-slate-500">// 1920</span></code></pre>
        </div>
      </div>
    </div>

    <!-- ===== Step 11: Summary Insight ===== -->
    <div v-else-if="stepData.view === 'summary-insight'" class="slide-page">
      <div class="wm">KEY</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">讀 JSON 就像拆包裹</h2>
        <div class="flex flex-col gap-4 w-full max-w-lg">
          <div class="summary-row">
            <span class="text-2xl">📦</span>
            <div>
              <p class="font-bold text-white">看外層包裝</p>
              <p class="text-sm text-slate-400"><code class="text-emerald-300">{ }</code> 物件 或 <code class="text-sky-300">[ ]</code> 陣列</p>
            </div>
          </div>
          <div class="summary-row">
            <span class="text-2xl">🔍</span>
            <div>
              <p class="font-bold text-white">一層一層打開</p>
              <p class="text-sm text-slate-400">物件用 <code class="text-emerald-300">.屬性</code>，陣列用 <code class="text-sky-300">[索引]</code></p>
            </div>
          </div>
          <div class="summary-row">
            <span class="text-2xl">🎯</span>
            <div>
              <p class="font-bold text-white">找到你要的東西</p>
              <p class="text-sm text-slate-400">組合起來一路取到底</p>
            </div>
          </div>
        </div>
        <div class="max-w-md rounded-2xl border border-sky-500/40 bg-sky-500/10 px-6 py-5 text-center">
          <p class="text-lg font-bold text-sky-300">三種常見結構</p>
          <div class="mt-3 flex flex-col gap-2 text-sm text-slate-300">
            <p>藥局：<code class="code-tag text-sky-300">[ { }, { } ]</code> 陣列包物件</p>
            <p>輕軌：<code class="code-tag text-emerald-300">{ stations: [ ] }</code> 物件包陣列</p>
            <p>Imgur：<code class="code-tag text-emerald-300">{ data: { } }</code> 物件包物件</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 12: Summary End ===== -->
    <div v-else-if="stepData.view === 'summary-end'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">END</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/proud.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-sky-400 object-cover shadow-xl shadow-sky-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-sky-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">恭喜你學會讀 JSON 了！🎉</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">以後看到任何 API 文件或 open data，你都可以：</p>
          <p class="mb-3 text-sm leading-relaxed text-white md:text-base"><strong>「看外層 → 觀察結構 → 找目標 → 取值」</strong></p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">這四個步驟走完，再複雜的 JSON 也難不倒你。</p>
          <p class="text-xs text-slate-500 italic">「看懂資料，才能操作資料。慢慢來，你已經跨出很大一步了。」—— 海姐</p>
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
.pick-btn {
  @apply rounded-xl border-2 px-6 py-3 text-sm font-bold transition-all active:scale-95;
}
.pick-a {
  @apply border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/20;
}
.pick-b {
  @apply border-sky-500/40 bg-sky-500/10 text-sky-300 hover:border-sky-400 hover:bg-sky-500/20;
}
.pick-btn-wide {
  @apply w-full rounded-xl border-2 border-slate-600 bg-slate-800/80 px-5 py-3.5 text-left text-sm font-mono text-slate-300 transition-all hover:border-sky-400 hover:bg-sky-500/10 hover:text-sky-300 active:scale-[0.98];
}
.quiz-code-card {
  @apply w-72 rounded-2xl border border-slate-700 bg-slate-800/80 p-5;
}
.rule-card {
  @apply flex items-start gap-4 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-4;
}
.rule-num {
  @apply flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sm font-bold text-sky-300;
}
.step-card {
  @apply flex items-start gap-4 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-4;
}
.step-num {
  @apply flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold;
}
.analysis-card {
  @apply rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-slate-300;
}
.code-tag {
  @apply rounded bg-slate-700 px-1.5 py-0.5;
}
.summary-row {
  @apply flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-4;
}
</style>
