const OPTION_KEY = 'auth'
const GUEST_VALUE = 'guest'

export default function authMiddleware(ctx) {
  // Disable middleware if options: { auth: false } is set on the route
  if (checkRouteOption(ctx.route, OPTION_KEY, false)) {
    return
  }

  // Disable middleware if no route was matched to allow 404/error page
  const matches = []
  const Components = getMatchedComponents(ctx.route, matches)
  if (!Components.length) {
    return
  }

  const guestOnly = checkRouteOption(ctx.route, OPTION_KEY, GUEST_VALUE)

  if (ctx.$auth.isAuthenticated) {
    if (guestOnly) {
      ctx.redirect('/')
    }
  } else if (!guestOnly) {
    ctx.redirect('/login')
  }
}

function checkRouteOption(route, key, value) {
  return route.matched.some((m) => {
    if (process.client) {
      return Object.values(m.components).some(
        (component) => component.options && component.options[key] === value
      )
    } else {
      return Object.values(m.components).some((component) =>
        Object.values(component._Ctor).some(
          (ctor) => ctor.options && ctor.options[key] === value
        )
      )
    }
  })
}

function getMatchedComponents(route, matches = []) {
  return [].concat.apply(
    [],
    route.matched.map(function (m, index) {
      return Object.keys(m.components).map(function (key) {
        matches.push(index)
        return m.components[key]
      })
    })
  )
}
