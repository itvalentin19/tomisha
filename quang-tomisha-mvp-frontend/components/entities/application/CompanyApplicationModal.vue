<template>
  <base-modal v-model="shown" :actions="actions" :sticky-header="false">
    <base-note class="mb-12">
      Teile deine Entscheidung über diesen Kandidaten mit.
    </base-note>

    <application-detail
      v-if="application && profile"
      :application="application"
      :profile="profile"
    />

    <base-bottom-actions
      v-if="application && !application.logs.some((log) => log.action >= 2)"
      :items="bottomActions"
    />

    <base-modal ref="offerModal" back-icon>
      <base-figure
        img="/img/application_accept.svg"
        title="Herzlichen Glückwunsch, du hast deinen Wunschkandidaten gefunden"
        text="Wir freuen uns, dass du deinen Wunschkandidaten gefunden hast. Wie möchtest du ihn einstellen? Via Temporärbüro oder direkt über Ihr Unternehmen?"
      />

      <template #footer>
        <base-button primary class="mb-6" @click="accept('/edit/offer')">
          Mein Unternehmen
        </base-button>

        <base-button
          secondary
          @click="accept('/edit/offer', { temporary: true })"
        >
          Temporärbüro
        </base-button>
      </template>
    </base-modal>

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
      actions: [
        {
          icon: 'share',
          text: 'Teilen',
          handler: () =>
            this.$refs.share?.open?.({
              title: this.application?.job?.title,
              url: location.origin + '/job/' + this.application?.job?.slug,
            }),
        },
        { icon: 'report', text: 'Melden', handler: () => {} },
      ],
    }
  },
  computed: {
    bottomActions() {
      return this.application
        ? [
            {
              text: 'Einstellen',
              primary: true,
              handler: () => this.$refs.offerModal.open(),
            },
            {
              text: 'Vorstellungsgespräch',
              secondary: true,
              to: '/edit/interview?applicationId=' + this.application.id,
            },
            {
              text: 'Absage',
              handler: () => this.$emit('reject', this.application),
            },
          ]
        : []
    },
  },
  methods: {
    async show(application) {
      this.application = application

      const promises = []

      if (
        !this.profile ||
        this.profile.id !== application.profileId ||
        this.profile.occupations?.[0]?.id !== application.occupation.id
      ) {
        promises.push(
          this.$axios
            .get('/user/' + application.user.slug, {
              params: {
                occupationId: application.occupation.id,
              },
            })
            .then((profile) => {
              this.profile = profile
            })
        )
      }

      if (!application.logs.some((log) => log.action === JobLogAction.SEEN)) {
        promises.push(this.log(JobLogAction.SEEN))
      }

      await Promise.all(promises)

      this.shown = true
    },

    accept(path, query) {
      this.$router.push({
        path,
        query: {
          ...query,
          applicationId: this.application.id,
        },
      })
    },

    log(action) {
      this.application?.logs?.push?.({
        action,
        createdAt: Date.now(),
      })

      return this.$axios.post('/application/log', {
        applicationId: this.application.id,
        action,
      })
    },
  },
}
</script>
