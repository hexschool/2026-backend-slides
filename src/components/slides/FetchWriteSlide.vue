<script setup lang="ts">
/**
 * fetch 寫資料：POST / PATCH / DELETE + LiveJS 兩個坑
 * 13 步驟
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  { id: 0,  view: 'welcome',         title: '歡迎',           desc: '現在學送東西過去' },
  { id: 1,  view: 'get-vs-post',     title: '明信片 vs 包裹', desc: 'GET 跟 POST 差在哪' },
  { id: 2,  view: 'post-anatomy',    title: 'POST 三件套',    desc: 'method / headers / body' },
  { id: 3,  view: 'headers-card',    title: 'headers',        desc: '信封外面的資訊' },
  { id: 4,  view: 'body-stringify',  title: 'body + stringify', desc: '為什麼要把物件壓平' },
  { id: 5,  view: 'trap-data-wrap',  title: '⚠️ LiveJS 坑',  desc: 'body 要包一層 data' },
  { id: 6,  view: 'addtocart-full',  title: 'addToCart 完整範例', desc: '套用全部觀念' },
  { id: 7,  view: 'patch-intro',     title: 'PATCH',          desc: '跟 POST 99% 一樣' },
  { id: 8,  view: 'trap-cart-id',    title: '⚠️ PATCH 坑',   desc: 'id 不是 productId' },
  { id: 9,  view: 'delete-two',      title: 'DELETE 兩個端點', desc: '刪一筆 vs 清空' },
  { id: 10, view: 'quiz-body',       title: '快問快答',       desc: '哪個 body 是對的' },
  { id: 11, view: 'summary',         title: '結尾',           desc: '海姐結語' },
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
  if (stepData.value.view === 'quiz-body') return quizAnswers.value['body'] === 'B'
  return true
})

const nextStepHint = computed(() => {
  if (stepData.value.view === 'quiz-body' && !quizAnswers.value['body']) return '選一個答案'
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
    title="fetch 寫資料"
    subtitle="POST / PATCH / DELETE"
    icon="✏️"
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
    <div v-if="feedback" class="mx-auto max-w-3xl px-4 pt-4">
      <div class="rounded-xl border px-4 py-3 text-sm md:text-base" :class="feedbackClass">
        <span class="mr-2">{{ feedbackIcon }}</span>{{ feedback }}
      </div>
    </div>

    <!-- ===== Step 0: Welcome ===== -->
    <div v-if="stepData.view === 'welcome'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">POST</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-emerald-400 object-cover shadow-xl shadow-emerald-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-emerald-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">會 GET 之後，學<strong class="text-emerald-300">送東西過去</strong>👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">這份簡報是<strong class="text-white">作業的關鍵</strong> — 學完你就會寫剩下 6 個函式。</p>
          <p class="text-xs text-slate-500 italic">「會送東西，才算會用 API。」—— 海姐</p>
        </div>
      </div>
      <button @click="nextStep()" class="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 animate-bounce">
        開始 →
      </button>
    </div>

    <!-- ===== Step 1: GET vs POST ===== -->
    <div v-else-if="stepData.view === 'get-vs-post'" class="slide-page">
      <div class="wm">VS</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">明信片 vs 包裹</h2>

        <div class="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          <div class="rounded-2xl border-2 border-sky-500/40 bg-sky-500/5 p-5">
            <p class="text-center text-5xl">📮</p>
            <p class="mt-3 text-center text-lg font-bold text-sky-300">GET = 明信片</p>
            <ul class="mt-4 space-y-1 text-sm text-slate-300">
              <li>✓ 只寫地址</li>
              <li>✓ 不帶內容</li>
              <li>✓ 「給我這個」</li>
            </ul>
            <pre class="mt-3 rounded-lg bg-slate-900/60 p-3 text-xs text-slate-300"><code>await fetch(url);</code></pre>
          </div>
          <div class="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-5">
            <p class="text-center text-5xl">📦</p>
            <p class="mt-3 text-center text-lg font-bold text-emerald-300">POST = 包裹</p>
            <ul class="mt-4 space-y-1 text-sm text-slate-300">
              <li>✓ 寫地址</li>
              <li>✓ 帶信封資訊（headers）</li>
              <li>✓ 帶內容物（body）</li>
            </ul>
            <pre class="mt-3 rounded-lg bg-slate-900/60 p-3 text-xs text-slate-300"><code>await fetch(url, {
  method, headers, body
});</code></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 2: POST Anatomy ===== -->
    <div v-else-if="stepData.view === 'post-anatomy'" class="slide-page">
      <div class="wm">3</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">POST 三件套</h2>

        <div class="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <pre class="text-xs md:text-sm text-slate-300"><code>await fetch(url, {
  <span class="text-amber-300">method</span>: <span class="text-emerald-300">'POST'</span>,
  <span class="text-amber-300">headers</span>: { <span class="text-emerald-300">'Content-Type'</span>: <span class="text-emerald-300">'application/json'</span> },
  <span class="text-amber-300">body</span>: JSON.stringify({ ... })
});</code></pre>
        </div>

        <div class="grid w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-3">
          <div class="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-center animate-value-appear">
            <p class="text-2xl">🎯</p>
            <p class="mt-2 text-sm font-bold text-amber-300">method</p>
            <p class="mt-1 text-xs text-slate-400">要做哪個動作</p>
          </div>
          <div class="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-center animate-value-appear" style="animation-delay: 0.15s">
            <p class="text-2xl">✉️</p>
            <p class="mt-2 text-sm font-bold text-amber-300">headers</p>
            <p class="mt-1 text-xs text-slate-400">信封外面的資訊</p>
          </div>
          <div class="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-center animate-value-appear" style="animation-delay: 0.3s">
            <p class="text-2xl">📦</p>
            <p class="mt-2 text-sm font-bold text-amber-300">body</p>
            <p class="mt-1 text-xs text-slate-400">真正要送的內容</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 3: Headers ===== -->
    <div v-else-if="stepData.view === 'headers-card'" class="slide-page">
      <div class="wm">✉️</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">headers — 信封外面的資訊</h2>

        <div class="relative w-full max-w-md rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 p-6 shadow-xl">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-4 py-1 text-xs font-bold text-white">📬 信封外面</div>
          <div class="mt-2 space-y-2 text-sm text-slate-300">
            <p class="rounded-lg bg-slate-900/60 px-4 py-2">
              <span class="text-xs text-slate-500">📮 收件人：</span>
              <span class="text-emerald-300">https://api.example.com</span>
            </p>
            <p class="rounded-lg bg-slate-900/60 px-4 py-2">
              <span class="text-xs text-slate-500">📦 內容物類型：</span>
              <span class="text-amber-300">application/json</span>
            </p>
          </div>
        </div>

        <div class="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 max-w-2xl text-sm text-slate-300">
          <p>POST 一定要加 <code class="text-emerald-300">'Content-Type': 'application/json'</code></p>
          <p class="mt-2 text-xs text-slate-400">這在告訴 server：「我寄的內容是 JSON 格式」。沒寫的話 server 不知道怎麼解析，會報錯。</p>
        </div>
      </div>
    </div>

    <!-- ===== Step 4: Body + Stringify ===== -->
    <div v-else-if="stepData.view === 'body-stringify'" class="slide-page">
      <div class="wm">📦</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">body + JSON.stringify</h2>

        <div class="flex w-full max-w-3xl items-center justify-center gap-4">
          <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
            <p class="text-3xl">📦</p>
            <p class="mt-2 text-xs text-emerald-300">物件</p>
            <pre class="mt-2 text-xs text-slate-300"><code>{ id: 'abc',
  qty: 2 }</code></pre>
          </div>
          <div class="text-center">
            <div class="text-3xl">🤖</div>
            <p class="text-xs text-slate-400 mt-1">壓平機</p>
            <p class="text-xs text-amber-300 font-bold">stringify</p>
          </div>
          <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 text-center">
            <p class="text-3xl">📜</p>
            <p class="mt-2 text-xs text-sky-300">字串</p>
            <pre class="mt-2 text-xs text-slate-300"><code>'{"id":"abc",
"qty":2}'</code></pre>
          </div>
        </div>

        <div class="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
          <div class="rounded-2xl border-2 border-rose-500/40 bg-rose-500/5 p-4">
            <p class="text-xs font-bold text-rose-300 mb-2">❌ 直接傳物件</p>
            <pre class="text-xs text-slate-300"><code>body: { id: 'abc' }</code></pre>
            <p class="mt-2 text-xs text-slate-400">壞掉</p>
          </div>
          <div class="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-4">
            <p class="text-xs font-bold text-emerald-300 mb-2">✅ stringify 後傳</p>
            <pre class="text-xs text-slate-300"><code>body: JSON.stringify({ id: 'abc' })</code></pre>
            <p class="mt-2 text-xs text-slate-400">OK</p>
          </div>
        </div>

        <p class="max-w-xl text-center text-sm text-slate-400">為什麼要 stringify？因為<strong class="text-white">網路上只能傳字串</strong>。物件要先壓平變字串才能寄出去。</p>
      </div>
    </div>

    <!-- ===== Step 5: Trap — data wrap ===== -->
    <div v-else-if="stepData.view === 'trap-data-wrap'" class="slide-page">
      <div class="wm">⚠️</div>
      <div class="flex flex-col items-center gap-5">
        <div class="rounded-full bg-rose-500/10 px-5 py-2 text-sm font-bold text-rose-300 border border-rose-500/30">⚠️ LiveJS 第一個坑</div>
        <h2 class="text-xl font-bold text-white md:text-2xl">body 要包一層 <code class="text-amber-300">data</code></h2>

        <div class="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
          <!-- 錯誤版 -->
          <div class="rounded-2xl border-2 border-rose-500/40 bg-slate-900 overflow-hidden">
            <div class="border-b border-slate-700 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300">❌ 直接傳（漏包 data）</div>
            <div class="p-4">
              <pre class="text-xs text-slate-300"><code>body: JSON.stringify({
  productId: <span class="text-amber-300">'abc'</span>,
  quantity: <span class="text-amber-300">2</span>
})</code></pre>
            </div>
            <!-- server 拒絕回應 -->
            <div class="border-t border-slate-700 bg-rose-500/5 p-3">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-rose-300">📥 Server 回應</span>
                <span class="rounded bg-rose-500/30 px-2 py-0.5 text-xs font-bold text-rose-300">400 Bad Request</span>
              </div>
              <pre class="text-xs text-rose-300"><code>{
  "status": false,
  "message": "請傳入正確的格式"
}</code></pre>
            </div>
          </div>

          <!-- 正確版 -->
          <div class="rounded-2xl border-2 border-emerald-500/40 bg-slate-900 overflow-hidden">
            <div class="border-b border-slate-700 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300">✅ 包一層 data</div>
            <div class="p-4">
              <pre class="text-xs text-slate-300"><code>body: JSON.stringify({
  <span class="text-amber-300">data</span>: {
    productId: <span class="text-amber-300">'abc'</span>,
    quantity: <span class="text-amber-300">2</span>
  }
})</code></pre>
            </div>
            <!-- server 成功回應 -->
            <div class="border-t border-slate-700 bg-emerald-500/5 p-3">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-emerald-300">📥 Server 回應</span>
                <span class="rounded bg-emerald-500/30 px-2 py-0.5 text-xs font-bold text-emerald-300">200 OK</span>
              </div>
              <pre class="text-xs text-emerald-300"><code>{
  "status": true,
  "carts": [...],
  "total": 580
}</code></pre>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-3 max-w-2xl text-sm text-amber-300 text-center">
          ⚠️ 沒包 data 直接得到 <strong class="text-white">400 Bad Request</strong> — 學生踩到這坑會卡很久，記得包好包滿。
        </div>
      </div>
    </div>

    <!-- ===== Step 6: addToCart Full ===== -->
    <div v-else-if="stepData.view === 'addtocart-full'" class="slide-page">
      <div class="wm">add</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">addToCart 完整範例</h2>

        <div class="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <pre class="text-xs md:text-sm text-slate-300"><code><span class="text-sky-300">async</span> function addToCart(productId, quantity) {
  const response = <span class="text-sky-300">await</span> fetch(
    <span class="text-amber-300">`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`</span>,
    {
      <span class="text-purple-300">method</span>: <span class="text-emerald-300">'POST'</span>,
      <span class="text-purple-300">headers</span>: { <span class="text-emerald-300">'Content-Type'</span>: <span class="text-emerald-300">'application/json'</span> },
      <span class="text-purple-300">body</span>: JSON.stringify({ <span class="text-amber-300">data</span>: { productId, quantity } })
    }
  );
  const data = <span class="text-sky-300">await</span> response.json();
  <span class="text-purple-300">return</span> data;
}</code></pre>
        </div>

        <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-3 max-w-2xl text-sm text-emerald-300">
          ✨ 這個 pattern 看熟，剩下的 PATCH / DELETE 都是它的變化型
        </div>
      </div>
    </div>

    <!-- ===== Step 7: PATCH Intro ===== -->
    <div v-else-if="stepData.view === 'patch-intro'" class="slide-page">
      <div class="wm">PATCH</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">PATCH — 跟 POST 99% 一樣</h2>

        <div class="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <pre class="text-xs md:text-sm text-slate-300"><code><span class="text-sky-300">async</span> function updateCartItem(cartId, quantity) {
  const response = <span class="text-sky-300">await</span> fetch(
    <span class="text-amber-300">`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`</span>,
    {
      method: <span class="text-rose-300 font-bold">'PATCH'</span>,  <span class="text-slate-500">// ← 唯一不同 1</span>
      headers: { <span class="text-emerald-300">'Content-Type'</span>: <span class="text-emerald-300">'application/json'</span> },
      body: JSON.stringify({ data: { <span class="text-rose-300 font-bold">id</span>: cartId, quantity } })
                                      <span class="text-slate-500">// ↑ 唯一不同 2</span>
    }
  );
  return <span class="text-sky-300">await</span> response.json();
}</code></pre>
        </div>

        <div class="flex items-center gap-4 text-sm">
          <div class="rounded-full bg-emerald-500/20 px-4 py-2 text-emerald-300 font-bold">複製 POST</div>
          <span class="text-slate-500">→</span>
          <div class="rounded-full bg-rose-500/20 px-4 py-2 text-rose-300 font-bold">改 method 跟 body</div>
          <span class="text-slate-500">→</span>
          <div class="rounded-full bg-sky-500/20 px-4 py-2 text-sky-300 font-bold">完成</div>
        </div>
      </div>
    </div>

    <!-- ===== Step 8: Trap — cart id ===== -->
    <div v-else-if="stepData.view === 'trap-cart-id'" class="slide-page">
      <div class="wm">⚠️</div>
      <div class="flex flex-col items-center gap-6">
        <div class="rounded-full bg-rose-500/10 px-5 py-2 text-sm font-bold text-rose-300 border border-rose-500/30">⚠️ LiveJS 第二個坑</div>
        <h2 class="text-xl font-bold text-white md:text-2xl">PATCH 的 <code class="text-amber-300">id</code> 不是 productId</h2>

        <div class="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          <div class="rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 p-5 text-center">
            <p class="text-5xl">🐱</p>
            <p class="mt-3 text-base font-bold text-amber-300">「橘貓」這個品種</p>
            <p class="mt-2 text-xs text-slate-400">= productId（商品的 id）</p>
            <p class="mt-3 text-xs text-rose-300">如果用品種 → 會把全世界橘貓都改了</p>
          </div>
          <div class="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-5 text-center">
            <p class="text-5xl">🐱 #001</p>
            <p class="mt-3 text-base font-bold text-emerald-300">「我家編號 #001 那隻」</p>
            <p class="mt-2 text-xs text-slate-400">= cartId（購物車的 id）</p>
            <p class="mt-3 text-xs text-emerald-300">→ 只改你想改的那一筆</p>
          </div>
        </div>

        <div class="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 max-w-2xl text-sm text-slate-300">
          📌 想改購物車數量，要用「<strong class="text-emerald-300">購物車那一筆的 id</strong>」，不是「商品的 id」。
        </div>

        <div class="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-4">
          <p class="text-xs text-slate-400 mb-2">怎麼拿到 cartId？先呼叫 getCart 拉購物車：</p>
          <pre class="text-xs text-slate-300"><code>const cart = <span class="text-sky-300">await</span> getCart();
const cartId = cart.carts[0].id;  <span class="text-slate-500">// ← 從這裡拿</span>
<span class="text-sky-300">await</span> updateCartItem(cartId, 5);</code></pre>
        </div>
      </div>
    </div>

    <!-- ===== Step 9: DELETE two ===== -->
    <div v-else-if="stepData.view === 'delete-two'" class="slide-page">
      <div class="wm">DEL</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">DELETE — 兩個端點</h2>
        <p class="text-sm text-slate-400">DELETE 不用 body（你只是要刪東西，不用送內容過去）</p>

        <div class="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          <div class="rounded-2xl border-2 border-rose-500/40 bg-rose-500/5 p-5">
            <p class="text-center text-3xl">🗑️</p>
            <p class="mt-3 text-center text-base font-bold text-rose-300">刪一筆</p>
            <pre class="mt-3 text-xs text-slate-300"><code>fetch(
  <span class="text-amber-300">`...carts/<span class="text-rose-300">${cartId}</span>`</span>,
  { method: <span class="text-emerald-300">'DELETE'</span> }
);</code></pre>
            <p class="mt-3 text-center text-xs text-slate-400">URL 結尾<strong class="text-rose-300">有 cartId</strong></p>
          </div>
          <div class="rounded-2xl border-2 border-rose-500/40 bg-rose-500/5 p-5">
            <p class="text-center text-3xl">🧹</p>
            <p class="mt-3 text-center text-base font-bold text-rose-300">清空全部</p>
            <pre class="mt-3 text-xs text-slate-300"><code>fetch(
  <span class="text-amber-300">`...carts`</span>,
  { method: <span class="text-emerald-300">'DELETE'</span> }
);</code></pre>
            <p class="mt-3 text-center text-xs text-slate-400">URL 結尾<strong class="text-rose-300">沒有 cartId</strong></p>
          </div>
        </div>

        <p class="text-xs text-slate-500 italic">差別只在 URL 結尾有沒有帶 id。</p>
      </div>
    </div>

    <!-- ===== Step 10: Quiz Body ===== -->
    <div v-else-if="stepData.view === 'quiz-body'" class="slide-page">
      <div class="wm">QUIZ</div>
      <div class="flex flex-col items-center gap-6">
        <div class="rounded-full bg-amber-500/10 px-5 py-2 text-sm font-bold text-amber-300 border border-amber-500/30">🎯 快問快答</div>
        <h2 class="text-xl font-bold text-white md:text-2xl">LiveJS 加入購物車，哪個 body 是對的？</h2>

        <div class="w-full max-w-2xl space-y-3">
          <button @click="answerQuiz('body', 'A', 'B', '', '少了 LiveJS 規定要包的那一層')" class="w-full rounded-xl border-2 border-rose-500/40 bg-rose-500/5 p-4 text-left transition-all hover:border-rose-400 hover:bg-rose-500/10 active:scale-95">
            <p class="text-xs text-rose-300 mb-2 font-bold">A</p>
            <pre class="text-xs text-slate-300"><code>JSON.stringify({ productId: 'abc', quantity: 2 })</code></pre>
          </button>
          <button @click="answerQuiz('body', 'B', 'B', '對！LiveJS 規定要包一層 data，這是常見的 API pattern', '')" class="w-full rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 p-4 text-left transition-all hover:border-emerald-400 hover:bg-emerald-500/10 active:scale-95">
            <p class="text-xs text-emerald-300 mb-2 font-bold">B</p>
            <pre class="text-xs text-slate-300"><code>JSON.stringify({ data: { productId: 'abc', quantity: 2 } })</code></pre>
          </button>
          <button @click="answerQuiz('body', 'C', 'B', '', 'LiveJS 不接受陣列格式，看講義裡的範例')" class="w-full rounded-xl border-2 border-amber-500/40 bg-amber-500/5 p-4 text-left transition-all hover:border-amber-400 hover:bg-amber-500/10 active:scale-95">
            <p class="text-xs text-amber-300 mb-2 font-bold">C</p>
            <pre class="text-xs text-slate-300"><code>JSON.stringify([{ productId: 'abc', quantity: 2 }])</code></pre>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Step 11: Summary ===== -->
    <div v-else-if="stepData.view === 'summary'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">END</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/proud.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-emerald-400 object-cover shadow-xl shadow-emerald-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-emerald-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">寫資料學會了 🎉</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">作業 7 個函式你已經會 6 個 pattern：</p>
          <ul class="mb-3 space-y-1 text-sm text-white md:text-base">
            <li>✅ getProducts / getCart → GET</li>
            <li>✅ addToCart → POST</li>
            <li>✅ updateCartItem → PATCH</li>
            <li>✅ removeCartItem / clearCart → DELETE</li>
          </ul>
          <p class="text-xs text-slate-500 italic">「最後一站學錯誤處理，就能交作業了。」—— 海姐</p>
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
