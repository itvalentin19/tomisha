<template>
  <div class="bg-white">
    <!-- Header -->
    <header
      class="bg-white rounded-b-xl shadow-lg z-30 flex items-center justify-between px-6 lg:px-8 py-2 sticky top-1.125"
    >
      <base-logo />

      <n-link
        to="/login"
        class="no-underline text-teal-600 hover:underline font-medium mx-2"
      >
        Login
      </n-link>
    </header>

    <!-- Main -->
    <main class="overflow-hidden">
      <div
        v-for="aud in audienceTypes"
        v-show="!audienceType || audienceType === aud.value"
        :key="aud.value"
      >
        <section class="home__hero text-center py-10 mb-24 md:mb-48 xl:mb-64">
          <h1
            class="text-5xl lg:text-6xl text-gray-800 px-6 w-full max-w-6xl mx-auto"
          >
            {{ aud.heading }}
          </h1>

          <img
            src="/img/home_shake_hand.svg"
            class="md:hidden select-none mx-auto w-full transform translate-y-8 -mt-8"
          />

          <img
            src="/img/home_shake_hand_desktop.svg"
            class="hidden md:block select-none mx-auto w-full transform translate-y-12 xl:translate-y-28 -mt-12 xl:-mt-28"
          />
        </section>

        <section class="mb-24 md:mb-32 text-center">
          <p
            class="text-3xl md:text-4xl max-w-5xl px-6 w-full mx-auto text-gray-700 font-semibold"
          >
            {{ aud.subheading }}
          </p>
        </section>

        <!-- Full width -->
        <section v-for="(step, i) in aud.steps" :key="i" class="home__step">
          <!-- Box -->
          <div class="home__step__box">
            <h4 class="home__step__title">
              <span class="home__step__title__num">{{ i + 1 }}.</span>

              <span class="tracking-normal ml-4 md:ml-6 mb-2">
                {{ step.text }}
              </span>
            </h4>

            <!-- Img -->
            <div class="home__step__img">
              <img :src="step.img" class="w-full" />
            </div>
          </div>

          <div v-if="i === 1" class="home__step__bg">
            <img src="/img/home_curve_bg.svg" />
          </div>
        </section>
      </div>
    </main>

    <!-- Popup select audience type -->
    <aside
      v-show="!audienceType && isClient"
      class="fixed inset-0 z-50 bg-opacity-75 bg-black flex justify-center items-center p-6"
    >
      <div
        class="w-full max-w-md px-6 sm:px-8 pt-5 sm:pt-7 pb-2 md:px-10 md:pt-10 bg-white rounded-xl"
      >
        <div class="mb-4 sm:mb-8 md:mb-12 text-gray-600">
          <div class="mb-2 sm:mb-4 md:mb-6">
            <base-logo disabled />
          </div>

          <div class="text-lg sm:text-xl">Deine Job Webseite</div>
        </div>

        <n-link
          v-for="type in audienceTypes"
          :key="type.value"
          :to="type.to"
          replace
          class="border-t border-gray-200 py-4 sm:py-6 md:py-10 flex items-center cursor-pointer text-gray-700 hover:bg-gray-100 duration-300"
        >
          <base-icon
            :icon="type.icon"
            class="text-2xl sm:text-3xl flex-shrink-0 ml-3 mr-6 md:mr-10"
          />

          <div>
            <h6 class="text-lg sm:text-xl mb-2">{{ type.text }}</h6>

            <p class="text-sm">{{ type.description }}</p>
          </div>
        </n-link>
      </div>
    </aside>

    <!-- Footer -->
    <footer
      class="bg-gray-100 px-6 py-10 md:px-8 md:py-12 text-gray-600 flex flex-wrap"
    >
      <div class="w-full md:w-1/3 md:pr-4 mb-10 md:mb-12 order-1">
        <h4 class="mb-4 md:mb-6">
          <base-logo />
        </h4>

        <p class="text-sm text-gray-600 max-w-sm">
          Hier findest Du Deinen Job mit nur einem Click. Suchst du einen neuen
          Job, findest du ihn hier auf deiner Jobplattform. Finde Deinen Job aus
          täglich neu eingestellten Stellenangeboten und bewirb Dich direkt über
          das Jobportal.
        </p>
      </div>

      <div
        class="w-full border-t border-black pt-6 md:pt-8 order-2 md:order-5 flex mb-10 md:mb-0"
      >
        <div class="text-sm">
          <div class="mb-2">
            © {{ $dayjs().format('YYYY') }} Tomisha. Alle Rechte vorbehalten.
          </div>

          <div>Mit ❤ von Tomisha erstellt</div>
        </div>
      </div>

      <div class="w-full md:w-1/3 md:px-4 mb-10 md:mb-12 order-3 font-semibold">
        <h4 class="text-base uppercase mb-10 md:mb-12">Ich bin ein</h4>

        <ul class="list-none">
          <li
            v-for="type in audienceTypes"
            :key="type.value"
            class="mb-4 md:mb-6 block"
          >
            <n-link
              :to="type.to"
              class="text-gray-600 hover:underline cursor-pointer"
              @click.native="scrollToTop"
            >
              {{ type.text }}
            </n-link>
          </li>
        </ul>
      </div>

      <div class="w-full md:w-1/3 md:px-4 mb-10 md:mb-12 order-4 font-semibold">
        <h4 class="text-base uppercase mb-10 md:mb-12">Legal</h4>

        <ul class="list-none">
          <li
            v-for="page in policyPages"
            :key="page.to"
            class="mb-4 md:mb-6 block"
          >
            <n-link
              :to="page.to"
              class="hover:underline cursor-pointer text-gray-600"
            >
              {{ page.text }}
            </n-link>
          </li>
        </ul>
      </div>

      <div></div>
    </footer>

    <!-- Register button at bottom -->
    <nav
      class="sticky bottom-0 shadow-top bg-white p-6 md:px-10 lg:px-16 xl:px-24 rounded-t-xl z-20"
    >
      <base-button to="/register" primary class="mb-3">
        Kostenlos Registrieren
      </base-button>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isClient: process.client,
      audienceType: null,
      audienceTypes: [
        {
          value: '1',
          text: 'Arbeitnehmer',
          icon: 'person',
          to: '/employee',
          heading: 'Hier findest Du Deinen Job mit nur einem Click',
          subheading: 'Drei einfach Schritte zu Deinem neuem Job',
          description: 'Du suchst deinen neuen Traum-Job',
          steps: [
            {
              text: 'Erstellen dein Lebenslauf',
              img: '/img/home_step_1_employee.svg',
            },
            {
              text: 'Finde dein passender Job',
              img: '/img/home_step_2.svg',
            },
            {
              text: 'Mit nur einem Klick bewerben',
              img: '/img/home_step_3_employee.svg',
            },
          ],
        },
        {
          value: '2',
          text: 'Arbeitgeber',
          icon: 'building',
          to: '/employer',
          heading: 'Hier findest Du Deinen neuen Mitarbeiter',
          subheading: 'Drei einfache Schritte zu Deinem neuen Mitarbeiter',
          description: 'Du suchst nach idealen Mitarbeitern',
          steps: [
            {
              text: 'Unternehmensprofil gestalten',
              img: '/img/home_step_1_company.svg',
            },
            {
              text: 'Erstelle dein Jobinserat',
              img: '/img/home_step_2.svg',
            },
            {
              text: 'Wähle dein Wunschkandidat aus',
              img: '/img/home_step_3_company.svg',
            },
          ],
        },
        {
          value: '3',
          text: 'Temporärbüro',
          icon: 'agent',
          to: '/temporary-office',
          heading: 'Vermittele Deine Kandidaten direkt hier',
          subheading:
            'Drei einfache Schritte zu Deiner Vermittlung eines neuen Kandidaten',
          description: 'Du vermittels Mitarbeiter',
          steps: [
            {
              text: 'Unternehmensprofil gestalten',
              img: '/img/home_step_1_company.svg',
            },
            {
              text: 'Vermittlungsangebote direkt vom Arbeitgeber erhalten',
              img: '/img/home_step_2.svg',
            },
            {
              text: 'Sofortige Vermittlung des Wunschkandidaten an den Arbeitgeber',
              img: '/img/home_step_3_company.svg',
            },
          ],
        },
      ],

      policyPages: [
        { text: 'Impressum', to: '/impression' },
        { text: 'Cookie-Richtline', to: '/cookie-policy' },
        { text: 'Datenschutzrichtlinie', to: '/privacy-policy' },
        { text: 'Urheberrechtsrichtlinie', to: '/copyright-policy' },
      ],
    }
  },
  created() {
    if (process.client) {
      const STORAGE_KEY = 'tom:audience'

      const unwatch = this.$watch(
        '$route.path',
        (path) => {
          const isHome = path === '/'
          const audienceType = localStorage.getItem(STORAGE_KEY)
          const typeMeta =
            (!isHome &&
              this.audienceTypes.find((a) => path.startsWith(a.to))) ||
            (audienceType &&
              this.audienceTypes.find((a) => a.value === audienceType))

          if (typeMeta) {
            this.audienceType = typeMeta.value
            localStorage.setItem(STORAGE_KEY, typeMeta.value)

            if (isHome) {
              this.$router.replace(typeMeta.to)
            }

            this.$utils.freezePageScroll(false)
          }
        },
        { immediate: true }
      )

      this.$once('hook:beforeDestroy', unwatch)
    }
  },
  mounted() {
    if (!this.audienceType) {
      this.$utils.freezePageScroll(true)
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
    },
    scrollToTop() {
      document.documentElement.scrollTop = 0
    },
  },
}
</script>

