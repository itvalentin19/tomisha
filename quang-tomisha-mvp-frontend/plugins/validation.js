const rules = {
  required: (v) => {
    let valid = true
    if (Array.isArray(v)) {
      valid = !!v.length
    } else if (typeof v === 'number') {
      valid = v === 0 || !!v
    } else {
      valid = !!v
    }
    return valid
  },
  maxLength: (length) => (v) =>
    (v && v.length <= length) || !v || `Maximal ${length} Zeichen`,
  minLength: (length) => (v) =>
    (v && v.length >= length) || !v || `Mindestens ${length} Zeichen`,
  max: (number) => (v) => v <= number,
  min: (number) => (v) => v >= number,
  email: (v) =>
    (v &&
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        v.trim()
      )) ||
    !v,
  url: (v) =>
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
      v
    ) || !v,
  alphabet: (v) =>
    !v ||
    /^[a-z ẮẰẲẴẶĂẤẦẨẪẬÂÁÀÃẢẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒÕỎỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴ]+$/gi.test(
      v.trim()
    ),
  normal: (v) =>
    !v ||
    /^[a-z0-9 ._ẮẰẲẴẶĂẤẦẨẪẬÂÁÀÃẢẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒÕỎỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴ]+$/gi.test(
      v.trim()
    ),
  phone: (v) =>
    !v ||
    (v.length >= 10 && /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/gi.test(v)),
  equal: (target, msg) => (v) =>
    !v || target === v || msg || `Must be ${target}`,
  nospace: (v) => {
    return !v || !/ /.test(v.trim())
  },
}

export default function (ctx, inject) {
  inject('rules', rules)
}
