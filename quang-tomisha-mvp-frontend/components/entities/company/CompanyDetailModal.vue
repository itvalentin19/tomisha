<template>
  <base-modal ref="modal" :actions="actions" :sticky-header="false">
    <company-detail v-if="company" :company="company" />
  </base-modal>
</template>

<script>
export default {
  data() {
    return {
      company: null,
    }
  },
  computed: {
    actions() {
      return this.company?.id === this.$auth.companyId
        ? [
            {
              icon: 'pencil',
              text: 'Bearbeiten',
              handler: () => this.$router.push('/company/profile/'),
            },
          ]
        : []
    },
  },
  methods: {
    async show(slug) {
      this.company = await this.$axios.get('/public/company/' + slug)
    },
  },
}
</script>
