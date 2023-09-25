<template>
  <layout-body :wide="applications.length > 0">
    <user-application-table
      v-if="applications.length"
      :applications="applications"
    />

    <base-figure
      v-else
      img="/img/no_items.svg"
      title="Noch keine Bewerbung gesendet"
      text="Sende deinen ersten Bewerbung, den aktuellen Status kannst du hier überprüfen."
      class="pb-32 md:pb-0"
    >
      <base-button primary to="/jobs" class="mt-10">
        Bewerbung senden
      </base-button>
    </base-figure>
  </layout-body>
</template>

<script>
export default {
  layout: 'basic',
  asyncData({ $axios }) {
    return $axios
      .get('/application/me')
      .then(({ items }) => ({ applications: items }))
  },
  data() {
    return {
      applications: [],
    }
  },
  head: {
    title: 'Bewerbungen',
  },
}
</script>
