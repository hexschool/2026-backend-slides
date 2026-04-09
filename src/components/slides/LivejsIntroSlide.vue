<script setup lang="ts">
/**
 * LiveJS 註冊與第一個範例
 * 7 步驟：從註冊到第一個 getProducts
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  { id: 0, view: 'welcome',           title: '歡迎',          desc: '真實電商 API 長這樣' },
  { id: 1, view: 'livejs-what',       title: 'LiveJS 是什麼', desc: '六角學院的練習用電商 API' },
  { id: 2, view: 'register-flow',     title: '拿你的 API Path', desc: '註冊取得專屬路徑' },
  { id: 3, view: 'env-file',          title: '建立 .env',     desc: '把秘密放進設定檔' },
  { id: 4, view: 'env-read',          title: '用 process.env 讀', desc: 'dotenv 把 .env 載入記憶體' },
  { id: 5, view: 'livejs-getproducts',title: '第一個 LiveJS 範例', desc: 'getProducts 完整示範' },
  { id: 6, view: 'summary',           title: '結尾',          desc: '海姐結語' },
]

const currentStep = ref(0)
const stepData = computed(() => STEPS[currentStep.value])

watch(() => stepData.value.view, () => {})

function nextStep() { if (currentStep.value < STEPS.length - 1) currentStep.value++ }
function prevStep() { if (currentStep.value > 0) currentStep.value-- }
function gotoStep(step: number) { if (step >= 0 && step < STEPS.length) currentStep.value = step }
</script>

<template>
  <InteractiveSlideTemplate
    title="LiveJS 電商 API"
    subtitle="從註冊到第一個 fetch"
    icon="🛒"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="emerald"
    @prev="prevStep"
    @next="nextStep"
    @goto="gotoStep"
    @complete="emit('complete')"
  >
    <!-- ===== Step 0: Welcome ===== -->
    <div v-if="stepData.view === 'welcome'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">live</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-emerald-400 object-cover shadow-xl shadow-emerald-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-emerald-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">JSONPlaceholder 練完了 👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">現在來看<strong class="text-emerald-300">真實的電商 API</strong>長什麼樣。</p>
          <p class="mb-3 text-sm leading-relaxed text-white md:text-base">這就是你<strong>作業</strong>會用到的 API。</p>
          <p class="text-xs text-slate-500 italic">「會 fetch GET 之後，練什麼 API 都一樣。」—— 海姐</p>
        </div>
      </div>
      <button @click="nextStep()" class="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 animate-bounce">
        開始 →
      </button>
    </div>

    <!-- ===== Step 1: LiveJS What ===== -->
    <div v-else-if="stepData.view === 'livejs-what'" class="slide-page">
      <div class="wm">LIVE</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">LiveJS 是什麼？</h2>

        <div class="w-full max-w-2xl rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-6">
          <div class="flex items-start gap-4">
            <div class="text-5xl">🛒</div>
            <div class="flex-1">
              <p class="text-lg font-bold text-white">六角學院 LiveJS 電商 API</p>
              <p class="mt-2 text-sm text-slate-300">練習用的真實電商 API，提供：</p>
              <ul class="mt-3 space-y-1 text-sm text-slate-300">
                <li>📋 產品列表（GET）</li>
                <li>🛒 購物車 CRUD（GET / POST / PATCH / DELETE）</li>
                <li>📝 訂單建立（POST）</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-sky-500/30 bg-sky-500/5 px-5 py-3 max-w-xl">
          <p class="text-sm text-sky-300 text-center">🔗 註冊網址</p>
          <p class="mt-1 text-center font-mono text-sm text-white">https://livejs-api.hexschool.io/</p>
        </div>

        <p class="max-w-xl text-center text-sm text-slate-400">你的作業就是用 fetch 操作這個 API。先註冊拿到自己的 API Path。</p>
      </div>
    </div>

    <!-- ===== Step 2: Register Flow ===== -->
    <div v-else-if="stepData.view === 'register-flow'" class="slide-page">
      <div class="wm">REG</div>
      <div class="flex flex-col items-center gap-5">
        <h2 class="text-xl font-bold text-white md:text-2xl">註冊取得你的 API Path</h2>
        <p class="text-sm text-slate-400">到 <code class="text-emerald-300">livejs-api.hexschool.io</code> 註冊登入後會看到</p>

        <!-- LiveJS 註冊頁 mockup -->
        <div class="w-full max-w-2xl rounded-2xl border-2 border-emerald-500/40 bg-slate-900 overflow-hidden shadow-2xl">
          <!-- Browser bar -->
          <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-3 py-2">
            <span class="h-2 w-2 rounded-full bg-rose-500"></span>
            <span class="h-2 w-2 rounded-full bg-amber-500"></span>
            <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
            <div class="ml-3 flex-1 rounded bg-slate-700 px-3 py-1 text-xs text-slate-300 font-mono">🔒 livejs-api.hexschool.io</div>
          </div>

          <!-- Page content mockup -->
          <div class="p-5 space-y-4">
            <div class="border-b border-slate-700 pb-3">
              <h3 class="text-base font-bold text-white">您目前已申請的 API 資訊</h3>
              <p class="text-xs text-slate-500 mt-1">目前您已申請 1 組 API 路徑</p>
            </div>

            <!-- API Key field -->
            <div class="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 animate-value-appear">
              <div class="text-xs text-amber-300 mb-1 font-bold">⚠️ 您的 API Key (Token)</div>
              <div class="flex items-center gap-2">
                <code class="flex-1 text-xs text-white font-mono break-all">zFH3XI3cmUYvMGPE2alRfmxpFFj2</code>
                <button class="rounded bg-slate-800 px-2 py-1 text-xs text-slate-300">複製</button>
              </div>
              <p class="text-xs text-slate-500 mt-1">請注意，部分 API 會需要使用</p>
            </div>

            <!-- API Path field -->
            <div class="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 animate-value-appear" style="animation-delay: 0.2s">
              <div class="text-xs text-emerald-300 mb-1 font-bold">🛣️ API 路徑（你自己取）</div>
              <div class="flex items-center gap-2">
                <code class="flex-1 text-sm text-white font-mono">gonsakon</code>
                <button class="rounded bg-slate-800 px-2 py-1 text-xs text-slate-300">複製</button>
              </div>
            </div>
          </div>
        </div>

        <div class="grid w-full max-w-2xl grid-cols-1 gap-3 md:grid-cols-2">
          <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm">
            <p class="font-bold text-emerald-300">📋 你會拿到兩樣東西</p>
            <p class="mt-1 text-xs text-slate-400">API Path（路徑） + API Key（token）</p>
          </div>
          <div class="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm">
            <p class="font-bold text-amber-300">💡 這堂課用不到 Token</p>
            <p class="mt-1 text-xs text-slate-400">客戶端 API 不需要，先設好未來會用</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 3: Env File ===== -->
    <div v-else-if="stepData.view === 'env-file'" class="slide-page">
      <div class="wm">.env</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">建立 .env 檔案</h2>
        <p class="text-sm text-slate-400">在專案根目錄建立 <code class="text-emerald-300">.env</code></p>

        <div class="w-full max-w-2xl rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-5">
          <div class="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <span>📄</span>
            <span class="font-mono">.env</span>
          </div>
          <pre class="text-sm md:text-base text-slate-300"><code><span class="text-amber-300">API_PATH</span>=<span class="text-emerald-300">your-api-path</span>
<span class="text-amber-300">API_KEY</span>=<span class="text-emerald-300">your-token</span></code></pre>
        </div>

        <div class="grid w-full max-w-2xl grid-cols-1 gap-3 md:grid-cols-2">
          <div class="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
            <p class="text-xs font-bold text-rose-300">❌ 為什麼不寫死？</p>
            <p class="mt-2 text-xs text-slate-400">推到 GitHub 全世界都看到 → 帳號被盜</p>
          </div>
          <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p class="text-xs font-bold text-emerald-300">✅ 為什麼用 .env？</p>
            <p class="mt-2 text-xs text-slate-400">秘密分離，程式碼可以開源不洩漏</p>
          </div>
        </div>

        <div class="rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-3 max-w-2xl text-sm text-amber-300">
          ⚠️ <strong>一定要記得</strong>：把 <code class="text-white">.env</code> 加進 <code class="text-white">.gitignore</code>，不然就白做了
        </div>
      </div>
    </div>

    <!-- ===== Step 4: Env Read ===== -->
    <div v-else-if="stepData.view === 'env-read'" class="slide-page">
      <div class="wm">env</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">用 process.env 讀取</h2>

        <div class="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <pre class="text-xs md:text-sm text-slate-300"><code><span class="text-slate-500">// 1. 載入 dotenv（一行帶過）</span>
require(<span class="text-amber-300">"dotenv"</span>).config();

<span class="text-slate-500">// 2. 從 process.env 讀取</span>
const <span class="text-sky-300">API_PATH</span> = process.env.<span class="text-amber-300">API_PATH</span>;
const <span class="text-sky-300">API_KEY</span> = process.env.<span class="text-amber-300">API_KEY</span>;

console.log(API_PATH); <span class="text-slate-500">// 你的 path</span></code></pre>
        </div>

        <div class="flex items-center gap-3 text-2xl">
          <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300">
            📄 .env
          </div>
          <span class="text-slate-500">→</span>
          <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-sm font-bold text-sky-300">
            dotenv 載入
          </div>
          <span class="text-slate-500">→</span>
          <div class="rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-bold text-purple-300">
            process.env
          </div>
        </div>

        <p class="max-w-xl text-center text-sm text-slate-400">作業專案已經裝好 dotenv，你只要在 <code class="text-emerald-300">homework.js</code> 最上面留著那行 <code class="text-emerald-300">require(...)</code> 就好。</p>
      </div>
    </div>

    <!-- ===== Step 5: getProducts Full Example ===== -->
    <div v-else-if="stepData.view === 'livejs-getproducts'" class="slide-page">
      <div class="wm">GET</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">第一個 LiveJS 範例 — getProducts</h2>

        <div class="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <pre class="text-xs md:text-sm text-slate-300"><code>require(<span class="text-amber-300">"dotenv"</span>).config();

const API_PATH = process.env.API_PATH;
const BASE_URL = <span class="text-amber-300">"https://livejs-api.hexschool.io"</span>;

<span class="text-sky-300">async</span> function getProducts() {
  const response = <span class="text-sky-300">await</span> fetch(
    <span class="text-amber-300">`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`</span>
  );
  const data = <span class="text-sky-300">await</span> response.json();
  <span class="text-purple-300">return</span> data.products;
}</code></pre>
        </div>

        <div class="grid w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-2">
          <div class="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
            <p class="text-xs font-bold text-sky-300">跟 JSONPlaceholder 差在哪？</p>
            <ul class="mt-2 space-y-1 text-xs text-slate-300">
              <li>1. 網址變長（用樣板字串組）</li>
              <li>2. API_PATH 從 .env 讀</li>
              <li>3. 回傳 <code class="text-emerald-300">data.products</code> 不是 <code>data</code></li>
            </ul>
          </div>
          <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p class="text-xs font-bold text-emerald-300">三步驟一樣</p>
            <ul class="mt-2 space-y-1 text-xs text-slate-300">
              <li>1. await fetch</li>
              <li>2. await response.json()</li>
              <li>3. return 出去</li>
            </ul>
          </div>
        </div>

        <p class="text-xs text-slate-500 italic">這就是你作業 7 個函式的第一個。</p>
      </div>
    </div>

    <!-- ===== Step 6: Summary ===== -->
    <div v-else-if="stepData.view === 'summary'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">END</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/praise.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-emerald-400 object-cover shadow-xl shadow-emerald-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-emerald-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">第一個函式搞定 🎉</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">下一站學「寫資料」：</p>
          <p class="mb-3 text-sm text-white">POST / PATCH / DELETE，還有兩個 LiveJS 特有的坑要踩。</p>
          <p class="text-xs text-slate-500 italic">「讀資料是基礎，寫資料才是真本事。」—— 海姐</p>
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
