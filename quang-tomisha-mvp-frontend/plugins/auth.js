import Vue from 'vue'
const Cookie = process.client ? require('js-cookie') : require('cookie')

const isProd = process.env.NODE_ENV === 'production'
const AUTH_COOKIE_KEY = 'auth'

export default async (ctx, inject) => {
  const defaultLoginOpts = {
    persist: true,
  }

  const auth = Vue.observable({
    isAuthenticated: false,
    token: null,
    // {
    //   id,
    //   slug,
    //   status,
    //   firstName,
    //   lastName,
    //   picture,
    //   progress,
    //   employments: [{ id, role, companyId, company: { subscriptions: [], headquater: { id, slug, name, picture, cover, address: { zip, city } } } }],
    //   occupations: [{ id, professionId }],
    // }
    user: null,
    companyId: null,
    company: null,
    employment: null,
    activePlan: null,
    remainingJobs: 0,

    async login(payload, opts) {
      if (!payload.token) {
        return
      }

      const fullOpts = { ...defaultLoginOpts, ...opts }

      ctx.$axios.setToken(payload.token, 'Bearer')

      Object.assign(
        auth,
        { isAuthenticated: true },
        ctx.$utils.extract(payload, ['token', 'companyId'])
      )

      if (process.client) {
        const me = ctx.store.state.me.me || (await ctx.$axios.get('/me/brief'))
        ctx.store.commit('me/setState', { me: null })
        if (!me) {
          return auth.logout()
        }

        auth.updateUser(me)

        console.log(auth.user.email, auth)
      }

      fullOpts?.persist && persitState()
    },

    logout() {
      Object.assign(auth, {
        isAuthenticated: false,
        user: null,
        token: null,
        companyId: null,
        company: null,
        employment: null,
        activePlan: null,
        remainingJobs: 0,
      })

      if (process.client) {
        Cookie.remove(AUTH_COOKIE_KEY)
      } else {
        ctx.res.setHeader('Set-Cookie', [
          `${AUTH_COOKIE_KEY}=; expires=${new Date().toUTCString()}`,
        ])
      }

      auth._activePlanTimeout && clearTimeout(auth._activePlanTimeout)

      ctx.store.commit('me/setState', { me: null })

      ctx.app.router.push('/login')

      ctx.$axios.setToken(false)
    },

    updateUser(payload) {
      const oldEmployments = auth.user?.employments

      Object.assign(auth, { user: { ...auth.user, ...payload } })

      if (oldEmployments === auth.user.employments) {
        return
      }

      if (auth.companyId) {
        const employment = auth.user.employments?.find?.(
          (em) => em.companyId === auth.companyId
        )
        setActiveEmployment(employment)
        if (!auth.employment) {
          persitState()
        }
      }
    },

    setCompany(companyId, force = false) {
      if (companyId === auth.companyId || (!companyId && !auth.companyId)) {
        return true
      }

      const employment =
        companyId &&
        auth.user.employments?.find?.((em) => em.companyId === companyId)

      if (force && !employment) {
        return false
      }

      setActiveEmployment(employment)
      persitState()

      return true
    },
  })

  // Init auth state
  const payload = process.client
    ? ctx.$utils.parseJSON(Cookie.get(AUTH_COOKIE_KEY))
    : ctx.$utils.parseJSON(Cookie.parse(ctx.req.headers.cookie || '')?.auth)

  if (payload?.token) {
    await auth.login(payload, { persist: false })
  }

  // Logout on Unauthorized axios request
  ctx.$axios.onResponseError((error) => {
    if (
      auth.isAuthenticated &&
      error.response &&
      error.response.status === 401
    ) {
      console.log(123)
      auth.logout()
    }
  })

  function setActiveEmployment(employment = null) {
    const { company = null, companyId = null } = employment || {}
    const activePlan =
      company?.subscriptions?.find?.(
        (sub) => sub.planId && ctx.$dayjs(sub.endAt).isAfter(ctx.$dayjs())
      ) || null
    Object.assign(auth, {
      employment,
      company,
      companyId,
      activePlan,
      remainingJobs: company?.subscriptions?.reduce?.(
        (sum, sub) => sum + (sub.remainingJobs || 0),
        0
      ),
    })

    auth._activePlanTimeout && clearTimeout(auth._activePlanTimeout)

    if (process.client && activePlan) {
      const exp = new Date(activePlan.endAt).valueOf() - new Date().valueOf()
      if (exp < 6 * 60 * 60 * 1000) {
        auth._activePlanTimeout = setTimeout(() => {
          auth.activePlan = null
          auth._activePlanTimeout = null
        }, exp + 100)
      }
    }
  }

  function persitState() {
    if (!auth.isAuthenticated) return
    const exp = ctx.$utils.getJwtExpiry(auth.token) * 1000
    const cookiePayload = JSON.stringify({
      token: auth.token,
      companyId: auth.companyId,
    })
    if (process.client) {
      Cookie.set(AUTH_COOKIE_KEY, cookiePayload, {
        expires: new Date(exp),
        sameSite: false,
        secure: isProd,
      })
    } else {
      ctx.res.setHeader('Set-Cookie', [
        `${AUTH_COOKIE_KEY}=${cookiePayload}; path=/; SameSite=None; expires=${new Date(
          exp
        ).toUTCString()}`,
      ])
    }
  }

  inject('auth', auth)
}
