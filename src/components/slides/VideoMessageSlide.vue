<script setup lang="ts">
/**
 * 《給未來的你》- 好萊塢風格彩蛋影片
 *
 * 分鏡設計：
 * 第一幕：神秘載入
 * 第二幕：影片檔案出現（播放器介面）
 * 第三幕：海姐登場（視訊通話風格）
 * 第四幕：回憶片段（暗色調）
 * 第五幕：金句時刻（全螢幕特寫）
 * 第六幕：三個重點（大數字強調）
 * 第七幕：溫馨結尾
 */
import { ref, computed, onMounted, watch } from 'vue'
import { usePlayerStore } from '../../stores/player'

const props = withDefaults(defineProps<{
  isMobile?: boolean
  isMusicPlaying?: boolean
}>(), {
  isMobile: false,
  isMusicPlaying: false,
})

const emit = defineEmits<{
  (e: 'complete'): void
  (e: 'toggleMusic'): void
  (e: 'switchToEndingMusic'): void
}>()

const player = usePlayerStore()
const baseUrl = import.meta.env.BASE_URL

// 場景類型
type SceneType = 'loading' | 'title' | 'talk' | 'memory' | 'quote' | 'point' | 'climax' | 'theEnd' | 'credits'

interface Scene {
  type: SceneType
  text: string
  subtext?: string
  expression?: 'normal' | 'praise' | 'sad'
  pointNumber?: number
}

// 好萊塢風格分鏡腳本
const scenes: Scene[] = [
  // 第一幕：神秘載入
  { type: 'loading', text: '載入中...' },

  // 第二幕：海姐登場（移除標題畫面，直接進入對話）
  { type: 'talk', text: `嗨，${player.name}`, expression: 'normal' },
  { type: 'talk', text: '如果你看到這個影片，代表你真的做到了', expression: 'praise' },
  { type: 'talk', text: '全部的測驗都答對，還找到了那串亂碼', expression: 'praise' },
  { type: 'talk', text: '我想跟你分享一些事情', expression: 'normal' },

  // 第四幕：回憶片段（暗色調）
  { type: 'memory', text: '看到你，就像是看到以前的我一樣' },
  { type: 'memory', text: '以前的我剛進入接案公司，雖然每天都忙到三更半夜，但至少團隊成員感情都很不錯' },
  { type: 'memory', text: '再加上後端工程師可以整合很多系統，會感到很有成就感' },
  { type: 'memory', text: '但後來...換了新主管，接了很多不良客戶，加班到凌晨變成家常便飯' },
  { type: 'memory', text: '更重要的是，我很內耗，不懂得拒絕，不懂得要好好照顧自己' },
  { type: 'memory', text: '甚至還暈倒，搭上救護車呢' },
  { type: 'memory', text: '是後來遇到瑜伽跟健身，才慢慢平緩下來' },

  // 轉折：重要訊息
  { type: 'talk', text: '所以我希望你，一定要以自己為優先', expression: 'normal' },
  { type: 'talk', text: '好好照顧好自己，才有多餘的能力照顧他人', expression: 'praise' },

  // 肯定
  { type: 'talk', text: '再次恭喜你成為正職', expression: 'praise' },
  { type: 'talk', text: '其實當我第七天看到你認真攻略資料庫的時候，我就認定你一定可以突破這次上線的挑戰', expression: 'normal' },
  { type: 'talk', text: '這樣的決心和耐力，表示你真的很有潛能成為軟體工程師', expression: 'praise' },
  { type: 'talk', text: '很多人都會認為工程師需要天賦才可以，但其實以前的我，也是天天被前輩念到長大', expression: 'normal' },
  { type: 'talk', text: '前輩跟我說過一句話——', expression: 'normal' },

  // 第五幕：金句時刻
  { type: 'quote', text: '「人的一生就像是馬拉松。我們很常高估自己一年可以做的事，卻低估自己二三十年後的成長」' },
  { type: 'talk', text: '慢慢成長，才是比較快的', expression: 'praise' },

  // 第六幕：三個重點
  { type: 'talk', text: '最後想和你說三件事', expression: 'normal' },
  { type: 'point', text: '跟自己比較，你真的很棒了', pointNumber: 1 },
  { type: 'point', text: '你不用一開始就很厲害\n<highlight>但要開始才會很厲害</highlight>', pointNumber: 2 },
  { type: 'point', text: '', pointNumber: 3 }, // 只顯示數字 3
  { type: 'climax', text: '只要你不放棄自己，海姐也不會放棄你' }, // 打字機效果
  { type: 'climax', text: '全劇終' },

  // 第七幕：謝幕滾動
  { type: 'credits', text: '' },
]

