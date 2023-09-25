<template>
  <layout-body wide>
    <interview-table v-if="interviews.length" :interviews="interviews" />

    <common-empty v-else />
  </layout-body>
</template>

<script>
export default {
  asyncData({ $axios, $auth }) {
    return $axios
      .get('/interview/', { params: { companyId: $auth.companyId } })
      .then(({ items }) => ({ interviews: items }))
  },
  data() {
    return {
      interviews: [],
    }
  },
  head: {
    title: 'Vorstellungsgespräch',
  },
}
</script>
