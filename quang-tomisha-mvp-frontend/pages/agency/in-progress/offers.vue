<template>
  <layout-body wide>
    <base-segmented-controls
      v-model="activePage"
      :items="pages"
      class="mb-6 max-w-lg"
    />

    <template v-if="activePage === 'sent'">
      <offer-table v-if="sent.items.length" :offers="sent.items" />

      <common-empty v-else />
    </template>

    <template v-else-if="received.items.length">
      <user-offer-modal ref="modal" />

      <job-card
        v-for="item in received.items"
        :key="item.id"
        :job="item.job"
        class="mb-6 max-w-lg"
        @click="viewReceivedOffer(item)"
      >
        <base-button class="mt-6">Öffnen</base-button>
      </job-card>
    </template>

    <common-empty v-else />
  </layout-body>
</template>

<script>
export default {
  asyncData({ $axios, $auth }) {
    return Promise.all([
      $axios.get('/offer/', { params: { companyId: $auth.companyId } }),
      $axios.get('/offer/me', { params: { agencyId: $auth.companyId } }),
    ]).then(([sent, received]) => ({
      sent,
      received,
    }))
  },
  data() {
    return {
      sent: {
        items: [],
        total: [],
      },
      received: {
        items: [],
        total: [],
      },
      activePage: 'sent',
    }
  },
  computed: {
    pages() {
      const sentCount = this.sent.total
      const receivedCount = this.received.total
      return [
        {
          text: 'Gesendet' + (sentCount ? ` (${sentCount})` : ''),
          value: 'sent',
        },
        {
          text: 'Erhalten' + (receivedCount ? ` (${receivedCount})` : ''),
          value: 'received',
        },
      ]
    },
  },
  methods: {
    async viewReceivedOffer(offer) {
      const detail = await this.$axios.get('/offer/' + offer.id, {
        params: { agencyId: this.$auth.companyId },
      })
      this.$refs.modal.show(detail)
    },
  },
  head: {
    title: 'Job',
  },
}
</script>
