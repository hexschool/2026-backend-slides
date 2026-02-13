/**
 * Stack 實戰練習 — 遊戲邏輯測試
 *
 * 驗證 7 個關卡的完整遊玩流程：
 *  - 每關正確答案通過所有 test cases
 *  - ___ 佔位符偵測
 *  - 禁用語法偵測（.reverse()）
 *  - 錯誤程式碼產生有意義的失敗
 *  - 星星計算（0 提示 = 3 星，1 提示 = 2 星，2~3 提示 = 1 星）
 */
import { describe, it, expect } from 'vitest'

// ============================================================
// 複製 StackPracticeSlide.vue 中的核心型別與關卡資料
// （因為 Vue SFC 無法直接 import，故此處鏡像定義）
// ============================================================

interface TestCase {
  label: string
  check: (r: any) => boolean
  failMsg: (r: any) => string
}

interface Level {
  id: number
  title: string
  template: string
  testCases: TestCase[]
  stackKey: string | null
  forbiddenPatterns?: string[]
}

const levels: Level[] = [
  // L1: push() 入門
  {
    id: 0,
    title: '關卡 1：建造 Stack',
    template: `const stack = [];\nstack.push(10);\nstack.push(20);\nstack.push(30);\nreturn stack;`,
    testCases: [
      { label: 'stack 是陣列', check: (r) => Array.isArray(r), failMsg: (r) => `不是陣列: ${typeof r}` },
      { label: 'stack.length === 3', check: (r) => r?.length === 3, failMsg: (r) => `長度 ${r?.length}` },
      { label: 'stack[0] === 10', check: (r) => r?.[0] === 10, failMsg: (r) => `${r?.[0]}` },
      { label: 'stack[1] === 20', check: (r) => r?.[1] === 20, failMsg: (r) => `${r?.[1]}` },
      { label: 'stack[2] === 30', check: (r) => r?.[2] === 30, failMsg: (r) => `${r?.[2]}` },
    ],
    stackKey: null,
  },
  // L2: pop() 回傳值
  {
    id: 1,
    title: '關卡 2：拆解 Stack',
    template: `const stack = ['🍎', '🍌', '🍇'];\nconst fruit = stack.pop();\nreturn { stack, fruit };`,
    testCases: [
      { label: "fruit === '🍇'", check: (r) => r?.fruit === '🍇', failMsg: (r) => `${r?.fruit}` },
      { label: 'stack.length === 2', check: (r) => r?.stack?.length === 2, failMsg: (r) => `${r?.stack?.length}` },
      { label: "stack 不再包含 '🍇'", check: (r) => !r?.stack?.includes('🍇'), failMsg: () => "still has 🍇" },
    ],
    stackKey: 'stack',
  },
  // L3: 瀏覽器歷史紀錄
  {
    id: 2,
    title: '關卡 3：瀏覽器歷史紀錄',
    template: `const history = [];\nhistory.push('google.com');\nhistory.push('youtube.com');\nhistory.push('github.com');\nconst removed = history.pop();\nconst currentPage = history[history.length - 1];\nreturn { history, removed, currentPage };`,
    testCases: [
      { label: "removed === 'github.com'", check: (r) => r?.removed === 'github.com', failMsg: (r) => `${r?.removed}` },
      { label: "currentPage === 'youtube.com'", check: (r) => r?.currentPage === 'youtube.com', failMsg: (r) => `${r?.currentPage}` },
      { label: 'history.length === 2', check: (r) => r?.history?.length === 2, failMsg: (r) => `${r?.history?.length}` },
      {
        label: "history 為 ['google.com', 'youtube.com']",
        check: (r) => r?.history?.[0] === 'google.com' && r?.history?.[1] === 'youtube.com',
        failMsg: (r) => `${JSON.stringify(r?.history)}`,
      },
    ],
    stackKey: 'history',
  },
  // L4: Figma 連續 Undo
  {
    id: 3,
    title: '關卡 4：Figma 連續 Undo',
    template: `const undoStack = [];\nundoStack.push('畫矩形');\nundoStack.push('改顏色');\nundoStack.push('移動位置');\nconst undone1 = undoStack.pop();\nconst undone2 = undoStack.pop();\nreturn { undoStack, undone1, undone2 };`,
    testCases: [
      { label: "undone1 === '移動位置'", check: (r) => r?.undone1 === '移動位置', failMsg: (r) => `${r?.undone1}` },
      { label: "undone2 === '改顏色'", check: (r) => r?.undone2 === '改顏色', failMsg: (r) => `${r?.undone2}` },
      { label: 'undoStack.length === 1', check: (r) => r?.undoStack?.length === 1, failMsg: (r) => `${r?.undoStack?.length}` },
      { label: "undoStack[0] === '畫矩形'", check: (r) => r?.undoStack?.[0] === '畫矩形', failMsg: (r) => `${r?.undoStack?.[0]}` },
    ],
    stackKey: 'undoStack',
  },
  // L5: Undo 修正
  {
    id: 4,
    title: '關卡 5：Undo 修正',
    template: `const stack = ['3', '+', '7'];\nstack.pop();\nstack.push('5');\nreturn stack;`,
    testCases: [
      { label: 'stack.length === 3', check: (r) => r?.length === 3, failMsg: (r) => `${r?.length}` },
      { label: "stack 不包含 '7'", check: (r) => !r?.includes('7'), failMsg: () => "still has '7'" },
      { label: "stack[2] === '5'", check: (r) => r?.[2] === '5', failMsg: (r) => `${r?.[2]}` },
      {
        label: "stack 為 ['3', '+', '5']",
        check: (r) => r?.[0] === '3' && r?.[1] === '+' && r?.[2] === '5',
        failMsg: (r) => `${JSON.stringify(r)}`,
      },
    ],
    stackKey: null,
  },
  // L6: 用 Stack 計算
  {
    id: 5,
    title: '關卡 6：用 Stack 計算',
    template: `const stack = ['3', '+', '5'];\nconst b = stack.pop();\nconst op = stack.pop();\nconst a = stack.pop();\nconst result = Number(a) + Number(b);\nreturn { a, op, b, result, stack };`,
    testCases: [
      { label: "b === '5'", check: (r) => r?.b === '5', failMsg: (r) => `${r?.b}` },
      { label: "op === '+'", check: (r) => r?.op === '+', failMsg: (r) => `${r?.op}` },
      { label: "a === '3'", check: (r) => r?.a === '3', failMsg: (r) => `${r?.a}` },
      { label: 'result === 8', check: (r) => r?.result === 8, failMsg: (r) => `${r?.result}` },
      { label: 'stack.length === 0', check: (r) => r?.stack?.length === 0, failMsg: (r) => `${r?.stack?.length}` },
    ],
    stackKey: 'stack',
    forbiddenPatterns: ['.reverse()'],
  },
  // L7: 完整計算機
  {
    id: 6,
    title: '關卡 7：完整計算機',
    template: `const stack = [];\nstack.push('8');\nstack.push('-');\nstack.push('3');\nconst b = stack.pop();\nconst op = stack.pop();\nconst a = stack.pop();\nconst result = Number(a) - Number(b);\nstack.push(result);\nreturn { a, op, b, result, stack };`,
    testCases: [
      { label: "a === '8'", check: (r) => r?.a === '8', failMsg: (r) => `${r?.a}` },
      { label: "op === '-'", check: (r) => r?.op === '-', failMsg: (r) => `${r?.op}` },
      { label: "b === '3'", check: (r) => r?.b === '3', failMsg: (r) => `${r?.b}` },
      { label: 'result === 5', check: (r) => r?.result === 5, failMsg: (r) => `${r?.result}` },
      { label: 'stack.length === 1', check: (r) => r?.stack?.length === 1, failMsg: (r) => `${r?.stack?.length}` },
      { label: 'stack[0] === 5', check: (r) => r?.stack?.[0] === 5, failMsg: (r) => `${r?.stack?.[0]}` },
    ],
    stackKey: 'stack',
    forbiddenPatterns: ['.reverse()'],
  },
]

