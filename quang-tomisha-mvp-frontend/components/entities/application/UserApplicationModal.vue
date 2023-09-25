<template>
  <base-modal v-model="shown" :actions="actions" :sticky-header="false">
    <application-detail
      v-if="application && profile"
      :application="application"
      :profile="profile"
    />

    <common-share-popup ref="share" />
  </base-modal>
</template>

<script>
import { JobLogAction } from '~/constants'
export default {
  data() {
    return {
      shown: false,
      application: null,
      profile: null,
    }
  },
  computed: {
    actions() {
      const actions = [
        {
          icon: 'share',
          text: 'Teilen',
          handler: () =>
            this.$refs.share?.open?.({
              title: this.application?.job?.title,
              url: location.origin + '/job/' + this.application?.job?.slug,
            }),
        },
      ]

      if (
        this.application &&
        !this.application.logs.some((log) => log.action >= JobLogAction.YES)
      ) {
        actions.push({
          icon: 'trash',
          text: 'Bewerbung zurückziehen',
          handler: () => this.withdrawApplication(),
        })
      }

      return actions
    },
  },
  methods: {
    async show(application) {
      this.application = application

      if (
        !this.profile ||
        this.profile.id !== application.profileId ||
        this.profile.occupations?.[0]?.id !== application.occupationId
      ) {
        this.profile = await this.$axios.get('/user/' + this.$auth.user.slug, {
          params: {
            occupationId: application.occupationId,
          },
        })
      }

      this.shown = true
    },

    withdrawApplication() {
      this.$confirm({
        img: '/img/application_delete.svg',
        icon: 'warning',
        iconColor: 'red-600',
        title: 'Löschen',
        text: 'Möchtest du deine Bewerbung von diesem Jobinserat wirklich löschen?',
        actions: [
          {
            text: 'Nicht löschen',
            primary: true,
          },
          {
            text: 'Jetzt Löschen',
            danger: true,
            handler: () => {
              this.log(JobLogAction.DELETE)
              this.$emit('withdraw', this.application.id)
            },
          },
        ],
      })
    },

    log(action) {
      this.$axios.post('/application/log', {
        applicationId: this.application.id,
        action,
      })

      this.application?.logs?.push?.({
        action,
        createdAt: new Date(),
      })
    },
  },
}
</script>
