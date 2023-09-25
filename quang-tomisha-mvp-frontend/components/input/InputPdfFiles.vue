<template>
  <div>
    <base-button secondary icon="plus-circle" @click="open">
      {{ label }}
    </base-button>

    <div v-for="(file, i) in value" :key="file.id || i" class="mt-6">
      <base-chip
        icon="paper"
        class="relative"
        @click="$refs.pdfModal.open(file)"
      >
        {{ file.name }}

        <base-delete-button @click.stop.prevent="remove(file, i)" />
      </base-chip>
    </div>

    <pdf-viewer-modal ref="pdfModal" />

    <base-modal v-model="shown" title="Dateiname ändern" back-icon>
      <base-note class="mb-8">
        Speichere die Datei unter einem geeigneten Namen.
      </base-note>

      <base-form ref="form" class="mb-16" @submit="submit">
        <base-input
          v-model="name"
          label="Datei Name"
          :rules="[$rules.required, $rules.minLength(3), $rules.maxLength(100)]"
          autofocus
          class="mb-6"
        />
      </base-form>

      <template #footer>
        <base-button primary @click="$refs.form.submit()">
          Speichern
        </base-button>
      </template>
    </base-modal>

    <slot />
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: 'Zeugnis hinzufügen' },
    value: { type: Array, default: () => [] },
  },
  data: () => ({
    shown: false,
    name: '',
    file: null,
  }),
  methods: {
    async open() {
      const file = await this.$fileInput({
        accept: 'application/pdf, image/jpeg, image/png',
      })
      if (file) {
        this.file = file
        this.name = file.name
        this.shown = true
      }
    },
    async submit() {
      this.value.push({
        name: this.name,
        url: await this.$upload(this.file),
      })

      this.name = ''
      this.file = null
      this.shown = false
      this.$emit('create', this.value.slice(-1)[0])
    },
    remove(file, i) {
      this.value.splice(i, 1)
      this.$emit('remove', file)
    },
  },
}
</script>
