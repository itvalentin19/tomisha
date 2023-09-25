<template>
  <base-modal
    v-model="shown"
    :title="
      firstScreen
        ? 'Was für ein Profil möchtest du erstellen?'
        : 'Was für ein Arbeitgeber bist du?'
    "
    :back-icon="!firstScreen"
    :dismissible="!firstScreen"
    persistent
    small-spacing
    @close="onCloseClick"
  >
    <template v-if="firstScreen">
      <base-segmented-controls
        v-model="value"
        label="Ich bin ..."
        :items="firstScreenChoices"
        class="mb-8"
      />

      <p>
        Arbeitnehmer<br />
        Ich bin auf der suche nach Arbeit.
        <br />
        <br />
        Arbeitgeber<br />
        Ich bin auf der suchen nach neuen Mitarbeiter.
      </p>
    </template>

    <template v-else>
      <base-segmented-controls
        v-model="value"
        label="Ich bin ..."
        :items="secondScreenChoices"
        class="mb-8"
      />

      <p class="pb-1">
        Temporärbüro<br />
        Du suchst Mitarbeiter für andere Unternehmen und Mittarbeiter.
        <br />
        <br />
        Arbeitgeber<br />
        Ich suche nach neuen Mitarbeiter nur für mein Unternehmen.
      </p>
    </template>

    <hcaptcha
      v-if="value && value !== -1"
      class="mt-16"
      @verify="captcha = $event"
      @expired="captcha = null"
      @error="captcha = null"
    />

    <template #footer>
      <base-button
        primary
        :disabled="!value || (!captcha && value !== -1)"
        @click="proceed"
      >
        {{ value !== -1 ? 'Erstellen' : 'Weiter' }}
      </base-button>
    </template>
  </base-modal>
</template>

<script>
import { UserType } from '~/constants'
export default {
  data() {
    return {
      shown: false,
      value: null,
      firstScreen: false,
      captcha: null,
      firstScreenChoices: [
        { text: 'Arbeitnehmer', value: UserType.EMPLOYEE },
        { text: 'Arbeitgeber', value: -1 },
      ],
      secondScreenChoices: [
        { text: 'Temporärbüro', value: UserType.AGENT },
        { text: 'Arbeitgeber', value: UserType.EMPLOYER },
      ],
    }
  },
  methods: {
    show() {
      this.firstScreen = true
      this.value = null
      this.shown = true
    },
    proceed() {
      if (this.value === -1) {
        this.value = null
        this.firstScreen = false
      } else {
        this.$emit('done', {
          captcha: this.captcha,
          type: this.value,
        })
        this.shown = false
      }
    },
    onCloseClick() {
      this.value = null

      if (this.firstScreen) {
        this.shown = false
      } else {
        this.firstScreen = true
      }
    },
  },
}
</script>
