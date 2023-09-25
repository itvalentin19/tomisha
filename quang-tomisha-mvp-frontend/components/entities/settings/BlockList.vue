<template>
  <base-modal title="Sperrliste" full-height>
    <template #activator>
      <base-button secondary @click="onShown">Sperrliste</base-button>
    </template>

    <base-note class="mb-6">
      Hier siehst du deine gesperrten Profile, diese Profile können dich nicht
      mehr kontaktieren. Du kannst das gewünscht Profil jederzeit entsperren.
    </base-note>

    <base-infinite-scroll
      v-if="contacts.length"
      :items="contacts"
      :total="total"
      @load="fetchContacts"
    >
      <profile-card
        v-for="contact in contacts"
        :key="contact.id"
        :profile="contact.contactUser"
        class="mb-6"
      >
        <base-button class="mt-6" @click="unblock(contact)">
          Entsperren
        </base-button>
      </profile-card>
    </base-infinite-scroll>
  </base-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { ContactStatus } from '~/constants'
export default {
  computed: {
    ...mapState('contact', ['contacts', 'total']),
  },
  methods: {
    ...mapActions('contact', ['fetchMyContacts', 'deleteContact']),

    fetchContacts() {
      this.fetchMyContacts({ status: ContactStatus.BLOCKED })
    },

    onShown() {
      if (this.contacts?.[0]?.status !== ContactStatus.BLOCKED) {
        this.fetchContacts()
      }
    },

    unblock(contact) {
      this.deleteContact(contact.id)
        .then(() => this.$alert.success('ENGIE Services AG wurde entsperrt.'))
        .catch((e) => this.$alert.error(e))
    },
  },
}
</script>
