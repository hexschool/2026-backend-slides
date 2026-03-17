<script setup lang="ts">
/**
 * 簡報 Modal 容器
 * 動態載入對應的互動簡報元件
 */
import { computed, defineAsyncComponent, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  slideId: string
  title: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// === RWD 偵測 ===
const MOBILE_BREAKPOINT = 768
const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// 動態載入對應的互動簡報元件
const slideComponents: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  'git-intro': defineAsyncComponent(() => import('./slides/GitIntroSlide.vue')),
  'docker-intro': defineAsyncComponent(() => import('./slides/DockerIntroSlide.vue')),
  'architecture-intro': defineAsyncComponent(() => import('./slides/ArchitectureIntroSlide.vue')),
  'static-dynamic': defineAsyncComponent(() => import('./slides/StaticDynamicSlide.vue')),
  'coach-backend': defineAsyncComponent(() => import('./slides/CoachBackendSlide.vue')),
  'url-request': defineAsyncComponent(() => import('./slides/UrlRequestSlide.vue')),
  'network-request': defineAsyncComponent(() => import('./slides/NetworkRequestSlide.vue')),
  'api-intro': defineAsyncComponent(() => import('./slides/ApiIntroSlide.vue')),
  'api-demo': defineAsyncComponent(() => import('./slides/ApiDemoSlide.vue')),
  'drag-quiz': defineAsyncComponent(() => import('./slides/DragQuizSlide.vue')),
  'drag-sort': defineAsyncComponent(() => import('./slides/DragSortSlide.vue')),
  'data-flow': defineAsyncComponent(() => import('./slides/DataFlowSlide.vue')),
  'third-party': defineAsyncComponent(() => import('./slides/ThirdPartySlide.vue')),
  'database-intro': defineAsyncComponent(() => import('./slides/DatabaseIntroSlide.vue')),
  'table-design': defineAsyncComponent(() => import('./slides/TableDesignSlide.vue')),
  'livefit-database': defineAsyncComponent(() => import('./slides/LivefitDatabaseSlide.vue')),
  'database-access': defineAsyncComponent(() => import('./slides/DatabaseAccessSlide.vue')),
  'sql-practice': defineAsyncComponent(() => import('./slides/SqlPracticeSlide.vue')),
  'sql-basics': defineAsyncComponent(() => import('./slides/SqlBasicsSlide.vue')),
  'video-message': defineAsyncComponent(() => import('./slides/VideoMessageSlide.vue')),
  'jwt-intro': defineAsyncComponent(() => import('./slides/JwtIntroSlide.vue')),
  'jwt-storage': defineAsyncComponent(() => import('./slides/JwtStorageSlide.vue')),
  'crud-intro': defineAsyncComponent(() => import('./slides/CrudIntroSlide.vue')),
  // JS 直播班
  'calculator': defineAsyncComponent(() => import('./slides/CalculatorSlide.vue')),
  'value-ref': defineAsyncComponent(() => import('./slides/ValueRefSlide.vue')),
  'obj-array': defineAsyncComponent(() => import('./slides/ObjArraySlide.vue')),
  'if-logic': defineAsyncComponent(() => import('./slides/IfLogicSlide.vue')),
  'expr-stmt': defineAsyncComponent(() => import('./slides/ExprStmtSlide.vue')),
  'json-read': defineAsyncComponent(() => import('./slides/JsonReadSlide.vue')),
}

const SlideComponent = computed(() => {
  return slideComponents[props.slideId] || null
})

function handleComplete() {
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div
      class="relative flex h-[95vh] w-[95vw] max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-100 shadow-2xl"
    >
      <!-- Header -->
      <header class="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <h2 class="text-lg font-bold text-slate-800">{{ title }}</h2>
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          @click="emit('close')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      <!-- 互動簡報內容區 -->
      <main class="flex-1 overflow-y-auto">
        <component
          v-if="SlideComponent"
          :is="SlideComponent"
          :isMobile="isMobile"
          @complete="handleComplete"
        />
        <div v-else class="flex h-full items-center justify-center text-slate-500">
          找不到簡報元件：{{ slideId }}
        </div>
      </main>
    </div>
  </div>
</template>
