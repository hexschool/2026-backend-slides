export type SlideInfo = {
  id: string
  title: string
  description: string
}

export type Section = {
  title: string
  slides: SlideInfo[]
}

export type Course = {
  id: string
  title: string
  description: string
  sections: Section[]
}

/** 計算課程總簡報數 */
export function getTotalSlides(course: Course): number {
  return course.sections.reduce((sum, s) => sum + s.slides.length, 0)
}

/** 在所有 section 中找到指定 slide */
export function findSlide(course: Course, slideId: string): SlideInfo | undefined {
  for (const section of course.sections) {
    const slide = section.slides.find(s => s.id === slideId)
    if (slide) return slide
  }
}

export const courses: Course[] = [
{
    id: 'js-live',
    title: 'JS 培訓班',
    description: 'JavaScript 核心觀念與實戰',
    sections: [
      {
        title: '課堂簡報',
        slides: [
          { id: 'obj-array', title: '1-1. 物件 vs 陣列', description: '搞懂何時用物件、何時用陣列，從生活情境到程式實作' },
          { id: 'value-ref', title: '1-2. 傳值 vs 傳址', description: '從生活情境到程式概念，搞懂基本型別與物件型別的賦值差異' },
          { id: 'if-logic', title: '2-1. 邏輯判斷之術', description: '比較運算子、邏輯運算子、if/else if/else 的情境式教學' },
          { id: 'expr-stmt', title: '2-2. 表達式 vs 陳述式', description: '搞懂表達式與陳述式，用變數和 if 拆解程式碼結構' },
          { id: 'json-read', title: '3-1. 看懂 JSON 資料', description: '從 JSON 格式到讀懂真實 open data 與 API 回傳資料' },
          { id: 'function-design', title: '4-1. 函式設計之術', description: '函式宣告/呼叫、參數、return、if+function、物件取值的情境式教學' },
          { id: 'array-methods-flow', title: '5-1. 陣列方法執行流程', description: '用慢動作重播帶你看懂 find / filter / some / map / reduce 的 callback 運作原理' },
          { id: 'architecture-intro', title: '6-0a. 系統架構入門', description: '前端、後端、資料庫各自的角色，用電商網站比喻搞懂三層架構' },
          { id: 'api-demo', title: '6-0b. API 實際操作示範', description: '帶學員親眼看一次 API 從打請求到拿回資料的完整過程' },
          { id: 'api-restaurant', title: '6-1. API 與餐廳', description: '為什麼需要 API + 餐廳比喻 + HTTP 對話' },
          { id: 'http-methods', title: '6-2. HTTP 五個動作', description: 'GET/POST/PUT/PATCH/DELETE 與 RESTful 設計風格' },
          { id: 'http-status', title: '6-3. HTTP 狀態碼', description: '五大類顏色卡片 + 4 開頭你的錯、5 開頭別人的錯' },
          { id: 'async-fetch-get', title: '6-4. 非同步與 fetch GET', description: '同步/非同步 + Promise + async/await + fetch 三步驟與兩個坑' },
          { id: 'livejs-intro', title: '6-5. LiveJS 註冊與第一個範例', description: '註冊 API Path + .env + getProducts 第一個 LiveJS 範例' },
          { id: 'fetch-write', title: '6-6. fetch 寫資料', description: 'POST/PATCH/DELETE 三件套 + LiveJS 兩個坑（包 data、cartId）' },
          { id: 'fetch-error', title: '6-7. 錯誤處理雙保險', description: 'try/catch + response.ok 兩種錯誤分開防、success/error 統一格式' },
        ],
      },
      {
        title: '資料結構',
        slides: [
          { id: 'calculator', title: '迷你計算機：Stack、Queue 與 Undo', description: '認識 Stack 與 Queue 兩大資料結構，用陣列的 push/pop/shift 實作，並挑戰 Undo 功能' },
        ],
      },
    ],
  },
  {
    id: 'nodejs-live',
    title: 'Node.js 培訓班',
    description: 'Node.js 後端開發實戰',
    sections: [],
  },
  {
    id: 'aws-live',
    title: 'AWS 培訓班',
    description: 'AWS 雲端服務部署與維運',
    sections: [],
  },
]
