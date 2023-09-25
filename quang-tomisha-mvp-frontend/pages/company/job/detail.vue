<template>
  <div>
    <base-modal
      v-if="job && mounted"
      :value="true"
      full-height
      :actions="actions"
      @dismiss="close"
    >
      <job-detail :job="job" />
    </base-modal>
  </div>
</template>

<script>
export default {
  props: {
    job: { type: Object, required: true },
  },
  data() {
    return {
      mounted: false,
      actions: [
        {
          icon: 'share',
          text: 'Teilen',
          handler: () =>
            this.$utils.share({
              title: this.job.title,
              url: location.origin + '/job/' + this.job.slug,
            }),
        },
      ],
    }
  },
  mounted() {
    this.mounted = true
  },
  methods: {
    close() {
      this.$router.push({
        path: '/company/job/applications',
        query: {
          id: this.$route.query.id,
        },
      })
    },
  },
}
</script>
