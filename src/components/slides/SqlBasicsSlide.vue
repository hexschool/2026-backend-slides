<script setup lang="ts">
/**
 * SQL 語法基礎教學簡報
 * 用簡單易懂的方式教導 SQL 六大關鍵字：
 * - SELECT / FROM / WHERE（查詢三兄弟）
 * - INSERT / UPDATE / DELETE（資料操作三劍客）
 *
 * 使用 LiveFit 情境，讓學生理解每個語法的用途
 */
import { ref, computed, watch, onMounted } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{
  isMobile?: boolean
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

// === 資料定義 ===
type StepView =
  | 'intro'
  | 'select_intro' | 'select_demo' | 'select_star'
  | 'from_intro' | 'from_demo'
  | 'where_intro' | 'where_demo' | 'where_operators'
  | 'query_combo'
  | 'insert_intro' | 'insert_demo'
  | 'update_intro' | 'update_demo' | 'update_danger'
  | 'delete_intro' | 'delete_demo' | 'delete_danger'
  | 'review'
  | 'summary'

type Step = {
  id: number
  view: StepView
  title: string
  desc: string
}

const STEPS: Step[] = [
  // === 開場 ===
  { id: 1, view: 'intro', title: 'SQL 語法六大天王', desc: '今天要教你 6 個最重要的 SQL 關鍵字，學會它們就能跟資料庫對話了！' },

  // === 查詢三兄弟：SELECT / FROM / WHERE ===
  { id: 2, view: 'select_intro', title: 'SELECT：我要看什麼？', desc: 'SELECT 就像點菜單：「老闆，我要看名字和價格！」告訴資料庫你想看哪些欄位。' },
  { id: 3, view: 'select_demo', title: 'SELECT 實際操作', desc: '看看 SELECT 怎麼選擇欄位。點擊欄位試試看！' },
  { id: 4, view: 'select_star', title: 'SELECT *：全部都要！', desc: '星號 * 代表「全部欄位都要」，就像說「老闆，菜單上的全部給我！」' },

  { id: 5, view: 'from_intro', title: 'FROM：去哪張表找？', desc: 'FROM 告訴資料庫要去哪張表找資料，就像告訴服務生「我要看主菜的菜單」。' },
  { id: 6, view: 'from_demo', title: 'FROM 實際操作', desc: '不同的表有不同的資料。看看切換 FROM 會發生什麼事！' },

  { id: 7, view: 'where_intro', title: 'WHERE：加上條件篩選', desc: 'WHERE 是過濾器：「只給我價格超過 100 的」。沒有 WHERE 就會撈出全部資料。' },
  { id: 8, view: 'where_demo', title: 'WHERE 實際操作', desc: '看看加上 WHERE 條件後，資料怎麼被篩選出來。' },
  { id: 9, view: 'where_operators', title: 'WHERE 的比較符號', desc: '除了等於，還有大於、小於、不等於等符號可以用！' },

  { id: 10, view: 'query_combo', title: '查詢三兄弟合體！', desc: 'SELECT + FROM + WHERE 組合起來，就是完整的查詢語法！順序不能亂喔！' },

  // === 資料操作三劍客：INSERT / UPDATE / DELETE ===
  { id: 11, view: 'insert_intro', title: 'INSERT：新增資料', desc: 'INSERT 就是「把新資料塞進表裡」，像是在筆記本上新增一行。' },
  { id: 12, view: 'insert_demo', title: 'INSERT 實際操作', desc: '看看 INSERT 怎麼新增一筆資料到表裡。' },

  { id: 13, view: 'update_intro', title: 'UPDATE：修改資料', desc: 'UPDATE 是「把舊的改成新的」，像是用立可白塗掉重寫。' },
  { id: 14, view: 'update_demo', title: 'UPDATE 實際操作', desc: '看看 UPDATE 怎麼修改特定的資料。' },
  { id: 15, view: 'update_danger', title: 'UPDATE 的危險：忘了 WHERE', desc: '如果 UPDATE 沒有加 WHERE，全部資料都會被改掉！超級危險！' },

  { id: 16, view: 'delete_intro', title: 'DELETE：刪除資料', desc: 'DELETE 是「把資料擦掉」，一旦刪除就回不來了！' },
  { id: 17, view: 'delete_demo', title: 'DELETE 實際操作', desc: '看看 DELETE 怎麼刪除特定的資料。' },
  { id: 18, view: 'delete_danger', title: 'DELETE 的危險：忘了 WHERE', desc: '如果 DELETE 沒有加 WHERE，整張表的資料都會消失！' },

  // === 總複習 ===
  { id: 19, view: 'review', title: '📝 總複習時間！', desc: '用 CREDIT_PACKAGE 表來複習 SELECT、WHERE、INSERT、UPDATE、DELETE 五大操作！' },

  // === 總結 ===
  { id: 20, view: 'summary', title: '恭喜你學會了！', desc: '你已經學會 SQL 六大天王了！接下來去練習場實際操作看看吧！' },
]

// === LiveFit 模擬資料 ===
const userData = [
  { id: 1, name: '王小明', email: 'ming@email.com', role: 'user' },
  { id: 2, name: '李燕容', email: 'yan@email.com', role: 'user' },
  { id: 3, name: '小美', email: 'mei@email.com', role: 'coach' },
]

const skillData = [
  { id: 1, name: '重訓' },
  { id: 2, name: '瑜伽' },
  { id: 3, name: '有氧運動' },
]

const creditPackageData = [
  { id: 1, name: '7 堂組合包', credit_amount: 7, price: 1400 },
  { id: 2, name: '14 堂組合包', credit_amount: 14, price: 2520 },
  { id: 3, name: '21 堂組合包', credit_amount: 21, price: 4800 },
]

// === 狀態 ===
const currentStep = ref(0)
const animState = ref(0)

// 互動狀態
const selectedCols = ref<number[]>([])
const activeTable = ref<'USER' | 'SKILL' | 'CREDIT_PACKAGE'>('USER')
const showResult = ref(false)

// SQL 執行動畫狀態
const sqlExecutionState = ref<'idle' | 'executing' | 'arrow' | 'done'>('idle')
const showExecutionResult = ref(false)

// FROM DEMO 的互動狀態
const hasTableSwitched = ref(false)

// 總複習狀態
const reviewStep = ref(0) // 0: SELECT, 1: WHERE, 2: INSERT, 3: UPDATE, 4: DELETE
const reviewCompleted = ref<boolean[]>([false, false, false, false, false])
const reviewSqlState = ref<'idle' | 'executing' | 'arrow' | 'done'>('idle')
const reviewShowResult = ref(false)
// 模擬總複習的表格資料
const reviewTableData = ref([
  { id: 1, name: '7 堂組合包', credit_amount: 7, price: 1400 },
  { id: 2, name: '14 堂組合包', credit_amount: 14, price: 2520 },
  { id: 3, name: '21 堂組合包', credit_amount: 21, price: 4800 },
])

const stepData = computed(() => STEPS[currentStep.value])

// 當前表格資料
const currentTableData = computed(() => {
  switch (activeTable.value) {
    case 'USER': return userData
    case 'SKILL': return skillData
    case 'CREDIT_PACKAGE': return creditPackageData
    default: return userData
  }
})

// 當前表格欄位
const currentTableCols = computed(() => {
  switch (activeTable.value) {
    case 'USER': return ['id', 'name', 'email', 'role']
    case 'SKILL': return ['id', 'name']
    case 'CREDIT_PACKAGE': return ['id', 'name', 'credit_amount', 'price']
    default: return ['id', 'name']
  }
})

onMounted(() => {
  triggerStepAnimation()
})

watch(currentStep, () => {
  animState.value = 0
  selectedCols.value = []
  showResult.value = false
  // 重置 SQL 執行動畫狀態
  sqlExecutionState.value = 'idle'
  showExecutionResult.value = false
  // 重置 FROM DEMO 互動狀態
  hasTableSwitched.value = false
  setTimeout(() => triggerStepAnimation(), 100)
})

function triggerStepAnimation() {
  setTimeout(() => { animState.value = 1 }, 200)
  setTimeout(() => { animState.value = 2 }, 500)
  setTimeout(() => { animState.value = 3 }, 800)
}

function toggleColumn(colIndex: number) {
  if (selectedCols.value.includes(colIndex)) {
    selectedCols.value = selectedCols.value.filter(c => c !== colIndex)
  } else {
    selectedCols.value = [...selectedCols.value, colIndex].sort()
  }
}

function selectAllCols() {
  selectedCols.value = currentTableCols.value.map((_, i) => i)
}

function clearCols() {
  selectedCols.value = []
}

function switchTable(table: 'USER' | 'SKILL' | 'CREDIT_PACKAGE') {
  activeTable.value = table
  selectedCols.value = []
  hasTableSwitched.value = true
}

function nextStep() {
  if (currentStep.value < STEPS.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function handleComplete() {
  emit('complete')
}

// 生成 SQL 語法
const generatedSql = computed(() => {
  if (selectedCols.value.length === 0) {
    return `SELECT * FROM ${activeTable.value}`
  }
  const cols = selectedCols.value.map(i => currentTableCols.value[i])
  if (cols.length === currentTableCols.value.length) {
    return `SELECT * FROM ${activeTable.value}`
  }
  return `SELECT ${cols.join(', ')} FROM ${activeTable.value}`
})

// 判斷是否為需要互動的 DEMO 頁面
const isInteractiveDemoStep = computed(() => {
  return ['from_demo', 'insert_demo', 'update_demo', 'delete_demo'].includes(stepData.value.view)
})

// 判斷是否可以前往下一步
const canGoNext = computed(() => {
  const view = stepData.value.view

  // FROM DEMO：必須切換過表格
  if (view === 'from_demo') {
    return hasTableSwitched.value
  }

  // INSERT/UPDATE/DELETE DEMO：必須執行過 SQL
  if (['insert_demo', 'update_demo', 'delete_demo'].includes(view)) {
    return showExecutionResult.value
  }

  // 總複習：必須完成所有題目
  if (view === 'review') {
    return allReviewCompleted.value
  }

  return true
})

// 下一步按鈕的提示文字
const nextStepHint = computed(() => {
  const view = stepData.value.view

  if (view === 'from_demo' && !hasTableSwitched.value) {
    return '請先點擊切換表格'
  }

  if (['insert_demo', 'update_demo', 'delete_demo'].includes(view) && !showExecutionResult.value) {
    return '請先點擊「執行 SQL」按鈕'
  }

  if (view === 'review' && !allReviewCompleted.value) {
    return '請完成所有複習題目'
  }

  return ''
})

// SQL 執行動畫函數
function executeSql() {
  if (sqlExecutionState.value !== 'idle') return

  // Step 1: SQL 區域發光
  sqlExecutionState.value = 'executing'

  // Step 2: 顯示執行箭頭（600ms 後）
  setTimeout(() => {
    sqlExecutionState.value = 'arrow'
  }, 600)

  // Step 3: 表格更新完成（1200ms 後）
  setTimeout(() => {
    sqlExecutionState.value = 'done'
    showExecutionResult.value = true
  }, 1200)
}

// 重置執行狀態
function resetExecution() {
  sqlExecutionState.value = 'idle'
  showExecutionResult.value = false
}

// === 總複習相關函數 ===
const reviewQuestions = [
  {
    type: 'SELECT',
    title: '查詢所有方案',
    sqlHtml: '<span class="text-purple-400 font-bold">SELECT</span> <span class="text-white">*</span> <span class="text-blue-400 font-bold">FROM</span> <span class="text-white">CREDIT_PACKAGE</span>',
    description: '查看「堂數方案表」裡面有哪些方案',
    color: 'purple',
  },
  {
    type: 'WHERE',
    title: '篩選高價方案',
    sqlHtml: '<span class="text-purple-400 font-bold">SELECT</span> <span class="text-white">*</span> <span class="text-blue-400 font-bold">FROM</span> <span class="text-white">CREDIT_PACKAGE</span> <span class="text-sky-400 font-bold">WHERE</span> <span class="text-white">price</span> <span class="text-rose-400">&gt;</span> <span class="text-emerald-400">2000</span>',
    description: '只找出價格超過 2000 元的方案（過濾掉便宜的）',
    color: 'sky',
  },
  {
    type: 'INSERT',
    title: '新增 28 堂方案',
    sqlHtml: '<span class="text-emerald-400 font-bold">INSERT INTO</span> <span class="text-white">CREDIT_PACKAGE</span> <span class="text-emerald-400 font-bold">VALUES</span> <span class="text-white">(</span><span class="text-amber-300">\'28 堂組合包\'</span><span class="text-white">,</span> <span class="text-emerald-400">28</span><span class="text-white">,</span> <span class="text-emerald-400">6000</span><span class="text-white">)</span>',
    description: '在方案表中新增一個「28 堂組合包」，價格 6000 元',
    color: 'emerald',
  },
  {
    type: 'UPDATE',
    title: '調整 7 堂方案價格',
    sqlHtml: '<span class="text-amber-400 font-bold">UPDATE</span> <span class="text-white">CREDIT_PACKAGE</span> <span class="text-amber-400 font-bold">SET</span> <span class="text-white">price =</span> <span class="text-emerald-400">1500</span> <span class="text-sky-400 font-bold">WHERE</span> <span class="text-white">id =</span> <span class="text-emerald-400">1</span>',
    description: '把「7 堂組合包」的價格從 1400 元調漲到 1500 元',
    color: 'amber',
  },
  {
    type: 'DELETE',
    title: '刪除 21 堂方案',
    sqlHtml: '<span class="text-rose-400 font-bold">DELETE FROM</span> <span class="text-white">CREDIT_PACKAGE</span> <span class="text-sky-400 font-bold">WHERE</span> <span class="text-white">id =</span> <span class="text-emerald-400">3</span>',
    description: '把「21 堂組合包」這個方案從表中刪除',
    color: 'rose',
  },
]

const currentReviewQuestion = computed(() => reviewQuestions[reviewStep.value])
const allReviewCompleted = computed(() => reviewCompleted.value.every(v => v))

function executeReviewSql() {
  if (reviewSqlState.value !== 'idle') return

  reviewSqlState.value = 'executing'

  setTimeout(() => {
    reviewSqlState.value = 'arrow'
  }, 500)

  setTimeout(() => {
    reviewSqlState.value = 'done'
    reviewShowResult.value = true
    // 標記當前題目完成
    reviewCompleted.value[reviewStep.value] = true

    // 根據操作類型更新表格資料
    const type = currentReviewQuestion.value.type
    if (type === 'INSERT') {
      reviewTableData.value = [
        ...reviewTableData.value,
        { id: 4, name: '28 堂組合包', credit_amount: 28, price: 6000 },
      ]
    } else if (type === 'UPDATE') {
      reviewTableData.value = reviewTableData.value.map(row =>
        row.id === 1 ? { ...row, price: 1500 } : row
      )
    } else if (type === 'DELETE') {
      reviewTableData.value = reviewTableData.value.filter(row => row.id !== 3)
    }
  }, 1000)
}

function nextReviewStep() {
  if (reviewStep.value < reviewQuestions.length - 1) {
    reviewStep.value++
    reviewSqlState.value = 'idle'
    reviewShowResult.value = false
  }
}

function resetReview() {
  reviewStep.value = 0
  reviewCompleted.value = [false, false, false, false, false]
  reviewSqlState.value = 'idle'
  reviewShowResult.value = false
  reviewTableData.value = [
    { id: 1, name: '7 堂組合包', credit_amount: 7, price: 1400 },
    { id: 2, name: '14 堂組合包', credit_amount: 14, price: 2520 },
    { id: 3, name: '21 堂組合包', credit_amount: 21, price: 4800 },
  ]
}
</script>

<template>
  <InteractiveSlideTemplate
    title="SQL 語法基礎"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    :canGoNext="canGoNext"
    :nextStepHint="nextStepHint"
    themeColor="amber"
    @prev="prevStep"
    @next="nextStep"
    @complete="handleComplete"
  >
    <!-- 自訂 Header Icon -->
    <template #icon>
      <div class="relative">
        <span class="text-2xl md:text-3xl">📝</span>
        <div class="absolute -right-1 -top-1 h-2 w-2 animate-pulse-slow rounded-full bg-amber-400"></div>
      </div>
    </template>

    <!-- 主要內容區 -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-slate-900">
      <!-- 背景動畫 -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="animate-float-slow absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div class="animate-float-slower absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-purple-500/10 blur-3xl"></div>
      </div>

      <div class="relative z-10 flex flex-1 flex-col gap-4 p-4 md:p-6">

        <!-- ========== INTRO ========== -->
        <template v-if="stepData.view === 'intro'">
          <div class="flex flex-1 flex-col items-center justify-center gap-6">
            <!-- 主視覺 -->
            <div
              class="transition-all duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="text-center">
                <div class="text-6xl mb-4">🗣️</div>
                <div class="text-2xl font-bold text-white">SQL = 跟資料庫說話的語言</div>
              </div>
            </div>

            <!-- 六大天王卡片 -->
            <div
              class="grid grid-cols-2 gap-3 w-full max-w-lg transition-all duration-700 delay-300"
              :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <!-- 查詢三兄弟 -->
              <div class="col-span-2 text-center text-sm text-slate-400 mb-1">📖 查詢三兄弟（讀取資料）</div>
              <div class="rounded-xl border border-purple-500/50 bg-purple-500/10 p-3 text-center">
                <div class="text-lg font-bold text-purple-400">SELECT</div>
                <div class="text-xs text-slate-400">選欄位</div>
              </div>
              <div class="rounded-xl border border-blue-500/50 bg-blue-500/10 p-3 text-center">
                <div class="text-lg font-bold text-blue-400">FROM</div>
                <div class="text-xs text-slate-400">選表格</div>
              </div>
              <div class="col-span-2 rounded-xl border border-sky-500/50 bg-sky-500/10 p-3 text-center">
                <div class="text-lg font-bold text-sky-400">WHERE</div>
                <div class="text-xs text-slate-400">篩選條件</div>
              </div>

              <!-- 操作三劍客 -->
              <div class="col-span-2 text-center text-sm text-slate-400 mt-2 mb-1">✏️ 操作三劍客（修改資料）</div>
              <div class="rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-3 text-center">
                <div class="text-lg font-bold text-emerald-400">INSERT</div>
                <div class="text-xs text-slate-400">新增</div>
              </div>
              <div class="rounded-xl border border-amber-500/50 bg-amber-500/10 p-3 text-center">
                <div class="text-lg font-bold text-amber-400">UPDATE</div>
                <div class="text-xs text-slate-400">修改</div>
              </div>
              <div class="col-span-2 rounded-xl border border-rose-500/50 bg-rose-500/10 p-3 text-center">
                <div class="text-lg font-bold text-rose-400">DELETE</div>
                <div class="text-xs text-slate-400">刪除</div>
              </div>
            </div>
          </div>
        </template>

        <!-- ========== SELECT INTRO ========== -->
        <template v-if="stepData.view === 'select_intro'">
          <div class="flex flex-1 flex-col items-center justify-center gap-6">
            <div
              class="transition-all duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="text-center">
                <div class="inline-block rounded-2xl border-2 border-purple-500 bg-purple-500/20 px-6 py-4">
                  <div class="text-4xl font-bold text-purple-400">SELECT</div>
                </div>
                <div class="mt-4 text-xl text-white">= 「我要看什麼欄位？」</div>
              </div>
            </div>

            <!-- 比喻說明 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-300"
              :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
                <div class="text-lg font-bold text-purple-400 mb-3">🍽️ 就像點菜一樣：</div>
                <div class="space-y-2 text-slate-300">
                  <div class="flex items-center gap-2">
                    <span class="text-emerald-400">✓</span>
                    <span>「老闆，我要看<span class="text-purple-400 font-bold">名字</span>和<span class="text-purple-400 font-bold">價格</span>」</span>
                  </div>
                  <div class="text-sm text-slate-400 ml-6">→ SELECT name, price</div>
                </div>
              </div>
            </div>

            <!-- 語法範例 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-500"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
                <div class="font-mono text-lg">
                  <span class="text-purple-400 font-bold">SELECT</span>
                  <span class="text-white"> name, email</span>
                </div>
                <div class="mt-2 text-sm text-slate-400">
                  只顯示 name 和 email 兩個欄位
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ========== SELECT DEMO ========== -->
        <template v-if="stepData.view === 'select_demo'">
          <div class="flex flex-col gap-4">
            <!-- 說明 -->
            <div class="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3">
              <div class="text-sm text-purple-300">👆 點擊下方表格的欄位標題，看看 SELECT 怎麼選擇欄位</div>
            </div>

            <!-- SQL 預覽 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800 p-3">
              <div class="text-xs text-slate-500 mb-1">生成的 SQL：</div>
              <code class="font-mono text-lg">
                <span class="text-purple-400">SELECT</span>&nbsp;<span class="text-white">{{ selectedCols.length === 0 || selectedCols.length === currentTableCols.length ? '*' : selectedCols.map(i => currentTableCols[i]).join(', ') }}</span>&nbsp;<span class="text-blue-400">FROM</span>&nbsp;<span class="text-white">{{ activeTable }}</span>
              </code>
            </div>

            <!-- 操作按鈕 -->
            <div class="flex gap-2">
              <button
                class="rounded-lg border border-purple-500/50 bg-purple-500/20 px-3 py-1.5 text-sm text-purple-400 hover:bg-purple-500/30"
                :class="selectedCols.length === 0 ? 'clickable-button' : ''"
                @click="selectAllCols"
              >
                全選 (*)
              </button>
              <button
                class="rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-600"
                @click="clearCols"
              >
                清除
              </button>
            </div>

            <!-- DBeaver 風格表格 -->
            <div class="overflow-hidden rounded-xl border border-slate-600 bg-slate-900">
              <!-- DBeaver 風格標題列 -->
              <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-3 py-2">
                <div class="flex gap-1.5">
                  <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                  <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                  <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                </div>
                <span class="ml-2 text-xs text-slate-500">DBeaver</span>
                <span class="text-slate-600">|</span>
                <span class="font-mono text-sm font-bold text-blue-400">{{ activeTable }}</span>
                <span class="text-xs text-slate-500">- LiveFit 資料庫</span>
              </div>
              <table class="w-full text-sm">
                <thead class="bg-slate-800/50">
                  <tr>
                    <th
                      v-for="(col, i) in currentTableCols"
                      :key="col"
                      class="px-3 py-2 text-left cursor-pointer transition-all border-r border-slate-700 last:border-r-0"
                      :class="[
                        selectedCols.includes(i) ? 'bg-purple-500/30 text-purple-400' : 'text-slate-400 hover:bg-slate-700',
                        selectedCols.length === 0 ? 'clickable-column' : ''
                      ]"
                      @click="toggleColumn(i)"
                    >
                      {{ col }}
                      <span v-if="selectedCols.includes(i)" class="ml-1 text-xs">✓</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in currentTableData" :key="row.id" class="border-t border-slate-700 hover:bg-slate-800/50">
                    <td
                      v-for="(col, i) in currentTableCols"
                      :key="col"
                      class="px-3 py-2 transition-all border-r border-slate-700/50 last:border-r-0"
                      :class="selectedCols.length === 0 || selectedCols.includes(i) ? 'text-white' : 'text-slate-500 opacity-30'"
                    >
                      {{ (row as any)[col] }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 狀態列 -->
              <div class="border-t border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-500">
                共 {{ currentTableData.length }} 筆資料
              </div>
            </div>
          </div>
        </template>

        <!-- ========== SELECT * ========== -->
        <template v-if="stepData.view === 'select_star'">
          <div class="flex flex-1 flex-col items-center justify-center gap-6">
            <div
              class="transition-all duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="text-center">
                <div class="inline-block rounded-2xl border-2 border-amber-500 bg-amber-500/20 px-8 py-4">
                  <div class="text-5xl font-bold text-amber-400">SELECT *</div>
                </div>
                <div class="mt-4 text-xl text-white">= 「全部欄位都要！」</div>
              </div>
            </div>

            <!-- 比喻 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-300"
              :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
                <div class="text-lg font-bold text-amber-400 mb-3">⭐ 星號的意思：</div>
                <div class="space-y-2 text-slate-300">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">*</span>
                    <span>= 全部、所有、通通都要</span>
                  </div>
                  <div class="text-sm text-slate-400 mt-2">
                    就像跟服務生說：<br/>
                    「菜單上的<span class="text-amber-400 font-bold">全部</span>給我來一份！」
                  </div>
                </div>
              </div>
            </div>

            <!-- 比較 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-500"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="grid grid-cols-2 gap-3">
                <div class="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 text-center">
                  <div class="font-mono text-sm text-purple-400">SELECT name, email</div>
                  <div class="text-xs text-slate-400 mt-1">只要 2 個欄位</div>
                </div>
                <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-center">
                  <div class="font-mono text-sm text-amber-400">SELECT *</div>
                  <div class="text-xs text-slate-400 mt-1">全部欄位</div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ========== FROM INTRO ========== -->
        <template v-if="stepData.view === 'from_intro'">
          <div class="flex flex-1 flex-col items-center justify-center gap-6">
            <div
              class="transition-all duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="text-center">
                <div class="inline-block rounded-2xl border-2 border-blue-500 bg-blue-500/20 px-6 py-4">
                  <div class="text-4xl font-bold text-blue-400">FROM</div>
                </div>
                <div class="mt-4 text-xl text-white">= 「去哪張表找？」</div>
              </div>
            </div>

            <!-- 比喻說明 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-300"
              :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
                <div class="text-lg font-bold text-blue-400 mb-3">📚 資料庫像圖書館：</div>
                <div class="space-y-2 text-slate-300">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">📕</span>
                    <span>USER 表 → 存會員資料</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xl">📗</span>
                    <span>SKILL 表 → 存技能資料</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xl">📘</span>
                    <span>CREDIT_PACKAGE 表 → 存方案資料</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 語法範例 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-500"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                <div class="font-mono text-lg">
                  <span class="text-purple-400">SELECT</span>&nbsp;<span class="text-white">*</span>&nbsp;<span class="text-blue-400 font-bold">FROM</span>&nbsp;<span class="text-white">USER</span>
                </div>
                <div class="mt-2 text-sm text-slate-400">
                  從 USER 表裡撈出所有資料
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ========== FROM DEMO ========== -->
        <template v-if="stepData.view === 'from_demo'">
          <div class="flex flex-col gap-4">
            <!-- 情境說明 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <div class="flex items-start gap-3">
                <div class="text-2xl">🔍</div>
                <div>
                  <div class="font-bold text-white">不同的表格有不同的資料</div>
                  <div class="mt-1 text-sm text-slate-400">
                    <span class="text-blue-400 font-medium">任務：</span>切換 FROM 後面的表格名稱，看看會撈出什麼不同的資料
                  </div>
                </div>
              </div>
            </div>

            <!-- 提示文字 -->
            <div v-if="!hasTableSwitched" class="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-center">
              <div class="text-lg font-bold text-amber-400">👇 點擊下方的表格標籤（SKILL 或 CREDIT_PACKAGE），看看資料怎麼變化！</div>
              <div class="mt-1 text-sm text-amber-300/70">切換後，下面的表格會顯示不同的資料</div>
            </div>

            <!-- 完成提示 -->
            <div v-else class="rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-3 text-center">
              <div class="text-emerald-400">✅ 你發現了！FROM 後面接不同的表格，就會撈出不同的資料</div>
            </div>

            <!-- SQL 預覽 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800 p-3">
              <div class="text-xs text-slate-500 mb-1">生成的 SQL：</div>
              <code class="font-mono text-lg">
                <span class="text-purple-400">SELECT</span>&nbsp;<span class="text-white">*</span>&nbsp;<span class="text-blue-400">FROM</span>&nbsp;<span class="text-white font-bold">{{ activeTable }}</span>
              </code>
            </div>

            <!-- 表格選擇標籤 -->
            <div class="flex gap-2">
              <button
                v-for="table in ['USER', 'SKILL', 'CREDIT_PACKAGE'] as const"
                :key="table"
                class="rounded-lg border px-4 py-2 text-base font-medium transition-all"
                :class="[
                  activeTable === table
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                    : 'border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600',
                  activeTable !== table && !hasTableSwitched ? 'clickable-button-blue' : ''
                ]"
                @click="switchTable(table)"
              >
                {{ table }}
              </button>
            </div>

            <!-- DBeaver 風格表格 -->
            <div class="overflow-hidden rounded-xl border border-slate-600 bg-slate-900">
              <!-- DBeaver 風格標題列 -->
              <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-3 py-2">
                <div class="flex gap-1.5">
                  <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                  <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                  <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                </div>
                <span class="ml-2 text-xs text-slate-500">DBeaver</span>
                <span class="text-slate-600">|</span>
                <span class="font-mono text-sm font-bold text-blue-400">{{ activeTable }}</span>
                <span class="text-xs text-slate-500">- LiveFit 資料庫</span>
              </div>
              <table class="w-full text-sm">
                <thead class="bg-slate-800/50">
                  <tr>
                    <th v-for="col in currentTableCols" :key="col" class="px-3 py-2 text-left text-slate-400 border-r border-slate-700 last:border-r-0">
                      {{ col }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in currentTableData" :key="row.id" class="border-t border-slate-700 hover:bg-slate-800/50">
                    <td v-for="col in currentTableCols" :key="col" class="px-3 py-2 text-white border-r border-slate-700/50 last:border-r-0">
                      {{ (row as any)[col] }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 狀態列 -->
              <div class="border-t border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-500">
                共 {{ currentTableData.length }} 筆資料
              </div>
            </div>
          </div>
        </template>

        <!-- ========== WHERE INTRO ========== -->
        <template v-if="stepData.view === 'where_intro'">
          <div class="flex flex-1 flex-col items-center justify-center gap-6">
            <div
              class="transition-all duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="text-center">
                <div class="inline-block rounded-2xl border-2 border-sky-500 bg-sky-500/20 px-6 py-4">
                  <div class="text-4xl font-bold text-sky-400">WHERE</div>
                </div>
                <div class="mt-4 text-xl text-white">= 「只要符合條件的！」</div>
              </div>
            </div>

            <!-- 比喻說明 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-300"
              :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
                <div class="text-lg font-bold text-sky-400 mb-3">🔍 像過濾器一樣：</div>
                <div class="space-y-2 text-slate-300">
                  <div class="flex items-center gap-2">
                    <span class="text-emerald-400">✓</span>
                    <span>「只要<span class="text-sky-400 font-bold">教練</span>的資料」</span>
                  </div>
                  <div class="text-sm text-slate-400 ml-6">→ WHERE role = 'coach'</div>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="text-emerald-400">✓</span>
                    <span>「只要<span class="text-sky-400 font-bold">超過 2000 元</span>的方案」</span>
                  </div>
                  <div class="text-sm text-slate-400 ml-6">→ WHERE price > 2000</div>
                </div>
              </div>
            </div>

            <!-- 重點 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-500"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <div class="font-bold text-amber-400 mb-2">⚠️ 沒有 WHERE 會怎樣？</div>
                <div class="text-sm text-slate-300">
                  沒有 WHERE = 沒有過濾 = <span class="text-amber-400 font-bold">全部資料都撈出來</span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ========== WHERE DEMO ========== -->
        <template v-if="stepData.view === 'where_demo'">
          <div class="flex flex-col gap-4">
            <!-- SQL 範例 -->
            <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4">
              <div class="font-mono text-lg">
                <span class="text-purple-400">SELECT</span>&nbsp;<span class="text-white">*</span>&nbsp;<span class="text-blue-400">FROM</span>&nbsp;<span class="text-white">USER</span>&nbsp;<span class="text-sky-400 font-bold">WHERE</span>&nbsp;<span class="text-white">role = 'coach'</span>
              </div>
              <div class="mt-2 text-sm text-slate-400">
                只找出 role 是 'coach' 的會員
              </div>
            </div>

            <!-- DBeaver 風格表格：所有資料 -->
            <div class="overflow-hidden rounded-xl border border-slate-600 bg-slate-900">
              <!-- DBeaver 風格標題列 -->
              <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-3 py-2">
                <div class="flex gap-1.5">
                  <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                  <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                  <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                </div>
                <span class="ml-2 text-xs text-slate-500">DBeaver</span>
                <span class="text-slate-600">|</span>
                <span class="font-mono text-sm font-bold text-blue-400">USER</span>
                <span class="text-xs text-slate-500">- 篩選前（全部資料）</span>
              </div>
              <table class="w-full text-sm">
                <thead class="bg-slate-800/50">
                  <tr>
                    <th class="px-3 py-2 text-left text-slate-400 border-r border-slate-700">id</th>
                    <th class="px-3 py-2 text-left text-slate-400 border-r border-slate-700">name</th>
                    <th class="px-3 py-2 text-left text-slate-400 border-r border-slate-700">email</th>
                    <th class="px-3 py-2 text-left text-slate-400">role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in userData" :key="row.id" class="border-t border-slate-700 hover:bg-slate-800/50">
                    <td class="px-3 py-2 text-slate-400 border-r border-slate-700/50">{{ row.id }}</td>
                    <td class="px-3 py-2 text-white border-r border-slate-700/50">{{ row.name }}</td>
                    <td class="px-3 py-2 text-slate-300 border-r border-slate-700/50">{{ row.email }}</td>
                    <td class="px-3 py-2" :class="row.role === 'coach' ? 'text-sky-400 font-bold' : 'text-slate-400'">
                      {{ row.role }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="border-t border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-500">
                共 {{ userData.length }} 筆資料
              </div>
            </div>

            <!-- 箭頭 -->
            <div class="text-center text-2xl text-sky-400">↓ WHERE role = 'coach' ↓</div>

            <!-- DBeaver 風格表格：篩選後 -->
            <div class="overflow-hidden rounded-xl border-2 border-sky-500 bg-slate-900">
              <!-- DBeaver 風格標題列 -->
              <div class="flex items-center gap-2 border-b border-sky-500/50 bg-sky-500/20 px-3 py-2">
                <div class="flex gap-1.5">
                  <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                  <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                  <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                </div>
                <span class="ml-2 text-xs text-sky-300">DBeaver</span>
                <span class="text-sky-500/50">|</span>
                <span class="font-mono text-sm font-bold text-sky-400">USER</span>
                <span class="text-xs text-sky-300">- 篩選後（只有教練）</span>
              </div>
              <table class="w-full text-sm">
                <thead class="bg-sky-500/10">
                  <tr>
                    <th class="px-3 py-2 text-left text-sky-400 border-r border-sky-500/30">id</th>
                    <th class="px-3 py-2 text-left text-sky-400 border-r border-sky-500/30">name</th>
                    <th class="px-3 py-2 text-left text-sky-400 border-r border-sky-500/30">email</th>
                    <th class="px-3 py-2 text-left text-sky-400">role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in userData.filter(u => u.role === 'coach')" :key="row.id" class="border-t border-sky-500/30 hover:bg-sky-500/10">
                    <td class="px-3 py-2 text-slate-400 border-r border-sky-500/20">{{ row.id }}</td>
                    <td class="px-3 py-2 text-white border-r border-sky-500/20">{{ row.name }}</td>
                    <td class="px-3 py-2 text-slate-300 border-r border-sky-500/20">{{ row.email }}</td>
                    <td class="px-3 py-2 text-sky-400 font-bold">{{ row.role }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="border-t border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs text-sky-300">
                共 {{ userData.filter(u => u.role === 'coach').length }} 筆資料（篩選後）
              </div>
            </div>
          </div>
        </template>

        <!-- ========== WHERE OPERATORS ========== -->
        <template v-if="stepData.view === 'where_operators'">
          <div class="flex flex-col gap-4">
            <!-- 標題 -->
            <div class="text-center">
              <div class="inline-block rounded-xl border border-sky-500/50 bg-sky-500/20 px-4 py-2">
                <span class="text-lg font-bold text-sky-400">WHERE 可以用的比較符號</span>
              </div>
            </div>

            <!-- 符號表格 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800 overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-slate-700/50">
                  <tr>
                    <th class="px-4 py-3 text-left text-slate-400">符號</th>
                    <th class="px-4 py-3 text-left text-slate-400">意思</th>
                    <th class="px-4 py-3 text-left text-slate-400">範例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-t border-slate-700">
                    <td class="px-4 py-3 font-mono text-lg text-sky-400">=</td>
                    <td class="px-4 py-3 text-white">等於</td>
                    <td class="px-4 py-3 font-mono text-slate-300">role = 'coach'</td>
                  </tr>
                  <tr class="border-t border-slate-700">
                    <td class="px-4 py-3 font-mono text-lg text-sky-400">!=</td>
                    <td class="px-4 py-3 text-white">不等於</td>
                    <td class="px-4 py-3 font-mono text-slate-300">role != 'user'</td>
                  </tr>
                  <tr class="border-t border-slate-700">
                    <td class="px-4 py-3 font-mono text-lg text-sky-400">></td>
                    <td class="px-4 py-3 text-white">大於</td>
                    <td class="px-4 py-3 font-mono text-slate-300">price > 2000</td>
                  </tr>
                  <tr class="border-t border-slate-700">
                    <td class="px-4 py-3 font-mono text-lg text-sky-400"><</td>
                    <td class="px-4 py-3 text-white">小於</td>
                    <td class="px-4 py-3 font-mono text-slate-300">price < 2000</td>
                  </tr>
                  <tr class="border-t border-slate-700">
                    <td class="px-4 py-3 font-mono text-lg text-sky-400">>=</td>
                    <td class="px-4 py-3 text-white">大於等於</td>
                    <td class="px-4 py-3 font-mono text-slate-300">credit_amount >= 14</td>
                  </tr>
                  <tr class="border-t border-slate-700">
                    <td class="px-4 py-3 font-mono text-lg text-sky-400"><=</td>
                    <td class="px-4 py-3 text-white">小於等於</td>
                    <td class="px-4 py-3 font-mono text-slate-300">credit_amount <= 14</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 提示 -->
            <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div class="font-bold text-amber-400 mb-2">💡 小提醒：</div>
              <div class="text-sm text-slate-300">
                <span class="text-amber-400">文字</span>要用<span class="font-mono text-amber-400">'單引號'</span>包起來<br/>
                <span class="text-amber-400">數字</span>不用引號
              </div>
            </div>
          </div>
        </template>

        <!-- ========== QUERY COMBO ========== -->
        <template v-if="stepData.view === 'query_combo'">
          <div class="flex flex-1 flex-col items-center justify-center gap-6">
            <!-- 標題 -->
            <div
              class="transition-all duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="text-center text-2xl font-bold text-white">🎯 查詢三兄弟合體！</div>
            </div>

            <!-- 完整語法 -->
            <div
              class="w-full max-w-lg transition-all duration-700 delay-300"
              :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-slate-700 bg-slate-800 p-6">
                <div class="font-mono text-xl leading-loose">
                  <div><span class="text-purple-400 font-bold">SELECT</span> <span class="text-white">name, email</span></div>
                  <div><span class="text-blue-400 font-bold">FROM</span> <span class="text-white">USER</span></div>
                  <div><span class="text-sky-400 font-bold">WHERE</span> <span class="text-white">role = 'coach'</span></div>
                </div>
              </div>
            </div>

            <!-- 順序說明 -->
            <div
              class="w-full max-w-lg transition-all duration-700 delay-500"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="rounded-lg border border-purple-500/50 bg-purple-500/10 p-3">
                  <div class="text-2xl">1️⃣</div>
                  <div class="text-sm font-bold text-purple-400">SELECT</div>
                  <div class="text-xs text-slate-400">選欄位</div>
                </div>
                <div class="rounded-lg border border-blue-500/50 bg-blue-500/10 p-3">
                  <div class="text-2xl">2️⃣</div>
                  <div class="text-sm font-bold text-blue-400">FROM</div>
                  <div class="text-xs text-slate-400">選表格</div>
                </div>
                <div class="rounded-lg border border-sky-500/50 bg-sky-500/10 p-3">
                  <div class="text-2xl">3️⃣</div>
                  <div class="text-sm font-bold text-sky-400">WHERE</div>
                  <div class="text-xs text-slate-400">加條件</div>
                </div>
              </div>
              <div class="mt-3 text-center text-sm text-amber-400">
                ⚠️ 順序不能亂！一定是 SELECT → FROM → WHERE
              </div>
            </div>
          </div>
        </template>

        <!-- ========== INSERT INTRO ========== -->
        <template v-if="stepData.view === 'insert_intro'">
          <div class="flex flex-1 flex-col items-center justify-center gap-6">
            <div
              class="transition-all duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="text-center">
                <div class="inline-block rounded-2xl border-2 border-emerald-500 bg-emerald-500/20 px-6 py-4">
                  <div class="text-4xl font-bold text-emerald-400">INSERT</div>
                </div>
                <div class="mt-4 text-xl text-white">= 「新增一筆資料」</div>
              </div>
            </div>

            <!-- 比喻 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-300"
              :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
                <div class="text-lg font-bold text-emerald-400 mb-3">📝 就像在筆記本新增一行：</div>
                <div class="space-y-2 text-slate-300">
                  <div>在表格的最後面，新增一列資料</div>
                </div>
              </div>
            </div>

            <!-- 語法範例 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-500"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div class="font-mono text-base leading-relaxed">
                  <span class="text-emerald-400 font-bold">INSERT INTO</span>
                  <span class="text-white"> USER</span><br/>
                  <span class="text-emerald-400 font-bold">VALUES</span>
                  <span class="text-white"> ('陳大文', 'chen@email.com', 'user', '密碼')</span>
                </div>
                <div class="mt-2 text-sm text-slate-400">
                  在 USER 表新增一位叫「陳大文」的會員
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ========== INSERT DEMO ========== -->
        <template v-if="stepData.view === 'insert_demo'">
          <div class="flex flex-col gap-4">
            <!-- 情境說明 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <div class="flex items-start gap-3">
                <div class="text-2xl">👨‍💼</div>
                <div>
                  <div class="font-bold text-white">老闆說：「我們要新增一個課程：拳擊！」</div>
                  <div class="mt-1 text-sm text-slate-400">
                    <span class="text-emerald-400 font-medium">任務：</span>用 INSERT 把「拳擊」這個技能新增到 SKILL 表中
                  </div>
                </div>
              </div>
            </div>

            <!-- 提示文字 -->
            <div v-if="sqlExecutionState === 'idle'" class="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-center">
              <div class="text-lg font-bold text-amber-400">👇 點擊下方「執行 SQL」按鈕，看看會發生什麼事！</div>
              <div class="mt-1 text-sm text-amber-300/70">執行後，下面的表格會出現新的一列資料</div>
            </div>

            <!-- SQL 區域 -->
            <div
              class="rounded-xl border p-4 transition-all duration-300"
              :class="[
                sqlExecutionState === 'executing' ? 'border-emerald-500 sql-executing-emerald' : 'border-emerald-500/30',
                sqlExecutionState === 'executing' ? 'bg-emerald-500/20' : 'bg-emerald-500/10'
              ]"
            >
              <div class="flex items-center justify-between gap-4">
                <div class="font-mono text-base">
                  <span class="text-emerald-400 font-bold">INSERT INTO</span>
                  <span class="text-white"> SKILL</span>
                  <span class="text-emerald-400 font-bold"> VALUES</span>
                  <span class="text-white"> ('拳擊')</span>
                </div>
                <!-- 執行按鈕 -->
                <button
                  v-if="sqlExecutionState === 'idle'"
                  class="rounded-lg bg-emerald-500 px-5 py-3 text-base font-bold text-white transition-all hover:bg-emerald-600 clickable-button-emerald"
                  @click="executeSql"
                >
                  執行 SQL ▶
                </button>
                <span v-else-if="sqlExecutionState === 'executing'" class="text-sm text-emerald-400 animate-pulse">⚡ 執行中...</span>
                <button
                  v-else-if="sqlExecutionState === 'done'"
                  class="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600"
                  @click="resetExecution"
                >
                  重新執行
                </button>
              </div>
            </div>

            <!-- 執行箭頭動畫 -->
            <Transition name="arrow">
              <div v-if="sqlExecutionState === 'arrow'" class="flex flex-col items-center gap-1 py-2">
                <div class="text-3xl text-emerald-400 animate-bounce">⬇</div>
                <div class="text-sm text-emerald-400 font-medium">傳送到資料庫...</div>
              </div>
            </Transition>

            <!-- DBeaver 風格表格 -->
            <div
              class="overflow-hidden rounded-xl border bg-slate-900 transition-all duration-500"
              :class="[
                showExecutionResult ? 'border-emerald-500 table-updated-emerald' : 'border-slate-600',
                sqlExecutionState === 'arrow' ? 'table-receiving-emerald' : ''
              ]"
            >
              <div
                class="flex items-center gap-2 border-b bg-slate-800 px-3 py-2 transition-all duration-300"
                :class="[
                  showExecutionResult ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-slate-700'
                ]"
              >
                <div class="flex gap-1.5">
                  <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                  <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                  <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                </div>
                <span class="ml-2 text-xs text-slate-500">DBeaver</span>
                <span class="text-slate-600">|</span>
                <span class="font-mono text-sm font-bold text-blue-400">SKILL</span>
                <span class="text-xs text-slate-500">- LiveFit 資料庫</span>
                <!-- 狀態提示 -->
                <span v-if="sqlExecutionState === 'arrow'" class="ml-auto text-xs text-emerald-400 animate-pulse">📥 接收指令...</span>
                <span v-else-if="showExecutionResult" class="ml-auto text-xs text-emerald-400">✅ 新增成功（+1 筆）</span>
              </div>
              <table class="w-full text-sm">
                <thead class="bg-slate-800/50">
                  <tr>
                    <th class="px-3 py-2 text-left text-slate-400 border-r border-slate-700">id</th>
                    <th class="px-3 py-2 text-left text-slate-400">name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in skillData" :key="row.id" class="border-t border-slate-700 hover:bg-slate-800/50">
                    <td class="px-3 py-2 text-slate-400 border-r border-slate-700/50">{{ row.id }}</td>
                    <td class="px-3 py-2 text-white">{{ row.name }}</td>
                  </tr>
                  <!-- 新增的一列（執行後才顯示） -->
                  <Transition name="row-insert">
                    <tr v-if="showExecutionResult" class="border-t border-emerald-500 bg-emerald-500/20">
                      <td class="px-3 py-2 text-slate-400 border-r border-emerald-500/20">4</td>
                      <td class="px-3 py-2 text-emerald-400 font-bold">拳擊 ✨</td>
                    </tr>
                  </Transition>
                </tbody>
              </table>
              <div
                class="border-t px-3 py-1.5 text-xs transition-all duration-300"
                :class="showExecutionResult ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-slate-700 bg-slate-800/50 text-slate-500'"
              >
                共 {{ showExecutionResult ? '4' : '3' }} 筆資料{{ showExecutionResult ? '（新增 1 筆）' : '' }}
              </div>
            </div>
          </div>
        </template>

        <!-- ========== UPDATE INTRO ========== -->
        <template v-if="stepData.view === 'update_intro'">
          <div class="flex flex-1 flex-col items-center justify-center gap-6">
            <div
              class="transition-all duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="text-center">
                <div class="inline-block rounded-2xl border-2 border-amber-500 bg-amber-500/20 px-6 py-4">
                  <div class="text-4xl font-bold text-amber-400">UPDATE</div>
                </div>
                <div class="mt-4 text-xl text-white">= 「修改現有資料」</div>
              </div>
            </div>

            <!-- 比喻 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-300"
              :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
                <div class="text-lg font-bold text-amber-400 mb-3">✏️ 就像用立可白塗掉重寫：</div>
                <div class="space-y-2 text-slate-300">
                  <div>找到某一列，把舊的值改成新的值</div>
                </div>
              </div>
            </div>

            <!-- 語法範例 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-500"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <div class="font-mono text-base leading-relaxed">
                  <span class="text-amber-400 font-bold">UPDATE</span>
                  <span class="text-white"> USER</span><br/>
                  <span class="text-amber-400 font-bold">SET</span>
                  <span class="text-white"> role = 'coach'</span><br/>
                  <span class="text-sky-400 font-bold">WHERE</span>
                  <span class="text-white"> id = 2</span>
                </div>
                <div class="mt-2 text-sm text-slate-400">
                  把 id = 2 的會員，role 改成 'coach'
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ========== UPDATE DEMO ========== -->
        <template v-if="stepData.view === 'update_demo'">
          <div class="flex flex-col gap-4">
            <!-- 情境說明 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <div class="flex items-start gap-3">
                <div class="text-2xl">🎉</div>
                <div>
                  <div class="font-bold text-white">李燕容通過教練認證！要從「學員」升級成「教練」</div>
                  <div class="mt-1 text-sm text-slate-400">
                    <span class="text-amber-400 font-medium">任務：</span>用 UPDATE 把 id = 2 的 role 從 'user' 改成 'coach'
                  </div>
                </div>
              </div>
            </div>

            <!-- 提示文字 -->
            <div v-if="sqlExecutionState === 'idle'" class="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-center">
              <div class="text-lg font-bold text-amber-400">👇 點擊下方「執行 SQL」按鈕，看看會發生什麼事！</div>
              <div class="mt-1 text-sm text-amber-300/70">執行後，李燕容的 role 欄位會從 user 變成 coach</div>
            </div>

            <!-- SQL 區域 -->
            <div
              class="rounded-xl border p-4 transition-all duration-300"
              :class="[
                sqlExecutionState === 'executing' ? 'border-amber-500 sql-executing-amber' : 'border-amber-500/30',
                sqlExecutionState === 'executing' ? 'bg-amber-500/20' : 'bg-amber-500/10'
              ]"
            >
              <div class="flex items-center justify-between gap-4">
                <div class="font-mono text-base">
                  <span class="text-amber-400 font-bold">UPDATE</span>
                  <span class="text-white"> USER</span>
                  <span class="text-amber-400 font-bold"> SET</span>
                  <span class="text-white"> role = 'coach'</span>
                  <span class="text-sky-400 font-bold"> WHERE</span>
                  <span class="text-white"> id = 2</span>
                </div>
                <!-- 執行按鈕 -->
                <button
                  v-if="sqlExecutionState === 'idle'"
                  class="rounded-lg bg-amber-500 px-5 py-3 text-base font-bold text-white transition-all hover:bg-amber-600 clickable-button-amber"
                  @click="executeSql"
                >
                  執行 SQL ▶
                </button>
                <span v-else-if="sqlExecutionState === 'executing'" class="text-sm text-amber-400 animate-pulse">⚡ 執行中...</span>
                <button
                  v-else-if="sqlExecutionState === 'done'"
                  class="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600"
                  @click="resetExecution"
                >
                  重新執行
                </button>
              </div>
            </div>

            <!-- 執行箭頭動畫 -->
            <Transition name="arrow">
              <div v-if="sqlExecutionState === 'arrow'" class="flex flex-col items-center gap-1 py-2">
                <div class="text-3xl text-amber-400 animate-bounce">⬇</div>
                <div class="text-sm text-amber-400 font-medium">傳送到資料庫...</div>
              </div>
            </Transition>

            <!-- DBeaver 風格表格 -->
            <div
              class="overflow-hidden rounded-xl border bg-slate-900 transition-all duration-500"
              :class="[
                showExecutionResult ? 'border-amber-500 table-updated-amber' : 'border-slate-600',
                sqlExecutionState === 'arrow' ? 'table-receiving-amber' : ''
              ]"
            >
              <div
                class="flex items-center gap-2 border-b bg-slate-800 px-3 py-2 transition-all duration-300"
                :class="[
                  showExecutionResult ? 'border-amber-500/50 bg-amber-500/10' : 'border-slate-700'
                ]"
              >
                <div class="flex gap-1.5">
                  <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                  <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                  <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                </div>
                <span class="ml-2 text-xs text-slate-500">DBeaver</span>
                <span class="text-slate-600">|</span>
                <span class="font-mono text-sm font-bold text-blue-400">USER</span>
                <span class="text-xs text-slate-500">- LiveFit 資料庫</span>
                <!-- 狀態提示 -->
                <span v-if="sqlExecutionState === 'arrow'" class="ml-auto text-xs text-amber-400 animate-pulse">📥 接收指令...</span>
                <span v-else-if="showExecutionResult" class="ml-auto text-xs text-amber-400">✅ 修改成功（1 筆）</span>
              </div>
              <table class="w-full text-sm">
                <thead class="bg-slate-800/50">
                  <tr>
                    <th class="px-3 py-2 text-left text-slate-400 border-r border-slate-700">id</th>
                    <th class="px-3 py-2 text-left text-slate-400 border-r border-slate-700">name</th>
                    <th class="px-3 py-2 text-left text-slate-400">role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-t border-slate-700 hover:bg-slate-800/50">
                    <td class="px-3 py-2 text-slate-400 border-r border-slate-700/50">1</td>
                    <td class="px-3 py-2 text-white border-r border-slate-700/50">王小明</td>
                    <td class="px-3 py-2 text-slate-400">user</td>
                  </tr>
                  <tr
                    class="border-t border-slate-700 transition-all duration-500"
                    :class="showExecutionResult ? 'bg-amber-500/20' : 'bg-amber-500/10'"
                  >
                    <td class="px-3 py-2 text-slate-400 border-r border-slate-700/50">2</td>
                    <td class="px-3 py-2 text-white border-r border-slate-700/50">李燕容</td>
                    <td class="px-3 py-2">
                      <template v-if="showExecutionResult">
                        <span class="line-through text-slate-500 mr-2">user</span>
                        <span class="text-amber-400 font-bold">coach ✨</span>
                      </template>
                      <template v-else>
                        <span class="text-amber-400">user</span>
                      </template>
                    </td>
                  </tr>
                  <tr class="border-t border-slate-700 hover:bg-slate-800/50">
                    <td class="px-3 py-2 text-slate-400 border-r border-slate-700/50">3</td>
                    <td class="px-3 py-2 text-white border-r border-slate-700/50">小美</td>
                    <td class="px-3 py-2 text-slate-400">coach</td>
                  </tr>
                </tbody>
              </table>
              <div
                class="border-t px-3 py-1.5 text-xs transition-all duration-300"
                :class="showExecutionResult ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-slate-700 bg-slate-800/50 text-slate-500'"
              >
                共 3 筆資料{{ showExecutionResult ? '（修改 1 筆）' : '' }}
              </div>
            </div>
          </div>
        </template>

        <!-- ========== UPDATE DANGER ========== -->
        <template v-if="stepData.view === 'update_danger'">
          <div class="flex flex-1 flex-col items-center justify-center gap-6">
            <div
              class="transition-all duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="text-center">
                <div class="text-6xl mb-4">💥</div>
                <div class="text-2xl font-bold text-rose-400">災難：忘了寫 WHERE</div>
              </div>
            </div>

            <!-- 危險語法 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-300"
              :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border-2 border-rose-500 bg-rose-500/10 p-4">
                <div class="font-mono text-lg">
                  <span class="text-amber-400 font-bold">UPDATE</span>
                  <span class="text-white"> USER</span>
                  <span class="text-amber-400 font-bold"> SET</span>
                  <span class="text-white"> role = 'coach'</span>
                </div>
                <div class="mt-2 text-sm text-rose-400 font-bold">
                  ⚠️ 沒有 WHERE = 全部都被改掉！
                </div>
              </div>
            </div>

            <!-- 後果 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-500"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
                <div class="text-center text-rose-400 font-bold mb-3">😱 結果：所有人都變成教練了</div>
                <div class="grid grid-cols-3 gap-2 text-sm text-center">
                  <div class="rounded bg-rose-500/20 p-2">
                    <div class="text-white">王小明</div>
                    <div class="text-rose-400">coach</div>
                  </div>
                  <div class="rounded bg-rose-500/20 p-2">
                    <div class="text-white">李燕容</div>
                    <div class="text-rose-400">coach</div>
                  </div>
                  <div class="rounded bg-rose-500/20 p-2">
                    <div class="text-white">小美</div>
                    <div class="text-rose-400">coach</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 警告 -->
            <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
              <div class="font-bold text-amber-400">📌 記住：UPDATE 一定要配 WHERE！</div>
            </div>
          </div>
        </template>

        <!-- ========== DELETE INTRO ========== -->
        <template v-if="stepData.view === 'delete_intro'">
          <div class="flex flex-1 flex-col items-center justify-center gap-6">
            <div
              class="transition-all duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="text-center">
                <div class="inline-block rounded-2xl border-2 border-rose-500 bg-rose-500/20 px-6 py-4">
                  <div class="text-4xl font-bold text-rose-400">DELETE</div>
                </div>
                <div class="mt-4 text-xl text-white">= 「刪除資料」</div>
              </div>
            </div>

            <!-- 比喻 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-300"
              :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
                <div class="text-lg font-bold text-rose-400 mb-3">🗑️ 就像把那一行擦掉：</div>
                <div class="space-y-2 text-slate-300">
                  <div>資料會永遠消失，<span class="text-rose-400 font-bold">回不來了</span>！</div>
                </div>
              </div>
            </div>

            <!-- 語法範例 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-500"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
                <div class="font-mono text-base leading-relaxed">
                  <span class="text-rose-400 font-bold">DELETE FROM</span>
                  <span class="text-white"> SKILL</span><br/>
                  <span class="text-sky-400 font-bold">WHERE</span>
                  <span class="text-white"> id = 3</span>
                </div>
                <div class="mt-2 text-sm text-slate-400">
                  刪除 id = 3 的技能（有氧運動）
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ========== DELETE DEMO ========== -->
        <template v-if="stepData.view === 'delete_demo'">
          <div class="flex flex-col gap-4">
            <!-- 情境說明 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <div class="flex items-start gap-3">
                <div class="text-2xl">📢</div>
                <div>
                  <div class="font-bold text-white">公告：「有氧運動」課程暫時停開了！</div>
                  <div class="mt-1 text-sm text-slate-400">
                    <span class="text-rose-400 font-medium">任務：</span>用 DELETE 把 id = 3 的「有氧運動」從 SKILL 表中刪除
                  </div>
                </div>
              </div>
            </div>

            <!-- 提示文字 -->
            <div v-if="sqlExecutionState === 'idle'" class="rounded-xl border border-rose-500/50 bg-rose-500/10 p-4 text-center">
              <div class="text-lg font-bold text-rose-400">👇 點擊下方「執行 SQL」按鈕，看看會發生什麼事！</div>
              <div class="mt-1 text-sm text-rose-300/70">執行後，「有氧運動」這筆資料會被刪除</div>
            </div>

            <!-- SQL 區域 -->
            <div
              class="rounded-xl border p-4 transition-all duration-300"
              :class="[
                sqlExecutionState === 'executing' ? 'border-rose-500 sql-executing-rose' : 'border-rose-500/30',
                sqlExecutionState === 'executing' ? 'bg-rose-500/20' : 'bg-rose-500/10'
              ]"
            >
              <div class="flex items-center justify-between gap-4">
                <div class="font-mono text-base">
                  <span class="text-rose-400 font-bold">DELETE FROM</span>
                  <span class="text-white"> SKILL</span>
                  <span class="text-sky-400 font-bold"> WHERE</span>
                  <span class="text-white"> id = 3</span>
                </div>
                <!-- 執行按鈕 -->
                <button
                  v-if="sqlExecutionState === 'idle'"
                  class="rounded-lg bg-rose-500 px-5 py-3 text-base font-bold text-white transition-all hover:bg-rose-600 clickable-button-rose"
                  @click="executeSql"
                >
                  執行 SQL ▶
                </button>
                <span v-else-if="sqlExecutionState === 'executing'" class="text-sm text-rose-400 animate-pulse">⚡ 執行中...</span>
                <button
                  v-else-if="sqlExecutionState === 'done'"
                  class="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600"
                  @click="resetExecution"
                >
                  重新執行
                </button>
              </div>
            </div>

            <!-- 執行箭頭動畫 -->
            <Transition name="arrow">
              <div v-if="sqlExecutionState === 'arrow'" class="flex flex-col items-center gap-1 py-2">
                <div class="text-3xl text-rose-400 animate-bounce">⬇</div>
                <div class="text-sm text-rose-400 font-medium">傳送到資料庫...</div>
              </div>
            </Transition>

            <!-- DBeaver 風格表格 -->
            <div
              class="overflow-hidden rounded-xl border bg-slate-900 transition-all duration-500"
              :class="[
                showExecutionResult ? 'border-rose-500 table-updated-rose' : 'border-slate-600',
                sqlExecutionState === 'arrow' ? 'table-receiving-rose' : ''
              ]"
            >
              <div
                class="flex items-center gap-2 border-b bg-slate-800 px-3 py-2 transition-all duration-300"
                :class="[
                  showExecutionResult ? 'border-rose-500/50 bg-rose-500/10' : 'border-slate-700'
                ]"
              >
                <div class="flex gap-1.5">
                  <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                  <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                  <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                </div>
                <span class="ml-2 text-xs text-slate-500">DBeaver</span>
                <span class="text-slate-600">|</span>
                <span class="font-mono text-sm font-bold text-blue-400">SKILL</span>
                <span class="text-xs text-slate-500">- LiveFit 資料庫</span>
                <!-- 狀態提示 -->
                <span v-if="sqlExecutionState === 'arrow'" class="ml-auto text-xs text-rose-400 animate-pulse">📥 接收指令...</span>
                <span v-else-if="showExecutionResult" class="ml-auto text-xs text-rose-400">✅ 刪除成功（-1 筆）</span>
              </div>
              <table class="w-full text-sm">
                <thead class="bg-slate-800/50">
                  <tr>
                    <th class="px-3 py-2 text-left text-slate-400 border-r border-slate-700">id</th>
                    <th class="px-3 py-2 text-left text-slate-400">name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-t border-slate-700 hover:bg-slate-800/50">
                    <td class="px-3 py-2 text-slate-400 border-r border-slate-700/50">1</td>
                    <td class="px-3 py-2 text-white">重訓</td>
                  </tr>
                  <tr class="border-t border-slate-700 hover:bg-slate-800/50">
                    <td class="px-3 py-2 text-slate-400 border-r border-slate-700/50">2</td>
                    <td class="px-3 py-2 text-white">瑜伽</td>
                  </tr>
                  <!-- 要刪除的列 -->
                  <tr
                    class="border-t border-slate-700 transition-all duration-500"
                    :class="[
                      showExecutionResult ? 'bg-rose-500/20 opacity-50 line-through' : 'bg-rose-500/10'
                    ]"
                  >
                    <td class="px-3 py-2 text-slate-400 border-r border-slate-700/50">3</td>
                    <td class="px-3 py-2" :class="showExecutionResult ? 'text-rose-400' : 'text-rose-400'">
                      {{ showExecutionResult ? '有氧運動（已刪除）' : '有氧運動' }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                class="border-t px-3 py-1.5 text-xs transition-all duration-300"
                :class="showExecutionResult ? 'border-rose-500/30 bg-rose-500/10 text-rose-300' : 'border-slate-700 bg-slate-800/50 text-slate-500'"
              >
                共 {{ showExecutionResult ? '2' : '3' }} 筆資料{{ showExecutionResult ? '（刪除 1 筆）' : '' }}
              </div>
            </div>
          </div>
        </template>

        <!-- ========== DELETE DANGER ========== -->
        <template v-if="stepData.view === 'delete_danger'">
          <div class="flex flex-1 flex-col items-center justify-center gap-6">
            <div
              class="transition-all duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="text-center">
                <div class="text-6xl mb-4">☠️</div>
                <div class="text-2xl font-bold text-rose-400">毀滅性災難：忘了寫 WHERE</div>
              </div>
            </div>

            <!-- 危險語法 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-300"
              :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border-2 border-rose-500 bg-rose-500/10 p-4">
                <div class="font-mono text-lg">
                  <span class="text-rose-400 font-bold">DELETE FROM</span>
                  <span class="text-white"> SKILL</span>
                </div>
                <div class="mt-2 text-sm text-rose-400 font-bold">
                  ⚠️ 沒有 WHERE = 整張表被清空！
                </div>
              </div>
            </div>

            <!-- 後果 -->
            <div
              class="w-full max-w-md transition-all duration-700 delay-500"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
                <div class="text-center text-rose-400 font-bold mb-3">😱 結果：資料全部消失</div>
                <div class="rounded border border-rose-500/50 bg-rose-500/10 p-4 text-center">
                  <div class="text-slate-500 text-sm">SKILL 表</div>
                  <div class="text-rose-400 text-lg mt-2">（空的）</div>
                  <div class="text-slate-500 text-xs mt-1">0 筆資料</div>
                </div>
              </div>
            </div>

            <!-- 警告 -->
            <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
              <div class="font-bold text-amber-400">📌 記住：DELETE 一定要配 WHERE！</div>
              <div class="text-sm text-slate-400 mt-1">除非你真的想刪除全部資料</div>
            </div>
          </div>
        </template>

        <!-- ========== REVIEW 總複習 ========== -->
        <template v-if="stepData.view === 'review'">
          <div class="flex flex-col gap-4">
            <!-- 標題區 -->
            <div class="rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4 text-center">
              <div class="text-2xl font-bold text-amber-400">📝 總複習時間！</div>
              <div class="mt-2 text-sm text-slate-300">
                用「<span class="text-blue-400 font-bold">堂數方案表</span>」來練習 5 大 SQL 操作
              </div>
              <div class="mt-1 text-sm font-medium text-amber-300">
                （表格名稱：CREDIT_PACKAGE）
              </div>
              <div class="mt-3 flex items-center justify-center gap-2">
                <span class="text-rose-400 text-lg">🔥</span>
                <span class="text-rose-300 font-medium">完成後即將進入 SQL 考試！</span>
                <span class="text-rose-400 text-lg">🔥</span>
              </div>
            </div>

            <!-- 進度指示器 -->
            <div class="flex justify-center gap-2">
              <div
                v-for="(q, idx) in reviewQuestions"
                :key="idx"
                class="flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold transition-all"
                :class="[
                  reviewCompleted[idx]
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : idx === reviewStep
                      ? 'border-amber-500 bg-amber-500/20 text-amber-400 animate-pulse'
                      : 'border-slate-600 bg-slate-800 text-slate-500'
                ]"
              >
                <span v-if="reviewCompleted[idx]">✓</span>
                <span v-else>{{ idx + 1 }}</span>
              </div>
            </div>

            <!-- 當前題目 -->
            <div class="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <div class="flex items-center gap-3 mb-3">
                <span
                  class="rounded-full px-3 py-1 text-sm font-bold"
                  :class="{
                    'bg-purple-500/20 text-purple-400': currentReviewQuestion.color === 'purple',
                    'bg-sky-500/20 text-sky-400': currentReviewQuestion.color === 'sky',
                    'bg-emerald-500/20 text-emerald-400': currentReviewQuestion.color === 'emerald',
                    'bg-amber-500/20 text-amber-400': currentReviewQuestion.color === 'amber',
                    'bg-rose-500/20 text-rose-400': currentReviewQuestion.color === 'rose',
                  }"
                >
                  {{ currentReviewQuestion.type }}
                </span>
                <span class="text-lg font-bold text-white">{{ currentReviewQuestion.title }}</span>
              </div>
              <p class="text-sm text-slate-400">{{ currentReviewQuestion.description }}</p>
            </div>

            <!-- SQL 區域 -->
            <div
              class="rounded-xl border p-4 transition-all duration-300"
              :class="[
                reviewSqlState === 'executing' ? 'border-emerald-500 sql-executing-emerald' : 'border-slate-600',
                reviewSqlState === 'executing' ? 'bg-emerald-500/10' : 'bg-slate-800/50'
              ]"
            >
              <div class="flex items-center justify-between gap-4">
                <code class="font-mono text-base" v-html="currentReviewQuestion.sqlHtml"></code>
                <button
                  v-if="reviewSqlState === 'idle'"
                  class="rounded-lg bg-emerald-500 px-5 py-3 text-base font-bold text-white transition-all hover:bg-emerald-600 clickable-button-emerald"
                  @click="executeReviewSql"
                >
                  執行 SQL ▶
                </button>
                <span v-else-if="reviewSqlState === 'executing'" class="text-sm text-emerald-400 animate-pulse">⚡ 執行中...</span>
                <span v-else-if="reviewSqlState === 'done'" class="text-sm text-emerald-400">✅ 完成</span>
              </div>
            </div>

            <!-- 執行箭頭動畫 -->
            <Transition name="arrow">
              <div v-if="reviewSqlState === 'arrow'" class="flex flex-col items-center gap-1 py-2">
                <div class="text-3xl text-emerald-400 animate-bounce">⬇</div>
                <div class="text-sm text-emerald-400 font-medium">傳送到資料庫...</div>
              </div>
            </Transition>

            <!-- DBeaver 風格表格 -->
            <div
              class="overflow-hidden rounded-xl border bg-slate-900 transition-all duration-500"
              :class="[
                reviewShowResult ? 'border-emerald-500' : 'border-slate-600',
                reviewSqlState === 'arrow' ? 'table-receiving-emerald' : ''
              ]"
            >
              <div
                class="flex items-center gap-2 border-b bg-slate-800 px-3 py-2 transition-all duration-300"
                :class="reviewShowResult ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-slate-700'"
              >
                <div class="flex gap-1.5">
                  <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                  <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                  <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                </div>
                <span class="ml-2 text-xs text-slate-500">DBeaver</span>
                <span class="text-slate-600">|</span>
                <span class="font-mono text-sm font-bold text-blue-400">CREDIT_PACKAGE</span>
                <span class="text-xs text-slate-400">（堂數方案表）</span>
                <span class="text-xs text-slate-500">- LiveFit 資料庫</span>
                <span v-if="reviewSqlState === 'arrow'" class="ml-auto text-xs text-emerald-400 animate-pulse">📥 接收指令...</span>
                <span v-else-if="reviewShowResult" class="ml-auto text-xs text-emerald-400">✅ 執行成功</span>
              </div>
              <table class="w-full text-sm">
                <thead class="bg-slate-800/50">
                  <tr>
                    <th class="px-3 py-2 text-left text-slate-400 border-r border-slate-700">id</th>
                    <th class="px-3 py-2 text-left text-slate-400 border-r border-slate-700">name</th>
                    <th class="px-3 py-2 text-left text-slate-400 border-r border-slate-700">credit_amount</th>
                    <th class="px-3 py-2 text-left text-slate-400">price</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- WHERE 篩選時只顯示符合條件的 -->
                  <template v-if="currentReviewQuestion.type === 'WHERE' && reviewShowResult">
                    <tr
                      v-for="row in reviewTableData.filter(r => r.price > 2000)"
                      :key="row.id"
                      class="border-t border-slate-700 bg-sky-500/10"
                    >
                      <td class="px-3 py-2 text-slate-400 border-r border-slate-700/50">{{ row.id }}</td>
                      <td class="px-3 py-2 text-white border-r border-slate-700/50">{{ row.name }}</td>
                      <td class="px-3 py-2 text-slate-300 border-r border-slate-700/50">{{ row.credit_amount }}</td>
                      <td class="px-3 py-2 text-sky-400 font-bold">{{ row.price.toLocaleString() }}</td>
                    </tr>
                  </template>
                  <!-- 其他情況顯示全部 -->
                  <template v-else>
                    <tr
                      v-for="row in reviewTableData"
                      :key="row.id"
                      class="border-t border-slate-700 hover:bg-slate-800/50 transition-all"
                      :class="{
                        'bg-emerald-500/20': row.id === 4 && reviewShowResult,
                        'bg-amber-500/20': row.id === 1 && currentReviewQuestion.type === 'UPDATE' && reviewShowResult,
                      }"
                    >
                      <td class="px-3 py-2 text-slate-400 border-r border-slate-700/50">{{ row.id }}</td>
                      <td class="px-3 py-2 text-white border-r border-slate-700/50">
                        {{ row.name }}
                        <span v-if="row.id === 4 && reviewShowResult && currentReviewQuestion.type === 'INSERT'" class="text-emerald-400"> ✨ 新增</span>
                      </td>
                      <td class="px-3 py-2 text-slate-300 border-r border-slate-700/50">{{ row.credit_amount }}</td>
                      <td class="px-3 py-2" :class="row.id === 1 && currentReviewQuestion.type === 'UPDATE' && reviewShowResult ? 'text-amber-400 font-bold' : 'text-slate-300'">
                        {{ row.price.toLocaleString() }}
                        <span v-if="row.id === 1 && currentReviewQuestion.type === 'UPDATE' && reviewShowResult" class="text-amber-400"> ✨</span>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
              <div class="border-t border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-500">
                共 {{ currentReviewQuestion.type === 'WHERE' && reviewShowResult ? reviewTableData.filter(r => r.price > 2000).length : reviewTableData.length }} 筆資料
              </div>
            </div>

            <!-- 下一題按鈕 -->
            <div v-if="reviewShowResult && reviewStep < reviewQuestions.length - 1" class="flex justify-center">
              <button
                class="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:shadow-amber-500/40"
                @click="nextReviewStep"
              >
                下一題 →
              </button>
            </div>

            <!-- 全部完成提示 -->
            <div v-if="allReviewCompleted" class="rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-4 text-center">
              <div class="text-2xl mb-2">🎊</div>
              <div class="text-lg font-bold text-emerald-400">太棒了！你已完成所有複習！</div>
              <div class="mt-2 text-sm text-slate-300">準備好進入 SQL 練習場考試了嗎？</div>
            </div>
          </div>
        </template>

        <!-- ========== SUMMARY ========== -->
        <template v-if="stepData.view === 'summary'">
          <div class="flex flex-1 flex-col items-center justify-center gap-6">
            <div
              class="transition-all duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="text-center">
                <div class="text-6xl mb-4">🎉</div>
                <div class="text-2xl font-bold text-white">恭喜你學會 SQL 六大天王！</div>
              </div>
            </div>

            <!-- 總結卡片 -->
            <div
              class="w-full max-w-lg transition-all duration-700 delay-300"
              :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="grid grid-cols-2 gap-3">
                <!-- 查詢 -->
                <div class="col-span-2 text-center text-sm text-slate-400 mb-1">📖 查詢（Read）</div>
                <div class="rounded-xl border border-purple-500/50 bg-purple-500/10 p-3 text-center">
                  <div class="font-bold text-purple-400">SELECT</div>
                  <div class="text-xs text-slate-400">選欄位</div>
                </div>
                <div class="rounded-xl border border-blue-500/50 bg-blue-500/10 p-3 text-center">
                  <div class="font-bold text-blue-400">FROM</div>
                  <div class="text-xs text-slate-400">選表格</div>
                </div>
                <div class="col-span-2 rounded-xl border border-sky-500/50 bg-sky-500/10 p-3 text-center">
                  <div class="font-bold text-sky-400">WHERE</div>
                  <div class="text-xs text-slate-400">篩選條件</div>
                </div>

                <!-- CRUD -->
                <div class="col-span-2 text-center text-sm text-slate-400 mt-2 mb-1">✏️ 操作（Create / Update / Delete）</div>
                <div class="rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-3 text-center">
                  <div class="font-bold text-emerald-400">INSERT</div>
                  <div class="text-xs text-slate-400">新增 (C)</div>
                </div>
                <div class="rounded-xl border border-amber-500/50 bg-amber-500/10 p-3 text-center">
                  <div class="font-bold text-amber-400">UPDATE</div>
                  <div class="text-xs text-slate-400">修改 (U)</div>
                </div>
                <div class="col-span-2 rounded-xl border border-rose-500/50 bg-rose-500/10 p-3 text-center">
                  <div class="font-bold text-rose-400">DELETE</div>
                  <div class="text-xs text-slate-400">刪除 (D)</div>
                </div>
              </div>
            </div>

            <!-- 提示 -->
            <div
              class="w-full max-w-lg transition-all duration-700 delay-500"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                <div class="font-bold text-amber-400">📌 最重要的提醒</div>
                <div class="text-sm text-slate-300 mt-2">
                  UPDATE 和 DELETE 一定要記得加<span class="text-sky-400 font-bold"> WHERE</span>！<br/>
                  不然會造成<span class="text-rose-400 font-bold">災難</span>！
                </div>
              </div>
            </div>
          </div>
        </template>

      </div>
    </div>
  </InteractiveSlideTemplate>
