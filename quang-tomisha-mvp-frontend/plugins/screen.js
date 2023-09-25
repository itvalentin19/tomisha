import Vue from 'vue'

const sizes = Vue.observable({
  // eslint-disable-next-line
  sm: false, md: false, lg: false, xl: false,
  // eslint-disable-next-line
  smOnly: false, mdOnly: false, lgOnly: false,
  // eslint-disable-next-line
  smDown: false, mdDown: false, lgDown: false, xlDown: false,
})

if (process.client) {
  handleSizeChange()

  window.addEventListener('resize', handleSizeChange)
}

function handleSizeChange() {
  const w = window.innerWidth
  if (w < 640) {
    Object.assign(sizes, update(['smDown', 'mdDown', 'lgDown', 'xlDown']))
  } else if (w < 768) {
    Object.assign(sizes, update(['sm', 'xlDown', 'lgDown', 'mdDown', 'smOnly']))
  } else if (w < 1024) {
    Object.assign(sizes, update(['md', 'sm', 'xlDown', 'lgDown', 'mdOnly']))
  } else if (w < 1280) {
    Object.assign(sizes, update(['lg', 'md', 'sm', 'xlDown', 'lgOnly']))
  } else {
    Object.assign(sizes, update(['xl', 'lg', 'md', 'sm']))
  }
}

function update(items) {
  Object.keys(sizes).forEach((k) => {
    sizes[k] = items.includes(k)
  })
}

Vue.prototype.$screen = sizes
