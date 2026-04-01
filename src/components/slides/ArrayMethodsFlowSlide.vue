<script setup lang="ts">
/**
 * 陣列方法執行流程解析
 * 用「逐幀慢動作重播」的方式，讓學生看懂 find / filter / some / map / reduce 的 callback 運作原理
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

// ── Step 定義 ──
type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  // 開場
  { id: 0,  view: 'welcome',         title: '歡迎',                 desc: '海姐帶你看懂陣列方法' },

  // ── find() ──
  { id: 1,  view: 'find-title',      title: '第一個方法',           desc: 'find() 登場' },
  { id: 2,  view: 'find-intro',      title: 'find() 準備執行',      desc: '找到第一筆符合條件的' },
  { id: 3,  view: 'find-loop-0',     title: 'find() 第一圈',        desc: 'Index 0：小華' },
  { id: 4,  view: 'find-loop-1',     title: 'find() 第二圈',        desc: 'Index 1：小美' },
  { id: 5,  view: 'find-loop-2',     title: 'find() 第三圈',        desc: 'Index 2：小明（跳過）' },
  { id: 6,  view: 'find-result',     title: 'find() 回傳結果',      desc: '拿到什麼？' },
  { id: 7,  view: 'find-qa-1',       title: 'find() Q&A (1/2)',     desc: '跑了幾筆？' },
  { id: 8,  view: 'find-qa-2',       title: 'find() Q&A (2/2)',     desc: '找不到呢？' },

  // ── filter() ──
  { id: 9,  view: 'filter-title',    title: '第二個方法',           desc: 'filter() 登場' },
  { id: 10, view: 'filter-intro',    title: 'filter() 準備執行',    desc: '篩出所有符合條件的' },
  { id: 11, view: 'filter-loop-0',   title: 'filter() 第一圈',      desc: 'Index 0：小華' },
  { id: 12, view: 'filter-loop-1',   title: 'filter() 第二圈',      desc: 'Index 1：小美' },
  { id: 13, view: 'filter-loop-2',   title: 'filter() 第三圈',      desc: 'Index 2：小明' },
  { id: 14, view: 'filter-result',   title: 'filter() 結果',        desc: '回傳新陣列' },
  { id: 15, view: 'filter-vs-find',  title: 'filter vs find',       desc: '兩兄弟比一比' },

  // ── some() ──
  { id: 16, view: 'some-title',      title: '第三個方法',           desc: 'some() 登場' },
  { id: 17, view: 'some-intro',      title: 'some() 準備執行',      desc: '問「有沒有」符合的' },
  { id: 18, view: 'some-loop-0',     title: 'some() 第一圈',        desc: 'Index 0：小華' },
  { id: 19, view: 'some-loop-1',     title: 'some() 第二圈',        desc: 'Index 1：小美' },
  { id: 20, view: 'some-loop-2',     title: 'some() 第三圈',        desc: 'Index 2：小明' },
  { id: 21, view: 'some-qa-1',       title: 'some() Q&A (1/2)',     desc: '跟 find 差在哪？' },
  { id: 22, view: 'some-qa-2',       title: 'some() Q&A (2/2)',     desc: '全部都 false 呢？' },

  // ── map() ──
  { id: 23, view: 'map-title',       title: '第四個方法',           desc: 'map() 登場' },
  { id: 24, view: 'map-intro',       title: 'map() 準備執行',       desc: '每一筆都加工' },
  { id: 25, view: 'map-loop-0',      title: 'map() 第一圈',         desc: 'Index 0：100' },
  { id: 26, view: 'map-loop-1',      title: 'map() 第二圈',         desc: 'Index 1：200' },
  { id: 27, view: 'map-loop-2',      title: 'map() 第三圈',         desc: 'Index 2：300' },
  { id: 28, view: 'map-loop-3',      title: 'map() 第四圈',         desc: 'Index 3：500' },
  { id: 29, view: 'map-result',      title: 'map() 結果',           desc: '新陣列 vs 原陣列' },
  { id: 30, view: 'map-vs-filter',   title: 'map vs filter',        desc: '加工 vs 挑選' },

  // ── reduce() ──
  { id: 31, view: 'reduce-title',    title: '第五個方法',           desc: 'reduce() 登場' },
  { id: 32, view: 'reduce-intro',    title: 'reduce() 準備執行',    desc: '把一整個陣列濃縮成一個值' },
  { id: 33, view: 'reduce-loop-0',   title: 'reduce() 第一圈',      desc: '白T' },
  { id: 34, view: 'reduce-loop-1',   title: 'reduce() 第二圈',      desc: '帆布鞋' },
  { id: 35, view: 'reduce-loop-2',   title: 'reduce() 第三圈',      desc: '外套' },
  { id: 36, view: 'reduce-tracker',  title: 'reduce() 累加器追蹤',  desc: '每一圈的 acc 變化' },
  { id: 37, view: 'reduce-qa-1',     title: 'reduce() Q&A (1/2)',   desc: '初始值忘了給？' },
  { id: 38, view: 'reduce-qa-2',     title: 'reduce() Q&A (2/2)',   desc: '最後回傳什麼？' },

  // ── 總結 ──
  { id: 39, view: 'summary-guide',   title: '方法選擇指南',         desc: '用一句話判斷' },
  { id: 40, view: 'summary-chain',   title: '方法串接',             desc: '組合技' },
  { id: 41, view: 'summary-end',     title: '課程結束',             desc: '海姐的結語' },
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

// Reset feedback on step change
watch(() => stepData.value.view, () => {
  feedback.value = ''
  feedbackType.value = 'neutral'
})

// ── Navigation ──
const canGoNext = computed(() => true)
const nextStepHint = computed(() => '')

function nextStep() { if (currentStep.value < STEPS.length - 1) currentStep.value++ }
function prevStep() { if (currentStep.value > 0) currentStep.value-- }
function gotoStep(step: number) { if (step >= 0 && step < STEPS.length) currentStep.value = step }

// ── 共用資料 ──
const students = [
  { name: '小華', score: 80 },
  { name: '小美', score: 92 },
  { name: '小明', score: 45 },
]

const prices = [100, 200, 300, 500]

const carts = [
  { name: '白T', price: 399, qty: 2 },
  { name: '帆布鞋', price: 1299, qty: 1 },
  { name: '外套', price: 1599, qty: 1 },
]

// ── Card Status helpers ──
// 0: default, 1: active(blue), 2: success(green), 3: fail(gray), 4: skipped(dashed)
type CardStatus = 0 | 1 | 2 | 3 | 4

function cardClass(status: CardStatus) {
  switch (status) {
    case 1: return 'arr-card--active'
    case 2: return 'arr-card--success'
    case 3: return 'arr-card--fail'
    case 4: return 'arr-card--skipped'
    default: return 'arr-card--default'
  }
}

function statusIcon(status: CardStatus) {
  switch (status) {
    case 1: return '🔍'
    case 2: return '✅'
    case 3: return '❌'
    case 4: return '⏭️'
    default: return ''
  }
}

// ── filter 結果累積 ──
const filterCollected = computed<typeof students>(() => {
  const v = stepData.value.view
  if (v === 'filter-loop-0') return []
  if (v === 'filter-loop-1') return [students[0]]
  if (v === 'filter-loop-2') return [students[0], students[1]]
  if (v === 'filter-result' || v === 'filter-vs-find') return [students[0], students[1]]
  return []
})

// ── map 結果累積 ──
const mapCollected = computed<number[]>(() => {
  const v = stepData.value.view
  if (v === 'map-loop-0') return []
  if (v === 'map-loop-1') return [80]
  if (v === 'map-loop-2') return [80, 160]
  if (v === 'map-loop-3') return [80, 160, 240]
  if (v === 'map-result' || v === 'map-vs-filter') return [80, 160, 240, 400]
  return []
})
</script>

<template>
  <InteractiveSlideTemplate
    title="陣列方法執行流程"
    subtitle="逐幀慢動作重播"
    icon="🔬"
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

    <!-- ╔══════════════════════════════════════╗ -->
    <!-- ║           WELCOME                     ║ -->
    <!-- ╚══════════════════════════════════════╝ -->
    <div v-if="stepData.view === 'welcome'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">[ ]</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-sky-400 object-cover shadow-xl shadow-sky-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-sky-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">嗨，我是<strong class="text-sky-300">海姐</strong> 👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">上一堂學了怎麼「裝資料」，這一堂要學怎麼從一整箱資料裡面<strong class="text-white">找東西、篩選、加工</strong>。</p>
          <p class="mb-3 text-sm leading-relaxed text-slate-300 md:text-base">我會用<strong class="text-sky-300">慢動作重播</strong>帶你看每個方法到底怎麼運作，一圈一圈拆給你看。</p>
          <p class="text-xs text-slate-500 italic">「看懂每一步，寫程式就不會矇了。」—— 海姐</p>
        </div>
      </div>
      <button @click="nextStep()" class="btn-action animate-bounce">
        開始 →
      </button>
    </div>

    <!-- ╔══════════════════════════════════════╗ -->
    <!-- ║      SECTION TITLE PAGES              ║ -->
    <!-- ╚══════════════════════════════════════╝ -->

    <!-- find-title -->
    <div v-else-if="stepData.view === 'find-title'" class="slide-page flex flex-col items-center justify-center gap-6">
      <div class="wm">find</div>
      <div class="section-title-icon">🔍</div>
      <h2 class="section-title">find()</h2>
      <p class="section-subtitle">從陣列中找到<strong class="text-blue-300">第一筆</strong>符合條件的資料</p>
      <div class="section-meta">
        <span class="section-meta__tag section-meta__tag--blue">回傳：一筆資料（物件）</span>
        <span class="section-meta__tag section-meta__tag--blue">找到就停</span>
      </div>
    </div>

    <!-- filter-title -->
    <div v-else-if="stepData.view === 'filter-title'" class="slide-page flex flex-col items-center justify-center gap-6">
      <div class="wm">filter</div>
      <div class="section-title-icon">📋</div>
      <h2 class="section-title">filter()</h2>
      <p class="section-subtitle">從陣列中篩出<strong class="text-emerald-300">所有</strong>符合條件的資料</p>
      <div class="section-meta">
        <span class="section-meta__tag section-meta__tag--green">回傳：新陣列</span>
        <span class="section-meta__tag section-meta__tag--green">全部跑完</span>
      </div>
    </div>

    <!-- some-title -->
    <div v-else-if="stepData.view === 'some-title'" class="slide-page flex flex-col items-center justify-center gap-6">
      <div class="wm">some</div>
      <div class="section-title-icon">❓</div>
      <h2 class="section-title">some()</h2>
      <p class="section-subtitle">問陣列：<strong class="text-amber-300">有沒有</strong>任何一筆符合條件？</p>
      <div class="section-meta">
        <span class="section-meta__tag section-meta__tag--amber">回傳：true / false</span>
        <span class="section-meta__tag section-meta__tag--amber">找到就停</span>
      </div>
    </div>

    <!-- map-title -->
    <div v-else-if="stepData.view === 'map-title'" class="slide-page flex flex-col items-center justify-center gap-6">
      <div class="wm">map</div>
      <div class="section-title-icon">🔧</div>
      <h2 class="section-title">map()</h2>
      <p class="section-subtitle">把陣列裡<strong class="text-purple-300">每一筆</strong>都做相同的加工</p>
      <div class="section-meta">
        <span class="section-meta__tag section-meta__tag--purple">回傳：新陣列（長度不變）</span>
        <span class="section-meta__tag section-meta__tag--purple">全部跑完</span>
      </div>
    </div>

    <!-- reduce-title -->
    <div v-else-if="stepData.view === 'reduce-title'" class="slide-page flex flex-col items-center justify-center gap-6">
      <div class="wm">reduce</div>
      <div class="section-title-icon">🧮</div>
      <h2 class="section-title">reduce()</h2>
      <p class="section-subtitle">把<strong class="text-rose-300">整個陣列</strong>濃縮成一個值</p>
      <div class="section-meta">
        <span class="section-meta__tag section-meta__tag--rose">回傳：任何東西（數字、物件…）</span>
        <span class="section-meta__tag section-meta__tag--rose">全部跑完</span>
      </div>
    </div>

    <!-- ╔══════════════════════════════════════╗ -->
    <!-- ║           FIND()                      ║ -->
    <!-- ╚══════════════════════════════════════╝ -->

    <!-- find-intro：展示初始資料 + 要執行的程式碼 -->
    <div v-else-if="stepData.view === 'find-intro'" class="slide-page">
      <div class="wm">find</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-blue-500/20 text-blue-300">find()</div>
        <h2 class="text-center text-xl font-bold text-white">準備執行 find()</h2>
        <!-- 初始資料 -->
        <div class="data-source">
          <span class="data-source__label">📦 初始資料</span>
          <div class="code-block code-block--compact">
            <pre><code><span class="text-slate-400">const</span> students = [
  { name: <span class="text-amber-300">'小華'</span>, score: <span class="text-amber-300">80</span> },
  { name: <span class="text-amber-300">'小美'</span>, score: <span class="text-amber-300">92</span> },
  { name: <span class="text-amber-300">'小明'</span>, score: <span class="text-amber-300">45</span> }
];</code></pre>
          </div>
        </div>
        <!-- 要執行的程式碼 -->
        <div class="code-block">
          <pre><code><span class="text-slate-400">const</span> result = students.<span class="text-blue-300">find</span>(<span class="text-slate-400">function</span>(<span class="text-amber-300">student</span>) {
  <span class="text-slate-400">return</span> student.name === <span class="text-emerald-300">'小美'</span>;
});</code></pre>
        </div>
        <!-- 陣列卡片 -->
        <div class="card-row">
          <div v-for="(s, i) in students" :key="i" :class="['arr-card', 'arr-card--default']">
            <span class="arr-card__index">Index {{ i }}</span>
            <span class="arr-card__name">{{ s.name }}</span>
            <span class="arr-card__detail">Score: {{ s.score }}</span>
          </div>
        </div>
        <div class="explain-box">
          <p>🎬 find() 準備開始工作！它會自動幫我們建立一個隱藏的迴圈，把陣列裡面的資料<strong class="text-white">一筆一筆倒出來</strong>，餵給我們的 callback function。</p>
        </div>
      </div>
    </div>

    <!-- find-loop-0 -->
    <div v-else-if="stepData.view === 'find-loop-0'" class="slide-page">
      <div class="wm">find</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-blue-500/20 text-blue-300">find() — 第一圈</div>
        <div class="code-block">
          <pre><code><span class="text-slate-500">// 傳入的 student:</span> { name: <span class="text-amber-300">'小華'</span>, score: <span class="text-amber-300">80</span> }
<span class="text-slate-400">return</span> <span class="text-amber-300">'小華'</span> === <span class="text-emerald-300">'小美'</span>; <span class="text-slate-500">// 結果: false</span></code></pre>
          <div class="callback-badge callback-badge--false">Return: false</div>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(1)]">
            <span class="arr-card__icon">{{ statusIcon(1) }}</span>
            <span class="arr-card__index">Index 0</span>
            <span class="arr-card__name">小華</span>
            <span class="arr-card__detail">Score: 80</span>
            <span class="arr-card__checking">檢查中...</span>
          </div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__index">Index 1</span><span class="arr-card__name">小美</span><span class="arr-card__detail">Score: 92</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__index">Index 2</span><span class="arr-card__name">小明</span><span class="arr-card__detail">Score: 45</span></div>
        </div>
        <div class="explain-box">
          <p>🔍 檢查第一筆資料「小華」。<br/>callback 判斷結果為 <strong class="text-rose-300">false</strong>。這代表這不是我們要找的人，find() 會繼續往下找下一筆！</p>
        </div>
      </div>
    </div>

    <!-- find-loop-1 -->
    <div v-else-if="stepData.view === 'find-loop-1'" class="slide-page">
      <div class="wm">find</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-blue-500/20 text-blue-300">find() — 第二圈</div>
        <div class="code-block">
          <pre><code><span class="text-slate-500">// 傳入的 student:</span> { name: <span class="text-amber-300">'小美'</span>, score: <span class="text-amber-300">92</span> }
<span class="text-slate-400">return</span> <span class="text-amber-300">'小美'</span> === <span class="text-emerald-300">'小美'</span>; <span class="text-slate-500">// 結果: true</span></code></pre>
          <div class="callback-badge callback-badge--true">Return: true</div>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(3)]"><span class="arr-card__icon">{{ statusIcon(3) }}</span><span class="arr-card__index">Index 0</span><span class="arr-card__name">小華</span><span class="arr-card__detail">Score: 80</span></div>
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">{{ statusIcon(2) }}</span><span class="arr-card__index">Index 1</span><span class="arr-card__name">小美</span><span class="arr-card__detail">Score: 92</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__index">Index 2</span><span class="arr-card__name">小明</span><span class="arr-card__detail">Score: 45</span></div>
        </div>
        <div class="explain-box">
          <p>🎯 檢查第二筆資料「小美」。<br/>callback 判斷結果為 <strong class="text-emerald-300">true</strong>！find() 發現找到了，立刻「緊急煞車」中斷迴圈！</p>
        </div>
      </div>
    </div>

    <!-- find-loop-2 (skipped) -->
    <div v-else-if="stepData.view === 'find-loop-2'" class="slide-page">
      <div class="wm">find</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-blue-500/20 text-blue-300">find() — 第三圈</div>
        <div class="code-block">
          <pre><code><span class="text-slate-500">// 迴圈已中斷，不會執行到這裡</span></code></pre>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(3)]"><span class="arr-card__icon">{{ statusIcon(3) }}</span><span class="arr-card__index">Index 0</span><span class="arr-card__name">小華</span><span class="arr-card__detail">Score: 80</span></div>
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">{{ statusIcon(2) }}</span><span class="arr-card__index">Index 1</span><span class="arr-card__name">小美</span><span class="arr-card__detail">Score: 92</span></div>
          <div :class="['arr-card', cardClass(4)]"><span class="arr-card__icon">{{ statusIcon(4) }}</span><span class="arr-card__index">Index 2</span><span class="arr-card__name">小明</span><span class="arr-card__detail">Score: 45</span></div>
        </div>
        <div class="explain-box">
          <p>⏭️ 第三筆資料「小明」<strong class="text-white">完全不會執行到</strong>！因為第二圈已經找到了，find() 為了節省效能，直接略過後面的資料。</p>
        </div>
      </div>
    </div>

    <!-- find-result：明確顯示回傳物件 -->
    <div v-else-if="stepData.view === 'find-result'" class="slide-page">
      <div class="wm">find</div>
      <div class="flex flex-col items-center gap-6">
        <div class="method-badge bg-blue-500/20 text-blue-300">find() 回傳結果</div>
        <h2 class="text-xl font-bold text-white">find() 回傳了什麼？</h2>
        <div class="code-block max-w-2xl">
          <pre><code>console.<span class="text-blue-300">log</span>(result);

<span class="text-slate-500">// 回傳：當下正在檢查的「那一整筆資料」</span>
<span class="text-emerald-300">{ name: '小美', score: 92 }</span></code></pre>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__name">小華</span><span class="arr-card__detail">Score: 80</span></div>
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__name">小美</span><span class="arr-card__detail">Score: 92</span><span class="arr-card__highlight">← result</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__name">小明</span><span class="arr-card__detail">Score: 45</span></div>
        </div>
        <div class="explain-box max-w-2xl">
          <p>👉 find() 回傳的是 callback return true 時，<strong class="text-white">正在檢查的那一整筆資料（物件）</strong>。<br/>所以 <code class="code-inline">result</code> 就是 <code class="code-inline">{ name: '小美', score: 92 }</code>，不是 true，也不是 index。</p>
        </div>
      </div>
    </div>

    <!-- find-qa-1 -->
    <div v-else-if="stepData.view === 'find-qa-1'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="method-badge bg-violet-500/20 text-violet-300">💡 find() Q&A</div>
        <h2 class="text-xl font-bold text-white">這個陣列到底跑了幾筆？</h2>
        <div class="card-row">
          <div :class="['arr-card', cardClass(3)]"><span class="arr-card__icon">❌</span><span class="arr-card__name">小華</span><span class="arr-card__detail">第 1 圈</span></div>
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__name">小美</span><span class="arr-card__detail">第 2 圈 → 停！</span></div>
          <div :class="['arr-card', cardClass(4)]"><span class="arr-card__icon">⏭️</span><span class="arr-card__name">小明</span><span class="arr-card__detail">沒跑到</span></div>
        </div>
        <div class="explain-box max-w-2xl">
          <p>👉 答案：只跑了 <strong class="text-white">2 筆</strong>。<br/>因為在第二筆就找到了（回傳了 true），find() 就立刻收工了。這跟等一下要學的 filter() 必須全部跑完很不一樣喔！</p>
        </div>
      </div>
    </div>

    <!-- find-qa-2 -->
    <div v-else-if="stepData.view === 'find-qa-2'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="method-badge bg-violet-500/20 text-violet-300">💡 find() Q&A</div>
        <h2 class="text-xl font-bold text-white">如果全部都 false 呢？</h2>
        <div class="code-block max-w-xl">
          <pre><code><span class="text-slate-400">const</span> result = students.<span class="text-blue-300">find</span>(<span class="text-slate-400">function</span>(<span class="text-amber-300">student</span>) {
  <span class="text-slate-400">return</span> student.name === <span class="text-emerald-300">'阿呆'</span>;
});

console.<span class="text-blue-300">log</span>(result); <span class="text-slate-500">// undefined</span></code></pre>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(3)]"><span class="arr-card__icon">❌</span><span class="arr-card__name">小華</span></div>
          <div :class="['arr-card', cardClass(3)]"><span class="arr-card__icon">❌</span><span class="arr-card__name">小美</span></div>
          <div :class="['arr-card', cardClass(3)]"><span class="arr-card__icon">❌</span><span class="arr-card__name">小明</span></div>
        </div>
        <div class="explain-box max-w-2xl">
          <p>👉 全部跑完都沒有 return true，find() 就回傳 <strong class="text-amber-300">undefined</strong>。<br/>不是空陣列 <code class="code-inline">[]</code>、不是 null、不是 false，是 <strong class="text-amber-300">undefined</strong>。</p>
        </div>
      </div>
    </div>

    <!-- ╔══════════════════════════════════════╗ -->
    <!-- ║          FILTER()                     ║ -->
    <!-- ╚══════════════════════════════════════╝ -->

    <!-- filter-intro：初始資料 + 程式碼 -->
    <div v-else-if="stepData.view === 'filter-intro'" class="slide-page">
      <div class="wm">filter</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-emerald-500/20 text-emerald-300">filter()</div>
        <h2 class="text-center text-xl font-bold text-white">準備執行 filter()</h2>
        <div class="data-source">
          <span class="data-source__label">📦 初始資料</span>
          <div class="code-block code-block--compact">
            <pre><code><span class="text-slate-400">const</span> students = [
  { name: <span class="text-amber-300">'小華'</span>, score: <span class="text-amber-300">80</span> },
  { name: <span class="text-amber-300">'小美'</span>, score: <span class="text-amber-300">92</span> },
  { name: <span class="text-amber-300">'小明'</span>, score: <span class="text-amber-300">45</span> }
];</code></pre>
          </div>
        </div>
        <div class="code-block">
          <pre><code><span class="text-slate-400">const</span> passed = students.<span class="text-emerald-300">filter</span>(<span class="text-slate-400">function</span>(<span class="text-amber-300">student</span>) {
  <span class="text-slate-400">return</span> student.score >= <span class="text-amber-300">60</span>;
});</code></pre>
        </div>
        <div class="card-row">
          <div v-for="(s, i) in students" :key="i" :class="['arr-card', 'arr-card--default']">
            <span class="arr-card__index">Index {{ i }}</span>
            <span class="arr-card__name">{{ s.name }}</span>
            <span class="arr-card__detail">Score: {{ s.score }}</span>
          </div>
        </div>
        <!-- 結果陣列（空的） -->
        <div class="result-array">
          <span class="result-array__label">📦 結果陣列 passed =</span>
          <div class="code-block code-block--compact code-block--result"><pre><code>[]  <span class="text-slate-500">// 空的，準備收集</span></code></pre></div>
        </div>
        <div class="explain-box">
          <p>🎬 filter() 跟 find() 長得很像，但有個關鍵差異：它<strong class="text-white">不會提前煞車</strong>，每一筆都會跑完。符合條件的會被收集到一個<strong class="text-emerald-300">新陣列</strong>裡面。</p>
        </div>
      </div>
    </div>

    <!-- filter-loop-0 -->
    <div v-else-if="stepData.view === 'filter-loop-0'" class="slide-page">
      <div class="wm">filter</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-emerald-500/20 text-emerald-300">filter() — 第一圈</div>
        <div class="code-block">
          <pre><code><span class="text-slate-500">// 傳入的 student:</span> { name: <span class="text-amber-300">'小華'</span>, score: <span class="text-amber-300">80</span> }
<span class="text-slate-400">return</span> <span class="text-amber-300">80</span> >= <span class="text-emerald-300">60</span>; <span class="text-slate-500">// 結果: true ✅ 收集！</span></code></pre>
          <div class="callback-badge callback-badge--true">Return: true</div>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(1)]"><span class="arr-card__icon">🔍</span><span class="arr-card__index">Index 0</span><span class="arr-card__name">小華</span><span class="arr-card__detail">Score: 80</span><span class="arr-card__checking">檢查中...</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__index">Index 1</span><span class="arr-card__name">小美</span><span class="arr-card__detail">Score: 92</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__index">Index 2</span><span class="arr-card__name">小明</span><span class="arr-card__detail">Score: 45</span></div>
        </div>
        <div class="result-array">
          <span class="result-array__label">📦 結果陣列 passed =</span>
          <div class="code-block code-block--compact code-block--result"><pre><code>[]  <span class="text-slate-500">// true! 準備把小華收進來</span></code></pre></div>
        </div>
        <div class="explain-box">
          <p>🔍 小華 80 分 ≥ 60？<strong class="text-emerald-300">true！</strong>收集到結果陣列裡面。<br/>但 filter() 不會停，會繼續看下一筆。</p>
        </div>
      </div>
    </div>

    <!-- filter-loop-1 -->
    <div v-else-if="stepData.view === 'filter-loop-1'" class="slide-page">
      <div class="wm">filter</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-emerald-500/20 text-emerald-300">filter() — 第二圈</div>
        <div class="code-block">
          <pre><code><span class="text-slate-500">// 傳入的 student:</span> { name: <span class="text-amber-300">'小美'</span>, score: <span class="text-amber-300">92</span> }
<span class="text-slate-400">return</span> <span class="text-amber-300">92</span> >= <span class="text-emerald-300">60</span>; <span class="text-slate-500">// 結果: true ✅ 收集！</span></code></pre>
          <div class="callback-badge callback-badge--true">Return: true</div>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__index">Index 0</span><span class="arr-card__name">小華</span><span class="arr-card__detail">Score: 80</span></div>
          <div :class="['arr-card', cardClass(1)]"><span class="arr-card__icon">🔍</span><span class="arr-card__index">Index 1</span><span class="arr-card__name">小美</span><span class="arr-card__detail">Score: 92</span><span class="arr-card__checking">檢查中...</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__index">Index 2</span><span class="arr-card__name">小明</span><span class="arr-card__detail">Score: 45</span></div>
        </div>
        <div class="result-array">
          <span class="result-array__label">📦 結果陣列 passed =</span>
          <div class="code-block code-block--compact code-block--result">
            <pre><code>[
  { name: <span class="text-amber-300">'小華'</span>, score: <span class="text-amber-300">80</span> }
]</code></pre>
          </div>
        </div>
        <div class="explain-box">
          <p>🔍 小美 92 分 ≥ 60？<strong class="text-emerald-300">true！</strong>也收集進去。繼續看下一筆！</p>
        </div>
      </div>
    </div>

    <!-- filter-loop-2 -->
    <div v-else-if="stepData.view === 'filter-loop-2'" class="slide-page">
      <div class="wm">filter</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-emerald-500/20 text-emerald-300">filter() — 第三圈</div>
        <div class="code-block">
          <pre><code><span class="text-slate-500">// 傳入的 student:</span> { name: <span class="text-amber-300">'小明'</span>, score: <span class="text-amber-300">45</span> }
<span class="text-slate-400">return</span> <span class="text-amber-300">45</span> >= <span class="text-emerald-300">60</span>; <span class="text-slate-500">// 結果: false ❌ 不收集</span></code></pre>
          <div class="callback-badge callback-badge--false">Return: false</div>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__index">Index 0</span><span class="arr-card__name">小華</span><span class="arr-card__detail">Score: 80</span></div>
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__index">Index 1</span><span class="arr-card__name">小美</span><span class="arr-card__detail">Score: 92</span></div>
          <div :class="['arr-card', cardClass(1)]"><span class="arr-card__icon">🔍</span><span class="arr-card__index">Index 2</span><span class="arr-card__name">小明</span><span class="arr-card__detail">Score: 45</span><span class="arr-card__checking">檢查中...</span></div>
        </div>
        <div class="result-array">
          <span class="result-array__label">📦 結果陣列 passed =</span>
          <div class="code-block code-block--compact code-block--result">
            <pre><code>[
  { name: <span class="text-amber-300">'小華'</span>, score: <span class="text-amber-300">80</span> },
  { name: <span class="text-amber-300">'小美'</span>, score: <span class="text-amber-300">92</span> }
]</code></pre>
          </div>
        </div>
        <div class="explain-box">
          <p>🔍 小明 45 分 ≥ 60？<strong class="text-rose-300">false！</strong>不符合條件，不收集。<br/>三筆都跑完了，filter() 收工。</p>
        </div>
      </div>
    </div>

    <!-- filter-result -->
    <div v-else-if="stepData.view === 'filter-result'" class="slide-page">
      <div class="wm">filter</div>
      <div class="flex flex-col items-center gap-6">
        <div class="method-badge bg-emerald-500/20 text-emerald-300">filter() 最終結果</div>
        <h2 class="text-xl font-bold text-white">回傳新陣列</h2>
        <div class="code-block max-w-2xl">
          <pre><code>console.<span class="text-blue-300">log</span>(passed);
<span class="text-emerald-300">[
  { name: '小華', score: 80 },
  { name: '小美', score: 92 }
]</span>

<span class="text-slate-500">// 原陣列 students 完全不受影響，還是 3 筆</span></code></pre>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__name">小華</span><span class="arr-card__detail">Score: 80</span></div>
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__name">小美</span><span class="arr-card__detail">Score: 92</span></div>
          <div :class="['arr-card', cardClass(3)]"><span class="arr-card__icon">❌</span><span class="arr-card__name">小明</span><span class="arr-card__detail">Score: 45</span></div>
        </div>
        <div class="explain-box max-w-2xl">
          <p>filter() 回傳一個<strong class="text-emerald-300">全新的陣列</strong>，裡面只有符合條件的資料。<br/>❌ 找不到任何符合的？回傳空陣列 <code class="code-inline">[]</code>，不是 undefined！</p>
        </div>
      </div>
    </div>

    <!-- filter-vs-find -->
    <div v-else-if="stepData.view === 'filter-vs-find'" class="slide-page">
      <div class="wm">VS</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">find vs filter 比一比</h2>
        <div class="compare-table">
          <div class="compare-table__row compare-table__header"><div></div><div class="text-blue-300">find</div><div class="text-emerald-300">filter</div></div>
          <div class="compare-table__row"><div class="text-slate-400">回傳</div><div>一筆資料（物件）</div><div>新陣列（可能多筆）</div></div>
          <div class="compare-table__row"><div class="text-slate-400">找不到時</div><div><code class="code-inline">undefined</code></div><div><code class="code-inline">[]</code> 空陣列</div></div>
          <div class="compare-table__row"><div class="text-slate-400">找到幾筆</div><div>第一筆就停</div><div>全部都找</div></div>
        </div>
        <div class="explain-box max-w-2xl">
          <p>💡 簡單記：<strong class="text-blue-300">find</strong> 是「找到就走」，<strong class="text-emerald-300">filter</strong> 是「全部翻完再把符合的打包給你」。</p>
        </div>
      </div>
    </div>

    <!-- ╔══════════════════════════════════════╗ -->
    <!-- ║           SOME()                      ║ -->
    <!-- ╚══════════════════════════════════════╝ -->

    <!-- some-intro -->
    <div v-else-if="stepData.view === 'some-intro'" class="slide-page">
      <div class="wm">some</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-amber-500/20 text-amber-300">some()</div>
        <h2 class="text-center text-xl font-bold text-white">準備執行 some()</h2>
        <div class="data-source">
          <span class="data-source__label">📦 初始資料（同上）</span>
          <div class="code-block code-block--compact">
            <pre><code><span class="text-slate-400">const</span> students = [
  { name: <span class="text-amber-300">'小華'</span>, score: <span class="text-amber-300">80</span> },
  { name: <span class="text-amber-300">'小美'</span>, score: <span class="text-amber-300">92</span> },
  { name: <span class="text-amber-300">'小明'</span>, score: <span class="text-amber-300">45</span> }
];</code></pre>
          </div>
        </div>
        <div class="code-block">
          <pre><code><span class="text-slate-400">const</span> hasFailed = students.<span class="text-amber-300">some</span>(<span class="text-slate-400">function</span>(<span class="text-amber-300">student</span>) {
  <span class="text-slate-400">return</span> student.score &lt; <span class="text-amber-300">60</span>;
});</code></pre>
        </div>
        <div class="card-row">
          <div v-for="(s, i) in students" :key="i" :class="['arr-card', 'arr-card--default']">
            <span class="arr-card__index">Index {{ i }}</span>
            <span class="arr-card__name">{{ s.name }}</span>
            <span class="arr-card__detail">Score: {{ s.score }}</span>
          </div>
        </div>
        <div class="explain-box">
          <p>🎬 some() 只回答一個問題：「<strong class="text-white">有沒有</strong>人不及格？」回傳 true 或 false。跟 find() 一樣，找到就中斷。</p>
        </div>
      </div>
    </div>

    <!-- some-loop-0 -->
    <div v-else-if="stepData.view === 'some-loop-0'" class="slide-page">
      <div class="wm">some</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-amber-500/20 text-amber-300">some() — 第一圈</div>
        <div class="code-block">
          <pre><code><span class="text-slate-500">// 傳入的 student:</span> { name: <span class="text-amber-300">'小華'</span>, score: <span class="text-amber-300">80</span> }
<span class="text-slate-400">return</span> <span class="text-amber-300">80</span> &lt; <span class="text-emerald-300">60</span>; <span class="text-slate-500">// 結果: false</span></code></pre>
          <div class="callback-badge callback-badge--false">Return: false</div>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(1)]"><span class="arr-card__icon">🔍</span><span class="arr-card__index">Index 0</span><span class="arr-card__name">小華</span><span class="arr-card__detail">Score: 80</span><span class="arr-card__checking">檢查中...</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__index">Index 1</span><span class="arr-card__name">小美</span><span class="arr-card__detail">Score: 92</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__index">Index 2</span><span class="arr-card__name">小明</span><span class="arr-card__detail">Score: 45</span></div>
        </div>
        <div class="explain-box"><p>🔍 小華 80 分 &lt; 60？<strong class="text-rose-300">false</strong>。及格的，不是不及格。繼續！</p></div>
      </div>
    </div>

    <!-- some-loop-1 -->
    <div v-else-if="stepData.view === 'some-loop-1'" class="slide-page">
      <div class="wm">some</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-amber-500/20 text-amber-300">some() — 第二圈</div>
        <div class="code-block">
          <pre><code><span class="text-slate-500">// 傳入的 student:</span> { name: <span class="text-amber-300">'小美'</span>, score: <span class="text-amber-300">92</span> }
<span class="text-slate-400">return</span> <span class="text-amber-300">92</span> &lt; <span class="text-emerald-300">60</span>; <span class="text-slate-500">// 結果: false</span></code></pre>
          <div class="callback-badge callback-badge--false">Return: false</div>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(3)]"><span class="arr-card__icon">❌</span><span class="arr-card__index">Index 0</span><span class="arr-card__name">小華</span><span class="arr-card__detail">Score: 80</span></div>
          <div :class="['arr-card', cardClass(1)]"><span class="arr-card__icon">🔍</span><span class="arr-card__index">Index 1</span><span class="arr-card__name">小美</span><span class="arr-card__detail">Score: 92</span><span class="arr-card__checking">檢查中...</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__index">Index 2</span><span class="arr-card__name">小明</span><span class="arr-card__detail">Score: 45</span></div>
        </div>
        <div class="explain-box"><p>🔍 小美 92 分 &lt; 60？<strong class="text-rose-300">false</strong>。也是及格的。繼續找！</p></div>
      </div>
    </div>

    <!-- some-loop-2 -->
    <div v-else-if="stepData.view === 'some-loop-2'" class="slide-page">
      <div class="wm">some</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-amber-500/20 text-amber-300">some() — 第三圈</div>
        <div class="code-block">
          <pre><code><span class="text-slate-500">// 傳入的 student:</span> { name: <span class="text-amber-300">'小明'</span>, score: <span class="text-amber-300">45</span> }
<span class="text-slate-400">return</span> <span class="text-amber-300">45</span> &lt; <span class="text-emerald-300">60</span>; <span class="text-slate-500">// 結果: true 🎯</span></code></pre>
          <div class="callback-badge callback-badge--true">Return: true</div>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(3)]"><span class="arr-card__icon">❌</span><span class="arr-card__name">小華</span><span class="arr-card__detail">Score: 80</span></div>
          <div :class="['arr-card', cardClass(3)]"><span class="arr-card__icon">❌</span><span class="arr-card__name">小美</span><span class="arr-card__detail">Score: 92</span></div>
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__name">小明</span><span class="arr-card__detail">Score: 45</span></div>
        </div>
        <div class="some-result some-result--true">hasFailed = <strong>true</strong></div>
        <div class="explain-box">
          <p>🎯 小明 45 分 &lt; 60？<strong class="text-emerald-300">true！</strong>找到了！some() 立刻中斷，回傳 <strong class="text-emerald-300">true</strong>。<br/>它不關心是哪一筆不及格，只關心「有沒有」。</p>
        </div>
      </div>
    </div>

    <!-- some-qa-1 -->
    <div v-else-if="stepData.view === 'some-qa-1'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="method-badge bg-violet-500/20 text-violet-300">💡 some() Q&A</div>
        <h2 class="text-xl font-bold text-white">some 跟 find 差在哪？</h2>
        <div class="compare-table">
          <div class="compare-table__row compare-table__header"><div></div><div class="text-blue-300">find</div><div class="text-amber-300">some</div></div>
          <div class="compare-table__row"><div class="text-slate-400">回傳</div><div>那筆資料（物件）</div><div>true / false</div></div>
          <div class="compare-table__row"><div class="text-slate-400">找不到時</div><div><code class="code-inline">undefined</code></div><div><code class="code-inline">false</code></div></div>
          <div class="compare-table__row"><div class="text-slate-400">用途</div><div>「給我那筆資料」</div><div>「有沒有就好」</div></div>
        </div>
        <div class="explain-box max-w-2xl">
          <p>💡 都會找到就停。差別是 <strong class="text-blue-300">find</strong> 是「給我那筆資料」，<strong class="text-amber-300">some</strong> 是「有或沒有，回答我 yes or no」。</p>
        </div>
      </div>
    </div>

    <!-- some-qa-2 -->
    <div v-else-if="stepData.view === 'some-qa-2'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="method-badge bg-violet-500/20 text-violet-300">💡 some() Q&A</div>
        <h2 class="text-xl font-bold text-white">全部都 false 呢？</h2>
        <div class="card-row">
          <div :class="['arr-card', cardClass(3)]"><span class="arr-card__icon">❌</span><span class="arr-card__name">小華 (80)</span></div>
          <div :class="['arr-card', cardClass(3)]"><span class="arr-card__icon">❌</span><span class="arr-card__name">小美 (92)</span></div>
        </div>
        <div class="some-result some-result--false">hasFailed = <strong>false</strong></div>
        <div class="explain-box max-w-2xl">
          <p>👉 如果全部都不符合，some() 就會回傳 <strong class="text-rose-300">false</strong>。意思是「沒有任何一筆符合你的條件」。</p>
        </div>
      </div>
    </div>

    <!-- ╔══════════════════════════════════════╗ -->
    <!-- ║           MAP()                       ║ -->
    <!-- ╚══════════════════════════════════════╝ -->

    <!-- map-intro -->
    <div v-else-if="stepData.view === 'map-intro'" class="slide-page">
      <div class="wm">map</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-purple-500/20 text-purple-300">map()</div>
        <h2 class="text-center text-xl font-bold text-white">準備執行 map()</h2>
        <div class="data-source">
          <span class="data-source__label">📦 初始資料</span>
          <div class="code-block code-block--compact">
            <pre><code><span class="text-slate-400">const</span> prices = [<span class="text-amber-300">100</span>, <span class="text-amber-300">200</span>, <span class="text-amber-300">300</span>, <span class="text-amber-300">500</span>];</code></pre>
          </div>
        </div>
        <div class="code-block">
          <pre><code><span class="text-slate-400">const</span> discounted = prices.<span class="text-purple-300">map</span>(<span class="text-slate-400">function</span>(<span class="text-amber-300">price</span>) {
  <span class="text-slate-400">return</span> price * <span class="text-amber-300">0.8</span>;
});</code></pre>
        </div>
        <div class="card-row">
          <div v-for="(p, i) in prices" :key="i" :class="['arr-card', 'arr-card--default']">
            <span class="arr-card__index">Index {{ i }}</span>
            <span class="arr-card__name text-2xl">{{ p }}</span>
            <span class="arr-card__detail">元</span>
          </div>
        </div>
        <div class="result-array">
          <span class="result-array__label">🆕 新陣列 discounted =</span>
          <div class="code-block code-block--compact code-block--result"><pre><code>[]  <span class="text-slate-500">// 空的，準備組裝</span></code></pre></div>
        </div>
        <div class="explain-box">
          <p>🎬 map() 跟 filter() 一樣<strong class="text-white">每一筆都會跑</strong>。但它不是在篩選，而是把每一筆都<strong class="text-purple-300">加工</strong>後丟進新陣列。</p>
        </div>
      </div>
    </div>

    <!-- map-loop-0 -->
    <div v-else-if="stepData.view === 'map-loop-0'" class="slide-page">
      <div class="wm">map</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-purple-500/20 text-purple-300">map() — 第一圈</div>
        <div class="code-block">
          <pre><code><span class="text-slate-500">// 傳入的 price:</span> <span class="text-amber-300">100</span>
<span class="text-slate-400">return</span> <span class="text-amber-300">100</span> * <span class="text-purple-300">0.8</span>; <span class="text-slate-500">// 結果: 80</span></code></pre>
          <div class="callback-badge callback-badge--map">Return: 80</div>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(1)]"><span class="arr-card__icon">🔍</span><span class="arr-card__index">Index 0</span><span class="arr-card__name text-2xl">100</span><span class="arr-card__transform">→ 80</span><span class="arr-card__checking">加工中...</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__index">Index 1</span><span class="arr-card__name text-2xl">200</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__index">Index 2</span><span class="arr-card__name text-2xl">300</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__index">Index 3</span><span class="arr-card__name text-2xl">500</span></div>
        </div>
        <div class="result-array">
          <span class="result-array__label">🆕 新陣列 discounted =</span>
          <div class="code-block code-block--compact code-block--result"><pre><code>[]  <span class="text-slate-500">// 準備把 80 推進來</span></code></pre></div>
        </div>
        <div class="explain-box"><p>🔧 100 × 0.8 = <strong class="text-purple-300">80</strong>。加工完成，推進新陣列！</p></div>
      </div>
    </div>

    <!-- map-loop-1 -->
    <div v-else-if="stepData.view === 'map-loop-1'" class="slide-page">
      <div class="wm">map</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-purple-500/20 text-purple-300">map() — 第二圈</div>
        <div class="code-block">
          <pre><code><span class="text-slate-500">// 傳入的 price:</span> <span class="text-amber-300">200</span>
<span class="text-slate-400">return</span> <span class="text-amber-300">200</span> * <span class="text-purple-300">0.8</span>; <span class="text-slate-500">// 結果: 160</span></code></pre>
          <div class="callback-badge callback-badge--map">Return: 160</div>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__name text-2xl">100</span><span class="arr-card__transform">→ 80</span></div>
          <div :class="['arr-card', cardClass(1)]"><span class="arr-card__icon">🔍</span><span class="arr-card__name text-2xl">200</span><span class="arr-card__transform">→ 160</span><span class="arr-card__checking">加工中...</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__name text-2xl">300</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__name text-2xl">500</span></div>
        </div>
        <div class="result-array">
          <span class="result-array__label">🆕 新陣列 discounted =</span>
          <div class="code-block code-block--compact code-block--result"><pre><code>[<span class="text-purple-300">80</span>]</code></pre></div>
        </div>
        <div class="explain-box"><p>🔧 200 × 0.8 = <strong class="text-purple-300">160</strong>。推進新陣列！</p></div>
      </div>
    </div>

    <!-- map-loop-2 -->
    <div v-else-if="stepData.view === 'map-loop-2'" class="slide-page">
      <div class="wm">map</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-purple-500/20 text-purple-300">map() — 第三圈</div>
        <div class="code-block">
          <pre><code><span class="text-slate-500">// 傳入的 price:</span> <span class="text-amber-300">300</span>
<span class="text-slate-400">return</span> <span class="text-amber-300">300</span> * <span class="text-purple-300">0.8</span>; <span class="text-slate-500">// 結果: 240</span></code></pre>
          <div class="callback-badge callback-badge--map">Return: 240</div>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__name text-2xl">100</span><span class="arr-card__transform">→ 80</span></div>
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__name text-2xl">200</span><span class="arr-card__transform">→ 160</span></div>
          <div :class="['arr-card', cardClass(1)]"><span class="arr-card__icon">🔍</span><span class="arr-card__name text-2xl">300</span><span class="arr-card__transform">→ 240</span><span class="arr-card__checking">加工中...</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__name text-2xl">500</span></div>
        </div>
        <div class="result-array">
          <span class="result-array__label">🆕 新陣列 discounted =</span>
          <div class="code-block code-block--compact code-block--result"><pre><code>[<span class="text-purple-300">80</span>, <span class="text-purple-300">160</span>]</code></pre></div>
        </div>
        <div class="explain-box"><p>🔧 300 × 0.8 = <strong class="text-purple-300">240</strong>。推進！</p></div>
      </div>
    </div>

    <!-- map-loop-3 -->
    <div v-else-if="stepData.view === 'map-loop-3'" class="slide-page">
      <div class="wm">map</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-purple-500/20 text-purple-300">map() — 第四圈</div>
        <div class="code-block">
          <pre><code><span class="text-slate-500">// 傳入的 price:</span> <span class="text-amber-300">500</span>
<span class="text-slate-400">return</span> <span class="text-amber-300">500</span> * <span class="text-purple-300">0.8</span>; <span class="text-slate-500">// 結果: 400</span></code></pre>
          <div class="callback-badge callback-badge--map">Return: 400</div>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__name text-2xl">100</span><span class="arr-card__transform">→ 80</span></div>
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__name text-2xl">200</span><span class="arr-card__transform">→ 160</span></div>
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__name text-2xl">300</span><span class="arr-card__transform">→ 240</span></div>
          <div :class="['arr-card', cardClass(1)]"><span class="arr-card__icon">🔍</span><span class="arr-card__name text-2xl">500</span><span class="arr-card__transform">→ 400</span><span class="arr-card__checking">加工中...</span></div>
        </div>
        <div class="result-array">
          <span class="result-array__label">🆕 新陣列 discounted =</span>
          <div class="code-block code-block--compact code-block--result"><pre><code>[<span class="text-purple-300">80</span>, <span class="text-purple-300">160</span>, <span class="text-purple-300">240</span>]</code></pre></div>
        </div>
        <div class="explain-box"><p>🔧 500 × 0.8 = <strong class="text-purple-300">400</strong>。最後一筆完成，map() 收工！</p></div>
      </div>
    </div>

    <!-- map-result -->
    <div v-else-if="stepData.view === 'map-result'" class="slide-page">
      <div class="wm">map</div>
      <div class="flex flex-col items-center gap-6">
        <div class="method-badge bg-purple-500/20 text-purple-300">map() 最終結果</div>
        <h2 class="text-xl font-bold text-white">新陣列 vs 原陣列</h2>
        <div class="code-block max-w-2xl">
          <pre><code>console.<span class="text-blue-300">log</span>(discounted); <span class="text-slate-500">// [80, 160, 240, 400]</span>
console.<span class="text-blue-300">log</span>(prices);     <span class="text-slate-500">// [100, 200, 300, 500]（原陣列不變！）</span></code></pre>
        </div>
        <div class="flex flex-col gap-3 md:flex-row md:gap-8">
          <div class="rounded-xl border border-slate-600 bg-slate-800/60 p-4">
            <p class="mb-2 text-sm font-bold text-slate-400">原陣列 prices</p>
            <pre class="font-mono text-sm text-slate-300">[<span class="text-amber-300">100</span>, <span class="text-amber-300">200</span>, <span class="text-amber-300">300</span>, <span class="text-amber-300">500</span>]</pre>
          </div>
          <div class="flex items-center text-2xl text-purple-300">→</div>
          <div class="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
            <p class="mb-2 text-sm font-bold text-purple-300">新陣列 discounted</p>
            <pre class="font-mono text-sm text-purple-200">[<span class="text-purple-300">80</span>, <span class="text-purple-300">160</span>, <span class="text-purple-300">240</span>, <span class="text-purple-300">400</span>]</pre>
          </div>
        </div>
        <div class="explain-box max-w-2xl">
          <p>map() 不會改原陣列，產出<strong class="text-purple-300">全新的陣列</strong>。而且新陣列的長度<strong class="text-white">一定跟原本一樣</strong>！（4 筆 → 4 筆）</p>
        </div>
      </div>
    </div>

    <!-- map-vs-filter -->
    <div v-else-if="stepData.view === 'map-vs-filter'" class="slide-page">
      <div class="wm">VS</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">map vs filter 比一比</h2>
        <div class="compare-table">
          <div class="compare-table__row compare-table__header"><div></div><div class="text-emerald-300">filter</div><div class="text-purple-300">map</div></div>
          <div class="compare-table__row"><div class="text-slate-400">做什麼</div><div>挑選符合條件的</div><div>每一筆都加工</div></div>
          <div class="compare-table__row"><div class="text-slate-400">回傳數量</div><div>可能變少</div><div>一定跟原本一樣多</div></div>
          <div class="compare-table__row"><div class="text-slate-400">用途</div><div>「我只要其中幾筆」</div><div>「每一筆都要變」</div></div>
        </div>
        <div class="explain-box max-w-2xl">
          <p>💡 <strong class="text-emerald-300">filter</strong> 是「挑選」— 數量會變少。<strong class="text-purple-300">map</strong> 是「加工」— 數量不變，但內容全部換新。</p>
        </div>
      </div>
    </div>

    <!-- ╔══════════════════════════════════════╗ -->
    <!-- ║          REDUCE()                     ║ -->
    <!-- ╚══════════════════════════════════════╝ -->

    <!-- reduce-intro -->
    <div v-else-if="stepData.view === 'reduce-intro'" class="slide-page">
      <div class="wm">reduce</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-rose-500/20 text-rose-300">reduce()</div>
        <h2 class="text-center text-xl font-bold text-white">準備執行 reduce()</h2>
        <div class="data-source">
          <span class="data-source__label">📦 初始資料</span>
          <div class="code-block code-block--compact">
            <pre><code><span class="text-slate-400">const</span> carts = [
  { name: <span class="text-amber-300">'白T'</span>, price: <span class="text-amber-300">399</span>, qty: <span class="text-amber-300">2</span> },
  { name: <span class="text-amber-300">'帆布鞋'</span>, price: <span class="text-amber-300">1299</span>, qty: <span class="text-amber-300">1</span> },
  { name: <span class="text-amber-300">'外套'</span>, price: <span class="text-amber-300">1599</span>, qty: <span class="text-amber-300">1</span> }
];</code></pre>
          </div>
        </div>
        <div class="code-block">
          <pre><code><span class="text-slate-400">const</span> total = carts.<span class="text-rose-300">reduce</span>(<span class="text-slate-400">function</span>(<span class="text-amber-300">acc</span>, <span class="text-amber-300">item</span>) {
  <span class="text-slate-400">return</span> acc + item.price * item.qty;
}, <span class="text-rose-300">0</span>); <span class="text-slate-500">// ← 初始值</span></code></pre>
        </div>
        <div class="card-row">
          <div v-for="(c, i) in carts" :key="i" :class="['arr-card', 'arr-card--default']">
            <span class="arr-card__index">Index {{ i }}</span>
            <span class="arr-card__name">{{ c.name }}</span>
            <span class="arr-card__detail">${{ c.price }} x {{ c.qty }}</span>
          </div>
        </div>
        <div class="acc-tracker">
          <span class="acc-tracker__label">累加器 (acc)</span>
          <span class="acc-tracker__value">0</span>
          <span class="acc-tracker__note">← 初始值</span>
        </div>
        <div class="explain-box">
          <p>🎬 reduce() 是最強大的陣列方法。它多了一個「累加器 (acc)」，每一圈的結果會傳到下一圈。初始值是 <strong class="text-rose-300">0</strong>。</p>
        </div>
      </div>
    </div>

    <!-- reduce-loop-0 -->
    <div v-else-if="stepData.view === 'reduce-loop-0'" class="slide-page">
      <div class="wm">reduce</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-rose-500/20 text-rose-300">reduce() — 第一圈</div>
        <div class="code-block">
          <pre><code><span class="text-slate-500">// acc = 0, item = { name: '白T', price: 399, qty: 2 }</span>
<span class="text-slate-400">return</span> <span class="text-rose-300">0</span> + <span class="text-amber-300">399</span> * <span class="text-amber-300">2</span>; <span class="text-slate-500">// 結果: 798</span></code></pre>
          <div class="callback-badge callback-badge--reduce">acc → 798</div>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(1)]"><span class="arr-card__icon">🔍</span><span class="arr-card__name">白T</span><span class="arr-card__detail">$399 x 2</span><span class="arr-card__checking">計算中...</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__name">帆布鞋</span><span class="arr-card__detail">$1299 x 1</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__name">外套</span><span class="arr-card__detail">$1599 x 1</span></div>
        </div>
        <div class="acc-tracker">
          <span class="acc-tracker__label">累加器 (acc)</span>
          <span class="acc-tracker__calc">0 + 399x2 =</span>
          <span class="acc-tracker__value acc-tracker__value--highlight">798</span>
        </div>
        <div class="explain-box"><p>🔧 acc(0) + 399x2 = <strong class="text-rose-300">798</strong>。這個 798 會成為下一圈的 acc。</p></div>
      </div>
    </div>

    <!-- reduce-loop-1 -->
    <div v-else-if="stepData.view === 'reduce-loop-1'" class="slide-page">
      <div class="wm">reduce</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-rose-500/20 text-rose-300">reduce() — 第二圈</div>
        <div class="code-block">
          <pre><code><span class="text-slate-500">// acc = 798, item = { name: '帆布鞋', price: 1299, qty: 1 }</span>
<span class="text-slate-400">return</span> <span class="text-rose-300">798</span> + <span class="text-amber-300">1299</span> * <span class="text-amber-300">1</span>; <span class="text-slate-500">// 結果: 2097</span></code></pre>
          <div class="callback-badge callback-badge--reduce">acc → 2097</div>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__name">白T</span><span class="arr-card__detail">$399 x 2</span></div>
          <div :class="['arr-card', cardClass(1)]"><span class="arr-card__icon">🔍</span><span class="arr-card__name">帆布鞋</span><span class="arr-card__detail">$1299 x 1</span><span class="arr-card__checking">計算中...</span></div>
          <div :class="['arr-card', cardClass(0)]"><span class="arr-card__name">外套</span><span class="arr-card__detail">$1599 x 1</span></div>
        </div>
        <div class="acc-tracker">
          <span class="acc-tracker__label">累加器 (acc)</span>
          <span class="acc-tracker__calc">798 + 1299x1 =</span>
          <span class="acc-tracker__value acc-tracker__value--highlight">2097</span>
        </div>
        <div class="explain-box"><p>🔧 acc(798) + 1299x1 = <strong class="text-rose-300">2097</strong>。繼續滾動！</p></div>
      </div>
    </div>

    <!-- reduce-loop-2 -->
    <div v-else-if="stepData.view === 'reduce-loop-2'" class="slide-page">
      <div class="wm">reduce</div>
      <div class="flex flex-col gap-6">
        <div class="method-badge bg-rose-500/20 text-rose-300">reduce() — 第三圈</div>
        <div class="code-block">
          <pre><code><span class="text-slate-500">// acc = 2097, item = { name: '外套', price: 1599, qty: 1 }</span>
<span class="text-slate-400">return</span> <span class="text-rose-300">2097</span> + <span class="text-amber-300">1599</span> * <span class="text-amber-300">1</span>; <span class="text-slate-500">// 結果: 3696</span></code></pre>
          <div class="callback-badge callback-badge--reduce">acc → 3696</div>
        </div>
        <div class="card-row">
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__name">白T</span><span class="arr-card__detail">$399 x 2</span></div>
          <div :class="['arr-card', cardClass(2)]"><span class="arr-card__icon">✅</span><span class="arr-card__name">帆布鞋</span><span class="arr-card__detail">$1299 x 1</span></div>
          <div :class="['arr-card', cardClass(1)]"><span class="arr-card__icon">🔍</span><span class="arr-card__name">外套</span><span class="arr-card__detail">$1599 x 1</span><span class="arr-card__checking">計算中...</span></div>
        </div>
        <div class="acc-tracker">
          <span class="acc-tracker__label">累加器 (acc)</span>
          <span class="acc-tracker__calc">2097 + 1599x1 =</span>
          <span class="acc-tracker__value acc-tracker__value--highlight">3696</span>
        </div>
        <div class="explain-box"><p>🔧 acc(2097) + 1599x1 = <strong class="text-rose-300">3696</strong>。全部跑完，reduce() 回傳最終的 acc 值！</p></div>
      </div>
    </div>

    <!-- reduce-tracker -->
    <div v-else-if="stepData.view === 'reduce-tracker'" class="slide-page">
      <div class="wm">acc</div>
      <div class="flex flex-col items-center gap-6">
        <div class="method-badge bg-rose-500/20 text-rose-300">reduce() 累加器追蹤</div>
        <h2 class="text-xl font-bold text-white">每一圈的 acc 變化</h2>
        <div class="acc-timeline">
          <div class="acc-timeline__step"><span class="acc-timeline__label">初始值</span><span class="acc-timeline__val">0</span></div>
          <div class="acc-timeline__arrow">→</div>
          <div class="acc-timeline__step acc-timeline__step--active"><span class="acc-timeline__label">第 1 圈</span><span class="acc-timeline__calc">0 + 399x2</span><span class="acc-timeline__val">798</span></div>
          <div class="acc-timeline__arrow">→</div>
          <div class="acc-timeline__step acc-timeline__step--active"><span class="acc-timeline__label">第 2 圈</span><span class="acc-timeline__calc">798 + 1299</span><span class="acc-timeline__val">2097</span></div>
          <div class="acc-timeline__arrow">→</div>
          <div class="acc-timeline__step acc-timeline__step--final"><span class="acc-timeline__label">第 3 圈</span><span class="acc-timeline__calc">2097 + 1599</span><span class="acc-timeline__val">3696</span></div>
        </div>
        <div class="explain-box max-w-2xl">
          <p>💡 reduce 的核心就是「<strong class="text-white">滾雪球</strong>」— 每一圈的結果會傳到下一圈，越滾越大，最後得到一個總結果。</p>
        </div>
      </div>
    </div>

    <!-- reduce-qa-1 -->
    <div v-else-if="stepData.view === 'reduce-qa-1'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="method-badge bg-violet-500/20 text-violet-300">💡 reduce() Q&A</div>
        <h2 class="text-xl font-bold text-white">初始值忘了給會怎樣？</h2>
        <div class="code-block max-w-2xl">
          <pre><code><span class="text-slate-500">// ❌ 忘了給初始值</span>
carts.<span class="text-rose-300">reduce</span>(<span class="text-slate-400">function</span>(acc, item) {
  <span class="text-slate-400">return</span> acc + item.price * item.qty;
}); <span class="text-slate-500">// 沒有第二個參數！</span></code></pre>
        </div>
        <div class="explain-box max-w-2xl">
          <p>👉 如果沒給初始值，acc 的第一圈會是陣列的<strong class="text-white">第一個元素</strong>（整個物件），然後你拿一個物件去做 + 運算... 結果就是 <strong class="text-rose-300">NaN</strong>。<br/><br/>這是新手最常見的 bug！<strong class="text-white">永遠要給初始值。</strong></p>
        </div>
      </div>
    </div>

    <!-- reduce-qa-2 -->
    <div v-else-if="stepData.view === 'reduce-qa-2'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="method-badge bg-violet-500/20 text-violet-300">💡 reduce() Q&A</div>
        <h2 class="text-xl font-bold text-white">最後回傳什麼？</h2>
        <div class="code-block max-w-xl">
          <pre><code>console.<span class="text-blue-300">log</span>(total);
<span class="text-slate-500">// 3696</span></code></pre>
        </div>
        <div class="acc-tracker acc-tracker--final">
          <span class="acc-tracker__label">最終回傳</span>
          <span class="acc-tracker__value acc-tracker__value--highlight text-3xl">3696</span>
        </div>
        <div class="explain-box max-w-2xl">
          <p>👉 reduce() 回傳的就是<strong class="text-white">最後一圈 return 的值</strong>。整個陣列被「濃縮」成一個數字 3696。</p>
        </div>
      </div>
    </div>

    <!-- ╔══════════════════════════════════════╗ -->
    <!-- ║           SUMMARY                     ║ -->
    <!-- ╚══════════════════════════════════════╝ -->

    <!-- summary-guide -->
    <div v-else-if="stepData.view === 'summary-guide'" class="slide-page">
      <div class="wm">?→</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">方法選擇指南</h2>
        <p class="text-slate-400">拿到一個陣列，你想...</p>
        <div class="guide-grid">
          <div class="guide-card guide-card--blue"><span class="guide-card__q">找一筆資料？</span><span class="guide-card__a">find</span><span class="guide-card__return">→ 一個物件</span></div>
          <div class="guide-card guide-card--green"><span class="guide-card__q">篩出多筆？</span><span class="guide-card__a">filter</span><span class="guide-card__return">→ 新陣列</span></div>
          <div class="guide-card guide-card--amber"><span class="guide-card__q">有沒有符合的？</span><span class="guide-card__a">some</span><span class="guide-card__return">→ true / false</span></div>
          <div class="guide-card guide-card--purple"><span class="guide-card__q">每筆都加工？</span><span class="guide-card__a">map</span><span class="guide-card__return">→ 新陣列（同長度）</span></div>
          <div class="guide-card guide-card--rose"><span class="guide-card__q">濃縮成一個值？</span><span class="guide-card__a">reduce</span><span class="guide-card__return">→ 任何東西</span></div>
        </div>
      </div>
    </div>

    <!-- summary-chain -->
    <div v-else-if="stepData.view === 'summary-chain'" class="slide-page">
      <div class="wm">→→</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">方法串接：組合技</h2>
        <p class="text-slate-400">學會每個方法後，可以把它們串在一起用</p>
        <div class="code-block max-w-2xl">
          <pre><code><span class="text-slate-500">// 篩出已付款的訂單，再算總金額</span>
<span class="text-slate-400">const</span> revenue = orders
  .<span class="text-emerald-300">filter</span>(<span class="text-slate-400">function</span>(order) {
    <span class="text-slate-400">return</span> order.paid === <span class="text-amber-300">true</span>;
  })
  .<span class="text-rose-300">reduce</span>(<span class="text-slate-400">function</span>(acc, order) {
    <span class="text-slate-400">return</span> acc + order.total;
  }, <span class="text-rose-300">0</span>);</code></pre>
        </div>
        <div class="flex items-center gap-4 text-lg">
          <span class="rounded-lg bg-emerald-500/20 px-4 py-2 font-bold text-emerald-300">filter</span>
          <span class="text-slate-500">→</span>
          <span class="rounded-lg bg-rose-500/20 px-4 py-2 font-bold text-rose-300">reduce</span>
          <span class="text-slate-500">=</span>
          <span class="text-white font-bold">先篩再算</span>
        </div>
        <div class="explain-box max-w-2xl">
          <p>💡 因為 filter 回傳的是陣列，所以後面可以直接接 reduce。這就是方法串接的威力！</p>
        </div>
      </div>
    </div>

    <!-- summary-end -->
    <div v-else-if="stepData.view === 'summary-end'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">🎉</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/proud.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-sky-400 object-cover shadow-xl shadow-sky-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-sky-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">做得很好！ 👏</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">今天你看懂了 5 個陣列方法的執行流程。記住：</p>
          <p class="mb-2 text-sm leading-relaxed text-white md:text-base"><strong>find</strong> 找一筆、<strong>filter</strong> 篩多筆、<strong>some</strong> 問有沒有、<strong>map</strong> 全加工、<strong>reduce</strong> 濃縮成一個值。</p>
          <p class="mb-3 text-sm leading-relaxed text-slate-300 md:text-base">不用背語法，回去寫作業的時候翻回來看這個流程圖就好。</p>
          <p class="text-xs text-slate-500 italic">「慢慢成長，才是比較快的。」—— 海姐</p>
        </div>
      </div>
    </div>

  </InteractiveSlideTemplate>
</template>

<style scoped>
/* ── Watermark ── */
.wm { @apply pointer-events-none fixed inset-0 z-0 flex items-center justify-center text-[12rem] font-black text-white/[0.02] select-none; }

