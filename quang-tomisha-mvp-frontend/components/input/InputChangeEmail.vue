<template>
  <base-modal
    v-model="shown"
    title="E-Mail-Adresse ändern"
    back-icon
    @shown="reset"
  >
    <template #activator>
      <base-input
        :value="value"
        readonly
        :label="label"
        :placeholder="placeholder"
      />
    </template>

    <base-note class="mb-8">
      Hier kannst du deine E-Mail-Adresse ändern. Mit der du dich danach
      anmelden kannst.
    </base-note>

    <base-form ref="form" @submit="submit">
      <base-input
        v-model="draft.email"
        :label="label"
        :placeholder="placeholder"
        :rules="[
          $rules.required,
          $rules.email,
          (v) =>
            !v ||
            v.trim().toLowerCase() !== value ||
            'Must be a different email',
        ]"
        autofocus
        type="email"
        class="mb-6"
      />

      <input-password v-model="draft.password" autocomplete="" class="mb-6" />
    </base-form>

    <template #footer>
      <base-button
        primary
        :loading="saving"
        :disabled="!draft.email || !draft.password"
        @click="$refs.form.submit()"
      >
        Ändern
      </base-button>
    </template>
  </base-modal>
</template>

<script>
export default {
  props: {
    value: { type: String, required: true },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
  },
  data() {
    return {
      shown: false,
      draft: {
        email: this.value,
        password: '',
      },
      saving: false,
    }
  },
  methods: {
    reset() {
      this.draft = {
        email: this.value,
        password: '',
      }
      this.saving = false
    },
    async submit() {
      this.saving = true
      try {
        await this.$axios.post('/email/new', this.draft)
        this.saving = false
      } catch (e) {
        this.saving = false
        return this.$alert.error(e)
      }

      this.shown = false
    },
  },
}
</script>
