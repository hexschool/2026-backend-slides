<script setup lang="ts">
/**
 * Request/Response 分類測驗
 * 使用點選模式（tap-to-select）取代拖曳，更適合手機操作
 */
import { ref, computed, watch } from 'vue'

defineProps<{
  isMobile?: boolean
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

// 題目定義
interface DragItem {
  id: string
  text: string
  emoji: string
  correctZone: 'request' | 'response'
}

interface Question {
  id: string
  title: string
  subtitle: string
  items: DragItem[]
  zone1: { label: string; emoji: string; color: string }
  zone2: { label: string; emoji: string; color: string }
}

const questions: Question[] = [
  {
    id: 'q1',
    title: '分類大挑戰！',
    subtitle: '點選卡片，再點分類區放入 🎯',
    zone1: { label: 'Request', emoji: '📤', color: 'blue' },
    zone2: { label: 'Response', emoji: '📥', color: 'green' },
    items: [
      { id: 'item1', text: '瀏覽器發送網址', emoji: '🌐', correctZone: 'request' },
      { id: 'item2', text: '伺服器回傳 HTML', emoji: '📄', correctZone: 'response' },
      { id: 'item3', text: '點擊按鈕送出', emoji: '👆', correctZone: 'request' },
      { id: 'item4', text: '回傳 JSON 資料', emoji: '📦', correctZone: 'response' },
      { id: 'item5', text: '帶參數查詢', emoji: '🔍', correctZone: 'request' },
      { id: 'item6', text: '回傳狀態碼 200', emoji: '✅', correctZone: 'response' },
    ],
  },
]

// 當前題目索引
const currentQuestionIndex = ref(0)
const currentQuestion = computed(() => questions[currentQuestionIndex.value])

// 各區域的項目
const availableItems = ref<DragItem[]>([])
const zone1Items = ref<DragItem[]>([])
const zone2Items = ref<DragItem[]>([])

// 點選模式：選中的卡片
const selectedItem = ref<DragItem | null>(null)

// 狀態
const isSubmitted = ref(false)
const isAllCorrect = ref(false)
const showConfetti = ref(false)

// 初始化題目
function initQuestion() {
  availableItems.value = [...currentQuestion.value.items].sort(() => Math.random() - 0.5)
  zone1Items.value = []
  zone2Items.value = []
  selectedItem.value = null
  isSubmitted.value = false
  isAllCorrect.value = false
}

watch(currentQuestionIndex, () => {
  initQuestion()
}, { immediate: true })

// === 點選模式邏輯 ===
function selectItem(item: DragItem, fromZone: 'available' | 'zone1' | 'zone2') {
  if (isSubmitted.value) return

  // 如果點擊的是已選中的項目，取消選取
  if (selectedItem.value?.id === item.id) {
    selectedItem.value = null
    return
  }

  selectedItem.value = { ...item, _fromZone: fromZone } as DragItem & { _fromZone: string }
}

function placeInZone(targetZone: 'zone1' | 'zone2') {
  if (isSubmitted.value || !selectedItem.value) return

  const item = selectedItem.value as DragItem & { _fromZone?: string }
  const fromZone = item._fromZone || 'available'

  // 從原來的位置移除
  if (fromZone === 'available') {
    availableItems.value = availableItems.value.filter(i => i.id !== item.id)
  } else if (fromZone === 'zone1') {
    zone1Items.value = zone1Items.value.filter(i => i.id !== item.id)
  } else if (fromZone === 'zone2') {
    zone2Items.value = zone2Items.value.filter(i => i.id !== item.id)
  }

  // 加到目標區域
  const cleanItem = { id: item.id, text: item.text, emoji: item.emoji, correctZone: item.correctZone }
  if (targetZone === 'zone1') {
    zone1Items.value.push(cleanItem)
  } else {
    zone2Items.value.push(cleanItem)
  }

  selectedItem.value = null
}

function removeFromZone(item: DragItem, fromZone: 'zone1' | 'zone2') {
  if (isSubmitted.value) return

  // 如果沒有選中項目，點擊區域內的卡片會將它移回待分類區
  if (!selectedItem.value) {
    if (fromZone === 'zone1') {
      zone1Items.value = zone1Items.value.filter(i => i.id !== item.id)
    } else {
      zone2Items.value = zone2Items.value.filter(i => i.id !== item.id)
    }
    availableItems.value.push(item)
  }
}

// 檢查答案
function checkAnswer() {
  isSubmitted.value = true

  const zone1Correct = zone1Items.value.every(item => item.correctZone === 'request')
  const zone2Correct = zone2Items.value.every(item => item.correctZone === 'response')
  const allPlaced = availableItems.value.length === 0

  isAllCorrect.value = zone1Correct && zone2Correct && allPlaced

  if (isAllCorrect.value) {
    showConfetti.value = true
    setTimeout(() => {
      showConfetti.value = false
    }, 2000)
  }
}

// 取得項目狀態
function getItemStatus(item: DragItem, zone: 'request' | 'response' | 'available'): 'correct' | 'wrong' | 'pending' {
  if (!isSubmitted.value) return 'pending'
  if (zone === 'available') return 'wrong'
  return item.correctZone === zone ? 'correct' : 'wrong'
}

// 下一題或完成
function handleNext() {
  if (currentQuestionIndex.value < questions.length - 1) {
    currentQuestionIndex.value++
  } else {
    emit('complete')
  }
}

// 重試
function handleRetry() {
  initQuestion()
}

// 取得區域顏色
function getZoneColorClass(color: string, type: 'bg' | 'border' | 'text') {
  const colors: Record<string, Record<string, string>> = {
    blue: { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-600' },
    green: { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-600' },
    purple: { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-600' },
  }
  return colors[color]?.[type] || ''
}
</script>

<template>
  <div class="relative flex h-full flex-col overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-pink-50">
    <!-- 紙花效果 -->
    <div v-if="showConfetti" class="pointer-events-none absolute inset-0 z-50">
      <div v-for="i in 30" :key="i" class="confetti" :style="{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 0.5}s` }" />
    </div>

    <!-- Header -->
    <div class="relative z-10 px-4 py-4 md:px-6">
      <div class="mx-auto max-w-4xl">
        <!-- 進度和分數 -->
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- 進度條 -->
            <div class="flex gap-2">
              <div
                v-for="i in questions.length"
                :key="i"
                class="h-3 w-12 rounded-full transition-all duration-300"
                :class="
                  i - 1 < currentQuestionIndex
                    ? 'bg-emerald-400'
                    : i - 1 === currentQuestionIndex
                      ? 'bg-indigo-500'
                      : 'bg-gray-200'
                "
              />
            </div>
            <span class="text-sm font-bold text-gray-500">{{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
          </div>

        </div>

        <!-- 題目標題 -->
        <div class="text-center">
          <h1 class="text-2xl font-black text-gray-800 md:text-3xl">
            {{ currentQuestion.title }}
          </h1>
          <p class="mt-1 text-gray-500">{{ currentQuestion.subtitle }}</p>
        </div>
      </div>
    </div>

    <!-- 主要遊戲區 -->
    <div class="flex flex-1 flex-col gap-4 overflow-auto px-4 pb-4 md:px-6">
      <div class="mx-auto w-full max-w-4xl flex-1">
        <!-- 待分類卡片區 -->
        <div class="mb-6">
          <div class="mb-2 flex items-center gap-2">
            <span class="text-2xl">🎴</span>
            <span class="font-bold text-gray-700">
              {{ selectedItem ? '點選下方區域放入' : '點選卡片' }}
            </span>
            <span class="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-bold text-gray-600">
              剩 {{ availableItems.length }} 張
            </span>
          </div>
          <div
            class="flex min-h-[80px] flex-wrap gap-3 rounded-2xl border-3 border-dashed border-gray-300 bg-white/50 p-4"
            :class="{ 'border-amber-400 bg-amber-50/50': availableItems.length > 0 && isSubmitted }"
          >
            <button
              v-for="item in availableItems"
              :key="item.id"
              :disabled="isSubmitted"
              class="card-item rounded-xl border-2 px-4 py-3 shadow-md transition-all"
              :class="[
                selectedItem?.id === item.id
                  ? 'border-indigo-400 bg-indigo-100 shadow-lg shadow-indigo-200 -translate-y-1'
                  : 'border-gray-200 bg-white hover:-translate-y-1 hover:shadow-lg',
                isSubmitted ? 'border-red-300 bg-red-50 cursor-not-allowed' : 'cursor-pointer',
              ]"
              @click="selectItem(item, 'available')"
            >
              <span class="mr-2 text-lg">{{ item.emoji }}</span>
              <span class="font-medium text-gray-700">{{ item.text }}</span>
            </button>
            <div v-if="availableItems.length === 0" class="flex w-full items-center justify-center py-4 text-gray-400">
              所有卡片已分類完畢
            </div>
          </div>
        </div>

        <!-- 分類區域 -->
        <div class="grid gap-4 md:grid-cols-2">
          <!-- Zone 1 (Request) -->
          <div
            class="rounded-2xl border-3 p-4 transition-all"
            :class="[
              getZoneColorClass(currentQuestion.zone1.color, 'bg'),
              getZoneColorClass(currentQuestion.zone1.color, 'border'),
              selectedItem && !isSubmitted ? 'ring-2 ring-indigo-300 ring-offset-2' : '',
            ]"
          >
            <div class="mb-3 flex items-center gap-2">
              <span class="text-2xl">{{ currentQuestion.zone1.emoji }}</span>
              <span class="text-lg font-bold" :class="getZoneColorClass(currentQuestion.zone1.color, 'text')">
                {{ currentQuestion.zone1.label }}
              </span>
            </div>
            <!-- 可點擊的放置區 -->
            <button
              type="button"
              class="zone-drop flex min-h-[120px] w-full flex-wrap gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white/60 p-3 text-left transition-all"
              :class="[
                selectedItem && !isSubmitted ? 'hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer' : '',
              ]"
              :disabled="isSubmitted || !selectedItem"
              @click="placeInZone('zone1')"
            >
              <button
                v-for="item in zone1Items"
                :key="item.id"
                type="button"
                class="card-item rounded-xl border-2 px-4 py-3 shadow-sm transition-all"
                :class="[
                  getItemStatus(item, 'request') === 'correct' ? 'border-emerald-400 bg-emerald-50' :
                  getItemStatus(item, 'request') === 'wrong' ? 'border-red-400 bg-red-50 shake' :
                  selectedItem?.id === item.id ? 'border-indigo-400 bg-indigo-100' :
                  'border-gray-200 bg-white',
                  !isSubmitted ? 'cursor-pointer hover:border-red-300' : ''
                ]"
                :disabled="isSubmitted"
                @click.stop="selectedItem ? selectItem(item, 'zone1') : removeFromZone(item, 'zone1')"
              >
                <span class="mr-2 text-lg">{{ item.emoji }}</span>
                <span class="font-medium text-gray-700">{{ item.text }}</span>
                <span v-if="isSubmitted" class="ml-2">
                  {{ getItemStatus(item, 'request') === 'correct' ? '✓' : '✗' }}
                </span>
              </button>
              <div v-if="zone1Items.length === 0 && selectedItem" class="flex w-full items-center justify-center py-6 text-blue-400">
                點此放入
              </div>
            </button>
          </div>

          <!-- Zone 2 (Response) -->
          <div
            class="rounded-2xl border-3 p-4 transition-all"
            :class="[
              getZoneColorClass(currentQuestion.zone2.color, 'bg'),
              getZoneColorClass(currentQuestion.zone2.color, 'border'),
              selectedItem && !isSubmitted ? 'ring-2 ring-indigo-300 ring-offset-2' : '',
            ]"
          >
            <div class="mb-3 flex items-center gap-2">
              <span class="text-2xl">{{ currentQuestion.zone2.emoji }}</span>
              <span class="text-lg font-bold" :class="getZoneColorClass(currentQuestion.zone2.color, 'text')">
                {{ currentQuestion.zone2.label }}
              </span>
            </div>
            <!-- 可點擊的放置區 -->
            <button
              type="button"
              class="zone-drop flex min-h-[120px] w-full flex-wrap gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white/60 p-3 text-left transition-all"
              :class="[
                selectedItem && !isSubmitted ? 'hover:border-emerald-400 hover:bg-emerald-50/50 cursor-pointer' : '',
              ]"
              :disabled="isSubmitted || !selectedItem"
              @click="placeInZone('zone2')"
            >
              <button
                v-for="item in zone2Items"
                :key="item.id"
                type="button"
                class="card-item rounded-xl border-2 px-4 py-3 shadow-sm transition-all"
                :class="[
                  getItemStatus(item, 'response') === 'correct' ? 'border-emerald-400 bg-emerald-50' :
                  getItemStatus(item, 'response') === 'wrong' ? 'border-red-400 bg-red-50 shake' :
                  selectedItem?.id === item.id ? 'border-indigo-400 bg-indigo-100' :
                  'border-gray-200 bg-white',
                  !isSubmitted ? 'cursor-pointer hover:border-red-300' : ''
                ]"
                :disabled="isSubmitted"
                @click.stop="selectedItem ? selectItem(item, 'zone2') : removeFromZone(item, 'zone2')"
              >
                <span class="mr-2 text-lg">{{ item.emoji }}</span>
                <span class="font-medium text-gray-700">{{ item.text }}</span>
                <span v-if="isSubmitted" class="ml-2">
                  {{ getItemStatus(item, 'response') === 'correct' ? '✓' : '✗' }}
                </span>
              </button>
              <div v-if="zone2Items.length === 0 && selectedItem" class="flex w-full items-center justify-center py-6 text-emerald-400">
                點此放入
              </div>
            </button>
          </div>
        </div>

        <!-- 結果提示 -->
        <div
          v-if="isSubmitted"
          class="mt-4 rounded-2xl p-4 text-center"
          :class="isAllCorrect ? 'bg-emerald-100' : 'bg-red-100'"
        >
          <div v-if="isAllCorrect" class="flex flex-col items-center gap-2">
            <span class="text-4xl">🎉</span>
            <p class="text-xl font-bold text-emerald-600">太棒了！全部正確！</p>
          </div>
          <div v-else class="flex flex-col items-center gap-2">
            <span class="text-4xl">🤔</span>
            <p class="text-xl font-bold text-red-600">有些卡片放錯位置囉</p>
            <p class="text-red-500">看看標記 ✗ 的卡片，再試一次！</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="border-t border-gray-200 bg-white/80 px-4 py-4 backdrop-blur-sm md:px-6">
      <div class="mx-auto flex max-w-4xl items-center justify-between">
        <div class="text-sm text-gray-500">
          <template v-if="!isSubmitted">
            把所有卡片放到正確位置後，點擊「檢查答案」
          </template>
          <template v-else-if="isAllCorrect">
            <span class="font-bold text-emerald-500">完美！</span>
          </template>
          <template v-else>
            <span class="text-amber-500">再試一次？</span>
          </template>
        </div>

        <div class="flex gap-3">
          <button
            v-if="isSubmitted && !isAllCorrect"
            type="button"
            class="flex items-center gap-2 rounded-full bg-gray-100 px-6 py-3 font-bold text-gray-600 transition-all hover:bg-gray-200"
            @click="handleRetry"
          >
            <span>🔄</span>
            <span>重試</span>
          </button>

          <button
            v-if="!isSubmitted"
            type="button"
            class="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="availableItems.length > 0"
            @click="checkAnswer"
          >
            <span>✨</span>
            <span>檢查答案</span>
          </button>

          <button
            v-else-if="isAllCorrect"
            type="button"
            class="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl"
            @click="handleNext"
          >
            <span>{{ currentQuestionIndex < questions.length - 1 ? '下一題 →' : '完成 🎊' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.border-3 {
  border-width: 3px;
}

.card-item {
  user-select: none;
}

/* 紙花動畫 */
.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #f97316, #eab308, #22c55e, #3b82f6, #a855f7);
  animation: confetti-fall 2s ease-out forwards;
}

.confetti:nth-child(odd) {
  background: #f97316;
  border-radius: 50%;
}

.confetti:nth-child(even) {
  background: #3b82f6;
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
  background: #a855f7;
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
.card-item,
.zone-drop {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  touch-action: manipulation;
}

.card-item:active:not(:disabled) {
  transform: scale(0.95);
}

.zone-drop:active:not(:disabled) {
  transform: scale(0.99);
}
</style>
