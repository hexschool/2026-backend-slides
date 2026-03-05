<script setup lang="ts">
/**
 * 物件 vs 陣列：何時用哪個？
 * 22 步驟情境式教學：用生活場景幫學生判斷該用 { } 還是 [ ]
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  // Phase 1: 開場
  { id: 0,  view: 'welcome',         title: '歡迎',             desc: '海姐帶你做選擇' },
  { id: 1,  view: 'quick-diff',      title: '兩種容器',         desc: '{ } vs [ ] 快速對照' },
  // Phase 2: 物件情境
  { id: 2,  view: 'scene-person',    title: '情境：一個學生',   desc: '這筆資料該怎麼存？' },
  { id: 3,  view: 'scene-product',   title: '情境：一個商品',   desc: '這筆資料該怎麼存？' },
  { id: 4,  view: 'scene-config',    title: '情境：一份設定',   desc: '這筆資料該怎麼存？' },
  { id: 5,  view: 'obj-pattern',     title: '物件的共同點',     desc: '什麼時候該用 { }' },
  // Phase 3: 陣列情境
  { id: 6,  view: 'scene-classlist', title: '情境：全班名字',   desc: '這筆資料該怎麼存？' },
  { id: 7,  view: 'scene-playlist',  title: '情境：一份歌單',   desc: '這筆資料該怎麼存？' },
  { id: 8,  view: 'scene-steps',     title: '情境：做菜步驟',   desc: '這筆資料該怎麼存？' },
  { id: 9,  view: 'arr-pattern',     title: '陣列的共同點',     desc: '什麼時候該用 [ ]' },
  // Phase 4: 組合（只帶一個）
  { id: 10, view: 'combo-students',  title: '進階：全班成績單', desc: '物件和陣列也可以組合' },
  // Phase 5: 決策規則
  { id: 11, view: 'decision-rule',   title: '判斷規則',         desc: '一張圖記住' },
  // Phase 6: 挑戰（純 obj vs arr）
  { id: 12, view: 'challenge-1',     title: '挑戰 1',           desc: '一本書的資料' },
  { id: 13, view: 'challenge-2',     title: '挑戰 2',           desc: '班上同學的名字' },
  { id: 14, view: 'challenge-3',     title: '挑戰 3',           desc: '一部電影' },
  { id: 15, view: 'challenge-4',     title: '挑戰 4',           desc: '播放紀錄' },
  { id: 16, view: 'challenge-5',     title: '挑戰 5',           desc: '一筆訂單' },
  { id: 17, view: 'challenge-6',     title: '挑戰 6',           desc: '菜單上的菜' },
  { id: 18, view: 'challenge-7',     title: '挑戰 7',           desc: '一台車' },
  { id: 19, view: 'challenge-8',     title: '挑戰 8',           desc: '待辦清單' },
  // Phase 7: 總結
  { id: 20, view: 'summary-insight', title: '核心觀念',         desc: '一句話記住' },
  { id: 21, view: 'summary-end',     title: '課程結束',         desc: '海姐的結語' },
]

// ── Core ──
const currentStep = ref(0)
const stepData = computed(() => STEPS[currentStep.value])
const feedback = ref('')
const feedbackType = ref<'neutral' | 'success' | 'error' | 'question'>('neutral')

const feedbackClass = computed(() => {
  const map = {
    neutral: 'border-slate-600 bg-slate-800/80 text-slate-300',
    success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    error: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
    question: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
  }
  return map[feedbackType.value]
})
const feedbackIcon = computed(() => {
  const map = { neutral: '💡', success: '✅', error: '❌', question: '🤔' }
  return map[feedbackType.value]
})

// ── Scenario answers ──
const sceneAnswers = ref<Record<string, string>>({})

function answerScene(scene: string, answer: string, correct: string, successMsg: string, errorMsg: string) {
  if (answer === correct) {
    sceneAnswers.value[scene] = answer
    feedback.value = successMsg
    feedbackType.value = 'success'
  } else {
    feedback.value = errorMsg
    feedbackType.value = 'error'
  }
}

// ── Combo phase ──
const comboStudentsPhase = ref(0)

// ── Challenge answers ──
const challengeAnswers = ref<Record<string, string>>({})

function answerChallenge(id: string, answer: string, correct: string, successMsg: string, errorMsg: string) {
  if (answer === correct) {
    challengeAnswers.value[id] = answer
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
  if (v === 'scene-person') return sceneAnswers.value['person'] === 'obj'
  if (v === 'scene-product') return sceneAnswers.value['product'] === 'obj'
  if (v === 'scene-config') return sceneAnswers.value['config'] === 'obj'
  if (v === 'scene-classlist') return sceneAnswers.value['classlist'] === 'arr'
  if (v === 'scene-playlist') return sceneAnswers.value['playlist'] === 'arr'
  if (v === 'scene-steps') return sceneAnswers.value['steps'] === 'arr'
  if (v === 'combo-students') return comboStudentsPhase.value >= 2
  if (v === 'challenge-1') return challengeAnswers.value['c1'] === 'obj'
  if (v === 'challenge-2') return challengeAnswers.value['c2'] === 'arr'
  if (v === 'challenge-3') return challengeAnswers.value['c3'] === 'obj'
  if (v === 'challenge-4') return challengeAnswers.value['c4'] === 'arr'
  if (v === 'challenge-5') return challengeAnswers.value['c5'] === 'obj'
  if (v === 'challenge-6') return challengeAnswers.value['c6'] === 'arr'
  if (v === 'challenge-7') return challengeAnswers.value['c7'] === 'obj'
  if (v === 'challenge-8') return challengeAnswers.value['c8'] === 'arr'
  return true
})

const nextStepHint = computed(() => {
  const v = stepData.value.view
  if (v.startsWith('scene-') && !sceneAnswers.value[v.replace('scene-', '')]) return '選一個答案'
  if (v.startsWith('challenge-') && !challengeAnswers.value['c' + v.replace('challenge-', '')]) return '選一個答案'
  if (v === 'combo-students' && comboStudentsPhase.value < 2) return '按按鈕繼續'
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
    title="物件 vs 陣列"
    subtitle="何時用哪個？"
    icon="📦"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="emerald"
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
      <div class="wm">{ } vs [ ]</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-emerald-400 object-cover shadow-xl shadow-emerald-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-emerald-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">嗨，我是<strong class="text-emerald-300">海姐</strong> 👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">寫程式最常遇到的問題之一：</p>
          <p class="mb-2 text-sm leading-relaxed text-white md:text-base"><strong>「這筆資料，該用 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-emerald-300">{ }</code> 還是 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-sky-300">[ ]</code>？」</strong></p>
          <p class="mb-3 text-sm leading-relaxed text-slate-300 md:text-base">今天不教語法，直接用<strong class="text-emerald-300">情境</strong>幫你建立判斷力。</p>
          <p class="text-xs text-slate-500 italic">「會選，比會寫更重要。」—— 海姐</p>
        </div>
      </div>
      <button @click="nextStep()" class="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 animate-bounce">
        開始 →
      </button>
    </div>

    <!-- ===== Step 1: Quick Diff ===== -->
    <div v-else-if="stepData.view === 'quick-diff'" class="slide-page">
      <div class="wm">VS</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">兩種容器，不同用途</h2>
        <div class="flex flex-col gap-6 md:flex-row md:gap-10">
          <div class="w-72 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
            <p class="mb-3 text-center text-3xl">📦</p>
            <p class="text-center text-lg font-bold text-emerald-300">物件 { }</p>
            <div class="mt-4 rounded-xl bg-slate-900 p-3">
              <pre class="text-sm text-slate-300"><code>{
  name: <span class="text-amber-300">"小明"</span>,
  age: <span class="text-amber-300">18</span>
}</code></pre>
            </div>
            <p class="mt-3 text-center text-sm text-emerald-300">用<strong class="text-white">名字</strong>找東西</p>
          </div>
          <div class="w-72 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-6">
            <p class="mb-3 text-center text-3xl">📋</p>
            <p class="text-center text-lg font-bold text-sky-300">陣列 [ ]</p>
            <div class="mt-4 rounded-xl bg-slate-900 p-3">
              <pre class="text-sm text-slate-300"><code>[<span class="text-amber-300">"小明"</span>, <span class="text-amber-300">"小華"</span>, <span class="text-amber-300">"小美"</span>]
<span class="text-slate-500">// [0]     [1]     [2]</span></code></pre>
            </div>
            <p class="mt-3 text-center text-sm text-sky-300">用<strong class="text-white">順序</strong>排東西</p>
          </div>
        </div>
        <p class="text-base text-slate-400">問題來了——拿到一筆資料，你怎麼判斷該用哪個？</p>
      </div>
    </div>

    <!-- ===== Phase 2: Object Scenarios ===== -->

    <div v-else-if="stepData.view === 'scene-person'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-violet-500/20 text-violet-300">情境</div>
        <h2 class="text-xl font-bold text-white">一位學生的資料</h2>
        <div class="scene-card">
          <div class="scene-card-item"><span>👤</span><span>姓名：王小明</span></div>
          <div class="scene-card-item"><span>🎂</span><span>年齡：18 歲</span></div>
          <div class="scene-card-item"><span>📧</span><span>信箱：ming@mail.com</span></div>
          <div class="scene-card-item"><span>🏫</span><span>學校：台大</span></div>
        </div>
        <p class="text-lg font-bold text-emerald-300">這筆資料，該用什麼存？</p>
        <div v-if="!sceneAnswers['person']" class="flex gap-4">
          <button @click="answerScene('person', 'obj', 'obj', '答對了！描述「一位學生」的各種屬性 → 用物件 { }', '想想看：這是在描述「一個人」的各種屬性，還是收集很多人？')" class="pick-btn pick-obj">物件 { }</button>
          <button @click="answerScene('person', 'arr', 'obj', '', '想想看：這是在描述「一個人」的各種屬性，還是收集很多人？')" class="pick-btn pick-arr">陣列 [ ]</button>
        </div>
        <div v-else class="w-full max-w-sm rounded-xl bg-slate-900 p-4 animate-value-appear">
          <pre class="text-sm text-slate-300"><code>{ name: <span class="text-amber-300">"王小明"</span>, age: <span class="text-amber-300">18</span>, email: <span class="text-amber-300">"ming@mail.com"</span>, school: <span class="text-amber-300">"台大"</span> }</code></pre>
        </div>
      </div>
    </div>

    <div v-else-if="stepData.view === 'scene-product'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-violet-500/20 text-violet-300">情境</div>
        <h2 class="text-xl font-bold text-white">一個商品的資訊</h2>
        <div class="scene-card">
          <div class="scene-card-item"><span>📱</span><span>品名：iPhone 16</span></div>
          <div class="scene-card-item"><span>💰</span><span>價格：35,900 元</span></div>
          <div class="scene-card-item"><span>📦</span><span>庫存：52 台</span></div>
          <div class="scene-card-item"><span>⭐</span><span>評分：4.8</span></div>
        </div>
        <p class="text-lg font-bold text-emerald-300">這筆資料，該用什麼存？</p>
        <div v-if="!sceneAnswers['product']" class="flex gap-4">
          <button @click="answerScene('product', 'obj', 'obj', '答對了！描述「一個商品」的多種屬性 → 用物件 { }', '這裡描述的是「一個商品」的品名、價格、庫存⋯⋯是各種屬性，不是一堆同類的東西。')" class="pick-btn pick-obj">物件 { }</button>
          <button @click="answerScene('product', 'arr', 'obj', '', '這裡描述的是「一個商品」的品名、價格、庫存⋯⋯是各種屬性，不是一堆同類的東西。')" class="pick-btn pick-arr">陣列 [ ]</button>
        </div>
        <div v-else class="w-full max-w-sm rounded-xl bg-slate-900 p-4 animate-value-appear">
          <pre class="text-sm text-slate-300"><code>{ name: <span class="text-amber-300">"iPhone 16"</span>, price: <span class="text-amber-300">35900</span>, stock: <span class="text-amber-300">52</span>, rating: <span class="text-amber-300">4.8</span> }</code></pre>
        </div>
      </div>
    </div>

    <div v-else-if="stepData.view === 'scene-config'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-violet-500/20 text-violet-300">情境</div>
        <h2 class="text-xl font-bold text-white">一份網站設定</h2>
        <div class="scene-card">
          <div class="scene-card-item"><span>🎨</span><span>主題：深色模式</span></div>
          <div class="scene-card-item"><span>🌐</span><span>語言：繁體中文</span></div>
          <div class="scene-card-item"><span>🔤</span><span>字體大小：16px</span></div>
        </div>
        <p class="text-lg font-bold text-emerald-300">這筆資料，該用什麼存？</p>
        <div v-if="!sceneAnswers['config']" class="flex gap-4">
          <button @click="answerScene('config', 'obj', 'obj', '答對了！一份設定裡有多種「設定項目」→ 用物件 { }', '這份設定裡，每個選項都有名字（主題、語言、字體大小），適合用物件。')" class="pick-btn pick-obj">物件 { }</button>
          <button @click="answerScene('config', 'arr', 'obj', '', '這份設定裡，每個選項都有名字（主題、語言、字體大小），適合用物件。')" class="pick-btn pick-arr">陣列 [ ]</button>
        </div>
        <div v-else class="w-full max-w-sm rounded-xl bg-slate-900 p-4 animate-value-appear">
          <pre class="text-sm text-slate-300"><code>{ theme: <span class="text-amber-300">"dark"</span>, lang: <span class="text-amber-300">"zh-TW"</span>, fontSize: <span class="text-amber-300">16</span> }</code></pre>
        </div>
      </div>
    </div>

    <!-- Obj Pattern -->
    <div v-else-if="stepData.view === 'obj-pattern'" class="slide-page">
      <div class="wm">{ }</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">📦 發現了嗎？</h2>
        <div class="flex flex-col gap-3">
          <div class="pattern-row"><span class="text-violet-300">👤 一位學生</span><span class="text-slate-500">→ 姓名、年齡、信箱⋯</span></div>
          <div class="pattern-row"><span class="text-violet-300">📱 一個商品</span><span class="text-slate-500">→ 品名、價格、庫存⋯</span></div>
          <div class="pattern-row"><span class="text-violet-300">⚙️ 一份設定</span><span class="text-slate-500">→ 主題、語言、字體⋯</span></div>
        </div>
        <div class="max-w-md rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-5 text-center">
          <p class="text-lg font-bold text-emerald-300">共同點：描述「<span class="text-white">一個</span>東西」的各種屬性</p>
          <p class="mt-3 text-sm text-slate-300">看到「<strong class="text-white">一個 ___</strong>」有好幾種屬性 → 用 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-emerald-300">{ }</code></p>
        </div>
      </div>
    </div>

    <!-- ===== Phase 3: Array Scenarios ===== -->

    <div v-else-if="stepData.view === 'scene-classlist'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">情境</div>
        <h2 class="text-xl font-bold text-white">全班 30 位學生的名字</h2>
        <div class="scene-list">
          <div class="scene-list-item">王小明</div>
          <div class="scene-list-item">李小華</div>
          <div class="scene-list-item">張小美</div>
          <div class="scene-list-item text-slate-600">⋯ 還有 27 位</div>
        </div>
        <p class="text-lg font-bold text-emerald-300">這筆資料，該用什麼存？</p>
        <div v-if="!sceneAnswers['classlist']" class="flex gap-4">
          <button @click="answerScene('classlist', 'obj', 'arr', '', '想想看：這裡是「很多個名字」放在一起，不是描述一個人的屬性。')" class="pick-btn pick-obj">物件 { }</button>
          <button @click="answerScene('classlist', 'arr', 'arr', '答對了！30 個「同類的東西」（名字）排在一起 → 用陣列 [ ]', '')" class="pick-btn pick-arr">陣列 [ ]</button>
        </div>
        <div v-else class="w-full max-w-sm rounded-xl bg-slate-900 p-4 animate-value-appear">
          <pre class="text-sm text-slate-300"><code>[<span class="text-amber-300">"王小明"</span>, <span class="text-amber-300">"李小華"</span>, <span class="text-amber-300">"張小美"</span>, ...]</code></pre>
        </div>
      </div>
    </div>

    <div v-else-if="stepData.view === 'scene-playlist'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">情境</div>
        <h2 class="text-xl font-bold text-white">一份歌單</h2>
        <div class="scene-list">
          <div class="scene-list-item">🎵 告白氣球</div>
          <div class="scene-list-item">🎵 晴天</div>
          <div class="scene-list-item">🎵 稻香</div>
          <div class="scene-list-item">🎵 七里香</div>
        </div>
        <p class="text-lg font-bold text-emerald-300">這筆資料，該用什麼存？</p>
        <div v-if="!sceneAnswers['playlist']" class="flex gap-4">
          <button @click="answerScene('playlist', 'obj', 'arr', '', '歌單是很多首歌排在一起，有順序，同類的東西 → 用陣列。')" class="pick-btn pick-obj">物件 { }</button>
          <button @click="answerScene('playlist', 'arr', 'arr', '答對了！一堆「歌曲」有順序地排列 → 用陣列 [ ]', '')" class="pick-btn pick-arr">陣列 [ ]</button>
        </div>
        <div v-else class="w-full max-w-sm rounded-xl bg-slate-900 p-4 animate-value-appear">
          <pre class="text-sm text-slate-300"><code>[<span class="text-amber-300">"告白氣球"</span>, <span class="text-amber-300">"晴天"</span>, <span class="text-amber-300">"稻香"</span>, <span class="text-amber-300">"七里香"</span>]</code></pre>
        </div>
      </div>
    </div>

    <div v-else-if="stepData.view === 'scene-steps'" class="slide-page">
      <div class="wm">?</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-sky-500/20 text-sky-300">情境</div>
        <h2 class="text-xl font-bold text-white">煮泡麵的步驟</h2>
        <div class="scene-list">
          <div class="scene-list-item">1️⃣ 燒開水</div>
          <div class="scene-list-item">2️⃣ 放入麵條</div>
          <div class="scene-list-item">3️⃣ 加調味包</div>
          <div class="scene-list-item">4️⃣ 等三分鐘</div>
        </div>
        <p class="text-lg font-bold text-emerald-300">這筆資料，該用什麼存？</p>
        <div v-if="!sceneAnswers['steps']" class="flex gap-4">
          <button @click="answerScene('steps', 'obj', 'arr', '', '步驟有順序、一步一步來，是一堆「動作」排列在一起。')" class="pick-btn pick-obj">物件 { }</button>
          <button @click="answerScene('steps', 'arr', 'arr', '答對了！步驟有順序，一堆「動作」依序排列 → 用陣列 [ ]', '')" class="pick-btn pick-arr">陣列 [ ]</button>
        </div>
        <div v-else class="w-full max-w-sm rounded-xl bg-slate-900 p-4 animate-value-appear">
          <pre class="text-sm text-slate-300"><code>[<span class="text-amber-300">"燒開水"</span>, <span class="text-amber-300">"放入麵條"</span>, <span class="text-amber-300">"加調味包"</span>, <span class="text-amber-300">"等三分鐘"</span>]</code></pre>
        </div>
      </div>
    </div>

    <!-- Arr Pattern -->
    <div v-else-if="stepData.view === 'arr-pattern'" class="slide-page">
      <div class="wm">[ ]</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">📋 發現了嗎？</h2>
        <div class="flex flex-col gap-3">
          <div class="pattern-row"><span class="text-sky-300">📛 全班名字</span><span class="text-slate-500">→ 很多個名字排在一起</span></div>
          <div class="pattern-row"><span class="text-sky-300">🎵 一份歌單</span><span class="text-slate-500">→ 很多首歌排在一起</span></div>
          <div class="pattern-row"><span class="text-sky-300">🍜 做菜步驟</span><span class="text-slate-500">→ 很多個步驟排在一起</span></div>
        </div>
        <div class="max-w-md rounded-2xl border border-sky-500/40 bg-sky-500/10 px-6 py-5 text-center">
          <p class="text-lg font-bold text-sky-300">共同點：收集「<span class="text-white">一堆</span>同類的東西」</p>
          <p class="mt-3 text-sm text-slate-300">看到「<strong class="text-white">很多個 ___</strong>」排在一起 → 用 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-sky-300">[ ]</code></p>
        </div>
      </div>
    </div>

    <!-- ===== Phase 4: One Combo Example ===== -->

    <div v-else-if="stepData.view === 'combo-students'" class="slide-page">
      <div class="wm">COMBO</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">📊 進階：全班的成績單</h2>
        <p class="text-sm text-slate-400">每位學生有姓名和成績，全班有 30 位——這時候怎麼辦？</p>

        <div class="max-w-lg">
          <div v-if="comboStudentsPhase >= 1" class="mb-4 animate-value-appear">
            <p class="mb-2 text-sm text-emerald-300">每位學生 → 用<strong class="text-white">物件</strong>描述：</p>
            <div class="rounded-xl bg-slate-900 p-3">
              <pre class="text-sm text-slate-300"><code>{ name: <span class="text-amber-300">"小明"</span>, score: <span class="text-amber-300">90</span> }</code></pre>
            </div>
          </div>
          <div v-if="comboStudentsPhase >= 2" class="animate-value-appear">
            <p class="mb-2 text-sm text-sky-300">全班 30 位 → 用<strong class="text-white">陣列</strong>收集：</p>
            <div class="rounded-xl bg-slate-900 p-3">
              <pre class="text-sm text-slate-300"><code>[
  { name: <span class="text-amber-300">"小明"</span>, score: <span class="text-amber-300">90</span> },
  { name: <span class="text-amber-300">"小華"</span>, score: <span class="text-amber-300">85</span> },
  <span class="text-slate-500">// ... 還有 28 位</span>
]</code></pre>
            </div>
          </div>
        </div>

        <button v-if="comboStudentsPhase < 2" @click="comboStudentsPhase++; feedback = comboStudentsPhase === 1 ? '先想：一位學生有多種屬性 → 物件。' : '再想：很多位學生放一起 → 陣列裡放物件！'; feedbackType = 'success'" class="btn-action animate-bounce">
          {{ comboStudentsPhase === 0 ? '一位學生怎麼存？' : '全班怎麼存？' }}
        </button>

        <div v-if="comboStudentsPhase >= 2" class="max-w-md rounded-xl bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-300">
          物件和陣列也可以<strong class="text-white">組合使用</strong>！<br />
          知道有這種用法就好，之後實際寫的時候會越來越熟。
        </div>
      </div>
    </div>

    <!-- ===== Phase 5: Decision Rule ===== -->
    <div v-else-if="stepData.view === 'decision-rule'" class="slide-page">
      <div class="wm">RULE</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">🔑 判斷規則</h2>
        <div class="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/80 p-6">
          <div class="flex flex-col items-center gap-4">
            <div class="rounded-xl bg-slate-900 px-6 py-3 text-center text-sm font-bold text-white">拿到一筆資料</div>
            <div class="text-slate-500">↓</div>
            <div class="rounded-xl bg-violet-500/10 px-6 py-3 text-center text-sm text-violet-300">問自己：這是在描述<strong class="text-white">一個東西</strong>，<br />還是收集<strong class="text-white">一堆東西</strong>？</div>
            <div class="flex gap-8">
              <div class="flex flex-col items-center gap-2">
                <div class="text-slate-500">↙</div>
                <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center">
                  <p class="text-sm font-bold text-emerald-300">一個東西</p>
                  <p class="text-xs text-slate-400">有多種屬性</p>
                  <p class="mt-2 text-lg font-bold text-emerald-300">{ }</p>
                </div>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div class="text-slate-500">↘</div>
                <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-center">
                  <p class="text-sm font-bold text-sky-300">一堆東西</p>
                  <p class="text-xs text-slate-400">同類排在一起</p>
                  <p class="mt-2 text-lg font-bold text-sky-300">[ ]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="text-sm text-slate-400">記住這個判斷方式，接下來挑戰看看！</p>
      </div>
    </div>

    <!-- ===== Phase 6: Challenges (pure obj vs arr) ===== -->

    <div v-else-if="stepData.view === 'challenge-1'" class="slide-page">
      <div class="wm">1</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-amber-500/20 text-amber-300">挑戰 1/8</div>
        <h2 class="text-xl font-bold text-white">📖 一本書的資料</h2>
        <div class="scene-card">
          <div class="scene-card-item"><span>📕</span><span>書名：JavaScript 大全</span></div>
          <div class="scene-card-item"><span>✍️</span><span>作者：王小明</span></div>
          <div class="scene-card-item"><span>💰</span><span>價格：680 元</span></div>
        </div>
        <div v-if="!challengeAnswers['c1']" class="flex gap-4">
          <button @click="answerChallenge('c1', 'obj', 'obj', '答對了！描述「一本書」的屬性 → 物件 { }', '這裡描述的是「一本書」的多種屬性（書名、作者、價格）。')" class="pick-btn pick-obj">物件 { }</button>
          <button @click="answerChallenge('c1', 'arr', 'obj', '', '這裡描述的是「一本書」的多種屬性（書名、作者、價格）。')" class="pick-btn pick-arr">陣列 [ ]</button>
        </div>
      </div>
    </div>

    <div v-else-if="stepData.view === 'challenge-2'" class="slide-page">
      <div class="wm">2</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-amber-500/20 text-amber-300">挑戰 2/8</div>
        <h2 class="text-xl font-bold text-white">📛 班上同學的名字</h2>
        <div class="scene-list">
          <div class="scene-list-item">小明</div>
          <div class="scene-list-item">小華</div>
          <div class="scene-list-item">小美</div>
          <div class="scene-list-item text-slate-600">⋯ 還有很多</div>
        </div>
        <div v-if="!challengeAnswers['c2']" class="flex gap-4">
          <button @click="answerChallenge('c2', 'obj', 'arr', '', '這是很多個名字排在一起，不是描述一個人的屬性。')" class="pick-btn pick-obj">物件 { }</button>
          <button @click="answerChallenge('c2', 'arr', 'arr', '答對了！很多個「名字」排在一起 → 陣列 [ ]', '')" class="pick-btn pick-arr">陣列 [ ]</button>
        </div>
      </div>
    </div>

    <div v-else-if="stepData.view === 'challenge-3'" class="slide-page">
      <div class="wm">3</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-amber-500/20 text-amber-300">挑戰 3/8</div>
        <h2 class="text-xl font-bold text-white">🎬 一部電影的資料</h2>
        <div class="scene-card">
          <div class="scene-card-item"><span>🎬</span><span>片名：你的名字</span></div>
          <div class="scene-card-item"><span>🎭</span><span>導演：新海誠</span></div>
          <div class="scene-card-item"><span>⭐</span><span>評分：8.4</span></div>
          <div class="scene-card-item"><span>⏱️</span><span>片長：106 分鐘</span></div>
        </div>
        <div v-if="!challengeAnswers['c3']" class="flex gap-4">
          <button @click="answerChallenge('c3', 'obj', 'obj', '答對了！描述「一部電影」的各種屬性 → 物件 { }', '')" class="pick-btn pick-obj">物件 { }</button>
          <button @click="answerChallenge('c3', 'arr', 'obj', '', '這是描述一部電影的多種屬性，不是收集很多部電影。')" class="pick-btn pick-arr">陣列 [ ]</button>
        </div>
      </div>
    </div>

    <div v-else-if="stepData.view === 'challenge-4'" class="slide-page">
      <div class="wm">4</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-amber-500/20 text-amber-300">挑戰 4/8</div>
        <h2 class="text-xl font-bold text-white">📺 最近看過的影片</h2>
        <div class="scene-list">
          <div class="scene-list-item">🎬 你的名字</div>
          <div class="scene-list-item">🎬 鈴芽之旅</div>
          <div class="scene-list-item">🎬 天氣之子</div>
        </div>
        <div v-if="!challengeAnswers['c4']" class="flex gap-4">
          <button @click="answerChallenge('c4', 'obj', 'arr', '', '這裡是很多部片名排在一起，是收集一堆東西。')" class="pick-btn pick-obj">物件 { }</button>
          <button @click="answerChallenge('c4', 'arr', 'arr', '答對了！很多部「片名」排在一起 → 陣列 [ ]', '')" class="pick-btn pick-arr">陣列 [ ]</button>
        </div>
      </div>
    </div>

    <div v-else-if="stepData.view === 'challenge-5'" class="slide-page">
      <div class="wm">5</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-amber-500/20 text-amber-300">挑戰 5/8</div>
        <h2 class="text-xl font-bold text-white">🧾 一筆訂單</h2>
        <div class="scene-card">
          <div class="scene-card-item"><span>🔢</span><span>訂單編號：A2024001</span></div>
          <div class="scene-card-item"><span>👤</span><span>買家：王小明</span></div>
          <div class="scene-card-item"><span>💰</span><span>金額：1,280 元</span></div>
          <div class="scene-card-item"><span>📅</span><span>日期：2025/03/04</span></div>
        </div>
        <div v-if="!challengeAnswers['c5']" class="flex gap-4">
          <button @click="answerChallenge('c5', 'obj', 'obj', '答對了！描述「一筆訂單」的各種屬性 → 物件 { }', '')" class="pick-btn pick-obj">物件 { }</button>
          <button @click="answerChallenge('c5', 'arr', 'obj', '', '這是描述一筆訂單的多種屬性（編號、買家、金額⋯），不是收集很多筆。')" class="pick-btn pick-arr">陣列 [ ]</button>
        </div>
      </div>
    </div>

    <div v-else-if="stepData.view === 'challenge-6'" class="slide-page">
      <div class="wm">6</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-amber-500/20 text-amber-300">挑戰 6/8</div>
        <h2 class="text-xl font-bold text-white">🍽️ 菜單上的菜名</h2>
        <div class="scene-list">
          <div class="scene-list-item">🥩 牛排</div>
          <div class="scene-list-item">🍝 義大利麵</div>
          <div class="scene-list-item">🥗 凱薩沙拉</div>
          <div class="scene-list-item">🍲 南瓜濃湯</div>
        </div>
        <div v-if="!challengeAnswers['c6']" class="flex gap-4">
          <button @click="answerChallenge('c6', 'obj', 'arr', '', '這裡是很多道菜排在一起，是收集一堆品項。')" class="pick-btn pick-obj">物件 { }</button>
          <button @click="answerChallenge('c6', 'arr', 'arr', '答對了！很多道「菜名」排在一起 → 陣列 [ ]', '')" class="pick-btn pick-arr">陣列 [ ]</button>
        </div>
      </div>
    </div>

    <div v-else-if="stepData.view === 'challenge-7'" class="slide-page">
      <div class="wm">7</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-amber-500/20 text-amber-300">挑戰 7/8</div>
        <h2 class="text-xl font-bold text-white">🚗 一台車的資料</h2>
        <div class="scene-card">
          <div class="scene-card-item"><span>🏭</span><span>品牌：Toyota</span></div>
          <div class="scene-card-item"><span>🎨</span><span>顏色：白色</span></div>
          <div class="scene-card-item"><span>💰</span><span>價格：80 萬</span></div>
        </div>
        <div v-if="!challengeAnswers['c7']" class="flex gap-4">
          <button @click="answerChallenge('c7', 'obj', 'obj', '答對了！描述「一台車」的各種屬性 → 物件 { }', '')" class="pick-btn pick-obj">物件 { }</button>
          <button @click="answerChallenge('c7', 'arr', 'obj', '', '這是描述一台車的多種屬性（品牌、顏色、價格），不是收集很多台。')" class="pick-btn pick-arr">陣列 [ ]</button>
        </div>
      </div>
    </div>

    <div v-else-if="stepData.view === 'challenge-8'" class="slide-page">
      <div class="wm">8</div>
      <div class="flex flex-col items-center gap-6">
        <div class="scene-badge bg-amber-500/20 text-amber-300">挑戰 8/8</div>
        <h2 class="text-xl font-bold text-white">📝 待辦清單</h2>
        <div class="scene-list">
          <div class="scene-list-item">✏️ 寫作業</div>
          <div class="scene-list-item">🛒 買牛奶</div>
          <div class="scene-list-item">📧 回信</div>
          <div class="scene-list-item">🏃 跑步</div>
        </div>
        <div v-if="!challengeAnswers['c8']" class="flex gap-4">
          <button @click="answerChallenge('c8', 'obj', 'arr', '', '這是很多個待辦事項排在一起，是收集一堆東西。')" class="pick-btn pick-obj">物件 { }</button>
          <button @click="answerChallenge('c8', 'arr', 'arr', '全部答對！你已經完全掌握判斷方法了！', '')" class="pick-btn pick-arr">陣列 [ ]</button>
        </div>
      </div>
    </div>

    <!-- ===== Phase 7: Summary ===== -->

    <div v-else-if="stepData.view === 'summary-insight'" class="slide-page">
      <div class="wm">KEY</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">🔑 一句話記住</h2>
        <div class="flex flex-col gap-4 md:flex-row md:gap-8">
          <div class="w-72 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
            <p class="mb-2 text-3xl">📦</p>
            <p class="text-lg font-bold text-emerald-300">物件 { }</p>
            <p class="mt-3 text-base font-bold text-white">描述「一個東西」</p>
            <p class="mt-2 text-sm text-slate-400">一個人、一個商品、一筆訂單</p>
          </div>
          <div class="w-72 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-6 text-center">
            <p class="mb-2 text-3xl">📋</p>
            <p class="text-lg font-bold text-sky-300">陣列 [ ]</p>
            <p class="mt-3 text-base font-bold text-white">收集「一堆東西」</p>
            <p class="mt-2 text-sm text-slate-400">名字清單、歌單、步驟、待辦</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="stepData.view === 'summary-end'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">END</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-emerald-400 object-cover shadow-xl shadow-emerald-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-emerald-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">恭喜你通過了所有情境挑戰！🎉</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">下次拿到一筆資料，問自己：</p>
          <p class="mb-3 text-sm leading-relaxed text-white md:text-base"><strong>「這是一個東西？還是一堆東西？」</strong></p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">一個東西 → <code class="rounded bg-slate-700 px-1.5 py-0.5 text-emerald-300">{ }</code> ・ 一堆東西 → <code class="rounded bg-slate-700 px-1.5 py-0.5 text-sky-300">[ ]</code></p>
          <p class="text-xs text-slate-500 italic">「資料結構選對了，寫程式就順了。」—— 海姐</p>
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
  @apply rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40;
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
.scene-card-item {
  @apply flex items-center gap-3 rounded-lg bg-slate-900/60 px-4 py-2.5 text-sm text-white;
}
.scene-list {
  @apply w-full max-w-xs space-y-2;
}
.scene-list-item {
  @apply rounded-lg border border-sky-500/20 bg-sky-500/5 px-4 py-2.5 text-center text-sm text-white;
}
.pattern-row {
  @apply flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm;
}
.pick-btn {
  @apply rounded-xl border-2 px-6 py-3 text-sm font-bold transition-all active:scale-95;
}
.pick-obj {
  @apply border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/20;
}
.pick-arr {
  @apply border-sky-500/40 bg-sky-500/10 text-sky-300 hover:border-sky-400 hover:bg-sky-500/20;
}
</style>