const currentStep = ref(0)
const showContent = ref(false)

const currentScene = computed(() => scenes[currentStep.value])
const progress = computed(() => (currentStep.value / (scenes.length - 1)) * 100)
const isLastStep = computed(() => currentStep.value === scenes.length - 1)

// 處理文字中的 highlight 標籤，轉換成帶顏色的 span
function formatText(text: string): string {
  return text.replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-amber-400">$1</span>')
}

// 閃爍的錄影燈
const recordingLight = ref(true)
let recordingInterval: ReturnType<typeof setInterval> | null = null

function handleClick() {
  if (currentScene.value?.type === 'loading') return

  if (isLastStep.value) {
    emit('complete')
    return
  }

  nextStep()
}

function nextStep() {
  if (currentStep.value < scenes.length - 1) {
    showContent.value = false
    setTimeout(() => {
      currentStep.value++
      showContent.value = true
    }, 200)
  }
}

function prevStep() {
  // 不能回到載入畫面（index 0），所以最少要 > 1
  if (currentStep.value > 1) {
    showContent.value = false
    setTimeout(() => {
      currentStep.value--
      showContent.value = true
    }, 200)
  }
}

onMounted(() => {
  // 錄影燈閃爍
  recordingInterval = setInterval(() => {
    recordingLight.value = !recordingLight.value
  }, 800)

  // 載入動畫後進入標題
  setTimeout(() => {
    currentStep.value = 1
    showContent.value = true
  }, 2000)
})

// 監聽場景變化
watch(() => currentStep.value, () => {
  if (currentStep.value >= scenes.length - 1 && recordingInterval) {
    clearInterval(recordingInterval)
  }
})
</script>

