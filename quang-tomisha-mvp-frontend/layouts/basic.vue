<template>
  <div class="min-h-screen bg-white">
    <basic-header class="sticky top-1.125 w-full flex-shrink-0" />

    <basic-nav
      class="lg:fixed lg:left-0 lg:top-1.125 lg:pt-30 lg:bottom-0 lg:w-full lg:max-w-xs xl:max-w-sm lg:bg-gray-100"
      :pages="pages"
    />

    <nuxt />
  </div>
</template>

<script>
import { UserType } from '~/constants'
export default {
  name: 'LayoutBasic',
  data() {
    return {
      userPages: [
        { to: '/jobs', icon: 'job', text: 'Job suchen' },
        { to: '/', icon: 'dashboard', text: 'Dashboard' },
        {
          to: '/applications',
          icon: 'application',
          text: 'Bewerbungen',
        },
        {
          to: '/in-progress/interviews',
          icon: 'offer',
          text: 'Angebote',
          match: '/in-progress',
        },
        {
          to: '/network/invitations',
          icon: 'network',
          text: 'Netzwerk',
          relatedPage: '/applications',
          match: '/network',
        },
        {
          to: '/me/profile',
          icon: 'profile',
          text: 'Profil',
          relatedPage: '/status',
          match: '/me',
        },
        {
          to: '/status',
          icon: 'status',
          text: 'Status',
          relatedPage: '/me/profile',
        },
        {
          to: '/settings/account',
          icon: 'setting',
          text: 'Einstellungen',
          relatedpage: '/in-progress/interviews',
          match: '/settings',
        },
      ],

      companyPages: [
        {
          to: '/company/jobs',
          icon: 'application',
          text: 'Jobinserat',
          match: '/company/job',
        },
        { to: '/', icon: 'dashboard', text: 'Dashboard' },
        {
          to: '/company/in-progress/interviews',
          icon: 'offer',
          text: 'Angebote',
          match: '/company/in-progress',
        },
        {
          to: '/company/profile',
          icon: 'company',
          text: 'Profil',
          relatedPage: '/company/in-progress/interviews',
        },
        {
          to: '/company/staffs',
          icon: 'staff',
          text: 'Mitarbeiter',
          relatedPage: '/company/profile',
        },
        {
          to: '/company/settings/subscription',
          icon: 'setting',
          text: 'Einstellungen',
          match: '/company/settings',
        },
      ],

      // TODO
      agencyPages: [
        { to: '/agency/candidates', icon: 'candidate', text: 'Kandidaten' },
        { to: '/', icon: 'dashboard', text: 'Dashboard' },
        {
          to: '/agency/in-progress/interviews',
          icon: 'offer',
          text: 'Angebote',
          match: '/agency/in-progress',
        },
        {
          to: '/company/jobs',
          icon: 'application',
          text: 'Jobinserat',
          match: '/company/job',
        },
        {
          to: '/company/profile',
          icon: 'company',
          text: 'Profil',
          relatedPage: '/company/in-progress/interviews',
        },
        {
          to: '/company/staffs',
          icon: 'staff',
          text: 'Mitarbeiter',
          relatedPage: '/company/profile',
        },
        {
          to: '/company/settings',
          icon: 'setting',
          text: 'Einstellungen',
          match: '/company/settings',
        },
      ],
    }
  },

  computed: {
    pages() {
      return !this.$auth.company
        ? this.userPages
        : this.$auth.company.type !== UserType.COMPANY
        ? this.agencyPages
        : this.companyPages
    },
  },
}
</script>
