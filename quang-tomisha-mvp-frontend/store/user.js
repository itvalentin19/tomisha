export const state = () => ({
  users: [],
  total: 0,
  query: {},
})

export const actions = {
  searchUsers({ commit, state }, { skip, ...query } = {}) {
    const params = this.$utils.filterObject(
      {
        ...this.$utils.extract(this.$router.currentRoute.query, [
          'firstName',
          'lastName',
          'city',
          'country',
          'km',
          'order',
        ]),
        ...query,
      },
      (f) => typeof f === 'boolean' || f
    )

    const snapQuery = { ...params }

    const isModified = this.$utils.isModified(state.query, snapQuery)
    if (!isModified && typeof skip === 'number' && skip < state.users.length) {
      return
    }
    params.take = 10
    params.skip = isModified ? 0 : state.users.length

    return this.$axios.get('/user', { params }).then(({ items, total }) =>
      commit('setState', {
        users: isModified ? items : [...state.users, ...items],
        total,
        query: snapQuery,
      })
    )
  },
}

export const mutations = {
  setState(state, data) {
    Object.entries(data).forEach(([key, val]) => {
      state[key] = val
    })
  },
}
