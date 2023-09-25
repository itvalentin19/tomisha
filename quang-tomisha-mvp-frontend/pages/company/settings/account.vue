<template>
  <div>
    <input-change-email
      :value="$auth.company.email"
      label="Deine geschäftliche E-Mail-Adressee"
      placeholder="angelina.federer@tomisha.com"
      class="mb-6"
    />

    <deactivate-modal class="mb-6" />

    <base-button secondary class="mb-6" @click="logout"> Abmelden </base-button>
  </div>
</template>

<script>
export default {
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
  },
  head: {
    title: 'Konto',
  },
}
</script>
