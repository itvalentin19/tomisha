<template>
  <n-link
    class="block"
    :to="`/staff/accept-join-request?notificationId=${notification.id}`"
  >
    <profile-card :profile="notification.fromUser" />
  </n-link>
</template>

<script>
export default {
  props: {
    notification: { type: Object, default: () => ({}) },
  },
}
</script>
