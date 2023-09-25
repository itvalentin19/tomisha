<template>
  <application-table
    v-if="applications.length"
    :applications="applications.map((ap) => ({ ...ap, job }))"
    rejectable
  />

  <common-empty v-else />
</template>

<script>
export default {
  props: {
    job: { type: Object, required: true },
  },
  asyncData({ route, $axios, $auth }) {
    return $axios
      .get('/application', {
        params: {
          jobId: route.query.id,
          companyId: $auth.companyId,
        },
      })
      .then(({ items }) => ({ applications: items }))
  },
  data() {
    return {
      applications: [],
    }
  },
}
</script>
