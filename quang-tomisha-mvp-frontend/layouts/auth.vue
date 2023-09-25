<template>
  <div class="bg-white min-h-screen tracking-wider lg:flex flex-col">
    <header
      class="hidden lg:flex items-center bg-gray-100 sticky top-1.125 px-6 lg:px-9 xl:px-32 py-2 flex-shrink-0 z-20"
    >
      <base-logo />
    </header>

    <main class="lg:flex lg:flex-grow">
      <div
        class="hidden lg:flex fixed top-0 bottom-0 right-0 w-1/2 2xl:w-3/5 justify-center items-center bg-gray-200 p-20 lg:p-32 xl:p-40 select-none"
      >
        <img class="w-full h-auto select-none" :src="backgroundImage" />
      </div>

      <div
        class="w-full lg:w-1/2 2xl:w-2/5 mx-auto lg:mx-0 lg:py-6 lg:px-9 xl:px-32 lg:flex lg:items-center"
      >
        <nuxt />
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        { route: '/register', url: '/img/register_bg.svg' },
        { route: '/login', url: '/img/login_bg.svg' },
        { route: '/auth/create-account', url: '/img/set_password_bg.svg' },
        { route: '/auth/forgot-password', url: '/img/forgot_pw_bg.svg' },
        { route: '/auth/reset-password', url: '/img/forgot_pw_bg.svg' },
        { route: '/staff/company-search', url: '/img/company_search.svg' },
      ],
    }
  },
  computed: {
    backgroundImage() {
      const route = this.$route.path
      const img = this.images.find((img) => route.startsWith(img.route))
      return img ? img.url : '/img/email_verification.svg'
    },
  },
}
</script>
