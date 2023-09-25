<template>
  <base-table
    :columns="columns"
    :items="transformedApplications"
    @item-click="$refs.modal.show($event)"
  >
    <user-application-modal ref="modal" @withraw="onWithdraw" />

    <template #updatedAt="{ item }">
      {{ $dayjs(item.updatedAt).format('DD. MMMM YYYY') }}
    </template>

    <template #status="{ item, itemText }">
      <template v-if="!item.status"> {{ itemText }} </template>
      <div
        v-else
        class="rounded-full px-3 py-1 inline-block"
        :class="[
          'bg-' + colorByAction[item.status],
          item.status === 4 ? 'text-black' : 'text-white',
        ]"
      >
        {{ itemText }}
      </div>
    </template>

    <template #job="{ itemText }">
      <span class="font-semibold">
        {{ itemText }}
      </span>
    </template>
  </base-table>
</template>

<script>
import { ApplicationLogText, JobLogColor, JobLogAction } from '~/constants'
export default {
  layout: 'basic',
  props: {
    applications: { type: Array, required: true },
  },
  data() {
    return {
      colorByAction: JobLogColor,
      columns: [
        {
          name: 'Status update',
          key: 'updatedAt',
          mixWidth: '120px',
          transform: (d) => this.$dayjs(d).format('DD. MMMM YYYY'),
          getSortedValue: (d) => this.$dayjs(d).format('YYYYMMDDHHmm'),
        },
        {
          name: 'Status',
          key: 'status',
          transform: (s) => ApplicationLogText[s] || ApplicationLogText.default,
        },
        {
          name: 'Jobinserat',
          key: 'job',
          minWidth: '180px',
          maxWidth: '300px',
          transform: (job) => job?.title,
        },
        {
          name: 'Beruf',
          key: 'occupation',
          minWidth: '150px',
          transform: (oc) => oc?.profession?.title + '*',
        },
        {
          name: 'Unternehmen',
          key: 'branch',
          maxWidth: '250px',
          minWidth: '180px',
          transform: (_, item) => item.job?.branch?.name,
        },
        {
          name: 'PLZ',
          key: 'zip',
          minWidth: '100px',
          transform: (_, item) => item.job?.branch?.address?.zip,
        },
        {
          name: 'ORT',
          key: 'city',
          minWidth: '100px',
          transform: (_, item) => item.job?.branch?.address?.city,
        },
      ],
    }
  },
  computed: {
    transformedApplications() {
      return this.applications.map((ap) => ({
        ...ap,
        status: this.getStatus(ap),
      }))
    },
  },
  methods: {
    onWithdraw(id) {
      const i = this.applications.findIndex((inte) => inte.id === id)
      if (i !== -1) {
        this.applications.splice(i, 1, {
          ...this.applications[i],
          logs: [
            ...(this.applications[i].logs || []),
            {
              action: JobLogAction.DELETE,
              createdAt: Date.now(),
            },
          ],
        })
      }
    },
    getStatus(application) {
      let status = null
      let tmp = null
      for (const log of application.logs) {
        const d = this.$dayjs(log.createdAt)
        if (!tmp || d.isAfter(tmp)) {
          status = log.action
          tmp = d
        }
      }
      return status
    },
  },
}
</script>
