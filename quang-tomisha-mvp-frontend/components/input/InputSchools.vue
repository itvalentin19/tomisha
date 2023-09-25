<template>
  <div>
    <!-- Add button -->
    <base-modal v-model="shown" title="Schulbildung hinzufügen" class="mb-8">
      <template #activator>
        <base-button secondary icon="plus-circle" @click="open()">
          Schulbildung hinzufügen
        </base-button>
      </template>

      <base-form ref="form" @submit="submit">
        <base-input
          v-model="draft.title"
          label="Schulabschluss"
          placeholder="10. Schuljahr"
          :rules="[$rules.required, $rules.maxLength(250)]"
          class="mb-6"
        />

        <base-date-picker
          v-model="draft.startedAt"
          label="Start"
          placeholder="28. November 2002"
          class="mb-6"
        />

        <base-date-picker
          v-model="draft.endedAt"
          label="Absolviert"
          placeholder="28.11.2002"
          :rules="[
            (endedAt) =>
              (draft.startedAt &&
                draft.endedAt &&
                $dayjs(draft.endedAt).isAfter($dayjs(draft.startedAt))) ||
              'Sollte später als das Startdatum sein',
          ]"
          class="mb-6"
        />

        <base-textarea
          v-model="draft.description"
          label="Abschluss und Erfolge"
          placeholder="Abschlussprüfung Englisch B2 zu 95% erfolgreich absolviert."
          rows="8"
          class="mb-6"
        />

        <input-pdf-files v-model="draft.files" class="mb-12" />

        <h3 class="text-gray-600 text-xl mt-10 mb-6">Schule</h3>

        <input-branch
          v-model="draft.branch"
          button-text="Schule hinzufügen"
          class="mb-6"
        />
      </base-form>

      <template #footer>
        <base-button primary @click="$refs.form.submit()">
          Hinzufügen
        </base-button>
      </template>
    </base-modal>

    <!-- List -->
    <h3 v-if="items.length > 0" class="text-xl mb-6 text-gray-600">
      Schulbildung
    </h3>

    <experience-card
      v-for="(item, i) in items"
      :key="i"
      :item="item"
      :class="{ 'mt-6': !!i }"
      dismiss-float
      @click="open(item, i)"
      @dismiss="remove(item, i)"
    />

    <slot :items="items" />
  </div>
</template>

<script>
import { DegreeType } from '~/constants'
export default {
  data() {
    return {
      shown: false,
      items: [],
      draft: {
        title: '',
        startedAt: null,
        endedAt: null,
        description: null,
        files: [],
        branch: null,
      },
    }
  },
  async created() {
    this.items = await this.$repos.profile.fetchDegrees({
      type: DegreeType.SCHOOL,
    })
  },
  methods: {
    open(draft) {
      this.draft = this.$utils.extract(draft, {
        id: undefined,
        title: '',
        startedAt: null,
        endedAt: null,
        description: null,
        files: [],
        branch: null,
      })

      this.shown = true
    },
    async submit() {
      this.shown = false

      const draft = { ...this.draft }
      draft.type = DegreeType.SCHOOL
      draft.userId = this.$auth.user.id
      const newItem = await this.$repos.profile.mutateDegree(draft)
      const i = this.items.findIndex((item) => item.id === newItem.id)
      if (i === -1) {
        this.items.push(newItem)
      } else {
        this.items.splice(i, 1, newItem)
      }
    },
    remove(item, i) {
      this.$repos.profile.removeDegree(item)
      this.items.splice(i, 1)
      this.$emit('change', this.items)
    },
  },
}
</script>
