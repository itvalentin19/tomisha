<template>
  <layout-body :wide="jobs.length > 0">
    <template v-if="!jobs.length">
      <div class="mb-6 select-none">
        <img src="/img/jobs_empty.svg" class="w-full" />
      </div>

      <h2 class="text-2xl mb-12 flex items-center">
        Erstelle dein erstes Jobinserat
      </h2>
    </template>

    <base-button
      v-if="$auth.companyId"
      secondary
      icon="plus-circle"
      class="mb-6"
      to="/edit/job/new"
    >
      Jobinserat erstellen
    </base-button>

    <base-table
      v-if="jobs.length"
      :columns="columns"
      :items="jobs"
      @item-click="onItemClick"
    >
      <template #isOpen="{ item, itemText }">
        <div
          class="rounded-full px-4 py-1 text-white inline-block"
          :class="[item.isOpen ? 'bg-teal-400' : 'bg-red-400']"
        >
          {{ itemText }}
        </div>
      </template>
    </base-table>
  </layout-body>
</template>

<script>
export default {
  layout: 'basic',
  asyncData({ $axios, $auth, $dayjs }) {
    return $axios
      .get('/job/company', {
        params: { companyId: $auth.companyId },
      })
      .then(({ items }) => ({
        jobs: items.map((item) => ({
          isOpen: !$dayjs().startOf('day').isBefore($dayjs(item.publishAt)),
          ...item,
        })),
      }))
  },
  data() {
    return {
      jobs: [],
      columns: [
        {
          name: 'Status update',
          key: 'updatedAt',
          mixWidth: '120px',
          transform: (d) => this.$dayjs(d).format('DD. MMMM YYYY'),
        },
        {
          name: 'Status',
          key: 'isOpen',
          transform: (open) => (open ? 'Offen' : 'Inaktive'),
        },
        {
          name: 'Jobinserat',
          key: 'title',
          minWidth: '180px',
          maxWidth: '300px',
        },
        {
          name: 'Beruf',
          key: 'profession',
          minWidth: '150px',
          transform: (p) => p?.title,
        },
        {
          name: 'Unternehmen',
          key: 'branch',
          minWidth: '180px',
          maxWidth: '300px',
          transform: (b) => b?.name,
        },
        {
          name: 'Adresse',
          key: 'street',
          minWidth: '150px',
          maxWidth: '300px',
          transform: (_, item) =>
            this.$utils.getAddressStreet(item.branch.address),
        },
        {
          name: 'PLZ',
          key: 'zip',
          minWidth: '100px',
          transform: (_, item) => item.branch.address?.zip,
        },
        {
          name: 'ORT',
          key: 'city',
          minWidth: '100px',
          transform: (_, item) => item.branch.address?.city,
        },
      ],
    }
  },
  methods: {
    onItemClick(job) {
      this.$router.push({
        path: '/company/job/applications',
        query: {
          id: job.id,
        },
      })
    },
  },
  head: {
    title: 'Jobinserat',
  },
}
</script>
