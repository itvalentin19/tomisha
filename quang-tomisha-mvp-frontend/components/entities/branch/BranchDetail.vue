<template>
  <div>
    <branch-card :branch="branch" class="mb-6" />

    <base-description
      v-if="branch.description"
      class="rounded-xl border border-gray-400 p-6 text-gray-600 mb-8"
      :text="branch.description"
    />

    <company-job-filter
      v-if="jobs.length"
      :branch-id="branch.id"
      :branches="[branch]"
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
    branch: { type: Object, required: true },
  },
  computed: mapState('job', ['jobs', 'total']),
  created() {
    this.findJobs({
      branchIds: this.branch.id,
      skip: 0,
    })
  },
  methods: mapActions('job', ['findJobs']),
}
</script>
