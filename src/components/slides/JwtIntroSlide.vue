<script setup lang="ts">
/**
 * JWT 介紹互動簡報：用餐廳號碼牌理解 JWT
 * Day 8 - 身份驗證概念
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
type StepView = 'intro' | 'reservation' | 'ticket' | 'verify' | 'structure' | 'security' | 'env-question' | 'env-file' | 'env-signing' | 'api-request' | 'env-warning' | 'summary'

type Step = {
  id: number
  view: StepView
  title: string
  desc: string
}

const STEPS: Step[] = [
  {
    id: 0,
    view: 'intro',
    title: 'HTTP 是無狀態的',
    desc: '每次你發送請求，伺服器都不記得你是誰。就像每次進便利商店，店員都不認識你一樣。',
  },
  {
    id: 1,
    view: 'reservation',
    title: '想像你在預約餐廳...',
    desc: '你上網預約一家熱門餐廳，填好姓名、人數、時間、備註「我要靠窗座位」。',
  },
  {
    id: 2,
    view: 'ticket',
    title: '餐廳給你一組號碼牌',
    desc: '預約完成後，餐廳給你一組號碼：「12 號」。這就是你的通行證！',
  },
  {
    id: 3,
    view: 'verify',
    title: '到餐廳時只要說號碼',
    desc: '「我是 12 號」— 服務生查號碼就知道你所有資料，不用重複問你是誰、幾點、幾個人。',
  },
  {
    id: 4,
    view: 'structure',
    title: 'JWT 的三個部分',
    desc: 'JWT 就像這張號碼牌，由三個部分組成：標頭（類型）、內容（你的資料）、簽名（防偽章）。',
  },
  {
    id: 5,
    view: 'security',
    title: '為什麼無法偽造？',
    desc: '號碼牌上有餐廳的「秘密印章」，只有餐廳知道怎麼蓋。別人無法偽造一張假的 12 號！',
  },
  {
    id: 6,
    view: 'env-question',
    title: '印章要放哪裡？',
    desc: '這個秘密印章很重要！如果直接寫在程式碼裡，就像把家裡鑰匙貼在大門上一樣危險。',
  },
  {
    id: 7,
    view: 'env-file',
    title: '放進保險箱！',
    desc: '我們會把秘密印章放進一個叫 .env 的「保險箱」檔案，只有後端工程師自己的電腦看得到。',
  },
  {
    id: 8,
    view: 'env-signing',
    title: '蓋章的過程',
    desc: '當你登入時，Node.js 會從保險箱拿出印章，幫你的資料蓋章，產生專屬的號碼牌！',
  },
  {
    id: 9,
    view: 'api-request',
    title: '帶著號碼牌購物',
    desc: '拿到 JWT 後，之後每次發 API 請求都要帶著它，後端才知道「是誰在買東西」！',
  },
  {
    id: 10,
    view: 'env-warning',
    title: '記得鎖好保險箱',
    desc: '這個保險箱（.env）絕對不能上傳到網路上，否則全世界都能看到你的秘密！',
  },
  {
    id: 11,
    view: 'summary',
    title: 'JWT 就這麼簡單！',
    desc: '登入時後端給你一張「號碼牌」（JWT），之後每次請求都帶著它，後端一查就知道你是誰。',
  },
]

// === 狀態 ===
const currentStep = ref(0)
const isTransitioning = ref(false)
const mounted = ref(false)

// 動畫狀態
const animState = ref(0)

const stepData = computed(() => STEPS[currentStep.value])

onMounted(() => {
  mounted.value = true
  triggerStepAnimation()
})

// 監聽步驟變化，觸發動畫
watch(currentStep, () => {
  isTransitioning.value = true
  animState.value = 0

  setTimeout(() => {
    isTransitioning.value = false
    triggerStepAnimation()
  }, 100)
})

function triggerStepAnimation() {
  const step = stepData.value.view

  if (step === 'intro') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
  }

  if (step === 'reservation') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
    setTimeout(() => { animState.value = 4 }, 1400)
  }

  if (step === 'ticket') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 800)
    setTimeout(() => { animState.value = 3 }, 1400)
  }

  if (step === 'verify') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
    setTimeout(() => { animState.value = 4 }, 1400)
  }

  if (step === 'structure') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
    setTimeout(() => { animState.value = 4 }, 1400)
  }

  if (step === 'security') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
    setTimeout(() => { animState.value = 4 }, 1400)
  }

  if (step === 'env-question') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
  }

  if (step === 'env-file') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
    setTimeout(() => { animState.value = 4 }, 1400)
  }

  if (step === 'env-signing') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 800)
    setTimeout(() => { animState.value = 3 }, 1400)
    setTimeout(() => { animState.value = 4 }, 2000)
    setTimeout(() => { animState.value = 5 }, 2600)
  }

  if (step === 'api-request') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 700)
    setTimeout(() => { animState.value = 3 }, 1300)
    setTimeout(() => { animState.value = 4 }, 1900)
    setTimeout(() => { animState.value = 5 }, 2500)
  }

  if (step === 'env-warning') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
  }

  if (step === 'summary') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
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
    title="JWT 通行證"
    subtitle="用餐廳號碼牌理解身份驗證"
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
      <div class="relative">
        <span class="text-2xl md:text-3xl">🎫</span>
        <div class="absolute -right-1 -top-1 h-2 w-2 animate-pulse-slow rounded-full bg-amber-400"></div>
      </div>
    </template>

    <!-- 主要內容區 -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- Animated background particles -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="animate-float-slow absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div class="animate-float-slower absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-orange-500/10 blur-3xl"></div>
      </div>

      <!-- ========== INTRO VIEW ========== -->
      <div v-if="stepData.view === 'intro'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- HTTP 無狀態示意 -->
          <div
            class="transition-all duration-700"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <div class="flex flex-col items-center gap-4 md:flex-row md:gap-8">
              <!-- 使用者 -->
              <div class="flex flex-col items-center">
                <div class="flex h-20 w-20 items-center justify-center rounded-full bg-sky-500/20 md:h-24 md:w-24">
                  <span class="text-4xl md:text-5xl">🙋</span>
                </div>
                <div class="mt-2 text-sm font-bold text-white">你</div>
              </div>

              <!-- 對話泡泡 -->
              <div
                class="rounded-2xl border border-slate-700 bg-slate-800 p-4 transition-all delay-200 duration-500"
                :class="animState >= 2 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'"
              >
                <div class="text-sm text-slate-300">「用我的會員點數折抵」</div>
              </div>

              <!-- 伺服器/店員 -->
              <div class="flex flex-col items-center">
                <div class="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20 md:h-24 md:w-24">
                  <span class="text-4xl md:text-5xl">🏪</span>
                </div>
                <div class="mt-2 text-sm font-bold text-white">伺服器</div>
              </div>
            </div>
          </div>

          <!-- 店員回應 -->
          <div
            class="transition-all delay-400 duration-700"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-2 rounded-2xl bg-red-500/20 blur-lg"></div>
              <div class="relative rounded-2xl border-2 border-red-500/50 bg-slate-900 px-6 py-4 text-center">
                <div class="text-lg font-bold text-red-400">「你是誰？」</div>
                <div class="mt-1 text-sm text-slate-400">每次請求，伺服器都不記得你</div>
              </div>
            </div>
          </div>

          <!-- 說明 -->
          <div
            class="mt-2 text-center transition-all delay-600 duration-500"
            :class="animState >= 3 ? 'opacity-100' : 'opacity-0'"
          >
            <div class="text-sm text-slate-400">這就是 HTTP <span class="font-bold text-amber-400">「無狀態」</span> 的特性</div>
          </div>
        </div>
      </div>

      <!-- ========== RESERVATION VIEW ========== -->
      <div v-if="stepData.view === 'reservation'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- 餐廳標題 -->
          <div
            class="text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <span class="text-4xl">🍽️</span>
            <div class="mt-2 text-xl font-bold text-white md:text-2xl">熱門餐廳線上預約</div>
          </div>

          <!-- 預約表單 -->
          <div
            class="transition-all delay-200 duration-700"
            :class="animState >= 2 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-amber-500/20 blur-xl"></div>
              <div class="relative w-72 overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-slate-900 md:w-80">
                <!-- Header -->
                <div class="border-b border-slate-700 bg-slate-800 px-4 py-3">
                  <div class="font-bold text-amber-400">預約資料</div>
                </div>
                <!-- Form -->
                <div class="space-y-3 p-4">
                  <div class="flex items-center gap-3">
                    <span class="w-16 text-sm text-slate-400">姓名</span>
                    <div class="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white">王小明</div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="w-16 text-sm text-slate-400">電話</span>
                    <div class="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white">0912-345-678</div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="w-16 text-sm text-slate-400">人數</span>
                    <div class="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white">4 人</div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="w-16 text-sm text-slate-400">時間</span>
                    <div class="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white">18:30</div>
                  </div>
                  <div
                    class="flex items-center gap-3 transition-all delay-400 duration-500"
                    :class="animState >= 3 ? 'opacity-100' : 'opacity-0'"
                  >
                    <span class="w-16 text-sm text-slate-400">備註</span>
                    <div class="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm text-amber-400">靠窗座位 🪟</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 送出按鈕 -->
          <div
            class="transition-all delay-600 duration-500"
            :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-center font-bold text-white shadow-lg shadow-amber-500/30">
              送出預約 ✓
            </div>
          </div>
        </div>
      </div>

      <!-- ========== TICKET VIEW ========== -->
      <div v-if="stepData.view === 'ticket'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- 餐廳回覆 -->
          <div
            class="text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="text-sm text-slate-400">餐廳說：</div>
            <div class="mt-1 text-lg font-bold text-white">「預約成功！這是你的號碼牌」</div>
          </div>

          <!-- 號碼牌 -->
          <div
            class="transition-all delay-300 duration-700"
            :class="animState >= 2 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-90 opacity-0'"
          >
            <div class="relative">
              <!-- 光暈效果 -->
              <div class="absolute -inset-8 animate-pulse rounded-full bg-amber-500/30 blur-2xl"></div>

              <!-- 號碼牌本體 -->
              <div class="relative">
                <div class="h-48 w-36 overflow-hidden rounded-2xl border-4 border-amber-400 bg-gradient-to-br from-amber-500 to-orange-600 p-4 shadow-2xl shadow-amber-500/50 md:h-56 md:w-44">
                  <!-- 頂部裝飾 -->
                  <div class="flex justify-center">
                    <div class="h-4 w-12 rounded-full bg-white/30"></div>
                  </div>

                  <!-- 號碼 -->
                  <div class="mt-4 text-center">
                    <div class="text-6xl font-black text-white drop-shadow-lg md:text-7xl">12</div>
                    <div class="mt-1 text-sm font-bold tracking-widest text-white/80">號</div>
                  </div>

                  <!-- 底部資訊 -->
                  <div class="mt-4 rounded-lg bg-white/20 p-2 text-center backdrop-blur">
                    <div class="text-xs text-white/90">王小明 · 4人</div>
                    <div class="text-xs text-white/70">18:30 靠窗</div>
                  </div>
                </div>

                <!-- 票根裝飾 -->
                <div class="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-slate-950"></div>
                <div class="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-slate-950"></div>
              </div>
            </div>
          </div>

          <!-- 說明 -->
          <div
            class="transition-all delay-600 duration-500"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-2xl border border-amber-500/30 bg-slate-900/90 px-6 py-4 text-center">
              <div class="text-sm text-slate-400">
                這張號碼牌就是你的 <span class="font-bold text-amber-400">JWT Token</span>！
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== VERIFY VIEW ========== -->
      <div v-if="stepData.view === 'verify'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- 場景：到餐廳 -->
          <div
            class="flex flex-col items-center gap-4 transition-all duration-500 md:flex-row md:gap-8"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <!-- 你 -->
            <div class="flex flex-col items-center">
              <div class="relative">
                <div class="flex h-20 w-20 items-center justify-center rounded-full bg-sky-500/20">
                  <span class="text-4xl">🙋</span>
                </div>
                <!-- 小號碼牌 -->
                <div class="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-white shadow-lg">
                  12
                </div>
              </div>
              <div class="mt-2 text-sm text-white">你</div>
            </div>

            <!-- 對話 -->
            <div
              class="rounded-2xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 transition-all delay-200 duration-500"
              :class="animState >= 2 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'"
            >
              <div class="font-bold text-sky-400">「我是 12 號」</div>
            </div>

            <!-- 服務生 -->
            <div class="flex flex-col items-center">
              <div class="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20">
                <span class="text-4xl">👨‍🍳</span>
              </div>
              <div class="mt-2 text-sm text-white">服務生</div>
            </div>
          </div>

          <!-- 服務生查詢 -->
          <div
            class="transition-all delay-400 duration-700"
            :class="animState >= 3 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-2 rounded-2xl bg-emerald-500/20 blur-lg"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-emerald-500/50 bg-slate-900">
                <!-- Header -->
                <div class="border-b border-slate-700 bg-slate-800 px-4 py-2">
                  <div class="flex items-center gap-2">
                    <span>📋</span>
                    <span class="text-sm font-bold text-emerald-400">查詢 12 號資料</span>
                  </div>
                </div>
                <!-- 查詢結果 -->
                <div class="p-4">
                  <div class="space-y-2 text-sm">
                    <div class="flex gap-2">
                      <span class="text-slate-400">姓名：</span>
                      <span class="text-white">王小明</span>
                    </div>
                    <div class="flex gap-2">
                      <span class="text-slate-400">人數：</span>
                      <span class="text-white">4 人</span>
                    </div>
                    <div class="flex gap-2">
                      <span class="text-slate-400">時間：</span>
                      <span class="text-white">18:30</span>
                    </div>
                    <div class="flex gap-2">
                      <span class="text-slate-400">備註：</span>
                      <span class="text-amber-400">靠窗座位 🪟</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 重點 -->
          <div
            class="transition-all delay-600 duration-500"
            :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 text-center">
              <div class="text-sm text-emerald-300">
                ✨ 不用重複問「你是誰？訂幾點？幾個人？」
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== STRUCTURE VIEW ========== -->
      <div v-if="stepData.view === 'structure'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- JWT 結構 -->
          <div
            class="transition-all duration-700"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <div class="text-center text-lg font-bold text-white md:text-xl">JWT 的三明治結構</div>
          </div>

          <!-- 三個部分 -->
          <div class="flex flex-col gap-3">
            <!-- Header -->
            <div
              class="transition-all delay-200 duration-500"
              :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="flex items-center gap-4">
                <div class="w-32 overflow-hidden rounded-xl border-2 border-purple-500/50 bg-purple-500/20 p-3 text-center md:w-40">
                  <div class="font-mono text-xs text-purple-300">eyJhbGci...</div>
                </div>
                <div class="flex-1">
                  <div class="font-bold text-purple-400">Header（標頭）</div>
                  <div class="text-xs text-slate-400">號碼牌的類型</div>
                </div>
              </div>
            </div>

            <!-- 點點 -->
            <div
              class="text-center text-2xl font-bold text-slate-500 transition-all delay-300 duration-300"
              :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"
            >.</div>

            <!-- Payload -->
            <div
              class="transition-all delay-400 duration-500"
              :class="animState >= 3 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="flex items-center gap-4">
                <div class="w-32 overflow-hidden rounded-xl border-2 border-amber-500/50 bg-amber-500/20 p-3 text-center md:w-40">
                  <div class="font-mono text-xs text-amber-300">eyJ1c2Vy...</div>
                </div>
                <div class="flex-1">
                  <div class="font-bold text-amber-400">Payload（內容）</div>
                  <div class="text-xs text-slate-400">你的預約資訊（姓名、人數...）</div>
                </div>
              </div>
            </div>

            <!-- 點點 -->
            <div
              class="text-center text-2xl font-bold text-slate-500 transition-all delay-500 duration-300"
              :class="animState >= 3 ? 'opacity-100' : 'opacity-0'"
            >.</div>

            <!-- Signature -->
            <div
              class="transition-all delay-600 duration-500"
              :class="animState >= 4 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'"
            >
              <div class="flex items-center gap-4">
                <div class="w-32 overflow-hidden rounded-xl border-2 border-emerald-500/50 bg-emerald-500/20 p-3 text-center md:w-40">
                  <div class="font-mono text-xs text-emerald-300">SflKxwRJ...</div>
                </div>
                <div class="flex-1">
                  <div class="font-bold text-emerald-400">Signature（簽名）</div>
                  <div class="text-xs text-slate-400">餐廳的防偽章 🔏</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 說明 -->
          <div
            class="transition-all delay-800 duration-500"
            :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-2xl border border-slate-700 bg-slate-900/90 px-6 py-4 text-center">
              <div class="font-mono text-xs text-slate-400">
                <span class="text-purple-400">xxxxx</span>.<span class="text-amber-400">yyyyy</span>.<span class="text-emerald-400">zzzzz</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== SECURITY VIEW ========== -->
      <div v-if="stepData.view === 'security'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- 壞人想偽造 -->
          <div
            class="transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="flex items-center gap-4">
              <div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <span class="text-3xl">😈</span>
              </div>
              <div>
                <div class="font-bold text-red-400">「我來偽造一張 12 號！」</div>
                <div class="text-sm text-slate-400">壞人想混進去吃飯</div>
              </div>
            </div>
          </div>

          <!-- 假號碼牌 vs 真號碼牌 -->
          <div class="flex flex-col gap-4 md:flex-row md:gap-6">
            <!-- 假號碼牌 -->
            <div
              class="transition-all delay-200 duration-500"
              :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="relative">
                <div class="h-36 w-28 rounded-xl border-2 border-dashed border-red-500/50 bg-slate-800 p-3">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-slate-400">12</div>
                    <div class="text-xs text-slate-500">偽造的</div>
                  </div>
                  <div class="mt-3 rounded bg-slate-700 p-2 text-center">
                    <div class="text-lg text-red-400">❌</div>
                    <div class="text-xs text-red-400">沒有防偽章</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- VS -->
            <div
              class="flex items-center justify-center transition-all delay-300 duration-500"
              :class="animState >= 3 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
            >
              <div class="rounded-full bg-slate-800 px-4 py-2 text-lg font-bold text-slate-400">
                VS
              </div>
            </div>

            <!-- 真號碼牌 -->
            <div
              class="transition-all delay-400 duration-500"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            >
              <div class="relative">
                <div class="absolute -inset-2 rounded-xl bg-emerald-500/20 blur-lg"></div>
                <div class="relative h-36 w-28 rounded-xl border-2 border-emerald-500 bg-gradient-to-br from-amber-500 to-orange-600 p-3">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-white">12</div>
                    <div class="text-xs text-white/70">正版的</div>
                  </div>
                  <div class="mt-3 rounded bg-white/20 p-2 text-center backdrop-blur">
                    <div class="text-lg">🔏</div>
                    <div class="text-xs text-white">有防偽章</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 驗證說明 -->
          <div
            class="transition-all delay-600 duration-700"
            :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-2 rounded-2xl bg-emerald-500/10 blur-lg"></div>
              <div class="relative rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-4">
                <div class="flex items-start gap-3">
                  <span class="text-2xl">🔐</span>
                  <div>
                    <div class="font-bold text-emerald-400">為什麼無法偽造？</div>
                    <div class="mt-1 text-sm text-slate-400">
                      簽名是用伺服器的<span class="text-amber-400">「秘密金鑰」</span>產生的<br>
                      只有伺服器知道這個金鑰，別人無法偽造！
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== ENV-QUESTION VIEW ========== -->
      <div v-if="stepData.view === 'env-question'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- 問題提出 -->
          <div
            class="text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <span class="text-6xl md:text-7xl">🤔</span>
            <div class="mt-4 text-2xl font-bold text-white md:text-3xl">餐廳的秘密印章...</div>
            <div class="mt-2 text-xl text-amber-400 md:text-2xl">要放在哪裡才安全？</div>
          </div>

          <!-- 錯誤示範：用生活化比喻 -->
          <div
            class="transition-all delay-300 duration-700"
            :class="animState >= 2 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-red-500/20 blur-xl"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-red-500/50 bg-slate-900 p-6">
                <div class="flex flex-col items-center gap-4">
                  <!-- 鑰匙貼門上的圖示 -->
                  <div class="flex items-center gap-6">
                    <div class="flex h-24 w-20 flex-col items-center justify-center rounded-lg border-4 border-amber-700 bg-amber-900">
                      <div class="text-4xl">🚪</div>
                      <div class="text-sm text-amber-300">大門</div>
                    </div>
                    <div class="text-4xl text-white">←</div>
                    <div class="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/30">
                      <span class="text-4xl">🔑</span>
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-xl font-bold text-red-400 md:text-2xl">這樣做超危險！</div>
                    <div class="mt-1 text-base text-slate-400 md:text-lg">就像把家裡鑰匙貼在大門上</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 原因說明 -->
          <div
            class="transition-all delay-600 duration-500"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
              <div class="text-base text-slate-300 md:text-lg">
                如果把秘密印章寫在程式碼裡<br>
                <span class="text-red-400">→ 上傳到網路後，全世界都看得到！</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== ENV-FILE VIEW ========== -->
      <div v-if="stepData.view === 'env-file'" class="relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-5">
          <!-- 答案揭曉：保險箱比喻 -->
          <div
            class="text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="flex items-center justify-center gap-4">
              <span class="text-5xl md:text-6xl">🔐</span>
              <span class="text-4xl">→</span>
              <span class="text-5xl md:text-6xl">📁</span>
            </div>
            <div class="mt-3 text-xl font-bold text-white md:text-2xl">放進「保險箱」檔案！</div>
            <div class="mt-2 text-base text-slate-400 md:text-lg">
              這個保險箱叫做 <span class="font-mono text-emerald-400">.env</span>（唸作 dot env）
            </div>
          </div>

          <!-- .env 檔案示意 -->
          <div
            class="w-full transition-all delay-200 duration-700"
            :class="animState >= 2 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative mx-auto max-w-md">
              <div class="absolute -inset-4 rounded-3xl bg-emerald-500/20 blur-xl"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-emerald-500/50 bg-slate-900">
                <!-- Header -->
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-4 py-3">
                  <div class="h-3 w-3 rounded-full bg-red-500"></div>
                  <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div class="h-3 w-3 rounded-full bg-green-500"></div>
                  <span class="ml-2 text-sm text-slate-400">.env</span>
                  <span class="ml-auto text-sm text-emerald-400">← 保險箱檔案</span>
                </div>
                <!-- 內容 -->
                <div class="p-5 font-mono text-sm md:text-base">
                  <div class="text-slate-500"># 秘密資料都放這裡</div>
                  <div
                    class="mt-3 rounded bg-amber-500/20 px-3 py-2 transition-all delay-400 duration-500"
                    :class="animState >= 3 ? 'opacity-100' : 'opacity-0'"
                  >
                    <span class="text-amber-400">JWT_SECRET</span>=<span class="text-emerald-400">hexschool666</span>
                  </div>
                  <div
                    class="mt-2 rounded bg-sky-500/20 px-3 py-2 transition-all delay-500 duration-500"
                    :class="animState >= 3 ? 'opacity-100' : 'opacity-0'"
                  >
                    <span class="text-amber-400">JWT_EXPIRES_DAY</span>=<span class="text-emerald-400">30d</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 說明卡片 -->
          <div
            class="grid w-full gap-4 transition-all delay-600 duration-500 md:grid-cols-2"
            :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-amber-500/30 bg-slate-900/80 p-5">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🔏</span>
                <span class="text-lg font-bold text-amber-400">JWT_SECRET</span>
              </div>
              <div class="mt-2 text-base text-slate-300">
                餐廳的「秘密印章」<br>
                <span class="text-slate-400">用來蓋在號碼牌上防偽造</span>
              </div>
            </div>
            <div class="rounded-xl border border-sky-500/30 bg-slate-900/80 p-5">
              <div class="flex items-center gap-2">
                <span class="text-2xl">⏰</span>
                <span class="text-lg font-bold text-sky-400">JWT_EXPIRES_DAY</span>
              </div>
              <div class="mt-2 text-base text-slate-300">
                號碼牌的「有效期限」<br>
                <span class="text-slate-400">30d = 30 天後就過期囉</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== ENV-SIGNING VIEW ========== -->
      <div v-if="stepData.view === 'env-signing'" class="relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-4">
          <!-- 標題 -->
          <div
            class="text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="text-xl font-bold text-white md:text-2xl">來看看蓋章的過程！</div>
          </div>

          <!-- 簽名流程圖 -->
          <div class="flex w-full flex-col items-center gap-3 md:flex-row md:justify-center md:gap-4">
            <!-- Step 1: 用戶登入 -->
            <div
              class="transition-all delay-100 duration-500"
              :class="animState >= 2 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
            >
              <div class="flex flex-col items-center rounded-2xl border-2 border-sky-500/50 bg-slate-900 p-4">
                <span class="text-4xl md:text-5xl">🙋</span>
                <div class="mt-2 text-base font-bold text-sky-400 md:text-lg">1. 你登入</div>
                <div class="mt-1 rounded-lg bg-slate-800 px-3 py-2 text-center">
                  <div class="text-xs text-slate-400 md:text-sm">帳號：<span class="text-white">wang@test.com</span></div>
                  <div class="text-xs text-slate-400 md:text-sm">密碼：<span class="text-white">••••••</span></div>
                </div>
              </div>
            </div>

            <!-- 箭頭 1 -->
            <div
              class="text-2xl text-amber-400 transition-all delay-200 duration-300 md:text-3xl"
              :class="animState >= 3 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
            >
              <span class="hidden md:inline">→</span>
              <span class="md:hidden">↓</span>
            </div>

            <!-- Step 2: Node.js 拿印章 -->
            <div
              class="transition-all delay-300 duration-500"
              :class="animState >= 3 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
            >
              <div class="relative flex flex-col items-center rounded-2xl border-2 border-emerald-500/50 bg-slate-900 p-4">
                <div class="absolute -right-2 -top-2 rounded-full bg-emerald-500 px-2 py-1 text-xs font-bold text-white">Node.js</div>
                <span class="text-4xl md:text-5xl">🖥️</span>
                <div class="mt-2 text-base font-bold text-emerald-400 md:text-lg">2. 後端準備</div>
                <div class="mt-1 flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2">
                  <span class="text-xl">📁</span>
                  <span class="text-xs text-slate-400 md:text-sm">從 .env 拿</span>
                  <span class="text-xl">🔏</span>
                </div>
              </div>
            </div>

            <!-- 箭頭 2 -->
            <div
              class="text-2xl text-amber-400 transition-all delay-400 duration-300 md:text-3xl"
              :class="animState >= 4 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
            >
              <span class="hidden md:inline">→</span>
              <span class="md:hidden">↓</span>
            </div>

            <!-- Step 3: 蓋章產生 JWT -->
            <div
              class="transition-all delay-500 duration-500"
              :class="animState >= 4 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
            >
              <div class="flex flex-col items-center rounded-2xl border-2 border-amber-500/50 bg-slate-900 p-4">
                <div class="flex items-center gap-2">
                  <span class="text-3xl md:text-4xl">👤</span>
                  <span class="text-xl text-amber-400">+</span>
                  <span class="text-3xl md:text-4xl">🔏</span>
                </div>
                <div class="mt-2 text-base font-bold text-amber-400 md:text-lg">3. 蓋章！</div>
                <div class="mt-1 text-xs text-slate-400 md:text-sm">你的資料 + 秘密印章</div>
              </div>
            </div>

            <!-- 箭頭 3 -->
            <div
              class="text-2xl text-amber-400 transition-all delay-600 duration-300 md:text-3xl"
              :class="animState >= 5 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
            >
              <span class="hidden md:inline">→</span>
              <span class="md:hidden">↓</span>
            </div>

            <!-- Step 4: 產生 JWT -->
            <div
              class="transition-all delay-700 duration-500"
              :class="animState >= 5 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
            >
              <div class="relative flex flex-col items-center">
                <div class="absolute -inset-3 animate-pulse rounded-2xl bg-amber-500/20 blur-lg"></div>
                <div class="relative flex flex-col items-center rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-500 to-orange-600 p-4">
                  <span class="text-4xl md:text-5xl">🎫</span>
                  <div class="mt-2 text-base font-bold text-white md:text-lg">4. JWT 產生！</div>
                  <div class="mt-1 rounded bg-white/20 px-2 py-1 text-xs text-white/90 md:text-sm">你的專屬號碼牌</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 說明 -->
          <div
            class="mt-2 w-full max-w-lg transition-all delay-800 duration-500"
            :class="animState >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
              <div class="text-base text-slate-300 md:text-lg">
                這張號碼牌會回傳給你<br>
                <span class="text-amber-400">之後每次請求都帶著它，後端就知道你是誰！</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== API-REQUEST VIEW ========== -->
      <div v-if="stepData.view === 'api-request'" class="relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-4xl flex-col items-center gap-4">
          <!-- 標題 -->
          <div
            class="text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="text-xl font-bold text-white md:text-2xl">拿到號碼牌後，要怎麼用？</div>
            <div class="mt-1 text-base text-slate-400 md:text-lg">以「購買課程堂數」為例</div>
          </div>

          <!-- API 請求流程 -->
          <div class="flex w-full flex-col items-center gap-3 md:flex-row md:justify-center md:gap-6">
            <!-- Step 1: 前端發送請求 -->
            <div
              class="w-full max-w-xs transition-all delay-100 duration-500 md:w-auto"
              :class="animState >= 2 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
            >
              <div class="flex flex-col items-center rounded-2xl border-2 border-sky-500/50 bg-slate-900 p-4">
                <span class="text-4xl md:text-5xl">📱</span>
                <div class="mt-2 text-lg font-bold text-sky-400">前端</div>
                <div class="mt-2 w-full rounded-lg bg-slate-800 p-3 text-left">
                  <div class="text-xs text-slate-500">我要買課程！</div>
                  <div class="mt-2 space-y-1 text-sm">
                    <div class="text-slate-400">方案：<span class="text-white">10 堂課</span></div>
                    <div class="text-slate-400">價格：<span class="text-emerald-400">$2,000</span></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 請求內容 -->
            <div
              class="transition-all delay-300 duration-700"
              :class="animState >= 3 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
            >
              <div class="relative">
                <div class="absolute -inset-2 rounded-2xl bg-amber-500/20 blur-lg"></div>
                <div class="relative overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-slate-900">
                  <div class="border-b border-slate-700 bg-slate-800 px-4 py-2">
                    <div class="text-sm font-bold text-amber-400">API 請求</div>
                  </div>
                  <div class="p-4 font-mono text-xs md:text-sm">
                    <div class="text-purple-400">POST /api/purchase</div>
                    <div class="mt-3 text-slate-500">Headers:</div>
                    <div
                      class="mt-1 rounded bg-amber-500/20 px-2 py-1 transition-all duration-500"
                      :class="animState >= 3 ? 'opacity-100' : 'opacity-0'"
                    >
                      <span class="text-amber-400">Authorization:</span>
                      <span class="text-emerald-400"> Bearer </span>
                      <span class="text-sky-400">eyJhbG...</span>
                      <span class="ml-1 text-3xl">🎫</span>
                    </div>
                    <div class="mt-3 text-slate-500">Body:</div>
                    <div class="mt-1 text-slate-300">{ packageId: 2 }</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 箭頭 -->
            <div
              class="text-3xl text-amber-400 transition-all delay-400 duration-300"
              :class="animState >= 4 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
            >
              <span class="hidden md:inline">→</span>
              <span class="md:hidden">↓</span>
            </div>

            <!-- Step 2: 後端驗證 -->
            <div
              class="w-full max-w-xs transition-all delay-500 duration-500 md:w-auto"
              :class="animState >= 4 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
            >
              <div class="relative flex flex-col items-center rounded-2xl border-2 border-emerald-500/50 bg-slate-900 p-4">
                <div class="absolute -right-2 -top-2 rounded-full bg-emerald-500 px-2 py-1 text-xs font-bold text-white">Node.js</div>
                <span class="text-4xl md:text-5xl">🖥️</span>
                <div class="mt-2 text-lg font-bold text-emerald-400">後端驗證</div>
                <div class="mt-2 w-full space-y-2 rounded-lg bg-slate-800 p-3 text-sm">
                  <div class="flex items-center gap-2">
                    <span class="text-emerald-400">✓</span>
                    <span class="text-slate-300">驗證號碼牌</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-emerald-400">✓</span>
                    <span class="text-slate-300">確認是「王小明」</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-emerald-400">✓</span>
                    <span class="text-slate-300">完成購買！</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 重點說明 -->
          <div
            class="mt-2 w-full max-w-2xl transition-all delay-700 duration-500"
            :class="animState >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
              <div class="flex items-start gap-4">
                <span class="text-3xl">💡</span>
                <div>
                  <div class="text-lg font-bold text-amber-400">重點！</div>
                  <div class="mt-2 text-base text-slate-300">
                    每次 API 請求都要在 <span class="font-mono text-amber-400">HTTP Request Header</span> 帶上 JWT<br>
                    後端才知道「是誰在操作」，不然後端會說：<span class="text-red-400">「你是誰？請先登入！」</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== ENV-WARNING VIEW ========== -->
      <div v-if="stepData.view === 'env-warning'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- 警告標題 -->
          <div
            class="text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <span class="text-6xl md:text-7xl">🔒</span>
            <div class="mt-4 text-2xl font-bold text-white md:text-3xl">記得鎖好保險箱！</div>
            <div class="mt-2 text-lg text-slate-400 md:text-xl">不然上傳到網路就糟了</div>
          </div>

          <!-- 圖解：.gitignore 是什麼 -->
          <div
            class="transition-all delay-300 duration-700"
            :class="animState >= 2 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-emerald-500/20 blur-xl"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-emerald-500/50 bg-slate-900 p-6">
                <div class="flex flex-col items-center gap-5">
                  <!-- 圖解 -->
                  <div class="flex items-center gap-6">
                    <div class="flex flex-col items-center">
                      <span class="text-5xl">📁</span>
                      <div class="mt-2 text-base text-emerald-400">.env</div>
                      <div class="text-sm text-slate-500">保險箱</div>
                    </div>
                    <div class="text-4xl text-red-400">🚫</div>
                    <div class="flex flex-col items-center">
                      <span class="text-5xl">☁️</span>
                      <div class="mt-2 text-base text-slate-400">GitHub</div>
                      <div class="text-sm text-slate-500">網路</div>
                    </div>
                  </div>
                  <!-- 說明 -->
                  <div class="text-center">
                    <div class="text-lg text-white md:text-xl">
                      用 <span class="font-mono text-emerald-400">.gitignore</span> 檔案
                    </div>
                    <div class="mt-1 text-base text-slate-400">
                      告訴電腦：「這個檔案不要上傳！」
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 重點提示 -->
          <div
            class="max-w-lg space-y-4 transition-all delay-600 duration-500"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <div class="flex items-start gap-3">
                <span class="text-2xl">✅</span>
                <div>
                  <div class="text-lg font-bold text-emerald-400">這樣做就安全了</div>
                  <div class="mt-2 text-base text-slate-300">
                    在 <span class="font-mono text-emerald-400">.gitignore</span> 裡面寫上 <span class="font-mono text-emerald-400">.env</span><br>
                    保險箱就只會留在你的電腦裡
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
              <div class="flex items-start gap-3">
                <span class="text-2xl">💡</span>
                <div>
                  <div class="text-lg font-bold text-amber-400">小提醒</div>
                  <div class="mt-2 text-base text-slate-300">
                    <span class="font-mono text-amber-400">.gitignore</span> 唸作「git ignore」<br>
                    意思是「Git 請忽略這些檔案」
                  </div>
                </div>
              </div>
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
              <div class="absolute -inset-6 rounded-3xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-2xl"></div>
              <div class="relative overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-slate-900 p-6 md:p-8">
                <div class="text-center">
                  <div class="text-5xl md:text-6xl">🎫</div>
                  <div class="mt-4 text-xl font-bold text-white md:text-2xl">JWT = 號碼牌</div>
                  <div class="mt-1 text-sm text-slate-400 md:text-base">帶著它，後端就知道你是誰</div>
                </div>

                <!-- 流程 -->
                <div
                  class="mt-6 space-y-3 transition-all delay-300 duration-500"
                  :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
                >
                  <div class="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                    <span class="text-lg">1️⃣</span>
                    <div class="text-sm text-slate-300">登入時，後端給你 JWT</div>
                  </div>
                  <div class="flex items-center gap-3 rounded-lg bg-sky-500/20 p-3">
                    <span class="text-lg">2️⃣</span>
                    <div class="text-sm text-slate-300">前端存到 <span class="font-mono text-sky-400">LocalStorage</span> 或 <span class="font-mono text-sky-400">Cookie</span></div>
                  </div>
                  <div class="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                    <span class="text-lg">3️⃣</span>
                    <div class="text-sm text-slate-300">之後每次請求都帶著它</div>
                  </div>
                  <div class="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                    <span class="text-lg">4️⃣</span>
                    <div class="text-sm text-slate-300">後端驗證簽名，確認身份</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 重點提示 -->
          <div
            class="transition-all delay-500 duration-500"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-center">
              <div class="text-sm text-amber-300 md:text-base">
                🎉 恭喜！你已經理解 JWT 身份驗證的原理了！
              </div>
            </div>
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