/* ── Slide page ── */
.slide-page { @apply relative z-10 mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12; }

/* ── Section title pages ── */
.section-title-icon { @apply text-6xl; }
.section-title { @apply text-4xl font-black font-mono text-white; }
.section-subtitle { @apply text-lg text-slate-300 text-center max-w-md; }
.section-meta { @apply flex flex-wrap gap-3 justify-center; }
.section-meta__tag { @apply rounded-full px-4 py-1.5 text-sm font-bold; }
.section-meta__tag--blue { @apply bg-blue-500/15 text-blue-300 border border-blue-500/30; }
.section-meta__tag--green { @apply bg-emerald-500/15 text-emerald-300 border border-emerald-500/30; }
.section-meta__tag--amber { @apply bg-amber-500/15 text-amber-300 border border-amber-500/30; }
.section-meta__tag--purple { @apply bg-purple-500/15 text-purple-300 border border-purple-500/30; }
.section-meta__tag--rose { @apply bg-rose-500/15 text-rose-300 border border-rose-500/30; }

/* ── Method badge ── */
.method-badge { @apply mx-auto w-fit rounded-full px-4 py-1.5 text-sm font-bold; }

/* ── Data source block ── */
.data-source { @apply flex flex-col gap-2; }
.data-source__label { @apply text-sm font-bold text-slate-400; }

