<template>
  <base-modal
    v-model="shown"
    full-height
    :sticky-header="false"
    tite="Vorstellungsgespräch"
  >
    <base-note class="mb-10">
      Hier hast du einen Überblick über das erhaltene Angebot. Entscheide dich
      jetzt, ob du das Angebot annehmen möchtest.
    </base-note>

    <interview-detail :interview="interview" class="pb-8" />

    <base-bottom-actions
      v-if="interview && !interview.logs.some((log) => log.action >= 2)"
      :items="[
        { text: 'Bestätigen', primary: true, handler: () => log(actions.YES) },
        { text: 'Ablehnen', danger: true, handler: () => log(actions.NO) },
      ]"
    />
  </base-modal>
</template>

<script>
import { JobLogAction } from '~/constants'
export default {
  data() {
    return {
      shown: false,
      interview: null,
      actions: JobLogAction,
    }
  },
  methods: {
    show(interview) {
      this.interview = interview
      this.shown = true

      if (!interview.logs.some((log) => log.action === JobLogAction.SEEN)) {
        this.log(JobLogAction.SEEN, true)
      }
    },
    log(action, silent) {
      this.interview?.logs?.push?.({
        action,
        createdAt: Date.now(),
      })

      return this.$axios
        .post('/interview/log', {
          interviewId: this.interview.id,
          action,
        })
        .then(() => {
          !silent &&
            this.$alert.success(
              action === JobLogAction.YES
                ? 'Du hast eine Bestätigung gesendet.'
                : 'Du hast eine Absage gesendet.'
            )
        })
    },
  },
}
</script>