// ============================================================
// 模擬遊戲引擎：跟 StackPracticeSlide.vue 的 runCode() 邏輯一致
// ============================================================

interface RunResult {
  success: boolean
  error?: string
  testResults?: { label: string; passed: boolean; msg: string }[]
  allPassed?: boolean
  resultStack?: unknown[]
}

function runCode(src: string, level: Level): RunResult {
  // 1) ___ 佔位符偵測
  if (src.includes('___')) {
    return { success: false, error: '程式碼中還有 ___ 沒有填寫完喔！' }
  }

  // 2) 禁用語法偵測
  if (level.forbiddenPatterns) {
    for (const pat of level.forbiddenPatterns) {
      if (src.includes(pat)) {
        return { success: false, error: `不能用 ${pat}` }
      }
    }
  }

  // 3) 執行程式碼
  let result: unknown
  try {
    const fn = new Function(src)
    result = fn()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return { success: false, error: `執行錯誤：${msg}` }
  }

  // 4) 擷取 stack 做視覺化
  const key = level.stackKey
  const stackArr = key ? (result as Record<string, unknown>)?.[key] : result
  const resultStack = Array.isArray(stackArr) ? stackArr : []

  // 5) 跑 test cases
  const testResults: { label: string; passed: boolean; msg: string }[] = []
  let allPassed = true
  for (const tc of level.testCases) {
    let ok = false
    let msg = ''
    try {
      ok = tc.check(result)
      if (!ok) msg = tc.failMsg(result)
    } catch {
      ok = false
      msg = '驗證失敗'
    }
    testResults.push({ label: tc.label, passed: ok, msg })
    if (!ok) allPassed = false
  }

  return { success: true, testResults, allPassed, resultStack }
}

