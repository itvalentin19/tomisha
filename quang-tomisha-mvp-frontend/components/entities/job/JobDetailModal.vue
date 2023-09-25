<template>
  <base-modal ref="modal" full-height :sticky-header="false">
    <job-detail v-if="job" :job="job" />
  </base-modal>
</template>

<script>
export default {
  data() {
    return {
      job: null,
    }
  },
  methods: {
    async open(jobSlug) {
      try {
        this.job = await this.$axios.get('/job/' + jobSlug)
      } catch (e) {
        return this.$alert.error(e)
      }

      this.$refs.modal.open()
    },
    close() {
      this.$refs.modal.close()
    },
  },
}
</script>
