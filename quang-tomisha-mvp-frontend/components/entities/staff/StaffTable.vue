<template>
  <base-table
    v-bind="$attrs"
    :columns="columns"
    :items="items"
    v-on="$listeners"
  >
    <template #user="{ item }">
      <profile-brief
        :profile="item.user"
        avatar-class="w-12 h-12"
        class="items-center"
      />
    </template>

    <template #profession="{ itemText }">
      <span
        v-if="itemText"
        class="bg-gray-200 rounded-xl inline-block px-3 leading-snug select-none"
      >
        {{ itemText }}*
      </span>
    </template>

    <template #branch="{ item, itemText }">
      <div class="flex items-center">
        <span
          v-if="item.branch && item.branch.isHeadquater"
          class="inline-flex w-10 h-5 justify-center items-center bg-blue-400 rounded-full mr-2 flex-shrink-0"
        >
          <base-icon icon="home" class="text-white text-xs" />
        </span>

        {{ itemText || '—' }}
      </div>
    </template>

    <template #addEmployee>
      <span
        class="bg-teal-400 text-white rounded-full inline-block px-3 leading-loose select-none"
      >
        Aktive
      </span>
    </template>

    <template #removeEmployee>
      <span
        class="bg-teal-400 text-white rounded-full inline-block px-3 leading-loose select-none"
      >
        Aktive
      </span>
    </template>

    <template #addJob>
      <span
        class="bg-teal-400 text-white rounded-full inline-block px-3 leading-loose select-none"
      >
        Aktive
      </span>
    </template>

    <template #publishJob>
      <span
        class="bg-teal-400 text-white rounded-full inline-block px-3 leading-loose select-none"
      >
        Aktive
      </span>
    </template>
  </base-table>
</template>

<script>
import { EmploymentRoleTitle } from '~/constants'
export default {
  inheritAttrs: false,
  props: {
    items: { type: Array, default: () => [] },
    responsibleMode: Boolean,
  },
  data() {
    return {
      commonColumns: [
        {
          name: 'Name',
          key: 'user',
          minWidth: '150px',
          maxWidth: '300px',
          transform: (user) =>
            user && [user.firstName, user.lastName].filter(Boolean).join(' '),
        },
        {
          name: 'Berufsbezeichnung',
          key: 'profession',
          minWidth: '140px',
          transform: (prof) => prof?.title,
        },
      ],

      normalColumns: [
        {
          name: 'Benutzerzugriff',
          key: 'role',
          transform: (role) => EmploymentRoleTitle[role],
        },
        { name: 'Standort', key: 'branch', transform: (b) => b?.designation },
        {
          name: 'Hinzugefügt',
          key: 'startedAt',
          transform: (d) => d && this.$dayjs(d).format('DD. MMMM YYYY'),
          getSortedValue: (d) => this.$dayjs(d).format('YYYYMMDDHHmm'),
        },
      ],

      responsibleColumns: [
        { name: 'Mitarbeiter hinzufügen', key: 'addEmployee' },
        { name: 'Mitarbeiter Löschen', key: 'removeEmployee' },
        { name: 'Jobinserat erstellen', key: 'addJob' },
        {
          name: 'Jobinserat veröffentlichen',
          key: 'publishJob',
          maxWidth: '500px',
        },
      ],
    }
  },
  computed: {
    columns() {
      return this.commonColumns.concat(
        this.responsibleMode ? this.responsibleColumns : this.normalColumns
      )
    },
  },
}
</script>
