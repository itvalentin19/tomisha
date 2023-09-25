<template>
  <div>
    <base-modal
      v-model="shown"
      title="Aus- / Weiterbildung hinzufügen"
      class="mb-8"
    >
      <template #activator>
        <base-button secondary icon="plus-circle" @click="open()">
          Aus- / Weiterbildung hinzufügen
        </base-button>
      </template>

      <base-form ref="form" @submit="submit">
        <base-segmented-controls
          v-model="draft.subType"
          label="Was möchtest du hinzufügen"
          :items="[
            { text: 'Ausbildung', value: 1 },
            { text: 'Weiterbildung', value: 2 },
          ]"
          :rules="[$rules.required]"
          class="mb-6"
        />

        <base-input
          v-model="draft.title"
          label="Aus- / Weiterbildung Titel"
          placeholder="Handelsdiplom VSH"
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
          placeholder="28. November.2002"
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
          label="Qualifikationen und Erfolge"
          placeholder="Abschlussprüfung Englisch B2 zu 95% erfolgreich absolviert."
          rows="8"
          class="mb-6"
        />

        <input-pdf-files v-model="draft.files" class="mb-12" />

        <h3 class="text-gray-600 text-xl mt-10 mb-6">
          Aus- / Weiterbildungsunternehmen
        </h3>

        <input-branch v-model="draft.branch" class="mb-6" />
      </base-form>

      <template #footer>
        <base-button primary @click="$refs.form.submit()">
          Hinzufügen
        </base-button>
      </template>
    </base-modal>

    <h3
      v-if="items.filter((item) => item.subType === 2).length > 0"
      class="text-xl mt-12 mb-6 text-gray-600 font-extrabold"
    >
      Weiterbildung
    </h3>

    <div v-for="(item, i) in items" :key="i">
      <experience-card
        v-if="item.subType === 2"
        :item="item"
        :class="{ 'mt-6': !!i }"
        dismiss-float
        @click="open(item, i)"
        @dismiss="remove(item, i)"
      />
    </div>

    <h3
      v-if="items.filter((item) => item.subType === 1).length > 0"
      class="text-xl mt-12 mb-6 text-gray-600 font-extrabold"
    >
      Ausbildung
    </h3>

    <div v-for="(item, i) in items" :key="items.length + i">
      <experience-card
        v-if="item.subType === 1"
        :item="item"
        :class="{ 'mt-6': !!i }"
        dismiss-float
        @click="open(item, i)"
        @dismiss="remove(item, i)"
      />
    </div>
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
        subType: null,
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
      type: DegreeType.TRAINING,
    })
  },
  methods: {
    open(draft) {
      this.draft = this.$utils.extract(draft, {
        id: undefined,
        subType: null,
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
      draft.type = DegreeType.TRAINING
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
