<script setup lang="ts">
/**
 * 資料表設計入門互動簡報 (1-12 關)
 * 從 Excel 到資料庫的正規化概念
 *
 * 獨立出來的簡報，專注於資料表設計基礎
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
type StepView =
  | 'intro'
  | 'anim_master' | 'anim_pain' | 'anim_error' | 'anim_split' | 'anim_moving' | 'anim_codes' | 'anim_link' | 'anim_sync'
  | 'pk_concept' | 'type_concept'

type Step = {
  id: number
  view: StepView
  title: string
  desc: string
}

const STEPS: Step[] = [
  // === 第一章：從 Excel 開始 (1-6) ===
  { id: 1, view: 'intro', title: '認識資料庫', desc: '我們用一間電商公司的訂單資料來學習資料庫。資料庫就像一個超級大書包，Excel 只是裡面的小鉛筆盒。' },
  { id: 2, view: 'anim_master', title: '觀察這張表', desc: '這是某間電商公司的訂單管理表。仔細看：台積電出現了 3 次，鴻海出現了 2 次。每次下單都要重複輸入公司名稱和電話...這樣真的好嗎？' },
  { id: 3, view: 'pk_concept', title: '先學一個概念：主鍵', desc: '在繼續之前，先認識一個重要概念：每間公司都需要唯一的編號，就像身分證一樣。這個號碼叫「主鍵」，絕對不能重複。' },
  { id: 4, view: 'type_concept', title: '再學一個：資料型態', desc: '金額欄位只能寫數字，寫文字會被電腦擋下來。資料庫很嚴格，規定是數字就不能寫字，這是為了保護資料的正確性。' },
  { id: 5, view: 'anim_pain', title: '問題一：重複輸入', desc: '回到這張表，你看台積電下 3 筆訂單，名字就要寫 3 次、電話寫 3 次。如果下 100 筆呢？浪費時間又容易錯！' },
  { id: 6, view: 'anim_error', title: '問題二：改資料災難', desc: '如果台積電改電話，你要在每一筆訂單裡一個一個改嗎？漏改一個資料就會不一致，這種維護方式太可怕了。' },

  // === 第二章：正規化動畫 (7-11) ===
  { id: 7, view: 'anim_split', title: '剪刀拿出來！', desc: '我們把表格切開：左邊專門管「客戶」，右邊專門管「訂單」。專業術語叫「正規化」，其實就是「分類整理」。' },
  { id: 8, view: 'anim_moving', title: '搬家大行動', desc: '把姓名電話搬到左邊，每間公司只要寫一次就好。看！右邊的公司資料都移到左邊了，右邊的訂單變乾淨了。' },
  { id: 9, view: 'anim_codes', title: '只留暗號', desc: '訂單表裡只留「C01」這個代號，乾淨又清爽。這個 C01 代號，就是連回客戶表的「外來鍵」。' },
  { id: 10, view: 'anim_link', title: '神奇傳送門', desc: '電腦看到 C01，就會自動連回客戶表找到台積電。這就是為什麼它叫「關聯式」資料庫。' },
  { id: 11, view: 'anim_sync', title: '改一次，全部變', desc: '現在只要改一次名字，所有訂單都會自動對應到新名字！這就是資料庫最強大的地方：效率與正確。' },
]

// 混合大表（正規化前的資料）
const masterData = [
  { name: '台積電', phone: '03-578-1234', prod: '晶圓', amt: 500000 },
  { name: '台積電', phone: '03-578-1234', prod: '測試', amt: 200000 },
  { name: '台積電', phone: '03-578-1234', prod: '設備', amt: 300000 },
  { name: '鴻海', phone: '02-2268-5678', prod: '設備', amt: 800000 },
  { name: '鴻海', phone: '02-2268-5678', prod: '線材', amt: 50000 },
]

// === 狀態 ===
const currentStep = ref(0)
const isTransitioning = ref(false)
const mounted = ref(false)
const animState = ref(0)

const stepData = computed(() => STEPS[currentStep.value])

onMounted(() => {
  mounted.value = true
  triggerStepAnimation()
})

watch(currentStep, () => {
  isTransitioning.value = true
  animState.value = 0

  setTimeout(() => {
    isTransitioning.value = false
    triggerStepAnimation()
  }, 100)
})

function triggerStepAnimation() {
  const view = stepData.value.view

  // 基礎動畫：大部分 view 都用這個
  setTimeout(() => { animState.value = 1 }, 200)
  setTimeout(() => { animState.value = 2 }, 500)
  setTimeout(() => { animState.value = 3 }, 800)

  // 特殊動畫
  if (view === 'anim_split' || view === 'anim_moving') {
    setTimeout(() => { animState.value = 4 }, 1200)
    setTimeout(() => { animState.value = 5 }, 1600)
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
    title="資料表設計入門"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="sky"
    @prev="prevStep"
    @next="nextStep"
    @complete="handleComplete"
  >
    <!-- 自訂 Header Icon -->
    <template #icon>
      <div class="relative">
        <span class="text-2xl md:text-3xl">📊</span>
        <div class="absolute -right-1 -top-1 h-2 w-2 animate-pulse-slow rounded-full bg-sky-400"></div>
      </div>
    </template>

    <!-- 主要內容區 -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- 背景動畫 -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="animate-float-slow absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"></div>
        <div class="animate-float-slower absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-sky-500/10 blur-3xl"></div>
      </div>

      <!-- ========== INTRO VIEW ========== -->
      <div v-if="stepData.view === 'intro'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-6 md:p-6">
        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- 主視覺 -->
          <div
            class="transition-all duration-700"
            :class="animState >= 1 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'"
          >
            <div class="relative">
              <div class="absolute -inset-6 rounded-3xl bg-gradient-to-r from-sky-500/20 to-sky-500/20 blur-2xl"></div>
              <div class="relative overflow-hidden rounded-3xl border-2 border-sky-500/50 bg-slate-900 p-8">
                <div class="flex items-center justify-center gap-6">
                  <div class="text-center">
                    <div class="text-6xl">📑</div>
                    <div class="mt-2 text-sm text-slate-400">Excel</div>
                    <div class="text-xs text-slate-500">鉛筆盒</div>
                  </div>
                  <div class="text-3xl text-slate-600">→</div>
                  <div class="text-center">
                    <div class="text-6xl">🗄️</div>
                    <div class="mt-2 text-sm text-sky-400">資料庫</div>
                    <div class="text-xs text-sky-500">大書包</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 說明文字 -->
          <div
            class="max-w-md text-center transition-all delay-300 duration-700"
            :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <p class="text-slate-300">
              今天我們要學習<span class="font-bold text-sky-400">資料表設計</span>的基礎概念
            </p>
            <p class="mt-2 text-sm text-slate-400">
              從 Excel 的問題出發，了解為什麼需要資料庫
            </p>
          </div>

          <!-- 學習目標 -->
          <div
            class="w-full max-w-md transition-all delay-500 duration-700"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
              <div class="mb-3 text-sm font-bold text-sky-400">📚 這堂課你會學到：</div>
              <div class="space-y-2 text-sm text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="text-amber-400">🔑</span>
                  <span>主鍵 (Primary Key)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-purple-400">🔗</span>
                  <span>外來鍵 (Foreign Key)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-emerald-400">✂️</span>
                  <span>正規化 (Normalization)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== ANIM MASTER/PAIN/ERROR/SPLIT/MOVING/CODES/LINK/SYNC + PK_CONCEPT/TYPE_CONCEPT VIEW (統一架構) ========== -->
      <div v-if="stepData.view === 'anim_master' || stepData.view === 'anim_pain' || stepData.view === 'anim_error' || stepData.view === 'anim_split' || stepData.view === 'anim_moving' || stepData.view === 'anim_codes' || stepData.view === 'anim_link' || stepData.view === 'anim_sync' || stepData.view === 'pk_concept' || stepData.view === 'type_concept'" class="relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-4 py-6 md:p-6">
        <div class="relative z-10 flex w-full max-w-4xl flex-col items-center gap-4">

          <!-- ★★★ 表格數量指示器（固定在上方） ★★★ -->
          <div class="sticky top-0 z-20 w-full rounded-xl border border-slate-700 bg-slate-900/95 p-3 backdrop-blur">
            <div class="flex items-center justify-between">
              <div class="text-xs text-slate-400">目前的資料表：</div>
              <div class="flex items-center gap-3">
                <!-- 原始大表（Step 2-8 顯示，之後隱藏） -->
                <div v-if="stepData.view === 'anim_master' || stepData.view === 'anim_pain' || stepData.view === 'anim_error' || stepData.view === 'anim_split' || stepData.view === 'pk_concept' || stepData.view === 'type_concept'" class="flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5">
                  <span class="text-base">📊</span>
                  <span class="text-sm font-medium text-slate-300">電商訂單總表</span>
                  <span class="rounded bg-rose-500/20 px-1.5 py-0.5 text-xs text-rose-400">混在一起</span>
                </div>
                <!-- 客戶表（Step 9 開始出現） -->
                <div v-if="stepData.view === 'anim_moving' || stepData.view === 'anim_codes' || stepData.view === 'anim_link' || stepData.view === 'anim_sync'" class="flex items-center gap-1.5 rounded-lg border-2 border-sky-500/50 bg-sky-500/10 px-3 py-1.5">
                  <span class="text-base">👥</span>
                  <span class="text-sm font-medium text-sky-400">客戶表</span>
                </div>
                <!-- 訂單表（Step 10 開始出現） -->
                <div v-if="stepData.view === 'anim_codes' || stepData.view === 'anim_link' || stepData.view === 'anim_sync'" class="flex items-center gap-1.5 rounded-lg border-2 border-purple-500/50 bg-purple-500/10 px-3 py-1.5">
                  <span class="text-base">📦</span>
                  <span class="text-sm font-medium text-purple-400">訂單表</span>
                </div>
                <!-- 表格數量 -->
                <div class="ml-2 flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1">
                  <span class="text-lg font-bold" :class="stepData.view === 'anim_moving' || stepData.view === 'anim_codes' || stepData.view === 'anim_link' || stepData.view === 'anim_sync' ? 'text-emerald-400' : 'text-rose-400'">
                    {{ stepData.view === 'anim_moving' || stepData.view === 'anim_codes' || stepData.view === 'anim_link' || stepData.view === 'anim_sync' ? '2' : '1' }}
                  </span>
                  <span class="text-xs text-slate-400">張表</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ===== Step 2-7: anim_master/pain/error/pk_concept/type_concept 展示問題 ===== -->
          <template v-if="stepData.view === 'anim_master' || stepData.view === 'anim_pain' || stepData.view === 'anim_error' || stepData.view === 'pk_concept' || stepData.view === 'type_concept'">
            <!-- 標題區塊 -->
            <div class="w-full text-center transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'">
              <div v-if="stepData.view === 'anim_master'" class="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2">
                <span class="text-xl">📊</span>
                <span class="font-bold text-slate-200">這是一間電商公司的 Excel 大表</span>
              </div>
              <div v-else-if="stepData.view === 'pk_concept'" class="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-2">
                <span class="text-xl">🔑</span>
                <span class="font-bold text-amber-300">主鍵 (Primary Key)：每筆資料的身分證</span>
              </div>
              <div v-else-if="stepData.view === 'type_concept'" class="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-4 py-2">
                <span class="text-xl">🔢</span>
                <span class="font-bold text-sky-300">資料型態 (Data Type)：欄位的規矩</span>
              </div>
              <div v-else-if="stepData.view === 'anim_pain'" class="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-2">
                <span class="text-xl">😫</span>
                <span class="font-bold text-amber-300">問題一：重複輸入好累</span>
              </div>
              <div v-else-if="stepData.view === 'anim_error'" class="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2">
                <span class="text-xl">💥</span>
                <span class="font-bold text-red-300">問題二：改資料會出錯</span>
              </div>
            </div>

            <!-- Excel 大表 -->
            <div class="w-full transition-all duration-700" :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'">
              <div class="overflow-hidden rounded-xl border-2 bg-slate-900" :class="[
                stepData.view === 'anim_master' ? 'border-slate-600' :
                stepData.view === 'pk_concept' ? 'border-amber-500/50' :
                stepData.view === 'type_concept' ? 'border-sky-500/50' :
                stepData.view === 'anim_pain' ? 'border-amber-500/50' :
                'border-red-500/50'
              ]">
                <!-- Excel 風格標題列 -->
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800/50 px-3 py-2">
                  <div class="flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <span class="ml-2 text-xs text-slate-500">電商訂單總表.xlsx</span>
                </div>

                <table class="w-full text-xs md:text-sm">
                  <thead class="bg-slate-800/30 text-slate-400">
                    <tr>
                      <!-- 所有 step 2-7 都顯示公司編號欄位，保持表格一致 -->
                      <th class="border-r border-slate-700 px-3 py-2 text-left transition-all duration-500"
                          :class="stepData.view === 'pk_concept' && animState >= 2 ? 'bg-amber-500/20 text-amber-400' : ''">
                        🔑 公司編號
                      </th>
                      <th class="border-r border-slate-700 px-3 py-2 text-left">公司名稱</th>
                      <th class="border-r border-slate-700 px-3 py-2 text-left">電話</th>
                      <th class="border-r border-slate-700 px-3 py-2 text-left">產品</th>
                      <th class="px-3 py-2 text-left transition-all duration-500"
                          :class="stepData.view === 'type_concept' && animState >= 2 ? 'bg-sky-500/20 text-sky-400' : ''">
                        金額
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- 第 1~3 列：台積電（重複資料） -->
                    <tr v-for="(row, i) in masterData.slice(0, 3)" :key="'tsmc-' + i"
                        class="border-t border-slate-800 transition-all duration-500"
                        :class="[
                          stepData.view === 'anim_pain' && animState >= 2 ? 'bg-amber-500/10' : '',
                          stepData.view === 'anim_error' && animState >= 2 ? (i === 0 ? 'bg-emerald-500/10' : 'bg-red-500/10') : '',
                          stepData.view === 'pk_concept' && animState >= 2 && i === 2 ? 'bg-red-500/10' : '',
                          stepData.view === 'type_concept' && animState >= 2 && i === 1 ? 'bg-red-500/10' : ''
                        ]">
                      <!-- 公司編號欄位（所有 step 2-7 都顯示） -->
                      <td class="border-r border-slate-700 px-3 py-2 font-mono transition-all duration-500"
                          :class="[
                            stepData.view === 'pk_concept' && animState >= 2 ? 'bg-amber-500/10' : '',
                            stepData.view === 'pk_concept' && animState >= 2 && i === 2 ? 'text-red-400' : 'text-amber-400'
                          ]">
                        <!-- pk_concept：展示主鍵概念，第三列故意用錯誤的編號 -->
                        <template v-if="stepData.view === 'pk_concept' && animState >= 2">
                          <span v-if="i === 0">C01 <span class="text-emerald-400 text-xs">← 台積電專屬</span></span>
                          <span v-else-if="i === 1">C01</span>
                          <span v-else class="text-red-400">C01 <span class="text-red-400 text-xs">← 想給聯發科用？</span></span>
                        </template>
                        <template v-else>C01</template>
                      </td>
                      <td class="border-r border-slate-700 px-3 py-2 transition-all duration-500" :class="[
                        stepData.view === 'anim_master' && animState >= 2 ? 'text-rose-400 font-bold' : 'text-slate-300',
                        stepData.view === 'anim_pain' && animState >= 2 ? 'text-amber-400 font-bold' : '',
                        stepData.view === 'anim_error' ? 'text-slate-300' : '',
                        stepData.view === 'pk_concept' && animState >= 2 && i === 2 ? 'text-red-400 font-bold' : ''
                      ]">
                        <!-- pk_concept：第三列顯示為聯發科，展示主鍵衝突 -->
                        <template v-if="stepData.view === 'pk_concept' && animState >= 2 && i === 2">
                          <span class="text-red-400">聯發科</span> <span class="text-red-400 text-xs">← 新公司</span>
                        </template>
                        <template v-else>
                          {{ row.name }}
                        </template>
                        <span v-if="stepData.view === 'anim_pain' && animState >= 2" class="ml-1 text-xs text-amber-500">← 又寫一次</span>
                      </td>
                      <td class="border-r border-slate-700 px-3 py-2 transition-all duration-500" :class="[
                        stepData.view === 'anim_master' && animState >= 2 ? 'text-rose-400 font-bold' : 'text-slate-400',
                        stepData.view === 'anim_pain' && animState >= 2 ? 'text-amber-400 font-bold' : '',
                        stepData.view === 'anim_error' && animState >= 2 ? (i === 0 ? 'text-emerald-400 font-bold' : 'text-red-400') : ''
                      ]">
                        <template v-if="stepData.view === 'anim_error' && animState >= 2">
                          <span v-if="i === 0">03-578-<span class="line-through text-red-400/60">1234</span><span class="text-emerald-400">5678</span> ✓</span>
                          <span v-else>{{ row.phone }} <span class="text-red-400">✗</span></span>
                        </template>
                        <template v-else>{{ row.phone }}</template>
                      </td>
                      <td class="border-r border-slate-700 px-3 py-2 text-slate-300">{{ row.prod }}</td>
                      <td class="px-3 py-2 transition-all duration-500" :class="[
                        stepData.view === 'type_concept' && animState >= 2 ? 'bg-sky-500/10' : '',
                        stepData.view === 'type_concept' && animState >= 2 && i === 1 ? 'text-red-400' : 'text-emerald-400'
                      ]">
                        <template v-if="stepData.view === 'type_concept' && animState >= 2">
                          <span v-if="i === 0">{{ row.amt.toLocaleString() }} <span class="text-emerald-400">✓</span></span>
                          <span v-else-if="i === 1" class="text-red-400"><span class="line-through">"五十萬"</span> ✗</span>
                          <span v-else>{{ row.amt.toLocaleString() }} <span class="text-emerald-400">✓</span></span>
                        </template>
                        <template v-else>{{ row.amt.toLocaleString() }}</template>
                      </td>
                    </tr>
                    <!-- 第 4~5 列：鴻海 -->
                    <tr v-for="(row, i) in masterData.slice(3, 5)" :key="'hon-' + i" class="border-t border-slate-800">
                      <!-- 公司編號欄位（所有 step 2-7 都顯示） -->
                      <td class="border-r border-slate-700 px-3 py-2 font-mono text-sky-400">
                        C02
                      </td>
                      <td class="border-r border-slate-700 px-3 py-2 transition-all duration-500" :class="[
                        stepData.view === 'anim_master' && animState >= 2 ? 'text-sky-400 font-bold' : 'text-slate-300'
                      ]">{{ row.name }}</td>
                      <td class="border-r border-slate-700 px-3 py-2 transition-all duration-500" :class="[
                        stepData.view === 'anim_master' && animState >= 2 ? 'text-sky-400 font-bold' : 'text-slate-400'
                      ]">{{ row.phone }}</td>
                      <td class="border-r border-slate-700 px-3 py-2 text-slate-300">{{ row.prod }}</td>
                      <td class="px-3 py-2 text-emerald-400">{{ row.amt.toLocaleString() }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 動畫提示區 -->
            <div class="w-full transition-all delay-500 duration-700" :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <!-- anim_master: 觀察重複 -->
              <div v-if="stepData.view === 'anim_master'" class="rounded-xl border border-slate-600 bg-slate-800/50 p-4">
                <div class="flex items-start gap-3">
                  <div class="text-2xl">🔍</div>
                  <div>
                    <div class="font-bold text-slate-200 mb-1">仔細看看這張表格...</div>
                    <div class="text-sm text-slate-400">
                      <span class="text-rose-400 font-bold">台積電</span> 出現了 <span class="text-rose-400 font-bold">3 次</span>，
                      <span class="text-sky-400 font-bold">鴻海</span> 出現了 <span class="text-sky-400 font-bold">2 次</span>。<br/>
                      每次下單都要重複輸入公司名稱和電話...這樣對嗎？
                    </div>
                  </div>
                </div>
              </div>

              <!-- anim_pain: 重複輸入的痛苦 -->
              <div v-if="stepData.view === 'anim_pain'" class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <div class="flex items-start gap-3">
                  <div class="text-2xl animate-bounce">✍️</div>
                  <div>
                    <div class="font-bold text-amber-300 mb-1">手好痠的問題</div>
                    <div class="text-sm text-amber-200/80">
                      台積電下 3 筆訂單 → 名字寫 3 次、電話寫 3 次<br/>
                      如果下 100 筆訂單 → 名字寫 100 次、電話寫 100 次！<br/>
                      <span class="text-amber-400 font-bold">這不是浪費時間嗎？</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- anim_error: 改資料的災難 -->
              <div v-if="stepData.view === 'anim_error'" class="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <div class="flex items-start gap-3">
                  <div class="text-2xl">☎️</div>
                  <div>
                    <div class="font-bold text-red-300 mb-1">改電話的災難</div>
                    <div class="text-sm text-red-200/80">
                      假設台積電換了新電話 <span class="text-emerald-400 font-bold">03-578-5678</span><br/>
                      你必須找到每一筆訂單，一個一個改...<br/>
                      <span class="text-red-400 font-bold">漏改一個，資料就會不一致！</span><br/>
                      上面的表格中，只有第 1 列改成功，其他都忘了改 😱
                    </div>
                  </div>
                </div>
              </div>

              <!-- pk_concept: 主鍵說明 -->
              <div v-if="stepData.view === 'pk_concept'" class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <div class="flex items-start gap-3">
                  <div class="text-2xl">🔑</div>
                  <div>
                    <div class="font-bold text-amber-300 mb-1">主鍵 = 身分證號碼</div>
                    <div class="text-sm text-amber-200/80">
                      看上面的表格，每間公司都需要一個<span class="text-amber-400 font-bold">唯一的編號</span>。<br/>
                      <span class="text-emerald-400">C01</span> 已經給台積電了，第三筆如果又用 <span class="text-red-400">C01</span>？<br/>
                      <span class="text-red-400 font-bold">❌ 禁止！主鍵絕對不能重複！</span><br/>
                      就像兩個人不能有一樣的身分證號碼。
                    </div>
                  </div>
                </div>
              </div>

              <!-- type_concept: 資料型態說明 -->
              <div v-if="stepData.view === 'type_concept'" class="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4">
                <div class="flex items-start gap-3">
                  <div class="text-2xl">🔢</div>
                  <div>
                    <div class="font-bold text-sky-300 mb-1">資料型態 = 欄位的規矩</div>
                    <div class="text-sm text-sky-200/80">
                      看上面金額欄位，資料庫規定<span class="text-sky-400 font-bold">金額只能是數字</span>。<br/>
                      如果有人不小心輸入 <span class="text-red-400">"五十萬"</span>（文字）？<br/>
                      <span class="text-red-400 font-bold">❌ 被擋下來！資料庫會報錯！</span><br/>
                      這就是資料庫嚴格的地方，能保護資料正確性。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- ===== Step 8: anim_split 剪開表格（有動畫！） ===== -->
          <template v-if="stepData.view === 'anim_split'">
            <!-- 標題 -->
            <div class="text-center transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'">
              <div class="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-4 py-2">
                <span class="text-xl" :class="animState >= 2 ? 'animate-bounce' : ''">✂️</span>
                <span class="font-bold text-sky-300">我們要把這張大表「剪」成兩張</span>
              </div>
            </div>

            <!-- 剪切動畫容器 -->
            <div class="relative w-full">
              <!-- 原始大表 -->
              <div
                class="overflow-hidden rounded-xl border-2 bg-slate-900 transition-all duration-700"
                :class="animState >= 3 ? 'border-rose-500/50 opacity-50 scale-95' : 'border-slate-600'"
              >
                <!-- Excel 風格標題列 -->
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800/50 px-3 py-2">
                  <div class="flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <span class="ml-2 text-xs text-slate-500">電商訂單總表.xlsx</span>
                  <span v-if="animState >= 3" class="ml-auto rounded bg-rose-500/20 px-2 py-0.5 text-xs text-rose-400">即將分割...</span>
                </div>

                <table class="w-full text-xs md:text-sm">
                  <thead class="bg-slate-800/30">
                    <tr>
                      <!-- 公司編號欄位（藍色標記，會歸到客戶表） -->
                      <th
                        class="px-3 py-2 text-left transition-all duration-500"
                        :class="animState >= 2 ? 'border-r-2 border-sky-500 bg-sky-500/20 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]' : 'border-r border-slate-700 bg-sky-500/10 text-sky-400'"
                      >
                        🔑 公司編號 <span class="text-xs">👥</span>
                      </th>
                      <!-- 客戶資料欄位（藍色標記）- 動畫高亮 -->
                      <th
                        class="px-3 py-2 text-left transition-all duration-500"
                        :class="animState >= 2 ? 'border-r-2 border-sky-500 bg-sky-500/20 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]' : 'border-r border-slate-700 bg-sky-500/10 text-sky-400'"
                      >
                        公司名稱 <span class="text-xs">👥</span>
                      </th>
                      <th
                        class="px-3 py-2 text-left transition-all duration-500"
                        :class="animState >= 2 ? 'border-r-2 border-sky-500 bg-sky-500/20 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]' : 'border-r border-slate-700 bg-sky-500/10 text-sky-400'"
                      >
                        電話 <span class="text-xs">👥</span>
                      </th>
                      <!-- 訂單資料欄位（紫色標記）- 動畫高亮 -->
                      <th
                        class="px-3 py-2 text-left transition-all duration-500"
                        :class="animState >= 2 ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-purple-500/10 text-purple-400'"
                      >
                        產品 <span class="text-xs">📦</span>
                      </th>
                      <th
                        class="px-3 py-2 text-left transition-all duration-500"
                        :class="animState >= 2 ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-purple-500/10 text-purple-400'"
                      >
                        金額 <span class="text-xs">📦</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in masterData" :key="i" class="border-t border-slate-800">
                      <!-- 公司編號欄位 -->
                      <td
                        class="px-3 py-2 font-mono transition-all duration-500"
                        :class="animState >= 2 ? 'border-r-2 border-sky-500/50 bg-sky-500/10 text-amber-400' : 'border-r border-slate-700 bg-sky-500/5 text-amber-400'"
                      >{{ i < 3 ? 'C01' : 'C02' }}</td>
                      <td
                        class="px-3 py-2 transition-all duration-500"
                        :class="animState >= 2 ? 'border-r-2 border-sky-500/50 bg-sky-500/10 text-sky-300' : 'border-r border-slate-700 bg-sky-500/5 text-sky-300'"
                      >{{ row.name }}</td>
                      <td
                        class="px-3 py-2 transition-all duration-500"
                        :class="animState >= 2 ? 'border-r-2 border-sky-500/50 bg-sky-500/10 text-sky-300/70' : 'border-r border-slate-700 bg-sky-500/5 text-sky-300/70'"
                      >{{ row.phone }}</td>
                      <td
                        class="px-3 py-2 transition-all duration-500"
                        :class="animState >= 2 ? 'bg-purple-500/10 text-purple-300' : 'bg-purple-500/5 text-purple-300'"
                      >{{ row.prod }}</td>
                      <td
                        class="px-3 py-2 transition-all duration-500"
                        :class="animState >= 2 ? 'bg-purple-500/10 text-emerald-400' : 'bg-purple-500/5 text-emerald-400'"
                      >{{ row.amt.toLocaleString() }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 剪刀動畫（中間切割線） -->
              <div
                v-if="animState >= 2"
                class="absolute left-1/2 top-0 bottom-0 z-10 flex -translate-x-1/2 flex-col items-center justify-center"
              >
                <div
                  class="h-full w-0.5 transition-all duration-1000"
                  :class="animState >= 3 ? 'bg-gradient-to-b from-transparent via-rose-500 to-transparent opacity-100' : 'bg-sky-500/50 opacity-50'"
                ></div>
                <div
                  class="absolute top-1/2 -translate-y-1/2 rounded-full bg-slate-900 p-2 text-2xl transition-all duration-500"
                  :class="animState >= 3 ? 'scale-125 animate-pulse' : ''"
                >
                  ✂️
                </div>
              </div>
            </div>

            <!-- 說明區塊 -->
            <div class="grid w-full grid-cols-2 gap-4 transition-all delay-300 duration-700" :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'">
              <div
                class="rounded-xl border-2 p-4 text-center transition-all duration-500"
                :class="animState >= 2 ? 'border-sky-500 bg-sky-500/20 shadow-lg shadow-sky-500/20' : 'border-sky-500/50 bg-sky-500/10'"
              >
                <div class="text-2xl">👥</div>
                <div class="mt-1 font-bold text-sky-400">客戶資料</div>
                <div class="text-xs text-slate-400">公司名稱、電話</div>
                <div class="mt-2 text-xs text-sky-300">→ 會變成「客戶表」</div>
              </div>
              <div
                class="rounded-xl border-2 p-4 text-center transition-all duration-500"
                :class="animState >= 2 ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20' : 'border-purple-500/50 bg-purple-500/10'"
              >
                <div class="text-2xl">📦</div>
                <div class="mt-1 font-bold text-purple-400">訂單資料</div>
                <div class="text-xs text-slate-400">產品、金額</div>
                <div class="mt-2 text-xs text-purple-300">→ 會變成「訂單表」</div>
              </div>
            </div>

            <!-- 動畫提示 -->
            <div v-if="animState >= 3" class="w-full text-center transition-all duration-500">
              <div class="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-emerald-400">
                <span class="animate-pulse">▶</span>
                <span class="text-sm">下一步：看看分開後的樣子</span>
              </div>
            </div>
          </template>

          <!-- ===== Step 9-12: Excel 雙分頁視覺化 ===== -->
          <!-- Step 9: anim_moving - 展示分頁結構 -->
          <template v-if="stepData.view === 'anim_moving'">
            <!-- 標題 -->
            <div class="text-center transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'">
              <div class="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-4 py-2">
                <span class="text-xl">📑</span>
                <span class="font-bold text-sky-300">分成兩個工作表（Sheet）</span>
              </div>
            </div>

            <!-- Excel 視窗（含雙分頁） -->
            <div class="w-full">
              <div class="overflow-hidden rounded-xl border-2 border-slate-600 bg-slate-900">
                <!-- Excel 標題列 -->
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800/50 px-3 py-2">
                  <div class="flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <span class="ml-2 text-xs text-slate-400">📊 電商資料庫.xlsx</span>
                </div>

                <!-- 表格內容區 -->
                <div class="p-4">
                  <!-- 客戶表內容 -->
                  <div
                    class="transition-all duration-500"
                    :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
                  >
                    <table class="w-full text-sm">
                      <thead class="bg-sky-500/10">
                        <tr>
                          <th class="px-4 py-2 text-left text-amber-400">編號 🔑</th>
                          <th class="px-4 py-2 text-left text-sky-400">公司名稱</th>
                          <th class="px-4 py-2 text-left text-sky-400">電話</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="border-t border-slate-700">
                          <td class="px-4 py-2 font-mono font-bold text-amber-400">C01</td>
                          <td class="px-4 py-2 text-white">台積電</td>
                          <td class="px-4 py-2 text-slate-400">03-578-1234</td>
                        </tr>
                        <tr class="border-t border-slate-700">
                          <td class="px-4 py-2 font-mono font-bold text-amber-400">C02</td>
                          <td class="px-4 py-2 text-white">鴻海</td>
                          <td class="px-4 py-2 text-slate-400">02-2268-5678</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Excel 底部分頁標籤 -->
                <div class="flex items-end border-t border-slate-700 bg-slate-800/30">
                  <div
                    class="flex cursor-pointer items-center gap-1.5 rounded-t-lg border-l border-r border-t px-4 py-2 transition-all duration-300"
                    :class="'border-sky-500 bg-slate-900 -mb-px'"
                  >
                    <span class="text-sm">👥</span>
                    <span class="text-sm font-medium text-sky-400">客戶表</span>
                    <span
                      class="rounded bg-emerald-500/20 px-1.5 py-0.5 text-xs text-emerald-400 transition-all duration-500"
                      :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"
                    >✨ 新建</span>
                  </div>
                  <div class="flex cursor-pointer items-center gap-1.5 rounded-t-lg border-transparent px-4 py-2 opacity-50">
                    <span class="text-sm">📦</span>
                    <span class="text-sm text-purple-400">訂單表</span>
                    <span class="text-xs text-slate-500">（下一步）</span>
                  </div>
                  <div class="ml-auto px-3 py-2 text-xs text-slate-500">
                    <span class="font-bold text-emerald-400">2</span> 張工作表
                  </div>
                </div>
              </div>
            </div>

            <!-- 說明 -->
            <div
              class="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 transition-all delay-300 duration-700"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
            >
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div class="text-2xl text-rose-400">❌</div>
                  <div class="text-sm text-slate-400">原本：台積電寫了 <span class="font-bold text-rose-400">3 次</span></div>
                </div>
                <div>
                  <div class="text-2xl text-emerald-400">✅</div>
                  <div class="text-sm text-slate-400">現在：台積電只寫 <span class="font-bold text-emerald-400">1 次</span></div>
                </div>
              </div>
              <div class="mt-3 text-center text-sm text-emerald-300">
                每間公司都有唯一編號（<span class="font-mono text-amber-400">C01</span>、<span class="font-mono text-amber-400">C02</span>）
              </div>
            </div>
          </template>

          <!-- Step 10: anim_codes - 訂單表用編號 -->
          <template v-if="stepData.view === 'anim_codes'">
            <!-- 標題 -->
            <div class="text-center transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'">
              <div class="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-4 py-2">
                <span class="text-xl">🔗</span>
                <span class="font-bold text-purple-300">訂單表用「編號」代替公司名稱</span>
              </div>
            </div>

            <!-- Excel 視窗（含雙分頁） -->
            <div class="w-full">
              <div class="overflow-hidden rounded-xl border-2 border-slate-600 bg-slate-900">
                <!-- Excel 標題列 -->
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800/50 px-3 py-2">
                  <div class="flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <span class="ml-2 text-xs text-slate-400">📊 電商資料庫.xlsx</span>
                </div>

                <!-- 表格內容區 -->
                <div class="p-4">
                  <!-- 訂單表內容 -->
                  <div
                    class="transition-all duration-500"
                    :class="animState >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
                  >
                    <table class="w-full text-sm">
                      <thead class="bg-purple-500/10">
                        <tr>
                          <th class="px-3 py-2 text-left text-purple-400">訂單編號</th>
                          <th class="px-3 py-2 text-left">
                            <span class="text-amber-400">客戶編號 🔗</span>
                            <span class="ml-1 text-xs text-emerald-400">外來鍵</span>
                          </th>
                          <th class="px-3 py-2 text-left text-purple-400">產品</th>
                          <th class="px-3 py-2 text-left text-purple-400">金額</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="border-t border-slate-700">
                          <td class="px-3 py-2 font-mono text-purple-400">ORD-101</td>
                          <td class="px-3 py-2 bg-amber-500/10">
                            <span class="font-mono font-bold text-amber-400">C01</span>
                            <span class="ml-2 text-xs text-slate-500">→ 台積電</span>
                          </td>
                          <td class="px-3 py-2 text-slate-300">晶圓</td>
                          <td class="px-3 py-2 text-emerald-400">500,000</td>
                        </tr>
                        <tr class="border-t border-slate-700">
                          <td class="px-3 py-2 font-mono text-purple-400">ORD-102</td>
                          <td class="px-3 py-2 bg-amber-500/10">
                            <span class="font-mono font-bold text-amber-400">C01</span>
                            <span class="ml-2 text-xs text-slate-500">→ 台積電</span>
                          </td>
                          <td class="px-3 py-2 text-slate-300">測試</td>
                          <td class="px-3 py-2 text-emerald-400">200,000</td>
                        </tr>
                        <tr class="border-t border-slate-700">
                          <td class="px-3 py-2 font-mono text-purple-400">ORD-103</td>
                          <td class="px-3 py-2 bg-amber-500/10">
                            <span class="font-mono font-bold text-amber-400">C02</span>
                            <span class="ml-2 text-xs text-slate-500">→ 鴻海</span>
                          </td>
                          <td class="px-3 py-2 text-slate-300">設備</td>
                          <td class="px-3 py-2 text-emerald-400">800,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Excel 底部分頁標籤 -->
                <div class="flex items-end border-t border-slate-700 bg-slate-800/30">
                  <div class="flex cursor-pointer items-center gap-1.5 rounded-t-lg border-transparent px-4 py-2 opacity-50">
                    <span class="text-sm">👥</span>
                    <span class="text-sm text-sky-400">客戶表</span>
                  </div>
                  <div
                    class="flex cursor-pointer items-center gap-1.5 rounded-t-lg border-l border-r border-t px-4 py-2"
                    :class="'border-purple-500 bg-slate-900 -mb-px'"
                  >
                    <span class="text-sm">📦</span>
                    <span class="text-sm font-medium text-purple-400">訂單表</span>
                    <span
                      class="rounded bg-emerald-500/20 px-1.5 py-0.5 text-xs text-emerald-400 transition-all duration-500"
                      :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"
                    >✨ 新建</span>
                  </div>
                  <div class="ml-auto px-3 py-2 text-xs text-slate-500">
                    <span class="font-bold text-emerald-400">2</span> 張工作表
                  </div>
                </div>
              </div>
            </div>

            <!-- 說明 -->
            <div
              class="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 transition-all delay-300 duration-700"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
            >
              <div class="text-sm text-amber-300">
                <span class="font-bold">🔗 外來鍵 (Foreign Key)：</span><br/>
                訂單表用 <span class="font-mono text-amber-400">C01</span> 代替「台積電」<br/>
                電腦看到 C01，就會去「客戶表」找完整資料！
              </div>
            </div>
          </template>

          <!-- Step 11: anim_link - 兩個分頁並排看關聯 -->
          <template v-if="stepData.view === 'anim_link'">
            <!-- 標題 -->
            <div class="text-center transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'">
              <div class="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-2">
                <span class="text-xl">🔍</span>
                <span class="font-bold text-amber-300">兩張表的關聯</span>
              </div>
            </div>

            <!-- Excel 視窗（同時顯示兩個分頁內容） -->
            <div class="w-full">
              <div class="overflow-hidden rounded-xl border-2 border-slate-600 bg-slate-900">
                <!-- Excel 標題列 -->
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800/50 px-3 py-2">
                  <div class="flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <span class="ml-2 text-xs text-slate-400">📊 電商資料庫.xlsx — 同時檢視兩個工作表</span>
                </div>

                <!-- 兩個分頁並排 -->
                <div class="grid gap-4 p-4 md:grid-cols-2">
                  <!-- 左：客戶表 -->
                  <div
                    class="rounded-lg border border-sky-500/50 p-3 transition-all duration-500"
                    :class="animState >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'"
                  >
                    <div class="mb-2 flex items-center gap-2 text-sm font-bold text-sky-400">
                      <span>👥</span> 客戶表
                    </div>
                    <table class="w-full text-xs">
                      <thead class="bg-sky-500/10">
                        <tr>
                          <th class="px-2 py-1.5 text-left text-amber-400">編號 🔑</th>
                          <th class="px-2 py-1.5 text-left text-sky-400">公司</th>
                          <th class="px-2 py-1.5 text-left text-sky-400">電話</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          class="border-t border-slate-700 transition-all duration-300"
                          :class="animState >= 3 ? 'bg-amber-500/10' : ''"
                        >
                          <td
                            class="px-2 py-1.5 font-mono font-bold text-amber-400"
                            :class="animState >= 3 ? 'animate-pulse' : ''"
                          >C01</td>
                          <td class="px-2 py-1.5 text-white">台積電</td>
                          <td class="px-2 py-1.5 text-slate-400">03-578-1234</td>
                        </tr>
                        <tr class="border-t border-slate-700">
                          <td class="px-2 py-1.5 font-mono text-amber-400">C02</td>
                          <td class="px-2 py-1.5 text-white">鴻海</td>
                          <td class="px-2 py-1.5 text-slate-400">02-2268-5678</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- 中間連線 -->
                  <div class="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block">
                    <div
                      v-if="animState >= 3"
                      class="flex flex-col items-center gap-1 rounded-lg bg-amber-500/20 px-3 py-2"
                    >
                      <div class="text-xs font-bold text-amber-400">C01 = C01</div>
                      <div class="text-lg">🔗</div>
                    </div>
                  </div>

                  <!-- 右：訂單表 -->
                  <div
                    class="rounded-lg border border-purple-500/50 p-3 transition-all duration-500"
                    :class="animState >= 2 ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'"
                  >
                    <div class="mb-2 flex items-center gap-2 text-sm font-bold text-purple-400">
                      <span>📦</span> 訂單表
                    </div>
                    <table class="w-full text-xs">
                      <thead class="bg-purple-500/10">
                        <tr>
                          <th class="px-2 py-1.5 text-left text-purple-400">訂單</th>
                          <th class="px-2 py-1.5 text-left text-amber-400">客戶編號</th>
                          <th class="px-2 py-1.5 text-left text-purple-400">產品</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          class="border-t border-slate-700 transition-all duration-300"
                          :class="animState >= 3 ? 'bg-amber-500/10' : ''"
                        >
                          <td class="px-2 py-1.5 font-mono text-purple-400">ORD-101</td>
                          <td
                            class="px-2 py-1.5 font-mono font-bold text-amber-400"
                            :class="animState >= 3 ? 'animate-pulse' : ''"
                          >C01</td>
                          <td class="px-2 py-1.5 text-slate-300">晶圓</td>
                        </tr>
                        <tr class="border-t border-slate-700">
                          <td class="px-2 py-1.5 font-mono text-purple-400">ORD-102</td>
                          <td class="px-2 py-1.5 font-mono text-amber-400">C01</td>
                          <td class="px-2 py-1.5 text-slate-300">測試</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Excel 底部分頁標籤 -->
                <div class="flex items-end border-t border-slate-700 bg-slate-800/30">
                  <div class="flex cursor-pointer items-center gap-1.5 rounded-t-lg border-l border-r border-t border-sky-500 bg-slate-900 px-4 py-2 -mb-px">
                    <span class="text-sm">👥</span>
                    <span class="text-sm font-medium text-sky-400">客戶表</span>
                  </div>
                  <div class="flex cursor-pointer items-center gap-1.5 rounded-t-lg border-l border-r border-t border-purple-500 bg-slate-900 px-4 py-2 -mb-px">
                    <span class="text-sm">📦</span>
                    <span class="text-sm font-medium text-purple-400">訂單表</span>
                  </div>
                  <div class="ml-auto px-3 py-2 text-xs text-slate-500">
                    <span class="font-bold text-emerald-400">2</span> 張工作表（並排檢視）
                  </div>
                </div>
              </div>
            </div>

            <!-- 組合結果 -->
            <div
              class="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 transition-all delay-300 duration-700"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
            >
              <div class="mb-2 text-sm font-bold text-emerald-400">🎯 電腦組合的結果：</div>
              <div class="flex flex-wrap items-center gap-2 rounded bg-slate-800 p-3 text-sm">
                <span class="font-mono text-purple-400">ORD-101</span>
                <span class="text-slate-500">的</span>
                <span class="rounded bg-amber-500/20 px-1.5 font-mono text-amber-400">C01</span>
                <span class="text-slate-500">→</span>
                <span class="font-bold text-white">台積電</span>
                <span class="text-slate-400">03-578-1234</span>
              </div>
              <div class="mt-2 text-xs text-slate-400">這就是「關聯式資料庫」：用編號把兩張表「關聯」起來！</div>
            </div>
          </template>

          <!-- Step 12: anim_sync - 改一次同步 -->
          <template v-if="stepData.view === 'anim_sync'">
            <!-- 標題 -->
            <div class="text-center transition-all duration-500" :class="animState >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'">
              <div class="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2">
                <span class="text-xl">✨</span>
                <span class="font-bold text-emerald-300">正規化的威力：改一次就好！</span>
              </div>
            </div>

            <!-- 情境說明 -->
            <div
              class="w-full rounded-xl border border-slate-600 bg-slate-800 p-3 transition-all duration-500"
              :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
            >
              <div class="text-sm text-slate-300">
                <span class="text-lg">📱</span> <span class="font-bold">情境：</span>台積電換電話
                <span class="text-red-400 line-through">03-578-1234</span> → <span class="font-bold text-emerald-400">03-578-5678</span>
              </div>
            </div>

            <!-- Excel 視窗 -->
            <div class="w-full">
              <div class="overflow-hidden rounded-xl border-2 border-slate-600 bg-slate-900">
                <!-- Excel 標題列 -->
                <div class="flex items-center gap-2 border-b border-slate-700 bg-slate-800/50 px-3 py-2">
                  <div class="flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <span class="ml-2 text-xs text-slate-400">📊 電商資料庫.xlsx</span>
                  <span
                    class="ml-auto rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400 transition-all duration-500"
                    :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"
                  >✏️ 編輯中...</span>
                </div>

                <!-- 客戶表（修改電話） -->
                <div class="p-4">
                  <table class="w-full text-sm">
                    <thead class="bg-sky-500/10">
                      <tr>
                        <th class="px-4 py-2 text-left text-amber-400">編號 🔑</th>
                        <th class="px-4 py-2 text-left text-sky-400">公司名稱</th>
                        <th class="px-4 py-2 text-left text-sky-400">電話</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        class="border-t border-slate-700 transition-all duration-300"
                        :class="animState >= 2 ? 'bg-emerald-500/10' : ''"
                      >
                        <td class="px-4 py-2 font-mono font-bold text-amber-400">C01</td>
                        <td class="px-4 py-2 text-white">台積電</td>
                        <td class="px-4 py-2">
                          <span
                            class="transition-all duration-500"
                            :class="animState >= 2 ? 'text-red-400/60 line-through' : 'text-slate-400'"
                          >03-578-1234</span>
                          <span
                            class="ml-2 font-bold text-emerald-400 transition-all duration-500"
                            :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"
                          >03-578-5678 ✓</span>
                        </td>
                      </tr>
                      <tr class="border-t border-slate-700">
                        <td class="px-4 py-2 font-mono font-bold text-amber-400">C02</td>
                        <td class="px-4 py-2 text-white">鴻海</td>
                        <td class="px-4 py-2 text-slate-400">02-2268-5678</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Excel 底部分頁標籤 -->
                <div class="flex items-end border-t border-slate-700 bg-slate-800/30">
                  <div class="flex cursor-pointer items-center gap-1.5 rounded-t-lg border-l border-r border-t border-sky-500 bg-slate-900 px-4 py-2 -mb-px">
                    <span class="text-sm">👥</span>
                    <span class="text-sm font-medium text-sky-400">客戶表</span>
                    <span class="rounded bg-emerald-500/20 px-1.5 py-0.5 text-xs text-emerald-400">✏️ 改這裡</span>
                  </div>
                  <div class="flex cursor-pointer items-center gap-1.5 rounded-t-lg border-transparent px-4 py-2 opacity-50">
                    <span class="text-sm">📦</span>
                    <span class="text-sm text-purple-400">訂單表</span>
                    <span class="text-xs text-slate-500">（不用改）</span>
                  </div>
                  <div class="ml-auto px-3 py-2 text-xs text-slate-500">
                    只需改 <span class="font-bold text-emerald-400">1</span> 次
                  </div>
                </div>
              </div>
            </div>

            <!-- 所有訂單自動更新 -->
            <div
              class="text-center transition-all duration-500"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
            >
              <div class="text-lg text-emerald-400">↓ 所有訂單查詢時自動顯示新電話 ↓</div>
            </div>

            <!-- 總結 -->
            <div
              class="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 transition-all delay-300 duration-700"
              :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
            >
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div class="text-2xl text-rose-400">❌</div>
                  <div class="text-sm text-slate-400">沒有正規化：<br/>要改 <span class="font-bold text-rose-400">100 筆</span>訂單</div>
                </div>
                <div>
                  <div class="text-2xl text-emerald-400">✅</div>
                  <div class="text-sm text-slate-400">正規化後：<br/>只要改 <span class="font-bold text-emerald-400">1 次</span>客戶表</div>
                </div>
              </div>
              <div class="mt-3 text-center text-xs text-slate-400">
                這就是為什麼大公司都用資料庫，而不是 Excel
              </div>
            </div>
          </template>

        </div>
      </div>

    </div>
  </InteractiveSlideTemplate>
</template>
