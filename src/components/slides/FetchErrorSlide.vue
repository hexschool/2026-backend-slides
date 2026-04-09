<script setup lang="ts">
/**
 * 錯誤處理雙保險：try/catch + response.ok
 * 8 步驟
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  { id: 0, view: 'welcome',          title: '歡迎',          desc: '當事情壞掉怎麼辦' },
  { id: 1, view: 'two-errors',       title: '兩種錯誤',      desc: '網路斷 vs server 拒收' },
  { id: 2, view: 'trycatch-intro',   title: 'try/catch',     desc: '第一道防線' },
  { id: 3, view: 'response-ok',      title: 'response.ok',   desc: '第二道防線' },
  { id: 4, view: 'full-pattern',     title: '雙保險完整範例', desc: '兩道防線一起用' },
  { id: 5, view: 'success-error',    title: '統一回傳格式',  desc: '給作業 getProductsSafe 用' },
  { id: 6, view: 'quiz-which',       title: '快問快答',      desc: '這種錯用哪個接' },
  { id: 7, view: 'summary',          title: '結尾',          desc: '海姐結語' },
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
  if (stepData.value.view === 'quiz-which') return quizAnswers.value['which'] === 'catch'
  return true
})

const nextStepHint = computed(() => {
  if (stepData.value.view === 'quiz-which' && !quizAnswers.value['which']) return '選一個答案'
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
    title="錯誤處理雙保險"
    subtitle="try/catch + response.ok"
    icon="🛡️"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="purple"
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
      <div class="wm">SAFE</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-purple-400 object-cover shadow-xl shadow-purple-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-purple-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">最後一塊：當事情壞掉怎麼辦 👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">真實世界網路會斷、URL 會打錯、server 會掛。</p>
          <p class="mb-3 text-sm text-white">這份學完，你就能交作業了。</p>
          <p class="text-xs text-slate-500 italic">「會處理錯誤，才是工程師。」—— 海姐</p>
        </div>
      </div>
      <button @click="nextStep()" class="rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-purple-500/25 transition-all hover:shadow-purple-500/40 animate-bounce">
        開始 →
      </button>
    </div>

    <!-- ===== Step 1: Two Errors ===== -->
    <div v-else-if="stepData.view === 'two-errors'" class="slide-page">
      <div class="wm">2</div>
      <div class="flex flex-col items-center gap-5">
        <h2 class="text-xl font-bold text-white md:text-2xl">⚠️ 錯誤有兩種，要分開防</h2>
        <p class="text-sm text-slate-400">打開 DevTools 觀察一下，這兩種錯誤長得不一樣</p>

        <!-- DevTools mockup with two error types -->
        <div class="w-full max-w-3xl rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-2xl">
          <!-- Tab bar -->
          <div class="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2 text-xs text-slate-400">
            <span>Elements</span>
            <span>Console</span>
            <span class="border-b-2 border-cyan-400 pb-1 font-bold text-cyan-400">Network</span>
            <span class="ml-auto text-slate-500">Chrome DevTools</span>
          </div>

          <!-- Column header -->
          <div class="grid grid-cols-12 gap-2 border-b border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-bold text-slate-400">
            <div class="col-span-2">Status</div>
            <div class="col-span-7">Name</div>
            <div class="col-span-3 text-right">Type</div>
          </div>

          <!-- Error 1: fetch failed (network error) -->
          <div class="grid grid-cols-12 gap-2 px-3 py-2 text-xs bg-rose-500/10 border-l-4 border-rose-500">
            <div class="col-span-2"><span class="rounded bg-rose-500/30 px-2 py-0.5 font-bold text-rose-300">(failed)</span></div>
            <div class="col-span-7 font-mono text-rose-300">/api/v4/items（連不上）</div>
            <div class="col-span-3 text-right text-slate-500">net::ERR_FAILED</div>
          </div>
          <div class="px-3 py-2 text-xs text-rose-300 bg-rose-500/5 italic">
            ↑ 第一種：fetch 連 server 都沒到（網路斷 / URL 寫錯）→ JavaScript 直接 <strong>throw error</strong>
          </div>

          <!-- Error 2: 4xx/5xx (server response) -->
          <div class="grid grid-cols-12 gap-2 px-3 py-2 text-xs bg-amber-500/10 border-l-4 border-amber-500 mt-1">
            <div class="col-span-2"><span class="rounded bg-rose-500/30 px-2 py-0.5 font-bold text-rose-300">404</span></div>
            <div class="col-span-7 font-mono text-amber-300">/api/v4/products/99999</div>
            <div class="col-span-3 text-right text-slate-500">xhr</div>
          </div>
          <div class="px-3 py-2 text-xs text-amber-300 bg-amber-500/5 italic">
            ↑ 第二種：fetch 連到了 server，但 server 回了「失敗」狀態 → fetch <strong>不會 throw</strong>，response.ok 是 false
          </div>
        </div>

        <!-- 處理方式 -->
        <div class="grid w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-2">
          <div class="rounded-xl border border-rose-500/30 bg-rose-500/5 px-4 py-3">
            <p class="text-xs font-bold text-rose-300 mb-1">⚡ 第一種「fetch 直接爆」</p>
            <p class="text-xs text-slate-400">→ 用 <code class="text-emerald-300">try / catch</code> 接</p>
          </div>
          <div class="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
            <p class="text-xs font-bold text-amber-300 mb-1">📦 第二種「server 回 4xx/5xx」</p>
            <p class="text-xs text-slate-400">→ 用 <code class="text-emerald-300">if (!response.ok)</code> 判斷</p>
          </div>
        </div>

        <div class="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 max-w-2xl text-xs text-slate-300 text-center">
          📌 想成你寄包裹：第一種是「郵局把包裹弄丟」，第二種是「包裹寄到了但朋友拒收」 — 兩個要分開防。
        </div>
      </div>
    </div>

    <!-- ===== Step 2: try/catch Intro ===== -->
    <div v-else-if="stepData.view === 'trycatch-intro'" class="slide-page">
      <div class="wm">try</div>
      <div class="flex flex-col items-center gap-6">
        <div class="rounded-full bg-emerald-500/10 px-5 py-2 text-sm font-bold text-emerald-300 border border-emerald-500/30">🛡️ 第一道防線</div>
        <h2 class="text-xl font-bold text-white md:text-2xl">try / catch — 安全屋</h2>

        <div class="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <pre class="text-xs md:text-sm text-slate-300"><code><span class="text-sky-300">async</span> function getUsersSafe() {
  <span class="text-purple-300">try</span> {
    <span class="text-slate-500">// 把可能會爆的程式包進來</span>
    const response = <span class="text-sky-300">await</span> fetch(<span class="text-amber-300">'...'</span>);
    const data = <span class="text-sky-300">await</span> response.json();
    <span class="text-purple-300">return</span> data;
  } <span class="text-purple-300">catch</span> (error) {
    <span class="text-slate-500">// 上面爆了 → 跳到這裡</span>
    console.error(<span class="text-amber-300">'連線失敗：'</span>, error.message);
  }
}</code></pre>
        </div>

        <div class="grid w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-2">
          <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
            <p class="text-3xl">🏠</p>
            <p class="mt-2 text-sm font-bold text-emerald-300">try { } 安全屋</p>
            <p class="mt-1 text-xs text-slate-400">把危險的程式包起來</p>
          </div>
          <div class="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-center">
            <p class="text-3xl">🪤</p>
            <p class="mt-2 text-sm font-bold text-amber-300">catch (error) 接住</p>
            <p class="mt-1 text-xs text-slate-400">爆了就掉進來</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 3: response.ok ===== -->
    <div v-else-if="stepData.view === 'response-ok'" class="slide-page">
      <div class="wm">.ok</div>
      <div class="flex flex-col items-center gap-6">
        <div class="rounded-full bg-emerald-500/10 px-5 py-2 text-sm font-bold text-emerald-300 border border-emerald-500/30">🛡️ 第二道防線</div>
        <h2 class="text-xl font-bold text-white md:text-2xl">response.ok — 檢查標籤</h2>

        <div class="w-full max-w-3xl space-y-3">
          <div class="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-4 flex items-center gap-4">
            <div class="text-4xl">✅</div>
            <div class="flex-1">
              <p class="text-sm font-bold text-emerald-300">response.ok === true</p>
              <p class="text-xs text-slate-400">2xx 狀態碼（200, 201, 204...）</p>
            </div>
          </div>
          <div class="rounded-2xl border-2 border-rose-500/40 bg-rose-500/5 p-4 flex items-center gap-4">
            <div class="text-4xl">❌</div>
            <div class="flex-1">
              <p class="text-sm font-bold text-rose-300">response.ok === false</p>
              <p class="text-xs text-slate-400">其他狀態碼（400, 404, 500...）</p>
            </div>
          </div>
        </div>

        <div class="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <pre class="text-xs md:text-sm text-slate-300"><code>const response = <span class="text-sky-300">await</span> fetch(<span class="text-amber-300">'...'</span>);

<span class="text-sky-300">if</span> (!response.ok) {
  console.error(<span class="text-amber-300">'Server 回錯誤：'</span>, response.status);
  <span class="text-purple-300">return</span>;
}

const data = <span class="text-sky-300">await</span> response.json();</code></pre>
        </div>

        <p class="max-w-xl text-center text-sm text-slate-400">用 <code class="text-emerald-300">response.ok</code> 比自己 <code>response.status === 200</code> 更省力。</p>
      </div>
    </div>

    <!-- ===== Step 4: Full Pattern ===== -->
    <div v-else-if="stepData.view === 'full-pattern'" class="slide-page">
      <div class="wm">🛡️🛡️</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">雙保險：兩道防線一起用</h2>

        <div class="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <pre class="text-xs md:text-sm text-slate-300"><code><span class="text-sky-300">async</span> function getUsersSafe() {
  <span class="text-purple-300">try</span> {                                       <span class="text-emerald-300">// 🛡️ 第一道</span>
    const response = <span class="text-sky-300">await</span> fetch(<span class="text-amber-300">'...'</span>);

    <span class="text-sky-300">if</span> (!response.ok) {                         <span class="text-emerald-300">// 🛡️ 第二道</span>
      console.error(<span class="text-amber-300">'Server 回錯誤：'</span>, response.status);
      <span class="text-purple-300">return</span>;
    }

    const data = <span class="text-sky-300">await</span> response.json();
    <span class="text-purple-300">return</span> data;
  } <span class="text-purple-300">catch</span> (error) {
    console.error(<span class="text-amber-300">'連線失敗：'</span>, error.message);
  }
}</code></pre>
        </div>

        <div class="grid w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-2">
          <div class="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
            <p class="text-xs font-bold text-rose-300 mb-1">⚡ 網路斷</p>
            <p class="text-xs text-slate-400">→ 進入 catch (error)</p>
          </div>
          <div class="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <p class="text-xs font-bold text-amber-300 mb-1">📦 404 / 500</p>
            <p class="text-xs text-slate-400">→ 進入 if (!response.ok)</p>
          </div>
        </div>

        <p class="text-xs text-slate-500 italic">標準寫法 — 後面寫真實 API 都會用這個 pattern。</p>
      </div>
    </div>

    <!-- ===== Step 5: Success/Error Format ===== -->
    <div v-else-if="stepData.view === 'success-error'" class="slide-page">
      <div class="wm">format</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">統一回傳格式</h2>
        <p class="text-sm text-slate-400">作業 <code class="text-emerald-300">getProductsSafe()</code> 要這樣回傳</p>

        <div class="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
          <div class="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-4">
            <p class="text-xs font-bold text-emerald-300 mb-2">✅ 成功</p>
            <pre class="text-xs text-slate-300"><code>{
  success: <span class="text-amber-300">true</span>,
  data: [...]
}</code></pre>
          </div>
          <div class="rounded-2xl border-2 border-rose-500/40 bg-rose-500/5 p-4">
            <p class="text-xs font-bold text-rose-300 mb-2">❌ 失敗</p>
            <pre class="text-xs text-slate-300"><code>{
  success: <span class="text-amber-300">false</span>,
  error: <span class="text-amber-300">'錯誤訊息'</span>
}</code></pre>
          </div>
        </div>

        <div class="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <pre class="text-xs text-slate-300"><code><span class="text-sky-300">async</span> function getUsersSafe() {
  <span class="text-purple-300">try</span> {
    const response = <span class="text-sky-300">await</span> fetch(<span class="text-amber-300">'...'</span>);
    <span class="text-sky-300">if</span> (!response.ok) {
      <span class="text-purple-300">return</span> { success: <span class="text-amber-300">false</span>, error: <span class="text-amber-300">`HTTP ${response.status}`</span> };
    }
    const data = <span class="text-sky-300">await</span> response.json();
    <span class="text-purple-300">return</span> { success: <span class="text-amber-300">true</span>, data };
  } <span class="text-purple-300">catch</span> (error) {
    <span class="text-purple-300">return</span> { success: <span class="text-amber-300">false</span>, error: error.message };
  }
}</code></pre>
        </div>

        <p class="text-xs text-slate-500 italic">作業 getProductsSafe 直接套用這個 pattern</p>
      </div>
    </div>

    <!-- ===== Step 6: Quiz Which ===== -->
    <div v-else-if="stepData.view === 'quiz-which'" class="slide-page">
      <div class="wm">QUIZ</div>
      <div class="flex flex-col items-center gap-6">
        <div class="rounded-full bg-amber-500/10 px-5 py-2 text-sm font-bold text-amber-300 border border-amber-500/30">🎯 快問快答</div>
        <h2 class="text-xl font-bold text-white md:text-2xl">「網路斷線」這種錯，會被誰接到？</h2>

        <div class="w-full max-w-2xl space-y-3">
          <button @click="answerQuiz('which', 'catch', 'catch', '對！網路斷線時 fetch 直接爆，所以是 catch 接住', '')" class="w-full rounded-xl border-2 border-emerald-500/40 bg-emerald-500/10 px-6 py-4 text-left text-base font-bold text-emerald-300 transition-all hover:border-emerald-400 hover:bg-emerald-500/20 active:scale-95">
            A. catch (error)
          </button>
          <button @click="answerQuiz('which', 'ok', 'catch', '', '不對 — response.ok 要先有 response 才檢查得到。網路斷的話 fetch 根本連 response 都拿不到')" class="w-full rounded-xl border-2 border-purple-500/40 bg-purple-500/10 px-6 py-4 text-left text-base font-bold text-purple-300 transition-all hover:border-purple-400 hover:bg-purple-500/20 active:scale-95">
            B. if (!response.ok)
          </button>
          <button @click="answerQuiz('which', 'both', 'catch', '', '兩個都接會重複處理 — 而且 if (!response.ok) 根本不會被執行到，因為 fetch 已經爆了')" class="w-full rounded-xl border-2 border-amber-500/40 bg-amber-500/10 px-6 py-4 text-left text-base font-bold text-amber-300 transition-all hover:border-amber-400 hover:bg-amber-500/20 active:scale-95">
            C. 兩個都會
          </button>
        </div>

        <p class="text-xs text-slate-500 italic">提示：fetch 自己有沒有爆？</p>
      </div>
    </div>

    <!-- ===== Step 7: Summary ===== -->
    <div v-else-if="stepData.view === 'summary'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">END</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/proud.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-purple-400 object-cover shadow-xl shadow-purple-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-purple-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">你準備好寫作業了！🎉</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">今天學完了：</p>
          <ul class="mb-3 space-y-1 text-sm text-white md:text-base">
            <li>✅ HTTP / RESTful / 狀態碼</li>
            <li>✅ 非同步 + Promise + async/await</li>
            <li>✅ fetch GET（兩個坑）</li>
            <li>✅ LiveJS + .env</li>
            <li>✅ POST / PATCH / DELETE（兩個坑）</li>
            <li>✅ 錯誤處理（兩道防線）</li>
          </ul>
          <p class="text-xs text-slate-500 italic">「打開 homework.js 開工。加油！」—— 海姐</p>
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
