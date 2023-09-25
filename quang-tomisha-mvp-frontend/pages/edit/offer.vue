<template>
  <base-steps-wrapper
    v-if="application"
    ref="stepper"
    v-model="draft"
    storage-key="tom:offer:draft"
    :unique-id="$route.query.applicationId"
    :off="isFinished"
    :steps="steps"
  >
    <template #step:basic>
      <label class="block mb-1 text-gray-600 text-sm">
        Neuer Mitarbeiter*
      </label>

      <profile-card :profile="application.user" class="mb-8">
        <div
          v-if="application.user.phone"
          class="text-teal-600 text-center text-lg mt-6"
        >
          {{
            application.user.phone.substr(application.user.phone.indexOf('+'))
          }}
        </div>
      </profile-card>

      <base-date-picker
        v-model="draft.date"
        label="Datum"
        placeholder="28. September 2021"
        :rules="[$rules.required]"
        :min="$dayjs().startOf('day').toDate()"
        :max="$dayjs().add(10, 'year').toDate()"
        class="mb-6"
      />

      <base-input-time
        v-model="draft.time"
        label="Uhrzeit"
        placeholder="14:30"
        :rules="[$rules.required]"
        class="mb-6"
      />

      <base-modal
        ref="branchModal"
        title="Jobangebot"
        :persistent="false"
        class="mb-6"
      >
        <template #activator>
          <base-input
            :value="
              draft.branch && draft.branch.address
                ? draft.branch.address.text
                : ''
            "
            label="Adresse"
            placeholder="Zürcherstrasse 100, 8001 Zürich"
            :rules="[$rules.required]"
            readonly
            class="mb-6"
          />
        </template>

        <branch-editor
          :company-id="$auth.companyId"
          :headquater="!branches.length"
          class="mb-8"
          @done="$utils.mutateArrayItem(branches, $event, 'id')"
        />

        <branch-table
          :items="branches"
          :company="{ slug: $auth.company.slug }"
          class="lg:-mx-16"
          @item-click="selectBranch"
        />
      </base-modal>

      <base-textarea
        v-model="draft.message"
        label="Nachricht"
        placeholder="Nachricht an den Kandidaten"
        maxlength="200"
        :rules="[$rules.maxLength(250)]"
        class="mb-6"
      />

      <base-bottom-actions
        :items="[
          {
            primary: true,
            text: 'Weiter',
            diasbled: !draft.branch || !startAt,
            handler: () => $refs.stepper.next(),
          },
          {
            danger: true,
            text: 'ABBRECHEN',
            handler: () => $router.go(-1),
          },
        ]"
      />
    </template>

    <template #step:agent>
      <input-agent v-model="draft.agent" class="mb-10" />

      <base-textarea
        v-if="draft.agent"
        v-model="draft.agentMessage"
        label="Nachricht"
        placeholder="Nachricht an den Personalberater."
      />

      <base-bottom-actions
        :items="[
          {
            primary: true,
            text: 'Weiter',
            diasbled: !draft.agent,
            handler: () => $refs.stepper.next(),
          },
          {
            danger: true,
            text: 'Zurück',
            handler: () => $refs.stepper.back(),
          },
        ]"
      />
    </template>

    <template #step:preview>
      <interview-summary
        :interview="{
          startAt,
          branch: draft.branch,
          agent: draft.agent,
          message: draft.message,
          agentMessage: draft.agentMessage,
        }"
        :user="application.user"
        :application="application"
        :staff="application.job.staff"
        :job="application.job"
      />

      <base-bottom-actions
        :items="[
          {
            primary: true,
            text: 'Senden',
            handler: done,
          },
          {
            text: 'Zurück',
            handler: () => $refs.stepper.back(),
          },
        ]"
      />
    </template>
  </base-steps-wrapper>
</template>

<script>
export default {
  asyncData({ route, $axios, $auth }) {
    return Promise.all([
      $axios.get('/application/' + route.query.applicationId, {
        params: {
          companyId: $auth.companyId,
        },
      }),
      $axios.get('/branch', { params: { companyId: $auth.companyId } }),
    ]).then(([application, branches]) => ({ application, branches }))
  },
  data() {
    return {
      branches: [],
      application: null,

      draft: {
        date: null,
        time: null,
        branch: null,
        message: '',
        agent: null,
        agentMessage: '',
      },

      isFinished: false,

      steps: [
        {
          key: 'basic',
          title: 'Arbeitsbeginn festlegen',
          note: 'Wann ist der Arbeitsbeginn? Du kannst auch den Kandidaten anrufen und es mit ihm zusammen festlegen.',
        },
        ...(this.$route.query.temporary
          ? [
              {
                key: 'agent',
                title: 'Personalberater* hinzufügen',
                note: 'Wähl deinen geeigneten Personalberater* aus.',
              },
            ]
          : []),
        {
          key: 'preview',
          title: 'Jobangebot senden',
          note: 'Hier kannst du alle Einzelheiten überprüfen. Ist alles in Ordnung, senden den Auftrag ab.',
        },
      ],
    }
  },
  computed: {
    startAt() {
      const { date, time } = this.draft
      return date && time
        ? new Date(new Date(date).valueOf() + time * 1000 * 60)
        : null
    },
  },
  methods: {
    selectBranch(branch) {
      this.draft.branch = branch
      this.$refs.branchModal.close()
    },

    async done() {
      const { branch, agent, message, agentMessage } = this.draft
      const draft = this.$utils.filterObject({
        applicationId: this.application.id,
        staffId: this.application.job.staff.id,
        companyId: this.$auth.companyId,
        branchId: branch.id,
        agentId: agent?.id,
        agencyId: agent?.companyId,
        startAt: this.startAt,
        message,
        agentMessage,
      })

      const newOffer = await this.$axios.post('/offer/', draft)

      this.isFinished = true
      this.$confirm({
        img: '/img/interview_done.svg',
        tite: 'Bestätigung Jobangebot gesendet',
        html: `Wir haben dein Jobangebot an die gewünschten Partner und die gewünschten Kandidaten gesendet. Bitte warte auf die Bestätigung.<br><br><span class="text-teal-600 font-medium">Jobangebot: ${newOffer.id}</span>`,
        actions: [
          {
            text: 'Jobinserat erstellen',
            secondary: true,
            icon: 'plus-circle',
            handler: () => this.$router.push('/edit/job/new'),
          },
          {
            text: 'Gesendete Angebote',
            secondary: true,
            handler: () => this.$router.push('/company/in-progress/offers'),
          },
          {
            text: 'Dashboard',
            handler: () => this.$router.push('/'),
          },
        ],
      })
    },
  },
  middleware({ redirect, route }) {
    if (!route.query.applicationId) {
      return redirect('/')
    }
  },
  head() {
    return {
      title: 'Jobangebot',
    }
  },
}
</script>
