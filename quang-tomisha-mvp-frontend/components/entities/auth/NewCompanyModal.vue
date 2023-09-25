<template>
  <base-modal ref="modal" title="Unternehmen hinzufügen" back-icon>
    <base-note class="mb-6">
      Vervollständigen die Angaben zu deinem gewünschten Unternehmen.
    </base-note>

    <h3 class="text-gray-600 text-xl mt-10 mb-6">
      Aus- / Weiterbildungsunternehmen
    </h3>

    <base-form ref="form" @submit="submit">
      <base-input
        v-model="draft.name"
        label="Unternehmen"
        placeholder="Universität St. Gallen"
        :rules="[$rules.required, $rules.minLength(3), $rules.maxLength(200)]"
        required
        class="mb-6"
      />

      <input-address
        v-model="draft.address"
        label="Stadt"
        placeholder="Stadt"
        city-only
        class="mb-6"
      />

      <base-input
        v-model="draft.email"
        type="email"
        label="Geschäftliche E-Mail-Adresse"
        placeholder="angelina.federer@mail.com"
        :rules="[$rules.required, $rules.email]"
        required
        class="mb-6"
      />

      <input-phone v-model="draft.phone" label="Geschäftliche Telefonnummer" />
    </base-form>

    <template #footer>
      <base-button
        primary
        disabled-on-loading
        :disabled="!draft.name || !draft.email"
        @click="$refs.form.submit()"
      >
        Hinzufügen
      </base-button>
    </template>
  </base-modal>
</template>

<script>
export default {
  data() {
    return {
      draft: {
        name: null,
        address: null,
        email: null,
        phone: null,
      },
    }
  },
  methods: {
    open(draft) {
      this.draft = this.$utils.extract(draft, {
        name: null,
        address: null,
        email: null,
        phone: null,
      })
      this.$refs.modal.open()
    },

    close() {
      this.$refs.modal.close()
    },

    async submit() {
      try {
        await this.$axios.post('/company/verify-email', {
          email: this.draft.email,
        })
      } catch (e) {
        return this.$alert.error(e)
      }

      this.$alert.success(
        'Eine E-Mail wurde an dein gewünschtes Unternehmen gesendet. Sobald dein Unternehmen verfügbar ist, wirst du via E-Mail benachrichtigt.'
      )
      this.$emit('done')
      this.close()
    },
  },
}
</script>
