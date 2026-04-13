<script setup lang="ts">
/**
 * 資料驗證：幫使用者擋住錯誤資料
 * 8 步驟情境式教學：從壞資料到 regex，一步一步建立驗證觀念
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  { id: 0, view: 'welcome',         title: '開場',         desc: '為什麼需要驗證？' },
  { id: 1, view: 'bad-data',        title: '壞資料長什麼樣', desc: '先看一筆錯誤百出的表單' },
  { id: 2, view: 'quiz-spot-errors',title: '挑戰：找錯誤',  desc: '這筆資料有幾個問題？' },
  { id: 3, view: 'pattern-intro',   title: '驗證 Pattern',  desc: '蒐集所有錯誤，不要提早停' },
  { id: 4, view: 'quiz-tel',        title: '挑戰：電話格式', desc: '哪個格式是正確的？' },
  { id: 5, view: 'regex-intro',     title: 'Regex 拆解',    desc: '一個一個看懂正規表達式' },
  { id: 6, view: 'quiz-validate',   title: '挑戰：能通過嗎', desc: '這筆資料有沒有問題？' },
  { id: 7, view: 'summary',         title: '驗證總結',      desc: '帶著這個觀念繼續走' },
]

// ── Core ──
const currentStep = ref(0)
const stepData = computed(() => STEPS[currentStep.value])
const feedback = ref('')
const feedbackType = ref<'neutral' | 'success' | 'error' | 'question'>('neutral')

const feedbackClass = computed(() => {
  const map = {
    neutral:  'border-slate-600 bg-slate-800/80 text-slate-300',
    success:  'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    error:    'border-rose-500/50 bg-rose-500/10 text-rose-300',
    question: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
  }
  return map[feedbackType.value]
})
const feedbackIcon = computed(() => {
  const map = { neutral: '💡', success: '✅', error: '❌', question: '🤔' }
  return map[feedbackType.value]
})

// ── Quiz answers ──
const quizAnswers = ref<Record<string, string>>({})

function answerQuiz(
  id: string,
  answer: string,
  correct: string,
  successMsg: string,
  errorMsg: string,
) {
  if (answer === correct) {
    quizAnswers.value[id] = answer
    feedback.value = successMsg
    feedbackType.value = 'success'
  } else {
    delete quizAnswers.value[id]
    feedback.value = errorMsg
    feedbackType.value = 'error'
  }
}

// ── Bad data: toggled fields ──
const markedFields = ref<Set<string>>(new Set())
function toggleField(field: string) {
  if (markedFields.value.has(field)) {
    markedFields.value.delete(field)
  } else {
    markedFields.value.add(field)
  }
  // force reactivity
  markedFields.value = new Set(markedFields.value)
}

// ── Navigation ──
const canGoNext = computed(() => {
  const v = stepData.value.view
  if (v === 'quiz-spot-errors') return quizAnswers.value['spot'] === 'C'
  if (v === 'quiz-tel')         return quizAnswers.value['tel'] === 'A'
  if (v === 'quiz-validate')    return quizAnswers.value['validate'] === 'B'
  return true
})

const nextStepHint = computed(() => {
  const v = stepData.value.view
  if ((v === 'quiz-spot-errors' || v === 'quiz-tel' || v === 'quiz-validate') && !canGoNext.value) {
    return '選一個答案才能繼續'
  }
  return ''
})

// Reset feedback + quiz retry on step change
watch(() => stepData.value.view, () => {
  feedback.value = ''
  feedbackType.value = 'neutral'
})

function nextStep() { if (currentStep.value < STEPS.length - 1) currentStep.value++ }
function prevStep() { if (currentStep.value > 0) currentStep.value-- }
function gotoStep(step: number) { if (step >= 0 && step < STEPS.length) currentStep.value = step }

// ── Bad data fields ──
const badDataFields = [
  { key: 'name',    icon: '👤', label: '姓名',    value: '',                     problem: '空白' },
  { key: 'tel',     icon: '📞', label: '電話',    value: '1234',                 problem: '格式錯誤' },
  { key: 'email',   icon: '📧', label: 'Email',   value: 'test.example.com',     problem: '缺少 @' },
  { key: 'address', icon: '📍', label: '地址',    value: '',                     problem: '空白' },
  { key: 'payment', icon: '💳', label: '付款方式', value: 'Bitcoin',             problem: '不支援的方式' },
]

// ── Regex cards ──
const regexParts = [
  { symbol: '^',    color: 'text-amber-300',  label: '開頭',   desc: '字串必須從這裡開始' },
  { symbol: '09',   color: 'text-emerald-300', label: '字面值', desc: '必須是 09 這兩個字' },
  { symbol: '\\d',  color: 'text-sky-300',     label: '數字',   desc: '任意一個數字 0-9' },
  { symbol: '{8}',  color: 'text-violet-300',  label: '次數',   desc: '前面那個符號出現 8 次' },
  { symbol: '$',    color: 'text-rose-300',    label: '結尾',   desc: '字串必須在這裡結束' },
]
</script>

<template>
  <InteractiveSlideTemplate
    title="資料驗證"
    subtitle="幫使用者擋住錯誤資料"
    icon="🛡️"
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
      <div class="wm">驗證</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img
            src="/images/coach/normal.png"
            alt="海姐"
            class="h-28 w-28 rounded-full border-2 border-emerald-400 object-cover shadow-xl shadow-emerald-500/25 md:h-32 md:w-32"
            style="object-position: 50% 5%;"
          />
          <p class="mt-2 text-sm font-bold text-emerald-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">嗨，我是<strong class="text-emerald-300">海姐</strong> 👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">
            使用者填表單，什麼都填得出來。
          </p>
          <p class="mb-2 text-sm leading-relaxed text-white md:text-base">
            <strong>電話填「1234」、Email 少個 @、姓名直接空白</strong>——全都有可能。
          </p>
          <p class="mb-3 text-sm leading-relaxed text-slate-300 md:text-base">
            <strong class="text-emerald-300">我們的工作，就是在資料送出前先擋一層。</strong>
          </p>
          <p class="text-xs text-slate-500 italic">「好的驗證，讓使用者一次就知道哪裡填錯。」——海姐</p>
        </div>
      </div>
      <button
        @click="nextStep()"
        class="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 animate-bounce"
      >
        開始 →
      </button>
    </div>

    <!-- ===== Step 1: Bad Data ===== -->
    <div v-else-if="stepData.view === 'bad-data'" class="slide-page flex flex-col items-center gap-6">
      <div class="wm">❌</div>
      <h2 class="text-xl font-bold text-white">來看一筆「問題資料」</h2>
      <p class="text-sm text-slate-400">點擊欄位可以標記你覺得有問題的地方</p>
      <div class="flex w-full max-w-md flex-col gap-3">
        <div
          v-for="field in badDataFields"
          :key="field.key"
          @click="toggleField(field.key)"
          class="data-field-card"
          :class="markedFields.has(field.key) ? 'data-field-marked' : 'data-field-default'"
        >
          <span class="text-xl">{{ field.icon }}</span>
          <div class="flex flex-1 flex-col">
            <span class="text-xs text-slate-400">{{ field.label }}</span>
            <span class="font-mono text-sm" :class="field.value ? 'text-white' : 'text-slate-600 italic'">
              {{ field.value || '（空白）' }}
            </span>
          </div>
          <div v-if="markedFields.has(field.key)" class="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs text-rose-300">
            {{ field.problem }}
          </div>
          <div v-else class="text-slate-600 text-sm">點擊標記</div>
        </div>
      </div>
      <p class="text-sm text-emerald-400">先看看，等等我們會一起找問題 →</p>
    </div>

    <!-- ===== Step 2: Quiz - Spot Errors ===== -->
    <div v-else-if="stepData.view === 'quiz-spot-errors'" class="slide-page flex flex-col items-center gap-6">
      <div class="wm">?</div>
      <div class="flex shrink-0 flex-col items-center">
        <img src="/images/coach/confused.png" alt="海姐" class="h-20 w-20 rounded-full border-2 border-amber-400 object-cover shadow-xl md:h-24 md:w-24" style="object-position: 50% 5%;" />
      </div>
      <h2 class="text-xl font-bold text-white">剛才那筆資料，有幾個欄位有問題？</h2>
      <div class="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
        <div class="grid grid-cols-1 gap-2 text-sm text-slate-300">
          <div class="flex items-center gap-2"><span>👤</span><span>姓名：<em class="text-slate-500">（空白）</em></span></div>
          <div class="flex items-center gap-2"><span>📞</span><span>電話：<code class="text-amber-300">1234</code></span></div>
          <div class="flex items-center gap-2"><span>📧</span><span>Email：<code class="text-amber-300">test.example.com</code></span></div>
          <div class="flex items-center gap-2"><span>📍</span><span>地址：<em class="text-slate-500">（空白）</em></span></div>
          <div class="flex items-center gap-2"><span>💳</span><span>付款：<code class="text-amber-300">Bitcoin</code></span></div>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3 w-full max-w-xs">
        <button
          v-for="opt in [{ label: 'A：3 個', val: 'A' }, { label: 'B：4 個', val: 'B' }, { label: 'C：5 個', val: 'C' }]"
          :key="opt.val"
          @click="answerQuiz('spot', opt.val, 'C', '完全正確！全部 5 個欄位都有問題，一個都沒漏掉。', `差一點！再仔細看看，${opt.val === 'A' ? '其實不只 3 個' : '還有其他問題'}，每個欄位都要仔細檢查喔。`)"
          class="quiz-btn"
          :class="{
            'quiz-btn-selected-correct': quizAnswers['spot'] === opt.val && opt.val === 'C',
            'quiz-btn-selected-wrong':   quizAnswers['spot'] === opt.val && opt.val !== 'C',
            'quiz-btn-reveal-correct':   quizAnswers['spot'] && opt.val === 'C',
          }"
          :disabled="!!quizAnswers['spot']"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- ===== Step 3: Pattern Intro ===== -->
    <div v-else-if="stepData.view === 'pattern-intro'" class="slide-page flex flex-col items-center gap-6">
      <div class="wm">💡</div>
      <div class="flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/praise.png" alt="海姐" class="h-24 w-24 rounded-full border-2 border-emerald-400 object-cover shadow-xl shadow-emerald-500/25" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-emerald-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4">
          <p class="mb-3 text-sm leading-relaxed text-white md:text-base">
            驗證有一個重要原則：<strong class="text-emerald-300">一次蒐集所有錯誤，不要遇到第一個就停下來。</strong>
          </p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300">
            就像體檢報告——醫生不會看到血壓偏高就把你趕走，<br />
            他會把所有紅字<strong class="text-white">全部列出來</strong>，讓你一次看完。
          </p>
          <p class="text-xs text-slate-500 italic mt-3">「使用者最不喜歡的事：送出表單、改一個、再送、又錯一個⋯⋯」——海姐</p>
        </div>
      </div>
      <div class="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
        <p class="mb-3 text-sm font-bold text-emerald-300">驗證 Pattern：蒐集所有 errors</p>
        <pre class="validation-code text-slate-200"><code><span class="text-sky-400">function</span> <span class="text-amber-400">validateForm</span>(data) {
  <span class="text-sky-400">const</span> errors <span class="text-sky-300">=</span> {}

  <span class="text-slate-500">// 每個欄位都要檢查，不能遇到一個就 return</span>
  <span class="text-sky-400">if</span> (<span class="text-sky-300">!</span>data.name) errors.name <span class="text-sky-300">=</span> <span class="text-emerald-400">'姓名不能空白'</span>
  <span class="text-sky-400">if</span> (<span class="text-sky-300">!</span><span class="text-amber-400">isValidTel</span>(data.tel)) errors.tel <span class="text-sky-300">=</span> <span class="text-emerald-400">'電話格式不正確'</span>
  <span class="text-sky-400">if</span> (<span class="text-sky-300">!</span><span class="text-amber-400">isValidEmail</span>(data.email)) errors.email <span class="text-sky-300">=</span> <span class="text-emerald-400">'Email 格式不正確'</span>
  <span class="text-sky-400">if</span> (<span class="text-sky-300">!</span>data.address) errors.address <span class="text-sky-300">=</span> <span class="text-emerald-400">'地址不能空白'</span>

  <span class="text-sky-400">return</span> errors  <span class="text-slate-500">// 把所有問題一起回傳</span>
}</code></pre>
      </div>
    </div>

    <!-- ===== Step 4: Quiz - Tel Format ===== -->
    <div v-else-if="stepData.view === 'quiz-tel'" class="slide-page flex flex-col items-center gap-6">
      <div class="wm">📞</div>
      <div class="flex shrink-0 flex-col items-center">
        <img src="/images/coach/confused.png" alt="海姐" class="h-20 w-20 rounded-full border-2 border-amber-400 object-cover shadow-xl" style="object-position: 50% 5%;" />
      </div>
      <h2 class="text-xl font-bold text-white">以下哪個電話格式正確？</h2>
      <p class="text-sm text-slate-400">台灣手機格式：09 開頭，共 10 碼</p>
      <div class="grid grid-cols-2 gap-3 w-full max-w-sm">
        <button
          v-for="opt in [
            { label: 'A', val: 'A', display: '0912345678' },
            { label: 'B', val: 'B', display: '1234567890' },
            { label: 'C', val: 'C', display: '09-1234-5678' },
            { label: 'D', val: 'D', display: '091234567' },
          ]"
          :key="opt.val"
          @click="answerQuiz('tel', opt.val, 'A',
            '答對了！09 開頭、後接 8 碼數字，共 10 碼，這才是標準格式。',
            opt.val === 'B' ? '不對，1234 開頭不是手機號。' :
            opt.val === 'C' ? '差一點，09-1234-5678 有破折號，實際驗證時要先統一格式再比對，或用更靈活的 regex。' :
            '只有 9 碼，09 開頭後面要跟 8 碼數字，共 10 碼才對。'
          )"
          class="quiz-btn-lg"
          :class="{
            'quiz-btn-selected-correct': quizAnswers['tel'] === opt.val && opt.val === 'A',
            'quiz-btn-selected-wrong':   quizAnswers['tel'] === opt.val && opt.val !== 'A',
            'quiz-btn-reveal-correct':   quizAnswers['tel'] && opt.val === 'A',
          }"
          :disabled="!!quizAnswers['tel']"
        >
          <span class="text-xs font-bold opacity-70">{{ opt.label }}</span>
          <code class="text-sm font-mono">{{ opt.display }}</code>
        </button>
      </div>
    </div>

    <!-- ===== Step 5: Regex Intro ===== -->
    <div v-else-if="stepData.view === 'regex-intro'" class="slide-page flex flex-col items-center gap-6">
      <div class="wm">/.*/</div>
      <h2 class="text-xl font-bold text-white">把 <code class="code-inline">/^09\d{8}$/</code> 拆開來看</h2>
      <p class="text-sm text-slate-400">正規表達式看起來很可怕，一個一個拆就好懂了</p>
      <div class="flex flex-wrap justify-center gap-3 w-full max-w-2xl">
        <div
          v-for="part in regexParts"
          :key="part.symbol"
          class="regex-card"
        >
          <code class="text-2xl font-mono font-bold" :class="part.color">{{ part.symbol }}</code>
          <div class="mt-2 text-xs font-bold text-slate-300">{{ part.label }}</div>
          <div class="mt-1 text-xs text-slate-500 text-center">{{ part.desc }}</div>
        </div>
      </div>
      <div class="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-4">
        <p class="mb-2 text-xs font-bold text-emerald-300">組合起來讀：</p>
        <p class="text-sm text-slate-300 leading-relaxed">
          字串<span class="text-amber-300">從頭</span>開始，先是
          <span class="text-emerald-300">09</span> 兩個字，
          接著是<span class="text-sky-300">數字</span>
          <span class="text-violet-300">重複 8 次</span>，
          然後<span class="text-rose-300">到這裡結束</span>。
        </p>
        <div class="mt-3 rounded-xl bg-slate-800 p-3">
          <pre class="validation-code text-slate-200"><code><span class="text-sky-400">const</span> telRegex <span class="text-sky-300">=</span> <span class="text-emerald-400">/^09\d{8}$/</span>
