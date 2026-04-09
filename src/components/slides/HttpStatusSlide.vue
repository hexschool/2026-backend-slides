<script setup lang="ts">
/**
 * HTTP 狀態碼五大類
 * 7 步驟：用顏色卡片建立狀態碼直覺
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  { id: 0, view: 'welcome',         title: '歡迎',           desc: '服務生會帶一個三位數字' },
  { id: 1, view: 'status-intro',    title: '狀態碼是什麼',   desc: '每次回應都帶一張狀態貼紙' },
  { id: 2, view: 'five-categories', title: '五大類',         desc: '記第一個數字就好' },
  { id: 3, view: 'common-codes',    title: '必背六個',       desc: '200 / 201 / 400 / 401 / 404 / 500' },
  { id: 4, view: 'mnemonic',        title: '口訣',           desc: '4 開頭你的錯，5 開頭別人的錯' },
  { id: 5, view: 'quiz-status',     title: '快問快答',       desc: '404 是誰的錯？' },
  { id: 6, view: 'summary',         title: '結尾',           desc: '海姐結語' },
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
  if (stepData.value.view === 'quiz-status') return quizAnswers.value['status'] === 'me'
  return true
})

const nextStepHint = computed(() => {
  if (stepData.value.view === 'quiz-status' && !quizAnswers.value['status']) return '選一個答案'
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
    title="HTTP 狀態碼"
    subtitle="三位數字告訴你結果"
    icon="🚦"
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
      <div class="wm">200</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-purple-400 object-cover shadow-xl shadow-purple-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-purple-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">服務生回來時，會帶一個<strong class="text-purple-300">三位數字</strong> 👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">這個數字告訴你「這次處理的結果」。</p>
          <p class="text-xs text-slate-500 italic">「看到 200 就放心，看到 4xx 就抓頭。」—— 海姐</p>
        </div>
      </div>
      <button @click="nextStep()" class="rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-purple-500/25 transition-all hover:shadow-purple-500/40 animate-bounce">
        開始 →
      </button>
    </div>

    <!-- ===== Step 1: Status Intro — DevTools Mockup ===== -->
    <div v-else-if="stepData.view === 'status-intro'" class="slide-page">
      <div class="wm">F12</div>
      <div class="flex flex-col items-center gap-4">
        <h2 class="text-xl font-bold text-white md:text-2xl">打開 Chrome <kbd class="rounded bg-slate-700 px-2 py-0.5 text-base text-white">F12</kbd> 你會看到這個</h2>
        <p class="text-sm text-slate-400">每次 server 回應都會帶一個三位數字</p>

        <!-- DevTools Network panel mockup -->
        <div class="w-full max-w-3xl rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-2xl">
          <!-- Tab bar -->
          <div class="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2 text-xs text-slate-400">
            <span>Elements</span>
            <span>Console</span>
            <span class="border-b-2 border-cyan-400 pb-1 font-bold text-cyan-400">Network</span>
            <span>Sources</span>
            <span class="ml-auto text-slate-500">Chrome DevTools</span>
          </div>

          <!-- Column header -->
          <div class="grid grid-cols-12 gap-2 border-b border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-bold text-slate-400">
            <div class="col-span-1">Method</div>
            <div class="col-span-2">Status</div>
            <div class="col-span-7">Name</div>
            <div class="col-span-2 text-right">Size</div>
          </div>

          <!-- Rows -->
          <div class="divide-y divide-slate-800/50">
            <div class="grid grid-cols-12 gap-2 px-3 py-2 text-xs hover:bg-slate-800/30 animate-value-appear">
              <div class="col-span-1 font-bold text-sky-400">GET</div>
              <div class="col-span-2"><span class="rounded bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-300">200</span></div>
              <div class="col-span-7 font-mono text-slate-300">/api/v4/search/items?q=咖啡</div>
              <div class="col-span-2 text-right text-slate-500">12.4 kB</div>
            </div>
            <div class="grid grid-cols-12 gap-2 px-3 py-2 text-xs hover:bg-slate-800/30 animate-value-appear" style="animation-delay: 0.1s">
              <div class="col-span-1 font-bold text-emerald-400">POST</div>
              <div class="col-span-2"><span class="rounded bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-300">201</span></div>
              <div class="col-span-7 font-mono text-slate-300">/api/v4/cart/add</div>
              <div class="col-span-2 text-right text-slate-500">340 B</div>
            </div>
            <div class="grid grid-cols-12 gap-2 px-3 py-2 text-xs hover:bg-slate-800/30 animate-value-appear" style="animation-delay: 0.2s">
              <div class="col-span-1 font-bold text-sky-400">GET</div>
              <div class="col-span-2"><span class="rounded bg-amber-500/20 px-2 py-0.5 font-bold text-amber-300">304</span></div>
              <div class="col-span-7 font-mono text-slate-300">/static/logo.png</div>
              <div class="col-span-2 text-right text-slate-500">0 B</div>
            </div>
            <div class="grid grid-cols-12 gap-2 px-3 py-2 text-xs hover:bg-slate-800/30 animate-value-appear bg-rose-500/5" style="animation-delay: 0.3s">
              <div class="col-span-1 font-bold text-sky-400">GET</div>
              <div class="col-span-2"><span class="rounded bg-rose-500/30 px-2 py-0.5 font-bold text-rose-300">404</span></div>
              <div class="col-span-7 font-mono text-rose-300">/api/v4/products/99999</div>
              <div class="col-span-2 text-right text-slate-500">128 B</div>
            </div>
            <div class="grid grid-cols-12 gap-2 px-3 py-2 text-xs hover:bg-slate-800/30 animate-value-appear bg-rose-500/5" style="animation-delay: 0.4s">
              <div class="col-span-1 font-bold text-emerald-400">POST</div>
              <div class="col-span-2"><span class="rounded bg-purple-500/30 px-2 py-0.5 font-bold text-purple-300">500</span></div>
              <div class="col-span-7 font-mono text-purple-300">/api/v4/checkout</div>
              <div class="col-span-2 text-right text-slate-500">96 B</div>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm text-slate-300 max-w-2xl text-center">
          <strong class="text-emerald-300">200 / 201</strong> 是綠的（成功）、<strong class="text-amber-300">304</strong> 是黃的（用快取）、<strong class="text-rose-300">404 / 500</strong> 是紅的（壞掉了）。<br/>
          <span class="text-xs text-slate-500">下一頁我們把所有狀態碼分成五大類記住。</span>
        </div>
      </div>
    </div>

    <!-- ===== Step 2: Five Categories ===== -->
    <div v-else-if="stepData.view === 'five-categories'" class="slide-page">
      <div class="wm">5x</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">五大類，記第一個數字就好</h2>

        <div class="w-full max-w-3xl space-y-3">
          <div class="flex items-center gap-4 rounded-xl border border-sky-500/30 bg-sky-500/5 px-5 py-3 animate-value-appear">
            <span class="rounded-lg bg-sky-500/30 px-4 py-2 text-lg font-bold text-sky-200">1xx</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-white">收到了，正在處理</p>
              <p class="text-xs text-slate-400">「點餐單收到，廚房準備中」</p>
            </div>
          </div>
          <div class="flex items-center gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-3 animate-value-appear" style="animation-delay: 0.1s">
            <span class="rounded-lg bg-emerald-500/30 px-4 py-2 text-lg font-bold text-emerald-200">2xx</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-white">成功 ✅</p>
              <p class="text-xs text-slate-400">「您的餐點來了」</p>
            </div>
          </div>
          <div class="flex items-center gap-4 rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-3 animate-value-appear" style="animation-delay: 0.2s">
            <span class="rounded-lg bg-amber-500/30 px-4 py-2 text-lg font-bold text-amber-200">3xx</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-white">改去別的地方</p>
              <p class="text-xs text-slate-400">「我們搬家了，請去隔壁那家」</p>
            </div>
          </div>
          <div class="flex items-center gap-4 rounded-xl border border-rose-500/30 bg-rose-500/5 px-5 py-3 animate-value-appear" style="animation-delay: 0.3s">
            <span class="rounded-lg bg-rose-500/30 px-4 py-2 text-lg font-bold text-rose-200">4xx</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-white">你寫錯了 ❌</p>
              <p class="text-xs text-slate-400">「你點的菜單上沒有」「你沒帶會員卡」</p>
            </div>
          </div>
          <div class="flex items-center gap-4 rounded-xl border border-purple-500/30 bg-purple-500/5 px-5 py-3 animate-value-appear" style="animation-delay: 0.4s">
            <span class="rounded-lg bg-purple-500/30 px-4 py-2 text-lg font-bold text-purple-200">5xx</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-white">廚房爆炸 💥</p>
              <p class="text-xs text-slate-400">「廚房失火了，今天不能出餐」</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 3: Common Codes ===== -->
    <div v-else-if="stepData.view === 'common-codes'" class="slide-page">
      <div class="wm">6</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">必背六個常見代碼</h2>
        <p class="text-sm text-slate-400">每一個都對應你看過的真實情境</p>

        <div class="grid w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-2">
          <div class="flex items-center gap-3 rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 p-3 animate-value-appear">
            <span class="text-2xl font-bold text-emerald-300 min-w-[60px] text-center">200</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-white">成功</p>
              <p class="text-xs text-slate-400">😍 蝦皮商品頁順利打開</p>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 p-3 animate-value-appear" style="animation-delay: 0.1s">
            <span class="text-2xl font-bold text-emerald-300 min-w-[60px] text-center">201</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-white">新增成功</p>
              <p class="text-xs text-slate-400">🆕 IG 貼文發出去後 server 回的</p>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl border-2 border-rose-500/40 bg-rose-500/5 p-3 animate-value-appear" style="animation-delay: 0.2s">
            <span class="text-2xl font-bold text-rose-300 min-w-[60px] text-center">400</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-white">請求格式錯</p>
              <p class="text-xs text-slate-400">📝 表單少填欄位、JSON 寫錯</p>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl border-2 border-rose-500/40 bg-rose-500/5 p-3 animate-value-appear" style="animation-delay: 0.3s">
            <span class="text-2xl font-bold text-rose-300 min-w-[60px] text-center">401</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-white">沒帶身份</p>
              <p class="text-xs text-slate-400">🔐 進 IG 個人頁但沒登入 → 跳登入頁</p>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl border-2 border-rose-500/40 bg-rose-500/5 p-3 animate-value-appear" style="animation-delay: 0.4s">
            <span class="text-2xl font-bold text-rose-300 min-w-[60px] text-center">404</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-white">找不到</p>
              <p class="text-xs text-slate-400">🐙 GitHub 上的「Octocat 找不到頁面」就是 404</p>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl border-2 border-purple-500/40 bg-purple-500/5 p-3 animate-value-appear" style="animation-delay: 0.5s">
            <span class="text-2xl font-bold text-purple-300 min-w-[60px] text-center">500</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-white">Server 出包</p>
              <p class="text-xs text-slate-400">💥 大型網站當機（Cloudflare 爆掉那次）</p>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-center text-sm text-slate-300 max-w-2xl">
          其實這六個你都<strong class="text-white">看過</strong>，只是不知道它有名字。
        </div>
      </div>
    </div>

    <!-- ===== Step 4: Mnemonic ===== -->
    <div v-else-if="stepData.view === 'mnemonic'" class="slide-page">
      <div class="wm">4 vs 5</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white md:text-2xl">記住這個口訣 🔑</h2>

        <div class="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
          <div class="rounded-2xl border-2 border-rose-500/40 bg-rose-500/5 p-6 text-center">
            <p class="text-5xl font-bold text-rose-300">4xx</p>
            <p class="mt-3 text-3xl">👈 🙋</p>
            <p class="mt-3 text-lg font-bold text-white">你的錯</p>
            <p class="mt-2 text-sm text-slate-400">是 client 寫錯了</p>
            <p class="mt-3 text-xs text-rose-300">→ 改你的程式碼</p>
          </div>
          <div class="rounded-2xl border-2 border-purple-500/40 bg-purple-500/5 p-6 text-center">
            <p class="text-5xl font-bold text-purple-300">5xx</p>
            <p class="mt-3 text-3xl">👉 🏭</p>
            <p class="mt-3 text-lg font-bold text-white">別人的錯</p>
            <p class="mt-2 text-sm text-slate-400">是 server 自己出包</p>
            <p class="mt-3 text-xs text-purple-300">→ 找後端工程師</p>
          </div>
        </div>

        <div class="rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-4 text-center">
          <p class="text-sm text-slate-300 md:text-base"><strong class="text-rose-300">4 開頭你的錯</strong>，<strong class="text-purple-300">5 開頭別人的錯</strong></p>
        </div>
      </div>
    </div>

    <!-- ===== Step 5: Quiz Status ===== -->
    <div v-else-if="stepData.view === 'quiz-status'" class="slide-page">
      <div class="wm">QUIZ</div>
      <div class="flex flex-col items-center gap-6">
        <div class="rounded-full bg-amber-500/10 px-5 py-2 text-sm font-bold text-amber-300 border border-amber-500/30">🎯 快問快答</div>
        <h2 class="text-xl font-bold text-white md:text-2xl">你打了一個 API，server 回 <span class="text-rose-300">404</span>，是誰的問題？</h2>

        <div class="w-full max-w-2xl space-y-3">
          <button @click="answerQuiz('status', 'server', 'me', '4 開頭都是 client 的錯，server 沒出包，它是在告訴你「找不到」', 'server 出包是 5 開頭。4 開頭代表 client 有問題')" class="w-full rounded-xl border-2 border-purple-500/40 bg-purple-500/10 px-6 py-4 text-left text-base font-bold text-purple-300 transition-all hover:border-purple-400 hover:bg-purple-500/20 active:scale-95">
            A. Server 出包了
          </button>
          <button @click="answerQuiz('status', 'me', 'me', '對！4 開頭都是「你的錯」，server 找不到你要的東西，可能是網址打錯', '')" class="w-full rounded-xl border-2 border-emerald-500/40 bg-emerald-500/10 px-6 py-4 text-left text-base font-bold text-emerald-300 transition-all hover:border-emerald-400 hover:bg-emerald-500/20 active:scale-95">
            B. 我的網址打錯了
          </button>
          <button @click="answerQuiz('status', 'network', 'me', '網路斷線的話 fetch 會直接爆，根本不會回 404', '網路問題不會收到狀態碼，因為連都連不上')" class="w-full rounded-xl border-2 border-amber-500/40 bg-amber-500/10 px-6 py-4 text-left text-base font-bold text-amber-300 transition-all hover:border-amber-400 hover:bg-amber-500/20 active:scale-95">
            C. 網路斷線了
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Step 6: Summary ===== -->
    <div v-else-if="stepData.view === 'summary'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">END</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/praise.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-purple-400 object-cover shadow-xl shadow-purple-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-purple-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">狀態碼搞懂了 🎉</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">記住兩件事：</p>
          <ul class="mb-3 space-y-1 text-sm text-white md:text-base">
            <li>1. <strong class="text-emerald-300">2xx</strong> 代表成功</li>
            <li>2. <strong class="text-rose-300">4 開頭你的錯</strong>、<strong class="text-purple-300">5 開頭別人的錯</strong></li>
          </ul>
          <p class="text-xs text-slate-500 italic">「下一站要進入今天的核心：非同步。」—— 海姐</p>
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
