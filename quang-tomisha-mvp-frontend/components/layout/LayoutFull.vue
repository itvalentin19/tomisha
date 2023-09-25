<template>
  <layout-body full>
    <slot name="top" />

    <base-pills v-bind="$attrs" class="-mt-2" v-on="$listeners" />

    <slot name="body">
      <layout-body :wide="wide" class="pb-32 md:pb-8">
        <slot />
      </layout-body>
    </slot>
  </layout-body>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    wide: Boolean,
  },
}
</script>
