<template>
  <base-input
    v-bind="$attrs"
    :label="label"
    :placeholder="showPassword ? 'Passwort' : '•••••••••••••'"
    :type="showPassword ? 'text' : 'password'"
    :rules="[
      ...($attrs.rules || []),
      $rules.minLength(8),
      $rules.maxLength(50),
      $rules.nospace,
    ]"
    show-counter
    :append-icon="showPassword ? 'eye' : 'eye-slash'"
    @append="showPassword = !showPassword"
    v-on="$listeners"
  />
</template>

<script>
export default {
  inheirtAttrs: false,
  props: {
    label: { type: String, default: 'Passwort' },
  },
  data() {
    return {
      showPassword: false,
    }
  },
}
</script>
