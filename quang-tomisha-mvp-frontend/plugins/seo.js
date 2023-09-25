import Vue from 'vue'

const SUFFIX = 'Tomisha | '
const HOST = 'https://tomisha.io'

const metaTypes = {
  title: [0, 1, 2],
  viewport: [0],
  type: [1],
  description: [0, 1, 2],
  image: [1, 2],
  keywords: [0],
}

const _metaGenerators = [
  (name, content) => ({ hid: name, name, content }),
  (name, content) => {
    const property = 'og:' + name
    return { hid: property, property, content }
  },
  (prop, content) => {
    const name = 'twitter:' + prop
    return { hid: name, name, content }
  },
]

Vue.prototype.$seo = function (meta) {
  const { noindex, url = this.$route.path, ...others } = meta

  if (!others.title.startsWith(SUFFIX)) {
    others.title = SUFFIX + others.title
  }

  const unread = process.client ? this.$store.state.me.unread : null

  const head = {
    title: (unread ? `(${unread}) ` : '') + others.title,
    meta: [_metaGenerators[1]('url', HOST + url)],
  }

  if (noindex) {
    head.meta.push({ name: 'robots', content: 'noindex' })
  }

  for (const prop in others) {
    metaTypes[prop] &&
      metaTypes[prop].forEach((i) => {
        head.meta.push(_metaGenerators[i](prop, others[prop]))
      })
  }

  return head
}
