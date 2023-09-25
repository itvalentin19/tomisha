<template>
  <div>
    <input-language
      ref="select"
      :value="draft.language"
      :hidden-items="items.map((item) => item.languageId)"
      @input="openEditor({ languageId: $event })"
    />

    <base-modal
      v-model="shown"
      full-height
      :title="'Sprache hinzufügen'"
      back-icon
    >
      <base-form ref="form" @submit="submit">
        <base-card
          v-if="draft.languageId"
          class="inline-flex max-w-full py-2 mb-8 mt-3"
          dismiss-float
          @click="reselect"
          @dismiss="reselect"
        >
          <span class="truncate">{{ languageNameById[draft.languageId] }}</span>
        </base-card>

        <base-rating
          v-model="draft.level"
          label="Wähle dein Sprachniveau"
          label-class="text-gray-700 font-semibold"
          :levels="languageLevels"
          required
        />

        <h3 class="text-gray-600 text-xl mt-10 mb-6">Kurs</h3>

        <base-input
          v-model="draft.title"
          label="Sprachkurs"
          placeholder="English B2 First (FCE)"
          :rules="[$rules.maxLength(250)]"
          class="mb-6"
        />

        <base-date-picker
          v-model="draft.startedAt"
          label="Start"
          placeholder="28. Steptember 2001"
          class="mb-6"
        />

        <base-date-picker
          v-model="draft.endedAt"
          label="Absolviert"
          placeholder="28. Steptember 2002"
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

        <h3 class="text-gray-600 text-xl mt-10 mb-6">
          Weiterbildungsunternehmen
        </h3>

        <input-branch v-model="draft.branch" class="mb-6" />
      </base-form>

      <template #footer>
        <base-button primary @click="$refs.form.submit()">
          Hinzufügen
        </base-button>
      </template>
    </base-modal>

    <h3 v-if="items.length > 0" class="text-xl mb-4 text-gray-600">
      Sprachkenntnisse
    </h3>

    <experience-card
      v-for="(item, i) in items"
      :key="i"
      :item="item"
      :title="languageNameById[item.languageId]"
      :levels="languageLevels"
      :class="{ 'mt-6': !!i }"
      dismiss-float
      @click="openEditor(item)"
      @dismiss="remove(item, i)"
    />

    <slot :items="items" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { DegreeType } from '~/constants'
export default {
  data() {
    return {
      shown: false,
      items: [],
      draft: {
        id: undefined,
        languageId: null,
        level: 1,
        title: '',
        startedAt: null,
        endedAt: null,
        description: null,
        files: [],
        branch: null,
      },
    }
  },
  computed: {
    ...mapState('tag', ['languages', 'languageLevels']),
    ...mapGetters('tag', ['languageNameById']),
  },
  async created() {
    this.items = await this.$repos.profile.fetchDegrees({
      type: DegreeType.LANGUAGE,
    })
  },
  methods: {
    openEditor(item) {
      this.draft = this.$utils.extract(item || {}, {
        id: undefined,
        languageId: null,
        level: 1,
        title: '',
        startedAt: null,
        endedAt: null,
        description: null,
        files: [],
        branch: null,
      })

      this.shown = true
    },
    reselect() {
      this.shown = false
      this.$refs.select.open()
    },
    async submit() {
      this.shown = false

      const draft = { ...this.draft }
      draft.type = DegreeType.LANGUAGE
      draft.userId = this.$auth.user.id
      const newItem = await this.$repos.profile.mutateDegree(draft)
      const i = this.items.findIndex((item) => item.id === newItem.id)
      if (i === -1) {
        this.items.push(newItem)
      } else {
        this.items.splice(i, 1, newItem)
      }
      this.$emit('change', this.items)
    },
    remove(item, i) {
      this.$repos.profile.removeDegree(item)
      this.items.splice(i, 1)
      this.$emit('change', this.items)
    },
  },
}
</script>
