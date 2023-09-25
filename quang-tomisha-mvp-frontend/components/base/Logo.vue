<script>
import logo from '@/assets/img/logo.svg'
export default {
  functional: true,
  props: {
    disabled: Boolean,
  },
  render(h, ctx) {
    return h(
      ctx.props.disabled ? 'div' : 'n-link',
      {
        props: {
          to: '/',
        },
        class: [
          'text-gray-600 text-4xl sm:text-5xl leading-tight select-none tracking-normal inline-flex items-center',
        ],
      },
      [
        h('img', {
          class: 'mr-3',
          attrs: {
            src: logo,
          },
        }),
        h('span', {}, 'tomisha'),
      ]
    )
  },
}
</script>
