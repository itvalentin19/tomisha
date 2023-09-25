<template>
  <div
    ref="container"
    class="page-profile bg-white overflow-hidden pb-32 text-gray-600"
  >
    <h1
      class="my-10 px-6 md:px-0 w-full max-w-lg mx-auto text-2xl text-center text-gray-700 font-medium"
    >
      {{ title }}
    </h1>

    <section class="md:-mb-10 lg:-mb-24 xl:-mb-36">
      <div class="max-w-lg mx-auto px-6 md:px-0">
        <div class="relative w-full pb-full">
          <div
            class="absolute bottom-0 left-0 right-0 z-2 mb-6 md:mb-10 flex items-end"
          >
            <span class="text-extra-largest text-gray-600 leading-none"
              >1.</span
            >

            <span
              class="text-lg md:text-xl tracking-normal -mr-10 sm:-mr-10 md:-mr-20 md:ml-4 mb-2"
            >
              {{ steps[0].text }}
            </span>
          </div>

          <div class="absolute w-3/4 top-0 right-0 pointer-events-none z-1">
            <img
              :src="steps[0].img"
              :class="{ floating: floatingIndex === 0 }"
              class="w-full"
            />
          </div>

          <div
            class="absolute z-1 left-0 bottom-0 pointer-events-none w-3/4 -ml-1/5 -mb-10 md:-mb-20"
          >
            <div class="pb-full rounded-full bg-gray-100 bg-opacity-50" />
          </div>
        </div>
      </div>
    </section>

    <section>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2056 287">
        <path
          d="M381 97.4281C208.551 47.7763 31.7606 49.0193 0 54.3537V287H2056V4.85791C1939 -13.8531 1777.5 26.7313 1729.5 38.0444C1681.5 49.3576 1555.5 86.4924 1357 151.517C985.447 273.231 691 184.765 619.5 167.348C570.827 155.492 475.542 124.649 381 97.4281Z"
          class="bg-light-purple"
        />
      </svg>

      <div class="bg-light-purple px-6 md:px-0">
        <div class="max-w-lg mx-auto">
          <div class="relative w-full pb-full">
            <div
              class="absolute top-0 left-0 right-0 z-2 pl-4 md:pl-8 -mt-4 md:-mt-4 lg:mt-10 flex items-end"
            >
              <span class="text-extra-largest text-gray-600 leading-none"
                >2.</span
              >

              <span
                class="text-lg md:text-xl tracking-normal -mr-10 sm:-mr-10 md:-mr-20 md:ml-4 mb-2"
              >
                {{ steps[1].text }}
              </span>
            </div>

            <div
              class="absolute w-3/4 bottom-0 right-0 pointer-events-none z-1"
            >
              <img
                :src="steps[1].img"
                :class="{ floating: floatingIndex === 1 }"
                class="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2056 143">
        <path
          d="M192.5 59.5C154.817 78.3158 61.4656 138.317 0 143V0H2056C1935.25 44.8234 1713 143 1226.97 121.926C1096.45 116.267 1020.46 108.667 934.043 96.8386C736.08 69.7439 648.736 39.6459 500.936 19.0667C364 0 273.478 19.0667 192.5 59.5Z"
          class="bg-light-purple"
        />
      </svg>
    </section>

    <section>
      <div class="max-w-lg mx-auto px-6 md:px-0">
        <div class="relative w-full pb-full">
          <div
            class="absolute top-0 left-0 right-0 z-2 pl-6 md:pl-12 -mt-4 md:-mt-8 flex items-end"
          >
            <span class="text-extra-largest text-gray-600 leading-none"
              >3.</span
            >

            <span
              class="text-lg md:text-xl tracking-normal -mr-10 sm:-mr-10 md:-mr-20 md:ml-4 mb-2"
            >
              {{ steps[2].text }}
            </span>
          </div>

          <div
            class="absolute w-5/6 md:w-full bottom-0 right-0 pointer-events-none z-1"
          >
            <img
              :src="steps[2].img"
              :class="{ floating: floatingIndex === 2 }"
              class="w-full"
            />
          </div>

          <div
            class="absolute left-0 bottom-0 pointer-events-none w-full -ml-2/5 transform -translate-y-10 md:-translate-y-20"
          >
            <div class="pb-full rounded-full bg-gray-100 bg-opacity-50" />
          </div>
        </div>
      </div>
    </section>

    <base-bottom-actions :items="actions" />

    <!-- <profile-importer ref="profileImporter" /> -->
  </div>
</template>

