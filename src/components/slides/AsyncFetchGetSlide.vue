<script setup lang="ts">
/**
 * 非同步與 fetch GET：核心觀念 + 兩個坑
 * 13 步驟：建立 Promise/await/async 心智模型 + 第一個 fetch 範例
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  { id: 0,  view: 'welcome',              title: '歡迎',           desc: '今天教 fetch，先理解一個關鍵字：等' },
  { id: 1,  view: 'sync-vs-async',        title: '同步 vs 非同步', desc: '排隊 vs 號碼牌' },
  { id: 2,  view: 'promise-pending-demo', title: '印出來看看',     desc: 'fetch 給你的不是資料' },
  { id: 3,  view: 'await-open',           title: 'Promise + await', desc: '盒子比喻 + 打開拿值' },
  { id: 4,  view: 'async-tag',            title: 'async 招牌',     desc: '函式裡有 await 就要掛這個招牌' },
  { id: 5,  view: 'fetch-three-steps',    title: 'fetch GET 三步驟', desc: '套用 await 的標準寫法' },
  { id: 6,  view: 'trap-1-json',          title: '⚠️ 坑 1',        desc: 'response.json() 也要 await' },
  { id: 7,  view: 'trap-2-return',        title: '⚠️ 坑 2',        desc: '函式要 return' },
  { id: 8,  view: 'response-anatomy',     title: 'response 物件',  desc: '裡面有什麼？' },
  { id: 9,  view: 'array-bridge',         title: '串接 day5',      desc: '拉到資料後用 map / filter' },
  { id: 10, view: 'quiz-await',           title: '快問快答',       desc: '哪段 code 會印出 Promise pending？' },
  { id: 11, view: 'summary',              title: '結尾',           desc: '海姐結語' },
]

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

const canGoNext = computed(() => {
  if (stepData.value.view === 'quiz-await') return quizAnswers.value['await'] === 'B'
  return true
})

const nextStepHint = computed(() => {
  if (stepData.value.view === 'quiz-await' && !quizAnswers.value['await']) return '選一段答案'
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
    title="非同步與 fetch GET"
    subtitle="今天的核心觀念"
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
    <div v-if="feedback" class="mx-auto max-w-3xl px-4 pt-4">
      <div class="rounded-xl border px-4 py-3 text-sm md:text-base" :class="feedbackClass">
        <span class="mr-2">{{ feedbackIcon }}</span>{{ feedback }}
      </div>
    </div>

    <!-- ===== Step 0: Welcome ===== -->
    <div v-if="stepData.view === 'welcome'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">async</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-sky-400 object-cover shadow-xl shadow-sky-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-sky-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">今天教 fetch 👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">但要先理解一個關鍵字：</p>
          <p class="mb-3 text-2xl font-bold text-sky-300">「等」</p>
          <p class="text-xs text-slate-500 italic">「會等，比會寫更重要。」—— 海姐</p>
        </div>
      </div>
      <button @click="nextStep()" class="rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-sky-500/25 transition-all hover:shadow-sky-500/40 animate-bounce">
        開始 →
      </button>
    </div>

    <!-- ===== Step 1: Sync vs Async ===== -->
    <div v-else-if="stepData.view === 'sync-vs-async'" class="slide-page">
      <div class="wm">SYNC</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">同步 vs 非同步</h2>

        <div class="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          <div class="rounded-2xl border-2 border-rose-500/40 bg-rose-500/5 p-5">
            <p class="text-center text-lg font-bold text-rose-300">😵 同步 = 排隊死等</p>
            <div class="mt-4 space-y-2 text-sm text-slate-300">
              <p>1️⃣ 客人 A 點餐 → 等做好 → 拿走</p>
              <p>2️⃣ 客人 B 點餐 → 等做好 → 拿走</p>
              <p>3️⃣ 客人 C 點餐 → 等做好 → 拿走</p>
            </div>
            <p class="mt-3 text-center text-xs text-rose-300">→ 整家店塞死</p>
          </div>

          <div class="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-5">
            <p class="text-center text-lg font-bold text-emerald-300">😎 非同步 = 號碼牌</p>
            <div class="mt-4 space-y-2 text-sm text-slate-300">
              <p>1️⃣ 客人點餐 → 拿號碼牌 🎫</p>
              <p>2️⃣ 客人去座位滑手機</p>
              <p>3️⃣ 廣播叫號 → 拿著牌去換</p>
            </div>
            <p class="mt-3 text-center text-xs text-emerald-300">→ 大家都不用乾等</p>
          </div>
        </div>

        <p class="max-w-2xl text-center text-sm text-slate-400">網路請求要等好幾秒，JavaScript 不可能傻傻等。<strong class="text-white">所有網路請求都是非同步的</strong>。</p>
      </div>
    </div>

    <!-- ===== Step 2: Promise Pending Demo ===== -->
    <div v-else-if="stepData.view === 'promise-pending-demo'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">先不管 fetch 是什麼，印出來看看</h2>

        <div class="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <div class="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <span class="h-2 w-2 rounded-full bg-rose-500"></span>
            <span class="h-2 w-2 rounded-full bg-amber-500"></span>
            <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span class="ml-2">terminal</span>
          </div>
          <pre class="text-xs md:text-sm text-slate-300"><code><span class="text-slate-500">// 寫一行</span>
const result = fetch(<span class="text-amber-300">'https://api.example.com/users'</span>);
console.log(result);
</code></pre>
          <div class="mt-3 border-t border-slate-700 pt-3">
            <p class="text-xs text-slate-500 mb-1">⬇️ 印出</p>
            <pre class="rounded-lg border border-rose-500/40 bg-rose-500/5 px-4 py-3 text-xs md:text-sm text-rose-300 animate-value-appear"><code>Promise { &lt;pending&gt; }</code></pre>
          </div>
        </div>

        <div class="rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-3 text-center text-sm text-amber-300">
          🤔 這是什麼？資料呢？
        </div>
      </div>
    </div>

    <!-- ===== Step 3: Promise + await (合併) ===== -->
    <div v-else-if="stepData.view === 'await-open'" class="slide-page">
      <div class="wm">📦 + await</div>
      <div class="flex flex-col items-center gap-5">
        <h2 class="text-xl font-bold text-white md:text-2xl">Promise = 盒子，await = 打開盒子</h2>

        <!-- 盒子比喻 -->
        <div class="flex items-center gap-4 max-w-3xl">
          <div class="rounded-xl border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-center">
            <p class="text-3xl">📦</p>
            <p class="mt-1 text-xs font-bold text-amber-300">pending</p>
            <p class="text-xs text-slate-400">還沒好</p>
          </div>
          <div class="text-2xl text-slate-500">+</div>
          <div class="rounded-lg bg-sky-500/20 px-4 py-2 text-base font-bold text-sky-300">await</div>
          <div class="text-2xl text-slate-500">=</div>
          <div class="rounded-xl border border-emerald-500/40 bg-emerald-500/5 px-4 py-3 text-center">
            <p class="text-3xl">📤</p>
            <p class="mt-1 text-xs font-bold text-emerald-300">真的資料</p>
            <p class="text-xs text-slate-400">拿到了</p>
          </div>
        </div>

        <!-- code 對比 -->
        <div class="w-full max-w-3xl space-y-3">
          <div class="rounded-2xl border-2 border-rose-500/40 bg-rose-500/5 p-4">
            <p class="text-xs text-rose-300 mb-2 font-bold">❌ 沒加 await</p>
            <pre class="text-xs md:text-sm text-slate-300"><code>const result = fetch(<span class="text-amber-300">'...'</span>);
console.log(result); <span class="text-slate-500">// Promise { &lt;pending&gt; }  ← 還沒好</span></code></pre>
          </div>

          <div class="text-center text-2xl text-slate-500">⬇️</div>

          <div class="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-4 animate-value-appear">
            <p class="text-xs text-emerald-300 mb-2 font-bold">✅ 加了 await（會等到資料好才繼續）</p>
            <pre class="text-xs md:text-sm text-slate-300"><code>const result = <span class="text-sky-300 font-bold">await</span> fetch(<span class="text-amber-300">'...'</span>);
console.log(result); <span class="text-slate-500">// Response { ... }  ← 真的資料</span></code></pre>
          </div>
        </div>

        <p class="max-w-xl text-center text-sm text-slate-400">你不用懂盒子怎麼運作 — 只要記得「碰到 Promise 就用 await 打開」。</p>
      </div>
    </div>

    <!-- ===== Step 5: Async Tag ===== -->
    <div v-else-if="stepData.view === 'async-tag'" class="slide-page">
      <div class="wm">async</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">async — 給函式掛上「會等」的招牌</h2>

        <div class="w-full max-w-2xl rounded-2xl border-2 border-rose-500/40 bg-rose-500/5 p-4">
          <p class="text-xs text-rose-300 mb-2 font-bold">❌ 沒掛 async 招牌就用 await</p>
          <pre class="text-xs md:text-sm text-slate-300"><code>function getUsers() {
  const result = <span class="text-rose-300">await</span> fetch(<span class="text-amber-300">'...'</span>);
}
<span class="text-rose-300">// SyntaxError: await is only valid in async functions</span></code></pre>
        </div>

        <div class="text-center text-2xl text-slate-500">⬇️</div>

        <div class="w-full max-w-2xl rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-4 animate-value-appear">
          <p class="text-xs text-emerald-300 mb-2 font-bold">✅ 加上 async 招牌</p>
          <pre class="text-xs md:text-sm text-slate-300"><code><span class="text-sky-300 font-bold">async</span> function getUsers() {
  const result = <span class="text-sky-300 font-bold">await</span> fetch(<span class="text-amber-300">'...'</span>);
}</code></pre>
        </div>

        <div class="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 max-w-xl">
          <p class="text-sm text-slate-300">📌 規則很簡單：<strong class="text-white">函式裡有 await，函式前面就要加 async</strong>。不解釋為什麼，先當文法規則記。</p>
        </div>
      </div>
    </div>

    <!-- ===== Step 6: Fetch Three Steps ===== -->
    <div v-else-if="stepData.view === 'fetch-three-steps'" class="slide-page">
      <div class="wm">GET</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">fetch GET 三步驟</h2>

        <div class="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <pre class="text-xs md:text-sm text-slate-300"><code><span class="text-sky-300">async</span> function getUsers() {
  <span class="text-slate-500">// 1️⃣ 等 fetch 拿到 response</span>
  const response = <span class="text-sky-300">await</span> fetch(<span class="text-amber-300">'https://jsonplaceholder.typicode.com/users'</span>);

  <span class="text-slate-500">// 2️⃣ 等 .json() 把 response 解析成資料</span>
  const data = <span class="text-sky-300">await</span> response.json();

  <span class="text-slate-500">// 3️⃣ 把資料 return 出去</span>
  <span class="text-purple-300">return</span> data;
}</code></pre>
        </div>

        <div class="grid w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-3">
          <div class="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 text-center animate-value-appear">
            <p class="text-2xl">1️⃣</p>
            <p class="mt-2 text-sm font-bold text-white">await fetch</p>
            <p class="mt-1 text-xs text-slate-400">等 server 回應</p>
          </div>
          <div class="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 text-center animate-value-appear" style="animation-delay: 0.15s">
            <p class="text-2xl">2️⃣</p>
            <p class="mt-2 text-sm font-bold text-white">await response.json()</p>
            <p class="mt-1 text-xs text-slate-400">等解析成資料</p>
          </div>
          <div class="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 text-center animate-value-appear" style="animation-delay: 0.3s">
            <p class="text-2xl">3️⃣</p>
            <p class="mt-2 text-sm font-bold text-white">return data</p>
            <p class="mt-1 text-xs text-slate-400">交給呼叫端</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 7: Trap 1 — JSON also needs await ===== -->
    <div v-else-if="stepData.view === 'trap-1-json'" class="slide-page">
      <div class="wm">⚠️</div>
      <div class="flex flex-col items-center gap-6">
        <div class="rounded-full bg-rose-500/10 px-5 py-2 text-sm font-bold text-rose-300 border border-rose-500/30">⚠️ 第一個坑</div>
        <h2 class="text-xl font-bold text-white md:text-2xl">response.json() <span class="text-rose-300">也要 await</span></h2>

        <div class="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          <div class="rounded-2xl border-2 border-rose-500/40 bg-rose-500/5 p-4">
            <p class="text-xs text-rose-300 mb-2 font-bold">❌ 漏 await</p>
            <pre class="text-xs text-slate-300"><code>const response = await fetch(<span class="text-amber-300">'...'</span>);
const data = response.json(); <span class="text-rose-300">// ← 漏</span>
return data;</code></pre>
            <div class="mt-3 rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              印出來是 <code>Promise { &lt;pending&gt; }</code>
            </div>
          </div>
          <div class="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-4">
            <p class="text-xs text-emerald-300 mb-2 font-bold">✅ 兩個都加</p>
            <pre class="text-xs text-slate-300"><code>const response = await fetch(<span class="text-amber-300">'...'</span>);
const data = <span class="text-sky-300 font-bold">await</span> response.json();
return data;</code></pre>
            <div class="mt-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
              拿到真的資料 ✅
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 max-w-2xl">
          <p class="text-sm text-slate-300">為什麼？因為「把 response 解析成 JSON」這個動作<strong class="text-white">也是非同步</strong>。它也回傳一個 Promise，所以也要 await 打開。</p>
        </div>
        <p class="text-center text-xs text-amber-300 italic">💡 記法：fetch 跟 json 兩兄弟，一個都不能少 await</p>
      </div>
    </div>

    <!-- ===== Step 8: Trap 2 — Function must return ===== -->
    <div v-else-if="stepData.view === 'trap-2-return'" class="slide-page">
      <div class="wm">⚠️</div>
      <div class="flex flex-col items-center gap-6">
        <div class="rounded-full bg-rose-500/10 px-5 py-2 text-sm font-bold text-rose-300 border border-rose-500/30">⚠️ 第二個坑</div>
        <h2 class="text-xl font-bold text-white md:text-2xl">函式要 <span class="text-rose-300">return</span></h2>
        <p class="text-sm text-slate-400">（這是 day3 的舊觀念，到 day6 還是一樣重要）</p>

        <div class="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          <div class="rounded-2xl border-2 border-rose-500/40 bg-rose-500/5 p-4">
            <p class="text-xs text-rose-300 mb-2 font-bold">❌ 沒 return</p>
            <pre class="text-xs text-slate-300"><code>async function getUsers() {
  const data = await response.json();
  console.log(data); <span class="text-slate-500">// 印得出來</span>
}
const users = await getUsers();
console.log(users); <span class="text-rose-300">// undefined 😱</span></code></pre>
          </div>
          <div class="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-4">
            <p class="text-xs text-emerald-300 mb-2 font-bold">✅ 有 return</p>
            <pre class="text-xs text-slate-300"><code>async function getUsers() {
  const data = await response.json();
  <span class="text-purple-300 font-bold">return</span> data;
}
const users = await getUsers();
console.log(users); <span class="text-emerald-300">// 真的資料 ✅</span></code></pre>
          </div>
        </div>

        <div class="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 max-w-2xl text-sm text-slate-300">
          📌 console.log 只是「印給你看」，沒有把資料帶出函式。要把資料給外面用，<strong class="text-white">必須 return</strong>。
        </div>
      </div>
    </div>

    <!-- ===== Step 9: Response Anatomy ===== -->
    <div v-else-if="stepData.view === 'response-anatomy'" class="slide-page">
      <div class="wm">res</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">response 物件裡到底有什麼？</h2>

        <div class="w-full max-w-2xl rounded-2xl border-2 border-sky-500/40 bg-sky-500/5 p-5">
          <p class="text-center text-xs text-sky-300 mb-3 font-bold">📦 response 物件</p>
          <div class="space-y-2">
            <div class="flex items-center gap-3 rounded-lg bg-slate-900/60 px-4 py-2 animate-value-appear">
              <code class="text-emerald-300 text-sm">.status</code>
              <span class="text-xs text-slate-400 ml-auto">200 / 404 / 500 ...</span>
            </div>
            <div class="flex items-center gap-3 rounded-lg bg-slate-900/60 px-4 py-2 animate-value-appear" style="animation-delay: 0.1s">
              <code class="text-emerald-300 text-sm">.ok</code>
              <span class="text-xs text-slate-400 ml-auto">2xx 是 true，其他 false</span>
            </div>
            <div class="flex items-center gap-3 rounded-lg bg-slate-900/60 px-4 py-2 animate-value-appear" style="animation-delay: 0.2s">
              <code class="text-emerald-300 text-sm">.statusText</code>
              <span class="text-xs text-slate-400 ml-auto">'OK' / 'Not Found'</span>
            </div>
            <div class="flex items-center gap-3 rounded-lg bg-slate-900/60 px-4 py-2 animate-value-appear" style="animation-delay: 0.3s">
              <code class="text-emerald-300 text-sm">.headers</code>
              <span class="text-xs text-slate-400 ml-auto">回應的 headers 資訊</span>
            </div>
            <div class="flex items-center gap-3 rounded-lg bg-slate-900/60 px-4 py-2 animate-value-appear" style="animation-delay: 0.4s">
              <code class="text-emerald-300 text-sm">.json()</code>
              <span class="text-xs text-slate-400 ml-auto">解析成 JSON（要 await）</span>
            </div>
          </div>
        </div>

        <p class="max-w-xl text-center text-sm text-slate-400">最常用的是 <code class="text-emerald-300">.ok</code> 跟 <code class="text-emerald-300">.json()</code>。下一份簡報的錯誤處理會用到 <code class="text-emerald-300">.ok</code>。</p>
      </div>
    </div>

    <!-- ===== Step 10: Array Bridge ===== -->
    <div v-else-if="stepData.view === 'array-bridge'" class="slide-page">
      <div class="wm">day5</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">前一堂教的東西現在用得上</h2>

        <div class="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <pre class="text-xs md:text-sm text-slate-300"><code><span class="text-sky-300">async</span> function showAllUserNames() {
  const users = <span class="text-sky-300">await</span> getUsers();

  <span class="text-slate-500">// 用 day5 的 map 把每筆轉成想要的格式</span>
  const lines = users.map(<span class="text-sky-300">function</span>(user) {
    <span class="text-purple-300">return</span> <span class="text-amber-300">`${user.name} - ${user.email}`</span>;
  });
  console.log(lines);
}</code></pre>
        </div>

        <div class="flex items-center gap-3 text-sm">
          <div class="rounded-full bg-sky-500/20 px-4 py-2 font-bold text-sky-300">fetch 把資料拉回來</div>
          <span class="text-slate-500">+</span>
          <div class="rounded-full bg-emerald-500/20 px-4 py-2 font-bold text-emerald-300">map / filter / find</div>
        </div>

        <p class="max-w-xl text-center text-sm text-slate-400">fetch 拉回來就是普通陣列，剩下的就是你已經會的東西。</p>
      </div>
    </div>

    <!-- ===== Step 11: Quiz Await ===== -->
    <div v-else-if="stepData.view === 'quiz-await'" class="slide-page">
      <div class="wm">QUIZ</div>
      <div class="flex flex-col items-center gap-6">
        <div class="rounded-full bg-amber-500/10 px-5 py-2 text-sm font-bold text-amber-300 border border-amber-500/30">🎯 找出 BUG</div>
        <h2 class="text-base font-bold text-white md:text-xl">哪一段 code 會印出 <code class="text-rose-300">Promise { &lt;pending&gt; }</code>？</h2>

        <div class="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          <button @click="answerQuiz('await', 'A', 'B', '', '再看一次：A 兩個 await 都有，跑起來是正常的')" class="rounded-2xl border-2 border-sky-500/40 bg-sky-500/5 p-4 text-left transition-all hover:border-sky-400 hover:bg-sky-500/10 active:scale-95">
            <p class="text-xs text-sky-300 mb-2 font-bold">A</p>
            <pre class="text-xs text-slate-300"><code>async function getUsers() {
  const response = await fetch(<span class="text-amber-300">'...'</span>);
  const data = await response.json();
  return data;
}</code></pre>
          </button>
          <button @click="answerQuiz('await', 'B', 'B', '對！B 漏了 response.json() 前面的 await，所以 data 是個還沒打開的 Promise', '')" class="rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 p-4 text-left transition-all hover:border-amber-400 hover:bg-amber-500/10 active:scale-95">
            <p class="text-xs text-amber-300 mb-2 font-bold">B</p>
            <pre class="text-xs text-slate-300"><code>async function getUsers() {
  const response = await fetch(<span class="text-amber-300">'...'</span>);
  const data = response.json();
  return data;
}</code></pre>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Step 12: Summary ===== -->
    <div v-else-if="stepData.view === 'summary'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">END</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/proud.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-sky-400 object-cover shadow-xl shadow-sky-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-sky-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">你會 fetch GET 了 🎉</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">只要記住三件事：</p>
          <ul class="mb-3 space-y-1 text-sm text-white md:text-base">
            <li>1. fetch + json 兩兄弟，<strong class="text-sky-300">都要 await</strong></li>
            <li>2. 函式裡有 await，前面要加 <strong class="text-sky-300">async</strong></li>
            <li>3. 函式要 <strong class="text-purple-300">return</strong>，外面才拿得到</li>
          </ul>
          <p class="text-xs text-slate-500 italic">「下一站接 LiveJS 真實電商 API。」—— 海姐</p>
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
@keyframes valueAppear {
  0% { opacity: 0; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-value-appear {
  animation: valueAppear 0.5s ease-out both;
}
</style>