telRegex.<span class="text-amber-400">test</span>(<span class="text-emerald-400">'0912345678'</span>)  <span class="text-slate-500">// true  ✅</span>
telRegex.<span class="text-amber-400">test</span>(<span class="text-emerald-400">'1234'</span>)        <span class="text-slate-500">// false ❌</span>
telRegex.<span class="text-amber-400">test</span>(<span class="text-emerald-400">'09-1234-5678'</span>) <span class="text-slate-500">// false ❌</span></code></pre>
        </div>
      </div>
    </div>

    <!-- ===== Step 6: Quiz - Validate ===== -->
    <div v-else-if="stepData.view === 'quiz-validate'" class="slide-page flex flex-col items-center gap-6">
      <div class="wm">🔍</div>
      <div class="flex shrink-0 flex-col items-center">
        <img src="/images/coach/shocked.png" alt="海姐" class="h-20 w-20 rounded-full border-2 border-rose-400 object-cover shadow-xl" style="object-position: 50% 5%;" />
      </div>
      <h2 class="text-xl font-bold text-white">這筆資料，能通過驗證嗎？</h2>
      <div class="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
        <div class="grid grid-cols-1 gap-2 text-sm text-slate-300">
          <div class="flex items-center gap-2"><span>👤</span><span>姓名：<code class="text-white">王小美</code></span></div>
          <div class="flex items-center gap-2"><span>📞</span><span>電話：<code class="text-white">0987654321</code></span></div>
          <div class="flex items-center gap-2"><span>📧</span><span>Email：<code class="text-amber-300">test.example.com</code></span></div>
          <div class="flex items-center gap-2"><span>📍</span><span>地址：<code class="text-white">高雄市苓雅區XX路</code></span></div>
          <div class="flex items-center gap-2"><span>💳</span><span>付款：<code class="text-white">信用卡</code></span></div>
        </div>
      </div>
      <p class="text-sm text-slate-400">仔細看每個欄位，再做決定</p>
      <div class="grid grid-cols-2 gap-3 w-full max-w-xs">
        <button
          v-for="opt in [
            { label: 'A：可以通過', val: 'A' },
            { label: 'B：不能通過', val: 'B' },
          ]"
          :key="opt.val"
          @click="answerQuiz('validate', opt.val, 'B',
            opt.val === 'B'
              ? 'Email「test.example.com」少了 @，這不是合法的 Email 格式，驗證會失敗！'
              : '再仔細看！Email 欄位「test.example.com」少了 @，這個格式過不了 Email 驗證。',
          )"
          class="quiz-btn"
          :class="{
            'quiz-btn-selected-correct': quizAnswers['validate'] === opt.val && opt.val === 'B',
            'quiz-btn-selected-wrong':   quizAnswers['validate'] === opt.val && opt.val !== 'B',
            'quiz-btn-reveal-correct':   quizAnswers['validate'] && opt.val === 'B',
          }"
          :disabled="!!quizAnswers['validate']"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- ===== Step 7: Summary ===== -->
    <div v-else-if="stepData.view === 'summary'" class="slide-page flex flex-col items-center gap-6">
      <div class="wm">🛡️</div>
      <div class="flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/proud.png" alt="海姐" class="h-24 w-24 rounded-full border-2 border-emerald-400 object-cover shadow-xl shadow-emerald-500/25" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-emerald-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4">
          <p class="mb-2 text-sm leading-relaxed text-white md:text-base">
            <strong class="text-emerald-300">好的驗證讓使用者一次就知道哪裡填錯，不用玩猜猜樂。</strong>
          </p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300">
            那是對使用者的尊重，也是你身為工程師的細心。
          </p>
          <p class="text-xs text-slate-500 italic mt-3">「寫驗證不是在懷疑使用者，是在幫他們一把。」——海姐</p>
        </div>
      </div>
      <div class="w-full max-w-2xl grid grid-cols-1 gap-3 md:grid-cols-3">
        <div class="summary-card">
          <p class="text-2xl">📋</p>
          <p class="mt-2 text-sm font-bold text-emerald-300">蒐集所有錯誤</p>
          <p class="mt-1 text-xs text-slate-400">用 errors 物件一次收集，不要提早 return</p>
        </div>
        <div class="summary-card">
          <p class="text-2xl">🔍</p>
          <p class="mt-2 text-sm font-bold text-sky-300">格式用 Regex</p>
          <p class="mt-1 text-xs text-slate-400">/^09\d{8}$/ 這類 pattern 精準又可重複使用</p>
        </div>
        <div class="summary-card">
          <p class="text-2xl">💬</p>
          <p class="mt-2 text-sm font-bold text-amber-300">錯誤訊息要清楚</p>
          <p class="mt-1 text-xs text-slate-400">告訴使用者「為什麼」，不只說「格式錯誤」</p>
        </div>
      </div>
    </div>
  </InteractiveSlideTemplate>
