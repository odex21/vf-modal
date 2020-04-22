import { curry, find } from 'ramda'

const findKey = curry((arr, key) => !!find(e => e === key, arr))
const prevent = (e: Event) => e.preventDefault()
const stop = (e: Event) => e.stopPropagation()

const generateClass = (list: string[]) =>
  list.reduce((res, cur) => {
    res += ' ' + cur
    return res
  }, '')

export {
  findKey,
  prevent,
  stop,
  generateClass
}
