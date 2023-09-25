<template>
  <interview-table v-if="interviews.length" :interviews="interviews" />

  <common-empty v-else />
</template>

<script>
export default {
  props: {
    job: { type: Object, required: true },
  },
  asyncData({ route, $axios, $auth }) {
    return $axios
      .get('/interview', {
        params: {
          jobId: route.query.id,
          companyId: $auth.companyId,
        },
      })
      .then(({ items }) => ({ interviews: items }))
  },
  data() {
    return {
      interviews: [],
    }
  },
}
</script>
