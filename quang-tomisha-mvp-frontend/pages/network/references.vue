<template>
  <div>
    <base-segmented-controls v-model="activePage" :items="pages" class="mb-6" />

    <div v-if="!items.length" class="text-sm py-4 text-center text-gray-600">
      Dieser Bereich ist im Augenblick noch leer.
    </div>

    <reference-card
      v-for="item in items"
      :key="item.id"
      :reference="item"
      class="mb-6"
    />
  </div>
</template>

<script>
export default {
  asyncData({ $axios }) {
    return Promise.all([
      $axios.get('/reference/sent'),
      $axios.get('/reference/me'),
    ]).then(([sentReferences, receivedReferences]) => ({
      sentReferences,
      receivedReferences,
    }))
  },
  data() {
    return {
      sentReferences: [],
      receivedReferences: [],
      activePage: 'sent',
      pages: [
        { text: 'Erstellt', value: 'sent' },
        { text: 'Erhalten', value: 'received' },
      ],
    }
  },
  computed: {
    items() {
      return this.activePage === 'sent'
        ? this.sentReferences
        : this.receivedReferences
    },
  },
}
</script>
