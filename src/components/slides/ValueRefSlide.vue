<script setup lang="ts">
/**
 * 傳值 vs 傳址 引導式互動教學
 * 25 步驟體驗式學習：生活情境 → 程式體驗 → 思維延伸
 */
import { ref, computed, watch } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  // Phase 1: 引入
  { id: 0,  view: 'welcome',           title: '歡迎',           desc: '海姐帶你認識傳值與傳址' },
  { id: 1,  view: 'copy-photo',        title: '傳照片',         desc: '你的照片會被畫鬍子嗎？' },
  { id: 2,  view: 'shared-doc',        title: '共編文件',       desc: '朋友改了標題，你看到的會變嗎？' },
  { id: 3,  view: 'two-worlds',        title: '兩種世界',       desc: '為什麼結果不一樣？' },
  { id: 4,  view: 'memory-intro',      title: '什麼是記憶體',   desc: '變數住在哪裡？' },
  // Phase 2: 傳值
  { id: 5,  view: 'value-intro',       title: '認識傳值',       desc: '基本型別的複製規則' },
  { id: 6,  view: 'value-demo',        title: '傳值互動',       desc: '按按鈕，觀察結果' },
  { id: 7,  view: 'value-quiz',        title: '傳值提問',       desc: '確認你理解了' },
  { id: 8,  view: 'value-to-ref',      title: '傳值小結',       desc: '接下來換另一種型別' },
  // Phase 3: 傳址
  { id: 9,  view: 'ref-intro',         title: '認識傳址',       desc: '物件型別的共用規則' },
  { id: 10, view: 'ref-demo',          title: '傳址互動',       desc: '兩個變數，同一個物件' },
  { id: 11, view: 'ref-change',        title: '傳址改值',       desc: '改 b，a 也跟著變？' },
  { id: 12, view: 'ref-quiz',          title: '傳址提問',       desc: '確認你理解了' },
  // Phase 4: 比較與深化
  { id: 13, view: 'compare',           title: '並排比較',       desc: '傳值 vs 傳址' },
  { id: 14, view: 'memory-visual',     title: '記憶體圖解',     desc: '值 vs 位址' },
  { id: 15, view: 'array-ref',         title: '陣列也是傳址',   desc: 'push 一下，兩邊都變' },
  { id: 16, view: 'function-side-effect', title: '函式的副作用', desc: '傳進去的物件被改了' },
  // Phase 5: 思維延伸
  { id: 17, view: 'thinking-roles',    title: '不同名字同一人', desc: '你只有一個，但被很多角色引用' },
  { id: 18, view: 'thinking-breakfree', title: '斷開連結',      desc: '表面改變不夠，要一層一層處理' },
  { id: 19, view: 'thinking-cost',     title: '獨立的代價',     desc: '獨立思考是有成本的' },
  // Phase 6: 挑戰與總結
  { id: 20, view: 'challenge-1',       title: '挑戰題 1',       desc: '猜輸出：基本型別' },
  { id: 21, view: 'challenge-2',       title: '挑戰題 2',       desc: '猜輸出：物件' },
  { id: 22, view: 'challenge-3',       title: '挑戰題 3',       desc: '猜輸出：陣列傳址' },
  { id: 23, view: 'challenge-4',       title: '挑戰題 4',       desc: '猜輸出：函式傳參' },
  { id: 24, view: 'summary-insight',   title: '核心觀念',       desc: '一句話記住傳值傳址' },
  { id: 25, view: 'summary-review',    title: '學習回顧',       desc: '今天走過的路' },
  { id: 26, view: 'summary-end',       title: '課程結束',       desc: '準備好了，出發吧' },
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
    question: 'border-purple-500/50 bg-purple-500/10 text-purple-300',
  }
  return map[feedbackType.value]
})
const feedbackIcon = computed(() => {
  const map = { neutral: '💡', success: '✅', error: '❌', question: '🤔' }
  return map[feedbackType.value]
})

// ── Step 1: Copy Photo ──
const photoAnswer = ref('')
function answerPhoto(answer: string) {
  photoAnswer.value = answer
  if (answer === 'no') {
    feedback.value = '沒錯！你傳出去的是一份副本，朋友怎麼改都不會影響你的原圖。這就是「傳值」的概念。'
    feedbackType.value = 'success'
  } else {
    photoAnswer.value = ''
    feedback.value = '想想看，你用 LINE 傳照片給朋友，他在他的手機上畫，你手機裡的照片會被畫嗎？'
    feedbackType.value = 'error'
  }
}

// ── Step 2: Shared Doc ──
const docAnswer = ref('')
function answerDoc(answer: string) {
  docAnswer.value = answer
  if (answer === 'yes') {
    feedback.value = '對！因為你們編輯的是「同一份」文件，不是各自的副本。這就是「傳址」的概念。'
    feedbackType.value = 'success'
  } else {
    docAnswer.value = ''
    feedback.value = '想想看，Google 文件是大家一起編輯「同一份」，不像照片是各自一份。'
    feedbackType.value = 'error'
  }
}

// ── Step 3: Two Worlds ──
const twoWorldsAnswer = ref('')
function answerTwoWorlds(answer: string) {
  twoWorldsAnswer.value = answer
  if (answer === 'copy-vs-share') {
    feedback.value = '太棒了！照片是「複製一份」→ 各自獨立；文件是「共用同一份」→ 互相影響。程式裡也是這樣！'
    feedbackType.value = 'success'
  } else {
    twoWorldsAnswer.value = ''
    feedback.value = '再想想：照片傳出去後，朋友拿到的是新的一份還是同一份？文件呢？'
    feedbackType.value = 'error'
  }
}

// ── Step 4: Memory Intro ──
const memPhase = ref(0) // 0=empty, 1=stored a=10, 2=stored b='hi'
const memSlots = computed(() => {
  // 8 memory slots, some get filled as user interacts
  const slots = Array.from({ length: 8 }, (_, i) => ({
    addr: `#${String(i + 1).padStart(3, '0')}`,
    value: '' as string,
    label: '' as string,
    active: false,
    highlight: false,
  }))
  if (memPhase.value >= 1) {
    slots[2].value = '10'
    slots[2].label = 'a'
    slots[2].active = true
    slots[2].highlight = true
  }
  if (memPhase.value >= 2) {
    slots[2].highlight = false
    slots[5].value = '"hi"'
    slots[5].label = 'b'
    slots[5].active = true
    slots[5].highlight = true
  }
  return slots
})
function memStore1() {
  memPhase.value = 1
  feedback.value = '電腦在 #003 找到一個空位，把 10 存進去，然後讓 a 指向這格。'
  feedbackType.value = 'success'
}
function memStore2() {
  memPhase.value = 2
  feedback.value = '再宣告一個變數 b，電腦在 #006 找到另一個空位存 "hi"。每個變數有自己的格子！'
  feedbackType.value = 'success'
}

// ── Step 6: Value Demo ──
const valueDemoPhase = ref(0) // 0=initial, 1=assigned, 2=changed
const valA = ref(10)
const valB = ref<number | null>(null)
function valueDemoAssign() {
  valB.value = valA.value
  valueDemoPhase.value = 1
  feedback.value = '好，現在 b 複製了 a 的值，兩個都是 10。注意看，它們是兩個獨立的方塊。'
  feedbackType.value = 'neutral'
}
function valueDemoChange() {
  valB.value = 20
  valueDemoPhase.value = 2
  feedback.value = '你把 b 改成 20 了！看看 a 還是 10 嗎？'
  feedbackType.value = 'question'
}

// ── Step 6: Value Quiz ──
const valueQuizAnswer = ref('')
function answerValueQuiz(answer: string) {
  valueQuizAnswer.value = answer
  if (answer === 'no') {
    feedback.value = '完全正確！因為 b 是「複製」了一份 a 的值，兩個獨立存在。改 b 不會影響 a。這就是傳值 (Pass by Value)。'
    feedbackType.value = 'success'
  } else {
    valueQuizAnswer.value = ''
    feedback.value = '回想一下剛才的畫面——a 和 b 是兩個獨立的方塊，改了其中一個，另一個會變嗎？'
    feedbackType.value = 'error'
  }
}

// ── Step 8: Ref Demo ──
const refDemoPhase = ref(0) // 0=initial, 1=assigned
const refObjName = ref('小明')
const refAssigned = ref(false)
function refDemoAssign() {
  refAssigned.value = true
  refDemoPhase.value = 1
  feedback.value = '現在 a 和 b 都指向同一個物件。注意看——兩個箭頭指向同一個方塊！'
  feedbackType.value = 'neutral'
}

// ── Step 9: Ref Change ──
const refChanged = ref(false)
function refDemoChange() {
  refObjName.value = '小華'
  refChanged.value = true
  feedback.value = '你透過 b 把 name 改成「小華」了。看看 a.name 是什麼？'
  feedbackType.value = 'question'
}

// ── Step 10: Ref Quiz ──
const refQuizAnswer = ref('')
function answerRefQuiz(answer: string) {
  refQuizAnswer.value = answer
  if (answer === 'same-object') {
    feedback.value = '完全正確！a 和 b 指向同一個物件，改了物件的內容，兩邊都看得到。這就是傳址 (Pass by Reference)。'
    feedbackType.value = 'success'
  } else {
    refQuizAnswer.value = ''
    feedback.value = '回想一下——a 和 b 是不是都指向「同一個」方塊？如果方塊裡的內容被改了呢？'
    feedbackType.value = 'error'
  }
}

