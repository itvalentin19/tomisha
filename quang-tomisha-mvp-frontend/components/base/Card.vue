<template>
  <div
    class="base-card rounded-xl relative duration-300"
    :class="{
      disabled,
      relative: dismissible || dismissFloat,
      'cursor-pointer': !disabled && !!$listeners.click,
      'p-6': !noPadding,
    }"
    v-on="$listeners"
  >
    <base-icon
      v-if="dismissible || dismissFloat"
      :icon="dismissFloat ? 'close-circle' : 'close'"
      class="absolute top-0 right-0 z-10 text-base cursor-pointer"
      :class="[
        dismissFloat
          ? 'text-teal-400 bg-white rounded-full -mt-2 -mr-2 transform hover:scale-120 duration-200'
          : 'mt-6 mr-6',
      ]"
      @click.stop="$emit('dismiss')"
    />

    <slot />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    disabled: Boolean,
    dismissible: Boolean,
    dismissFloat: Boolean,
    noPadding: Boolean,
  },
}
</script>

<style lang="scss">
.base-card {
  &::after {
    content: '';
    box-shadow: inset 0 0 1px 1px #cbd5e0;
    @apply block absolute inset-0 rounded-xl pointer-events-none duration-500;
  }

  &:not(.disabled) {
    &:hover::after {
      box-shadow: inset 0 0 1px 2px #cbd5e0, 0 0 1px 1px #cbd5e0;
    }
  }
}
</style>
