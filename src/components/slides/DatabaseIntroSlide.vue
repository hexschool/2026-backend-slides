<script setup lang="ts">
/**
 * 資料庫入門互動簡報：從 Excel 到資料庫
 * 使用共用模版 InteractiveSlideTemplate
 *
 * 海姐帶你認識資料庫的基本概念
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
  | 'intro' | 'table' | 'pk' | 'pk_concept' | 'type_concept'
  | 'anim_master' | 'anim_pain' | 'anim_error' | 'anim_split' | 'anim_moving' | 'anim_codes' | 'anim_link' | 'anim_sync'
  | 'split' | 'fk' | 'sql'
  | 'sql_select' | 'sql_from' | 'sql_where' | 'sql_combo'
  | 'scenario'
  | 'crud_insert' | 'crud_update' | 'crud_delete' | 'crud_disaster' | 'crud_protect'
  | 'summary' | 'certificate' | 'final'

type Step = {
  id: number
  view: StepView
  title: string
  desc: string
  sql?: string
  tip?: string
  matchFn?: (row: any) => boolean
  highlightCols?: number[]
  sheet?: 'customers' | 'orders'
}

const STEPS: Step[] = [
  // === 第一章：從 Excel 開始 (1-7) ===
  { id: 1, view: 'intro', title: '認識資料庫', desc: '為了讓你更熟悉 LiveFit 的系統，我們先用公司訂單的例子來學習資料庫。資料庫就像一個超級大書包，Excel 只是裡面的小鉛筆盒。' },
  { id: 2, view: 'anim_master', title: '這是公司的 Excel', desc: '這是公司目前用的訂單管理表。你看，客戶名稱、電話、訂單全部混在同一張表裡面。' },
  { id: 3, view: 'anim_master', title: '觀察這張表', desc: '仔細看看：台積電出現了 3 次，鴻海出現了 2 次。每次下單都要重複輸入公司名稱和電話...這樣真的好嗎？' },
  { id: 4, view: 'pk_concept', title: '先學一個概念：主鍵', desc: '在繼續之前，先認識一個重要概念：每間公司都需要唯一的編號，就像身分證一樣。這個號碼叫「主鍵」，絕對不能重複。' },
  { id: 5, view: 'type_concept', title: '再學一個：資料型態', desc: '金額欄位只能寫數字，寫文字會被電腦擋下來。資料庫很嚴格，規定是數字就不能寫字，這是為了保護資料的正確性。' },
  { id: 6, view: 'anim_pain', title: '問題一：重複輸入', desc: '回到這張表，你看台積電下 3 筆訂單，名字就要寫 3 次、電話寫 3 次。如果下 100 筆呢？浪費時間又容易錯！' },
  { id: 7, view: 'anim_error', title: '問題二：改資料災難', desc: '如果台積電改電話，你要在每一筆訂單裡一個一個改嗎？漏改一個資料就會不一致，這種維護方式太可怕了。' },

  // === 第二章：正規化動畫 (8-12) ===
  { id: 8, view: 'anim_split', title: '剪刀拿出來！', desc: '我們把表格切開：左邊專門管「客戶」，右邊專門管「訂單」。專業術語叫「正規化」，其實就是「分類整理」。' },
  { id: 9, view: 'anim_moving', title: '搬家大行動', desc: '把姓名電話搬到左邊，每間公司只要寫一次就好。看！資料從右邊飛到左邊了，右邊變乾淨了。' },
  { id: 10, view: 'anim_codes', title: '只留暗號', desc: '訂單表裡只留「C01」這個代號，乾淨又清爽。這個 C01 代號，就是連回客戶表的「外來鍵」。' },
  { id: 11, view: 'anim_link', title: '神奇傳送門', desc: '電腦看到 C01，就會自動連回客戶表找到台積電。這就是為什麼它叫「關聯式」資料庫。' },
  { id: 12, view: 'anim_sync', title: '改一次，全部變', desc: '現在只要改一次名字，所有訂單都會自動對應到新名字！這就是資料庫最強大的地方：效率與正確。' },

  // === 第三章：SQL 鐵三角 (13-21) ===
  { id: 13, view: 'sql_select', title: '試試看！點擊欄位', desc: '現在換你當指揮官！請試著點擊右邊表格上方的「公司名稱」或「電話」。', tip: '點擊欄位標題來選取' },
  { id: 14, view: 'sql_select', title: '選多個欄位', desc: '你可以同時點好幾個欄位。試試看點「公司編號」和「電話」。', tip: '可以選多個！' },
  { id: 15, view: 'sql_select', title: '我全都要！(SELECT *)', desc: '按一下右上角的「全選」按鈕。這在 SQL 裡寫作 SELECT *，星星代表「所有欄位通通顯示」。', tip: '試試全選按鈕' },
  { id: 16, view: 'sql_from', title: '咒語第二步：FROM', desc: '選完欄位後，要用 FROM 告訴電腦要去哪張表找。注意看！現在畫面是在藍色的「客戶表」。', sheet: 'customers' },
  { id: 17, view: 'sql_from', title: '切換筆記本', desc: '如果我們改寫 FROM 訂單紀錄表，電腦就會瞬間把畫面切換到另一本筆記本。咻！畫面變成紫色的「訂單表」了！', sheet: 'orders' },
  { id: 18, view: 'sql_where', title: '咒語第三步：WHERE', desc: '資料太多了！用 WHERE 加上條件，就像用放大鏡過濾資料一樣。觀察下面的 Output！只有符合條件的資料會被吐出來。', sql: "WHERE 金額 > 100000" },
  { id: 19, view: 'sql_where', title: '找特定的一筆', desc: '如果我想找特定的訂單，用 = (等於)。就像狙擊手一樣，只會打中那一筆。', sql: "WHERE 訂單編號 = 'ORD-101'" },
  { id: 20, view: 'sql_where', title: '文字要加引號', desc: '如果要找「完成」的訂單，因為「完成」是文字，記得要加 \'單引號\' 喔！數字不用引號，文字一定要加。', sql: "WHERE 狀態 = '完成'" },
  { id: 21, view: 'sql_combo', title: '鐵三角合體', desc: '讓我們把它們拼起來：選欄位(SELECT)、選表(FROM)、下條件(WHERE)。這三句話的順序不能顛倒喔！' },

  // === 第四章：情境實戰 (22-41) ===
  { id: 22, view: 'scenario', title: '[情境] 老闆想找大客戶', desc: '老闆說：「幫我找金額超過 40 萬的訂單！」', sql: 'WHERE 金額 > 400000', matchFn: (r) => r.amt > 400000 },
  { id: 23, view: 'scenario', title: '[情境] 找小額訂單', desc: '財務說：「10 萬以下的小單有哪些？」', sql: 'WHERE 金額 < 100000', matchFn: (r) => r.amt < 100000 },
  { id: 24, view: 'scenario', title: '[情境] 找台積電的單', desc: '業務問：「台積電下了哪些單？」', sql: "WHERE 公司編號 = 'C01'", matchFn: (r) => r.cid === 'C01' },
  { id: 25, view: 'scenario', title: '[情境] 找新竹的公司', desc: '區域經理要看新竹的客戶名單', sql: "WHERE 城市 = '新竹'", matchFn: (r) => r.city === '新竹', sheet: 'customers' },
  { id: 26, view: 'scenario', title: '[情境] 兩個條件都要', desc: '找新竹的半導體公司', sql: "WHERE 城市 = '新竹' AND 行業 = '半導體'", matchFn: (r) => r.city === '新竹' && r.industry === '半導體', sheet: 'customers' },
  { id: 27, view: 'scenario', title: '[情境] 符合其中一個', desc: '台北或新竹的公司都要', sql: "WHERE 城市 = '新竹' OR 城市 = '台北'", matchFn: (r) => r.city === '新竹' || r.city === '台北', sheet: 'customers' },
  { id: 28, view: 'scenario', title: '[情境] 不要這個', desc: '排除已取消的訂單', sql: "WHERE 狀態 <> '取消'", matchFn: (r) => r.status !== '取消' },
  { id: 29, view: 'scenario', title: '[情境] 查找特定產品', desc: '找所有「晶圓」的訂單', sql: "WHERE 產品 = '晶圓'", matchFn: (r) => r.prod === '晶圓' },
  { id: 30, view: 'scenario', title: '[情境] 某日期之後', desc: '11 月之後的訂單', sql: "WHERE 日期 >= '2023-11-01'", matchFn: (r) => r.date >= '2023-11-01' },
  { id: 31, view: 'scenario', title: '[情境] 日期區間', desc: '10 月份的訂單', sql: "WHERE 日期 BETWEEN '2023-10-01' AND '2023-10-31'", matchFn: (r) => r.date >= '2023-10-01' && r.date <= '2023-10-31' },
  { id: 32, view: 'scenario', title: '[情境] 模糊搜尋', desc: '名字有「電」的公司', sql: "WHERE 名稱 LIKE '%電%'", matchFn: (r) => r.name?.includes('電'), sheet: 'customers' },
  { id: 33, view: 'scenario', title: '[情境] 誰還沒完成？', desc: '進行中的訂單有哪些', sql: "WHERE 狀態 = '進行中'", matchFn: (r) => r.status === '進行中' },
  { id: 34, view: 'scenario', title: '[情境] 大筆且未完成', desc: '超過 10 萬且還在進行中', sql: "WHERE 金額 > 100000 AND 狀態 = '進行中'", matchFn: (r) => r.amt > 100000 && r.status === '進行中' },
  { id: 35, view: 'scenario', title: '[情境] 只看特定欄位', desc: '只要訂單編號和狀態', sql: 'SELECT 訂單編號, 狀態', highlightCols: [0, 4] },
  { id: 36, view: 'scenario', title: '[情境] 尋找空資料', desc: '電話欄位是空的客戶', sql: 'WHERE 電話 IS NULL', tip: '找出資料不完整的紀錄', sheet: 'customers' },
  { id: 37, view: 'scenario', title: '[情境] 排除名單', desc: '排除 C01 和 C02', sql: "WHERE 編號 NOT IN ('C01', 'C02')", matchFn: (r) => r.cid !== 'C01' && r.cid !== 'C02' },
  { id: 38, view: 'scenario', title: '[情境] 括號的用法', desc: '(台北或新竹) 且是金融業', sql: "WHERE (城市='台北' OR 城市='新竹') AND 行業='金融'", sheet: 'customers' },
  { id: 39, view: 'scenario', title: '[情境] 排序', desc: '依金額從大到小排', sql: 'ORDER BY 金額 DESC', tip: 'DESC = 降冪, ASC = 升冪' },
  { id: 40, view: 'scenario', title: '[情境] 只看前三名', desc: '金額最高的前 3 筆', sql: 'ORDER BY 金額 DESC LIMIT 3', tip: 'LIMIT 限制筆數' },
  { id: 41, view: 'sql_combo', title: '畢業考', desc: '組合所有技能：SELECT + FROM + WHERE + ORDER BY！你已經掌握 SQL 查詢的精髓了！' },

  // === 第五章：CRUD 終極修煉 (42-51) ===
  { id: 42, view: 'crud_insert', title: '我要新增資料！', desc: '有新客戶 C06「台灣大」來了！我們用 INSERT 指令把它加進筆記本。', sql: "INSERT INTO 客戶表 VALUES ('C06', '台灣大', '02-1234-5678', '台北', '電信')" },
  { id: 43, view: 'crud_insert', title: '新增一筆訂單', desc: 'C06 剛下了一筆 5 萬元的「寬頻」訂單。記得公司編號要寫 C06，這樣才能連回去。', sql: "INSERT INTO 訂單表 VALUES ('ORD-107', 'C06', 50000, '寬頻', '2024-01-01', '進行中')" },
  { id: 44, view: 'crud_update', title: '糟糕！金額打錯了', desc: '剛剛那筆訂單其實是 8 萬元。我們用 UPDATE 來修正，一定要用 WHERE 鎖定訂單編號！', sql: "UPDATE 訂單表 SET 金額 = 80000 WHERE 訂單編號 = 'ORD-107'" },
  { id: 45, view: 'crud_disaster', title: '災難：忘了寫 WHERE', desc: '如果你只寫 UPDATE 但忘了寫 WHERE...悲劇發生！全公司所有訂單都變成 8 萬塊了！', sql: 'UPDATE 訂單表 SET 金額 = 80000', tip: '⚠️ 超級危險！' },
  { id: 46, view: 'crud_delete', title: '訂單取消了', desc: '客戶後悔了，這筆訂單要取消。我們用 DELETE 把它擦掉。資料會永遠消失喔！', sql: "DELETE FROM 訂單表 WHERE 訂單編號 = 'ORD-107'" },
  { id: 47, view: 'crud_disaster', title: '災難：無條件刪除', desc: '如果你寫 DELETE FROM 但忘了寫 WHERE...天啊！整本訂單筆記本變成空白的！', sql: 'DELETE FROM 訂單表', tip: '⚠️ 毀滅性操作！' },
  { id: 48, view: 'crud_protect', title: '外來鍵保護', desc: '如果我想刪除「C01 台積電」，但它還有訂單在右邊，資料庫會禁止刪除！資料庫會保護你不做傻事。' },
  { id: 49, view: 'summary', title: '全部學會了！', desc: '你已經學會了：SELECT (看)、INSERT (增)、UPDATE (改)、DELETE (刪)。這四個動作合稱 CRUD，是所有程式設計師的基本功。' },
  { id: 50, view: 'certificate', title: '大師證書', desc: '恭喜你完成 50 關修煉！你已經從 Excel 使用者進化成 SQL 資料庫大師了！' },
  { id: 51, view: 'final', title: '繼續冒險', desc: '雖然課程結束了，但你的 SQL 之路才剛開始。記住海姐說的：慢慢來，比較快。加油！' },
]

// === 模擬資料 ===
const companyData = [
  { id: 'C01', name: '台積電', phone: '03-578-1234', city: '新竹', industry: '半導體' },
  { id: 'C02', name: '鴻海', phone: '02-2268-5678', city: '新北', industry: '電子' },
  { id: 'C03', name: '聯發科', phone: '03-567-9012', city: '新竹', industry: '半導體' },
  { id: 'C04', name: '中華電', phone: '02-2344-1234', city: '台北', industry: '電信' },
  { id: 'C05', name: '富邦金', phone: '02-6636-1234', city: '台北', industry: '金融' },
]

const orderData = [
  { oid: 'ORD-101', cid: 'C01', amt: 500000, prod: '晶圓', date: '2023-10-01', status: '完成' },
  { oid: 'ORD-102', cid: 'C01', amt: 200000, prod: '測試', date: '2023-10-05', status: '進行中' },
  { oid: 'ORD-103', cid: 'C02', amt: 800000, prod: '設備', date: '2023-11-01', status: '完成' },
  { oid: 'ORD-104', cid: 'C03', amt: 150000, prod: '授權', date: '2023-11-20', status: '取消' },
  { oid: 'ORD-105', cid: 'C02', amt: 50000, prod: '線材', date: '2023-12-01', status: '完成' },
  { oid: 'ORD-106', cid: 'C04', amt: 12000, prod: '網路', date: '2023-12-05', status: '進行中' },
]

// 混合大表（正規化前的資料）
const masterData = [
  { name: '台積電', phone: '03-578-1234', prod: '晶圓', amt: 500000 },
  { name: '台積電', phone: '03-578-1234', prod: '測試', amt: 200000 },
  { name: '台積電', phone: '03-578-1234', prod: '設備', amt: 300000 },
  { name: '鴻海', phone: '02-2268-5678', prod: '設備', amt: 800000 },
  { name: '鴻海', phone: '02-2268-5678', prod: '線材', amt: 50000 },
]

// === 狀態 ===
const currentStep = ref(0)
const isTransitioning = ref(false)
const mounted = ref(false)
const animState = ref(0)

// SQL 互動狀態
const selectedCols = ref<number[]>([])
const sqlResult = ref<string>('')
const activeSheet = ref<'customers' | 'orders'>('customers')

// CRUD 動畫狀態
const crudAnimState = ref<'idle' | 'inserting' | 'updating' | 'deleting' | 'disaster'>('idle')
const newRowVisible = ref(false)

const stepData = computed(() => STEPS[currentStep.value])

// 根據當前 step 的 sheet 設定決定顯示哪張表
const currentSheet = computed(() => stepData.value.sheet || activeSheet.value)

// 根據 matchFn 過濾資料
const filteredData = computed((): any[] => {
  const step = stepData.value
  if (currentSheet.value === 'customers') {
    return step.matchFn ? companyData.filter(step.matchFn) : companyData
  } else {
    return step.matchFn ? orderData.filter(step.matchFn) : orderData
  }
})

onMounted(() => {
  mounted.value = true
  triggerStepAnimation()
})

watch(currentStep, () => {
  isTransitioning.value = true
  animState.value = 0
  selectedCols.value = []
  sqlResult.value = ''
  crudAnimState.value = 'idle'
  newRowVisible.value = false

  // 根據 step 設定切換表格
  if (stepData.value.sheet) {
    activeSheet.value = stepData.value.sheet
  }

  setTimeout(() => {
    isTransitioning.value = false
    triggerStepAnimation()
  }, 100)
})

function triggerStepAnimation() {
  const view = stepData.value.view

  // 基礎動畫：大部分 view 都用這個
  setTimeout(() => { animState.value = 1 }, 200)
  setTimeout(() => { animState.value = 2 }, 500)
  setTimeout(() => { animState.value = 3 }, 800)

  // 特殊動畫
  if (view === 'anim_split' || view === 'anim_moving') {
    setTimeout(() => { animState.value = 4 }, 1200)
    setTimeout(() => { animState.value = 5 }, 1600)
  }

  if (view === 'crud_insert') {
    setTimeout(() => { newRowVisible.value = true }, 800)
  }

  if (view === 'crud_disaster') {
    setTimeout(() => { crudAnimState.value = 'disaster' }, 600)
  }
}

// SQL 互動功能
const customerCols = ['公司編號', '公司名稱', '電話', '城市', '行業']
const orderCols = ['訂單編號', '公司編號', '金額', '產品', '日期', '狀態']

function toggleColumn(colIndex: number) {
  if (selectedCols.value.includes(colIndex)) {
    selectedCols.value = selectedCols.value.filter(c => c !== colIndex)
  } else {
    selectedCols.value = [...selectedCols.value, colIndex].sort()
  }
  updateSqlResult()
}

function selectAll() {
  const cols = currentSheet.value === 'customers' ? customerCols : orderCols
  selectedCols.value = cols.map((_, i) => i)
  updateSqlResult()
}

function switchSheet(sheet: 'customers' | 'orders') {
  activeSheet.value = sheet
  selectedCols.value = []
  updateSqlResult()
}

function updateSqlResult() {
  const cols = currentSheet.value === 'customers' ? customerCols : orderCols
  const tableName = currentSheet.value === 'customers' ? '客戶表' : '訂單表'

  if (selectedCols.value.length === 0) {
    sqlResult.value = `SELECT * FROM ${tableName}`
    return
  }

  const selected = selectedCols.value.map(i => cols[i])

  if (selectedCols.value.length === cols.length) {
    sqlResult.value = `SELECT * FROM ${tableName}`
  } else {
    sqlResult.value = `SELECT ${selected.join(', ')} FROM ${tableName}`
  }

  // 加上 WHERE 條件（如果有）
  if (stepData.value.sql && stepData.value.sql.startsWith('WHERE')) {
    sqlResult.value += ` ${stepData.value.sql}`
  }
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
</script>

<template>
  <InteractiveSlideTemplate
    title="資料庫入門"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="purple"
    @prev="prevStep"
    @next="nextStep"
    @complete="handleComplete"
  >
    <!-- 自訂 Header Icon -->
    <template #icon>
      <div class="relative">
        <span class="text-2xl md:text-3xl">🗄️</span>
        <div class="absolute -right-1 -top-1 h-2 w-2 animate-pulse-slow rounded-full bg-purple-400"></div>
      </div>
    </template>

    <!-- 主要內容區 -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- 背景動畫 -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="animate-float-slow absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div class="animate-float-slower absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-sky-500/10 blur-3xl"></div>
      </div>

      <!-- ========== INTRO VIEW ========== -->
      <div v-if="stepData.view === 'intro'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- 對比卡片 -->
          <div class="flex flex-col gap-4 md:flex-row md:gap-8">
            <!-- Excel -->
            <div
              class="transition-all duration-700"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="relative w-40 md:w-48">
                <div class="absolute -inset-2 rounded-2xl bg-green-500/20 blur-lg"></div>
                <div class="relative rounded-2xl border-2 border-green-500/50 bg-slate-900 p-4 text-center">
                  <div class="text-4xl md:text-5xl">📊</div>
                  <div class="mt-2 font-bold text-green-400">Excel</div>
                  <div class="mt-1 text-xs text-slate-400">小鉛筆盒</div>
                  <div class="mt-2 text-xs text-slate-500">適合幾百筆資料</div>
                </div>
              </div>
            </div>

            <!-- VS -->
            <div
              class="flex items-center justify-center transition-all delay-200 duration-500"
              :class="animState >= 2 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
            >
              <div class="text-2xl text-slate-400">→</div>
            </div>

            <!-- 資料庫 -->
            <div
              class="transition-all delay-300 duration-700"
              :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="relative w-40 md:w-48">
                <div class="absolute -inset-2 rounded-2xl bg-purple-500/20 blur-lg"></div>
                <div class="relative rounded-2xl border-2 border-purple-500/50 bg-slate-900 p-4 text-center">
                  <div class="text-4xl md:text-5xl">🗄️</div>
                  <div class="mt-2 font-bold text-purple-400">資料庫</div>
                  <div class="mt-1 text-xs text-slate-400">超級大書包</div>
                  <div class="mt-2 text-xs text-slate-500">處理百萬筆資料</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 說明 -->
          <div
            class="transition-all delay-500 duration-700"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-2xl border border-purple-500/30 bg-slate-900/90 px-6 py-4 text-center">
              <div class="text-sm text-slate-300 md:text-base">
                為了讓你更熟悉 LiveFit 的系統，<br class="md:hidden" />我們先用<span class="font-bold text-purple-400">公司訂單</span>的例子來學習資料庫
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== TABLE VIEW ========== -->
      <div v-if="stepData.view === 'table'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <!-- 客戶表 -->
          <div
            class="w-full transition-all duration-700"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <div class="overflow-hidden rounded-2xl border-2 border-sky-500/50 bg-slate-900">
              <div class="border-b border-slate-700 bg-sky-500/10 px-4 py-2">
                <div class="flex items-center gap-2">
                  <span class="text-lg">👥</span>
                  <span class="font-bold text-sky-400">公司資料表 (customers)</span>
                </div>
              </div>
              <table class="w-full text-sm">
                <thead class="bg-slate-800 text-slate-400">
                  <tr>
                    <th class="px-4 py-2 text-left">公司編號</th>
                    <th class="px-4 py-2 text-left">公司名稱</th>
                    <th class="px-4 py-2 text-left">電話</th>
                    <th class="px-4 py-2 text-left">城市</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in companyData.slice(0, 3)" :key="i" class="border-t border-slate-800">
                    <td class="px-4 py-2 font-mono text-sky-400">{{ row.id }}</td>
                    <td class="px-4 py-2 text-white">{{ row.name }}</td>
                    <td class="px-4 py-2 text-slate-400">{{ row.phone }}</td>
                    <td class="px-4 py-2 text-slate-400">{{ row.city }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 訂單表 -->
          <div
            class="w-full transition-all delay-300 duration-700"
            :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <div class="overflow-hidden rounded-2xl border-2 border-purple-500/50 bg-slate-900">
              <div class="border-b border-slate-700 bg-purple-500/10 px-4 py-2">
                <div class="flex items-center gap-2">
                  <span class="text-lg">📦</span>
                  <span class="font-bold text-purple-400">訂單紀錄表 (orders)</span>
                </div>
              </div>
              <table class="w-full text-sm">
                <thead class="bg-slate-800 text-slate-400">
                  <tr>
                    <th class="px-4 py-2 text-left">訂單編號</th>
                    <th class="px-4 py-2 text-left">客戶編號</th>
                    <th class="px-4 py-2 text-left">產品</th>
                    <th class="px-4 py-2 text-left">金額</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in orderData.slice(0, 3)" :key="i" class="border-t border-slate-800">
                    <td class="px-4 py-2 font-mono text-purple-400">{{ row.oid }}</td>
                    <td class="px-4 py-2 font-mono text-sky-400">{{ row.cid }}</td>
                    <td class="px-4 py-2 text-white">{{ row.prod }}</td>
                    <td class="px-4 py-2 text-emerald-400">{{ row.amt.toLocaleString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 提示 -->
          <div
            class="transition-all delay-500 duration-700"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-300">
              💡 不同種類的資料放不同表格，才不會亂成一團
            </div>
          </div>
        </div>
      </div>

      <!-- ========== PK VIEW ========== -->
      <div v-if="stepData.view === 'pk'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-lg flex-col items-center gap-6">
          <!-- 主鍵說明 -->
          <div
            class="w-full transition-all duration-700"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-amber-500/20 blur-xl"></div>
              <div class="relative rounded-2xl border-2 border-amber-500/50 bg-slate-900 p-6 text-center">
                <div class="text-5xl">🔑</div>
                <div class="mt-3 text-xl font-bold text-amber-400">Primary Key (主鍵)</div>
                <div class="mt-2 text-sm text-slate-400">每筆資料的唯一識別碼</div>
              </div>
            </div>
          </div>

          <!-- 範例 -->
          <div
            class="w-full space-y-3 transition-all delay-300 duration-700"
            :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <!-- 正確範例 -->
            <div class="flex items-center gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div class="text-2xl">✅</div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="rounded bg-amber-500/20 px-2 py-1 font-mono text-sm font-bold text-amber-400">C01</span>
                  <span class="text-white">台積電</span>
                </div>
              </div>
              <div class="text-xs text-emerald-400">唯一編號</div>
            </div>

            <!-- 錯誤範例 -->
            <div class="flex items-center gap-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <div class="text-2xl">❌</div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="rounded bg-red-500/20 px-2 py-1 font-mono text-sm font-bold text-red-400 line-through">C01</span>
                  <span class="text-slate-400">聯發科</span>
                </div>
              </div>
              <div class="text-xs text-red-400">編號重複！禁止！</div>
            </div>
          </div>

          <!-- 提示 -->
          <div
            class="transition-all delay-500 duration-700"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-center text-sm text-purple-300">
              就像每個人都有不同的身分證號碼，資料庫也不允許主鍵重複
            </div>
          </div>
        </div>
      </div>

      <!-- ========== SPLIT VIEW ========== -->
      <div v-if="stepData.view === 'split'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-4">
          <!-- 拆分前 -->
          <div
            class="w-full transition-all duration-700"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <div class="mb-2 text-center text-sm text-rose-400">❌ 拆分前：同樣的資料重複寫好幾次</div>
            <div class="overflow-hidden rounded-xl border border-rose-500/30 bg-slate-900/80">
              <table class="w-full text-xs md:text-sm">
                <thead class="bg-rose-500/10 text-slate-400">
                  <tr>
                    <th class="px-3 py-2 text-left">公司名稱</th>
                    <th class="px-3 py-2 text-left">電話</th>
                    <th class="px-3 py-2 text-left">訂單</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-t border-slate-800">
                    <td class="px-3 py-2 text-rose-400">台積電</td>
                    <td class="px-3 py-2 text-rose-400">03-578-1234</td>
                    <td class="px-3 py-2 text-slate-400">晶圓</td>
                  </tr>
                  <tr class="border-t border-slate-800">
                    <td class="px-3 py-2 text-rose-400">台積電</td>
                    <td class="px-3 py-2 text-rose-400">03-578-1234</td>
                    <td class="px-3 py-2 text-slate-400">測試</td>
                  </tr>
                  <tr class="border-t border-slate-800">
                    <td class="px-3 py-2 text-rose-400">台積電</td>
                    <td class="px-3 py-2 text-rose-400">03-578-1234</td>
                    <td class="px-3 py-2 text-slate-400">設備</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 剪刀動畫 -->
          <div
            class="transition-all delay-300 duration-500"
            :class="animState >= 2 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
          >
            <div class="flex items-center gap-2 rounded-full bg-cyan-500/20 px-4 py-2 text-cyan-400">
              <span class="text-xl">✂️</span>
              <span class="text-sm font-bold">拆分表格</span>
            </div>
          </div>

          <!-- 拆分後 -->
          <div
            class="flex w-full flex-col gap-3 transition-all delay-500 duration-700 md:flex-row"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <!-- 客戶表 -->
            <div class="flex-1 overflow-hidden rounded-xl border border-sky-500/30 bg-slate-900/80">
              <div class="bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-400">👥 客戶表</div>
              <table class="w-full text-xs">
                <thead class="bg-slate-800 text-slate-400">
                  <tr>
                    <th class="px-2 py-1 text-left">ID</th>
                    <th class="px-2 py-1 text-left">名稱</th>
                    <th class="px-2 py-1 text-left">電話</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-t border-slate-800">
                    <td class="px-2 py-1 font-mono text-amber-400">C01</td>
                    <td class="px-2 py-1 text-emerald-400">台積電</td>
                    <td class="px-2 py-1 text-slate-400">03-578...</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 訂單表 -->
            <div class="flex-1 overflow-hidden rounded-xl border border-purple-500/30 bg-slate-900/80">
              <div class="bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400">📦 訂單表</div>
              <table class="w-full text-xs">
                <thead class="bg-slate-800 text-slate-400">
                  <tr>
                    <th class="px-2 py-1 text-left">訂單</th>
                    <th class="px-2 py-1 text-left">客戶ID</th>
                    <th class="px-2 py-1 text-left">產品</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(p, i) in ['晶圓', '測試', '設備']" :key="i" class="border-t border-slate-800">
                    <td class="px-2 py-1 font-mono text-slate-400">ORD-{{ 101 + i }}</td>
                    <td class="px-2 py-1 font-mono text-amber-400">C01</td>
                    <td class="px-2 py-1 text-slate-300">{{ p }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 提示 -->
          <div
            class="transition-all delay-700 duration-700"
            :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-center text-sm text-emerald-300">
              ✅ 拆分後：台積電只寫一次，乾淨又省空間！
            </div>
          </div>
        </div>
      </div>

      <!-- ========== FK VIEW ========== -->
      <div v-if="stepData.view === 'fk'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6">
          <!-- 外來鍵說明 -->
          <div
            class="transition-all duration-700"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-purple-500/20 blur-xl"></div>
              <div class="relative rounded-2xl border-2 border-purple-500/50 bg-slate-900 p-6 text-center">
                <div class="text-5xl">🔗</div>
                <div class="mt-3 text-xl font-bold text-purple-400">Foreign Key (外來鍵)</div>
                <div class="mt-2 text-sm text-slate-400">連接兩張表的傳送門</div>
              </div>
            </div>
          </div>

          <!-- 連結示意圖 -->
          <div
            class="flex w-full items-center justify-center gap-4 transition-all delay-300 duration-700"
            :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <!-- 訂單表 -->
            <div class="rounded-xl border border-purple-500/30 bg-slate-900 p-3">
              <div class="mb-2 text-xs font-bold text-purple-400">訂單表</div>
              <div class="rounded bg-slate-800 px-3 py-2">
                <span class="text-slate-400">客戶編號: </span>
                <span class="animate-pulse rounded bg-amber-500/20 px-2 py-1 font-mono font-bold text-amber-400">C01</span>
              </div>
            </div>

            <!-- 箭頭 -->
            <div class="flex flex-col items-center">
              <div class="text-2xl text-purple-400">→</div>
              <div class="text-xs text-purple-400">連結</div>
            </div>

            <!-- 客戶表 -->
            <div class="rounded-xl border border-sky-500/30 bg-slate-900 p-3">
              <div class="mb-2 text-xs font-bold text-sky-400">客戶表</div>
              <div class="rounded bg-slate-800 px-3 py-2">
                <span class="rounded bg-amber-500/20 px-2 py-1 font-mono font-bold text-amber-400">C01</span>
                <span class="ml-2 text-white">台積電</span>
              </div>
            </div>
          </div>

          <!-- 說明 -->
          <div
            class="transition-all delay-500 duration-700"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-2xl border border-purple-500/30 bg-purple-500/10 px-6 py-4 text-center">
              <div class="text-sm text-purple-300 md:text-base">
                電腦看到 <span class="font-mono font-bold text-amber-400">C01</span>，就會自動去客戶表找到<span class="font-bold text-sky-400">台積電</span>
              </div>
              <div class="mt-2 text-xs text-slate-400">
                這就是為什麼叫做「關聯式」資料庫！
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== SQL VIEW ========== -->
      <div v-if="stepData.view === 'sql'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <!-- SQL 三元素 -->
          <div
            class="flex w-full flex-wrap justify-center gap-3 transition-all duration-700"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <div class="rounded-xl border border-pink-500/30 bg-pink-500/10 px-4 py-3 text-center">
              <div class="font-mono text-lg font-bold text-pink-400">SELECT</div>
              <div class="text-xs text-slate-400">選哪些欄位</div>
            </div>
            <div class="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-center">
              <div class="font-mono text-lg font-bold text-indigo-400">FROM</div>
              <div class="text-xs text-slate-400">從哪張表</div>
            </div>
            <div class="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-center">
              <div class="font-mono text-lg font-bold text-rose-400">WHERE</div>
              <div class="text-xs text-slate-400">篩選條件</div>
            </div>
          </div>

          <!-- 互動表格 -->
          <div
            class="w-full transition-all delay-200 duration-700"
            :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="mb-2 flex items-center justify-between">
              <div class="text-xs text-slate-400">👆 點擊欄位試試看</div>
              <button
                @click="selectAll"
                class="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400 transition-colors hover:bg-amber-500/30"
              >
                ⭐ 全選 (SELECT *)
              </button>
            </div>
            <div class="overflow-hidden rounded-xl border border-sky-500/30 bg-slate-900">
              <table class="w-full text-sm">
                <thead class="bg-slate-800">
                  <tr>
                    <th
                      v-for="(col, i) in ['公司編號', '公司名稱', '電話', '城市']"
                      :key="i"
                      @click="toggleColumn(i)"
                      class="cursor-pointer px-4 py-2 text-left transition-colors"
                      :class="selectedCols.includes(i) ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400 hover:bg-slate-700'"
                    >
                      {{ col }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in companyData" :key="i" class="border-t border-slate-800">
                    <td
                      class="px-4 py-2 font-mono transition-opacity"
                      :class="selectedCols.length === 0 || selectedCols.includes(0) ? 'text-sky-400' : 'text-slate-600 opacity-30'"
                    >{{ row.id }}</td>
                    <td
                      class="px-4 py-2 transition-opacity"
                      :class="selectedCols.length === 0 || selectedCols.includes(1) ? 'text-white' : 'text-slate-600 opacity-30'"
                    >{{ row.name }}</td>
                    <td
                      class="px-4 py-2 transition-opacity"
                      :class="selectedCols.length === 0 || selectedCols.includes(2) ? 'text-slate-300' : 'text-slate-600 opacity-30'"
                    >{{ row.phone }}</td>
                    <td
                      class="px-4 py-2 transition-opacity"
                      :class="selectedCols.length === 0 || selectedCols.includes(3) ? 'text-slate-300' : 'text-slate-600 opacity-30'"
                    >{{ row.city }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- SQL 結果 -->
          <div
            class="w-full transition-all delay-400 duration-700"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-slate-700 bg-black p-4">
              <div class="mb-2 flex items-center gap-2 text-xs text-emerald-500">
                <span>💻</span>
                <span>SQL 語法</span>
              </div>
              <pre class="font-mono text-sm">
<span class="text-pink-400">{{ sqlResult || 'SELECT ...' }}</span>
              </pre>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== SUMMARY VIEW ========== -->
      <div v-if="stepData.view === 'summary'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- 核心概念 -->
          <div
            class="transition-all duration-700"
            :class="animState >= 1 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-6 rounded-3xl bg-gradient-to-r from-purple-500/20 to-sky-500/20 blur-2xl"></div>
              <div class="relative overflow-hidden rounded-3xl border-2 border-purple-500/50 bg-slate-900 p-6 md:p-8">
                <div class="text-center">
                  <div class="text-5xl md:text-6xl">🗄️</div>
                  <div class="mt-4 text-xl font-bold text-white md:text-2xl">資料庫四大觀念</div>
                </div>

                <!-- 觀念列表 -->
                <div
                  class="mt-6 space-y-3 transition-all delay-300 duration-500"
                  :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
                >
                  <div class="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                    <span class="text-xl">📊</span>
                    <div class="flex-1">
                      <div class="font-bold text-white">資料表 (Table)</div>
                      <div class="text-xs text-slate-400">分類存放不同資料</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                    <span class="text-xl">🔑</span>
                    <div class="flex-1">
                      <div class="font-bold text-amber-400">主鍵 (Primary Key)</div>
                      <div class="text-xs text-slate-400">唯一識別每筆資料</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                    <span class="text-xl">🔗</span>
                    <div class="flex-1">
                      <div class="font-bold text-purple-400">外來鍵 (Foreign Key)</div>
                      <div class="text-xs text-slate-400">連接不同表格</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                    <span class="text-xl">💻</span>
                    <div class="flex-1">
                      <div class="font-bold text-pink-400">SQL 語法</div>
                      <div class="text-xs text-slate-400">SELECT / FROM / WHERE</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 結語 -->
          <div
            class="transition-all delay-500 duration-700"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 text-center">
              <div class="text-sm text-emerald-300 md:text-base">
                🎉 掌握這些概念，你就能跟資料庫好好相處了！
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== ANIM MASTER/PAIN/ERROR/SPLIT/MOVING/CODES/LINK/SYNC + PK_CONCEPT/TYPE_CONCEPT VIEW (統一架構) ========== -->
      <div v-if="stepData.view === 'anim_master' || stepData.view === 'anim_pain' || stepData.view === 'anim_error' || stepData.view === 'anim_split' || stepData.view === 'anim_moving' || stepData.view === 'anim_codes' || stepData.view === 'anim_link' || stepData.view === 'anim_sync' || stepData.view === 'pk_concept' || stepData.view === 'type_concept'" class="relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-4 py-6 md:p-6">
        <div class="relative z-10 flex w-full max-w-4xl flex-col items-center gap-4">

          <!-- ★★★ 表格數量指示器（固定在上方） ★★★ -->
          <div class="sticky top-0 z-20 w-full rounded-xl border border-slate-700 bg-slate-900/95 p-3 backdrop-blur">
            <div class="flex items-center justify-between">
              <div class="text-xs text-slate-400">目前的資料表：</div>
              <div class="flex items-center gap-3">
                <!-- 原始大表（Step 2-8 顯示，之後隱藏） -->
                <div v-if="stepData.view === 'anim_master' || stepData.view === 'anim_pain' || stepData.view === 'anim_error' || stepData.view === 'anim_split' || stepData.view === 'pk_concept' || stepData.view === 'type_concept'" class="flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5">
                  <span class="text-base">📊</span>
                  <span class="text-sm font-medium text-slate-300">公司訂單總表</span>
                  <span class="rounded bg-rose-500/20 px-1.5 py-0.5 text-xs text-rose-400">混在一起</span>
                </div>
                <!-- 客戶表（Step 9 開始出現） -->
                <div v-if="stepData.view === 'anim_moving' || stepData.view === 'anim_codes' || stepData.view === 'anim_link' || stepData.view === 'anim_sync'" class="flex items-center gap-1.5 rounded-lg border-2 border-sky-500/50 bg-sky-500/10 px-3 py-1.5">
                  <span class="text-base">👥</span>
                  <span class="text-sm font-medium text-sky-400">客戶表</span>
                </div>
                <!-- 訂單表（Step 10 開始出現） -->
                <div v-if="stepData.view === 'anim_codes' || stepData.view === 'anim_link' || stepData.view === 'anim_sync'" class="flex items-center gap-1.5 rounded-lg border-2 border-purple-500/50 bg-purple-500/10 px-3 py-1.5">
                  <span class="text-base">📦</span>
                  <span class="text-sm font-medium text-purple-400">訂單表</span>
                </div>
                <!-- 表格數量 -->
                <div class="ml-2 flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1">
                  <span class="text-lg font-bold" :class="stepData.view === 'anim_moving' || stepData.view === 'anim_codes' || stepData.view === 'anim_link' || stepData.view === 'anim_sync' ? 'text-emerald-400' : 'text-rose-400'">
                    {{ stepData.view === 'anim_moving' || stepData.view === 'anim_codes' || stepData.view === 'anim_link' || stepData.view === 'anim_sync' ? '2' : '1' }}
                  </span>
                  <span class="text-xs text-slate-400">張表</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ===== Step 2-7: anim_master/pain/error/pk_concept/type_concept 展示問題 ===== -->
          <template v-if="stepData.view === 'anim_master' || stepData.view === 'anim_pain' || stepData.view === 'anim_error' || stepData.view === 'pk_concept' || stepData.view === 'type_concept'">
            <!-- 標題區塊 -->
            <div class="w-full text-center transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'">
              <div v-if="stepData.view === 'anim_master'" class="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2">
                <span class="text-xl">📊</span>
                <span class="font-bold text-slate-200">這是公司目前用的 Excel 大表</span>
              </div>
              <div v-else-if="stepData.view === 'pk_concept'" class="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-2">
                <span class="text-xl">🔑</span>
                <span class="font-bold text-amber-300">主鍵 (Primary Key)：每筆資料的身分證</span>
              </div>
              <div v-else-if="stepData.view === 'type_concept'" class="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 px-4 py-2">
                <span class="text-xl">🔢</span>
                <span class="font-bold text-cyan-300">資料型態 (Data Type)：欄位的規矩</span>
              </div>
              <div v-else-if="stepData.view === 'anim_pain'" class="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-2">
                <span class="text-xl">😫</span>
                <span class="font-bold text-amber-300">問題一：重複輸入好累</span>
              </div>
              <div v-else-if="stepData.view === 'anim_error'" class="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2">
                <span class="text-xl">💥</span>
                <span class="font-bold text-red-300">問題二：改資料會出錯</span>
              </div>
            </div>

            <!-- Excel 大表 -->
            <div class="w-full transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'">
              <div class="overflow-hidden rounded-xl border-2 bg-slate-900" :class="[
                stepData.view === 'anim_master' ? 'border-slate-600' :
                stepData.view === 'pk_concept' ? 'border-amber-500/50' :
                stepData.view === 'type_concept' ? 'border-cyan-500/50' :
                stepData.view === 'anim_pain' ? 'border-amber-500/50' :
                'border-red-500/50'
              ]">
                <!-- Excel 風格標題列 -->
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800/50 px-3 py-2">
                  <div class="flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <span class="ml-2 text-xs text-slate-500">公司訂單總表.xlsx</span>
                </div>

                <table class="w-full text-xs md:text-sm">
                  <thead class="bg-slate-800/30 text-slate-400">
                    <tr>
                      <!-- 所有 step 2-7 都顯示公司編號欄位，保持表格一致 -->
                      <th class="border-r border-slate-700 px-3 py-2 text-left transition-all duration-500"
                          :class="stepData.view === 'pk_concept' && animState >= 2 ? 'bg-amber-500/20 text-amber-400' : ''">
                        🔑 公司編號
                      </th>
                      <th class="border-r border-slate-700 px-3 py-2 text-left">公司名稱</th>
                      <th class="border-r border-slate-700 px-3 py-2 text-left">電話</th>
                      <th class="border-r border-slate-700 px-3 py-2 text-left">產品</th>
                      <th class="px-3 py-2 text-left transition-all duration-500"
                          :class="stepData.view === 'type_concept' && animState >= 2 ? 'bg-cyan-500/20 text-cyan-400' : ''">
                        金額
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- 第 1~3 列：台積電（重複資料） -->
                    <tr v-for="(row, i) in masterData.slice(0, 3)" :key="'tsmc-' + i"
                        class="border-t border-slate-800 transition-all duration-500"
                        :class="[
                          stepData.view === 'anim_pain' && animState >= 2 ? 'bg-amber-500/10' : '',
                          stepData.view === 'anim_error' && animState >= 2 ? (i === 0 ? 'bg-emerald-500/10' : 'bg-red-500/10') : '',
                          stepData.view === 'pk_concept' && animState >= 2 && i === 2 ? 'bg-red-500/10' : '',
                          stepData.view === 'type_concept' && animState >= 2 && i === 1 ? 'bg-red-500/10' : ''
                        ]">
                      <!-- 公司編號欄位（所有 step 2-7 都顯示） -->
                      <td class="border-r border-slate-700 px-3 py-2 font-mono transition-all duration-500"
                          :class="[
                            stepData.view === 'pk_concept' && animState >= 2 ? 'bg-amber-500/10' : '',
                            stepData.view === 'pk_concept' && animState >= 2 && i === 2 ? 'text-red-400' : 'text-amber-400'
                          ]">
                        <!-- pk_concept：展示主鍵概念，第三列故意用錯誤的編號 -->
                        <template v-if="stepData.view === 'pk_concept' && animState >= 2">
                          <span v-if="i === 0">C01 <span class="text-emerald-400 text-xs">← 台積電專屬</span></span>
                          <span v-else-if="i === 1">C01</span>
                          <span v-else class="text-red-400">C01 <span class="text-red-400 text-xs">← 想給聯發科用？</span></span>
                        </template>
                        <template v-else>C01</template>
                      </td>
                      <td class="border-r border-slate-700 px-3 py-2 transition-all duration-500" :class="[
                        stepData.view === 'anim_master' && animState >= 2 ? 'text-rose-400 font-bold' : 'text-slate-300',
                        stepData.view === 'anim_pain' && animState >= 2 ? 'text-amber-400 font-bold' : '',
                        stepData.view === 'anim_error' ? 'text-slate-300' : '',
                        stepData.view === 'pk_concept' && animState >= 2 && i === 2 ? 'text-red-400 font-bold' : ''
                      ]">
                        <!-- pk_concept：第三列顯示為聯發科，展示主鍵衝突 -->
                        <template v-if="stepData.view === 'pk_concept' && animState >= 2 && i === 2">
                          <span class="text-red-400">聯發科</span> <span class="text-red-400 text-xs">← 新公司</span>
                        </template>
                        <template v-else>
                          {{ row.name }}
                        </template>
                        <span v-if="stepData.view === 'anim_pain' && animState >= 2" class="ml-1 text-xs text-amber-500">← 又寫一次</span>
                      </td>
                      <td class="border-r border-slate-700 px-3 py-2 transition-all duration-500" :class="[
                        stepData.view === 'anim_master' && animState >= 2 ? 'text-rose-400 font-bold' : 'text-slate-400',
                        stepData.view === 'anim_pain' && animState >= 2 ? 'text-amber-400 font-bold' : '',
                        stepData.view === 'anim_error' && animState >= 2 ? (i === 0 ? 'text-emerald-400 font-bold' : 'text-red-400') : ''
                      ]">
                        <template v-if="stepData.view === 'anim_error' && animState >= 2">
                          <span v-if="i === 0">03-578-<span class="line-through text-red-400/60">1234</span><span class="text-emerald-400">5678</span> ✓</span>
                          <span v-else>{{ row.phone }} <span class="text-red-400">✗</span></span>
                        </template>
                        <template v-else>{{ row.phone }}</template>
                      </td>
                      <td class="border-r border-slate-700 px-3 py-2 text-slate-300">{{ row.prod }}</td>
                      <td class="px-3 py-2 transition-all duration-500" :class="[
                        stepData.view === 'type_concept' && animState >= 2 ? 'bg-cyan-500/10' : '',
                        stepData.view === 'type_concept' && animState >= 2 && i === 1 ? 'text-red-400' : 'text-emerald-400'
                      ]">
                        <template v-if="stepData.view === 'type_concept' && animState >= 2">
                          <span v-if="i === 0">{{ row.amt.toLocaleString() }} <span class="text-emerald-400">✓</span></span>
                          <span v-else-if="i === 1" class="text-red-400"><span class="line-through">"五十萬"</span> ✗</span>
                          <span v-else>{{ row.amt.toLocaleString() }} <span class="text-emerald-400">✓</span></span>
                        </template>
                        <template v-else>{{ row.amt.toLocaleString() }}</template>
                      </td>
                    </tr>
                    <!-- 第 4~5 列：鴻海 -->
                    <tr v-for="(row, i) in masterData.slice(3, 5)" :key="'hon-' + i" class="border-t border-slate-800">
                      <!-- 公司編號欄位（所有 step 2-7 都顯示） -->
                      <td class="border-r border-slate-700 px-3 py-2 font-mono text-sky-400">
                        C02
                      </td>
                      <td class="border-r border-slate-700 px-3 py-2 transition-all duration-500" :class="[
                        stepData.view === 'anim_master' && animState >= 2 ? 'text-sky-400 font-bold' : 'text-slate-300'
                      ]">{{ row.name }}</td>
                      <td class="border-r border-slate-700 px-3 py-2 transition-all duration-500" :class="[
                        stepData.view === 'anim_master' && animState >= 2 ? 'text-sky-400 font-bold' : 'text-slate-400'
                      ]">{{ row.phone }}</td>
                      <td class="border-r border-slate-700 px-3 py-2 text-slate-300">{{ row.prod }}</td>
                      <td class="px-3 py-2 text-emerald-400">{{ row.amt.toLocaleString() }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 動畫提示區 -->
            <div class="w-full transition-all delay-500 duration-700" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <!-- anim_master: 觀察重複 -->
              <div v-if="stepData.view === 'anim_master'" class="rounded-xl border border-slate-600 bg-slate-800/50 p-4">
                <div class="flex items-start gap-3">
                  <div class="text-2xl">🔍</div>
                  <div>
                    <div class="font-bold text-slate-200 mb-1">仔細看看這張表格...</div>
                    <div class="text-sm text-slate-400">
                      <span class="text-rose-400 font-bold">台積電</span> 出現了 <span class="text-rose-400 font-bold">3 次</span>，
                      <span class="text-sky-400 font-bold">鴻海</span> 出現了 <span class="text-sky-400 font-bold">2 次</span>。<br/>
                      每次下單都要重複輸入公司名稱和電話...這樣對嗎？
                    </div>
                  </div>
                </div>
              </div>

              <!-- anim_pain: 重複輸入的痛苦 -->
              <div v-if="stepData.view === 'anim_pain'" class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <div class="flex items-start gap-3">
                  <div class="text-2xl animate-bounce">✍️</div>
                  <div>
                    <div class="font-bold text-amber-300 mb-1">手好痠的問題</div>
                    <div class="text-sm text-amber-200/80">
                      台積電下 3 筆訂單 → 名字寫 3 次、電話寫 3 次<br/>
                      如果下 100 筆訂單 → 名字寫 100 次、電話寫 100 次！<br/>
                      <span class="text-amber-400 font-bold">這不是浪費時間嗎？</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- anim_error: 改資料的災難 -->
              <div v-if="stepData.view === 'anim_error'" class="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <div class="flex items-start gap-3">
                  <div class="text-2xl">☎️</div>
                  <div>
                    <div class="font-bold text-red-300 mb-1">改電話的災難</div>
                    <div class="text-sm text-red-200/80">
                      假設台積電換了新電話 <span class="text-emerald-400 font-bold">03-578-5678</span><br/>
                      你必須找到每一筆訂單，一個一個改...<br/>
                      <span class="text-red-400 font-bold">漏改一個，資料就會不一致！</span><br/>
                      上面的表格中，只有第 1 列改成功，其他都忘了改 😱
                    </div>
                  </div>
                </div>
              </div>

              <!-- pk_concept: 主鍵說明 -->
              <div v-if="stepData.view === 'pk_concept'" class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <div class="flex items-start gap-3">
                  <div class="text-2xl">🔑</div>
                  <div>
                    <div class="font-bold text-amber-300 mb-1">主鍵 = 身分證號碼</div>
                    <div class="text-sm text-amber-200/80">
                      看上面的表格，每間公司都需要一個<span class="text-amber-400 font-bold">唯一的編號</span>。<br/>
                      <span class="text-emerald-400">C01</span> 已經給台積電了，第三筆如果又用 <span class="text-red-400">C01</span>？<br/>
                      <span class="text-red-400 font-bold">❌ 禁止！主鍵絕對不能重複！</span><br/>
                      就像兩個人不能有一樣的身分證號碼。
                    </div>
                  </div>
                </div>
              </div>

              <!-- type_concept: 資料型態說明 -->
              <div v-if="stepData.view === 'type_concept'" class="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">
                <div class="flex items-start gap-3">
                  <div class="text-2xl">🔢</div>
                  <div>
                    <div class="font-bold text-cyan-300 mb-1">資料型態 = 欄位的規矩</div>
                    <div class="text-sm text-cyan-200/80">
                      看上面金額欄位，資料庫規定<span class="text-cyan-400 font-bold">金額只能是數字</span>。<br/>
                      如果有人不小心輸入 <span class="text-red-400">"五十萬"</span>（文字）？<br/>
                      <span class="text-red-400 font-bold">❌ 被擋下來！資料庫會報錯！</span><br/>
                      這就是資料庫嚴格的地方，能保護資料正確性。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- ===== Step 8: anim_split 剪開表格（有動畫！） ===== -->
          <template v-if="stepData.view === 'anim_split'">
            <!-- 標題 -->
            <div class="text-center transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'">
              <div class="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 px-4 py-2">
                <span class="text-xl" :class="animState >= 2 ? 'animate-bounce' : ''">✂️</span>
                <span class="font-bold text-cyan-300">我們要把這張大表「剪」成兩張</span>
              </div>
            </div>

            <!-- 剪切動畫容器 -->
            <div class="relative w-full">
              <!-- 原始大表 -->
              <div
                class="overflow-hidden rounded-xl border-2 bg-slate-900 transition-all duration-700"
                :class="animState >= 3 ? 'border-rose-500/50 opacity-50 scale-95' : 'border-slate-600'"
              >
                <!-- Excel 風格標題列 -->
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800/50 px-3 py-2">
                  <div class="flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <span class="ml-2 text-xs text-slate-500">公司訂單總表.xlsx</span>
                  <span v-if="animState >= 3" class="ml-auto rounded bg-rose-500/20 px-2 py-0.5 text-xs text-rose-400">即將分割...</span>
                </div>

                <table class="w-full text-xs md:text-sm">
                  <thead class="bg-slate-800/30">
                    <tr>
                      <!-- 公司編號欄位（藍色標記，會歸到客戶表） -->
                      <th
                        class="px-3 py-2 text-left transition-all duration-500"
                        :class="animState >= 2 ? 'border-r-2 border-cyan-500 bg-sky-500/20 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]' : 'border-r border-slate-700 bg-sky-500/10 text-sky-400'"
                      >
                        🔑 公司編號 <span class="text-xs">👥</span>
                      </th>
                      <!-- 客戶資料欄位（藍色標記）- 動畫高亮 -->
                      <th
                        class="px-3 py-2 text-left transition-all duration-500"
                        :class="animState >= 2 ? 'border-r-2 border-cyan-500 bg-sky-500/20 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]' : 'border-r border-slate-700 bg-sky-500/10 text-sky-400'"
                      >
                        公司名稱 <span class="text-xs">👥</span>
                      </th>
                      <th
                        class="px-3 py-2 text-left transition-all duration-500"
                        :class="animState >= 2 ? 'border-r-2 border-cyan-500 bg-sky-500/20 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]' : 'border-r border-slate-700 bg-sky-500/10 text-sky-400'"
                      >
                        電話 <span class="text-xs">👥</span>
                      </th>
                      <!-- 訂單資料欄位（紫色標記）- 動畫高亮 -->
                      <th
                        class="px-3 py-2 text-left transition-all duration-500"
                        :class="animState >= 2 ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-purple-500/10 text-purple-400'"
                      >
                        產品 <span class="text-xs">📦</span>
                      </th>
                      <th
                        class="px-3 py-2 text-left transition-all duration-500"
                        :class="animState >= 2 ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-purple-500/10 text-purple-400'"
                      >
                        金額 <span class="text-xs">📦</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in masterData" :key="i" class="border-t border-slate-800">
                      <!-- 公司編號欄位 -->
                      <td
                        class="px-3 py-2 font-mono transition-all duration-500"
                        :class="animState >= 2 ? 'border-r-2 border-cyan-500/50 bg-sky-500/10 text-amber-400' : 'border-r border-slate-700 bg-sky-500/5 text-amber-400'"
                      >{{ i < 3 ? 'C01' : 'C02' }}</td>
                      <td
                        class="px-3 py-2 transition-all duration-500"
                        :class="animState >= 2 ? 'border-r-2 border-cyan-500/50 bg-sky-500/10 text-sky-300' : 'border-r border-slate-700 bg-sky-500/5 text-sky-300'"
                      >{{ row.name }}</td>
                      <td
                        class="px-3 py-2 transition-all duration-500"
                        :class="animState >= 2 ? 'border-r-2 border-cyan-500/50 bg-sky-500/10 text-sky-300/70' : 'border-r border-slate-700 bg-sky-500/5 text-sky-300/70'"
                      >{{ row.phone }}</td>
                      <td
                        class="px-3 py-2 transition-all duration-500"
                        :class="animState >= 2 ? 'bg-purple-500/10 text-purple-300' : 'bg-purple-500/5 text-purple-300'"
                      >{{ row.prod }}</td>
                      <td
                        class="px-3 py-2 transition-all duration-500"
                        :class="animState >= 2 ? 'bg-purple-500/10 text-emerald-400' : 'bg-purple-500/5 text-emerald-400'"
                      >{{ row.amt.toLocaleString() }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 剪刀動畫（中間切割線） -->
              <div
                v-if="animState >= 2"
                class="absolute left-1/2 top-0 bottom-0 z-10 flex -translate-x-1/2 flex-col items-center justify-center"
              >
                <div
                  class="h-full w-0.5 transition-all duration-1000"
                  :class="animState >= 3 ? 'bg-gradient-to-b from-transparent via-rose-500 to-transparent opacity-100' : 'bg-cyan-500/50 opacity-50'"
                ></div>
                <div
                  class="absolute top-1/2 -translate-y-1/2 rounded-full bg-slate-900 p-2 text-2xl transition-all duration-500"
                  :class="animState >= 3 ? 'scale-125 animate-pulse' : ''"
                >
                  ✂️
                </div>
              </div>
            </div>

            <!-- 說明區塊 -->
            <div class="grid w-full grid-cols-2 gap-4 transition-all delay-300 duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <div
                class="rounded-xl border-2 p-4 text-center transition-all duration-500"
                :class="animState >= 2 ? 'border-sky-500 bg-sky-500/20 shadow-lg shadow-sky-500/20' : 'border-sky-500/50 bg-sky-500/10'"
              >
                <div class="text-2xl">👥</div>
                <div class="mt-1 font-bold text-sky-400">客戶資料</div>
                <div class="text-xs text-slate-400">公司名稱、電話</div>
                <div class="mt-2 text-xs text-sky-300">→ 會變成「客戶表」</div>
              </div>
              <div
                class="rounded-xl border-2 p-4 text-center transition-all duration-500"
                :class="animState >= 2 ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20' : 'border-purple-500/50 bg-purple-500/10'"
              >
                <div class="text-2xl">📦</div>
                <div class="mt-1 font-bold text-purple-400">訂單資料</div>
                <div class="text-xs text-slate-400">產品、金額</div>
                <div class="mt-2 text-xs text-purple-300">→ 會變成「訂單表」</div>
              </div>
            </div>

            <!-- 動畫提示 -->
            <div v-if="animState >= 3" class="w-full text-center transition-all duration-500">
              <div class="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-emerald-400">
                <span class="animate-pulse">▶</span>
                <span class="text-sm">下一步：看看分開後的樣子</span>
              </div>
            </div>
          </template>

          <!-- ===== Step 9-12: Excel 雙分頁視覺化 ===== -->
          <!-- Step 9: anim_moving - 展示分頁結構 -->
          <template v-if="stepData.view === 'anim_moving'">
            <!-- 標題 -->
            <div class="text-center transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'">
              <div class="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-4 py-2">
                <span class="text-xl">📑</span>
                <span class="font-bold text-sky-300">分成兩個工作表（Sheet）</span>
              </div>
            </div>

            <!-- Excel 視窗（含雙分頁） -->
            <div class="w-full">
              <div class="overflow-hidden rounded-xl border-2 border-slate-600 bg-slate-900">
                <!-- Excel 標題列 -->
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800/50 px-3 py-2">
                  <div class="flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <span class="ml-2 text-xs text-slate-400">📊 公司資料庫.xlsx</span>
                </div>

                <!-- 表格內容區 -->
                <div class="p-4">
                  <!-- 客戶表內容 -->
                  <div
                    class="transition-all duration-500"
                    :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
                  >
                    <table class="w-full text-sm">
                      <thead class="bg-sky-500/10">
                        <tr>
                          <th class="px-4 py-2 text-left text-amber-400">編號 🔑</th>
                          <th class="px-4 py-2 text-left text-sky-400">公司名稱</th>
                          <th class="px-4 py-2 text-left text-sky-400">電話</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="border-t border-slate-700">
                          <td class="px-4 py-2 font-mono font-bold text-amber-400">C01</td>
                          <td class="px-4 py-2 text-white">台積電</td>
                          <td class="px-4 py-2 text-slate-400">03-578-1234</td>
                        </tr>
                        <tr class="border-t border-slate-700">
                          <td class="px-4 py-2 font-mono font-bold text-amber-400">C02</td>
                          <td class="px-4 py-2 text-white">鴻海</td>
                          <td class="px-4 py-2 text-slate-400">02-2268-5678</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Excel 底部分頁標籤 -->
                <div class="flex items-end border-t border-slate-700 bg-slate-800/30">
                  <div
                    class="flex cursor-pointer items-center gap-1.5 rounded-t-lg border-l border-r border-t px-4 py-2 transition-all duration-300"
                    :class="'border-sky-500 bg-slate-900 -mb-px'"
                  >
                    <span class="text-sm">👥</span>
                    <span class="text-sm font-medium text-sky-400">客戶表</span>
                    <span
                      class="rounded bg-emerald-500/20 px-1.5 py-0.5 text-xs text-emerald-400 transition-all duration-500"
                      :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"
                    >✨ 新建</span>
                  </div>
                  <div class="flex cursor-pointer items-center gap-1.5 rounded-t-lg border-transparent px-4 py-2 opacity-50">
                    <span class="text-sm">📦</span>
                    <span class="text-sm text-purple-400">訂單表</span>
                    <span class="text-xs text-slate-500">（下一步）</span>
                  </div>
                  <div class="ml-auto px-3 py-2 text-xs text-slate-500">
                    <span class="font-bold text-emerald-400">2</span> 張工作表
                  </div>
                </div>
              </div>
            </div>

            <!-- 說明 -->
            <div
              class="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 transition-all delay-300 duration-700"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
            >
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div class="text-2xl text-rose-400">❌</div>
                  <div class="text-sm text-slate-400">原本：台積電寫了 <span class="font-bold text-rose-400">3 次</span></div>
                </div>
                <div>
                  <div class="text-2xl text-emerald-400">✅</div>
                  <div class="text-sm text-slate-400">現在：台積電只寫 <span class="font-bold text-emerald-400">1 次</span></div>
                </div>
              </div>
              <div class="mt-3 text-center text-sm text-emerald-300">
                每間公司都有唯一編號（<span class="font-mono text-amber-400">C01</span>、<span class="font-mono text-amber-400">C02</span>）
              </div>
            </div>
          </template>

          <!-- Step 10: anim_codes - 訂單表用編號 -->
          <template v-if="stepData.view === 'anim_codes'">
            <!-- 標題 -->
            <div class="text-center transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'">
              <div class="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-4 py-2">
                <span class="text-xl">🔗</span>
                <span class="font-bold text-purple-300">訂單表用「編號」代替公司名稱</span>
              </div>
            </div>

            <!-- Excel 視窗（含雙分頁） -->
            <div class="w-full">
              <div class="overflow-hidden rounded-xl border-2 border-slate-600 bg-slate-900">
                <!-- Excel 標題列 -->
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800/50 px-3 py-2">
                  <div class="flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <span class="ml-2 text-xs text-slate-400">📊 公司資料庫.xlsx</span>
                </div>

                <!-- 表格內容區 -->
                <div class="p-4">
                  <!-- 訂單表內容 -->
                  <div
                    class="transition-all duration-500"
                    :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
                  >
                    <table class="w-full text-sm">
                      <thead class="bg-purple-500/10">
                        <tr>
                          <th class="px-3 py-2 text-left text-purple-400">訂單編號</th>
                          <th class="px-3 py-2 text-left">
                            <span class="text-amber-400">客戶編號 🔗</span>
                            <span class="ml-1 text-xs text-emerald-400">外來鍵</span>
                          </th>
                          <th class="px-3 py-2 text-left text-purple-400">產品</th>
                          <th class="px-3 py-2 text-left text-purple-400">金額</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="border-t border-slate-700">
                          <td class="px-3 py-2 font-mono text-purple-400">ORD-101</td>
                          <td class="px-3 py-2 bg-amber-500/10">
                            <span class="font-mono font-bold text-amber-400">C01</span>
                            <span class="ml-2 text-xs text-slate-500">→ 台積電</span>
                          </td>
                          <td class="px-3 py-2 text-slate-300">晶圓</td>
                          <td class="px-3 py-2 text-emerald-400">500,000</td>
                        </tr>
                        <tr class="border-t border-slate-700">
                          <td class="px-3 py-2 font-mono text-purple-400">ORD-102</td>
                          <td class="px-3 py-2 bg-amber-500/10">
                            <span class="font-mono font-bold text-amber-400">C01</span>
                            <span class="ml-2 text-xs text-slate-500">→ 台積電</span>
                          </td>
                          <td class="px-3 py-2 text-slate-300">測試</td>
                          <td class="px-3 py-2 text-emerald-400">200,000</td>
                        </tr>
                        <tr class="border-t border-slate-700">
                          <td class="px-3 py-2 font-mono text-purple-400">ORD-103</td>
                          <td class="px-3 py-2 bg-amber-500/10">
                            <span class="font-mono font-bold text-amber-400">C02</span>
                            <span class="ml-2 text-xs text-slate-500">→ 鴻海</span>
                          </td>
                          <td class="px-3 py-2 text-slate-300">設備</td>
                          <td class="px-3 py-2 text-emerald-400">800,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Excel 底部分頁標籤 -->
                <div class="flex items-end border-t border-slate-700 bg-slate-800/30">
                  <div class="flex cursor-pointer items-center gap-1.5 rounded-t-lg border-transparent px-4 py-2 opacity-50">
                    <span class="text-sm">👥</span>
                    <span class="text-sm text-sky-400">客戶表</span>
                  </div>
                  <div
                    class="flex cursor-pointer items-center gap-1.5 rounded-t-lg border-l border-r border-t px-4 py-2"
                    :class="'border-purple-500 bg-slate-900 -mb-px'"
                  >
                    <span class="text-sm">📦</span>
                    <span class="text-sm font-medium text-purple-400">訂單表</span>
                    <span
                      class="rounded bg-emerald-500/20 px-1.5 py-0.5 text-xs text-emerald-400 transition-all duration-500"
                      :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"
                    >✨ 新建</span>
                  </div>
                  <div class="ml-auto px-3 py-2 text-xs text-slate-500">
                    <span class="font-bold text-emerald-400">2</span> 張工作表
                  </div>
                </div>
              </div>
            </div>

            <!-- 說明 -->
            <div
              class="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 transition-all delay-300 duration-700"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
            >
              <div class="text-sm text-amber-300">
                <span class="font-bold">🔗 外來鍵 (Foreign Key)：</span><br/>
                訂單表用 <span class="font-mono text-amber-400">C01</span> 代替「台積電」<br/>
                電腦看到 C01，就會去「客戶表」找完整資料！
              </div>
            </div>
          </template>

          <!-- Step 11: anim_link - 兩個分頁並排看關聯 -->
          <template v-if="stepData.view === 'anim_link'">
            <!-- 標題 -->
            <div class="text-center transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'">
              <div class="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-2">
                <span class="text-xl">🔍</span>
                <span class="font-bold text-amber-300">兩張表的關聯</span>
              </div>
            </div>

            <!-- Excel 視窗（同時顯示兩個分頁內容） -->
            <div class="w-full">
              <div class="overflow-hidden rounded-xl border-2 border-slate-600 bg-slate-900">
                <!-- Excel 標題列 -->
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800/50 px-3 py-2">
                  <div class="flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <span class="ml-2 text-xs text-slate-400">📊 公司資料庫.xlsx — 同時檢視兩個工作表</span>
                </div>

                <!-- 兩個分頁並排 -->
                <div class="grid gap-4 p-4 md:grid-cols-2">
                  <!-- 左：客戶表 -->
                  <div
                    class="rounded-lg border border-sky-500/50 p-3 transition-all duration-500"
                    :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'"
                  >
                    <div class="mb-2 flex items-center gap-2 text-sm font-bold text-sky-400">
                      <span>👥</span> 客戶表
                    </div>
                    <table class="w-full text-xs">
                      <thead class="bg-sky-500/10">
                        <tr>
                          <th class="px-2 py-1.5 text-left text-amber-400">編號 🔑</th>
                          <th class="px-2 py-1.5 text-left text-sky-400">公司</th>
                          <th class="px-2 py-1.5 text-left text-sky-400">電話</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          class="border-t border-slate-700 transition-all duration-300"
                          :class="animState >= 3 ? 'bg-amber-500/10' : ''"
                        >
                          <td
                            class="px-2 py-1.5 font-mono font-bold text-amber-400"
                            :class="animState >= 3 ? 'animate-pulse' : ''"
                          >C01</td>
                          <td class="px-2 py-1.5 text-white">台積電</td>
                          <td class="px-2 py-1.5 text-slate-400">03-578-1234</td>
                        </tr>
                        <tr class="border-t border-slate-700">
                          <td class="px-2 py-1.5 font-mono text-amber-400">C02</td>
                          <td class="px-2 py-1.5 text-white">鴻海</td>
                          <td class="px-2 py-1.5 text-slate-400">02-2268-5678</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- 中間連線 -->
                  <div class="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block">
                    <div
                      v-if="animState >= 3"
                      class="flex flex-col items-center gap-1 rounded-lg bg-amber-500/20 px-3 py-2"
                    >
                      <div class="text-xs font-bold text-amber-400">C01 = C01</div>
                      <div class="text-lg">🔗</div>
                    </div>
                  </div>

                  <!-- 右：訂單表 -->
                  <div
                    class="rounded-lg border border-purple-500/50 p-3 transition-all duration-500"
                    :class="animState >= 2 ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'"
                  >
                    <div class="mb-2 flex items-center gap-2 text-sm font-bold text-purple-400">
                      <span>📦</span> 訂單表
                    </div>
                    <table class="w-full text-xs">
                      <thead class="bg-purple-500/10">
                        <tr>
                          <th class="px-2 py-1.5 text-left text-purple-400">訂單</th>
                          <th class="px-2 py-1.5 text-left text-amber-400">客戶編號</th>
                          <th class="px-2 py-1.5 text-left text-purple-400">產品</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          class="border-t border-slate-700 transition-all duration-300"
                          :class="animState >= 3 ? 'bg-amber-500/10' : ''"
                        >
                          <td class="px-2 py-1.5 font-mono text-purple-400">ORD-101</td>
                          <td
                            class="px-2 py-1.5 font-mono font-bold text-amber-400"
                            :class="animState >= 3 ? 'animate-pulse' : ''"
                          >C01</td>
                          <td class="px-2 py-1.5 text-slate-300">晶圓</td>
                        </tr>
                        <tr class="border-t border-slate-700">
                          <td class="px-2 py-1.5 font-mono text-purple-400">ORD-102</td>
                          <td class="px-2 py-1.5 font-mono text-amber-400">C01</td>
                          <td class="px-2 py-1.5 text-slate-300">測試</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Excel 底部分頁標籤 -->
                <div class="flex items-end border-t border-slate-700 bg-slate-800/30">
                  <div class="flex cursor-pointer items-center gap-1.5 rounded-t-lg border-l border-r border-t border-sky-500 bg-slate-900 px-4 py-2 -mb-px">
                    <span class="text-sm">👥</span>
                    <span class="text-sm font-medium text-sky-400">客戶表</span>
                  </div>
                  <div class="flex cursor-pointer items-center gap-1.5 rounded-t-lg border-l border-r border-t border-purple-500 bg-slate-900 px-4 py-2 -mb-px">
                    <span class="text-sm">📦</span>
                    <span class="text-sm font-medium text-purple-400">訂單表</span>
                  </div>
                  <div class="ml-auto px-3 py-2 text-xs text-slate-500">
                    <span class="font-bold text-emerald-400">2</span> 張工作表（並排檢視）
                  </div>
                </div>
              </div>
            </div>

            <!-- 組合結果 -->
            <div
              class="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 transition-all delay-300 duration-700"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
            >
              <div class="mb-2 text-sm font-bold text-emerald-400">🎯 電腦組合的結果：</div>
              <div class="flex flex-wrap items-center gap-2 rounded bg-slate-800 p-3 text-sm">
                <span class="font-mono text-purple-400">ORD-101</span>
                <span class="text-slate-500">的</span>
                <span class="rounded bg-amber-500/20 px-1.5 font-mono text-amber-400">C01</span>
                <span class="text-slate-500">→</span>
                <span class="font-bold text-white">台積電</span>
                <span class="text-slate-400">03-578-1234</span>
              </div>
              <div class="mt-2 text-xs text-slate-400">這就是「關聯式資料庫」：用編號把兩張表「關聯」起來！</div>
            </div>
          </template>

          <!-- Step 12: anim_sync - 改一次同步 -->
          <template v-if="stepData.view === 'anim_sync'">
            <!-- 標題 -->
            <div class="text-center transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'">
              <div class="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2">
                <span class="text-xl">✨</span>
                <span class="font-bold text-emerald-300">正規化的威力：改一次就好！</span>
              </div>
            </div>

            <!-- 情境說明 -->
            <div
              class="w-full rounded-xl border border-slate-600 bg-slate-800 p-3 transition-all duration-500"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
            >
              <div class="text-sm text-slate-300">
                <span class="text-lg">📱</span> <span class="font-bold">情境：</span>台積電換電話
                <span class="text-red-400 line-through">03-578-1234</span> → <span class="font-bold text-emerald-400">03-578-5678</span>
              </div>
            </div>

            <!-- Excel 視窗 -->
            <div class="w-full">
              <div class="overflow-hidden rounded-xl border-2 border-slate-600 bg-slate-900">
                <!-- Excel 標題列 -->
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800/50 px-3 py-2">
                  <div class="flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <span class="ml-2 text-xs text-slate-400">📊 公司資料庫.xlsx</span>
                  <span
                    class="ml-auto rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400 transition-all duration-500"
                    :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"
                  >✏️ 編輯中...</span>
                </div>

                <!-- 客戶表（修改電話） -->
                <div class="p-4">
                  <table class="w-full text-sm">
                    <thead class="bg-sky-500/10">
                      <tr>
                        <th class="px-4 py-2 text-left text-amber-400">編號 🔑</th>
                        <th class="px-4 py-2 text-left text-sky-400">公司名稱</th>
                        <th class="px-4 py-2 text-left text-sky-400">電話</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        class="border-t border-slate-700 transition-all duration-300"
                        :class="animState >= 2 ? 'bg-emerald-500/10' : ''"
                      >
                        <td class="px-4 py-2 font-mono font-bold text-amber-400">C01</td>
                        <td class="px-4 py-2 text-white">台積電</td>
                        <td class="px-4 py-2">
                          <span
                            class="transition-all duration-500"
                            :class="animState >= 2 ? 'text-red-400/60 line-through' : 'text-slate-400'"
                          >03-578-1234</span>
                          <span
                            class="ml-2 font-bold text-emerald-400 transition-all duration-500"
                            :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"
                          >03-578-5678 ✓</span>
                        </td>
                      </tr>
                      <tr class="border-t border-slate-700">
                        <td class="px-4 py-2 font-mono font-bold text-amber-400">C02</td>
                        <td class="px-4 py-2 text-white">鴻海</td>
                        <td class="px-4 py-2 text-slate-400">02-2268-5678</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Excel 底部分頁標籤 -->
                <div class="flex items-end border-t border-slate-700 bg-slate-800/30">
                  <div class="flex cursor-pointer items-center gap-1.5 rounded-t-lg border-l border-r border-t border-sky-500 bg-slate-900 px-4 py-2 -mb-px">
                    <span class="text-sm">👥</span>
                    <span class="text-sm font-medium text-sky-400">客戶表</span>
                    <span class="rounded bg-emerald-500/20 px-1.5 py-0.5 text-xs text-emerald-400">✏️ 改這裡</span>
                  </div>
                  <div class="flex cursor-pointer items-center gap-1.5 rounded-t-lg border-transparent px-4 py-2 opacity-50">
                    <span class="text-sm">📦</span>
                    <span class="text-sm text-purple-400">訂單表</span>
                    <span class="text-xs text-slate-500">（不用改）</span>
                  </div>
                  <div class="ml-auto px-3 py-2 text-xs text-slate-500">
                    只需改 <span class="font-bold text-emerald-400">1</span> 次
                  </div>
                </div>
              </div>
            </div>

            <!-- 所有訂單自動更新 -->
            <div
              class="text-center transition-all duration-500"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
            >
              <div class="text-lg text-emerald-400">↓ 所有訂單查詢時自動顯示新電話 ↓</div>
            </div>

            <!-- 總結 -->
            <div
              class="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 transition-all delay-300 duration-700"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
            >
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div class="text-2xl text-rose-400">❌</div>
                  <div class="text-sm text-slate-400">沒有正規化：<br/>要改 <span class="font-bold text-rose-400">100 筆</span>訂單</div>
                </div>
                <div>
                  <div class="text-2xl text-emerald-400">✅</div>
                  <div class="text-sm text-slate-400">正規化後：<br/>只要改 <span class="font-bold text-emerald-400">1 次</span>客戶表</div>
                </div>
              </div>
              <div class="mt-3 text-center text-xs text-slate-400">
                這就是為什麼大公司都用資料庫，而不是 Excel
              </div>
            </div>
          </template>

        </div>
      </div>

      <!-- ========== SQL SELECT VIEW ========== -->
      <div v-if="stepData.view === 'sql_select'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <div class="flex w-full flex-wrap justify-center gap-3 transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'">
            <div class="rounded-xl border-2 border-pink-500 bg-pink-500/20 px-4 py-3 text-center">
              <div class="font-mono text-lg font-bold text-pink-400">SELECT</div>
              <div class="text-xs text-slate-400">選哪些欄位</div>
            </div>
          </div>
          <div class="w-full transition-all delay-200 duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="mb-2 flex items-center justify-between">
              <div class="text-xs text-slate-400">👆 {{ stepData.tip || '點擊欄位標題來選取' }}</div>
              <button @click="selectAll" class="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400 hover:bg-amber-500/30">⭐ 全選</button>
            </div>
            <div class="overflow-hidden rounded-xl border border-sky-500/30 bg-slate-900">
              <table class="w-full text-sm">
                <thead class="bg-slate-800">
                  <tr>
                    <th v-for="(col, i) in customerCols" :key="i" @click="toggleColumn(i)" class="cursor-pointer px-3 py-2 text-left transition-colors" :class="selectedCols.includes(i) ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400 hover:bg-slate-700'">{{ col }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, ri) in companyData" :key="ri" class="border-t border-slate-800">
                    <td class="px-3 py-2 font-mono" :class="selectedCols.length === 0 || selectedCols.includes(0) ? 'text-sky-400' : 'opacity-30'">{{ row.id }}</td>
                    <td class="px-3 py-2" :class="selectedCols.length === 0 || selectedCols.includes(1) ? 'text-white' : 'opacity-30'">{{ row.name }}</td>
                    <td class="px-3 py-2" :class="selectedCols.length === 0 || selectedCols.includes(2) ? 'text-slate-300' : 'opacity-30'">{{ row.phone }}</td>
                    <td class="px-3 py-2" :class="selectedCols.length === 0 || selectedCols.includes(3) ? 'text-slate-300' : 'opacity-30'">{{ row.city }}</td>
                    <td class="px-3 py-2" :class="selectedCols.length === 0 || selectedCols.includes(4) ? 'text-slate-300' : 'opacity-30'">{{ row.industry }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="w-full transition-all delay-400 duration-700" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="rounded-xl border border-slate-700 bg-black p-4">
              <div class="mb-2 text-xs text-emerald-500">💻 SQL</div>
              <pre class="font-mono text-sm text-pink-400">{{ sqlResult || 'SELECT * FROM 客戶表' }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== SQL FROM VIEW ========== -->
      <div v-if="stepData.view === 'sql_from'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <div class="flex gap-3 transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'">
            <div class="rounded-xl border border-pink-500/30 bg-pink-500/10 px-3 py-2"><span class="font-mono text-pink-400">SELECT</span></div>
            <div class="rounded-xl border-2 border-indigo-500 bg-indigo-500/20 px-3 py-2"><span class="font-mono text-indigo-400 font-bold">FROM</span></div>
          </div>
          <div class="flex gap-3 transition-all delay-200 duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <button @click="switchSheet('customers')" class="rounded-xl px-4 py-3 transition-all" :class="currentSheet === 'customers' ? 'border-2 border-sky-500 bg-sky-500/20 text-sky-400' : 'border border-slate-600 text-slate-400 hover:border-sky-500/50'">
              <div class="text-2xl">👥</div>
              <div class="text-sm font-bold">客戶表</div>
            </button>
            <button @click="switchSheet('orders')" class="rounded-xl px-4 py-3 transition-all" :class="currentSheet === 'orders' ? 'border-2 border-purple-500 bg-purple-500/20 text-purple-400' : 'border border-slate-600 text-slate-400 hover:border-purple-500/50'">
              <div class="text-2xl">📦</div>
              <div class="text-sm font-bold">訂單表</div>
            </button>
          </div>
          <div class="w-full overflow-hidden rounded-xl border transition-all delay-300 duration-500" :class="currentSheet === 'customers' ? 'border-sky-500/50 bg-slate-900' : 'border-purple-500/50 bg-slate-900'">
            <div class="px-4 py-2 font-bold" :class="currentSheet === 'customers' ? 'bg-sky-500/10 text-sky-400' : 'bg-purple-500/10 text-purple-400'">
              {{ currentSheet === 'customers' ? '👥 客戶表' : '📦 訂單表' }}
            </div>
            <table v-if="currentSheet === 'customers'" class="w-full text-sm">
              <thead class="bg-slate-800 text-slate-400"><tr><th class="px-3 py-2 text-left">編號</th><th class="px-3 py-2 text-left">名稱</th><th class="px-3 py-2 text-left">城市</th></tr></thead>
              <tbody><tr v-for="row in companyData" :key="row.id" class="border-t border-slate-800"><td class="px-3 py-2 font-mono text-sky-400">{{ row.id }}</td><td class="px-3 py-2 text-white">{{ row.name }}</td><td class="px-3 py-2 text-slate-400">{{ row.city }}</td></tr></tbody>
            </table>
            <table v-else class="w-full text-sm">
              <thead class="bg-slate-800 text-slate-400"><tr><th class="px-3 py-2 text-left">訂單</th><th class="px-3 py-2 text-left">客戶</th><th class="px-3 py-2 text-left">金額</th></tr></thead>
              <tbody><tr v-for="row in orderData" :key="row.oid" class="border-t border-slate-800"><td class="px-3 py-2 font-mono text-purple-400">{{ row.oid }}</td><td class="px-3 py-2 font-mono text-sky-400">{{ row.cid }}</td><td class="px-3 py-2 text-emerald-400">{{ row.amt.toLocaleString() }}</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ========== SQL WHERE VIEW ========== -->
      <div v-if="stepData.view === 'sql_where'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <div class="flex gap-3 transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'">
            <div class="rounded-xl border border-pink-500/30 bg-pink-500/10 px-3 py-2"><span class="font-mono text-pink-400">SELECT</span></div>
            <div class="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2"><span class="font-mono text-indigo-400">FROM</span></div>
            <div class="rounded-xl border-2 border-rose-500 bg-rose-500/20 px-3 py-2"><span class="font-mono text-rose-400 font-bold">WHERE</span></div>
          </div>
          <div v-if="stepData.sql" class="w-full transition-all delay-200 duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="rounded-xl border border-slate-700 bg-black p-4">
              <pre class="font-mono text-sm"><span class="text-pink-400">SELECT</span> <span class="text-white">*</span> <span class="text-indigo-400">FROM</span> <span class="text-sky-400">訂單表</span>
<span class="text-rose-400">{{ stepData.sql }}</span></pre>
            </div>
          </div>
          <div class="w-full overflow-hidden rounded-xl border border-purple-500/50 bg-slate-900 transition-all delay-300 duration-700" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="bg-purple-500/10 px-4 py-2 font-bold text-purple-400">📦 查詢結果</div>
            <table class="w-full text-sm">
              <thead class="bg-slate-800 text-slate-400"><tr><th class="px-3 py-2 text-left">訂單</th><th class="px-3 py-2 text-left">客戶</th><th class="px-3 py-2 text-left">金額</th><th class="px-3 py-2 text-left">狀態</th></tr></thead>
              <tbody>
                <tr v-for="row in filteredData" :key="row.oid" class="border-t border-slate-800">
                  <td class="px-3 py-2 font-mono text-purple-400">{{ row.oid }}</td>
                  <td class="px-3 py-2 font-mono text-sky-400">{{ row.cid }}</td>
                  <td class="px-3 py-2 text-emerald-400">{{ row.amt?.toLocaleString() }}</td>
                  <td class="px-3 py-2" :class="row.status === '完成' ? 'text-emerald-400' : row.status === '取消' ? 'text-red-400' : 'text-amber-400'">{{ row.status }}</td>
                </tr>
                <tr v-if="filteredData.length === 0" class="border-t border-slate-800"><td colspan="4" class="px-3 py-4 text-center text-slate-500">沒有符合條件的資料</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ========== SQL COMBO VIEW ========== -->
      <div v-if="stepData.view === 'sql_combo'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <div class="text-center transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'">
            <div class="text-4xl mb-2">🏆</div>
            <div class="text-xl font-bold text-white">SQL 鐵三角合體！</div>
          </div>
          <div class="w-full rounded-xl border border-slate-700 bg-black p-6 transition-all delay-300 duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <pre class="font-mono text-sm leading-relaxed"><span class="text-pink-400">SELECT</span> <span class="text-white">公司名稱, 金額</span>
<span class="text-indigo-400">FROM</span> <span class="text-sky-400">訂單表</span>
<span class="text-rose-400">WHERE</span> <span class="text-amber-400">金額 > 100000</span>
<span class="text-cyan-400">ORDER BY</span> <span class="text-emerald-400">金額 DESC</span></pre>
          </div>
          <div class="flex flex-wrap justify-center gap-2 transition-all delay-500 duration-700" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <span class="rounded-full bg-pink-500/20 px-3 py-1 text-xs text-pink-400">① SELECT 選欄位</span>
            <span class="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-400">② FROM 選表格</span>
            <span class="rounded-full bg-rose-500/20 px-3 py-1 text-xs text-rose-400">③ WHERE 下條件</span>
            <span class="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-400">④ ORDER BY 排序</span>
          </div>
        </div>
      </div>

      <!-- ========== SCENARIO VIEW (情境實戰) ========== -->
      <div v-if="stepData.view === 'scenario'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <div class="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'">
            <div class="text-amber-400 font-bold mb-1">💼 情境</div>
            <div class="text-white">{{ stepData.desc }}</div>
          </div>
          <div v-if="stepData.sql" class="w-full rounded-xl border border-slate-700 bg-black p-4 transition-all delay-200 duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="text-xs text-emerald-500 mb-2">💻 SQL 寫法</div>
            <pre class="font-mono text-sm text-pink-400">{{ stepData.sql }}</pre>
            <div v-if="stepData.tip" class="mt-2 text-xs text-slate-400">💡 {{ stepData.tip }}</div>
          </div>
          <div class="w-full overflow-hidden rounded-xl border bg-slate-900 transition-all delay-400 duration-700" :class="[animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0', currentSheet === 'customers' ? 'border-sky-500/50' : 'border-purple-500/50']">
            <div class="px-4 py-2 font-bold" :class="currentSheet === 'customers' ? 'bg-sky-500/10 text-sky-400' : 'bg-purple-500/10 text-purple-400'">
              {{ currentSheet === 'customers' ? '👥 查詢結果' : '📦 查詢結果' }} ({{ filteredData.length }} 筆)
            </div>
            <div class="max-h-48 overflow-y-auto">
              <table class="w-full text-sm">
                <tbody>
                  <tr v-for="(row, i) in filteredData" :key="i" class="border-t border-slate-800">
                    <template v-if="currentSheet === 'customers'">
                      <td class="px-3 py-2 font-mono text-sky-400">{{ row.id }}</td>
                      <td class="px-3 py-2 text-white">{{ row.name }}</td>
                      <td class="px-3 py-2 text-slate-400">{{ row.city }}</td>
                    </template>
                    <template v-else>
                      <td class="px-3 py-2 font-mono text-purple-400">{{ row.oid }}</td>
                      <td class="px-3 py-2 font-mono text-sky-400">{{ row.cid }}</td>
                      <td class="px-3 py-2 text-emerald-400">{{ row.amt?.toLocaleString() }}</td>
                      <td class="px-3 py-2 text-slate-400">{{ row.status }}</td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CRUD INSERT VIEW ========== -->
      <div v-if="stepData.view === 'crud_insert'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <div class="transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'">
            <div class="text-4xl text-center">➕</div>
            <div class="mt-2 text-xl font-bold text-emerald-400 text-center">INSERT 新增資料</div>
          </div>
          <div v-if="stepData.sql" class="w-full rounded-xl border border-slate-700 bg-black p-4 transition-all delay-200 duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <pre class="font-mono text-xs md:text-sm text-emerald-400 whitespace-pre-wrap">{{ stepData.sql }}</pre>
          </div>
          <div class="w-full overflow-hidden rounded-xl border border-emerald-500/50 bg-slate-900 transition-all delay-400 duration-700" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="bg-emerald-500/10 px-4 py-2 font-bold text-emerald-400">✨ 新增成功！</div>
            <div class="p-4">
              <div v-if="newRowVisible" class="rounded-lg border-2 border-emerald-500 bg-emerald-500/10 p-3 animate-pulse">
                <span class="font-mono text-amber-400">C06</span>
                <span class="text-white ml-3">台灣大</span>
                <span class="text-slate-400 ml-3">02-1234-5678</span>
                <span class="text-emerald-400 ml-3">← 新的！</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CRUD UPDATE VIEW ========== -->
      <div v-if="stepData.view === 'crud_update'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <div class="transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'">
            <div class="text-4xl text-center">✏️</div>
            <div class="mt-2 text-xl font-bold text-amber-400 text-center">UPDATE 修改資料</div>
          </div>
          <div v-if="stepData.sql" class="w-full rounded-xl border border-slate-700 bg-black p-4 transition-all delay-200 duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <pre class="font-mono text-xs md:text-sm text-amber-400 whitespace-pre-wrap">{{ stepData.sql }}</pre>
          </div>
          <div class="w-full space-y-2 transition-all delay-400 duration-700" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="rounded-lg border border-slate-700 bg-slate-800 p-3 flex items-center gap-3">
              <span class="text-slate-400">修改前：</span>
              <span class="text-red-400 line-through">50,000</span>
            </div>
            <div class="rounded-lg border-2 border-amber-500 bg-amber-500/10 p-3 flex items-center gap-3">
              <span class="text-slate-400">修改後：</span>
              <span class="text-emerald-400 font-bold">80,000</span>
              <span class="text-amber-400">✓</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CRUD DELETE VIEW ========== -->
      <div v-if="stepData.view === 'crud_delete'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-4">
          <div class="transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'">
            <div class="text-4xl text-center">🗑️</div>
            <div class="mt-2 text-xl font-bold text-red-400 text-center">DELETE 刪除資料</div>
          </div>
          <div v-if="stepData.sql" class="w-full rounded-xl border border-slate-700 bg-black p-4 transition-all delay-200 duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <pre class="font-mono text-xs md:text-sm text-red-400 whitespace-pre-wrap">{{ stepData.sql }}</pre>
          </div>
          <div class="w-full transition-all delay-400 duration-700" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center">
              <div class="text-red-400 line-through opacity-50">ORD-107 | C06 | 80,000 | 寬頻</div>
              <div class="text-red-400 mt-2">已刪除 ❌</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CRUD DISASTER VIEW ========== -->
      <div v-if="stepData.view === 'crud_disaster'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-lg flex-col items-center gap-4">
          <div class="transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
            <div class="text-6xl text-center animate-bounce">💥</div>
            <div class="mt-2 text-xl font-bold text-red-500 text-center">{{ stepData.tip || '災難發生！' }}</div>
          </div>
          <div v-if="stepData.sql" class="w-full rounded-xl border-2 border-red-500 bg-red-500/10 p-4 transition-all delay-200 duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="text-xs text-red-400 mb-2">❌ 危險的 SQL</div>
            <pre class="font-mono text-sm text-red-400">{{ stepData.sql }}</pre>
            <div class="text-xs text-red-300 mt-2">沒有 WHERE = 影響所有資料！</div>
          </div>
          <div v-if="crudAnimState === 'disaster'" class="w-full space-y-2 transition-all duration-500">
            <div v-for="i in 5" :key="i" class="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-center text-sm text-red-400 animate-pulse">
              {{ stepData.sql?.includes('UPDATE') ? '金額全變 80,000 😱' : '資料被刪光 😱' }}
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CRUD PROTECT VIEW ========== -->
      <div v-if="stepData.view === 'crud_protect'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-lg flex-col items-center gap-6">
          <div class="transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'">
            <div class="text-5xl text-center">🛡️</div>
            <div class="mt-3 text-xl font-bold text-sky-400 text-center">外來鍵保護機制</div>
          </div>
          <div class="flex items-center gap-4 transition-all delay-300 duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="rounded-xl border-2 border-red-500 bg-red-500/10 p-4 text-center">
              <div class="text-2xl">🗑️</div>
              <div class="text-sm text-red-400 mt-1">想刪除 C01</div>
            </div>
            <div class="text-2xl text-red-500">✕</div>
            <div class="rounded-xl border border-purple-500/50 bg-slate-900 p-4">
              <div class="text-xs text-purple-400 mb-1">訂單表還有：</div>
              <div class="text-sm text-white">C01 的 3 筆訂單</div>
            </div>
          </div>
          <div class="transition-all delay-500 duration-700" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 text-center">
              <div class="text-emerald-400 font-bold">❌ 禁止刪除！</div>
              <div class="text-sm text-slate-300 mt-1">資料庫會保護你不做傻事</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CERTIFICATE VIEW ========== -->
      <div v-if="stepData.view === 'certificate'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6 md:p-6">
        <div class="relative z-10 transition-all duration-1000" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
          <div class="absolute -inset-8 rounded-3xl bg-gradient-to-r from-amber-500/30 via-purple-500/30 to-sky-500/30 blur-2xl animate-pulse"></div>
          <div class="relative rounded-3xl border-4 border-amber-500 bg-slate-900 p-8 text-center">
            <div class="text-6xl mb-4">🏆</div>
            <div class="text-2xl font-bold text-amber-400">SQL 大師證書</div>
            <div class="mt-4 text-slate-300">恭喜你完成 50 關修煉！</div>
            <div class="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div class="rounded-lg bg-pink-500/10 p-2 text-pink-400">SELECT ✓</div>
              <div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">INSERT ✓</div>
              <div class="rounded-lg bg-amber-500/10 p-2 text-amber-400">UPDATE ✓</div>
              <div class="rounded-lg bg-red-500/10 p-2 text-red-400">DELETE ✓</div>
            </div>
            <div class="mt-6 text-xs text-slate-500">CRUD 四大技能 - 全部解鎖！</div>
          </div>
        </div>
      </div>

      <!-- ========== FINAL VIEW ========== -->
      <div v-if="stepData.view === 'final'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6 md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6 text-center">
          <div class="transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'">
            <div class="text-6xl">🚀</div>
            <div class="mt-4 text-2xl font-bold text-white">SQL 之路才剛開始！</div>
          </div>
          <div class="max-w-md transition-all delay-300 duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-6">
              <div class="text-purple-300">記住海姐說的：</div>
              <div class="mt-2 text-xl font-bold text-white">「慢慢來，比較快」</div>
            </div>
          </div>
          <div class="transition-all delay-500 duration-700" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="text-slate-400">加油！你已經很棒了 💪</div>
          </div>
        </div>
      </div>
    </div>
  </InteractiveSlideTemplate>
</template>

<style scoped>
@keyframes float-slow {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-30px) translateX(-20px); }
}

@keyframes float-slower {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(20px) translateX(30px); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
.animate-float-slower { animation: float-slower 15s ease-in-out infinite; }
.animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
</style>
