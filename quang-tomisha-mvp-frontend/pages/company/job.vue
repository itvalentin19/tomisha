<template>
  <layout-full v-if="job" wide :items="pages">
    <template #top>
      <n-link
        class="px-6 pt-4 pb-5 text-blue-600 font-semibold cursor-pointer flex items-center overflow-hidden rounded-b-xl"
        to="/company/jobs"
      >
        <base-icon
          icon="chevron-down"
          class="transform rotate-90 flex-shrink-0 mr-2 text-xs"
        />

        <span class="truncate">
          {{ job.title }}
        </span>
      </n-link>
    </template>

    <common-inactive-subscription
      v-if="!$route.path.includes('detail') && !$auth.activePlan"
    />

    <nuxt-child v-else :job="job" />
  </layout-full>
</template>

<script>
export default {
  layout: 'basic',
  asyncData({ $axios, route }) {
    return $axios.get('/job/detail/' + route.query.id).then((job) => ({ job }))
  },
  data() {
    return {
      pages: [
        { text: 'Jobinserat', to: 'detail' },
        { text: 'Neue Kandidaten', to: 'applications' },
        { text: 'Vorstellungsgespräche', to: 'interviews' },
        { text: 'Einstellen', to: 'offers' },
        { text: 'Absage', to: 'reject' },
      ].map((page) => ({
        ...page,
        to: `/company/job/${page.to}?id=${this.$route.query.id}`,
      })),
      job: null,
    }
  },
  middleware({ route, redirect }) {
    if (!route.query.id) {
      return redirect('/company/jobs')
    } else if (route.name === 'company-job') {
      return redirect({
        path: '/company/job/applications',
        query: this.$route.query,
      })
    }
  },
  head() {
    return {
      title: this.job?.title || '',
    }
  },
}
</script>
