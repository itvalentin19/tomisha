<template>
  <label class="b__switch">
    <slot name="label">
      <span v-if="label" class="mr-4 text-sm text-gray-600 block">
        {{ label }}
      </span>
    </slot>

    <input
      v-model="temp"
      v-bind="$attrs"
      type="checkbox"
      class="opacity-0 w-0 h-0"
    />
    <span class="b__switch__slider" />
  </label>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: { type: [Boolean, Array], required: true },
    label: { type: String, default: null },
  },
  computed: {
    temp: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.b__switch {
  @apply relative flex justify-between items-center;

  &__slider {
    @apply relative w-14 h-7 box-content rounded-full border border-gray-400 bg-red-200 duration-300;

    &::before {
      content: '';
      @apply h-7 w-7 block left-0 top-0 ml-0 rounded-full bg-red-400 duration-300 absolute z-10;
    }
  }
  input {
    &:checked + .b__switch__slider {
      @apply bg-teal-200;
      &::before {
        @apply bg-teal-400 ml-7;
      }
    }

    &:disabled + .b__switch__slider {
      @apply cursor-not-allowed;
    }
  }
}
</style>
