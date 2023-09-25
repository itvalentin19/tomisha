<template>
  <div v-if="contacts.length">
    <profile-detail-modal
      v-slot="{ profile }"
      ref="profileModal"
      :actions="actions"
    >
      <base-bottom-actions
        v-if="profile"
        :items="[
          {
            primary: true,
            text: 'Kontakt hinzufügen',
            handler: () => replyInvitation(profile, true),
          },
          {
            text: 'Ablehnen',
            handler: () => replyInvitation(profile, false),
          },
        ]"
      />
    </profile-detail-modal>

    <contact-report-modal
      ref="reportModal"
      @done="$refs.profileModal.close()"
    />

    <base-infinite-scroll
      :items="contacts"
      :total="total"
      @load="fetchInvitations"
    >
      <profile-card
        v-for="contact in contacts"
        :key="contact.id"
        :profile="contact.user || contact.contactUser"
        class="mb-6"
        @click="
          $refs.profileModal.open((contact.user || contact.contactUser).slug)
        "
      >
        <base-badge class="badge absolute" :text="contact.diff"></base-badge>
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
      status: ContactStatus.READ,
    })
  },
  data() {
    return {
      actions: [
        {
          icon: 'share',
          text: 'Teilen',
          handler: (user) =>
            this.$utils.share({
              url: location.origin + '/' + user.slug,
              title: user.firstName + ' ' + user.lastName,
            }),
        },
        {
          icon: 'report',
          text: 'Melden',
          handler: (user) => this.$refs.reportModal.open(user, true),
        },
        {
          icon: 'block',
          text: 'Blockieren',
          handler: (user) => this.$refs.reportModal.open(user, false),
        },
      ],
    }
  },
  computed: {
    ...mapState('contact', ['contacts', 'total']),
  },
  methods: {
    ...mapActions('contact', ['fetchMyContacts']),

    fetchInvitations() {
      return this.fetchMyContacts({ status: ContactStatus.READ })
    },

    replyInvitation(profile, isAccepted) {
      const contact = this.getContactFromUserId(profile.id)

      if (isAccepted) {
        this.$axios.post('/contact/accept/' + contact.id)
        this.$alert.success(
          profile.firstName +
            ' ' +
            profile.lastName +
            ' wurde erfolgreich zu deinen Kontakten hinzugefügt.'
        )
      } else {
        this.$axios.delete('/contact/' + contact.id)
        this.$alert.success(
          profile.firstName +
            ' ' +
            profile.lastName +
            ' wurde nicht zu deinen Kontakten hinzugefügt.'
        )
      }
      this.removeContact(contact)
      this.$refs.profileModal.close()
    },

    removeContact(contact) {
      this.$store.commit('contact/setState', {
        contacts: this.$utils.toggleArrayItem(
          [...this.contacts],
          contact,
          'id'
        ),
      })
    },

    getContactFromUserId(userId) {
      return this.contacts.find(
        (c) => c.user?.id === userId || c.contactUser?.id === userId
      )
    },
  },
  head: {
    title: 'Einladungen',
  },
}
</script>

<style lang="scss">
.badge {
  bottom: 17px;
  right: 20px;
}
</style>