// ============================================================
// 正確答案（每關學生需要填入的程式碼）
// ============================================================

const correctAnswers: Record<number, string> = {
  0: `const stack = [];
stack.push(10);
stack.push(20);
stack.push(30);
return stack;`,

  1: `const stack = ['🍎', '🍌', '🍇'];
const fruit = stack.pop();
return { stack, fruit };`,

  2: `const history = [];
history.push('google.com');
history.push('youtube.com');
history.push('github.com');
const removed = history.pop();
const currentPage = history[history.length - 1];
return { history, removed, currentPage };`,

  3: `const undoStack = [];
undoStack.push('畫矩形');
undoStack.push('改顏色');
undoStack.push('移動位置');
const undone1 = undoStack.pop();
const undone2 = undoStack.pop();
return { undoStack, undone1, undone2 };`,

  4: `const stack = ['3', '+', '7'];
stack.pop();
stack.push('5');
return stack;`,

  5: `const stack = ['3', '+', '5'];
const b = stack.pop();
const op = stack.pop();
const a = stack.pop();
const result = Number(a) + Number(b);
return { a, op, b, result, stack };`,

  6: `const stack = [];
stack.push('8');
stack.push('-');
stack.push('3');
const b = stack.pop();
const op = stack.pop();
const a = stack.pop();
const result = Number(a) - Number(b);
stack.push(result);
return { a, op, b, result, stack };`,
}

// ============================================================
// 刻意寫錯的答案（用來確認 test cases 能正確抓到錯誤）
// ============================================================

const wrongAnswers: Record<number, { code: string; desc: string }> = {
  0: {
    code: `const stack = [];\nstack.push(10);\nstack.push(20);\nreturn stack;`,
    desc: '只 push 兩個數字，少了 30',
  },
  1: {
    code: `const stack = ['🍎', '🍌', '🍇'];\nconst fruit = '🍇';\nreturn { stack, fruit };`,
    desc: '直接賦值而非 pop()，stack 長度仍為 3',
  },
  2: {
    code: `const history = [];\nhistory.push('google.com');\nhistory.push('youtube.com');\nhistory.push('github.com');\nconst removed = 'github.com';\nconst currentPage = history[history.length - 1];\nreturn { history, removed, currentPage };`,
    desc: '沒有真的 pop，history 仍有 3 個元素',
  },
  4: {
    code: `const stack = ['3', '+', '7'];\nstack.push('5');\nreturn stack;`,
    desc: '只 push 沒 pop，stack 有 4 個元素',
  },
  5: {
    code: `const stack = ['3', '+', '5'];\nconst b = stack.pop();\nconst op = stack.pop();\nconst a = stack.pop();\nconst result = Number(a) - Number(b);\nreturn { a, op, b, result, stack };`,
    desc: '用了減號而非加號，result 應為 8 但得到 -2',
  },
}

