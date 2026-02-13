<script setup lang="ts">
/**
 * 前端、後端、資料庫架構互動簡報
 * 用電商購物場景讓新手理解三層架構
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
type Step = {
  id: number
  title: string
  desc: string
  zone: 'all' | 'frontend' | 'backend' | 'database'
  action: string
}

const STEPS: Step[] = [
  {
    id: 0,
    title: '電商場景介紹',
    desc: '左邊是用戶的手機（前端），中間是訂單處理系統（後端），右邊是商品倉庫（資料庫）。',
    zone: 'all',
    action: 'idle',
  },
  {
    id: 1,
    title: '1. 點擊「立即購買」',
    desc: '消費者在商品頁面看中了限量球鞋，按下「購買」按鈕。這個動作觸發了前端程式。',
    zone: 'frontend',
    action: 'click_buy',
  },
  {
    id: 2,
    title: '2. 發送訂單請求',
    desc: '手機 App 把購買資訊（商品ID、數量、用戶ID）包裝成 JSON，透過網路發送到後端伺服器。',
    zone: 'frontend',
    action: 'sending_request',
  },
  {
    id: 3,
    title: '3. 系統接收與驗證',
    desc: '後端伺服器收到請求。首先檢查：用戶登入了嗎？資料格式對嗎？這就是「商業邏輯」。',
    zone: 'backend',
    action: 'processing_logic',
  },
  {
    id: 4,
    title: '4. 查詢庫存',
    desc: '確認用戶沒問題後，伺服器問倉庫：「這雙鞋還有貨嗎？」這就是對資料庫發送 SQL 查詢。',
    zone: 'database',
    action: 'querying_db',
  },
  {
    id: 5,
    title: '5. 倉庫回報',
    desc: '資料庫檢查記錄，發現還有 1 雙存貨，回傳結果給伺服器。資料庫只負責誠實回報數據。',
    zone: 'database',
    action: 'db_return',
  },
  {
    id: 6,
    title: '6. 建立訂單與扣庫存',
    desc: '伺服器確認有貨，進行兩件事：1. 產生訂單紀錄 2. 通知倉庫扣掉庫存。',
    zone: 'backend',
    action: 'processing_order',
  },
  {
    id: 7,
    title: '7. 回傳成功訊息',
    desc: '伺服器打包一個「訂單成功」的訊息（JSON），回傳給前端 App。',
    zone: 'frontend',
    action: 'sending_response',
  },
  {
    id: 8,
    title: '8. 顯示購買成功',
    desc: '前端 App 收到成功訊息，畫面跳轉到「感謝購買」頁面。交易完成！',
    zone: 'frontend',
    action: 'render_success',
  },
]

// === 狀態 ===
const currentStep = ref(0)

// 視覺狀態
const activeZone = ref<'all' | 'frontend' | 'backend' | 'database' | null>(null)
const browserMessage = ref<string | null>(null)
const serverWorking = ref(false)
const serverMessage = ref<string | null>(null)
const dbMessage = ref<string | null>(null)
const dbQuerying = ref(false)
const showSuccessScreen = ref(false)

const stepData = computed(() => STEPS[currentStep.value])

onMounted(() => {
  applyStepVisuals()
})

// 重置視覺狀態
function resetVisuals() {
  activeZone.value = null
  browserMessage.value = null
  serverWorking.value = false
  serverMessage.value = null
  dbMessage.value = null
  dbQuerying.value = false
  showSuccessScreen.value = false
}

// 根據步驟套用視覺效果
function applyStepVisuals() {
  resetVisuals()
  const step = stepData.value
  activeZone.value = step.zone === 'all' ? null : step.zone

  switch (step.action) {
    case 'click_buy':
      browserMessage.value = '這雙鞋我要了！'
      break

    case 'sending_request':
      browserMessage.value = '發送購買請求...'
      break

    case 'processing_logic':
      serverMessage.value = '收到！檢查用戶身份...'
      serverWorking.value = true
      break

    case 'querying_db':
      serverMessage.value = '查詢庫存中...'
      serverWorking.value = true
      dbQuerying.value = true
      dbMessage.value = 'SELECT stock FROM products WHERE id=101'
      break

    case 'db_return':
      dbMessage.value = '{ "stock": 1, "status": "available" }'
      serverMessage.value = '太好了，還有貨！'
      break

    case 'processing_order':
      serverWorking.value = true
      serverMessage.value = '建立訂單 #888...'
      dbMessage.value = 'INSERT INTO orders... ✓\nUPDATE products SET stock=0... ✓'
      break

    case 'sending_response':
      browserMessage.value = '收到回應！'
      break

    case 'render_success':
      showSuccessScreen.value = true
      browserMessage.value = '購買成功！🎉'
      break
  }
}

// 監聽步驟變化
watch(currentStep, () => {
  applyStepVisuals()
})

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
    title="全端電商架構"
    subtitle="用網購流程搞懂前端、後端、資料庫"
    icon="🛒"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="amber"
    @prev="prevStep"
    @next="nextStep"
    @complete="handleComplete"
  >
    <!-- 背景動畫粒子 -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="animate-float-slow absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl"></div>
      <div class="animate-float-slower absolute right-[10%] top-[30%] h-48 w-48 rounded-full bg-sky-500/5 blur-3xl"></div>
      <div class="animate-float absolute bottom-[20%] left-[50%] h-56 w-56 rounded-full bg-amber-500/5 blur-3xl"></div>
    </div>

    <!-- 主要場景區域 - 手機版可水平滾動 -->
    <div class="relative flex flex-1 items-center overflow-x-auto overflow-y-hidden p-4 md:justify-center md:overflow-x-visible md:p-8">
      <div class="relative flex h-full min-w-max items-stretch gap-4 md:min-w-0 md:w-full md:max-w-6xl md:gap-6">

        <!-- ========== ZONE 1: FRONTEND ========== -->
        <div
          class="relative flex w-64 shrink-0 flex-col rounded-3xl border-2 p-4 transition-all duration-500 md:w-auto md:flex-1 md:p-6"
          :class="activeZone === 'frontend'
            ? 'border-emerald-500/70 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent shadow-lg shadow-emerald-500/20'
            : 'border-slate-700/50 bg-slate-900/30'"
        >
          <!-- Zone Label -->
          <div class="mb-4 flex items-center justify-center">
            <div
              class="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-lg transition-all duration-300 md:text-base"
              :class="activeZone === 'frontend' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'"
            >
              <span class="text-lg">🖥️</span>
              <span>前端 Frontend</span>
            </div>
          </div>
          <div class="mb-4 text-center text-sm font-medium uppercase tracking-widest text-slate-500 md:mb-6 md:text-base">網頁商城 / Browser</div>

          <!-- 前端內容區 -->
          <div class="relative flex flex-1 flex-col items-center justify-center">
            <!-- 使用者 + 手機組合 -->
            <div class="flex items-end gap-4">
              <!-- 使用者 -->
              <div class="flex flex-col items-center">
                <div class="relative">
                  <div class="absolute -inset-3 rounded-full bg-amber-500/20 blur-xl"></div>
                  <div class="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl md:h-20 md:w-20">
                    <span class="text-3xl md:text-4xl">🙋</span>
                  </div>
                </div>
                <span class="mt-2 text-xs font-bold text-slate-400">消費者</span>
              </div>

              <!-- 手機裝置 -->
              <div class="relative">
                <div class="absolute -inset-2 rounded-3xl bg-emerald-500/10 blur-xl"></div>
                <div class="relative h-40 w-24 overflow-hidden rounded-3xl border-4 border-slate-600 bg-slate-800 shadow-2xl md:h-52 md:w-28">
                  <!-- 手機螢幕 -->
                  <div class="h-full w-full overflow-hidden rounded-2xl bg-white">
                    <!-- App Header -->
                    <div class="flex h-6 items-center justify-center bg-emerald-500 md:h-8">
                      <span class="text-[10px] font-bold text-white md:text-xs">🛒 LiveFit Shop</span>
                    </div>

                    <!-- 成功畫面 -->
                    <div v-if="showSuccessScreen" class="flex h-full flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-white p-2">
                      <span class="text-3xl md:text-4xl">🎉</span>
                      <span class="mt-1 text-[10px] font-bold text-emerald-600 md:text-xs">購買成功！</span>
                      <span class="mt-0.5 text-[8px] text-slate-500 md:text-[10px]">訂單 #888</span>
                    </div>

                    <!-- 商品畫面 -->
                    <div v-else class="p-2 md:p-3">
                      <div class="mb-2 h-16 rounded-lg bg-slate-100 md:h-20"></div>
                      <div class="mb-1 h-2 w-3/4 rounded bg-slate-200 md:h-2.5"></div>
                      <div class="mb-2 h-2 w-1/2 rounded bg-slate-200 md:h-2.5"></div>
                      <div class="text-[10px] font-bold text-slate-800 md:text-xs">NT$ 3,990</div>
                      <button
                        class="mt-2 w-full rounded-lg py-1.5 text-[10px] font-bold text-white transition-all md:py-2 md:text-xs"
                        :class="activeZone === 'frontend' ? 'animate-pulse bg-orange-500' : 'bg-orange-400'"
                      >
                        立即購買
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 對話泡泡 -->
            <div
              v-if="browserMessage"
              class="absolute -top-2 right-4 max-w-[140px] md:right-8 md:max-w-[180px]"
            >
              <div class="relative rounded-2xl border border-emerald-500/30 bg-slate-800 p-3 shadow-xl">
                <div class="absolute -bottom-2 left-6 h-4 w-4 rotate-45 border-b border-r border-emerald-500/30 bg-slate-800"></div>
                <p class="text-xs font-medium text-white md:text-sm">{{ browserMessage }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ========== 連接線 ========== -->
        <div class="relative flex w-12 shrink-0 flex-col items-center justify-center md:w-24">
          <div class="absolute inset-y-[20%] left-1/2 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-emerald-500/30 via-sky-500/30 to-sky-500/30"></div>
          <div class="flex flex-col items-center gap-2">
            <svg class="h-5 w-5 text-slate-500 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
            <span class="text-[10px] font-medium text-slate-500 md:text-xs">HTTP</span>
          </div>
        </div>

        <!-- ========== ZONE 2: BACKEND ========== -->
        <div
          class="relative flex w-64 shrink-0 flex-col rounded-3xl border-2 p-4 transition-all duration-500 md:w-auto md:flex-1 md:p-6"
          :class="activeZone === 'backend'
            ? 'border-sky-500/70 bg-gradient-to-br from-sky-500/20 via-sky-500/10 to-transparent shadow-lg shadow-sky-500/20'
            : 'border-slate-700/50 bg-slate-900/30'"
        >
          <div class="mb-4 flex items-center justify-center">
            <div
              class="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-lg transition-all duration-300 md:text-base"
              :class="activeZone === 'backend' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'"
            >
              <span class="text-lg">⚙️</span>
              <span>後端 Backend</span>
            </div>
          </div>
          <div class="mb-4 text-center text-sm font-medium uppercase tracking-widest text-slate-500 md:mb-6 md:text-base">訂單處理中心 / Server</div>

          <div class="relative flex flex-1 flex-col items-center justify-center">
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-sky-500/10 blur-2xl"></div>
              <div class="relative flex h-32 w-24 flex-col items-center justify-center rounded-2xl border-2 border-sky-500/30 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl md:h-40 md:w-32">
                <div class="absolute left-2 top-2 flex flex-col gap-1">
                  <div class="h-1.5 w-1.5 rounded-full bg-emerald-400" :class="serverWorking ? 'animate-pulse' : ''"></div>
                  <div class="h-1.5 w-1.5 rounded-full" :class="serverWorking ? 'bg-sky-400 animate-pulse' : 'bg-slate-600'"></div>
                </div>
                <div class="relative">
                  <span class="text-4xl md:text-5xl">🖥️</span>
                  <span v-if="serverWorking" class="absolute -right-3 -top-3 text-2xl animate-spin-slow md:text-3xl">⚙️</span>
                </div>
                <div v-if="serverWorking" class="mt-3 h-1 w-16 overflow-hidden rounded-full bg-slate-700 md:w-20">
                  <div class="h-full w-full animate-loading-bar bg-gradient-to-r from-sky-500 to-cyan-400"></div>
                </div>
              </div>
              <div class="mt-3 text-center text-xs font-bold text-sky-400 md:text-sm">API Server</div>
            </div>

            <div v-if="serverMessage" class="absolute -top-2 left-1/2 -translate-x-1/2 md:top-0">
              <div class="relative whitespace-nowrap rounded-2xl border border-sky-500/30 bg-slate-800 px-4 py-2 shadow-xl">
                <div class="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-sky-500/30 bg-slate-800"></div>
                <p class="text-xs font-medium text-white md:text-sm">{{ serverMessage }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ========== 連接線 ========== -->
        <div class="relative flex w-12 shrink-0 flex-col items-center justify-center md:w-24">
          <div class="absolute inset-y-[20%] left-1/2 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-sky-500/30 via-amber-500/30 to-amber-500/30"></div>
          <div class="flex flex-col items-center gap-2">
            <svg class="h-5 w-5 text-slate-500 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
            <span class="text-[10px] font-medium text-slate-500 md:text-xs">SQL</span>
          </div>
        </div>

        <!-- ========== ZONE 3: DATABASE ========== -->
        <div
          class="relative flex w-64 shrink-0 flex-col rounded-3xl border-2 p-4 transition-all duration-500 md:w-auto md:flex-1 md:p-6"
          :class="activeZone === 'database'
            ? 'border-amber-500/70 bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent shadow-lg shadow-amber-500/20'
            : 'border-slate-700/50 bg-slate-900/30'"
        >
          <div class="mb-4 flex items-center justify-center">
            <div
              class="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-lg transition-all duration-300 md:text-base"
              :class="activeZone === 'database' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400'"
            >
              <span class="text-lg">🗄️</span>
              <span>資料庫 Database</span>
            </div>
          </div>
          <div class="mb-4 text-center text-sm font-medium uppercase tracking-widest text-slate-500 md:mb-6 md:text-base">商品倉庫 / Storage</div>

          <div class="relative flex flex-1 flex-col items-center justify-center">
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-amber-500/10 blur-2xl"></div>
              <div class="relative flex flex-col items-center">
                <div class="flex gap-2">
                  <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg md:h-14 md:w-14">
                    <span class="text-2xl md:text-3xl">📦</span>
                  </div>
                  <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg md:h-14 md:w-14">
                    <span class="text-2xl opacity-75 md:text-3xl">📦</span>
                  </div>
                </div>
                <div class="my-2 h-2 w-32 rounded-full bg-slate-700 md:w-36"></div>
                <div class="flex gap-2">
                  <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg md:h-14 md:w-14">
                    <span class="text-2xl opacity-60 md:text-3xl">📦</span>
                  </div>
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-xl border bg-gradient-to-br shadow-lg transition-all md:h-14 md:w-14"
                    :class="dbQuerying ? 'border-amber-400 from-amber-500/20 to-slate-900 animate-pulse' : 'border-amber-500/30 from-slate-800 to-slate-900'"
                  >
                    <span class="text-2xl md:text-3xl">👟</span>
                  </div>
                  <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg md:h-14 md:w-14">
                    <span class="text-2xl opacity-80 md:text-3xl">📦</span>
                  </div>
                </div>
                <div class="mt-2 h-2 w-40 rounded-full bg-slate-700 md:w-44"></div>
              </div>
              <div class="mt-3 text-center text-xs font-bold text-amber-400 md:text-sm">PostgreSQL</div>
            </div>

            <div v-if="dbMessage" class="absolute bottom-0 left-0 right-0">
              <div class="mx-auto max-w-[200px] overflow-hidden rounded-xl border border-slate-600 bg-slate-900 shadow-2xl md:max-w-[240px]">
                <div class="flex items-center gap-1.5 border-b border-slate-700 bg-slate-800 px-3 py-1.5">
                  <div class="h-2 w-2 rounded-full bg-red-500"></div>
                  <div class="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <div class="h-2 w-2 rounded-full bg-green-500"></div>
                  <span class="ml-2 text-[10px] text-slate-500">SQL Terminal</span>
                </div>
                <div class="p-2 font-mono text-[10px] leading-relaxed text-emerald-400 md:p-3 md:text-xs">
                  <span class="text-slate-500">></span> {{ dbMessage }}<span class="animate-blink">_</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </InteractiveSlideTemplate>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-20px) translateX(10px); }
  50% { transform: translateY(0) translateX(20px); }
  75% { transform: translateY(20px) translateX(10px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-30px) translateX(-20px); }
}

@keyframes float-slower {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(20px) translateX(30px); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@keyframes loading-bar {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-float { animation: float 8s ease-in-out infinite; }
.animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
.animate-float-slower { animation: float-slower 15s ease-in-out infinite; }
.animate-spin-slow { animation: spin-slow 3s linear infinite; }
.animate-blink { animation: blink 1s step-end infinite; }
.animate-loading-bar { animation: loading-bar 1.5s ease-in-out infinite; }
</style>
