<template>
  <layout-body wide>
    <company-branches
      wide
      :value="branches"
      :company="{ ...$auth.company, branches: [$auth.company.headquater] }"
      class="mb-12"
    />

    <input-slug v-model="$auth.company.slug" class="max-w-lg" />
  </layout-body>
</template>

<script>
export default {
  layout: 'basic',
  asyncData({ $axios, $auth }) {
    return $axios
      .get('/branch', {
        params: { companyId: $auth.companyId },
      })
      .then((branches) => {
        const headOffice = branches.filter((branch) => branch.isHeadquater)
        branches.map((branch) => {
          if (!branch.isHeadquater && headOffice.length > 0)
            branch.picture = headOffice[0].picture
          return branch
        })
        return { branches }
      })
  },
  data() {
    return {
      branches: [],
    }
  },
}
</script>