</template>

<style scoped>
/* === 可點擊元素的閃爍動畫 === */

/* 紫色閃爍 (SELECT 相關) */
@keyframes pulse-purple {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.5);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(168, 85, 247, 0);
  }
}

/* 藍色閃爍 (FROM 相關) */
@keyframes pulse-blue {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
  }
}

/* 通用發光效果 */
@keyframes clickable-glow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 手指指向動畫 */
@keyframes finger-bounce {
  0%, 100% {
    transform: translateY(-50%) translateX(0);
  }
  50% {
    transform: translateY(-50%) translateX(-3px);
  }
}

/* 表格欄位標題的閃爍（SELECT DEMO） */
.clickable-column {
  animation: pulse-purple 2s ease-in-out infinite;
  position: relative;
  cursor: pointer;
}

.clickable-column::after {
  content: '👆';
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  animation: finger-bounce 1s ease-in-out infinite;
}

/* 按鈕閃爍（紫色主題） */
.clickable-button {
  animation: pulse-blue 2s ease-in-out infinite, clickable-glow 2s ease-in-out infinite;
  cursor: pointer;
}

/* 整體可點擊提示 */
.clickable-hint {
  animation: pulse-purple 2s ease-in-out infinite, clickable-glow 2s ease-in-out infinite;
  cursor: pointer;
}

