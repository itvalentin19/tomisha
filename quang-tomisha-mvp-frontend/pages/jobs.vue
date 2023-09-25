<template>
  <layout-full v-model="professionId" :items="pages" exact>
    <job-filter class="mb-6" @done="findJobs" />

    <template v-if="jobs.length">
      <base-infinite-scroll :items="jobs" :total="total" @load="findJobs">
        <n-link
          v-for="item in jobs"
          :key="item.id"
          :to="'/job/' + item.slug"
          class="block mb-6"
        >
          <job-card :job="item" />
        </n-link>
      </base-infinite-scroll>
    </template>

    <common-empty v-else />
  </layout-full>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  layout: 'basic',
  async fetch({ store }) {
    await store.dispatch('job/findJobs')
  },
  computed: {
    ...mapState('job', ['jobs', 'total']),

    professionId: {
      get() {
        return +this.$route.query.professionId || ''
      },
      set(professionId) {
        this.$router.push(
          {
            path: '/jobs',
            query: this.$utils.filterObject({
              ...this.$route.query,
              professionId,
            }),
          },
          () => this.findJobs()
        )
      },
    },

    pages() {
      return [
        { text: '+ Neuer Beruf', to: '/edit/occupation/new' },
        { text: 'Alle Jobs', value: '' },

        ...this.$auth.user.occupations.map((item) => ({
          text: item.profession.title,
          value: item.profession.id,
        })),
      ]
    },
  },
  beforeDestroy() {
    this.$store.commit('job/setState', { jobs: [], query: {} })
  },
  methods: mapActions('job', ['findJobs']),
  head: {
    title: 'Job suchen',
  },
}
</script>
