<script setup lang="ts">
/**
 * 靜態資源 vs 動態資料 互動實驗室
 * 使用共用模版 InteractiveSlideTemplate
 */
import { ref, computed } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{
  isMobile?: boolean
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

// === 步驟資料定義 ===

type StepView = 'disaster' | 'compare' | 'architecture' | 'restaurant' | 'folder' | 'summary'

type Step = {
  id: number
  view: StepView
  title: string
  desc: string
  // disaster view
  disasterPhase?: number
  // compare view
  showDatabase?: boolean
  // architecture view
  archPhase?: 'static' | 'dynamic' | 'both'
  // restaurant view
  restaurantPhase?: number
  // folder view
  folderHighlight?: 'public' | 'layouts' | null
}

const STEPS: Step[] = [
  // DISASTER STORY PHASE
  {
    id: 0,
    view: 'disaster',
    title: '災難的開始',
    desc: '前任工程師把 50 個教練的資料全部「寫死」在 HTML 裡面。每個教練的名字、照片、專長，通通直接寫在程式碼裡。',
    disasterPhase: 0,
  },
  {
    id: 1,
    view: 'disaster',
    title: '第一通電話',
    desc: '海克絲打來說：「王小明教練離職了，幫我從網站移除。」工程師打開程式碼，找到那段 HTML，刪掉。',
    disasterPhase: 1,
  },
  {
    id: 2,
    view: 'disaster',
    title: '第二通電話',
    desc: '「李小華要改名叫李大華，順便更新照片。」工程師繼續改程式碼......',
    disasterPhase: 2,
  },
  {
    id: 3,
    view: 'disaster',
    title: '壓垮駱駝的最後一根稻草',
    desc: '「我們新簽了 10 個教練，資料 Email 給你了。」工程師：「......」（崩潰）',
    disasterPhase: 3,
  },
  // COMPARE PHASE
  {
    id: 4,
    view: 'compare',
    title: '問題在哪？',
    desc: '每次教練資料變動，都要改程式碼、重新部署網站。萬一改錯，網站就爆炸了！',
    showDatabase: false,
  },
  {
    id: 5,
    view: 'compare',
    title: '正確的做法',
    desc: '把經常變動的資料存在「資料庫」，前端透過 API 去取得。這樣改資料就不用動到程式碼了！',
    showDatabase: true,
  },
  // ARCHITECTURE PHASE - 結合第三天的前後端概念
  {
    id: 6,
    view: 'architecture',
    title: '靜態資源的旅程',
    desc: '當瀏覽器要顯示 Logo 時，直接從 public/ 資料夾取得圖片檔案。不需要經過後端或資料庫！',
    archPhase: 'static',
  },
  {
    id: 7,
    view: 'architecture',
    title: '動態資料的旅程',
    desc: '當瀏覽器要顯示教練列表時，前端發請求給後端，後端再去資料庫撈資料，最後回傳給前端顯示。',
    archPhase: 'dynamic',
  },
  {
    id: 8,
    view: 'architecture',
    title: '兩條路徑的差別',
    desc: 'Logo 走「短路」直達，教練資料走「長路」繞一圈。所以很少變的東西用靜態，常變的用動態！',
    archPhase: 'both',
  },
  // LIVEFIT PHASE - 用教練列表情境來比喻
  {
    id: 9,
    view: 'restaurant',
    title: '用 LiveFit 來比喻',
    desc: '回到我們的健身平台。網站上有「品牌 Logo」，也有「教練列表」。',
    restaurantPhase: 0,
  },
  {
    id: 10,
    view: 'restaurant',
    title: 'Logo vs 教練列表',
    desc: 'Logo 很少換（靜態資源），教練列表隨時可能變動（動態資料）。這就是靜態和動態的差別！',
    restaurantPhase: 1,
  },
  // FOLDER PHASE
  {
    id: 11,
    view: 'folder',
    title: '回到專案資料夾',
    desc: 'Logo 是靜態資源，放在 public/ 資料夾。找到圖片後，還要找「誰在用這張圖」。',
    folderHighlight: 'public',
  },
  {
    id: 12,
    view: 'folder',
    title: '找到引用的地方',
    desc: 'LayoutHeader.vue 在使用這張 Logo 圖片。把檔名改成 logo-text-v2.png 就完成了！',
    folderHighlight: 'layouts',
  },
  // SUMMARY
  {
    id: 13,
    view: 'summary',
    title: '記住這個原則',
    desc: '以後遇到要改東西，先問自己：這個東西會經常變動嗎？會 → 改資料庫；不會 → 改檔案。',
  },
]

// === 狀態 ===

const currentStep = ref(0)
const stepData = computed(() => STEPS[currentStep.value])

// === 方法 ===

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
    title="靜態 vs 動態 互動實驗室"
    :subtitle="stepData.view === 'disaster' ? '災難故事：寫死資料的下場' : stepData.view === 'compare' ? '正確架構：資料庫的力量' : stepData.view === 'architecture' ? '架構視角：前端後端資料庫' : stepData.view === 'restaurant' ? 'LiveFit 情境：Logo vs 教練列表' : stepData.view === 'folder' ? '實戰：找到 Logo 檔案' : '總結'"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="amber"
    @prev="prevStep"
    @next="nextStep"
    @complete="handleComplete"
  >
    <!-- 自訂 Header Icon -->
    <template #icon>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500 md:h-8 md:w-8" viewBox="0 0 256 256" fill="currentColor">
        <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H216V96H40ZM216,200H40V112H216v88Zm-32-56a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,144Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,176Z"/>
      </svg>
    </template>

    <!-- 主要內容區 -->
    <div class="relative flex flex-1 flex-col overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-900 to-amber-900/20">
      <!-- 浮動粒子背景 -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="animate-float-slow absolute left-[10%] top-[20%] h-2 w-2 rounded-full bg-amber-500/20"></div>
        <div class="animate-float-medium absolute left-[25%] top-[60%] h-3 w-3 rounded-full bg-orange-500/15"></div>
        <div class="animate-float-fast absolute left-[70%] top-[30%] h-2 w-2 rounded-full bg-amber-400/20"></div>
        <div class="animate-float-slow absolute left-[85%] top-[70%] h-4 w-4 rounded-full bg-orange-400/10"></div>
      </div>

      <!-- ===== DISASTER VIEW ===== -->
      <div v-if="stepData.view === 'disaster'" class="relative flex flex-1 flex-col items-center justify-center p-4 md:p-8">
        <!-- 程式碼視窗 -->
        <div class="w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-800/90 shadow-2xl">
          <!-- 視窗標題 -->
          <div class="flex items-center gap-2 border-b border-slate-700 px-4 py-3">
            <div class="h-3 w-3 rounded-full bg-red-500"></div>
            <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div class="h-3 w-3 rounded-full bg-green-500"></div>
            <span class="ml-2 font-mono text-xs text-slate-400">CoachList.vue</span>
          </div>

          <!-- 程式碼內容 -->
          <div class="p-4 font-mono text-xs md:text-sm">
            <div class="text-slate-500">&lt;!-- 教練列表 --&gt;</div>

            <!-- 王小明 -->
            <div
              class="mt-2 rounded border-l-2 py-1 pl-3 transition-all duration-500"
              :class="stepData.disasterPhase === 1 ? 'border-red-500 bg-red-500/10 line-through opacity-50' : 'border-slate-600'"
            >
              <div class="text-orange-400">&lt;div class="coach"&gt;</div>
              <div class="ml-4 text-slate-300">&lt;h3&gt;<span class="text-green-400">王小明</span>&lt;/h3&gt;</div>
              <div class="ml-4 text-slate-300">&lt;p&gt;專長：瑜珈&lt;/p&gt;</div>
              <div class="text-orange-400">&lt;/div&gt;</div>
            </div>

            <!-- 李小華 / 李大華 -->
            <div
              class="mt-2 rounded border-l-2 py-1 pl-3 transition-all duration-500"
              :class="stepData.disasterPhase === 2 ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-600'"
            >
              <div class="text-orange-400">&lt;div class="coach"&gt;</div>
              <div class="ml-4 text-slate-300">
                &lt;h3&gt;<span :class="stepData.disasterPhase! >= 2 ? 'text-yellow-400' : 'text-green-400'">{{ stepData.disasterPhase! >= 2 ? '李大華' : '李小華' }}</span>&lt;/h3&gt;
              </div>
              <div class="ml-4 text-slate-300">&lt;p&gt;專長：重訓&lt;/p&gt;</div>
              <div class="text-orange-400">&lt;/div&gt;</div>
            </div>

            <!-- 更多教練 -->
            <div class="mt-2 text-slate-500">
              &lt;!-- 還有 48 個教練... --&gt;
            </div>

            <!-- 新增的教練（災難階段 3） -->
            <div
              v-if="stepData.disasterPhase === 3"
              class="mt-2 animate-pulse rounded border-l-2 border-green-500 bg-green-500/10 py-1 pl-3"
            >
              <div class="text-slate-400">// TODO: 新增 10 個教練...</div>
              <div class="text-slate-400">// TODO: 更新照片...</div>
              <div class="text-slate-400">// TODO: 重新部署...</div>
              <div class="mt-2 text-red-400">// (崩潰中)</div>
            </div>
          </div>
        </div>

        <!-- 災難指示器 -->
        <div class="mt-6 flex items-center gap-4">
          <div
            v-for="i in 4"
            :key="i"
            class="flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all duration-300"
            :class="(stepData.disasterPhase ?? 0) >= i - 1
              ? i === 4 ? 'bg-red-500 text-white animate-bounce' : 'bg-amber-500 text-white'
              : 'bg-slate-700 text-slate-500'"
          >
            {{ i === 4 ? '💥' : '📞' }}
          </div>
        </div>
      </div>

      <!-- ===== COMPARE VIEW ===== -->
      <div v-else-if="stepData.view === 'compare'" class="relative flex flex-1 items-start justify-center overflow-y-auto p-4 pt-2 md:items-center md:p-8">
        <div class="flex w-full max-w-4xl flex-col items-center gap-4 md:flex-row md:gap-8 md:justify-center">

          <!-- 錯誤做法 -->
          <div
            class="w-full max-w-xs rounded-xl border-2 p-6 transition-all duration-500"
            :class="stepData.showDatabase ? 'border-red-500/30 bg-red-500/5 opacity-50' : 'border-red-500 bg-red-500/10'"
          >
            <div class="mb-4 text-center text-4xl">❌</div>
            <h3 class="mb-2 text-center text-lg font-bold text-red-400">寫死在程式碼</h3>
            <div class="space-y-2 text-sm text-slate-400">
              <div class="flex items-center gap-2">
                <span class="text-red-400">•</span>
                <span>每次都要改程式碼</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-red-400">•</span>
                <span>需要重新部署</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-red-400">•</span>
                <span>容易改錯爆炸</span>
              </div>
            </div>
          </div>

          <!-- 箭頭 -->
          <div class="text-4xl text-slate-600" :class="stepData.showDatabase ? 'animate-pulse' : ''">
            {{ stepData.showDatabase ? '→' : '→' }}
          </div>

          <!-- 正確做法 -->
          <div
            class="w-full max-w-xs rounded-xl border-2 p-6 transition-all duration-500"
            :class="stepData.showDatabase ? 'border-green-500 bg-green-500/10 scale-105' : 'border-slate-600 bg-slate-800/50 opacity-50'"
          >
            <div class="mb-4 text-center text-4xl">✅</div>
            <h3 class="mb-2 text-center text-lg font-bold text-green-400">存在資料庫</h3>
            <div class="space-y-2 text-sm text-slate-400">
              <div class="flex items-center gap-2">
                <span class="text-green-400">•</span>
                <span>直接改資料庫</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-green-400">•</span>
                <span>不用重新部署</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-green-400">•</span>
                <span>網站自動更新</span>
              </div>
            </div>

            <!-- 資料流動畫 -->
            <div v-if="stepData.showDatabase" class="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span class="rounded bg-slate-700 px-2 py-1">資料庫</span>
              <span class="animate-pulse">→</span>
              <span class="rounded bg-slate-700 px-2 py-1">API</span>
              <span class="animate-pulse">→</span>
              <span class="rounded bg-slate-700 px-2 py-1">前端</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== ARCHITECTURE VIEW ===== -->
      <div v-else-if="stepData.view === 'architecture'" class="relative flex flex-1 items-start justify-center overflow-y-auto p-4 pt-2 md:items-center md:p-8">
        <div class="w-full max-w-5xl">
          <!-- 三欄架構圖 -->
          <div class="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-4">

            <!-- 瀏覽器 / 前端 -->
            <div
              class="flex-1 rounded-2xl border-2 p-4 transition-all duration-500 md:p-6"
              :class="stepData.archPhase === 'static' || stepData.archPhase === 'both'
                ? 'border-emerald-500/70 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent shadow-lg shadow-emerald-500/20'
                : stepData.archPhase === 'dynamic'
                  ? 'border-emerald-500/70 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent shadow-lg shadow-emerald-500/20'
                  : 'border-slate-700/50 bg-slate-900/30'"
            >
              <div class="mb-3 flex items-center justify-center">
                <div class="flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg md:text-base">
                  <span class="text-lg">🖥️</span>
                  <span>前端</span>
                </div>
              </div>
              <div class="text-center text-sm text-slate-500 md:text-base">瀏覽器</div>

              <!-- 瀏覽器畫面 -->
              <div class="mx-auto mt-4 w-full max-w-[200px] overflow-hidden rounded-xl border-2 border-slate-600 bg-white shadow-xl md:max-w-[220px]">
                <div class="flex h-6 items-center gap-1 bg-slate-200 px-2 md:h-7">
                  <div class="h-2.5 w-2.5 rounded-full bg-red-400"></div>
                  <div class="h-2.5 w-2.5 rounded-full bg-yellow-400"></div>
                  <div class="h-2.5 w-2.5 rounded-full bg-green-400"></div>
                </div>
                <div class="p-3 md:p-4">
                  <!-- Logo 顯示區 -->
                  <div
                    class="mb-2 flex h-10 items-center justify-center rounded transition-all duration-300 md:h-12"
                    :class="stepData.archPhase === 'static' || stepData.archPhase === 'both' ? 'bg-amber-100 ring-2 ring-amber-400' : 'bg-slate-100'"
                  >
                    <span class="text-sm font-bold md:text-base" :class="stepData.archPhase === 'static' || stepData.archPhase === 'both' ? 'text-amber-600' : 'text-slate-400'">
                      🖼️ Logo
                    </span>
                  </div>
                  <!-- 教練列表區 -->
                  <div
                    class="rounded p-2 transition-all duration-300 md:p-3"
                    :class="stepData.archPhase === 'dynamic' || stepData.archPhase === 'both' ? 'bg-sky-100 ring-2 ring-sky-400' : 'bg-slate-100'"
                  >
                    <div class="text-xs font-bold md:text-sm" :class="stepData.archPhase === 'dynamic' || stepData.archPhase === 'both' ? 'text-sky-600' : 'text-slate-400'">
                      👤 教練列表
                    </div>
                    <div class="mt-1 space-y-1">
                      <div class="h-2 w-full rounded bg-slate-200"></div>
                      <div class="h-2 w-3/4 rounded bg-slate-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 靜態資源路徑（上方） + 動態資料路徑（下方） -->
            <div class="flex flex-col items-center justify-center gap-4 py-2 md:h-64 md:py-0">
              <!-- 靜態路徑：直接連線 -->
              <div
                class="flex items-center gap-2 rounded-xl px-4 py-3 transition-all duration-500 md:px-5 md:py-4"
                :class="stepData.archPhase === 'static' || stepData.archPhase === 'both'
                  ? 'bg-amber-500/20 ring-2 ring-amber-400'
                  : 'bg-slate-800/50 opacity-40'"
              >
                <div class="text-center">
                  <div class="text-sm font-bold text-amber-400 md:text-base">靜態資源</div>
                  <div class="mt-1 flex items-center gap-2 text-xs text-slate-400 md:text-sm">
                    <span class="rounded bg-slate-700 px-2 py-1 text-xs md:text-sm">public/</span>
                    <span :class="stepData.archPhase === 'static' || stepData.archPhase === 'both' ? 'text-amber-400 animate-pulse' : ''">→</span>
                    <span class="text-xs md:text-sm">直達!</span>
                  </div>
                </div>
              </div>

              <!-- 分隔線 -->
              <div class="h-4 w-px bg-slate-700 md:h-px md:w-8"></div>

              <!-- 動態路徑：經過後端和資料庫 -->
              <div
                class="flex items-center gap-2 rounded-xl px-4 py-3 transition-all duration-500 md:px-5 md:py-4"
                :class="stepData.archPhase === 'dynamic' || stepData.archPhase === 'both'
                  ? 'bg-sky-500/20 ring-2 ring-sky-400'
                  : 'bg-slate-800/50 opacity-40'"
              >
                <div class="text-center">
                  <div class="text-sm font-bold text-sky-400 md:text-base">動態資料</div>
                  <div class="mt-1 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 md:text-sm">
                    <span>API</span>
                    <span :class="stepData.archPhase === 'dynamic' || stepData.archPhase === 'both' ? 'text-sky-400 animate-pulse' : ''">→</span>
                    <span>後端</span>
                    <span :class="stepData.archPhase === 'dynamic' || stepData.archPhase === 'both' ? 'text-sky-400 animate-pulse' : ''">→</span>
                    <span>資料庫</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 後端 Server -->
            <div
              class="flex-1 rounded-2xl border-2 p-4 transition-all duration-500 md:p-6"
              :class="stepData.archPhase === 'dynamic' || stepData.archPhase === 'both'
                ? 'border-sky-500/70 bg-gradient-to-br from-sky-500/20 via-sky-500/10 to-transparent shadow-lg shadow-sky-500/20'
                : 'border-slate-700/50 bg-slate-900/30 opacity-50'"
            >
              <div class="mb-3 flex items-center justify-center">
                <div
                  class="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-lg transition-all duration-300 md:text-base"
                  :class="stepData.archPhase === 'dynamic' || stepData.archPhase === 'both' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'"
                >
                  <span class="text-lg">⚙️</span>
                  <span>後端</span>
                </div>
              </div>
              <div class="text-center text-sm text-slate-500 md:text-base">伺服器</div>

              <!-- 伺服器視覺 -->
              <div class="mx-auto mt-4 flex h-24 w-20 flex-col items-center justify-center rounded-xl border-2 border-sky-500/30 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl md:h-28 md:w-24">
                <span class="text-3xl md:text-4xl">🖥️</span>
                <div
                  v-if="stepData.archPhase === 'dynamic' || stepData.archPhase === 'both'"
                  class="mt-2 h-1.5 w-12 overflow-hidden rounded-full bg-slate-700 md:w-16"
                >
                  <div class="h-full w-full animate-loading-bar bg-gradient-to-r from-sky-500 to-cyan-400"></div>
                </div>
              </div>
            </div>

            <!-- 連接線到資料庫 -->
            <div
              class="flex items-center justify-center transition-all duration-500 md:w-16"
              :class="stepData.archPhase === 'dynamic' || stepData.archPhase === 'both' ? 'opacity-100' : 'opacity-30'"
            >
              <div class="flex flex-col items-center gap-1">
                <svg class="h-5 w-5 text-slate-500 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                </svg>
                <span class="text-xs font-medium text-slate-500 md:text-sm">SQL</span>
              </div>
            </div>

            <!-- 資料庫 -->
            <div
              class="flex-1 rounded-2xl border-2 p-4 transition-all duration-500 md:p-6"
              :class="stepData.archPhase === 'dynamic' || stepData.archPhase === 'both'
                ? 'border-amber-500/70 bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent shadow-lg shadow-amber-500/20'
                : 'border-slate-700/50 bg-slate-900/30 opacity-50'"
            >
              <div class="mb-3 flex items-center justify-center">
                <div
                  class="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-lg transition-all duration-300 md:text-base"
                  :class="stepData.archPhase === 'dynamic' || stepData.archPhase === 'both' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400'"
                >
                  <span class="text-lg">🗄️</span>
                  <span>資料庫</span>
                </div>
              </div>
              <div class="text-center text-sm text-slate-500 md:text-base">儲存資料</div>

              <!-- 資料庫視覺 -->
              <div class="mx-auto mt-4 flex flex-col items-center">
                <div class="flex gap-2">
                  <div class="flex h-12 w-12 items-center justify-center rounded-lg border border-amber-500/30 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg md:h-14 md:w-14">
                    <span class="text-2xl md:text-3xl">👤</span>
                  </div>
                  <div class="flex h-12 w-12 items-center justify-center rounded-lg border border-amber-500/30 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg md:h-14 md:w-14">
                    <span class="text-2xl md:text-3xl">📋</span>
                  </div>
                </div>
                <div class="mt-2 text-xs text-slate-500 md:text-sm">教練 / 課程資料</div>
              </div>
            </div>
          </div>

          <!-- 底部對比說明 -->
          <div
            v-if="stepData.archPhase === 'both'"
            class="mt-6 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8"
          >
            <div class="flex items-center gap-3 rounded-xl bg-amber-500/10 px-5 py-4">
              <span class="text-3xl md:text-4xl">🖼️</span>
              <div>
                <div class="text-base font-bold text-amber-400 md:text-lg">靜態資源</div>
                <div class="text-sm text-slate-400 md:text-base">短路直達，快速!</div>
              </div>
            </div>
            <div class="text-2xl font-bold text-slate-600 md:text-3xl">VS</div>
            <div class="flex items-center gap-3 rounded-xl bg-sky-500/10 px-5 py-4">
              <span class="text-3xl md:text-4xl">👤</span>
              <div>
                <div class="text-base font-bold text-sky-400 md:text-lg">動態資料</div>
                <div class="text-sm text-slate-400 md:text-base">繞一圈，但靈活!</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== LIVEFIT VIEW (原 RESTAURANT VIEW) ===== -->
      <div v-else-if="stepData.view === 'restaurant'" class="relative flex flex-1 items-center justify-center p-4 md:p-8">
        <div class="flex w-full max-w-3xl flex-col items-center gap-6 md:flex-row md:justify-center md:gap-12">

          <!-- Logo（靜態） -->
          <div class="text-center">
            <div
              class="relative mb-4 rounded-xl border-4 bg-gradient-to-br from-amber-400 to-orange-500 p-8 shadow-xl transition-all duration-500 md:p-10"
              :class="stepData.restaurantPhase === 1 ? 'border-amber-300 ring-4 ring-amber-400/50' : 'border-amber-600'"
            >
              <div class="text-3xl font-black text-white md:text-4xl">LiveFit</div>
              <div class="mt-2 text-sm text-amber-100 md:text-base">健身工作室</div>

              <!-- 靜態標籤 -->
              <div
                v-if="stepData.restaurantPhase === 1"
                class="absolute -right-2 -top-2 rounded-full bg-blue-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg"
              >
                靜態!
              </div>
            </div>
            <div class="text-base text-slate-400 md:text-lg">🖼️ 品牌 Logo</div>
            <div v-if="stepData.restaurantPhase === 1" class="mt-2 text-sm text-amber-400 md:text-base">
              很少換（放 public/）
            </div>
          </div>

          <!-- VS -->
          <div class="text-3xl font-bold text-slate-600 md:text-4xl">VS</div>

          <!-- 教練列表（動態） -->
          <div class="text-center">
            <div
              class="relative mb-4 rounded-xl border-2 bg-slate-800 p-5 shadow-xl transition-all duration-500 md:p-6"
              :class="stepData.restaurantPhase === 1 ? 'border-green-400 ring-4 ring-green-400/50' : 'border-slate-600'"
            >
              <div class="mb-3 text-lg font-bold text-slate-300 md:text-xl">👥 教練列表</div>
              <div class="space-y-2 text-left text-base text-slate-400 md:text-lg">
                <div class="flex items-center justify-between gap-4">
                  <span class="flex items-center gap-2">
                    <span class="text-xl">🧘</span>
                    <span>海克絲</span>
                  </span>
                  <span class="text-slate-500">瑜珈教練</span>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <span class="flex items-center gap-2">
                    <span class="text-xl">💪</span>
                    <span>王小明</span>
                  </span>
                  <span class="text-red-400 line-through">已離職</span>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <span class="flex items-center gap-2">
                    <span class="text-xl">🏃</span>
                    <span>李大華</span>
                  </span>
                  <span class="text-slate-500">有氧教練</span>
                </div>
              </div>

              <!-- 動態標籤 -->
              <div
                v-if="stepData.restaurantPhase === 1"
                class="absolute -right-2 -top-2 rounded-full bg-green-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg"
              >
                動態!
              </div>
            </div>
            <div class="text-base text-slate-400 md:text-lg">📋 教練列表</div>
            <div v-if="stepData.restaurantPhase === 1" class="mt-2 text-sm text-green-400 md:text-base">
              隨時可能變動（存資料庫）
            </div>
          </div>
        </div>
      </div>

      <!-- ===== FOLDER VIEW ===== -->
      <div v-else-if="stepData.view === 'folder'" class="relative flex flex-1 items-center justify-center p-4 md:p-8">
        <div class="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-800/90 font-mono text-base shadow-2xl md:text-lg">
          <!-- 標題 -->
          <div class="border-b border-slate-700 px-5 py-4">
            <span class="text-slate-400">📁 frontend/</span>
          </div>

          <!-- 資料夾結構 -->
          <div class="p-5 text-slate-300">
            <!-- public -->
            <div
              class="rounded p-3 transition-all duration-300"
              :class="stepData.folderHighlight === 'public' ? 'bg-amber-500/20 ring-2 ring-amber-400' : ''"
            >
              <div class="flex items-center gap-2">
                <span>📁</span>
                <span :class="stepData.folderHighlight === 'public' ? 'text-amber-400 font-bold' : ''">public/</span>
                <span v-if="stepData.folderHighlight === 'public'" class="ml-2 rounded bg-amber-500 px-2 py-1 text-sm text-white">靜態資源在這!</span>
              </div>
              <div class="ml-8 mt-2 space-y-2 text-slate-500">
                <div class="flex items-center gap-2">
                  <span>🖼️</span>
                  <span :class="stepData.folderHighlight === 'public' ? 'text-amber-300' : ''">logo-text.png</span>
                  <span v-if="stepData.folderHighlight === 'public'" class="text-sm text-slate-600">← 舊的</span>
                </div>
                <div class="flex items-center gap-2">
                  <span>🖼️</span>
                  <span :class="stepData.folderHighlight === 'public' ? 'text-green-400' : ''">logo-text-v2.png</span>
                  <span v-if="stepData.folderHighlight === 'public'" class="text-sm text-green-500">← 新的!</span>
                </div>
              </div>
            </div>

            <!-- src -->
            <div class="mt-3">
              <div class="flex items-center gap-2 p-3">
                <span>📁</span>
                <span>src/</span>
              </div>

              <!-- layouts -->
              <div
                class="ml-8 rounded p-3 transition-all duration-300"
                :class="stepData.folderHighlight === 'layouts' ? 'bg-purple-500/20 ring-2 ring-purple-400' : ''"
              >
                <div class="flex items-center gap-2">
                  <span>📁</span>
                  <span :class="stepData.folderHighlight === 'layouts' ? 'text-purple-400 font-bold' : ''">layouts/</span>
                  <span v-if="stepData.folderHighlight === 'layouts'" class="ml-2 rounded bg-purple-500 px-2 py-1 text-sm text-white">引用 Logo 的地方!</span>
                </div>
                <div class="ml-8 mt-2 text-slate-500">
                  <div class="flex items-center gap-2">
                    <span>📄</span>
                    <span :class="stepData.folderHighlight === 'layouts' ? 'text-purple-300' : ''">LayoutHeader.vue</span>
                  </div>
                </div>
              </div>

              <div class="ml-8 mt-2 p-3 text-slate-600">
                <div>📁 components/</div>
                <div>📁 pages/</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== SUMMARY VIEW ===== -->
      <div v-else-if="stepData.view === 'summary'" class="relative flex flex-1 items-center justify-center p-4 md:p-8">
        <div class="w-full max-w-xl rounded-xl border border-slate-700 bg-slate-800/90 p-8 shadow-2xl">
          <h3 class="mb-6 text-center text-2xl font-bold text-white md:text-3xl">改東西之前，先問自己...</h3>

          <div class="mb-8 text-center text-2xl font-bold text-amber-400 md:text-3xl">
            「這個東西會經常變動嗎？」
          </div>

          <div class="flex justify-center gap-10 md:gap-16">
            <!-- YES -->
            <div class="text-center">
              <div class="mb-3 text-4xl md:text-5xl">✅</div>
              <div class="text-lg font-bold text-green-400 md:text-xl">會</div>
              <div class="mt-3 rounded bg-green-500/20 px-5 py-3 text-base text-green-300 md:text-lg">
                → 改資料庫
              </div>
              <div class="mt-3 text-sm text-slate-500 md:text-base">
                教練、課程、會員
              </div>
            </div>

            <!-- NO -->
            <div class="text-center">
              <div class="mb-3 text-4xl md:text-5xl">❌</div>
              <div class="text-lg font-bold text-amber-400 md:text-xl">不會</div>
              <div class="mt-3 rounded bg-amber-500/20 px-5 py-3 text-base text-amber-300 md:text-lg">
                → 改檔案
              </div>
              <div class="mt-3 text-sm text-slate-500 md:text-base">
                Logo、背景圖、favicon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </InteractiveSlideTemplate>
</template>

<style scoped>
/* 浮動粒子動畫 */
@keyframes float-slow {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
}

@keyframes float-medium {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-15px) translateX(-8px);
  }
}

@keyframes float-fast {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-10px) translateX(5px);
  }
}

.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 4s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 3s ease-in-out infinite;
}

/* loading bar 動畫 */
@keyframes loading-bar {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-loading-bar {
  animation: loading-bar 1.5s ease-in-out infinite;
}
</style>
