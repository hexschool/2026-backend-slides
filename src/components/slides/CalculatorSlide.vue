<script setup lang="ts">
/**
 * Stack 引導式互動教學 v10
 * 11 步驟體驗式學習：做 → 觀察 → 提問 → 領悟
 */
import { ref, computed, watch, onMounted } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'
import StackPracticeSlide from './StackPracticeSlide.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

type Step = { id: number; view: string; title: string; desc: string }
const STEPS: Step[] = [
  { id: 0,  view: 'welcome',      title: '歡迎',         desc: '海姐帶你探索堆疊' },
  { id: 1,  view: 'physics',      title: '物理法則',     desc: '只能拿最上面的' },
  { id: 2,  view: 'push',         title: 'Push 放入',    desc: '疊上去，觀察位置' },
  { id: 3,  view: 'pop',          title: 'Pop 取出',     desc: '拿出來，發現 LIFO' },
  { id: 4,  view: 'lifo-replay',  title: 'LIFO 動畫',    desc: '看見後進先出的規律' },
  { id: 5,  view: 'lifo-life',    title: '生活中的 LIFO', desc: '你每天都在用 Stack' },
  { id: 6,  view: 'lifo-quiz',    title: 'LIFO 挑戰',    desc: '預測 Pop 的順序' },
  { id: 7,  view: 'browser',      title: '網頁應用',     desc: '上一頁 = Pop' },
  { id: 8,  view: 'code',         title: 'JS 語法',      desc: 'push · pop 實戰' },
  { id: 9,  view: 'figma',        title: '設計時光機',   desc: 'Ctrl+Z 的秘密' },
  { id: 10, view: 'callstack',    title: 'Call Stack',   desc: 'JS 引擎核心' },
  { id: 11, view: 'parser',       title: '語法檢查',     desc: '括號匹配 Parser' },
  { id: 12, view: 'calculator',   title: '計算機',       desc: 'Stack 記住你的操作' },
  { id: 13, view: 'js-array',     title: 'JS 陣列全貌',  desc: 'push · pop · shift · unshift' },
  { id: 14, view: 'calc-array',   title: '計算機 × 陣列', desc: '按鍵盤，看 Stack 狀態' },
  { id: 15, view: 'calc-undo',    title: '計算機 Undo',   desc: '按錯了？Pop 回上一步' },
  { id: 16, view: 'pop-return',   title: 'Pop 的回傳值', desc: 'pop() 會把值交給你' },
  { id: 17, view: 'calc-compute', title: '手動計算',     desc: '一步步 Pop 出來算' },
  { id: 18, view: 'practice',      title: '實戰練習',     desc: '7 關 CodePen 挑戰' },
  { id: 19, view: 'hw-intro',      title: '換你上場',     desc: '作業時間到！' },
  { id: 20, view: 'homework-demo', title: '作業預覽',     desc: '看看計算機怎麼運作' },
  { id: 21, view: 'homework-files', title: '作業檔案',    desc: '資料夾結構與開始方式' },
  { id: 22, view: 'hw-code-overview', title: '程式碼全貌',       desc: '先看懂 calculator.js 的結構' },
  { id: 23, view: 'hw-code-calc',   title: '寫 add + subtract', desc: '跟著提示寫第一組方法' },
  { id: 24, view: 'hw-code-undo',   title: '寫 undo',          desc: '跟著提示完成還原功能' },
  { id: 25, view: 'summary-insight',  title: '核心觀念',          desc: '還原上一步 = Stack' },
  { id: 26, view: 'summary-review',   title: '學習回顧',          desc: '今天走過的路' },
  { id: 27, view: 'summary-end',      title: '課程結束',          desc: '準備好了，出發吧' },
]

// ── Core ──
const currentStep = ref(0)
const animState = ref(0)
const stepData = computed(() => STEPS[currentStep.value])
const feedback = ref('')
const feedbackType = ref<'neutral' | 'success' | 'error' | 'question'>('neutral')

// ── Practice (embedded StackPracticeSlide) ──
const practiceComplete = ref(false)
function handlePracticeComplete() {
  practiceComplete.value = true
  currentStep.value++
}

// ── Step 1-3: Plates ──
type Plate = { id: string; name: string; isNew: boolean }
const plates = ref<Plate[]>([])
const physicsCleared = ref(false)
const pushCount = ref(0)
const pushAnswer = ref('')
const popDone = ref(false)
const popAnswer = ref('')

function handlePlateClick(index: number) {
  if (physicsCleared.value) return
  if (index === plates.value.length - 1) {
    plates.value.pop()
    physicsCleared.value = true
    feedback.value = '做得不錯！你發現了——只有最上面那個可以拿走。這就像健身房的槓片架，最後放上去的一定先被拿走。'
    feedbackType.value = 'success'
  } else {
    feedback.value = '嘿，你想想看，如果硬把中間的抽出來，上面的盤子是不是會倒？試試最上面那個。'
    feedbackType.value = 'error'
  }
}
function handlePush() {
  if (pushCount.value >= 3) return
  const names = ['D', 'E', 'F']
  const name = names[pushCount.value]
  plates.value.push({ id: name, name, isNew: true })
  pushCount.value++
  if (pushCount.value < 3) {
    feedback.value = `好，盤子 ${name} 放上去了！繼續放 (${pushCount.value}/3)`
    feedbackType.value = 'neutral'
  } else {
    feedback.value = '三個都放好了。你有沒有注意到——盤子 F 是最後放上去的，它現在在什麼位置？'
    feedbackType.value = 'question'
  }
}
function answerPush(answer: string) {
  pushAnswer.value = answer
  if (answer === 'top') {
    feedback.value = '你觀察得很仔細！最後進來的東西，永遠在最上面。記住這個感覺。'
    feedbackType.value = 'success'
  } else {
    pushAnswer.value = ''
    feedback.value = '別急，再看一下畫面。盤子 F 是你剛剛才放的，它在最上面還是最下面呢？'
    feedbackType.value = 'error'
  }
}
function handlePop() {
  if (popDone.value) return
  plates.value.pop()
  popDone.value = true
  feedback.value = '盤子 F 被拿走了！它是最後放進去的，卻第一個出來。你覺得 Stack 的規則是哪一個？'
  feedbackType.value = 'question'
}
function answerPop(answer: string) {
  popAnswer.value = answer
  if (answer === 'lifo') {
    feedback.value = '完全正確！最後放的先拿出來——這個規則叫做 LIFO（Last In, First Out，後進先出）。恭喜你，這是 Stack 最核心的觀念，而且是你自己發現的。'
    feedbackType.value = 'success'
  } else {
    popAnswer.value = ''
    feedback.value = '想一下：盤子 F 是「最後」放進去的，卻「第一個」被你拿出來——所以是先放的先出來，還是最後放的先出來？'
    feedbackType.value = 'error'
  }
}

// ── Step 4: LIFO Replay ──
const replayItems = [
  { label: '1', color: 'bg-blue-500' },
  { label: '2', color: 'bg-emerald-500' },
  { label: '3', color: 'bg-purple-500' },
  { label: '4', color: 'bg-rose-500' },
]
const replayPhase = ref(0) // 0=ready, 1=pushing, 2=pause, 3=popping, 4=done
const replayStack = ref<{ label: string; color: string }[]>([])
const replayPopped = ref<{ label: string; color: string }[]>([])

async function startReplay() {
  if (replayPhase.value !== 0) return
  replayPhase.value = 1
  feedback.value = '看好了——我們把 1、2、3、4 依序放進 Stack。'
  feedbackType.value = 'neutral'
  for (let i = 0; i < replayItems.length; i++) {
    await delay(700)
    if (stepData.value.view !== 'lifo-replay') return
    replayStack.value.push({ ...replayItems[i] })
    if (i < replayItems.length - 1) {
      feedback.value = `${replayItems[i].label} 進去了，繼續...`
    } else {
      feedback.value = '全部放好了！注意看——4 是最後進去的，在最上面。現在它們會依序出來...'
    }
  }
  replayPhase.value = 2
  await delay(1200)
  if (stepData.value.view !== 'lifo-replay') return
  replayPhase.value = 3
  feedback.value = '開始 Pop！最上面的先出來...'
  for (let i = 0; i < replayItems.length; i++) {
    await delay(800)
    if (stepData.value.view !== 'lifo-replay') return
    const item = replayStack.value.pop()!
    replayPopped.value.push(item)
    if (i < replayItems.length - 1) {
      feedback.value = `${item.label} 出來了！接下來是...`
    }
  }
  replayPhase.value = 4
  feedback.value = '看到了嗎？放進去的順序是 1→2→3→4，出來的順序是 4→3→2→1——完全反過來！這就是 LIFO：Last In, First Out。就像健身房的槓片，最後掛上去的最先被拿下來。'
  feedbackType.value = 'success'
}

// ── Step 5: LIFO in Life ──
type LifeExample = { id: string; emoji: string; title: string; items: string[]; lifoExplain: string }
const lifeExamples: LifeExample[] = [
  { id: 'elevator', emoji: '🛗', title: '電梯', items: ['小明', '小華', '小美'], lifoExplain: '小美最後進電梯，站在門口——電梯門打開時，她最先出去。' },
  { id: 'pringles', emoji: '🥫', title: '品客洋芋片', items: ['原味', '起司', 'BBQ'], lifoExplain: 'BBQ 口味最後放進罐子，在最上面——你打開蓋子，第一片拿到的就是 BBQ。' },
  { id: 'parking', emoji: '🅿️', title: '死巷停車場', items: ['🚗 紅車', '🚙 藍車', '🚕 黃車'], lifoExplain: '黃車最後開進死巷，擋在最外面——要離開的時候，黃車得先開走，藍車才出得去。' },
]
const lifeCurrentIdx = ref(0)
const lifeAnimPhase = ref(0) // 0=idle, 1=stacked, 2=popped, 3=explained
const lifeSeenCount = ref(0)
const lifeAnswer = ref('')
const lifeVisibleStack = computed(() => {
  const items = lifeExamples[lifeCurrentIdx.value].items
  if (lifeAnimPhase.value < 2) return [...items]
  return items.slice(0, -1)
})
const lifePoppedItem = computed(() => {
  if (lifeAnimPhase.value < 2) return null
  const items = lifeExamples[lifeCurrentIdx.value].items
  return items[items.length - 1]
})

function lifeStartExample() {
  lifeAnimPhase.value = 1
  const ex = lifeExamples[lifeCurrentIdx.value]
  feedback.value = `來看看「${ex.title}」的例子。${ex.items.join('、')} 依序進入...`
  feedbackType.value = 'neutral'
  setTimeout(() => {
    if (stepData.value.view !== 'lifo-life') return
    lifeAnimPhase.value = 2
    feedback.value = `現在要出來了——誰會先出來？`
  }, 2000)
  setTimeout(() => {
    if (stepData.value.view !== 'lifo-life') return
    lifeAnimPhase.value = 3
    feedback.value = ex.lifoExplain
    feedbackType.value = 'success'
    lifeSeenCount.value = Math.max(lifeSeenCount.value, lifeCurrentIdx.value + 1)
  }, 3500)
}
function lifeNextExample() {
  if (lifeCurrentIdx.value < lifeExamples.length - 1) {
    lifeCurrentIdx.value++
    lifeStartExample()
  }
}
function answerLife(answer: string) {
  lifeAnswer.value = answer
  if (answer === 'queue') {
    feedback.value = '太棒了！排隊買飲料是「先來先服務」——那叫做 FIFO（First In, First Out），是 Queue（佇列），不是 Stack。你已經能分辨 LIFO 和 FIFO 了！'
    feedbackType.value = 'success'
  } else {
    lifeAnswer.value = ''
    feedback.value = '想一下——電梯裡最後進去的人，站在門口，一定先出來。那排隊買飲料呢？先排的人先買到，這是 LIFO 嗎？'
    feedbackType.value = 'error'
  }
}

// ── Step 6: LIFO Quiz ──
const quizPushSequence = ['A', 'B', 'C', 'D']
const quizStack = ref<string[]>([])
const quizPoppedByUser = ref<string[]>([])
const quizPhase = ref(0) // 0=pushing(auto), 1=ready, 2=user-popping, 3=done
const quizMistakes = ref(0)

async function startQuiz() {
  quizPhase.value = 0
  quizStack.value = []
  quizPoppedByUser.value = []
  quizMistakes.value = 0
  feedback.value = '注意看，我要把 A、B、C、D 依序放進 Stack...'
  feedbackType.value = 'neutral'
  for (let i = 0; i < quizPushSequence.length; i++) {
    await delay(600)
    if (stepData.value.view !== 'lifo-quiz') return
    quizStack.value.push(quizPushSequence[i])
  }
  await delay(800)
  if (stepData.value.view !== 'lifo-quiz') return
  quizPhase.value = 1
  feedback.value = '全部放好了！現在輪到你了——點擊你認為「下一個會被 Pop」的元素。'
  feedbackType.value = 'question'
}
function quizUserPop(item: string) {
  if (quizPhase.value < 1) return
  quizPhase.value = 2
  const expectedNext = quizStack.value[quizStack.value.length - 1]
  if (item === expectedNext) {
    quizStack.value.pop()
    quizPoppedByUser.value.push(item)
    if (quizStack.value.length === 0) {
      quizPhase.value = 3
      feedback.value = quizMistakes.value === 0
        ? '完美！一次都沒錯！你已經徹底掌握 LIFO 了——最後進去的，一定最先出來。'
        : `做到了！雖然錯了 ${quizMistakes.value} 次，但你最後答對了——LIFO 就是這麼回事。`
      feedbackType.value = 'success'
    } else {
      feedback.value = `答對了！${item} 被 Pop 出來了。下一個是誰？`
      feedbackType.value = 'neutral'
    }
  } else {
    quizMistakes.value++
    feedback.value = `不對喔！${item} 不在最上面。記住——Stack 只能從最上面拿。現在最上面是哪一個？`
    feedbackType.value = 'error'
  }
}

// ── Step 7: Browser ──
type BrowsePage = { name: string; url: string; color: string; bg: string }
const browseHistory = ref<BrowsePage[]>([])
const browsePhase = ref(0)
const browserAnswer = ref('')

function visitPage(page: BrowsePage) {
  browseHistory.value.push(page)
  if (browsePhase.value === 0) {
    browsePhase.value = 1
    feedback.value = 'YouTube 進入 Stack 了。再去一個網站看看。'
    feedbackType.value = 'neutral'
  } else if (browsePhase.value === 1) {
    browsePhase.value = 2
    feedback.value = '兩個網站都進了 Stack。現在想想看，如果你按「上一頁」，電腦要怎麼處理最上面的 Instagram？'
    feedbackType.value = 'question'
  }
}
function answerBrowser(answer: string) {
  browserAnswer.value = answer
  if (answer === 'pop') {
    feedback.value = '沒錯！瀏覽器的「上一頁」就是一個 Pop — 把最上面的頁面丟掉，回到下面那層。你每天都在用 Stack，只是沒注意到而已。'
    feedbackType.value = 'success'
  } else {
    browserAnswer.value = ''
    feedback.value = '如果保留 Instagram 不動，螢幕上還是顯示 Instagram，那你就回不去了呀！想想看該怎麼處理它？'
    feedbackType.value = 'error'
  }
}

// ── Step 5: Code ──
const jsStack = ref<string[]>([])
const codeLog = ref<string[]>([])
const jsPushCount = ref(0)
const codeAnswer = ref('')
const codePopped = ref(false)
const jsFruits = [
  { emoji: '🍎', name: '蘋果' },
  { emoji: '🍌', name: '香蕉' },
  { emoji: '🍇', name: '葡萄' },
]

function handleJsPush() {
  if (jsPushCount.value >= 3) return
  const fruit = jsFruits[jsPushCount.value]
  jsStack.value.push(fruit.emoji)
  codeLog.value.push(`stack.push("${fruit.emoji}");  // ${fruit.name}`)
  jsPushCount.value++
  if (jsPushCount.value < 3) {
    feedback.value = `${fruit.emoji} ${fruit.name} 放進去了！繼續 (${jsPushCount.value}/3)`
    feedbackType.value = 'neutral'
  } else {
    feedback.value = '三個水果都放好了。如果現在執行 stack.pop()，你覺得會拿到什麼？'
    feedbackType.value = 'question'
  }
}
function answerCode(answer: string) {
  codeAnswer.value = answer
  if (answer === 'grape') {
    feedback.value = '答對了！JavaScript 的陣列完全遵循 Stack 規則。按下 pop() 來驗證你的答案吧。'
    feedbackType.value = 'success'
  } else {
    codeAnswer.value = ''
    feedback.value = '別急，想一下。蘋果是第一個放進去的，壓在最底下。pop() 會拿走最後放的那個——是誰？'
    feedbackType.value = 'error'
  }
}
function handleJsPop() {
  if (!jsStack.value.length) return
  const v = jsStack.value.pop()
  codeLog.value.push(`stack.pop();       // → ${v}`)
  codePopped.value = true
  feedback.value = `Pop 出來的果然是 ${v}！看到了嗎？JavaScript 的 Array 天生就有 Stack 的能力。`
  feedbackType.value = 'success'
}

// ── Step 6: Figma ──
const figmaPhase = ref(0)
const figmaHistory = ref<{ action: string; icon: string }[]>([])
const figmaAnswer = ref('')
const figmaUndoCount = ref(0)
const figmaBoxVisible = ref(false)
const figmaBoxColor = ref('#94a3b8')
const figmaBoxX = ref(80)

