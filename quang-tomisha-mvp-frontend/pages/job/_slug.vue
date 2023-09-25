<template>
  <div
    class="p-6 pb-32 lg:py-10 lg:px-10 xl:px-16 max-w-xl mx-auto bg-white lg:rounded-xl lg:mt-8 lg:mb-32"
  >
    <base-page-header
      :actions="[
        {
          icon: 'share',
          text: 'Teilen',
          handler: () =>
            $utils.share({
              title: job.title,
              url: $utils.origin + '/job/' + job.slug,
            }),
        },
        {
          icon: 'report',
          text: 'Melden',
          handler: () => this.$refs.report.open(),
        },
      ]"
      class="mb-6"
      @dismiss="close"
    />

    <common-report-modal ref="report" />

    <job-detail :job="job" />

    <template v-if="$auth.isAuthenticated && !$auth.companyId">
      <base-modal v-model="applicationModalState">
        <base-note class="mb-12">
          Vorschau deiner Bewerbung, die du an den Arbeitgeber sendest.
        </base-note>

        <profile-detail :profile="profile" />

        <common-password-confirmation ref="confirmPassword" />

        <base-bottom-actions :items="occupationActions" />
      </base-modal>

      <!--      <profile-editor-modal ref="profileEditor" />-->

      <base-bottom-actions :items="actions" />
    </template>
  </div>
</template>

<script>
export default {
  asyncData({ $axios, route, error }) {
    return $axios
      .get('job/' + route.params.slug)
      .then((job) => ({ job }))
      .catch((e) => error({ statusCode: 400, message: 'Job not found' }))
  },
  data() {
    return {
      job: null,
      actions: [
        {
          text: 'Jetzt bewerben',
          primary: true,
          handler: () => this.checkOccupation(),
        },
        {
          text: 'Kein Interesse',
          handler: () => this.close(),
        },
      ],
      occupationActions: [
        {
          text: 'Senden',
          primary: true,
          handler: () => this.createApplication(),
        },
        {
          text: 'Bearbeiten',
          handler: () => this.$refs.profileEditor.open(),
        },
      ],
      applicationModalState: false,
      profile: null,
    }
  },
  methods: {
    close() {
      this.$router.go(-1)
    },

    async checkOccupation() {
      const occupation =
        this.$auth.user.occupations?.find(
          (o) => o.profession.id === this.job.professionId
        ) || this.$auth.user.occupations?.[0]

      if (occupation) {
        this.profile = await this.$axios.get('/user/' + this.$auth.user.slug, {
          params: { occupationId: occupation.id },
        })
        this.applicationModalState = true
      } else {
        this.$router.push(
          '/edit/occupation/new?professionId=' + this.job.professionId
        )
      }
    },

    createApplication() {
      this.$refs.confirmPassword.open(async (password) => {
        try {
          await this.$axios
            .post('application/', {
              password,
              jobId: this.job.id,
              companyId: this.job.companyId,
              occupationId: this.profile.occupations[0].id,
            })
            .then(() => {
              this.$confirm({
                img: '/img/application_sent.svg',
                icon: 'check-circle',
                iconColor: 'green-600',
                title: 'Gesendet',
                text: 'Deine Bewerbung wurde erfolgreich gesendet. Dein gewünschter Arbeitgeber empfängt die Bewerbung in wenige Minuten.',
                okText: 'Zurück zu den Jobinserate',
                cancelText: 'Gesendete Bewerbungen',
                done: () => this.$router.push('/jobs'),
                cancel: () => this.$router.push('/applications'),
              })
            })
        } catch (e) {
          return this.$alert.error(e)
        }
      })
    },
  },
  head() {
    return {
      title: this.job?.title,
    }
  },
}
</script>
