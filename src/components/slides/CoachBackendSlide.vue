<script setup lang="ts">
import { ref, computed } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{
  isMobile?: boolean
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

// 步驟定義
type StepData = {
  view: 'login' | 'dashboard' | 'form' | 'flow' | 'result'
  loginPhase: number // 0: 初始, 1: 輸入中, 2: 登入成功
  formPhase: number // 0: 空白, 1: 填寫中, 2: 填寫完成
  flowPhase: number // 0: 初始, 1: 送出, 2: API, 3: 後端, 4: 資料庫, 5: 完成
}

const steps: Array<{ title: string; description: string; data: StepData }> = [
  {
    title: '教練登入後台',
    description: '海克絲教練要新增一堂瑜珈課程，她先登入自己的帳號...',
    data: { view: 'login', loginPhase: 0, formPhase: 0, flowPhase: 0 },
  },
  {
    title: '輸入帳號密碼',
    description: '用自己的 Email 和密碼登入',
    data: { view: 'login', loginPhase: 1, formPhase: 0, flowPhase: 0 },
  },
  {
    title: '登入成功！',
    description: '驗證通過，進入教練後台...',
    data: { view: 'login', loginPhase: 2, formPhase: 0, flowPhase: 0 },
  },
  {
    title: '教練後台 - 課程管理',
    description: '這是教練的專屬後台，可以管理自己開設的課程',
    data: { view: 'dashboard', loginPhase: 2, formPhase: 0, flowPhase: 0 },
  },
  {
    title: '點擊「新增課程」',
    description: '海克絲想開一堂新的瑜珈課...',
    data: { view: 'form', loginPhase: 2, formPhase: 0, flowPhase: 0 },
  },
  {
    title: '填寫課程資料',
    description: '輸入課程名稱、時間、人數上限等資訊...',
    data: { view: 'form', loginPhase: 2, formPhase: 1, flowPhase: 0 },
  },
  {
    title: '資料填寫完成',
    description: '確認資料無誤後，按下「新增課程」按鈕',
    data: { view: 'form', loginPhase: 2, formPhase: 2, flowPhase: 0 },
  },
  {
    title: '資料開始傳送',
    description: '按下按鈕後，資料會經過一連串的流程...',
    data: { view: 'flow', loginPhase: 2, formPhase: 2, flowPhase: 1 },
  },
  {
    title: '前端發送 API 請求',
    description: '表單資料透過 API 發送到後端伺服器',
    data: { view: 'flow', loginPhase: 2, formPhase: 2, flowPhase: 2 },
  },
  {
    title: '後端處理請求',
    description: '後端接收資料，驗證格式是否正確',
    data: { view: 'flow', loginPhase: 2, formPhase: 2, flowPhase: 3 },
  },
  {
    title: '資料存入資料庫',
    description: '驗證通過後，將課程資料存入資料庫',
    data: { view: 'flow', loginPhase: 2, formPhase: 2, flowPhase: 4 },
  },
  {
    title: '新增成功！',
    description: '資料已儲存，前端收到成功回應',
    data: { view: 'flow', loginPhase: 2, formPhase: 2, flowPhase: 5 },
  },
  {
    title: '前台自動更新',
    description: '使用者瀏覽網站時，會從資料庫取得最新的課程列表，完全不需要工程師改程式碼！',
    data: { view: 'result', loginPhase: 2, formPhase: 2, flowPhase: 5 },
  },
]

const currentStep = ref(0)
const stepData = computed(() => steps[currentStep.value].data)
const stepTitle = computed(() => steps[currentStep.value].title)
const stepDescription = computed(() => steps[currentStep.value].description)

function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  } else {
    emit('complete')
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}
</script>

