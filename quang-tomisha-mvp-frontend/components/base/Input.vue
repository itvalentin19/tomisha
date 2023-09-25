<template>
  <base-input-wrapper v-bind="$attrs" class="base-input" v-on="customListeners">
    <template #default="{ attrs, listeners, inputClass, validated, focused }">
      <div
        v-if="$slots.prepend"
        class="absolute left-0 bottom-0 h-12 max-h-full"
      >
        <slot name="prepend" />
      </div>

      <slot name="input">
        <input
          ref="input"
          class="bg-transparent h-12 max-h-full w-full px-5 text-black-800 placeholder-gray-400 disabled:bg-disabled focus:outline-none appearance-none duration-200"
          :class="[
            !hideAppend && (appendIcon || focused)
              ? validated
                ? 'pr-20'
                : 'pr-12'
              : '',
            attrs.readonly ? 'cursor-default' : '',
            inputClass,
          ]"
          v-bind="attrs"
          v-on="listeners"
          @keyup.esc="$emit('input', '')"
        />
      </slot>

      <div :class="[inputClass]" class="base-input__border" />

      <div
        v-if="!hideAppend"
        class="absolute right-0 bottom-0 h-12 max-h-full select-none text-right pointer-events-none"
        :class="[appendIcon || focused ? (validated ? 'w-20' : 'w-12') : '']"
      >
        <span
          v-if="validated"
          class="absolute left-0 top-0 bottom-0 w-12 inline-flex items-center justify-center"
        >
          <base-icon icon="check" class="text-teal-600 text-xs" />
        </span>

        <span
          class="h-full w-12 inline-flex items-center justify-center text-gray-600 overflow-hidden duration-200"
          :class="[
            !!appendIcon || focused ? '' : 'opacity-0 cursor-default',
            (!!appendIcon || !focused) &&
            (!$listeners.append || $attrs.disabled)
              ? 'pointer-events-none'
              : 'cursor-pointer pointer-events-auto',
          ]"
          @click.stop="onAppendClick"
        >
          <base-icon :icon="appendIcon || 'close'" />
        </span>
      </div>

      <span
        v-if="showCounter"
        class="absolute right-0 top-full mt-1 mr-1 text-sm text-gray-500"
      >
        {{ attrs.value ? attrs.value.length : '0' }}
      </span>
    </template>
  </base-input-wrapper>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    appendIcon: { type: String, default: null },
    showCounter: Boolean,
    hideAppend: Boolean,
    autofocus: Boolean,
  },
  computed: {
    customListeners() {
      const { prepend, append, ...listeners } = this.$listeners
      return listeners
    },
  },
  mounted() {
    if (this.autofocus) {
      this.focus()
    }
  },
  methods: {
    focus() {
      // eslint-disable-next-line no-unused-expressions
      this.$refs.input?.focus?.()
    },
    onAppendClick() {
      if (!this.appendIcon) {
        this.$emit('input', '')
        this.$emit('clear')
        this.focus()
      } else {
        this.$emit('append')
      }
    },
  },
}
</script>

<style lang="scss">
.base-input {
  input {
    &:hover,
    &:focus {
      + .base-input__border {
        opacity: 1;
      }
    }

    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type='number'] {
      -moz-appearance: textfield;
    }
  }

  &__border {
    @apply border-2 opacity-0 absolute h-12 left-0 right-0 bottom-0 pointer-events-none duration-200;
  }
}
</style>
