<template>
  <div class="lg:pt-8">
    <div
      class="p-6 lg:py-10 lg:px-10 xl:px-16 max-w-xl mx-auto bg-white lg:rounded-xl lg:mb-8 min-h-screen lg:min-h-auto"
    >
      <base-page-header
        :actions="
          user
            ? $auth.user && $auth.user.id === user.id
              ? [userActions[0]]
              : userActions
            : companyActions
        "
        class="mb-6"
        @dismiss="$router.push('/')"
      />

      <profile-detail v-if="user" :profile="user" />

      <contact-report-modal ref="reportModal" @done="$router.push('/')" />

      <company-detail v-if="company" :company="company" />

      <common-share-popup ref="share" />
    </div>
  </div>
</template>

<script>
import { UserType } from '~/constants'

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i // Only a-z A-Z 0-9 and - between
export default {
  auth: false,
  components: {
    ProfileDetail: () => import('~/components/entities/profile/ProfileDetail'),
  },
  async asyncData({ route, redirect, $axios, store }) {
    const [slug, , redundant] = route.path.split('/').filter(Boolean)
    if (
      redundant ||
      slug.length < 3 ||
      slug.length > 60 ||
      !SLUG_REGEX.test(slug)
    ) {
      return redirect('/404')
    }

    const output = await $axios
      .get('/user/' + slug)
      .then((profile) => ({
        [profile.type <= UserType.AGENT ? 'user' : 'company']: profile,
      }))
      .catch(() => redirect('/404'))

    if (output?.company) {
      await store.dispatch('job/findJobs', { companyId: output.company.id })
    }

    return output
  },
  data() {
    return {
      user: null,
      company: null,
      userActions: [
        {
          icon: 'share',
          text: 'Teilen',
          handler: () =>
            this.$utils.share({
              url: location.origin + '/' + this.user.slug,
              title: this.user.firstName + ' ' + this.user.lastName,
            }),
        },
        {
          icon: 'report',
          text: 'Melden',
          handler: () => this.$refs.reportModal.open(this.user, true),
        },
        {
          icon: 'block',
          text: 'Blockieren',
          handler: () => this.$refs.reportModal.open(this.user, false),
        },
      ],
      companyActions: [
        {
          icon: 'share',
          text: 'Teilen',
          handler: () =>
            this.$utils.share({
              url: location.origin + '/' + this.company?.slug,
              title: this.company?.branches?.[0]?.name,
            }),
        },
      ],
    }
  },
  head() {
    if (this.user) {
      return {
        title: [this.user.firstName, this.user.lastName]
          .filter(Boolean)
          .join(' '),
      }
    } else if (this.company?.branches?.[0]) {
      const headquater =
        this.company.branches?.find?.((b) => b.isHeadquater) ||
        this.company.branches[0]
      return {
        title: headquater.name,
      }
    }
  },
}
</script>
