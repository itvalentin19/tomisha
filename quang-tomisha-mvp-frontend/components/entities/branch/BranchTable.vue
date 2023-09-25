<template>
  <base-table
    v-bind="$attrs"
    :columns="columns"
    :items="items"
    v-on="$listeners"
  >
    <template #status>
      <span
        class="bg-teal-400 text-white rounded-full inline-block px-3 leading-loose select-none"
      >
        Aktive
      </span>
    </template>

    <template #designation="{ item, itemText }">
      <div class="flex items-center">
        <span
          v-if="item.isHeadquater"
          class="inline-flex w-10 h-5 justify-center items-center bg-blue-400 rounded-full mr-2 flex-shrink-0"
        >
          <base-icon icon="home" class="text-white text-xs" />
        </span>

        <span class="truncate">
          {{ itemText }}
        </span>
      </div>
    </template>

    <template #name="{ item }">
      <profile-brief
        :profile="$utils.except(item, 'address')"
        class="items-center"
      />
    </template>
  </base-table>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    items: { type: Array, default: () => [] },
    company: { type: Object, default: null },
  },
  data() {
    return {
      columns: [
        { name: 'Status', key: 'status', sortable: true, maxWidth: '150px' },
        { name: 'Bezeichnung', key: 'designation', maxWidth: '150px' },
        {
          name: 'Unternehmenname',
          key: 'name',
          minWidth: '180px',
          maxWidth: '280px',
        },
        {
          name: 'Adresse',
          key: 'address',
          minWidth: '150px',
          maxWidth: '250px',
          transform: (addr) => this.$utils.getAddressStreet(addr),
        },
        {
          name: 'PLZ',
          key: 'zip',
          width: '80px',
          transform: (_, item) => item.address?.zip,
        },
        {
          name: 'Stand',
          key: 'city',
          minWidth: '120px',
          transform: (_, item) => item.address?.city,
        },
        {
          name: 'Link',
          key: 'slug',
          minWidth: '160px',
          maxWidth: '500px',
          transform: (_, item) =>
            `${this.$utils.origin}/${this.company.slug}/${item.slug}`,
        },
      ],
    }
  },
}
</script>