/* ── Code block ── */
.code-block { @apply relative overflow-hidden rounded-xl bg-[#1e1e1e] p-4 shadow-inner; }
.code-block--compact { @apply p-3; }
.code-block--result { @apply border border-emerald-500/20; }
.code-block pre { @apply font-mono text-sm leading-relaxed text-blue-300 md:text-base; }
.code-inline { @apply rounded bg-slate-700 px-1.5 py-0.5 font-mono text-amber-300; }

/* ── Result array (filter/map) ── */
.result-array { @apply flex flex-col gap-2; }
.result-array__label { @apply text-sm font-bold text-emerald-300; }

/* ── Callback return badge ── */
.callback-badge { @apply absolute bottom-3 right-3 rounded-lg border-2 px-3 py-1.5 font-mono text-sm font-bold shadow-lg; }
.callback-badge--true { @apply border-emerald-500 bg-emerald-100 text-emerald-700; }
.callback-badge--false { @apply border-rose-500 bg-rose-100 text-rose-700; }
.callback-badge--map { @apply border-purple-500 bg-purple-100 text-purple-700; }
.callback-badge--reduce { @apply border-rose-500 bg-rose-100 text-rose-700; }

/* ── Card row ── */
.card-row { @apply flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4; }

/* ── Array card ── */
.arr-card { @apply relative flex flex-1 flex-col items-center gap-1 rounded-xl border-2 p-4 transition-all duration-500; }
.arr-card--default { @apply border-slate-600 bg-slate-800/60 shadow-sm; }
.arr-card--active { @apply border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20 scale-105; }
.arr-card--success { @apply border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-400/30; }
.arr-card--fail { @apply border-slate-600 bg-slate-800/40 opacity-50; }
.arr-card--skipped { @apply border-dashed border-slate-600 bg-slate-800/30 opacity-40; }

.arr-card__icon { @apply absolute top-2 right-2 text-lg; }
.arr-card__index { @apply rounded-full bg-slate-700/50 px-2 py-0.5 text-xs font-mono text-slate-400; }
.arr-card__name { @apply text-lg font-bold text-white; }
.arr-card__detail { @apply text-sm text-slate-400; }
.arr-card__checking { @apply absolute -bottom-2.5 rounded bg-blue-500 px-2 py-0.5 text-xs font-bold text-white shadow animate-bounce; }
.arr-card__transform { @apply text-sm font-bold text-purple-300; }
.arr-card__highlight { @apply text-xs font-bold text-emerald-300; }

/* ── Explain box ── */
.explain-box { @apply rounded-xl border border-sky-500/20 bg-sky-500/5 p-5 text-base leading-relaxed text-slate-300; }

/* ── some() result badge ── */
.some-result { @apply mx-auto rounded-xl px-8 py-4 text-center text-2xl font-bold; }
.some-result--true { @apply bg-emerald-500/10 text-emerald-300 border border-emerald-500/30; }
.some-result--false { @apply bg-rose-500/10 text-rose-300 border border-rose-500/30; }

/* ── Accumulator tracker (reduce) ── */
.acc-tracker { @apply flex flex-wrap items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3; }
.acc-tracker--final { @apply border-rose-500/40 bg-rose-500/10 justify-center; }
.acc-tracker__label { @apply text-sm font-bold text-rose-300; }
.acc-tracker__calc { @apply font-mono text-sm text-slate-400; }
.acc-tracker__value { @apply rounded-lg bg-rose-500/20 px-3 py-1 font-mono text-lg font-bold text-rose-200; }
.acc-tracker__value--highlight { animation: valueAppear 0.5s ease-out; }
.acc-tracker__note { @apply text-xs text-slate-500; }

/* ── Accumulator timeline ── */
.acc-timeline { @apply flex flex-wrap items-center justify-center gap-2 md:gap-3; }
.acc-timeline__step { @apply flex flex-col items-center gap-1 rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-3; }
.acc-timeline__step--active { @apply border-rose-500/30 bg-rose-500/5; }
.acc-timeline__step--final { @apply border-rose-500/50 bg-rose-500/10 ring-2 ring-rose-400/30; }
.acc-timeline__label { @apply text-xs font-bold text-slate-400; }
.acc-timeline__calc { @apply font-mono text-xs text-slate-500; }
.acc-timeline__val { @apply font-mono text-lg font-bold text-rose-300; }
.acc-timeline__arrow { @apply text-xl text-slate-600; }

/* ── Compare table ── */
.compare-table { @apply w-full max-w-xl overflow-hidden rounded-xl border border-slate-600; }
.compare-table__row { @apply grid grid-cols-3 gap-0; }
.compare-table__row > div { @apply border-b border-slate-700 px-4 py-3 text-sm text-slate-300; }
.compare-table__header > div { @apply bg-slate-800 font-bold text-white; }

/* ── Guide grid (summary) ── */
.guide-grid { @apply grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3; }
.guide-card { @apply flex flex-col items-center gap-1 rounded-xl border p-4; }
.guide-card__q { @apply text-sm text-slate-400; }
.guide-card__a { @apply text-lg font-bold font-mono; }
.guide-card__return { @apply text-xs text-slate-500; }
.guide-card--blue { @apply border-blue-500/30 bg-blue-500/5; }
.guide-card--blue .guide-card__a { @apply text-blue-300; }
.guide-card--green { @apply border-emerald-500/30 bg-emerald-500/5; }
.guide-card--green .guide-card__a { @apply text-emerald-300; }
.guide-card--amber { @apply border-amber-500/30 bg-amber-500/5; }
.guide-card--amber .guide-card__a { @apply text-amber-300; }
.guide-card--purple { @apply border-purple-500/30 bg-purple-500/5; }
.guide-card--purple .guide-card__a { @apply text-purple-300; }
.guide-card--rose { @apply border-rose-500/30 bg-rose-500/5; }
.guide-card--rose .guide-card__a { @apply text-rose-300; }

/* ── Button ── */
.btn-action { @apply rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-sky-500/25 transition-all hover:shadow-sky-500/40; }

/* ── Animations ── */
@keyframes valueAppear {
  0% { opacity: 0; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
