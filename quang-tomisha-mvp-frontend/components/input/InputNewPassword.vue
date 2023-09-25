<template>
  <div>
    <input-password
      v-bind="$attrs"
      :value="value"
      :rules="[$rules.required, ...passwordConditions.map((c) => c.validate)]"
      autofocus
      class="mb-6"
      @input="$emit('input', $event)"
    />

    <div>
      <div class="mb-4">Das Passwort muss mindestens enthalten:</div>

      <base-checkbox
        v-for="(condition, i) in passwordConditions"
        :key="i"
        :checked="conditionState[i]"
        :label="condition.text"
        label-class="font-semibold text-teal-600"
        disabled
        class="mb-4"
      />
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: { type: String, default: '' },
  },

  data() {
    return {
      passwordConditions: [
        {
          text: 'einen Kleinbuchstabe',
          validate: (p) =>
            /[a-z]/.test(p) || 'Should contain lowercase character',
        },
        {
          text: 'einen Grossbuchstaben',
          validate: (p) =>
            /[A-Z]/.test(p) || 'Should container uppercase character',
        },
        {
          text: 'eine Zahl',
          validate: (p) => /[0-9]/.test(p) || 'Should contain number',
        },
        {
          text: 'ein Sonderzeichen',
          validate: (p) => /\W/.test(p) || 'Should contain special character',
        },
        {
          text: '8 bis 50 Zeichen lang',
          validate: (p) =>
            (p && p.length >= 8 && p.length <= 50) ||
            'Should be between 8 and 50 characters',
        },
      ],
    }
  },

  computed: {
    conditionState() {
      return this.passwordConditions.map((cond) => {
        return typeof cond.validate(this.value) !== 'string'
      })
    },
  },
}
</script>
