<template>
  <div>
    <div class="flex mb-8 justify-center">
      <base-avatar
        :src="$auth.user.picture"
        :status="status"
        custom-class="w-36 h-36"
        border-class="border-5"
      />
    </div>

    <div v-for="(item, i) in statuses" :key="i" class="flex mb-6 text-gray-500">
      <div class="w-12 flex-shrink-0">
        <base-checkbox
          :checked="status === item.value"
          class="-mt-1"
          :input-class="`border-3 border-${statusColors[item.value]}`"
          @change="setStatus(item.value)"
        />
      </div>

      <div class="w-20 flex-shrink-0">{{ item.label }}:</div>

      <div class="flex-grow">{{ item.text }}</div>
    </div>

    <slot :status="status" />
  </div>
</template>

<script>
import { UserStatus, UserStatusColor } from '~/constants'
export default {
  data() {
    return {
      statuses: Object.freeze([
        {
          value: UserStatus.AVAILABLE_ACTIVELY,
          label: 'Grün',
          text: 'Du bist auf Jobsuche.',
        },
        {
          value: UserStatus.AVAILABLE_EMPLOYED,
          label: 'Gelb',
          text: 'Du bist berufstätig, möchtest aber gerne Jobangebote erhalten und selbst nach einem Job suchen.',
        },
        {
          value: UserStatus.AVAILABLE_PRIVATELY,
          label: 'Orange',
          text: 'Du bist berufstätig und möchtest die Jobangebote selbstständig durchsuchen. Der Arbeitgeber kann dir keine Jobangebote zusenden.',
        },
        {
          value: UserStatus.UNAVAILABLE,
          label: 'Rot',
          text: 'Du bist gerade am Arbeiten und mit deiner derzeitigen Stelle zufrieden. Du kannst nicht nach neuen Jobangeboten suchen und du erhältst keine Angebote von Arbeitgebern.',
        },
      ]),
      status: this.$auth.user.status,
      statusColors: UserStatusColor,
    }
  },
  methods: {
    setStatus(status) {
      this.status = status
      this.$emit('change', status)
    },
  },
}
</script>
