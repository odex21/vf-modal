import { hyphenate, camelize, stop, prevent } from '../src/utils'

describe('utils test', () => {
  it('hyphenate', () => {
    expect(hyphenate('abCd')).toBe('ab-cd')
  })

  it('hyphenate', () => {
    expect(camelize('ab-cd')).toBe('abCd')
  })

  it('stop', () => {
    expect(stop(new Event('touch'))).toBe(void 0)
  })

  it('prevent', () => {
    expect(prevent(new Event('touch'))).toBe(void 0)
  })
})
