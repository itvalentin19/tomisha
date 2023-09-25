<template>
  <layout-full :items="pages">
    <nuxt-child :profile="profile" />
  </layout-full>
</template>

<script>
export default {
  layout: 'basic',
  asyncData({ $axios, $auth }) {
    return $axios
      .get('/user/' + $auth.user.slug)
      .then((profile) => ({ profile }))
  },
  data() {
    return {
      pages: [
        { text: 'Lebenslauf', to: '/me/profile' },
        { text: 'Berufe', to: '/me/occupations' },
      ],
      profile: null,
    }
  },
}
</script>
