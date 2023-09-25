<template>
  <div>
    <input-profession
      ref="select"
      :hidden-items="hiddenItems.concat(value.map((exp) => exp.profession))"
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

    <div v-for="(item, i) in value" :key="i" class="mt-6">
      <base-card
        dismiss-float
        @click="openEditor(item)"
        @dismiss="removeItem(i)"
      >
        <div class="text-sm text-gray-600">
          {{ item.years }} Jahre oder mehr
        </div>

        <base-rating
          v-if="item.level"
          :value="item.level"
          disabled
          hide-label
          class="mt-1"
        />

        <div class="mt-4">
          <base-chip :text="item.profession.title + '*'" />
        </div>
      </base-card>
    </div>

    <base-modal v-model="editorState" title="Berufserfahrung hinzufügen">
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
          label="Mindestniveau"
          label-class="text-gray-700 font-semibold"
          required
          class="mb-6"
        />

        <base-progress
          v-model="draft.years"
          label="Mindestberufserfahrung (Jahren)"
          :rules="[$rules.required]"
          class="mb-6"
        />
      </base-form>

      <template #footer>
        <base-button primary @click="$refs.form.submit()">
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
    hiddenItems: { type: Array, default: () => [] },
  },
  data() {
    return {
      editorState: false,
      draft: {
        profession: null,
        years: 0,
        level: 1,
      },
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
    onEditorDone() {
      if (this.draftIndex !== -1) {
        this.value.splice(this.draftIndex, 1, this.draft)
      } else {
        this.value.push(this.draft)
      }

      this.editorState = false
      this.reset()
    },
    removeItem(item) {
      const i = this.value.indexOf(item)
      this.value.splice(i)
    },
    reset(item = {}) {
      this.draft = this.$utils.extract(item, [
        'id',
        { from: 'profession', default: null },
        { from: 'level', default: 1 },
        { from: 'years', default: 0 },
      ])
      this.draftIndex = this.value.indexOf(item)
    },
  },
}
</script>
