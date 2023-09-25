<template>
  <div class="min-h-screen bg-white">
    <header
      class="flex items-center bg-white rounded-b-xl shadow-lg z-30 px-6 lg:px-20 xl:px-26 py-2 sticky top-1.125"
    >
      <base-logo />
    </header>

    <basic-nav
      class="lg:fixed lg:left-0 lg:top-1.125 lg:pt-30 lg:bottom-0 lg:w-full lg:max-w-xs xl:max-w-sm lg:bg-gray-100"
      :pages="adminPages"
      :reorder="false"
    />

    <nuxt />
  </div>
</template>

<script>
export default {
  data() {
    return {
      adminPages: [
        { to: '/admin/users', icon: 'profile', text: 'Users' },
        { to: '/admin/report', icon: 'dashboard', text: 'Report' },
        { to: '/admin/support', icon: 'company', text: 'Support' },
      ],
    }
  },
}
</script>
