<template>
  <div
    class="rounded-full max-w-full max-h-full select-none inline-block bg-white overflow-hidden"
    :class="[customClass, borderClass, borderColor]"
  >
    <img :src="src || placeholder" class="w-full h-full rounded-full" />
  </div>
</template>

<script>
import { UserStatus, UserStatusColor } from '~/constants'
export default {
  props: {
    src: { type: String, default: '' },
    placeholder: { type: String, default: '/img/user_placeholder.svg' },
    customClass: { type: String, default: 'w-14 h-14' },
    borderClass: { type: String, default: 'border-3' },
    status: { type: Number, default: UserStatus.AVAILABLE_ACTIVELY },
  },
  computed: {
    borderColor() {
      return UserStatusColor[this.status]
        ? 'border-' + UserStatusColor[this.status]
        : 'border-gray-400'
    },
  },
}
</script>