function handleFigmaAction() {
  if (figmaPhase.value === 0) {
    figmaBoxVisible.value = true
    figmaHistory.value.push({ action: '畫出方塊', icon: '⬜' })
    figmaPhase.value = 1
    feedback.value = '方塊出現了！做得好，接下來幫它上色。'
    feedbackType.value = 'neutral'
  } else if (figmaPhase.value === 1) {
    figmaBoxColor.value = '#ef4444'
    figmaHistory.value.push({ action: '填充紅色', icon: '🟥' })
    figmaPhase.value = 2
    feedback.value = '方塊變紅了！最後一個動作——把它往右移。'
    feedbackType.value = 'neutral'
  } else if (figmaPhase.value === 2) {
    figmaBoxX.value = 200
    figmaHistory.value.push({ action: '向右移動', icon: '➡️' })
    figmaPhase.value = 3
    feedback.value = '三個動作都做好了。如果你按 Ctrl+Z 復原，方塊會怎樣？'
    feedbackType.value = 'question'
  }
}
function answerFigma(answer: string) {
  figmaAnswer.value = answer
  if (answer === 'move') {
    feedback.value = '你抓到 LIFO 的精髓了！移動是最後做的，所以第一個被復原。按下「復原」來確認吧。'
    feedbackType.value = 'success'
  } else {
    figmaAnswer.value = ''
    feedback.value = '我們是先上色、最後才移動的。還記得 Stack 的規則嗎？最後做的動作會先被取消。'
    feedbackType.value = 'error'
  }
}
function handleFigmaUndo() {
  if (!figmaHistory.value.length) return
  const last = figmaHistory.value.pop()!
  figmaUndoCount.value++
  if (last.action === '向右移動') {
    figmaBoxX.value = 80
    feedback.value = '看！方塊回到左邊了——「向右移動」被復原了。再按一次看看。'
  } else if (last.action === '填充紅色') {
    figmaBoxColor.value = '#94a3b8'
    feedback.value = '方塊變回灰色了！「填充紅色」也被復原了。這就是 Ctrl+Z 的秘密——每按一次就是一個 Pop。'
  } else if (last.action === '畫出方塊') {
    figmaBoxVisible.value = false
    feedback.value = '方塊消失了！所有動作都被復原了。'
  }
  feedbackType.value = 'success'
}

// ── Step 7: Call Stack ──
const csPhase = ref(0)
const csFrames = ref<string[]>([])
const csAnswer = ref('')
const csHighlight = ref(-1)
const csCode = [
  'function main() {',
  '  console.log("Start");',
  '  calculate();',
  '}',
  '',
  'function calculate() {',
  '  add(5, 3);',
  '}',
  '',
  'function add(a, b) {',
  '  return a + b;',
  '}',
  '',
  'main();',
]

function csAdvance() {
  if (csPhase.value === 3 && csAnswer.value !== 'add') return
  if (csPhase.value >= 6) return
  csPhase.value++
  switch (csPhase.value) {
    case 1:
      csFrames.value = ['main()']
      csHighlight.value = 13
      feedback.value = '程式開始執行 main()，Push 進 Call Stack。'
      feedbackType.value = 'neutral'
      break
    case 2:
      csFrames.value = ['main()', 'calculate()']
      csHighlight.value = 2
      feedback.value = 'main() 裡面呼叫了 calculate()，再 Push 一層上去。'
      feedbackType.value = 'neutral'
      break
    case 3:
      csFrames.value = ['main()', 'calculate()', 'add()']
      csHighlight.value = 6
      feedback.value = 'Stack 現在有三層了。你覺得，誰在最上面？'
      feedbackType.value = 'question'
      break
    case 4:
      csFrames.value = ['main()', 'calculate()']
      csHighlight.value = 10
      feedback.value = 'add() 執行完了，return → Pop！控制權回到 calculate。'
      feedbackType.value = 'neutral'
      break
    case 5:
      csFrames.value = ['main()']
      csHighlight.value = 2
      feedback.value = 'calculate() 也結束了 → Pop！控制權回到 main。'
      feedbackType.value = 'neutral'
      break
    case 6:
      csFrames.value = []
      csHighlight.value = -1
      feedback.value = 'main() 也結束了 → Stack 完全清空！對了，如果函式不斷呼叫自己、永遠不 return，Stack 就會爆掉——這就是 Stack Overflow 的由來。'
      feedbackType.value = 'success'
      break
  }
}
function answerCs(answer: string) {
  csAnswer.value = answer
  if (answer === 'add') {
    feedback.value = '沒錯！add() 在最頂端，是引擎正在執行的函式。main 和 calculate 在下面排隊等它做完。'
    feedbackType.value = 'success'
  } else {
    csAnswer.value = ''
    feedback.value = '想一下：main 是最先被呼叫的，所以壓在最底下。引擎永遠只處理最上面那個。'
    feedbackType.value = 'error'
  }
}

// ── Step 8: Parser ──
const parserCode = 'const a = [ { x: 1 } ];'
const parserCursor = ref(0)
const parserStack = ref<string[]>([])
const parserFinished = ref(false)
const parserMsg = ref('按「讀取下一個字元」開始')
const parserMatched = ref<number[]>([])

function parserAdvance() {
  if (parserCursor.value >= parserCode.length) {
    if (parserStack.value.length === 0) {
      parserFinished.value = true
      parserMsg.value = '✅ 所有括號完美配對！語法正確！'
      feedback.value = '太好了！Stack 清空了，代表所有括號完美配對。你現在知道了——IDE 幫你畫紅線的背後，就是 Stack 在默默工作。'
      feedbackType.value = 'success'
    } else {
      parserMsg.value = '❌ Stack 還有未配對的括號，語法錯誤！'
    }
    return
  }
  const char = parserCode[parserCursor.value]
  if (char === '[' || char === '{') {
    parserStack.value.push(char)
    parserMsg.value = `遇到「${char}」→ Push 進 Stack`
  } else if (char === ']' || char === '}') {
    const top = parserStack.value[parserStack.value.length - 1]
    const match = (char === ']' && top === '[') || (char === '}' && top === '{')
    if (match) {
      parserStack.value.pop()
      parserMatched.value.push(parserCursor.value)
      parserMsg.value = `遇到「${char}」→ 與「${top}」配對成功 ✅ Pop!`
    } else {
      parserMsg.value = `❌ 配對失敗！`
    }
  } else {
    parserMsg.value = `跳過「${char}」`
  }
  parserCursor.value++
  if (parserCursor.value >= parserCode.length) {
    if (parserStack.value.length === 0) {
      parserFinished.value = true
      parserMsg.value = '✅ 所有括號完美配對！語法正確！'
      feedback.value = '太好了！Stack 清空了，代表所有括號完美配對。你現在知道了——IDE 幫你畫紅線的背後，就是 Stack 在默默工作。'
      feedbackType.value = 'success'
    } else {
      parserMsg.value = '❌ Stack 還有未配對的括號，語法錯誤！'
    }
  }
}

// ── Step 9: Calculator ──
const calcInput = ref<string[]>([])
const calcPhase = ref(0) // 0=press 3, 1=press +, 2=press 5, 3=press =, 4=done(question), 5=answered
const calcAnswer = ref('')

function handleCalcPress(val: string) {
  if (calcPhase.value === 0 && val === '3') {
    calcInput.value.push('3')
    calcPhase.value = 1
    feedback.value = '好，「3」Push 進 Stack 了。接下來按「+」。'
    feedbackType.value = 'neutral'
  } else if (calcPhase.value === 1 && val === '+') {
    calcInput.value.push('+')
    calcPhase.value = 2
    feedback.value = '「+」也進去了。最後按「5」。'
    feedbackType.value = 'neutral'
  } else if (calcPhase.value === 2 && val === '5') {
    calcInput.value.push('5')
    calcPhase.value = 3
    feedback.value = '「5」Push 進去了。按「=」來算出結果吧。'
    feedbackType.value = 'neutral'
  } else if (calcPhase.value === 3 && val === '=') {
    calcPhase.value = 4
    feedback.value = '3 + 5 = 8，計算完成！計算機把你按的每個鍵都記在 Stack 裡了。現在問你——如果你想還原剛才輸入的 5，該怎麼做？'
    feedbackType.value = 'question'
  }
}
function answerCalc(answer: string) {
  calcAnswer.value = answer
  if (answer === 'pop') {
    feedback.value = '沒錯！Pop 最後輸入的東西，就是「還原」。Undo 就是 Pop，這就是 Stack 最強大的應用之一。'
    feedbackType.value = 'success'
    calcPhase.value = 5
  } else {
    calcAnswer.value = ''
    feedback.value = '全部清除也太暴力了吧！我們只是想取消最後一步而已。還記得 Stack 的規則嗎？最後放進去的，可以怎麼拿出來？'
    feedbackType.value = 'error'
  }
}

// ── Step 15: Calculator Undo ──
const cuStack = ref<{ id: number; label: string; cls: string }[]>([])
const cuPhase = ref(0) // 0=press3, 1=press+, 2=press7, 3=pressUndo, 4=done
const cuLog = ref<string[]>([])

function cuPress(val: string) {
  if (cuPhase.value === 0 && val === '3') {
    cuStack.value.push({ id: 0, label: '3', cls: 'bg-sky-500 border-sky-400' })
    cuLog.value.push(`stack.push('3');`)
    cuPhase.value = 1
    feedback.value = '「3」進去了。接下來按「+」。'
  } else if (cuPhase.value === 1 && val === '+') {
    cuStack.value.push({ id: 1, label: '+', cls: 'bg-amber-500 border-amber-400' })
    cuLog.value.push(`stack.push('+');`)
    cuPhase.value = 2
    feedback.value = '接下來要按 5⋯但手滑了！按下「7」看看。'
  } else if (cuPhase.value === 2 && val === '7') {
    cuStack.value.push({ id: 2, label: '7', cls: 'bg-red-500 border-red-400' })
    cuLog.value.push(`stack.push('7');  // ⚠️ 按錯了！`)
    cuPhase.value = 3
    feedback.value = '糟糕！按成 7 了。Stack 現在是 [3, +, 7]。怎麼修正？按「Undo」！'
    feedbackType.value = 'error'
  }
}
function cuUndo() {
  if (cuPhase.value !== 3) return
  cuStack.value.pop()
  cuLog.value.push(`stack.pop();  // → '7' ← Undo!`)
  cuPhase.value = 4
  feedback.value = 'Undo 就是 Pop！「7」被拿出來了，Stack 回到 [3, +]。按錯不用怕，Pop 就是你的「上一步」。'
  feedbackType.value = 'success'
}

// ── Step 16: Pop Return Value ──
const prStack = ref<{ id: number; label: string; cls: string }[]>([])
const prVar = ref('')
const prDone = ref(false)

function prPop() {
  if (prDone.value) return
  prStack.value.pop()
  prVar.value = 'C'
  prDone.value = true
  feedback.value = '看到了嗎？pop() 把「C」拿出來，而且值跑到了變數 x 裡面！pop() 不只是「刪掉」，它會把值「交給你」。這就是計算機用來算數的秘密。'
  feedbackType.value = 'success'
}

// ── Step 17: Manual Calculate ──
const ccStack = ref<{ id: number; label: string; cls: string }[]>([])
const ccVars = ref<{ name: string; label: string; cls: string }[]>([])
const ccLog = ref<string[]>([])
const ccDone = ref(false)
const ccResult = ref('')

function ccPop() {
  if (ccDone.value) return
  const item = ccStack.value.pop()!
  const names = ['b', 'op', 'a']
  const name = names[ccVars.value.length]
  ccVars.value.push({ name, label: item.label, cls: item.cls })
  ccLog.value.push(`const ${name} = stack.pop();  // ${name} = '${item.label}'`)

  if (ccVars.value.length === 1) {
    feedback.value = `Pop！「${item.label}」存到變數 ${name}。繼續 Pop 下一個。`
  } else if (ccVars.value.length === 2) {
    feedback.value = `Pop！「${item.label}」存到變數 ${name}。再 Pop 最後一個。`
  } else {
    feedback.value = `三個值都 Pop 出來了！a = 3, op = +, b = 5。按「計算」看看結果。`
    feedbackType.value = 'neutral'
  }
}
function ccCalc() {
  if (ccVars.value.length < 3 || ccDone.value) return
  ccResult.value = '3 + 5 = 8'
  ccStack.value.push({ id: 10, label: '8', cls: 'bg-emerald-500 border-emerald-400' })
  ccLog.value.push(`// a + b → 3 + 5 = 8`)
  ccLog.value.push(`stack.push(8);  // 結果放回 Stack`)
  ccDone.value = true
  feedback.value = '3 + 5 = 8！Pop 出來 → 存進變數 → 拿去計算 → Push 結果回 Stack。這就是計算機背後的完整流程。'
  feedbackType.value = 'success'
}

// ── Homework Demo (引導式) ──
type HwOp = { id: number; label: string; cls: string; type: 'add' | 'subtract'; n: number }
type HwLogEntry = { action: string; before: number; after: number; stack: string }
const hwValue = ref(0)
const hwUndoStack = ref<HwOp[]>([])
const hwLog = ref<HwLogEntry[]>([])
const hwInput = ref('')
const hwNextId = ref(0)

// 引導步驟
const hwGuide = [
  { input: '10', op: '+',    hint: '按 + 把 10 加進去' },
  { input: '5',  op: '+',    hint: '再按 + 加上 5' },
  { input: '3',  op: '-',    hint: '按 − 減掉 3' },
  { input: '',   op: 'undo', hint: '按 Undo 還原上一步' },
  { input: '',   op: 'undo', hint: '再按一次 Undo' },
]
const hwStep = ref(0)
const hwDone = computed(() => hwStep.value >= hwGuide.length)
const hwCurrent = computed(() => hwStep.value < hwGuide.length ? hwGuide[hwStep.value] : null)

function hwAdvance() {
  hwStep.value++
  if (hwStep.value < hwGuide.length) {
    const next = hwGuide[hwStep.value]
    hwInput.value = next.input
    feedback.value = `Step ${hwStep.value + 1}/${hwGuide.length}：${next.hint}`
    feedbackType.value = 'neutral'
  } else {
    hwInput.value = ''
    feedback.value = 'Undo 就是從 undoStack pop 出來，還原上一步。這就是你要實作的計算機！'
    feedbackType.value = 'success'
  }
}

function hwAdd() {
  if (hwCurrent.value && hwCurrent.value.op !== '+') return
  const n = parseInt(hwInput.value)
  if (isNaN(n) || n === 0) return
  const before = hwValue.value
  hwValue.value += n
  hwUndoStack.value.push({ id: hwNextId.value++, label: `add(${n})`, cls: 'bg-emerald-500 border-emerald-400', type: 'add', n })
  hwLog.value.push({ action: `按 +`, before, after: hwValue.value, stack: `push add(${n})` })
  hwAdvance()
}

function hwSubtract() {
  if (hwCurrent.value && hwCurrent.value.op !== '-') return
  const n = parseInt(hwInput.value)
  if (isNaN(n) || n === 0) return
  const before = hwValue.value
  hwValue.value -= n
  hwUndoStack.value.push({ id: hwNextId.value++, label: `subtract(${n})`, cls: 'bg-amber-500 border-amber-400', type: 'subtract', n })
  hwLog.value.push({ action: `按 −`, before, after: hwValue.value, stack: `push subtract(${n})` })
  hwAdvance()
}

function hwUndo() {
  if (hwCurrent.value && hwCurrent.value.op !== 'undo') return
  if (hwUndoStack.value.length === 0) return
  const op = hwUndoStack.value.pop()!
  const before = hwValue.value
  if (op.type === 'add') {
    hwValue.value -= op.n
    hwLog.value.push({ action: '按 Undo', before, after: hwValue.value, stack: `pop ${op.label}，減回 ${op.n}` })
  } else {
    hwValue.value += op.n
    hwLog.value.push({ action: '按 Undo', before, after: hwValue.value, stack: `pop ${op.label}，加回 ${op.n}` })
  }
  hwAdvance()
}

function hwReset() {
  hwValue.value = 0
  hwUndoStack.value = []
  hwLog.value = []
  hwInput.value = hwGuide[0].input
  hwNextId.value = 0
  hwStep.value = 0
  feedback.value = `Step 1/${hwGuide.length}：${hwGuide[0].hint}`
  feedbackType.value = 'neutral'
}

// ── hw-code-calc & hw-code-undo 引導 ──
const hccStep = ref(0)  // 0=初始, 1~4=漸進揭示
const hccTotal = 4
const hcuStep = ref(0)
const hcuTotal = 4

// ── Step 14: JS Array Methods ──
type ArrayOp = { method: string; desc: string; side: 'right' | 'left'; action: 'add' | 'remove'; color: string }
const arrayOps: ArrayOp[] = [
  { method: 'push()', desc: '從右邊加入', side: 'right', action: 'add', color: 'bg-emerald-500' },
  { method: 'pop()', desc: '從右邊移除', side: 'right', action: 'remove', color: 'bg-rose-500' },
  { method: 'unshift()', desc: '從左邊加入', side: 'left', action: 'add', color: 'bg-sky-500' },
  { method: 'shift()', desc: '從左邊移除', side: 'left', action: 'remove', color: 'bg-orange-500' },
]
const arrItems = ref<{ id: number; label: string; color: string }[]>([])
const arrNextId = ref(0)
const arrUsed = ref<Set<string>>(new Set())
const arrAnimating = ref(false)
const arrLastAction = ref('')

