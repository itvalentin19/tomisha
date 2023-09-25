<template>
  <layout-full :items="pages" :wide="$route.path.includes('/subscription')">
    <nuxt-child />
  </layout-full>
</template>

<script>
export default {
  data() {
    return {
      pages: [
        { text: 'Abos', to: 'subscription' },
        { text: 'Konto', to: 'account' },
      ].map((page) => ({
        ...page,
        to: `/company/settings/${page.to}`,
      })),
    }
  },
  middleware({ route, redirect }) {
    if (route.name === 'company-settings') {
      return redirect('/company/settings/subscription')
    }
  },
}
</script>
