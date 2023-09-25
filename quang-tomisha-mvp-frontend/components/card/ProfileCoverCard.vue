<template>
  <base-card v-bind="$attrs" no-padding class="relative" v-on="$listeners">
    <div
      class="relative top-0 left-0 right-0 bg-cover bg-center pb-1/4 bg-gray-200 rounded-t-xl"
      :style="{
        backgroundImage: profile.cover ? `url(${profile.cover})` : '',
      }"
    >
      <base-avatar
        :src="profile.picture"
        :status="profile.status"
        v-bind="avatarPlaceholder ? { placeholder: avatarPlaceholder } : {}"
        custom-class="w-1/4 h-full"
        class="absolute left-0 top-0 transform translate-y-1/2 ml-6"
      />
    </div>

    <div class="mb-3 relative pb-1/8" />

    <h3 v-if="name" class="text-3xl px-6">
      {{ name }}
    </h3>

    <div class="text-gray-600 px-6 pb-6">
      <slot />
    </div>
  </base-card>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    profile: { type: Object, required: true },
    avatarPlaceholder: { type: String, default: null },
  },
  computed: {
    name() {
      const { firstName, lastName, name } = this.profile
      return [firstName, lastName, name].filter(Boolean).join(' ')
    },
  },
}
</script>
