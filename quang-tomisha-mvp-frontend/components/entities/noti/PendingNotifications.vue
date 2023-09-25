<template>
  <div>
    <div
      v-for="(group, i) in groups"
      :key="group.type"
      :class="{ 'mt-8': !!i }"
    >
      <base-expand-group :items="group.title ? [{ title: group.title }] : []">
        <template v-slot:[group.slotName]>
          <template v-for="item in group.items">
            <component
              :is="componentsByType[group.type]"
              v-if="componentsByType[group.type]"
              :key="item.id"
              v-bind="$attrs"
              :notification="item"
              class="mb-8"
              @no="setNotificationStatus(item, notificationStatus.NO)"
              @yes="setNotificationStatus(item, notificationStatus.YES)"
            />
          </template>
        </template>
      </base-expand-group>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { NotificationType, NotificationStatus } from '~/constants'
export default {
  components: {
    NotiWelcome: () => import('./NotiWelcome'),
    NotiFirstFriend: () => import('./NotiFirstFriend'),
    NotiCompleteProfile: () => import('./NotiCompleteProfile'),
    NotiSubscription: () => import('./NotiSubscription'),
    NotiJoinRequest: () => import('./NotiJoinRequest'),
    NotiRefInvitation: () => import('./NotiRefInvitation'),
    NotiRequestViewRefs: () => import('./NotiRequestViewRefs'),
    NotiStaffInvitation: () => import('./NotiStaffInvitation'),
  },
  inheritAttrs: false,
  data: () => ({
    notificationStatus: NotificationStatus,
    componentsByType: Object.freeze({
      [NotificationType.WELCOME]: 'noti-welcome',
      [NotificationType.COMPLETE_PROFILE]: 'noti-complete-profile',
      [NotificationType.ADD_FIRST_FRIEND]: 'noti-first-friend',
      [NotificationType.SUB_NONE]: 'noti-subscription',
      [NotificationType.REFERENCE_INVITE]: 'noti-ref-invitation',
      [NotificationType.REFERENCE_VIEW_REQUEST]: 'noti-request-view-refs',
      [NotificationType.STAFF_INVITE]: 'noti-staff-invitation',
      [NotificationType.COMPANY_JOIN_REQUEST]: 'noti-join-request',
    }),
    groupsTitleByType: Object.freeze({
      [NotificationType.COMPANY_JOIN_REQUEST]: 'Anfragen',
    }),
  }),
  computed: {
    ...mapGetters('notification', ['notificationGroups']),

    groups() {
      const groups = [...this.notificationGroups]
      const { companyId, user, activePlan } = this.$auth
      if (companyId) {
        if (!activePlan) {
          groups.unshift({
            type: NotificationType.SUB_NONE,
            items: [{ type: NotificationType.SUB_NONE }],
          })
        }
      } else if (user.progress < 100 || !user.occupations.length) {
        groups.unshift({
          type: NotificationType.COMPLETE_PROFILE,
          items: [{ type: NotificationType.COMPLETE_PROFILE }],
        })
      }

      groups.sort((x, y) => (x.type === 1 ? -1 : y.type === 1 ? 1 : 0))

      return groups.map((g) => ({
        ...g,
        title: this.groupsTitleByType[g.type],
        slotName: this.groupsTitleByType[g.type] ? 'default' : 'fallback',
      }))
    },
  },
  watch: {
    '$auth.companyId'(companyId) {
      this.$store.dispatch('notification/fetchNotifications', companyId)
    },
  },
  methods: {
    setNotificationStatus(noti, status) {
      this.$store.dispatch('notification/setNotificationStatus', {
        id: noti.id,
        status,
      })
    },
  },
}
</script>
