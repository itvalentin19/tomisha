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
        { text: 'Allgemein', to: '/settings/account' },
        { text: 'Datenschutz', to: '/settings/privacy' },
        { text: 'Benachrichtigung', to: '/settings/notification' },
      ],
    }
  },
}
</script>
