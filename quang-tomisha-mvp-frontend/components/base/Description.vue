<script>
export default {
  props: {
    text: { type: String, default: '' },
    quote: Boolean,
  },
  render(h) {
    return h(
      'div',
      {
        on: this.$listeners,
        class: ['base-description', this.quote ? 'is-quote' : ''],
      },
      this.text?.trim?.() || ''
    )
  },
}
</script>

<style lang="scss">
.base-description {
  @apply whitespace-pre-wrap;

  &.is-quote {
    @apply text-gray-600 relative pl-4;

    &::before {
      content: '';
      @apply absolute block left-0 top-0 bottom-0 rounded-sm w-1 bg-teal-700;
    }
  }
}
</style>
