import { UserStatus } from '~/constants'

export const actions = {
  async nuxtServerInit({ state, dispatch }, { $auth }) {
    if ($auth.isAuthenticated) {
      await dispatch('me/fetchBriefMe')
      if (
        state.me.me &&
        state.me.me.status !== UserStatus.DEACTIVATED &&
        state.me.me.status !== UserStatus.LOCKED
      ) {
        $auth.updateUser(state.me.me)
      } else {
        $auth.logout()
      }
    }
  },
}
