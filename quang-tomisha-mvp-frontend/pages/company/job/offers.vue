<template>
  <offer-table v-if="offers.length" :offers="offers" />

  <common-empty v-else />
</template>

<script>
export default {
  props: {
    job: { type: Object, required: true },
  },
  asyncData({ route, $axios, $auth }) {
    return $axios
      .get('/offer', {
        params: {
          jobId: route.query.id,
          companyId: $auth.companyId,
        },
      })
      .then(({ items }) => ({ offers: items }))
  },
  data() {
    return {
      offers: [],
    }
  },
}
</script>
