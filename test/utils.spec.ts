import { hyphenate, camelize, stop, prevent, callHook } from "../src/utils"

describe("utils test", () => {
  it("hyphenate", () => {
    expect(hyphenate("abCd")).toBe("ab-cd")
  })

  it("hyphenate", () => {
    expect(camelize("ab-cd")).toBe("abCd")
  })

  it("stop", () => {
    expect(stop(new Event("touch"))).toBe(void 0)
  })

  it("prevent", () => {
    expect(prevent(new Event("touch"))).toBe(void 0)
  })

  it("callHook", () => {
    let i = 0
    const testFunc = jest.fn(() => i++)
    callHook(testFunc)
    expect(testFunc).toBeCalled()
    expect(i).toBe(1)
    expect(callHook(undefined, 1)).toBe(void 0)

    const testFunc2 = (a: number) => i + a
    expect(callHook(testFunc2, 1)).toBe(2)
  })
})
