<template>
  <layout-body :wide="reports.length > 0">
    <template v-if="reports.length > 0">
      <profile-detail-modal ref="profileModal" />

      <base-table
        :columns="columns"
        :items="reports"
        :pagination="pagination"
        :offline="false"
        @pagination="setPagination"
      >
        <template #url="{ itemText }">
          <a
            :href="itemText"
            target="_blank"
            class="truncate text-teal-600 hover:underline"
          >
            {{ itemText }}
          </a>
        </template>

        <template #message="{ itemText }">
          <div class="w-full whitespace-pre-wrap">{{ itemText }}</div>
        </template>

        <template #createdBy="{ item }">
          <profile-brief
            :profile="item.createdBy"
            avatar-class="w-12 h-12"
            class="items-center cursor-pointer"
            @click.native="$refs.profileModal.open(item.createdBy.slug)"
          />
        </template>
      </base-table>

      <base-pagination
        v-model="page"
        :items="reports"
        :total="total"
        :limit="20"
      />
    </template>

    <common-empty v-else />
  </layout-body>
</template>

<script>
export default {
  asyncData({ $axios }) {
    return $axios
      .get('report', {
        params: { take: 20, skip: 0, order: 'createdAt' },
      })
      .then(({ items, total }) => ({ reports: items, total }))
  },
  data() {
    return {
      reports: [],
      total: 0,
      skip: 0,
      pagination: {
        order: 'createdAt',
        asc: false,
      },

      columns: [
        {
          name: 'Page',
          key: 'url',
          minWidth: '150px',
          maxWidth: '500px',
        },
        {
          name: 'Message',
          key: 'message',
          minWidth: '200px',
          maxWidth: '500px',
        },
        {
          name: 'Reported by',
          key: 'createdBy',
          minWidth: '150px',
          maxWidth: '300px',
          transform: (c) => [c.firstName, c.lastName].join(' '),
        },
        {
          name: 'Reported at',
          key: 'createdAt',
          minWidth: '160px',
          maxWidth: '300px',
          transform: (d) => this.$dayjs(d).format('DD. MMMM YYYY'),
          getSortedValue: (d) => this.$dayjs(d).format('YYYYMMDDHHmm'),
        },
      ],
    }
  },
  computed: {
    page: {
      get() {
        return this.skip / 20
      },
      set(page) {
        this.skip = page * 20

        this.fetchReports()
      },
    },
  },
  methods: {
    setPagination(pagination) {
      if (this.$utils.isModified(this.pagination, pagination)) {
        this.pagination = pagination
        this.skip = 0
        this.$utils.debounce(() => this.fetchReports())
      }
    },
    async fetchReports() {
      await this.$axios
        .get('report', {
          params: {
            take: 20,
            skip: this.skip,
            order: this.pagination.order,
            asc: this.pagination.asc,
          },
        })
        .then(({ items, total }) => {
          this.reports = items
          this.total = total
        })
    },
  },
  head: {
    title: 'Report',
  },
}
</script>
