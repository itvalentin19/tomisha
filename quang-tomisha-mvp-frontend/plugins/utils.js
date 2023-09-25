const DISABLED_SCROLL_CLASS = 'overflow-hidden'
const state = {
  docScrollTop: 0,
}

export default function (ctx, inject) {
  const utils = {
    origin: process.client
      ? location.origin
      : 'https://' + ctx.req.headers.host,

    isModified,

    isEmpty,

    clone,

    copy,

    createDebounce,

    debounce: createDebounce(),

    createThrottle,

    throttle: createThrottle(),

    decodeJwt,

    except,

    extract,

    filterObject,

    flatten,

    freezePageScroll,

    getAddressStreet,

    getJwtExpiry,

    kmToMiles,

    mutateArrayItem,

    parseJSON,

    share,

    toggleArrayItem,
  }

  // INJECT
  inject('utils', utils)

  // Copy a text to clipboard taking advantage of textarea element
  // We're not using clipboard API because it is unreliable at the moment
  // https://stackoverflow.com/questions/37308210/copy-current-url-button-javascript
  function copy(text) {
    if (!process.client) {
      return
    }

    const textArea = document.createElement('textarea')

    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a flash,
    // so some of these are just precautions. However in IE the element
    // is visible whilst the popup box asking the user for permission for
    // the web page to copy to the clipboard.
    //

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed'
    textArea.style.top = 0
    textArea.style.left = 0

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em'
    textArea.style.height = '2em'

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0

    // Clean up any borders.
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent'

    textArea.value = text

    document.body.appendChild(textArea)

    textArea.select()

    try {
      document.execCommand('copy')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Copy error', err)
      return false
    }

    document.body.removeChild(textArea)

    ctx.$alert.success('Copied')

    return true
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
   * @param {Object} payload {
   *   url: A USVString representing a URL to be shared.
   *   text: A USVString representing text to be shared.
   *   title: A USVString representing the title to be shared.
   *   files: A "FrozenArray" representing the array of files to be shared.
   * }
   * @returns {Promise}
   */
  function share(payload) {
    if (!process.client || (!payload?.text && !payload?.url)) {
      return
    }

    if (!navigator.share) {
      return copy(payload.text || payload.url)
    }

    return navigator.share(payload)
  }
}

function toggleArrayItem(items, item, idKey, removable = true) {
  const val = idKey ? item[idKey] : item
  const i = idKey
    ? items.findIndex((x) => x[idKey] === val)
    : items.indexOf(item)
  if (i === -1) {
    items.push(item)
  } else if (removable) {
    items.splice(i, 1)
  } else {
    items.splice(i, 1, item)
  }
  return items
}

function mutateArrayItem(items, item, idKey) {
  return toggleArrayItem(items, item, idKey, false)
}

function getAddressStreet(addr) {
  if (!addr) {
    return ''
  }
  const components = parseJSON(addr?.components)
  return [components?.route?.long, components?.street_number?.long]
    .filter(Boolean)
    .join(' ')
}

function parseJSON(jsonStr) {
  try {
    return JSON.parse(jsonStr)
  } catch (_) {
    return null
  }
}

function getJwtExpiry(jwt) {
  const payload = decodeJwt(jwt)
  return payload?.exp
}

function decodeJwt(jwt) {
  if (!jwt) {
    return null
  }

  try {
    const jwtPayloadStr = jwt.split('.')[1]
    return JSON.parse(
      process.server
        ? Buffer.from(jwtPayloadStr, 'base64')
        : atob(jwtPayloadStr)
    )
  } catch (e) {
    return null
  }
}

/**
 * Deep clone an object by specified properties
 * @param {Object} source Source object
 * @param {Object|Array} props Cloning properties
 *
 * Support 3 types of props:
 *  - ['_id', 'name']
 *  - [{from: 'name', to: 'name', default: 'Mike', transform: v => v && v.toLowerCase()}]
 *  - {name: DEFAULT_NAME, age: DEFAULT_AGE}
 */
function extract(source = {}, props = {}, opts = {}) {
  const obj = source || {}
  const extractedObj = {}

  if (Array.isArray(props)) {
    props.forEach((prop) => {
      const from = prop.from || prop
      const to = prop.to || from

      if (from in obj && (!opts.ignoreNull || isNotNull(obj[from]))) {
        extractedObj[to] =
          typeof prop.transform === 'function'
            ? prop.transform(obj[from])
            : obj[from]
      } else if (typeof prop !== 'string' && 'default' in prop) {
        extractedObj[to] = prop.default
      }
    })
  } else {
    for (const key of Object.keys(props)) {
      if (key in obj) {
        extractedObj[key] = obj[key]
      } else if (props[key] !== undefined) {
        extractedObj[key] = props[key]
      }
    }
  }

  return clone(extractedObj)
}

function isNotNull(val) {
  return !(!val && typeof val === 'object')
}

/**
 * Shallow clone an object with all of its properties except for the given properties in props paramater
 * @param {Object} source Source object
 * @param {Array|String} props excepted properties
 */
function except(source = {}, props = []) {
  const output = { ...source }
  const exceptedProps = [].concat(props)
  exceptedProps.forEach((prop) => {
    delete output[prop]
  })
  return output
}

/**
 * Deep clone an object
 * @param {*} source Source object, or could be of any type
 */
function clone(source) {
  if (!source || typeof source !== 'object' || source instanceof Date) {
    return source
  }

  const target = Array.isArray(source) ? [] : {}
  _deepClone(source, target)

  return target
}

function _deepClone(source, target) {
  for (const key of Object.keys(source)) {
    if (
      !source[key] ||
      source[key] instanceof Date ||
      typeof source[key] !== 'object'
    ) {
      target[key] = source[key]
    } else {
      target[key] = Array.isArray(source[key]) ? [] : {}
      _deepClone(source[key], target[key])
    }
  }
}

function flatten(arr = []) {
  return Array.prototype.concat.apply([], arr)
}

function filterObject(obj = {}, filter = Boolean) {
  const output = {}
  for (const key in obj) {
    if (filter(obj[key], key)) {
      output[key] = obj[key]
    }
  }
  return output
}

export function createDebounce(defaultCallback, defaultDuration = 300) {
  let timeout = null
  let promise = null
  let done = null

  return (cb, duration) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    promise =
      promise ||
      new Promise((resolve, reject) => {
        done = resolve
      })

    timeout = setTimeout(
      async () => {
        if (typeof cb === 'function') {
          await cb()
        } else if (typeof defaultCallback === 'function') {
          await defaultCallback()
        }

        done?.()

        timeout = promise = done = null
      },
      typeof duration === 'number' ? duration : defaultDuration
    )

    return promise
  }
}

