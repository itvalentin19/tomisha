<template>
  <div v-if="offers.length">
    <user-offer-modal ref="modal" />

    <job-card
      v-for="item in offers"
      :key="item.id"
      :job="item.job"
      class="mb-6"
      @click="viewDetail(item)"
    >
      <base-button class="mt-6">Öffnen</base-button>
    </job-card>
  </div>

  <base-figure
    v-else
    img="/img/no_items.svg"
    title="Noch kein Jobangebot erhalten"
    text="Aktuell hast du noch kein Jobangebot erhalten, suche selbst dein passenden Job."
    class="pb-32 md:pb-0"
  >
    <base-button primary to="/jobs" class="mt-12"> Job finden </base-button>
  </base-figure>
</template>

<script>
export default {
  asyncData({ $axios }) {
    return $axios.get('/offer/me').then(({ items }) => ({ offers: items }))
  },
  data() {
    return {
      offers: [],
    }
  },
  methods: {
    async viewDetail(offer) {
      const detail = await this.$axios.get('/offer/' + offer.id)
      this.$refs.modal.show(detail)
    },
  },
  head: {
    title: 'Jobangebot',
  },
}
</script>
