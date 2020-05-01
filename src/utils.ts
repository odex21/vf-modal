import { curry, find, memoizeWith, identity } from 'ramda'

export const findKey = curry((arr, key) => !!find(e => e === key, arr))
export const prevent = (e: Event) => e.preventDefault()
export const stop = (e: Event) => e.stopPropagation()

export const generateClass = (list: string[]) =>
  list.reduce((res, cur) => {
    res += ' ' + cur
    return res
  }, '')



// copy from vue3
const camelizeRE = /-(\w)/g
export const camelize = memoizeWith(identity,
  (str: string): string => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
  }
)

const hyphenateRE = /\B([A-Z])/g
export const hyphenate = memoizeWith(identity,
  (str: string): string => {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  }
)