</template>

<style scoped>
/* ── Layout ── */
.slide-page {
  @apply relative flex flex-col items-center px-4 py-6 overflow-hidden;
  min-height: 420px;
}

/* ── Watermark ── */
.wm {
  @apply pointer-events-none absolute inset-0 flex items-center justify-center;
  font-size: clamp(4rem, 18vw, 9rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.025);
  user-select: none;
}

/* ── Data field cards ── */
.data-field-card {
  @apply flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all select-none;
}
.data-field-default {
  @apply border-slate-700 bg-slate-800/60 hover:border-slate-500 hover:bg-slate-800;
}
.data-field-marked {
  @apply border-rose-500/60 bg-rose-500/10;
}

/* ── Quiz buttons (small) ── */
.quiz-btn {
  @apply rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-bold text-slate-300
         transition-all hover:border-emerald-500/60 hover:text-white disabled:cursor-not-allowed;
}
.quiz-btn-selected-correct {
  @apply border-emerald-500 bg-emerald-500/20 text-emerald-300;
}
.quiz-btn-selected-wrong {
  @apply border-rose-500 bg-rose-500/20 text-rose-300;
}
.quiz-btn-reveal-correct {
  @apply border-emerald-500/60 bg-emerald-500/10 text-emerald-300;
}

/* ── Quiz buttons (large, 2-col) ── */
.quiz-btn-lg {
  @apply flex flex-col items-center gap-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-4
         text-slate-300 transition-all hover:border-emerald-500/60 hover:text-white
         disabled:cursor-not-allowed;
}

/* ── Regex cards ── */
.regex-card {
  @apply flex flex-col items-center rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4;
  min-width: 90px;
}

/* ── Code blocks ── */
.validation-code {
  @apply overflow-x-auto text-xs leading-relaxed text-slate-300 md:text-sm;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
}
.code-inline {
  @apply rounded bg-slate-800 px-1.5 py-0.5 text-emerald-300;
}

/* ── Summary cards ── */
.summary-card {
  @apply flex flex-col items-center rounded-2xl border border-slate-700 bg-slate-800/60 px-5 py-5 text-center;
}

/* ── Animation ── */
@keyframes value-appear {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-value-appear {
  animation: value-appear 0.3s ease-out;
}
</style>
