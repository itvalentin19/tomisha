<template>
  <base-modal ref="modal" title="Supportanfrage">
    <base-note class="mb-6">
      Vervollständige die Angaben, um eine Supportanfrage zu senden.
    </base-note>

    <base-form ref="form" @submit="submit">
      <h3 class="text-gray-600 text-xl mt-10 mb-6">Angaben zum Unternehmen</h3>

      <base-input
        v-model="draft.email"
        type="email"
        label="Geschäftliche E-Mail-Adresse"
        placeholder="angelina.federer@mail.com"
        :rules="[$rules.required, $rules.email]"
        class="mb-6"
      />

      <base-input
        v-model="draft.name"
        label="Unternehmen"
        placeholder="Universität St. Gallen"
        :rules="[$rules.required, $rules.minLength(3), $rules.maxLength(200)]"
        class="mb-6"
      />

      <input-address
        v-model="draft.address"
        label="Adresse"
        placeholder="Adresse"
        :rules="[$rules.required]"
        class="mb-6"
      />

      <base-input
        v-model="draft.website"
        label="Webseite"
        placeholder="https://www.tomisha.com"
        optional
        class="mb-12"
      />

      <h3 class="text-gray-600 text-xl mt-10 mb-6">Zusatzinformationen</h3>

      <base-textarea
        v-model="draft.message"
        label="Zusatzinformationen"
        :rules="[$rules.url]"
        placeholder="Warum hast du nur diese E-Mail-Adresse?"
      />
    </base-form>

    <template #footer>
      <base-button
        primary
        disabled-on-loading
        :disabled="!draft.email || !draft.name || !draft.address"
        @click="$refs.form.submit()"
      >
        Senden
      </base-button>
    </template>
  </base-modal>
</template>

<script>
export default {
  data() {
    return {
      draft: {
        email: null,
        name: null,
        address: null,
        message: null,
      },
    }
  },
  methods: {
    open(draft) {
      this.draft = this.$utils.extract(draft, {
        email: null,
        name: null,
        address: null,
        message: null,
      })
      this.$refs.modal.open()
    },

    close() {
      this.$refs.modal.close()
    },

    async submit() {
      try {
        await this.$axios.post('support', this.draft)
      } catch (e) {
        return this.$alert.error(e)
      }

      this.close()
      this.$emit('done')
    },
  },
}
</script>