// ── Step 13: Array Ref ──
const arrA = ref([1, 2, 3])
const arrB = ref<number[] | null>(null)
const arrPhase = ref(0)
function arrAssign() {
  arrB.value = arrA.value
  arrPhase.value = 1
  feedback.value = '現在 b 和 a 指向同一個陣列。'
  feedbackType.value = 'neutral'
}
function arrPush() {
  if (arrB.value) {
    arrB.value.push(4)
    arrPhase.value = 2
    feedback.value = '你透過 b.push(4) 加了一個元素。看看 a 有幾個元素？'
    feedbackType.value = 'question'
  }
}
const arrQuizAnswer = ref('')
function answerArrQuiz(answer: string) {
  arrQuizAnswer.value = answer
  if (answer === 'four') {
    feedback.value = '沒錯！因為陣列也是物件，a 和 b 指向同一個陣列，b.push 也會影響 a。'
    feedbackType.value = 'success'
  } else {
    arrQuizAnswer.value = ''
    feedback.value = '陣列也是物件喔！a 和 b 指向同一個陣列，b.push 之後 a 也會多一個元素。'
    feedbackType.value = 'error'
  }
}

// ── Step 14: Function Side Effect ──
const fnPhase = ref(0)
const fnPersonName = ref('小明')
function fnRunEffect() {
  fnPersonName.value = '被改掉了'
  fnPhase.value = 1
  feedback.value = '函式裡面改了 person.name，外面的 me 也被改了！因為傳進去的是同一個物件的「位址」。'
  feedbackType.value = 'success'
}

// ── Step 15: Thinking Roles ──
const rolePhase = ref(0)
const roleNames = ['老闆眼中的你', '媽媽眼中的你', '朋友眼中的你']
function showNextRole() {
  if (rolePhase.value < 3) {
    rolePhase.value++
    if (rolePhase.value === 3) {
      feedback.value = '三個變數，指向同一個你。你改了自己的某個面向，所有引用你的人都會感受到。'
      feedbackType.value = 'question'
    }
  }
}

// ── Step 16: Thinking Break Free ──
// (no interactive state needed, just content)

// ── Step 17: Thinking Cost ──
// (no interactive state needed, just content)

// ── Step 18-21: Challenges ──
const challenge1Answer = ref('')
const challenge2Answer = ref('')
const challenge3Answer = ref('')
const challenge4Answer = ref('')

function answerChallenge1(answer: string) {
  challenge1Answer.value = answer
  if (answer === '10') {
    feedback.value = '答對了！基本型別是傳值，x 和 y 獨立，改 y 不影響 x。'
    feedbackType.value = 'success'
  } else {
    challenge1Answer.value = ''
    feedback.value = 'number 是基本型別，賦值時是複製一份。y 改了，x 不會變。'
    feedbackType.value = 'error'
  }
}
function answerChallenge2(answer: string) {
  challenge2Answer.value = answer
  if (answer === 'blue') {
    feedback.value = '答對了！物件是傳址，a 和 b 指向同一個物件，改 b.color 就是改那個物件。'
    feedbackType.value = 'success'
  } else {
    challenge2Answer.value = ''
    feedback.value = '物件是傳址喔！a 和 b 指向同一個物件，b.color = "blue" 會影響 a。'
    feedbackType.value = 'error'
  }
}
function answerChallenge3(answer: string) {
  challenge3Answer.value = answer
  if (answer === '4') {
    feedback.value = '答對了！陣列也是物件，a 和 b 指向同一個陣列，b.push(4) 也會影響 a。'
    feedbackType.value = 'success'
  } else {
    challenge3Answer.value = ''
    feedback.value = '陣列是物件型別喔！a 和 b 指向同一個陣列，b push 了新元素，a 也會多一個。'
    feedbackType.value = 'error'
  }
}
function answerChallenge4(answer: string) {
  challenge4Answer.value = answer
  if (answer === '30') {
    feedback.value = '答對了！物件傳進函式也是傳址，函式裡改了 obj.score，外面的 player 也會被改。'
    feedbackType.value = 'success'
  } else {
    challenge4Answer.value = ''
    feedback.value = '物件傳進函式是傳址喔！函式裡的 obj 和外面的 player 指向同一個物件。'
    feedbackType.value = 'error'
  }
}

// ── Navigation ──
const canGoNext = computed(() => {
  const v = stepData.value.view
  if (v === 'copy-photo') return photoAnswer.value === 'no'
  if (v === 'shared-doc') return docAnswer.value === 'yes'
  if (v === 'two-worlds') return twoWorldsAnswer.value === 'copy-vs-share'
  if (v === 'memory-intro') return memPhase.value >= 2
  if (v === 'value-demo') return valueDemoPhase.value >= 2
  if (v === 'value-quiz') return valueQuizAnswer.value === 'no'
  if (v === 'ref-demo') return refDemoPhase.value >= 1
  if (v === 'ref-change') return refChanged.value
  if (v === 'ref-quiz') return refQuizAnswer.value === 'same-object'
  if (v === 'array-ref') return arrQuizAnswer.value === 'four'
  if (v === 'function-side-effect') return fnPhase.value >= 1
  if (v === 'thinking-roles') return rolePhase.value >= 3
  if (v === 'challenge-1') return challenge1Answer.value === '10'
  if (v === 'challenge-2') return challenge2Answer.value === 'blue'
  if (v === 'challenge-3') return challenge3Answer.value === '4'
  if (v === 'challenge-4') return challenge4Answer.value === '30'
  return true
})

