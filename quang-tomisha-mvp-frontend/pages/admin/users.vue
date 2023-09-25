<template>
  <layout-body wide>
    <profile-detail-modal ref="profileModal" />

    <div class="flex items-center px-6 lg:px-0 mb-8 h-12">
      <template v-if="selected.length">
        <base-button inline class="mr-3" danger @click="lock">
          Lock
        </base-button>
        <base-button inline secondary class="mr-3" @click="unlock">
          Unlock
        </base-button>
      </template>

      <base-input
        v-else
        :value="searchText"
        placeholder="Search by email"
        class="w-full sm:max-w-sm"
        @input="search"
      />
    </div>

    <base-table
      v-model="selected"
      :columns="columns"
      :items="users"
      :pagination="pagination"
      :offline="false"
      selectable
      @item-click="$refs.profileModal.open($event.slug)"
      @pagination="setPagination"
    >
      <template #name="{ item }">
        <profile-brief
          :profile="item"
          avatar-class="w-12 h-12"
          class="items-center"
        />
      </template>

      <template #street="{ item }">
        {{ $utils.getAddressStreet(item.address) || '—' }}
      </template>

      <template #city="{ item }">
        {{
          (item.address &&
            [item.address.zip, item.address.city].filter(Boolean).join(' ')) ||
          '—'
        }}
      </template>

      <template #createdAt="{ item }">
        {{ $dayjs(item.createdAt).format('DD.MM.YYYY HH:mm') }}
      </template>
    </base-table>

    <base-pagination v-model="page" :items="users" :total="total" :limit="20" />
  </layout-body>
</template>

<script>
import { UserStatus } from '~/constants'
export default {
  asyncData({ $axios }) {
    return $axios
      .get('user/list', {
        params: { take: 20, skip: 0, order: 'createdAt' },
      })
      .then(({ items, total }) => ({ users: items, total }))
  },
  data() {
    return {
      users: [],
      total: 0,
      skip: 0,
      pagination: {
        order: 'createdAt',
        asc: false,
      },

      selected: [],

      searchText: '',

      columns: [
        {
          name: 'Name',
          key: 'name',
          minWidth: '150px',
          maxWidth: '300px',
        },
        {
          name: 'Email',
          key: 'email',
          minWidth: '150px',
          maxWidth: '300px',
        },
        {
          name: 'Street',
          key: 'street',
          minWidth: '150px',
          maxWidth: '300px',
        },
        {
          name: 'City',
          key: 'city',
          minWidth: '150px',
          maxWidth: '300px',
        },
        {
          name: 'Created at',
          key: 'createdAt',
          minWidth: '160px',
          maxWidth: '300px',
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

        this.fetchUsers()
      },
    },
  },
  methods: {
    setPagination(pagination) {
      if (this.$utils.isModified(this.pagination, pagination)) {
        this.pagination = pagination
        this.skip = 0
        this.$utils.debounce(() => this.fetchUsers())
      }
    },

    lock() {
      this.changeStatus(UserStatus.LOCKED)
    },

    unlock() {
      this.changeStatus(UserStatus.UNAVAILABLE)
    },

    changeStatus(status) {
      const selected = []
      for (const id of this.selected) {
        const user = this.users.find((u) => u.id === id)
        if (
          user.id !== this.$auth.user.id &&
          user.status !== status &&
          (status !== UserStatus.UNAVAILABLE ||
            user.status === UserStatus.LOCKED)
        ) {
          selected.push(id)
        }
      }
      this.patchSelectedUsersStatus(selected, { status })
    },

    patchSelectedUsersStatus(selected, payload) {
      if (selected.length) {
        this.$axios.patch('user', { ids: selected, ...payload })

        this.users = this.users.map((user) => {
          return this.selected.includes(user.id)
            ? {
                ...user,
                ...payload,
              }
            : user
        })
      }

      this.selected = []
    },

    search(text) {
      this.searchText = text

      this.$utils.debounce(() => this.fetchUsers())
    },

    async fetchUsers() {
      await this.$axios
        .get('user/list', {
          params: {
            take: 20,
            skip: this.skip,
            email: this.searchText || undefined,
            order: this.pagination.order,
            asc: this.pagination.asc,
          },
        })
        .then(({ items, total }) => {
          this.users = items
          this.total = total
        })
    },
  },
  head: {
    title: 'Users management',
  },
}
</script>
