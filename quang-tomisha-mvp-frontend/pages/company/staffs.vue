<template>
  <layout-body wide>
    <company-staffs
      v-if="company"
      v-model="company.staffs"
      :company="company"
      wide
    />
  </layout-body>
</template>

<script>
export default {
  layout: 'basic',
  asyncData({ $axios, $auth }) {
    return $axios.get('/company/' + $auth.companyId).then((company) => ({
      company: {
        ...company,
        staffs: company.staffs.map((s) => ({
          ...s,
          branch: company.branches.find((b) => b.id === s.branchId),
        })),
      },
    }))
  },
  data() {
    return {
      company: null,
    }
  },
}
</script>
