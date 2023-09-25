<template>
  <div v-if="company">
    <branch-card :branch="headquater" disabled class="mb-6">
      <template v-if="headquater.description">
        <base-description :text="headquater.description" />
      </template>
    </branch-card>

    <div class="overflow-auto flex flex-no-wrap -mx-6 px-3 mb-8">
      <base-card
        v-for="branch in sortedBranches"
        :key="branch.id"
        class="inline-block flex-shrink-0 mx-3"
        @click="viewBranch(branch)"
      >
        <h5 class="font-semibold">
          {{ branch.name }}
        </h5>

        <p>
          {{ $utils.getAddressStreet(branch.address) }} <br />
          {{ branch.address.zip }} {{ branch.address.city }}
        </p>
      </base-card>
    </div>

    <branch-detail-modal
      ref="branchModal"
      @closed="resetCache"
      @hook:mounted="onMounted"
    />

    <company-job-filter
      v-if="jobs.length"
      :company-id="company.id"
      :branches="company.branches"
      class="mb-8"
    />

    <base-infinite-scroll
      v-if="jobs.length"
      :items="jobs"
      :total="total"
      @load="findJobs"
    >
      <n-link
        v-for="item in jobs"
        :key="item.id"
        :to="'/job/' + item.slug"
        class="block mb-6"
      >
        <job-card :job="item" />
      </n-link>
    </base-infinite-scroll>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    company: { type: Object, required: true },
  },
  data() {
    return {
      cache: null,
    }
  },
  computed: {
    ...mapState('job', ['jobs', 'total', 'query']),

    sortedBranches() {
      const branches = [...this.company.branches].sort(
        (a, b) =>
          new Date(a.createdAt).valueOf() - new Date(b.created).valueOf()
      )
      const i = branches.findIndex((b) => b.isHeadquater)
      if (i !== 0) {
        branches.unshift(branches.splice(i, 1)[0])
      }
      return branches
    },

    headquater() {
      const headQuater = this.company.branches.find((b) => b.isHeadquater)
      headQuater.status = 5
      return headQuater
    },
  },
  async created() {
    this.cache = await this.findJobs({
      companyId: this.company.id,
      skip: 0,
    })
  },
  methods: {
    ...mapActions('job', ['findJobs']),

    onMounted() {
      const [, branchSlug] = this.$route.path.split('/').filter(Boolean)
      const branch = this.company.branches.find((b) => b.slug === branchSlug)
      if (branch) {
        this.viewBranch(branch)
      }
    },

    viewBranch(branch) {
      this.$refs.branchModal.open(branch)
    },

    resetCache() {
      this.$store.commit('job/setState', this.cache || {})
    },
  },
}
</script>
