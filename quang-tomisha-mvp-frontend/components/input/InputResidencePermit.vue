<template>
  <div>
    <div class="text-right mb-1 text-sm text-gray-400">ergänzend</div>

    <base-select
      ref="select"
      title="Aufenthaltsbewilligung"
      :items="residencePermits"
      item-value="id"
      hide-search
      :hidden-items="value && value.type ? [value.type] : []"
      item-icon="plus-circle"
      @input="openEditor({ ...draft, type: $event })"
    >
      <template #activator>
        <base-button secondary icon="plus-circle">
          Aufenthaltsbewilligung hinzufügen
        </base-button>
      </template>

      <template #header-bottom>
        <base-note>
          Klicke deine aktuelle Aufenthaltsbewilligung an.
        </base-note>
      </template>
    </base-select>

    <div
      v-if="value"
      class="max-w-full border border-gray-400 rounded-xl px-5 py-2 inline-flex font-semibold cursor-pointer hover:bg-teal-100 relative mt-5"
      @click="openEditor(value)"
    >
      <div class="truncate">
        <base-icon icon="card" class="mr-1" />
        {{ getResidencePermitTextById(value.type) }}
      </div>

      <base-delete-button @click.stop="$emit('input', null)" />
    </div>

    <!-- Upload permit -->
    <base-modal v-model="editorState" title="Aufenthaltsbewilligung" back-icon>
      <base-note class="mb-6">
        Füge deine Aufenthaltsbewilligung hinzu.
      </base-note>

      <div class="mb-8">
        <div
          class="inline-flex max-w-full px-6 py-3 rounded-xl border border-gray-400 font-semibold relative cursor-pointer"
          @click="reselect"
        >
          <base-icon icon="card" class="mr-2" />
          <span class="truncate">
            {{ getResidencePermitTextById(draft.type) }}
          </span>
          <base-delete-button />
        </div>
      </div>

      <base-date-picker
        v-model="draft.issuedAt"
        label="Ausgestellt am"
        placeholder="28. September 1953"
        class="mb-6"
      />

      <div v-for="img in images" :key="img.key" class="mb-6">
        <div
          v-if="img.url"
          class="relative rounded-xl min-h-40 bg-gray-500 cursor-pointer"
          @click="uploadImage(img.key)"
        >
          <img :src="img.url" class="w-full rounded-xl" />

          <base-delete-button @click.stop="removeUploadedImage(img.key)" />
        </div>

        <base-button
          v-else
          secondary
          icon="plus-circle"
          @click="uploadImage(img.key)"
        >
          Ausweis
          {{ img.key === 'front' ? 'Vorderseite' : 'Rückseite' }}
          hinzufügen
        </base-button>
      </div>

      <template #footer>
        <base-button ref="btn" primary @click="done"> Speichern </base-button>
      </template>
    </base-modal>

    <input-image-uploader
      ref="editor"
      :output-opts="{
        width: 576,
        height: 370,
      }"
      @done="onImageEditorDone"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  inheritAttrs: false,
  props: {
    value: { type: Object, default: () => null },
  },
  data() {
    return {
      draft: {
        type: null,
        issuedAt: null,
        front: null,
        back: null,
      },
      draftKey: null,
      editorState: false,
    }
  },
  computed: {
    ...mapState('tag', ['residencePermits']),
    ...mapGetters('tag', ['getResidencePermitTextById']),
    images() {
      return ['front', 'back'].map((key) => ({ key, url: this.draft[key] }))
    },
  },
  methods: {
    open() {
      this.$refs.select.open()
    },
    openEditor(item = {}) {
      this.draft = this.$utils.extract(item, [
        'id',
        { from: 'issuedAt', default: null },
        { from: 'type', default: null },
        { from: 'front', default: null },
        { from: 'back', default: null },
      ])
      this.editorState = true
    },
    reselect() {
      this.$refs.select.open()
      this.editorState = false
    },
    uploadImage(key) {
      this.draftKey = key
      this.$refs.editor.open({
        aspectRatio: 14 / 9,
        minCropBoxWidth: this.$refs.btn.$el.offsetWidth - 40,
      })
    },
    onImageEditorDone(url) {
      this.draft[this.draftKey] = url
    },
    removeUploadedImage(key) {
      this.draft[key] = null
    },
    done() {
      if (!this.draft.front && !this.draft.back) {
        return this.$confirm({
          img: '/img/profile_personal-info_1.svg',
          icon: 'warning',
          iconColor: 'red-600',
          title: 'Rücksicht',
          text: 'Es wird empfohlen, einen Ausweis hinzuzufügen.',
          okText: 'Hinzufügen',
          cancelText: 'Speichern ohne Ausweis',
          done: () => {
            if (!this.draft.front) {
              this.uploadImage('front')
            } else if (!this.draft.back) {
              this.uploadImage('back')
            }
          },
          cancel: () => {
            this.editorState = false
            if (this.draftIndex !== -1) {
              this.value?.splice(this.draftIndex, 1, { ...this.draft })
            } else {
              this.value?.push({ ...this.draft })
            }
          },
        })
      } else {
        this.$emit('input', this.draft)
        this.editorState = false
      }
    },
  },
}
</script>