/* 淡淡的邊框閃爍 */
@keyframes border-pulse {
  0%, 100% {
    border-color: rgba(168, 85, 247, 0.3);
  }
  50% {
    border-color: rgba(168, 85, 247, 0.8);
  }
}

.pulse-border {
  animation: border-pulse 2s ease-in-out infinite;
}

/* === SQL 執行動畫 === */

/* 綠色發光 (INSERT) */
@keyframes sql-glow-emerald {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  50% {
    box-shadow: 0 0 20px 4px rgba(16, 185, 129, 0.3);
  }
}

.sql-executing-emerald {
  animation: sql-glow-emerald 0.8s ease-in-out infinite;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%);
}

/* 黃色發光 (UPDATE) */
@keyframes sql-glow-amber {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
  }
  50% {
    box-shadow: 0 0 20px 4px rgba(245, 158, 11, 0.3);
  }
}

.sql-executing-amber {
  animation: sql-glow-amber 0.8s ease-in-out infinite;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%);
}

/* 紅色發光 (DELETE) */
@keyframes sql-glow-rose {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.4);
  }
  50% {
    box-shadow: 0 0 20px 4px rgba(244, 63, 94, 0.3);
  }
}

.sql-executing-rose {
  animation: sql-glow-rose 0.8s ease-in-out infinite;
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.1) 0%, transparent 100%);
}

