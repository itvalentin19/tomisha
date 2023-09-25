import { createThrottle } from './utils'

const throttle = createThrottle()

_set()

window.addEventListener('resize', _set)

function _set() {
  throttle(() => {
    const vh = window.innerHeight / 100
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }, 25)
}
