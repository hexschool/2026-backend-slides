<script setup lang="ts">
/**
 * 📋 Slide Starter Template
 * ─────────────────────────────────────────────
 * 用法：複製本檔 → 改檔名（例如 MyTopicSlide.vue）→ 把 STEPS 與各 view 內容換掉
 * 然後到 src/components/SlideModal.vue 的 slideComponents 註冊一個 slideId，
 * 並到 src/data/courses.ts 的 sections 中加入該 slide。
 *
 * 結構說明：
 *  - 外層使用共用的 InteractiveSlideTemplate（提供 Header / Footer / 進度條 / 上下步控制）
 *  - 內容區用 STEPS 陣列驅動，每個 step 對應一個 view（用 v-if 切換）
 *  - animState 用來在進入 step 時做進場動畫
 */
import { ref, computed, watch, onMounted } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{
  isMobile?: boolean
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

// === 1. 定義步驟 ===========================================================
type StepView = 'intro' | 'content' | 'summary'

type Step = {
  id: number
  view: StepView
  title: string // 顯示在底部說明區的小標題
  desc: string  // 顯示在底部說明區的描述
}

const STEPS: Step[] = [
  {
    id: 0,
    view: 'intro',
    title: '主題介紹',
    desc: '這裡寫第一頁要傳達的核心概念，一句話就好。',
  },
  {
    id: 1,
    view: 'content',
    title: '主要內容',
    desc: '這裡寫這一頁觀眾應該帶走的重點。',
  },
  {
    id: 2,
    view: 'summary',
    title: '總結',
    desc: '這裡寫整份簡報的 takeaway。',
  },
]

// === 2. 狀態與動畫 =========================================================
const currentStep = ref(0)
const animState = ref(0) // 0,1,2,3... 用來分階段觸發進場動畫

const stepData = computed(() => STEPS[currentStep.value])

onMounted(() => triggerStepAnimation())

watch(currentStep, () => {
  animState.value = 0
  setTimeout(() => triggerStepAnimation(), 100)
})

function triggerStepAnimation() {
  // 想要更細緻的進場節奏，就在這裡為每個 view 安排 setTimeout
  setTimeout(() => { animState.value = 1 }, 200)
  setTimeout(() => { animState.value = 2 }, 600)
  setTimeout(() => { animState.value = 3 }, 1000)
}

// === 3. 上下步控制 =========================================================
function nextStep() {
  if (currentStep.value < STEPS.length - 1) currentStep.value++
}
function prevStep() {
  if (currentStep.value > 0) currentStep.value--
}
function handleComplete() {
  emit('complete')
}
</script>

<template>
  <InteractiveSlideTemplate
    title="簡報標題"
    subtitle="可選的副標題"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="sky"
    @prev="prevStep"
    @next="nextStep"
    @goto="(s) => (currentStep = s)"
    @complete="handleComplete"
  >
    <!-- 自訂 Header Icon（可省略，改用 props.icon='🎯'） -->
    <template #icon>
      <span class="text-2xl md:text-3xl">🎯</span>
    </template>

    <!-- 主要內容區：依 stepData.view 切換不同畫面 -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- 背景裝飾（可刪） -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"></div>
        <div class="absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl"></div>
      </div>

      <!-- ========== INTRO VIEW ========== -->
      <div
        v-if="stepData.view === 'intro'"
        class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-6"
      >
        <div
          class="transition-all duration-700"
          :class="animState >= 1 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
        >
          <div class="relative">
            <div class="absolute -inset-4 rounded-3xl bg-gradient-to-r from-sky-500/30 to-emerald-500/30 blur-2xl"></div>
            <div class="relative rounded-3xl border-2 border-sky-500/50 bg-slate-900 px-10 py-8 text-center">
              <div class="text-5xl">🎯</div>
              <div class="mt-3 bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
                你的主題
              </div>
              <div class="mt-2 text-sm text-slate-400">一句話描述</div>
            </div>
          </div>
        </div>

        <div
          class="mt-6 transition-all delay-300 duration-700"
          :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
        >
          <div class="rounded-2xl border border-sky-500/30 bg-slate-900/80 px-6 py-4 text-center text-slate-300">
            這頁可以放一段引言或核心問題
          </div>
        </div>
      </div>

      <!-- ========== CONTENT VIEW ========== -->
      <div
        v-if="stepData.view === 'content'"
        class="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-6 p-6"
      >
        <div
          class="grid w-full max-w-3xl gap-4 md:grid-cols-3"
        >
          <div
            v-for="(item, i) in [
              { icon: '📦', title: '重點一', desc: '描述內容' },
              { icon: '⚡', title: '重點二', desc: '描述內容' },
              { icon: '✨', title: '重點三', desc: '描述內容' },
            ]"
            :key="i"
            class="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 transition-all duration-500"
            :class="animState >= i + 1 ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
          >
            <div class="text-3xl">{{ item.icon }}</div>
            <div class="mt-2 font-bold text-white">{{ item.title }}</div>
            <div class="mt-1 text-sm text-slate-400">{{ item.desc }}</div>
          </div>
        </div>
      </div>

      <!-- ========== SUMMARY VIEW ========== -->
      <div
        v-if="stepData.view === 'summary'"
        class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-6"
      >
        <div
          class="transition-all duration-700"
          :class="animState >= 1 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
        >
          <div class="rounded-3xl border-2 border-emerald-500/50 bg-slate-900 p-8 text-center">
            <div class="text-6xl">🎉</div>
            <div class="mt-4 text-2xl font-bold text-white">學到了什麼</div>
            <div class="mt-2 text-slate-400">用一兩句話總結整份簡報</div>
          </div>
        </div>
      </div>
    </div>
  </InteractiveSlideTemplate>
</template>
