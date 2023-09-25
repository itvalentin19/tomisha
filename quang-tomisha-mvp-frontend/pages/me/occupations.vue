<template>
  <div>
    <base-button
      to="/edit/occupation/new"
      secondary
      icon="plus-circle"
      class="mb-8"
    >
      Beruf hinzufügen
    </base-button>

    <profile-card
      v-for="item in profile.occupations"
      :key="item.id"
      :profile="$auth.user"
      class="mb-6"
      @click="preview(item)"
    >
      <template #top>
        <div class="mb-6">
          <base-chip :text="item.profession.title + '*'" />
        </div>
      </template>

      <template #default>
        <base-button class="mt-6">Öffnen</base-button>
      </template>
    </profile-card>

    <base-modal
      v-model="shown"
      full-height
      :actions="[
        {
          icon: 'pencil',
          text: 'Bearbeiten',
          handler: () => $refs.editor.open(),
        },
      ]"
    >
      <profile-detail :profile="transformedProfile" />

      <profile-editor-modal ref="editor" :profile="transformedProfile" />
    </base-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  scrollToTop: true,
  props: {
    profile: { type: Object, required: true },
  },
  data() {
    return {
      shown: false,
      transformedProfile: null,
    }
  },
  computed: {
    ...mapState('occupation', ['occupations']),
  },
  methods: {
    preview(occupation) {
      this.transformedProfile = {
        ...this.profile,
        occupations: [occupation],
      }
      this.shown = true
    },
  },
  head: {
    title: 'Beruf',
  },
}
</script>
