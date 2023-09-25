<template>
  <div class="flex">
    <base-avatar
      :src="profile.picture"
      :status="profile.name ? null : profile.status"
      v-bind="
        $utils.filterObject({
          placeholder: avatarPlaceholder,
          customClass: avatarClass,
        })
      "
      class="flex-shrink-0"
    />

    <div class="pl-4 overflow-hidden" :class="[bodyClass]">
      <h5 class="min-w-48 truncate">
        {{
          [profile.firstName, profile.lastName, profile.name]
            .filter(Boolean)
            .join(' ')
        }}
      </h5>

      <slot name="description">
        <div v-if="profile.address" class="text-gray-600 mt-1 truncate">
          {{ profile.address.zip }} {{ profile.address.city }}
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    profile: { type: Object, default: () => ({}) },
    avatarPlaceholder: { type: String, default: null },
    avatarClass: { type: String, default: '' },
    bodyClass: { type: String, default: 'font-medium' },
  },
}
</script>
