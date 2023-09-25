<template>
  <div>
    <input-language
      ref="select"
      :value="draft.languageId"
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
          optional
        />
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

    <skill-card
      v-for="(item, i) in value"
      :key="i"
      dismiss-float
      :level="item.level"
      :levels="languageLevels"
      :title="languageNameById[item.languageId]"
      disabled
      :class="{ 'mt-6': !!i }"
      @click="openEditor(item)"
      @dismiss="removeItem(i)"
    />

    <slot :items="items" />
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
      shown: false,
      items: [],
      draft: {
        id: undefined,
        languageId: null,
        level: 1,
      },
      draftIndex: -1,
    }
  },
  computed: {
    ...mapState('tag', ['languages', 'languageLevels']),
    ...mapGetters('tag', ['languageNameById']),
  },
  methods: {
    openEditor(item) {
      this.draft = this.$utils.extract(item || {}, {
        id: undefined,
        languageId: null,
        level: 1,
      })

      this.shown = true

      this.draftIndex = this.value.indexOf(item)
    },
    reselect() {
      this.shown = false
      this.$refs.select.open()
    },
    submit() {
      if (this.draftIndex !== -1) {
        this.value.splice(this.draftIndex, 1, this.draft)
      } else {
        this.value.push(this.draft)
      }

      this.shown = false
    },
    removeItem(i) {
      this.items.splice(i, 1)
    },
  },
}
</script>
