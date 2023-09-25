<template>
  <div>
    <label class="text-sm text-gray-600 block mb-1"> {{ label }} </label>

    <base-button secondary icon="link" @click="confirm">
      {{ activatorText }}
    </base-button>

    <base-modal
      v-model="shown"
      title="Eine persönliche URL erstellen"
      back-icon
    >
      <base-note class="mb-8">
        Erstelle eine persönliche URL. Deine persönliche URL ist dauerhaft und
        kann nicht geändert werden. Deine persönliche URL muss zwischen 6 und 50
        Zeichen („a-z“, „0-9“, „.“, „-“, „_“) lang sein und kann nicht mit einer
        Zahl oder einem Satzzeichen beginnen. Dein Unternehmensname sollte
        deinen echten Namen beinhalten. Du kannst die URL nur einmal ändern.
      </base-note>

      <base-form ref="form" @submit="submit">
        <div class="mb-8">
          <a
            :href="draftHref"
            target="_blank"
            class="text-teal-600 hover:underline"
            @click.prevent
          >
            {{ draftHref }}
          </a>
        </div>

        <base-input
          v-model="draftSlug"
          label="Deine URL"
          :rules="[
            $rules.required,
            $rules.minLength(3),
            $rules.maxLength(100),
            (v) => !v || /^[a-zA-Z0-9-._]{6,50}$/.test(v),
          ]"
          class="mb-6"
        />
      </base-form>

      <template #footer>
        <base-button
          primary
          :loading="saving"
          :disabled="!draftSlug || draftSlug.length < 3"
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
    label: { type: String, default: 'Direktlink' },
    activatorText: { type: String, default: 'Link erstellen' },
  },
  data() {
    return {
      shown: false,
      draftSlug: this.value,
      saving: false,
    }
  },
  computed: {
    draftHref() {
      return [this.$utils.origin, this.path, this.draftSlug]
        .filter(Boolean)
        .join('/')
    },
  },
  watch: {
    value(v) {
      this.draftSlug = v
    },
  },
  methods: {
    confirm() {
      if (!this.copiable) {
        this.shown = true
        return
      }

      const text =
        'Füge den Link zu deiner Website hinzu. Auf diese Weise können sich neue Mitarbeiter direkt von deiner Website aus auf deinem öffentlichen Profil bewerben.'
      const href = [this.$utils.origin, this.path, this.value]
        .filter(Boolean)
        .join('/')

      this.$confirm({
        img: '/img/slug_creation.svg',
        title: 'Link',
        html: `${text}<br><br><a href="${href}" target="_blank" class="text-teal-600 hover:underline">${href}</a>`,
        persistent: false,
        dismissible: true,
        okText: 'Link kopieren',
        cancelText: 'Link ändern',
        done: () => this.copy(href),
        cancel: () => {
          this.draftSlug = this.value
          this.shown = true
        },
      })
    },
    copy(text) {
      this.$utils.copy(text)
    },
    async submit() {
      this.saving = true
      try {
        const endpoint = this.$auth.companyId
          ? '/company/' + this.$auth.companyId
          : '/me'
        await this.$axios.patch(endpoint, {
          slug: this.draftSlug,
        })
        this.saving = false
      } catch (e) {
        this.saving = false
        return this.$alert.error(e)
      }

      this.$emit('input', this.draftSlug)
      this.shown = false
    },
  },
}
</script>
