<template>
  <div class="bg-white tracking-wider min-h-screen xl:flex flex-col">
    <header class="sticky top-1.125">
      <div class="flex items-center bg-gray-100 px-6 py-2 flex-shrink-0 z-20">
        <base-logo />
      </div>

      <nav class="bg-gray-200 text-center">
        <h1
          v-if="currentPage"
          class="text-gray-700 text-4xl lg:text-5xl p-6 lg:py-10 xl:py-14 group cursor-pointer flex justify-center items-center"
          @click.stop="toggleNav"
        >
          <span class="group-hover:underline" v-html="currentPage.title" />

          <base-icon
            icon="chevron-down"
            class="text-xl -mr-1 sm:-mr-8 ml-2 duration-300 flex-shrink-0"
            :class="{ 'transform rotate-180': navState }"
          />
        </h1>

        <collapse-transition>
          <div
            v-if="navState"
            class="bg-gray-200 absolute top-full left-0 right-0 pb-6"
          >
            <n-link
              v-for="page in otherPages"
              :key="page.to"
              :to="page.to"
              class="text-4xl lg:text-5xl mb-4 block hover:underline group"
              @click.native="toggleNav"
              v-html="page.title"
            />
          </div>
        </collapse-transition>
      </nav>
    </header>

    <main class="flex-grow mx-auto max-w-6xl">
      <nuxt />
    </main>
  </div>
</template>

<script>
export default {
  data() {
    const pages = [
      { to: '/impression', title: 'Impressum' },
      {
        to: '/privacy-policy',
        title:
          'Datenschutz<span class="inline-block group-hover:underline">richtlinie</span>',
      },
      {
        to: '/copyright-policy',
        title:
          'Urheberrechts<span class="inline-block group-hover:underline">richtlinie</span>',
      },
      { to: '/cookie-policy', title: 'Cookie-Richtlinie' },
    ]

    return {
      navState: false,
      pages,
    }
  },
  computed: {
    currentPage() {
      const path = this.$route.path
      return this.pages.find((p) => path.startsWith(p.to))
    },
    otherPages() {
      return this.pages.filter((p) => p !== this.currentPage)
    },
  },
  methods: {
    toggleNav() {
      this.navState = !this.navState
    },
  },
}
</script>
