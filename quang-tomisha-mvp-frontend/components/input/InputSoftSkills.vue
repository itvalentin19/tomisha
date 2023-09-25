<template>
  <div>
    <base-select
      ref="select"
      v-bind="$attrs"
      title="Soft Skill hinzufügen"
      search-label="Gewünschter Soft Skill eintippen"
      item-icon="plus-circle"
      :items="softSkills"
      :hidden-items="value.map((item) => item.skillId)"
      item-value="id"
      @input="openEditor({ ...draft, skillId: $event })"
    >
      <template #activator>
        <base-button secondary class="mb-8" icon="plus-circle">
          Soft Skills hinzufügen
        </base-button>
      </template>
    </base-select>

    <base-modal v-model="editorState" title="Soft Skill hinzufügen">
      <base-note class="mb-8"> {{ note }} </base-note>

      <div
        v-if="draft.skillId"
        class="inline-flex items-center max-w-full px-6 py-3 rounded-xl border border-gray-400 font-semibold relative cursor-pointer mb-8 mt-3"
        @click="reselect"
      >
        <span class="truncate">{{ getSoftSkillTextById(draft.skillId) }}</span>

        <base-delete-button />
      </div>

      <base-rating
        v-model="draft.level"
        label="Wähle dein Niveau"
        label-class="text-gray-700 font-semibold"
        class="mb-6"
        optional
      />

      <base-textarea
        v-if="hasDescription"
        v-model="draft.description"
        label="Zusatzinformationen"
        placeholder="Zusatzinformationen zu den erforderliche Soft Skill."
        optional
      />

      <template #footer>
        <base-button primary @click="onEditorDone">
          Soft Skill hinzufügen
        </base-button>
      </template>
    </base-modal>

    <div v-for="(item, i) in value" :key="i" class="mb-4">
      <skill-card
        :level="item.level"
        :title="getSoftSkillTextById(item.skillId)"
        :description="item.description"
        dismiss-float
        @dismiss="value.splice(i, 1)"
        @click="openEditor(item)"
      />
    </div>

    <slot />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  inheritAttrs: false,
  props: {
    value: { type: Array, default: () => [] },
    note: { type: String, default: 'Bewerte dein Soft Skill.' },
    hasDescription: Boolean,
  },
  data() {
    return {
      editorState: false,
      draft: {
        id: undefined,
        skillId: null,
        level: 1,
        description: null,
      },
    }
  },
  computed: {
    ...mapState('tag', ['softSkills']),
    ...mapGetters('tag', ['getSoftSkillTextById']),
  },
  methods: {
    openEditor(item = {}) {
      this.reset(item)
      this.editorState = true
    },
    reselect() {
      this.$refs.select.open()
      this.editorState = false
    },
    onEditorDone() {
      this.value.push(this.draft)
      this.reset()
      this.editorState = false
    },
    reset(item = {}) {
      this.draft = this.$utils.extract(item, [
        'id',
        { from: 'skillId', default: null },
        { from: 'level', default: 1 },
        { from: 'description', default: null },
      ])
    },
  },
}
</script>
