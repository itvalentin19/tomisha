<template>
  <layout-full :items="pages">
    <template v-if="!$auth.activePlan" #default>
      <common-inactive-subscription />
    </template>

    <template v-else #body>
      <nuxt-child />
    </template>
  </layout-full>
</template>

<script>
export default {
  data() {
    return {
      pages: [
        { text: 'Vorstellungsgespräch', to: 'interviews' },
        { text: 'Job', to: 'offers' },
      ].map((page) => ({
        ...page,
        to: `/agency/in-progress/${page.to}`,
      })),
    }
  },
  middleware({ route, redirect }) {
    if (route.name === 'agency-in-progress') {
      return redirect('/agency/in-progress/interviews')
    }
  },
}
</script>
