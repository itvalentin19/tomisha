<template>
  <base-card v-bind="$attrs" v-on="$listeners">
    <slot name="top" />

    <profile-brief :profile="profile" :avatar-placeholder="avatarPlaceholder">
      <template #description>
        <slot name="description">
          <span />
        </slot>
      </template>
    </profile-brief>

    <template v-if="$slots.default">
      <slot>
        <span />
      </slot>
    </template>
  </base-card>
</template>

<script>
import ProfileBrief from '../entities/profile/ProfileBrief.vue'
export default {
  components: { ProfileBrief },
  inheritAttrs: false,
  props: {
    profile: { type: Object, default: () => ({}) },
    avatarPlaceholder: { type: String, default: null },
  },
}
</script>