<template>
  <div
    class="relative flex h-full min-h-screen cursor-pointer select-none flex-col bg-black"
    @click="handleClick"
  >
    <!-- ==================== 第一幕：載入畫面 ==================== -->
    <div
      v-if="currentScene?.type === 'loading'"
      class="flex flex-1 flex-col items-center justify-center"
    >
      <div class="relative">
        <div class="h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-amber-500"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="h-8 w-8 rounded-full bg-amber-500/20"></div>
        </div>
      </div>
      <p class="mt-6 text-lg text-slate-500">{{ currentScene.text }}</p>
    </div>

    <!-- ==================== 第二幕～第五幕：影片播放器 ==================== -->
    <div
      v-if="['talk', 'memory', 'quote', 'point', 'climax'].includes(currentScene?.type || '')"
      class="flex flex-1 flex-col items-center justify-center px-4 py-8"
    >
      <!-- 影片播放器容器 -->
      <div class="w-full max-w-5xl overflow-hidden rounded-xl bg-slate-900 shadow-2xl ring-1 ring-white/10">

        <!-- 播放器頂部列 -->
        <div class="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-red-500"></div>
            <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div class="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-400">
            <span>給未來的你.mp4</span>
          </div>
          <div class="flex items-center gap-3">
            <!-- 錄影中指示燈 -->
            <div class="flex items-center gap-1.5">
              <div
                class="h-2 w-2 rounded-full transition-opacity duration-300"
                :class="recordingLight ? 'bg-red-500 opacity-100' : 'bg-red-500 opacity-30'"
              ></div>
              <span class="text-xs text-red-400">REC</span>
            </div>
            <!-- 音樂開關 -->
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              :title="isMusicPlaying ? '關閉音樂' : '開啟音樂'"
              @click.stop="emit('toggleMusic')"
            >
              <svg v-if="isMusicPlaying" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 影片主畫面 -->
        <div
          class="relative"
          :class="currentScene?.type === 'memory' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-slate-900 to-slate-800'"
        >
          <!-- 回憶模式的暗角效果 -->
          <div
            v-if="currentScene?.type === 'memory'"
            class="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40"
          ></div>

          <div class="flex min-h-[400px] md:min-h-[450px]">
            <!-- 左側：海姐畫面（非回憶模式時顯示） -->
            <div
              v-if="currentScene?.type !== 'memory' && currentScene?.type !== 'quote' && currentScene?.type !== 'point' && currentScene?.type !== 'climax'"
              class="hidden w-2/5 items-center justify-center border-r border-slate-800/50 md:flex"
            >
              <div class="relative">
                <!-- 光暈效果 -->
                <div class="absolute -inset-8 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 blur-2xl"></div>

                <!-- 海姐圖片 -->
                <img
                  :src="`${baseUrl}images/coach/${currentScene?.expression || 'normal'}.png`"
                  alt="海克絲"
                  class="relative h-64 w-auto drop-shadow-2xl"
                />
              </div>
            </div>

            <!-- 右側：對話內容 -->
            <div
              class="flex flex-1 flex-col justify-center px-5 py-6 md:p-10"
              :class="{
                'items-center text-center': currentScene?.type === 'memory' || currentScene?.type === 'quote' || currentScene?.type === 'point' || currentScene?.type === 'climax',
              }"
            >
              <Transition name="slide-fade" mode="out-in">
                <!-- 回憶模式 -->
                <div v-if="currentScene?.type === 'memory' && showContent" :key="currentStep" class="max-w-2xl px-2">
                  <p class="text-lg leading-loose text-slate-400 md:text-2xl md:leading-relaxed">
                    {{ currentScene.text }}
                  </p>
                </div>

                <!-- 金句模式 -->
                <div v-else-if="currentScene?.type === 'quote' && showContent" :key="currentStep" class="max-w-2xl">
                  <div class="relative rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-6 md:p-10">
                    <!-- 裝飾引號 -->
                    <div class="absolute -left-1 -top-3 text-4xl text-amber-500/30 md:-left-2 md:-top-4 md:text-6xl">"</div>
                    <div class="absolute -bottom-6 -right-1 text-4xl text-amber-500/30 md:-bottom-8 md:-right-2 md:text-6xl">"</div>

                    <p class="relative text-lg font-medium leading-loose text-amber-100 md:text-2xl md:leading-relaxed">
                      {{ currentScene.text }}
                    </p>
                  </div>
                </div>

                <!-- 重點強調模式 - 第 1、2 點：橫向排版 -->
                <div v-else-if="currentScene?.type === 'point' && currentScene.pointNumber !== 3 && showContent" :key="currentStep" class="w-full max-w-xl px-4">
                  <div class="flex items-center gap-5 md:gap-8">
                    <!-- 大數字 -->
                    <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-2xl font-black text-white shadow-lg shadow-amber-500/30 md:h-20 md:w-20 md:rounded-2xl md:text-4xl">
                      {{ currentScene.pointNumber }}
                    </div>
                    <!-- 文字 -->
                    <p class="flex-1 whitespace-pre-line text-left text-lg font-bold leading-relaxed text-white md:text-2xl" v-html="formatText(currentScene.text)">
                    </p>
                  </div>
                </div>

                <!-- 重點強調模式 - 第 3 點：只顯示數字 3 -->
                <div v-else-if="currentScene?.type === 'point' && currentScene.pointNumber === 3 && showContent" :key="currentStep" class="flex w-full items-center justify-center px-6">
                  <div class="point3-number flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-4xl font-black text-white shadow-lg shadow-amber-500/30 md:h-28 md:w-28 md:text-5xl">
                    3
                  </div>
                </div>

                <!-- 高潮模式 - 打字機效果 -->
                <div v-else-if="currentScene?.type === 'climax' && showContent" :key="currentStep" class="flex w-full items-center justify-center px-6">
                  <p class="climax-typewriter text-center text-2xl font-bold leading-relaxed text-amber-100 md:text-4xl md:leading-loose">
                    {{ currentScene.text }}
                  </p>
                </div>

                <!-- 一般對話模式 -->
                <div v-else-if="showContent" :key="currentStep">
                  <div class="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 md:mb-4 md:px-4 md:py-1.5">
                    <div class="h-2 w-2 rounded-full bg-amber-500"></div>
                    <span class="text-xs font-bold text-amber-400 md:text-sm">海克絲</span>
                  </div>
                  <p class="text-lg leading-loose text-white md:text-2xl md:leading-relaxed">
                    {{ currentScene.text }}
                  </p>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- 播放器底部控制列 -->
        <div class="border-t border-slate-800 bg-slate-900/80 px-4 py-3">
          <!-- 進度條 -->
          <div class="mb-2 h-1 overflow-hidden rounded-full bg-slate-700">
            <div
              class="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          <!-- 控制資訊 -->
          <div class="flex items-center justify-between text-xs text-slate-500">
            <div class="flex items-center gap-3">
              <button
                v-if="currentStep > 2"
                type="button"
                class="flex items-center gap-1 rounded-lg px-2 py-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                @click.stop="prevStep"
              >
                <span>⏪</span>
                <span>倒帶</span>
              </button>
              <span>{{ currentStep }} / {{ scenes.length - 1 }}</span>
            </div>
            <span class="text-base font-medium text-white animate-pulse">點擊畫面繼續 →</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 第七幕：謝幕滾動 ==================== -->
    <div
      v-if="currentScene?.type === 'credits'"
      class="relative flex h-full min-h-screen flex-col overflow-hidden"
      @click.stop
    >
      <!-- 滾動內容容器 -->
      <div class="credits-scroll absolute inset-x-0 flex flex-col items-center px-6 text-center">
        <!-- 第一段：主標題（mt-[100vh] 讓內容從畫面底部開始） -->
        <div class="mb-24 mt-[100vh]">
          <h1 class="mb-6 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            新人後端生存指南
          </h1>
          <p class="text-xl text-slate-400 md:text-2xl">一個關於成長與堅持的故事</p>
        </div>

        <!-- 第二段：製作團隊 -->
        <div class="mb-24">
          <h2 class="mb-8 text-2xl font-bold text-amber-400 md:text-3xl">— 製作團隊 —</h2>
          <div class="space-y-6 text-lg text-slate-300 md:text-xl">
            <div>
              <p class="mb-1 text-white">企劃 / 劇本</p>
              <p>洧杰</p>
            </div>
            <div>
              <p class="mb-1 text-white">程式開發</p>
              <p>Yujie</p>
            </div>
            <div>
              <p class="mb-1 text-white">美術設計</p>
              <p>ユウジェ</p>
            </div>
            <div>
              <p class="mb-1 text-white">音樂音效</p>
              <p>유제</p>
            </div>
            <div>
              <p class="mb-1 text-white">品質測試</p>
              <p>Юйцзе</p>
            </div>
            <div>
              <p class="mb-1 text-white">測試人員</p>
              <p>Nora</p>
            </div>
            <div>
              <p class="mb-1 text-white">專案管理</p>
              <p>يوجيه</p>
            </div>
          </div>
        </div>

        <!-- 第三段：特別感謝 -->
        <div class="mb-24">
          <h2 class="mb-8 text-2xl font-bold text-amber-400 md:text-3xl">— 特別感謝 —</h2>
          <div class="space-y-3 text-lg text-slate-300 md:text-xl">
            <p>願意嘗試後端的你</p>
            <p>每一個不放棄自己的人</p>
          </div>
        </div>

        <!-- 第四段：技術支援 -->
        <div class="mb-24">
          <h2 class="mb-8 text-2xl font-bold text-amber-400 md:text-3xl">— 技術支援 —</h2>
          <div class="space-y-4">
            <!-- 遊戲前端 -->
            <div class="flex flex-wrap justify-center gap-3 text-base text-slate-400 md:text-lg">
              <span>Vue 3</span>
              <span>•</span>
              <span>TypeScript</span>
              <span>•</span>
              <span>Vite</span>
              <span>•</span>
              <span>Pinia</span>
              <span>•</span>
              <span>Vue Router</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>Three.js</span>
            </div>
            <!-- 課程後端 -->
            <div class="flex flex-wrap justify-center gap-3 text-base text-slate-400 md:text-lg">
              <span>Node.js</span>
              <span>•</span>
              <span>Express</span>
              <span>•</span>
              <span>PostgreSQL</span>
              <span>•</span>
              <span>TypeORM</span>
              <span>•</span>
              <span>Docker</span>
              <span>•</span>
              <span>JWT</span>
            </div>
          </div>
        </div>

        <!-- 第五段：金句 -->
        <div class="mb-24">
          <h2 class="mb-8 text-2xl font-bold text-amber-400 md:text-3xl">— 致每一位後端新人 —</h2>
          <div class="max-w-lg">
            <p class="mb-4 text-xl leading-relaxed text-amber-100 md:text-2xl">
              「你不用一開始就很厲害，<br>但要開始才會很厲害。」
            </p>
            <p class="text-lg text-slate-400">— 海克絲</p>
          </div>
        </div>

        <!-- 第六段：Logo -->
        <div class="mb-24">
          <div class="mb-6 text-3xl font-bold text-white md:text-4xl">六角學院</div>
          <div class="mb-8 text-xl tracking-widest text-slate-500">HEXSCHOOL</div>
          <p class="mb-4 text-sm text-slate-600">© 2025 六角學院</p>
          <p class="text-sm text-slate-600">All Rights Reserved</p>
        </div>

        <!-- 第七段：演員表 + 未完待續（主角後面直接接著） -->
        <div class="credits-final-section">
          <h2 class="mb-8 text-2xl font-bold text-amber-400 md:text-3xl">— 演員 —</h2>
          <div class="mb-12 space-y-4 text-lg text-slate-300 md:text-xl">
            <p><span class="text-white">海克絲</span> <span class="mx-4 text-slate-600">...................</span> 教練</p>
            <p><span class="text-white">{{ player.name }}</span> <span class="mx-4 text-slate-600">...................</span> 主角</p>
          </div>

          <!-- 未完待續 + 按鈕（直接接在主角後面） -->
          <div class="flex flex-col items-center pt-8">
            <h2 class="mb-10 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-5xl font-black tracking-widest text-transparent md:text-7xl">
              未完待續
            </h2>
            <button
              type="button"
              class="group relative overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-10 py-4 text-lg font-bold text-white shadow-2xl shadow-amber-500/30 transition-all hover:scale-105 hover:shadow-amber-500/50"
              @click.stop="emit('complete')"
            >
              <span class="relative z-10 text-center leading-relaxed">結束旅程<br>展開下個新冒險</span>
              <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滑動淡入 */
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ========== 第三點數字動畫 ========== */
.point3-number {
  animation: point3-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes point3-pop {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* ========== 高潮打字機效果 ========== */
.climax-typewriter {
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid rgba(251, 191, 36, 0.8);
  animation:
    climax-typing 2.5s steps(20, end) forwards,
    climax-blink 0.7s step-end infinite;
}

@keyframes climax-typing {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

@keyframes climax-blink {
  0%, 100% {
    border-color: rgba(251, 191, 36, 0.8);
  }
  50% {
    border-color: transparent;
  }
}

/* ========== 謝幕滾動動畫 ========== */
.credits-scroll {
  animation: credits-roll 40s linear forwards;
}

/* 最後一段：演員 + 未完待續，加 padding 讓它停在中間 */
.credits-final-section {
  padding-top: 10vh;
  padding-bottom: 45vh;
}

@keyframes credits-roll {
  0% {
    /* 一開始內容在畫面下方（看不到） */
    transform: translateY(0);
  }
  100% {
    /* 滾動到讓最後內容停在畫面中間，保留更多空間 */
    transform: translateY(calc(-100% + 105vh));
  }
}
</style>
