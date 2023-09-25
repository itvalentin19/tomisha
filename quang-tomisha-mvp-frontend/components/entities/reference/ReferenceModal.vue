<template>
  <base-modal
    v-model="shown"
    title="Angaben von Referenzperson suchen"
    full-height
    v-on="$listeners"
    @shown="reset"
  >
    <template v-if="$slots.activator" #activator>
      <slot name="activator" />
    </template>

    <base-form ref="form" @submit="search">
      <base-note class="mb-8">
        Tippe die Telefonnummer oder E-Mail-Adresse deiner Referenzperson auf.
        Um nach deiner Referenzperson zu suchen.
      </base-note>

      <base-input-group
        v-model="searchField"
        :items="searchChoices"
        @input="reset"
      >
        <template #phone>
          <input-phone
            v-model="draft.phone"
            label=""
            :rules="[$rules.require]"
          />
        </template>

        <template #email>
          <base-input
            v-model="draft.email"
            type="email"
            placeholder="angelina.federer@mail.com"
            :rules="[$rules.required, $rules.email]"
          />
        </template>

        <template #businessEmail>
          <base-input
            v-model="draft.businessEmail"
            type="email"
            placeholder="angelina.federer@mail.com"
            :rules="[$rules.required, $rules.email]"
          />
        </template>
      </base-input-group>
    </base-form>

    <template #footer>
      <base-button
        primary
        :loading="searching"
        :disabled="!draft.phone && !draft.email && !draft.businessEmail"
        @click="$refs.form.submit()"
      >
        Suchen
      </base-button>
    </template>

    <base-modal
      v-model="resultShown"
      title="Gefundene Referenzperson"
      back-icon
      full-height
    >
      <base-note class="mb-6">
        Deine gesuchte Referenzperson wurde gefunden. Klicke auf die Person Ihr
        eine Anfrage zu senden.
      </base-note>

      <profile-card :profile="searchedUser" />

      <template #footer>
        <base-button
          primary
          :loading="sending"
          class="mb-6"
          @click="inviteReference"
        >
          Anfrage senden
        </base-button>

        <base-button :disabled="sending" @click="resultShown = false">
          Erneut suchen
        </base-button>
      </template>
    </base-modal>

    <new-user-modal
      ref="newUserModal"
      title="Referenz hinzufügen"
      @done="onDone"
    />
  </base-modal>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: Boolean,
  },
  data() {
    return {
      shown: this.value,
      draft: {
        phone: '',
        email: '',
        businessEmail: '',
      },
      searchChoices: [
        { text: 'Persönliche Telefonnummer', value: 'phone' },
        { text: 'Private E-Mail-Adresse', value: 'email' },
        { text: 'Geschäftliche E-Mail-Adresse', value: 'businessEmail' },
      ],
      searchField: 'phone',
      searchedUser: null,
      sending: false,
      searching: false,
    }
  },
  computed: {
    resultShown: {
      get() {
        return !!this.searchedUser
      },
      set(v) {
        if (!v) {
          this.searchedUser = null
        }
      },
    },
  },
  created() {
    this.$store.dispatch('tag/fetchCountries')
  },
  methods: {
    reset() {
      this.draft = {
        phone: '',
        email: '',
        businessEmail: '',
      }
    },
    async search() {
      this.searching = true
      try {
        this.searchedUser = await this.$axios.get('/user/single', {
          params: this.$utils.filterObject(this.draft),
        })
      } catch (_) {
        if (!this.searchedUser) {
          this.$confirm({
            img: '/img/common_404.svg',
            icon: 'warning',
            iconColor: 'red-600',
            title: 'Nicht gefunden',
            text: 'Leider wurde die gesuchte Person nicht gefunden. Versuche es erneut oder füge sie hinzu.',
            okText: 'Jetzt hinzufügen',
            cancelText: 'Erneut suchen',
            done: () => this.$refs.newUserModal.open(this.draft),
          })
        }
      }

      this.searching = false
    },
    async inviteReference() {
      this.sending = true
      try {
        await this.$axios.post('/reference/invite', {
          refUserId: this.searchedUser.id,
        })
        this.$alert.success(
          'Ein E-Mail wurde an deine Referenzperson gesendet. Sobald deine Referenzperson das E-Mail bestätigt, ist die Referenz ersichtlich.'
        )
      } catch (e) {
        this.$alert.error({
          title: 'Fehlter',
          text: e,
        })
      }

      this.shown = this.sending = this.resultShown = false
    },
    onDone() {},
  },

  onDone() {
    this.shown = false
    this.$alert.success(
      'Ein E-Mail wurde an deine Referenzperson gesendet. Sobald deine Referenzperson das E-Mail bestätigt, ist die Referenz ersichtlich.'
    )
  },
}
</script>
