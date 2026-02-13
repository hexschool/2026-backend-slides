<script setup lang="ts">
/**
 * LiveFit API 互動操作 Demo
 * 模擬真實 LiveFit 網頁，展示完整資料流程
 * 當使用者「進入教練頁面」時，自動發送 GET 請求載入教練列表
 */
import { ref, computed, onMounted } from 'vue'

defineProps<{
  isMobile?: boolean
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

// 是否已開始模擬
const hasStarted = ref(false)

// 模擬教練資料（來自 API）
interface Coach {
  id: number
  name: string
  specialty: string
  experience_years: number
  description: string
  avatar: string
}

const mockCoaches: Coach[] = [
  { id: 1, name: '王小明', specialty: '重量訓練', experience_years: 5, description: '專精增肌減脂，幫助你打造理想體態', avatar: '💪' },
  { id: 2, name: '李美玲', specialty: '瑜珈伸展', experience_years: 3, description: '身心平衡專家，讓你找回內在平靜', avatar: '🧘' },
  { id: 3, name: '陳大力', specialty: '有氧運動', experience_years: 7, description: '燃脂達人，帶你突破體能極限', avatar: '🏃' },
  { id: 4, name: '林小芬', specialty: '皮拉提斯', experience_years: 4, description: '核心訓練專家，改善體態姿勢', avatar: '🤸' },
]

// 流程步驟
type FlowStep = 'idle' | 'page-load' | 'frontend-request' | 'backend-receive' | 'database-query' | 'backend-response' | 'frontend-render' | 'done'

const currentStep = ref<FlowStep>('idle')
const coaches = ref<Coach[]>([])
const isAnimating = ref(false)
const hasCompleted = ref(false)

// 簡化的流程說明（只有 3 步）
const simpleSteps = [
  { label: '發送請求', emoji: '📤' },
  { label: 'API 回傳', emoji: '📥' },
  { label: '顯示資料', emoji: '✨' },
]

// 將內部步驟對應到簡化的 3 步
const simpleStepIndex = computed(() => {
  if (currentStep.value === 'idle') return -1
  if (currentStep.value === 'page-load' || currentStep.value === 'frontend-request') return 0
  if (currentStep.value === 'backend-receive' || currentStep.value === 'database-query' || currentStep.value === 'backend-response') return 1
  if (currentStep.value === 'frontend-render' || currentStep.value === 'done') return 2
  return -1
})

// API 請求/回應顯示
const apiLog = ref<{ type: 'request' | 'response' | 'info'; content: string; time: string }[]>([])

function addLog(type: 'request' | 'response' | 'info', content: string) {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`
  apiLog.value.push({ type, content, time })
}

// 開始載入流程 - 模擬頁面載入時自動發送 GET 請求
async function startLoadCoaches() {
  if (isAnimating.value) return

  hasStarted.value = true
  isAnimating.value = true
  coaches.value = []
  apiLog.value = []

  // Step 1: 發送請求
  currentStep.value = 'page-load'
  addLog('info', '👆 點擊「教練列表」')
  await delay(800)

  currentStep.value = 'frontend-request'
  addLog('request', 'GET /api/coaches')
  addLog('info', '📤 發送請求到 API...')
  await delay(1200)

  // Step 2: API 處理中
  currentStep.value = 'backend-receive'
  addLog('info', '⚙️ API 處理中...')
  await delay(1000)

  currentStep.value = 'database-query'
  await delay(800)

  // Step 3: 回傳資料
  currentStep.value = 'backend-response'
  addLog('response', '200 OK - 取得 4 筆教練資料')
  await delay(1000)

  // Step 4: 顯示畫面
  currentStep.value = 'frontend-render'
  addLog('info', '✨ 顯示教練卡片...')
  await delay(400)

  // 逐一顯示教練卡片
  for (const coach of mockCoaches) {
    coaches.value.push(coach)
    await delay(300)
  }

  await delay(500)

  // 完成
  currentStep.value = 'done'
  isAnimating.value = false
  hasCompleted.value = true
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden bg-slate-100">
    <!-- 模擬瀏覽器 -->
    <div class="flex flex-1 flex-col overflow-hidden md:flex-row">
      <!-- 左側：模擬網頁 -->
      <div class="flex w-full flex-col border-r border-slate-300 bg-white md:w-3/5">
        <!-- 瀏覽器 Chrome -->
        <div class="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-3 py-2">
          <div class="flex gap-1.5">
            <div class="h-3 w-3 rounded-full bg-red-400"></div>
            <div class="h-3 w-3 rounded-full bg-yellow-400"></div>
            <div class="h-3 w-3 rounded-full bg-green-400"></div>
          </div>
          <div class="flex flex-1 items-center gap-2 rounded-md bg-white px-3 py-1.5 shadow-inner">
            <svg class="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm text-slate-600 transition-all">
              {{ hasStarted ? 'livefit.com/coaches' : 'livefit.com' }}
            </span>
          </div>
          <button class="rounded p-1 hover:bg-slate-200">
            <svg class="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <!-- 網頁內容 -->
        <div class="flex-1 overflow-y-auto">
          <!-- 網站 Header -->
          <header class="border-b border-slate-200 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🏋️</span>
                <span class="text-lg font-bold text-white">LiveFit</span>
              </div>
              <nav class="hidden gap-4 text-sm text-white/80 md:flex">
                <a href="#" class="hover:text-white">首頁</a>
                <a
                  href="#"
                  class="transition-all"
                  :class="hasStarted ? 'font-bold text-white underline underline-offset-4' : 'hover:text-white'"
                >教練</a>
                <a href="#" class="hover:text-white">課程</a>
                <a href="#" class="hover:text-white">關於我們</a>
              </nav>
            </div>
          </header>

          <!-- 未開始前：首頁畫面，有教練列表按鈕 -->
          <main v-if="!hasStarted" class="p-4 md:p-6">
            <!-- 首頁 Hero -->
            <div class="mb-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-6 text-center">
              <h1 class="text-2xl font-bold text-slate-800">歡迎來到 LiveFit</h1>
              <p class="mt-2 text-slate-600">打造你的健康人生，從這裡開始！</p>
            </div>

            <!-- 功能區塊 -->
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div class="mb-2 text-2xl">📅</div>
                <h3 class="font-bold text-slate-800">課程預約</h3>
                <p class="mt-1 text-sm text-slate-500">線上預約專屬課程</p>
              </div>

              <!-- 教練列表按鈕 - 這是用戶要點擊的 -->
              <button
                class="group rounded-xl border-2 border-emerald-500 bg-white p-4 text-left shadow-sm transition-all hover:border-emerald-600 hover:bg-emerald-50 hover:shadow-md"
                @click="startLoadCoaches"
              >
                <div class="mb-2 text-2xl transition-transform group-hover:scale-110">👨‍🏫</div>
                <h3 class="font-bold text-emerald-700">教練列表</h3>
                <p class="mt-1 text-sm text-slate-500">瀏覽專業教練團隊</p>
                <div class="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <span>點我進入</span>
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div class="mb-2 text-2xl">💪</div>
                <h3 class="font-bold text-slate-800">訓練紀錄</h3>
                <p class="mt-1 text-sm text-slate-500">追蹤你的運動進度</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div class="mb-2 text-2xl">🎯</div>
                <h3 class="font-bold text-slate-800">目標設定</h3>
                <p class="mt-1 text-sm text-slate-500">制定專屬訓練計畫</p>
              </div>
            </div>
          </main>

          <!-- 開始後：教練頁面 -->
          <main v-else class="p-4 md:p-6">
            <!-- 頁面標題 -->
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-slate-800">專業教練團隊</h1>
              <p class="mt-1 text-slate-500">找到最適合你的健身教練</p>
            </div>

            <!-- 載入中狀態 -->
            <div v-if="coaches.length === 0 && isAnimating" class="mb-6 flex items-center justify-center gap-2 rounded-lg bg-slate-100 py-8">
              <svg class="h-5 w-5 animate-spin text-emerald-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span class="text-slate-500">載入教練資料中...</span>
            </div>

            <!-- 教練卡片網格 -->
            <div class="grid gap-4 sm:grid-cols-2">
              <div
                v-for="(coach, index) in coaches"
                :key="coach.id"
                class="coach-card overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
                :style="{ '--delay': `${index * 150}ms` }"
              >
                <!-- 教練頭像區 -->
                <div class="flex items-center gap-4 bg-gradient-to-r from-slate-50 to-slate-100 p-4">
                  <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-3xl shadow-md">
                    {{ coach.avatar }}
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-slate-800">{{ coach.name }}</h3>
                    <div class="flex items-center gap-2">
                      <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        {{ coach.specialty }}
                      </span>
                      <span class="text-xs text-slate-500">{{ coach.experience_years }} 年經驗</span>
                    </div>
                  </div>
                </div>
                <!-- 教練簡介 -->
                <div class="p-4">
                  <p class="mb-3 text-sm text-slate-600">{{ coach.description }}</p>
                  <button class="w-full rounded-lg border border-emerald-600 py-2 text-sm font-medium text-emerald-600 transition-all hover:bg-emerald-50">
                    查看詳情
                  </button>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>

      <!-- 右側：開發者工具 -->
      <div class="flex w-full flex-col bg-slate-900 md:w-2/5">
        <!-- DevTools Header -->
        <div class="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-3 py-2">
          <div class="flex gap-4 text-xs">
            <span class="text-slate-500">Elements</span>
            <span class="text-slate-500">Console</span>
            <span class="border-b-2 border-cyan-400 pb-1 font-medium text-cyan-400">Network</span>
            <span class="text-slate-500">Sources</span>
          </div>
          <span class="text-xs text-slate-500">DevTools</span>
        </div>

        <!-- API 請求主區塊 -->
        <div class="flex flex-1 flex-col items-center justify-center p-6">
          <!-- 引導提示 -->
          <div v-if="!hasStarted" class="text-center">
            <div class="mb-4 animate-bounce text-5xl">👈</div>
            <div class="mb-2 text-xl font-bold text-cyan-400">
              點擊左側「教練列表」
            </div>
            <div class="text-slate-500">
              觀察 API 如何運作
            </div>
          </div>

          <!-- API 請求顯示（最重要的部分！） -->
          <div v-else class="w-full space-y-4">
            <!-- API 請求卡片 - 超級顯眼 -->
            <div
              class="api-card rounded-xl border-2 p-4 text-center"
              :class="simpleStepIndex >= 0 ? 'border-cyan-400 bg-cyan-500/20' : 'border-slate-600 bg-slate-800'"
            >
              <div class="mb-2 text-sm text-slate-400">API 請求</div>
              <div class="text-2xl font-bold text-cyan-300">
                GET /api/coaches
              </div>
            </div>

            <!-- 狀態顯示 -->
            <div class="flex flex-wrap items-center justify-center gap-2 text-base">
              <span :class="simpleStepIndex >= 0 ? 'text-cyan-400' : 'text-slate-600'">📤 發送</span>
              <span :class="simpleStepIndex >= 1 ? 'text-emerald-400' : 'text-slate-600'">→</span>
              <span :class="simpleStepIndex >= 1 ? 'text-emerald-400' : 'text-slate-600'">⚙️ 處理</span>
              <span :class="simpleStepIndex >= 1 ? 'text-emerald-400' : 'text-slate-600'">→</span>
              <span :class="simpleStepIndex >= 1 ? 'text-emerald-400' : 'text-slate-600'">📥 回傳</span>
              <span :class="simpleStepIndex >= 2 ? 'text-amber-400' : 'text-slate-600'">→</span>
              <span :class="simpleStepIndex >= 2 ? 'text-amber-400' : 'text-slate-600'">🎨 渲染</span>
            </div>

            <!-- 回應卡片 -->
            <div
              v-if="simpleStepIndex >= 1"
              class="api-card rounded-xl border-2 p-4 text-center"
              :class="simpleStepIndex >= 1 ? 'border-emerald-400 bg-emerald-500/20' : 'border-slate-600 bg-slate-800'"
            >
              <div class="mb-2 text-sm text-slate-400">API 回應</div>
              <div class="text-xl font-bold text-emerald-300">
                200 OK - 4 筆教練資料
              </div>
            </div>

            <!-- 前端渲染卡片 -->
            <div
              v-if="simpleStepIndex >= 2"
              class="api-card rounded-xl border-2 p-4 text-center"
              :class="simpleStepIndex >= 2 ? 'border-amber-400 bg-amber-500/20' : 'border-slate-600 bg-slate-800'"
            >
              <div class="mb-2 text-sm text-slate-400">前端渲染</div>
              <div class="text-xl font-bold text-amber-300">
                🎨 將資料顯示在畫面上
              </div>
            </div>
          </div>
        </div>

        <!-- Response Preview -->
        <div v-if="currentStep === 'done' || currentStep === 'frontend-render'" class="border-t border-slate-700 bg-slate-800/50 p-3">
          <div class="mb-2 flex items-center gap-2 text-xs">
            <span class="text-slate-400">Response Preview</span>
            <span class="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-400">200 OK</span>
          </div>
          <pre class="max-h-32 overflow-auto rounded bg-slate-900 p-2 text-xs text-emerald-300"><code>{
  "status": "success",
  "data": [
    { "id": 1, "name": "王小明", "specialty": "重量訓練" },
    { "id": 2, "name": "李美玲", "specialty": "瑜珈伸展" },
    { "id": 3, "name": "陳大力", "specialty": "有氧運動" },
    { "id": 4, "name": "林小芬", "specialty": "皮拉提斯" }
  ]
}</code></pre>
        </div>
      </div>
    </div>

    <!-- 完成按鈕 -->
    <div v-if="hasCompleted" class="border-t border-slate-300 bg-white px-4 py-3">
      <button
        class="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:from-emerald-600 hover:to-teal-600"
        @click="emit('complete')"
      >
        ✨ 我了解 API 資料流程了！
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 教練卡片 - 柔和的邊框高亮動畫，不改變透明度或位置 */
.coach-card {
  animation: gentle-highlight 0.8s ease-out var(--delay, 0ms) forwards;
  border-color: #10b981; /* emerald-500 起始 */
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
}

@keyframes gentle-highlight {
  0% {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.4);
  }
  100% {
    border-color: #e2e8f0; /* slate-200 */
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }
}

/* API 卡片柔和過渡 */
.api-card {
  transition: all 0.5s ease-out;
}
</style>
