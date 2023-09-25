<template>
  <base-modal v-model="shown" back-icon>
    <div class="mt-6 select-none">
      <img src="/img/password_confirmation.svg" class="w-full" />
    </div>

    <h2 class="text-2xl my-6 flex items-center">Bestätigung</h2>

    <p class="text-gray-600 text-lg mb-6">
      {{ text }}
    </p>

    <base-form ref="form" class="mb-6" @submit="submit">
      <input-password v-model="password" :rules="[$rules.required]" />
    </base-form>

    <template #footer>
      <base-button
        primary
        :disabled="!password"
        class="mb-2"
        @click="$refs.form.submit()"
      >
        Bestätigen
      </base-button>

      <base-button class="mt-6" @click="close"> Zurück </base-button>
    </template>
  </base-modal>
</template>

<script>
export default {
  props: {
    text: { type: String, default: 'Bestätigen mit deinem Passwort' },
  },
  data() {
    return {
      shown: false,
      password: null,
      cb: null,
    }
  },
  methods: {
    open(cb) {
      this.password = null
      this.cb = cb
      this.shown = true
    },
    close() {
      this.shown = false
    },
    submit() {
      this.cb && this.cb(this.password)
      this.close()
    },
  },
}
</script>