export function createThrottle() {
  let timeout = null
  let func = null

  return (cb, delay) => {
    func = cb
    if (!timeout) {
      timeout = setTimeout(() => {
        typeof func === 'function' && func()
        timeout = null
      }, delay)
    }
  }
}

function isModified(src, tar) {
  if (typeof src !== typeof tar) {
    return true
  }

  const srcEmpty = isEmpty(src)
  const tarEmpty = isEmpty(tar)
  if (srcEmpty !== tarEmpty) {
    return true
  }

  if (srcEmpty && tarEmpty) {
    return false
  }

  if (typeof src !== 'object') {
    return src !== tar
  }

  if (src instanceof Date || tar instanceof Date) {
    return src?.valueOf?.() !== new Date(tar)?.valueOf?.()
  }

  const keys = new Set(Object.keys(src).concat(Object.keys(tar)))
  for (const key of keys) {
    if (isModified(src[key], tar[key])) {
      return true
    }
  }

  return false
}

function isEmpty(val) {
  return Array.isArray(val)
    ? !val.length || !val[0]
    : !val && typeof val !== 'boolean' && typeof val !== 'number'
}

function freezePageScroll(freezed = true) {
  if (process.client) {
    if (freezed) {
      document.documentElement.classList.add(DISABLED_SCROLL_CLASS)
      state.docScrollTop = document.documentElement.scrollTop
    } else {
      document.documentElement.classList.remove(DISABLED_SCROLL_CLASS)
      document.documentElement.scrollTop =
        state.docScrollTop || document.documentElement.scrollTop
    }
  }
}

function kmToMiles(km) {
  return km * 0.621371
}
