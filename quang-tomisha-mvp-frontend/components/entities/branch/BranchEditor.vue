<template>
  <base-modal v-model="shown" full-height title="Standort hinzufügen">
    <template v-if="!hideActivator" #activator>
      <base-button secondary icon="plus-circle" @click="open()">
        Standorte hinzufügen
      </base-button>
    </template>

    <base-note class="mb-12 mt-6">
      Diese Angaben beziehen sich auf den aktuellen Standort.
    </base-note>

    <base-form alert-on-error @submit="submit">
      <div class="-mx-6 md:-mx-10 lg:-mx-16 mb-6">
        <input-cover-image v-model="draft.cover" />

        <input-avatar
          v-model="draft.picture"
          :rules="[$rules.required]"
          placeholder="/img/company_placeholder.svg"
          class="-mt-18"
        />
      </div>

      <base-input
        v-model="draft.name"
        label="Unternehmensname"
        placeholder="Tomisha"
        :rules="[$rules.required, $rules.minLength(2), $rules.maxLength(250)]"
        class="mb-6"
      />

      <base-switch
        v-model="draft.isHeadquater"
        :disabled="!!snap.isHeadquater"
        label="Hauptsitz"
        :rules="[$rules.required]"
        class="mb-6"
      />

      <base-input
        v-model="draft.designation"
        label="Bezeichnung"
        placeholder="Hauptsitz"
        :rules="[$rules.required, $rules.maxLength(200)]"
        class="mb-6"
      />

      <base-textarea
        v-model="draft.description"
        label="Unternehmensbeschreibung"
        placeholder="Beschreibe dein Unternehmen."
        :rules="[$rules.maxLength(500)]"
        optional
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
        v-model="draft.email"
        type="email"
        label="Geschäftliche E-Mail-Adresse"
        placeholder="info@tomisha.com"
        :rules="[$rules.required, $rules.email]"
        class="mb-6"
      />

      <base-input
        v-model="draft.website"
        label="Webseite"
        placeholder="https://www.tomisha.com"
        :rules="[$rules.required, $rules.url]"
        class="mb-6"
      />

      <base-date-picker
        v-model="draft.foundedAt"
        label="Gründungsdatum"
        placeholder="28. September 1953"
        :rules="[$rules.required]"
        class="mb-6"
      />

      <base-input
        v-model.number="draft.totalPermanents"
        type="number"
        label="Festangestellte Mitarbeiter"
        placeholder="12"
        min="0"
        max="100000"
        :rules="[$rules.min(0), $rules.max(100000)]"
        class="mb-6"
        optional
      />

      <base-input
        v-model.number="draft.totalInterns"
        type="number"
        label="Temporäre Mitarbeiter (Intern)"
        placeholder="8"
        min="0"
        max="100000"
        :rules="[$rules.min(0), $rules.max(100000)]"
        class="mb-6"
        optional
      />

      <base-input
        v-model.number="draft.size"
        type="number"
        label="Total Mitarbeiteranzahl"
        placeholder="20"
        min="0"
        max="100000"
        :rules="[$rules.min(0), $rules.max(100000)]"
        class="mb-12"
        optional
      />

      <template v-if="!draft.id">
        <h4 class="text-xl mb-4 text-gray-600">Zuständig</h4>

        <profile-card :profile="$auth.user" class="mb-12" />
      </template>

      <base-button
        primary
        type="submit"
        :disabled="!draft.name || !draft.designation || !draft.address"
        disabled-on-loading
        class="mb-6"
      >
        Hinzufügen
      </base-button>

      <base-button disabled-on-loading class="mb-2" @click="close">
        Abbrechen
      </base-button>
    </base-form>
  </base-modal>
</template>

<script>
export default {
  props: {
    companyId: { type: String, default: null },
    createCompanyToken: { type: String, default: null },
    headquater: Boolean,
    hideActivator: Boolean,
  },
  data() {
    return {
      shown: false,
      draft: {
        cover: null,
        picture: null,
        name: null,
        isHeadquater: false,
        designation: null,
        description: null,
        address: null,
      },
      snap: {},
    }
  },
  methods: {
    open(branch) {
      this.draft = this.$utils.extract(branch, [
        'id',
        'cover',
        'picture',
        'name',
        {
          from: 'isHeadquater',
          default: this.headquater,
        },
        'designation',
        'description',
        'address',
        'email',
        'website',
        'foundedAt',
        'totalPermanents',
        'totalInterns',
        'size',
      ])

      this.snap = this.$utils.clone(this.draft)

      this.shown = true
    },

    close() {
      this.shown = false
    },

    async submit() {
      if (!this.$utils.isModified(this.snap, this.draft)) {
        return
      }

      const method = this.draft.id ? 'patch' : 'post'
      try {
        const payload = { ...this.draft }
        if (payload.website && !payload.website.startsWith('http')) {
          payload.website = 'http://' + payload.website
        }

        if (this.companyId) {
          payload.companyId = this.companyId
        } else if (this.createCompanyToken) {
          payload.token = this.createCompanyToken
        }

        const branch = await this.$axios[method](
          '/branch/' + (this.draft.id || ''),
          payload
        )

        this.$emit('done', branch)
        this.shown = false
      } catch (e) {
        this.$alert.error(e)
      }
    },
  },
}
</script>
