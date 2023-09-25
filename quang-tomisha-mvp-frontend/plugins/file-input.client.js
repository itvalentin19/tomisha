import Vue from 'vue'

Vue.prototype.$fileInput = (opts = {}) => {
  const { multiple = false, accept = 'image/jpeg, image/png', max = 50 } = opts

  const $input = _getOrCreateInputFileElement()

  $input.setAttribute('accept', accept)

  if (multiple) {
    $input.setAttribute('multiple', 'multiple')
  } else {
    $input.removeAttribute('multiple')
  }

  return new Promise((resolve, reject) => {
    $input.onchange = function (event) {
      const files = Array.from(event.target.files)
      event.target.value = null
      if (_validateFileSize(files, max)) {
        resolve(multiple ? files : files[0])
      }
    }

    $input.click()
  })
}

function _getOrCreateInputFileElement() {
  let input = document.querySelector('#file-input-plugin')
  if (!input) {
    const app = document.querySelector('body')
    input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('id', 'file-input-plugin')
    input.style.display = 'none'
    app.appendChild(input)
  }
  return input
}

function _validateFileSize(files, max) {
  const maxMb = max * 1024 * 1024
  if (files && files.length && files.some((file) => file.size > maxMb)) {
    throw new Error('File exceed maximum size')
  }

  return true
}