// ============================================================
// Tests
// ============================================================

describe('Stack 實戰練習 — 遊戲邏輯', () => {
  // --- 每關正確答案全部通過 ---
  describe('正確答案通過所有 test cases', () => {
    levels.forEach((level) => {
      it(`L${level.id + 1}: ${level.title}`, () => {
        const code = correctAnswers[level.id]
        const result = runCode(code, level)

        expect(result.success).toBe(true)
        expect(result.allPassed).toBe(true)
        expect(result.testResults?.every((t) => t.passed)).toBe(true)
      })
    })
  })

  // --- 刻意寫錯的答案不通過 ---
  describe('錯誤答案不通過', () => {
    Object.entries(wrongAnswers).forEach(([id, { code, desc }]) => {
      const level = levels[Number(id)]
      it(`L${level.id + 1}: ${desc}`, () => {
        const result = runCode(code, level)

        expect(result.success).toBe(true) // 程式碼本身可執行
        expect(result.allPassed).toBe(false) // 但 test cases 不全過
      })
    })
  })

  // --- ___ 佔位符偵測 ---
  describe('___ 佔位符偵測', () => {
    it('包含 ___ 的程式碼應回傳錯誤而非執行', () => {
      const codeWithPlaceholder = `const stack = ['🍎', '🍌', '🍇'];\nconst fruit = ___\nreturn { stack, fruit };`
      const result = runCode(codeWithPlaceholder, levels[1])

      expect(result.success).toBe(false)
      expect(result.error).toContain('___')
    })

    it('正確替換 ___ 後應正常執行', () => {
      const result = runCode(correctAnswers[1], levels[1])
      expect(result.success).toBe(true)
      expect(result.allPassed).toBe(true)
    })
  })

  // --- 禁用語法偵測 ---
  describe('禁用語法偵測', () => {
    it('L6: 使用 .reverse() 應被拒絕', () => {
      const codeWithReverse = `const stack = ['3', '+', '5'];\nstack.reverse();\nconst a = stack.pop();\nconst op = stack.pop();\nconst b = stack.pop();\nconst result = Number(a) + Number(b);\nreturn { a, op, b, result, stack };`
      const result = runCode(codeWithReverse, levels[5])

      expect(result.success).toBe(false)
      expect(result.error).toContain('.reverse()')
    })

    it('L7: 使用 .reverse() 應被拒絕', () => {
      const codeWithReverse = `const stack = [];\nstack.push('8');\nstack.push('-');\nstack.push('3');\nstack.reverse();\nconst a = stack.pop();\nconst op = stack.pop();\nconst b = stack.pop();\nconst result = Number(a) - Number(b);\nstack.push(result);\nreturn { a, op, b, result, stack };`
      const result = runCode(codeWithReverse, levels[6])

      expect(result.success).toBe(false)
      expect(result.error).toContain('.reverse()')
    })

    it('L1: 沒有 forbiddenPatterns 的關卡不受限', () => {
      const codeL1 = `const stack = [10, 20, 30];\nreturn stack;`
      const result = runCode(codeL1, levels[0])
      expect(result.success).toBe(true)
    })
  })

  // --- 語法錯誤處理 ---
  describe('語法錯誤處理', () => {
    it('語法錯誤的程式碼應回傳執行錯誤', () => {
      const badCode = `const stack = [;\nreturn stack;`
      const result = runCode(badCode, levels[0])

      expect(result.success).toBe(false)
      expect(result.error).toContain('執行錯誤')
    })

    it('runtime error 應回傳執行錯誤', () => {
      const runtimeError = `const stack = [];\nstack.undefinedMethod();\nreturn stack;`
      const result = runCode(runtimeError, levels[0])

      expect(result.success).toBe(false)
      expect(result.error).toContain('執行錯誤')
    })
  })

  // --- 星星計算 ---
  describe('星星計算', () => {
    function calcStars(hintsUsed: number): 1 | 2 | 3 {
      if (hintsUsed === 0) return 3
      if (hintsUsed === 1) return 2
      return 1
    }

    it('0 提示 = 3 星', () => expect(calcStars(0)).toBe(3))
    it('1 提示 = 2 星', () => expect(calcStars(1)).toBe(2))
    it('2 提示 = 1 星', () => expect(calcStars(2)).toBe(1))
    it('3 提示 = 1 星', () => expect(calcStars(3)).toBe(1))
  })

  // --- Stack 視覺化擷取 ---
  describe('Stack 視覺化資料擷取', () => {
    it('stackKey: null → result 本身為陣列', () => {
      const result = runCode(correctAnswers[0], levels[0])
      expect(result.resultStack).toEqual([10, 20, 30])
    })

    it("stackKey: 'stack' → 從結果物件中提取", () => {
      const result = runCode(correctAnswers[1], levels[1])
      expect(result.resultStack).toEqual(['🍎', '🍌'])
    })

    it("stackKey: 'history' → 提取 history 陣列", () => {
      const result = runCode(correctAnswers[2], levels[2])
      expect(result.resultStack).toEqual(['google.com', 'youtube.com'])
    })

    it("stackKey: 'undoStack' → 提取 undoStack 陣列", () => {
      const result = runCode(correctAnswers[3], levels[3])
      expect(result.resultStack).toEqual(['畫矩形'])
    })

    it('L6: stack 計算後應為空', () => {
      const result = runCode(correctAnswers[5], levels[5])
      expect(result.resultStack).toEqual([])
    })

    it('L7: stack 計算後應有結果 5', () => {
      const result = runCode(correctAnswers[6], levels[6])
      expect(result.resultStack).toEqual([5])
    })
  })

  // --- 關卡連貫性 ---
  describe('關卡連貫性', () => {
    it('共有 7 個關卡', () => {
      expect(levels.length).toBe(7)
    })

    it('每關都有 correctAnswer', () => {
      levels.forEach((level) => {
        expect(correctAnswers[level.id]).toBeDefined()
      })
    })

    it('關卡 id 從 0 到 6 連續', () => {
      levels.forEach((level, i) => {
        expect(level.id).toBe(i)
      })
    })

    it('每關至少有 3 個 test cases', () => {
      levels.forEach((level) => {
        expect(level.testCases.length).toBeGreaterThanOrEqual(3)
      })
    })

    it('只有 L6 和 L7 有 forbiddenPatterns', () => {
      expect(levels[0].forbiddenPatterns).toBeUndefined()
      expect(levels[1].forbiddenPatterns).toBeUndefined()
      expect(levels[2].forbiddenPatterns).toBeUndefined()
      expect(levels[3].forbiddenPatterns).toBeUndefined()
      expect(levels[4].forbiddenPatterns).toBeUndefined()
      expect(levels[5].forbiddenPatterns).toEqual(['.reverse()'])
      expect(levels[6].forbiddenPatterns).toEqual(['.reverse()'])
    })
  })

  // --- 完整流程模擬 ---
  describe('完整流程模擬（L1~L7 連續通關）', () => {
    it('依序通過所有關卡，模擬完整遊玩體驗', () => {
      const progress: Record<number, { passed: boolean; stars: number }> = {}

      for (let i = 0; i < levels.length; i++) {
        const level = levels[i]
        const code = correctAnswers[i]
        const result = runCode(code, level)

        expect(result.success).toBe(true)
        expect(result.allPassed).toBe(true)

        // 0 提示 = 3 星
        progress[i] = { passed: true, stars: 3 }
      }

      // 全部通關
      const allPassed = levels.every((_, i) => progress[i]?.passed)
      expect(allPassed).toBe(true)

      // 全 3 星
      const totalStars = Object.values(progress).reduce((s, p) => s + p.stars, 0)
      expect(totalStars).toBe(21) // 7 × 3
    })
  })
})
