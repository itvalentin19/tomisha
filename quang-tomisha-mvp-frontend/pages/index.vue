<template>
  <layout-body v-if="$auth.isAuthenticated">
    <pending-notifications />

    <user-dashboard
      v-if="!$auth.companyId"
      :applications="applications"
      :job-groups="jobGroups"
    />

    <company-dashboard v-else :jobs="companyJobs" :total="totalCompanyJobs" />
  </layout-body>
</template>

<script>
export default {
  layout(ctx) {
    return ctx.$auth.isAuthenticated ? 'basic' : 'index'
  },
  auth: false,
  asyncData({ $axios, $auth, store }) {
    if ($auth.isAuthenticated) {
      const promises = [
        store.dispatch('notification/fetchNotifications', $auth.companyId),
      ]

      if ($auth.companyId) {
        promises.unshift(
          $axios.get('/job', {
            params: { companyId: $auth.companyId },
          })
        )
        return Promise.all(promises).then(([{ items, total }]) => ({
          companyJobs: items,
          totalCompanyJobs: total,
        }))
      } else {
        promises.unshift(
          $axios.get('/job/recommend'),
          $axios.get('/application/me')
        )
        return Promise.all(promises).then(
          ([jobGroups, { items: applications }]) => ({
            jobGroups,
            applications,
          })
        )
      }
    }
  },
  data() {
    return {
      jobGroups: [],
      applications: [],
      companyJobs: [],
      totalCompanyJobs: 0,
    }
  },
  head() {
    return this.$auth.isAuthenticated ? { title: 'Dashboard' } : {}
  },
}
</script>
