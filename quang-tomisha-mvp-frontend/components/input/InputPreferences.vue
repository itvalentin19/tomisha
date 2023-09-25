<template>
  <div>
    <base-select
      ref="select"
      title="Positive Präferenzen hinzufügen"
      search-label="Gewünschte Präferenz eintippen"
      item-icon="plus-circle"
      :items="preferences"
      :hidden-items="value.map((p) => p.preferenceId)"
      item-value="id"
      class="mb-8"
      @input="openEditor({ preferenceId: $event })"
    >
      <template #activator>
        <base-button secondary icon="plus-circle">
          Positive Präferenzen
        </base-button>
      </template>

      <template #header-bottom>
        <base-note> Wähl deine gewünschte Präferenz aus. </base-note>
      </template>
    </base-select>

    <div v-for="(item, i) in value" :key="i" class="mb-5">
      <skill-card
        :level="item.level"
        :title="getPreferenceTextById(item.preferenceId)"
        dismiss-float
        @click="openEditor(item)"
        @dismiss="removeItem(i)"
      />
    </div>

    <base-modal
      v-model="editorState"
      title="Positive Präferenzen hinzufügen"
      @closed="onEditorClosed"
    >
      <base-card
        dismiss-float
        class="inline-block py-3 rounded-xl mb-8 mt-3"
        @click="reselect"
        @dismiss="reselect"
      >
        <span class="truncate">
          {{ getPreferenceTextById(draft.preferenceId) }}
        </span>
      </base-card>

      <base-rating
        v-model="draft.level"
        label="Wähle dein Niveau"
        class="mb-6"
      />

      <template #footer>
        <base-button primary @click="onEditorDone">
          Präferenz hinzufügen
        </base-button>
      </template>
    </base-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  props: {
    value: { type: Array, default: () => [] },
  },
  data() {
    return {
      editorState: false,
      draft: {
        preferenceId: null,
        level: 1,
      },
      draftIndex: -1,
    }
  },
  computed: {
    ...mapState('tag', ['preferences']),
    ...mapGetters('tag', ['getPreferenceTextById']),
  },
  methods: {
    openEditor(item = {}) {
      Object.assign(this.draft, item)
      this.draftIndex = this.value.indexOf(item)
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
    removeItem(i) {
      this.value.splice(i, 1)
    },
    reset() {
      this.draft = {
        preferenceId: null,
        level: 1,
      }
      this.draftIndex = -1
    },
    reselect() {
      this.$refs.select.open()
      this.editorState = false
    },
    onEditorClosed() {
      if (this.draftIndex === -1) {
        this.$refs.select.open()
      } else {
        this.reset()
      }
    },
  },
}
</script>
