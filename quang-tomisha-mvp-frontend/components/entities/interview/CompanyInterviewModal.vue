<template>
  <base-modal
    v-model="shown"
    tite="Vorstellungsgespräch"
    full-height
    :sticky-header="false"
    :actions="
      interview && !interview.logs.some((log) => log.action >= 2)
        ? [{ icon: 'trash', text: 'Angebot zurückziehen', handler: remove }]
        : []
    "
  >
    <base-note class="mb-10">
      Hier hast du einen Überblick über das gesendete Angebot.
    </base-note>

    <interview-detail :interview="interview" />
  </base-modal>
</template>

<script>
import { JobLogAction } from '~/constants'
export default {
  data() {
    return {
      shown: false,
      interview: null,
    }
  },
  methods: {
    async open(interview) {
      this.interview = await this.$axios.get('/interview/' + interview.id, {
        params: {
          companyId: this.$auth.companyId,
        },
      })

      this.shown = true
    },
    remove() {
      this.interview?.logs?.push?.({
        action: JobLogAction.DELETE,
        createdAt: Date.now(),
      })

      this.$axios.post('/interview/log', {
        interviewId: this.interview.id,
        action: JobLogAction.DELETE,
      })

      this.$emit('withdraw', this.interview.id)
    },
  },
}
</script>
