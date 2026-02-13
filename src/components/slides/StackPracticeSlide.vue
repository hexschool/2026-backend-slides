<script setup lang="ts">
/**
 * Stack 實戰練習 — 多鄰國風格 CodePen
 * 7 關漸進式練習：push → pop → 瀏覽器 → Figma Undo → Undo 修正 → 計算 → 完整計算機
 * 學生必須親手寫出正確的 JavaScript 才能過關
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import CodeEditor from '../shared/CodeEditor.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

// ============================================================
// Types
// ============================================================

interface TestCase {
  label: string
  check: (r: any) => boolean
  failMsg: (r: any) => string
}

interface Level {
  id: number
  title: string
  subtitle: string
  task: string
  template: string
  testCases: TestCase[]
  hints: [string, string, string]
  completionMsg: string
  completionExpression: string
  stackKey: string | null // null = result itself is the array
  forbiddenPatterns?: string[]
}

interface LevelProgress {
  passed: boolean
  stars: 1 | 2 | 3
  hintsUsed: number
  code: string
}

// ============================================================
// Level Data
// ============================================================

const levels: Level[] = [
  // L1: push() 入門
  {
    id: 0,
    title: '關卡 1：建造 Stack',
    subtitle: 'push() 入門',
    task: '你有一個空 Stack。\n請用 push() 把三個數字依序放進去，讓 Stack 變成 [10, 20, 30]。',
    template: `const stack = [];

// ✏️ 用 stack.push() 把 10, 20, 30 放進去


// 🚫 不要修改這行
return stack;`,
    testCases: [
      { label: 'stack 是陣列', check: (r) => Array.isArray(r), failMsg: (r) => `stack 不是陣列，而是 ${typeof r}` },
      { label: 'stack.length === 3', check: (r) => r?.length === 3, failMsg: (r) => `stack 長度應為 3，你的是 ${r?.length}` },
      { label: 'stack[0] === 10', check: (r) => r?.[0] === 10, failMsg: (r) => `stack[0] 應為 10，你的是 ${r?.[0]}` },
      { label: 'stack[1] === 20', check: (r) => r?.[1] === 20, failMsg: (r) => `stack[1] 應為 20，你的是 ${r?.[1]}` },
      { label: 'stack[2] === 30', check: (r) => r?.[2] === 30, failMsg: (r) => `stack[2] 應為 30，你的是 ${r?.[2]}` },
    ],
    hints: [
      'push() 可以把東西加到陣列的最後面。試試 stack.push(10)？',
      '你需要呼叫三次 push()，每次放一個數字進去。',
      'stack.push(10); stack.push(20); stack.push(30); ——但先自己試試看，順序很重要。',
    ],
    completionMsg: '做得好！push() 就是 Stack 的「放入」動作。你剛剛建了第一個 Stack，就像在健身房完成第一組深蹲一樣——基礎中的基礎，但一切都從這裡開始。',
    completionExpression: 'normal',
    stackKey: null,
  },
  // L2: pop() 回傳值
  {
    id: 1,
    title: '關卡 2：拆解 Stack',
    subtitle: 'pop() 與回傳值',
    task: "Stack 裡有 ['🍎', '🍌', '🍇']。\n請用 pop() 把最後一個水果拿出來，存到變數 fruit 裡。",
    template: `const stack = ['🍎', '🍌', '🍇'];

// ✏️ 用 pop() 把最後一個水果拿出來，存到 fruit
const fruit = ___

// 🚫 不要修改這行
return { stack, fruit };`,
    testCases: [
      { label: "fruit === '🍇'", check: (r) => r?.fruit === '🍇', failMsg: (r) => `fruit 應為 '🍇'，你的是 ${JSON.stringify(r?.fruit)}` },
      { label: 'stack.length === 2', check: (r) => r?.stack?.length === 2, failMsg: (r) => `stack 長度應為 2，你的是 ${r?.stack?.length}` },
      { label: "stack 不再包含 '🍇'", check: (r) => !r?.stack?.includes('🍇'), failMsg: () => "stack 裡面還有 '🍇'" },
    ],
    hints: [
      'pop() 會拿出最後一個元素。但它不只是刪掉——它會把值「交給你」。',
      '試試看：const fruit = stack.pop(); ——pop() 的回傳值就是被拿出來的東西。',
      "把 ___ 替換成 stack.pop()。pop() 回傳 '🍇'，同時 stack 變成 ['🍎', '🍌']。",
    ],
    completionMsg: "你發現了嗎？pop() 不只是「刪掉」，它會把值交給你。這個特性超重要——計算機、瀏覽器歷史紀錄、Undo 功能，全都靠它。",
    completionExpression: 'normal',
    stackKey: 'stack',
  },
  // L3: 瀏覽器歷史紀錄
  {
    id: 2,
    title: '關卡 3：瀏覽器歷史紀錄',
    subtitle: '用 Stack 記住你去過哪裡',
    task: "你正在寫一個瀏覽器的「歷史紀錄」功能。\n使用者依序造訪了三個網站，請用 push() 記錄下來。\n然後使用者按了「上一頁」，請用 pop() 回到前一個頁面，並把目前所在的頁面存到 currentPage。",
    template: `const history = [];

// ✏️ 使用者造訪了三個網站（依序 push 進去）
// 'google.com' → 'youtube.com' → 'github.com'


// ✏️ 使用者按了「上一頁」
// pop 掉目前的頁面，然後 currentPage = 現在 history 最上面的那個
const removed = ___
const currentPage = history[history.length - 1];

// 🚫 不要修改這行
return { history, removed, currentPage };`,
    testCases: [
      { label: "removed === 'github.com'", check: (r) => r?.removed === 'github.com', failMsg: (r) => `removed 應為 'github.com'，你的是 ${JSON.stringify(r?.removed)}` },
      { label: "currentPage === 'youtube.com'", check: (r) => r?.currentPage === 'youtube.com', failMsg: (r) => `currentPage 應為 'youtube.com'，你的是 ${JSON.stringify(r?.currentPage)}` },
      { label: 'history.length === 2', check: (r) => r?.history?.length === 2, failMsg: (r) => `history 長度應為 2，你的是 ${r?.history?.length}` },
      {
        label: "history 為 ['google.com', 'youtube.com']",
        check: (r) => r?.history?.[0] === 'google.com' && r?.history?.[1] === 'youtube.com',
        failMsg: (r) => `history 應為 ['google.com', 'youtube.com']，你的是 [${r?.history?.map((s: string) => `'${s}'`).join(', ')}]`,
      },
    ],
    hints: [
      '每造訪一個網站就 push 進 history。上一頁 = Pop 掉目前的，剩下的最上面就是你要回去的頁面。',
      "先 push 三個網址：history.push('google.com') ... 然後 const removed = history.pop()。",
      "Push 三次，Pop 一次。removed 存的是被 Pop 掉的 'github.com'，history 最後一個就是 'youtube.com'。",
    ],
    completionMsg: "你剛才寫的就是瀏覽器「上一頁」按鈕的核心邏輯。Chrome、Safari、Firefox——背後都是用 Stack 在記錄你的瀏覽歷史。每造訪一頁就 Push，按上一頁就 Pop。",
    completionExpression: 'normal',
    stackKey: 'history',
  },
  // L4: Figma 連續 Undo（發現 LIFO）
  {
    id: 3,
    title: '關卡 4：Figma 連續 Undo',
    subtitle: '發現 LIFO 順序',
    task: "你正在寫 Figma 的 Undo 功能。\n設計師做了三個操作，請記錄下來。\n然後按了兩次 Ctrl+Z，觀察還原的順序。",
    template: `const undoStack = [];

// ✏️ 設計師依序做了三個操作（push 進 undoStack）
// '畫矩形' → '改顏色' → '移動位置'


// ✏️ 設計師按了兩次 Ctrl+Z（每次 Undo = 一次 Pop）
const undone1 = ___
const undone2 = ___

// 🚫 不要修改這行
return { undoStack, undone1, undone2 };`,
    testCases: [
      { label: "undone1 === '移動位置'", check: (r) => r?.undone1 === '移動位置', failMsg: (r) => `undone1 應為 '移動位置'，你的是 ${JSON.stringify(r?.undone1)}` },
      { label: "undone2 === '改顏色'", check: (r) => r?.undone2 === '改顏色', failMsg: (r) => `undone2 應為 '改顏色'，你的是 ${JSON.stringify(r?.undone2)}` },
      { label: 'undoStack.length === 1', check: (r) => r?.undoStack?.length === 1, failMsg: (r) => `undoStack 長度應為 1，你的是 ${r?.undoStack?.length}` },
      { label: "undoStack[0] === '畫矩形'", check: (r) => r?.undoStack?.[0] === '畫矩形', failMsg: (r) => `undoStack[0] 應為 '畫矩形'，你的是 ${JSON.stringify(r?.undoStack?.[0])}` },
    ],
    hints: [
      '兩次 Undo = 兩次 Pop。注意觀察：先被還原的是哪個操作？跟你 Push 的順序一樣嗎？',
      "最後 Push 的 '移動位置' 會最先被 Pop 出來——這就是 LIFO。第二次 Pop 拿到的是 '改顏色'。",
      "const undone1 = undoStack.pop(); 拿到 '移動位置'，再 const undone2 = undoStack.pop(); 拿到 '改顏色'。",
    ],
    completionMsg: "你有沒有注意到？先還原的是「移動位置」，不是「畫矩形」。Pop 的順序永遠跟 Push 相反——這就是 LIFO，Last In First Out。Figma、Photoshop、VS Code，所有 Ctrl+Z 背後都是這個規律。",
    completionExpression: 'normal',
    stackKey: 'undoStack',
  },
  // L5: Undo 修正
  {
    id: 4,
    title: '關卡 5：Undo 修正',
    subtitle: 'Pop 錯的，Push 對的',
    task: "你在計算機上按了 3、+、7，但 7 按錯了！\n請用 pop() 還原最後一步，然後 push() 正確的 5。",
    template: `const stack = ['3', '+', '7']; // 7 按錯了！

// ✏️ 第一步：還原錯誤的 7


// ✏️ 第二步：放入正確的 5


// 🚫 不要修改這行
return stack;`,
    testCases: [
      { label: 'stack.length === 3', check: (r) => r?.length === 3, failMsg: (r) => `stack 長度應為 3，你的是 ${r?.length}` },
      { label: "stack 不包含 '7'", check: (r) => !r?.includes('7'), failMsg: () => "stack 裡面還有 '7'" },
      { label: "stack[2] === '5'", check: (r) => r?.[2] === '5', failMsg: (r) => `stack[2] 應為 '5'，你的是 ${JSON.stringify(r?.[2])}` },
      {
        label: "stack 為 ['3', '+', '5']",
        check: (r) => r?.[0] === '3' && r?.[1] === '+' && r?.[2] === '5',
        failMsg: (r) => `stack 應為 ['3', '+', '5']，你的是 [${r?.map((s: string) => `'${s}'`).join(', ')}]`,
      },
    ],
    hints: [
      "跟 Figma 的 Undo 一樣——先 Pop 拿掉錯的，再 Push 放入對的。",
      "stack.pop() 會拿掉 '7'。然後再 stack.push('5') 放入正確的值。",
      "兩步驟：stack.pop(); 然後 stack.push('5');",
    ],
    completionMsg: "Pop 拿掉錯的，Push 放入對的。這就是所有「Undo + 修正」的核心邏輯。你在瀏覽器、Figma、計算機裡看到的都是同一招。",
    completionExpression: 'normal',
    stackKey: null,
  },
  // L6: 計算
  {
    id: 5,
    title: '關卡 6：用 Stack 計算',
    subtitle: 'Pop 出來算數學',
    task: "Stack 裡存了一個算式 ['3', '+', '5']。\n請 Pop 三次，取出 b、op、a，然後算出結果存到 result。",
    template: `const stack = ['3', '+', '5'];

// ✏️ Pop 三次，把值存到變數裡
const b = ___
const op = ___
const a = ___

// ✏️ 算出結果（提示：要把字串轉成數字才能算）
const result = ___

// 🚫 不要修改這行
return { a, op, b, result, stack };`,
    testCases: [
      { label: "b === '5'", check: (r) => r?.b === '5', failMsg: (r) => `b 應為 '5'，你的是 ${JSON.stringify(r?.b)}` },
      { label: "op === '+'", check: (r) => r?.op === '+', failMsg: (r) => `op 應為 '+'，你的是 ${JSON.stringify(r?.op)}` },
      { label: "a === '3'", check: (r) => r?.a === '3', failMsg: (r) => `a 應為 '3'，你的是 ${JSON.stringify(r?.a)}` },
      { label: 'result === 8', check: (r) => r?.result === 8, failMsg: (r) => `result 應為 8，你的是 ${JSON.stringify(r?.result)}` },
      { label: 'stack.length === 0', check: (r) => r?.stack?.length === 0, failMsg: (r) => `stack 應該清空（length === 0），你的是 ${r?.stack?.length}` },
    ],
    hints: [
      "Pop 的順序是 LIFO：最後放入的 '5' 會最先被拿出來。",
      "const b = stack.pop(); 拿出 '5'，const op = stack.pop(); 拿出 '+'，再 Pop 一次拿出 '3'。",
      "result 要算數學：Number(a) + Number(b) 可以把字串 '3' 和 '5' 轉成數字 3 和 5 再相加。",
    ],
    completionMsg: "你剛才完成的就是計算機按 = 後的完整流程：Pop 出值 → 存到變數 → 計算 → 得到結果。真正的計算器引擎就是這樣運作的。",
    completionExpression: 'normal',
    stackKey: 'stack',
    forbiddenPatterns: ['.reverse()'],
  },
  // L7: 完整計算機
  {
    id: 6,
    title: '關卡 7：完整計算機',
    subtitle: '把所有技能組合起來',
    task: "模擬一個完整的計算機流程：\n使用者按了 8、-、3、=。\n請寫出完整邏輯：Push 每個按鍵 → Pop 取值 → 計算結果 → Push 回 Stack。",
    template: `const stack = [];

// ✏️ 第一步：模擬使用者按下 8, -, 3（Push 進 Stack）


// ✏️ 第二步：使用者按了 =，Pop 三次取出 b, op, a


// ✏️ 第三步：根據 op 計算結果（要轉數字！）


// ✏️ 第四步：把結果 Push 回 Stack


// 🚫 不要修改這行
return { a, op, b, result, stack };`,
    testCases: [
      { label: "a === '8'", check: (r) => r?.a === '8', failMsg: (r) => `a 應為 '8'，你的是 ${JSON.stringify(r?.a)}` },
      { label: "op === '-'", check: (r) => r?.op === '-', failMsg: (r) => `op 應為 '-'，你的是 ${JSON.stringify(r?.op)}` },
      { label: "b === '3'", check: (r) => r?.b === '3', failMsg: (r) => `b 應為 '3'，你的是 ${JSON.stringify(r?.b)}` },
      { label: 'result === 5', check: (r) => r?.result === 5, failMsg: (r) => `result 應為 5，你的是 ${JSON.stringify(r?.result)}` },
      { label: 'stack.length === 1', check: (r) => r?.stack?.length === 1, failMsg: (r) => `stack 長度應為 1，你的是 ${r?.stack?.length}` },
      { label: 'stack[0] === 5', check: (r) => r?.stack?.[0] === 5, failMsg: (r) => `stack[0] 應為 5，你的是 ${JSON.stringify(r?.stack?.[0])}` },
    ],
    hints: [
      "還記得簡報裡的流程嗎？先 Push 三個值，按 = 後 Pop 出來算。跟上一關很像，但這次要自己從頭寫。",
      "第一步：stack.push('8'); stack.push('-'); stack.push('3');。第二步跟上一關一樣 Pop 三次。",
      "計算的部分：op === '-' 所以 result = Number(a) - Number(b)。最後 stack.push(result) 把結果放回去。",
    ],
    completionMsg: "你剛才從零寫出了一台計算機的核心引擎。Push 記錄按鍵、Pop 取出運算、計算結果、Push 回去——這就是 Stack 在真實世界最經典的應用之一。從第一關的 push() 到現在，你已經可以用 Stack 解決真正的問題了。慢慢成長，才是比較快的。",
    completionExpression: 'normal',
    stackKey: 'stack',
    forbiddenPatterns: ['.reverse()'],
  },
]

// ============================================================
// State
// ============================================================

const currentLevel = ref(0)
const code = ref('')
const hintLevel = ref(0)
const hintGlow = ref(false)
let hintTimer: ReturnType<typeof setTimeout> | null = null

const hasRun = ref(false)
const runError = ref('')
const testResults = ref<{ label: string; passed: boolean; msg: string }[]>([])
const allPassed = ref(false)
const resultStack = ref<unknown[]>([])

const showDebrief = ref(false)
let debriefTimer: ReturnType<typeof setTimeout> | null = null
const showFinalScreen = ref(false)

// Per-level progress
const progress = ref<Record<number, LevelProgress>>({})
const totalRunCount = ref(0)

// ============================================================
// Computed
// ============================================================

const level = computed(() => levels[currentLevel.value])

const currentStars = computed((): 1 | 2 | 3 => {
  if (hintLevel.value === 0) return 3
  if (hintLevel.value === 1) return 2
  return 1
})

const canGoNext = computed(() => {
  return !!progress.value[currentLevel.value]?.passed
})

const allLevelsPassed = computed(() => {
  return levels.every((_, i) => progress.value[i]?.passed)
})

// ============================================================
// Methods
// ============================================================

function initLevel() {
  const saved = progress.value[currentLevel.value]
  code.value = saved?.code || level.value.template
  hintLevel.value = 0
  hintGlow.value = false
  hasRun.value = false
  runError.value = ''
  testResults.value = []
  allPassed.value = false
  resultStack.value = []
  showDebrief.value = false
  if (debriefTimer) { clearTimeout(debriefTimer); debriefTimer = null }
  startHintTimer()
}

function startHintTimer() {
  clearHintTimer()
  hintTimer = setTimeout(() => {
    if (hintLevel.value < 3) hintGlow.value = true
  }, 10000)
}

function clearHintTimer() {
  if (hintTimer) {
    clearTimeout(hintTimer)
    hintTimer = null
  }
}

function showNextHint() {
  if (hintLevel.value >= 3) return
  hintLevel.value++
  hintGlow.value = false
  if (hintLevel.value < 3) startHintTimer()
}

function runCode() {
  hasRun.value = true
  runError.value = ''
  testResults.value = []
  allPassed.value = false
  resultStack.value = []
  totalRunCount.value++

  const src = code.value

  // Check ___ placeholder
  if (src.includes('___')) {
    runError.value = '程式碼中還有 ___ 沒有填寫完喔！請把 ___ 替換成你的程式碼。'
    if (!hintGlow.value && hintLevel.value < 3) hintGlow.value = true
    return
  }

  // Check forbidden patterns
  if (level.value.forbiddenPatterns) {
    for (const pat of level.value.forbiddenPatterns) {
      if (src.includes(pat)) {
        runError.value = `這題不能用 ${pat} 喔！試試用 Stack 的方式。`
        return
      }
    }
  }

  // Execute
  let result: unknown
  try {
    const fn = new Function(src)
    result = fn()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    runError.value = `執行錯誤：${msg}`
    if (!hintGlow.value && hintLevel.value < 3) hintGlow.value = true
    return
  }

  // Extract stack for visualization
  const key = level.value.stackKey
  const stackArr = key ? (result as Record<string, unknown>)?.[key] : result
  if (Array.isArray(stackArr)) resultStack.value = stackArr

  // Run test cases
  const results: typeof testResults.value = []
  let passed = true
  for (const tc of level.value.testCases) {
    let ok = false
    let msg = ''
    try {
      ok = tc.check(result)
      if (!ok) msg = tc.failMsg(result)
    } catch {
      ok = false
      msg = '無法驗證（執行結果格式不正確）'
    }
    results.push({ label: tc.label, passed: ok, msg })
    if (!ok) passed = false
  }
  testResults.value = results
  allPassed.value = passed

  if (passed) {
    const stars = currentStars.value
    const existing = progress.value[currentLevel.value]
    if (!existing || !existing.passed || stars > existing.stars) {
      progress.value[currentLevel.value] = {
        passed: true,
        stars,
        hintsUsed: hintLevel.value,
        code: code.value,
      }
    }
    saveProgress()
  } else {
    // Trigger hint glow on failure
    if (!hintGlow.value && hintLevel.value < 3) hintGlow.value = true
  }
}

function goToLevel(idx: number) {
  if (idx < 0 || idx >= levels.length) return
  // Save current code
  if (progress.value[currentLevel.value]) {
    progress.value[currentLevel.value].code = code.value
  }
  currentLevel.value = idx
  initLevel()
}

function nextLevel() {
  if (currentLevel.value < levels.length - 1) {
    goToLevel(currentLevel.value + 1)
  } else if (allLevelsPassed.value) {
    showFinalScreen.value = true
  }
}

function prevLevel() {
  if (currentLevel.value > 0) goToLevel(currentLevel.value - 1)
}

function resetAll() {
  localStorage.removeItem('stack-practice-progress')
  progress.value = {}
  totalRunCount.value = 0
  currentLevel.value = 0
  showFinalScreen.value = false
  initLevel()
}

// ============================================================
// localStorage
// ============================================================

const STORAGE_KEY = 'stack-practice-progress'

function saveProgress() {
  try {
    const data = {
      currentLevel: currentLevel.value,
      levels: progress.value,
      totalRunCount: totalRunCount.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const data = JSON.parse(raw)
    if (data.levels) progress.value = data.levels
    if (typeof data.currentLevel === 'number') currentLevel.value = data.currentLevel
    if (typeof data.totalRunCount === 'number') totalRunCount.value = data.totalRunCount
  } catch { /* ignore */ }
}

