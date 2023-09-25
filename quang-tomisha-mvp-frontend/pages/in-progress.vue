<template>
  <layout-full :items="pages">
    <nuxt-child />
  </layout-full>
</template>

<script>
export default {
  layout: 'basic',
  data() {
    return {
      pages: [
        { text: 'Vorstellungsgespräch', to: 'interviews' },
        { text: 'Jobangebot', to: 'offers' },
      ].map((page) => ({
        ...page,
        to: `/in-progress/${page.to}`,
      })),
    }
  },
  middleware({ route, redirect }) {
    if (route.name === 'in-progress') {
      return redirect('/in-progress/interviews')
    }
  },
  head() {
    return {
      title: this.job?.title || '',
    }
  },
}
</script>
