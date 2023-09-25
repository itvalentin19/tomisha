<template>
  <base-steps-wrapper
    ref="stepper"
    v-model="draft"
    storage-key="tom:company:join"
    :unique-id="`${$auth.user.id}:${$route.query.companyId}`"
    :off="isFinished"
    :steps="steps"
    title-prefix="Zum Unternehmen"
    @done="done"
    @dismiss="$router.push('/staff/company-search')"
  >
    <template #step:1>
      <profile-card :profile="headquater" class="mb-6" />

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

    <template #step:3>
      <base-textarea
        v-model="draft.message"
        label="Nachricht"
        placeholder="Deine Nachricht an den Admin von deinem Unternehmen."
        :rules="[$rules.required, $rules.maxLength(500)]"
        class="mb-6"
      />
    </template>

    <template #default>
      <base-bottom-actions :items="actions" />
    </template>
  </base-steps-wrapper>
</template>

<script>
export default {
  data() {
    return {
      headquater: this.$utils.parseJSON(this.$route.query.headquater),
      draft: {
        startedAt: '',
        profession: null,
        minWorkload: 0,
        maxWorkload: 100,
        relationships: [],
        message: null,
      },
      isFinished: false,
      steps: [
        {
          title: 'Arbeitsbeginn',
          note: 'Seit wann bist du bei diesem Unternehmen beschäftigt?',
        },
        {
          title: 'Job',
          note: 'Füge deinen Job hinzu, als was du in dem Unternehmen beschäftigt bist.',
        },
        {
          title: 'Nachricht',
          note: 'Fall notwendig, kannst du hier eine Nachricht an den Admin vom Unternehmen senden.',
        },
      ],
    }
  },
  computed: {
    actions() {
      return [
        {
          text: 'Speichern',
          primary: true,
          disabled:
            +this.$route.query.step === 2 ? !this.draft.profession : false,
          handler: () => this.$refs.stepper.next(),
        },
        {
          text: 'Zurück',
          secondary: true,
          handler: () => this.$refs.stepper.back(),
        },
      ]
    },
  },
  methods: {
    done() {
      const { profession, ...payload } = this.draft
      payload.professionId = profession.id
      payload.companyId = this.$route.query.companyId

      this.$axios
        .post('/company/join', payload)
        .then(() => {
          this.isFinished = true
          this.$confirm({
            img: '/img/company_join_done.svg',
            title: 'Nachricht gesendet',
            text: 'Deine Nachricht wurde an den Admin gesendet. Sobald der Admin sie bestätigt, wirst du benachrichtigt.',
            okText: 'Dashboard',
            dismissible: false,
            done: () => this.$router.push('/'),
          })
        })
        .catch((e) => this.$alert.error(e))
    },
  },
  middleware({ redirect, route }) {
    if (!route.query.companyId || !route.query.headquater) {
      return redirect('/')
    }
  },
  head() {
    return {
      title: 'Zum Unternehmen',
    }
  },
}
</script>
