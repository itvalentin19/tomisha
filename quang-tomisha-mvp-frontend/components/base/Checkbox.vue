<template>
  <div class="b-checkbox flex items-center relative group">
    <label class="relative h-7 w-7 flex-shrink-0">
      <input
        :checked="tmp"
        :type="$attrs.type || 'checkbox'"
        v-bind="value !== undefined ? { ...$attrs, value } : $attrs"
        class="invisible absolute"
        v-on="$utils.except($listeners, ['change', 'input'])"
        @change="toggle"
      />

      <span
        class="b-checkbox__check w-full h-full flex items-center justify-center bg-white rounded-full cursor-pointer"
        :class="[inputClass]"
      />
    </label>

    <div
      v-if="label"
      class="pl-3 whitespace-no-wrap truncate cursor-pointer group-hover:underline disabled:cursor-default disabled:no-underline"
      :class="[labelClass]"
      @click="!disableLabel && toggle()"
    >
      {{ label }}
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: { type: [Array, Boolean, String], default: null },
    value: { type: String, default: undefined },
    label: { type: String, default: '' },
    labelClass: { type: String, default: '' },
    inputClass: { type: String, default: 'border-2 border-gray-400' },
    type: { type: String, default: 'checkbox' },
    disableLabel: Boolean,
  },
  computed: {
    isArrayValue() {
      return Array.isArray(this.checked)
    },
    tmp: {
      get() {
        return this.isArrayValue
          ? this.checked.includes(this.value)
          : this.checked
      },
      set(v) {
        if (this.isArrayValue) {
          const i = this.checked.indexOf(this.value)
          const checked = this.checked.slice()
          if (i === -1) {
            checked.push(this.value)
          } else {
            checked.splice(i, 1)
          }
          this.$emit('change', checked)
        } else {
          this.$emit('change', v)
        }
      },
    },
  },
  methods: {
    toggle() {
      this.tmp = this.isArrayValue ? this.value : !this.tmp
    },
  },
}
</script>

<style lang="scss">
.b-checkbox {
  &__check {
    &::after {
      content: '';
      top: -1px;
      left: 0px;
      width: 11px;
      height: 7px;
      @apply relative hidden border-3 border-r-0 border-t-0 border-teal-600 transform -rotate-45;
    }
  }

  input {
    &:checked + .b-checkbox__check {
      @apply bg-gray-100;

      &::after {
        @apply block;
      }
    }
  }
}
</style>
