<template>
  <layout-body :wide="supports.length > 0">
    <template v-if="supports.length > 0">
      <profile-detail-modal ref="profileModal" />

      <div v-if="selected.length" class="flex items-center mb-8 h-12">
        <base-button inline class="mr-3" danger @click="reject">
          Reject
        </base-button>
        <base-button inline secondary class="mr-3" @click="approve">
          Approve
        </base-button>
      </div>

      <base-table
        v-model="selected"
        :columns="columns"
        :items="supports"
        :pagination="pagination"
        :offline="false"
        selectable
        @pagination="setPagination"
      >
        <template #status="{ item }">
          <span v-if="item.status === 3" class="text-green-600">APPROVED</span>
          <span v-else-if="item.status === 4" class="text-red-600">
            REJECTED
          </span>
          <span v-else>PENDING</span>
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
        :items="supports"
        :total="total"
        :limit="20"
      />
    </template>

    <common-empty v-else />
  </layout-body>
</template>

<script>
import { SupportStatus } from '~/constants'
export default {
  asyncData({ $axios, $utils }) {
    return $axios
      .get('support', {
        params: { take: 20, skip: 0, order: 'createdAt' },
      })
      .then(({ items, total }) => ({
        supports: items.map((item) => ({
          ...item,
          address: $utils.parseJSON(item.address),
        })),
        total,
      }))
  },
  data() {
    return {
      supports: [],
      total: 0,
      skip: 0,
      pagination: {
        order: 'createdAt',
        asc: false,
      },

      selected: [],

      columns: [
        {
          name: 'Email',
          key: 'email',
          minWidth: '150px',
          maxWidth: '300px',
        },
        {
          name: 'Status',
          key: 'status',
          minWidth: '100px',
          maxWidth: '100px',
        },
        {
          name: 'Street',
          key: 'street',
          minWidth: '150px',
          maxWidth: '300px',
          transform: (_, item) => this.$utils.getAddressStreet(item.address),
        },
        {
          name: 'City',
          key: 'city',
          minWidth: '150px',
          maxWidth: '300px',
          transform: (_, item) =>
            item.address &&
            [item.address.zip, item.address.city].filter(Boolean).join(' '),
        },
        {
          name: 'Created by',
          key: 'createdBy',
          minWidth: '150px',
          maxWidth: '300px',
        },

        {
          name: 'Created at',
          key: 'createdAt',
          minWidth: '160px',
          maxWidth: '300px',
          transform: (d) => this.$dayjs(d).format('DD.MM.YYYY HH:mm'),
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

        this.fetchSupports()
      },
    },
  },
  methods: {
    setPagination(pagination) {
      if (this.$utils.isModified(this.pagination, pagination)) {
        this.pagination = pagination
        this.skip = 0
        this.$utils.debounce(() => this.fetchSupports())
      }
    },

    reject() {
      this.changeStatus(SupportStatus.REJECTED)
    },

    approve() {
      this.changeStatus(SupportStatus.APPROVED)
    },

    changeStatus(status) {
      const selected = []
      for (const id of this.selected) {
        const support = this.supports.find((u) => u.id === id)
        if (
          support.status !== status &&
          support.status !== SupportStatus.APPROVED
        ) {
          selected.push(id)
        }
      }
      this.patchSelectedStatus(selected, { status })
    },

    patchSelectedStatus(selected, payload) {
      if (selected.length) {
        this.$axios.patch('support', { ids: selected, ...payload })

        this.supports = this.supports.map((support) => {
          return this.selected.includes(support.id)
            ? {
                ...support,
                ...payload,
              }
            : support
        })
      }

      this.selected = []
    },

    async fetchSupports() {
      await this.$axios
        .get('support', {
          params: {
            take: 20,
            skip: this.skip,
            order: this.pagination.order,
            asc: this.pagination.asc,
          },
        })
        .then(({ items, total }) => {
          this.supports = items
          this.total = total
        })
    },
  },
  head: {
    title: 'Support',
  },
}
</script>
