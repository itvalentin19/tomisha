<template>
  <div>
    <input-change-email
      :value="$auth.user.email"
      label="Private E-Mail-Adresse"
      placeholder="angelina.federer@mail.com"
      class="mb-6"
    />

    <input-change-password class="mb-6" />

    <input-slug
      v-model="$auth.user.slug"
      label="Persönliche URL"
      activator-text="Eine persönliche URL erstellen"
      class="mb-6"
    />

    <!-- TODO Multi language -->
    <!-- <base-input label="Anzeigesprache" placeholder="Deutsch" class="mb-6" />
    <base-input label="E-Mail Sprache" placeholder="Deutsch" class="mb-6" /> -->
  </div>
</template>

<script>
export default {
  scrollToTop: true,
  head: {
    title: 'Allgemein',
  },
}
</script>
