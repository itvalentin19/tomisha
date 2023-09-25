<template>
  <base-table
    :columns="columns"
    :items="transformedInterviews"
    @item-click="$refs.modal.open($event)"
  >
    <template #default>
      <company-interview-modal ref="modal" @withdraw="onWithdraw" />
    </template>

    <template #user="{ item }">
      <profile-brief
        :profile="item.user"
        body-class="text-gray-600"
        avatar-class="w-12 h-12"
      >
        <template #description>
          <div class="truncate">
            {{ item.application.occupation.shortDescription }}
          </div>
        </template>
      </profile-brief>
    </template>

    <template #profession="{ itemText }">
      <base-chip :text="itemText" />
    </template>

    <template #status="{ item, itemText }">
      <template v-if="!item.status"> {{ itemText }} </template>
      <div
        v-else
        class="rounded-full inline-block px-3 py-1"
        :class="[
          'bg-' + colorByAction[item.status],
          item.status === 4 ? 'text-black' : 'text-white',
        ]"
      >
        {{ itemText }}
      </div>
    </template>
  </base-table>
</template>

<script>
import { InterviewLogText, JobLogColor, JobLogAction } from '~/constants'
export default {
  props: {
    interviews: { type: Array, required: true },
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
          name: 'Name',
          key: 'user',
          minWidth: '200px',
          maxWidth: '350px',
          transform: (user) => [user.firstName, user.lastName].join(' '),
        },
        {
          name: 'Berufsbezeichnung',
          key: 'profession',
          minWidth: '120px',
          maxWidth: '300px',
          transform: (_, item) =>
            item.application.occupation?.profession?.title + '*',
        },
        {
          name: 'Status',
          key: 'status',
          transform: (status) =>
            InterviewLogText[status] || InterviewLogText.default,
        },
      ],
    }
  },
  computed: {
    transformedInterviews() {
      return this.interviews.map((ap) => ({
        ...ap,
        status: this.getLatestAction(ap),
      }))
    },
  },
  methods: {
    onWithdraw(id) {
      const i = this.interviews.findIndex((inte) => inte.id === id)
      if (i !== -1) {
        this.interviews.splice(i, 1, {
          ...this.interviews[i],
          logs: [
            ...(this.interviews[i].logs || []),
            {
              action: JobLogAction.DELETE,
              createdAt: Date.now(),
            },
          ],
        })
      }
    },
    getLatestAction(application) {
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
