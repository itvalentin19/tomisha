<template>
  <div>
    <!-- Search input modal -->
    <base-modal
      v-model="shown"
      title=" Angaben von Unternehmen suchen"
      back-icon
      class="mb-6"
      @shown="reset"
    >
      <template #activator>
        <base-button secondary icon="plus-circle">
          {{ buttonText }}
        </base-button>
      </template>

      <base-note class="mb-6"> Suche das gewünschte Unternehmen. </base-note>

      <base-form ref="form" @submit="search">
        <base-input
          v-model="draft.name"
          label="Unternehmen"
          placeholder="Universität St. Gallen"
          required
          :rules="[$rules.required, $rules.minLength(3), $rules.maxLength(200)]"
          class="mb-6"
        />

        <input-address
          v-model="draft.address"
          label="Stadt"
          placeholder="Stadt"
          city-only
          class="mb-6"
        />
      </base-form>

      <template #footer>
        <base-button
          primary
          :disabled="!draft.name"
          @click="$refs.form.submit()"
        >
          Suchen
        </base-button>
      </template>
    </base-modal>

    <!-- Search result modal -->
    <base-modal
      :value="branches.length > 0"
      title="Gefundene Unternehmen"
      back-icon
      @input="!$event && (branches = [])"
    >
      <base-note class="mb-6">
        Dein gewünschtes Unternehmen wurde gefunden. Klicke auf das passende
        Unternehmen, um es hinzuzufügen.
      </base-note>

      <branch-card
        v-for="branch in branches"
        :key="branch.id"
        :branch="branch"
        class="mb-6"
        @click="selectBranch(branch)"
      />

      <template #footer>
        <base-button @click="branches = []"> Erneut suchen </base-button>
      </template>
    </base-modal>

    <!-- Add new company modal -->
    <new-company-modal ref="newModal" />

    <branch-card
      v-if="value"
      :branch="value"
      dismiss-float
      @dismiss="$emit('input', null)"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: { type: Object, default: () => ({}) },
    buttonText: { type: String, default: 'Unternehmen hinzufügen' },
  },
  data() {
    return {
      shown: false,
      draft: {
        name: null,
        address: null,
      },
      branches: [],
    }
  },
  methods: {
    reset() {
      this.draft = {
        name: null,
        address: null,
      }
    },

    async search() {
      const params = {
        name: this.draft.name,
      }
      const { country, city } = this.draft.address || {}
      if (country && city) {
        params.country = country
        params.city = city
      }
      this.branches = await this.$axios.get('/branch', {
        params,
      })

      if (!this.branches.length) {
        return this.$confirm({
          img: '/img/common_404.svg',
          icon: 'warning',
          iconColor: 'red-600',
          title: 'Nicht gefunden',
          text: 'Leider wurde das gesuchte Unternehmen nicht gefunden. Versuche es erneut oder füge das Unternehmen hinzu.',
          okText: 'Jetzt hinzufügen',
          cancelText: 'Erneut suchen',
          done: () => {
            this.shown = false
            this.$nextTick(() => this.$refs.newModal.open(this.draft))
          },
        })
      }
    },

    selectBranch(branch) {
      this.$emit('input', branch)
      this.shown = false
      this.branches = []
    },
  },
}
</script>
