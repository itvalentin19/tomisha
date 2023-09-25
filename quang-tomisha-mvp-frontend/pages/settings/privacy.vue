<template>
  <div>
    <public-setting-modal class="mb-6" />

    <base-modal full-height class="mb-6">
      <template #activator>
        <base-button secondary>Status aktualisieren</base-button>
      </template>

      <profile-status @change="setStatus" />
    </base-modal>

    <block-list secondary class="mb-6" />

    <deactivate-modal class="mb-6" />

    <base-button secondary class="mb-6" @click="logout"> Abmelden </base-button>
  </div>
</template>

<script>
export default {
  scrollToTop: true,
  methods: {
    logout() {
      this.$confirm({
        img: '/img/logout.svg',
        icon: 'warning',
        iconColor: 'red-600',
        title: 'Abmelden',
        text: 'Bist du sicher, dass du dich abmelden möchtest?',
        actions: [
          { text: 'Nicht abmelden', primary: true },
          {
            text: 'Abmelden',
            danger: true,
            handler: () => this.$auth.logout(),
          },
        ],
      })
    },

    setStatus(status) {
      if (status === this.$auth.user.status) {
        return
      }

      this.$axios.patch('me', { status })
      this.$auth.updateUser({ status })
    },
  },
  head: {
    title: 'Datenschutz',
  },
}
</script>
