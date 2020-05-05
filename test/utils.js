export const sleep = (time) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, time)
})
