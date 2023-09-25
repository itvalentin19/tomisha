import Vue from 'vue'
import Component from './components/Alert'

export const types = {
  ERROR: 'error',
  SUCCESS: 'success',
  INFO: 'info',
}
const ERROR_TITLE = 'Fehler'
const SUCCESS_TITLE = 'Erfolgreich'
const NETWORK_ERR_TITLE = 'Information'
const NETWORK_ERR_NATIVE_MSG = 'Network Error'
const NETWORK_ERR_MSG =
  'Aktuell bist Du nicht mit dem Internet verbunden, überprüfe die Verbindung.'

const alert = Vue.observable({
  shown: false,
  type: 'success',
  title: '',
  text: '',
  timeout: null,
})

const close = () => {
  Object.assign(alert, { shown: false })
  alert.shown = false
}

const show = (type, opts) => {
  const isNetworkError = opts?.message === NETWORK_ERR_NATIVE_MSG

  const title = isNetworkError
    ? NETWORK_ERR_TITLE
    : opts?.title ||
      (type === types.ERROR
        ? ERROR_TITLE
        : type === types.SUCCESS
        ? SUCCESS_TITLE
        : '')

  const text = isNetworkError
    ? NETWORK_ERR_MSG
    : opts?.text ||
      (typeof opts === 'string'
        ? opts
        : opts instanceof Error
        ? opts.message
        : '')

  alert.timeout && clearTimeout(alert.timeout)

  Object.assign(alert, {
    shown: true,
    type: isNetworkError ? types.INFO : type,
    title,
    text,
    timeout: setTimeout(() => close(), 5000),
  })
}

const AlertComponent = Vue.extend({
  render(h) {
    return h(Component, {
      props: { alert },
      on: { close },
    })
  },
})

export default (ctx, inject) => {
  const component = new AlertComponent().$mount()
  document.body.appendChild(component.$el)

  inject('alert', {
    error(payload) {
      show(types.ERROR, payload)
    },
    success(payload) {
      show(types.SUCCESS, payload)
    },
  })
}
