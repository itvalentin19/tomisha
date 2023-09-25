<template>
  <slide-y-up-transition>
    <div v-if="errorMsg" class="text-red-600">
      {{ errorMsg }}
    </div>
  </slide-y-up-transition>
</template>

<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: { default: null },
    rules: { type: Array, default: () => [] },
  },
  data() {
    return {
      errorMsg: null,
    }
  },
  methods: {
    reset() {
      this.errorMsg = null
    },
  },
}
</script>
