<script setup lang="ts">
/**
 * JWT 存放位置互動簡報：用 Chrome 瀏覽器展示 LocalStorage/Cookie
 * Day 8 - 身份驗證概念（進階）
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
type StepView = 'intro' | 'meta-example' | 'where-stored' | 'lets-find-out' | 'devtools-step1' | 'devtools-step2' | 'devtools-step3' | 'devtools-step4' | 'devtools-step5' | 'devtools-localstorage' | 'devtools-cookie' | 'clear-data' | 'security-warning' | 'summary'

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
    title: '為什麼重新整理不用再登入？',
    desc: '你有沒有發現，登入 Facebook 後，就算關掉瀏覽器再打開，還是維持登入狀態？',
  },
  {
    id: 1,
    view: 'meta-example',
    title: '以 Facebook 為例',
    desc: '當你登入 Facebook，伺服器會給你一把「鑰匙」，瀏覽器會把這把鑰匙存起來。',
  },
  {
    id: 2,
    view: 'where-stored',
    title: '鑰匙存在哪裡？',
    desc: '瀏覽器有兩個常用的「儲物櫃」可以存放這把鑰匙：LocalStorage 和 Cookie。',
  },
  {
    id: 3,
    view: 'lets-find-out',
    title: '來親眼看看吧！',
    desc: '那麼究竟，登入後後端回傳的鑰匙，前端工程師會將它存到哪裡呢？讓我們用 Chrome 開發者工具來找找看！',
  },
  // === DevTools 操作步驟（拆分成 5 步） ===
  {
    id: 4,
    view: 'devtools-step1',
    title: '步驟 1：打開開發者工具',
    desc: '首先，我們要打開 Chrome 的開發者工具。這是工程師的秘密武器！',
  },
  {
    id: 5,
    view: 'devtools-step2',
    title: '步驟 2：找到 Application 頁籤',
    desc: '在開發者工具上方有很多頁籤，我們要點擊「Application」。',
  },
  {
    id: 6,
    view: 'devtools-step3',
    title: '步驟 3：找到 Storage 區塊',
    desc: '在 Application 頁面的左側，找到「Storage」區塊。',
  },
  {
    id: 7,
    view: 'devtools-step4',
    title: '步驟 4：展開 Local Storage',
    desc: '點擊 Local Storage 左邊的小箭頭，展開它。',
  },
  {
    id: 8,
    view: 'devtools-step5',
    title: '步驟 5：點擊網域名稱',
    desc: '點擊你要查看的網站網域，右邊就會顯示儲存的資料！',
  },
  // === 實際資料展示 ===
  {
    id: 9,
    view: 'devtools-localstorage',
    title: 'LocalStorage 裡面有什麼？',
    desc: '來看看 LocalStorage 實際存了哪些資料，找找看有沒有 Token！',
  },
  {
    id: 10,
    view: 'devtools-cookie',
    title: 'Cookie 裡面有什麼？',
    desc: '同樣的方式，展開 Cookies 也能看到網站的 Cookie 資料。',
  },
  {
    id: 11,
    view: 'clear-data',
    title: '清除鑰匙會怎樣？',
    desc: '如果手動刪除這些資料，瀏覽器就沒有鑰匙了，伺服器會說：「你是誰？請重新登入！」',
  },
  {
    id: 12,
    view: 'security-warning',
    title: '安全小提醒',
    desc: '離開電腦前，記得鎖定螢幕！不然別人可以偷走你的鑰匙，用你的身份登入。',
  },
  {
    id: 13,
    view: 'summary',
    title: '原來是這樣！',
    desc: '現在你知道了：登入後瀏覽器會把「鑰匙」存起來，下次自動帶著它，伺服器就認得你。',
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

  if (step === 'meta-example') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 700)
    setTimeout(() => { animState.value = 3 }, 1200)
    setTimeout(() => { animState.value = 4 }, 1700)
  }

  if (step === 'where-stored') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
  }

  // 過渡頁：來親眼看看吧
  if (step === 'lets-find-out') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
  }

  // DevTools 步驟 1：打開開發者工具
  if (step === 'devtools-step1') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
  }

  // DevTools 步驟 2：找到 Application 頁籤
  if (step === 'devtools-step2') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 800)   // 手指指向 Application
    setTimeout(() => { animState.value = 3 }, 2500)  // 點擊完成（停留 1.7 秒讓使用者看清手指）
    setTimeout(() => { animState.value = 4 }, 3200)  // 提示訊息出現
  }

  // DevTools 步驟 3：找到 Storage 區塊
  if (step === 'devtools-step3') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 700)   // 高亮 Storage
    setTimeout(() => { animState.value = 3 }, 1800)  // 完成
  }

  // DevTools 步驟 4：展開 Local Storage
  if (step === 'devtools-step4') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 800)   // 手指指向箭頭
    setTimeout(() => { animState.value = 3 }, 2500)  // 點擊展開（停留 1.7 秒）
    setTimeout(() => { animState.value = 4 }, 3200)  // 提示出現
  }

  // DevTools 步驟 5：點擊網域名稱
  if (step === 'devtools-step5') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 800)   // 手指指向網域
    setTimeout(() => { animState.value = 3 }, 2500)  // 點擊選中（停留 1.7 秒）
    setTimeout(() => { animState.value = 4 }, 3200)  // 成功訊息出現
  }

  if (step === 'devtools-localstorage') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
    setTimeout(() => { animState.value = 4 }, 1400)
    setTimeout(() => { animState.value = 5 }, 1800)
  }

  if (step === 'devtools-cookie') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 600)
    setTimeout(() => { animState.value = 3 }, 1000)
    setTimeout(() => { animState.value = 4 }, 1400)
    setTimeout(() => { animState.value = 5 }, 1800)
  }

  if (step === 'clear-data') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 700)
    setTimeout(() => { animState.value = 3 }, 1400)
    setTimeout(() => { animState.value = 4 }, 2100)
    setTimeout(() => { animState.value = 5 }, 2800)
  }

  if (step === 'security-warning') {
    setTimeout(() => { animState.value = 1 }, 200)
    setTimeout(() => { animState.value = 2 }, 700)
    setTimeout(() => { animState.value = 3 }, 1300)
    setTimeout(() => { animState.value = 4 }, 1900)
    setTimeout(() => { animState.value = 5 }, 2500)
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
    title="JWT 存放位置"
    subtitle="瀏覽器的儲物櫃"
    :current-step="currentStep"
    :total-steps="STEPS.length"
    :step-title="stepData.title"
    :step-desc="stepData.desc"
    theme-color="sky"
    @prev="prevStep"
    @next="nextStep"
    @complete="handleComplete"
  >
    <div class="relative flex min-h-full flex-col">
      <!-- ========== INTRO VIEW ========== -->
      <div v-if="stepData.view === 'intro'" class="relative flex min-h-0 flex-1 flex-col items-center p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- 問題 -->
          <div
            class="text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <span class="text-6xl md:text-7xl">🤔</span>
            <div class="mt-4 text-2xl font-bold text-white md:text-3xl">你有沒有想過...</div>
          </div>

          <!-- 情境說明 -->
          <div
            class="max-w-lg transition-all delay-300 duration-700"
            :class="animState >= 2 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-sky-500/20 blur-xl"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-sky-500/50 bg-slate-900 p-6">
                <div class="flex flex-col items-center gap-4">
                  <!-- 瀏覽器圖示 -->
                  <div class="flex items-center gap-4">
                    <div class="flex flex-col items-center">
                      <span class="text-5xl">🌐</span>
                      <div class="mt-1 text-sm text-slate-400">登入</div>
                    </div>
                    <div class="text-3xl text-slate-500">→</div>
                    <div class="flex flex-col items-center">
                      <span class="text-5xl">❌</span>
                      <div class="mt-1 text-sm text-slate-400">關掉</div>
                    </div>
                    <div class="text-3xl text-slate-500">→</div>
                    <div class="flex flex-col items-center">
                      <span class="text-5xl">🌐</span>
                      <div class="mt-1 text-sm text-slate-400">再開</div>
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-xl font-bold text-sky-400 md:text-2xl">還是登入狀態！</div>
                    <div class="mt-1 text-base text-slate-400">不用重新輸入帳號密碼</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 疑問 -->
          <div
            class="transition-all delay-600 duration-500"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-center">
              <div class="text-lg text-amber-400 md:text-xl">
                瀏覽器怎麼記住你的登入狀態？<br>
                <span class="text-slate-300">鑰匙到底存在哪裡？</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== META-EXAMPLE VIEW ========== -->
      <div v-if="stepData.view === 'meta-example'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6 md:p-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-5">
          <!-- Facebook 登入流程 -->
          <div
            class="text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="flex items-center justify-center gap-3">
              <span class="text-5xl">📘</span>
              <div class="text-2xl font-bold text-white md:text-3xl">Facebook 登入流程</div>
            </div>
          </div>

          <!-- 流程圖 -->
          <div class="flex w-full flex-col items-center gap-4 md:flex-row md:justify-center md:gap-6">
            <!-- Step 1: 登入 -->
            <div
              class="transition-all delay-100 duration-500"
              :class="animState >= 2 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
            >
              <div class="flex flex-col items-center rounded-2xl border-2 border-sky-500/50 bg-slate-900 p-4">
                <span class="text-4xl md:text-5xl">🙋</span>
                <div class="mt-2 text-lg font-bold text-sky-400">1. 你登入</div>
                <div class="mt-2 rounded-lg bg-slate-800 px-4 py-2 text-center">
                  <div class="text-sm text-slate-300">帳號密碼</div>
                </div>
              </div>
            </div>

            <!-- 箭頭 -->
            <div
              class="text-2xl text-amber-400 transition-all delay-200 duration-300 md:text-3xl"
              :class="animState >= 3 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
            >
              <span class="hidden md:inline">→</span>
              <span class="md:hidden">↓</span>
            </div>

            <!-- Step 2: 伺服器給鑰匙 -->
            <div
              class="transition-all delay-300 duration-500"
              :class="animState >= 3 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
            >
              <div class="flex flex-col items-center rounded-2xl border-2 border-emerald-500/50 bg-slate-900 p-4">
                <span class="text-4xl md:text-5xl">🖥️</span>
                <div class="mt-2 text-lg font-bold text-emerald-400">2. 伺服器給鑰匙</div>
                <div class="mt-2 flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2">
                  <span class="text-2xl">🔑</span>
                  <span class="text-sm text-slate-300">JWT Token</span>
                </div>
              </div>
            </div>

            <!-- 箭頭 -->
            <div
              class="text-2xl text-amber-400 transition-all delay-400 duration-300 md:text-3xl"
              :class="animState >= 4 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
            >
              <span class="hidden md:inline">→</span>
              <span class="md:hidden">↓</span>
            </div>

            <!-- Step 3: 瀏覽器存起來 -->
            <div
              class="transition-all delay-500 duration-500"
              :class="animState >= 4 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
            >
              <div class="relative flex flex-col items-center">
                <div class="absolute -inset-3 animate-pulse rounded-2xl bg-amber-500/20 blur-lg"></div>
                <div class="relative flex flex-col items-center rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-4">
                  <span class="text-4xl md:text-5xl">🌐</span>
                  <div class="mt-2 text-lg font-bold text-amber-400">3. 瀏覽器存起來</div>
                  <div class="mt-2 flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2">
                    <span class="text-2xl">📦</span>
                    <span class="text-sm text-slate-300">存到儲物櫃</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 說明 -->
          <div
            class="w-full max-w-lg transition-all delay-700 duration-500"
            :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
              <div class="text-base text-slate-300 md:text-lg">
                下次你再開 Facebook<br>
                <span class="text-amber-400">瀏覽器自動帶著鑰匙，伺服器就認得你！</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== WHERE-STORED VIEW ========== -->
      <div v-if="stepData.view === 'where-stored'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6 md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-5">
          <!-- 標題 -->
          <div
            class="text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <span class="text-5xl md:text-6xl">📦</span>
            <div class="mt-3 text-2xl font-bold text-white md:text-3xl">瀏覽器的兩個儲物櫃</div>
            <div class="mt-2 text-base text-slate-400">每個網域都有自己專屬的儲物櫃！</div>
          </div>

          <!-- 網域專屬說明 -->
          <div
            class="w-full max-w-lg transition-all delay-200 duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="flex items-center justify-center gap-3 rounded-xl bg-slate-800/50 px-4 py-3">
              <div class="flex items-center gap-2 rounded-lg bg-sky-500/20 px-3 py-1.5">
                <span class="text-lg">📘</span>
                <span class="text-sm text-sky-400">facebook.com</span>
              </div>
              <span class="text-slate-500">≠</span>
              <div class="flex items-center gap-2 rounded-lg bg-emerald-500/20 px-3 py-1.5">
                <span class="text-lg">📺</span>
                <span class="text-sm text-emerald-400">youtube.com</span>
              </div>
              <span class="text-slate-500">≠</span>
              <div class="flex items-center gap-2 rounded-lg bg-amber-500/20 px-3 py-1.5">
                <span class="text-lg">🛒</span>
                <span class="text-sm text-amber-400">shopee.tw</span>
              </div>
            </div>
          </div>

          <!-- 兩個選項 -->
          <div
            class="grid gap-5 transition-all delay-300 duration-700 md:grid-cols-2"
            :class="animState >= 2 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <!-- LocalStorage -->
            <div class="relative">
              <div class="absolute -inset-2 rounded-2xl bg-sky-500/20 blur-lg"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-sky-500/50 bg-slate-900 p-5">
                <div class="flex flex-col items-center gap-3">
                  <span class="text-4xl">🗄️</span>
                  <div class="text-xl font-bold text-sky-400">LocalStorage</div>
                  <div class="space-y-1.5 text-center text-sm text-slate-300">
                    <div>容量大（約 5MB）</div>
                    <div>關掉瀏覽器還在</div>
                    <div>只有 JavaScript 能讀</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cookie -->
            <div class="relative">
              <div class="absolute -inset-2 rounded-2xl bg-amber-500/20 blur-lg"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-slate-900 p-5">
                <div class="flex flex-col items-center gap-3">
                  <span class="text-4xl">🍪</span>
                  <div class="text-xl font-bold text-amber-400">Cookie</div>
                  <div class="space-y-1.5 text-center text-sm text-slate-300">
                    <div>容量小（約 4KB）</div>
                    <div>可設定過期時間</div>
                    <div>每次請求自動帶上</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 提示 -->
          <div
            class="transition-all delay-600 duration-500"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <div class="text-base text-slate-300 md:text-lg">
                兩種都能存 JWT<br>
                <span class="text-emerald-400">讓我們打開 Chrome 看看實際位置！</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== LETS-FIND-OUT VIEW：過渡頁 ========== -->
      <div v-if="stepData.view === 'lets-find-out'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6 md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- 問題 -->
          <div
            class="text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <span class="text-6xl md:text-7xl">🔍</span>
            <div class="mt-4 text-2xl font-bold text-white md:text-3xl">那麼究竟...</div>
          </div>

          <!-- 疑問卡片 -->
          <div
            class="max-w-lg transition-all delay-300 duration-700"
            :class="animState >= 2 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-amber-500/20 blur-xl"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-slate-900 p-6">
                <div class="text-center">
                  <div class="text-xl text-slate-300 md:text-2xl">
                    登入後後端回傳的鑰匙<br>
                    <span class="mt-2 block text-2xl font-bold text-amber-400 md:text-3xl">
                      前端工程師會存到哪裡呢？
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 行動呼籲 -->
          <div
            class="transition-all delay-600 duration-500"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 p-5 text-center">
              <div class="flex items-center justify-center gap-3">
                <span class="text-3xl">🛠️</span>
                <div class="text-lg text-slate-300 md:text-xl">
                  讓我們用 <span class="font-bold text-sky-400">Chrome 開發者工具</span><br>
                  <span class="text-slate-400">來親眼找找看！</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== DEVTOOLS-STEP1 VIEW：打開開發者工具 ========== -->
      <div v-if="stepData.view === 'devtools-step1'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6 md:p-6">
        <div class="relative z-10 flex w-full max-w-4xl flex-col items-center gap-4">
          <!-- 步驟指示 -->
          <div
            class="transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="flex items-center justify-center gap-2 rounded-full bg-sky-500/20 px-4 py-2">
              <span class="text-lg font-bold text-sky-400">Step 1</span>
              <span class="text-slate-400">/</span>
              <span class="text-slate-400">5</span>
              <span class="ml-2 text-slate-300">打開開發者工具</span>
            </div>
          </div>

          <!-- 大瀏覽器框架 -->
          <div
            class="w-full transition-all delay-100 duration-700"
            :class="animState >= 1 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-slate-500/10 blur-xl"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-slate-600 bg-slate-900 shadow-2xl">
                <!-- 瀏覽器標題列 -->
                <div class="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2">
                  <div class="flex gap-2">
                    <div class="h-3 w-3 rounded-full bg-red-500"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div class="flex flex-1 items-center rounded-lg bg-slate-700 px-3 py-1">
                    <span class="text-xs text-slate-400">🔒</span>
                    <span class="ml-2 text-xs text-slate-300">https://www.facebook.com</span>
                  </div>
                </div>

                <!-- 瀏覽器內容區 -->
                <div class="relative flex h-48 items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 md:h-56">
                  <!-- Facebook 網頁模擬 -->
                  <div class="flex flex-col items-center justify-center">
                    <div class="flex items-center gap-3">
                      <span class="text-3xl md:text-4xl">📘</span>
                      <span class="text-xl font-bold text-blue-400 md:text-2xl">Facebook</span>
                    </div>
                    <div class="mt-2 text-sm text-slate-500">（任意網頁）</div>
                  </div>

                  <!-- 右鍵選單模擬 -->
                  <div
                    class="absolute bottom-4 left-4 transition-all delay-500 duration-300 md:bottom-6 md:left-8"
                    :class="animState >= 2 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
                  >
                    <div class="overflow-hidden rounded-lg border border-slate-600 bg-slate-800 shadow-2xl">
                      <!-- 選單項目 -->
                      <div class="w-36 py-1 text-xs md:w-44 md:text-sm">
                        <div class="px-3 py-1 text-slate-400">上一頁</div>
                        <div class="px-3 py-1 text-slate-400">重新載入</div>
                        <div class="my-1 border-t border-slate-600"></div>
                        <div class="px-3 py-1 text-slate-400">另存新檔...</div>
                        <div class="my-1 border-t border-slate-600"></div>
                        <!-- 檢查選項 - 發亮 -->
                        <div
                          class="relative cursor-pointer px-3 py-1.5 font-bold transition-colors"
                          :class="animState >= 3 ? 'bg-sky-500/30 text-sky-400' : 'text-slate-300'"
                        >
                          <span>檢查</span>
                          <!-- 發亮效果 -->
                          <div
                            v-if="animState >= 3"
                            class="absolute inset-0 animate-pulse bg-sky-400/20"
                          ></div>
                          <!-- 指示箭頭 -->
                          <div
                            v-if="animState >= 3"
                            class="absolute -right-7 top-1/2 -translate-y-1/2"
                          >
                            <span class="text-base">👈</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作提示 -->
          <div
            class="transition-all delay-300 duration-500"
            :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="flex flex-col items-center gap-2">
              <div class="text-center text-slate-300">
                <div class="text-base">在網頁上 <span class="font-bold text-sky-400">按右鍵</span>，然後選擇 <span class="font-bold text-emerald-400">「檢查」</span></div>
              </div>
              <div class="flex items-center gap-3 text-sm text-slate-500">
                <span>或按鍵盤</span>
                <span class="rounded-lg bg-slate-800 px-3 py-1 font-mono text-emerald-400">F12</span>
              </div>
            </div>
          </div>

          <!-- 其他打開方式 -->
          <div
            class="flex flex-wrap justify-center gap-2 transition-all delay-500 duration-500"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-400">
              Mac: <span class="font-mono text-slate-300">⌘+⌥+I</span>
            </div>
            <div class="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-400">
              Win: <span class="font-mono text-slate-300">Ctrl+Shift+I</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== DEVTOOLS-STEP2 VIEW：找到 Application 頁籤 ========== -->
      <div v-if="stepData.view === 'devtools-step2'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6 md:p-6">
        <div class="relative z-10 flex w-full max-w-4xl flex-col items-center gap-4">
          <!-- 步驟指示 -->
          <div
            class="transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="flex items-center justify-center gap-2 rounded-full bg-sky-500/20 px-4 py-2">
              <span class="text-lg font-bold text-sky-400">Step 2</span>
              <span class="text-slate-400">/</span>
              <span class="text-slate-400">5</span>
              <span class="ml-2 text-slate-300">找到 Application 頁籤</span>
            </div>
          </div>

          <!-- 大瀏覽器框架 + DevTools -->
          <div
            class="w-full transition-all delay-100 duration-700"
            :class="animState >= 1 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-slate-500/10 blur-xl"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-slate-600 bg-slate-900 shadow-2xl">
                <!-- 瀏覽器標題列 -->
                <div class="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2">
                  <div class="flex gap-2">
                    <div class="h-3 w-3 rounded-full bg-red-500"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div class="flex flex-1 items-center rounded-lg bg-slate-700 px-3 py-1">
                    <span class="text-xs text-slate-400">🔒</span>
                    <span class="ml-2 text-xs text-slate-300">https://www.facebook.com</span>
                  </div>
                </div>

                <!-- 瀏覽器內容區（上方網頁 + 下方 DevTools） -->
                <div class="flex flex-col">
                  <!-- 上方：網頁內容（縮小） -->
                  <div class="flex h-14 items-center justify-center bg-gradient-to-b from-slate-800 to-slate-850 md:h-20">
                    <div class="flex items-center gap-2 opacity-40">
                      <span class="text-xl md:text-2xl">📘</span>
                      <span class="text-sm font-bold text-blue-400 md:text-lg">Facebook</span>
                    </div>
                  </div>

                  <!-- 下方：DevTools 面板 -->
                  <div class="border-t-2 border-sky-500 bg-slate-900">
                    <!-- DevTools 頁籤列 -->
                    <div class="flex overflow-x-auto border-b border-slate-700 bg-slate-800/80">
                      <div class="shrink-0 px-2 py-2 text-xs text-slate-500">Elements</div>
                      <div class="shrink-0 px-2 py-2 text-xs text-slate-500">Console</div>
                      <div class="hidden shrink-0 px-2 py-2 text-xs text-slate-500 md:block">Network</div>
                      <div
                        class="relative shrink-0 border-b-2 px-2 py-2 text-xs font-bold transition-all duration-500"
                        :class="animState >= 3 ? 'border-sky-400 bg-sky-500/20 text-sky-400' : 'border-transparent text-slate-500'"
                      >
                        Application
                        <div
                          v-if="animState >= 2 && animState < 3"
                          class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center"
                        >
                          <span class="text-sm">👆</span>
                        </div>
                        <div
                          v-if="animState >= 3"
                          class="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-sky-400"
                        ></div>
                        <div
                          v-if="animState >= 3"
                          class="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-sky-400"
                        ></div>
                      </div>
                      <div class="shrink-0 px-2 py-2 text-xs text-slate-500">»</div>
                    </div>

                    <!-- DevTools 內容區 -->
                    <div class="flex h-28 items-center justify-center bg-slate-900/50 md:h-36">
                      <div
                        v-if="animState < 3"
                        class="text-center"
                      >
                        <div class="text-lg text-slate-400">在頁籤列找到</div>
                        <div class="mt-1 rounded-lg bg-sky-500/20 px-4 py-2 text-xl font-bold text-sky-400">Application</div>
                        <div class="mt-2 text-sm text-slate-500">點擊它</div>
                      </div>
                      <div
                        v-else
                        class="text-center"
                      >
                        <span class="text-4xl">✅</span>
                        <div class="mt-2 text-emerald-400">很好！進入 Application 頁面</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 找不到怎麼辦 -->
          <div
            class="transition-all delay-400 duration-500"
            :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2">
              <div class="flex items-center gap-2 text-sm">
                <span>💡</span>
                <span class="text-slate-300">找不到？點 <span class="font-mono text-amber-400">»</span> 展開更多頁籤</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== DEVTOOLS-STEP3 VIEW：找到 Storage 區塊 ========== -->
      <div v-if="stepData.view === 'devtools-step3'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6 md:p-6">
        <div class="relative z-10 flex w-full max-w-4xl flex-col items-center gap-4">
          <!-- 步驟指示 -->
          <div
            class="transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="flex items-center justify-center gap-2 rounded-full bg-sky-500/20 px-4 py-2">
              <span class="text-lg font-bold text-sky-400">Step 3</span>
              <span class="text-slate-400">/</span>
              <span class="text-slate-400">5</span>
              <span class="ml-2 text-slate-300">找到 Storage 區塊</span>
            </div>
          </div>

          <!-- 大瀏覽器框架 + DevTools -->
          <div
            class="w-full transition-all delay-100 duration-700"
            :class="animState >= 1 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-slate-500/10 blur-xl"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-slate-600 bg-slate-900 shadow-2xl">
                <!-- 瀏覽器標題列 -->
                <div class="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2">
                  <div class="flex gap-2">
                    <div class="h-3 w-3 rounded-full bg-red-500"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div class="flex flex-1 items-center rounded-lg bg-slate-700 px-3 py-1">
                    <span class="text-xs text-slate-400">🔒</span>
                    <span class="ml-2 text-xs text-slate-300">https://www.facebook.com</span>
                  </div>
                </div>

                <!-- 瀏覽器內容區 -->
                <div class="flex flex-col">
                  <!-- 上方：網頁內容（更小） -->
                  <div class="flex h-16 items-center justify-center bg-gradient-to-b from-slate-800 to-slate-850 md:h-20">
                    <div class="flex items-center gap-2 opacity-40">
                      <span class="text-xl">📘</span>
                      <span class="text-sm font-bold text-blue-400">Facebook</span>
                    </div>
                  </div>

                  <!-- 下方：DevTools 面板 -->
                  <div class="border-t-2 border-sky-500 bg-slate-900">
                    <!-- DevTools 頁籤列 -->
                    <div class="flex border-b border-slate-700 bg-slate-800/80">
                      <div class="px-2 py-1.5 text-xs text-slate-500">Elements</div>
                      <div class="px-2 py-1.5 text-xs text-slate-500">Console</div>
                      <div class="border-b-2 border-sky-400 bg-sky-500/20 px-2 py-1.5 text-xs font-bold text-sky-400">Application</div>
                      <div class="px-2 py-1.5 text-xs text-slate-500">...</div>
                    </div>

                    <!-- Application 內容：左側選單 -->
                    <div class="flex">
                      <!-- 左側面板 -->
                      <div class="w-44 border-r border-slate-700 bg-slate-900/50 p-3 md:w-52">
                        <div class="space-y-2">
                          <div class="text-xs font-bold uppercase text-slate-500">Application</div>
                          <div class="ml-2 space-y-1 text-xs text-slate-500">
                            <div>Manifest</div>
                            <div>Service Workers</div>
                          </div>

                          <!-- Storage 區塊（重點！） -->
                          <div
                            class="mt-2 rounded-lg p-2 transition-all duration-500"
                            :class="animState >= 2 ? 'bg-sky-500/20 ring-2 ring-sky-500' : 'bg-transparent'"
                          >
                            <div class="flex items-center gap-2">
                              <span class="text-xs font-bold uppercase text-sky-400">Storage</span>
                              <span v-if="animState >= 2 && animState < 3" class="text-sm">👈</span>
                              <span v-if="animState >= 3" class="text-sm">✅</span>
                            </div>
                            <div class="ml-2 mt-1 space-y-0.5 text-xs">
                              <div class="text-slate-400">📁 Local Storage</div>
                              <div class="text-slate-400">📁 Session Storage</div>
                              <div class="text-slate-400">🍪 Cookies</div>
                            </div>
                          </div>

                          <div class="mt-2 text-xs font-bold uppercase text-slate-500">Background Services</div>
                        </div>
                      </div>

                      <!-- 右側內容區 -->
                      <div class="flex flex-1 items-center justify-center p-4">
                        <div class="text-center text-slate-500">
                          <div class="text-sm">在左側面板找到</div>
                          <div class="mt-1 rounded-lg bg-sky-500/20 px-3 py-1 text-base font-bold text-sky-400">Storage</div>
                          <div class="mt-2 text-xs text-slate-400">這就是瀏覽器的儲物櫃區域</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 提示 -->
          <div
            class="transition-all delay-400 duration-500"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
              <div class="text-sm text-slate-300">
                找到 <span class="font-bold text-sky-400">Storage</span> 了！這裡面有 <span class="text-sky-400">Local Storage</span> 和 <span class="text-amber-400">Cookies</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== DEVTOOLS-STEP4 VIEW：展開 Local Storage ========== -->
      <div v-if="stepData.view === 'devtools-step4'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6 md:p-6">
        <div class="relative z-10 flex w-full max-w-4xl flex-col items-center gap-4">
          <!-- 步驟指示 -->
          <div
            class="transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="flex items-center justify-center gap-2 rounded-full bg-sky-500/20 px-4 py-2">
              <span class="text-lg font-bold text-sky-400">Step 4</span>
              <span class="text-slate-400">/</span>
              <span class="text-slate-400">5</span>
              <span class="ml-2 text-slate-300">展開 Local Storage</span>
            </div>
          </div>

          <!-- 大瀏覽器框架 + DevTools -->
          <div
            class="w-full transition-all delay-100 duration-700"
            :class="animState >= 1 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-slate-500/10 blur-xl"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-slate-600 bg-slate-900 shadow-2xl">
                <!-- 瀏覽器標題列 -->
                <div class="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2">
                  <div class="flex gap-2">
                    <div class="h-3 w-3 rounded-full bg-red-500"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div class="flex flex-1 items-center rounded-lg bg-slate-700 px-3 py-1">
                    <span class="text-xs text-slate-400">🔒</span>
                    <span class="ml-2 text-xs text-slate-300">https://www.facebook.com</span>
                  </div>
                </div>

                <!-- 瀏覽器內容區 -->
                <div class="flex flex-col">
                  <!-- 上方：網頁內容（更小） -->
                  <div class="flex h-14 items-center justify-center bg-gradient-to-b from-slate-800 to-slate-850 md:h-16">
                    <div class="flex items-center gap-2 opacity-30">
                      <span class="text-lg">📘</span>
                      <span class="text-xs font-bold text-blue-400">Facebook</span>
                    </div>
                  </div>

                  <!-- 下方：DevTools 面板 -->
                  <div class="border-t-2 border-sky-500 bg-slate-900">
                    <!-- DevTools 頁籤列 -->
                    <div class="flex border-b border-slate-700 bg-slate-800/80">
                      <div class="px-2 py-1.5 text-xs text-slate-500">Elements</div>
                      <div class="border-b-2 border-sky-400 bg-sky-500/20 px-2 py-1.5 text-xs font-bold text-sky-400">Application</div>
                      <div class="px-2 py-1.5 text-xs text-slate-500">...</div>
                    </div>

                    <!-- Application 內容 -->
                    <div class="flex">
                      <!-- 左側面板 -->
                      <div class="w-48 border-r border-slate-700 bg-slate-900/50 p-3 md:w-56">
                        <div class="text-xs font-bold uppercase text-slate-500">Storage</div>
                        <div class="mt-2 space-y-1">
                          <!-- Local Storage（重點！） -->
                          <div
                            class="rounded-lg p-2 transition-all duration-500"
                            :class="animState >= 2 ? 'bg-sky-500/20' : 'bg-transparent'"
                          >
                            <div class="flex items-center gap-2">
                              <span
                                class="inline-block text-sm transition-transform duration-300"
                                :class="animState >= 3 ? 'rotate-90 text-sky-400' : 'text-slate-400'"
                              >▶</span>
                              <span class="text-xs" :class="animState >= 2 ? 'text-sky-400' : 'text-slate-400'">📁 Local Storage</span>
                              <span v-if="animState >= 2 && animState < 3" class="text-sm">👆</span>
                            </div>
                            <!-- 展開後的網域 -->
                            <div
                              v-if="animState >= 4"
                              class="ml-4 mt-1 transition-all duration-500"
                            >
                              <div class="flex items-center gap-1 rounded bg-sky-500/30 px-2 py-1 text-xs text-sky-300">
                                <span>📄</span>
                                <span class="truncate">facebook.com</span>
                              </div>
                            </div>
                          </div>

                          <!-- 其他 Storage -->
                          <div class="p-2 text-xs text-slate-500">
                            <div class="flex items-center gap-2">
                              <span>▶</span>
                              <span>📁 Session Storage</span>
                            </div>
                          </div>
                          <div class="p-2 text-xs text-slate-500">
                            <div class="flex items-center gap-2">
                              <span>▶</span>
                              <span>🍪 Cookies</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- 右側內容區 -->
                      <div class="flex flex-1 items-center justify-center p-4">
                        <div v-if="animState < 4" class="text-center">
                          <div class="text-sm text-slate-400">點擊 Local Storage 左邊的</div>
                          <div class="mt-2 flex items-center justify-center gap-2">
                            <span class="rounded-lg bg-sky-500/20 px-3 py-1 text-lg text-sky-400">▶</span>
                            <span class="text-slate-400">箭頭</span>
                          </div>
                          <div class="mt-2 text-xs text-slate-500">展開它</div>
                        </div>
                        <div v-else class="text-center">
                          <span class="text-3xl">✅</span>
                          <div class="mt-2 text-emerald-400">展開了！</div>
                          <div class="mt-1 text-xs text-slate-400">可以看到 facebook.com 的資料</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 提示 -->
          <div
            class="transition-all delay-400 duration-500"
            :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
              <div class="text-sm text-slate-300">
                展開後可以看到有哪些網站存了資料！
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== DEVTOOLS-STEP5 VIEW：點擊網域名稱 ========== -->
      <div v-if="stepData.view === 'devtools-step5'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6 md:p-6">
        <div class="relative z-10 flex w-full max-w-4xl flex-col items-center gap-4">
          <!-- 步驟指示 -->
          <div
            class="transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="flex items-center justify-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2">
              <span class="text-lg font-bold text-emerald-400">Step 5</span>
              <span class="text-slate-400">/</span>
              <span class="text-slate-400">5</span>
              <span class="ml-2 text-slate-300">點擊網域名稱查看資料</span>
            </div>
          </div>

          <!-- 大瀏覽器框架 + DevTools -->
          <div
            class="w-full transition-all delay-100 duration-700"
            :class="animState >= 1 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-emerald-500/10 blur-xl"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-slate-600 bg-slate-900 shadow-2xl">
                <!-- 瀏覽器標題列 -->
                <div class="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2">
                  <div class="flex gap-2">
                    <div class="h-3 w-3 rounded-full bg-red-500"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div class="flex flex-1 items-center rounded-lg bg-slate-700 px-3 py-1">
                    <span class="text-xs text-slate-400">🔒</span>
                    <span class="ml-2 text-xs text-slate-300">https://www.facebook.com</span>
                  </div>
                </div>

                <!-- 瀏覽器內容區 -->
                <div class="flex flex-col">
                  <!-- 上方：網頁內容（最小） -->
                  <div class="flex h-12 items-center justify-center bg-gradient-to-b from-slate-800 to-slate-850 md:h-14">
                    <div class="flex items-center gap-2 opacity-25">
                      <span class="text-base">📘</span>
                      <span class="text-xs font-bold text-blue-400">Facebook</span>
                    </div>
                  </div>

                  <!-- 下方：DevTools 面板 -->
                  <div class="border-t-2 border-emerald-500 bg-slate-900">
                    <!-- DevTools 頁籤列 -->
                    <div class="flex border-b border-slate-700 bg-slate-800/80">
                      <div class="px-2 py-1 text-xs text-slate-500">Elements</div>
                      <div class="border-b-2 border-sky-400 bg-sky-500/20 px-2 py-1 text-xs font-bold text-sky-400">Application</div>
                      <div class="px-2 py-1 text-xs text-slate-500">...</div>
                    </div>

                    <!-- Application 內容 -->
                    <div class="flex">
                      <!-- 左側面板 -->
                      <div class="w-44 border-r border-slate-700 bg-slate-900/50 p-2 md:w-48">
                        <div class="text-xs font-bold uppercase text-slate-500">Storage</div>
                        <div class="mt-2">
                          <div class="flex items-center gap-1 text-xs text-sky-400">
                            <span class="rotate-90">▶</span>
                            <span>📁 Local Storage</span>
                          </div>
                          <div
                            class="ml-4 mt-1 cursor-pointer rounded px-2 py-1 text-xs transition-all duration-300"
                            :class="animState >= 3 ? 'bg-emerald-500/30 text-emerald-300 ring-2 ring-emerald-500' : 'text-slate-400'"
                          >
                            <div class="flex items-center gap-1">
                              <span>📄</span>
                              <span class="truncate">facebook.com</span>
                              <span v-if="animState >= 2 && animState < 4" class="text-sm">👆</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- 右側資料顯示 -->
                      <div class="flex-1 p-3">
                        <div
                          v-if="animState < 4"
                          class="flex h-28 items-center justify-center text-center text-slate-500 md:h-32"
                        >
                          <div>
                            <span class="text-2xl">👈</span>
                            <div class="mt-1 text-sm">點擊左邊的網域名稱</div>
                          </div>
                        </div>
                        <div
                          v-else
                          class="transition-all duration-500"
                        >
                          <!-- 資料表格 -->
                          <div class="mb-2 flex border-b border-slate-700 pb-1 text-xs font-bold text-slate-400">
                            <div class="w-1/3">Key</div>
                            <div class="flex-1">Value</div>
                          </div>
                          <div class="space-y-1 font-mono text-xs">
                            <div class="flex items-center rounded bg-amber-500/20 py-1.5">
                              <div class="w-1/3 px-2 text-amber-400">access_token</div>
                              <div class="flex-1 truncate px-2 text-emerald-400">eyJhbGciOiJIUzI1...</div>
                              <span class="pr-2">🔑</span>
                            </div>
                            <div class="flex py-1">
                              <div class="w-1/3 px-2 text-slate-400">user_id</div>
                              <div class="flex-1 px-2 text-slate-300">12345678</div>
                            </div>
                            <div class="flex py-1">
                              <div class="w-1/3 px-2 text-slate-400">theme</div>
                              <div class="flex-1 px-2 text-slate-300">dark</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 成功提示 -->
          <div
            class="transition-all delay-400 duration-500"
            :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
              <div class="flex items-center justify-center gap-2">
                <span class="text-xl">👀</span>
                <span class="font-bold text-emerald-400">看到了！</span>
              </div>
              <div class="mt-1 text-sm text-slate-300">
                這裡就是 Facebook 在你瀏覽器存的資料<br>
                <span class="text-amber-400">其中一個可能就是登入資訊！</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== DEVTOOLS-LOCALSTORAGE VIEW ========== -->
      <div v-if="stepData.view === 'devtools-localstorage'" class="relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-4">
          <!-- 標題 -->
          <div
            class="text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="flex items-center justify-center gap-2">
              <span class="text-3xl">🗄️</span>
              <div class="text-xl font-bold text-white md:text-2xl">LocalStorage 長這樣</div>
            </div>
            <div class="mt-2 text-sm text-slate-400">
              你會看到<span class="text-amber-400">很多資料</span>，其中某些可能跟登入有關
            </div>
          </div>

          <!-- Chrome DevTools 模擬 - LocalStorage -->
          <div
            class="w-full transition-all delay-200 duration-700"
            :class="animState >= 2 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-sky-500/20 blur-xl"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-sky-500/50 bg-slate-900">
                <!-- DevTools 頁籤 -->
                <div class="flex border-b border-slate-700 bg-slate-800/50">
                  <div class="border-b-2 border-sky-400 px-4 py-2 text-sm font-bold text-sky-400">Application</div>
                </div>

                <!-- DevTools 內容區 -->
                <div class="flex">
                  <!-- 左側選單 -->
                  <div class="w-48 border-r border-slate-700 bg-slate-900/50 p-3">
                    <div class="text-xs font-bold text-slate-500">Storage</div>
                    <div
                      class="mt-2 rounded px-2 py-1 text-sm transition-all duration-300"
                      :class="animState >= 3 ? 'bg-sky-500/30 text-sky-400' : 'text-slate-400'"
                    >
                      <span
                        class="inline-block transition-transform duration-300"
                        :class="animState >= 3 ? 'rotate-90' : ''"
                      >▶</span>
                      Local Storage
                    </div>
                    <div
                      v-if="animState >= 3"
                      class="ml-4 mt-1 rounded bg-sky-500/20 px-2 py-1 text-xs text-sky-300 transition-all duration-300"
                    >
                      📄 facebook.com
                    </div>
                    <div class="mt-2 rounded px-2 py-1 text-sm text-slate-500">
                      🍪 Cookies
                    </div>
                  </div>

                  <!-- 右側內容 - Key/Value 表格 -->
                  <div class="flex-1 p-3">
                    <div
                      class="transition-all duration-500"
                      :class="animState >= 4 ? 'opacity-100' : 'opacity-0'"
                    >
                      <!-- 表頭 -->
                      <div class="mb-2 flex border-b border-slate-700 pb-2 text-xs font-bold text-slate-400">
                        <div class="w-1/3">Key</div>
                        <div class="flex-1">Value</div>
                      </div>
                      <!-- 資料行 - 顯示多筆資料表示「很多東西」 -->
                      <div class="flex py-1.5 font-mono text-xs">
                        <div class="w-1/3 text-slate-500">_fbp</div>
                        <div class="flex-1 truncate text-slate-400">fb.1.17234...</div>
                      </div>
                      <div class="flex py-1.5 font-mono text-xs">
                        <div class="w-1/3 text-slate-500">locale</div>
                        <div class="flex-1 text-slate-400">zh_TW</div>
                      </div>
                      <div
                        class="flex items-center rounded py-1.5 font-mono text-xs transition-all duration-500"
                        :class="animState >= 5 ? 'bg-amber-500/20' : ''"
                      >
                        <div class="w-1/3 text-amber-400">access_token</div>
                        <div class="flex-1 truncate text-emerald-400">eyJhbGciOiJIUzI1NiIs...</div>
                        <span v-if="animState >= 5" class="ml-2 text-lg">🔑</span>
                      </div>
                      <div class="flex py-1.5 font-mono text-xs">
                        <div class="w-1/3 text-slate-500">user_id</div>
                        <div class="flex-1 text-slate-400">12345678</div>
                      </div>
                      <div class="flex py-1.5 font-mono text-xs">
                        <div class="w-1/3 text-slate-500">theme</div>
                        <div class="flex-1 text-slate-400">dark</div>
                      </div>
                      <div class="flex py-1.5 font-mono text-xs">
                        <div class="w-1/3 text-slate-500">lastVisit</div>
                        <div class="flex-1 text-slate-400">2024-01-15</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 說明 -->
          <div
            class="w-full max-w-xl space-y-3 transition-all delay-700 duration-500"
            :class="animState >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div class="flex items-start gap-3">
                <span class="text-2xl">💡</span>
                <div>
                  <div class="font-bold text-amber-400">找到了！</div>
                  <div class="mt-1 text-sm text-slate-300">
                    在這一堆資料中，<span class="font-mono text-amber-400">access_token</span> 就是登入鑰匙<br>
                    這串 <span class="font-mono text-emerald-400">eyJ...</span> 開頭的亂碼就是 JWT！
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4">
              <div class="flex items-start gap-3">
                <span class="text-2xl">🔍</span>
                <div>
                  <div class="font-bold text-sky-400">名稱不一定叫 access_token</div>
                  <div class="mt-2 text-sm text-slate-300">
                    每個網站的命名習慣不同，常見的名稱還有：
                  </div>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span class="rounded bg-slate-700 px-2 py-1 font-mono text-xs text-slate-300">token</span>
                    <span class="rounded bg-slate-700 px-2 py-1 font-mono text-xs text-slate-300">auth_token</span>
                    <span class="rounded bg-slate-700 px-2 py-1 font-mono text-xs text-slate-300">jwt</span>
                    <span class="rounded bg-slate-700 px-2 py-1 font-mono text-xs text-slate-300">session</span>
                    <span class="rounded bg-slate-700 px-2 py-1 font-mono text-xs text-slate-300">id_token</span>
                  </div>
                  <div class="mt-2 text-xs text-slate-400">
                    通常會是一串<span class="text-emerald-400">很長的字串</span>，每個網站的命名和格式都不同
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== DEVTOOLS-COOKIE VIEW ========== -->
      <div v-if="stepData.view === 'devtools-cookie'" class="relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-4 py-6 md:justify-center md:p-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-4">
          <!-- 標題 -->
          <div
            class="text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="flex items-center justify-center gap-2">
              <span class="text-3xl">🍪</span>
              <div class="text-xl font-bold text-white md:text-2xl">Cookie 長這樣</div>
            </div>
          </div>

          <!-- Chrome DevTools 模擬 - Cookie -->
          <div
            class="w-full transition-all delay-200 duration-700"
            :class="animState >= 2 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-amber-500/20 blur-xl"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-slate-900">
                <!-- DevTools 頁籤 -->
                <div class="flex border-b border-slate-700 bg-slate-800/50">
                  <div class="border-b-2 border-sky-400 px-4 py-2 text-sm font-bold text-sky-400">Application</div>
                </div>

                <!-- DevTools 內容區 -->
                <div class="flex">
                  <!-- 左側選單 -->
                  <div class="w-48 border-r border-slate-700 bg-slate-900/50 p-3">
                    <div class="text-xs font-bold text-slate-500">Storage</div>
                    <div class="mt-2 rounded px-2 py-1 text-sm text-slate-500">
                      📁 Local Storage
                    </div>
                    <div
                      class="mt-1 rounded px-2 py-1 text-sm transition-all duration-300"
                      :class="animState >= 3 ? 'bg-amber-500/30 text-amber-400' : 'text-slate-400'"
                    >
                      <span
                        class="inline-block transition-transform duration-300"
                        :class="animState >= 3 ? 'rotate-90' : ''"
                      >▶</span>
                      Cookies
                    </div>
                    <div
                      v-if="animState >= 3"
                      class="ml-4 mt-1 rounded bg-amber-500/20 px-2 py-1 text-xs text-amber-300 transition-all duration-300"
                    >
                      🍪 facebook.com
                    </div>
                  </div>

                  <!-- 右側內容 - Cookie 表格 -->
                  <div class="flex-1 overflow-x-auto p-3">
                    <div
                      class="transition-all duration-500"
                      :class="animState >= 4 ? 'opacity-100' : 'opacity-0'"
                    >
                      <!-- 表頭 -->
                      <div class="mb-2 flex gap-4 border-b border-slate-700 pb-2 text-xs font-bold text-slate-400">
                        <div class="w-28">Name</div>
                        <div class="w-40">Value</div>
                        <div class="w-20">Expires</div>
                      </div>
                      <!-- 資料行 -->
                      <div
                        class="flex items-center gap-4 rounded py-2 font-mono text-xs transition-all duration-500"
                        :class="animState >= 5 ? 'bg-amber-500/20' : ''"
                      >
                        <div class="w-28 text-amber-400">c_user</div>
                        <div class="w-40 truncate text-emerald-400">12345678</div>
                        <div class="w-20 text-slate-400">1 year</div>
                        <span v-if="animState >= 5" class="text-lg">🔑</span>
                      </div>
                      <div
                        class="flex items-center gap-4 rounded py-2 font-mono text-xs transition-all duration-500"
                        :class="animState >= 5 ? 'bg-amber-500/20' : ''"
                      >
                        <div class="w-28 text-amber-400">xs</div>
                        <div class="w-40 truncate text-emerald-400">abc123xyz...</div>
                        <div class="w-20 text-slate-400">1 year</div>
                        <span v-if="animState >= 5" class="text-lg">🔑</span>
                      </div>
                      <div class="flex gap-4 py-2 font-mono text-xs">
                        <div class="w-28 text-slate-400">locale</div>
                        <div class="w-40 text-slate-300">zh_TW</div>
                        <div class="w-20 text-slate-400">Session</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 說明 -->
          <div
            class="w-full max-w-lg transition-all delay-700 duration-500"
            :class="animState >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div class="flex items-start gap-3">
                <span class="text-2xl">💡</span>
                <div>
                  <div class="font-bold text-amber-400">Cookie 的特色</div>
                  <div class="mt-1 text-sm text-slate-300">
                    Cookie 有「過期時間」<br>
                    每次發請求會自動帶上，不用自己寫程式！
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CLEAR-DATA VIEW ========== -->
      <div v-if="stepData.view === 'clear-data'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6 md:p-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-5">
          <!-- 標題 -->
          <div
            class="text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <span class="text-5xl md:text-6xl">🗑️</span>
            <div class="mt-3 text-2xl font-bold text-white md:text-3xl">如果清除這些資料...</div>
          </div>

          <!-- 動畫流程 -->
          <div class="flex w-full flex-col items-center gap-4 md:flex-row md:justify-center md:gap-6">
            <!-- Step 1: DevTools 清除 -->
            <div
              class="transition-all delay-100 duration-500"
              :class="animState >= 2 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
            >
              <div class="relative flex flex-col items-center rounded-2xl border-2 border-red-500/50 bg-slate-900 p-4">
                <div class="absolute -inset-2 animate-pulse rounded-2xl bg-red-500/10"></div>
                <div class="relative">
                  <span class="text-4xl md:text-5xl">🖥️</span>
                  <div class="mt-2 text-lg font-bold text-red-400">清除資料</div>
                  <div class="mt-2 flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2">
                    <span class="text-xl">🗑️</span>
                    <div class="text-sm">
                      <div class="text-red-400 line-through">access_token</div>
                      <div class="text-red-400 line-through">Cookie</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 箭頭 -->
            <div
              class="text-2xl text-red-400 transition-all delay-300 duration-300 md:text-3xl"
              :class="animState >= 3 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
            >
              <span class="hidden md:inline">→</span>
              <span class="md:hidden">↓</span>
            </div>

            <!-- Step 2: 鑰匙消失 -->
            <div
              class="transition-all delay-400 duration-500"
              :class="animState >= 3 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
            >
              <div class="flex flex-col items-center rounded-2xl border-2 border-slate-600 bg-slate-900 p-4">
                <span class="text-4xl md:text-5xl">🌐</span>
                <div class="mt-2 text-lg font-bold text-slate-400">瀏覽器</div>
                <div class="mt-2 rounded-lg bg-slate-800 px-4 py-2 text-center">
                  <div class="text-2xl">❓</div>
                  <div class="text-sm text-slate-400">沒有鑰匙了</div>
                </div>
              </div>
            </div>

            <!-- 箭頭 -->
            <div
              class="text-2xl text-red-400 transition-all delay-500 duration-300 md:text-3xl"
              :class="animState >= 4 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
            >
              <span class="hidden md:inline">→</span>
              <span class="md:hidden">↓</span>
            </div>

            <!-- Step 3: 伺服器拒絕 -->
            <div
              class="transition-all delay-600 duration-500"
              :class="animState >= 4 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'"
            >
              <div class="relative flex flex-col items-center">
                <div class="absolute -inset-3 animate-pulse rounded-2xl bg-red-500/20 blur-lg"></div>
                <div class="relative flex flex-col items-center rounded-2xl border-2 border-red-400 bg-gradient-to-br from-red-500/20 to-orange-500/20 p-4">
                  <span class="text-4xl md:text-5xl">🖥️</span>
                  <div class="mt-2 text-lg font-bold text-red-400">伺服器</div>
                  <div class="mt-2 rounded-lg bg-slate-800 px-4 py-2 text-center">
                    <div class="text-xl">🚫</div>
                    <div class="text-sm text-red-400">「你是誰？」</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 結果說明 -->
          <div
            class="w-full max-w-lg transition-all delay-700 duration-500"
            :class="animState >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
              <div class="flex items-start gap-3">
                <span class="text-2xl">⚠️</span>
                <div>
                  <div class="text-lg font-bold text-red-400">清除後會發生什麼？</div>
                  <div class="mt-2 space-y-2 text-sm text-slate-300">
                    <div class="flex items-center gap-2">
                      <span class="text-red-400">•</span>
                      <span>瀏覽器沒有鑰匙，伺服器不認得你</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-red-400">•</span>
                      <span>Facebook 會變成登出狀態</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-red-400">•</span>
                      <span>需要重新輸入帳號密碼！</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== SECURITY-WARNING VIEW ========== -->
      <div v-if="stepData.view === 'security-warning'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6 md:p-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-5">
          <!-- 標題 -->
          <div
            class="text-center transition-all duration-500"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <span class="text-5xl md:text-6xl">🔐</span>
            <div class="mt-3 text-2xl font-bold text-white md:text-3xl">重要安全提醒！</div>
            <div class="mt-2 text-lg text-red-400">在公司特別要注意</div>
          </div>

          <!-- 危險情境說明 -->
          <div
            class="w-full transition-all delay-200 duration-700"
            :class="animState >= 2 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-red-500/20 blur-xl"></div>
              <div class="relative overflow-hidden rounded-2xl border-2 border-red-500/50 bg-slate-900 p-6">
                <div class="text-center">
                  <div class="text-xl font-bold text-red-400 md:text-2xl">如果離開電腦沒鎖定...</div>
                </div>

                <!-- 攻擊流程 -->
                <div class="mt-6 flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-6">
                  <!-- Step 1: 離開電腦 -->
                  <div
                    class="transition-all delay-300 duration-500"
                    :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
                  >
                    <div class="flex flex-col items-center rounded-xl bg-slate-800 p-4">
                      <span class="text-4xl">🚶</span>
                      <div class="mt-2 text-sm text-slate-400">你去上廁所</div>
                      <div class="mt-1 rounded bg-amber-500/20 px-2 py-1 text-xs text-amber-400">電腦沒鎖</div>
                    </div>
                  </div>

                  <!-- 箭頭 -->
                  <div
                    class="text-xl text-red-400 transition-all delay-400 duration-300"
                    :class="animState >= 4 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
                  >
                    <span class="hidden md:inline">→</span>
                    <span class="md:hidden">↓</span>
                  </div>

                  <!-- Step 2: 偷鑰匙 -->
                  <div
                    class="transition-all delay-500 duration-500"
                    :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
                  >
                    <div class="flex flex-col items-center rounded-xl bg-red-500/20 p-4">
                      <span class="text-4xl">😈</span>
                      <div class="mt-2 text-sm text-red-400">別人打開 DevTools</div>
                      <div class="mt-1 flex items-center gap-1 rounded bg-red-500/30 px-2 py-1 text-xs text-red-300">
                        <span>複製</span>
                        <span class="text-amber-400">🔑</span>
                        <span>access_token</span>
                      </div>
                    </div>
                  </div>

                  <!-- 箭頭 -->
                  <div
                    class="text-xl text-red-400 transition-all delay-600 duration-300"
                    :class="animState >= 5 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
                  >
                    <span class="hidden md:inline">→</span>
                    <span class="md:hidden">↓</span>
                  </div>

                  <!-- Step 3: 冒充你 -->
                  <div
                    class="transition-all delay-700 duration-500"
                    :class="animState >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
                  >
                    <div class="relative flex flex-col items-center">
                      <div class="absolute -inset-2 animate-pulse rounded-xl bg-red-500/30"></div>
                      <div class="relative flex flex-col items-center rounded-xl bg-red-500/30 p-4">
                        <span class="text-4xl">🎭</span>
                        <div class="mt-2 text-sm text-red-400">貼到自己電腦</div>
                        <div class="mt-1 rounded bg-red-500/40 px-2 py-1 text-xs text-white">用你的身份登入！</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 解決方案 -->
          <div
            class="grid w-full gap-4 transition-all delay-800 duration-500 md:grid-cols-2"
            :class="animState >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div class="flex items-start gap-3">
                <span class="text-2xl">💻</span>
                <div>
                  <div class="font-bold text-emerald-400">離開時記得鎖定電腦</div>
                  <div class="mt-1 text-sm text-slate-300">
                    Mac：<span class="font-mono text-emerald-300">⌘ + Ctrl + Q</span><br>
                    Windows：<span class="font-mono text-emerald-300">Win + L</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div class="flex items-start gap-3">
                <span class="text-2xl">⏰</span>
                <div>
                  <div class="font-bold text-amber-400">設定自動鎖定</div>
                  <div class="mt-1 text-sm text-slate-300">
                    螢幕保護程式設定<br>
                    閒置幾分鐘自動鎖定
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== SUMMARY VIEW ========== -->
      <div v-if="stepData.view === 'summary'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6 md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- 核心概念 -->
          <div
            class="transition-all duration-700"
            :class="animState >= 1 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-6 rounded-3xl bg-gradient-to-r from-sky-500/20 to-amber-500/20 blur-2xl"></div>
              <div class="relative overflow-hidden rounded-3xl border-2 border-sky-500/50 bg-slate-900 p-6 md:p-8">
                <div class="text-center">
                  <div class="text-5xl md:text-6xl">🎉</div>
                  <div class="mt-4 text-xl font-bold text-white md:text-2xl">現在你知道了！</div>
                </div>

                <!-- 重點整理 -->
                <div
                  class="mt-6 space-y-3 transition-all delay-300 duration-500"
                  :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
                >
                  <div class="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                    <span class="text-lg">🔑</span>
                    <div class="text-sm text-slate-300">登入後，伺服器給你一把「鑰匙」（JWT）</div>
                  </div>
                  <div class="flex items-center gap-3 rounded-lg bg-sky-500/20 p-3">
                    <span class="text-lg">📦</span>
                    <div class="text-sm text-slate-300">瀏覽器把鑰匙存到 <span class="text-sky-400">LocalStorage</span> 或 <span class="text-amber-400">Cookie</span></div>
                  </div>
                  <div class="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                    <span class="text-lg">🔄</span>
                    <div class="text-sm text-slate-300">重新整理時，瀏覽器自動帶著鑰匙</div>
                  </div>
                  <div class="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                    <span class="text-lg">✅</span>
                    <div class="text-sm text-slate-300">伺服器驗證鑰匙，確認你是誰</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 小技巧 -->
          <div
            class="transition-all delay-500 duration-500"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 text-center">
              <div class="text-sm text-emerald-300 md:text-base">
                💡 小技巧：按 F12 打開開發者工具<br>
                到 Application → Storage 就能看到網站存的資料！
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

.animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
</style>
