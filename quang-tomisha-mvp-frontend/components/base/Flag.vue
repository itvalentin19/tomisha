<script>
const images = {}
const req = require.context('~/assets/flags/', false, /\.png$/)
req.keys().forEach((filename) => {
  const countryCode = filename.substr(2, 2)
  images[countryCode] = req(filename)
})

export default {
  functional: true,
  render(h, { data, props }) {
    return h('img', {
      class: ['inline-block w-6', data.staticClass || '', data.class || ''],
      attrs: {
        src: images[props.code],
      },
    })
  },
}
</script>
