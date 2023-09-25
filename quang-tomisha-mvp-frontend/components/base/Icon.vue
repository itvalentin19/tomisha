<script>
export default {
  props: {
    // Name of the icon, must be name of a svg file that exists in assets/icons directory
    icon: { type: String, default: null },
    hrefClass: { type: String, default: '' },
  },
  computed: {
    raw() {
      return this.icon ? this.importRawIcon(this.icon) : null
    },
  },
  methods: {
    importRawIcon(iconName) {
      if (process.server) {
        return null
      }

      let raw = null
      try {
        raw = require(`~/assets/icons/${iconName}.svg?raw`)
      } catch (e) {
        return raw
      }

      const $div = document.createElement('div')
      $div.innerHTML = raw

      return $div.firstElementChild
    },
  },
  render(h) {
    return h('svg', {
      on: this.$listeners,
      attrs: {
        viewBox: this.raw?.getAttribute?.('viewBox') || '0 0 20 20',
      },
      class: ['base-icon', this.hrefClass],
      domProps: {
        innerHTML: this.raw?.innerHTML,
      },
    })
  },
}
</script>

<style>
.base-icon {
  width: 1.4em;
  height: 1.4em;
  fill: currentColor;
  @apply inline;
}
</style>