async function arrDoOp(op: ArrayOp) {
  if (arrAnimating.value) return
  arrAnimating.value = true
  arrLastAction.value = op.method

  if (op.action === 'add') {
    const id = arrNextId.value++
    const labels = ['🍎', '🍌', '🍇', '🔵', '⭐', '🎵', '💎', '🌸']
    const label = labels[id % labels.length]
    const item = { id, label, color: op.color }
    if (op.side === 'right') {
      arrItems.value.push(item)
      feedback.value = `${op.method} → ${label} 從右邊加入陣列尾端。`
    } else {
      arrItems.value.unshift(item)
      feedback.value = `${op.method} → ${label} 從左邊插入陣列開頭。`
    }
    feedbackType.value = 'neutral'
  } else {
    if (arrItems.value.length === 0) {
      feedback.value = '陣列已經空了，沒東西可以移除。先加入一些元素吧。'
      feedbackType.value = 'error'
      arrAnimating.value = false
      return
    }
    if (op.side === 'right') {
      const removed = arrItems.value.pop()!
      feedback.value = `${op.method} → ${removed.label} 從右邊被移除了。和 Stack 一樣——後進先出 (LIFO)。`
    } else {
      const removed = arrItems.value.shift()!
      feedback.value = `${op.method} → ${removed.label} 從左邊被移除了。先進先出——這就是 Queue（佇列）的概念！`
    }
    feedbackType.value = 'success'
  }

  arrUsed.value.add(op.method)
  await delay(300)
  arrAnimating.value = false

  if (arrUsed.value.size >= 4) {
    feedback.value = '四個方法你都試過了！push/pop 操作右邊（Stack），shift/unshift 操作左邊。當你的介面需要「返回上一步」的功能，就是 push + pop（Stack）；當你需要「排隊處理」，就是 push + shift（Queue）。記住這張圖，以後遇到任何資料操作都能輕鬆選對方法。'
    feedbackType.value = 'success'
  }
}

// ── Step 15: Calculator × Array State ──
const caStack = ref<{ id: number; label: string; cls: string }[]>([])
const caNextId = ref(0)
const caPhase = ref(0) // 0=press 3, 1=press +, 2=press 5, 3=press =, 4=calculating, 5=done
const caLog = ref<string[]>([])
const caDisplay = ref('0')

async function caPress(val: string) {
  if (caPhase.value === 0 && val === '3') {
    caStack.value.push({ id: caNextId.value++, label: '3', cls: 'bg-sky-500 border-sky-400' })
    caLog.value.push(`stack.push('3');   // stack = ['3']`)
    caDisplay.value = '3'
    caPhase.value = 1
    feedback.value = '「3」Push 進 Stack 了！看右邊的陣列，多了一個元素。接下來按「+」。'
    feedbackType.value = 'neutral'
  } else if (caPhase.value === 1 && val === '+') {
    caStack.value.push({ id: caNextId.value++, label: '+', cls: 'bg-amber-500 border-amber-400' })
    caLog.value.push(`stack.push('+');   // stack = ['3', '+']`)
    caDisplay.value = '3 +'
    caPhase.value = 2
    feedback.value = '「+」也 Push 進去了！注意看陣列現在有兩個元素。最後按「5」。'
    feedbackType.value = 'neutral'
  } else if (caPhase.value === 2 && val === '5') {
    caStack.value.push({ id: caNextId.value++, label: '5', cls: 'bg-emerald-500 border-emerald-400' })
    caLog.value.push(`stack.push('5');   // stack = ['3', '+', '5']`)
    caDisplay.value = '3 + 5'
    caPhase.value = 3
    feedback.value = '三個值都在 Stack 裡了！按「=」看看計算機怎麼用 Pop 來計算。'
    feedbackType.value = 'neutral'
  } else if (caPhase.value === 3 && val === '=') {
    caPhase.value = 4
    feedback.value = '看好了——計算機要開始 Pop 來計算...'
    feedbackType.value = 'neutral'
    await caCalculate()
  }
}

async function caCalculate() {
  await delay(800)
  if (stepData.value.view !== 'calc-array') return
  caStack.value.pop()
  caLog.value.push(`stack.pop();       // → '5'  stack = ['3', '+']`)
  feedback.value = 'Pop → 拿出「5」（運算元）'
  await delay(800)
  if (stepData.value.view !== 'calc-array') return
  caStack.value.pop()
  caLog.value.push(`stack.pop();       // → '+'  stack = ['3']`)
  feedback.value = 'Pop → 拿出「+」（運算子）'
  await delay(800)
  if (stepData.value.view !== 'calc-array') return
  caStack.value.pop()
  caLog.value.push(`stack.pop();       // → '3'  stack = []`)
  feedback.value = 'Pop → 拿出「3」（運算元）'
  await delay(800)
  if (stepData.value.view !== 'calc-array') return
  caStack.value.push({ id: caNextId.value++, label: '8', cls: 'bg-emerald-500 border-emerald-400' })
  caLog.value.push(`// 計算：3 + 5 = 8`)
  caLog.value.push(`stack.push(8);     // stack = [8] ← 結果`)
  caDisplay.value = '8'
  caPhase.value = 5
  feedback.value = '3 + 5 = 8！結果 Push 回 Stack。這就是計算機的秘密——每個按鍵都是 push，按等號時 pop 出來計算，再把結果 push 回去。你剛才在第十二關做的，背後就是這個流程。'
  feedbackType.value = 'success'
}

// ── canGoNext ──
const canGoNext = computed(() => {
  switch (stepData.value.view) {
    case 'welcome':   return true
    case 'physics':   return physicsCleared.value
    case 'push':      return pushCount.value >= 3 && pushAnswer.value === 'top'
    case 'pop':          return popAnswer.value === 'lifo'
    case 'lifo-replay':  return replayPhase.value >= 4
    case 'lifo-life':    return lifeAnswer.value === 'queue'
    case 'lifo-quiz':    return quizPhase.value >= 3
    case 'browser':   return browserAnswer.value === 'pop'
    case 'code':      return codeAnswer.value === 'grape' && codePopped.value
    case 'figma':     return figmaUndoCount.value >= 2
    case 'callstack': return csPhase.value >= 6
    case 'parser':     return parserFinished.value
    case 'calculator': return calcPhase.value >= 5
    case 'js-array':   return arrUsed.value.size >= 4
    case 'calc-array': return caPhase.value >= 5
    case 'calc-undo':  return cuPhase.value >= 4
    case 'pop-return': return prDone.value
    case 'calc-compute': return ccDone.value
    case 'practice':  return practiceComplete.value
    case 'hw-intro':  return true
    case 'homework-demo':  return hwDone.value
    case 'homework-files': return true
    case 'hw-code-overview': return true
    case 'hw-code-calc': return hccStep.value >= hccTotal
    case 'hw-code-undo': return hcuStep.value >= hcuTotal
    case 'summary-insight': return true
    case 'summary-review':  return true
    case 'summary-end':     return true
    default: return true
  }
})
const nextStepHint = computed(() => {
  if (canGoNext.value) return ''
  switch (stepData.value.view) {
    case 'welcome':   return ''
    case 'physics':   return '試著點擊盤子'
    case 'push':      return pushCount.value < 3 ? '繼續放入盤子' : '回答問題'
    case 'pop':          return !popDone.value ? '按「拿出盤子」' : '回答問題'
    case 'lifo-replay':  return replayPhase.value === 0 ? '按下「播放動畫」' : '等待動畫完成'
    case 'lifo-life':    return lifeSeenCount.value < 3 ? '看完所有例子' : '回答問題'
    case 'lifo-quiz':    return quizPhase.value === 0 ? '等待動畫' : '點擊正確的元素'
    case 'browser':   return browsePhase.value < 2 ? '造訪網站' : '回答問題'
    case 'code':      return jsPushCount.value < 3 ? '繼續 Push' : codeAnswer.value !== 'grape' ? '回答問題' : '執行 pop()'
    case 'figma':     return figmaPhase.value < 3 ? '完成設計操作' : figmaAnswer.value !== 'move' ? '回答問題' : '按「復原」'
    case 'callstack': return '繼續執行'
    case 'parser':     return '讀取下一個字元'
    case 'calculator': return calcPhase.value < 4 ? '按下按鍵' : '回答問題'
    case 'js-array':   return '試試每個按鈕'
    case 'calc-array': return caPhase.value < 3 ? '按下按鍵' : caPhase.value === 3 ? '按 =' : '等待計算完成'
    case 'calc-undo':  return cuPhase.value <= 2 ? '按下按鍵' : '按 Undo'
    case 'pop-return': return '按「Pop」'
    case 'calc-compute': return ccVars.value.length < 3 ? '按「Pop」' : '按「計算」'
    case 'practice':  return '完成 7 關實戰練習'
    case 'hw-code-calc': return '看完所有提示'
    case 'hw-code-undo': return '看完所有提示'
    default: return ''
  }
})

// ── Feedback helpers ──
const feedbackClass = computed(() => {
  switch (feedbackType.value) {
    case 'success':  return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
    case 'error':    return 'bg-red-500/20 border-red-500/30 text-red-300'
    case 'question': return 'bg-amber-500/20 border-amber-500/30 text-amber-300'
    default:         return 'bg-slate-700/50 border-slate-600/30 text-slate-300'
  }
})
const feedbackIcon = computed(() => {
  switch (feedbackType.value) {
    case 'success': return '✅'; case 'error': return '💡'; case 'question': return '🤔'; default: return '💬'
  }
})

// ── Init & Watch ──
onMounted(() => { initStep() })
watch(currentStep, () => { initStep() })

function initStep() {
  animState.value = 0
  feedback.value = ''
  feedbackType.value = 'neutral'
  const v = STEPS[currentStep.value]?.view

  if (v === 'welcome') { setTimeout(() => { animState.value = 1 }, 300) }
  if (v === 'physics') {
    plates.value = [{ id: 'A', name: 'A', isNew: false }, { id: 'B', name: 'B', isNew: false }, { id: 'C', name: 'C', isNew: false }]
    physicsCleared.value = false
    feedback.value = '我們來試試看——這裡有三個疊好的盤子。你覺得，哪一個可以被拿走？點點看。'
  }
  if (v === 'push') {
    plates.value = [{ id: 'A', name: 'A', isNew: false }, { id: 'B', name: 'B', isNew: false }, { id: 'C', name: 'C', isNew: false }]
    pushCount.value = 0; pushAnswer.value = ''
    feedback.value = '接下來，我們往上疊盤子。按下「放入盤子 (Push)」，觀察新盤子會出現在哪裡。'
  }
  if (v === 'pop') {
    plates.value = [
      { id: 'A', name: 'A', isNew: false }, { id: 'B', name: 'B', isNew: false }, { id: 'C', name: 'C', isNew: false },
      { id: 'D', name: 'D', isNew: true }, { id: 'E', name: 'E', isNew: true }, { id: 'F', name: 'F', isNew: true },
    ]
    popDone.value = false; popAnswer.value = ''
    feedback.value = '現在有 6 個盤子。按「拿出盤子 (Pop)」，看看誰會先被拿走。'
  }
  if (v === 'lifo-replay') {
    replayPhase.value = 0; replayStack.value = []; replayPopped.value = []
    feedback.value = '你剛才發現了 LIFO 的規則。現在讓我用動畫把這個過程慢慢播給你看，你會看得更清楚。'
  }
  if (v === 'lifo-life') {
    lifeCurrentIdx.value = 0; lifeAnimPhase.value = 0; lifeSeenCount.value = 0; lifeAnswer.value = ''
    feedback.value = 'LIFO 不只存在於程式裡，你的日常生活到處都有。我們來看三個例子。按下「開始」看第一個。'
  }
  if (v === 'lifo-quiz') {
    quizPhase.value = 0; quizStack.value = []; quizPoppedByUser.value = []; quizMistakes.value = 0
    feedback.value = '最後一個小挑戰！我要測試你是不是真的懂 LIFO。準備好了嗎？'
    setTimeout(() => startQuiz(), 500)
  }
  if (v === 'browser') {
    browseHistory.value = [{ name: 'Google', url: 'google.com', color: 'bg-blue-500', bg: 'from-blue-500/20 to-blue-600/10' }]
    browsePhase.value = 0; browserAnswer.value = ''
    feedback.value = '你有沒有想過，瀏覽器的「上一頁」背後是怎麼運作的？我們來模擬看看。先點「去 YouTube」。'
  }
  if (v === 'code') {
    jsStack.value = []; codeLog.value = ['const stack = [];']; jsPushCount.value = 0; codeAnswer.value = ''; codePopped.value = false
    feedback.value = '別擔心，程式碼其實比你想的簡單。按下 push 按鈕，我們把水果一個一個放進陣列。'
  }
  if (v === 'figma') {
    figmaPhase.value = 0; figmaHistory.value = []; figmaAnswer.value = ''; figmaUndoCount.value = 0
    figmaBoxVisible.value = false; figmaBoxColor.value = '#94a3b8'; figmaBoxX.value = 80
    feedback.value = '你用過設計工具嗎？每次按 Ctrl+Z 復原，背後都藏著 Stack。我們來模擬看看。'
  }
  if (v === 'callstack') {
    csPhase.value = 0; csFrames.value = []; csAnswer.value = ''; csHighlight.value = -1
    feedback.value = '這是 JavaScript 引擎的核心——Call Stack。每次呼叫函式，引擎就會把它 Push 上去。我們來逐步看。'
  }
  if (v === 'parser') {
    parserCursor.value = 0; parserStack.value = []; parserFinished.value = false
    parserMsg.value = '按「讀取下一個字元」開始'; parserMatched.value = []
    feedback.value = '你有沒有想過，IDE 是怎麼知道你的括號少寫了？答案就是 Stack。我們來模擬一個簡單的語法檢查器。'
  }
  if (v === 'calculator') {
    calcInput.value = []; calcPhase.value = 0; calcAnswer.value = ''
    feedback.value = '我們來玩一個小計算機。別擔心，不是要考你數學。按下按鍵，看看 Stack 怎麼記住你的每一步操作。'
  }
  if (v === 'js-array') {
    arrItems.value = [
      { id: 0, label: '🍎', color: 'bg-emerald-500' },
      { id: 1, label: '🍌', color: 'bg-emerald-500' },
      { id: 2, label: '🍇', color: 'bg-emerald-500' },
    ]
    arrNextId.value = 3; arrUsed.value = new Set(); arrAnimating.value = false; arrLastAction.value = ''
    feedback.value = '最後來看看 JavaScript 陣列的四個方法。陣列裡已經有三個水果，試試每個按鈕，看看它們從哪邊進出。'
  }
  if (v === 'calc-array') {
    caStack.value = []; caNextId.value = 0; caPhase.value = 0
    caLog.value = ['const stack = [];']; caDisplay.value = '0'
    feedback.value = '你已經用過計算機了。這次讓我們打開「引擎蓋」，看看每按一個鍵，Stack（陣列）裡面到底發生了什麼變化。按「3」開始。'
  }
  if (v === 'calc-undo') {
    cuStack.value = []; cuPhase.value = 0
    cuLog.value = ['const stack = [];']
    feedback.value = '如果按錯了怎麼辦？我們來模擬一個「手滑」的情況。按「3」開始。'
  }
  if (v === 'pop-return') {
    prStack.value = [
      { id: 0, label: 'A', cls: 'bg-sky-500 border-sky-400' },
      { id: 1, label: 'B', cls: 'bg-amber-500 border-amber-400' },
      { id: 2, label: 'C', cls: 'bg-emerald-500 border-emerald-400' },
    ]
    prVar.value = ''; prDone.value = false
    feedback.value = '上一關你發現 Undo = Pop。但你有沒有注意到，pop() 不只是「拿掉」——它會把拿出來的值「交給你」。按下「Pop」，看看發生什麼事。'
  }
  if (v === 'calc-compute') {
    ccStack.value = [
      { id: 0, label: '3', cls: 'bg-sky-500 border-sky-400' },
      { id: 1, label: '+', cls: 'bg-amber-500 border-amber-400' },
      { id: 2, label: '5', cls: 'bg-emerald-500 border-emerald-400' },
    ]
    ccVars.value = []; ccLog.value = ['// stack = ["3", "+", "5"]']
    ccDone.value = false; ccResult.value = ''
    feedback.value = '知道 pop() 會回傳值之後，我們來手動算一次 3 + 5。Pop 三次，把值存到變數裡，再拿去計算。按「Pop」開始。'
  }
  if (v === 'hw-intro') {
    feedback.value = ''
  }
  if (v === 'homework-demo') {
    hwValue.value = 0; hwUndoStack.value = []
    hwStep.value = 0; hwNextId.value = 0
    hwLog.value = []; hwInput.value = hwGuide[0].input
    feedback.value = `Step 1/${hwGuide.length}：${hwGuide[0].hint}`
  }
  if (v === 'homework-files') {
    feedback.value = '打開作業資料夾，先了解檔案結構，再用終端機安裝和跑測試。'
  }
  if (v === 'hw-code-overview') {
    feedback.value = '這是你要寫的檔案全貌。先看懂每個部分的用途，再開始動手寫。'
  }
  if (v === 'hw-code-calc') {
    hccStep.value = 0
    feedback.value = '跟著提示，一步步寫出 add 和 subtract。按「下一步提示」看答案。'
  }
  if (v === 'hw-code-undo') {
    hcuStep.value = 0
    feedback.value = '最後一個方法！跟著提示寫出 undo。'
  }
  if (v === 'summary-insight' || v === 'summary-review' || v === 'summary-end') { feedback.value = '' }
}

function nextStep() { if (currentStep.value < STEPS.length - 1) currentStep.value++ }
function prevStep() { if (currentStep.value > 0) currentStep.value-- }
function gotoStep(step: number) { if (step >= 0 && step < STEPS.length) currentStep.value = step }
</script>