// ============================================================
// Lifecycle
// ============================================================

onMounted(() => {
  loadProgress()
  if (allLevelsPassed.value) {
    showFinalScreen.value = true
  } else {
    initLevel()
  }
})

onUnmounted(() => {
  clearHintTimer()
  if (debriefTimer) clearTimeout(debriefTimer)
})

// Save code on level change
watch(currentLevel, () => {
  saveProgress()
})
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden bg-slate-950">
    <!-- Header -->
    <div class="relative z-20 border-b border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur-xl md:px-6 md:py-4">
      <div class="flex items-center justify-between">
        <h1 class="flex items-center gap-2 text-lg font-bold md:text-xl">
          <span class="text-2xl">🏋️</span>
          <span class="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Stack 實戰練習</span>
        </h1>
        <div class="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-400 md:text-sm">
          {{ currentLevel + 1 }} / {{ levels.length }}
        </div>
      </div>
      <!-- Progress dots -->
      <div class="mt-2 flex gap-1.5">
        <button
          v-for="(l, i) in levels"
          :key="l.id"
          class="h-2 rounded-full transition-all duration-300"
          :class="[
            i === currentLevel ? 'w-8 bg-amber-400' :
            progress[i]?.passed ? 'w-2 bg-emerald-400/70 hover:bg-emerald-400' :
            'w-2 bg-slate-600',
            i <= currentLevel || progress[i]?.passed ? 'cursor-pointer' : 'cursor-default',
          ]"
          :title="l.subtitle"
          @click="(i <= currentLevel || progress[i]?.passed) && goToLevel(i)"
        />
      </div>
    </div>

    <!-- Main content -->
    <div class="relative flex min-h-0 flex-1 flex-col overflow-y-auto">

      <!-- ==================== 最終完成畫面 ==================== -->
      <div v-if="showFinalScreen" class="flex flex-1 items-center justify-center p-4">
        <div class="mx-auto max-w-lg text-center">
          <div class="text-5xl">🎉</div>
          <h2 class="mt-4 text-2xl font-bold text-white">Stack 實戰練習 — 全部通關！</h2>

          <!-- Stars per level -->
          <div class="mt-6 grid grid-cols-7 gap-2">
            <div v-for="(l, i) in levels" :key="l.id" class="text-center">
              <div class="text-lg">{{ '⭐'.repeat(progress[i]?.stars ?? 0) }}</div>
              <div class="mt-1 text-xs text-slate-500">L{{ i + 1 }}</div>
            </div>
          </div>

          <!-- Stats -->
          <div class="mx-auto mt-6 max-w-xs rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-left text-sm text-slate-300">
            <div>📊 總執行次數：{{ totalRunCount }} 次</div>
            <div class="mt-1">💡 使用提示：{{ Object.values(progress).reduce((s, p) => s + (p.hintsUsed || 0), 0) }} 次</div>
          </div>

          <!-- Coach message -->
          <div class="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-left">
            <img src="/images/coach/proud.png" alt="海姐" class="h-16 w-16 shrink-0 rounded-full object-cover" />
            <p class="text-sm leading-relaxed text-slate-200">
              你不只是「看懂」Stack，你是真的「會用」Stack。
              從 push/pop 基礎，到瀏覽器歷史、Figma Undo、計算機引擎——
              全都是你自己一行一行打出來的。
              準備好了，作業的迷你計算機在等你。你一定沒問題。
            </p>
          </div>

          <div class="mt-6 flex justify-center gap-3">
            <button
              class="rounded-xl border border-slate-600 bg-slate-800 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-700"
              @click="resetAll"
            >
              重新挑戰
            </button>
            <button
              class="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
              @click="emit('complete')"
            >
              完成學習
            </button>
          </div>
        </div>
      </div>

      <!-- ==================== 講解頁（答對後自動切入） ==================== -->
      <div v-else-if="showDebrief" class="flex flex-1 items-center justify-center p-4">
        <div class="mx-auto w-full max-w-md">
          <!-- Stars -->
          <div class="text-center text-4xl">
            {{ '⭐'.repeat(currentStars) }}{{ '☆'.repeat(3 - currentStars) }}
          </div>

          <!-- Coach -->
          <div class="mt-6 flex items-start gap-4 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-slate-800/50 p-5">
            <img
              :src="`/images/coach/${level.completionExpression}.png`"
              alt="海姐"
              class="h-14 w-14 shrink-0 rounded-full object-cover"
            />
            <p class="text-base leading-relaxed text-slate-200 md:text-lg">
              {{ level.completionMsg }}
            </p>
          </div>

          <!-- Action -->
          <div class="mt-6 flex justify-center">
            <button
              v-if="currentLevel < levels.length - 1"
              class="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40"
              @click="nextLevel()"
            >
              下一關 →
            </button>
            <button
              v-else
              class="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
              @click="showFinalScreen = true"
            >
              看成績
            </button>
          </div>
        </div>
      </div>

      <!-- ==================== 關卡內容 ==================== -->
      <div v-else class="mx-auto w-full max-w-3xl space-y-4 p-4 pb-8 md:p-6">
        <!-- Task description -->
        <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <div class="flex items-baseline gap-2">
            <h3 class="font-bold text-white">{{ level.title }}</h3>
            <span class="text-xs text-slate-500">{{ level.subtitle }}</span>
          </div>
          <p class="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-300">{{ level.task }}</p>
        </div>

        <!-- Code editor -->
        <div class="overflow-hidden rounded-xl border border-slate-700">
          <CodeEditor v-model="code" />
        </div>

        <!-- Buttons row -->
        <div class="flex items-center justify-between">
          <!-- Hint button -->
          <button
            v-if="hintLevel < 3"
            class="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all"
            :class="hintGlow
              ? 'animate-pulse border-amber-500/50 bg-amber-500/10 text-amber-400 shadow-lg shadow-amber-500/20'
              : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'"
            @click="showNextHint"
          >
            💡 提示 ({{ hintLevel }}/3)
          </button>
          <div v-else class="text-xs text-slate-600">💡 3/3 提示已全部展開</div>

          <!-- Run button -->
          <button
            class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
            @click="runCode"
          >
            <span>▶</span> 執行
          </button>
        </div>

        <!-- Hints -->
        <TransitionGroup name="hint" tag="div" class="space-y-2">
          <div
            v-for="i in hintLevel"
            :key="i"
            class="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-200"
          >
            <span class="font-bold text-amber-400">💡 提示 {{ i }}/3：</span>{{ level.hints[i - 1] }}
          </div>
        </TransitionGroup>

        <!-- Error message -->
        <div
          v-if="hasRun && runError"
          class="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          ❌ {{ runError }}
        </div>

        <!-- Results (after successful execution) -->
        <div v-if="hasRun && !runError" class="space-y-4">
          <!-- Stack visualization -->
          <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <h4 class="mb-3 text-sm font-bold text-slate-400">你的 Stack</h4>
            <div v-if="resultStack.length === 0" class="text-center text-sm text-slate-600">
              [ 空 ]
            </div>
            <div v-else class="flex flex-wrap items-end gap-2">
              <TransitionGroup name="stack-block">
                <div
                  v-for="(item, idx) in resultStack"
                  :key="`s-${idx}-${item}`"
                  class="flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg border border-amber-500/30 bg-gradient-to-b from-amber-500/20 to-amber-600/10 px-3 text-sm font-bold text-amber-300"
                >
                  {{ item }}
                </div>
              </TransitionGroup>
            </div>
            <div v-if="resultStack.length > 0" class="mt-2 flex gap-2 text-xs text-slate-600">
              <span>← 底部 (index 0)</span>
              <span class="flex-1"></span>
              <span>頂部 (index {{ resultStack.length - 1 }}) →</span>
            </div>
          </div>

          <!-- Test cases -->
          <div class="rounded-xl border p-4" :class="allPassed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-700 bg-slate-800/50'">
            <h4 class="mb-3 text-sm font-bold" :class="allPassed ? 'text-emerald-400' : 'text-slate-400'">
              {{ allPassed ? '全部通過！' : '測試案例' }}
            </h4>
            <div class="space-y-2">
              <div
                v-for="(test, idx) in testResults"
                :key="idx"
                class="text-sm"
                :class="test.passed ? 'text-emerald-400' : 'text-red-400'"
              >
                <span>{{ test.passed ? '✅' : '❌' }} {{ test.label }}</span>
                <span v-if="!test.passed && test.msg" class="ml-2 text-xs text-red-400/70">
                  — {{ test.msg }}
                </span>
              </div>
            </div>
          </div>

          <!-- 通過後：手動進入講解 -->
          <button
            v-if="allPassed && !showDebrief"
            class="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
            @click="showDebrief = true"
          >
            看講解 →
          </button>

        </div>
      </div>
    </div>

    <!-- Footer Controls -->
    <div class="relative z-20 border-t border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur-xl md:px-6 md:py-4">
      <div v-if="!showFinalScreen" class="flex items-center justify-between">
        <button
          :disabled="currentLevel === 0"
          class="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          @click="prevLevel"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          <span class="hidden md:inline">上一關</span>
        </button>

        <!-- Level stars (desktop) -->
        <div class="hidden gap-3 md:flex">
          <div
            v-for="(l, i) in levels"
            :key="l.id"
            class="text-center"
            :class="i === currentLevel ? 'opacity-100' : 'opacity-40'"
          >
            <div class="text-xs">{{ progress[i]?.passed ? '⭐'.repeat(progress[i].stars) : '○' }}</div>
          </div>
        </div>

        <button
          :disabled="!canGoNext"
          class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          :class="canGoNext ? 'shadow-amber-500/25 hover:shadow-amber-500/40' : ''"
          @click="nextLevel"
        >
          <span>{{ currentLevel === levels.length - 1 ? '完成' : '下一關' }}</span>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fade transition */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Hint transition */
.hint-enter-active { transition: all 0.3s ease; }
.hint-enter-from { opacity: 0; transform: translateY(-8px); }

/* Stack block transition */
.stack-block-enter-active { transition: all 0.3s ease; }
.stack-block-enter-from { opacity: 0; transform: scale(0.8); }
.stack-block-leave-active { transition: all 0.2s ease; }
.stack-block-leave-to { opacity: 0; transform: scale(0.8); }

</style>
