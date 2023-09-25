<template>
  <div />
</template>

<script>
import { NotificationType } from '~/constants'
const routeMap = {
  [NotificationType.REFERENCE_INVITE]: '/edit/reference',
  [NotificationType.STAFF_INVITE]: '/staff/accept-invitation',
  [NotificationType.COMPANY_JOIN_REQUEST]: '/staff/accept-join-request',
}

export default {
  middleware({ route, redirect, $auth }) {
    const { type, notificationId, receiverId } = route.query
    const isCompany =
      $auth.companyId === receiverId ||
      $auth.user?.employments?.some?.((em) => em.companyId === receiverId)

    if (
      notificationId &&
      receiverId &&
      routeMap[type] &&
      (isCompany || $auth.user.id === receiverId)
    ) {
      return redirect({
        path: routeMap[type],
        query: {
          notificationId,
          receiverId,
        },
      })
    }

    return redirect('/invalid')
  },
}
</script>
