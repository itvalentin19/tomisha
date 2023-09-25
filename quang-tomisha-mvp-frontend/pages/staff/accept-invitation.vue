<template>
  <base-steps-wrapper
    ref="stepper"
    v-model="draft"
    storage-key="tom:staff:accept"
    :unique-id="`${$auth.user.id}:${fromBranch.id}`"
    :off="isFinished"
    :steps="steps"
    title-prefix="Zum Unternehmen"
    @done="done"
    @dismiss="$router.push('/')"
  >
    <template #step:1>
      <profile-card :profile="fromBranch" class="mb-6" />

      <base-date-picker
        v-model="draft.startedAt"
        label="Geburtsdatum"
        placeholder="Arbeitsbeginn"
        :rules="[$rules.required]"
        class="mb-6"
      />
    </template>

    <template #step:2>
      <input-profession
        v-model="draft.profession"
        :rules="[$rules.required]"
        class="mb-8"
      />

      <base-progress
        :value="[draft.minWorkload, draft.maxWorkload]"
        label="Arbeitspensum (%)"
        class="mb-6"
        @input="
          Object.assign(draft, {
            minWorkload: $event[0],
            maxWorkload: $event[1],
          })
        "
      />

      <base-input-checkbox-group
        v-model="draft.relationships"
        label="Arbeisverhältnisse"
        :items="$store.state.tag.workingRelationships"
        item-value="id"
        :rules="[$rules.required]"
      />
    </template>

    <template #default>
      <base-bottom-actions :items="actions" />
    </template>
  </base-steps-wrapper>
</template>

<script>
import { EmploymentRole } from '~/constants'
export default {
  async asyncData({ route, redirect, $axios, $utils, $auth }) {
    const { notificationId } = route.query
    if (notificationId) {
      const notification = await $axios
        .get(`/notification/${notificationId}`)
        .catch(() => {})
      const { role } = $utils.parseJSON(notification.metadata) || {}

      if (
        role &&
        notification?.userId === $auth.user.id &&
        notification.fromBranch
      ) {
        if ($auth.companyId) {
          $auth.setCompany(null)
        }

        return {
          employment:
            role === EmploymentRole.EMPLOYEE
              ? null
              : {
                  role,
                  companyId: notification.fromBranch.companyId,
                  headquater: notification.fromBranch,
                },
          fromBranch: notification.fromBranch,
        }
      }
    }

    return redirect('/invalid')
  },
  data() {
    return {
      employment: null,
      fromBranch: null,
      draft: {
        startedAt: '',
        profession: null,
        minWorkload: 0,
        maxWorkload: 100,
        relationships: [],
      },
      isFinished: false,
      steps: [
        {
          title: 'Bestägigung',
          note: 'Bestätige, dass du derzeit bei diesem Unternehmen beschäftigt bist. Seit wann bist du bei diesem Unternehmen beschäftigt?',
        },
        {
          title: 'Job',
          note: 'Füge deinen Job hinzu, als was du in dem Unternehmen beschäftigt bist.',
        },
      ],
    }
  },
  computed: {
    actions() {
      return [
        {
          text: this.step === 1 ? 'Bestätigen' : 'Speichern',
          primary: true,
          handler: () => this.$refs.stepper.next(),
        },
        {
          text: 'Abbrechen',
          secondary: true,
          handler: () => this.$refs.stepper.back(),
        },
      ]
    },
  },
  methods: {
    async done() {
      const { profession, ...draft } = this.draft
      draft.professionId = profession.id
      draft.notificationId = +this.$route.query.notificationId
      try {
        await this.$axios.post('/employment/accept', draft)
      } catch (e) {
        return this.$alert.error(e)
      }

      if (this.employment) {
        // eslint-disable-next-line no-unused-expressions
        this.$auth.user.employments?.push?.(this.employment)
      }

      this.isFinished = true
      this.$confirm({
        img: '/img/common_success.svg',
        title: 'Fantastisch',
        text: 'Wir freuen uns, dass du einen Job gefunden hast. Teile diese positive Nachricht, dass du dank Tomisha einen neun Job gefunden hast.',
        okText: 'Teilen',
        cancelText: this.employment ? 'Unternehmen Dashboard' : 'Dashboard',
        done: () => {
          this.$router.push('/', () =>
            this.$utils.share({
              url: location.origin,
              text: `Ich habe gerade einen neuen Job auf Tomisha gefunden. Du kannst es doch genauso machen, geh auf ${location.origin} und finde deinen Traum-Job.`,
            })
          )
        },
        cancel: () => {
          this.$auth.setCompany(this.employment.companyId)
          this.$router.push('/')
        },
      })
    },
  },
  head() {
    return {
      title: 'Zum Unternehmen',
    }
  },
}
</script>
