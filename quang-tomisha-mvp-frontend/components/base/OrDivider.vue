<script>
export default {
  functional: true,
  render(h, ctx) {
    return h(
      'div',
      {
        class: ['text-center', ctx.data.staticClass],
      },
      [
        h(
          'span',
          {
            class: ['or-divider px-3 relative text-gray-600'],
          },
          'oder'
        ),
      ]
    )
  },
}
</script>

<style lang="scss">
.or-divider {
  &::before,
  &::after {
    content: '';
    height: 1px;
    top: 0.5rem;
    @apply bg-gray-400 block absolute w-24;
  }

  &::before {
    right: 100%;
  }

  &::after {
    left: 100%;
  }
}
</style>
