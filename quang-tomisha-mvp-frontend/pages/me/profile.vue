<template>
  <div>
    <base-expand-group :items="groups">
      <template #public>
        <profile-card :profile="publicProfile" @click="preview(true)">
          <base-button class="mt-6">Öffnen</base-button>
        </profile-card>
      </template>

      <template #friend>
        <profile-card :profile="friendProfile" @click="preview(false)">
          <base-button class="mt-6">Öffnen</base-button>
        </profile-card>
      </template>
    </base-expand-group>

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
      <profile-detail :profile="transformedProfile" @change="updateProfile" />

      <profile-editor-modal ref="editor" :profile="transformedProfile" />
    </base-modal>
  </div>
</template>

<script>
export default {
  scrollToTop: true,
  props: {
    profile: { type: Object, required: true },
  },
  data() {
    return {
      groups: Object.freeze([
        { title: 'Öffentliches Profil', key: 'public' },
        { title: 'Profilansicht für Freunde', key: 'friend' },
      ]),
      shown: false,
      transformedProfile: null,
      publicProfile: this.$utils.extract(this.$auth.user, [
        'picture',
        'status',
        'firstName',
      ]),
      friendProfile: this.$utils.extract(this.$auth.user, [
        'picture',
        'status',
        'firstName',
        'lastName',
        'address',
      ]),
    }
  },
  methods: {
    preview(isPublic) {
      if (isPublic) {
        const profile = this.$utils.clone(this.profile)
        profile.lastName = ''
        profile.phone = null
        profile.address = null
        profile.dob = profile.dob ? this.$dayjs(profile.dob).year() : null
        profile.files = []
        this.transformedProfile = profile
      } else {
        this.transformedProfile = this.profile
      }

      this.shown = true
    },
    updateProfile(changes) {
      Object.assign(this.profile, changes || {})
    },
  },
  head: {
    title: 'Lebenslauf',
  },
}
</script>
