<template>
  <base-modal ref="modal" full-height>
    <template #activator>
      <base-button secondary>Öffentliches Profil</base-button>
    </template>

    <base-figure
      img="/img/public_setting.svg"
      title="Öffentliches Profil"
      text="Hier kannst du entscheiden, ob dein Profil öffentlich sichtbar ist."
      class="mb-12"
    />

    <base-switch v-model="isPublic" label="Sichtbar" class="mb-6" />

    <template #footer>
      <base-button @click="$refs.modal.close()">Zurück</base-button>
    </template>
  </base-modal>
</template>

<script>
export default {
  computed: {
    isPublic: {
      get() {
        return !!this.$auth.user?.public
      },
      set(isPublic) {
        this.$auth.updateUser({ public: isPublic })
        this.$axios.patch('me', { public: isPublic })
      },
    },
  },
}
</script>
