<template>
  <div class="relative">
    <label
      v-if="label"
      :for="customId"
      class="mb-1 text-sm text-gray-600 block w-full select-none whitespace-no-wrap"
    >
      {{ label }}

      <span
        v-if="required || optional"
        class="inline-block mt-1 text-xs text-gray-400 float-right ml-2"
      >
        {{ required ? 'erforderlich' : 'ergänzend' }}
      </span>
    </label>

    <slot
      :attrs="{
        id: customId,
        value: temp,
        autocomplete: 'off',
        disabled,
        autofocus,
        ...$attrs,
      }"
      :validated="validated"
      :focused="focused"
      :listeners="customListeners"
      :input-class="errorMsg ? errorClass : inputClass"
    />

    <slide-y-up-transition>
      <div
        v-if="errorMsg"
        class="text-red-600 leading-none mt-1"
        :class="{ 'absolute top-full': floatError }"
        @click.stop
      >
        {{ errorMsg }}
      </div>
    </slide-y-up-transition>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    label: { type: String, default: '' },
    value: { type: [String, Number, Array, Object, Boolean], default: null },
    id: { type: String, default: '' },
    rules: { type: Array, default: () => [] },
    event: { type: String, default: 'input' },
    inputClass: {
      type: String,
      default: 'border border-gray-400 rounded-xl',
    },
    errorClass: {
      type: String,
      default: 'border-2 border-red-600 text-red-600 rounded-xl opacity-100',
    },
    floatError: { type: Boolean, default: true },
    disabled: Boolean,
    required: Boolean,
    optional: Boolean,
    autofocus: Boolean,
    // eslint-disable-next-line vue/require-prop-types
    validationValue: { default: undefined },
  },
  data: () => ({
    temp: null,
    errorMsg: '',
    focused: false,
  }),
  computed: {
    customId() {
      return this.id !== undefined ? this.id : Math.round(Math.random() * 99999)
    },
    customListeners() {
      const { input, ...listeners } = this.$listeners
      const output = Object.assign({}, listeners, {
        focus: (e) => {
          this.errorMsg = ''
          if (listeners.focus) {
            listeners.focus(e)
          }
          this.focused = true
        },
        blur: (e) => {
          if (listeners.blur) {
            listeners.blur(e)
          }
          setTimeout(() => {
            this.focused = false
          }, 200)
        },
      })

      if (this.event) {
        output[this.event] = ($event) => {
          this.onChange($event instanceof Event ? $event.target.value : $event)
        }
      }

      for (const key of Object.keys(output)) {
        if (key.startsWith('hook:')) {
          delete output[key]
        }
      }

      return output
    },
    validated() {
      const value =
        this.validationValue === undefined ? this.value : this.validationValue
      if (!value) return false

      if (this.rules && this.rules.length) {
        for (const rule of this.rules) {
          if (typeof rule !== 'function') continue

          const valid = rule(value)
          if (typeof valid === 'string' || valid === false) {
            return false
          }
        }
      }

      return true
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.temp = value
      },
    },
  },
  mounted() {
    if (this.autofocus) {
      // eslint-disable-next-line no-unused-expressions
      this.$parent.focus()
    }
  },
  methods: {
    onChange(value) {
      this.temp = value

      if (this.$listeners.input) {
        this.$listeners.input(value)
      }
    },
  },
}
</script>
