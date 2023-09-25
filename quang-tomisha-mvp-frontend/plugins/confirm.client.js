import Vue from 'vue'
import Component from './components/Confirm'

export default (ctx, inject) => {
  const defaultData = {
    shown: false,
    icon: '',
    iconColor: null,
    img: null,
    title: 'Confirmation',
    text: 'Are you sure?',
    html: null,
    actions: [],
    okText: '',
    cancelText: '',
    closeOnDone: true,
    dismissible: false,
    persistent: false,
    done() {},
    cancel() {},
  }

  const state = Vue.observable({ ...defaultData })

  const close = () => {
    Object.assign(state, defaultData)
  }

  const ConfirmComponent = Vue.extend({
    render(h) {
      return h(Component, {
        props: { state },
        on: {
          close,
        },
      })
    },
  })

  ctx.app.router.afterEach(() => {
    if (state.shown) {
      close()
    }
  })

  const component = new ConfirmComponent().$mount()
  document.body.appendChild(component.$el)

  inject('confirm', (data) => {
    Object.assign(state, data, { shown: true })
  })
}
