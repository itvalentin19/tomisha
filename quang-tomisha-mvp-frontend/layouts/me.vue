<template>
  <div class="bg-gray-100 tracking-wider">
    <box-container class="min-h-screen">
      <basic-header class="sticky top-0" />

      <base-pills :items="pages" />

      <main class="p-6">
        <nuxt />
      </main>
    </box-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pages: [
        { text: 'Lebenslauf', to: '/me/profile' },
        { text: 'Berufe', to: '/me/occupations' },
      ],
    }
  },
}
</script>
