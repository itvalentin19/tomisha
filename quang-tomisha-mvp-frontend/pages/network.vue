<template>
  <layout-full :items="pages">
    <nuxt-child />
  </layout-full>
</template>

<script>
export default {
  layout: 'basic',
  asyncData({ $axios }) {
    return $axios.get('/contact/count').then(({ total }) => ({ total }))
  },
  data() {
    return {
      total: 0,
    }
  },
  computed: {
    pages() {
      return [
        { text: '+ Kontakte hinzufügen', to: '/network/new' },
        { text: 'Einladungen', to: '/network/invitations' },
        {
          text: (this.total || '') + ' Kontakke',
          to: '/network/contacts',
        },
        { text: 'Referenzen', to: '/network/references' },
        { text: '+ Referenzen hinzufügen', to: '/network/invite-reference' },
      ]
    },
  },
  middleware({ route, redirect }) {
    if (route.name === 'network') {
      return redirect('/network/invitations')
    }
  },
}
</script>
