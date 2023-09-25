`
<template>
  <base-modal
    v-model="shown"
    title="Addresse"
    small-spacing
    @shown="initAutocomplete"
    @closed="destroyAutocomplete"
    @dismiss="onDismiss"
  >
    <template #activator>
      <base-input
        :value="value ? value.text : ''"
        v-bind="$attrs"
        readonly
        @clear="$emit('input', null)"
      />
    </template>

    <div class="-mx-1">
      <slot name="input">
        <div class="pb-5 bg-white px-1 sticky z-10 top-0">
          <base-input ref="search" v-model="tmp" v-bind="$attrs" autofocus />
        </div>
      </slot>

      <div ref="resultContainer" class="mb-6 px-1 py-1 h-full" />
    </div>
  </base-modal>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: { type: Object, default: () => null },
    cityOnly: Boolean,
  },
  data() {
    return {
      shown: false,
      tmp: null,
      snap: null,
    }
  },
  mounted() {
    const handler = this.positionResultContainer.bind(this)
    window.addEventListener('resize', handler)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', handler)
    })
  },
  methods: {
    initAutocomplete() {
      this.$nextTick(() => {
        const inputEl = this.$refs.search.$el.querySelector('input')

        this.initGoogleMap(() => {
          this.createAutocompleteInput(
            inputEl,
            this.handleGooglePlaceSelected.bind(this)
          )
        })

        this.tmp = this.snap = this.value?.text || ''
      })
    },

    destroyAutocomplete() {
      const pacContainer = document.querySelector('.pac-container')
      if (pacContainer) {
        pacContainer.parentNode.removeChild(pacContainer)
      }
    },

    onDismiss() {
      if (this.tmp !== this.snap) {
        this.$emit('input', null)
      }
    },

    initGoogleMap(callback) {
      const SCRIPT_ID = 'cw-gg-map'
      if (!document.querySelector('#' + SCRIPT_ID)) {
        window.placeApiInitialized = callback
        const script = document.createElement('script')
        script.setAttribute('id', SCRIPT_ID)
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NUXT_ENV_GMAP_KEY}&libraries=places&language=de&callback=placeApiInitialized`
        document.body.appendChild(script)
      } else {
        callback()

        // For multiple input address on the same page at the same time, the above callback() might be executed before the script takes place
        const placeApiInitialized = window.placeApiInitialized
        if (placeApiInitialized) {
          window.placeApiInitialized = () => {
            placeApiInitialized()
            callback()
          }
        }
      }
    },

    createAutocompleteInput(inputEl, onPlaceChange) {
      if (!window.google) {
        return
      }

      const oldAutocompleteAttr = inputEl.getAttribute('autocomplete')
      oldAutocompleteAttr &&
        setTimeout(
          () => inputEl.setAttribute('autocomplete', oldAutocompleteAttr),
          200
        )

      // https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions
      // TODO Filter type address by default. Set types to ['address'] might do this but also need to handle type esablishment (e.g. a building)
      const opts = this.cityOnly ? { types: ['(cities)'] } : {}
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputEl,
        opts
      )

      // TODO Remove pac-container on destroy

      // https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete.place_changed
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place && place.address_components) {
          onPlaceChange(place, inputEl)
        }
      })
    },

    positionResultContainer() {
      if (!this.$refs.resultContainer) {
        return
      }
      const pacContainer = document.querySelector('.pac-container')
      if (!pacContainer) {
        return
      }
      const rect = this.$refs.resultContainer.getBoundingClientRect()

      pacContainer.style.position = 'fixed'
      pacContainer.style.top = rect.y
      pacContainer.style.left = rect.x
      pacContainer.style.width = rect.width
      pacContainer.style.height = rect.height
    },

    handleGooglePlaceSelected(place) {
      this.shown = false

      const addressComponents = {}
      place.address_components.forEach((c) => {
        addressComponents[c.types[0]] = {
          long: c.long_name,
          short: c.short_name,
        }
      })
      const { postal_code: zip, ...components } = addressComponents
      const city =
        components.administrative_area_level_2?.long ||
        components.administrative_area_level_1?.long ||
        components.administrative_area_level_3?.long ||
        components.administrative_area_level_4?.long ||
        components.locality?.long

      this.$emit('input', {
        text: this.cityOnly
          ? city + ', ' + components.country?.long
          : place.formatted_address,
        lng: place.geometry.location.lng(),
        lat: place.geometry.location.lat(),
        components: JSON.stringify(components),
        country: components.country?.short,
        zip: zip?.long || null,
        city,
      })
    },
  },
}
</script>

<style lang="scss">
.pac-container {
  @apply bg-transparent text-base shadow-none border-0 rounded-none visible;
}

.pac-item {
  border-top: none;
  padding: 5px 10px;
  user-select: none;
  font-size: 1em;
  @apply bg-white cursor-pointer text-teal-600 duration-200 mb-1;

  .pac-item-query {
    @apply text-black;
  }

  .pac-icon {
    @apply hidden;
  }

  &:hover,
  &-selected {
    &,
    &:hover {
      @apply bg-teal-100;
    }
  }
}

.pac-logo:after {
  @apply hidden;
}
</style>
`
