<template>
  <base-table
    v-model="selected"
    :columns="columns"
    :items="applications"
    :selectable="rejectable"
    @item-click="$refs.modal.show($event)"
  >
    <template #default>
      <company-application-modal
        ref="modal"
        @reject="openRejectModal([$event.id])"
      />

      <base-modal
        v-model="rejectModalState"
        :title="`${rejectingApplications.length} Kandidaten Ansagen`"
        full-height
      >
        <base-note class="mb-6">
          Bist du dir sicher, dass du diesen Kandidaten absagen möchtest? Falls
          ja, bestätige es mit dem Passwort.
        </base-note>

        <profile-card
          v-for="application in rejectingApplications"
          :key="application"
          :profile="application.user"
          class="mb-6"
        />

        <input-password v-model="password" class="mb-6" />

        <base-bottom-actions
          :items="[
            {
              text: 'Bestätigen',
              primary: true,
              disabled: !password,
              handler: reject,
            },
            { text: 'Zurück', handler: () => (rejectModalState = false) },
          ]"
        />
      </base-modal>

      <div v-if="rejectable && selected.length" class="text-right px-6 mb-10">
        <base-button inline @click="openRejectModal(selected)">
          Absage
        </base-button>
      </div>
    </template>

    <template #user="{ item }">
      <profile-brief
        :profile="item.user"
        body-class="text-gray-600"
        avatar-class="w-12 h-12"
      >
        <template #description>
          <div class="truncate">
            {{ item.occupation.shortDescription }}
          </div>
        </template>
      </profile-brief>
    </template>
  </base-table>
</template>

<script>
import { JobLogAction } from '~/constants'
export default {
  props: {
    applications: { type: Array, required: true },
    rejectable: Boolean,
  },
  data() {
    return {
      selected: [],
      password: '',
      rejectModalState: false,
      rejectingApplications: [],

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
          transform: (_, item) => item.occupation?.profession?.title + '*',
        },
      ],
    }
  },
  methods: {
    openRejectModal(ids) {
      this.rejectingApplications = ids
        .map((id) => this.applications.find((ap) => ap.id === id))
        .filter(Boolean)
      this.rejectModalState = true
    },
    reject() {
      this.$axios.post('/application/log', {
        applicationIds: this.rejectingApplications,
        action: JobLogAction.NO,
        password: this.password,
      })
      for (const id of this.rejectingApplications) {
        const i = this.applications.findIndex((a) => a.id === id)
        if (i !== -1) {
          Object.assign(this.applications, {
            logs: [
              ...(this.applications.logs || []),
              { action: JobLogAction.DELETE, createdAt: new Date() },
            ],
          })
          this.applications.splice(i, 1)
        }
      }
      this.rejectModalState = false
      this.rejectingApplications = []
      this.$alert.success(
        'Du hast den Kandidaten eine Absage gesendet. Sie wurden zu den Absagen hinzugefügt.'
      )
    },
  },
}
</script>
