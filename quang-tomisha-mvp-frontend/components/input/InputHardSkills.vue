<template>
  <div>
    <base-select
      ref="select"
      title="Hard Skills hinzufügen"
      search-label="Gewünschte Hard Skills eintippen"
      :items="hardSkills"
      :hidden-items="value.map((hk) => hk.skill)"
      :load-items="fetchHardSkills"
      full-height
      return-object
      item-text="title"
      item-value="id"
      item-icon="plus-circle"
      class="mb-8"
      @input="openEditor({ skill: $event })"
    >
      <template #activator>
        <base-button secondary icon="plus-circle">
          Hard Skills hinzufügen
        </base-button>
      </template>

      <template #header-bottom>
        <base-note> {{ note }} </base-note>
      </template>
    </base-select>

    <div v-for="(item, i) in value" :key="i" class="mb-5">
      <skill-card
        :level="item.level"
        :title="item.skill.title"
        dismiss-float
        @click="openEditor(item)"
        @dismiss="remove(i)"
      />
    </div>

    <base-modal
      v-model="editorState"
      title="Hard Skills hinzufügen"
      full-height
      @closed="closeEditor"
    >
      <base-note class="mb-6"> Bewerte dein Hard Skill. </base-note>

      <div
        v-if="draft.skill"
        class="inline-flex items-center max-w-full px-6 py-3 rounded-xl border border-gray-400 font-semibold relative cursor-pointer mb-8 mt-3"
        @click="reselect"
      >
        <span class="truncate">{{ draft.skill.title }}</span>

        <base-delete-button />
      </div>

      <base-rating
        v-model="draft.level"
        label="Wähle dein Niveau"
        required
        class="mb-6"
      />

      <base-textarea
        v-if="hasDescription"
        v-model="draft.description"
        label="Zusatzinformationen"
        placeholder="Zusatzinformationen zu den erforderliche Hard Skill."
        optional
      />

      <template #footer>
        <base-button primary class="mb-4" @click="onEditorDone">
          Hinzufügen
        </base-button>
      </template>
    </base-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    value: { type: Array, default: () => [] },
    note: { type: String, default: 'Gewünschte Hard Skill auswählen.' },
    hasDescription: Boolean,
  },
  data() {
    return {
      editorState: false,
      draft: {
        skill: null,
        level: 1,
        description: null,
      },
      draftIndex: -1,
    }
  },
  computed: {
    ...mapState('tag', ['hardSkills']),
  },
  created() {
    this.fetchHardSkills()
  },
  methods: {
    ...mapActions('tag', ['fetchHardSkills']),
    openEditor(item = {}) {
      this.reset(item)
      this.editorState = true
    },
    onEditorDone() {
      if (this.draftIndex !== -1) {
        this.value.splice(this.draftIndex, 1, this.draft)
      } else {
        this.value.push(this.draft)
      }
      this.editorState = false
      this.reset()
    },
    reset(item = {}) {
      this.draft = this.$utils.extract(item, [
        'id',
        { from: 'skill', default: null },
        { from: 'level', default: 1 },
        { from: 'description', default: null },
      ])
      this.draftIndex = this.value.indexOf(item)
    },
    reselect() {
      this.$refs.select.open()
      this.editorState = false
    },
    closeEditor() {
      if (this.draftIndex === -1) {
        this.$refs.select.open()
      } else {
        this.reset()
      }
    },
    remove(i) {
      this.value.splice(i, 1)
    },
  },
}
</script>
