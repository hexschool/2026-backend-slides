<script setup lang="ts">
/**
 * CRUD 入門互動簡報 (10 關)
 * 用 Skill 後端程式碼學會 CRUD
 * 重點：後端工程師怎麼用程式碼寫 CRUD
 */
import { ref, computed, watch, onMounted } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{
  isMobile?: boolean
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

// === 步驟定義 ===
type StepView =
  | 'intro' | 'recap' | 'backend_role'
  | 'backend_folder' | 'api_types' | 'file_structure' | 'code_intro'
  | 'api1_title' | 'route_code' | 'create_code' | 'read_code' | 'delete_code'
  | 'api2_title' | 'jwt_recap' | 'jwt_route_code' | 'jwt_middleware' | 'jwt_controller_code'
  | 'summary'

type Step = {
  id: number
  view: StepView
  title: string
  desc: string
}

const STEPS: Step[] = [
  // 開場
  { id: 1, view: 'intro', title: '後端工程師的 CRUD', desc: '之前我們用 DBeaver 直接下 SQL 指令，今天來看後端工程師怎麼用「程式碼」做同樣的事！' },
  { id: 2, view: 'recap', title: '複習一下 CRUD', desc: 'CRUD 就是資料庫的四種操作，你還記得嗎？' },
  { id: 3, view: 'backend_role', title: '後端程式的角色', desc: '為什麼不直接用 DBeaver？因為使用者不會用 DBeaver 啊！' },
  // 檔案位置
  { id: 4, view: 'backend_folder', title: '後端程式碼在哪？', desc: '後端程式碼都放在 backend 資料夾裡面！' },
  { id: 5, view: 'api_types', title: '今天要看的兩種 API', desc: '接下來會用兩個例子來學習 CRUD！' },
  { id: 6, view: 'file_structure', title: '程式碼在哪裡？', desc: '後端程式碼放在兩個地方，讓我們來看看檔案位置！' },
  { id: 7, view: 'code_intro', title: '不要怕 Code！', desc: '接下來會看程式碼，我們會用白話文一步步講解！' },
  // 第一個 API：Skill
  { id: 8, view: 'api1_title', title: '第一個 API', desc: '先來看 Skill 技能管理的程式碼！' },
  { id: 9, view: 'route_code', title: '定義 API 網址', desc: '這個檔案定義了「有哪些 API 可以用」' },
  { id: 10, view: 'create_code', title: '🟢 Create - 新增技能', desc: '當有人想新增一個技能，這段程式碼就會執行！' },
  { id: 11, view: 'read_code', title: '🔵 Read - 讀取技能', desc: '當有人想看所有技能，這段程式碼就會執行！' },
  { id: 12, view: 'delete_code', title: '🔴 Delete - 刪除技能', desc: '當有人想刪除一個技能，這段程式碼就會執行！' },
  // 第二個 API：教練新增課程
  { id: 13, view: 'api2_title', title: '第二個 API', desc: '接下來看需要身份驗證的 API！' },
  { id: 14, view: 'jwt_recap', title: '還記得 JWT 嗎？', desc: '有些操作需要先登入才能做，這時候就需要 JWT 驗證！' },
  { id: 15, view: 'jwt_route_code', title: '需要登入的 API', desc: '來看看「教練新增課程」的 Route 長什麼樣子！' },
  { id: 16, view: 'jwt_middleware', title: 'auth 是什麼？', desc: '這個 auth 就是用來驗證 JWT 的程式碼！' },
  { id: 17, view: 'jwt_controller_code', title: '從 JWT 拿到使用者', desc: '驗證通過後，程式碼就能知道「是誰」在操作！' },
  // 總結
  { id: 18, view: 'summary', title: '重點回顧', desc: '恭喜你認識後端程式的 CRUD 了！' },
]

// === 狀態 ===
const currentStep = ref(0)
const animState = ref(0)

const stepData = computed(() => STEPS[currentStep.value])

onMounted(() => {
  triggerAnimation()
})

watch(currentStep, () => {
  animState.value = 0
  setTimeout(() => triggerAnimation(), 100)
})

function triggerAnimation() {
  setTimeout(() => { animState.value = 1 }, 200)
  setTimeout(() => { animState.value = 2 }, 500)
  setTimeout(() => { animState.value = 3 }, 800)
  setTimeout(() => { animState.value = 4 }, 1100)
  setTimeout(() => { animState.value = 5 }, 1400)
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
    title="後端的 CRUD"
    subtitle="用程式碼操作資料庫"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="emerald"
    @prev="prevStep"
    @next="nextStep"
    @complete="handleComplete"
  >
    <template #icon>
      <div class="relative">
        <span class="text-2xl md:text-3xl">💻</span>
        <div class="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
      </div>
    </template>

    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- 背景 -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="animate-float-slow absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div class="animate-float-slower absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-green-500/10 blur-3xl"></div>
      </div>

      <!-- ========== INTRO ========== -->
      <div v-if="stepData.view === 'intro'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6">
          <div class="text-6xl transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
            💻
          </div>
          <h2 class="text-2xl font-bold text-white transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            從 DBeaver 到後端程式
          </h2>

          <!-- 比較 -->
          <div class="grid w-full grid-cols-2 gap-4">
            <div class="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 text-center transition-all duration-500" :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="text-3xl">🦫</div>
              <h3 class="mt-2 font-bold text-orange-400">Day 6-7：DBeaver</h3>
              <p class="mt-1 text-sm text-slate-400">你自己打 SQL 指令</p>
              <p class="text-xs text-slate-500">（手動操作）</p>
            </div>
            <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center transition-all duration-500" :class="animState >= 2 ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'">
              <div class="text-3xl">💻</div>
              <h3 class="mt-2 font-bold text-emerald-400">Day 9：後端程式</h3>
              <p class="mt-1 text-sm text-slate-400">程式幫你執行 SQL</p>
              <p class="text-xs text-slate-500">（自動操作）</p>
            </div>
          </div>

          <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-sky-400">
              💡 今天要看的是：<span class="font-bold">後端工程師寫的程式碼</span>
            </p>
          </div>
        </div>
      </div>

      <!-- ========== RECAP: 複習 CRUD ========== -->
      <div v-if="stepData.view === 'recap'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-5">
          <h2 class="text-2xl font-bold text-white">同樣是 CRUD，寫法不同</h2>

          <!-- 對比：以 Create 為例 -->
          <div class="w-full grid gap-4 md:grid-cols-2">
            <!-- DBeaver -->
            <div class="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 transition-all duration-500" :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="mb-3 flex items-center gap-2">
                <span class="text-2xl">🦫</span>
                <span class="font-bold text-orange-400">DBeaver（手動打 SQL）</span>
              </div>
              <div class="rounded-lg bg-slate-900 p-3 font-mono text-xs">
                <div class="text-green-400">-- 新增一筆技能</div>
                <div class="mt-1">
                  <span class="text-purple-400">INSERT INTO</span>
                  <span class="text-white"> skill (name)</span>
                </div>
                <div>
                  <span class="text-purple-400">VALUES</span>
                  <span class="text-white"> (</span>
                  <span class="text-amber-300">'重訓'</span>
                  <span class="text-white">);</span>
                </div>
              </div>
            </div>

            <!-- Node.js -->
            <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 transition-all duration-500" :class="animState >= 2 ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'">
              <div class="mb-3 flex items-center gap-2">
                <span class="text-2xl">💻</span>
                <span class="font-bold text-emerald-400">Node.js（程式碼）</span>
              </div>
              <div class="rounded-lg bg-slate-900 p-3 font-mono text-xs">
                <div class="text-green-400">// 新增一筆技能</div>
                <div class="mt-1">
                  <span class="text-purple-400">const</span>
                  <span class="text-white"> newSkill = skillRepo.</span>
                  <span class="text-blue-400">create</span>
                  <span class="text-white">({</span>
                </div>
                <div class="pl-2">
                  <span class="text-white">name: </span>
                  <span class="text-amber-300">'重訓'</span>
                </div>
                <div><span class="text-white">})</span></div>
                <div>
                  <span class="text-yellow-400">await</span>
                  <span class="text-white"> skillRepo.</span>
                  <span class="text-blue-400">save</span>
                  <span class="text-white">(newSkill)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 重點說明 -->
          <div class="w-full rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-sky-400">
              💡 <span class="font-bold">本質上都是在做一樣的事！</span>
            </p>
            <p class="mt-2 text-center text-sm text-slate-400">
              Node.js 會把程式碼轉換成 SQL 指令，送到資料庫執行
            </p>
          </div>

          <!-- 轉換示意 -->
          <div class="flex items-center gap-3 text-sm transition-all duration-500" :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="rounded-lg bg-emerald-500/20 px-3 py-2 font-mono text-emerald-400">
              .create() + .save()
            </div>
            <span class="text-slate-500">→ 轉換成 →</span>
            <div class="rounded-lg bg-purple-500/20 px-3 py-2 font-mono text-purple-400">
              INSERT INTO ...
            </div>
          </div>
        </div>
      </div>

      <!-- ========== BACKEND ROLE ========== -->
      <div v-if="stepData.view === 'backend_role'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6">
          <h2 class="text-xl font-bold text-white">為什麼需要後端程式？</h2>

          <!-- 情境說明 -->
          <div class="w-full rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-rose-400">
              ❌ 總不能叫使用者自己開 DBeaver 打 SQL 吧？
            </p>
            <p class="mt-2 text-center text-sm text-slate-400">
              「欸，你要註冊的話，請自己打 INSERT INTO USER...」
            </p>
          </div>

          <!-- 流程圖 -->
          <div class="flex w-full flex-col items-center gap-3 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-slate-400">正確的做法：</p>
            <div class="flex flex-wrap items-center justify-center gap-2 text-sm">
              <div class="rounded-lg bg-pink-500/20 px-3 py-2 text-pink-400">👤 使用者按按鈕</div>
              <span class="text-slate-500">→</span>
              <div class="rounded-lg bg-emerald-500/20 px-3 py-2 text-emerald-400">💻 後端程式</div>
              <span class="text-slate-500">→</span>
              <div class="rounded-lg bg-purple-500/20 px-3 py-2 text-purple-400">🗄️ 執行 SQL</div>
              <span class="text-slate-500">→</span>
              <div class="rounded-lg bg-sky-500/20 px-3 py-2 text-sky-400">📦 資料庫</div>
            </div>
          </div>

          <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-emerald-400">
              💡 後端程式 = <span class="font-bold">自動幫使用者執行 SQL 的機器人</span>
            </p>
          </div>
        </div>
      </div>

      <!-- ========== BACKEND FOLDER ========== -->
      <div v-if="stepData.view === 'backend_folder'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6">
          <div class="text-5xl transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
            📂
          </div>
          <h2 class="text-2xl font-bold text-white">後端程式碼在哪？</h2>

          <!-- 資料夾結構 -->
          <div class="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-6 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="font-mono text-sm">
              <div class="flex items-center gap-2 text-slate-400">
                <span>📁</span>
                <span>專案根目錄</span>
              </div>
              <div class="ml-4 mt-2 flex items-center gap-2 text-slate-500">
                <span>├─</span>
                <span>📁 frontend</span>
                <span class="text-xs text-slate-600">（前端程式碼）</span>
              </div>
              <div class="ml-4 mt-2 flex items-center gap-2 rounded-lg bg-emerald-500/20 px-2 py-1">
                <span class="text-emerald-400">├─</span>
                <span class="font-bold text-emerald-400">📁 backend</span>
                <span class="text-xs text-emerald-300">← 後端程式碼在這裡！</span>
              </div>
              <div class="ml-4 mt-2 flex items-center gap-2 text-slate-500">
                <span>└─</span>
                <span>📄 其他檔案...</span>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-emerald-400">
              💡 所有後端程式碼都放在 <span class="font-bold font-mono">backend</span> 資料夾裡面
            </p>
          </div>
        </div>
      </div>

      <!-- ========== API TYPES - 兩種 API 介紹 ========== -->
      <div v-if="stepData.view === 'api_types'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6">
          <div class="text-5xl transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
            📚
          </div>
          <h2 class="text-2xl font-bold text-white transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            今天要看兩種 API
          </h2>

          <!-- 兩種 API -->
          <div class="w-full space-y-4">
            <!-- 第一種：Skill -->
            <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 transition-all duration-500" :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'">
              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-2xl">
                  1️⃣
                </div>
                <div>
                  <h3 class="text-lg font-bold text-amber-400">Skill 技能管理</h3>
                  <p class="mt-1 text-sm text-slate-300">需要<span class="font-bold text-amber-300">登入</span>才能操作</p>
                  <p class="mt-2 text-xs text-slate-400">👉 學習基本的 CRUD 怎麼寫</p>
                </div>
              </div>
            </div>

            <!-- 第二種：教練新增課程 -->
            <div class="rounded-xl border border-purple-500/30 bg-purple-500/10 p-5 transition-all duration-500" :class="animState >= 3 ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'">
              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-2xl">
                  2️⃣
                </div>
                <div>
                  <h3 class="text-lg font-bold text-purple-400">教練新增課程</h3>
                  <p class="mt-1 text-sm text-slate-300">需要<span class="font-bold text-purple-300">登入</span> + <span class="font-bold text-purple-300">教練身份</span></p>
                  <p class="mt-2 text-xs text-slate-400">👉 學習多一層身份驗證的 API 怎麼寫</p>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 transition-all duration-500" :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-sky-400">
              💡 先學簡單的，再學有驗證的！
            </p>
          </div>
        </div>
      </div>

      <!-- ========== FILE STRUCTURE ========== -->
      <div v-if="stepData.view === 'file_structure'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6">
          <div class="text-5xl transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
            📁
          </div>
          <h2 class="text-2xl font-bold text-white">程式碼放在哪裡？</h2>

          <div class="w-full space-y-4">
            <!-- 第一個檔案 -->
            <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-xl">📄</div>
                <div>
                  <p class="font-mono text-sm font-bold text-amber-400">backend/routes/skill.js</p>
                  <p class="text-sm text-slate-400">定義「有哪些 API 網址可以用」</p>
                </div>
              </div>
            </div>

            <!-- 箭頭 -->
            <div class="flex justify-center text-2xl text-slate-500 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              ↓
            </div>

            <!-- 第二個檔案 -->
            <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-xl">📄</div>
                <div>
                  <p class="font-mono text-sm font-bold text-emerald-400">backend/controllers/skill.js</p>
                  <p class="text-sm text-slate-400">定義「收到請求後要怎麼處理」</p>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 transition-all duration-500" :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-sky-400">
              💡 <span class="font-bold">你可以在專案裡找到這兩個檔案，自己去看看！</span>
            </p>
          </div>
        </div>
      </div>

      <!-- ========== CODE INTRO - 鼓勵頁面 ========== -->
      <div v-if="stepData.view === 'code_intro'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6">
          <div class="text-5xl transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
            💪
          </div>
          <h2 class="text-2xl font-bold text-white transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            不要對 Code 感到害怕！
          </h2>

          <!-- 鼓勵訊息 -->
          <div class="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-lg text-emerald-400">
              接下來會看到一些程式碼
            </p>
            <p class="mt-2 text-center text-emerald-400">
              別擔心！我們會用<span class="font-bold text-yellow-400">「白話文」</span>來講解
            </p>
          </div>

          <!-- 提示 -->
          <div class="w-full space-y-3 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex items-center gap-3 rounded-xl border border-sky-500/30 bg-sky-500/10 p-4">
              <span class="text-2xl">📖</span>
              <p class="text-sky-400">每段程式碼都會有<span class="font-bold">白話文解釋</span></p>
            </div>
            <div class="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <span class="text-2xl">🎯</span>
              <p class="text-amber-400">重點會用<span class="font-bold">顏色標註</span>出來</p>
            </div>
            <div class="flex items-center gap-3 rounded-xl border border-pink-500/30 bg-pink-500/10 p-4">
              <span class="text-2xl">🐢</span>
              <p class="text-pink-400">慢慢看，<span class="font-bold">不用急</span>！</p>
            </div>
          </div>

          <div class="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 transition-all duration-500" :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-purple-400">
              🚀 準備好了嗎？讓我們開始看 Code！
            </p>
          </div>
        </div>
      </div>

      <!-- ========== API1 TITLE - 第一個 API 標題 ========== -->
      <div v-if="stepData.view === 'api1_title'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6">
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20 text-4xl transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
            1️⃣
          </div>
          <h2 class="text-3xl font-bold text-amber-400 transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            Skill 技能管理
          </h2>

          <div class="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex items-center justify-center gap-2 text-amber-300">
              <span class="text-xl">🔐</span>
              <span>需要<span class="font-bold">登入</span>才能操作</span>
            </div>
          </div>

          <div class="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="mb-3 text-center text-sm text-slate-400">📁 會看到的檔案：</p>
            <div class="flex flex-col items-center gap-2 text-sm">
              <div class="rounded-lg bg-amber-500/20 px-4 py-2 font-mono text-amber-400">
                backend/routes/skill.js
              </div>
              <div class="rounded-lg bg-emerald-500/20 px-4 py-2 font-mono text-emerald-400">
                backend/controllers/skill.js
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 transition-all duration-500" :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-sky-400">
              💡 學習基本的 <span class="font-bold">CRUD</span> 怎麼寫！
            </p>
          </div>
        </div>
      </div>

      <!-- ========== ROUTE CODE ========== -->
      <div v-if="stepData.view === 'route_code'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="rounded bg-amber-500/20 px-2 py-1 text-xs font-bold text-amber-400">📄 backend/routes/skill.js</span>
          </div>
          <h2 class="text-xl font-bold text-white">定義 API 網址的程式碼</h2>

          <!-- 程式碼區塊 -->
          <div class="w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-4 py-3">
              <span class="text-lg">📄</span>
              <span class="font-mono text-base font-bold text-amber-400">backend/routes/skill.js</span>
              <span class="animate-bounce-x text-xl text-yellow-400">👈</span>
              <span class="text-sm text-slate-300">檔案位置</span>
            </div>
            <div class="p-4 font-mono text-sm leading-relaxed">
              <div class="text-slate-500">const router = express.Router()</div>
              <div class="mt-4"></div>

              <!-- Read -->
              <div class="group relative rounded-lg transition-all duration-300" :class="animState >= 2 ? 'bg-blue-500/10' : ''">
                <div class="flex items-start gap-2 py-1">
                  <span class="text-slate-400">router.</span>
                  <span class="font-bold text-blue-400">get</span>
                  <span class="text-slate-400">(</span>
                  <span class="text-amber-300">'/'</span>
                  <span class="text-slate-400">, skillController.getAll)</span>
                </div>
                <div v-if="animState >= 2" class="absolute -right-2 top-1/2 -translate-y-1/2 rounded bg-blue-500 px-2 py-0.5 text-xs font-bold text-white">
                  🔵 Read
                </div>
              </div>

              <div class="mt-2"></div>

              <!-- Create -->
              <div class="group relative rounded-lg transition-all duration-300" :class="animState >= 3 ? 'bg-green-500/10' : ''">
                <div class="flex items-start gap-2 py-1">
                  <span class="text-slate-400">router.</span>
                  <span class="font-bold text-green-400">post</span>
                  <span class="text-slate-400">(</span>
                  <span class="text-amber-300">'/'</span>
                  <span class="text-slate-400">, skillController.postSkill)</span>
                </div>
                <div v-if="animState >= 3" class="absolute -right-2 top-1/2 -translate-y-1/2 rounded bg-green-500 px-2 py-0.5 text-xs font-bold text-white">
                  🟢 Create
                </div>
              </div>

              <div class="mt-2"></div>

              <!-- Delete -->
              <div class="group relative rounded-lg transition-all duration-300" :class="animState >= 4 ? 'bg-red-500/10' : ''">
                <div class="flex items-start gap-2 py-1">
                  <span class="text-slate-400">router.</span>
                  <span class="font-bold text-red-400">delete</span>
                  <span class="text-slate-400">(</span>
                  <span class="text-amber-300">'/:skillId'</span>
                  <span class="text-slate-400">, skillController.delete)</span>
                </div>
                <div v-if="animState >= 4" class="absolute -right-2 top-1/2 -translate-y-1/2 rounded bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                  🔴 Delete
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 transition-all duration-500" :class="animState >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-sm text-emerald-400">
              💡 這裡只是「登記」有哪些 API，真正處理資料的程式碼在 <span class="font-bold">backend/controllers/skill.js</span>！
            </p>
          </div>
        </div>
      </div>

      <!-- ========== CREATE CODE ========== -->
      <div v-if="stepData.view === 'create_code'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-white">C</span>
            <h2 class="text-xl font-bold text-green-400">Create - 新增技能</h2>
          </div>

          <!-- 白話解釋 -->
          <div class="w-full rounded-xl border border-green-500/30 bg-green-500/10 p-4 transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-green-400">
              <span class="font-bold">白話文：</span>收到技能名稱 → 檢查有沒有填 → 檢查有沒有重複 → 存進資料庫
            </p>
          </div>

          <!-- 程式碼 -->
          <div class="w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex flex-col gap-2 border-b border-slate-700 bg-slate-800 px-4 py-3">
              <div class="flex items-center gap-2">
                <span class="text-lg">📄</span>
                <span class="font-mono text-base font-bold text-emerald-400">backend/controllers/skill.js</span>
                <span class="animate-bounce-x text-xl text-yellow-400">👈</span>
                <span class="text-sm text-slate-300">檔案位置</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-lg">🔍</span>
                <span class="text-sm text-slate-300">找到函式：</span>
                <span class="rounded bg-green-500/30 px-2 py-1 font-mono text-sm font-bold text-green-400">postSkill</span>
              </div>
              <div class="mt-2 rounded bg-slate-700/50 px-3 py-2 text-sm text-slate-300">
                💡 函式：將一段程式碼打包並命名，用來執行特定任務。以後只要呼叫這個名字，電腦就會自動執行裡面的程式碼！
              </div>
            </div>
            <div class="overflow-x-auto p-4 font-mono text-xs leading-relaxed md:text-sm">
              <div class="text-slate-500">// 🟢 Create：新增技能</div>
              <div class="mt-2 rounded bg-amber-500/10 px-2 py-1">
                <span class="text-purple-400">const</span>
                <span class="text-white"> { name } = req.body</span>
                <span class="ml-2 text-slate-500">// 1. 拿到使用者輸入的名稱</span>
              </div>
              <div class="mt-2 text-slate-500">// 2. 檢查有沒有填寫</div>
              <div class="text-slate-400">if (!name) { return 錯誤回應 }</div>
              <div class="mt-2 text-slate-500">// 3. 檢查資料庫有沒有重複</div>
              <div class="text-slate-400">const existSkill = await skillRepo.find({ name })</div>
              <div class="text-slate-400">if (重複) { return 錯誤回應 }</div>
              <div class="mt-2 rounded bg-green-500/10 px-2 py-1">
                <span class="text-slate-500">// 4. 存進資料庫（這就是 INSERT！）</span>
                <div>
                  <span class="text-purple-400">const</span>
                  <span class="text-white"> newSkill = </span>
                  <span class="text-yellow-400">await</span>
                  <span class="text-white"> skillRepo.</span>
                  <span class="text-green-400">create</span>
                  <span class="text-white">({ name })</span>
                </div>
                <div>
                  <span class="text-yellow-400">await</span>
                  <span class="text-white"> skillRepo.</span>
                  <span class="text-green-400">save</span>
                  <span class="text-white">(newSkill)</span>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-sm text-green-400">
              <code class="rounded bg-slate-800 px-1">skillRepo.create()</code> + <code class="rounded bg-slate-800 px-1">save()</code> = SQL 的 <span class="font-bold">INSERT</span>
            </p>
          </div>
        </div>
      </div>

      <!-- ========== READ CODE ========== -->
      <div v-if="stepData.view === 'read_code'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white">R</span>
            <h2 class="text-xl font-bold text-blue-400">Read - 讀取技能</h2>
          </div>

          <!-- 白話解釋 -->
          <div class="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-blue-400">
              <span class="font-bold">白話文：</span>去資料庫撈所有技能 → 回傳給前端
            </p>
          </div>

          <!-- 程式碼 -->
          <div class="w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex flex-col gap-2 border-b border-slate-700 bg-slate-800 px-4 py-3">
              <div class="flex items-center gap-2">
                <span class="text-lg">📄</span>
                <span class="font-mono text-base font-bold text-emerald-400">backend/controllers/skill.js</span>
                <span class="animate-bounce-x text-xl text-yellow-400">👈</span>
                <span class="text-sm text-slate-300">檔案位置</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-lg">🔍</span>
                <span class="text-sm text-slate-300">找到函式：</span>
                <span class="rounded bg-blue-500/30 px-2 py-1 font-mono text-sm font-bold text-blue-400">getAll</span>
              </div>
            </div>
            <div class="overflow-x-auto p-4 font-mono text-xs leading-relaxed md:text-sm">
              <div class="text-slate-500">// 🔵 Read：讀取所有技能</div>
              <div class="mt-2 rounded bg-blue-500/10 px-2 py-1">
                <span class="text-slate-500">// 去資料庫撈資料（這就是 SELECT！）</span>
                <div class="mt-1">
                  <span class="text-purple-400">const</span>
                  <span class="text-white"> skill = </span>
                  <span class="text-yellow-400">await</span>
                  <span class="text-white"> dataSource</span>
                </div>
                <div class="pl-4">
                  <span class="text-white">.getRepository(</span>
                  <span class="text-amber-300">'Skill'</span>
                  <span class="text-white">)</span>
                </div>
                <div class="pl-4">
                  <span class="text-white">.</span>
                  <span class="text-blue-400">find</span>
                  <span class="text-white">({</span>
                </div>
                <div class="pl-8">
                  <span class="text-white">select: [</span>
                  <span class="text-amber-300">'id'</span>
                  <span class="text-white">, </span>
                  <span class="text-amber-300">'name'</span>
                  <span class="text-white">]</span>
                </div>
                <div class="pl-4">
                  <span class="text-white">})</span>
                </div>
              </div>
              <div class="mt-3 text-slate-500">// 回傳給前端</div>
              <div class="text-slate-400">res.json({ data: skill })</div>
            </div>
          </div>

          <div class="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-sm text-blue-400">
              <code class="rounded bg-slate-800 px-1">.find()</code> = SQL 的 <span class="font-bold">SELECT</span>
            </p>
          </div>
        </div>
      </div>

      <!-- ========== DELETE CODE ========== -->
      <div v-if="stepData.view === 'delete_code'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-lg font-bold text-white">D</span>
            <h2 class="text-xl font-bold text-red-400">Delete - 刪除技能</h2>
          </div>

          <!-- 白話解釋 -->
          <div class="w-full rounded-xl border border-red-500/30 bg-red-500/10 p-4 transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-red-400">
              <span class="font-bold">白話文：</span>拿到要刪除的 ID → 檢查 ID 有沒有問題 → 從資料庫刪掉
            </p>
          </div>

          <!-- 程式碼 -->
          <div class="w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex flex-col gap-2 border-b border-slate-700 bg-slate-800 px-4 py-3">
              <div class="flex items-center gap-2">
                <span class="text-lg">📄</span>
                <span class="font-mono text-base font-bold text-emerald-400">backend/controllers/skill.js</span>
                <span class="animate-bounce-x text-xl text-yellow-400">👈</span>
                <span class="text-sm text-slate-300">檔案位置</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-lg">🔍</span>
                <span class="text-sm text-slate-300">找到函式：</span>
                <span class="rounded bg-red-500/30 px-2 py-1 font-mono text-sm font-bold text-red-400">delete</span>
              </div>
            </div>
            <div class="overflow-x-auto p-4 font-mono text-xs leading-relaxed md:text-sm">
              <div class="text-slate-500">// 🔴 Delete：刪除技能</div>
              <div class="mt-2 rounded bg-amber-500/10 px-2 py-1">
                <span class="text-purple-400">const</span>
                <span class="text-white"> skillId = req.params.skillId</span>
                <span class="ml-2 text-slate-500">// 1. 拿到要刪的 ID</span>
              </div>
              <div class="mt-2 text-slate-500">// 2. 檢查 ID 有沒有問題</div>
              <div class="text-slate-400">if (!skillId) { return 錯誤回應 }</div>
              <div class="mt-2 rounded bg-red-500/10 px-2 py-1">
                <span class="text-slate-500">// 3. 從資料庫刪掉（這就是 DELETE！）</span>
                <div class="mt-1">
                  <span class="text-purple-400">const</span>
                  <span class="text-white"> result = </span>
                  <span class="text-yellow-400">await</span>
                  <span class="text-white"> dataSource</span>
                </div>
                <div class="pl-4">
                  <span class="text-white">.getRepository(</span>
                  <span class="text-amber-300">'Skill'</span>
                  <span class="text-white">)</span>
                </div>
                <div class="pl-4">
                  <span class="text-white">.</span>
                  <span class="text-red-400">delete</span>
                  <span class="text-white">(skillId)</span>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-sm text-red-400">
              <code class="rounded bg-slate-800 px-1">.delete()</code> = SQL 的 <span class="font-bold">DELETE</span>
            </p>
          </div>
        </div>
      </div>

      <!-- ========== API2 TITLE - 第二個 API 標題 ========== -->
      <div v-if="stepData.view === 'api2_title'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6">
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-purple-500/20 text-4xl transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
            2️⃣
          </div>
          <h2 class="text-3xl font-bold text-purple-400 transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            教練新增課程
          </h2>

          <div class="w-full rounded-xl border border-purple-500/30 bg-purple-500/10 p-5 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex items-center justify-center gap-3 text-purple-300">
              <span class="text-xl">🔐</span>
              <span>需要<span class="font-bold">登入</span></span>
              <span class="text-slate-500">+</span>
              <span class="text-xl">👨‍🏫</span>
              <span>需要<span class="font-bold">教練身份</span></span>
            </div>
          </div>

          <div class="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="mb-3 text-center text-sm text-slate-400">📁 會看到的檔案：</p>
            <div class="flex flex-col items-center gap-2 text-sm">
              <div class="rounded-lg bg-purple-500/20 px-4 py-2 font-mono text-purple-400">
                backend/routes/admin.js
              </div>
              <div class="rounded-lg bg-emerald-500/20 px-4 py-2 font-mono text-emerald-400">
                backend/controllers/admin.js
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 transition-all duration-500" :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-sky-400">
              💡 學習<span class="font-bold">多一層身份驗證</span>的 API 怎麼寫！
            </p>
          </div>
        </div>
      </div>

      <!-- ========== JWT RECAP ========== -->
      <div v-if="stepData.view === 'jwt_recap'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6">
          <div class="text-5xl transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
            🎫
          </div>
          <h2 class="text-2xl font-bold text-white">還記得 Day 8 的 JWT 嗎？</h2>

          <!-- 情境說明 -->
          <div class="w-full rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-purple-400">
              🤔 思考一下：<span class="font-bold">教練要新增自己的課程</span>
            </p>
            <p class="mt-2 text-center text-sm text-slate-400">
              後端怎麼知道「這個人真的是教練」？
            </p>
          </div>

          <!-- 流程圖 -->
          <div class="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex flex-col items-center gap-3 text-sm">
              <div class="flex items-center gap-2">
                <div class="rounded-lg bg-pink-500/20 px-3 py-2 text-pink-400">👤 教練登入</div>
                <span class="text-slate-500">→</span>
                <div class="rounded-lg bg-amber-500/20 px-3 py-2 text-amber-400">🎫 拿到 JWT</div>
              </div>
              <div class="text-slate-500">↓</div>
              <div class="flex items-center gap-2">
                <div class="rounded-lg bg-emerald-500/20 px-3 py-2 text-emerald-400">📝 新增課程時帶上 JWT</div>
              </div>
              <div class="text-slate-500">↓</div>
              <div class="flex items-center gap-2">
                <div class="rounded-lg bg-blue-500/20 px-3 py-2 text-blue-400">✅ 後端驗證 JWT</div>
                <span class="text-slate-500">→</span>
                <div class="rounded-lg bg-green-500/20 px-3 py-2 text-green-400">確認是教練本人！</div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 transition-all duration-500" :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-sky-400">
              💡 有些 CRUD 操作需要<span class="font-bold">先登入</span>才能做，<br>
              後端會用 JWT 確認「你是誰」
            </p>
          </div>
        </div>
      </div>

      <!-- ========== JWT ROUTE CODE ========== -->
      <div v-if="stepData.view === 'jwt_route_code'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-4">
          <h2 class="text-xl font-bold text-white">教練新增課程的 Route</h2>

          <!-- 程式碼區塊 -->
          <div class="w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-4 py-3">
              <span class="text-lg">📄</span>
              <span class="font-mono text-base font-bold text-purple-400">backend/routes/admin.js</span>
              <span class="animate-bounce-x text-xl text-yellow-400">👈</span>
              <span class="text-sm text-slate-300">檔案位置</span>
            </div>
            <div class="p-4 font-mono text-sm leading-relaxed">
              <div class="flex flex-wrap items-center gap-1 py-1">
                <span class="text-slate-400">router.</span>
                <span class="font-bold text-green-400">post</span>
                <span class="text-slate-400">(</span>
                <span class="text-amber-300">'/coaches/courses'</span>
                <span class="text-slate-400">,</span>
              </div>
              <div class="mt-2 flex flex-wrap items-center gap-2 pl-4">
                <span class="rounded bg-purple-500/20 px-2 py-1 text-purple-400 transition-all duration-300" :class="animState >= 2 ? 'ring-2 ring-purple-500' : ''">auth</span>
                <span class="text-slate-400">,</span>
                <span class="rounded bg-amber-500/20 px-2 py-1 text-amber-400 transition-all duration-300" :class="animState >= 3 ? 'ring-2 ring-amber-500' : ''">isCoach</span>
                <span class="text-slate-400">,</span>
              </div>
              <div class="mt-2 pl-4">
                <span class="text-slate-400">adminController.</span>
                <span class="text-blue-400">postCourse</span>
                <span class="text-slate-400">)</span>
              </div>
            </div>
          </div>

          <!-- 說明 -->
          <div class="w-full space-y-2">
            <div class="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <p class="text-center text-sm text-purple-400">
                <span class="font-bold">auth</span> = 驗證 JWT，確認有登入
              </p>
            </div>
            <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <p class="text-center text-sm text-amber-400">
                <span class="font-bold">isCoach</span> = 確認是教練身份
              </p>
            </div>
          </div>

          <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3 transition-all duration-500" :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-sm text-sky-400">
              💡 通過這兩關檢查後，才會執行 <span class="font-bold">postCourse</span>
            </p>
          </div>
        </div>
      </div>

      <!-- ========== JWT MIDDLEWARE ========== -->
      <div v-if="stepData.view === 'jwt_middleware'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6">
        <div class="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6">
          <div class="text-5xl transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
            🔐
          </div>
          <h2 class="text-2xl font-bold text-white">auth 在做什麼？</h2>

          <!-- 白話解釋 -->
          <div class="w-full rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-purple-400">
              <span class="font-bold">白話文：</span>檢查請求有沒有帶 JWT → 驗證 JWT 是否有效 → 解出使用者資訊
            </p>
          </div>

          <!-- 流程 -->
          <div class="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex flex-col items-center gap-3 text-sm">
              <div class="rounded-lg bg-pink-500/20 px-4 py-2 text-pink-400">
                📨 請求帶著 JWT 進來
              </div>
              <div class="text-slate-500">↓</div>
              <div class="rounded-lg bg-purple-500/20 px-4 py-2 text-purple-400">
                🔍 auth 驗證 JWT
              </div>
              <div class="text-slate-500">↓</div>
              <div class="flex items-center gap-4">
                <div class="rounded-lg bg-green-500/20 px-3 py-2 text-green-400">✅ 有效</div>
                <div class="rounded-lg bg-red-500/20 px-3 py-2 text-red-400">❌ 無效 → 回傳錯誤</div>
              </div>
              <div class="text-slate-500">↓</div>
              <div class="rounded-lg bg-emerald-500/20 px-4 py-2 text-emerald-400">
                📝 把使用者資訊放到 <code class="rounded bg-slate-700 px-1">req.user</code>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 transition-all duration-500" :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-sky-400">
              💡 驗證通過後，後面的程式碼就能用 <code class="rounded bg-slate-700 px-1 font-bold">req.user</code> 拿到使用者資訊！
            </p>
          </div>
        </div>
      </div>

      <!-- ========== JWT CONTROLLER CODE ========== -->
      <div v-if="stepData.view === 'jwt_controller_code'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-4">
          <h2 class="text-xl font-bold text-white">教練新增課程的程式碼</h2>

          <!-- 白話解釋 -->
          <div class="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-emerald-400">
              <span class="font-bold">白話文：</span>知道是「誰」要新增 → 收到課程資料 → 存進資料庫
            </p>
          </div>

          <!-- 程式碼 -->
          <div class="w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <div class="flex flex-col gap-2 border-b border-slate-700 bg-slate-800 px-4 py-3">
              <div class="flex items-center gap-2">
                <span class="text-lg">📄</span>
                <span class="font-mono text-base font-bold text-emerald-400">backend/controllers/admin.js</span>
                <span class="animate-bounce-x text-xl text-yellow-400">👈</span>
                <span class="text-sm text-slate-300">檔案位置</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-lg">🔍</span>
                <span class="text-sm text-slate-300">找到函式：</span>
                <span class="rounded bg-green-500/30 px-2 py-1 font-mono text-sm font-bold text-green-400">postCourse</span>
              </div>
            </div>
            <div class="overflow-x-auto p-4 font-mono text-xs leading-relaxed md:text-sm">
              <div class="text-slate-500">// 🟢 Create：教練新增課程</div>
              <div class="mt-2 rounded bg-purple-500/10 px-2 py-1">
                <span class="text-purple-400">const</span>
                <span class="text-white"> { id } = </span>
                <span class="font-bold text-yellow-400">req.user</span>
                <span class="ml-2 text-slate-500">// ← 拿到「目前登入的教練」的 ID</span>
              </div>
              <div class="mt-2 rounded bg-amber-500/10 px-2 py-1">
                <span class="text-purple-400">const</span>
                <span class="text-white"> { name, description, ... } = req.body</span>
                <span class="ml-2 text-slate-500">// 課程資料</span>
              </div>
              <div class="mt-3 text-slate-500">// 檢查資料、驗證...</div>
              <div class="mt-3 rounded bg-green-500/10 px-2 py-1">
                <span class="text-slate-500">// 存進資料庫</span>
                <div class="mt-1">
                  <span class="text-purple-400">const</span>
                  <span class="text-white"> newCourse = courseRepo.</span>
                  <span class="text-green-400">create</span>
                  <span class="text-white">({</span>
                </div>
                <div class="pl-4">
                  <span class="font-bold text-yellow-400">user_id: id</span>
                  <span class="text-slate-400">,</span>
                  <span class="ml-2 text-slate-500">// ← 這堂課是「這位教練」開的</span>
                </div>
                <div class="pl-4">
                  <span class="text-white">name, description, ...</span>
                </div>
                <div><span class="text-white">})</span></div>
                <div class="mt-1">
                  <span class="text-yellow-400">await</span>
                  <span class="text-white"> courseRepo.</span>
                  <span class="text-green-400">save</span>
                  <span class="text-white">(newCourse)</span>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-sm text-sky-400">
              💡 這樣資料庫就知道「這堂課是誰開的」！
            </p>
          </div>
        </div>
      </div>

      <!-- ========== SUMMARY ========== -->
      <div v-if="stepData.view === 'summary'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-4 py-6">
        <div class="relative z-10 flex w-full max-w-3xl flex-col items-center gap-5">
          <div class="text-5xl transition-all duration-700" :class="animState >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'">
            🎉
          </div>
          <h2 class="text-2xl font-bold text-white">重點回顧</h2>

          <!-- 兩個 API 並排 -->
          <div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            <!-- API 1: Skill -->
            <div class="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 transition-all duration-500" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <p class="mb-3 text-center text-sm font-bold text-amber-400">📦 API 1：Skill 技能管理</p>
              <div class="flex flex-col items-center gap-2 text-xs">
                <div class="w-full rounded-lg bg-amber-500/20 px-3 py-2 text-center font-mono text-amber-400">
                  📄 routes/skill.js
                </div>
                <div class="text-slate-500">↓</div>
                <div class="w-full rounded-lg bg-emerald-500/20 px-3 py-2 text-center font-mono text-emerald-400">
                  📄 controllers/skill.js
                </div>
              </div>
              <div class="mt-3 space-y-1 text-xs text-slate-400">
                <div>🟢 <span class="text-green-400">postSkill</span> - 新增</div>
                <div>🔵 <span class="text-blue-400">getAll</span> - 讀取</div>
                <div>🔴 <span class="text-red-400">delete</span> - 刪除</div>
              </div>
            </div>

            <!-- API 2: 教練新增課程 -->
            <div class="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 transition-all duration-500" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <p class="mb-3 text-center text-sm font-bold text-purple-400">📦 API 2：教練新增課程</p>
              <div class="flex flex-col items-center gap-2 text-xs">
                <div class="w-full rounded-lg bg-amber-500/20 px-3 py-2 text-center font-mono text-amber-400">
                  📄 routes/admin.js
                </div>
                <div class="text-slate-500">↓</div>
                <div class="w-full rounded-lg bg-emerald-500/20 px-3 py-2 text-center font-mono text-emerald-400">
                  📄 controllers/admin.js
                </div>
              </div>
              <div class="mt-3 space-y-1 text-xs text-slate-400">
                <div>🔐 需要 <span class="text-purple-400">auth</span> + <span class="text-amber-400">isCoach</span></div>
                <div>🟢 <span class="text-green-400">postCourse</span> - 新增課程</div>
              </div>
            </div>
          </div>

          <!-- 對照表 -->
          <div class="w-full overflow-hidden rounded-xl border border-slate-700 transition-all duration-500" :class="animState >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <table class="w-full text-sm">
              <thead class="bg-slate-800">
                <tr>
                  <th class="px-3 py-2 text-slate-400">CRUD</th>
                  <th class="px-3 py-2 text-amber-400">HTTP</th>
                  <th class="px-3 py-2 text-emerald-400">程式碼</th>
                  <th class="px-3 py-2 text-purple-400">= SQL</th>
                </tr>
              </thead>
              <tbody class="bg-slate-800/50 text-center">
                <tr class="border-t border-slate-700">
                  <td class="px-3 py-2 font-bold text-green-400">🟢 C</td>
                  <td class="px-3 py-2 text-slate-300">POST</td>
                  <td class="px-3 py-2 font-mono text-xs text-slate-300">.create() .save()</td>
                  <td class="px-3 py-2 text-slate-300">INSERT</td>
                </tr>
                <tr class="border-t border-slate-700">
                  <td class="px-3 py-2 font-bold text-blue-400">🔵 R</td>
                  <td class="px-3 py-2 text-slate-300">GET</td>
                  <td class="px-3 py-2 font-mono text-xs text-slate-300">.find()</td>
                  <td class="px-3 py-2 text-slate-300">SELECT</td>
                </tr>
                <tr class="border-t border-slate-700">
                  <td class="px-3 py-2 font-bold text-yellow-400">🟡 U</td>
                  <td class="px-3 py-2 text-slate-300">PUT</td>
                  <td class="px-3 py-2 font-mono text-xs text-slate-300">.update()</td>
                  <td class="px-3 py-2 text-slate-300">UPDATE</td>
                </tr>
                <tr class="border-t border-slate-700">
                  <td class="px-3 py-2 font-bold text-red-400">🔴 D</td>
                  <td class="px-3 py-2 text-slate-300">DELETE</td>
                  <td class="px-3 py-2 font-mono text-xs text-slate-300">.delete()</td>
                  <td class="px-3 py-2 text-slate-300">DELETE</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3 transition-all duration-500" :class="animState >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
            <p class="text-center text-sm text-sky-400">
              💡 打開專案，找到這些檔案和函式，看看程式碼長什麼樣子吧！
            </p>
          </div>
        </div>
      </div>

    </div>
  </InteractiveSlideTemplate>
</template>

<style scoped>
@keyframes float-slow {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-20px) translateX(10px); }
}

@keyframes float-slower {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-15px) translateX(-15px); }
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-slower {
  animation: float-slower 12s ease-in-out infinite;
}

@keyframes bounce-x {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-8px); }
}

.animate-bounce-x {
  animation: bounce-x 1s ease-in-out infinite;
}
</style>
