<template>
  <application-table v-if="applications.length" :applications="applications" />

  <common-empty v-else />
</template>

<script>
import { JobLogAction } from '~/constants'
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
          status: JobLogAction.NO,
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
