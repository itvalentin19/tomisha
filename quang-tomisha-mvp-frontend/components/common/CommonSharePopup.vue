<template>
  <div></div>
</template>

<script>
export default {
  methods: {
    open(shareOpts) {
      this.$confirm({
        img: '/img/share.svg',
        title: 'Teilen',
        text: 'Wie möchtest du den Konakt teilen?',
        actions: [
          {
            text: 'Kontakte',
            primary: true,
            // TODO open contacts list to select a contact
            handler: () => {},
          },
          {
            text: 'Extern',
            secondary: true,
            handler: () => this.$utils.share(shareOpts),
          },
        ],
      })
    },
  },
}
</script>