<script>
import { UserType } from '~/constants'
export default {
  layout: 'full',
  data() {
    return {
      titlesByUserType: Object.freeze({
        1: 'Drei einfache Schritte zu deinem neuen Job',
        2: 'Drei einfache Schritte zu deinem neuen Mitarbeiter',
        3: 'Drei einfache Schritte zu deinem neuen Mitarbeiter',
      }),
      stepsByUserType: Object.freeze({
        1: [
          {
            title: 'Profil',
            text: 'Erstellen dein Lebenslauf',
            img: '/img/step_employee_1.svg',
          },
          {
            title: 'Berufsprofil',
            text: 'Erstellen dein Lebenslauf',
            img: '/img/step_employee_2.svg',
          },
          {
            title: 'Bewerben',
            text: 'Mit nur einem Klick bewerben',
            img: '/img/step_employee_3.svg',
          },
        ],
        2: [
          {
            title: 'Profil',
            text: 'Erstellen dein Unternehmensprofil',
            img: '/img/step_employee_1.svg',
          },
          {
            title: 'Jobinserat',
            text: 'Erstellen ein Jobinserat',
            img: '/img/step_employer_2.svg',
          },
          {
            title: 'Neuer Mitarbeiter',
            text: 'Wähle deinen neuen Mitarbeiter aus',
            img: '/img/step_employer_3.svg',
          },
        ],
        3: [
          {
            title: 'Profil',
            text: 'Erstellen dein Unternehmensprofil',
            img: '/img/step_employee_1.svg',
          },
          {
            title: 'Job Interview',
            text: 'Führe ein Bewerbungsgespräch für ein anderes Unternehmen (B2B)',
            img: '/img/step_agency_2.svg',
          },
          {
            title: 'Vermitteln',
            text: 'Nach Provision oder Stundenlohn',
            img: '/img/step_agency_3.svg',
          },
        ],
      }),
      floatingIndex: 0,
      actions: [
        {
          text: 'Erstelle dein Profil',
          primary: true,
          disabledOnLoading: true,
          handler: () => this.gotoEditProfile(),
        },
        {
          text: 'Dashboard',
          disabledOnLoading: true,
          handler: () => this.skip(),
        },
      ],
    }
  },
  computed: {
    userType() {
      return this.$auth.user.type
    },
    title() {
      return this.titlesByUserType[this.userType]
    },
    steps() {
      return this.stepsByUserType[this.userType]
    },
  },
  mounted() {
    const $sections = Array.from(
      this.$refs.container.querySelectorAll('section')
    )

    const onScroll = () => {
      const { scrollTop } = document.documentElement
      const distances = $sections.map((s) =>
        Math.abs(s.offsetTop - s.offsetHeight / 2 - scrollTop)
      )
      let smallest = 0
      for (let i = 1; i < distances.length; i++) {
        if (distances[i] < distances[smallest]) {
          smallest = i
        }
      }

      this.floatingIndex = smallest
    }

    window.addEventListener('scroll', onScroll)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('scroll', onScroll)
    })
  },
  methods: {
    skip() {
      if (
        this.userType === UserType.EMPLOYER ||
        this.userType === UserType.AGENT
      ) {
        this.$confirm({
          img: '/img/employer_skip.svg',
          title: 'Zum Unternehmensprofil',
          text: 'Als Arbeitgeber hast du die Möglichkeit, dein privates Profil später zu vollständigen. Klicke auf " Überspringen", um direkt mit dem Unternehmensprofil fortzufahren.',
          okText: 'Jetzt Berufsprofil erstellen',
          cancelText: 'Überspringen',
          closeOnDone: false,
          done: () => this.gotoEditProfile(),
          cancel: () => {
            this.$router.push('/staff/company-search')
          },
        })
      } else {
        this.$router.push('/')
      }
    },
    // // Import profile from pdf
    // askImportProfile() {
    //   this.$confirm({
    //     img: '/img/step_import.svg',
    //     title: 'Daten aus Lebenslauf hinzufügen',
    //     text:
    //       'Der schnellste und einfachste Weg ist das Hinzufügen eines Lebenslaufs. Die Daten werden für dich ausgelesen und du kannst sie korrigieren. Oder du kannst einen neuen Lebenslauf erstellen.',
    //     okText: 'Lebenslauf hinzufügen',
    //     cancelText: 'Keinen Lebenslauf hinzufügen',
    //     done: () => this.$refs.profileImporter.show(),
    //     cancel: () => this.gotoEditProfile(),
    //   })
    // },
    // Go to update personal info page
    gotoEditProfile() {
      this.$confirm({
        img: '/img/step_done.svg',
        title: 'Einmalige Aufbereitung grosser Erfolg',
        text: 'Um einen der grössten Vorteile von Tomisha zu erleben. Erstellen wir gemeinsam deinen Lebenslauf. Das dauert etwa 5 Minuten. Der Vorteil ist, dass du den Lebenslauf einmal erstellst und ihn mit einem Klick an alle Arbeitgeber senden kannst. Es lohnt sich also, sich diese Zeit zu nehmen.\n\nWir wünschen dir viel Erfolg.',
        okText: 'Jetzt Lebenslauf erstellen',
        cancelText: 'Dashboard',
        closeOnDone: false,
        done: () => {
          this.$router.push('/edit/profile/basic-info')
        },
        cancel: () => this.skip(),
      })
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>

<style lang="scss">
.bg-light-purple {
  fill: #d0cde1;
  background: #d0cde1;
}

@keyframes animateWave {
  0% {
    transform: scale(1, 0);
  }
  100% {
    transform: scale(1, 1);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.page-profile {
  section {
    svg {
      display: block;
      transform-origin: bottom;
      animation: animateWave 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;

      &:last-child {
        transform-origin: top;
      }
    }
  }

  .floating {
    transform: translateY(0px);
    animation: float 2s ease-in-out infinite;
  }
}
</style>
