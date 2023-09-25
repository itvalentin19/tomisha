<template>
  <button
    :type="type"
    v-bind="attrs"
    class="base-button"
    :class="{
      secondary,
      primary,
      danger,
      relative: !!to,
      'is-inline': inline,
    }"
    v-on="listeners"
    @click="onClick"
  >
    <base-spinner v-if="isLoading" />

    <template v-else>
      <base-icon
        v-if="icon"
        :icon="icon"
        :class="{ 'mr-4': !!$slots.default }"
      />

      <span :class="{ 'pointer-events-none': attrs.disabled }">
        <slot />
      </span>
    </template>

    <n-link v-if="to" :to="to" class="absolute inset-0" />
  </button>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    primary: Boolean,
    secondary: Boolean,
    danger: Boolean,
    inline: Boolean,
    loading: Boolean,
    icon: { type: String, default: null },
    to: { type: String, default: null },
    type: { type: String, default: 'button' },
    disabledOnLoading: Boolean,
  },
  computed: {
    listeners() {
      const { click, ...listeners } = this.$listeners
      return listeners
    },
    attrs() {
      const { disabled, ...attrs } = this.$attrs
      if (
        disabled ||
        this.loading ||
        (this.disabledOnLoading && this.$nuxt?.$loading?.show)
      ) {
        attrs.disabled = true
      }
      return attrs
    },
    isLoading() {
      return (
        this.loading || (this.disabledOnLoading && this.$nuxt?.$loading?.show)
      )
    },
  },
  methods: {
    onClick(e) {
      this.$emit('click', e)
    },
  },
}
</script>

<style lang="scss">
.base-button {
  @apply justify-center items-center leading-tight rounded-xl px-4 text-base text-center truncate appearance-none font-semibold duration-300 tracking-wider select-none;

  &:focus {
    @apply outline-none shadow-outline;
  }

  &:disabled {
    @apply cursor-default;
  }

  &:not(.primary):not(.secondary):not(.danger) {
    @apply text-btn-normal;

    &:hover {
      @apply text-teal-500 underline;
    }

    &:focus {
      @apply shadow-none;
    }
  }

  &:not(.is-inline) {
    @apply flex w-full;
  }

  &.is-inline {
    @apply inline-flex;
  }

  &.primary {
    @apply h-12 text-teal-100 bg-gradient-r-primary;

    &:hover {
      @apply bg-gradient-r-primary--hover;
    }

    &:active {
      @apply bg-gradient-r-primary--active;
    }

    &:disabled {
      @apply bg-gradient-r-primary--disabled text-teal-600;
    }
  }

  &.secondary {
    @apply h-12 text-teal-600 border border-solid border-gray-400 bg-white;

    &:hover {
      @apply bg-teal-100;
    }

    &:active {
      @apply bg-teal-200;
    }

    &:disabled {
      @apply bg-gray-400;
    }
  }

  &.danger {
    @apply text-red-600 uppercase;

    &:hover {
      @apply text-red-600;
    }
  }
}
</style>
