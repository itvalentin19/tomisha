<template>
  <div ref="container">
    <slot />

    <div
      ref="bottom"
      class="h-0 opacity-0 pointer-events-none transform -translate-y-40"
    />
  </div>
</template>

<script>
export default {
  props: {
    items: { type: Array, default: () => [] },
    total: { type: Number, default: 0 },
    root: { type: Object, default: null },
    disabled: Boolean,
  },
  data() {
    return {
      observer: null,
      debounce: null,
    }
  },
  mounted() {
    this.debounce = this.$utils.createDebounce()
    this.observer = new IntersectionObserver(this.load, {
      root: this.root,
      threshold: 0,
    })
    this.observer.observe(this.$refs.bottom)
  },
  beforeDestroy() {
    this.observer?.disconnect?.()
  },
  methods: {
    load() {
      this.debounce(() => {
        if (
          !this.disabled &&
          this.$refs.container?.childElementCount > 1 &&
          this.items.length < this.total &&
          !this.$nuxt.$loading.show
        ) {
          this.$emit('load')
        }
      }, 100)
    },
  },
}
</script>
