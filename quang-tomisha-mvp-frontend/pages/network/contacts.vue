<template>
  <div v-if="contacts.length">
    <profile-detail-modal ref="detailModal" />

    <contact-filter class="mb-6" @done="fetchContacts" />

    <base-infinite-scroll
      :items="contacts"
      :total="total"
      @load="fetchContacts"
    >
      <profile-card
        v-for="contact in contacts"
        :key="contact.id"
        :profile="contact.user || contact.contactUser"
        class="mb-6"
        @click="
          $refs.detailModal.open((contact.user || contact.contactUser).slug)
        "
      >
        <base-button class="mt-6">Öffnen</base-button>
      </profile-card>
    </base-infinite-scroll>
  </div>

  <base-figure
    v-else
    img="/img/network_empty.svg"
    title="Selbst aktiv werden"
    text="Derzeit sind keine neuen Einladungen vorhanden, finde deine Freude selbst."
  >
    <base-button to="/network/new" primary class="mt-12">
      Freunde finden
    </base-button>
  </base-figure>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { ContactStatus } from '~/constants'
export default {
  async fetch({ store }) {
    await store.dispatch('contact/fetchMyContacts', {
      status: ContactStatus.ACTIVE,
    })
  },
  computed: {
    ...mapState('contact', ['contacts', 'total']),
  },
  methods: {
    ...mapActions('contact', ['fetchMyContacts']),

    fetchContacts() {
      this.fetchMyContacts({ status: ContactStatus.ACTIVE })
    },
  },
  head: {
    title: 'Kontakke',
  },
}
</script>
