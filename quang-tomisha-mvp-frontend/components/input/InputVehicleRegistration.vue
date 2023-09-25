<template>
  <div>
    <div class="text-right mb-1 text-sm text-gray-400">ergänzend</div>

    <base-select
      ref="select"
      title="Fahrausweis"
      :items="vehicleRegistrations"
      item-value="id"
      :hidden-items="selectedValues"
      hide-search
      item-icon="plus-circle"
      @input="openEditor({ ...draft, type: $event })"
    >
      <template #activator>
        <base-button secondary icon="plus-circle">
          Fahrausweis hinzufügen
        </base-button>
      </template>

      <template #header-bottom>
        <base-note> Klicke deine aktuellen Fahrausweis an. </base-note>
      </template>
    </base-select>

    <experience-card
      v-for="(item, i) in value"
      :key="item.id || i + '_'"
      :item="{
        startedAt: item.issuedAt,
        branch: item.branch,
        title: getVehicleRegistrationTextById(item.type),
      }"
      dismiss-float
      class="mt-5"
      @click="openEditor(item, i)"
      @dismiss="value.splice(i, 1)"
    >
      <base-chip
        v-if="item.front || item.back"
        icon="paper"
        text="Zeugnis"
        class="mt-4"
      />
      <!--@click="$refs.pdfModal.open({ name: 'Zeugnis', url: item.front })"-->
    </experience-card>

    <pdf-viewer-modal ref="pdfModal" />

    <!-- Upload permit -->
    <base-modal v-model="editorState" title="Fahrausweis" back-icon>
      <base-note class="mb-6"> Füge deinen Fahrausweis hinzu. </base-note>

      <base-form ref="form" @submit="done">
        <div class="mb-8">
          <div
            class="inline-flex max-w-full px-6 py-3 rounded-xl border border-gray-400 font-semibold relative cursor-pointer"
            @click="reselect"
          >
            <span class="truncate">
              {{ getVehicleRegistrationTextById(draft.type) }}
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

        <input-branch
          v-model="draft.branch"
          button-text="Fahrschule hinzufügen"
          class="mb-6"
        />

        <div v-for="img in images" :key="img.key" class="mb-6 relative">
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
      </base-form>

      <template #footer>
        <base-button
          ref="btn"
          primary
          :disabled="!draft.type"
          @click="$refs.form.submit()"
        >
          Speichern
        </base-button>
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
    value: { type: Array, default: () => [] },
  },
  data() {
    return {
      draft: {
        type: null,
        issuedAt: null,
        front: null,
        back: null,
        branch: null,
      },
      editorState: false,
      draftIndex: -1,
      draftKey: null,
    }
  },
  computed: {
    ...mapState('tag', ['vehicleRegistrations']),
    ...mapGetters('tag', ['getVehicleRegistrationTextById']),
    images() {
      return ['front', 'back'].map((key) => ({ key, url: this.draft[key] }))
    },
    selectedValues() {
      return this.value?.map((v) => v.type) || []
    },
  },
  methods: {
    open() {
      this.$refs.select.open()
    },
    openEditor(item = {}, idx) {
      // this.reset(item)
      if (idx >= 0) this.draftIndex = idx
      this.draft = this.$utils.extract(item, [
        'id',
        { from: 'issuedAt', default: null },
        { from: 'type', default: null },
        { from: 'front', default: null },
        { from: 'back', default: null },
        { from: 'branch', default: null },
      ])
      this.editorState = true
    },
    reselect() {
      this.$refs.select.open()
      this.editorState = false
    },
    uploadImage(key) {
      if (this.$refs[key] && this.$refs[key].reset) {
        this.$refs[key].reset()
      }

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
              this.value.splice(this.draftIndex, 1, { ...this.draft })
            } else {
              this.value.push({ ...this.draft })
            }
          },
        })
      }

      this.editorState = false
      const idx = this.value.findIndex((v) => v.type === this.draft?.type)
      if (this.draftIndex !== -1 && (idx === -1 || this.draftIndex === idx)) {
        this.value[this.draftIndex] = { ...this.draft }
      } else if (idx === -1) {
        this.value.push({ ...this.draft })
      }
      this.reset()
    },
    reset(item = {}) {
      this.draft = this.$utils.extract(item, [
        'id',
        { from: 'issuedAt', default: null },
        { from: 'type', default: null },
        { from: 'front', default: null },
        { from: 'back', default: null },
        { from: 'branch', default: null },
      ])
      this.draftIndex = this.value.indexOf(item)
    },
  },
}
</script>