<style lang="scss">
.home__hero {
  background-image: url('/img/home_hero_bg.svg');
  background-position: bottom center;
  @apply bg-cover bg-no-repeat;
}

.home__step {
  @apply break-words;

  &:nth-child(3) {
    @apply mb-10;

    .home__step {
      &__box {
        @apply flex-col-reverse relative;

        &::after {
          content: '';
          @apply absolute top-0 left-0 block w-full max-w-lg pb-full bg-gray-100 rounded-full transform -translate-x-1/2 scale-140 origin-top;
        }
      }

      &__img {
        @apply w-3/4 ml-auto;

        @screen md {
          @apply w-2/3 mr-auto;
        }
      }
    }
  }

  &:nth-child(4) {
    @apply relative;

    .home__step {
      &__box {
        @apply absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 justify-evenly py-16 z-1;
      }

      &__title {
        @apply pl-4;

        @screen md {
          @apply transform translate-x-4;
        }
      }

      &__img {
        @apply pl-8;

        @screen md {
          transform: translateX(10%);
          @apply pl-0;
        }
      }

      &__bg {
        @apply pointer-events-none overflow-hidden w-full;

        img {
          min-width: 1440px;
          @apply w-full mx-auto;
        }
      }
    }
  }

  &:nth-child(5) {
    @apply mb-48;

    .home__step {
      &__box {
        @apply relative;

        &::after {
          content: '';
          @apply absolute top-0 left-0 block w-full max-w-lg pb-full bg-gray-100 rounded-full transform -translate-x-20 -translate-y-10 scale-110;

          @screen md {
            @apply scale-95 -translate-x-20;
          }
        }
      }

      &__title {
        @apply pl-4 mt-10;

        @screen md {
          @apply mt-24 transform translate-x-12;
        }
      }

      &__img {
        @apply w-3/4 ml-auto mt-6 relative;

        @screen md {
          @apply mr-auto mt-10;
        }

        &::after {
          content: '';
          @apply absolute top-0 right-0 w-full pb-full bg-gray-100 rounded-full transform translate-x-6 -translate-y-16;
        }

        img {
          @apply z-1 relative;
        }
      }
    }
  }

  &__box {
    @apply w-full max-w-lg mx-auto px-4 relative flex flex-col;

    @screen md {
      @apply px-0;
    }
  }

  &__title {
    @apply relative z-2 flex items-end overflow-hidden text-xl;

    @screen md {
      @apply text-2xl;
    }

    &__num {
      @apply text-extra-large text-gray-600 leading-none;

      @screen md {
        @apply text-extra-largest;
      }
    }
  }

  &__img {
    @apply relative pointer-events-none z-1;
  }
}
</style>
