<template>
  <div
    class="min-h-screen w-full flex flex-col lg:min-h-auto max-w-xl mx-auto lg:mx-0 px-6 lg:px-0 lg:mb-24"
  >
    <base-icon
      icon="back"
      class="lg:opacity-0 lg:pointer-events-none cursor-pointer mt-4 mb-5 lg:mb-0 lg:mt-0 lg:h-0"
      @click="$router.go(-1)"
    />

    <base-figure
      img="/img/company_search.svg"
      img-class="lg:hidden"
      title="Unternehmen finden"
      text="Bist du der Erste der ein Unternehmensprofil erstellt oder nicht. Finde es mit der suche hinaus."
      class="mb-6 text-left"
    />

    <div class="pt-10 pb-7 mt-auto">
      <base-button primary @click="check"> Suchen </base-button>
    </div>

    <company-checker ref="checker" />
  </div>
</template>

<script>
export default {
  layout: 'auth',
  methods: {
    check() {
      this.$refs.checker.open()
    },
  },
  head: {
    title: 'Search for company',
  },
}
</script>
