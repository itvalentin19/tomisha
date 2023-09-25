<template>
  <div>
    <input-profession
      ref="select"
      :hidden-items="value.map((exp) => exp.profession)"
      class="mb-8"
      @input="openEditor({ profession: $event })"
      @dismiss="open"
    >
      <template #activator>
        <base-button secondary icon="plus-circle">
          Berufserfahrung hinzufügen
        </base-button>
      </template>
    </input-profession>

    <slot />

    <experience-card
      v-for="(item, i) in value"
      :key="i"
      :item="item"
      :class="{ 'mt-6': !!i }"
      :title="item.profession.title + '*'"
      dismiss-float
      @click="openEditor(item)"
      @dismiss="removeItem(i)"
    />

    <base-modal v-model="editorState" title="Berufsbezeichnung">
      <base-form ref="form" @submit="onEditorDone">
        <base-card
          v-if="draft.profession"
          dismiss-float
          class="inline-flex max-w-full py-2 mb-8 mt-3"
          @click="reselect"
          @dismiss="reselect"
        >
          <span class="truncate"> {{ draft.profession.title }}* </span>
        </base-card>

        <base-rating
          v-model="draft.level"
          label="Wähle dein Niveau"
          label-class="text-gray-700 font-semibold"
          required
          class="mb-6"
        />

        <h3 class="text-gray-600 text-xl mt-10 mb-6">Anstellungsverhältnis</h3>

        <base-select
          v-model="draft.type"
          :items="workingRelationships"
          placeholder="Festanstellung"
          label="Arbeitsverhältnis"
          title="Arbeitsverhältnis"
          item-icon="plus-circle"
          item-value="id"
          hide-search
          class="mb-6"
        >
          <template #header-bottom>
            <base-note> Wähle dein Arbeitsverhältnis aus. </base-note>
          </template>
        </base-select>

        <base-progress
          v-model="draft.maxWorkload"
          label="Arbeitspensum (%)"
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

        <h3 class="text-gray-600 text-xl mt-10 mb-6">Erfolg</h3>

        <base-textarea
          v-model="draft.description"
          label="Aufgaben und Arbeitsbereiche"
          placeholder="Verantwortlich für 30 Mitarbeiter, Leitung von Grossprojekten wie unter anderem: - Projekt eins - Projekt zwei"
          rows="8"
          class="mb-6"
        />

        <input-pdf-files v-model="draft.files" class="mb-12" />

        <h3 class="text-gray-600 text-xl mt-10 mb-6">Unternehmen</h3>

        <input-branch v-model="draft.branch" class="mb-6" />
      </base-form>

      <template #footer>
        <base-button primary :loading="saving" @click="$refs.form.submit()">
          Hinzufügen
        </base-button>
      </template>
    </base-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  inheritAttrs: false,
  props: {
    value: { type: Array, default: () => [] },
    mutate: { type: Function, default: null },
    remove: { type: Function, default: null },
  },
  data() {
    return {
      editorState: false,
      draft: {
        profession: null,
        type: null,
        level: 1,
        maxWorkload: 100,
        startedAt: null,
        endedAt: null,
        description: null,
        files: [],
        branch: null,
      },
      saving: false,
      draftIndex: -1,
    }
  },
  computed: mapState('tag', ['workingRelationships']),
  methods: {
    open() {
      this.reselect()
    },
    openEditor(item = {}) {
      this.reset(item)
      this.editorState = true
    },
    reselect() {
      this.$refs.select.open()
      this.editorState = false
    },
    async onEditorDone() {
      this.saving = true
      const { type, ...draft } = this.draft
      draft.relationships = [type]

      const newItem =
        typeof this.mutate === 'function'
          ? await this.mutate(draft)
          : this.draft

      if (this.draftIndex !== -1) {
        this.value.splice(this.draftIndex, 1, newItem)
      } else {
        this.value.push(newItem)
      }

      this.editorState = false
      this.saving = false
      this.reset()
    },
    removeItem(item) {
      if (typeof this.remove === 'function') {
        this.remove(item)
      } else {
        const i = this.value.indexOf(item)
        this.value.splice(i)
      }
    },
    reset(item = {}) {
      this.draft = this.$utils.extract(item, [
        'id',
        { from: 'profession', default: null },
        {
          from: 'relationships',
          to: 'type',
          default: null,
          transform: (r) => r?.[0] || null,
        },
        { from: 'level', default: 1 },
        { from: 'maxWorkload', default: 100 },
        { from: 'startedAt', default: null },
        { from: 'endedAt', default: null },
        { from: 'description', default: null },
        { from: 'files', default: [] },
        { from: 'branch', default: null },
      ])
      this.draftIndex = this.value.indexOf(item)
    },
  },
}
</script>
