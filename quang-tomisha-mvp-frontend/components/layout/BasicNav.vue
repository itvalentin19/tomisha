<template>
  <div class="lg:flex lg:py-12">
    <ul class="hidden lg:flex flex-col ml-20 xl:ml-26 text-teal-600">
      <li
        v-for="(page, i) in desktopPages"
        :key="page.to"
        class="flex-shrink-0"
        :class="[
          reorder && i === pages.length - 1 ? 'mt-auto' : 'mb-8',
          activePage === page ? 'font-semibold' : '',
        ]"
      >
        <n-link :to="page.to" class="inline-flex items-center">
          <base-icon
            :icon="`page/${page.icon}${activePage === page ? '-active' : ''}`"
            class="text-xl mr-4"
          />

          <div class="truncate">
            {{ page.text }}
          </div>
        </n-link>
      </li>
    </ul>

    <base-bottom-slide-panel
      v-slot="{ expanded }"
      actions-mode
      body-class="bg-gray-100"
      class="lg:hidden"
    >
      <ul
        class="flex flex-wrap -mx-4 -mt-2 text-teal-600 text-center select-none"
      >
        <li
          v-for="(page, i) in reorderedPages"
          :key="page.to"
          class="block w-1/3 px-1 sm:px-3 pt-2 pb-3"
          :class="{ 'opacity-0': !expanded && i > 2 }"
        >
          <n-link :to="page.to" class="block">
            <div class="mb-1" :class="'href-' + page.to">
              <base-icon
                :icon="`page/${page.icon}${
                  activePage === page ? '-active' : ''
                }`"
                class="text-xl"
                :href-class="'href-' + page.to"
              />
            </div>

            <div class="truncate" :class="'href-' + page.to">
              {{ page.text }}
            </div>
          </n-link>
        </li>
      </ul>
    </base-bottom-slide-panel>
  </div>
</template>

<script>
export default {
  props: {
    pages: { type: Array, default: () => [] },
    reorder: { type: Boolean, default: true },
  },
  computed: {
    desktopPages() {
      if (!this.reorder) {
        return this.pages
      }
      const pages = [...this.pages]

      const tmp = pages[1]
      pages[1] = pages[0]
      pages[0] = tmp

      return pages
    },

    activePage() {
      const path = this.$route.path
      return path === '/'
        ? this.pages.find((page) => page.to === '/')
        : this.pages.find(
            (page, i) =>
              page.to !== '/' && path.startsWith(page.match || page.to)
          )
    },

    reorderedPages() {
      if (!this.activePage || !this.reorder) {
        return this.pages
      }

      const pages = [...this.pages]

      const i = pages.indexOf(this.activePage)

      if (this.activePage.relatedPage) {
        const targetPage = pages.find(
          (page) => page.to === this.activePage.relatedPage
        )

        if (targetPage) {
          if (i > 0) {
            pages.unshift(pages.splice(i, 1)[0])
            pages.splice(2, 0, pages.splice(1, 1)[0])
          }
          const j = pages.indexOf(targetPage)
          j > 2 && pages.splice(2, 0, pages.splice(j, 1)[0])

          return pages
        }
      }

      if (i > 2) {
        pages.splice(2, 0, pages.splice(i, 1)[0])
      }

      return pages
    },
  },
}
</script>
