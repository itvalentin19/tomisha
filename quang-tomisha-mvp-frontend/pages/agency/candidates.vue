<template>
  <layout-body :wide="employments.length > 0">
    <base-table
      v-if="employments.length"
      :columns="columns"
      :items="employments"
      @item-click="$refs.profileModal.open($event.user.slug)"
    >
      <template #default>
        <profile-detail-modal ref="profileModal" />
      </template>

      <template #user="{ item }">
        <profile-brief :profile="item.user" />
      </template>

      <template #agent="{ item }">
        <profile-brief :profile="item.agent" />
      </template>
    </base-table>

    <common-empty v-else />
  </layout-body>
</template>

<script>
export default {
  asyncData({ $axios, $auth }) {
    return $axios
      .get('/employment/candidate', {
        params: {
          agencyId: $auth.companyId,
        },
      })
      .then((employments) => ({ employments }))
  },
  data() {
    return {
      employments: [],

      columns: [
        {
          key: 'user',
          name: 'Name',
          transform: (user) => [user.firstName, user.lastName].join(' '),
        },
        {
          key: 'profession',
          name: 'Berufsbezeichnung',
          transform: (p) => p?.title + '*',
        },
        {
          key: 'startedAt',
          name: 'Einsatzbeginn',
          transform: (d) => this.$dayjs(d).format('DD. MMMM YYYY'),
          getSortedValue: (d) => this.$dayjs(d).format('YYYYMMDDHHmm'),
        },
        {
          key: 'endedAt',
          name: 'Eintsatzende',
          transform: (d) => this.$dayjs(d).format('DD. MMMM YYYY'),
          getSortedValue: (d) => this.$dayjs(d).format('YYYYMMDDHHmm'),
        },
        {
          key: 'agent',
          name: 'Berater',
          transform: (user) => [user.firstName, user.lastName].join(' '),
        },
        {
          key: 'branchName',
          name: 'Unternehmen',
          transform: (_, item) => item.branch.name,
        },
        {
          key: 'branchAddr',
          name: 'Adresse',
          transform: (_, item) =>
            this.$utils.getAddressStreet(item.branch.address),
        },
        {
          key: 'branchZip',
          name: 'PLA',
          transform: (_, item) => item.branch.address?.zip,
        },
        {
          key: 'branchCity',
          name: 'ORT',
          transform: (_, item) => item.branch.address?.city,
        },
      ],
    }
  },
}
</script>
