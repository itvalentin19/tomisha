<template>
  <profile-card v-bind="$attrs" :profile="staff.user" v-on="$listeners">
    <template #description>
      <div v-if="staff.profession" class="text-sm text-gray-600 mt-2">
        {{ staff.profession.title }}*
      </div>

      <div v-if="staff.branch" class="text-sm text-gray-600 mt-2">
        {{ staff.branch.name }}
      </div>
    </template>

    <template v-if="$slots.default">
      <slot>
        <span />
      </slot>
    </template>
  </profile-card>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    staff: { type: Object, required: true },
  },
}
</script>
