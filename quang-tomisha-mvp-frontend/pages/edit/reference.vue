<template>
  <base-steps-wrapper
    ref="stepper"
    v-model="draft"
    storage-key="tom:reference:new"
    :unique-id="`${$auth.user.id}:${fromUser.id}`"
    :off="isFinished"
    :steps="steps"
    title-prefix="Referenz"
    @done="done"
    @dismiss="$router.push('/')"
  >
    <template #step:1>
      <label class="block mb-1 text-gray-600 text-sm"> Referenz über </label>
      <profile-card :profile="fromUser" class="mb-6" />

      <label class="block mb-1 mt-6 text-gray-600 text-sm">
        Deine Angaben
      </label>
      <profile-card :profile="$auth.user" class="mb-6" />
    </template>

    <template #step:2>
      <label class="block mb-1 text-gray-600 text-sm">
        Leistungsbeurteilung
      </label>
      <base-rating
        v-for="criteria in referenceCriterias"
        :key="criteria.key"
        v-model="draft.criterias[criteria.key]"
        hide-label
        class="mb-6"
      >
        <template #selected-level>
          {{ criteria.text }}
        </template>
      </base-rating>

      <base-textarea
        v-model="draft.description"
        label="Referenz Text"
        placeholder="Schreibe deine Referenz hier"
        :rules="[$rules.required]"
        class="mb-6"
      />
    </template>

    <template #step:3>
      <reference-card :user="$auth.user" :reference="draft" />
      <span />
    </template>

    <base-bottom-actions :items="actions" />
  </base-steps-wrapper>
</template>

<script>
import { mapState } from 'vuex'
export default {
  async asyncData({ route, redirect, $axios, $auth }) {
    if (route.query.notificationId) {
      const notification = await $axios
        .get('/notification/' + route.query.notificationId)
        .catch(() => {})

      if (notification?.userId === $auth.user.id && notification.fromUser) {
        return {
          fromUser: notification.fromUser,
        }
      }
    }

    return redirect('/invalid')
  },
  data() {
    return {
      employment: null,
      fromUser: null,
      draft: {
        description: '',
        criterias: {},
        rating: 0,
      },
      isFinished: false,
      steps: [
        {
          title: 'Deine Angaben',
          note: 'Überprüfe deine Angaben.',
        },
        {
          title: 'Beurteilung',
          note: 'Erstelle eine Beurteilung über die Referenz Person.',
        },
        {
          title: 'Vorschau',
          note: 'Die Vorschau deiner Referenz.',
        },
      ],
    }
  },
  computed: {
    ...mapState('tag', ['referenceCriterias']),

    actions() {
      return [
        {
          text: 'Speichern',
          primary: true,
          disabled:
            this.step === 2 &&
            (!Object.values(this.draft.criterias).some(Boolean) ||
              !this.draft.description),
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
      const criterias = Object.values(this.draft.criterias).filter(Boolean)
      try {
        await this.$axios.post('/reference', {
          ...this.draft,
          criterias: JSON.stringify(this.draft.criterias),
          rating: parseFloat(
            (
              criterias.reduce((sum, cur) => sum + (cur || 0), 0) /
              criterias.length
            ).toFixed(2)
          ),
          notificationId: +this.$route.query.notificationId,
          userId: this.fromUser.id,
        })
      } catch (e) {
        return this.$alert.error('Error message. I cannot send the reference.')
      }

      this.isFinished = true

      this.$confirm({
        img: '/img/common_success.svg',
        title: 'Fantastisch',
        text: 'Du hast eine Referenz erstellt. Vielen Dank, du bist super!',
        okText: 'Teilen',
        cancelText: 'Dashboard',
        done: () =>
          this.$utils.share({
            url: location.origin,
            text: `Ich habe gerade einen neuen Job auf Tomisha gefunden. Du kannst es doch genauso machen, geh auf ${location.origin} und finde deinen Traum-Job.`,
          }),
        cancel: () => this.$router.push('/'),
      })
    },
  },
  head() {
    return {
      title: 'Referenz',
    }
  },
}
</script>
