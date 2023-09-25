export const state = () => ({
  jobs: [],
  total: 0,
  query: {},
})

export const actions = {
  findJobs({ commit, state }, { skip, ...query } = {}) {
    const params = this.$utils.filterObject({
      ...this.$utils.extract(this.$router.currentRoute.query, [
        'professionId',
        'companyId',
        'branchIds',
        'title',
        'city',
        'country',
        'location',
        'lng',
        'lat',
        'km',
        'minWorkload',
        'maxWorkload',
        'professionId',
        'minSize',
        'maxSize',
        'relationships',
        'asc',
      ]),
      ...query,
    })

    const snapQuery = { ...params }

    const isModified = this.$utils.isModified(state.query, snapQuery)
    if (!isModified && typeof skip === 'number' && skip < state.jobs.length) {
      return { jobs: state.jobs, total: state.total, query: state.query }
    }

    params.take = 10
    params.skip = isModified ? 0 : skip || state.jobs.length

    if (params.location) {
      params.lng = params.location.lng
      params.lat = params.location.lat
    }

    delete params.location

    if (!params.skip) {
      commit('setState', {
        jobs: [],
        total: 0,
        query: {},
      })
    }

    return this.$axios.get('/job', { params }).then(({ items, total }) => {
      commit('setState', {
        jobs: isModified ? items : [...state.jobs, ...items],
        total,
        query: snapQuery,
      })

      return { jobs: items, total, query }
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
