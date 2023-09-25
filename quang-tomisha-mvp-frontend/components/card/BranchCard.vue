<template>
  <profile-cover-card
    v-bind="$attrs"
    :profile="branch"
    avatar-placeholder="/img/company_placeholder.svg"
    v-on="$listeners"
  >
    <slot>
      <template v-if="branch.address">
        {{ branch.address.text }}
        <br />
        {{ branch.address.zip }} {{ branch.address.city }}
      </template>
    </slot>
  </profile-cover-card>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    branch: { type: Object, required: true },
  },
}
</script>
