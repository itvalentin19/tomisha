<template>
  <base-modal v-model="shown" full-height title="Mitarbeiter* hinzufügen">
    <template #activator>
      <base-button secondary icon="plus-circle" @click="open()">
        Mitarbeiter hinzufügen
      </base-button>
    </template>

    <base-note class="mb-12 mt-6">
      Trage die E-Mail-Adresse ein, um dem Mitarbeiter* eine Einladung zu
      senden.
    </base-note>

    <base-form ref="form" @submit="submit">
      <base-input
        v-model="draft.email"
        label="E-Mail-Adresse"
        type="email"
        placeholder="angelina.federer@mail.com"
        :rules="[
          $rules.email,
          (e) => !e || e !== $auth.user.email || 'Cannot invite yourself',
        ]"
        class="mb-6"
      />

      <base-textarea
        v-model="draft.message"
        label="Kommentar"
        placeholder="Nachricht an den Eigentümer."
        :rules="[$rules.maxLength(250)]"
        class="mb-8"
      />

      <base-input-radio-group
        v-if="company.branches && company.branches.length"
        v-model="draft.branchId"
        label="Beschäftig am Standort"
        :items="company.branches"
        item-text="name"
        item-value="id"
        class="mb-8"
      />

      <base-input-radio-group
        v-model="draft.role"
        label="Benutzerzugriff"
        :items="roles"
        class="mb-8"
      />
    </base-form>

    <company-ownership-transfer
      v-if="$auth.employment.role === staffRole.ADMIN"
      ref="transferOwner"
      :branches="company.branches"
    />

    <template #footer>
      <base-button
        primary
        :disabled="!draft.role || !draft.email || !draft.branchId"
        disabled-on-loading
        class="mb-2"
        @click="$refs.form.submit()"
      >
        Senden
      </base-button>
    </template>
  </base-modal>
</template>

<script>
import { EmploymentRole, EmploymentRoleTitle } from '~/constants'
export default {
  inheritAttrs: false,
  props: {
    company: { type: Object, required: true },
  },
  data() {
    return {
      shown: false,
      draft: {
        role: null,
        email: null,
        branchId: null,
        message: null,
      },
      staffRole: EmploymentRole,
    }
  },
  computed: {
    roles() {
      const roles = []
      const employment = this.$auth.employment
      if (employment?.role >= EmploymentRole.HR) {
        roles.push(EmploymentRole.EMPLOYEE)
      }
      if (employment?.role >= EmploymentRole.MAINTAINER) {
        roles.push(EmploymentRole.HR)
      }
      if (employment?.role >= EmploymentRole.ADMIN) {
        roles.push(EmploymentRole.MAINTAINER, EmploymentRole.ADMIN)
      }
      return roles.map((value) => ({
        value,
        text: EmploymentRoleTitle[value],
      }))
    },
  },
  methods: {
    open() {
      this.draft = {
        email: null,
        message: null,
        role: null,
        branchId: null,
      }

      this.shown = true
    },

    close() {
      this.shown = false
    },

    submit() {
      if (this.draft.role === EmploymentRole.ADMIN) {
        this.$refs.transferOwner.open((password) => this.invite(password))
      } else {
        this.invite()
      }
    },

    async invite(password) {
      try {
        const payload = {
          userEmail: this.draft.email,
          role: this.draft.role,
          message: this.draft.message,
          branchId: this.draft.branchId,
          companyId: this.company.id,
        }

        if (password) {
          payload.password = password
        }

        await this.$axios.post('/employment/invite', payload)
        this.shown = false
      } catch (e) {
        this.$alert.error(e)
      }
    },
  },
}
</script>
