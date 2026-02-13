<script setup lang="ts">
/**
 * 前後端資料庫資訊流填空遊戲
 * 使用點選模式（tap-to-select）
 */
import { ref, computed } from 'vue'

defineProps<{
  isMobile?: boolean
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

// === 填空遊戲狀態 ===
interface DragItem {
  id: string
  text: string
  emoji: string
}

const isSubmitted = ref(false)
const isAllCorrect = ref(false)
const showConfetti = ref(false)

// 選中的元素（點選模式）
const selectedItem = ref<DragItem | null>(null)

const availableItems: DragItem[] = [
  { id: 'frontend', text: '前端', emoji: '🖥️' },
  { id: 'backend', text: '後端', emoji: '⚙️' },
  { id: 'database', text: '資料庫', emoji: '🗄️' },
]

// 五個空位的狀態（前端 → 後端 → 資料庫 → 後端 → 前端）
const slots = ref<(DragItem | null)[]>([null, null, null, null, null])

// 正確答案
const correctAnswers = ['frontend', 'backend', 'database', 'backend', 'frontend']

// 每個空位的提示文字
const slotHints = [
  '發送請求',
  '處理請求',
  '查詢資料',
  '回傳資料',
  '顯示結果',
]

const allSlotsFilled = computed(() => {
  return slots.value.every(slot => slot !== null)
})

// === 點選模式邏輯 ===
function selectItem(item: DragItem) {
  if (isSubmitted.value) return
  selectedItem.value = item
}

function placeInSlot(slotIndex: number) {
  if (isSubmitted.value) return

  if (selectedItem.value) {
    // 放入選中的元素
    slots.value[slotIndex] = { ...selectedItem.value }
    selectedItem.value = null
  } else if (slots.value[slotIndex]) {
    // 如果沒有選中元素但空位有東西，點擊可以清除
    slots.value[slotIndex] = null
  }
}

function checkAnswer() {
  isSubmitted.value = true

  const userAnswers = slots.value.map(slot => slot?.id)
  const allCorrect = userAnswers.every((answer, index) => answer === correctAnswers[index])
  isAllCorrect.value = allCorrect

  if (allCorrect) {
    showConfetti.value = true
    setTimeout(() => {
      showConfetti.value = false
    }, 2000)
  }
}

function getSlotStatus(slotIndex: number): 'correct' | 'wrong' | 'empty' | 'pending' {
  const slot = slots.value[slotIndex]
  if (!isSubmitted.value) {
    return slot === null ? 'empty' : 'pending'
  }
  if (slot === null) return 'empty'
  return slot.id === correctAnswers[slotIndex] ? 'correct' : 'wrong'
}

function handleRetry() {
  slots.value = [null, null, null, null, null]
  selectedItem.value = null
  isSubmitted.value = false
  isAllCorrect.value = false
}

function handleComplete() {
  emit('complete')
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900">
    <!-- 紙花效果 -->
    <div v-if="showConfetti" class="pointer-events-none absolute inset-0 z-50">
      <div v-for="i in 30" :key="i" class="confetti" :style="{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 0.5}s` }" />
    </div>

    <!-- Header -->
    <div class="relative z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur-xl md:px-6 md:py-4">
      <div class="min-w-0 flex-1">
        <h1 class="flex items-center gap-2 text-lg font-bold text-white md:gap-3 md:text-2xl">
          <span class="text-2xl md:text-3xl">🔄</span>
          <span class="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">前後端資料流</span>
        </h1>
      </div>
    </div>

    <!-- Main Content -->
    <div class="relative flex flex-1 flex-col overflow-y-auto p-4 md:p-6">
      <!-- Background -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="animate-float-slow absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div class="animate-float-slower absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-pink-500/10 blur-3xl"></div>
      </div>

      <div class="relative z-10 mx-auto w-full max-w-4xl">
        <!-- 說明區 -->
        <div class="mb-6 rounded-2xl border border-purple-500/30 bg-slate-900/80 p-4 text-center">
          <h2 class="text-xl font-bold text-white md:text-2xl">當使用者要「取得教練列表」時...</h2>
          <p class="mt-2 text-purple-300">資料會經過哪些地方？把元素放到正確的位置！</p>
        </div>

        <!-- 選擇元素區 -->
        <div class="mb-6 rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
          <p class="mb-3 text-center text-sm font-bold text-slate-400">
            🧩 {{ selectedItem ? '現在點擊下方空位放入' : '點選元素，再點空位放入（可重複使用）' }}
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <button
              v-for="item in availableItems"
              :key="item.id"
              :disabled="isSubmitted"
              class="tap-item flex items-center gap-2 rounded-xl border-2 px-4 py-3 transition-all"
              :class="[
                selectedItem?.id === item.id
                  ? 'border-purple-400 bg-purple-500/30 shadow-lg shadow-purple-500/20'
                  : 'border-dashed border-slate-600 bg-slate-800 hover:border-purple-400 hover:shadow-md',
                isSubmitted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              ]"
              @click="selectItem(item)"
            >
              <span class="text-2xl">{{ item.emoji }}</span>
              <span class="font-bold text-white">{{ item.text }}</span>
            </button>
          </div>
        </div>

        <!-- 流程填空 - 垂直排列適合手機 -->
        <div class="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 md:p-6">
          <p class="mb-4 text-center text-sm text-slate-400">資料流向（由上到下）</p>

          <div class="flex flex-col items-center gap-2">
            <!-- Slot 1: 前端發送請求 -->
            <div class="flex w-full max-w-xs flex-col items-center">
              <button
                class="slot-btn w-full min-h-[60px] rounded-xl border-2 border-dashed p-2 transition-all"
                :class="[
                  getSlotStatus(0) === 'correct' ? 'border-emerald-400 bg-emerald-500/20' :
                  getSlotStatus(0) === 'wrong' ? 'border-red-400 bg-red-500/20 shake' :
                  getSlotStatus(0) === 'pending' ? 'border-purple-400 bg-purple-500/20' :
                  'border-slate-600 bg-slate-800',
                  selectedItem && !isSubmitted ? 'hover:border-purple-300 hover:bg-purple-500/10 cursor-pointer' : '',
                  !selectedItem && slots[0] && !isSubmitted ? 'hover:border-red-300 cursor-pointer' : ''
                ]"
                :disabled="isSubmitted"
                @click="placeInSlot(0)"
              >
                <div v-if="slots[0]" class="flex items-center justify-center gap-2 rounded-lg bg-slate-700 px-3 py-2">
                  <span class="text-xl">{{ slots[0].emoji }}</span>
                  <span class="font-bold text-white">{{ slots[0].text }}</span>
                </div>
                <div v-else class="flex h-full min-h-[44px] items-center justify-center text-slate-500">
                  <span class="text-xs">{{ slotHints[0] }}</span>
                </div>
              </button>
              <span class="mt-1 text-xs text-purple-300">👆 使用者點擊按鈕</span>
            </div>

            <span class="text-2xl text-purple-400">↓</span>

            <!-- Slot 2: 後端處理 -->
            <div class="flex w-full max-w-xs flex-col items-center">
              <button
                class="slot-btn w-full min-h-[60px] rounded-xl border-2 border-dashed p-2 transition-all"
                :class="[
                  getSlotStatus(1) === 'correct' ? 'border-emerald-400 bg-emerald-500/20' :
                  getSlotStatus(1) === 'wrong' ? 'border-red-400 bg-red-500/20 shake' :
                  getSlotStatus(1) === 'pending' ? 'border-purple-400 bg-purple-500/20' :
                  'border-slate-600 bg-slate-800',
                  selectedItem && !isSubmitted ? 'hover:border-purple-300 hover:bg-purple-500/10 cursor-pointer' : '',
                  !selectedItem && slots[1] && !isSubmitted ? 'hover:border-red-300 cursor-pointer' : ''
                ]"
                :disabled="isSubmitted"
                @click="placeInSlot(1)"
              >
                <div v-if="slots[1]" class="flex items-center justify-center gap-2 rounded-lg bg-slate-700 px-3 py-2">
                  <span class="text-xl">{{ slots[1].emoji }}</span>
                  <span class="font-bold text-white">{{ slots[1].text }}</span>
                </div>
                <div v-else class="flex h-full min-h-[44px] items-center justify-center text-slate-500">
                  <span class="text-xs">{{ slotHints[1] }}</span>
                </div>
              </button>
              <span class="mt-1 text-xs text-purple-300">🔄 收到請求，要去拿資料</span>
            </div>

            <span class="text-2xl text-purple-400">↓</span>

            <!-- Slot 3: 資料庫 -->
            <div class="flex w-full max-w-xs flex-col items-center">
              <button
                class="slot-btn w-full min-h-[60px] rounded-xl border-2 border-dashed p-2 transition-all"
                :class="[
                  getSlotStatus(2) === 'correct' ? 'border-emerald-400 bg-emerald-500/20' :
                  getSlotStatus(2) === 'wrong' ? 'border-red-400 bg-red-500/20 shake' :
                  getSlotStatus(2) === 'pending' ? 'border-purple-400 bg-purple-500/20' :
                  'border-slate-600 bg-slate-800',
                  selectedItem && !isSubmitted ? 'hover:border-purple-300 hover:bg-purple-500/10 cursor-pointer' : '',
                  !selectedItem && slots[2] && !isSubmitted ? 'hover:border-red-300 cursor-pointer' : ''
                ]"
                :disabled="isSubmitted"
                @click="placeInSlot(2)"
              >
                <div v-if="slots[2]" class="flex items-center justify-center gap-2 rounded-lg bg-slate-700 px-3 py-2">
                  <span class="text-xl">{{ slots[2].emoji }}</span>
                  <span class="font-bold text-white">{{ slots[2].text }}</span>
                </div>
                <div v-else class="flex h-full min-h-[44px] items-center justify-center text-slate-500">
                  <span class="text-xs">{{ slotHints[2] }}</span>
                </div>
              </button>
              <span class="mt-1 text-xs text-purple-300">📋 查詢教練列表</span>
            </div>

            <span class="text-2xl text-purple-400">↓</span>

            <!-- Slot 4: 後端回傳 -->
            <div class="flex w-full max-w-xs flex-col items-center">
              <button
                class="slot-btn w-full min-h-[60px] rounded-xl border-2 border-dashed p-2 transition-all"
                :class="[
                  getSlotStatus(3) === 'correct' ? 'border-emerald-400 bg-emerald-500/20' :
                  getSlotStatus(3) === 'wrong' ? 'border-red-400 bg-red-500/20 shake' :
                  getSlotStatus(3) === 'pending' ? 'border-purple-400 bg-purple-500/20' :
                  'border-slate-600 bg-slate-800',
                  selectedItem && !isSubmitted ? 'hover:border-purple-300 hover:bg-purple-500/10 cursor-pointer' : '',
                  !selectedItem && slots[3] && !isSubmitted ? 'hover:border-red-300 cursor-pointer' : ''
                ]"
                :disabled="isSubmitted"
                @click="placeInSlot(3)"
              >
                <div v-if="slots[3]" class="flex items-center justify-center gap-2 rounded-lg bg-slate-700 px-3 py-2">
                  <span class="text-xl">{{ slots[3].emoji }}</span>
                  <span class="font-bold text-white">{{ slots[3].text }}</span>
                </div>
                <div v-else class="flex h-full min-h-[44px] items-center justify-center text-slate-500">
                  <span class="text-xs">{{ slotHints[3] }}</span>
                </div>
              </button>
              <span class="mt-1 text-xs text-purple-300">📦 把資料打包成 JSON</span>
            </div>

            <span class="text-2xl text-purple-400">↓</span>

            <!-- Slot 5: 前端顯示 -->
            <div class="flex w-full max-w-xs flex-col items-center">
              <button
                class="slot-btn w-full min-h-[60px] rounded-xl border-2 border-dashed p-2 transition-all"
                :class="[
                  getSlotStatus(4) === 'correct' ? 'border-emerald-400 bg-emerald-500/20' :
                  getSlotStatus(4) === 'wrong' ? 'border-red-400 bg-red-500/20 shake' :
                  getSlotStatus(4) === 'pending' ? 'border-purple-400 bg-purple-500/20' :
                  'border-slate-600 bg-slate-800',
                  selectedItem && !isSubmitted ? 'hover:border-purple-300 hover:bg-purple-500/10 cursor-pointer' : '',
                  !selectedItem && slots[4] && !isSubmitted ? 'hover:border-red-300 cursor-pointer' : ''
                ]"
                :disabled="isSubmitted"
                @click="placeInSlot(4)"
              >
                <div v-if="slots[4]" class="flex items-center justify-center gap-2 rounded-lg bg-slate-700 px-3 py-2">
                  <span class="text-xl">{{ slots[4].emoji }}</span>
                  <span class="font-bold text-white">{{ slots[4].text }}</span>
                </div>
                <div v-else class="flex h-full min-h-[44px] items-center justify-center text-slate-500">
                  <span class="text-xs">{{ slotHints[4] }}</span>
                </div>
              </button>
              <span class="mt-1 text-xs text-purple-300">🎨 顯示教練卡片</span>
            </div>
          </div>
        </div>

        <!-- 結果提示 -->
        <div
          v-if="isSubmitted"
          class="mt-4 rounded-2xl p-4 text-center"
          :class="isAllCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'"
        >
          <div v-if="isAllCorrect" class="flex flex-col items-center gap-2">
            <span class="text-4xl">🎉</span>
            <p class="text-xl font-bold text-emerald-400">完美！資料流向全對！</p>
            <p class="mt-2 text-sm text-slate-300">
              前端 → 後端 → 資料庫 → 後端 → 前端<br>
              這就是完整的資料傳遞流程！
            </p>
          </div>
          <div v-else class="flex flex-col items-center gap-2">
            <span class="text-4xl">🤔</span>
            <p class="text-xl font-bold text-red-400">有些順序不太對喔</p>
            <p class="text-red-300">想想看資料是怎麼流動的？</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Controls -->
    <div class="relative z-20 flex items-center justify-between gap-3 border-t border-white/10 bg-slate-900/80 px-4 pb-6 pt-4 backdrop-blur-xl md:px-6 md:py-4">
      <div class="text-sm text-slate-400">
        <template v-if="!isSubmitted">填滿所有空位後，點擊檢查答案</template>
        <template v-else-if="isAllCorrect">太棒了！</template>
        <template v-else>再試一次？</template>
      </div>

      <div class="flex gap-3">
        <button
          v-if="isSubmitted && !isAllCorrect"
          class="flex items-center gap-2 rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-600 md:px-6 md:py-3"
          @click="handleRetry"
        >
          <span>🔄</span>
          <span>重試</span>
        </button>

        <button
          v-if="!isSubmitted"
          class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-3"
          :disabled="!allSlotsFilled"
          @click="checkAnswer"
        >
          <span>✨</span>
          <span>檢查答案</span>
        </button>

        <button
          v-else-if="isAllCorrect"
          class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl md:px-6 md:py-3"
          @click="handleComplete"
        >
          <span>完成學習</span>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
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

/* 紙花動畫 */
.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  animation: confetti-fall 2s ease-out forwards;
}

.confetti:nth-child(odd) {
  background: #a855f7;
  border-radius: 50%;
}

.confetti:nth-child(even) {
  background: #ec4899;
}

.confetti:nth-child(3n) {
  background: #22c55e;
  transform: rotate(45deg);
}

.confetti:nth-child(4n) {
  background: #eab308;
  border-radius: 2px;
}

.confetti:nth-child(5n) {
  background: #3b82f6;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* 錯誤搖晃動畫 */
.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}

/* 點選模式元素樣式 */
.tap-item,
.slot-btn {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  touch-action: manipulation;
}

.tap-item:active:not(:disabled) {
  transform: scale(0.95);
}

.slot-btn:active:not(:disabled) {
  transform: scale(0.98);
}
</style>
