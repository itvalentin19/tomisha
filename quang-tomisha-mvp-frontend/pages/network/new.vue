<template>
  <base-form v-if="!listShown" @submit="search">
    <base-note class="mb-6">
      Trage den Namen ein, den du zu deinen Kontakten hinzufügen möchtest.
    </base-note>

    <base-input
      v-model="draft.firstName"
      label="Vorname"
      placeholder="Angelina"
      :rules="[$rules.required]"
      class="mb-6"
    />

    <base-input
      v-model="draft.lastName"
      label="Familienname"
      placeholder="Federer"
      :rules="[$rules.required]"
      class="mb-12"
    />

    <base-button
      type="submit"
      primary
      :disabled="!draft.firstName || !draft.lastName"
    >
      Suchen
    </base-button>
  </base-form>

  <div v-else>
    <contact-filter class="mb-6" @done="searchStrangers" />

    <base-button
      icon="plus-circle"
      secondary
      class="mb-6"
      @click="$refs.newUserModal.open(draft)"
    >
      Nicht gefunden
    </base-button>

    <new-user-modal
      ref="newUserModal"
      @done="$alert.success('Invite successfully')"
    />

    <profile-detail-modal ref="profileModal" :actions="actions" />

    <contact-report-modal
      ref="reportModal"
      @done="$refs.profileModal.close()"
    />

    <base-infinite-scroll :items="users" :total="total" @load="searchStrangers">
      <profile-card
        v-for="user in users"
        :key="user.id"
        :profile="user"
        class="mb-6"
        @click="$refs.profileModal.open(user.slug)"
      >
        <div
          class="text-center mt-6 text-teal-600 font-semibold cursor-pointer py-2 -mb-2"
          @click.stop="inviteContact(user)"
        >
          Anfrage senden
        </div>
      </profile-card>
    </base-infinite-scroll>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  async asyncData({ route, store }) {
    const { firstName, lastName } = route.query

    if (!!firstName && !!lastName) {
      await store.dispatch('user/searchUsers', { friend: false })
    }
    return {
      draft: {
        firstName,
        lastName,
      },
    }
  },
  data() {
    return {
      draft: {
        firstName: '',
        lastName: '',
      },

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
    ...mapState('user', ['users', 'total']),

    listShown() {
      const { firstName, lastName } = this.$route.query
      return !!firstName && !!lastName
    },
  },
  methods: {
    ...mapActions('user', ['searchUsers']),
    search() {
      if (!this.$nuxt.$loading.show) {
        this.$router.push(
          {
            path: this.$route.path,
            query: this.$utils.filterObject({
              firstName: encodeURIComponent(this.draft.firstName),
              lastName: encodeURIComponent(this.draft.lastName),
            }),
          },
          () => this.searchStrangers()
        )
      }
    },

    searchStrangers() {
      return this.listShown && this.searchUsers({ friend: false })
    },

    async inviteContact(user) {
      try {
        await this.$axios.post('/contact/invite/' + user.id)
      } catch (e) {
        return this.$alert.error(e)
      }

      this.$alert.success(
        'Deine Anfrage wurde erfolgreich an ' +
          user.firstName +
          ' ' +
          user.lastName +
          ' gesendet.'
      )
    },
  },
}
</script>