<template>
  <!-- Practice step: StackPracticeSlide 接管全畫面 -->
  <div v-if="stepData.view === 'practice'" class="relative h-full">
    <StackPracticeSlide @complete="handlePracticeComplete" />
    <button
      class="absolute left-4 top-4 z-50 flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-800/90 px-3 py-1.5 text-xs font-bold text-slate-300 backdrop-blur transition-all hover:border-amber-400 hover:text-amber-300"
      @click="prevStep"
    >
      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      返回教學
    </button>
  </div>

  <!-- 其他步驟：正常使用 InteractiveSlideTemplate -->
  <InteractiveSlideTemplate
    v-else
    title="Stack 堆疊探索"
    subtitle="引導式互動教學"
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
    <!-- ===== Shared Feedback Bar ===== -->
    <div v-if="feedback" class="mx-auto max-w-3xl px-4 pt-4">
      <div class="rounded-xl border px-4 py-3 text-sm md:text-base" :class="feedbackClass">
        <span class="mr-2">{{ feedbackIcon }}</span>{{ feedback }}
      </div>
    </div>

    <!-- ===== Question Buttons ===== -->
    <div class="mx-auto max-w-3xl px-4 pt-2">
      <div v-if="stepData.view === 'push' && pushCount >= 3 && pushAnswer !== 'top'" class="flex justify-center gap-3">
        <button @click="answerPush('top')" class="q-btn">A. 在最上面 (Top)</button>
        <button @click="answerPush('bottom')" class="q-btn">B. 在最下面 (Bottom)</button>
      </div>
      <div v-if="stepData.view === 'pop' && popDone && popAnswer !== 'lifo'" class="flex justify-center gap-3">
        <button @click="answerPop('fifo')" class="q-btn">A. 先放的先拿出來</button>
        <button @click="answerPop('lifo')" class="q-btn">B. 最後放的先拿出來</button>
      </div>
      <div v-if="stepData.view === 'lifo-life' && lifeSeenCount >= 3 && lifeAnswer !== 'queue'" class="flex flex-col items-center gap-2">
        <p class="text-sm text-slate-400">以下哪個情境「不是」LIFO？</p>
        <div class="flex justify-center gap-3">
          <button @click="answerLife('elevator')" class="q-btn">A. 電梯</button>
          <button @click="answerLife('queue')" class="q-btn">B. 排隊買飲料</button>
          <button @click="answerLife('pringles')" class="q-btn">C. 品客洋芋片</button>
        </div>
      </div>
      <div v-if="stepData.view === 'browser' && browsePhase >= 2 && browserAnswer !== 'pop'" class="flex justify-center gap-3">
        <button @click="answerBrowser('keep')" class="q-btn">A. 保留它，往下移</button>
        <button @click="answerBrowser('pop')" class="q-btn">B. 丟掉它 (Pop)</button>
      </div>
      <div v-if="stepData.view === 'code' && jsPushCount >= 3 && codeAnswer !== 'grape'" class="flex justify-center gap-3">
        <button @click="answerCode('apple')" class="q-btn">A. 蘋果 🍎</button>
        <button @click="answerCode('grape')" class="q-btn">B. 葡萄 🍇</button>
      </div>
      <div v-if="stepData.view === 'figma' && figmaPhase === 3 && figmaAnswer !== 'move'" class="flex justify-center gap-3">
        <button @click="answerFigma('color')" class="q-btn">A. 顏色會變回灰色</button>
        <button @click="answerFigma('move')" class="q-btn">B. 位置會回到左邊</button>
      </div>
      <div v-if="stepData.view === 'callstack' && csPhase === 3 && csAnswer !== 'add'" class="flex justify-center gap-3">
        <button @click="answerCs('add')" class="q-btn">A. add() 在最上面</button>
        <button @click="answerCs('main')" class="q-btn">B. main() 在最上面</button>
      </div>
      <div v-if="stepData.view === 'calculator' && calcPhase === 4 && calcAnswer !== 'pop'" class="flex justify-center gap-3">
        <button @click="answerCalc('pop')" class="q-btn">A. Pop 最後的輸入</button>
        <button @click="answerCalc('clear')" class="q-btn">B. 全部清除 (Clear)</button>
      </div>
    </div>

    <!-- ===== Step 0: Welcome (海姐) ===== -->
    <div v-if="stepData.view === 'welcome'" class="slide-page flex flex-col items-center justify-center">
      <div class="wm">STACK</div>
      <!-- 海姐 Speech -->
      <div class="mb-8 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        <div class="flex shrink-0 flex-col items-center">
          <img src="/images/coach/normal.png" alt="海姐" class="h-28 w-28 rounded-full border-2 border-amber-400 object-cover shadow-xl shadow-amber-500/25 md:h-32 md:w-32" style="object-position: 50% 5%;" />
          <p class="mt-2 text-sm font-bold text-amber-300">海克絲</p>
        </div>
        <div class="max-w-lg rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4 md:px-6 md:py-5">
          <p class="mb-3 text-base text-white md:text-lg">嗨，我叫<strong class="text-amber-300">海克絲</strong>，可以叫我<strong class="text-amber-300">海姐</strong> 👋</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">你有沒有想過，瀏覽器的「上一頁」是怎麼運作的？按 Ctrl+Z 為什麼能復原？</p>
          <p class="mb-2 text-sm leading-relaxed text-slate-300 md:text-base">答案藏在一個很簡單的概念裡——<strong class="text-white">Stack（堆疊）</strong>。</p>
          <p class="mb-3 text-sm leading-relaxed text-slate-300 md:text-base">就像餐廳裡疊很高的盤子 🥞，我們一步一步來探索它的規則。</p>
          <p class="text-xs text-slate-500 italic">「別急，我們試試看就知道了。」—— 海姐</p>
        </div>
      </div>
      <button @click="nextStep()" class="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-amber-500/25 transition-all hover:shadow-amber-500/40 animate-bounce">
        開始探索 →
      </button>
    </div>

    <!-- ===== Step 1: Physics ===== -->
    <div v-else-if="stepData.view === 'physics'" class="slide-page">
      <div class="wm">STACK</div>
      <div class="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center md:gap-16">
        <div class="text-center md:w-1/3 md:text-left">
          <h2 class="mb-2 text-xl font-bold text-white">⚠️ 第一關：物理限制</h2>
          <p class="text-slate-300">這裡有三個疊好的盤子。</p>
          <p class="text-slate-300">點擊任何一個，試試看能不能拿走它。</p>
        </div>
        <div class="flex flex-col items-center">
          <div class="plate-box">
            <TransitionGroup name="plate">
              <div v-for="(plate, i) in plates" :key="plate.id"
                   @click="handlePlateClick(i)"
                   class="plate-item transition-all"
                   :class="physicsCleared
                     ? 'border-slate-500 bg-slate-700 text-slate-300'
                     : i === plates.length - 1
                       ? 'cursor-pointer border-amber-400 bg-amber-500/20 text-amber-300 hover:scale-105 hover:border-amber-300 active:scale-95'
                       : 'cursor-pointer border-slate-500 bg-slate-700 text-slate-300 hover:scale-105 active:scale-95'">
                盤子 {{ plate.name }}
                <span v-if="!physicsCleared && i === plates.length - 1" class="ml-2 text-xs text-amber-400">(Top)</span>
              </div>
            </TransitionGroup>
            <div v-if="!plates.length" class="py-8 text-center text-slate-500">空 (Empty)</div>
          </div>
          <p v-if="!physicsCleared" class="mt-3 text-sm text-amber-400 animate-pulse">👆 點擊盤子試試看</p>
        </div>
      </div>
    </div>

    <!-- ===== Step 2: Push ===== -->
    <div v-else-if="stepData.view === 'push'" class="slide-page">
      <div class="wm">STACK</div>
      <div class="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center md:gap-16">
        <div class="flex flex-col items-center gap-4 md:w-1/3">
          <h2 class="text-xl font-bold text-white">⬇️ 第二關：Push (放入)</h2>
          <button v-if="pushCount < 3" @click="handlePush"
                  class="btn-action animate-bounce">
            放入盤子 (Push) {{ pushCount }}/3
          </button>
        </div>
        <div class="plate-box">
          <TransitionGroup name="plate">
            <div v-for="(plate, i) in plates" :key="plate.id"
                 class="plate-item"
                 :class="plate.isNew ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-slate-500 bg-slate-700 text-slate-300'">
              盤子 {{ plate.name }}
              <span v-if="i === plates.length - 1" class="ml-2 text-xs text-amber-400">(Top)</span>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>

    <!-- ===== Step 3: Pop ===== -->
    <div v-else-if="stepData.view === 'pop'" class="slide-page">
      <div class="wm">STACK</div>
      <div class="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center md:gap-16">
        <div class="flex flex-col items-center gap-4 md:w-1/3">
          <h2 class="text-xl font-bold text-white">⬆️ 第三關：Pop (取出)</h2>
          <button v-if="!popDone" @click="handlePop" class="btn-action animate-bounce">
            拿出盤子 (Pop)
          </button>
        </div>
        <div class="plate-box">
          <TransitionGroup name="plate">
            <div v-for="(plate, i) in plates" :key="plate.id"
                 class="plate-item"
                 :class="plate.isNew ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-slate-500 bg-slate-700 text-slate-300'">
              盤子 {{ plate.name }}
              <span v-if="i === plates.length - 1" class="ml-2 text-xs text-amber-400">(Top)</span>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>

    <!-- ===== Step 4: LIFO Replay ===== -->
    <div v-else-if="stepData.view === 'lifo-replay'" class="slide-page">
      <div class="wm">LIFO</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">🔄 第四關：LIFO 動畫重播</h2>

        <div class="flex flex-col items-center gap-8 md:flex-row md:items-end md:gap-16">
          <!-- Push 順序 -->
          <div class="flex flex-col items-center gap-2">
            <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Push 順序</p>
            <div class="flex gap-2">
              <div v-for="(item, i) in replayItems" :key="'in-' + i"
                   class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white transition-all duration-500"
                   :class="[item.color, i < replayStack.length + replayPopped.length ? 'opacity-30 scale-90' : 'opacity-100']">
                {{ item.label }}
              </div>
            </div>
            <p class="text-xs text-slate-400">1 → 2 → 3 → 4</p>
          </div>

          <!-- Stack -->
          <div class="flex flex-col items-center">
            <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Stack</p>
            <div class="plate-box" style="width: 140px; min-height: 200px;">
              <TransitionGroup name="replay-stack">
                <div v-for="(item, i) in replayStack" :key="'rs-' + item.label"
                     class="flex h-12 items-center justify-center rounded-lg text-lg font-bold text-white transition-all"
                     :class="[item.color, i === replayStack.length - 1 ? 'ring-2 ring-amber-400 scale-105' : '']">
                  {{ item.label }}
                  <span v-if="i === replayStack.length - 1" class="ml-2 text-xs text-amber-400">(Top)</span>
                </div>
              </TransitionGroup>
              <div v-if="!replayStack.length && replayPhase >= 3" class="py-8 text-center text-slate-500">空！</div>
            </div>
          </div>

          <!-- Pop 順序 -->
          <div class="flex flex-col items-center gap-2">
            <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Pop 順序</p>
            <div class="flex gap-2">
              <TransitionGroup name="pop-out">
                <div v-for="item in replayPopped" :key="'out-' + item.label"
                     class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                     :class="item.color">
                  {{ item.label }}
                </div>
              </TransitionGroup>
            </div>
            <p v-if="replayPopped.length" class="text-xs text-amber-300">4 → 3 → 2 → 1 (反過來！)</p>
          </div>
        </div>

        <!-- 播放按鈕 -->
        <button v-if="replayPhase === 0" @click="startReplay" class="btn-action animate-bounce">
          ▶ 播放動畫
        </button>

        <!-- 結論 -->
        <div v-if="replayPhase >= 4" class="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-center">
          <p class="text-lg font-bold text-amber-300">Push: 1 → 2 → 3 → 4</p>
          <p class="mt-1 text-lg font-bold text-emerald-300">Pop: 4 → 3 → 2 → 1</p>
          <p class="mt-2 text-sm text-slate-400">Last In, First Out = 後進先出</p>
        </div>
      </div>
    </div>

    <!-- ===== Step 5: LIFO in Life ===== -->
    <div v-else-if="stepData.view === 'lifo-life'" class="slide-page">
      <div class="wm">LIFE</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">🌍 第五關：生活中的 LIFO</h2>

        <!-- 例子選擇 -->
        <div class="flex gap-3">
          <button v-for="(ex, i) in lifeExamples" :key="ex.id"
                  @click="lifeCurrentIdx = i; lifeStartExample()"
                  class="flex h-12 w-12 items-center justify-center rounded-full border-2 text-xl transition-all"
                  :class="i === lifeCurrentIdx
                    ? 'border-amber-400 bg-amber-500/20 scale-110'
                    : i < lifeSeenCount
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-slate-600 bg-slate-800'">
            {{ ex.emoji }}
          </button>
        </div>

        <!-- 動畫卡片 -->
        <div class="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/80 p-6">
          <p class="mb-4 text-center text-lg font-bold text-white">
            {{ lifeExamples[lifeCurrentIdx].emoji }} {{ lifeExamples[lifeCurrentIdx].title }}
          </p>
          <!-- Stack 視覺化 -->
          <div class="mx-auto w-48 rounded-b-xl border-x-4 border-b-4 border-slate-600 bg-slate-900/50 p-2"
               style="min-height: 140px; display: flex; flex-direction: column-reverse; gap: 4px;">
            <TransitionGroup name="life-stack">
              <div v-for="(item, i) in lifeVisibleStack" :key="item"
                   class="flex h-10 items-center justify-center rounded-lg border-2 text-sm font-bold transition-all"
                   :class="i === lifeVisibleStack.length - 1
                     ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                     : 'border-slate-500 bg-slate-700 text-slate-300'">
                {{ item }}
              </div>
            </TransitionGroup>
          </div>
          <!-- Pop 出來的元素 -->
          <div v-if="lifePoppedItem" class="mt-3 flex justify-center">
            <div class="life-pop-float rounded-lg border-2 border-emerald-400 bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300">
              {{ lifePoppedItem }} <span class="ml-1 text-xs">← 先出來！</span>
            </div>
          </div>
          <!-- 說明 -->
          <div v-if="lifeAnimPhase >= 3" class="mt-3 text-center text-sm text-slate-400">
            {{ lifeExamples[lifeCurrentIdx].lifoExplain }}
          </div>
        </div>

        <!-- 按鈕 -->
        <div class="flex gap-3">
          <button v-if="lifeAnimPhase === 0 && lifeSeenCount === 0"
                  @click="lifeStartExample" class="btn-action animate-bounce">
            ▶ 開始
          </button>
          <button v-if="lifeAnimPhase >= 3 && lifeCurrentIdx < lifeExamples.length - 1"
                  @click="lifeNextExample" class="btn-action animate-pulse">
            下一個例子 →
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Step 6: LIFO Quiz ===== -->
    <div v-else-if="stepData.view === 'lifo-quiz'" class="slide-page">
      <div class="wm">QUIZ</div>
      <div class="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center md:gap-16">
        <!-- Stack -->
        <div class="flex flex-col items-center">
          <h2 class="mb-4 text-xl font-bold text-white">🎯 第六關：LIFO 挑戰</h2>
          <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Stack</p>
          <div class="plate-box" style="width: 160px; min-height: 220px;">
            <TransitionGroup name="quiz-stack">
              <div v-for="(item, i) in quizStack" :key="'qs-' + item"
                   class="flex h-12 items-center justify-center rounded-lg border-2 text-lg font-bold transition-all"
                   :class="[
                     quizPhase >= 1 && i === quizStack.length - 1
                       ? 'cursor-pointer border-amber-400 bg-amber-500/20 text-amber-300 hover:scale-105 hover:border-amber-300 active:scale-95'
                       : quizPhase >= 1
                         ? 'cursor-pointer border-slate-500 bg-slate-700 text-slate-300 hover:scale-105 active:scale-95'
                         : 'border-blue-500 bg-blue-500/20 text-blue-300'
                   ]"
                   @click="quizUserPop(item)">
                {{ item }}
                <span v-if="i === quizStack.length - 1" class="ml-2 text-xs text-amber-400">(Top)</span>
              </div>
            </TransitionGroup>
            <div v-if="!quizStack.length && quizPhase >= 3" class="py-8 text-center font-bold text-emerald-400">
              ✅ 全部清空！
            </div>
          </div>
        </div>

        <!-- Pop 結果 -->
        <div class="flex flex-col items-center gap-4">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-500">你的 Pop 順序</p>
          <div class="flex gap-3">
            <TransitionGroup name="quiz-result">
              <div v-for="(item, i) in quizPoppedByUser" :key="'qr-' + item"
                   class="relative flex h-14 w-14 items-center justify-center rounded-xl border-2 border-emerald-500 bg-emerald-500/20 text-lg font-bold text-emerald-300 shadow-lg shadow-emerald-500/20">
                {{ item }}
                <span class="absolute -bottom-5 text-xs text-slate-500">#{{ i + 1 }}</span>
              </div>
            </TransitionGroup>
            <div v-for="i in (quizPushSequence.length - quizPoppedByUser.length)" :key="'empty-' + i"
                 class="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-dashed border-slate-600 text-slate-600">
              ?
            </div>
          </div>
          <!-- 錯誤計數 -->
          <div v-if="quizMistakes > 0" class="rounded-lg bg-red-500/10 px-3 py-1 text-sm text-red-400">
            錯誤次數：{{ quizMistakes }}
          </div>
          <!-- 完成慶祝 -->
          <div v-if="quizPhase >= 3" class="quiz-celebrate mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-8 py-4 text-center">
            <p class="text-2xl">🎉</p>
            <p class="mt-1 text-lg font-bold text-emerald-300">
              {{ quizMistakes === 0 ? '完美通關！' : '挑戰完成！' }}
            </p>
            <p class="mt-1 text-sm text-slate-400">
              Push: A → B → C → D<br>
              Pop: D → C → B → A
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 7: Browser ===== -->
    <div v-else-if="stepData.view === 'browser'" class="slide-page">
      <div class="wm">WEB</div>
      <div class="flex flex-col gap-6 md:flex-row md:justify-center md:gap-8">
        <div class="md:w-1/3">
          <h2 class="mb-3 text-xl font-bold text-white">🌐 第七關：瀏覽器</h2>
          <div class="mb-4 flex flex-col gap-2">
            <button v-if="browsePhase === 0"
                    @click="visitPage({ name: 'YouTube', url: 'youtube.com', color: 'bg-red-500', bg: 'from-red-500/20 to-red-600/10' })"
                    class="btn-action ring-2 ring-red-400 animate-pulse">🔴 去 YouTube</button>
            <button v-if="browsePhase === 1"
                    @click="visitPage({ name: 'Instagram', url: 'instagram.com', color: 'bg-pink-500', bg: 'from-pink-500/20 to-pink-600/10' })"
                    class="btn-action ring-2 ring-pink-400 animate-pulse">📷 去 Instagram</button>
          </div>
          <div class="stack-box">
            <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">History Stack</p>
            <div class="flex min-h-[80px] flex-col-reverse gap-1">
              <div v-for="(page, i) in browseHistory" :key="page.name"
                   class="rounded-lg px-3 py-2 text-sm font-bold text-white transition-all"
                   :class="[page.color, i === browseHistory.length - 1 ? 'scale-105 shadow-md ring-2 ring-white/30' : 'opacity-60']">
                {{ page.name }}
                <span v-if="i === browseHistory.length - 1" class="ml-1 text-xs opacity-70">(Top)</span>
              </div>
            </div>
          </div>
        </div>
        <div class="md:w-2/3">
          <div class="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
            <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-900 px-3 py-2">
              <span class="h-3 w-3 rounded-full bg-red-500"></span>
              <span class="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span class="h-3 w-3 rounded-full bg-green-500"></span>
              <div class="ml-2 flex-1 rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-400">
                https://www.{{ browseHistory[browseHistory.length - 1]?.url }}
              </div>
            </div>
            <div class="flex min-h-[200px] items-center justify-center bg-gradient-to-br p-8"
                 :class="browseHistory[browseHistory.length - 1]?.bg || 'from-slate-500/20 to-slate-600/10'">
              <div class="text-center">
                <p class="text-4xl font-black text-white/80">{{ browseHistory[browseHistory.length - 1]?.name }}</p>
                <p class="mt-2 text-sm text-white/40">模擬頁面</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 5: Code ===== -->
    <div v-else-if="stepData.view === 'code'" class="slide-page">
      <div class="wm">CODE</div>
      <div class="flex flex-col gap-6 md:flex-row md:justify-center md:gap-8">
        <div class="md:w-1/3">
          <h2 class="mb-3 text-xl font-bold text-white">💻 第八關：JS 語法</h2>
          <div class="stack-box">
            <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Stack (陣列)</p>
            <div class="flex min-h-[100px] flex-col-reverse gap-1">
              <div v-for="(item, i) in jsStack" :key="i"
                   class="rounded-lg border border-emerald-500 bg-emerald-500/20 px-3 py-2 text-center text-lg"
                   :class="i === jsStack.length - 1 ? 'ring-2 ring-amber-400' : ''">
                {{ item }}
                <span v-if="i === jsStack.length - 1" class="ml-1 text-xs text-amber-400">(Top)</span>
              </div>
            </div>
            <div v-if="!jsStack.length" class="py-6 text-center text-slate-500">空 (Empty)</div>
          </div>
        </div>
        <div class="md:w-2/3">
          <div class="overflow-hidden rounded-xl border border-slate-700">
            <div class="flex items-center gap-2 bg-slate-900 px-3 py-2">
              <span class="h-3 w-3 rounded-full bg-red-500"></span>
              <span class="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span class="h-3 w-3 rounded-full bg-green-500"></span>
              <span class="ml-2 text-xs text-slate-500">code-editor.js</span>
            </div>
            <div class="bg-slate-950 p-4 font-mono text-sm leading-relaxed">
              <div v-for="(line, i) in codeLog" :key="i" class="text-slate-300">
                <span class="mr-3 inline-block w-4 text-right text-slate-600">{{ i + 1 }}</span>{{ line }}
              </div>
              <div class="text-slate-600">
                <span class="mr-3 inline-block w-4 text-right">{{ codeLog.length + 1 }}</span><span class="animate-pulse text-slate-400">▎</span>
              </div>
            </div>
            <div class="flex gap-2 border-t border-slate-700 bg-slate-900 px-3 py-2">
              <button v-if="jsPushCount < 3" @click="handleJsPush"
                      class="btn-sm animate-bounce">
                stack.push("{{ jsFruits[jsPushCount]?.emoji }}")
              </button>
              <button v-if="codeAnswer === 'grape' && !codePopped" @click="handleJsPop"
                      class="btn-sm bg-slate-600 hover:bg-slate-500 animate-pulse">
                stack.pop()
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 6: Figma ===== -->
    <div v-else-if="stepData.view === 'figma'" class="slide-page">
      <div class="wm">DESIGN</div>
      <div class="flex flex-col gap-6 md:flex-row md:justify-center md:gap-8">
        <div class="md:w-1/3">
          <h2 class="mb-3 text-xl font-bold text-white">🖱️ 第九關：設計時光機</h2>
          <div class="stack-box">
            <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">History Stack</p>
            <div class="flex min-h-[80px] flex-col-reverse gap-1">
              <div v-for="(item, i) in figmaHistory" :key="item.action"
                   class="rounded-lg border px-3 py-2 text-sm transition-all"
                   :class="i === figmaHistory.length - 1
                     ? 'border-amber-500 bg-amber-500/20 text-amber-300 border-l-4'
                     : 'border-slate-600 bg-slate-700 text-slate-300'">
                {{ item.icon }} {{ item.action }}
                <span v-if="i === figmaHistory.length - 1" class="ml-1 text-xs text-amber-400">(Top)</span>
              </div>
            </div>
            <div v-if="!figmaHistory.length" class="py-4 text-center text-slate-500">空</div>
          </div>
        </div>
        <div class="md:w-2/3">
          <div class="overflow-hidden rounded-xl border border-slate-700">
            <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-3 py-2">
              <span class="text-xs text-slate-400">Figma 模擬畫布</span>
              <div class="flex-1"></div>
              <button v-if="figmaPhase < 3" @click="handleFigmaAction"
                      class="btn-sm ring-2 ring-amber-400 animate-pulse">
                {{ figmaPhase === 0 ? '⬜ 畫出方塊' : figmaPhase === 1 ? '🟥 填充紅色' : '➡️ 向右移動' }}
              </button>
              <button v-if="figmaAnswer === 'move' && figmaHistory.length > 0"
                      @click="handleFigmaUndo" class="btn-sm bg-slate-600 hover:bg-slate-500 animate-pulse">
                ↩ 復原 (Undo)
              </button>
            </div>
            <div class="relative min-h-[220px] bg-slate-900 p-6"
                 style="background-image: radial-gradient(circle, rgba(148,163,184,0.1) 1px, transparent 1px); background-size: 20px 20px;">
              <div v-if="figmaBoxVisible"
                   class="h-16 w-16 rounded-lg border-2 border-white/30 transition-all duration-500"
                   :style="{ backgroundColor: figmaBoxColor, transform: `translateX(${figmaBoxX}px)` }">
              </div>
              <p v-else class="pt-16 text-center text-slate-600">按上方按鈕開始操作</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 7: Call Stack ===== -->
    <div v-else-if="stepData.view === 'callstack'" class="slide-page">
      <div class="wm">ENGINE</div>
      <div class="flex flex-col gap-6 md:flex-row md:justify-center md:gap-8">
        <div class="md:w-1/3">
          <h2 class="mb-3 text-xl font-bold text-white">🔧 第十關：Call Stack</h2>
          <div class="stack-box">
            <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Call Stack</p>
            <div class="flex min-h-[100px] flex-col-reverse gap-1">
              <div v-for="(frame, i) in csFrames" :key="frame"
                   class="rounded-lg px-3 py-2 text-sm font-bold text-white transition-all"
                   :class="[
                     frame === 'main()' ? 'bg-blue-600' : frame === 'calculate()' ? 'bg-purple-600' : 'bg-green-600',
                     i === csFrames.length - 1 ? 'ring-2 ring-amber-400 scale-105' : ''
                   ]">
                {{ frame }}
                <span v-if="i === csFrames.length - 1" class="ml-1 text-xs opacity-70">(Top)</span>
              </div>
            </div>
            <div v-if="!csFrames.length" class="py-6 text-center text-slate-500">
              {{ csPhase === 0 ? '等待執行...' : '✅ 清空！' }}
            </div>
          </div>
          <button v-if="csPhase < 6" @click="csAdvance"
                  :disabled="csPhase === 3 && csAnswer !== 'add'"
                  class="btn-action mt-4 w-full disabled:opacity-30">
            {{ csPhase === 0 ? '▶ 開始執行' : '▶ 下一步' }}
          </button>
        </div>
        <div class="md:w-2/3">
          <div class="overflow-hidden rounded-xl border border-slate-700">
            <div class="flex items-center gap-2 bg-slate-900 px-3 py-2">
              <span class="h-3 w-3 rounded-full bg-red-500"></span>
              <span class="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span class="h-3 w-3 rounded-full bg-green-500"></span>
              <span class="ml-2 text-xs text-slate-500">callstack.js</span>
            </div>
            <div class="bg-slate-950 p-4 font-mono text-sm leading-relaxed">
              <div v-for="(line, i) in csCode" :key="i"
                   class="rounded px-1 py-0.5 transition-colors"
                   :class="csHighlight === i ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'">
                <span class="mr-3 inline-block w-5 text-right text-slate-600">{{ i + 1 }}</span>{{ line }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 8: Parser ===== -->
    <div v-else-if="stepData.view === 'parser'" class="slide-page">
      <div class="wm">PARSER</div>
      <div class="flex flex-col gap-6 md:flex-row md:justify-center md:gap-8">
        <div class="md:w-1/2">
          <h2 class="mb-3 text-xl font-bold text-white"><span class="font-mono">{}</span> 第十一關：語法檢查</h2>
          <div class="mb-3 overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-lg" style="white-space: pre;"><!--
            --><span v-for="(char, i) in parserCode.split('')" :key="i"
                  class="inline-block transition-colors"
                  :class="[
                    i === parserCursor - 1 ? 'rounded bg-amber-500/30 text-amber-300' :
                    parserMatched.includes(i) ? 'text-emerald-400' :
                    i < parserCursor ? 'text-slate-400' : 'text-slate-600'
                  ]">{{ char }}</span>
          </div>
          <div class="mb-3 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-300">
            {{ parserMsg }}
          </div>
          <button @click="parserAdvance" :disabled="parserFinished"
                  class="btn-action w-full disabled:opacity-30">
            {{ parserFinished ? '✅ 完成' : '讀取下一個字元 →' }}
          </button>
        </div>
        <div class="md:w-1/3">
          <div class="stack-box">
            <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Parser Stack</p>
            <div class="flex min-h-[100px] flex-col-reverse gap-1">
              <div v-for="(item, i) in parserStack" :key="i"
                   class="rounded-lg border border-sky-500 bg-sky-500/20 px-3 py-2 text-center text-lg font-bold text-sky-300"
                   :class="i === parserStack.length - 1 ? 'ring-2 ring-amber-400' : ''">
                {{ item }}
              </div>
            </div>
            <div v-if="!parserStack.length" class="py-6 text-center text-slate-500">
              {{ parserFinished ? '✅ 清空！' : '空' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 9: Calculator ===== -->
    <div v-else-if="stepData.view === 'calculator'" class="slide-page">
      <div class="wm">CALC</div>
      <div class="flex flex-col gap-6 md:flex-row md:justify-center md:gap-8">
        <div class="md:w-1/3">
          <h2 class="mb-3 text-xl font-bold text-white">🔢 第十二關：計算機</h2>
          <div class="stack-box">
            <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Input Stack</p>
            <div class="flex min-h-[100px] flex-col-reverse gap-1">
              <div v-for="(item, i) in calcInput" :key="'c' + i"
                   class="rounded-lg border border-sky-500 bg-sky-500/20 px-3 py-2 text-center text-lg font-bold text-sky-300"
                   :class="i === calcInput.length - 1 ? 'ring-2 ring-amber-400' : ''">
                {{ item }}
                <span v-if="i === calcInput.length - 1" class="ml-1 text-xs text-amber-400">(Top)</span>
              </div>
            </div>
            <div v-if="!calcInput.length" class="py-6 text-center text-slate-500">空 (Empty)</div>
          </div>
        </div>
        <div class="md:w-2/3">
          <!-- Calculator UI -->
          <div class="overflow-hidden rounded-xl border border-slate-700">
            <div class="flex items-center gap-2 bg-slate-900 px-3 py-2">
              <span class="h-3 w-3 rounded-full bg-red-500"></span>
              <span class="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span class="h-3 w-3 rounded-full bg-green-500"></span>
              <span class="ml-2 text-xs text-slate-500">Calculator</span>
            </div>
            <!-- Display -->
            <div class="border-b border-slate-700 bg-slate-950 px-6 py-6 text-right">
              <p v-if="calcPhase < 4" class="font-mono text-3xl font-bold text-white md:text-4xl">
                {{ calcInput.join(' ') || '0' }}
              </p>
              <p v-else class="font-mono text-3xl font-bold md:text-4xl">
                <span class="text-slate-400">3 + 5 = </span><span class="text-emerald-400">8</span>
              </p>
            </div>
            <!-- Buttons -->
            <div class="grid grid-cols-4 gap-1 bg-slate-800 p-3">
              <button @click="handleCalcPress('3')"
                      :disabled="calcPhase !== 0"
                      class="calc-key"
                      :class="calcPhase === 0 ? 'ring-2 ring-amber-400 animate-pulse text-white' : 'text-slate-500'">
                3
              </button>
              <button @click="handleCalcPress('+')"
                      :disabled="calcPhase !== 1"
                      class="calc-key"
                      :class="calcPhase === 1 ? 'ring-2 ring-amber-400 animate-pulse text-white' : 'text-slate-500'">
                +
              </button>
              <button @click="handleCalcPress('5')"
                      :disabled="calcPhase !== 2"
                      class="calc-key"
                      :class="calcPhase === 2 ? 'ring-2 ring-amber-400 animate-pulse text-white' : 'text-slate-500'">
                5
              </button>
              <button @click="handleCalcPress('=')"
                      :disabled="calcPhase !== 3"
                      class="calc-key"
                      :class="calcPhase === 3 ? 'ring-2 ring-emerald-400 animate-pulse bg-emerald-600 text-white' : 'text-slate-500'">
                =
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 13: JS Array Methods ===== -->
    <div v-else-if="stepData.view === 'js-array'" class="slide-page">
      <div class="wm">ARRAY</div>
      <div class="flex flex-col items-center gap-6">
        <h2 class="text-xl font-bold text-white">📦 第十三關：JS 陣列全貌</h2>

        <!-- 陣列視覺化 -->
        <div class="w-full max-w-2xl">
          <!-- 上方：unshift / push 標示 -->
          <div class="mb-2 flex items-center justify-between px-2">
            <span class="text-xs font-bold text-sky-400">← unshift()</span>
            <span class="text-xs font-bold text-slate-500">Array</span>
            <span class="text-xs font-bold text-emerald-400">push() →</span>
          </div>
          <!-- 陣列本體 -->
          <div class="flex min-h-[80px] items-center justify-center gap-1 rounded-2xl border-2 border-slate-600 bg-slate-800/80 px-4 py-4">
            <TransitionGroup name="arr-item">
              <div v-for="(item, i) in arrItems" :key="item.id"
                   class="flex h-14 w-14 items-center justify-center rounded-xl border-2 text-xl shadow-lg transition-all"
                   :class="[
                     item.color + '/20',
                     'border-' + item.color.replace('bg-', ''),
                     i === 0 ? 'ring-2 ring-sky-400/50' : '',
                     i === arrItems.length - 1 ? 'ring-2 ring-emerald-400/50' : '',
                   ]">
                {{ item.label }}
              </div>
            </TransitionGroup>
            <div v-if="!arrItems.length" class="py-4 text-slate-500">空陣列 []</div>
          </div>
          <!-- 下方：shift / pop 標示 -->
          <div class="mt-2 flex items-center justify-between px-2">
            <span class="text-xs font-bold text-orange-400">← shift()</span>
            <span class="text-xs text-slate-600">index: 0 ... {{ Math.max(0, arrItems.length - 1) }}</span>
            <span class="text-xs font-bold text-rose-400">pop() →</span>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
          <button v-for="op in arrayOps" :key="op.method"
                  @click="arrDoOp(op)"
                  :disabled="arrAnimating"
                  class="flex flex-col items-center gap-1 rounded-xl border-2 px-4 py-3 font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                  :class="[
                    arrUsed.has(op.method)
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-600 bg-slate-800 text-white hover:border-amber-400',
                  ]">
            <span class="font-mono text-sm">{{ op.method }}</span>
            <span class="text-xs text-slate-400">{{ op.desc }}</span>
            <span v-if="arrUsed.has(op.method)" class="text-xs text-emerald-400">✓</span>
          </button>
        </div>

        <!-- 總結區塊 -->
        <div v-if="arrUsed.size >= 4" class="w-full max-w-lg rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-4">
          <div class="mb-3 grid grid-cols-2 gap-3 text-center text-sm">
            <div class="rounded-lg bg-slate-800 p-3">
              <p class="font-bold text-emerald-300">Stack (堆疊)</p>
              <p class="mt-1 font-mono text-xs text-slate-400">push() + pop()</p>
              <p class="text-xs text-slate-500">右邊進出 → LIFO</p>
              <p class="mt-1 text-xs text-amber-300">返回上一步、Undo</p>
            </div>
            <div class="rounded-lg bg-slate-800 p-3">
              <p class="font-bold text-sky-300">Queue (佇列)</p>
              <p class="mt-1 font-mono text-xs text-slate-400">push() + shift()</p>
              <p class="text-xs text-slate-500">右進左出 → FIFO</p>
              <p class="mt-1 text-xs text-amber-300">排隊處理、訊息佇列</p>
            </div>
          </div>
          <p class="text-center text-xs text-slate-400 italic">
            未來你的介面需要「返回上一步」，就用 push + pop（Stack）；<br>
            需要「排隊處理」，就用 push + shift（Queue）。
          </p>
        </div>
      </div>
    </div>

    <!-- ===== Step 15: Calculator × Array State ===== -->
    <div v-else-if="stepData.view === 'calc-array'" class="slide-page">
      <div class="wm">CALC</div>
      <div class="flex flex-col gap-6 md:flex-row md:justify-center md:gap-8">
        <!-- Left: Calculator -->
        <div class="md:w-1/3">
          <h2 class="mb-3 text-xl font-bold text-white">🔢 第十四關：計算機 × 陣列</h2>
          <!-- Calculator UI -->
          <div class="overflow-hidden rounded-xl border border-slate-700">
            <div class="border-b border-slate-700 bg-slate-950 px-4 py-4 text-right">
              <p class="font-mono text-2xl font-bold text-white">{{ caDisplay }}</p>
            </div>
            <div class="grid grid-cols-4 gap-1 bg-slate-800 p-2">
              <button @click="caPress('3')" :disabled="caPhase !== 0"
                      class="calc-key"
                      :class="caPhase === 0 ? 'ring-2 ring-amber-400 animate-pulse text-white' : 'text-slate-500'">
                3
              </button>
              <button @click="caPress('+')" :disabled="caPhase !== 1"
                      class="calc-key"
                      :class="caPhase === 1 ? 'ring-2 ring-amber-400 animate-pulse text-white' : 'text-slate-500'">
                +
              </button>
              <button @click="caPress('5')" :disabled="caPhase !== 2"
                      class="calc-key"
                      :class="caPhase === 2 ? 'ring-2 ring-amber-400 animate-pulse text-white' : 'text-slate-500'">
                5
              </button>
              <button @click="caPress('=')" :disabled="caPhase !== 3"
                      class="calc-key"
                      :class="caPhase === 3 ? 'ring-2 ring-emerald-400 animate-pulse bg-emerald-600 text-white' : 'text-slate-500'">
                =
              </button>
            </div>
          </div>
        </div>
        <!-- Right: Array State -->
        <div class="md:w-2/3">
          <!-- Visual Array -->
          <div class="mb-4">
            <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Stack 狀態（陣列）</p>
            <div class="flex min-h-[60px] items-center gap-2 rounded-xl border-2 border-slate-600 bg-slate-800/80 px-4 py-3">
              <span class="font-mono text-sm text-slate-500">[</span>
              <TransitionGroup name="ca-item">
                <div v-for="item in caStack" :key="item.id"
                     class="flex h-12 w-12 items-center justify-center rounded-lg border-2 text-lg font-bold text-white shadow-lg"
                     :class="item.cls">
                  {{ item.label }}
                </div>
              </TransitionGroup>
              <span class="font-mono text-sm text-slate-500">]</span>
              <span v-if="!caStack.length" class="text-sm text-slate-500 italic">空陣列</span>
            </div>
          </div>
          <!-- Code Log -->
          <div class="overflow-hidden rounded-xl border border-slate-700">
            <div class="flex items-center gap-2 bg-slate-900 px-3 py-2">
              <span class="h-3 w-3 rounded-full bg-red-500"></span>
              <span class="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span class="h-3 w-3 rounded-full bg-green-500"></span>
              <span class="ml-2 text-xs text-slate-500">stack-calculator.js</span>
            </div>
            <div class="max-h-[240px] overflow-y-auto bg-slate-950 p-4 font-mono text-sm leading-relaxed">
              <div v-for="(line, i) in caLog" :key="i"
                   class="text-slate-300"
                   :class="i === caLog.length - 1 ? 'text-amber-300' : ''">
                <span class="mr-3 inline-block w-4 text-right text-slate-600">{{ i + 1 }}</span>{{ line }}
              </div>
              <div class="text-slate-600">
                <span class="mr-3 inline-block w-4 text-right">{{ caLog.length + 1 }}</span><span class="animate-pulse text-slate-400">▎</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 15: Calculator Undo ===== -->
    <div v-else-if="stepData.view === 'calc-undo'" class="slide-page">
      <div class="wm">UNDO</div>
      <div class="flex flex-col gap-6 md:flex-row md:justify-center md:gap-8">
        <!-- Left: Buttons -->
        <div class="md:w-1/3">
          <h2 class="mb-3 text-xl font-bold text-white">↩️ 第十五關：計算機 Undo</h2>
          <div class="grid grid-cols-2 gap-2">
            <button @click="cuPress('3')" :disabled="cuPhase !== 0"
                    class="calc-key"
                    :class="cuPhase === 0 ? 'ring-2 ring-amber-400 animate-pulse text-white' : 'text-slate-500'">
              3
            </button>
            <button @click="cuPress('+')" :disabled="cuPhase !== 1"
                    class="calc-key"
                    :class="cuPhase === 1 ? 'ring-2 ring-amber-400 animate-pulse text-white' : 'text-slate-500'">
              +
            </button>
            <button @click="cuPress('7')" :disabled="cuPhase !== 2"
                    class="calc-key"
                    :class="cuPhase === 2 ? 'ring-2 ring-red-400 animate-pulse text-white bg-red-600/30' : 'text-slate-500'">
              7 (手滑!)
            </button>
            <button @click="cuUndo()" :disabled="cuPhase !== 3"
                    class="calc-key"
                    :class="cuPhase === 3 ? 'ring-2 ring-orange-400 animate-pulse text-white bg-orange-600' : 'text-slate-500'">
              ↩ Undo
            </button>
          </div>
          <!-- Undo 結論 -->
          <div v-if="cuPhase >= 4" class="mt-4 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-center">
            <p class="text-sm font-bold text-orange-300">Undo = Pop</p>
            <p class="mt-1 text-xs text-slate-400">把最後一個操作從 Stack 拿出來，就是「回到上一步」。</p>
          </div>
        </div>
        <!-- Right: Array State + Code Log -->
        <div class="md:w-2/3">
          <div class="mb-4">
            <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Stack 狀態（陣列）</p>
            <div class="flex min-h-[60px] items-center gap-2 rounded-xl border-2 border-slate-600 bg-slate-800/80 px-4 py-3">
              <span class="font-mono text-sm text-slate-500">[</span>
              <TransitionGroup name="ca-item">
                <div v-for="item in cuStack" :key="item.id"
                     class="flex h-12 w-12 items-center justify-center rounded-lg border-2 text-lg font-bold text-white shadow-lg"
                     :class="item.cls">
                  {{ item.label }}
                </div>
              </TransitionGroup>
              <span class="font-mono text-sm text-slate-500">]</span>
              <span v-if="!cuStack.length" class="text-sm text-slate-500 italic">空陣列</span>
            </div>
          </div>
          <div class="overflow-hidden rounded-xl border border-slate-700">
            <div class="flex items-center gap-2 bg-slate-900 px-3 py-2">
              <span class="h-3 w-3 rounded-full bg-red-500"></span>
              <span class="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span class="h-3 w-3 rounded-full bg-green-500"></span>
              <span class="ml-2 text-xs text-slate-500">undo-calculator.js</span>
            </div>
            <div class="max-h-[240px] overflow-y-auto bg-slate-950 p-4 font-mono text-sm leading-relaxed">
              <div v-for="(line, i) in cuLog" :key="i"
                   class="text-slate-300"
                   :class="i === cuLog.length - 1 ? 'text-amber-300' : ''">
                <span class="mr-3 inline-block w-4 text-right text-slate-600">{{ i + 1 }}</span>{{ line }}
              </div>
              <div class="text-slate-600">
                <span class="mr-3 inline-block w-4 text-right">{{ cuLog.length + 1 }}</span><span class="animate-pulse text-slate-400">▎</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 16: Pop Return Value ===== -->
    <div v-else-if="stepData.view === 'pop-return'" class="slide-page">
      <div class="wm">POP</div>
      <div class="flex flex-col gap-6">
        <h2 class="text-center text-xl font-bold text-white">🎯 第十六關：Pop 的回傳值</h2>
        <!-- 科普說明卡片 -->
        <div class="mx-auto w-full max-w-2xl rounded-2xl border border-violet-500/30 bg-violet-500/10 px-6 py-5">
          <p class="mb-3 text-sm font-bold text-violet-300">你知道嗎？pop() 不只是「拿掉」，它會把值交給你：</p>
          <div class="rounded-xl bg-slate-950 p-4 font-mono text-sm leading-relaxed">
            <p class="text-slate-500">// 之前你看到的</p>
            <p class="text-slate-300">stack.pop();<span class="text-slate-500">          // 拿掉最後一個</span></p>
            <p class="mt-3 text-slate-500">// 其實可以接住它的回傳值</p>
            <p class="text-amber-300">const x = stack.pop();<span class="text-slate-500">  // x = 'C' ← 被拿出來的值</span></p>
          </div>
        </div>
        <!-- 互動區 -->
        <div class="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
          <!-- Stack -->
          <div class="flex-1">
            <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Stack 狀態</p>
            <div class="flex min-h-[60px] items-center gap-2 rounded-xl border-2 border-slate-600 bg-slate-800/80 px-4 py-3">
              <span class="font-mono text-sm text-slate-500">[</span>
              <TransitionGroup name="ca-item">
                <div v-for="item in prStack" :key="'pr-' + item.id"
                     class="flex h-12 w-12 items-center justify-center rounded-lg border-2 text-lg font-bold text-white shadow-lg"
                     :class="item.cls">
                  {{ item.label }}
                </div>
              </TransitionGroup>
              <span class="font-mono text-sm text-slate-500">]</span>
              <span v-if="!prStack.length" class="text-sm text-slate-500 italic">空</span>
            </div>
            <button v-if="!prDone" @click="prPop()"
                    class="btn-action mt-4 w-full ring-2 ring-violet-400 animate-pulse">
              ▶ 執行 stack.pop()
            </button>
          </div>
          <!-- 變數區 -->
          <div class="flex-1">
            <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">回傳值</p>
            <div class="flex min-h-[60px] items-center justify-center rounded-xl border-2 bg-slate-800/80 px-4 py-3"
                 :class="prDone ? 'border-emerald-500/50' : 'border-slate-600'">
              <div v-if="prDone" class="flex items-center gap-3">
                <span class="font-mono text-lg font-bold text-violet-300">const x =</span>
                <div class="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-emerald-400 bg-emerald-500/20 text-lg font-bold text-white shadow-lg">
                  {{ prVar }}
                </div>
              </div>
              <span v-else class="text-sm text-slate-500 italic">按 Pop 後會顯示...</span>
            </div>
            <!-- 結論 -->
            <div v-if="prDone" class="mt-4 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-center">
              <p class="text-sm font-bold text-violet-300">pop() 會回傳被拿出來的值</p>
              <p class="mt-1 text-xs text-slate-400">不是只「刪掉」，它把值「交給你」。計算機就是靠這個特性運算的。</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 17: Manual Calculate ===== -->
    <div v-else-if="stepData.view === 'calc-compute'" class="slide-page">
      <div class="wm">CALC</div>
      <div class="flex flex-col gap-6">
        <h2 class="text-center text-xl font-bold text-white">🧮 第十七關：手動計算 3 + 5</h2>
        <div class="mx-auto flex w-full max-w-2xl flex-col gap-4 md:flex-row md:gap-6">
          <!-- Left: Stack + Button -->
          <div class="flex-1">
            <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Stack 狀態</p>
            <div class="flex min-h-[60px] items-center gap-2 rounded-xl border-2 border-slate-600 bg-slate-800/80 px-4 py-3">
              <span class="font-mono text-sm text-slate-500">[</span>
              <TransitionGroup name="ca-item">
                <div v-for="item in ccStack" :key="'cc-' + item.id"
                     class="flex h-12 w-12 items-center justify-center rounded-lg border-2 text-lg font-bold text-white shadow-lg"
                     :class="item.cls">
                  {{ item.label }}
                </div>
              </TransitionGroup>
              <span class="font-mono text-sm text-slate-500">]</span>
              <span v-if="!ccStack.length && !ccDone" class="text-sm text-slate-500 italic">空</span>
            </div>
            <button v-if="ccVars.length < 3" @click="ccPop()"
                    class="btn-action mt-4 w-full ring-2 ring-violet-400 animate-pulse">
              ▶ Pop（第 {{ ccVars.length + 1 }} / 3 次）
            </button>
            <button v-else-if="!ccDone" @click="ccCalc()"
                    class="btn-action mt-4 w-full ring-2 ring-emerald-400 animate-pulse !bg-emerald-500 !shadow-emerald-500/25">
              🧮 計算 a op b
            </button>
          </div>
          <!-- Right: Variables -->
          <div class="flex-1">
            <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Pop 出來的變數</p>
            <div class="min-h-[60px] space-y-2 rounded-xl border-2 border-violet-500/30 bg-slate-800/80 px-4 py-3">
              <TransitionGroup name="ca-item">
                <div v-for="v in ccVars" :key="'ccv-' + v.name"
                     class="flex items-center gap-3 rounded-lg bg-slate-700/50 px-3 py-2">
                  <span class="font-mono text-sm font-bold text-violet-300">{{ v.name }}</span>
                  <span class="text-slate-500">=</span>
                  <div class="flex h-9 w-9 items-center justify-center rounded-lg border-2 text-sm font-bold text-white shadow"
                       :class="v.cls.replace('bg-', 'bg-').replace('border-', 'border-')">
                    {{ v.label }}
                  </div>
                </div>
              </TransitionGroup>
              <div v-if="!ccVars.length" class="py-3 text-center text-sm text-slate-500 italic">按 Pop 把值取出來...</div>
              <!-- 計算結果 -->
              <div v-if="ccResult" class="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center">
                <span class="font-mono text-sm font-bold text-emerald-300">{{ ccResult }}</span>
              </div>
            </div>
            <!-- 結論 -->
            <div v-if="ccDone" class="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center">
              <p class="text-sm font-bold text-emerald-300">Pop → 存變數 → 計算 → Push 結果</p>
              <p class="mt-1 text-xs text-slate-400">這就是計算機按 = 後的完整流程。</p>
            </div>
          </div>
        </div>
        <!-- Code Log -->
        <div class="mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-slate-700">
          <div class="flex items-center gap-2 bg-slate-900 px-3 py-2">
            <span class="h-3 w-3 rounded-full bg-red-500"></span>
            <span class="h-3 w-3 rounded-full bg-yellow-500"></span>
            <span class="h-3 w-3 rounded-full bg-green-500"></span>
            <span class="ml-2 text-xs text-slate-500">calc-compute.js</span>
          </div>
          <div class="max-h-[200px] overflow-y-auto bg-slate-950 p-4 font-mono text-sm leading-relaxed">
            <div v-for="(line, i) in ccLog" :key="i"
                 class="text-slate-300"
                 :class="i === ccLog.length - 1 ? 'text-amber-300' : ''">
              <span class="mr-3 inline-block w-4 text-right text-slate-600">{{ i + 1 }}</span>{{ line }}
            </div>
            <div class="text-slate-600">
              <span class="mr-3 inline-block w-4 text-right">{{ ccLog.length + 1 }}</span><span class="animate-pulse text-slate-400">▎</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== hw-intro: 換你上場 ===== -->
    <div v-else-if="stepData.view === 'hw-intro'" class="slide-page">
      <div class="flex h-full flex-col items-center justify-center text-center px-6">
        <div class="text-6xl mb-6">💪</div>
        <h2 class="text-3xl font-bold text-white md:text-4xl mb-4">換你來實作！</h2>
        <p class="text-lg text-slate-300 mb-2">接下來的作業是——</p>
        <div class="mt-2 inline-block rounded-2xl border border-amber-500/30 bg-amber-500/10 px-8 py-4">
          <p class="text-2xl font-bold text-amber-300 md:text-3xl">迷你計算機 Undo</p>
          <p class="mt-2 text-sm text-slate-400">用你剛學的 push / pop，寫出加、減、還原功能</p>
        </div>
        <div class="mt-8 flex items-center gap-2 text-slate-500">
          <span class="text-sm">按「下一步」開始看作業說明</span>
          <span>→</span>
        </div>
      </div>
    </div>

    <!-- ===== Homework Demo ===== -->
    <div v-else-if="stepData.view === 'homework-demo'" class="slide-page">
      <div class="wm">HW</div>
      <div class="text-center mb-4">
        <h2 class="mb-2 text-2xl font-bold text-white md:text-3xl">課後作業：計算機 Undo</h2>
        <p class="text-slate-400">親手操作看看！輸入數字按 + 或 −，再按 Undo 觀察 undoStack 的變化。</p>
      </div>

      <!-- 互動區域 -->
      <div class="mx-auto max-w-4xl">
        <!-- 計算機 + undoStack 並排 -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-5">
          <!-- 左側：計算機 (3/5) -->
          <div class="md:col-span-3">
            <!-- 計算機顯示器 -->
            <div class="rounded-xl border border-slate-600 bg-slate-900 p-4 mb-3">
              <div class="text-xs text-slate-500 mb-1">計算機</div>
              <div class="text-right font-mono text-4xl font-bold text-white transition-all duration-300">
                {{ hwValue }}
              </div>
            </div>

            <!-- 輸入區 + 操作按鈕 -->
            <div class="flex gap-2 mb-4 items-stretch">
              <!-- 數字輸入（引導模式中唯讀） -->
              <input v-model="hwInput" type="number" placeholder="輸入數字" :readonly="!!hwCurrent"
                     class="flex-[2] rounded-lg border bg-slate-900 px-3 py-2 text-center font-mono text-lg font-bold text-white placeholder-slate-600 outline-none transition-all"
                     :class="hwInput ? 'border-white/30' : 'border-slate-700'" />
              <!-- + 按鈕 -->
              <button @click="hwAdd"
                      class="flex-1 rounded-lg border px-3 py-2 text-center text-lg font-bold transition-all duration-200"
                      :class="hwCurrent?.op === '+' ? 'border-emerald-400 bg-emerald-500/30 text-emerald-300 hover:bg-emerald-500/40 scale-105 cursor-pointer animate-pulse' : 'border-slate-700 bg-slate-800 text-slate-600 cursor-not-allowed'">
                +
              </button>
              <!-- − 按鈕 -->
              <button @click="hwSubtract"
                      class="flex-1 rounded-lg border px-3 py-2 text-center text-lg font-bold transition-all duration-200"
                      :class="hwCurrent?.op === '-' ? 'border-amber-400 bg-amber-500/30 text-amber-300 hover:bg-amber-500/40 scale-105 cursor-pointer animate-pulse' : 'border-slate-700 bg-slate-800 text-slate-600 cursor-not-allowed'">
                −
              </button>
              <!-- Undo 按鈕 -->
              <button @click="hwUndo"
                      class="flex-1 rounded-lg border px-3 py-2 text-center text-sm font-bold transition-all duration-200"
                      :class="hwCurrent?.op === 'undo' ? 'border-rose-400 bg-rose-500/30 text-rose-300 hover:bg-rose-500/40 scale-105 cursor-pointer animate-pulse' : 'border-slate-700 bg-slate-800 text-slate-600 cursor-not-allowed'">
                ↩ Undo
              </button>
            </div>

            <!-- 引導步驟提示 -->
            <div v-if="hwCurrent" class="mb-4 rounded-lg border border-dashed p-3 text-center text-sm"
                 :class="hwCurrent.op === 'undo' ? 'border-rose-500/30 text-rose-300/80' : 'border-emerald-500/30 text-emerald-300/80'">
              <span class="text-slate-500 mr-1">Step {{ hwStep + 1 }}/{{ hwGuide.length }}</span>
              <span v-if="hwCurrent.op === '+'" >按 <span class="text-emerald-400 font-bold">+</span></span>
              <span v-else-if="hwCurrent.op === '-'">按 <span class="text-amber-400 font-bold">−</span></span>
              <span v-else>按 <span class="text-rose-300 font-bold">↩ Undo</span></span>
            </div>

            <!-- 操作紀錄 -->
            <div v-if="hwLog.length" class="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-slate-500">操作紀錄</span>
                <button @click="hwReset" class="text-xs text-slate-600 hover:text-slate-400 transition-colors">重置</button>
              </div>
              <div class="space-y-1.5 max-h-[120px] overflow-y-auto">
                <div v-for="(entry, i) in hwLog" :key="i"
                     class="flex items-center gap-2 text-xs"
                     :class="i === hwLog.length - 1 ? 'text-white' : 'text-slate-500'">
                  <span class="w-4 shrink-0 text-right text-slate-600">{{ i + 1 }}</span>
                  <span class="font-bold" :class="entry.action.includes('Undo') ? 'text-rose-300' : 'text-emerald-300'">{{ entry.action }}</span>
                  <span class="text-slate-500">{{ entry.before }} → {{ entry.after }}</span>
                  <span class="ml-auto shrink-0 text-slate-600">{{ entry.stack }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 右側：undoStack (2/5) -->
          <div class="md:col-span-2">
            <div class="rounded-xl border-2 border-emerald-500/30 bg-slate-800/80 p-4 h-full">
              <div class="mb-2 text-center text-sm font-bold text-emerald-400">undoStack</div>
              <div class="flex min-h-[140px] flex-col-reverse gap-2">
                <TransitionGroup name="ca-item">
                  <div v-for="item in hwUndoStack" :key="item.id"
                       class="rounded-lg border px-3 py-2 text-center text-sm font-bold text-white"
                       :class="item.cls">
                    {{ item.label }}
                  </div>
                </TransitionGroup>
              </div>
              <div v-if="!hwUndoStack.length" class="py-6 text-center text-xs text-slate-500 italic">空的</div>
            </div>
          </div>
        </div>

        <!-- 完成提示 + 重置 -->
        <div v-if="hwDone" class="mt-4 text-center">
          <p class="mb-2 text-sm text-emerald-300">Undo 就是從 undoStack pop 出來，還原上一步——這就是你要實作的計算機！</p>
          <button @click="hwReset" class="rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-xs text-slate-400 transition-all hover:border-amber-400 hover:text-amber-300">再玩一次</button>
        </div>
      </div>
    </div>

    <!-- ===== Step 20: Homework Files ===== -->
    <div v-else-if="stepData.view === 'homework-files'" class="slide-page">
      <div class="wm">HW</div>
      <div class="text-center mb-6">
        <h2 class="mb-2 text-2xl font-bold text-white md:text-3xl">作業檔案結構</h2>
        <p class="text-slate-400">測試已經寫好了！你只需要填寫 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-amber-300">calculator.js</code> 裡的 TODO。</p>
      </div>

      <div class="mx-auto max-w-3xl">
        <!-- 資料夾結構 -->
        <div class="mb-5 rounded-xl border border-slate-700 bg-slate-800/80 p-5">
          <p class="mb-3 text-sm font-bold text-white">📁 homework/stack-calculator/</p>
          <div class="space-y-1 pl-4 font-mono text-sm">
            <div class="text-slate-400">├── package.json</div>
            <div class="flex items-center gap-2">
              <span class="text-amber-300">├── calculator.js</span>
              <span class="rounded bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-300">📝 你要寫的</span>
            </div>
            <div class="text-slate-400">├── README.md</div>
            <div class="text-slate-400">└── __tests__/</div>
            <div class="flex items-center gap-2 pl-6">
              <span class="text-emerald-300">└── calculator.test.js</span>
              <span class="rounded bg-emerald-500/20 px-1.5 py-0.5 text-xs text-emerald-300">✅ 已寫好</span>
            </div>
          </div>
        </div>

        <!-- calculator.js 預覽 -->
        <div class="mb-5 rounded-xl border border-slate-700 overflow-hidden">
          <div class="flex items-center gap-2 bg-slate-900 px-3 py-2">
            <span class="h-3 w-3 rounded-full bg-red-500"></span>
            <span class="h-3 w-3 rounded-full bg-yellow-500"></span>
            <span class="h-3 w-3 rounded-full bg-green-500"></span>
            <span class="ml-2 text-xs text-slate-500">calculator.js</span>
          </div>
          <div class="bg-slate-950 p-4 font-mono text-xs leading-relaxed">
            <div class="text-slate-500">// 你會看到這樣的結構：</div>
            <div class="text-purple-300 mt-1">export function <span class="text-white">createCalculator</span>() &#123;</div>
            <div class="text-slate-400 pl-4">let value = 0</div>
            <div class="text-slate-400 pl-4">const undoStack = []</div>
            <div class="text-slate-400 pl-4 mt-2">return &#123;</div>
            <div class="pl-8 text-amber-300">add(n) &#123; <span class="text-slate-500">// TODO: 請實作</span> &#125;</div>
            <div class="pl-8 text-amber-300">subtract(n) &#123; <span class="text-slate-500">// TODO</span> &#125;</div>
            <div class="pl-8 text-amber-300">undo() &#123; <span class="text-slate-500">// TODO</span> &#125;</div>
            <div class="text-slate-400 pl-4">&#125;</div>
            <div class="text-slate-400">&#125;</div>
          </div>
        </div>

        <!-- 終端機指令 -->
        <div class="rounded-xl border border-slate-700 bg-slate-800/80 p-5">
          <p class="mb-3 text-sm font-bold text-white">開始方式：在終端機輸入</p>
          <div class="rounded-lg bg-slate-950 px-4 py-3 font-mono text-sm">
            <div class="text-slate-500">$ <span class="text-slate-300">cd homework/stack-calculator</span></div>
            <div class="text-slate-500">$ <span class="text-slate-300">npm install</span></div>
            <div class="text-slate-500">$ <span class="text-amber-300">npm test</span> <span class="text-slate-600">← 一開始會看到 8 個失敗，這是正常的！</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 21: hw-code-overview (程式碼全貌) ===== -->
    <div v-else-if="stepData.view === 'hw-code-overview'" class="slide-page">
      <div class="wm">CODE</div>
      <div class="text-center mb-5">
        <h2 class="mb-2 text-2xl font-bold text-white md:text-3xl">calculator.js 全貌</h2>
        <p class="text-slate-400">先看懂整個檔案的結構，你只需要填 3 個 TODO</p>
      </div>

      <div class="mx-auto max-w-4xl grid gap-5 md:grid-cols-5">
        <!-- 左：完整程式碼 (3 cols) -->
        <div class="md:col-span-3 rounded-xl border border-slate-700 overflow-hidden">
          <div class="flex items-center gap-2 bg-slate-900 px-3 py-2">
            <span class="h-3 w-3 rounded-full bg-red-500"></span>
            <span class="h-3 w-3 rounded-full bg-yellow-500"></span>
            <span class="h-3 w-3 rounded-full bg-green-500"></span>
            <span class="ml-2 text-xs text-slate-500">calculator.js</span>
          </div>
          <div class="bg-slate-950 p-4 font-mono text-xs leading-relaxed">
            <div class="text-purple-300">export function <span class="text-white">createCalculator</span>() &#123;</div>
            <!-- value -->
            <div class="mt-2 rounded bg-cyan-500/10 -mx-2 px-2 py-1 border-l-2 border-cyan-400">
              <div class="text-cyan-300 pl-4">let value = 0 <span class="text-cyan-500/60 text-[10px] ml-2">← 螢幕上的數字</span></div>
            </div>
            <!-- undoStack -->
            <div class="mt-1 rounded bg-violet-500/10 -mx-2 px-2 py-1 border-l-2 border-violet-400">
              <div class="text-violet-300 pl-4">const undoStack = [] <span class="text-violet-500/60 text-[10px] ml-2">← 記住每一步（Stack！）</span></div>
            </div>
            <div class="text-slate-400 pl-4 mt-3">return &#123;</div>
            <!-- add -->
            <div class="mt-2 rounded bg-amber-500/10 -mx-2 px-2 py-1.5 border-l-2 border-amber-400">
              <div class="pl-8 text-amber-300">add(n) &#123; <span class="text-slate-500">// TODO</span> &#125;</div>
            </div>
            <!-- subtract -->
            <div class="mt-1 rounded bg-amber-500/10 -mx-2 px-2 py-1.5 border-l-2 border-amber-400">
              <div class="pl-8 text-amber-300">subtract(n) &#123; <span class="text-slate-500">// TODO</span> &#125;</div>
            </div>
            <!-- undo -->
            <div class="mt-1 rounded bg-amber-500/10 -mx-2 px-2 py-1.5 border-l-2 border-amber-400">
              <div class="pl-8 text-amber-300">undo() &#123; <span class="text-slate-500">// TODO</span> &#125;</div>
            </div>
            <!-- getValue (已完成) -->
            <div class="mt-2 rounded bg-emerald-500/5 -mx-2 px-2 py-1 border-l-2 border-emerald-500/30">
              <div class="pl-8 text-emerald-400/60">getValue() &#123; return value &#125; <span class="text-[10px] ml-1">✅ 已寫好</span></div>
            </div>
            <!-- getUndoCount (已完成) -->
            <div class="mt-1 rounded bg-emerald-500/5 -mx-2 px-2 py-1 border-l-2 border-emerald-500/30">
              <div class="pl-8 text-emerald-400/60">getUndoCount() &#123; return undoStack.length &#125; <span class="text-[10px] ml-1">✅ 已寫好</span></div>
            </div>
            <div class="text-slate-400 pl-4 mt-2">&#125;</div>
            <div class="text-slate-400">&#125;</div>
          </div>
        </div>

        <!-- 右：解說卡 (2 cols) -->
        <div class="md:col-span-2 space-y-3">
          <div class="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
            <p class="text-xs font-bold text-cyan-300 mb-1">兩個重要變數</p>
            <p class="text-sm text-slate-300"><span class="text-cyan-300">value</span> — 計算機螢幕上顯示的數字</p>
            <p class="text-sm text-slate-300 mt-1"><span class="text-violet-300">undoStack</span> — 記住你做過的每一步（這就是 Stack！）</p>
          </div>

          <div class="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <p class="text-xs font-bold text-amber-300 mb-2">你要做出 3 個功能</p>
            <div class="space-y-2 text-sm text-slate-300">
              <p><span class="text-amber-300">add(n)</span> — 按「+」，把數字加進去</p>
              <p><span class="text-amber-300">subtract(n)</span> — 按「−」，把數字減掉</p>
              <p><span class="text-amber-300">undo()</span> — 按錯了？還原上一步</p>
            </div>
          </div>

          <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p class="text-xs font-bold text-emerald-300 mb-1">已經幫你寫好的（不用動）</p>
            <div class="space-y-1 text-sm text-slate-400">
              <p><span class="text-emerald-400">getValue()</span> — 看目前螢幕上的數字</p>
              <p><span class="text-emerald-400">getUndoCount()</span> — 還能按幾次 Undo</p>
            </div>
          </div>

          <div class="rounded-xl border border-slate-600 bg-slate-800/50 p-3 text-center">
            <p class="text-xs text-slate-400">看懂結構了嗎？下一頁開始一步步填 TODO</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 22: hw-code-calc (add + subtract 引導) ===== -->
    <div v-else-if="stepData.view === 'hw-code-calc'" class="slide-page">
      <div class="wm">CODE</div>
      <div class="text-center mb-5">
        <h2 class="mb-2 text-2xl font-bold text-white md:text-3xl">寫出「+」和「−」功能</h2>
        <p class="text-slate-400">打開 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-amber-300">calculator.js</code>，跟著提示寫出 add 和 subtract｜<span class="text-slate-500">n = 使用者輸入的數字</span></p>
      </div>

      <div class="mx-auto max-w-4xl grid gap-5 md:grid-cols-2">
        <!-- 左：程式碼區 -->
        <div class="rounded-xl border border-slate-700 bg-slate-900/80 p-5 font-mono text-sm leading-relaxed">
          <p class="mb-3 text-xs text-slate-500 font-sans">calculator.js — add(n)</p>
          <div class="space-y-0.5">
            <p class="text-blue-300">add<span class="text-slate-400">(n)</span> <span class="text-slate-500">{</span></p>
            <p v-if="hccStep >= 1" class="pl-4 transition-all duration-300" :class="hccStep === 1 ? 'text-emerald-300 bg-emerald-500/10 -mx-2 px-6 rounded' : 'text-slate-300'">value += n</p>
            <p v-else class="pl-4 text-slate-600">// TODO: 第一件事</p>
            <p v-if="hccStep >= 2" class="pl-4 transition-all duration-300" :class="hccStep === 2 ? 'text-emerald-300 bg-emerald-500/10 -mx-2 px-6 rounded' : 'text-slate-300'">undoStack.push({ type: <span class="text-amber-300">'add'</span>, value: n })</p>
            <p v-else-if="hccStep >= 1" class="pl-4 text-slate-600">// TODO: 第二件事</p>
            <p class="text-slate-500">}</p>
          </div>

          <!-- subtract 區塊 (step 3+) -->
          <div v-if="hccStep >= 3" class="mt-5 pt-4 border-t border-slate-700/50">
            <p class="mb-3 text-xs text-slate-500 font-sans">calculator.js — subtract(n)</p>
            <div class="space-y-0.5" :class="hccStep === 3 ? 'bg-blue-500/5 -mx-2 px-2 rounded-lg py-1' : ''">
              <p class="text-blue-300">subtract<span class="text-slate-400">(n)</span> <span class="text-slate-500">{</span></p>
              <p class="pl-4" :class="hccStep === 3 ? 'text-blue-300' : 'text-slate-300'">value -= n</p>
              <p class="pl-4" :class="hccStep === 3 ? 'text-blue-300' : 'text-slate-300'">undoStack.push({ type: <span class="text-amber-300">'subtract'</span>, value: n })</p>
              <p class="text-slate-500">}</p>
            </div>
          </div>
        </div>

        <!-- 右：提示卡 -->
        <div class="space-y-4">
          <!-- 進度 -->
          <div class="flex items-center gap-2">
            <div v-for="i in hccTotal" :key="i"
                 class="h-2 flex-1 rounded-full transition-all duration-300"
                 :class="i <= hccStep ? 'bg-emerald-500' : 'bg-slate-700'"></div>
            <span class="text-xs text-slate-500 ml-1">{{ hccStep }}/{{ hccTotal }}</span>
          </div>

          <!-- 提示文字 -->
          <div class="rounded-xl border border-slate-600 bg-slate-800/50 p-4">
            <p v-if="hccStep === 0" class="text-sm text-slate-300">
              <span class="text-amber-300 font-bold">add(n)</span> 就是計算機的「+」按鈕。<br>
              <span class="text-slate-400">n 就是使用者輸入的數字，例如 add(10) 代表按了 +10。</span><br>
              這個方法要做兩件事，按下方按鈕看第一件。
            </p>
            <p v-else-if="hccStep === 1" class="text-sm text-slate-300">
              第一件：把輸入的數字加到螢幕上 → <span class="text-emerald-300 font-bold">value += n</span><br>
              <span class="text-slate-400">例如螢幕是 0，使用者按 +10，螢幕就變 10。</span>
            </p>
            <p v-else-if="hccStep === 2" class="text-sm text-slate-300">
              第二件：記住這一步，之後才能 Undo →<br><span class="text-emerald-300 font-bold">undoStack.push(...)</span><br>
              <span class="text-slate-400">把「我剛才做了 add，數字是 n」存進 Stack。</span>
            </p>
            <p v-else-if="hccStep === 3" class="text-sm text-slate-300">
              <span class="text-blue-300 font-bold">subtract(n)</span> 就是「−」按鈕，跟 add 幾乎一樣！<br>
              <span class="text-slate-400">只是加變減（<code class="text-amber-300">+=</code> → <code class="text-amber-300">-=</code>），type 改成 <code class="text-amber-300">'subtract'</code>。</span>
            </p>
            <p v-else class="text-sm text-slate-300">
              現在跑 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-amber-300">npm test</code>，你應該會看到<span class="text-emerald-400 font-bold">前 5 題變綠</span>！
            </p>
          </div>

          <!-- 下一步按鈕 -->
          <button v-if="hccStep < hccTotal"
                  @click="hccStep++"
                  class="w-full rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white transition-all hover:bg-emerald-500 animate-pulse">
            下一步提示 →
          </button>
          <div v-else class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center">
            <p class="text-sm text-emerald-300 font-bold">add + subtract 完成！按右下角 → 繼續寫 undo</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Step 22: hw-code-undo (undo 引導) ===== -->
    <div v-else-if="stepData.view === 'hw-code-undo'" class="slide-page">
      <div class="wm">CODE</div>
      <div class="text-center mb-5">
        <h2 class="mb-2 text-2xl font-bold text-white md:text-3xl">寫出「還原」功能</h2>
        <p class="text-slate-400">最後一個！按錯了怎麼辦？從 Stack 拿出上一步，把它反過來做</p>
      </div>

      <div class="mx-auto max-w-4xl grid gap-5 md:grid-cols-2">
        <!-- 左：程式碼區 -->
        <div class="rounded-xl border border-slate-700 bg-slate-900/80 p-5 font-mono text-sm leading-relaxed">
          <p class="mb-3 text-xs text-slate-500 font-sans">calculator.js — undo()</p>
          <div class="space-y-0.5">
            <p class="text-blue-300">undo<span class="text-slate-400">()</span> <span class="text-slate-500">{</span></p>

            <!-- Line 1: 空判斷 -->
            <p v-if="hcuStep >= 1" class="pl-4 transition-all duration-300" :class="hcuStep === 1 ? 'text-emerald-300 bg-emerald-500/10 -mx-2 px-6 rounded' : 'text-slate-300'">
              if (undoStack.length === 0) return
            </p>
            <p v-else class="pl-4 text-slate-600">// TODO: 第一步</p>

            <!-- Line 2: pop -->
            <p v-if="hcuStep >= 2" class="pl-4 transition-all duration-300" :class="hcuStep === 2 ? 'text-emerald-300 bg-emerald-500/10 -mx-2 px-6 rounded' : 'text-slate-300'">
              const last = undoStack.pop()
            </p>
            <p v-else-if="hcuStep >= 1" class="pl-4 text-slate-600">// TODO: 第二步</p>

            <!-- Line 3: 還原邏輯 -->
            <div v-if="hcuStep >= 3" class="transition-all duration-300" :class="hcuStep === 3 ? 'bg-emerald-500/10 -mx-2 px-2 rounded-lg py-1' : ''">
              <p class="pl-4" :class="hcuStep === 3 ? 'text-emerald-300' : 'text-slate-300'">if (last.type === <span class="text-amber-300">'add'</span>) {</p>
              <p class="pl-8" :class="hcuStep === 3 ? 'text-emerald-300' : 'text-slate-300'">value -= last.value</p>
              <p class="pl-4" :class="hcuStep === 3 ? 'text-emerald-300' : 'text-slate-300'">} else {</p>
              <p class="pl-8" :class="hcuStep === 3 ? 'text-emerald-300' : 'text-slate-300'">value += last.value</p>
              <p class="pl-4" :class="hcuStep === 3 ? 'text-emerald-300' : 'text-slate-300'">}</p>
            </div>
            <p v-else-if="hcuStep >= 2" class="pl-4 text-slate-600">// TODO: 第三步 — 根據 last.type 還原</p>

            <p class="text-slate-500">}</p>
          </div>
        </div>

        <!-- 右：提示卡 -->
        <div class="space-y-4">
          <!-- 進度 -->
          <div class="flex items-center gap-2">
            <div v-for="i in hcuTotal" :key="i"
                 class="h-2 flex-1 rounded-full transition-all duration-300"
                 :class="i <= hcuStep ? 'bg-blue-500' : 'bg-slate-700'"></div>
            <span class="text-xs text-slate-500 ml-1">{{ hcuStep }}/{{ hcuTotal }}</span>
          </div>

          <!-- 提示文字 -->
          <div class="rounded-xl border border-slate-600 bg-slate-800/50 p-4">
            <p v-if="hcuStep === 0" class="text-sm text-slate-300">
              <span class="text-amber-300 font-bold">undo()</span> 就是「還原」按鈕，按錯了可以回到上一步。<br>
              <span class="text-slate-400">它要做三件事，按下方按鈕看第一步。</span>
            </p>
            <p v-else-if="hcuStep === 1" class="text-sm text-slate-300">
              第一步：先檢查有沒有東西可以還原。<br>
              <span class="text-slate-400">如果 undoStack 是空的（還沒做過任何操作），就什麼都不做，直接 return。</span>
            </p>
            <p v-else-if="hcuStep === 2" class="text-sm text-slate-300">
              第二步：從 Stack 拿出上一步的紀錄。<br>
              <span class="text-slate-400"><code class="text-amber-300">pop()</code> 會把最後一筆操作拿出來，存到變數 <code class="text-amber-300">last</code>，裡面記著「剛才做了什麼、數字是多少」。</span>
            </p>
            <p v-else-if="hcuStep === 3" class="text-sm text-slate-300">
              第三步：把上一步「反過來做」就是還原！<br>
              <span class="text-slate-400">上一步是加（add）→ 現在就減回去。<br>上一步是減（subtract）→ 現在就加回去。</span>
            </p>
            <p v-else class="text-sm text-slate-300">
              跑 <code class="rounded bg-slate-700 px-1.5 py-0.5 text-amber-300">npm test</code>，<span class="text-emerald-400 font-bold">全部 10 題應該都綠了</span>！作業完成！
            </p>
          </div>

          <!-- 下一步按鈕 -->
          <button v-if="hcuStep < hcuTotal"
                  @click="hcuStep++"
                  class="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white transition-all hover:bg-blue-500 animate-pulse">
            下一步提示 →
          </button>
          <div v-else class="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-center">
            <p class="text-sm text-blue-300 font-bold">undo 完成！跑 npm test 全綠就是滿分！</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== summary-insight: 核心觀念 ===== -->
    <div v-else-if="stepData.view === 'summary-insight'" class="slide-page">
      <div class="flex h-full flex-col items-center justify-center text-center px-6">
        <div class="text-5xl mb-6">💡</div>
        <h2 class="text-3xl font-bold text-white md:text-4xl mb-4">只要有「還原上一步」<br>背後就有 Stack</h2>
        <p class="text-slate-400 mb-8 max-w-lg">想想看，這些功能的背後都是 Stack 的 Push / Pop 在運作：</p>

        <div class="mx-auto max-w-2xl grid grid-cols-2 gap-4">
          <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-5 text-left">
            <div class="text-2xl mb-2">🌐</div>
            <p class="text-sm font-bold text-white">瀏覽器「上一頁」</p>
            <p class="text-xs text-slate-400 mt-1">每造訪一個網頁就 Push，按上一頁就 Pop</p>
          </div>
          <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-5 text-left">
            <div class="text-2xl mb-2">⌨️</div>
            <p class="text-sm font-bold text-white">Ctrl+Z 復原</p>
            <p class="text-xs text-slate-400 mt-1">每個操作 Push 進歷史，Ctrl+Z 就是 Pop</p>
          </div>
          <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-5 text-left">
            <div class="text-2xl mb-2">🎨</div>
            <p class="text-sm font-bold text-white">Figma / Photoshop 還原</p>
            <p class="text-xs text-slate-400 mt-1">設計師的每一步操作都存在 Stack 裡</p>
          </div>
          <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-5 text-left">
            <div class="text-2xl mb-2">🧮</div>
            <p class="text-sm font-bold text-white">你的計算機 Undo</p>
            <p class="text-xs text-slate-400 mt-1">add / subtract Push 進 undoStack，Undo 就 Pop</p>
          </div>
        </div>

        <p class="mt-8 text-amber-300 font-bold">這個模式到處都是——學會 Stack，你就看懂了！</p>
      </div>
    </div>

    <!-- ===== summary-review: 學習回顧 ===== -->
    <div v-else-if="stepData.view === 'summary-review'" class="slide-page">
      <div class="wm">DONE</div>
      <div class="text-center mb-6">
        <h2 class="mb-2 text-2xl font-bold text-white md:text-3xl">📚 今天的學習旅程</h2>
        <p class="text-slate-400">從盤子開始，一路探索到計算機引擎——全都是你自己動手發現的</p>
      </div>
      <div class="mx-auto grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-3">
        <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
          <div class="mb-1 text-2xl">⚠️</div>
          <p class="text-sm font-bold text-white">物理法則</p>
          <p class="text-xs text-slate-400">LIFO 後進先出</p>
        </div>
        <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
          <div class="mb-1 text-2xl">🔄</div>
          <p class="text-sm font-bold text-white">LIFO 核心</p>
          <p class="text-xs text-slate-400">動畫 · 生活 · 挑戰</p>
        </div>
        <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
          <div class="mb-1 text-2xl">🌐</div>
          <p class="text-sm font-bold text-white">網頁瀏覽</p>
          <p class="text-xs text-slate-400">上一頁 = Pop</p>
        </div>
        <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
          <div class="mb-1 text-2xl">💻</div>
          <p class="text-sm font-bold text-white">開發語法</p>
          <p class="text-xs text-slate-400">Array push / pop</p>
        </div>
        <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
          <div class="mb-1 text-2xl">🔧</div>
          <p class="text-sm font-bold text-white">JS 引擎</p>
          <p class="text-xs text-slate-400">Call Stack</p>
        </div>
        <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
          <div class="mb-1 text-2xl">🔍</div>
          <p class="text-sm font-bold text-white">語法檢查</p>
          <p class="text-xs text-slate-400">括號匹配 Parser</p>
        </div>
        <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
          <div class="mb-1 text-2xl">🔢</div>
          <p class="text-sm font-bold text-white">計算機 × 陣列</p>
          <p class="text-xs text-slate-400">按鍵看 Stack 變化</p>
        </div>
        <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
          <div class="mb-1 text-2xl">↩️</div>
          <p class="text-sm font-bold text-white">Undo 還原</p>
          <p class="text-xs text-slate-400">Pop = 回上一步</p>
        </div>
        <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
          <div class="mb-1 text-2xl">🏋️</div>
          <p class="text-sm font-bold text-white">實戰練習</p>
          <p class="text-xs text-slate-400">7 關挑戰全通關</p>
        </div>
        <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center col-span-2 md:col-span-3">
          <div class="mb-1 text-2xl">📝</div>
          <p class="text-sm font-bold text-white">課後作業</p>
          <p class="text-xs text-slate-400">實作計算機 Undo → npm test 全綠</p>
        </div>
      </div>
    </div>

    <!-- ===== summary-end: 課程結束 ===== -->
    <div v-else-if="stepData.view === 'summary-end'" class="slide-page">
      <div class="flex h-full flex-col items-center justify-center text-center px-6">
        <div class="text-5xl mb-6">🎉</div>
        <h2 class="text-3xl font-bold text-white md:text-4xl mb-6">恭喜完成 Stack 探索！</h2>

        <div class="mx-auto max-w-lg">
          <div class="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 mb-6">
            <div class="flex items-start gap-4">
              <img src="/images/coach/normal.png" alt="海姐" class="w-20 h-20 rounded-full" />
              <div class="text-left">
                <p class="text-base text-slate-300 leading-relaxed md:text-lg">
                  「慢慢成長，才是比較快的。<br>
                  今天理解了 Stack，之後遇到更複雜的資料結構，<br>
                  你會發現都是從這個基礎長出來的。」
                </p>
                <p class="mt-2 text-sm text-slate-500">—— 海姐</p>
              </div>
            </div>
          </div>

          <button @click="currentStep = 0"
                  class="rounded-full border border-slate-600 bg-slate-800 px-6 py-3 font-bold text-white transition-all hover:border-amber-400 hover:text-amber-300">
            🔄 重新體驗課程
          </button>
        </div>
      </div>
    </div>

    <!-- Fallback -->
    <div v-else class="slide-page flex items-center justify-center">
      <p class="text-slate-400">Loading...</p>
    </div>

  </InteractiveSlideTemplate>
</template>

<style scoped>
.slide-page {
  @apply relative mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-8;
  min-height: 50vh;
}
.wm {
  @apply pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none;
  font-size: 12rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.03);
}
.plate-box {
  @apply mx-auto w-56 rounded-b-2xl border-x-4 border-b-4 border-slate-600 bg-slate-800/50 p-2;
  min-height: 120px;
  display: flex;
  flex-direction: column-reverse;
  gap: 4px;
}
.plate-item {
  @apply flex h-14 items-center justify-center rounded-lg border-4 text-lg font-bold;
}
.stack-box {
  @apply rounded-xl border border-slate-700 bg-slate-800/50 p-3;
}
.btn-action {
  @apply rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-amber-500/25 transition-all hover:bg-amber-400 hover:shadow-amber-500/40 disabled:opacity-30 disabled:cursor-not-allowed;
}
.btn-sm {
  @apply rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:bg-amber-400;
}
.q-btn {
  @apply rounded-xl border-2 border-slate-600 bg-slate-800 px-5 py-3 font-bold text-white transition-all hover:border-amber-400 hover:text-amber-300;
}
.calc-key {
  @apply rounded-xl bg-slate-700 py-4 text-xl font-bold transition-all hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-slate-700;
}
/* Plate transitions */
.plate-enter-active { transition: all 0.3s ease-out; }
.plate-enter-from { opacity: 0; transform: translateY(-20px); }
.plate-leave-active { transition: all 0.3s ease-in; }
.plate-leave-to { opacity: 0; transform: translateY(-20px) scale(0.8); }
/* Replay stack */
.replay-stack-enter-active { transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.replay-stack-enter-from { opacity: 0; transform: translateY(-40px) scale(0.6); }
.replay-stack-leave-active { transition: all 0.4s cubic-bezier(0.55, 0, 1, 0.45); }
.replay-stack-leave-to { opacity: 0; transform: translateY(-30px) scale(0.8); }
/* Pop output */
.pop-out-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-out-enter-from { opacity: 0; transform: scale(0); }
/* Life stack */
.life-stack-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.life-stack-enter-from { opacity: 0; transform: translateY(-20px) scale(0.8); }
.life-stack-leave-active { transition: all 0.4s ease-in; }
.life-stack-leave-to { opacity: 0; transform: translateY(-30px) scale(0.6); }
@keyframes popFloat {
  0% { opacity: 0; transform: translateY(20px) scale(0.8); }
  50% { transform: translateY(-5px) scale(1.05); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.life-pop-float { animation: popFloat 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
/* Quiz stack */
.quiz-stack-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.quiz-stack-enter-from { opacity: 0; transform: translateY(-30px) scale(0.7); }
.quiz-stack-leave-active { transition: all 0.3s cubic-bezier(0.55, 0, 1, 0.45); }
.quiz-stack-leave-to { opacity: 0; transform: translateY(-25px) scale(0.8); }
/* Quiz result */
.quiz-result-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.quiz-result-enter-from { opacity: 0; transform: scale(0) rotate(-10deg); }
@keyframes celebratePop {
  0% { opacity: 0; transform: scale(0.5); }
  50% { transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}
.quiz-celebrate { animation: celebratePop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
/* Array item transitions */
.arr-item-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.arr-item-enter-from { opacity: 0; transform: scale(0) rotate(-15deg); }
.arr-item-leave-active { transition: all 0.3s cubic-bezier(0.55, 0, 1, 0.45); position: absolute; }
.arr-item-leave-to { opacity: 0; transform: scale(0.5) translateY(-20px); }
.arr-item-move { transition: transform 0.4s ease; }
/* Calc-array item transitions */
.ca-item-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.ca-item-enter-from { opacity: 0; transform: scale(0) rotate(-15deg); }
.ca-item-leave-active { transition: all 0.3s cubic-bezier(0.55, 0, 1, 0.45); }
.ca-item-leave-to { opacity: 0; transform: scale(0.5) translateY(-20px); }
.ca-item-move { transition: transform 0.4s ease; }
</style>
