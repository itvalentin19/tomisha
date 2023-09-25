<template>
  <base-modal ref="modal" :title="title" back-icon>
    <base-note class="mb-6">
      Vervollständige die Angaben zu deiner Referenzperson.
    </base-note>

    <h3 class="text-gray-600 text-xl mt-10 mb-6">Persönliche Angaben</h3>

    <base-form ref="form" @submit="submit">
      <input-gender
        v-model="draft.gender"
        :rules="[$rules.required]"
        class="mb-6"
      />

      <base-input
        v-model="draft.firstName"
        label="Vorname"
        placeholder="Angelina"
        :rules="[$rules.required, $rules.maxLength(250)]"
        class="mb-6"
      />

      <base-input
        v-model="draft.lastName"
        label="Familienname"
        placeholder="Federer"
        :rules="[$rules.required, $rules.maxLength(250)]"
        class="mb-6"
      />

      <base-input
        v-model="draft.email"
        type="email"
        label="Private E-Mail-Adresse"
        placeholder="angelina.federer@mail.com"
        :rules="[$rules.required, $rules.email]"
        class="mb-6"
      />

      <input-phone
        v-model="draft.phone"
        :country="draft.country"
        optional
        class="mb-6"
      />
    </base-form>

    <template #footer>
      <base-button
        primary
        disabled-on-loading
        :disabled="
          !draft.firstName || !draft.lastName || !draft.gender || !draft.email
        "
        @click="$refs.form.submit()"
      >
        Hinzufügen
      </base-button>
    </template>
  </base-modal>
</template>

<script>
export default {
  props: {
    title: { type: String, default: 'Kontakt einladen' },
  },
  data() {
    return {
      draft: {
        gender: null,
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
      },
    }
  },
  methods: {
    open(draft) {
      this.$refs.modal.open()
      this.draft = this.$utils.extract(draft, {
        gender: null,
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
      })
    },

    close() {
      this.$refs.modal.close()
    },

    async submit() {
      try {
        await this.$axios.post('/auth/verify-email', {
          firstName: this.draft.firstName,
          lastName: this.draft.lastName,
          email: this.draft.email,
        })
      } catch (e) {
        return this.$alert.error(e)
      }

      this.$emit('done')
    },
  },
}
</script>
