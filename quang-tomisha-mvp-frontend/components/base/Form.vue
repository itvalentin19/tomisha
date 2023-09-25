<template>
  <form ref="form" v-bind="$attrs" v-on="customListeners">
    <slot />

    <!-- Enable enter key -->
    <input v-if="!hasSubmit" type="submit" class="invisible absolute h-0 w-0" />

    <slide-y-up-transition>
      <div v-if="errorMsg" class="mt-1 text-xs text-red-600">
        {{ errorMsg }}
      </div>
    </slide-y-up-transition>
  </form>
</template>

<script>
export default {
  props: {
    validateOnSubmit: { type: Boolean, default: true },
    rules: { type: Array, default: () => [] },
    isolated: Boolean,
    autofocus: Boolean,
    alertOnError: Boolean,
  },
  data() {
    return {
      isForm: true,
      temp: this.value,
      errorMsg: '',
      hasSubmit: true,
    }
  },
  computed: {
    customListeners() {
      const { submit, ...listeners } = this.$listeners
      return Object.assign(
        {
          submit: (e) => this.submit(e, submit),
        },
        listeners
      )
    },
  },
  mounted() {
    if (this.autofocus) this.focus()

    this.hasSubmit = !!this.$refs.form.querySelector('[type="submit"]')
  },
  methods: {
    submit(e, cb) {
      e && e.preventDefault()
      if (!this.validateOnSubmit || this.validate()) {
        if (cb) {
          cb(e)
        } else {
          this.$emit('submit', e)
        }
      }
    },
    focus() {
      const $firstInput = this.$el.querySelector(
        'input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
      )
      $firstInput && $firstInput.focus()
    },
    validate(children = this.$children, { scroll = true } = {}) {
      let valid = true
      let canScroll = scroll
      for (const child of children) {
        if (
          (!child.isForm || !child.isolated) &&
          !this.validate(child.$children, { scroll: canScroll })
        ) {
          valid = canScroll = false
        }

        if (!this.validateChild(child)) {
          if (canScroll && valid) {
            const el = child instanceof HTMLElement ? child : child.$el
            el && el.scrollIntoView && el.scrollIntoView({ behavior: 'smooth' })

            if (this.alertOnError) {
              this.$alert.error({
                title: 'Hoppla!',
                text: 'Leider wurden bei einem/einigen Eingabe(n) nicht wünschenswert ausgefüllt. Wir wissen, dass du das kannst! Versuch es erneut.',
              })
            }
          }

          valid = false
        }
      }
      return valid
    },
    resetValidation(children = this.$children) {
      for (const child of children) {
        this.resetValidation(child.$children)
        if (child.errorMsg) {
          child.errorMsg = ''
        }
      }
    },
    validateChild(child) {
      if (child.rules && !child.disabled && Array.isArray(child.rules)) {
        for (const rule of child.rules) {
          if (typeof rule !== 'function') continue

          const valid = rule(
            child.validationValue === undefined
              ? child.value
              : child.validationValue
          )
          if (typeof valid === 'string' || valid === false) {
            child.errorMsg = valid || 'Hoppla! Es ist ein Fehler aufgetreten'
            return false
          }
        }
        child.errorMsg = ''
      }
      return true
    },
  },
}
</script>
