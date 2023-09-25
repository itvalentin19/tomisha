export const state = () => ({
  contacts: [],
  total: 0,
  query: {},
})

export const actions = {
  fetchMyContacts({ commit, state }, { skip, ...query } = {}) {
    const params = this.$utils.filterObject(
      this.$utils.extract(query, ['status'])
    )

    const snapQuery = { ...params }

    const isModified = this.$utils.isModified(state.query, snapQuery)
    if (
      !isModified &&
      typeof skip === 'number' &&
      skip < state.contacts.length
    ) {
      return
    }
    params.take = 10
    params.skip = isModified ? 0 : state.contacts.length

    return this.$axios.get('/contact', { params }).then(({ items, total }) => {
      const today = new Date()
      items.map((item) => {
        const updatedAt = new Date(item.updatedAt)
        const diff = Math.round((today - updatedAt) / (1000 * 60 * 60 * 24))
        let res = ''
        if (diff === 0) {
          res = 'Heute'
        } else if (diff > 0 && diff < 31) {
          res = diff + ' Tage'
        } else if (diff > 30 && diff < 365) {
          res = Math.round(diff / 30) + ' Monat'
        } else if (diff > 365) {
          res = Math.round(diff / 365) + ' Jahre'
        }

        return (item.diff = res)
      })

      const newItems = items.filter((item) => !!item.contactUser)

      return commit('setState', {
        contacts: isModified ? newItems : [...state.contacts, ...newItems],
        total,
        query: snapQuery,
      })
    })
  },

  deleteContact({ commit, state }, id) {
    return this.$axios.delete('/contact/' + id).then(() => {
      const i = state.contacts.findIndex((c) => c.id === id)
      if (i !== -1) {
        const contacts = [...state.contacts]
        contacts.splice(i, 1)
        commit('setState', { contacts, total: -1 })
      }
    })
  },
}

export const mutations = {
  setState(state, data) {
    Object.entries(data).forEach(([key, val]) => {
      state[key] = val
    })
  },
}
