<script setup lang="ts">
/**
 * API 與餐廳：為什麼需要 API
 * 7 步驟：用餐廳比喻建立 API 心智模型
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  { id: 0, view: 'welcome',         title: '歡迎',           desc: '今天來開一家網路餐廳' },
  { id: 1, view: 'hardcode-pain',   title: '為什麼要 API',   desc: '寫死的痛點 vs 資料庫的解法' },
  { id: 2, view: 'restaurant-map',  title: '餐廳全景圖',     desc: '四個角色對應你的程式世界' },
  { id: 3, view: 'real-services',   title: '你每天都在串 API', desc: '其實你天天都在用，只是不知道' },
  { id: 4, view: 'http-dialogue',   title: '一次完整對話',   desc: 'Request 與 Response' },
  { id: 5, view: 'request-anatomy', title: '請求的內容',     desc: '一張點餐單長什麼樣' },
  { id: 6, view: 'quiz-roles',      title: '角色配對',       desc: '你的程式對應哪個角色？' },
  { id: 7, view: 'summary',         title: '結尾',           desc: '海姐結語' },
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

// quiz
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
  const v = stepData.value.view
  if (v === 'quiz-roles') return quizAnswers.value['roles'] === 'customer'
  return true
})

const nextStepHint = computed(() => {
  if (stepData.value.view === 'quiz-roles' && !quizAnswers.value['roles']) return '選一個答案'
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
    title="API 與餐廳"
    subtitle="為什麼需要 API"
    icon="🍽️"
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
    <!-- Feedback bar -->
    <div v-if="feedback" class="mx-auto max-w-3xl px-4 pt-4">
      <div class="rounded-xl border px-4 py-3 text-sm md:text-base" :class="feedbackClass">
        <span class="mr-2">{{ feedbackIcon }}</span>{{ feedback }}
      </div>
    </div>

    <!-- ===== Step 0: Welcome ===== -->
    <div v-if="stepData.view === 'welcome'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">API</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-sky-400 object-cover shadow-xl shadow-sky-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-sky-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">嗨，我是<strong class="text-sky-300">海姐</strong> 👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">今天我們來「開一家網路餐廳」。</p>
          <p class="mb-3 text-sm leading-relaxed text-white md:text-base"><strong>API 是什麼？為什麼一定要它？</strong></p>
          <p class="text-xs text-slate-500 italic">「先理解角色，再學語法。」—— 海姐</p>
        </div>
      </div>
      <button @click="nextStep()" class="rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-sky-500/25 transition-all hover:shadow-sky-500/40 animate-bounce">
        開始 →
      </button>
    </div>

    <!-- ===== Step 1: Hardcode Pain ===== -->
    <div v-else-if="stepData.view === 'hardcode-pain'" class="slide-page">
      <div class="wm">PAIN</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">前五堂的資料都長這樣</h2>
        <div class="w-full max-w-2xl rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5">
          <pre class="text-xs text-slate-300 md:text-sm"><code>const products = [
  { name: <span class="text-amber-300">'拉麵'</span>, price: <span class="text-amber-300">180</span> },
  { name: <span class="text-amber-300">'炒飯'</span>, price: <span class="text-amber-300">150</span> }
];</code></pre>
          <p class="mt-3 text-center text-sm text-rose-300">⚠️ 寫死在程式碼裡</p>
        </div>

        <div class="w-full max-w-2xl space-y-2 text-sm text-slate-300 md:text-base">
          <p class="rounded-lg bg-slate-800/60 px-4 py-2">❓ 蝦皮的<strong class="text-rose-300">百萬商品</strong>，每一筆都寫程式裡？</p>
          <p class="rounded-lg bg-slate-800/60 px-4 py-2">❓ 上架新商品，要工程師<strong class="text-rose-300">改程式碼重新上線</strong>？</p>
          <p class="rounded-lg bg-slate-800/60 px-4 py-2">❓ 你昨天買的東西，<strong class="text-rose-300">明天怎麼還看得到</strong>？</p>
        </div>

        <div class="flex items-center gap-4 text-2xl">
          <span class="text-rose-300">寫死</span>
          <span class="text-slate-500">→</span>
          <div class="rounded-full bg-emerald-500/10 px-5 py-2 text-base font-bold text-emerald-300 border border-emerald-500/30">資料庫</div>
          <span class="text-slate-500">→</span>
          <div class="rounded-full bg-sky-500/10 px-5 py-2 text-base font-bold text-sky-300 border border-sky-500/30 animate-pulse">需要 API</div>
        </div>

        <p class="text-center text-sm text-slate-400 max-w-xl">資料其實住在「資料庫」裡。但程式不能直接碰資料庫（很危險），中間需要一個「翻譯員」 — 這就是 <strong class="text-sky-300">API</strong>。</p>
      </div>
    </div>

    <!-- ===== Step 2: Restaurant Map ===== -->
    <div v-else-if="stepData.view === 'restaurant-map'" class="slide-page">
      <div class="wm">MAP</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">想像一家餐廳</h2>
        <div class="grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          <div class="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-5 text-center animate-value-appear">
            <p class="text-5xl">🙋</p>
            <p class="mt-3 text-sm font-bold text-sky-300">客人</p>
            <p class="mt-1 text-xs text-slate-400">你的程式</p>
            <p class="mt-2 text-xs text-slate-500">（前端 / Client）</p>
          </div>
          <div class="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-center animate-value-appear" style="animation-delay: 0.2s">
            <p class="text-5xl">🧑‍🍳</p>
            <p class="mt-3 text-sm font-bold text-amber-300">服務生</p>
            <p class="mt-1 text-xs text-slate-400">API</p>
            <p class="mt-2 text-xs text-slate-500">（中間翻譯員）</p>
          </div>
          <div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-center animate-value-appear" style="animation-delay: 0.4s">
            <p class="text-5xl">🏭</p>
            <p class="mt-3 text-sm font-bold text-emerald-300">廚房</p>
            <p class="mt-1 text-xs text-slate-400">Server</p>
            <p class="mt-2 text-xs text-slate-500">（伺服器）</p>
          </div>
          <div class="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-5 text-center animate-value-appear" style="animation-delay: 0.6s">
            <p class="text-5xl">📦</p>
            <p class="mt-3 text-sm font-bold text-purple-300">倉庫</p>
            <p class="mt-1 text-xs text-slate-400">資料庫</p>
            <p class="mt-2 text-xs text-slate-500">（DB）</p>
          </div>
        </div>
        <div class="mt-4 max-w-xl rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-4 text-sm text-slate-300 md:text-base">
          <p>客人 <strong class="text-white">不會自己跑進廚房挖食材</strong>。</p>
          <p class="mt-2">客人跟服務生講話 → 服務生跑去廚房 → 廚房從倉庫拿食材做好 → 服務生送回桌上。</p>
        </div>
      </div>
    </div>

    <!-- ===== Step 3: Real Services ===== -->
    <div v-else-if="stepData.view === 'real-services'" class="slide-page">
      <div class="wm">REAL</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">你<span class="text-sky-300">每天</span>都在串 API</h2>
        <p class="text-sm text-slate-400">滑手機的時候，背後其實一直在發 API 請求</p>

        <div class="w-full max-w-2xl space-y-3">
          <!-- 蝦皮 -->
          <div class="flex items-center gap-4 rounded-xl border border-orange-500/40 bg-slate-900/80 p-3 animate-value-appear">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-2xl">🛒</div>
            <div class="flex-1">
              <div class="text-sm font-bold text-white md:text-base">在蝦皮搜尋商品</div>
              <div class="font-mono text-xs text-orange-300">GET https://shopee.tw/api/v4/search/items?q=咖啡</div>
            </div>
            <div class="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">200</div>
          </div>

          <!-- IG -->
          <div class="flex items-center gap-4 rounded-xl border border-pink-500/40 bg-slate-900/80 p-3 animate-value-appear" style="animation-delay: 0.1s">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-2xl">📷</div>
            <div class="flex-1">
              <div class="text-sm font-bold text-white md:text-base">滑 IG 動態</div>
              <div class="font-mono text-xs text-pink-300">GET https://i.instagram.com/api/v1/feed/timeline</div>
            </div>
            <div class="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">200</div>
          </div>

          <!-- YouTube -->
          <div class="flex items-center gap-4 rounded-xl border border-red-500/40 bg-slate-900/80 p-3 animate-value-appear" style="animation-delay: 0.2s">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600 text-2xl">▶️</div>
            <div class="flex-1">
              <div class="text-sm font-bold text-white md:text-base">看 YouTube 影片</div>
              <div class="font-mono text-xs text-red-300">GET https://www.youtube.com/youtubei/v1/player</div>
            </div>
            <div class="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">200</div>
          </div>

          <!-- Google Maps -->
          <div class="flex items-center gap-4 rounded-xl border border-emerald-500/40 bg-slate-900/80 p-3 animate-value-appear" style="animation-delay: 0.3s">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-2xl">🗺️</div>
            <div class="flex-1">
              <div class="text-sm font-bold text-white md:text-base">查 Google Maps 路線</div>
              <div class="font-mono text-xs text-emerald-300">GET https://maps.googleapis.com/maps/api/directions/json</div>
            </div>
            <div class="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">200</div>
          </div>

          <!-- 中央氣象 -->
          <div class="flex items-center gap-4 rounded-xl border border-sky-500/40 bg-slate-900/80 p-3 animate-value-appear" style="animation-delay: 0.4s">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-2xl">🌤️</div>
            <div class="flex-1">
              <div class="text-sm font-bold text-white md:text-base">查天氣 App</div>
              <div class="font-mono text-xs text-sky-300">GET https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001</div>
            </div>
            <div class="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">200</div>
          </div>

          <!-- LiveJS（今天的主角） -->
          <div class="flex items-center gap-4 rounded-xl border-2 border-amber-500/60 bg-amber-500/10 p-3 animate-value-appear shadow-lg shadow-amber-500/20" style="animation-delay: 0.5s">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-2xl">📦</div>
            <div class="flex-1">
              <div class="text-sm font-bold text-white md:text-base">⭐ 今天的主角：LiveJS 電商 API</div>
              <div class="font-mono text-xs text-amber-300">GET https://livejs-api.hexschool.io/api/livejs/v1/customer/{path}/products</div>
            </div>
            <div class="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">200</div>
          </div>
        </div>

        <p class="max-w-2xl text-center text-sm text-slate-400">
          打開 Chrome <kbd class="rounded bg-slate-700 px-2 py-0.5 text-xs text-white">F12</kbd> → Network 分頁，<strong class="text-white">隨便逛一個網站</strong>，你會看到上百筆 API 請求一直跑。
        </p>
      </div>
    </div>

    <!-- ===== Step 4: HTTP Dialogue ===== -->
    <div v-else-if="stepData.view === 'http-dialogue'" class="slide-page">
      <div class="wm">HTTP</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">一次 HTTP 對話長這樣</h2>
        <p class="text-sm text-slate-400">以「打開蝦皮商品頁」為例</p>

        <!-- Request -->
        <div class="w-full max-w-3xl rounded-2xl border-2 border-sky-500/40 bg-slate-900 overflow-hidden animate-value-appear">
          <div class="border-b border-slate-700 bg-slate-800/80 px-4 py-2 flex items-center gap-2">
            <span class="text-2xl">📤</span>
            <span class="text-xs font-bold text-sky-300">Request（你的瀏覽器送出去）</span>
          </div>
          <div class="p-4 font-mono text-xs md:text-sm text-slate-300 space-y-1">
            <div><span class="text-sky-400 font-bold">GET</span> <span class="text-amber-300">/api/v4/item/get?itemid=123&shopid=456</span> HTTP/1.1</div>
            <div><span class="text-slate-500">Host:</span> shopee.tw</div>
            <div><span class="text-slate-500">User-Agent:</span> Mozilla/5.0 ...</div>
          </div>
        </div>

        <div class="text-3xl text-slate-500 animate-bounce">⬇️</div>

        <!-- Response -->
        <div class="w-full max-w-3xl rounded-2xl border-2 border-emerald-500/40 bg-slate-900 overflow-hidden animate-value-appear" style="animation-delay: 0.4s">
          <div class="border-b border-slate-700 bg-slate-800/80 px-4 py-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-2xl">📥</span>
              <span class="text-xs font-bold text-emerald-300">Response（server 回給你）</span>
            </div>
            <span class="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">200 OK</span>
          </div>
          <pre class="p-4 text-xs text-slate-300"><code>{
  "item": {
    "name": "濾掛咖啡",
    "price": 290,
    "stock": 18
  }
}</code></pre>
        </div>

        <p class="max-w-2xl text-center text-sm text-slate-400">
          一次完整 HTTP 對話 = <strong class="text-sky-300">一個 Request</strong> + <strong class="text-emerald-300">一個 Response</strong>。<br/>
          每次串 API、每次打開網頁，背後都在發生這件事。
        </p>
      </div>
    </div>

    <!-- ===== Step 4: Request Anatomy ===== -->
    <div v-else-if="stepData.view === 'request-anatomy'" class="slide-page">
      <div class="wm">REQ</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">一張點餐單長什麼樣？</h2>

        <div class="w-full max-w-md rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 p-6 shadow-lg shadow-amber-500/10">
          <div class="mb-4 text-center text-2xl">📋</div>
          <div class="mb-3 border-b border-amber-500/30 pb-2 text-center text-xs font-bold text-amber-300">點餐單 / HTTP Request</div>

          <div class="space-y-3">
            <div class="rounded-lg bg-slate-900/60 px-4 py-2 animate-value-appear">
              <div class="text-xs text-slate-500">動作 (method)</div>
              <div class="text-sm font-bold text-sky-300">GET</div>
            </div>
            <div class="rounded-lg bg-slate-900/60 px-4 py-2 animate-value-appear" style="animation-delay: 0.2s">
              <div class="text-xs text-slate-500">餐廳地址 (URL)</div>
              <div class="text-sm font-bold text-emerald-300">https://api.example.com/menu</div>
            </div>
            <div class="rounded-lg bg-slate-900/40 px-4 py-2 opacity-50 animate-value-appear" style="animation-delay: 0.4s">
              <div class="text-xs text-slate-500">信封資訊 (headers)</div>
              <div class="text-sm text-slate-400 italic">下一站再講…</div>
            </div>
            <div class="rounded-lg bg-slate-900/40 px-4 py-2 opacity-50 animate-value-appear" style="animation-delay: 0.6s">
              <div class="text-xs text-slate-500">內容物 (body)</div>
              <div class="text-sm text-slate-400 italic">下一站再講…</div>
            </div>
          </div>
        </div>

        <p class="max-w-xl text-center text-sm text-slate-400">這堂課先記住前兩個（<strong class="text-sky-300">method</strong> + <strong class="text-emerald-300">URL</strong>），其他兩個之後寫 POST 才會用到。</p>
      </div>
    </div>

    <!-- ===== Step 5: Quiz Roles ===== -->
    <div v-else-if="stepData.view === 'quiz-roles'" class="slide-page">
      <div class="wm">QUIZ</div>
      <div class="flex flex-col items-center gap-6">
        <div class="rounded-full bg-amber-500/10 px-5 py-2 text-sm font-bold text-amber-300 border border-amber-500/30">🎯 角色配對挑戰</div>
        <h2 class="text-xl font-bold text-white md:text-2xl">「你寫的程式」對應餐廳的哪個角色？</h2>

        <div class="grid w-full max-w-2xl grid-cols-2 gap-4">
          <button @click="answerQuiz('roles', 'customer', 'customer', '對！你寫的程式就是發出請求的『客人』。', '客人才是發起請求的角色 — 想想是誰先說『我要點餐』')" class="pick-btn border-sky-500/40 bg-sky-500/10 text-sky-300 hover:border-sky-400 hover:bg-sky-500/20">
            🙋 客人
          </button>
          <button @click="answerQuiz('roles', 'waiter', 'customer', '對！你寫的程式就是發出請求的『客人』。', '服務生是中間人（API），不是發出請求的人')" class="pick-btn border-amber-500/40 bg-amber-500/10 text-amber-300 hover:border-amber-400 hover:bg-amber-500/20">
            🧑‍🍳 服務生
          </button>
          <button @click="answerQuiz('roles', 'kitchen', 'customer', '對！你寫的程式就是發出請求的『客人』。', '廚房是 server，是處理請求的地方，不是發出請求的')" class="pick-btn border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/20">
            🏭 廚房
          </button>
          <button @click="answerQuiz('roles', 'storage', 'customer', '對！你寫的程式就是發出請求的『客人』。', '倉庫是資料庫，連廚房都不直接碰它，更別說你的程式')" class="pick-btn border-purple-500/40 bg-purple-500/10 text-purple-300 hover:border-purple-400 hover:bg-purple-500/20">
            📦 倉庫
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Step 6: Summary ===== -->
    <div v-else-if="stepData.view === 'summary'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">END</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/proud.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-sky-400 object-cover shadow-xl shadow-sky-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-sky-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">你已經會用「餐廳」想像 API 了 🎉</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">記住三件事：</p>
          <ul class="mb-3 space-y-1 text-sm text-white md:text-base">
            <li>1. 你的程式 = <strong class="text-sky-300">客人</strong></li>
            <li>2. API = <strong class="text-amber-300">服務生</strong></li>
            <li>3. 一次 HTTP = <strong class="text-emerald-300">Request + Response</strong></li>
          </ul>
          <p class="text-xs text-slate-500 italic">「下一站去看服務生有哪五招。」—— 海姐</p>
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
.pick-btn {
  @apply rounded-xl border-2 px-6 py-4 text-base font-bold transition-all active:scale-95;
}
</style>