<template>
  <InteractiveSlideTemplate
    title="教練後台：新增課程流程"
    :currentStep="currentStep"
    :totalSteps="steps.length"
    :stepTitle="stepTitle"
    :stepDesc="stepDescription"
    @next="nextStep"
    @prev="prevStep"
    @complete="emit('complete')"
  >
    <div class="flex h-full flex-col">
      <!-- ===== LOGIN VIEW ===== -->
      <div v-if="stepData.view === 'login'" class="relative flex flex-1 items-center justify-center p-4 md:p-8">
        <div class="w-full max-w-md">
          <!-- 登入框 -->
          <div class="rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow-2xl">
            <div class="mb-6 text-center">
              <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
                <span class="text-2xl font-black text-white">LF</span>
              </div>
              <h2 class="text-xl font-bold text-white">LiveFit 教練登入</h2>
            </div>

            <!-- Email 欄位 -->
            <div class="mb-4">
              <label class="mb-2 block text-sm font-medium text-slate-300">Email</label>
              <div
                class="rounded-lg border-2 bg-slate-700 px-4 py-3 transition-all duration-300"
                :class="stepData.loginPhase >= 1 ? 'border-amber-500' : 'border-slate-600'"
              >
                <span
                  class="text-slate-300"
                  :class="stepData.loginPhase >= 1 ? 'opacity-100' : 'opacity-50'"
                >
                  {{ stepData.loginPhase >= 1 ? 'hexs@livefit.com' : '請輸入 Email' }}
                </span>
              </div>
            </div>

            <!-- 密碼欄位 -->
            <div class="mb-6">
              <label class="mb-2 block text-sm font-medium text-slate-300">密碼</label>
              <div
                class="rounded-lg border-2 bg-slate-700 px-4 py-3 transition-all duration-300"
                :class="stepData.loginPhase >= 1 ? 'border-amber-500' : 'border-slate-600'"
              >
                <span
                  class="text-slate-300"
                  :class="stepData.loginPhase >= 1 ? 'opacity-100' : 'opacity-50'"
                >
                  {{ stepData.loginPhase >= 1 ? '••••••••' : '請輸入密碼' }}
                </span>
              </div>
            </div>

            <!-- 登入按鈕 -->
            <button
              class="w-full rounded-lg py-3 font-bold transition-all duration-300"
              :class="stepData.loginPhase === 2
                ? 'bg-green-500 text-white'
                : 'bg-amber-500 text-slate-900 hover:bg-amber-400'"
            >
              {{ stepData.loginPhase === 2 ? '登入成功 ✓' : '登入' }}
            </button>
          </div>

          <!-- 登入成功提示 -->
          <div
            v-if="stepData.loginPhase === 2"
            class="mt-4 rounded-lg bg-green-500/20 p-4 text-center text-green-400"
          >
            歡迎回來，海克絲教練！
          </div>
        </div>
      </div>

      <!-- ===== DASHBOARD VIEW ===== -->
      <div v-else-if="stepData.view === 'dashboard'" class="relative flex flex-1 items-center justify-center p-4 md:p-8">
        <div class="w-full max-w-2xl">
          <div class="rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-slate-700 p-4">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
                  <span class="text-sm font-black text-white">LF</span>
                </div>
                <div>
                  <div class="text-sm text-slate-400">教練後台</div>
                  <div class="font-medium text-white">海克絲</div>
                </div>
              </div>
              <button class="rounded-lg bg-amber-500 px-4 py-2 font-bold text-slate-900 ring-4 ring-amber-500/30 transition-all hover:bg-amber-400">
                + 新增課程
              </button>
            </div>

            <!-- 課程列表 -->
            <div class="p-4">
              <h3 class="mb-4 text-lg font-bold text-white">我的課程</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between rounded-lg bg-slate-700 p-4">
                  <div>
                    <div class="font-medium text-white">晨間瑜珈</div>
                    <div class="text-sm text-slate-400">週一 09:00 - 09:50</div>
                  </div>
                  <span class="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">進行中</span>
                </div>
                <div class="flex items-center justify-between rounded-lg bg-slate-700 p-4">
                  <div>
                    <div class="font-medium text-white">舒壓伸展</div>
                    <div class="text-sm text-slate-400">週三 14:00 - 14:50</div>
                  </div>
                  <span class="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400">尚未開始</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== FORM VIEW ===== -->
      <div v-else-if="stepData.view === 'form'" class="relative flex flex-1 items-center justify-center p-4 md:p-8">
        <div class="w-full max-w-lg">
          <div class="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
            <h2 class="mb-6 text-xl font-bold text-white">新增課程</h2>

            <div class="space-y-4">
              <!-- 課程名稱 -->
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-300">課程名稱 <span class="text-red-400">*</span></label>
                <div
                  class="rounded-lg border-2 bg-slate-700 px-4 py-3 transition-all duration-300"
                  :class="stepData.formPhase >= 1 ? 'border-amber-500' : 'border-slate-600'"
                >
                  <span :class="stepData.formPhase >= 1 ? 'text-white' : 'text-slate-500'">
                    {{ stepData.formPhase >= 1 ? '療癒瑜珈' : '請輸入課程名稱' }}
                  </span>
                </div>
              </div>

              <!-- 課程類別 -->
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-300">課程類別 <span class="text-red-400">*</span></label>
                <div
                  class="rounded-lg border-2 bg-slate-700 px-4 py-3 transition-all duration-300"
                  :class="stepData.formPhase >= 1 ? 'border-amber-500' : 'border-slate-600'"
                >
                  <span :class="stepData.formPhase >= 1 ? 'text-white' : 'text-slate-500'">
                    {{ stepData.formPhase >= 1 ? '瑜珈' : '請選擇課程類別' }}
                  </span>
                </div>
              </div>

              <!-- 上課日期 -->
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-300">上課日期 <span class="text-red-400">*</span></label>
                <div
                  class="rounded-lg border-2 bg-slate-700 px-4 py-3 transition-all duration-300"
                  :class="stepData.formPhase >= 1 ? 'border-amber-500' : 'border-slate-600'"
                >
                  <span :class="stepData.formPhase >= 1 ? 'text-white' : 'text-slate-500'">
                    {{ stepData.formPhase >= 1 ? '2025-01-20' : '請選擇日期' }}
                  </span>
                </div>
              </div>

              <!-- 時段 -->
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-300">選擇時段 <span class="text-red-400">*</span></label>
                <div
                  class="rounded-lg border-2 bg-slate-700 px-4 py-3 transition-all duration-300"
                  :class="stepData.formPhase >= 1 ? 'border-amber-500' : 'border-slate-600'"
                >
                  <span :class="stepData.formPhase >= 1 ? 'text-white' : 'text-slate-500'">
                    {{ stepData.formPhase >= 1 ? '19:00 ~ 19:50' : '請選擇時段' }}
                  </span>
                </div>
              </div>

              <!-- 最大人數 -->
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-300">最大人數 <span class="text-red-400">*</span></label>
                <div
                  class="rounded-lg border-2 bg-slate-700 px-4 py-3 transition-all duration-300"
                  :class="stepData.formPhase >= 1 ? 'border-amber-500' : 'border-slate-600'"
                >
                  <span :class="stepData.formPhase >= 1 ? 'text-white' : 'text-slate-500'">
                    {{ stepData.formPhase >= 1 ? '20' : '1' }}
                  </span>
                </div>
              </div>

              <!-- 按鈕 -->
              <div class="flex justify-end gap-3 pt-4">
                <button class="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white">
                  取消
                </button>
                <button
                  class="rounded-lg px-4 py-2 font-bold transition-all duration-300"
                  :class="stepData.formPhase === 2
                    ? 'bg-amber-500 text-slate-900 ring-4 ring-amber-500/30'
                    : 'bg-slate-600 text-slate-400'"
                >
                  新增課程
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== FLOW VIEW ===== -->
      <div v-else-if="stepData.view === 'flow'" class="relative flex flex-1 items-center justify-center p-4 md:p-8">
        <div class="w-full max-w-4xl">
          <div class="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-8">
            <!-- 前端 -->
            <div
              class="flex flex-col items-center rounded-xl border-2 p-4 transition-all duration-300"
              :class="stepData.flowPhase >= 1 ? 'border-green-500 bg-green-500/10' : 'border-slate-600 bg-slate-800'"
            >
              <span class="text-3xl">📱</span>
              <span class="mt-2 font-bold text-white">前端</span>
              <span class="text-sm text-slate-400">表單資料</span>
              <div v-if="stepData.flowPhase === 1" class="mt-2 text-2xl animate-bounce">📤</div>
            </div>

            <!-- 箭頭 1 -->
            <div class="flex items-center">
              <div
                class="h-1 w-12 rounded transition-all duration-300 md:w-16"
                :class="stepData.flowPhase >= 2 ? 'bg-amber-500' : 'bg-slate-600'"
              ></div>
              <div
                class="border-8 border-transparent transition-all duration-300"
                :class="stepData.flowPhase >= 2 ? 'border-l-amber-500' : 'border-l-slate-600'"
              ></div>
            </div>

            <!-- API -->
            <div
              class="flex flex-col items-center rounded-xl border-2 p-4 transition-all duration-300"
              :class="stepData.flowPhase >= 2 ? 'border-amber-500 bg-amber-500/10' : 'border-slate-600 bg-slate-800'"
            >
              <span class="text-3xl">🔗</span>
              <span class="mt-2 font-bold text-white">API</span>
              <span class="text-sm text-slate-400">POST /courses</span>
              <div v-if="stepData.flowPhase === 2" class="mt-2 text-2xl animate-pulse">⚡</div>
            </div>

            <!-- 箭頭 2 -->
            <div class="flex items-center">
              <div
                class="h-1 w-12 rounded transition-all duration-300 md:w-16"
                :class="stepData.flowPhase >= 3 ? 'bg-sky-500' : 'bg-slate-600'"
              ></div>
              <div
                class="border-8 border-transparent transition-all duration-300"
                :class="stepData.flowPhase >= 3 ? 'border-l-sky-500' : 'border-l-slate-600'"
              ></div>
            </div>

            <!-- 後端 -->
            <div
              class="flex flex-col items-center rounded-xl border-2 p-4 transition-all duration-300"
              :class="stepData.flowPhase >= 3 ? 'border-sky-500 bg-sky-500/10' : 'border-slate-600 bg-slate-800'"
            >
              <span class="text-3xl">🖥️</span>
              <span class="mt-2 font-bold text-white">後端</span>
              <span class="text-sm text-slate-400">驗證 & 處理</span>
              <div v-if="stepData.flowPhase === 3" class="mt-2 text-2xl animate-spin">⚙️</div>
            </div>

            <!-- 箭頭 3 -->
            <div class="flex items-center">
              <div
                class="h-1 w-12 rounded transition-all duration-300 md:w-16"
                :class="stepData.flowPhase >= 4 ? 'bg-purple-500' : 'bg-slate-600'"
              ></div>
              <div
                class="border-8 border-transparent transition-all duration-300"
                :class="stepData.flowPhase >= 4 ? 'border-l-purple-500' : 'border-l-slate-600'"
              ></div>
            </div>

            <!-- 資料庫 -->
            <div
              class="flex flex-col items-center rounded-xl border-2 p-4 transition-all duration-300"
              :class="stepData.flowPhase >= 4 ? 'border-purple-500 bg-purple-500/10' : 'border-slate-600 bg-slate-800'"
            >
              <span class="text-3xl">🗄️</span>
              <span class="mt-2 font-bold text-white">資料庫</span>
              <span class="text-sm text-slate-400">儲存資料</span>
              <div v-if="stepData.flowPhase === 4" class="mt-2 text-2xl animate-bounce">💾</div>
            </div>
          </div>

          <!-- 成功訊息 -->
          <div
            v-if="stepData.flowPhase === 5"
            class="mt-8 rounded-xl bg-green-500/20 p-6 text-center"
          >
            <div class="text-4xl">✅</div>
            <div class="mt-2 text-xl font-bold text-green-400">課程新增成功！</div>
            <div class="mt-1 text-slate-400">資料已儲存到資料庫</div>
          </div>
        </div>
      </div>

      <!-- ===== RESULT VIEW ===== -->
      <div v-else-if="stepData.view === 'result'" class="relative flex flex-1 items-center justify-center p-4 md:p-8">
        <div class="flex w-full max-w-4xl flex-col gap-6 md:flex-row">
          <!-- 前台網站 -->
          <div class="flex-1 rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-2xl">
            <div class="mb-4 flex items-center gap-2 border-b border-slate-700 pb-3">
              <div class="flex gap-1.5">
                <div class="h-3 w-3 rounded-full bg-red-500"></div>
                <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div class="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div class="ml-2 flex-1 rounded bg-slate-700 px-3 py-1 text-sm text-slate-400">
                livefit.com/courses
              </div>
            </div>

            <h3 class="mb-4 text-lg font-bold text-white">本週課程</h3>
            <div class="space-y-3">
              <div class="rounded-lg bg-slate-700 p-3">
                <div class="font-medium text-white">晨間瑜珈</div>
                <div class="text-sm text-slate-400">海克絲 · 週一 09:00</div>
              </div>
              <div class="rounded-lg bg-slate-700 p-3">
                <div class="font-medium text-white">舒壓伸展</div>
                <div class="text-sm text-slate-400">海克絲 · 週三 14:00</div>
              </div>
              <!-- 新課程 - 高亮顯示 -->
              <div class="rounded-lg border-2 border-green-500 bg-green-500/10 p-3 ring-4 ring-green-500/20">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-white">療癒瑜珈</span>
                  <span class="rounded bg-green-500 px-2 py-0.5 text-xs font-bold text-white">NEW!</span>
                </div>
                <div class="text-sm text-slate-400">海克絲 · 週一 19:00</div>
              </div>
            </div>
          </div>

          <!-- 說明文字 -->
          <div class="flex flex-1 flex-col justify-center">
            <div class="rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6">
              <h3 class="mb-4 text-xl font-bold text-green-400">動態資料的好處</h3>
              <ul class="space-y-3 text-slate-300">
                <li class="flex items-start gap-2">
                  <span class="text-green-400">✓</span>
                  <span>教練自己就能新增課程</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400">✓</span>
                  <span>不需要工程師改程式碼</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400">✓</span>
                  <span>前台網站自動顯示新資料</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-400">✓</span>
                  <span>不需要重新部署網站</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </InteractiveSlideTemplate>
</template>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
