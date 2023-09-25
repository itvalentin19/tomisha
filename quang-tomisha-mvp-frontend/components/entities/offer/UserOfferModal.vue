<template>
  <base-modal v-model="shown" :sticky-header="false" tite="Jobangebot">
    <base-note class="mb-10">
      Hier hast du einen Überblick über das erhaltene Angebot. Entscheide dich
      jetzt, ob du das Angebot annehmen möchtest.
    </base-note>

    <offer-detail :offer="offer" class="pb-8" />

    <base-bottom-actions
      v-if="
        offer &&
        !offer.logs.some((log) => log.action >= 2 && log.userId === userId)
      "
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
      offer: null,
      actions: JobLogAction,
    }
  },
  computed: {
    userId() {
      return this.$auth.companyId || this.$auth.user.id
    },
  },
  methods: {
    show(offer) {
      this.offer = offer
      this.shown = true

      if (
        !offer.logs.some(
          (log) =>
            log.action === JobLogAction.SEEN && log.userId === this.userId
        )
      ) {
        this.log(JobLogAction.SEEN, true)
      }
    },

    log(action, silent) {
      this.offer?.logs?.push?.({
        action,
        createdAt: Date.now(),
        userId: this.$auth.companyId || this.$auth.user.id,
      })

      const payload = {
        offerId: this.offer.id,
        action,
      }

      if (this.$auth.companyId) {
        payload.agencyId = this.$auth.companyId
      }

      return this.$axios.post('/offer/log', payload).then(() => {
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
