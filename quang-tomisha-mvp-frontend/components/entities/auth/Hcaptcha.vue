<template>
  <div>
    <div id="hcap-script" />
  </div>
</template>
<script>
const CaptchaScript = (cb) => {
  const script = document.createElement('script')
  script.src = 'https://hcaptcha.com/1/api.js?render=explicit'
  script.async = true

  script.addEventListener('load', cb, true)

  return script
}

export default {
  props: {
    theme: { type: String, default: '' },
    size: { type: String, default: '' },
    tabindex: { type: String, default: '' },
  },
  mounted() {
    if (typeof window.hcaptcha === 'undefined') {
      // if not loaded, create script tag, and wait to render hcaptcha element
      const script = CaptchaScript(this.onloadScript)
      let container = document.getElementById('hcap-script')

      if (document.getElementsByTagName('head').length > 0) {
        container = document.getElementsByTagName('head')[0]
      }

      container.appendChild(script) // append this here, this appends the tag to the start of the app.
    } else {
      this.onloadScript()
    }
  },
  methods: {
    onloadScript() {
      // set options for VueHcaptcha to be passed to the onload script
      const opt = {
        sitekey: process.env.NUXT_ENV_HCAPTCHA_KEY,
        theme: this.theme ? this.theme : '',
        size: this.size ? this.size : '',
        tabindex: this.tabindex ? this.tabindex : '',
        callback: this.onVerify,
        'expired-callback': this.onExpired,
        'error-callback': this.onError,
      }
      // Render hCaptcha widget and provide neccessary callbacks
      if (typeof window.hcaptcha !== 'undefined') {
        const hcaptcha = window.hcaptcha // convienence var to access
        const container = this.$slots.default ? this.$el.children[0] : this.$el
        this.$widgetId = hcaptcha.render(container, opt)
      }
    },
    onError(e) {
      if (window.hcaptcha === 'undefined') {
        return
      }

      this.$emit('error', e)
      this.reset() // reset the captcha
    },
    // let user handle the errors, etc
    onVerify(response) {
      this.$emit('verify', response)
    },
    onExpired() {
      if (typeof window.hcaptcha !== 'undefined') {
        window.hcaptcha.reset()
      }
      this.$emit('expired')
    },
    execute() {
      window.hcaptcha.execute(this.$widgetId)
    },
    reset() {
      window.hcaptcha.reset(this.$widgetId)
    },
  },
}
</script>
