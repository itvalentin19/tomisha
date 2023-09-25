<template>
  <div>
    <label class="text-sm text-gray-600 block mb-1"> {{ label }} </label>

    <base-button secondary icon="link" @click="showModal">
      {{ activatorText }}
    </base-button>

    <base-modal
      v-model="shown"
      title="Erstelle ein neues Passwort für dein Tomisha Account"
      back-icon
    >
      <base-note class="mb-8">
        Aus Sicherheitsgründen wirst du von allen Geräten abgemeldet.
      </base-note>

      <base-form ref="form" @submit="submit">
        <input-password
          v-model="draft.oldPassword"
          label="Altes Passwort"
          :rules="[$rules.required, $rules.minLength(8)]"
          autofocus
          class="mb-6"
        />

        <input-new-password
          v-model="draft.newPassword"
          label="Altes Passwort"
          class="mb-8"
        />

        <input-password
          v-model="draft.confirmedPassword"
          label="Neues Passwort erneut eingeben"
          :rules="[$rules.required, $rules.equal(draft.newPassword, 'Wrong')]"
          class="mb-6"
        />

        <hcaptcha
          @verify="draft.captcha = $event"
          @expired="draft.captcha = null"
          @error="draft.captcha = null"
        />
      </base-form>

      <template #footer>
        <base-button
          primary
          :loading="saving"
          :disabled="
            !draft.captcha ||
            !draft.oldPassword ||
            !draft.newPassword ||
            !draft.confirmedPassword
          "
          @click="$refs.form.submit()"
        >
          Speichern
        </base-button>
      </template>
    </base-modal>
  </div>
</template>

<script>
export default {
  props: {
    path: { type: String, default: '' },
    value: { type: String, default: null },
    copiable: Boolean,
    label: { type: String, default: 'Passwort' },
    activatorText: { type: String, default: 'Passwort aktualisieren' },
  },
  data() {
    return {
      shown: false,
      draft: {
        captcha: null,
        oldPassowrd: '',
        newPassword: '',
        confirmedPassword: '',
      },
      saving: false,
    }
  },
  methods: {
    showModal() {
      this.draft = {
        captcha: null,
        oldPassowrd: '',
        newPassword: '',
        confirmedPassword: '',
      }

      this.shown = true
    },

    async submit() {
      this.saving = true
      try {
        await this.$axios.post('/auth/passowrd/change', {
          oldPassowrd: this.draft.oldPassowrd,
          newPassword: this.draft.newPassword,
        })
        this.saving = false
        this.$alert.success(
          'Dein Passwort wurde erfolgreich aktualisiert und gespeichert'
        )
      } catch (e) {
        this.saving = false
        return this.$alert.error(e)
      }

      this.shown = false
    },
  },
}
</script>
