<template>
  <box-container class="min-h-screen flex flex-col p-6">
    <base-page-header
      title="Anfrage"
      class="mb-6"
      @dismiss="$router.push('/')"
    />

    <base-note class="mb-12 mt-6">
      Ist es richtig, dass dieser Mitarbeiter in diesem Unternehmen beschäftigt
      ist?
    </base-note>

    <profile-card :profile="fromUser" class="mb-10" />

    <base-form class="flex-grow flex flex-col" @submit="submit">
      <base-textarea
        v-model="draft.message"
        label="Kommentar"
        placeholder="Nachricht an den Eigentümer."
        :rules="[$rules.maxLength(250)]"
        class="mb-8"
      />

      <base-input-radio-group
        v-if="branches && branches.length"
        v-model="draft.branchId"
        label="Beschäftig am Standort"
        :items="branches"
        item-text="name"
        item-value="id"
      />

      <base-input-radio-group
        v-if="roles.length"
        v-model="draft.role"
        label="Benutzerzugriff"
        :items="roles"
        class="mb-8"
      />

      <div class="flex-grow" />

      <base-button secondary class="mb-6" @click="decline">
        nicht zustimmen
      </base-button>

      <base-button
        primary
        type="submit"
        :disabled="!draft.role || !draft.branchId"
        disabled-on-loading
        class="mb-2"
      >
        Zustimmen
      </base-button>
    </base-form>

    <company-ownership-transfer
      v-if="$auth.employment && $auth.employment.role === staffRole.ADMIN"
      ref="transferOwner"
      :branches="branches"
      :user="fromUser"
    />
  </box-container>
</template>

<script>
import {
  NotificationStatus,
  EmploymentRole,
  EmploymentRoleTitle,
} from '~/constants'
export default {
  layout: 'full',
  async asyncData({ route, redirect, $axios, $auth }) {
    const { notificationId, receiverId } = route.query

    if (notificationId) {
      if (!$auth.setCompany(receiverId, true)) {
        return redirect('/')
      }

      const notification = await $axios
        .get(`/notification/${notificationId}?companyId=${$auth.companyId}`)
        .catch(() => {})

      $auth.setCompany(notification?.companyId)

      if (notification?.fromUser && $auth.company) {
        return {
          notificationId,
          fromUser: notification.fromUser,
          branches: await $axios.get(
            '/branch?companyId=' + notification.companyId
          ),
        }
      }
    }

    return redirect('/invalid')
  },
  data() {
    return {
      fromUser: null,
      notificationId: null,
      draft: {
        message: null,
        role: null,
        branchId: null,
      },
      branches: [],
      staffRole: EmploymentRole,
    }
  },
  computed: {
    roles() {
      const roles = []
      const { role } = this.$auth.employment || {}
      if (role >= EmploymentRole.HR) {
        roles.push({
          text: EmploymentRoleTitle[EmploymentRole.EMPLOYEE],
          value: EmploymentRole.EMPLOYEE,
        })
      }
      if (role >= EmploymentRole.MAINTAINER) {
        roles.push({
          text: EmploymentRoleTitle[EmploymentRole.HR],
          value: EmploymentRole.HR,
        })
      }
      if (role >= EmploymentRole.ADMIN) {
        roles.push(
          {
            text: EmploymentRoleTitle[EmploymentRole.MAINTAINER],
            value: EmploymentRole.MAINTAINER,
          },
          {
            text: EmploymentRoleTitle[EmploymentRole.ADMIN],
            value: EmploymentRole.ADMIN,
          }
        )
      }
      return roles
    },
  },
  methods: {
    submit() {
      if (this.draft.role === EmploymentRole.ADMIN) {
        this.$refs.transferOwner.open((password) => this.accept(password))
      } else {
        this.accept()
      }
    },

    async accept(password) {
      try {
        const payload = {
          notificationId: +this.$route.query.notificationId,
          branchId: this.draft.branchId,
          role: this.draft.role,
          message: this.draft.message,
        }

        if (password) {
          payload.password = password
        }

        await this.$axios.post('/employment', payload)
      } catch (e) {
        return this.$alert.error(e)
      }

      if (this.draft.role === EmploymentRole.ADMIN) {
        this.$set(this.$auth.employment, 'role', EmploymentRole.MAINTAINER)
      }

      this.$router.push('/', () => {
        this.$alert.success(
          'Du hast ein Mitarbeiter zu deinem Team hinzugefügt.'
        )
      })
    },

    async decline() {
      await this.$axios.patch('/notification/' + this.notificationId, {
        status: NotificationStatus.NO,
      })
      this.$router.push('/', () => {
        this.$alert.success(
          'Der Mitarbeiter wurde nicht zu deinem Team hinzugefügt.'
        )
      })
    },
  },
}
</script>
