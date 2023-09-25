<template>
  <layout-body wide>
    <offer-table v-if="offers.length" :offers="offers" />

    <common-empty v-else />
  </layout-body>
</template>

<script>
export default {
  asyncData({ $axios, $auth }) {
    return $axios
      .get('/offer/', { params: { companyId: $auth.companyId } })
      .then(({ items }) => ({ offers: items }))
  },
  data() {
    return {
      offers: [],
    }
  },
  head: {
    title: 'Job',
  },
}
</script>
