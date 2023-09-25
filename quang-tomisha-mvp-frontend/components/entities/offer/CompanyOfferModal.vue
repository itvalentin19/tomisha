<template>
  <base-modal
    v-model="shown"
    tite="Jobangebot"
    full-height
    :sticky-header="false"
    :actions="
      offer && !offer.logs.some((log) => log.action >= 2)
        ? [{ icon: 'trash', text: 'Angebot zurückziehen', handler: remove }]
        : []
    "
  >
    <base-note class="mb-10">
      Hier hast du einen Überblick über das gesendete Angebot.
    </base-note>

    <offer-detail :offer="offer" />
  </base-modal>
</template>

<script>
import { JobLogAction } from '~/constants'
export default {
  data() {
    return {
      shown: false,
      offer: null,
    }
  },
  methods: {
    async open(offer) {
      this.offer = await this.$axios.get('/offer/' + offer.id, {
        params: {
          companyId: this.$auth.companyId,
        },
      })
      this.shown = true
    },
    remove() {
      this.offer?.logs?.push?.({
        action: JobLogAction.DELETE,
        createdAt: Date.now(),
      })

      this.$axios.post('/offer/log', {
        offerId: this.offer.id,
        action: JobLogAction.DELETE,
        companyId: this.$auth.companyId,
      })

      this.$emit('withdraw', this.offer.id)
    },
  },
}
</script>
