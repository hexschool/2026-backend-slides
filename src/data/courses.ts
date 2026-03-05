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
