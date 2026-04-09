<script setup lang="ts">
/**
 * HTTP 五個動作：GET / POST / PUT / PATCH / DELETE + RESTful
 * 9 步驟：用餐廳動作建立 HTTP 方法的語意理解
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  { id: 0, view: 'welcome',          title: '歡迎',          desc: '服務生有五招' },
  { id: 1, view: 'methods-overview', title: '五個動作總覽',  desc: 'GET / POST / PUT / PATCH / DELETE' },
  { id: 2, view: 'get-action',       title: 'GET — 拿東西',  desc: '看菜單、拿水、看商品列表' },
  { id: 3, view: 'post-action',      title: 'POST — 送東西', desc: '下單、新增商品' },
  { id: 4, view: 'put-vs-patch',     title: 'PUT vs PATCH',  desc: '整份重寄 vs 改一行' },
  { id: 5, view: 'delete-action',    title: 'DELETE — 取消', desc: '取消訂單、刪除商品' },
  { id: 6, view: 'restful-rule',     title: 'RESTful',       desc: '同網址 + 不同方法 = 不同動作' },
  { id: 7, view: 'quiz-method',      title: '情境配對挑戰',  desc: '5 個情境分別用哪個方法？' },
  { id: 8, view: 'summary',          title: '結尾',          desc: '海姐結語' },
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

// 5 sub-quizzes
type Q = { id: string; scene: string; emoji: string; correct: string; success: string; error: string }
const QUIZ_LIST: Q[] = [
  { id: 'q1', scene: '看商品列表', emoji: '📋', correct: 'GET',    success: '對！拿東西用 GET',           error: '想想看：你只是「想看」資料，沒要送東西也沒要改' },
  { id: 'q2', scene: '加入購物車', emoji: '🛒', correct: 'POST',   success: '對！送一筆新東西用 POST',     error: '想想看：你要送一筆「新的訂單」過去' },
  { id: 'q3', scene: '改商品數量', emoji: '✏️', correct: 'PATCH',  success: '對！只改部分用 PATCH',        error: '想想看：你不是整筆重來，只是「改一個欄位」' },
  { id: 'q4', scene: '取消整個訂單', emoji: '🗑️', correct: 'DELETE', success: '對！刪東西用 DELETE',         error: '想想看：你要把東西「移除」' },
  { id: 'q5', scene: '整份個資重填', emoji: '📝', correct: 'PUT',    success: '對！整份重寄用 PUT',          error: '想想看：你要把整份資料「全部覆蓋」一次' },
]

const quizIndex = ref(0)
const quizCorrectCount = ref(0)
const allCorrect = computed(() => quizCorrectCount.value >= QUIZ_LIST.length)

function answerMethodQuiz(answer: string) {
  const q = QUIZ_LIST[quizIndex.value]
  if (answer === q.correct) {
    feedback.value = q.success
    feedbackType.value = 'success'
    quizCorrectCount.value++
    setTimeout(() => {
      if (quizIndex.value < QUIZ_LIST.length - 1) {
        quizIndex.value++
        feedback.value = ''
        feedbackType.value = 'neutral'
      }
    }, 900)
  } else {
    feedback.value = q.error
    feedbackType.value = 'error'
  }
}

const canGoNext = computed(() => {
  if (stepData.value.view === 'quiz-method') return allCorrect.value
  return true
})

const nextStepHint = computed(() => {
  if (stepData.value.view === 'quiz-method' && !allCorrect.value) return `答對 ${quizCorrectCount.value}/${QUIZ_LIST.length}`
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
    title="HTTP 五個動作"
    subtitle="服務生會做的五件事"
    icon="🍜"
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
    <!-- Feedback bar -->
    <div v-if="feedback" class="mx-auto max-w-3xl px-4 pt-4">
      <div class="rounded-xl border px-4 py-3 text-sm md:text-base" :class="feedbackClass">
        <span class="mr-2">{{ feedbackIcon }}</span>{{ feedback }}
      </div>
    </div>

    <!-- ===== Step 0: Welcome ===== -->
    <div v-if="stepData.view === 'welcome'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">METHOD</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-amber-400 object-cover shadow-xl shadow-amber-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-amber-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">服務生有<strong class="text-amber-300">五招</strong>👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">每一招都是一個 <strong class="text-white">HTTP 方法</strong>。學會這五招，你就會用 RESTful 思考。</p>
          <p class="text-xs text-slate-500 italic">「動作命名比函式命名還重要。」—— 海姐</p>
        </div>
      </div>
      <button @click="nextStep()" class="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-amber-500/25 transition-all hover:shadow-amber-500/40 animate-bounce">
        開始 →
      </button>
    </div>

    <!-- ===== Step 1: Methods Overview ===== -->
    <div v-else-if="stepData.view === 'methods-overview'" class="slide-page">
      <div class="wm">5</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">五個動作一次看</h2>
        <div class="grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-5">
          <div class="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-4 text-center animate-value-appear">
            <p class="text-2xl">📥</p>
            <p class="mt-2 text-sm font-bold text-sky-300">GET</p>
            <p class="mt-1 text-xs text-slate-400">拿東西</p>
          </div>
          <div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center animate-value-appear" style="animation-delay: 0.15s">
            <p class="text-2xl">📤</p>
            <p class="mt-2 text-sm font-bold text-emerald-300">POST</p>
            <p class="mt-1 text-xs text-slate-400">送東西</p>
          </div>
          <div class="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-center animate-value-appear" style="animation-delay: 0.3s">
            <p class="text-2xl">📝</p>
            <p class="mt-2 text-sm font-bold text-amber-300">PUT</p>
            <p class="mt-1 text-xs text-slate-400">整份換</p>
          </div>
          <div class="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-4 text-center animate-value-appear" style="animation-delay: 0.45s">
            <p class="text-2xl">✏️</p>
            <p class="mt-2 text-sm font-bold text-purple-300">PATCH</p>
            <p class="mt-1 text-xs text-slate-400">改一點</p>
          </div>
          <div class="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 text-center animate-value-appear" style="animation-delay: 0.6s">
            <p class="text-2xl">🗑️</p>
            <p class="mt-2 text-sm font-bold text-rose-300">DELETE</p>
            <p class="mt-1 text-xs text-slate-400">刪東西</p>
          </div>
        </div>
        <p class="text-sm text-slate-400">接下來一個一個看，每個都用「餐廳動作」幫你記住。</p>
      </div>
    </div>

    <!-- ===== Step 2: GET ===== -->
    <div v-else-if="stepData.view === 'get-action'" class="slide-page">
      <div class="wm">GET</div>
      <div class="flex flex-col items-center gap-6">
        <div class="rounded-full bg-sky-500/10 px-5 py-2 text-sm font-bold text-sky-300 border border-sky-500/30">📥 GET — 拿東西</div>
        <h2 class="text-xl font-bold text-white md:text-2xl">情境：在蝦皮看商品</h2>

        <div class="w-full max-w-2xl rounded-2xl border-2 border-sky-500/40 bg-slate-900 overflow-hidden">
          <div class="border-b border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-bold text-sky-300">📤 Request</div>
          <div class="p-4 font-mono text-xs md:text-sm text-slate-300">
            <span class="text-sky-400 font-bold">GET</span> <span class="text-amber-300">https://shopee.tw/api/v4/search/items?q=咖啡&limit=10</span>
          </div>
        </div>

        <div class="text-3xl text-slate-500 animate-bounce">⬇️</div>

        <div class="w-full max-w-2xl rounded-2xl border-2 border-emerald-500/40 bg-slate-900 overflow-hidden animate-value-appear" style="animation-delay: 0.3s">
          <div class="border-b border-slate-700 bg-slate-800/80 px-4 py-2 flex items-center justify-between">
            <span class="text-xs font-bold text-emerald-300">📥 Response</span>
            <span class="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">200 OK</span>
          </div>
          <pre class="p-4 text-xs text-slate-300"><code>{
  "items": [
    { "id": 101, "name": "濾掛咖啡 10入", "price": 290 },
    { "id": 102, "name": "義式濃縮豆 1kg", "price": 580 },
    { "id": 103, "name": "手沖壺組", "price": 1280 }
  ],
  "total": 3
}</code></pre>
        </div>

        <div class="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm text-slate-300 max-w-2xl">
          <strong class="text-sky-300">GET</strong> 只是「去拿資料回來」 — 不帶 body、不會改變 server 的東西。<br/>
          這就是你<strong class="text-white">每次打開蝦皮首頁</strong>背後在做的事。
        </div>
      </div>
    </div>

    <!-- ===== Step 3: POST ===== -->
    <div v-else-if="stepData.view === 'post-action'" class="slide-page">
      <div class="wm">POST</div>
      <div class="flex flex-col items-center gap-6">
        <div class="rounded-full bg-emerald-500/10 px-5 py-2 text-sm font-bold text-emerald-300 border border-emerald-500/30">📤 POST — 送東西</div>
        <h2 class="text-xl font-bold text-white md:text-2xl">情境：在蝦皮加入購物車</h2>

        <div class="w-full max-w-2xl rounded-2xl border-2 border-emerald-500/40 bg-slate-900 overflow-hidden">
          <div class="border-b border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-bold text-emerald-300">📤 Request</div>
          <div class="p-4 space-y-2">
            <div class="font-mono text-xs md:text-sm text-slate-300">
              <span class="text-emerald-400 font-bold">POST</span> <span class="text-amber-300">https://shopee.tw/api/v4/cart/add</span>
            </div>
            <div class="rounded bg-slate-800 p-3">
              <div class="text-xs text-slate-500 mb-1">body:</div>
              <pre class="text-xs text-slate-300"><code>{
  "productId": 101,
  "quantity": 2
}</code></pre>
            </div>
          </div>
        </div>

        <div class="text-3xl text-slate-500 animate-bounce">⬇️</div>

        <div class="w-full max-w-2xl rounded-2xl border-2 border-amber-500/40 bg-slate-900 overflow-hidden animate-value-appear" style="animation-delay: 0.3s">
          <div class="border-b border-slate-700 bg-slate-800/80 px-4 py-2 flex items-center justify-between">
            <span class="text-xs font-bold text-amber-300">📥 Response</span>
            <span class="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">201 Created</span>
          </div>
          <pre class="p-4 text-xs text-slate-300"><code>{
  "cartId": "abc-123",
  "message": "已加入購物車",
  "totalItems": 5
}</code></pre>
        </div>

        <div class="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm text-slate-300 max-w-2xl">
          <strong class="text-emerald-300">POST</strong> 要把<strong class="text-white">內容（body）</strong>送過去。<br/>
          每次你按「加入購物車」按鈕，前端就會送一個 POST 請求到 server。
        </div>
      </div>
    </div>

    <!-- ===== Step 4: PUT vs PATCH ===== -->
    <div v-else-if="stepData.view === 'put-vs-patch'" class="slide-page">
      <div class="wm">VS</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">PUT vs PATCH — 兩種「修改」</h2>
        <p class="text-sm text-slate-400">情境：你只想改 Facebook 上的「電話」欄位</p>

        <div class="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
          <!-- PUT -->
          <div class="rounded-2xl border-2 border-amber-500/40 bg-slate-900 overflow-hidden">
            <div class="border-b border-slate-700 bg-amber-500/10 px-4 py-2 text-center">
              <p class="text-base font-bold text-amber-300">📝 PUT — 整份重寄</p>
            </div>
            <div class="p-4 font-mono text-xs text-slate-300">
              <div class="mb-2"><span class="text-amber-400 font-bold">PUT</span> <span class="text-amber-300">/api/users/me</span></div>
              <div class="rounded bg-slate-800 p-2">
                <div class="text-xs text-slate-500 mb-1">body:</div>
                <pre class="text-xs"><code>{
  "name": "王小明",
  "phone": <span class="text-rose-300">"0912-345-678"</span>,
  "email": "abc@mail.com",
  "address": "高雄市...",
  "birthday": "1990-01-01",
  "gender": "M"
}</code></pre>
              </div>
              <p class="mt-3 text-xs text-slate-400">⚠️ 全部 6 個欄位都要重寄，<strong class="text-rose-300">少一個就會被清掉</strong></p>
            </div>
          </div>

          <!-- PATCH -->
          <div class="rounded-2xl border-2 border-purple-500/40 bg-slate-900 overflow-hidden">
            <div class="border-b border-slate-700 bg-purple-500/10 px-4 py-2 text-center">
              <p class="text-base font-bold text-purple-300">✏️ PATCH — 只寄改的</p>
            </div>
            <div class="p-4 font-mono text-xs text-slate-300">
              <div class="mb-2"><span class="text-purple-400 font-bold">PATCH</span> <span class="text-purple-300">/api/users/me</span></div>
              <div class="rounded bg-slate-800 p-2">
                <div class="text-xs text-slate-500 mb-1">body:</div>
                <pre class="text-xs"><code>{
  "phone": <span class="text-emerald-300">"0912-345-678"</span>
}</code></pre>
              </div>
              <p class="mt-3 text-xs text-slate-400">✅ 只寄要改的「電話」一行</p>
              <p class="mt-2 text-xs text-emerald-300">💡 比較省、比較安全</p>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-center text-sm text-slate-300 max-w-2xl">
          <strong class="text-white">大多數真實 API 都用 PATCH</strong>（IG、FB、Twitter、LiveJS）<br/>
          PUT 比較少見，用在「整份覆蓋」的場景。
        </div>
      </div>
    </div>

    <!-- ===== Step 5: DELETE ===== -->
    <div v-else-if="stepData.view === 'delete-action'" class="slide-page">
      <div class="wm">DEL</div>
      <div class="flex flex-col items-center gap-6">
        <div class="rounded-full bg-rose-500/10 px-5 py-2 text-sm font-bold text-rose-300 border border-rose-500/30">🗑️ DELETE — 取消</div>
        <h2 class="text-xl font-bold text-white md:text-2xl">情境：在蝦皮取消訂單</h2>

        <div class="w-full max-w-2xl rounded-2xl border-2 border-rose-500/40 bg-slate-900 overflow-hidden">
          <div class="border-b border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-bold text-rose-300">📤 Request</div>
          <div class="p-4 font-mono text-xs md:text-sm text-slate-300">
            <span class="text-rose-400 font-bold">DELETE</span> <span class="text-amber-300">https://shopee.tw/api/v4/orders/<span class="text-rose-300">123</span></span>
          </div>
          <div class="border-t border-slate-700 px-4 py-2 text-xs text-slate-500">
            💡 注意：DELETE 不用 body，要刪哪一筆寫在<strong class="text-white">網址尾巴</strong>
          </div>
        </div>

        <div class="text-3xl text-slate-500 animate-bounce">⬇️</div>

        <div class="w-full max-w-2xl rounded-2xl border-2 border-emerald-500/40 bg-slate-900 overflow-hidden animate-value-appear" style="animation-delay: 0.3s">
          <div class="border-b border-slate-700 bg-slate-800/80 px-4 py-2 flex items-center justify-between">
            <span class="text-xs font-bold text-emerald-300">📥 Response</span>
            <span class="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">200 OK</span>
          </div>
          <pre class="p-4 text-xs text-slate-300"><code>{
  "message": "訂單 #123 已取消",
  "refundStatus": "processing"
}</code></pre>
        </div>

        <div class="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm text-slate-300 max-w-2xl">
          <strong class="text-rose-300">DELETE</strong> 用在「移除東西」：取消訂單、刪除商品、清空購物車。
        </div>
      </div>
    </div>

    <!-- ===== Step 6: RESTful Rule ===== -->
    <div v-else-if="stepData.view === 'restful-rule'" class="slide-page">
      <div class="wm">REST</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">RESTful：同網址 + 不同方法</h2>
        <p class="max-w-xl text-center text-sm text-slate-400">網址<strong class="text-white">只描述資源</strong>，動作交給 HTTP 方法。</p>

        <div class="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-800/80 p-6">
          <p class="mb-4 text-center text-sm text-slate-400">資源：<code class="rounded bg-slate-900 px-2 py-1 text-emerald-300">/carts</code>（購物車）</p>

          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-3 rounded-lg bg-slate-900/60 px-4 py-2 animate-value-appear">
              <span class="rounded bg-sky-500/20 px-2 py-0.5 font-bold text-sky-300 min-w-[60px] text-center">GET</span>
              <code class="text-emerald-300">/carts</code>
              <span class="text-slate-400 ml-auto">看購物車</span>
            </div>
            <div class="flex items-center gap-3 rounded-lg bg-slate-900/60 px-4 py-2 animate-value-appear" style="animation-delay: 0.15s">
              <span class="rounded bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-300 min-w-[60px] text-center">POST</span>
              <code class="text-emerald-300">/carts</code>
              <span class="text-slate-400 ml-auto">加東西</span>
            </div>
            <div class="flex items-center gap-3 rounded-lg bg-slate-900/60 px-4 py-2 animate-value-appear" style="animation-delay: 0.3s">
              <span class="rounded bg-purple-500/20 px-2 py-0.5 font-bold text-purple-300 min-w-[60px] text-center">PATCH</span>
              <code class="text-emerald-300">/carts</code>
              <span class="text-slate-400 ml-auto">改數量</span>
            </div>
            <div class="flex items-center gap-3 rounded-lg bg-slate-900/60 px-4 py-2 animate-value-appear" style="animation-delay: 0.45s">
              <span class="rounded bg-rose-500/20 px-2 py-0.5 font-bold text-rose-300 min-w-[60px] text-center">DELETE</span>
              <code class="text-emerald-300">/carts</code>
              <span class="text-slate-400 ml-auto">清空</span>
            </div>
            <div class="flex items-center gap-3 rounded-lg bg-slate-900/60 px-4 py-2 animate-value-appear" style="animation-delay: 0.6s">
              <span class="rounded bg-rose-500/20 px-2 py-0.5 font-bold text-rose-300 min-w-[60px] text-center">DELETE</span>
              <code class="text-emerald-300">/carts/123</code>
              <span class="text-slate-400 ml-auto">刪一筆</span>
            </div>
          </div>
        </div>

        <p class="text-xs text-slate-500 italic">「網址都長一樣，差別只在 method。這就是 RESTful 的精神。」</p>
      </div>
    </div>

    <!-- ===== Step 7: Quiz Method ===== -->
    <div v-else-if="stepData.view === 'quiz-method'" class="slide-page">
      <div class="wm">QUIZ</div>
      <div class="flex flex-col items-center gap-6">
        <div class="rounded-full bg-amber-500/10 px-5 py-2 text-sm font-bold text-amber-300 border border-amber-500/30">
          🎯 情境配對 {{ Math.min(quizCorrectCount + 1, QUIZ_LIST.length) }} / {{ QUIZ_LIST.length }}
        </div>

        <div v-if="!allCorrect" class="w-full max-w-2xl">
          <div class="rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 p-6 text-center">
            <p class="text-5xl">{{ QUIZ_LIST[quizIndex].emoji }}</p>
            <p class="mt-3 text-xl font-bold text-white md:text-2xl">{{ QUIZ_LIST[quizIndex].scene }}</p>
            <p class="mt-2 text-sm text-slate-400">這個動作要用哪個 HTTP 方法？</p>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
            <button @click="answerMethodQuiz('GET')" class="pick-btn border-sky-500/40 bg-sky-500/10 text-sky-300 hover:border-sky-400 hover:bg-sky-500/20">GET</button>
            <button @click="answerMethodQuiz('POST')" class="pick-btn border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/20">POST</button>
            <button @click="answerMethodQuiz('PUT')" class="pick-btn border-amber-500/40 bg-amber-500/10 text-amber-300 hover:border-amber-400 hover:bg-amber-500/20">PUT</button>
            <button @click="answerMethodQuiz('PATCH')" class="pick-btn border-purple-500/40 bg-purple-500/10 text-purple-300 hover:border-purple-400 hover:bg-purple-500/20">PATCH</button>
            <button @click="answerMethodQuiz('DELETE')" class="pick-btn border-rose-500/40 bg-rose-500/10 text-rose-300 hover:border-rose-400 hover:bg-rose-500/20">DELETE</button>
          </div>
        </div>

        <div v-else class="w-full max-w-2xl rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-8 text-center animate-value-appear">
          <p class="text-5xl">🎉</p>
          <p class="mt-3 text-2xl font-bold text-emerald-300">5 題全對！</p>
          <p class="mt-2 text-sm text-slate-300">你已經會用 RESTful 思考了</p>
        </div>
      </div>
    </div>

    <!-- ===== Step 8: Summary ===== -->
    <div v-else-if="stepData.view === 'summary'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">END</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/praise.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-amber-400 object-cover shadow-xl shadow-amber-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-amber-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">五個方法收下了 🎉</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">記住口訣：</p>
          <ul class="mb-3 space-y-1 text-sm text-white md:text-base">
            <li>📥 拿東西 → <strong class="text-sky-300">GET</strong></li>
            <li>📤 送新東西 → <strong class="text-emerald-300">POST</strong></li>
            <li>✏️ 改部分 → <strong class="text-purple-300">PATCH</strong></li>
            <li>🗑️ 刪東西 → <strong class="text-rose-300">DELETE</strong></li>
          </ul>
          <p class="text-xs text-slate-500 italic">「下一站去看狀態碼。」—— 海姐</p>
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
  @apply rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all active:scale-95;
}
</style>
