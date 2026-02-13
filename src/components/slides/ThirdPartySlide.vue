<script setup lang="ts">
/**
 * 第三方服務整合架構簡報
 * 展示後端工程師如何整合金流、第三方登入等服務
 */
import { ref, computed } from 'vue'

defineProps<{
  isMobile?: boolean
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

// 簡報頁面
const currentPage = ref(0)

interface ServiceExample {
  id: string
  name: string
  emoji: string
  description: string
  examples: string[]
}

const services: ServiceExample[] = [
  {
    id: 'payment',
    name: '金流服務',
    emoji: '💳',
    description: '讓使用者可以線上付款',
    examples: ['綠界 ECPay', '藍新金流', 'LINE Pay', 'Apple Pay'],
  },
  {
    id: 'login',
    name: '第三方登入',
    emoji: '🔐',
    description: '用其他帳號快速登入',
    examples: ['Google 登入', 'Facebook 登入', 'LINE 登入', 'Apple 登入'],
  },
  {
    id: 'notification',
    name: '通知服務',
    emoji: '📲',
    description: '發送通知給使用者',
    examples: ['Twilio 簡訊', 'SendGrid 郵件', 'Firebase 推播', 'LINE Notify'],
  },
  {
    id: 'storage',
    name: '雲端儲存',
    emoji: '☁️',
    description: '儲存檔案、圖片',
    examples: ['AWS S3', 'Google Cloud Storage', 'Cloudinary', 'Firebase Storage'],
  },
]

const pages = [
  { id: 'intro', title: '不只是自己的資料庫' },
  { id: 'services', title: '常見的第三方服務' },
  { id: 'flow', title: '整合流程' },
  { id: 'example', title: '實際案例：金流' },
  { id: 'summary', title: '後端工程師的日常' },
]

const isLastPage = computed(() => currentPage.value === pages.length - 1)

function nextPage() {
  if (currentPage.value < pages.length - 1) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

function handleComplete() {
  emit('complete')
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
    <!-- Header -->
    <div class="relative z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur-xl md:px-6 md:py-4">
      <div class="min-w-0 flex-1">
        <h1 class="flex items-center gap-2 text-lg font-bold text-white md:gap-3 md:text-2xl">
          <span class="text-2xl md:text-3xl">🔗</span>
          <span class="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">整合第三方服務</span>
        </h1>
      </div>
      <!-- 頁面指示器 -->
      <div class="flex items-center gap-2">
        <div class="hidden gap-1.5 md:flex">
          <div
            v-for="(page, index) in pages"
            :key="page.id"
            class="h-2 rounded-full transition-all duration-300"
            :class="index === currentPage ? 'w-8 bg-cyan-400' : index < currentPage ? 'w-2 bg-cyan-400/50' : 'w-2 bg-slate-600'"
          />
        </div>
        <div class="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-400 md:text-sm">
          {{ currentPage + 1 }} / {{ pages.length }}
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="relative flex flex-1 flex-col overflow-hidden">
      <!-- 背景裝飾 -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="animate-float-slow absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"></div>
        <div class="animate-float-slower absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"></div>
      </div>

      <!-- ===== Page 1: Intro ===== -->
      <div v-if="currentPage === 0" class="relative flex flex-1 flex-col items-center justify-center overflow-y-auto p-4 md:p-6">
        <div class="relative z-10 max-w-2xl text-center">
          <div class="mb-6 text-6xl md:text-8xl">🤔</div>
          <h2 class="mb-4 text-2xl font-bold text-white md:text-3xl">
            後端工程師只是連接自己的資料庫嗎？
          </h2>
          <div class="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-6">
            <p class="text-lg text-slate-300">
              除了開發自己的 API 連接資料庫，<br>
              更多時候是要<span class="font-bold text-cyan-400">整合各種第三方服務</span>！
            </p>
          </div>
        </div>
      </div>

      <!-- ===== Page 2: Services ===== -->
      <div v-if="currentPage === 1" class="relative flex flex-1 flex-col overflow-y-auto p-4 md:p-6">
        <div class="relative z-10 mx-auto w-full max-w-4xl">
          <h2 class="mb-6 text-center text-xl font-bold text-white md:text-2xl">
            常見的第三方服務
          </h2>
          <div class="grid gap-4 md:grid-cols-2">
            <div
              v-for="service in services"
              :key="service.id"
              class="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 transition-all hover:border-cyan-500/50"
            >
              <div class="mb-3 flex items-center gap-3">
                <span class="text-4xl">{{ service.emoji }}</span>
                <div>
                  <h3 class="font-bold text-white">{{ service.name }}</h3>
                  <p class="text-sm text-slate-400">{{ service.description }}</p>
                </div>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="example in service.examples"
                  :key="example"
                  class="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                >
                  {{ example }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Page 3: Flow ===== -->
      <div v-if="currentPage === 2" class="relative flex flex-1 flex-col items-center justify-center overflow-y-auto p-4 md:p-6">
        <div class="relative z-10 w-full max-w-3xl">
          <h2 class="mb-6 text-center text-xl font-bold text-white md:text-2xl">
            整合第三方服務的流程
          </h2>

          <!-- 流程圖 -->
          <div class="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
            <div class="flex flex-col items-center gap-4">
              <!-- 使用者 -->
              <div class="flex items-center gap-3 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3">
                <span class="text-3xl">👤</span>
                <span class="font-bold text-white">使用者</span>
              </div>

              <div class="text-2xl text-cyan-400">↓</div>

              <!-- 前端 -->
              <div class="flex items-center gap-3 rounded-xl border border-sky-500/50 bg-sky-500/20 px-4 py-3">
                <span class="text-3xl">🖥️</span>
                <span class="font-bold text-sky-300">前端</span>
              </div>

              <div class="text-2xl text-cyan-400">↓</div>

              <!-- 後端（中心） -->
              <div class="relative w-full">
                <div class="mx-auto flex w-fit items-center gap-3 rounded-xl border-2 border-emerald-500 bg-emerald-500/20 px-6 py-4">
                  <span class="text-3xl">⚙️</span>
                  <div>
                    <span class="font-bold text-emerald-300">後端 API</span>
                    <div class="text-xs text-emerald-400">（整合中心）</div>
                  </div>
                </div>
              </div>

              <div class="text-2xl text-cyan-400">↓</div>

              <!-- 多個服務 -->
              <div class="flex flex-wrap justify-center gap-3">
                <div class="flex items-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/20 px-3 py-2">
                  <span class="text-2xl">🗄️</span>
                  <span class="text-sm font-bold text-amber-300">自己的資料庫</span>
                </div>
                <div class="flex items-center gap-2 rounded-xl border border-pink-500/50 bg-pink-500/20 px-3 py-2">
                  <span class="text-2xl">💳</span>
                  <span class="text-sm font-bold text-pink-300">金流 API</span>
                </div>
                <div class="flex items-center gap-2 rounded-xl border border-purple-500/50 bg-purple-500/20 px-3 py-2">
                  <span class="text-2xl">🔐</span>
                  <span class="text-sm font-bold text-purple-300">登入 API</span>
                </div>
              </div>
            </div>
          </div>

          <p class="mt-4 text-center text-sm text-slate-400">
            後端就像「中央調度站」，負責整合各種服務
          </p>
        </div>
      </div>

      <!-- ===== Page 4: Example ===== -->
      <div v-if="currentPage === 3" class="relative flex flex-1 flex-col overflow-y-auto p-4 md:p-6">
        <div class="relative z-10 mx-auto w-full max-w-4xl">
          <h2 class="mb-2 text-center text-xl font-bold text-white md:text-2xl">
            實際案例：購買課程
          </h2>
          <p class="mb-4 text-center text-slate-400">
            當使用者在 LiveFit 點擊「購買」，背後發生了什麼事？
          </p>

          <div class="grid gap-4 md:grid-cols-2">
            <!-- 左側：簡化的架構圖 -->
            <div class="rounded-2xl border border-slate-700 bg-slate-800/50 p-4">
              <h3 class="mb-3 text-center text-sm font-bold text-slate-400">角色關係</h3>
              <div class="flex flex-col items-center gap-2">
                <!-- 使用者 & 前端 -->
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-600 bg-slate-700 text-xl">👤</div>
                  <span class="text-cyan-400">→</span>
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-500/50 bg-sky-500/20 text-xl">🖥️</div>
                  <span class="text-xs text-slate-500">前端</span>
                </div>
                <span class="text-cyan-400">↓</span>
                <!-- 後端（中心） -->
                <div class="flex items-center gap-2 rounded-xl border-2 border-emerald-500 bg-emerald-500/20 px-4 py-2">
                  <span class="text-2xl">⚙️</span>
                  <span class="font-bold text-emerald-300">後端</span>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-cyan-400">↙</span>
                  <span class="text-cyan-400">↘</span>
                </div>
                <!-- 資料庫 & 金流 -->
                <div class="flex items-center gap-6">
                  <div class="flex flex-col items-center">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/50 bg-amber-500/20 text-xl">🗄️</div>
                    <span class="mt-1 text-xs text-amber-300">資料庫</span>
                  </div>
                  <div class="flex flex-col items-center">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-pink-500/50 bg-pink-500/20 text-xl">💳</div>
                    <span class="mt-1 text-xs text-pink-300">金流 API</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右側：流程步驟 -->
            <div class="space-y-2">
              <div class="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-sm font-bold text-white">1</div>
                <div>
                  <span class="font-bold text-white">點擊購買</span>
                  <span class="text-sm text-slate-400"> → 前端送請求給後端</span>
                </div>
              </div>
              <div class="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">2</div>
                <div>
                  <span class="font-bold text-emerald-300">後端呼叫金流</span>
                  <span class="text-sm text-slate-400"> → 建立訂單</span>
                </div>
              </div>
              <div class="flex items-center gap-3 rounded-xl border border-pink-500/30 bg-pink-500/10 p-3">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-500 text-sm font-bold text-white">3</div>
                <div>
                  <span class="font-bold text-pink-300">金流處理付款</span>
                  <span class="text-sm text-slate-400"> → 通知後端成功</span>
                </div>
              </div>
              <div class="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">4</div>
                <div>
                  <span class="font-bold text-amber-300">更新資料庫</span>
                  <span class="text-sm text-slate-400"> → 訂單狀態「已付款」</span>
                </div>
              </div>
              <div class="flex items-center gap-3 rounded-xl border border-emerald-400 bg-emerald-500/20 p-3">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-lg">✅</div>
                <div>
                  <span class="font-bold text-emerald-300">購買成功！</span>
                  <span class="text-sm text-slate-400"> → 前端顯示結果</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 重點提示 -->
          <div class="mt-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-center">
            <p class="text-cyan-300">
              <span class="font-bold">重點：</span>後端負責「串接」金流 API，不需要自己處理信用卡！
            </p>
          </div>
        </div>
      </div>

      <!-- ===== Page 5: Summary ===== -->
      <div v-if="currentPage === 4" class="relative flex flex-1 flex-col items-center justify-center overflow-y-auto p-4 md:p-6">
        <div class="relative z-10 max-w-2xl text-center">
          <div class="mb-6 text-6xl md:text-8xl">🎯</div>
          <h2 class="mb-4 text-2xl font-bold text-white md:text-3xl">
            後端工程師的真實工作
          </h2>
          <div class="space-y-4">
            <div class="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
              <div class="mb-2 text-2xl">🗄️</div>
              <p class="text-slate-300">開發自己的 API，連接資料庫</p>
            </div>
            <div class="text-2xl text-cyan-400">+</div>
            <div class="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
              <div class="mb-2 text-2xl">🔗</div>
              <p class="font-bold text-cyan-300">整合各種第三方服務的 API</p>
              <p class="mt-1 text-sm text-slate-400">金流、登入、通知、儲存、地圖...</p>
            </div>
          </div>
          <div class="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p class="text-lg text-emerald-300">
              <span class="font-bold">學會 API，你就能串接無限可能！</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Controls -->
    <div class="relative z-20 flex items-center justify-between gap-3 border-t border-white/10 bg-slate-900/80 px-4 pb-6 pt-4 backdrop-blur-xl md:px-6 md:py-4">
      <button
        :disabled="currentPage === 0"
        class="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-3"
        @click="prevPage"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="hidden md:inline">上一頁</span>
      </button>

      <!-- Mobile page indicator -->
      <div class="flex gap-1 md:hidden">
        <div
          v-for="(page, index) in pages"
          :key="page.id"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="index === currentPage ? 'w-4 bg-cyan-400' : index < currentPage ? 'w-1.5 bg-cyan-400/50' : 'w-1.5 bg-slate-600'"
        />
      </div>

      <button
        v-if="!isLastPage"
        class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl md:px-6 md:py-3"
        @click="nextPage"
      >
        <span>下一頁</span>
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <button
        v-else
        class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl md:px-6 md:py-3"
        @click="handleComplete"
      >
        <span>我懂了！</span>
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  </div>
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

.animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
.animate-float-slower { animation: float-slower 15s ease-in-out infinite; }
</style>