/* 表格接收動畫 */
@keyframes table-pulse-emerald {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 15px 2px rgba(16, 185, 129, 0.2); }
}

@keyframes table-pulse-amber {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.3); }
  50% { box-shadow: 0 0 15px 2px rgba(245, 158, 11, 0.2); }
}

@keyframes table-pulse-rose {
  0%, 100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.3); }
  50% { box-shadow: 0 0 15px 2px rgba(244, 63, 94, 0.2); }
}

.table-receiving-emerald { animation: table-pulse-emerald 0.6s ease-in-out infinite; }
.table-receiving-amber { animation: table-pulse-amber 0.6s ease-in-out infinite; }
.table-receiving-rose { animation: table-pulse-rose 0.6s ease-in-out infinite; }

/* 表格更新完成 */
.table-updated-emerald { box-shadow: 0 0 20px 4px rgba(16, 185, 129, 0.2); }
.table-updated-amber { box-shadow: 0 0 20px 4px rgba(245, 158, 11, 0.2); }
.table-updated-rose { box-shadow: 0 0 20px 4px rgba(244, 63, 94, 0.2); }

/* 執行按鈕閃爍 */
@keyframes button-pulse-emerald {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
  50% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
}

@keyframes button-pulse-amber {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.5); }
  50% { box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
}

@keyframes button-pulse-rose {
  0%, 100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.5); }
  50% { box-shadow: 0 0 0 6px rgba(244, 63, 94, 0); }
}

.clickable-button-emerald { animation: button-pulse-emerald 2s ease-in-out infinite; }
.clickable-button-amber { animation: button-pulse-amber 2s ease-in-out infinite; }
.clickable-button-rose { animation: button-pulse-rose 2s ease-in-out infinite; }

/* 藍色按鈕閃爍 (FROM DEMO) */
@keyframes button-pulse-blue {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); }
}
.clickable-button-blue { animation: button-pulse-blue 2s ease-in-out infinite; }

/* 箭頭動畫 */
.arrow-enter-active {
  transition: all 0.4s ease-out;
}

.arrow-leave-active {
  transition: all 0.3s ease-in;
}

.arrow-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.arrow-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 列插入動畫 */
.row-insert-enter-active {
  transition: all 0.5s ease-out;
}

.row-insert-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
