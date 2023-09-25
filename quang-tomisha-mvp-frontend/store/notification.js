export const state = () => ({
  notifications: [],
})

export const getters = {
  notificationGroups(state) {
    const groups = {}
    state.notifications.forEach((noti) => {
      if (!groups[noti.type]) {
        groups[noti.type] = {
          type: noti.type,
          items: [noti],
        }
      } else {
        groups[noti.type].items.push(noti)
      }
    })
    return Object.values(groups).sort((a, b) => a.type - b.type)
  },
}

export const mutations = {
  setState(state, data) {
    Object.entries(data).forEach(([key, val]) => {
      state[key] = val
    })
  },

  removeNotification(state, id) {
    const i = state.notifications.findIndex((n) => n.id === id)
    ~i && state.notifications.splice(i, 1)
  },
}

export const actions = {
  fetchNotifications({ commit }, companyId) {
    const params = companyId ? { companyId } : {}
    return this.$axios.get('notification', { params }).then((notifications) => {
      commit('setState', { notifications })
    })
  },

  async setNotificationStatus({ commit }, { id, status }) {
    commit('removeNotification', id)
    await this.$axios.patch('/notification/' + id, { status })
  },
}