const nextStepHint = computed(() => {
  const v = stepData.value.view
  if (v === 'copy-photo' && !photoAnswer.value) return '回答問題才能繼續'
  if (v === 'shared-doc' && !docAnswer.value) return '回答問題才能繼續'
  if (v === 'two-worlds' && !twoWorldsAnswer.value) return '回答問題才能繼續'
  if (v === 'memory-intro' && memPhase.value < 2) return '按按鈕體驗看看'
  if (v === 'value-demo' && valueDemoPhase.value < 2) return '按按鈕操作看看'
  if (v === 'value-quiz' && !valueQuizAnswer.value) return '回答問題才能繼續'
  if (v === 'ref-demo' && refDemoPhase.value < 1) return '按按鈕操作看看'
  if (v === 'ref-change' && !refChanged.value) return '按按鈕改值看看'
  if (v === 'ref-quiz' && !refQuizAnswer.value) return '回答問題才能繼續'
  if (v === 'array-ref' && !arrQuizAnswer.value) return '完成操作才能繼續'
  if (v === 'function-side-effect' && fnPhase.value < 1) return '按按鈕執行函式'
  if (v === 'thinking-roles' && rolePhase.value < 3) return '點擊看完所有角色'
  if (v === 'challenge-1' && !challenge1Answer.value) return '選一個答案'
  if (v === 'challenge-2' && !challenge2Answer.value) return '選一個答案'
  if (v === 'challenge-3' && !challenge3Answer.value) return '選一個答案'
  if (v === 'challenge-4' && !challenge4Answer.value) return '選一個答案'
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
    title="傳值 vs 傳址"
    subtitle="引導式互動教學"
    icon="🔗"
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
    <!-- ===== Shared Feedback Bar ===== -->
    <div v-if="feedback" class="mx-auto max-w-3xl px-4 pt-4">
      <div class="rounded-xl border px-4 py-3 text-sm md:text-base" :class="feedbackClass">
        <span class="mr-2">{{ feedbackIcon }}</span>{{ feedback }}
      </div>
    </div>

    <!-- ===== Question Buttons Area ===== -->
    <div class="mx-auto max-w-3xl px-4 pt-2">
      <!-- Step 1: Photo -->
      <div v-if="stepData.view === 'copy-photo' && !photoAnswer" class="flex justify-center gap-3">
        <button @click="answerPhoto('yes')" class="q-btn">A. 會被畫到</button>
        <button @click="answerPhoto('no')" class="q-btn">B. 不會被畫到</button>
      </div>
      <!-- Step 2: Doc -->
      <div v-if="stepData.view === 'shared-doc' && !docAnswer" class="flex justify-center gap-3">
        <button @click="answerDoc('no')" class="q-btn">A. 不會變</button>
        <button @click="answerDoc('yes')" class="q-btn">B. 會變</button>
      </div>
      <!-- Step 3: Two Worlds -->
      <div v-if="stepData.view === 'two-worlds' && !twoWorldsAnswer" class="flex justify-center gap-3">
        <button @click="answerTwoWorlds('copy-vs-share')" class="q-btn">A. 一個是複製，一個是共用</button>
        <button @click="answerTwoWorlds('magic')" class="q-btn">B. 我不知道</button>
      </div>
      <!-- Step 6: Value Quiz -->
      <div v-if="stepData.view === 'value-quiz' && !valueQuizAnswer" class="flex justify-center gap-3">
        <button @click="answerValueQuiz('yes')" class="q-btn">A. 會，a 也變成 20</button>
        <button @click="answerValueQuiz('no')" class="q-btn">B. 不會，a 還是 10</button>
      </div>
      <!-- Step 10: Ref Quiz -->
      <div v-if="stepData.view === 'ref-quiz' && !refQuizAnswer" class="flex justify-center gap-3">
        <button @click="answerRefQuiz('same-object')" class="q-btn">A. 因為指向同一個物件</button>
        <button @click="answerRefQuiz('bug')" class="q-btn">B. 程式壞掉了</button>
      </div>
      <!-- Step 13: Array Quiz -->
      <div v-if="stepData.view === 'array-ref' && arrPhase >= 2 && !arrQuizAnswer" class="flex justify-center gap-3">
        <button @click="answerArrQuiz('three')" class="q-btn">A. 3 個</button>
        <button @click="answerArrQuiz('four')" class="q-btn">B. 4 個</button>
      </div>
      <!-- Challenges -->
      <div v-if="stepData.view === 'challenge-1' && !challenge1Answer" class="flex justify-center gap-3">
        <button @click="answerChallenge1('10')" class="q-btn">A. 10</button>
        <button @click="answerChallenge1('20')" class="q-btn">B. 20</button>
      </div>
      <div v-if="stepData.view === 'challenge-2' && !challenge2Answer" class="flex justify-center gap-3">
        <button @click="answerChallenge2('red')" class="q-btn">A. "red"</button>
        <button @click="answerChallenge2('blue')" class="q-btn">B. "blue"</button>
      </div>
      <div v-if="stepData.view === 'challenge-3' && !challenge3Answer" class="flex justify-center gap-3">
        <button @click="answerChallenge3('3')" class="q-btn">A. 3</button>
        <button @click="answerChallenge3('4')" class="q-btn">B. 4</button>
      </div>
      <div v-if="stepData.view === 'challenge-4' && !challenge4Answer" class="flex justify-center gap-3">
        <button @click="answerChallenge4('20')" class="q-btn">A. 20</button>
        <button @click="answerChallenge4('30')" class="q-btn">B. 30</button>
      </div>
    </div>

    <!-- ===== Step 0: Welcome ===== -->
    <div v-if="stepData.view === 'welcome'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">VALUE vs REF</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-purple-400 object-cover shadow-xl shadow-purple-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-purple-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">嗨，我是<strong class="text-purple-300">海姐</strong> 👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">今天來聊一件你每天都在做的事——<strong class="text-white">複製</strong>。</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">當你寫 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-purple-300">let b = a</code>，b 拿到的到底是什麼？</p>
          <p class="mb-3 text-sm leading-relaxed text-slate-300 md:text-base">答案可能跟你想的不一樣。我們一步一步來發現。</p>
          <p class="text-xs text-slate-500 italic">「先從生活開始，再回到程式。」—— 海姐</p>
        </div>
      </div>
      <button @click="nextStep()" class="rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-purple-500/25 transition-all hover:shadow-purple-500/40 animate-bounce">
        開始探索 →
      </button>
    </div>

    <!-- ===== Step 1: Copy Photo ===== -->
    <div v-else-if="stepData.view === 'copy-photo'" class="slide-page">
      <div class="wm">COPY</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">📸 情境一：傳照片</h2>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 p-6 text-center">
          <div class="mb-6 flex items-center justify-center gap-8">
            <!-- Phone A -->
            <div class="flex flex-col items-center gap-2">
              <div class="flex h-32 w-20 flex-col items-center justify-center rounded-xl border-2 border-purple-400 bg-slate-900 p-2">
                <div class="text-3xl">🖼️</div>
                <p class="mt-1 text-xs text-slate-400">原圖</p>
              </div>
              <p class="text-sm font-bold text-purple-300">你的手機</p>
            </div>
            <!-- Arrow -->
            <div class="text-2xl text-slate-500">→ 📤 →</div>
            <!-- Phone B -->
            <div class="flex flex-col items-center gap-2">
              <div class="flex h-32 w-20 flex-col items-center justify-center rounded-xl border-2 border-slate-600 bg-slate-900 p-2">
                <div class="text-3xl">🖼️</div>
                <p class="mt-1 text-xs text-slate-400">副本</p>
              </div>
              <p class="text-sm font-bold text-slate-400">朋友的手機</p>
            </div>
          </div>
          <p class="text-base text-white">你用 LINE 傳了一張照片給朋友。</p>
          <p class="text-base text-white">朋友在照片上<strong class="text-rose-400">畫了鬍子</strong> 🥸</p>
          <p class="mt-3 text-lg font-bold text-purple-300">你手機裡的原圖，會被畫到嗎？</p>
        </div>
      </div>
    </div>

    <!-- ===== Step 2: Shared Doc ===== -->
    <div v-else-if="stepData.view === 'shared-doc'" class="slide-page">
      <div class="wm">SHARE</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">📝 情境二：共編文件</h2>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 p-6 text-center">
          <div class="mb-6 flex items-center justify-center gap-4">
            <!-- Person A -->
            <div class="flex flex-col items-center gap-2">
              <div class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-purple-400 bg-slate-900 text-2xl">👤</div>
              <p class="text-sm font-bold text-purple-300">你</p>
            </div>
            <!-- Arrows to doc -->
            <div class="flex flex-col items-center gap-1">
              <div class="text-slate-500">↘</div>
            </div>
            <!-- Doc -->
            <div class="flex h-24 w-28 flex-col items-center justify-center rounded-xl border-2 border-yellow-400 bg-yellow-500/10 p-2">
              <div class="text-2xl">📄</div>
              <p class="text-xs font-bold text-yellow-300">同一份文件</p>
            </div>
            <!-- Arrows to doc -->
            <div class="flex flex-col items-center gap-1">
              <div class="text-slate-500">↙</div>
            </div>
            <!-- Person B -->
            <div class="flex flex-col items-center gap-2">
              <div class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-600 bg-slate-900 text-2xl">👤</div>
              <p class="text-sm font-bold text-slate-400">朋友</p>
            </div>
          </div>
          <p class="text-base text-white">你跟朋友一起用 <strong class="text-yellow-300">Google 文件</strong>。</p>
          <p class="text-base text-white">朋友把標題改成<strong class="text-rose-400">「我是天才」</strong></p>
          <p class="mt-3 text-lg font-bold text-purple-300">你看到的標題，會跟著變嗎？</p>
        </div>
      </div>
    </div>

    <!-- ===== Step 3: Two Worlds ===== -->
    <div v-else-if="stepData.view === 'two-worlds'" class="slide-page">
      <div class="wm">WHY?</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">🤔 為什麼結果不一樣？</h2>
        <div class="flex flex-col gap-4 md:flex-row md:gap-8">
          <!-- 傳值 -->
          <div class="w-64 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
            <p class="text-3xl">📸</p>
            <p class="mt-2 text-lg font-bold text-emerald-300">傳照片</p>
            <p class="mt-2 text-sm text-slate-300">朋友畫鬍子</p>
            <p class="mt-1 text-lg font-bold text-emerald-400">你的原圖不受影響 ✓</p>
            <p class="mt-3 rounded-lg bg-emerald-500/20 px-3 py-2 text-sm font-bold text-emerald-300">各自一份副本</p>
          </div>
          <!-- 傳址 -->
          <div class="w-64 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-center">
            <p class="text-3xl">📝</p>
            <p class="mt-2 text-lg font-bold text-rose-300">共編文件</p>
            <p class="mt-2 text-sm text-slate-300">朋友改標題</p>
            <p class="mt-1 text-lg font-bold text-rose-400">你看到的也變了 ✗</p>
            <p class="mt-3 rounded-lg bg-rose-500/20 px-3 py-2 text-sm font-bold text-rose-300">共用同一份</p>
          </div>
        </div>
        <p class="text-base text-slate-300">這兩種情境的差別是什麼？</p>
      </div>
    </div>

    <!-- ===== Step 4: Memory Intro ===== -->
    <div v-else-if="stepData.view === 'memory-intro'" class="slide-page">
      <div class="wm">MEMORY</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">🧩 這是記憶體（RAM）</h2>
        <p class="text-sm text-slate-400">你的變數都住在這裡面。每一格就是一塊<strong class="text-white">記憶體空間</strong>。</p>

        <!-- Code terminal -->
        <div class="w-full max-w-md rounded-xl bg-slate-900 p-4">
          <div class="mb-2 flex items-center gap-2">
            <div class="h-2.5 w-2.5 rounded-full bg-rose-500"></div>
            <div class="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
            <div class="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
            <span class="ml-2 text-xs text-slate-500">terminal</span>
          </div>
          <pre class="text-sm text-slate-300"><code><span :class="memPhase >= 1 ? 'text-slate-300' : 'text-slate-500'"><span class="text-purple-400">let</span> a = <span class="text-amber-300">10</span>     <span class="text-slate-500">{{ memPhase >= 1 ? '✓' : '← 按下面按鈕' }}</span></span>
<span :class="memPhase >= 2 ? 'text-slate-300' : 'text-slate-500'"><span class="text-purple-400">let</span> b = <span class="text-emerald-300">"hi"</span>   <span class="text-slate-500">{{ memPhase >= 2 ? '✓' : memPhase >= 1 ? '← 再按一次' : '' }}</span></span></code></pre>
        </div>

        <!-- RAM Stick illustration -->
        <div class="ram-stick">
          <!-- Notch on top edge -->
          <div class="ram-notch"></div>
          <!-- PCB board label -->
          <div class="ram-label">DDR4 RAM</div>
          <!-- Chips row -->
          <div class="ram-chips">
            <div v-for="(slot, i) in memSlots" :key="i" class="ram-chip-wrapper">
              <!-- Variable label above chip -->
              <div class="h-5 text-center">
                <span v-if="slot.label" class="ram-var-label" :class="slot.highlight ? 'animate-bounce' : ''">{{ slot.label }}</span>
              </div>
              <!-- Chip -->
              <div class="ram-chip transition-all duration-500"
                   :class="slot.active
                     ? slot.highlight
                       ? 'ram-chip-glow'
                       : 'ram-chip-active'
                     : ''">
                <span v-if="slot.value" class="text-xs font-bold" :class="slot.label === 'a' ? 'text-amber-300' : 'text-emerald-300'">{{ slot.value }}</span>
              </div>
              <!-- Address under chip -->
              <span class="mt-0.5 text-[10px]" :class="slot.active ? 'text-emerald-300/70' : 'text-emerald-900/60'">{{ slot.addr }}</span>
            </div>
          </div>
          <!-- Circuit traces -->
          <div class="ram-traces">
            <div v-for="i in 8" :key="'t'+i" class="ram-trace"></div>
          </div>
          <!-- Gold pins at bottom -->
          <div class="ram-pins">
            <div class="ram-pin-notch"></div>
            <div class="ram-pin-row">
              <div v-for="i in 24" :key="'p'+i" class="ram-pin"></div>
            </div>
          </div>
        </div>

        <!-- Explanation -->
        <div v-if="memPhase === 0" class="max-w-md text-center text-sm text-slate-400">
          這就是你電腦裡的記憶體。上面每一格都是一塊<strong class="text-white">記憶體空間</strong>，可以存放資料。<br />
          當你宣告變數，電腦就會找一格空的，把值存進去。
        </div>
        <div v-if="memPhase === 1" class="max-w-md text-center text-sm text-slate-300">
          值 <strong class="text-amber-300">10</strong> 被存進了 <strong class="text-white">#003</strong> 這格記憶體！<br />
          變數 <strong class="text-purple-300">a</strong> 就是這格的<strong class="text-purple-300">標籤</strong>，讓你找到裡面的值。
        </div>
        <div v-if="memPhase === 2" class="max-w-md text-center text-sm text-slate-300">
          <strong class="text-purple-300">b</strong> 存進了另一格 <strong class="text-white">#006</strong>！<br />
          每個變數有<strong class="text-white">自己的記憶體空間</strong>。接下來重點來了——<br />
          <strong class="text-purple-300">當你寫 let b = a，b 拿到的是什麼？</strong>
        </div>

        <!-- Action buttons -->
        <button v-if="memPhase === 0" @click="memStore1" class="btn-action animate-bounce">
          執行 let a = 10
        </button>
        <button v-if="memPhase === 1" @click="memStore2" class="btn-action animate-bounce">
          執行 let b = "hi"
        </button>
      </div>
    </div>

    <!-- ===== Step 5: Value Intro ===== -->
    <div v-else-if="stepData.view === 'value-intro'" class="slide-page">
      <div class="wm">VALUE</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">📋 傳值 (Pass by Value)</h2>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 p-6">
          <p class="mb-4 text-base text-slate-300">在 JavaScript 中，以下這些叫做<strong class="text-purple-300">基本型別</strong>：</p>
          <div class="mb-4 flex flex-wrap justify-center gap-3">
            <span class="rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-bold text-blue-300">number 數字</span>
            <span class="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300">string 字串</span>
            <span class="rounded-lg bg-amber-500/20 px-4 py-2 text-sm font-bold text-amber-300">boolean 布林</span>
          </div>
          <div class="rounded-xl bg-slate-900 p-4">
            <pre class="text-sm text-slate-300"><code><span class="text-purple-400">let</span> a = <span class="text-amber-300">10</span>
<span class="text-purple-400">let</span> b = a   <span class="text-slate-500">// b 複製了 a 的值</span></code></pre>
          </div>
          <p class="mt-4 text-center text-base text-slate-300">
            就像<strong class="text-purple-300">傳照片</strong>一樣——b 拿到的是<strong class="text-white">一份副本</strong>，兩個獨立存在。
          </p>
        </div>
      </div>
    </div>

    <!-- ===== Step 5: Value Demo ===== -->
    <div v-else-if="stepData.view === 'value-demo'" class="slide-page">
      <div class="wm">VALUE</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">🧪 傳值體驗</h2>

        <!-- Code display -->
        <div class="w-full max-w-md rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-purple-400">let</span> a = <span class="text-amber-300">10</span>
<span class="text-purple-400">let</span> b = a   <span class="text-slate-500">// {{ valueDemoPhase >= 1 ? '✓ 已執行' : '← 按下面按鈕' }}</span>
<span v-if="valueDemoPhase >= 2" class="text-slate-300">b = <span class="text-amber-300">20</span>      <span class="text-slate-500">// ✓ 已執行</span></span></code></pre>
        </div>

        <!-- RAM Memory Board -->
        <div class="mem-board">
          <div class="mem-board-header">
            <div class="mem-board-dot"></div>
            <span>MEMORY</span>
          </div>
          <div class="flex items-end justify-center gap-2 px-3 py-3 md:gap-3 md:px-4">
            <!-- Chip #001 (empty) -->
            <div class="ram-chip-wrapper">
              <div class="h-5"></div>
              <div class="ram-chip"><span class="text-[10px] text-slate-700">空</span></div>
              <span class="mt-0.5 text-[10px] text-emerald-900/60">#001</span>
            </div>
            <!-- Chip #002 (empty) -->
            <div class="ram-chip-wrapper">
              <div class="h-5"></div>
              <div class="ram-chip"><span class="text-[10px] text-slate-700">空</span></div>
              <span class="mt-0.5 text-[10px] text-emerald-900/60">#002</span>
            </div>
            <!-- Chip #003: a = 10 (always active) -->
            <div class="ram-chip-wrapper">
              <div class="h-5 text-center"><span class="ram-var-label">a</span></div>
              <div class="ram-chip ram-chip-active transition-all duration-500">
                <span class="text-sm font-bold text-amber-300">10</span>
              </div>
              <span class="mt-0.5 text-[10px] text-emerald-300/70">#003</span>
            </div>
            <!-- Chip #004 (empty) -->
            <div class="ram-chip-wrapper">
              <div class="h-5"></div>
              <div class="ram-chip"><span class="text-[10px] text-slate-700">空</span></div>
              <span class="mt-0.5 text-[10px] text-emerald-900/60">#004</span>
            </div>
            <!-- Chip #005: b (appears phase 1+) -->
            <div class="ram-chip-wrapper">
              <div class="h-5 text-center">
                <span v-if="valueDemoPhase >= 1" class="ram-var-label">b</span>
              </div>
              <div class="ram-chip transition-all duration-500"
                   :class="valueDemoPhase >= 2 ? 'ram-chip-glow' : valueDemoPhase >= 1 ? 'ram-chip-active' : ''">
                <span v-if="valueDemoPhase >= 1" class="text-sm font-bold text-amber-300">
                  {{ valueDemoPhase >= 2 ? '20' : '10' }}
                </span>
                <span v-else class="text-[10px] text-slate-700">空</span>
              </div>
              <span class="mt-0.5 text-[10px]" :class="valueDemoPhase >= 1 ? 'text-emerald-300/70' : 'text-emerald-900/60'">#005</span>
            </div>
            <!-- Chip #006 (empty) -->
            <div class="ram-chip-wrapper">
              <div class="h-5"></div>
              <div class="ram-chip"><span class="text-[10px] text-slate-700">空</span></div>
              <span class="mt-0.5 text-[10px] text-emerald-900/60">#006</span>
            </div>
          </div>
        </div>

        <!-- Explanation text -->
        <p v-if="valueDemoPhase >= 1 && valueDemoPhase < 2" class="text-center text-sm text-slate-400">
          b 複製了 a 的值，存進<strong class="text-white">另一格記憶體 #005</strong>。兩格<strong class="text-purple-300">各自獨立</strong>。
        </p>
        <p v-if="valueDemoPhase >= 2" class="max-w-sm text-center text-sm text-slate-300">
          b 的記憶體從 10 變成了 <strong class="text-amber-300">20</strong>，但 a 的記憶體<strong class="text-purple-300">完全不受影響</strong>，還是 10。
        </p>

        <!-- Action buttons -->
        <div class="flex gap-4">
          <button v-if="valueDemoPhase === 0" @click="valueDemoAssign" class="btn-action animate-bounce">
            執行 let b = a
          </button>
          <button v-if="valueDemoPhase === 1" @click="valueDemoChange" class="btn-action animate-bounce">
            執行 b = 20
          </button>
        </div>

        <p v-if="valueDemoPhase >= 2" class="text-center text-base font-bold text-emerald-300">
          a 還是 {{ valA }}！記憶體指向換了，但只有 b 的箭頭動了。
        </p>
      </div>
    </div>

    <!-- ===== Step 6: Value Quiz ===== -->
    <div v-else-if="stepData.view === 'value-quiz'" class="slide-page">
      <div class="wm">QUIZ</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">❓ 確認一下</h2>
        <div class="w-full max-w-md rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-purple-400">let</span> a = <span class="text-amber-300">10</span>
<span class="text-purple-400">let</span> b = a
b = <span class="text-amber-300">20</span>

<span class="text-slate-500">// 改了 b 之後，a 會變嗎？</span>
console.log(a)  <span class="text-slate-500">// ???</span></code></pre>
        </div>
        <p class="text-lg font-bold text-purple-300">改了 b 之後，a 會跟著變嗎？</p>
      </div>
    </div>

    <!-- ===== Step 8: Value to Ref Transition ===== -->
    <div v-else-if="stepData.view === 'value-to-ref'" class="slide-page">
      <div class="wm">→</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">✅ 傳值，搞定了！</h2>

        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 p-6">
          <p class="mb-4 text-base text-slate-300">剛剛我們學到——以下這些型別是<strong class="text-emerald-300">傳值</strong>：</p>
          <div class="mb-4 flex flex-wrap justify-center gap-3">
            <span class="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300">number 數字</span>
            <span class="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300">string 字串</span>
            <span class="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300">boolean 布林</span>
          </div>
          <div class="mb-5 rounded-xl bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-300">
            賦值時<strong class="text-white">複製一份</strong>，各自存在獨立的記憶體空間，互不影響。
          </div>

          <div class="mb-3 flex items-center gap-3">
            <div class="h-px flex-1 bg-slate-700"></div>
            <span class="text-sm font-bold text-slate-500">但是...</span>
            <div class="h-px flex-1 bg-slate-700"></div>
          </div>

          <p class="text-center text-base text-slate-300">
            JavaScript 裡還有另一群型別——<strong class="text-rose-300">物件、陣列、函式</strong>。
          </p>
          <p class="mt-2 text-center text-base text-white">
            它們的行為<strong class="text-rose-300">完全不同</strong>。
          </p>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex flex-col items-center gap-1">
            <span class="text-3xl">📸</span>
            <span class="text-xs text-emerald-300">傳值 ✓</span>
          </div>
          <span class="text-2xl text-slate-600">→</span>
          <div class="flex flex-col items-center gap-1">
            <span class="text-3xl">📝</span>
            <span class="text-xs text-rose-300">傳址 ?</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 9: Ref Intro ===== -->
    <div v-else-if="stepData.view === 'ref-intro'" class="slide-page">
      <div class="wm">REFERENCE</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">📦 傳址 (Pass by Reference)</h2>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 p-6">
          <p class="mb-4 text-base text-slate-300">以下這些叫做<strong class="text-purple-300">物件型別</strong>：</p>
          <div class="mb-4 flex flex-wrap justify-center gap-3">
            <span class="rounded-lg bg-rose-500/20 px-4 py-2 text-sm font-bold text-rose-300">object 物件</span>
            <span class="rounded-lg bg-cyan-500/20 px-4 py-2 text-sm font-bold text-cyan-300">array 陣列</span>
            <span class="rounded-lg bg-violet-500/20 px-4 py-2 text-sm font-bold text-violet-300">function 函式</span>
          </div>
          <div class="rounded-xl bg-slate-900 p-4">
            <pre class="text-sm text-slate-300"><code><span class="text-purple-400">let</span> a = { name: <span class="text-emerald-300">'小明'</span> }
<span class="text-purple-400">let</span> b = a   <span class="text-slate-500">// b 拿到的是「位址」</span></code></pre>
          </div>
          <p class="mt-4 text-center text-base text-slate-300">
            就像<strong class="text-purple-300">共編文件</strong>一樣——b 拿到的不是副本，而是<strong class="text-white">同一份的地址</strong>。
          </p>
        </div>
      </div>
    </div>

    <!-- ===== Step 8: Ref Demo ===== -->
    <div v-else-if="stepData.view === 'ref-demo'" class="slide-page">
      <div class="wm">REFERENCE</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">🧪 傳址體驗</h2>

        <div class="w-full max-w-md rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-purple-400">let</span> a = { name: <span class="text-emerald-300">'小明'</span> }
<span class="text-purple-400">let</span> b = a   <span class="text-slate-500">// {{ refAssigned ? '✓ 已執行' : '← 按下面按鈕' }}</span></code></pre>
        </div>

        <!-- RAM Memory Board: both labels on SAME chip -->
        <div class="mem-board">
          <div class="mem-board-header">
            <div class="mem-board-dot"></div>
            <span>MEMORY</span>
          </div>
          <div class="flex items-end justify-center gap-2 px-3 py-3 md:gap-3 md:px-4">
            <!-- Chip #001 (empty) -->
            <div class="ram-chip-wrapper">
              <div class="h-5"></div>
              <div class="ram-chip"><span class="text-[10px] text-slate-700">空</span></div>
              <span class="mt-0.5 text-[10px] text-emerald-900/60">#001</span>
            </div>
            <!-- Chip #002 (empty) -->
            <div class="ram-chip-wrapper">
              <div class="h-5"></div>
              <div class="ram-chip"><span class="text-[10px] text-slate-700">空</span></div>
              <span class="mt-0.5 text-[10px] text-emerald-900/60">#002</span>
            </div>
            <!-- Chip #003: the SHARED object (wider) -->
            <div class="ram-chip-wrapper" style="flex: 2;">
              <div class="flex h-5 justify-center gap-1">
                <span class="ram-var-label">a</span>
                <span v-if="refAssigned" class="ram-var-label animate-bounce">b</span>
              </div>
              <div class="ram-chip ram-chip-active w-full transition-all duration-500" style="height: 52px;"
                   :class="refAssigned ? 'ram-chip-glow' : ''">
                <span class="text-xs font-bold text-white">{ name: '{{ refObjName }}' }</span>
              </div>
              <span class="mt-0.5 text-[10px] text-emerald-300/70">#003</span>
            </div>
            <!-- Chip #004 (empty) -->
            <div class="ram-chip-wrapper">
              <div class="h-5"></div>
              <div class="ram-chip"><span class="text-[10px] text-slate-700">空</span></div>
              <span class="mt-0.5 text-[10px] text-emerald-900/60">#004</span>
            </div>
            <!-- Chip #005 (empty) -->
            <div class="ram-chip-wrapper">
              <div class="h-5"></div>
              <div class="ram-chip"><span class="text-[10px] text-slate-700">空</span></div>
              <span class="mt-0.5 text-[10px] text-emerald-900/60">#005</span>
            </div>
          </div>
        </div>

        <button v-if="!refAssigned" @click="refDemoAssign" class="btn-action animate-bounce">
          執行 let b = a
        </button>

        <p v-if="refAssigned" class="text-center text-sm text-slate-300">
          注意看：a 和 b <strong class="text-yellow-300">兩個標籤指向同一格記憶體</strong>！<br />
          它們共用同一塊記憶體空間。
        </p>
      </div>
    </div>

    <!-- ===== Step 9: Ref Change ===== -->
    <div v-else-if="stepData.view === 'ref-change'" class="slide-page">
      <div class="wm">REFERENCE</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">✏️ 透過 b 改值</h2>

        <div class="w-full max-w-md rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-purple-400">let</span> a = { name: <span class="text-emerald-300">'小明'</span> }
<span class="text-purple-400">let</span> b = a
b.name = <span class="text-emerald-300">'小華'</span>   <span class="text-slate-500">// {{ refChanged ? '✓ 已執行' : '← 按下面按鈕' }}</span>

console.log(a.name)  <span class="text-slate-500">// {{ refChanged ? "'" + refObjName + "'" : '???' }}</span></code></pre>
        </div>

        <!-- RAM Memory Board: same chip, value changes -->
        <div class="mem-board">
          <div class="mem-board-header">
            <div class="mem-board-dot"></div>
            <span>MEMORY</span>
          </div>
          <div class="flex items-end justify-center gap-2 px-3 py-3 md:gap-3 md:px-4">
            <div class="ram-chip-wrapper">
              <div class="h-5"></div>
              <div class="ram-chip"><span class="text-[10px] text-slate-700">空</span></div>
              <span class="mt-0.5 text-[10px] text-emerald-900/60">#001</span>
            </div>
            <div class="ram-chip-wrapper">
              <div class="h-5"></div>
              <div class="ram-chip"><span class="text-[10px] text-slate-700">空</span></div>
              <span class="mt-0.5 text-[10px] text-emerald-900/60">#002</span>
            </div>
            <!-- Chip #003: shared object (changes when modified) -->
            <div class="ram-chip-wrapper" style="flex: 2;">
              <div class="flex h-5 justify-center gap-1">
                <span class="ram-var-label">a</span>
                <span class="ram-var-label">b</span>
              </div>
              <div class="ram-chip w-full transition-all duration-500" style="height: 52px;"
                   :class="refChanged ? 'ram-chip-changed' : 'ram-chip-active'">
                <span class="text-xs font-bold text-white">{ name: '{{ refObjName }}' }</span>
              </div>
              <span class="mt-0.5 text-[10px] text-emerald-300/70">#003</span>
            </div>
            <div class="ram-chip-wrapper">
              <div class="h-5"></div>
              <div class="ram-chip"><span class="text-[10px] text-slate-700">空</span></div>
              <span class="mt-0.5 text-[10px] text-emerald-900/60">#004</span>
            </div>
            <div class="ram-chip-wrapper">
              <div class="h-5"></div>
              <div class="ram-chip"><span class="text-[10px] text-slate-700">空</span></div>
              <span class="mt-0.5 text-[10px] text-emerald-900/60">#005</span>
            </div>
          </div>
        </div>

        <button v-if="!refChanged" @click="refDemoChange" class="btn-action animate-bounce">
          執行 b.name = '小華'
        </button>

        <p v-if="refChanged" class="text-center text-base font-bold text-rose-300">
          透過 b 改了記憶體裡的值，a 看到的<strong>也跟著變了</strong>！因為是同一格記憶體。
        </p>
      </div>
    </div>

    <!-- ===== Step 10: Ref Quiz ===== -->
    <div v-else-if="stepData.view === 'ref-quiz'" class="slide-page">
      <div class="wm">QUIZ</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">❓ 為什麼 a 也變了？</h2>
        <div class="w-full max-w-md rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-purple-400">let</span> a = { name: <span class="text-emerald-300">'小明'</span> }
<span class="text-purple-400">let</span> b = a
b.name = <span class="text-emerald-300">'小華'</span>

console.log(a.name)  <span class="text-slate-500">// '小華' 😱</span></code></pre>
        </div>
        <p class="text-lg font-bold text-purple-300">為什麼改了 b，a 也跟著變？</p>
      </div>
    </div>

    <!-- ===== Step 11: Compare ===== -->
    <div v-else-if="stepData.view === 'compare'" class="slide-page">
      <div class="wm">VS</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">⚖️ 傳值 vs 傳址</h2>
        <div class="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-800">
                <th class="px-4 py-3 text-left text-slate-400"></th>
                <th class="px-4 py-3 text-center text-emerald-300">傳值 (Value)</th>
                <th class="px-4 py-3 text-center text-rose-300">傳址 (Reference)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-slate-700 bg-slate-900">
                <td class="px-4 py-3 font-bold text-slate-300">型別</td>
                <td class="px-4 py-3 text-center text-emerald-300">number, string, boolean</td>
                <td class="px-4 py-3 text-center text-rose-300">object, array, function</td>
              </tr>
              <tr class="border-t border-slate-700 bg-slate-800/50">
                <td class="px-4 py-3 font-bold text-slate-300">賦值時</td>
                <td class="px-4 py-3 text-center text-emerald-300">複製一份副本</td>
                <td class="px-4 py-3 text-center text-rose-300">共用同一個位址</td>
              </tr>
              <tr class="border-t border-slate-700 bg-slate-900">
                <td class="px-4 py-3 font-bold text-slate-300">改了 b</td>
                <td class="px-4 py-3 text-center text-emerald-300">a 不受影響 ✓</td>
                <td class="px-4 py-3 text-center text-rose-300">a 也跟著變 ✗</td>
              </tr>
              <tr class="border-t border-slate-700 bg-slate-800/50">
                <td class="px-4 py-3 font-bold text-slate-300">生活比喻</td>
                <td class="px-4 py-3 text-center text-emerald-300">📸 傳照片</td>
                <td class="px-4 py-3 text-center text-rose-300">📝 共編文件</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===== Step 12: Memory Visual ===== -->
    <div v-else-if="stepData.view === 'memory-visual'" class="slide-page">
      <div class="wm">MEMORY</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">🧠 記憶體裡的差別</h2>
        <div class="flex flex-col gap-6 md:flex-row md:gap-8">
          <!-- Pass by Value: two separate chips -->
          <div class="flex flex-col items-center gap-2">
            <p class="text-base font-bold text-emerald-300">📸 傳值：各佔一格記憶體</p>
            <div class="mem-board" style="max-width: 240px;">
              <div class="mem-board-header"><div class="mem-board-dot"></div><span>MEMORY</span></div>
              <div class="flex items-end justify-center gap-2 px-3 py-3">
                <div class="ram-chip-wrapper">
                  <div class="h-5 text-center"><span class="ram-var-label">a</span></div>
                  <div class="ram-chip ram-chip-active"><span class="text-sm font-bold text-amber-300">10</span></div>
                  <span class="mt-0.5 text-[10px] text-emerald-300/70">#003</span>
                </div>
                <div class="ram-chip-wrapper">
                  <div class="h-5"></div>
                  <div class="ram-chip"><span class="text-[10px] text-slate-700">空</span></div>
                  <span class="mt-0.5 text-[10px] text-emerald-900/60">#004</span>
                </div>
                <div class="ram-chip-wrapper">
                  <div class="h-5 text-center"><span class="ram-var-label">b</span></div>
                  <div class="ram-chip ram-chip-active"><span class="text-sm font-bold text-amber-300">10</span></div>
                  <span class="mt-0.5 text-[10px] text-emerald-300/70">#005</span>
                </div>
              </div>
            </div>
            <p class="text-xs text-emerald-300">改 b 的記憶體，a 的不受影響</p>
          </div>
          <!-- Pass by Reference: same chip, two labels -->
          <div class="flex flex-col items-center gap-2">
            <p class="text-base font-bold text-rose-300">📝 傳址：共用一格記憶體</p>
            <div class="mem-board" style="max-width: 240px;">
              <div class="mem-board-header"><div class="mem-board-dot"></div><span>MEMORY</span></div>
              <div class="flex items-end justify-center gap-2 px-3 py-3">
                <div class="ram-chip-wrapper">
                  <div class="h-5"></div>
                  <div class="ram-chip"><span class="text-[10px] text-slate-700">空</span></div>
                  <span class="mt-0.5 text-[10px] text-emerald-900/60">#002</span>
                </div>
                <div class="ram-chip-wrapper" style="flex: 1.5;">
                  <div class="flex h-5 justify-center gap-1">
                    <span class="ram-var-label">a</span>
                    <span class="ram-var-label">b</span>
                  </div>
                  <div class="ram-chip ram-chip-glow w-full" style="height: 52px; animation: none;">
                    <span class="text-xs font-bold text-white">{ ... }</span>
                  </div>
                  <span class="mt-0.5 text-[10px] text-emerald-300/70">#003</span>
                </div>
                <div class="ram-chip-wrapper">
                  <div class="h-5"></div>
                  <div class="ram-chip"><span class="text-[10px] text-slate-700">空</span></div>
                  <span class="mt-0.5 text-[10px] text-emerald-900/60">#004</span>
                </div>
              </div>
            </div>
            <p class="text-xs text-rose-300">改了記憶體內容，a 和 b 都看到</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 13: Array Ref ===== -->
    <div v-else-if="stepData.view === 'array-ref'" class="slide-page">
      <div class="wm">ARRAY</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">📚 陣列也是傳址！</h2>

        <div class="w-full max-w-md rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-purple-400">let</span> a = [<span class="text-amber-300">1</span>, <span class="text-amber-300">2</span>, <span class="text-amber-300">3</span>]
<span class="text-purple-400">let</span> b = a   <span class="text-slate-500">// {{ arrPhase >= 1 ? '✓' : '←' }}</span>
<span v-if="arrPhase >= 2">b.push(<span class="text-amber-300">4</span>)   <span class="text-slate-500">// ✓</span>

console.log(a)  <span class="text-slate-500">// [1, 2, 3, 4] 😱</span></span></code></pre>
        </div>

        <!-- Array visualization -->
        <div class="flex items-center gap-8">
          <div class="flex flex-col items-center gap-2">
            <span class="text-sm font-bold text-purple-300">a</span>
            <div class="flex gap-1">
              <div v-for="(n, i) in arrA" :key="'a'+i" class="flex h-10 w-10 items-center justify-center rounded-lg border border-purple-400 bg-purple-500/20 font-bold text-white">{{ n }}</div>
            </div>
          </div>
          <div v-if="arrPhase >= 1" class="flex flex-col items-center gap-2">
            <span class="text-sm font-bold text-slate-400">b</span>
            <p class="text-xs text-rose-300">↑ 同一個陣列</p>
          </div>
        </div>

        <div class="flex gap-4">
          <button v-if="arrPhase === 0" @click="arrAssign" class="btn-action animate-bounce">
            執行 let b = a
          </button>
          <button v-if="arrPhase === 1" @click="arrPush" class="btn-action animate-bounce">
            執行 b.push(4)
          </button>
        </div>

        <p v-if="arrPhase >= 2" class="text-lg font-bold text-purple-300">a 現在有幾個元素？</p>
      </div>
    </div>

    <!-- ===== Step 14: Function Side Effect ===== -->
    <div v-else-if="stepData.view === 'function-side-effect'" class="slide-page">
      <div class="wm">SIDE EFFECT</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">⚠️ 函式的副作用</h2>

        <div class="w-full max-w-md rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-purple-400">function</span> <span class="text-blue-300">changeName</span>(person) {
  person.name = <span class="text-emerald-300">'被改掉了'</span>
}

<span class="text-purple-400">let</span> me = { name: <span class="text-emerald-300">'小明'</span> }
changeName(me)

console.log(me.name) <span class="text-slate-500">// {{ fnPhase >= 1 ? "'被改掉了' 😱" : '???' }}</span></code></pre>
        </div>

        <div class="flex items-center gap-8">
          <div class="flex flex-col items-center gap-2">
            <span class="text-sm font-bold text-purple-300">me</span>
            <div class="flex h-16 w-48 items-center justify-center rounded-xl border-2 text-sm font-bold text-white transition-all duration-500"
                 :class="fnPhase >= 1 ? 'border-rose-400 bg-rose-500/10' : 'border-yellow-400 bg-yellow-500/10'">
              { name: '{{ fnPersonName }}' }
            </div>
          </div>
        </div>

        <button v-if="fnPhase === 0" @click="fnRunEffect" class="btn-action animate-bounce">
          執行 changeName(me)
        </button>

        <div v-if="fnPhase >= 1" class="max-w-md rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-center text-sm text-slate-300">
          你以為函式裡面做的事「只在裡面」，但因為傳址，<strong class="text-rose-300">外面的 me 也被改了</strong>。
        </div>
      </div>
    </div>

    <!-- ===== Step 15: Thinking Roles ===== -->
    <div v-else-if="stepData.view === 'thinking-roles'" class="slide-page">
      <div class="wm">THINK</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">💭 不同名字，同一個你</h2>

        <div class="w-full max-w-md rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-purple-400">let</span> employee = { mood: <span class="text-emerald-300">'開心'</span>, energy: <span class="text-amber-300">100</span> }
<span v-if="rolePhase >= 1">
<span class="text-purple-400">let</span> 老闆眼中的你 = employee</span><span v-if="rolePhase >= 2">
<span class="text-purple-400">let</span> 媽媽眼中的你 = employee</span><span v-if="rolePhase >= 3">
<span class="text-purple-400">let</span> 朋友眼中的你 = employee

<span class="text-slate-500">// 三個變數，指向同一個你</span></span></code></pre>
        </div>

        <!-- Visual -->
        <div class="flex items-center gap-4">
          <div class="flex flex-col gap-3">
            <div v-for="(name, i) in roleNames" :key="name"
                 class="flex items-center gap-3 rounded-xl border px-4 py-2 text-sm font-bold transition-all duration-500"
                 :class="i < rolePhase ? 'border-purple-400 bg-purple-500/10 text-purple-300' : 'border-slate-700 bg-slate-800 text-slate-600'">
              <span>{{ ['💼', '👩', '🍻'][i] }}</span>
              {{ name }}
              <span v-if="i < rolePhase" class="text-purple-400">→</span>
            </div>
          </div>
          <div v-if="rolePhase >= 1" class="flex h-24 w-24 items-center justify-center rounded-full border-2 border-yellow-400 bg-yellow-500/10 text-3xl">
            🧑
          </div>
        </div>

        <button v-if="rolePhase < 3" @click="showNextRole" class="btn-action animate-bounce">
          {{ rolePhase === 0 ? '加入第一個角色' : rolePhase === 1 ? '加入第二個角色' : '加入第三個角色' }}
        </button>

        <p v-if="rolePhase >= 3" class="max-w-md text-center text-sm text-slate-300">
          你只有一個自己，但被很多角色引用著。<br />
          你改了自己的某個面向，<strong class="text-purple-300">所有引用你的人都會感受到</strong>。
        </p>
      </div>
    </div>

    <!-- ===== Step 16: Thinking Break Free ===== -->
    <div v-else-if="stepData.view === 'thinking-breakfree'" class="slide-page">
      <div class="wm">THINK</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">💭 斷開連結，需要一層一層來</h2>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 p-6">
          <p class="mb-4 text-base text-slate-300">傳址讓兩個變數連在一起。要斷開，不是改個名字就好。</p>
          <div class="mb-4 rounded-xl bg-slate-900 p-4">
            <pre class="text-sm text-slate-300"><code><span class="text-purple-400">let</span> oldMe = { habit: <span class="text-emerald-300">'熬夜'</span> }
<span class="text-purple-400">let</span> newMe = oldMe  <span class="text-slate-500">// 還是同一個人</span>

newMe.habit = <span class="text-emerald-300">'早睡'</span>
console.log(oldMe.habit) <span class="text-slate-500">// '早睡' ← 真的斷開了嗎？</span></code></pre>
          </div>
          <p class="mb-3 text-base text-slate-300">生活也是這樣：</p>
          <div class="space-y-3">
            <div class="flex items-start gap-3 rounded-lg bg-slate-900/50 px-4 py-3">
              <span class="text-lg">🏙️</span>
              <p class="text-sm text-slate-300">你換了城市、換了工作、換了對象</p>
            </div>
            <div class="flex items-start gap-3 rounded-lg bg-slate-900/50 px-4 py-3">
              <span class="text-lg">🔗</span>
              <p class="text-sm text-slate-300">但如果底層的思考方式沒有重建，<strong class="text-rose-300">你會重複同樣的結果</strong></p>
            </div>
            <div class="flex items-start gap-3 rounded-lg bg-purple-500/10 px-4 py-3">
              <span class="text-lg">🧠</span>
              <p class="text-sm text-purple-300"><strong>斷開連結需要有意識地、一層一層地處理</strong>——不是表面改個變數名就行</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 17: Thinking Cost ===== -->
    <div v-else-if="stepData.view === 'thinking-cost'" class="slide-page">
      <div class="wm">THINK</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">💭 獨立是要付成本的</h2>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 p-6">
          <p class="mb-4 text-base text-slate-300">在程式裡，複製一份副本要花<strong class="text-purple-300">記憶體和時間</strong>。傳址很省，但有風險。</p>
          <div class="mb-4 flex gap-4">
            <div class="flex-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <p class="text-2xl">📸</p>
              <p class="mt-2 text-sm font-bold text-emerald-300">傳值（複製）</p>
              <p class="mt-1 text-xs text-slate-400">安全，但花成本</p>
            </div>
            <div class="flex-1 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-center">
              <p class="text-2xl">📝</p>
              <p class="mt-2 text-sm font-bold text-rose-300">傳址（共用）</p>
              <p class="mt-1 text-xs text-slate-400">省資源，但有風險</p>
            </div>
          </div>
          <p class="mb-3 text-base text-slate-300">生活也一樣：</p>
          <div class="space-y-3">
            <div class="flex items-start gap-3 rounded-lg bg-slate-900/50 px-4 py-3">
              <span class="text-lg">🚶</span>
              <p class="text-sm text-slate-300">跟著別人的想法走很輕鬆（傳址）——不用花腦力，但你的觀點會被別人改動</p>
            </div>
            <div class="flex items-start gap-3 rounded-lg bg-slate-900/50 px-4 py-3">
              <span class="text-lg">🧗</span>
              <p class="text-sm text-slate-300">自己建立一套觀點很累（傳值）——要花時間思考，但<strong class="text-emerald-300">那才是真正屬於你的</strong></p>
            </div>
            <div class="flex items-start gap-3 rounded-lg bg-purple-500/10 px-4 py-3">
              <span class="text-lg">🔑</span>
              <p class="text-sm text-purple-300"><strong>獨立思考是有成本的，但那是值得付出的代價</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 18: Challenge 1 ===== -->
    <div v-else-if="stepData.view === 'challenge-1'" class="slide-page">
      <div class="wm">CHALLENGE</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">🏆 挑戰題 1</h2>
        <div class="w-full max-w-md rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-purple-400">let</span> x = <span class="text-amber-300">10</span>
<span class="text-purple-400">let</span> y = x
y = <span class="text-amber-300">20</span>

console.log(x)  <span class="text-slate-500">// ???</span></code></pre>
        </div>
        <p class="text-lg font-bold text-purple-300">console.log(x) 會印出什麼？</p>
      </div>
    </div>

    <!-- ===== Step 19: Challenge 2 ===== -->
    <div v-else-if="stepData.view === 'challenge-2'" class="slide-page">
      <div class="wm">CHALLENGE</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">🏆 挑戰題 2</h2>
        <div class="w-full max-w-md rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-purple-400">let</span> a = { color: <span class="text-emerald-300">'red'</span> }
<span class="text-purple-400">let</span> b = a
b.color = <span class="text-emerald-300">'blue'</span>

console.log(a.color)  <span class="text-slate-500">// ???</span></code></pre>
        </div>
        <p class="text-lg font-bold text-purple-300">console.log(a.color) 會印出什麼？</p>
      </div>
    </div>

    <!-- ===== Step 20: Challenge 3 ===== -->
    <div v-else-if="stepData.view === 'challenge-3'" class="slide-page">
      <div class="wm">CHALLENGE</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">🏆 挑戰題 3</h2>
        <div class="w-full max-w-md rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-purple-400">let</span> a = [<span class="text-amber-300">1</span>, <span class="text-amber-300">2</span>, <span class="text-amber-300">3</span>]
<span class="text-purple-400">let</span> b = a
b.push(<span class="text-amber-300">4</span>)

console.log(a.length)  <span class="text-slate-500">// ???</span></code></pre>
        </div>
        <p class="text-lg font-bold text-purple-300">console.log(a.length) 會印出什麼？</p>
      </div>
    </div>

    <!-- ===== Step 21: Challenge 4 ===== -->
    <div v-else-if="stepData.view === 'challenge-4'" class="slide-page">
      <div class="wm">CHALLENGE</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">🏆 挑戰題 4</h2>
        <div class="w-full max-w-md rounded-xl bg-slate-900 p-4">
          <pre class="text-sm text-slate-300"><code><span class="text-purple-400">function</span> <span class="text-blue-300">addScore</span>(obj) {
  obj.score = obj.score + <span class="text-amber-300">10</span>
}

<span class="text-purple-400">let</span> player = { score: <span class="text-amber-300">20</span> }
addScore(player)

console.log(player.score)  <span class="text-slate-500">// ???</span></code></pre>
        </div>
        <p class="text-lg font-bold text-purple-300">console.log(player.score) 會印出什麼？</p>
      </div>
    </div>

    <!-- ===== Step 22: Summary Insight ===== -->
    <div v-else-if="stepData.view === 'summary-insight'" class="slide-page">
      <div class="wm">KEY</div>
      <div class="flex flex-col items-center gap-8">
        <h2 class="text-xl font-bold text-white">🔑 核心觀念</h2>
        <div class="flex flex-col gap-4 md:flex-row md:gap-8">
          <div class="w-72 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
            <p class="mb-2 text-3xl">📸</p>
            <p class="text-lg font-bold text-emerald-300">傳值 (Value)</p>
            <p class="mt-2 text-sm text-slate-300">基本型別</p>
            <p class="mt-1 text-sm text-slate-300">number, string, boolean</p>
            <div class="mt-4 rounded-lg bg-emerald-500/20 px-3 py-2">
              <p class="text-sm font-bold text-emerald-300">複製一份副本</p>
              <p class="text-xs text-slate-400">改 b，a 不受影響</p>
            </div>
          </div>
          <div class="w-72 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center">
            <p class="mb-2 text-3xl">📝</p>
            <p class="text-lg font-bold text-rose-300">傳址 (Reference)</p>
            <p class="mt-2 text-sm text-slate-300">物件型別</p>
            <p class="mt-1 text-sm text-slate-300">object, array, function</p>
            <div class="mt-4 rounded-lg bg-rose-500/20 px-3 py-2">
              <p class="text-sm font-bold text-rose-300">共用同一個位址</p>
              <p class="text-xs text-slate-400">改 b，a 也跟著變</p>
            </div>
          </div>
        </div>
        <div class="max-w-md rounded-2xl border border-purple-500/30 bg-purple-500/10 px-6 py-4 text-center">
          <p class="text-base font-bold text-purple-300">下次寫 let b = a 之前</p>
          <p class="mt-2 text-sm text-slate-300">先想想 a 是什麼型別，你就知道 b 拿到的是副本還是同一個。</p>
        </div>
      </div>
    </div>

    <!-- ===== Step 23: Summary Review ===== -->
    <div v-else-if="stepData.view === 'summary-review'" class="slide-page">
      <div class="wm">REVIEW</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">📖 學習回顧</h2>
        <div class="w-full max-w-md space-y-3">
          <div v-for="(item, i) in [
            { emoji: '📸', text: '從生活情境理解「複製 vs 共用」' },
            { emoji: '🎮', text: '認識了記憶體的格子世界' },
            { emoji: '🔢', text: '基本型別是傳值：各自獨立' },
            { emoji: '📦', text: '物件型別是傳址：共用同一個' },
            { emoji: '⚖️', text: '比較了傳值與傳址的差異' },
            { emoji: '📚', text: '陣列也是傳址' },
            { emoji: '⚠️', text: '函式傳參也會有副作用' },
            { emoji: '💭', text: '同一份資料，不同角色不同名字' },
            { emoji: '🔗', text: '斷開連結要一層一層來' },
            { emoji: '🧗', text: '獨立思考是有成本的，但值得' },
            { emoji: '🏆', text: '通過了 4 道挑戰題' },
          ]" :key="i"
            class="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 transition-all"
          >
            <span class="text-xl">{{ item.emoji }}</span>
            <span class="text-sm text-slate-300">{{ item.text }}</span>
            <span class="ml-auto text-emerald-400">✓</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 24: Summary End ===== -->
    <div v-else-if="stepData.view === 'summary-end'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">END</div>
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-purple-400 object-cover shadow-xl shadow-purple-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-purple-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">太棒了！你已經掌握了傳值與傳址 🎉</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">記住這個關鍵判斷：</p>
          <p class="mb-2 text-sm leading-relaxed text-white md:text-base"><strong>基本型別 → 傳值 → 獨立副本</strong></p>
          <p class="mb-2 text-sm leading-relaxed text-white md:text-base"><strong>物件型別 → 傳址 → 共用同一個</strong></p>
          <p class="mb-3 text-sm leading-relaxed text-slate-300 md:text-base">下次寫 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-purple-300">let b = a</code> 的時候，先想想 a 是什麼型別。</p>
          <p class="text-xs text-slate-500 italic">「搞清楚誰跟誰連動，bug 就少一半。」—— 海姐</p>
        </div>
      </div>
    </div>

  </InteractiveSlideTemplate>
</template>

<style scoped>
/* Watermark */
.wm {
  @apply pointer-events-none fixed inset-0 z-0 flex items-center justify-center text-[12rem] font-black leading-none tracking-widest text-white/[0.02] select-none;
}

/* Slide page */
.slide-page {
  @apply relative z-10 mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12;
}

/* Question button */
.q-btn {
  @apply rounded-xl border border-slate-600 bg-slate-800 px-5 py-3 text-sm font-bold text-white transition-all hover:border-purple-400 hover:bg-purple-500/10 hover:text-purple-300 active:scale-95;
}

/* Action button */
.btn-action {
  @apply rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40;
}

/* Value box appear animation */
@keyframes valueAppear {
  0% {
    opacity: 0;
    transform: translateY(-8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-value-appear {
  animation: valueAppear 0.5s ease-out;
}

/* ── RAM Stick ── */
.ram-stick {
  position: relative;
  width: 100%;
  max-width: 520px;
  background: linear-gradient(180deg, #1a3a2a 0%, #143024 40%, #0f2a1e 100%);
  border: 2px solid #2d5a3f;
  border-radius: 8px 8px 2px 2px;
  padding: 12px 16px 0 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
}
.ram-notch {
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 6px;
  background: #0f172a;
  border-radius: 0 0 4px 4px;
  border: 1px solid #2d5a3f;
  border-top: none;
}
.ram-label {
  position: absolute;
  top: 6px;
  right: 12px;
  font-size: 9px;
  font-weight: bold;
  letter-spacing: 1px;
  color: rgba(74, 222, 128, 0.25);
}
.ram-chips {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  padding: 0 4px;
}
.ram-chip-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.ram-chip {
  width: 100%;
  height: 48px;
  background: #1a1a2e;
  border: 1.5px solid #2a2a3e;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03);
}
/* Compact RAM board (reusable for demo slides) */
.mem-board {
  position: relative;
  width: 100%;
  max-width: 480px;
  background: linear-gradient(180deg, #1a3a2a 0%, #143024 40%, #0f2a1e 100%);
  border: 2px solid #2d5a3f;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
}
.mem-board-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 0;
  font-size: 9px;
  font-weight: bold;
  letter-spacing: 1px;
  color: rgba(74, 222, 128, 0.3);
}
.mem-board-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #4ade80;
  animation: pulse 2s ease-in-out infinite;
}
.ram-chip-active {
  border-color: #6d28d9;
  background: #1e1035;
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.2);
}
.ram-chip-glow {
  border-color: #a78bfa;
  background: #2e1065;
  box-shadow: 0 0 16px rgba(139, 92, 246, 0.4), 0 0 4px rgba(139, 92, 246, 0.6);
  animation: chipGlow 1.5s ease-in-out infinite;
}
.ram-chip-changed {
  border-color: #f43f5e;
  background: #2e1025;
  box-shadow: 0 0 12px rgba(244, 63, 94, 0.3);
}
.ram-chip-faded {
  border-color: #334155;
  background: #1a1a2e;
  opacity: 0.5;
}
@keyframes chipGlow {
  0%, 100% { box-shadow: 0 0 8px rgba(139, 92, 246, 0.3); }
  50% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.6), 0 0 6px rgba(139, 92, 246, 0.8); }
}
.ram-var-label {
  display: inline-block;
  font-size: 11px;
  font-weight: bold;
  color: #c084fc;
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 4px;
  padding: 0 6px;
  line-height: 18px;
}
/* Circuit traces between chips and pins */
.ram-traces {
  display: flex;
  justify-content: space-between;
  padding: 6px 8px 4px 8px;
}
.ram-trace {
  width: 1px;
  height: 10px;
  background: rgba(74, 222, 128, 0.15);
}
/* Gold contact pins */
.ram-pins {
  position: relative;
  margin: 0 -16px;
  border-top: 1px solid #2d5a3f;
}
.ram-pin-notch {
  position: absolute;
  top: -1px;
  left: 38%;
  width: 16px;
  height: 100%;
  background: #0f172a;
  border-left: 1px solid #2d5a3f;
  border-right: 1px solid #2d5a3f;
}
.ram-pin-row {
  display: flex;
  gap: 2px;
  padding: 3px 6px;
}
.ram-pin {
  flex: 1;
  height: 10px;
  background: linear-gradient(180deg, #d4a84b 0%, #b8922f 50%, #d4a84b 100%);
  border-radius: 0 0 1px 1px;
}
</style>
